import { useState } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Paper, FormControlLabel, Checkbox } from '@mui/material';
import { toast } from 'react-toastify';

export default function AddSerieForm({ type, onSuccess, onCancel }) {
  const [name, setName] = useState('');
  const [season, setSeason] = useState('');
  const [episode, setEpisode] = useState('');
  const [isFromOngoing, setIsFromOngoing] = useState(false);
  const [ongoingSeries, setOngoingSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [errors, setErrors] = useState({});

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors({ ...errors, name: '' });
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

  const handleIsFromOngoingChange = async (e) => {
    const checked = e.target.checked;
    setIsFromOngoing(checked);
    
    if (checked) {
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
    
    if (type === 'finished') {
      if (isFromOngoing) {
        if (selectedSerie === '') {
          newErrors.selectedSerie = 'Please select a series';
        }
      } else {
        if (!name.trim()) {
          newErrors.name = 'Series name is required';
        }
      }
    } else { // ongoing
      if (!name.trim()) {
        newErrors.name = 'Series name is required';
      }
      if (!season) {
        newErrors.season = 'Season is required';
      }
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
      let endpoint, payload, method;
      
      if (type === 'finished') {
        endpoint = '/api/series/finished';
        method = 'POST';
        
        if (isFromOngoing) {
          const serie = ongoingSeries[selectedSerie];
          payload = { name: serie.name, fromOngoing: true };
        } else {
          payload = { name: name.trim() };
        }
      } else { // ongoing
        endpoint = '/api/series/ongoing';
        method = 'POST';
        payload = {
          name: name.trim(),
          season: parseInt(season),
          episode: parseInt(episode)
        };
      }
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Series ${isFromOngoing ? ongoingSeries[selectedSerie].name : name} added successfully!`);
        onSuccess(data);
      } else {
        toast.error(data.message || 'Failed to add series');
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
        Add {type === 'finished' ? 'Finished' : 'Ongoing'} Series
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {type === 'finished' && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isFromOngoing}
                onChange={handleIsFromOngoingChange}
                disabled={loading}
              />
            }
            label="Convert from ongoing series"
            sx={{ mb: 2 }}
          />
        )}
        
        {type === 'finished' && isFromOngoing ? (
          <FormControl fullWidth margin="normal" error={!!errors.selectedSerie}>
            <InputLabel>Select Series</InputLabel>
            <Select
              value={selectedSerie}
              onChange={handleSelectedSerieChange}
              label="Select Series"
              disabled={loading || fetchingData}
            >
              {fetchingData ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : (
                ongoingSeries.map((serie, index) => (
                  <MenuItem key={index} value={index}>
                    {serie.name} (S{serie.season}E{serie.episode})
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.selectedSerie && (
              <FormHelperText>{errors.selectedSerie}</FormHelperText>
            )}
          </FormControl>
        ) : (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Series Name"
              value={name}
              onChange={handleNameChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
            />
            
            {type === 'ongoing' && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Season"
                  type="number"
                  value={season}
                  onChange={handleSeasonChange}
                  error={!!errors.season}
                  helperText={errors.season}
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Next Episode"
                  type="number"
                  value={episode}
                  onChange={handleEpisodeChange}
                  error={!!errors.episode}
                  helperText={errors.episode}
                  disabled={loading}
                />
              </>
            )}
          </>
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
            {type === 'finished' ? 'Add Finished Series' : 'Add Ongoing Series'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
