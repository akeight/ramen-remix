import pool from '../config/database.js'

const getSizes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sizes ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching sizes:', error);
    res.status(409).json({ error: 'Conflict' });
  }
};

export default { getSizes };