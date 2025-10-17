import pool from '../config/database.js'

const getBroths = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM broths ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching broths:', error);
    res.status(409).json({ error: 'Conflict' });
  }
};

export default { getBroths };