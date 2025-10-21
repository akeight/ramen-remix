import express from 'express'
import { listBowls, getBowl, createBowl, updateBowl, deleteBowl } from "../controllers/bowls.js";
// import controller for custom items


const router = express.Router()

// get all ramen bowls
router.get('/bowls', listBowls);

// get one ramen bowl by id
router.get('/:id', getBowl);

// create a new ramen bowl
router.post('/build-a-bowl', createBowl);

// update a ramen bowl by id
router.put('/:id', updateBowl);

// delete a ramen bowl by id
router.delete('/:id', deleteBowl);

export default router