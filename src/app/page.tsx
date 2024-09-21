'use client'

import React, { useState, Suspense } from 'react'
import { Container, Typography, Button, Box, Paper, Grid, CircularProgress } from '@mui/material'
import { styled } from '@mui/system'
import dynamic from 'next/dynamic'
import { CameraAlt, Face, School } from '@mui/icons-material'

const FaceCapture = dynamic(() => import('../components/FaceCapture'), { ssr: false })
const FaceRecognition = dynamic(() => import('../components/FaceRecognition'), { ssr: false })
const TrainModel = dynamic(() => import('../components/TrainModel'), { ssr: false })

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
}))

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 3),
  borderRadius: '25px',
  textTransform: 'none',
  fontWeight: 'bold',
}))

export default function Home() {
  const [mode, setMode] = useState<'capture' | 'recognize' | 'train' | null>(null)

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" color="primary">
          Face Recognition App
        </Typography>
        
        <StyledPaper elevation={3}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={() => setMode('capture')}
                startIcon={<CameraAlt />}
                fullWidth
              >
                Capture Face
              </StyledButton>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledButton
                variant="contained"
                color="secondary"
                onClick={() => setMode('recognize')}
                startIcon={<Face />}
                fullWidth
              >
                Recognize Face
              </StyledButton>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledButton
                variant="contained"
                color="warning"
                onClick={() => setMode('train')}
                startIcon={<School />}
                fullWidth
              >
                Train Model
              </StyledButton>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Suspense fallback={<CircularProgress />}>
              {mode === 'capture' && <FaceCapture />}
              {mode === 'recognize' && <FaceRecognition />}
              {mode === 'train' && <TrainModel />}
            </Suspense>
          </Box>
        </StyledPaper>
      </Box>
    </Container>
  )
}