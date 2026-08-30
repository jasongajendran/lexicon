const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data');

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

const batch2 = [
  {
    word: "Compatibility",
    pos: "noun",
    definition: "A state in which two people are able to exist or work together in harmony without conflict.",
    taWord: "இணக்கத்தன்மை / ஒத்துப்போகும் குணம்",
    enExample: "Emotional and intellectual compatibility is essential for a peaceful partnership.",
    taExample: "அமைதியான கூட்டாண்மைக்கு உணர்வுபூர்வமான மற்றும் அறிவுசார்ந்த இணக்கத்தன்மை இன்றியமையாதது.",
    enExample2: "They realized their lifestyle compatibility made living together effortless and joyful.",
    taExample2: "தங்களின் வாழ்க்கை முறை இணக்கத்தன்மை ஒன்றாக வாழ்வதை எளிமையாகவும் மகிழ்ச்சியாகவும் மாற்றியதை அவர்கள் உணர்ந்தனர்.",
    synonyms: ["Harmony", "Conformity", "Congruence", "Affinity", "Agreement"],
    antonyms: ["Incompatibility", "Mismatch", "Conflict", "Friction"]
  },
  {
    word: "Platonic",
    pos: "adjective",
    definition: "Describing a relationship that is purely affectionate and friendly, devoid of romantic or sexual involvement.",
    taWord: "தூய நட்பு சார்ந்த / உடலின்பம் சாராத புனித நட்பு",
    enExample: "They maintained a close platonic friendship for over twenty years without any romantic entanglement.",
    taExample: "எந்தவொரு காதல் பிணைப்பும் இன்றி இருபது ஆண்டுகளுக்கும் மேலாக அவர்கள் ஒரு நெருக்கமான தூய நட்பைப் பேணி வந்தனர்.",
    enExample2: "A platonic bond between colleagues can foster a strong, collaborative work environment.",
    taExample2: "சக ஊழியர்களுக்கு இடையேயான தூய நட்பு ஒரு வலுவான, கூட்டு பணிச்சூழலை உருவாக்க முடியும்.",
    synonyms: ["Non-romantic", "Friendly", "Companionable", "Spiritual", "Intellectual"],
    antonyms: ["Romantic", "Passionate", "Sensual", "Erotic"]
  },
  {
    word: "Enamored",
    pos: "adjective",
    definition: "Filled with a feeling of love, fascination, or deep admiration for someone.",
    taWord: "காதலில் மயங்கிய / தீவிர விருப்பம் கொண்ட",
    enExample: "He was completely enamored with her wit, kindness, and infectious sense of humor.",
    taExample: "அவளது அறிவுக்கூர்மை, கருணை மற்றும் கவரும் நகைச்சுவை உணர்வில் அவர் முற்றிலும் மயங்கினார்.",
    enExample2: "Visitors quickly became enamored with the warm and welcoming spirit of the island residents.",
    taExample2: "தீவு மக்களின் அன்பான மற்றும் வரவேற்கும் மனப்பான்மையில் பார்வையாளர்கள் விரைவிலேயே கவரப்பட்டனர்.",
    synonyms: ["Infatuated", "Charmed", "Captivated", "Smitten", "Enchanted"],
    antonyms: ["Repulsed", "Disenchanted", "Indifferent", "Averse"]
  },
  {
    word: "Adoration",
    pos: "noun",
    definition: "Deep love, reverence, and affectionate respect felt toward a partner, child, or mentor.",
    taWord: "ஆழ்ந்த அன்பு / போற்றுதல் / பக்தி கலந்த நேசம்",
    enExample: "He looked at his newborn daughter with pure adoration and tender wonder.",
    taExample: "அவர் தனது பிறந்த பெண் குழந்தையைத் தூய பாசத்துடனும் வியப்புடனும் பார்த்தார்.",
    enExample2: "Their decades of mutual adoration and gentle consideration served as a model for the younger generation.",
    taExample2: "பல தசாப்தங்களாக அவர்கள் ஒருவருக்கொருவர் காட்டிய ஆழ்ந்த அன்பும் கனிவான பரிவும் இளைய தலைமுறைக்கு ஒரு சிறந்த முன்மாதிரியாக அமைந்தது.",
    synonyms: ["Devotion", "Love", "Veneration", "Worship", "Idolization"],
    antonyms: ["Detestation", "Hatred", "Contempt", "Loathing"]
  },
  {
    word: "Unconditional",
    pos: "adjective",
    definition: "Given freely without any limitations, qualifications, or prerequisites.",
    taWord: "நிபந்தனையற்ற / வரம்பற்ற",
    enExample: "A parent's unconditional love offers a child a lifelong foundation of security.",
    taExample: "பெற்றோரின் நிபந்தனையற்ற அன்பு குழந்தைக்கு வாழ்நாள் முழுவதும் ஒரு பாதுகாப்பான அடித்தளத்தை வழங்குகிறது.",
    enExample2: "True companionship provides unconditional support through both victories and failures.",
    taExample2: "உண்மையான நட்பு வெற்றிகள் மற்றும் தோல்விகள் இரண்டிலும் நிபந்தனையற்ற ஆதரவை வழங்குகிறது.",
    synonyms: ["Limitless", "Absolute", "Unqualified", "Complete", "Unbounded"],
    antonyms: ["Conditional", "Qualified", "Limited", "Restricted"]
  },
  {
    word: "Camaraderie",
    pos: "noun",
    definition: "Mutual trust, warmth, and easy companionship among people who spend significant time together.",
    taWord: "தோழமை உணர்வு / நட்புப் பிணைப்பு / சகஜ உறவு",
    enExample: "The warm camaraderie among team members made long working hours feel enjoyable.",
    taExample: "குழு உறுப்பினர்களிடையே இருந்த மனமார்ந்த தோழமை உணர்வு நீண்ட வேலை நேரத்தையும் மகிழ்ச்சியாக மாற்றியது.",
    enExample2: "Years of shared challenges on the sports team forged an unbreakable camaraderie.",
    taExample2: "விளையாட்டுக் குழுவில் பல வருடங்களாகப் பகிர்ந்துகொண்ட சவால்கள் முறிக்க முடியாத தோழமை உணர்வை உருவாக்கின.",
    synonyms: ["Fellowship", "Comradeship", "Brotherhood", "Companionship", "Solidarity"],
    antonyms: ["Hostility", "Animosity", "Discord", "Isolation"]
  },
  {
    word: "Codependency",
    pos: "noun",
    definition: "An unhealthy relationship pattern where one person sacrifices their own needs to support or control another's dysfunctions.",
    taWord: "ஆரோக்கியமற்ற மிகைச் சார்பு நிலை",
    enExample: "Counseling helped the partners recognize codependency and establish healthy personal boundaries.",
    taExample: "ஆலோசனை தம்பதியினர் தங்கள் மிகைச் சார்பு நிலையை அடையாளம் கண்டு ஆரோக்கியமான தனிப்பட்ட எல்லைகளை அமைக்க உதவியது.",
    enExample2: "Breaking free from emotional codependency requires practicing self-care and asserting personal needs.",
    taExample2: "உணர்ச்சிப்பூர்வமான மிகைச் சார்பிலிருந்து விடுபட சுய அக்கறையைப் பயிற்சி செய்வதும் தனிப்பட்ட தேவைகளை உறுதிப்படுத்துவதும் அவசியம்.",
    synonyms: ["Excessive reliance", "Overdependence", "Enmeshment", "Clinginess"],
    antonyms: ["Autonomy", "Independence", "Self-reliance", "Healthy boundaries"]
  },
  {
    word: "Consanguinity",
    pos: "noun",
    definition: "The state of being related by direct bloodline or common ancestry.",
    taWord: "இரத்த சம்பந்தம் / ஒரே இரத்த வழி உறவு",
    enExample: "Their shared ancestry and consanguinity explained their remarkably similar facial features.",
    taExample: "அவர்களின் பகிரப்பட்ட மூதாதையர் மரபும் இரத்த சம்பந்தமும் அவர்களின் வியக்கத்தக்க வகையில் ஒரே மாதிரியான முக அமைப்பை விளக்கியது.",
    enExample2: "Genealogists trace lines of consanguinity to map out complex multi-generational family trees.",
    taExample2: "வம்சாவளி ஆய்வாளர்கள் பல தலைமுறை குடும்ப வரைபடங்களை உருவாக்க இரத்த வழி உறவின் தடயங்களைக் கண்டறிகிறார்கள்.",
    synonyms: ["Kinship", "Blood tie", "Lineage", "Blood relationship", "Common descent"],
    antonyms: ["Affinity", "Estrangement", "Non-relation"]
  },
  {
    word: "Rapprochement",
    pos: "noun",
    definition: "An establishment or resumption of harmonious relations, especially between estranged parties or families.",
    taWord: "மீண்டும் நல்லுறவை ஏற்படுத்துதல் / பிணக்கு நீங்கி இணைதல்",
    enExample: "The birth of their first grandchild sparked a heartfelt rapprochement between the feuding families.",
    taExample: "தங்களின் முதல் பேரக்குழந்தையின் பிறப்பு, பகைமை கொண்டிருந்த குடும்பங்களுக்கிடையே ஒரு மனமார்ந்த நல்லுறவை ஏற்படுத்தியது.",
    enExample2: "Diplomats worked quietly behind the scenes to facilitate a rapprochement between the two nations.",
    taExample2: "இரு நாடுகளுக்கிடையே மீண்டும் நல்லுறவை ஏற்படுத்துவதை எளிதாக்க தூதர்கள் திரைக்குப் பின்னால் அமைதியாக உழைத்தனர்.",
    synonyms: ["Reconciliation", "Reunion", "Harmonization", "Peace-making", "Detente"],
    antonyms: ["Estrangement", "Hostility", "Rift", "Breach"]
  }
];

let insertedCount = 0;
const insertedByLetter = {};

batch2.forEach(cand => {
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

console.log(`\nBatch 2 processed: ${batch2.length}`);
console.log(`Inserted: ${insertedCount}`);
console.log(`Breakdown by letter:`, insertedByLetter);
