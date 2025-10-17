import pool from '../config/database.js'

const getNoodles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM noodles ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching noodles:', error);
    res.status(409).json({ error: 'Conflict' });
  }
};

export default { getNoodles };