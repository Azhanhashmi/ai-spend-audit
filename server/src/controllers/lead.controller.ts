import { Request, Response } from 'express'
import Lead from '../models/Lead'

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, companyName, role, teamSize, auditId, totalMonthlySavings } = req.body
    const lead = await Lead.create({ email, companyName, role, teamSize, auditId, totalMonthlySavings })
    res.status(201).json({ success: true, lead })
  } catch (err) {
    res.status(500).json({ message: 'Failed to save lead' })
  }
}