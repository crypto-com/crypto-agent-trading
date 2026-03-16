import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../');

export const CryptoAgentTradingPlugin = async ({ client, directory }) => {
  const parts = [];

  try {
    // 1. Load AGENTS.md as the main bootstrap context
    const agentsFile = path.join(PROJECT_ROOT, 'AGENTS.md');
    if (fs.existsSync(agentsFile)) {
      const agentsContent = fs.readFileSync(agentsFile, 'utf8');
      parts.push(agentsContent.trim());
    }

    // 2. Append skill trigger conditions extracted from SKILL.md frontmatter
    const triggerLines = [];
    const skillPaths = [
      path.join(PROJECT_ROOT, 'crypto-com-app', 'SKILL.md'),
      path.join(PROJECT_ROOT, 'crypto-com-exchange', 'SKILL.md')
    ];

    for (const skillPath of skillPaths) {
      try {
        if (!fs.existsSync(skillPath)) continue;

        const raw = fs.readFileSync(skillPath, 'utf8');
        const { frontmatter } = extractAndStripFrontmatter(raw);

        if (frontmatter.description) {
          const skillName = path.basename(path.dirname(skillPath));
          triggerLines.push(`- **${skillName}**: ${frontmatter.description}`);
        }
      } catch (error) {
        console.warn(`Warning: Failed to process skill at ${skillPath}:`, error.message);
      }
    }

    if (triggerLines.length > 0) {
      parts.push(
        `## When to Load Each Skill\n\n${triggerLines.join('\n')}`
      );
    }

    // 3. Tool usage instructions for OpenCode
    parts.push(
      `## Using Skills in OpenCode

Use OpenCode's native \`skill\` tool to load a skill when triggered:
- \`skill: crypto-com-app\` — trading and market data operations via the Crypto.com App API
- \`skill: crypto-com-exchange\` — trading and market data operations via the Crypto.com Exchange API

**Authentication Requirements:**
- **crypto-com-app**: Requires \`CDC_API_KEY\` and \`CDC_API_SECRET\` environment variables
- **crypto-com-exchange**: Requires API key and secret (provided when using the skill)

Set environment variables for crypto-com-app:
\`\`\`
export CDC_API_KEY=<your-app-api-key>
export CDC_API_SECRET=<your-app-api-secret>
\`\`\``
    );

  } catch (error) {
    console.error('Error loading crypto agent trading plugin:', error);
    return 'Error: Failed to load crypto agent trading plugin context.';
  }

  return parts.join('\n\n');
};

// Extract YAML frontmatter and body from a SKILL.md file
const extractAndStripFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };

  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};

  for (const line of frontmatterStr.split('\n')) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue; // Skip empty lines and comments

    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();

      // Remove surrounding quotes if present
      value = value.replace(/^["']|["']$/g, '');

      // Handle boolean values
      if (value === 'true') value = true;
      else if (value === 'false') value = false;

      frontmatter[key] = value;
    }
  }

  return { frontmatter, content: body };
};