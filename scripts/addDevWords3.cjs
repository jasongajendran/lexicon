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

const devCandidates3 = [
  {
    word: "Transpilation",
    pos: "noun",
    definition: "The process of translating source code written in one high-level programming language into another language at a similar abstraction level (such as TypeScript to JavaScript).",
    taWord: "மூலக் குறியீட்டை மற்றொரு மொழியாக மாற்றுதல் / மொழிபெயர்ப்புத் தொகுப்பு",
    enExample: "Babel and TypeScript compilers handle transpilation to guarantee backward compatibility with older browsers.",
    taExample: "பேபல் மற்றும் டைப்ஸ்கிரிப்ட் கம்பைலர்கள் பழைய உலாவிகளுடன் பின்னோக்கிய இணக்கத்தன்மையை உறுதிப்படுத்த மொழிபெயர்ப்புத் தொகுப்பைக் கையாளுகின்றன.",
    enExample2: "Modern build tools like esbuild execute transpilation in milliseconds using multi-threaded native binaries.",
    taExample2: "esbuild போன்ற நவீன உருவாக்கக் கருவிகள் நேட்டிவ் பைனரிகளைப் பயன்படுத்தி மில்லி விநாடிகளில் மூலக் குறியீட்டு மொழிபெயர்ப்பை இயக்குகின்றன.",
    synonyms: ["Source-to-source compilation", "Translation", "Transcompilation", "Code conversion"],
    antonyms: ["Machine code compilation", "Interpretation", "Direct execution"]
  },
  {
    word: "Monorepo",
    pos: "noun",
    definition: "A software development strategy where code for multiple related projects, libraries, and microservices is stored in a single version-controlled repository.",
    taWord: "ஒற்றைக் களஞ்சியக் கட்டமைப்பு / ஒருங்கிணைந்த குறியீட்டுக் களஞ்சியம்",
    enExample: "Using a monorepo allows frontend and backend teams to share TypeScript types and utility libraries seamlessly.",
    taExample: "ஒற்றைக் களஞ்சியக் கட்டமைப்பைப் பயன்படுத்துவது முன்பக்க மற்றும் பின்பக்கக் குழுக்கள் டைப்ஸ்கிரிப்ட் வகைகளையும் பயன்பாட்டு நூலகங்களையும் தடையின்றிப் பகிர அனுமதிக்கிறது.",
    enExample2: "Turborepo and Nx optimize build pipelines across large monorepo architectures by caching previous task outputs.",
    taExample2: "டர்போரெப்போ மற்றும் என்எக்ஸ் ஆகியவை முந்தைய பணி வெளியீடுகளை கேச் செய்வதன் மூலம் பெரிய ஒற்றைக் களஞ்சியங்களில் பைப்லைன்களை மேம்படுத்துகின்றன.",
    synonyms: ["Single repository", "Unified codebase", "Monolithic repository", "Multi-package repository"],
    antonyms: ["Polyrepo", "Multi-repo", "Decentralized repositories"]
  },
  {
    word: "Idempotency",
    pos: "noun",
    definition: "The mathematical and computer engineering property wherein an operation produces identical system outcomes regardless of how many times it is executed.",
    taWord: "மறுசெய்கை மாறாத்தன்மை / ஒரே முடிவை உண்டாக்கும் தத்துவம்",
    enExample: "Payment gateways require strict idempotency to ensure network retries never trigger duplicate credit card deductions.",
    taExample: "நெட்வொர்க் மறுமுயற்சிகள் கிரெடிட் கார்டு தொகையை இருமுறை கழிப்பதைத் தவிர்க்க கட்டண நுழைவாயில்களுக்கு கடுமையான மறுசெய்கை மாறாத்தன்மை தேவைப்படுகிறது.",
    enExample2: "Cloud infrastructure provisioning scripts must maintain idempotency so re-running them does not corrupt servers.",
    taExample2: "கிளவுட் உள்கட்டமைப்பு ஸ்கிரிப்டுகள் மறுசெய்கை மாறாத்தன்மையைப் பேண வேண்டும், இதனால் அவற்றை மீண்டும் இயக்குவது சேவையகங்களை பாதிக்காது.",
    synonyms: ["Invariance", "Deterministic repeatability", "Consistency", "State safety"],
    antonyms: ["State mutation", "Side-effect hazard", "Non-idempotency"]
  },
  {
    word: "Hotpatching",
    pos: "noun",
    definition: "The technique of applying bug fixes, patches, or security updates to running software without rebooting or restarting the process.",
    taWord: "இயங்கும்போதே பிழை திருத்துதல் / நேரடி இணைப்புக் குறியீடு",
    enExample: "High-availability Linux servers utilize kernel hotpatching to fix critical vulnerabilities with zero customer downtime.",
    taExample: "அதிநவீன லினக்ஸ் சேவையகங்கள் வாடிக்கையாளர் முடக்க நேரம் எதுவுமின்றி முக்கியமான பாதிப்புகளைச் சரிசெய்ய நேரடி இணைப்புக் குறியீட்டைப் பயன்படுத்துகின்றன.",
    enExample2: "Game developers deployed a client hotpatch to immediately resolve a critical rendering exploit.",
    taExample2: "விளையாட்டு உருவாக்குநர்கள் முக்கியமான ரெண்டரிங் பிழையை உடனடியாகத் தீர்க்க நேரடி இணைப்புக் குறியீட்டைப் பயன்படுத்தினர்.",
    synonyms: ["Live patching", "Dynamic updating", "Zero-downtime fix", "Runtime patching"],
    antonyms: ["Reboot patching", "Cold restart", "Scheduled downtime maintenance"]
  },
  {
    word: "Heuristic",
    pos: "noun",
    definition: "A practical, rule-of-thumb problem-solving technique or algorithm that finds an approximate or satisfactory solution when finding an optimal one is impractical.",
    taWord: "நடைமுறை தோராய உத்தி / விரைவு தீர்வு விதி",
    enExample: "Search engines employ a ranking heuristic to return relevant query results in under fifty milliseconds.",
    taExample: "தேடுபொறிகள் ஐம்பது மில்லி விநாடிகளுக்குள் பொருத்தமான வினவல் முடிவுகளை வழங்க தரவரிசை நடைமுறை தோராய உத்தியைப் பயன்படுத்துகின்றன.",
    enExample2: "Antivirus scanners use behavioral heuristics to detect unknown zero-day malware before official signatures exist.",
    taExample2: "வைரஸ் தடுப்பு ஸ்கேனர்கள் அதிகாரப்பூர்வ கையொப்பங்கள் தோன்றுவதற்கு முன்பே தெரியாத மால்வேரைக் கண்டறிய நடத்தை சார்ந்த விரைவு தீர்வு விதியைப் பயன்படுத்துகின்றன.",
    synonyms: ["Rule of thumb", "Approximation", "Shortcut", "Practical rule", "Empirical method"],
    antonyms: ["Exact algorithm", "Exhaustive search", "Deterministic proof"]
  },
  {
    word: "Ingress",
    pos: "noun",
    definition: "The entry point or routing mechanism that manages external network traffic entering a cluster or cloud computing network.",
    taWord: "உள்வரும் போக்குவரத்து நுழைவாயில் / வலையமைப்பு உள்வருகை",
    enExample: "The Kubernetes Ingress controller routes external SSL traffic directly to the appropriate backend microservices.",
    taExample: "குபெர்னெட்ஸ் இன்க்ரஸ் கன்ட்ரோலர் வெளிப்புற SSL போக்குவரத்தை நேரடியாக பொருத்தமான பின்பக்க மைக்ரோ சர்வீஸ்களுக்கு வழிநடத்துகிறது.",
    enExample2: "Configuring strict ingress firewall rules prevents unauthorized IP addresses from reaching internal staging databases.",
    taExample2: "கடுமையான உள்வருகை ஃபயர்வால் விதிகளை அமைப்பது அங்கீகரிக்கப்படாத ஐபி முகவரிகள் உள் தரவுத்தளங்களை அணுகுவதைத் தடுக்கிறது.",
    synonyms: ["Entry point", "Gateway", "Inflow", "Incoming route", "Access door"],
    antonyms: ["Egress", "Exit", "Outflow", "Outbound route"]
  },
  {
    word: "Egress",
    pos: "noun",
    definition: "The network traffic that exits a cloud data center, private cluster, or virtual private cloud (VPC) to the external internet.",
    taWord: "வெளியேறும் போக்குவரத்து / வலையமைப்பு வெளிச்செல்கை",
    enExample: "Cloud providers charge egress fees whenever users download large database backups over the public internet.",
    taExample: "பயனர்கள் பொது இணையத்தில் பெரிய தரவுத்தள காப்புப்பிரதிகளைப் பதிவிறக்கும் போதெல்லாம் கிளவுட் வழங்குநர்கள் வெளியேறும் போக்குவரத்துக் கட்டணத்தை வசூலிக்கிறார்கள்.",
    enExample2: "Security teams inspect all outbound egress traffic to detect data exfiltration attempts by compromised machines.",
    taExample2: "பாதிக்கப்பட்ட கணினிகளால் தரவு திருடப்படுவதைக் கண்டறிய பாதுகாப்புக் குழுக்கள் வெளியேறும் அனைத்து நெட்வொர்க் போக்குவரத்தையும் ஆய்வு செய்கின்றன.",
    synonyms: ["Outbound traffic", "Exit route", "Outflow", "Discharge", "Departure"],
    antonyms: ["Ingress", "Inflow", "Inbound traffic", "Entry"]
  },
  {
    word: "Linting",
    pos: "noun",
    definition: "The automated static analysis of source code to flag syntax errors, code style violations, potential bugs, and anti-patterns before compilation.",
    taWord: "தானியங்கி குறியீட்டு ஆய்வு / முன்கூட்டியே பிழை மற்றும் நடை சரிபார்த்தல்",
    enExample: "Running ESLint in our continuous integration pipeline catches unhandled edge cases and styling mistakes automatically.",
    taExample: "எங்கள் தொடர் ஒருங்கிணைப்பு பைப்லைனில் ESLint-ஐ இயக்குவது கையாளப்படாத விளிம்பு நிகழ்வுகளையும் நடைப் பிழைகளையும் தானாகவே கண்டறிகிறது.",
    enExample2: "Strict linting rules enforce consistent formatting and naming conventions across massive engineering organizations.",
    taExample2: "கடுமையான குறியீட்டு ஆய்வு விதிகள் பெரிய பொறியியல் நிறுவனங்களில் சீரான வடிவமைப்பு மற்றும் பெயரிடும் மரபுகளை செயல்படுத்துகின்றன.",
    synonyms: ["Static analysis", "Code inspection", "Syntax checking", "Style validation"],
    antonyms: ["Dynamic testing", "Runtime inspection", "Manual review"]
  }
];

let insertedCount = 0;
const insertedByLetter = {};

devCandidates3.forEach(cand => {
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

console.log(`\nDeveloper candidates batch 3 processed: ${devCandidates3.length}`);
console.log(`Inserted: ${insertedCount}`);
console.log(`Breakdown by letter:`, insertedByLetter);
