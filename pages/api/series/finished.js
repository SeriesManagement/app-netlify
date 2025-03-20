import { getFinishedSeries, addFinishedSerie, convertOngoingToFinished } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const series = await getFinishedSeries();
      return res.status(200).json(series);
    } else if (req.method === 'POST') {
      const { name, fromOngoing } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: 'Series name is required' });
      }
      
      if (fromOngoing) {
        await convertOngoingToFinished(name);
      } else {
        await addFinishedSerie(name);
      }
      

      
      return res.status(201).json({ message: 'Series added successfully' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in finished series API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
