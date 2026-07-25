import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const pWords = [
  "Pragmatic", "Paradigm", "Proliferate", "Precedent", "Pertinent",
  "Plausible", "Prudent", "Proficient", "Provision", "Predicate",
  "Permutation", "Paradox", "Parity", "Prerequisite", "Propagate",
  "Pivotal", "Peripheral", "Prohibitive", "Protracted", "Plethora",
  "Perfunctory", "Preclude", "Presumptuous", "Proactive", "Purview",
  "Performant", "Polymorphism", "Pervasive", "Proponent", "Partition",
  "Prerogative", "Persist", "Palliative", "Preempt", "Peculiar",
  "Placid", "Punctilious", "Provocative", "Provisional", "Pedantic",
  "Parallax", "Permeate", "Potent", "Perceptive", "Prospective",
  "Paramount", "Ponder", "Profuse", "Procure", "Proprietary"
];

async function run() {
  console.log('Fetching synonyms and antonyms...');
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-pro',
    contents: `Provide synonyms and antonyms for these words in the context of software engineering: ${pWords.join(', ')}.
    Output a JSON object where keys are words, and values are objects with "synonyms" (array of 2 strings) and "antonyms" (array of 2 strings).`,
    config: {
      responseMimeType: "application/json"
    }
  });
  
  const map = JSON.parse(response.text());
  let dataTs = fs.readFileSync('./src/data.ts', 'utf8');
  
  for (const word of pWords) {
    if (map[word]) {
      const syns = JSON.stringify(map[word].synonyms || []);
      const ants = JSON.stringify(map[word].antonyms || []);
      
      const wordMatch = 'word: "' + word + '"';
      if (word === 'Pragmatic' || word === 'Paradigm') {
          continue; // skip the ones manually patched earlier
      }
      
      const regex = new RegExp('(word: "' + word + '"[\\s\\S]*?pos: "[^"]+")(,?)');
      dataTs = dataTs.replace(regex, "$1,\n    synonyms: " + syns + ",\n    antonyms: " + ants);
    }
  }
  
  fs.writeFileSync('./src/data.ts', dataTs);
  console.log('Enriched P words');
}

run().catch(console.error);
