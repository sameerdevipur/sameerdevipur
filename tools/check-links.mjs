import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize, relative, resolve } from "node:path";

const siteRoot = resolve("_site");
const htmlFiles = [];
const failures = [];

function collectHtml(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);

    if (statSync(path).isDirectory()) {
      collectHtml(path);
    } else if (path.endsWith(".html")) {
      htmlFiles.push(path);
    }
  }
}

function localTarget(sourceFile, rawReference) {
  const reference = rawReference.split("#")[0].split("?")[0];

  if (
    !reference ||
    reference.startsWith("#") ||
    /^(?:[a-z]+:)?\/\//i.test(reference) ||
    /^(?:mailto|tel|data):/i.test(reference)
  ) {
    return null;
  }

  const decoded = decodeURIComponent(reference);
  const target = decoded.startsWith("/")
    ? join(siteRoot, decoded)
    : resolve(dirname(sourceFile), decoded);

  return target.endsWith("/") ? join(target, "index.html") : normalize(target);
}

collectHtml(siteRoot);

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const attributePattern = /\b(?:href|src)=["']([^"']+)["']/gi;
  let match;

  while ((match = attributePattern.exec(html))) {
    const target = localTarget(file, match[1]);

    if (target && (!target.startsWith(siteRoot) || !existsSync(target))) {
      failures.push(`${relative(siteRoot, file)} -> ${match[1]}`);
    }
  }
}

if (failures.length) {
  console.error(`Found ${failures.length} broken local reference(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} rendered pages; all local references resolve.`);
