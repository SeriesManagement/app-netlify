import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT || 5432, // Default PostgreSQL port if not specified
  ssl: true
});

// Verify database connection parameters are available
if (!process.env.PG_USER || !process.env.PG_PASSWORD || !process.env.PG_HOST || !process.env.PG_DATABASE) {
  console.error('Missing database connection parameters. Please check your environment variables.');
}

// Get finished series
export async function getFinishedSeries() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT name FROM series WHERE finished = true ORDER BY name'
    );
    return result.rows;
  } finally {
    client.release();
  }
}

// Get ongoing series
export async function getOngoingSeries() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT name, season, episode FROM series WHERE finished = false ORDER BY name'
    );
    return result.rows;
  } finally {
    client.release();
  }
}

// Add a finished series
export async function addFinishedSerie(name) {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO series(name, finished) VALUES($1, true)',
      [name]
    );
  } finally {
    client.release();
  }
}

// Convert an ongoing series to finished
export async function convertOngoingToFinished(name) {
  const client = await pool.connect();
  try {
    await client.query(
      'UPDATE series SET finished = true, season = NULL, episode = NULL WHERE name = $1',
      [name]
    );
  } finally {
    client.release();
  }
}

// Add an ongoing series
export async function addOngoingSerie(name, season, episode) {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO series(name, season, episode, finished) VALUES($1, $2, $3, false)',
      [name, season, episode]
    );
  } finally {
    client.release();
  }
}

// Update a series
export async function updateSerie(name, updateType, season, episode) {
  const client = await pool.connect();
  try {
    if (updateType === 'season') {
      await client.query(
        'UPDATE series SET season = $1 WHERE name = $2',
        [season, name]
      );
    } else if (updateType === 'episode') {
      await client.query(
        'UPDATE series SET episode = $1 WHERE name = $2',
        [episode, name]
      );
    } else if (updateType === 'both') {
      await client.query(
        'UPDATE series SET season = $1, episode = $2 WHERE name = $3',
        [season, episode, name]
      );
    }
  } finally {
    client.release();
  }
}

// Delete a series
export async function deleteSerie(name) {
  const client = await pool.connect();
  try {
    await client.query(
      'DELETE FROM series WHERE name = $1',
      [name]
    );
  } finally {
    client.release();
  }
}
