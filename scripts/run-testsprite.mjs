/**
 * Run TestSprite MCP tools via stdio when Cursor MCP is unavailable.
 * Usage (PowerShell):
 *   $env:Path = "C:\Program Files\nodejs;" + $env:Path
 *   $env:API_KEY = "<your-testsprite-api-key>"
 *   node scripts/run-testsprite.mjs
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectPath = path.resolve(__dirname, "..");
const projectName = path.basename(projectPath);
const configPath = path.join(
  projectPath,
  "testsprite_tests",
  "tmp",
  "config.json"
);

if (!process.env.API_KEY) {
  console.error("Set API_KEY (TestSprite dashboard → Settings → API Keys).");
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
const TOOL_TIMEOUT_MS = 600_000;

async function callTool(name, args = {}) {
  console.log(`\n>>> ${name}`);
  const result = await client.callTool(
    { name, arguments: args },
    undefined,
    { timeout: TOOL_TIMEOUT_MS, maxTotalTimeout: TOOL_TIMEOUT_MS }
  );
  const text = result.content?.find((c) => c.type === "text")?.text ?? "";
  if (text) console.log(text.slice(0, 8000));
  if (result.isError) throw new Error(`${name} failed`);
  return result;
}

function isConfigCommitted() {
  if (!fs.existsSync(configPath)) return false;
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return config.status === "commited";
}

await client.connect(transport);

await callTool("testsprite_check_account_info");

if (!isConfigCommitted()) {
  console.log(
    "\nBootstrap needs the TestSprite setup page in your browser. Complete it, then re-run this script."
  );
  await callTool("testsprite_bootstrap", {
    localPort: 5173,
    type: "frontend",
    projectPath,
    testScope: "codebase",
    pathname: "",
  });
} else {
  console.log("\n>>> testsprite_bootstrap (skipped — config already committed)");
}

await callTool("testsprite_generate_code_summary", { projectRootPath: projectPath });
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
