#!/bin/bash

# Run Code2Prompt on the current repo, focusing on relevant files only

# Exclude build, dependency, config, and asset folders/files
EXCLUDES=".git/,node_modules/,public/,.next/,.DS_Store,package-lock.json,tsconfig.tsbuildinfo,README.md,.gitignore,postcss.config.mjs,tailwind.config.ts,eslint.config.mjs,next-env.d.ts,next.config.mjs,tsconfig.json"

# Only include source, components, hooks, lib, and types
INCLUDES="src/**/*.ts,src/**/*.tsx,src/**/*.css"

# Run code2prompt with filters and output to markdown
code2prompt . \
  --include "$INCLUDES" \
  --exclude "$EXCLUDES" \
  --output-file step2-onboarding-branch.md

echo "Code2Prompt output saved tostep1-ui-branch.md"
