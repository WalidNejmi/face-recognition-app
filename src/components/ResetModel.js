import React, { useState } from 'react'
import { Button, Typography, Box } from '@mui/material'
import axios from 'axios'

const ResetModel = () => {
  const [isResetting, setIsResetting] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)

  const handleReset = async () => {
    setIsResetting(true)
    try {
      const response = await axios.post('http://127.0.0.1:5000/reset')
      if (response.data.message) {
        setResetComplete(true)
      } else {
        throw new Error('Reset failed')
      }
    } catch (error) {
      console.error('Error resetting model:', error)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Reset Model
      </Typography>
      <Typography variant="body1" paragraph>
        Warning: This will clear all face data and reset the model. This action cannot be undone.
      </Typography>
      <Button
        variant="contained"
        color="error"
        onClick={handleReset}
        disabled={isResetting || resetComplete}
      >
        {isResetting ? 'Resetting...' : resetComplete ? 'Reset Complete' : 'Confirm Reset'}
      </Button>
      {resetComplete && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          The model has been reset successfully. You can now start adding new face data.
        </Typography>
      )}
    </Box>
  )
}

export default ResetModel