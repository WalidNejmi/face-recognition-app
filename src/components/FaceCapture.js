'use client';

import React, { useState, useRef } from 'react'
import { Button, TextField, Box, Alert } from '@mui/material'

export default function FaceCapture() {
  const [name, setName] = useState('')
  const videoRef = useRef(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing the camera", err)
      setError("Error accessing the camera. Please make sure your camera is connected and you've granted permission to use it.")
    }
  }

  const captureFace = async () => {
    if (!videoRef.current) {
      setError("Camera is not started. Please start the camera first.")
      return
    }
    if (!name.trim()) {
      setError("Please enter a name before capturing the face.")
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    const imageData = canvas.toDataURL('image/jpeg')

    try {
      const response = await fetch('http://127.0.0.1:5000/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), image: imageData })
      })
      const data = await response.json()
      setMessage(data.message)
      setError('')
    } catch (err) {
      console.error("Error capturing face", err)
      setError('Error capturing face: ' + err.message)
      setMessage('')
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%', maxWidth: '500px' }}>
      <TextField 
        label="Enter Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        variant="outlined"
        fullWidth
        helperText="Please enter a name before capturing the face"
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Button variant="contained" onClick={startCamera}>
          Start Camera
        </Button>
        <Button 
          variant="contained" 
          color="success" 
          onClick={captureFace}
          disabled={!name.trim()}
        >
          Capture Face
        </Button>
      </Box>
      <video ref={videoRef} autoPlay style={{ width: '100%' }} />
      {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ width: '100%' }}>{message}</Alert>}
    </Box>
  )
}