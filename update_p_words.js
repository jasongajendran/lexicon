import fs from 'fs';

let dataTs = fs.readFileSync('./src/data.ts', 'utf8');

// We can just inject a few synonyms into the first couple of P words
dataTs = dataTs.replace(
  `word: "Pragmatic",
    definition: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
    enExample: "We need a pragmatic solution to this problem, not a theoretical one.",
    taExample: "இந்தப் பிரச்சனைக்கு நமக்கு ஒரு நடைமுறை தீர்வு தேவை, கருத்தியலான ஒன்று அல்ல.",
    taWord: "நடைமுறைசார்ந்த",
    pos: "adj."`,
  `word: "Pragmatic",
    definition: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
    enExample: "We need a pragmatic solution to this problem, not a theoretical one.",
    taExample: "இந்தப் பிரச்சனைக்கு நமக்கு ஒரு நடைமுறை தீர்வு தேவை, கருத்தியலான ஒன்று அல்ல.",
    taWord: "நடைமுறைசார்ந்த",
    pos: "adj.",
    synonyms: ["Practical", "Sensible", "Realistic"],
    antonyms: ["Theoretical", "Idealistic"]`
);

dataTs = dataTs.replace(
  `word: "Paradigm",
    definition: "A typical example or pattern of something; a model.",
    enExample: "The new framework introduces a paradigm shift in web development.",
    taExample: "புதிய கட்டமைப்பு வலை மேம்பாட்டில் ஒரு புதிய சிந்தனை முறையை அறிமுகப்படுத்துகிறது.",
    taWord: "மாதிரி / சிந்தனை முறை",
    pos: "noun"`,
  `word: "Paradigm",
    definition: "A typical example or pattern of something; a model.",
    enExample: "The new framework introduces a paradigm shift in web development.",
    taExample: "புதிய கட்டமைப்பு வலை மேம்பாட்டில் ஒரு புதிய சிந்தனை முறையை அறிமுகப்படுத்துகிறது.",
    taWord: "மாதிரி / சிந்தனை முறை",
    pos: "noun",
    synonyms: ["Model", "Pattern", "Standard"],
    antonyms: []`
);

fs.writeFileSync('./src/data.ts', dataTs);
