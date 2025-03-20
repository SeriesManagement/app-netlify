import { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LockIcon from '@mui/icons-material/Lock';
import SeriesList from '../components/SeriesList';
import AddSerieForm from '../components/AddSerieForm';
import UpdateSerieForm from '../components/UpdateSerieForm';
import DeleteSerieForm from '../components/DeleteSerieForm';
import OtpVerification from '../components/OtpVerification';

export default function Home() {
  const [view, setView] = useState('menu');
  const [finishedSeries, setFinishedSeries] = useState([]);
  const [ongoingSeries, setOngoingSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  useEffect(() => {
    // Initial load effect if needed
  }, []);

  const fetchFinishedSeries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/series/finished');
      const data = await response.json();
      setFinishedSeries(data);
      setView('listFinished');
    } catch (error) {
      toast.error('Failed to load finished series');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOngoingSeries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/series/ongoing');
      const data = await response.json();
      setOngoingSeries(data);
      setView('listOngoing');
    } catch (error) {
      toast.error('Failed to load ongoing series');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  const handleAddFinishedSerie = async (data) => {
    setView('menu');
  };

  const handleAddOngoingSerie = async (data) => {
    setView('menu');
  };

  const handleUpdateSerie = async () => {
    setView('menu');
  };

  const handleDeleteSerie = async () => {
    setView('menu');
  };
  
  const handleOtpVerify = async () => {
    setIsAuthenticated(true);
    setShowOtpVerification(false);
    toast.success('Authentication successful!');
  };
  
  const handleOtpCancel = () => {
    setShowOtpVerification(false);
  };
  
  const handleManageSeriesAction = (action) => {
    if (isAuthenticated) {
      setView(action);
    } else {
      setShowOtpVerification(true);
    }
  };

  const renderView = () => {
    switch (view) {
      case 'listFinished':
        return <SeriesList series={finishedSeries} type="finished" onBack={() => setView('menu')} />;
      case 'listOngoing':
        return <SeriesList series={ongoingSeries} type="ongoing" onBack={() => setView('menu')} />;
      case 'addFinished':
        return <AddSerieForm type="finished" onSuccess={handleAddFinishedSerie} onCancel={() => setView('menu')} />;
      case 'addOngoing':
        return <AddSerieForm type="ongoing" onSuccess={handleAddOngoingSerie} onCancel={() => setView('menu')} />;
      case 'update':
        return <UpdateSerieForm onSuccess={handleUpdateSerie} onCancel={() => setView('menu')} />;
      case 'delete':
        return <DeleteSerieForm onSuccess={handleDeleteSerie} onCancel={() => setView('menu')} />;
      default:
        return (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              <Grid item xs={12} md={5}>
                <Paper 
                  elevation={4} 
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    borderRadius: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 8
                    }
                  }}
                >
                  <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3, fontWeight: 'bold', fontSize: '1.4rem' }}>View Series</Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ 
                      mb: 3,
                      py: 1.5,
                      borderRadius: 2
                    }} 
                    onClick={fetchFinishedSeries}
                  >
                    List Finished Series
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ 
                      py: 1.5,
                      borderRadius: 2
                    }}
                    onClick={fetchOngoingSeries}
                  >
                    List Ongoing Series
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ position: 'relative', height: '100%' }}>
                  <Paper 
                    elevation={4} 
                    sx={{ 
                      p: 4, 
                      height: '100%',
                      borderRadius: 2,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      filter: isAuthenticated ? 'none' : 'blur(5px)',
                      pointerEvents: isAuthenticated ? 'auto' : 'none',
                      '&:hover': {
                        transform: isAuthenticated ? 'translateY(-5px)' : 'none',
                        boxShadow: isAuthenticated ? 8 : 4
                      }
                    }}
                  >
                    <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3, fontWeight: 'bold', fontSize: '1.4rem' }}>Manage Series</Typography>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      fullWidth 
                      sx={{ 
                        mb: 3, 
                        py: 1.5,
                        borderRadius: 2
                      }} 
                      onClick={() => handleManageSeriesAction('addFinished')}
                    >
                      Add Finished Serie
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      fullWidth 
                      sx={{ 
                        mb: 3, 
                        py: 1.5,
                        borderRadius: 2
                      }} 
                      onClick={() => handleManageSeriesAction('addOngoing')}
                    >
                      Add Ongoing Serie
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      fullWidth 
                      sx={{ 
                        mb: 3, 
                        py: 1.5,
                        borderRadius: 2
                      }} 
                      onClick={() => handleManageSeriesAction('update')}
                    >
                      Update Serie's Episode
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      fullWidth 
                      sx={{ 
                        py: 1.5,
                        borderRadius: 2,
                        bgcolor: '#990000',
                        '&:hover': {
                          bgcolor: '#660000'
                        }
                      }}
                      onClick={() => handleManageSeriesAction('delete')}
                    >
                      Delete a Serie
                    </Button>
                  </Paper>
                  
                  {!isAuthenticated && (
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
                        cursor: 'pointer',
                      }}
                      onClick={() => setShowOtpVerification(true)}
                    >
                      <Paper
                        elevation={6}
                        sx={{
                          p: 3,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          width: '80%'
                        }}
                      >
                        <LockIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          Authentication Required
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                          Click to enter OTP code
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Box>
              </Grid>

            </Grid>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff0062 30%, #ff458b 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            letterSpacing: '0.05em',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            mb: 3,
            fontSize: '3.5rem'
          }}
        >
          Series Management
        </Typography>
        {loading && <Typography>Loading...</Typography>}
        {renderView()}
        {showOtpVerification && (
          <OtpVerification 
            onVerify={handleOtpVerify} 
            onCancel={handleOtpCancel} 
          />
        )}
      </Box>
      <ToastContainer position="bottom-right" />
    </Container>
  );
}
