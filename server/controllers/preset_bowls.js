import pool from '../config/database.js'

const getPresetBowls = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM preset_bowls ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching preset bowls:', error);
    res.status(409).json({ error: 'Conflict' });
  }
};

export default { getPresetBowls };