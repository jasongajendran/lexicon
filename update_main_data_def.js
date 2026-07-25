import fs from 'fs';

let dataTs = fs.readFileSync('./src/data.ts', 'utf8');

// Add imports for D, E, F
const imports = `import { wordsD } from './data_D';\nimport { wordsE } from './data_E';\nimport { wordsF } from './data_F';`;

// Find the last import (which might be import { wordsC } ...)
const importC = "import { wordsC } from './data_C';";
dataTs = dataTs.replace(importC, importC + '\n' + imports);

// Add them to the export list
// export const wordsData: LexiconWord[] = [...wordsA, ...wordsB, ...wordsC, ...wordsP];
const oldExport = "export const wordsData: LexiconWord[] = [...wordsA, ...wordsB, ...wordsC, ...wordsP];";
const newExport = "export const wordsData: LexiconWord[] = [...wordsA, ...wordsB, ...wordsC, ...wordsD, ...wordsE, ...wordsF, ...wordsP];";
dataTs = dataTs.replace(oldExport, newExport);

fs.writeFileSync('./src/data.ts', dataTs);
