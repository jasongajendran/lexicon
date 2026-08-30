const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data');

// Load all existing words to ensure ZERO collisions
let maxId = 0;
const existingWordsSet = new Set();

fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.json')) {
    const filePath = path.join(dataDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    content.forEach(item => {
      existingWordsSet.add(item.word.toLowerCase().trim());
      if (item.id > maxId) maxId = item.id;
    });
  }
});

console.log(`Current existing words before insertion: ${existingWordsSet.size}, Max ID: ${maxId}`);

const newBatch = [
  {
    word: "Lambaste",
    pos: "verb",
    definition: "To criticize or scold someone harshly and vehemently, often in public.",
    taWord: "கடுமையாகத் தாக்குதல் / விளாசுதல்",
    enExample: "Critics lambasted the new movie for its predictable plot and dull dialogue.",
    taExample: "ஊகிக்கக்கூடிய கதை மற்றும் மந்தமான வசனங்களுக்காக விமர்சகர்கள் புதிய திரைப்படத்தைக் கடுமையாக விளாசினர்.",
    enExample2: "Rather than lambasting a teammate for an oversight, schedule a constructive review session.",
    taExample2: "ஒரு கவனக்குறைவிற்காக சக அணி வீரரைக் கடுமையாக விமர்சிப்பதற்குப் பதிலாக, ஆக்கப்பூர்வமான பரிசீலனை அமர்வை ஏற்பாடு செய்யுங்கள்.",
    synonyms: ["Castigate", "Chastise", "Berate", "Savage", "Censure"],
    antonyms: ["Praise", "Extol", "Laud", "Approve"]
  },
  {
    word: "Insinuate",
    pos: "verb",
    definition: "To suggest, hint, or imply something negative or unpleasant in an indirect and artful way.",
    taWord: "மறைமுகமாக சுட்டிக்காட்டுதல் / நயவஞ்சகமாக குறிப்புணர்த்துதல்",
    enExample: "Are you insinuating that our department did not put enough effort into the project?",
    taExample: "எங்கள் துறை திட்டத்தில் போதுமான முயற்சி எடுக்கவில்லை என்று நீங்கள் மறைமுகமாகச் சுட்டிக்காட்டுகிறீர்களா?",
    enExample2: "It is healthier to speak directly than to insinuate dissatisfaction through sarcastic comments.",
    taExample2: "கிண்டலான கருத்துக்கள் மூலம் அதிருப்தியை மறைமுகமாக உணர்த்துவதை விட நேரடியாகப் பேசுவது சிறந்தது.",
    synonyms: ["Imply", "Hint", "Suggest", "Intimate", "Allude"],
    antonyms: ["State clearly", "Declare", "Proclaim", "Clarify"]
  },
  {
    word: "Cajole",
    pos: "verb",
    definition: "To persuade someone to do something by sustained flattery, coaxing, or gentle pleading.",
    taWord: "கொஞ்சி இணங்க வைத்தல் / நயந்து சம்மதிக்க வைத்தல்",
    enExample: "He managed to cajole his colleagues into working late to meet the urgent deadline.",
    taExample: "அவசர காலக்கெடுவை எட்ட சக ஊழியர்களை நயந்து சம்மதிக்க வைத்து தாமதமாக வேலை செய்ய வைத்தார்.",
    enExample2: "Parents often have to cajole toddlers into eating their green vegetables.",
    taExample2: "பச்சைக் காய்கறிகளை உண்ண பிஞ்சுக் குழந்தைகளைக் கொஞ்சி இணங்க வைக்க பெற்றோர்கள் முயல வேண்டியுள்ளது.",
    synonyms: ["Coax", "Wheedle", "Persuade", "Sweet-talk", "Entice"],
    antonyms: ["Force", "Bully", "Coerce", "Dissuade"]
  },
  {
    word: "Decry",
    pos: "verb",
    definition: "To publicly declare something to be wrong, unjust, or harmful.",
    taWord: "வெளிப்படையாகக் கண்டித்தல் / எதிர்த்துப் பேசுதல்",
    enExample: "Community leaders met to decry the rising cost of public transit for students.",
    taExample: "மாணவர்களுக்கான பொதுப் போக்குவரத்து கட்டண உயர்வை வெளிப்படையாகக் கண்டிக்க சமூகத் தலைவர்கள் கூடினர்.",
    enExample2: "Teachers decry excessive screen time for young children because it limits outdoor play.",
    taExample2: "வெளிப்புற விளையாட்டைக் குறைப்பதால் இளம் குழந்தைகளுக்கு அதிக திரை நேரத்தை ஆசிரியர்கள் வெளிப்படையாகக் கண்டிக்கிறார்கள்.",
    synonyms: ["Denounce", "Condemn", "Criticize", "Censure", "Deplore"],
    antonyms: ["Praise", "Applaud", "Commend", "Endorse"]
  },
  {
    word: "Mollify",
    pos: "verb",
    definition: "To appease the anger, anxiety, or distress of someone; to calm them down.",
    taWord: "கோபத்தைத் தணித்தல் / அமைதிப்படுத்துதல்",
    enExample: "The airline offered meal vouchers to mollify angry passengers during the long flight delay.",
    taExample: "நீண்ட விமான தாமதத்தின் போது கோபமடைந்த பயணிகளின் கோபத்தைத் தணிக்க விமான நிறுவனம் உணவு கூப்பன்களை வழங்கியது.",
    enExample2: "A warm cup of milk and a comforting hug helped mollify the crying toddler.",
    taExample2: "ஒரு சூடான பால் மற்றும் ஆறுதலான அணைப்பு அழுது கொண்டிருந்த குழந்தையின் வருத்தத்தைத் தணிக்க உதவியது.",
    synonyms: ["Appease", "Placate", "Pacify", "Soothe", "Calm"],
    antonyms: ["Enrage", "Infuriate", "Provoke", "Agitate"]
  },
  {
    word: "Placate",
    pos: "verb",
    definition: "To make someone less angry or hostile, especially by doing something pleasing.",
    taWord: "சமாதானப்படுத்துதல் / சாந்தப்படுத்துதல்",
    enExample: "The store manager offered an immediate full refund to placate the disappointed customer.",
    taExample: "ஏமாற்றமடைந்த வாடிக்கையாளரைச் சமாதானப்படுத்த கடையின் மேலாளர் உடனடியாக முழு பணத்தையும் திருப்பி வழங்கினார்.",
    enExample2: "Sharing the toy was the best way to placate the two squabbling siblings.",
    taExample2: "பொம்மையைப் பகிர்ந்துகொள்வது சண்டையிட்டுக் கொண்டிருந்த இரு சகோதரர்களைச் சமாதானப்படுத்த சிறந்த வழியாகும்.",
    synonyms: ["Appease", "Pacify", "Mollify", "Calm", "Conciliate"],
    antonyms: ["Provoke", "Anger", "Irritate", "Inflame"]
  },
  {
    word: "Exhort",
    pos: "verb",
    definition: "To strongly encourage or urge someone to take a positive, brave, or necessary action.",
    taWord: "வலியுறுத்தித் தூண்டுதல் / உற்சாகப்படுத்தி வழிநடத்துதல்",
    enExample: "The coach exhorted the players to give their maximum effort in the final minutes of the match.",
    taExample: "போட்டியின் கடைசி நிமிடங்களில் தங்களின் அதிகபட்ச முயற்சியை வெளிப்படுத்துமாறு வீரர்களைப் பயிற்சியாளர் வலியுறுத்தித் தூண்டினார்.",
    enExample2: "Parents exhort their children to study consistently rather than cramming before exams.",
    taExample2: "தேர்வுக்கு முன் அவசரமாகப் படிப்பதற்குப் பதிலாகத் தொடர்ந்து படிக்குமாறு பெற்றோர்கள் தங்கள் குழந்தைகளை வலியுறுத்துகிறார்கள்.",
    synonyms: ["Urge", "Encourage", "Admonish", "Expostulate", "Prompt"],
    antonyms: ["Deter", "Discourage", "Dissuade", "Hinder"]
  },
  {
    word: "Dissuade",
    pos: "verb",
    definition: "To persuade someone not to take a particular course of action.",
    taWord: "மனம் மாறச் செய்தல் / பின்வாங்க வைத்தல் / தடுத்தல்",
    enExample: "His financial advisor managed to dissuade him from making an overly speculative investment.",
    taExample: "அதிக ஆபத்து நிறைந்த ஊக முதலீட்டைச் செய்ய வேண்டாம் என்று அவரது நிதி ஆலோசகர் அவரை மனம் மாறச் செய்து தடுத்தார்.",
    enExample2: "Friends tried to dissuade him from driving home through the heavy blizzard.",
    taExample2: "கடும் பனிப்புயலின் வழியே வீட்டிற்கு வண்டி ஓட்டிச் செல்ல வேண்டாம் என்று நண்பர்கள் அவரைத் தடுத்தனர்.",
    synonyms: ["Deter", "Discourage", "Prevent", "Talk out of"],
    antonyms: ["Persuade", "Encourage", "Incite", "Urge"]
  },
  {
    word: "Commiserate",
    pos: "verb",
    definition: "To express or feel sympathy, pity, or sorrow with someone going through hardship.",
    taWord: "ஆறுதல் கூறுதல் / அனுதாபம் தெரிவித்தல்",
    enExample: "Colleagues gathered by the coffee machine to commiserate with him after the client canceled the deal.",
    taExample: "வாடிக்கையாளர் ஒப்பந்தத்தை ரத்து செய்த பிறகு, அவருக்கு ஆறுதல் கூற சக ஊழியர்கள் காபி இயந்திரத்தின் அருகில் கூடினர்.",
    enExample2: "Neighbors commiserated with each other over the damage caused by the unexpected storm.",
    taExample2: "எதிர்பாராத புயலால் ஏற்பட்ட சேதங்கள் குறித்து அண்டை வீட்டார் ஒருவருக்கொருவர் அனுதாபத்தைப் பகிர்ந்து கொண்டனர்.",
    synonyms: ["Sympathize", "Condole", "Console", "Pity", "Empathize"],
    antonyms: ["Rejoice", "Ignore", "Gloat", "Slight"]
  },
  {
    word: "Conciliate",
    pos: "verb",
    definition: "To stop someone from being angry or discontented; to reconcile conflicting parties.",
    taWord: "சமரசப் பேச்சுவார்த்தை நடத்துதல் / பிணக்கு தீர்த்தல்",
    enExample: "A skilled HR mediator stepped in to conciliate between the two arguing team leads.",
    taExample: "வாக்குவாதத்தில் ஈடுபட்ட இரு குழுத் தலைவர்களுக்கு இடையே பிணக்கு தீர்க்க ஒரு திறமையான HR மத்தியஸ்தர் தலையிட்டார்.",
    enExample2: "He spoke with a calm and kind tone in an effort to conciliate his upset friend.",
    taExample2: "வருத்தமடைந்த தனது நண்பனைச் சமாதானப்படுத்தும் முயற்சியில் அவர் அமைதியான மற்றும் கனிவான தொனியில் பேசினார்.",
    synonyms: ["Placate", "Reconcile", "Appease", "Pacify", "Mediate"],
    antonyms: ["Antagonize", "Alienate", "Provoke", "Estrange"]
  }
];

