const fs = require('fs');
const path = require('path');

const advancedWordsP = [
    {
      word: "Paradigm",
      definition: "A typical example or pattern of something; a model.",
      enExample: "There is a new paradigm for public art in this country.",
      taExample: "இந்த நாட்டில் பொது கலைக்கு ஒரு புதிய முன்மாதிரி உள்ளது.",
      taWord: "முன்மாதிரி",
      pos: "noun",
      synonyms: ["Model", "Pattern", "Example"],
      antonyms: []
    },
    {
      word: "Pragmatic",
      definition: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
      enExample: "A pragmatic approach to politics.",
      taExample: "அரசியலுக்கான நடைமுறை சார்ந்த அணுகுமுறை.",
      taWord: "நடைமுறை சார்ந்த",
      pos: "adj.",
      synonyms: ["Practical", "Matter-of-fact", "Sensible"],
      antonyms: ["Impractical", "Idealistic"]
    },
    {
      word: "Prolific",
      definition: "Producing much fruit or foliage or many offspring; present in large numbers or quantities.",
      enExample: "In captivity, tigers are prolific breeders.",
      taExample: "காப்பகங்களில் புலிகள் அதிகம் உருவாக்கும் இனப்பெருக்கிகளாக உள்ளன.",
      taWord: "அதிகம் உருவாக்கும்",
      pos: "adj.",
      synonyms: ["Productive", "Creative", "Inventive"],
      antonyms: ["Barren", "Unproductive"]
    }
];

let content = fs.readFileSync(path.join(__dirname, 'src/data.ts'), 'utf8');

// Find the end of wordsP array
const regex = /export const wordsP: LexiconWord\[\] = \[([\s\S]*?)\];/;
const match = content.match(regex);
if (match) {
    let arrayContent = match[1];
    
    // Calculate new ID
    const idRegex = /id:\s*(\d+)/g;
    let m;
    let maxId = 0;
    while ((m = idRegex.exec(arrayContent)) !== null) {
      const id = parseInt(m[1]);
      if (id > maxId) maxId = id;
    }
    let newId = maxId > 0 ? maxId + 1 : 1600;
    
    let addedContent = "";
    advancedWordsP.forEach(wordData => {
      addedContent += `  ,\n  {
    id: ${newId++},
    word: ${JSON.stringify(wordData.word)},
    definition: ${JSON.stringify(wordData.definition)},
    enExample: ${JSON.stringify(wordData.enExample)},
    taExample: ${JSON.stringify(wordData.taExample)},
    taWord: ${JSON.stringify(wordData.taWord)},
    pos: ${JSON.stringify(wordData.pos)},
    synonyms: ${JSON.stringify(wordData.synonyms)},
    antonyms: ${JSON.stringify(wordData.antonyms)}
  }`;
    });
    
    const newArrayContent = arrayContent.replace(/\s*$/, `${addedContent}\n`);
    content = content.replace(regex, `export const wordsP: LexiconWord[] = [${newArrayContent}];`);
    
    fs.writeFileSync(path.join(__dirname, 'src/data.ts'), content, 'utf8');
    console.log("Updated wordsP in data.ts");
} else {
    console.log("Could not find wordsP");
}
