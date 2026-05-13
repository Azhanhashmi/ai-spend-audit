"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudit = exports.createAudit = void 0;
const Audit_1 = __importDefault(require("../models/Audit"));
const groq_service_1 = require("../services/groq.service");
const createAudit = async (req, res) => {
    try {
        const { toolsData, recommendations, totalMonthlySavings, totalAnnualSavings, teamSize, useCase } = req.body;
        const aiSummary = await (0, groq_service_1.generateSummary)({
            totalMonthlySavings,
            totalAnnualSavings,
            recommendations,
            teamSize,
            useCase
        });
        const audit = await Audit_1.default.create({
            toolsData, recommendations,
            totalMonthlySavings, totalAnnualSavings,
            teamSize, useCase, aiSummary
        });
        res.status(201).json({ auditId: audit._id, audit, aiSummary });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to save audit' });
    }
};
exports.createAudit = createAudit;
const getAudit = async (req, res) => {
    try {
        const audit = await Audit_1.default.findById(req.params.id);
        if (!audit) {
            res.status(404).json({ message: 'Audit not found' });
            return;
        }
        res.json(audit);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch audit' });
    }
};
exports.getAudit = getAudit;
//# sourceMappingURL=audit.controller.js.map