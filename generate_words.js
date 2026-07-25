import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateWords(letter, count) {
  console.log(`Generating ${count} words for letter ${letter}...`);
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Generate ${count} advanced vocabulary words starting with the letter '${letter}' that can be used by a 40 yr old software engineer daily (spoken or written).
    Provide realistic English examples and Tamil translations/examples for each.
    Include POS, synonyms, and antonyms.
    
    Output JSON format:
    {
      "words": [
        {
          "word": "string",
          "definition": "string",
          "enExample": "string",
          "taExample": "string",
          "taWord": "string",
          "pos": "string",
          "synonyms": ["string", "string"],
          "antonyms": ["string", "string"]
        }
      ]
    }
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          words: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                definition: { type: Type.STRING },
                enExample: { type: Type.STRING },
                taExample: { type: Type.STRING },
                taWord: { type: Type.STRING },
                pos: { type: Type.STRING },
                synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
                antonyms: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["word", "definition", "enExample", "taExample", "taWord", "pos", "synonyms", "antonyms"]
            }
          }
        }
      }
    }
  });

  const data = JSON.parse(response.text());
  return data.words;
}

async function main() {
  const letters = ['A', 'B', 'C'];
  
  for (const letter of letters) {
    const words = await generateWords(letter, 30); // 30 words per letter
    
    const fileContent = `import { LexiconWord } from './types';\n\nexport const words${letter}: LexiconWord[] = ${JSON.stringify(words, null, 2)};\n`;
    fs.writeFileSync('./src/data_' + letter + '.ts', fileContent);
    console.log('Saved src/data_' + letter + '.ts');
  }
}

main().catch(console.error);
