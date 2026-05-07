import { Router } from 'express'
import { createAudit, getAudit } from '../controllers/audit.controller'

const router = Router()

router.post('/', createAudit)       // POST /api/audit
router.get('/:id', getAudit)        // GET /api/audit/:id  (shareable URL)

export default router