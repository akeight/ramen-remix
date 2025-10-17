import pool from '../config/database.js'

const getProteins = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proteins ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching proteins:', error);
    res.status(409).json({ error: 'Conflict' });
  }
};

export default { getProteins };