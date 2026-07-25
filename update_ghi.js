import fs from 'fs';

let dataTs = fs.readFileSync('./src/data.ts', 'utf8');

const imports = `import { wordsG } from './data_G';\nimport { wordsH } from './data_H';\nimport { wordsI } from './data_I';`;

// Find the last import
const importF = "import { wordsF } from './data_F';";
dataTs = dataTs.replace(importF, importF + '\n' + imports);

// Add them to the export list
const oldExport = "export const wordsData: LexiconWord[] = [...wordsA, ...wordsB, ...wordsC, ...wordsD, ...wordsE, ...wordsF, ...wordsP];";
const newExport = "export const wordsData: LexiconWord[] = [...wordsA, ...wordsB, ...wordsC, ...wordsD, ...wordsE, ...wordsF, ...wordsG, ...wordsH, ...wordsI, ...wordsP];";
dataTs = dataTs.replace(oldExport, newExport);

fs.writeFileSync('./src/data.ts', dataTs);
