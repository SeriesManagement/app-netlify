import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Paper, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { toast } from 'react-toastify';

export default function UpdateSerieForm({ onSuccess, onCancel }) {
  const [ongoingSeries, setOngoingSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState('');
  const [updateType, setUpdateType] = useState('episode');
  const [season, setSeason] = useState('');
  const [episode, setEpisode] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchOngoingSeries();
  }, []);

  const fetchOngoingSeries = async () => {
    setFetchingData(true);
    try {
      const response = await fetch('/api/series/ongoing');
      const data = await response.json();
      setOngoingSeries(data);
    } catch (error) {
      toast.error('Failed to load ongoing series');
      console.error(error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleSelectedSerieChange = (e) => {
    const index = e.target.value;
    setSelectedSerie(index);
    
    if (index !== '') {
      const serie = ongoingSeries[index];
      
      // Set default values based on current update type
      if (updateType === 'season') {
        setSeason((serie.season + 1).toString());
      } else if (updateType === 'episode') {
        setEpisode((serie.episode + 1).toString());
      } else if (updateType === 'both') {
        setSeason((serie.season + 1).toString());
        setEpisode('1');
      }
    }
    
    if (errors.selectedSerie) {
      setErrors({ ...errors, selectedSerie: '' });
    }
  };

  const handleUpdateTypeChange = (e) => {
    const newUpdateType = e.target.value;
    setUpdateType(newUpdateType);
    
    if (selectedSerie !== '') {
      const serie = ongoingSeries[selectedSerie];
      
      if (newUpdateType === 'season') {
        setSeason((serie.season + 1).toString());
      } else if (newUpdateType === 'episode') {
        setEpisode((serie.episode + 1).toString());
      } else if (newUpdateType === 'both') {
        setSeason((serie.season + 1).toString());
        setEpisode('1');
      }
    }
  };

  const handleSeasonChange = (e) => {
    setSeason(e.target.value);
    if (errors.season) {
      setErrors({ ...errors, season: '' });
    }
  };

  const handleEpisodeChange = (e) => {
    setEpisode(e.target.value);
    if (errors.episode) {
      setErrors({ ...errors, episode: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (selectedSerie === '') {
      newErrors.selectedSerie = 'Please select a series';
    }
    
    if (updateType === 'season' || updateType === 'both') {
      if (!season) {
        newErrors.season = 'Season is required';
      }
    }
    
    if (updateType === 'episode' || updateType === 'both') {
      if (!episode) {
        newErrors.episode = 'Episode is required';
      }
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
      const serie = ongoingSeries[selectedSerie];
      const payload = {
        name: serie.name,
        updateType,
        ...(updateType === 'season' || updateType === 'both' ? { season: parseInt(season) } : {}),
        ...(updateType === 'episode' || updateType === 'both' ? { episode: parseInt(episode) } : {})
      };
      
      const response = await fetch('/api/series/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Series ${serie.name} updated successfully!`);
        onSuccess();
      } else {
        toast.error(data.message || 'Failed to update series');
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
        Update Series
      </Typography>
      
      {fetchingData ? (
        <Typography>Loading series data...</Typography>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FormControl fullWidth margin="normal" error={!!errors.selectedSerie}>
            <InputLabel>Select Series</InputLabel>
            <Select
              value={selectedSerie}
              onChange={handleSelectedSerieChange}
              label="Select Series"
              disabled={loading}
            >
              {ongoingSeries.map((serie, index) => (
                <MenuItem key={index} value={index}>
                  {serie.name} (S{serie.season}E{serie.episode})
                </MenuItem>
              ))}
            </Select>
            {errors.selectedSerie && (
              <FormHelperText>{errors.selectedSerie}</FormHelperText>
            )}
          </FormControl>
          
          {selectedSerie !== '' && (
            <>
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <Typography variant="subtitle1">What do you want to update?</Typography>
                <RadioGroup
                  value={updateType}
                  onChange={handleUpdateTypeChange}
                >
                  <FormControlLabel value="season" control={<Radio />} label="Season" />
                  <FormControlLabel value="episode" control={<Radio />} label="Episode" />
                  <FormControlLabel value="both" control={<Radio />} label="Both" />
                </RadioGroup>
              </FormControl>
              
              {(updateType === 'season' || updateType === 'both') && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="New Season"
                  type="number"
                  value={season}
                  onChange={handleSeasonChange}
                  error={!!errors.season}
                  helperText={errors.season}
                  disabled={loading}
                />
              )}
              
              {(updateType === 'episode' || updateType === 'both') && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="New Episode"
                  type="number"
                  value={episode}
                  onChange={handleEpisodeChange}
                  error={!!errors.episode}
                  helperText={errors.episode}
                  disabled={loading}
                />
              )}
              
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
                  color="primary"
                  disabled={loading}
                >
                  Update Series
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
}
