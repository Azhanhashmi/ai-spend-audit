import mongoose, { Schema } from 'mongoose'

const LeadSchema = new Schema({
  email: { type: String, required: true },
  companyName: { type: String },
  role: { type: String },
  teamSize: { type: Number },
  auditId: { type: Schema.Types.ObjectId, ref: 'Audit' },
  totalMonthlySavings: { type: Number },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Lead', LeadSchema)