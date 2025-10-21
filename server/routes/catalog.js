import express from 'express'
import { getCatalog } from '../controllers/catalog.js' 
// import controller for custom items


const router = express.Router()

// get all ramen bowls
router.get('/catalog', getCatalog);

export default router