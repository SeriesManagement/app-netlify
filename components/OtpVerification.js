import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, InputAdornment } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

export default function OtpVerification({ onVerify, onCancel }) {
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpCode })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onVerify();
      } else {
        setError(data.message || 'Invalid OTP code');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3
          }}
        >
          <LockIcon
            sx={{
              fontSize: 60,
              color: 'primary.main',
              mb: 2
            }}
          />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Authentication Required
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Enter the 6-digit code from your authenticator app
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="OTP Code"
            variant="outlined"
            value={otpCode}
            onChange={(e) => {
              setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
              if (error) setError('');
            }}
            error={!!error}
            helperText={error}
            disabled={loading}
            sx={{ mb: 3 }}
            inputProps={{
              maxLength: 6,
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={otpCode.length !== 6 || loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
