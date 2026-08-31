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

const devCandidates2 = [
  {
    word: "Serialization",
    pos: "noun",
    definition: "The process of converting an in-memory data object or graph into a byte stream or text format (such as JSON or Protobuf) for storage or transmission.",
    taWord: "தரவை வரிசைப்படுத்தி மாற்றும் முறை / தரவு உருமாற்றம்",
    enExample: "Fast JSON serialization is crucial when transmitting real-time stock price streams across web sockets.",
    taExample: "இணைய சாக்கெட்டுகள் வழியாக நிகழ்நேர பங்கு விலை ஸ்ட்ரீம்களை அனுப்பும்போது வேகமான JSON தரவு உருமாற்றம் முக்கியமானது.",
    enExample2: "Protobuf provides binary serialization that dramatically reduces network payload size compared to plain text.",
    taExample2: "ப்ரோட்டோபஃப் எளிய உரையை விட நெட்வொர்க் பேலோட் அளவை வியத்தகு முறையில் குறைக்கும் பைனரி தரவு உருமாற்றத்தை வழங்குகிறது.",
    synonyms: ["Marshaling", "Encoding", "Formatting", "Transformation", "Data packaging"],
    antonyms: ["Deserialization", "Unmarshaling", "Decoding", "Parsing"]
  },
  {
    word: "Deserialization",
    pos: "noun",
    definition: "The process of reconstructing an in-memory data object or class from a byte stream or serialized text string.",
    taWord: "வரிசைப்படுத்தப்பட்ட தரவை மீண்டும் பொருளாக மீட்டெடுத்தல் / மறுஉருவாக்கம்",
    enExample: "Unsafe deserialization of untrusted user input can lead to remote code execution vulnerabilities.",
    taExample: "நம்பத்தகாத பயனர் உள்ளீட்டை பாதுகாப்பற்ற முறையில் மீட்டெடுப்பது தொலை குறியீட்டு இயக்க பாதிப்புகளுக்கு வழிவகுக்கும்.",
    enExample2: "The mobile app deserializes API responses into local TypeScript model instances.",
    taExample2: "மொபைல் செயலி ஏபிஐ பதில்களை உள்ளூர் டைப்ஸ்கிரிப்ட் மாதிரி நிகழ்வுகளாக மீண்டும் மீட்டெடுக்கிறது.",
    synonyms: ["Unmarshaling", "Decoding", "Reconstruction", "Object parsing"],
    antonyms: ["Serialization", "Marshaling", "Encoding"]
  },
  {
    word: "Reentrancy",
    pos: "noun",
    definition: "The property of a computer program or subroutine allowing it to be safely re-entered and executed concurrently or recursively before previous executions finish.",
    taWord: "பாதுகாப்பான மறுநுழைவுத் தன்மை / ஒரே நேரத்தில் பலமுறை இயங்கும் நிலைப்புத்தன்மை",
    enExample: "Smart contract developers must implement reentrancy guards to prevent malicious contract draining attacks.",
    taExample: "ஸ்மார்ட் ஒப்பந்த உருவாக்குநர்கள் தீங்கிழைக்கும் தாக்குதல்களைத் தடுக்க மறுநுழைவுப் பாதுகாப்புகளைச் செயல்படுத்த வேண்டும்.",
    enExample2: "Thread-safe logger functions require reentrancy to handle simultaneous calls from nested interrupt handlers.",
    taExample2: "பாதுகாப்பான லாகர் செயல்பாடுகள் உள்ளமை குறுக்கீடு கையாளுபவர்களிடமிருந்து ஒரே நேரத்தில் வரும் அழைப்புகளைக் கையாள மறுநுழைவுத் தன்மை தேவைப்படுகிறது.",
    synonyms: ["Thread-safety", "Concurrent safety", "Interruptibility", "Idempotent execution"],
    antonyms: ["Non-reentrancy", "Race susceptibility", "Vulnerability"]
  },
  {
    word: "Throttling",
    pos: "noun",
    definition: "The intentional regulation or rate-limiting of execution frequency or network bandwidth to protect server resources from being overwhelmed.",
    taWord: "வேகக் கட்டுப்பாடு / பயன்பாட்டு வரம்பு நிர்ணயம்",
    enExample: "API gateways implement client throttling to prevent denial-of-service traffic spikes.",
    taExample: "சேவை மறுப்பு போக்குவரத்து அதிகரிப்பைத் தடுக்க ஏபிஐ நுழைவாயில்கள் வாடிக்கையாளர் வேகக் கட்டுப்பாட்டை செயல்படுத்துகின்றன.",
    enExample2: "In frontend development, throttling scroll event handlers preserves smooth 60fps frame rates.",
    taExample2: "முன்பக்க உருவாக்கத்தில், ஸ்க்ரோல் நிகழ்வுக் கையாளுபவர்களின் வேகத்தைக் கட்டுப்படுத்துவது மென்மையான 60fps காட்சி வேகத்தைப் பாதுகாக்கிறது.",
    synonyms: ["Rate limiting", "Pacing", "Choking", "Regulating", "Constraining"],
    antonyms: ["Unconstrained burst", "Overclocking", "Flooding"]
  },
  {
    word: "Debounce",
    pos: "verb",
    definition: "To delay function execution until a specified duration has elapsed since the last time the trigger event was fired.",
    taWord: "தாமதப்படுத்தி இயக்கும் உத்தி / தொடர் அழைப்புகளை ஒருங்கிணைத்தல்",
    enExample: "We debounce the search input by 300 milliseconds so backend queries only run after the user finishes typing.",
    taExample: "பயனர் தட்டச்சு செய்து முடித்த பின்னரே தேடல் வினவல்கள் இயங்கும் வகையில் நாங்கள் தேடல் உள்ளீட்டை 300 மில்லி விநாடிகள் தாமதப்படுத்துகிறோம்.",
    enExample2: "Debouncing window resize listeners prevents unnecessary layout recalculations on every pixel shift.",
    taExample2: "சாளர அளவு மாற்றத்தைக் கண்காணிக்கும் அழைப்புகளை ஒருங்கிணைப்பது ஒவ்வொரு பிக்சல் மாற்றத்தின் போதும் தேவையற்ற தளவமைப்பு மறு கணக்கீடுகளைத் தடுக்கிறது.",
    synonyms: ["Delay", "Batch", "Coalesce", "Stabilize", "Postpone"],
    antonyms: ["Immediate trigger", "Instant dispatch", "Continuous fire"]
  },
  {
    word: "Idempotence",
    pos: "noun",
    definition: "The quality of an action or system state whereby making repeated requests yields identical system state changes.",
    taWord: "மாறா விளைவுப் பண்பு / மறுசெய்கை நிலைப்புத்தன்மை",
    enExample: "Ensuring idempotence in distributed database transactions guarantees fault tolerance during network timeouts.",
    taExample: "விநியோகிக்கப்பட்ட தரவுத்தளப் பரிவர்த்தனைகளில் மாறா விளைவுப் பண்பை உறுதி செய்வது நெட்வொர்க் காலக்கெடுவின் போது பிழை சகிப்புத்தன்மையை உறுதி செய்கிறது.",
    enExample2: "Architects verify the idempotence of webhooks before deploying them to mission-critical infrastructure.",
    taExample2: "முக்கிய உள்கட்டமைப்பில் வெப்ஹூக்குகளைப் பயன்படுத்துவதற்கு முன் கட்டடக் கலைஞர்கள் அவற்றின் மாறா விளைவுப் பண்பைச் சரிபார்க்கிறார்கள்.",
    synonyms: ["Repeatability", "Consistency", "Invariance", "Determinism"],
    antonyms: ["Non-idempotence", "State volatility", "Side-effect instability"]
  },
  {
    word: "Observability",
    pos: "noun",
    definition: "The extent to which the internal state of a software system can be inferred solely from knowledge of its external outputs, metrics, and traces.",
    taWord: "கணினி உள்நிலைக் கண்காணிப்புத் திறன் / வெளிப்படைத்தன்மை",
    enExample: "Modern cloud microservices require robust observability through unified logs, metrics, and distributed traces.",
    taExample: "நவீன கிளவுட் மைக்ரோ சர்வீஸ்களுக்கு ஒருங்கிணைந்த பதிவுகள், அளவீடுகள் மற்றும் விநியோகிக்கப்பட்ட தடயங்கள் மூலம் வலுவான கண்காணிப்புத் திறன் தேவைப்படுகிறது.",
    enExample2: "High observability dramatically shortens the Mean Time to Resolution (MTTR) during major production outages.",
    taExample2: "அதிக உள்நிலைக் கண்காணிப்புத் திறன் பெரிய தயாரிப்பு முடக்கங்களின் போது சிக்கலைத் தீர்ப்பதற்கான சராசரி நேரத்தை (MTTR) வியத்தகு முறையில் குறைக்கிறது.",
    synonyms: ["Visibility", "Traceability", "Transparency", "Monitoring", "Auditability"],
    antonyms: ["Opacity", "Black-box nature", "Obscurity"]
  },
  {
    word: "Polyfill",
    pos: "noun",
    definition: "A piece of code or client library used to provide modern web functionality to older browsers that do not natively support it.",
    taWord: "பழைய உலாவிகளுக்கான நவீன வசதி நிரல் / இணக்கத்தன்மை நிரல்",
    enExample: "Adding a Promise polyfill ensured that legacy enterprise browsers could run modern asynchronous JavaScript.",
    taExample: "பிராமிஸ் இணக்கத்தன்மை நிரலைச் சேர்த்தது பழைய நிறுவன உலாவிகள் நவீன ஒத்திசைவற்ற ஜாவாஸ்கிரிப்டை இயக்க முடியும் என்பதை உறுதி செய்தது.",
    enExample2: "Vite automatically injects polyfills when targeting legacy browser compilation targets.",
    taExample2: "பழைய உலாவி தொகுப்பு இலக்குகளை இலக்காகக் கொள்ளும்போது வைட் தானாகவே இணக்கத்தன்மை நிரல்களைச் செலுத்துகிறது.",
    synonyms: ["Shim", "Fallback script", "Compatibility layer", "Adapter"],
    antonyms: ["Native API", "Standard implementation"]
  },
  {
    word: "Refactor",
    pos: "verb",
    definition: "To restructure existing computer code without changing its external behavior to improve non-functional attributes like readability and maintainability.",
    taWord: "குறியீட்டை சீரமைத்தல் / செயல்பாட்டை மாற்றாமல் கட்டமைப்பை மேம்படுத்துதல்",
    enExample: "The engineering team scheduled a sprint to refactor messy legacy authentication controllers into clean service modules.",
    taExample: "சிக்கலான பழைய அங்கீகாரக் குறியீடுகளை சுத்தமான சேவை தொகுதிகளாகச் சீரமைக்க பொறியியல் குழு ஒரு திட்டத்தை வகுத்தது.",
    enExample2: "Always ensure unit test suites pass completely before and after you refactor core algorithms.",
    taExample2: "முக்கிய அல்காரிதம்களை சீரமைப்பதற்கு முன்னும் பின்னும் யூனிட் சோதனைத் தொகுப்புகள் முழுமையாக தேர்ச்சி பெறுவதை எப்போதும் உறுதிப்படுத்தவும்.",
    synonyms: ["Restructure", "Clean up", "Reorganize", "Streamline", "Optimize"],
    antonyms: ["Degrade", "Spaghetti code", "Complicate", "Muddle"]
  },
  {
    word: "Provenance",
    pos: "noun",
    definition: "The documented lineage, history, ownership, and chain of custody of a software artifact, code commit, or dependency package.",
    taWord: "குறியீட்டின் தோற்றுவாய் வரலாறு / மென்பொருள் உருவாக்கப் பின்னணி",
    enExample: "Verifying the provenance of third-party npm packages protects build pipelines against malicious supply-chain attacks.",
    taExample: "மூன்றாம் தரப்பு npm தொகுப்புகளின் தோற்றுவாய் வரலாற்றைச் சரிபார்ப்பது தீங்கிழைக்கும் விநியோகச் சங்கிலித் தாக்குதல்களிலிருந்து உருவாக்க பைப்லைன்களைப் பாதுகாக்கிறது.",
    enExample2: "Cryptographic signatures on container images provide immutable proof of build provenance.",
    taExample2: "கன்டெய்னர் படங்களின் கிரிப்டோகிராஃபிக் கையொப்பங்கள் உருவாக்கப்பட்ட தோற்றுவாய் வரலாற்றுக்கான மாறாத ஆதாரத்தை வழங்குகின்றன.",
    synonyms: ["Origin", "Lineage", "Traceability", "History", "Authenticity"],
    antonyms: ["Anonymity", "Spuriousness", "Unverified origin"]
  },
  {
    word: "Microkernel",
    pos: "noun",
    definition: "A minimalist operating system or architecture that provides only the core mechanisms necessary to run an OS, moving services to user space.",
    taWord: "நுண் மையக்கட்டமைப்பு / எளிய அடிப்படை இயங்குதளக் கருவம்",
    enExample: "Microkernel architectures prioritize system security and modular fault isolation over raw monolithic speed.",
    taExample: "நுண் மையக்கட்டமைப்புகள் கணினி பாதுகாப்பு மற்றும் மட்டுப் பிழை தனிமைப்படுத்தலுக்கு முன்னுரிமை அளிக்கின்றன.",
    enExample2: "In a microkernel design, device drivers and file systems execute safely in isolated user space processes.",
    taExample2: "ஒரு நுண் மைய அமைப்பில், சாதன இயக்கிகள் மற்றும் கோப்பு முறைமைகள் தனிமைப்படுத்தப்பட்ட பயனர் செயல்முறைகளில் பாதுகாப்பாக இயங்குகின்றன.",
    synonyms: ["Modular kernel", "Minimal kernel", "Core architecture"],
    antonyms: ["Monolithic kernel", "All-in-one architecture"]
  },
  {
    word: "Sandboxing",
    pos: "noun",
    definition: "A security practice of running untested or untrusted code in an isolated environment with restricted system privileges.",
    taWord: "பாதுகாப்பான தனிமைப்படுத்தப்பட்ட சூழலில் இயக்குதல் / தனிமைச் சூழல் பாதுகாப்பு",
    enExample: "Modern web browsers use strict process sandboxing so compromised tabs cannot access the operating system.",
    taExample: "நவீன இணைய உலாவிகள் கடுமையான தனிமைச் சூழலைப் பயன்படுத்துகின்றன, இதனால் பாதிக்கப்பட்ட தாவல்கள் இயங்குதளத்தை அணுக முடியாது.",
    enExample2: "Sandboxing plugin execution ensures that third-party extensions cannot steal sensitive user tokens.",
    taExample2: "செருகுநிரல் இயக்கத்தைத் தனிமைப்படுத்துவது மூன்றாம் தரப்பு நீட்டிப்புகள் முக்கியமான பயனர் டோக்கன்களைத் திருட முடியாது என்பதை உறுதி செய்கிறது.",
    synonyms: ["Isolation", "Containment", "Segregation", "Jailing", "Quarantine"],
    antonyms: ["Unrestricted execution", "Privileged execution", "Direct exposure"]
  }
];

let insertedCount = 0;
const insertedByLetter = {};

devCandidates2.forEach(cand => {
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

console.log(`\nDeveloper candidates batch 2 processed: ${devCandidates2.length}`);
console.log(`Inserted: ${insertedCount}`);
console.log(`Breakdown by letter:`, insertedByLetter);
