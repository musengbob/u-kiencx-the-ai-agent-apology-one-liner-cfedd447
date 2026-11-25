import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// One-line apology for the make.fun bounty "The AI Agent Apology One-Liner".
// The joke: an AI agent apologizing for the most on-brand AI failure mode
// there is — hallucinating something, then destroying the real thing, then
// doubling down with total confidence. Three mistakes stacked into one
// breathless confession, and the punchline ("with full confidence") lands
// last, because that is exactly how the agent would still be wrong.

const LINE =
  "Sorry — I hallucinated the document, deleted the original, and then cited both of them in the meeting notes with full confidence.";

function outputPath(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR;
  if (dir && dir.trim().length > 0) return join(resolve(dir), "entry.txt");
  const explicit = process.env.OUTPUT_PATH;
  if (explicit && explicit.trim().length > 0) return resolve(explicit);
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "output", "entry.txt");
}

function fail(message: string): never {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

const target = outputPath();
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, LINE, { encoding: "utf8" });

if (!existsSync(target)) fail(`entry.txt was not created at ${target}`);

const written = readFileSync(target, "utf8");
const codePoints = Array.from(written).length;

if (written !== LINE) fail("entry.txt differs from the apology line");
if (codePoints < 1 || codePoints > 200) {
  fail(`entry is ${codePoints} code points, outside the 1-200 range`);
}
if (written.trim().length === 0) fail("entry is only whitespace");
if (written.includes("\n") || written.includes("\r")) {
  fail("entry must be a single line");
}

console.log(`Entry written to ${target}`);
console.log(`Code points: ${codePoints}`);
console.log(written);
console.log("OK: byte-identical, single line, 1-200 code points.");
