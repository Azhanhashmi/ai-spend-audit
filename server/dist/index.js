"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./src/config/db");
const rateLimit_1 = require("./src/middleware/rateLimit");
const audit_routes_1 = __importDefault(require("./src/routes/audit.routes"));
const lead_routes_1 = __importDefault(require("./src/routes/lead.routes"));
const errorHandler_1 = require("./src/middleware/errorHandler");
dotenv_1.default.config();
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL }));
app.use(express_1.default.json());
app.use(rateLimit_1.limiter);
app.use('/api/audit', audit_routes_1.default);
app.use('/api/lead', lead_routes_1.default);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map