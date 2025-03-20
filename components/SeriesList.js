import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from '@mui/material';

export default function SeriesList({ series, type, onBack }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          fontSize: '2.2rem',
          textShadow: '1px 1px 3px rgba(255,0,98,0.3)'
        }}>
          {type === 'finished' ? 'Finished Series' : 'Ongoing Series'}
        </Typography>
      </Box>
      
      <Paper 
        elevation={6} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          mb: 4,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,0,98,0.2)'
        }}
      >
        <Box sx={{ p: 2, bgcolor: 'rgba(255,0,98,0.1)', display: type === 'ongoing' ? 'block' : 'none' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.light' }}>
            Currently Watching
          </Typography>
        </Box>
        <Divider />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.paper' }}>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem',
                    borderRight: '1px solid rgba(255,255,255,0.12)',
                    padding: '16px 24px'
                  }}
                >
                  Name
                </TableCell>
                {type === 'ongoing' && (
                  <>
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold', 
                        fontSize: '1.1rem',
                        borderRight: '1px solid rgba(255,255,255,0.12)',
                        padding: '16px 24px'
                      }}
                    >
                      Season
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold', 
                        fontSize: '1.1rem',
                        padding: '16px 24px'
                      }}
                    >
                      Episode
                    </TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {series.length > 0 ? (
                series.map((serie, index) => (
                  <TableRow 
                    key={index} 
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(255,0,98,0.05)' },
                      '&:nth-of-type(odd)': { bgcolor: 'rgba(255,255,255,0.03)' }
                    }}
                  >
                    <TableCell 
                      sx={{ 
                        borderRight: '1px solid rgba(255,255,255,0.12)',
                        padding: '12px 24px'
                      }}
                    >
                      {serie.name}
                    </TableCell>
                    {type === 'ongoing' && (
                      <>
                        <TableCell 
                          sx={{ 
                            borderRight: '1px solid rgba(255,255,255,0.12)',
                            padding: '12px 24px'
                          }}
                        >
                          {serie.season}
                        </TableCell>
                        <TableCell sx={{ padding: '12px 24px' }}>
                          {serie.episode}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={type === 'ongoing' ? 3 : 1} align="center">
                    No series found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button 
          variant="contained" 
          onClick={onBack}
          sx={{ 
            px: 4, 
            py: 1.2,
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          Back to Menu
        </Button>
      </Box>
    </Box>
  );
}