let insertedCount = 0;
const insertedByLetter = {};

newBatch.forEach(cand => {
  const cleanWord = cand.word.trim();
  const lower = cleanWord.toLowerCase();
  
  if (existingWordsSet.has(lower)) {
    console.log(`Skipping already existing word: ${cleanWord}`);
    return;
  }
  
  const letter = cleanWord[0].toLowerCase();
  const fileName = `${letter}.json`;
  const filePath = path.join(dataDir, fileName);
  
  let list = [];
  if (fs.existsSync(filePath)) {
    list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  
  maxId++;
  const wordObj = {
    id: maxId,
    word: cleanWord,
    pos: cand.pos,
    definition: cand.definition,
    taWord: cand.taWord,
    enExample: cand.enExample,
    taExample: cand.taExample,
    enExample2: cand.enExample2,
    taExample2: cand.taExample2,
    synonyms: cand.synonyms,
    antonyms: cand.antonyms
  };
  
  list.push(wordObj);
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  
  existingWordsSet.add(lower);
  insertedCount++;
  insertedByLetter[letter] = (insertedByLetter[letter] || 0) + 1;
});

console.log(`\nBatch additions processed: ${newBatch.length}`);
console.log(`Inserted: ${insertedCount}`);
console.log(`Breakdown by letter:`, insertedByLetter);
