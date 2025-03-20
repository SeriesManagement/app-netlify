import { useState, useEffect } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Paper, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { toast } from 'react-toastify';

export default function DeleteSerieForm({ onSuccess, onCancel }) {
  const [serieType, setSerieType] = useState('ongoing');
  const [finishedSeries, setFinishedSeries] = useState([]);
  const [ongoingSeries, setOngoingSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    setFetchingData(true);
    try {
      // Fetch both types of series in parallel
      const [finishedResponse, ongoingResponse] = await Promise.all([
        fetch('/api/series/finished'),
        fetch('/api/series/ongoing')
      ]);
      
      const finishedData = await finishedResponse.json();
      const ongoingData = await ongoingResponse.json();
      
      setFinishedSeries(finishedData);
      setOngoingSeries(ongoingData);
    } catch (error) {
      toast.error('Failed to load series data');
      console.error(error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleSerieTypeChange = (e) => {
    setSerieType(e.target.value);
    setSelectedSerie('');
    if (errors.selectedSerie) {
      setErrors({ ...errors, selectedSerie: '' });
    }
  };

  const handleSelectedSerieChange = (e) => {
    setSelectedSerie(e.target.value);
    if (errors.selectedSerie) {
      setErrors({ ...errors, selectedSerie: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (selectedSerie === '') {
      newErrors.selectedSerie = 'Please select a series';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const seriesToDelete = serieType === 'finished' 
        ? finishedSeries[selectedSerie].name 
        : ongoingSeries[selectedSerie].name;
      
      const response = await fetch('/api/series/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: seriesToDelete })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Series ${seriesToDelete} deleted successfully!`);
        onSuccess();
      } else {
        toast.error(data.message || 'Failed to delete series');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: 'primary.main',
        fontSize: '2rem',
        textShadow: '1px 1px 3px rgba(255,0,98,0.3)',
        mb: 2
      }}>
        Delete Series
      </Typography>
      
      {fetchingData ? (
        <Typography>Loading series data...</Typography>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Select series type:</Typography>
            <RadioGroup
              value={serieType}
              onChange={handleSerieTypeChange}
              row
            >
              <FormControlLabel value="finished" control={<Radio />} label="Finished Series" />
              <FormControlLabel value="ongoing" control={<Radio />} label="Ongoing Series" />
            </RadioGroup>
          </FormControl>
          
          <FormControl fullWidth margin="normal" error={!!errors.selectedSerie}>
            <InputLabel>Select Series</InputLabel>
            <Select
              value={selectedSerie}
              onChange={handleSelectedSerieChange}
              label="Select Series"
              disabled={loading}
            >
              {serieType === 'finished' ? (
                finishedSeries.length > 0 ? (
                  finishedSeries.map((serie, index) => (
                    <MenuItem key={index} value={index}>
                      {serie.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No finished series found</MenuItem>
                )
              ) : (
                ongoingSeries.length > 0 ? (
                  ongoingSeries.map((serie, index) => (
                    <MenuItem key={index} value={index}>
                      {serie.name} (S{serie.season}E{serie.episode})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No ongoing series found</MenuItem>
                )
              )}
            </Select>
            {errors.selectedSerie && (
              <FormHelperText>{errors.selectedSerie}</FormHelperText>
            )}
          </FormControl>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
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
              color="error"
              disabled={loading}
              sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
            >
              Delete Series
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
