import fs from 'fs';

let dataTs = fs.readFileSync('./src/data.ts', 'utf8');

// 1. Rename 'export const wordsData: LexiconWord[] = [' to 'export const wordsP: LexiconWord[] = ['
dataTs = dataTs.replace('export const wordsData: LexiconWord[] = [', 'export const wordsP: LexiconWord[] = [');

// 2. Add imports at the top
const imports = `import { wordsA } from './data_A';\nimport { wordsB } from './data_B';\nimport { wordsC } from './data_C';`;

// Insert after the first line (import { LexiconWord } from './types';)
const lines = dataTs.split('\n');
lines.splice(1, 0, imports);
dataTs = lines.join('\n');

// 3. Append the final merged export at the bottom
dataTs += `\nexport const wordsData: LexiconWord[] = [...wordsA, ...wordsB, ...wordsC, ...wordsP];\n`;

fs.writeFileSync('./src/data.ts', dataTs);
