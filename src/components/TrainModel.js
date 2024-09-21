'use client';

import React, { useState } from 'react'
import { Button, Box, Typography } from '@mui/material'

export default function TrainModel() {
  const [message, setMessage] = useState('')

  const trainModel = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/train', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      console.error("Error training model", err);
      setMessage('Error training model: ' + err.message);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Button variant="contained" color="warning" onClick={trainModel}>
        Train Model
      </Button>
      {message && <Typography color="success">{message}</Typography>}
    </Box>
  )
}