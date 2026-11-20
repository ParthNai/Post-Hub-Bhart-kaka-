import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { compile } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function build() {
  console.log('Scanning codebase for Tailwind class candidates in:', projectRoot);
  const scanner = new Scanner({
    sources: [
      { base: projectRoot, pattern: 'app/**/*.{ts,tsx,js,jsx}', negated: false },
      { base: projectRoot, pattern: 'components/**/*.{ts,tsx,js,jsx}', negated: false },
    ],
  });

  const candidates = scanner.scan();
  console.log(`Found ${candidates.length} candidate classes.`);

  const compiler = await compile('@import "tailwindcss";', {
    base: projectRoot,
    from: path.join(projectRoot, 'app/globals.css'),
    onDependency: () => {},
  });

  console.log('Compiling utilities...');
  const builtCss = compiler.build(candidates);

  const outputPath = path.join(projectRoot, 'app/tailwind-custom.css');
  fs.writeFileSync(outputPath, builtCss, 'utf8');
  console.log(`Successfully generated ${outputPath} (${builtCss.length} bytes)!`);
}

build().catch(err => {
  console.error('Build error:', err);
  process.exit(1);
});
