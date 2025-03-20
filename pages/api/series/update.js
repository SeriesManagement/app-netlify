import { updateSerie } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'PUT') {
      const { name, updateType, season, episode } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: 'Series name is required' });
      }
      
      if (!updateType || !['season', 'episode', 'both'].includes(updateType)) {
        return res.status(400).json({ message: 'Valid update type is required' });
      }
      
      if ((updateType === 'season' || updateType === 'both') && season === undefined) {
        return res.status(400).json({ message: 'Season is required for this update type' });
      }
      
      if ((updateType === 'episode' || updateType === 'both') && episode === undefined) {
        return res.status(400).json({ message: 'Episode is required for this update type' });
      }
      
      await updateSerie(name, updateType, season, episode);
      

      
      return res.status(200).json({ message: 'Series updated successfully' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in update series API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
