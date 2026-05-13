import { Request, Response } from 'express'
import Audit from '../models/Audit'
import { generateSummary } from '../services/groq.service'

export const createAudit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { toolsData, recommendations, totalMonthlySavings, totalAnnualSavings, teamSize, useCase } = req.body

    const aiSummary = await generateSummary({
      totalMonthlySavings,
      totalAnnualSavings,
      recommendations,
      teamSize,
      useCase
    })

    const audit = await Audit.create({
      toolsData, recommendations,
      totalMonthlySavings, totalAnnualSavings,
      teamSize, useCase, aiSummary
    })

    res.status(201).json({ auditId: audit._id, audit, aiSummary })
  } catch (err) {
    res.status(500).json({ message: 'Failed to save audit' })
  }
}

export const getAudit = async (req: Request, res: Response): Promise<void> => {
  try {
    const audit = await Audit.findById(req.params.id)
    if (!audit) { res.status(404).json({ message: 'Audit not found' }); return }
    res.json(audit)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch audit' })
  }
}