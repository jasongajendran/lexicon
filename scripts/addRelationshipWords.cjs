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

const relationshipCandidates = [
  {
    word: "Reciprocate",
    pos: "verb",
    definition: "To respond to a gesture, feeling, or action with a corresponding one; to return affection or kindness.",
    taWord: "பதிலுக்குச் செய்தல் / பரஸ்பரம் வெளிப்படுத்துதல்",
    enExample: "In a healthy marriage, both partners gladly reciprocate each other's acts of kindness and care.",
    taExample: "ஆரோக்கியமான திருமண வாழ்க்கையில், இரு துணைகளும் ஒருவருக்கொருவர் காட்டும் அன்பையும் அக்கறையையும் மனமுவந்து பதிலுக்குச் செய்கிறார்கள்.",
    enExample2: "He sent a thoughtful gift to reciprocate the warm hospitality he received over the holidays.",
    taExample2: "விடுமுறை நாட்களில் தனக்குக் கிடைத்த கனிவான விருந்தோம்பலுக்குப் பதிலளிக்கும் வகையில் அவர் ஒரு அன்பான பரிசை அனுப்பினார்.",
    synonyms: ["Return", "Requite", "Repay", "Respond", "Exchange"],
    antonyms: ["Ignore", "Withhold", "Neglect", "Refuse"]
  },
  {
    word: "Interdependence",
    pos: "noun",
    definition: "The state of two people relying mutually on each other for support while maintaining their individual identities.",
    taWord: "பரஸ்பர சார்பு / ஒன்றையொன்று சார்ந்திருக்கும் நிலை",
    enExample: "Healthy long-term relationships thrive on interdependence rather than complete emotional dependency.",
    taExample: "ஆரோக்கியமான நீண்டகால உறவுகள் முழுமையான உணர்ச்சி சார்பை விட ஆரோக்கியமான பரஸ்பர சார்பிலேயே செழித்து வளர்கின்றன.",
    enExample2: "The couple balanced their personal hobbies with shared goals, creating a strong sense of interdependence.",
    taExample2: "அந்தத் தம்பதியினர் தங்கள் தனிப்பட்ட பொழுதுபோக்குகளைப் பகிரப்பட்ட இலக்குகளுடன் சமநிலைப்படுத்தி, வலுவான பரஸ்பர சார்பை உருவாக்கினர்.",
    synonyms: ["Mutuality", "Reciprocity", "Interconnection", "Partnership"],
    antonyms: ["Independence", "Isolation", "Autonomy", "Separation"]
  },
  {
    word: "Affectionate",
    pos: "adjective",
    definition: "Readily feeling or showing fondness, warmth, tenderness, or love.",
    taWord: "பாசமுள்ள / அன்பொழுகும் / கனிவான",
    enExample: "An affectionate gesture, like a warm hug after a long workday, helps couples feel emotionally connected.",
    taExample: "நீண்ட வேலை நாளுக்குப் பிறகு ஒரு அரவணைப்பு போன்ற பாசமுள்ள செயல், தம்பதியினர் உணர்வுபூர்வமாக இணைந்திருக்க உதவுகிறது.",
    enExample2: "Children who grow up in an affectionate family tend to express their emotions with confidence.",
    taExample2: "பாசமுள்ள குடும்பத்தில் வளரும் குழந்தைகள் தங்கள் உணர்வுகளை நம்பிக்கையுடன் வெளிப்படுத்துகிறார்கள்.",
    synonyms: ["Fond", "Loving", "Tender", "Warmhearted", "Caring"],
    antonyms: ["Cold", "Aloof", "Distant", "Uncaring", "Detached"]
  },
  {
    word: "Attunement",
    pos: "noun",
    definition: "The ability to be deeply aware of, receptive to, and emotionally in sync with another person's feelings.",
    taWord: "உணர்வுகளைப் புரிந்து ஒத்திசைதல் / மன அதிர்வுகளை அறிதல்",
    enExample: "Emotional attunement allows partners to sense when the other is overwhelmed without needing words.",
    taExample: "உணர்வுகளைப் புரிந்து ஒத்திசையும் திறன், வார்த்தைகள் இன்றியே துணைவர் எப்போது மன அழுத்தத்தில் இருக்கிறார் என்பதை உணர வைக்கிறது.",
    enExample2: "A mother's instinctive attunement to her baby's cries creates a secure attachment.",
    taExample2: "தனது குழந்தையின் அழுகையை உணர்ந்து ஒத்திசையும் தாயின் இயல்பான திறன் ஒரு பாதுகாப்பான பிணைப்பை உருவாக்குகிறது.",
    synonyms: ["Harmonization", "Resonance", "Empathy", "Sensitivity", "Awareness"],
    antonyms: ["Indifference", "Insensitivity", "Discord", "Obliviousness"]
  },
  {
    word: "Cherish",
    pos: "verb",
    definition: "To protect, care for, and hold someone or something dear with deep love and gratitude.",
    taWord: "நெஞ்சார நேசித்தல் / பொக்கிஷமாகப் போற்றுதல்",
    enExample: "They cherish the quiet weekend mornings they spend drinking coffee together.",
    taExample: "அவர்கள் வார இறுதி காலை நேரங்களில் ஒன்றாகக் காபி குடித்துச் செலவிடும் அமைதியான தருணங்களை நெஞ்சார நேசிக்கிறார்கள்.",
    enExample2: "Parents cherish the early childhood memories of their children's laughter and milestones.",
    taExample2: "பெற்றோர்கள் தங்கள் குழந்தைகளின் சிரிப்பு மற்றும் வளர்ச்சி மைல்கற்கள் குறித்த குழந்தைப் பருவ நினைவுகளைப் பொக்கிஷமாகப் போற்றுகிறார்கள்.",
    synonyms: ["Treasure", "Value", "Prize", "Adore", "Hold dear"],
    antonyms: ["Disregard", "Neglect", "Despise", "Undervalue"]
  },
  {
    word: "Fidelity",
    pos: "noun",
    definition: "Faithfulness to a person, promise, or vow; steadfast loyalty and devotion in a relationship.",
    taWord: "உண்மைத்தன்மை / விசுவாசம் / மாறாத பற்றுறுதி",
    enExample: "Trust in any romantic relationship is built upon unwavering fidelity and open communication.",
    taExample: "எந்தவொரு காதல் உறவிலும் நம்பிக்கை என்பது அசைக்க முடியாத விசுவாசம் மற்றும் திறந்த மனதுடனான உரையாடலின் மீது கட்டமைக்கப்படுகிறது.",
    enExample2: "Through decades of highs and lows, their mutual fidelity kept their family united.",
    taExample2: "பல தசாப்த கால ஏற்ற தாழ்வுகளுக்கு மத்தியிலும், அவர்களின் பரஸ்பர விசுவாசம் குடும்பத்தை ஒற்றுமையாக வைத்திருந்தது.",
    synonyms: ["Loyalty", "Faithfulness", "Devotion", "Constancy", "Trustworthiness"],
    antonyms: ["Infidelity", "Disloyalty", "Treachery", "Betrayal"]
  },
  {
    word: "Estrangement",
    pos: "noun",
    definition: "The state of being alienated, distanced, or no longer on friendly terms with a family member or partner.",
    taWord: "மனக்கசப்பு / பிரிந்து அந்நியமாதல் / உறவு முறிவு",
    enExample: "Years of unspoken grievances between the brothers eventually led to a painful estrangement.",
    taExample: "சகோதரர்களுக்கு இடையே பல வருடங்களாக வெளிப்படுத்தப்படாத மனக்குறைகள் இறுதியில் ஒரு வேதனையான உறவு முறிவுக்கு வழிவகுத்தன.",
    enExample2: "Family therapy helped bridge the painful estrangement between the father and his adult daughter.",
    taExample2: "குடும்ப ஆலோசனை தந்தைக்கும் அவரது மகளுக்கும் இடையேயான வேதனையான பிரிவைச் சரிசெய்ய உதவியது.",
    synonyms: ["Alienation", "Separation", "Distance", "Severance", "Division"],
    antonyms: ["Reconciliation", "Closeness", "Unity", "Connection"]
  },
  {
    word: "Reconciliation",
    pos: "noun",
    definition: "The restoration of friendly relations and harmony after a misunderstanding or estrangement.",
    taWord: "சமாதானம் / மீண்டும் இணைதல் / சமரசம்",
    enExample: "A sincere apology and honest dialogue paved the way for reconciliation between the married couple.",
    taExample: "ஒரு உண்மையான மன்னிப்பும் நேர்மையான உரையாடலும் அந்தத் தம்பதியினருக்கு இடையே மீண்டும் சமாதானம் ஏற்பட வழிவகுத்தது.",
    enExample2: "Holidays often provide a wonderful opportunity for family reconciliation and forgiveness.",
    taExample2: "விடுமுறை நாட்கள் பெரும்பாலும் குடும்ப சமாதானத்திற்கும் மன்னிப்பிற்கும் ஒரு அருமையான வாய்ப்பை வழங்குகின்றன.",
    synonyms: ["Harmonization", "Rapprochement", "Settlement", "Pacification", "Reunion"],
    antonyms: ["Estrangement", "Alienation", "Discord", "Conflict"]
  },
  {
    word: "Endearment",
    pos: "noun",
    definition: "A phrase, word, or loving action that expresses affection, tenderness, and warmth.",
    taWord: "கொஞ்சுமொழி / அன்பின் வெளிப்பாடு / செல்லப் பெயர்",
    enExample: "Using playful terms of endearment adds everyday warmth and intimacy to a partnership.",
    taExample: "செல்லப் பெயர்களைக் கொண்டு அழைப்பது தம்பதியரின் உறவில் அன்றாட வெதுவெதுப்பையும் நெருக்கத்தையும் சேர்க்கிறது.",
    enExample2: "Grandparents often address their grandchildren with sweet, traditional words of endearment.",
    taExample2: "தாத்தா பாட்டிகள் பெரும்பாலும் தங்கள் பேரக்குழந்தைகளை இனிமையான செல்லப் பெயர்களைக் கொண்டு அன்போடு அழைக்கிறார்கள்.",
    synonyms: ["Affection", "Pet name", "Fondness", "Tender word", "Loving gesture"],
    antonyms: ["Insult", "Slight", "Abuse", "Mockery"]
  },
  {
    word: "Infatuation",
    pos: "noun",
    definition: "An intense, overpowering, but usually short-lived passion or admiration for someone.",
    taWord: "கண்மூடித்தனமான மோகம் / தற்காலிகக் கவர்ச்சி",
    enExample: "They soon realized that their sudden summer romance was mere infatuation, not lasting love.",
    taExample: "தங்களின் திடீர் கோடைகாலக் காதல் என்பது வெறும் கண்மூடித்தனமான மோகமே தவிர, நிலைத்து நிற்கும் காதல் அல்ல என்பதை அவர்கள் விரைவில் உணர்ந்தனர்.",
    enExample2: "Teenagers often confuse early infatuation with mature, enduring emotional commitment.",
    taExample2: "பதின்ம வயதினர் பெரும்பாலும் ஆரம்பகாலக் கவர்ச்சியை முதிர்ந்த, நீடித்த உணர்வுபூர்வமான பற்றுறுதியுடன் குழப்பிக் கொள்கிறார்கள்.",
    synonyms: ["Passion", "Crush", "Obsession", "Fascination", "Enamoredness"],
    antonyms: ["Indifference", "Disillusionment", "True love", "Apathy"]
  },
  {
    word: "Kinship",
    pos: "noun",
    definition: "A feeling of being closely connected or sharing deep common values, sympathy, or blood ties.",
    taWord: "உறவாண்மை / மனஒற்றுமை / நெருங்கிய பிணைப்பு",
    enExample: "From their first conversation, they felt an immediate kinship and shared sense of humor.",
    taExample: "அவர்களின் முதல் உரையாடலிலிருந்தே, அவர்கள் உடனடி மனஒற்றுமையையும் பகிரப்பட்ட நகைச்சுவை உணர்வையும் உணர்ந்தனர்.",
    enExample2: "The community gathering reinforced a strong sense of kinship among the neighbors.",
    taExample2: "சமூகக் கூட்டமைப்பு அண்டை வீட்டாருக்கு இடையே வலுவான உறவாண்மை உணர்வை வலுப்படுத்தியது.",
    synonyms: ["Affinity", "Bond", "Connection", "Brotherhood", "Solidarity"],
    antonyms: ["Alienation", "Distance", "Discord", "Estrangement"]
  },
  {
    word: "Affinity",
    pos: "noun",
    definition: "A natural spontaneous liking, attraction, or emotional sympathy for someone.",
    taWord: "இயற்கையான ஈர்ப்பு / மன இணக்கம் / விருப்பம்",
    enExample: "Her natural affinity for people helps her build lasting friendships wherever she travels.",
    taExample: "மனிதர்கள் மீதான அவளது இயல்பான ஈர்ப்பு அவள் எங்கு சென்றாலும் நீடித்த நட்பை உருவாக்க உதவுகிறது.",
    enExample2: "The two cousins developed a deep affinity because of their shared passion for music.",
    taExample2: "இசை மீதான பொதுவான ஆர்வத்தால் அந்த இரண்டு உறவினர்களும் தங்களுக்குள் ஆழ்ந்த மன இணக்கத்தை வளர்த்துக் கொண்டனர்.",
    synonyms: ["Fondness", "Attraction", "Sympathy", "Rapport", "Liking"],
    antonyms: ["Aversion", "Dislike", "Antipathy", "Distance"]
  },
  {
    word: "Vulnerability",
    pos: "noun",
    definition: "The willingness to open up emotionally, share true feelings, and risk being hurt to build deep connection.",
    taWord: "மனதைத் திறந்து காட்டும் வெளிப்படைத்தன்மை / உணர்வுப்பூர்வமான ஏற்புத்திறன்",
    enExample: "True intimacy in a relationship is only possible when both partners embrace vulnerability.",
    taExample: "இரு துணைகளும் தங்கள் உணர்வுகளை வெளிப்படையாகப் பகிர்ந்துகொள்ளும் போதே உறவில் உண்மையான நெருக்கம் சாத்தியமாகும்.",
    enExample2: "Admitting when you made a mistake shows mature vulnerability that strengthens mutual trust.",
    taExample2: "நீங்கள் தவறு செய்ததை ஒப்புக்கொள்வது பரஸ்பர நம்பிக்கையை வலுப்படுத்தும் முதிர்ந்த வெளிப்படைத்தன்மையைக் காட்டுகிறது.",
    synonyms: ["Openness", "Honesty", "Susceptibility", "Receptiveness", "Defenselessness"],
    antonyms: ["Guardedness", "Defensiveness", "Invulnerability", "Closedness"]
  },
  {
    word: "Yearning",
    pos: "noun",
    definition: "A deep, tender, and persistent longing or emotional desire for someone.",
    taWord: "ஏக்கம் / தீவிர ஆவல் / தவிப்பு",
    enExample: "During their months in a long-distance relationship, their yearning for each other never faded.",
    taExample: "நீண்ட தூர உறவில் இருந்த மாதங்களில், ஒருவருக்கொருவர் இருந்த ஏக்கம் ஒருபோதும் குறையவில்லை.",
    enExample2: "The old photographs stirred a quiet yearning for family gatherings of the past.",
    taExample2: "பழைய புகைப்படங்கள் கடந்த கால குடும்பக் கூட்டங்களைப் பற்றிய அமைதியான ஏக்கத்தைத் தூண்டின.",
    synonyms: ["Longing", "Craving", "Desire", "Pining", "Aspiration"],
    antonyms: ["Contentment", "Satisfaction", "Apathy", "Indifference"]
  },
  {
    word: "Devotion",
    pos: "noun",
    definition: "Deep love, loyalty, and affectionate dedication to a person or family.",
    taWord: "அர்ப்பணிப்பு / மாறாத அன்பு / தீவிரப் பற்று",
    enExample: "His lifelong devotion to his ailing spouse inspired everyone who knew them.",
    taExample: "உடல்நலம் குன்றிய தனது துணைவி மீதான அவரது வாழ்நாள் அர்ப்பணிப்பு அவர்களை அறிந்த அனைவருக்கும் ஊக்கமளித்தது.",
    enExample2: "Parents show incredible devotion by sacrificing their own comforts for their children's education.",
    taExample2: "பெற்றோர்கள் தங்கள் குழந்தைகளின் கல்விக்காகத் தங்களின் சொந்த வசதிகளைத் தியாகம் செய்து அளப்பரிய அர்ப்பணிப்பைக் காட்டுகிறார்கள்.",
    synonyms: ["Dedication", "Loyalty", "Commitment", "Faithfulness", "Love"],
    antonyms: ["Disloyalty", "Apathy", "Neglect", "Treachery"]
  }
];

let insertedCount = 0;
const insertedByLetter = {};

relationshipCandidates.forEach(cand => {
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

console.log(`\nRelationship candidates processed: ${relationshipCandidates.length}`);
console.log(`Inserted: ${insertedCount}`);
console.log(`Breakdown by letter:`, insertedByLetter);
