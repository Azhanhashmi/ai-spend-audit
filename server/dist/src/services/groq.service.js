"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummary = generateSummary;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
function getClient() {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is missing in environment variables');
    }
    return new groq_sdk_1.default({
        apiKey: process.env.GROQ_API_KEY,
    });
}
async function generateSummary(data) {
    try {
        const client = getClient();
        const prompt = `You are an AI spend analyst. Write a 100-word personalized audit summary for a team.
Team size: ${data.teamSize}
Primary use case: ${data.useCase}
Total monthly savings identified: $${data.totalMonthlySavings}
Total annual savings: $${data.totalAnnualSavings}
Recommendations:
${data.recommendations
            .map((r) => `- ${r.tool}: ${r.recommendedAction} (save $${r.monthlySavings}/mo)`)
            .join('\n')}

Write a direct, specific, encouraging summary. Mention the biggest saving opportunity by name. End with one action they should take today. No fluff. Exactly around 100 words.`;
        const completion = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            max_tokens: 200,
            messages: [{ role: 'user', content: prompt }],
        });
        const text = completion.choices[0]?.message?.content;
        if (text)
            return text;
        return fallbackSummary(data);
    }
    catch (e) {
        console.error('Groq API failed:', e);
        return fallbackSummary(data);
    }
}
function fallbackSummary(data) {
    return `Your ${data.teamSize}-person team has an opportunity to save $${data.totalMonthlySavings} per month ($${data.totalAnnualSavings}/year) on AI tools. Based on your ${data.useCase} workflow, several of your current plans are oversized for your actual usage. The biggest wins come from right-sizing seat counts and switching to plans that match your team size. Start by acting on the top recommendation — it takes less than 10 minutes and could save you hundreds this year.`;
}
//# sourceMappingURL=groq.service.js.map