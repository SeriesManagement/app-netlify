import { deleteSerie } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'DELETE') {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: 'Series name is required' });
      }
      
      await deleteSerie(name);
      

      
      return res.status(200).json({ message: 'Series deleted successfully' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in delete series API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
