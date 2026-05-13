import express from 'express'
import { createAudit, getAudit } from '../controllers/audit.controller'

const router = express.Router()

// create audit (POST /api/audit)
router.post('/', createAudit)

// optional: fetch audit by id (GET /api/audit/:id)
router.get('/:id', getAudit)

export default router