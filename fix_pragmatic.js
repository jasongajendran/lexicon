import fs from 'fs';

let dataTs = fs.readFileSync('./src/data.ts', 'utf8');

dataTs = dataTs.replace(
  `word: "Pragmatic",
    definition: "practical rather than idealistic",
    enExample: "Let's be pragmatic and ship the MVP first.",
    taExample: "நாம் நடைமுறைசார்ந்த அணுகுமுறையை கடைபிடித்து முதலில் MVP-யை வெளியிடுவோம்.",
    taWord: "நடைமுறைசார்ந்த",
    pos: "adj."`,
  `word: "Pragmatic",
    definition: "practical rather than idealistic",
    enExample: "Let's be pragmatic and ship the MVP first.",
    taExample: "நாம் நடைமுறைசார்ந்த அணுகுமுறையை கடைபிடித்து முதலில் MVP-யை வெளியிடுவோம்.",
    taWord: "நடைமுறைசார்ந்த",
    pos: "adj.",
    synonyms: ["Practical", "Realistic"],
    antonyms: ["Theoretical", "Idealistic"]`
);

dataTs = dataTs.replace(
  `word: "Paradigm",
    definition: "a typical pattern or model",
    enExample: "Microservices represent a shift in architectural paradigm.",
    taExample: "மைக்ரோசர்வீசஸ் ஒரு புதிய கட்டமைப்பு மாதிரியை குறிக்கிறது.",
    taWord: "மாதிரி / சிந்தனை முறை",
    pos: "noun"`,
  `word: "Paradigm",
    definition: "a typical pattern or model",
    enExample: "Microservices represent a shift in architectural paradigm.",
    taExample: "மைக்ரோசர்வீசஸ் ஒரு புதிய கட்டமைப்பு மாதிரியை குறிக்கிறது.",
    taWord: "மாதிரி / சிந்தனை முறை",
    pos: "noun",
    synonyms: ["Model", "Pattern"],
    antonyms: []`
);

fs.writeFileSync('./src/data.ts', dataTs);
console.log('Fixed Pragmatic and Paradigm');
