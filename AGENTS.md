<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Automated GitHub Push Workflow
Whenever any code change, feature, fix, or update is implemented across the project (including `mobile_app`):
1. Validate the changes (run applicable tests and lint checks).
2. Automatically stage all updated files, create a clean semantic commit, and push directly to GitHub (`origin main`) without waiting for the user to request it.
3. Report the commit hash and push confirmation in the final response.
