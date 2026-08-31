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

const devCandidates = [
  {
    word: "Idempotent",
    pos: "adjective",
    definition: "Denoting an operation or API request that produces the exact same outcome even if called repeatedly multiple times.",
    taWord: "மீண்டும் மீண்டும் செய்தாலும் மாறா விளைவு தரும் / ஒரே முடிவை உருவாக்கும் தன்மை கொண்ட",
    enExample: "Stripe payment endpoints use idempotent keys to prevent charging a customer twice during network retries.",
    taExample: "நெட்வொர்க் மீண்டும் முயற்சிக்கும் போது வாடிக்கையாளரிடம் இருமுறை கட்டணம் வசூலிப்பதைத் தடுக்க ஸ்ட்ரைப் பணம் செலுத்தும் முனையங்கள் மாறா விளைவுக் குறியீடுகளைப் பயன்படுத்துகின்றன.",
    enExample2: "In RESTful architecture, HTTP PUT and DELETE methods should always be designed to be idempotent.",
    taExample2: "ரெஸ்ட்ஃபுல் கட்டமைப்பில், HTTP PUT மற்றும் DELETE முறைகள் எப்போதும் மாறா விளைவு கொண்டதாக வடிவமைக்கப்பட வேண்டும்.",
    synonyms: ["Repeatable", "Consistent", "Deterministic", "Invariant", "Stable"],
    antonyms: ["Non-idempotent", "Volatile", "Side-effecting", "State-mutating"]
  },
  {
    word: "Concurrency",
    pos: "noun",
    definition: "The ability of an operating system or program to execute multiple computational tasks or threads during overlapping time periods.",
    taWord: "ஒரே நேரத்தில் பல பணிகளை இயக்கும் திறன் / இணைநிகழ்வுத் தன்மை",
    enExample: "Go routines and Node.js event loops offer efficient models for handling high-traffic network concurrency.",
    taExample: "கோ ரொட்டீன்கள் மற்றும் நோட்.ஜேஎஸ் நிகழ்வு சுழல்கள் அதிக போக்குவரத்து நெரிசலை ஒரே நேரத்தில் கையாள திறமையான மாதிரிகளை வழங்குகின்றன.",
    enExample2: "Without thread-safe locking mechanisms, high concurrency can lead to critical database race conditions.",
    taExample2: "பாதுகாப்பான பூட்டுதல் வழிமுறைகள் இல்லாவிட்டால், அதிக இணைநிகழ்வுத் தன்மை முக்கியமான தரவுத்தள முரண்பாடுகளுக்கு வழிவகுக்கும்.",
    synonyms: ["Parallelism", "Simultaneity", "Multithreading", "Coexistence", "Synchronicity"],
    antonyms: ["Sequentiality", "Serial execution", "Single-threadedness"]
  },
  {
    word: "Immutability",
    pos: "noun",
    definition: "The property of an object, state, or data structure that prevents it from being modified after creation.",
    taWord: "மாற்ற முடியாத தன்மை / நிலையான நிலைத் தன்மை",
    enExample: "React states and Redux stores rely on state immutability to accurately track changes and render fast UI updates.",
    taExample: "ரியாக்ட் மற்றும் ரெடக்ஸ் கட்டமைப்புகள் மாற்றங்களைத் துல்லியமாகக் கண்காணித்து வேகமான இடைமுகத்தைப் புதுப்பிக்க மாற்ற முடியாத நிலைப் பண்பையே நம்பியுள்ளன.",
    enExample2: "Functional programming languages enforce data immutability to completely eliminate unexpected side effects.",
    taExample2: "செயல்பாட்டு நிரலாக்க மொழிகள் எதிர்பாராத பக்கவிளைவுகளை முற்றிலுமாக அகற்ற தரவு மாற்ற முடியாத தன்மையை வலியுறுத்துகின்றன.",
    synonyms: ["Permanence", "Invariance", "Stability", "Unalterability", "Constancy"],
    antonyms: ["Mutability", "Changeability", "Volatility", "Malleability"]
  },
  {
    word: "Decouple",
    pos: "verb",
    definition: "To separate software components, subsystems, or dependencies so they can operate, scale, and evolve independently.",
    taWord: "தனித்தனியாகப் பிரித்தல் / சார்பற்றதாக மாற்றுதல்",
    enExample: "Using message brokers like Kafka helps decouple the order processing service from billing systems.",
    taExample: "காஃப்கா போன்ற செய்தி இடைத்தரகர்களைப் பயன்படுத்துவது ஆர்டர் செயலாக்க சேவையை பில்லிங் அமைப்புகளிலிருந்து தனித்தனியாகப் பிரிக்க உதவுகிறது.",
    enExample2: "Engineers decided to decouple frontend view components from complex database logic by introducing a clean API layer.",
    taExample2: "ஒரு தெளிவான ஏபிஐ அடுக்கை அறிமுகப்படுத்துவதன் மூலம் முன்பக்கக் காட்சி கூறுகளை சிக்கலான தரவுத்தள தர்க்கத்திலிருந்து சார்பற்றதாக மாற்ற பொறியாளர்கள் முடிவு செய்தனர்.",
    synonyms: ["Isolate", "Separate", "Disconnect", "Disentangle", "Modularize"],
    antonyms: ["Couple", "Bind", "Entangle", "Integrate", "Intertwine"]
  },
  {
    word: "Backpressure",
    pos: "noun",
    definition: "A mechanism that slows down data production when a downstream consumer or network socket cannot keep up with incoming data.",
    taWord: "பின்நோக்கிய அழுத்தக் கட்டுப்பாடு / வரத்துத் தடுப்பு நெறிமுறை",
    enExample: "Reactive streaming protocols implement backpressure to prevent fast data producers from overwhelming memory buffers.",
    taExample: "வேகமான தரவு உற்பத்தியாளர்கள் நினைவக இடையகங்களை நிரப்பி முடக்குவதைத் தடுக்க எதிர்வினை ஸ்ட்ரீமிங் நெறிமுறைகள் வரத்துத் தடுப்பு நெறிமுறையை செயல்படுத்துகின்றன.",
    enExample2: "Without backpressure controls in microservices, sudden traffic spikes can cause catastrophic out-of-memory crashes.",
    taExample2: "மைக்ரோ சர்வீஸ்களில் பின்நோக்கிய அழுத்தக் கட்டுப்பாடு இல்லையெனில், திடீர் போக்குவரத்து நெரிசல் பேரழிவு நினைவக செயலிழப்பை ஏற்படுத்தக்கூடும்.",
    synonyms: ["Flow control", "Rate limiting", "Throttling", "Load regulation", "Buffering"],
    antonyms: ["Uncontrolled overflow", "Flooding", "Congestion"]
  },
  {
    word: "Telemetry",
    pos: "noun",
    definition: "The automated recording, collection, and transmission of application performance metrics, traces, and operational logs.",
    taWord: "தானியங்கி இயக்கக் கண்காணிப்புத் தரவு / செயல்திறன் அளவீட்டுத் தகவல்",
    enExample: "Cloud monitoring platforms ingest real-time telemetry to trigger alerts whenever error rates exceed acceptable thresholds.",
    taExample: "கிளவுட் கண்காணிப்பு தளங்கள் பிழை விகிதங்கள் வரம்பைத் தாண்டும் போதெல்லாம் எச்சரிக்கைகளைத் தூண்டுவதற்கு நிகழ்நேர இயக்கத் தரவை உள்ளிழுக்கின்றன.",
    enExample2: "Adding OpenTelemetry spans to your API endpoints provides deep visibility into microservice latency bottlenecks.",
    taExample2: "உங்கள் ஏபிஐ முனையங்களில் ஓபன்டெலிமெட்ரி கண்காணிப்பைச் சேர்ப்பது மைக்ரோ சர்வீஸ் தாமதத் தடைகள் பற்றிய ஆழ்ந்த நுண்ணறிவை வழங்குகிறது.",
    synonyms: ["Instrumentation", "Observability", "Metrics", "Monitoring", "Surveillance"],
    antonyms: ["Blindness", "Obscurity", "Non-instrumentation"]
  },
  {
    word: "Memoization",
    pos: "noun",
    definition: "An optimization technique that caches the return values of expensive function calls to return immediately when identical inputs occur.",
    taWord: "முடிவுகளை நினைவகத்தில் சேமித்து வேகப்படுத்தும் நுட்பம் / தற்காலிக நினைவக உத்தி",
    enExample: "React's useMemo hook uses memoization to avoid running heavy mathematical computations on every component re-render.",
    taExample: "ரியாக்டின் useMemo ஹூக் ஒவ்வொரு கூறு மறுவடிவமைப்பிலும் கனமான கணிதக் கணக்கீடுகளை மீண்டும் செய்வதைத் தவிர்க்க நினைவக சேமிப்பு உத்தியைப் பயன்படுத்துகிறது.",
    enExample2: "Dynamic programming solutions rely on memoization of subproblems to reduce exponential time complexity to linear time.",
    taExample2: "டைனமிக் புரோகிராமிங் தீர்வுகள் அதிவேக நேர சிக்கலைக் குறைத்து நேரியல் நேரமாக மாற்ற துணை சிக்கல்களின் நினைவக சேமிப்பை நம்பியுள்ளன.",
    synonyms: ["Caching", "Lookup storage", "Optimization", "Precomputation", "Tabulation"],
    antonyms: ["Recomputation", "Recalculation", "Redundant processing"]
  },
  {
    word: "Orchestration",
    pos: "noun",
    definition: "The automated coordination, scheduling, scaling, and management of complex computer systems, containers, and microservices.",
    taWord: "ஒருங்கிணைந்த ஆளுமை / தானியங்கி மேலாண்மை மற்றும் கட்டளை இயக்கம்",
    enExample: "Kubernetes simplifies container orchestration by automatically scaling pods and repairing failing worker nodes.",
    taExample: "குபெர்னெட்ஸ் தானாகவே கன்டெய்னர்களை அளவிடுவதன் மூலமும் தோல்வியடையும் கணினி முனைகளை சரிசெய்வதன் மூலமும் கன்டெய்னர் தானியங்கி மேலாண்மையை எளிதாக்குகிறது.",
    enExample2: "Workflow orchestration engines like Temporal manage long-running business transactions with built-in retry logic.",
    taExample2: "டெம்போரல் போன்ற பணிப்பாய்வு மேலாண்மை இயந்திரங்கள் உள்ளமைக்கப்பட்ட மறுமுயற்சி தர்க்கத்துடன் நீண்ட கால வணிகப் பரிவர்த்தனைகளை நிர்வகிக்கின்றன.",
    synonyms: ["Coordination", "Management", "Automation", "Organization", "Supervision"],
    antonyms: ["Disorganization", "Chaos", "Manual deployment", "Fragmentation"]
  },
  {
    word: "Sharding",
    pos: "noun",
    definition: "A database partitioning technique that splits a large dataset horizontally across multiple server instances to scale reads and writes.",
    taWord: "தரவுத்தளத்தைப் பிரித்து பகிர்ந்தளிக்கும் முறை / கிடைமட்டப் பகிர்வு",
    enExample: "Database sharding allows e-commerce platforms to distribute billions of customer records across globally distributed nodes.",
    taExample: "தரவுத்தளப் பகிர்வு முறை இணையவழி வர்த்தக தளங்கள் பல பில்லியன் வாடிக்கையாளர் பதிவுகளை உலகளவில் விநியோகிக்கப்பட்ட முனையங்களில் பரப்ப அனுமதிக்கிறது.",
    enExample2: "Choosing the correct partition key is the most critical decision when planning a database sharding strategy.",
    taExample2: "ஒரு தரவுத்தள பகிர்வு உத்தியைத் திட்டமிடும் போது சரியான பகிர்வு விசையைத் தேர்ந்தெடுப்பது மிகவும் முக்கியமான முடிவாகும்.",
    synonyms: ["Partitioning", "Horizontal scaling", "Data distribution", "Segmentation", "Splitting"],
    antonyms: ["Monolithic storage", "Centralization", "Single-instance storage"]
  },
  {
    word: "Deadlock",
    pos: "noun",
    definition: "A condition in concurrent programming where two or more processes are permanently stuck because each is waiting for a resource held by the other.",
    taWord: "முட்டுக்கட்டை நிலை / ஒன்றையொன்று தடுத்து முடங்கும் நிலை",
    enExample: "A database deadlock occurred when transaction A locked the users table while transaction B locked the accounts table.",
    taExample: "பரிவர்த்தனை A பயனர்கள் அட்டவணையைப் பூட்டிய அதே வேளையில் பரிவர்த்தனை B கணக்குகள் அட்டவணையைப் பூட்டியதால் தரவுத்தள முட்டுக்கட்டை நிலை ஏற்பட்டது.",
    enExample2: "Carefully ordering lock acquisitions across distributed threads is key to avoiding concurrent deadlocks.",
    taExample2: "இணைநிலை இழைகளில் பூட்டுகளைப் பெறுவதை வரிசைப்படுத்துவது ஒரே நேரத்தில் ஏற்படும் முட்டுக்கட்டை நிலைகளைத் தவிர்ப்பதற்கு முக்கியமாகும்.",
    synonyms: ["Stalemate", "Impasse", "Gridlock", "Freeze", "Stoppage"],
    antonyms: ["Throughput", "Progress", "Resolution", "Flow"]
  },
  {
    word: "Polymorphism",
    pos: "noun",
    definition: "The object-oriented programming principle allowing entities of different types to be handled through a unified interface.",
    taWord: "பல்வகைமை / பல வடிவங்களை ஏற்கும் பண்பு",
    enExample: "Polymorphism allows our payment processor to execute payments without knowing whether the card is Visa or Mastercard.",
    taExample: "பல்வகைமைப் பண்பு அட்டை விசா அல்லது மாஸ்டர்கார்டா என்பதை அறியாமலேயே கட்டணத்தை செயல்படுத்த எங்கள் கட்டண முறைமைக்கு உதவுகிறது.",
    enExample2: "TypeScript interfaces achieve polymorphism by ensuring distinct classes implement the same public methods.",
    taExample2: "டைப்ஸ்கிரிப்ட் இடைமுகங்கள் வெவ்வேறு வகுப்புகள் ஒரே பொதுவான முறைகளை செயல்படுத்துவதை உறுதி செய்வதன் மூலம் பல்வகைமையை அடைகின்றன.",
    synonyms: ["Multiformity", "Flexibility", "Dynamic dispatch", "Adaptability", "Variability"],
    antonyms: ["Monomorphism", "Rigidity", "Uniformity", "Inflexibility"]
  },
  {
    word: "Deterministic",
    pos: "adjective",
    definition: "Describing an algorithm or function that will always produce the exact same output when given the same initial input.",
    taWord: "முன்கூட்டியே கணிக்கக்கூடிய / மாறாத ஒரே விடை தரும்",
    enExample: "Pure functions are deterministic because their return value depends solely on their explicit input parameters.",
    taExample: "தூய செயல்பாடுகள் முன்கூட்டியே கணிக்கக்கூடியவை, ஏனெனில் அவற்றின் விடை அவற்றின் உள்ளீட்டு அளவுருக்களை மட்டுமே சார்ந்துள்ளது.",
    enExample2: "Unit tests are most reliable when code execution is entirely deterministic without random or hidden clock dependencies.",
    taExample2: "சீரற்ற அல்லது மறைக்கப்பட்ட கடிகார சார்புகள் இல்லாமல் குறியீடு இயக்கம் முற்றிலும் கணிக்கக்கூடியதாக இருக்கும்போது சோதனைகள் நம்பகமானதாக இருக்கும்.",
    synonyms: ["Predictable", "Consistent", "Repeatable", "Definite", "Calculable"],
    antonyms: ["Nondeterministic", "Stochastic", "Random", "Unpredictable", "Erratic"]
  }
];

let insertedCount = 0;
const insertedByLetter = {};

devCandidates.forEach(cand => {
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

console.log(`\nDeveloper candidates processed: ${devCandidates.length}`);
console.log(`Inserted: ${insertedCount}`);
console.log(`Breakdown by letter:`, insertedByLetter);
