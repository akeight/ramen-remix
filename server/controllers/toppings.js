import pool from '../config/database.js'

const getToppings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM toppings ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching toppings:', error);
    res.status(409).json({ error: 'Conflict' });
  }
};

export default { getToppings };