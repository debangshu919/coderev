
import OpenAI from 'openai';
import simpleGit from 'simple-git';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Initialize OpenAI client with Google's OpenAI-compatible endpoint
const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

// JSON Schema for structured output
const reviewResultSchema = {
    type: "object",
    properties: {
        summary: { type: "string" },
        scoring: {
            type: "object",
            properties: {
                bug_risk: { type: "number", description: "Score 0-30 based on logical errors, null safety, edge cases" },
                security: { type: "number", description: "Score 0-30 based on secrets, unsafe inputs, dangerous patterns" },
                code_quality: { type: "number", description: "Score 0-25 based on readability, naming, modularity" },
                maintainability: { type: "number", description: "Score 0-15 based on organization, size, separation of concerns" }
            },
            required: ["bug_risk", "security", "code_quality", "maintainability"]
        },
        issues: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    type: { type: "string", enum: ["bug", "security", "style", "performance", "best_practice"] },
                    severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
                    title: { type: "string" },
                    description: { type: "string" },
                    explanation: { type: "string", description: "A simple, beginner-friendly explanation of the issue" },
                    technical_explanation: { type: "string", description: "A detailed technical explanation for experienced developers" },
                    file: { type: "string" },
                    line: { type: "number" },
                    code_snippet: { type: "string" }
                },
                required: ["id", "type", "severity", "title", "description", "explanation", "technical_explanation"]
            }
        }
    },
    required: ["summary", "scoring", "issues"]
};

// JSON Schema for structured output...

export async function POST(req: Request) {
    let cleanup: (() => Promise<void>) | null = null;
    try {
        const { code, type, repoUrl } = await req.json();

        let diff = "";
        let context = "";

        // 🔍 Context Gathering (Filesystem / Git MCP Logic)
        if (type === 'url' && repoUrl) {
            try {
                // Create unique temp directory
                const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'coderev-'));

                cleanup = () => fs.rm(tempDir, { recursive: true, force: true });

                console.log(`Cloning ${repoUrl} to ${tempDir}...`);

                // Clone with depth 1 for performance
                const git = simpleGit();
                await git.clone(repoUrl, tempDir, ['--depth', '1']);

                // For a fresh clone, we want the latest commit info
                const repoGit = simpleGit(tempDir);
                const log = await repoGit.log({ maxCount: 1 });
                const latestCommit = log.latest;
                diff = await repoGit.show([latestCommit?.hash || 'HEAD']);

                // Ensure context knows this is a public repo review
                context = `You are reviewing a public GitHub repository (${repoUrl}).\nFocus on the changes in the LATEST COMMIT:\n\nGIT DIFF (Latest Commit):\n${diff}`;

            } catch (e: unknown) {
                // Cleanup handled in finally block
                const errorMessage = e instanceof Error ? e.message : String(e);
                console.error("Clone error:", e);
                return Response.json({ error: `Failed to clone repository: ${errorMessage}` }, { status: 500 });
            }
        } else if (type === 'paste') {
            context = `CODE SNIPPET:\n${code}`;
        }

        // Limit diff size
        if (context.length > 50000) {
            context = context.substring(0, 50000) + "\n... (Content truncated)";
        }


        // 🧠 AI Analysis using OpenAI SDK with Google Gemini
        const response = await openai.chat.completions.create({
            model: 'gemini-2.5-flash',
            messages: [
                {
                    role: 'system',
                    content: `You are CodeRev, an expert AI code reviewer and mentor.
Your goal is to review the provided code or git diff and identify issues.

Also provide a SCORING assessment based on these strictly defined rubrics. Total possible score is 100.

1. Bug Risk Score (0-30)
   - 30: No logical errors, perfect null/undefined handling, robust edge case coverage.
   - 0: Code is broken, crashes immediately, or has critical logic flaws.

2. Security Score (0-30)
   - 30: No hardcoded secrets, perfect input sanitization, safe API usage.
   - 0: Contains leaked keys, SQL injection, XSS, or extremely dangerous patterns.

3. Code Quality Score (0-25)
   - 25: Beautifully readable, consistent naming, DRY, modular.
   - 0: Spaghetti code, cryptic naming, massive duplication.

4. Maintainability Score (0-15)
   - 15: Well-organized files, small functions, clear separation of concerns.
   - 0: Monolithic files, 500+ line functions, no structure.

For each issue you find ('bug', 'security' vulnerability, 'style' issue, 'performance', or 'best_practice'):
1. Identify the file and line number if possible.
2. Assess severity.
3. Provide TWO explanations:
   - "explanation": Simple, analogy-based, friendly (Personas: Teacher, Mentor). Avoid jargon.
   - "technical_explanation": Precise, technical, deeply actionable (Personas: Sr Engineer, Security Auditor).

Focus on:
- Security: Hardcoded secrets, injection flaws, unsafe inputs.
- Bugs: Logic errors, unhandled promises, edge cases.
- Quality: Readability, maintainability.

If the diff is empty or the code looks fine, provide a positive summary, high scores, and maybe 0 issues.

IMPORTANT: Respond with valid JSON matching the schema provided.`
                },
                {
                    role: 'user',
                    content: context
                }
            ],
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'review_result',
                    strict: true,
                    schema: reviewResultSchema
                }
            }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No response from AI model");
        }

        const result = JSON.parse(content);
        return Response.json(result);

    } catch (error: unknown) {
        console.error("AI Review failed:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return Response.json({ error: errorMessage }, { status: 500 });
    } finally {
        if (cleanup) {
            try {
                await cleanup();
            } catch (cleanupError) {
                console.error("Failed to clean up temp directory:", cleanupError);
            }
        }
    }
}
