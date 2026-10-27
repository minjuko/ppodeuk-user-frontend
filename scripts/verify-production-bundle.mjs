import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const buildDirectory = resolve("dist");
const forbiddenMarkers = ["test-user@example.com", "test1234!"];

const findFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? findFiles(path) : path;
    }),
  );
  return nested.flat();
};

const files = await findFiles(buildDirectory);
const hasMockWorker = files.some((path) => path.endsWith("mockServiceWorker.js"));
const hasDemoFixtureChunk = files.some((path) => /demoData-[\w-]+\.js$/.test(path));
const textFiles = files.filter((path) => /\.(?:css|html|js|json|webmanifest)$/.test(path));
const bundles = await Promise.all(textFiles.map((path) => readFile(path, "utf8")));
const hasDemoCredential = forbiddenMarkers.some((marker) =>
  bundles.some((bundle) => bundle.includes(marker)),
);

if (hasMockWorker || hasDemoFixtureChunk || hasDemoCredential) {
  console.error("Production bundle contains demo-only assets or credentials.");
  process.exitCode = 1;
} else {
  console.log("Production bundle demo isolation verified.");
}
