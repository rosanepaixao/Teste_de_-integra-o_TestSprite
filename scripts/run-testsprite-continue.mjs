/**
 * Continue TestSprite after code_summary.yaml exists.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectPath = path.resolve(__dirname, "..");
const projectName = path.basename(projectPath);

if (!process.env.API_KEY) {
  console.error("Set API_KEY.");
  process.exit(1);
}

const nodeDir = "C:\\Program Files\\nodejs";
const transport = new StdioClientTransport({
  command: path.join(nodeDir, "npx.cmd"),
  args: ["-y", "@testsprite/testsprite-mcp@latest"],
  env: {
    ...process.env,
    API_KEY: process.env.API_KEY,
    PATH: `${nodeDir};${process.env.PATH ?? ""}`,
  },
});

const client = new Client({ name: "time-tracker-testsprite", version: "1.0.0" });
const opts = { timeout: 600_000, maxTotalTimeout: 600_000 };

async function callTool(name, args = {}) {
  console.log(`\n>>> ${name}`);
  const result = await client.callTool({ name, arguments: args }, undefined, opts);
  const text = result.content?.find((c) => c.type === "text")?.text ?? "";
  if (text) console.log(text.slice(0, 12000));
  if (result.isError) throw new Error(`${name} failed`);
}

await client.connect(transport);

await callTool("testsprite_generate_standardized_prd", { projectPath });
await callTool("testsprite_generate_frontend_test_plan", {
  projectPath,
  needLogin: false,
});
await callTool("testsprite_generate_code_and_execute", {
  projectName,
  projectPath,
  testIds: [],
  additionalInstruction: "",
  serverMode: "production",
});

console.log("\nDone. See testsprite_tests/testsprite-mcp-test-report.md");
