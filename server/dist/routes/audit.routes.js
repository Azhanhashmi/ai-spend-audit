"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_controller_1 = require("../controllers/audit.controller");
const router = (0, express_1.Router)();
router.post('/', audit_controller_1.createAudit); // POST /api/audit
router.get('/:id', audit_controller_1.getAudit); // GET /api/audit/:id  (shareable URL)
exports.default = router;
//# sourceMappingURL=audit.routes.js.map