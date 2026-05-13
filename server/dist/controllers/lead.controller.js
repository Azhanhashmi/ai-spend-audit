"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLead = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const createLead = async (req, res) => {
    try {
        const { email, companyName, role, teamSize, auditId, totalMonthlySavings } = req.body;
        const lead = await Lead_1.default.create({ email, companyName, role, teamSize, auditId, totalMonthlySavings });
        res.status(201).json({ success: true, lead });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to save lead' });
    }
};
exports.createLead = createLead;
//# sourceMappingURL=lead.controller.js.map