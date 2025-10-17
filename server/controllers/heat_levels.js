import pool from '../config/database.js'

const getHeatLevels = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM heat_levels ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching heat levels:', error);
    res.status(409).json({ error: 'Conflict' });
  }
};

export default { getHeatLevels };