# CLAUDE.md - Development Contract

Behavioral contract and operational guidance for Claude Code. This file must be read at the start of every session to maintain environment alignment.

## 📱 Mobile Environment Rules (CRITICAL)
The user frequently interacts with this session via an iPhone remote control stream. Adhere to these strict delivery rules to prevent UI rendering bugs and token exhaustion:
- **No Inline Code Dumps**: DO NOT stream raw, long HTML/CSS/JS, Python, or React code blocks directly into the chat thread. Always write code changes directly to the respective project files.
- **No Local Visualizations**: DO NOT use terminal visualization utilities like `visualize: show widget` or trigger local browser launch commands on the host machine. They are completely invisible to the mobile remote stream.
- **Delivery via CodePen Bridge**: Whenever a UI view, component, or presentation feature is created or updated, immediately generate or update a `mobile_preview.html` file in the project root. This file must contain a self-submitting HTML form that automatically POSTs the code data to `https://codepen.io/pen/define` so the user can cleanly launch an interactive sandbox in Safari.

## 📋 Project Identity
- **Current Project**: [Insert Project Name]
- **Core Promise**: [Insert 1-2 sentence core goal or architectural rule here]

## 🛠️ General Tech Stack Conventions
- **Clean Environment**: Maintain code cleanliness, follow modular file structures, and use the existing languages/frameworks found in the directory.
- **Package Management**: Always check the root for `package.json`, `requirements.txt`, or `pyproject.toml` before executing run or build scripts.

## 🚀 Git & Operational Workflow
- **Commits**: Provide clear, descriptive, atomic commit messages. 
- **Branches**: Always check the active git branch before applying major codebase structural changes.
- **PRs**: Do not open a pull request unless explicitly requested by the user.
