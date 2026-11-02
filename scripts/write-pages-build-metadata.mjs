import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
const sourceTree = execFileSync("git", ["rev-parse", "HEAD^{tree}"], {
  encoding: "utf8",
}).trim();

writeFileSync(
  "pages-build-metadata.json",
  `${JSON.stringify(
    {
      eventName: process.env.GITHUB_EVENT_NAME,
      workflowRunId: Number(process.env.GITHUB_RUN_ID),
      pullRequestNumber: event.pull_request?.number ?? null,
      sourceTree,
    },
    null,
    2,
  )}\n`,
);
