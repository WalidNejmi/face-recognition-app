'use client';

import React, { useState, useRef } from 'react'
import { Button, Box, Typography } from '@mui/material'

export default function FaceRecognition() {
  const videoRef = useRef(null)
  const [result, setResult] = useState('')

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing the camera", err)
    }
  }

  const recognizeFace = async () => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    const imageData = canvas.toDataURL('image/jpeg')

    try {
      const response = await fetch('http://127.0.0.1:5000/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      })
      const data = await response.json()
      if (data.name === "No face detected") {
        setResult("No face detected in the image")
      } else if (data.name === "Unknown") {
        setResult("Unknown face detected")
      } else {
        setResult(`Recognized: ${data.name} (Confidence: ${data.confidence}%)`)
      }
    } catch (err) {
      console.error("Error recognizing face", err)
      setResult('Error recognizing face')
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box>
        <Button variant="contained" onClick={startCamera} sx={{ mr: 2 }}>
          Start Camera
        </Button>
        <Button variant="contained" color="success" onClick={recognizeFace}>
          Recognize Face
        </Button>
      </Box>
      <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '500px' }} />
      {result && <Typography color="success">{result}</Typography>}
    </Box>
  )
}