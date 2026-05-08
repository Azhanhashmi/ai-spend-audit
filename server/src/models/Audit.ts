import mongoose, { Schema } from 'mongoose'

const AuditSchema = new Schema({
  toolsData: { type: Schema.Types.Mixed, required: true },
  recommendations: { type: Schema.Types.Mixed, required: true },
  totalMonthlySavings: { type: Number, required: true },
  totalAnnualSavings: { type: Number, required: true },
  teamSize: { type: Number },
  useCase: { type: String },
  aiSummary: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Audit', AuditSchema)