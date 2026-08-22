const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data');

// Load all existing words to ensure zero collisions
let maxId = 0;
const existingWordsSet = new Set();
const fileWordMap = {};

fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.json')) {
    const filePath = path.join(dataDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    fileWordMap[file] = content;
    content.forEach(item => {
      existingWordsSet.add(item.word.toLowerCase().trim());
      if (item.id > maxId) maxId = item.id;
    });
  }
});

console.log(`Current existing words: ${existingWordsSet.size}, Max ID: ${maxId}`);

const newWords = [
  // A
  {
    word: "Absurd",
    pos: "adjective",
    definition: "Wildly unreasonable, illogical, or inappropriate; utterly foolish or ridiculous.",
    taWord: "பொருத்தமற்ற / அறிவுக்கு ஒவ்வாத / அபத்தமான",
    enExample: "The executive dismissed the allegation as an absurd rumor with no basis in financial reality.",
    taExample: "நிதி உண்மைகளுக்கு எந்த தொடர்பும் இல்லாத அபத்தமான வதந்தி என்று நிர்வாகி அந்த குற்றச்சாட்டை நிராகரித்தார்.",
    enExample2: "In modern theater, playwrights often use absurd situations to expose the ironies of everyday existence.",
    taExample2: "நவீன நாடகங்களில், அன்றாட வாழ்க்கையின் முரண்பாடுகளை வெளிக்கொணர நாடக ஆசிரியர்கள் அபத்தமான சூழ்நிலைகளைப் பயன்படுத்துகின்றனர்.",
    synonyms: ["Preposterous", "Ludicrous", "Ridiculous", "Senseless"],
    antonyms: ["Logical", "Sensible", "Reasonable", "Rational"]
  },
  {
    word: "Anachronism",
    pos: "noun",
    definition: "A thing belonging or appropriate to a period other than that in which it exists, especially a thing that is conspicuously old-fashioned.",
    taWord: "காலப் பொருத்தமின்மை / காலத்திற்கு ஒவ்வாத ஒன்று",
    enExample: "Critics pointed out that the presence of a wristwatch in the medieval drama was a glaring anachronism.",
    taExample: "மத்திய கால நாடகத்தில் கைக்கடிகாரம் இடம்பெற்றது அப்பட்டமான காலப் பொருத்தமின்மை என்று விமர்சகர்கள் சுட்டிக்காட்டினர்.",
    enExample2: "In today's cloud-first engineering landscape, maintaining on-premises legacy servers has become an anachronism.",
    taExample2: "இன்றைய கிளவுட் சார்ந்த பொறியியல் சூழலில், பழைய சர்வர்களை பராமரிப்பது காலத்திற்கு ஒவ்வாத ஒன்றாக மாறிவிட்டது.",
    synonyms: ["Misplacement", "Archaism", "Chronological error", "Incongruity"],
    antonyms: ["Synchronism", "Contemporary match", "Modernity"]
  },
  {
    word: "Antithesis",
    pos: "noun",
    definition: "A person or thing that is the direct opposite of someone or something else; a sharp contrast or opposition.",
    taWord: "நேர் எதிர் / முரண் நிலை",
    enExample: "The new CEO's transparent leadership style was the exact antithesis of her secretive predecessor.",
    taExample: "புதிய தலைமை நிர்வாகியின் வெளிப்படையான தலைமைப் பண்பு, அவருக்கு முன் இருந்தவரின் ரகசிய பாணிக்கு நேர் எதிரானதாக இருந்தது.",
    enExample2: "In scholarly debate, presenting an antithesis is crucial to evaluating the validity of the primary thesis.",
    taExample2: "கல்விசார் விவாதத்தில், முதன்மை ஆய்வுக் கருத்தின் நம்பகத்தன்மையை மதிப்பிடுவதற்கு முரண் நிலையை முன்வைப்பது அவசியமாகும்.",
    synonyms: ["Opposite", "Converse", "Reverse", "Counterpart"],
    antonyms: ["Synonym", "Equivalent", "Parallel", "Same"]
  },
  {
    word: "Asymmetry",
    pos: "noun",
    definition: "Lack of equality, balance, or equivalence between parts, systems, or opposing parties.",
    taWord: "சமச்சீரற்ற தன்மை / சமநிலையின்மை",
    enExample: "Information asymmetry in the financial markets allows institutional investors to gain an unfair advantage over retail traders.",
    taExample: "நிதிச் சந்தைகளில் உள்ள தகவல் சமநிலையின்மை, நிறுவன முதலீட்டாளர்கள் சில்லறை வர்த்தகர்களை விட அதிக பலன் பெற வழிவகுக்கிறது.",
    enExample2: "The system architect resolved the load asymmetry across worker nodes by implementing round-robin routing.",
    taExample2: "கணினி கட்டமைப்பாளர் ரவுண்ட்-ராபின் ரூட்டிங் அமைப்பதன் மூலம் சர்வர் முனைகளுக்கு இடையே உள்ள பணிச்சுமை சமநிலையின்மையை சரிசெய்தார்.",
    synonyms: ["Imbalance", "Disproportion", "Unevenness", "Disparity"],
    antonyms: ["Symmetry", "Balance", "Equivalence", "Proportion"]
  },
  {
    word: "Attrition",
    pos: "noun",
    definition: "The gradual reduction of workforce or strength through natural departures, sustained pressure, or fatigue.",
    taWord: "பணியாளர் வெளியேற்றம் / படிப்படியான தேய்மானம்",
    enExample: "The tech company managed employee attrition by introducing remote work flexibility and competitive stock grants.",
    taExample: "தொழில்நுட்ப நிறுவனம் தொலைதூர வேலை வசதி மற்றும் பங்கு சலுகைகளை அறிமுகப்படுத்தி பணியாளர் வெளியேற்றத்தை கட்டுப்படுத்தியது.",
    enExample2: "The defense correspondent reported that the protracted military conflict had turned into a grueling war of attrition.",
    taExample2: "நீண்ட கால ராணுவ மோதல் கடுமையான படிப்படியான தேய்மானப் போராக மாறிவிட்டதாக பாதுகாப்பு செய்தியாளர் தெரிவித்தார்.",
    synonyms: ["Erosion", "Depletion", "Reduction", "Wear and tear"],
    antonyms: ["Augmentation", "Expansion", "Recruitment", "Growth"]
  },
  {
    word: "Annexation",
    pos: "noun",
    definition: "The formal act of acquiring or incorporating a territory into another geopolitical entity, often by force or decree.",
    taWord: "இணைப்பு / பலவந்தமாக இணைத்துக்கொள்ளுதல்",
    enExample: "The BBC diplomatic editor analyzed the international sanctions imposed following the unlawful annexation of the border province.",
    taExample: "எல்லை மாகாணத்தை சட்டவிரோதமாக இணைத்துக்கொண்டதைத் தொடர்ந்து விதிக்கப்பட்ட சர்வதேச தடைகளை பிபிசி தூதரக ஆசிரியர் ஆய்வு செய்தார்.",
    enExample2: "Scholars debated whether the imperial expansion constituted legitimate federation or unilateral annexation.",
    taExample2: "பேரரசு விரிவாக்கம் சட்டபூர்வமான கூட்டமைப்பா அல்லது தன்னிச்சையான ஆக்கிரமிப்பா என்பதை அறிஞர்கள் விவாதித்தனர்.",
    synonyms: ["Seizure", "Occupation", "Incorporation", "Appropriation"],
    antonyms: ["Relinquishment", "Surrender", "Secession", "Cession"]
  },
  {
    word: "Authoritarian",
    pos: "adjective",
    definition: "Favoring or enforcing strict obedience to authority, especially that of the government, at the expense of personal freedom.",
    taWord: "சர்வாதிகார / அடக்குமுறை ஆட்சி சார்ந்த",
    enExample: "International news commentators expressed alarm over the government's shift toward authoritarian press regulations.",
    taExample: "பத்திரிகை விதிமுறைகளை நோக்கிய அரசாங்கத்தின் சர்வாதிகார நகர்வு குறித்து சர்வதேச செய்தி வர்ணனையாளர்கள் எச்சரிக்கை விடுத்தனர்.",
    enExample2: "In management studies, an authoritarian leadership style often suppresses employee initiative and creativity.",
    taExample2: "மேலாண்மை ஆய்வுகளில், சர்வாதிகார தலைமைத்துவ பாணி பெரும்பாலும் பணியாளர்களின் முயற்சி மற்றும் படைப்பாற்றலை ஒடுக்குகிறது.",
    synonyms: ["Autocratic", "Despotic", "Tyrannical", "Dictatorial"],
    antonyms: ["Democratic", "Liberal", "Permissive", "Egalitarian"]
  },
  {
    word: "Autocracy",
    pos: "noun",
    definition: "A system of government by one person or a small clique with absolute, unlimited power.",
    taWord: "தனிமனித ஆட்சி / வரம்பற்ற சர்வாதிகாரம்",
    enExample: "Political analysts warned that eroding constitutional guardrails could transform the fragile democracy into an autocracy.",
    taExample: "அரசியலமைப்பு பாதுகாப்பு வழிமுறைகளை சிதைப்பது பலவீனமான ஜனநாயகத்தை தனிமனித ஆட்சியாக மாற்றிவிடும் என்று அரசியல் ஆய்வாளர்கள் எச்சரித்தனர்.",
    enExample2: "The documentary explored how economic despair catalyzed the rise of autocracy in 20th-century Europe.",
    taExample2: "20 ஆம் நூற்றாண்டின் ஐரோப்பாவில் பொருளாதார விரக்தி எவ்வாறு சர்வாதிகார எழுச்சியை தூண்டியது என்பதை ஆவணப்படம் ஆராய்ந்தது.",
    synonyms: ["Dictatorship", "Monocracy", "Absolutism", "Totalitarianism"],
    antonyms: ["Democracy", "Republic", "Self-governance"]
  },
  {
    word: "Asynchronous",
    pos: "adjective",
    definition: "Not occurring at the same time or coordinated simultaneously; in computing, executing tasks independently without blocking the main execution thread.",
    taWord: "ஒத்திசைவற்ற / ஒரே நேரத்தில் நிகழாத",
    enExample: "Senior developers refactored the legacy network layer to use asynchronous event loops, drastically improving application throughput.",
    taExample: "முதுநிலை மென்பொருளாளர்கள் பயன்பாட்டின் செயல்திறனை அதிகரிக்க ஒத்திசைவற்ற நிகழ்வு சுழற்சிகளைப் பயன்படுத்தும்படி மாற்றியமைத்தனர்.",
    enExample2: "The global distributed team relies on asynchronous communication channels to collaborate across multiple time zones.",
    taExample2: "உலகளாவிய விநியோகிக்கப்பட்ட குழு பல்வேறு நேர மண்டலங்களில் இணைந்து பணியாற்ற ஒத்திசைவற்ற தொடர்பு வழிகளை நம்பியுள்ளது.",
    synonyms: ["Non-blocking", "Concurrent", "Unsynchronized", "Independent"],
    antonyms: ["Synchronous", "Simultaneous", "Concurrent-blocking"]
  },
  {
    word: "Atomicity",
    pos: "noun",
    definition: "In database systems and concurrency, the guarantee that a series of operations will either all occur or none will occur, leaving no partial state.",
    taWord: "முழுமைத் தன்மை / பிரிக்க முடியாத செயல் உத்தரவாதம்",
    enExample: "Database transactions enforce atomicity so that funds transferred between accounts are never lost during a network failure.",
    taExample: "நெட்வொர்க் செயலிழப்பின் போது கணக்குகளுக்கு இடையே மாற்றப்படும் நிதி இழக்கப்படாமல் இருக்க தரவுத்தளம் அணுக்கத் தன்மையை செயல்படுத்துகிறது.",
    enExample2: "The lead software engineer verified the atomicity of the order fulfillment workflow to prevent duplicate charges.",
    taExample2: "முதன்மையான மென்பொருள் பொறியாளர் இரட்டை கட்டணங்களை தடுக்க ஆர்டர் பூர்த்தி செயல்முறையின் முழுமைத் தன்மையை சரிபார்த்தார்.",
    synonyms: ["Indivisibility", "All-or-nothing guarantee", "Integrity", "Completeness"],
    antonyms: ["Partial execution", "Divisibility", "Fragmentation"]
  },
  {
    word: "Arbitrage",
    pos: "noun",
    definition: "The simultaneous purchase and sale of an asset in different markets to profit from a price difference.",
    taWord: "விலை வேறுபாட்டு வணிகம் / சந்தை இடைவெளி லாபம்",
    enExample: "High-frequency trading algorithms capitalize on fleeting millisecond arbitrage opportunities between global currency exchanges.",
    taExample: "அதிவேக வர்த்தக வழிமுறைகள் உலகளாவிய நாணய பரிமாற்றங்களுக்கு இடையே உள்ள நொடி நேர விலை வேறுபாடுகளைப் பயன்படுத்தி லாபம் ஈட்டுகின்றன.",
    enExample2: "Tech startups often exploit regulatory arbitrage by operating in jurisdictions with favorable tax and data laws.",
    taExample2: "தொழில்நுட்ப ஸ்டார்ட்-அப்கள் சாதகமான வரி மற்றும் தரவுச் சட்டங்களைக் கொண்ட பகுதிகளில் செயல்படுவதன் மூலம் ஒழுங்குமுறை இடைவெளிகளைப் பயன்படுத்துகின்றன.",
    synonyms: ["Market exploitation", "Price differential trading", "Speculation"],
    antonyms: ["Market equilibrium", "Price parity"]
  },
  {
    word: "Asset allocation",
    pos: "noun",
    definition: "An investment strategy that aims to balance risk and reward by apportioning a portfolio's assets according to an individual's goals, risk tolerance, and investment horizon.",
    taWord: "சொத்துப் பங்கீடு / முதலீட்டுப் பிரிப்பு",
    enExample: "The chief investment officer recommended a conservative asset allocation strategy in anticipation of market volatility.",
    taExample: "சந்தை ஏற்ற இறக்கங்களை எதிர்பார்த்து தலைமை முதலீட்டு அதிகாரி ஒரு பாதுகாப்பான சொத்துப் பங்கீட்டு உத்தியை பரிந்துரைத்தார்.",
    enExample2: "Financial advisers emphasize that long-term wealth preservation depends more on disciplined asset allocation than on picking individual stocks.",
    taExample2: "தனிப்பட்ட பங்குகளை தேர்ந்தெடுப்பதை விட ஒழுக்கமான சொத்துப் பங்கீடே நீண்ட கால செல்வ பாதுகாப்பை தீர்மானிக்கிறது என நிதி ஆலோசகர்கள் வலியுறுத்துகின்றனர்.",
    synonyms: ["Portfolio diversification", "Capital distribution", "Investment balancing"],
    antonyms: ["Concentrated holding", "Single-asset exposure"]
  },
  {
    word: "Ad hominem",
    pos: "adjective",
    definition: "Directed against a person rather than the position they are maintaining; an argumentative fallacy attacking character rather than substance.",
    taWord: "தனிநபர் தாக்குதல் சார்ந்த வாதம்",
    enExample: "The debate moderator intervened when the candidate resorted to ad hominem attacks instead of addressing the economic policy.",
    taExample: "வேட்பாளர் பொருளாதார கொள்கையை விவாதிப்பதற்கு பதிலாக தனிநபர் தாக்குதலில் ஈடுபட்டபோது விவாத நடுவர் தலையிட்டார்.",
    enExample2: "Scholars emphasize that rigorous academic critique must focus on empirical evidence rather than ad hominem dismissals.",
    taExample2: "கடுமையான கல்விசார் விமர்சனங்கள் தனிநபர் சார்ந்த நிராகரிப்புகளை விட அனுபவ ஆதாரங்களிலேயே கவனம் செலுத்த வேண்டும் என அறிஞர்கள் வலியுறுத்துகின்றனர்.",
    synonyms: ["Personal attack", "Character smear", "Mud-slinging"],
    antonyms: ["Substantive argument", "Objective critique", "Policy debate"]
  },
  {
    word: "Allegory",
    pos: "noun",
    definition: "A story, poem, or picture that can be interpreted to reveal a hidden meaning, typically a moral or political one.",
    taWord: "உருவகக் கதை / மறைபொருள் சித்திரம்",
    enExample: "George Orwell's Animal Farm is widely recognized as a biting political allegory reflecting the events of the Russian Revolution.",
    taExample: "ஜார்ஜ் ஆர்வெல்லின் அனிமல் ஃபார்ம் நூல் ரஷ்யப் புரட்சியின் நிகழ்வுகளைப் பிரதிபலிக்கும் கூர்மையான அரசியல் உருவகக் கதையாக பரவலாக அங்கீகரிக்கப்பட்டுள்ளது.",
    enExample2: "The film director constructed the post-apocalyptic thriller as an allegory for contemporary climate crisis anxieties.",
    taExample2: "திரைப்பட இயக்குனர் இந்த அறிவியல் புனைகதை திரில்லரை சமகால காலநிலை நெருக்கடி கவலைகளுக்கான உருவகமாக உருவாக்கினார்.",
    synonyms: ["Parable", "Fable", "Metaphor", "Symbolic narrative"],
    antonyms: ["Literal account", "Direct chronicle", "Factual reporting"]
  },

  // B
  {
    word: "Backlash",
    pos: "noun",
    definition: "A strong, sudden, and widespread negative reaction by a large number of people, especially to a social or political development.",
    taWord: "கடும் எதிர்ப்பு / தீவிர எதிர்வினை",
    enExample: "The tech giant faced an intense consumer backlash after altering its subscription pricing without prior notice.",
    taExample: "முன்னறிவிப்பின்றி சந்தா கட்டணத்தை மாற்றியமைத்த தொழில்நுட்ப நிறுவனம் நுகர்வோரின் கடுமையான எதிர்ப்பை சந்தித்தது.",
    enExample2: "Political commentators observed a cultural backlash against globalization among regional manufacturing communities.",
    taExample2: "பிராந்திய உற்பத்தி சமூகங்களிடையே உலகமயமாக்கலுக்கு எதிரான கலாச்சார எதிர்வினையை அரசியல் வர்ணனையாளர்கள் கவனித்தனர்.",
    synonyms: ["Counteraction", "Repercussion", "Resistance", "Pushback"],
    antonyms: ["Endorsement", "Acclaim", "Approval", "Acceptance"]
  },
  {
    word: "Bellwether",
    pos: "noun",
    definition: "Something that leads or indicates a future trend, especially in economics, politics, or financial markets.",
    taWord: "எதிர்காலப் போக்கைக் காட்டும் அளவுகோல் / முன்னோடி",
    enExample: "Semiconductor earnings reports are widely regarded by Wall Street as a reliable bellwether for the global economy.",
    taExample: "குறைக்கடத்தி நிறுவனங்களின் வருவாய் அறிக்கைகள் உலகப் பொருளாதாரத்தின் நம்பகமான எதிர்காலப் போக்கைக் காட்டும் அளவுகோலாகக் கருதப்படுகின்றன.",
    enExample2: "The BBC political correspondent described the suburban voting district as a key bellwether for the upcoming general election.",
    taExample2: "வரவிருக்கும் பொதுத் தேர்தலில் புறநகர் வாக்குச் சாவடி முக்கிய முன்னோடி அளவுகோலாக இருக்கும் என்று பிபிசி அரசியல் செய்தியாளர் விவரித்தார்.",
    synonyms: ["Trendsetter", "Indicator", "Harbinger", "Barometer"],
    antonyms: ["Follower", "Laggard", "Outlier"]
  },
  {
    word: "Bipartisan",
    pos: "adjective",
    definition: "Involving the agreement, cooperation, or endorsement of two political parties that usually oppose each other.",
    taWord: "இரு கட்சி உடன்பாடுடைய / இருகட்சி ஒருமித்த",
    enExample: "The landmark infrastructure bill passed the Senate with overwhelming bipartisan support after months of negotiation.",
    taExample: "மாதக்கணக்கிலான பேச்சுவார்த்தைகளுக்குப் பிறகு இரு கட்சிகளின் பெரும் ஆதரவுடன் முக்கிய உள்கட்டமைப்பு மசோதா நிறைவேற்றப்பட்டது.",
    enExample2: "Senior diplomats stressed that foreign intelligence policy requires a stable, bipartisan consensus to remain effective.",
    taExample2: "வெளியுறவு புலனாய்வுக் கொள்கை பலனளிக்க இரு கட்சிகளின் நிலையான ஒருமித்த கருத்து அவசியம் என்று தூதர்கள் வலியுறுத்தினர்.",
    synonyms: ["Cross-party", "Dual-party", "Cooperative", "Non-partisan"],
    antonyms: ["Partisan", "Sectarian", "One-sided", "Factional"]
  },
  {
    word: "Brinkmanship",
    pos: "noun",
    definition: "The practice of pursuing a dangerous policy to the limits of safety before stopping, especially in politics or corporate negotiations.",
    taWord: "விளிம்புநிலை அரசியல் / எல்லை வரை சென்று அச்சுறுத்தும் உத்தி",
    enExample: "The BBC diplomatic correspondent warned that nuclear brinkmanship in the region poses an unacceptable risk to global peace.",
    taExample: "இப்பகுதியில் நிலவும் அணு ஆயுத விளிம்புநிலை அரசியல் உலக அமைதிக்கு ஏற்றுக்கொள்ள முடியாத ஆபத்தை விளைவிப்பதாக பிபிசி தூதரக செய்தியாளர் எச்சரித்தார்.",
    enExample2: "The union and management engaged in high-stakes brinkmanship right up to the midnight strike deadline.",
    taExample2: "தொழிற்சங்கமும் நிர்வாகமும் நள்ளிரவு வேலைநிறுத்த காலக்கெடு வரை கடுமையான விளிம்புநிலை உத்தியில் ஈடுபட்டன.",
    synonyms: ["High-stakes maneuvering", "Escalation tactics", "Intimidation strategy"],
    antonyms: ["Conciliation", "De-escalation", "Compromise", "Prudence"]
  },
  {
    word: "Boilerplate",
    pos: "noun",
    definition: "Standardized text, code, or contract terms that can be reused in new contexts without significant change.",
    taWord: "நிலையான மாதிரி உரை / மறுபயன்பாட்டு குறியீடு",
    enExample: "Modern web frameworks generate boilerplate code automatically, allowing developers to focus on unique business logic.",
    taExample: "நவீன இணைய கட்டமைப்பு முறைகள் நிலையான மாதிரி குறியீட்டை தானாக உருவாக்கி, தனித்துவமான வணிக தர்க்கத்தில் கவனம் செலுத்த உதவுகின்றன.",
    enExample2: "The corporate legal counsel advised against signing commercial agreements containing generic boilerplate liability clauses.",
    taExample2: "பொதுவான நிலையான பொறுப்பு விதிமுறைகளைக் கொண்ட வணிக ஒப்பந்தங்களில் கையெழுத்திட வேண்டாம் என்று நிறுவன சட்ட ஆலோசகர் அறிவுறுத்தினார்.",
    synonyms: ["Template", "Standard text", "Scaffolding", "Formulaic text"],
    antonyms: ["Custom code", "Bespoke contract", "Original phrasing"]
  },
  {
    word: "Burn rate",
    pos: "noun",
    definition: "The rate at which a new company spends its venture capital to finance overhead operations before generating positive cash flow.",
    taWord: "மூலதன விரய விகிதம் / மாதாந்திர செலவு வேகம்",
    enExample: "The startup CFO announced drastic measures to reduce the monthly burn rate and extend the company's financial runway.",
    taExample: "தொடக்க நிறுவன தலைமை நிதி அதிகாரி மாதாந்திர மூலதன செலவு வேகத்தை குறைத்து நிறுவனத்தின் நிதி ஆயுளை நீட்டிக்க தீவிர நடவடிக்கைகளை அறிவித்தார்.",
    enExample2: "Investors scrutinized the venture's high marketing burn rate during the Series B funding negotiations.",
    taExample2: "தொடர் B நிதி பேச்சுவார்த்தைகளின் போது முதலீட்டாளர்கள் நிறுவனத்தின் அதிக சந்தைப்படுத்தல் செலவு வேகத்தை உன்னிப்பாக ஆராய்ந்தனர்.",
    synonyms: ["Cash bleed", "Expenditure velocity", "Operating cash consumption"],
    antonyms: ["Positive cash flow", "Profit accrual", "Capital surplus"]
  },

  // C
  {
    word: "Calibration",
    pos: "noun",
    definition: "The act of checking or adjusting the accuracy of a measuring instrument or aligning organizational parameters precisely.",
    taWord: "துல்லிய அளவுத்திருத்தம் / சீரமைப்பு",
    enExample: "Laboratory engineers perform daily sensor calibration to ensure experimental readings remain within strict tolerances.",
    taExample: "ஆய்வகப் பொறியாளர்கள் சோதனைக் குறியீடுகள் துல்லிய வரம்பிற்குள் இருப்பதை உறுதிசெய்ய தினசரி சென்சார் அளவுத்திருத்தம் செய்கிறார்கள்.",
    enExample2: "The executive committee conducted a calibration of executive bonuses to match updated annual performance targets.",
    taExample2: "நிர்வாகக் குழு புதுப்பிக்கப்பட்ட வருடாந்திர செயல்திறன் இலக்குகளுக்கு ஏற்ப போனஸ் சலுகைகளின் சீரமைப்பை மேற்கொண்டது.",
    synonyms: ["Adjustment", "Standardization", "Fine-tuning", "Alignment"],
    antonyms: ["Misalignment", "Derangement", "Distortion"]
  },
  {
    word: "Cannibalize",
    pos: "verb",
    definition: "To reduce the sales or market share of one of a company's existing products by introducing a new, competing product.",
    taWord: "சுய சந்தைப் பகிர்வை பாதித்தல் / தன் தயாரிப்பையே விஞ்சுதல்",
    enExample: "Product managers carefully timed the release of the budget smartphone so it would not cannibalize flagship model sales.",
    taExample: "முதன்மை மாடல் விற்பனையை பாதிக்காத வகையில் பட்ஜெட் ஸ்மார்ட்போனின் வெளியீட்டு நேரத்தை தயாரிப்பு மேலாளர்கள் கவனமாக திட்டமிட்டனர்.",
    enExample2: "Rather than fear cannibalizing legacy revenue, forward-looking tech firms embrace digital disruption proactively.",
    taExample2: "பழைய வருவாய் பாதிக்கப்படுவதற்கு அஞ்சுவதை விட, முன்னோக்கு தொழில்நுட்ப நிறுவனங்கள் டிஜிட்டல் மாற்றத்தை முன்கூட்டியே தழுவுகின்றன.",
    synonyms: ["Encroach upon", "Subsume", "Undermine internally", "Displace"],
    antonyms: ["Complement", "Augment", "Reinforce", "Bolster"]
  },
  {
    word: "Catharsis",
    pos: "noun",
    definition: "The process of releasing, and thereby providing relief from, strong or repressed emotions, especially through art or drama.",
    taWord: "மனத்தூய்மை / உணர்ச்சி வடிகால்",
    enExample: "The theater critic remarked that the tragic finale provided the audience with an overwhelming sense of emotional catharsis.",
    taExample: "நாடகத்தின் சோகமான இறுதிப் பகுதி பார்வையாளர்களுக்கு ஒரு மிகப்பெரிய உணர்ச்சி வடிகால் அனுபவத்தை வழங்கியதாக விமர்சகர் குறிப்பிட்டார்.",
    enExample2: "Writing candid memoirs served as a profound personal catharsis for the war correspondent.",
    taExample2: "நேர்மையான நினைவுக்குறிப்புகளை எழுதுவது போர் செய்தியாளருக்கு ஒரு ஆழ்ந்த தனிப்பட்ட மனத்தூய்மையாக அமைந்தது.",
    synonyms: ["Purging", "Emotional release", "Cleansing", "Relief"],
    antonyms: ["Repression", "Inhibition", "Emotional bottling", "Suppression"]
  },
  {
    word: "Caveat",
    pos: "noun",
    definition: "A warning or proviso of specific stipulations, conditions, or limitations attached to a statement or agreement.",
    taWord: "முன்னெச்சரிக்கை நிபந்தனை / கவனிக்கத்தக்க வரம்பு",
    enExample: "The chief medical officer endorsed the clinical trial results with the important caveat that longer studies are needed.",
    taExample: "நீண்ட கால ஆய்வுகள் தேவை என்ற முக்கியமான முன்னெச்சரிக்கை நிபந்தனையுடன் தலைமை மருத்துவ அதிகாரி மருத்துவ பரிசோதனை முடிவுகளை ஏற்றுக்கொண்டார்.",
    enExample2: "The software architect approved the open-source library with one crucial caveat regarding its memory overhead.",
    taExample2: "மென்பொருள் கட்டமைப்பாளர் அதன் நினைவக பயன்பாடு குறித்த ஒரு முக்கிய வரம்புடன் அந்த திறந்த மூல நிரலகத்தை அங்கீகரித்தார்.",
    synonyms: ["Stipulation", "Proviso", "Warning", "Qualification"],
    antonyms: ["Unconditional guarantee", "Carte blanche", "Absolute endorsement"]
  },
  {
    word: "Circumlocution",
    pos: "noun",
    definition: "The use of many words where fewer would do, especially in a deliberate attempt to be vague, evasive, or overly formal.",
    taWord: "சுற்றி வளைத்துப் பேசுதல் / மறைமுக உரை",
    enExample: "The BBC interviewer pressed the minister to give a direct answer without resorting to political circumlocution.",
    taExample: "அரசியல் சுற்றி வளைத்துப் பேசுதலைத் தவிர்த்து நேரடி பதிலளிக்குமாறு அமைச்சருக்கு பிபிசி நேர்காணலாளர் அழுத்தம் கொடுத்தார்.",
    enExample2: "Legal drafters often avoid circumlocution to eliminate ambiguity in commercial contracts.",
    taExample2: "வணிக ஒப்பந்தங்களில் தெளிவின்மையை நீக்குவதற்காக சட்ட வரைவாளர்கள் பெரும்பாலும் சுற்றி வளைத்துப் பேசுவதைத் தவிர்க்கிறார்கள்.",
    synonyms: ["Equivocation", "Verbosity", "Periphrasis", "Evasion"],
    antonyms: ["Directness", "Concisensss", "Brevity", "Succinctness"]
  },
  {
    word: "Cognitive dissonance",
    pos: "noun",
    definition: "The mental discomfort or psychological tension experienced by someone who holds two contradictory beliefs, values, or actions.",
    taWord: "அறிவாற்றல் முரண்பாடு / மன உளைச்சல் தரும் எண்ண முரண்",
    enExample: "Executives experienced cognitive dissonance when aggressive quarterly targets conflicted directly with the company's stated ethics.",
    taExample: "நிறுவனத்தின் கொள்கைகளுடன் தீவிர காலாண்டு இலக்குகள் முரண்பட்டபோது நிர்வாகிகள் அறிவாற்றல் முரண்பாட்டை உணர்ந்தனர்.",
    enExample2: "Sociologists study how voters rationalize cognitive dissonance when political leaders violate their core principles.",
    taExample2: "அரசியல் தலைவர்கள் தங்கள் அடிப்படைக் கொள்கைகளை மீறும்போது வாக்காளர்கள் எவ்வாறு அறிவாற்றல் முரண்பாட்டை நியாயப்படுத்துகிறார்கள் என்பதை சமூகவியலாளர்கள் ஆராய்கின்றனர்.",
    synonyms: ["Psychological conflict", "Inner tension", "Mental incongruity"],
    antonyms: ["Cognitive harmony", "Mental consistency", "Consonance"]
  },
  {
    word: "Confluence",
    pos: "noun",
    definition: "An act or process of merging; the junction where two rivers, forces, or trends meet and combine.",
    taWord: "சங்கமம் / பல்வேறு போக்குகள் இணையும் புள்ளி",
    enExample: "The rise of artificial intelligence represents a unique confluence of massive compute power and vast training datasets.",
    taExample: "செயற்கை நுண்ணறிவின் வளர்ச்சி என்பது பெரும் கணினித்திறன் மற்றும் பரந்த பயிற்சித் தரவுகளின் தனித்துவமான சங்கமமாகும்.",
    enExample2: "Economic analysts attributed the market rally to a favorable confluence of low inflation and surging consumer confidence.",
    taExample2: "குறைந்த பணவீக்கம் மற்றும் அதிகரித்த நுகர்வோர் நம்பிக்கை ஆகியவற்றின் சாதகமான இணைப்பே சந்தை உயர்வுக்குக் காரணம் என பொருளாதார வல்லுநர்கள் கூறினர்.",
    synonyms: ["Convergence", "Junction", "Intersection", "Union"],
    antonyms: ["Divergence", "Separation", "Dispersion", "Bifurcation"]
  },
  {
    word: "Constellation",
    pos: "noun",
    definition: "A group or configuration of associated people, qualities, factors, or things forming a recognizable pattern.",
    taWord: "தொகுப்பு / ஒன்றுடன் ஒன்று இணைந்த காரணிகளின் கட்டமைப்பு",
    enExample: "A complex constellation of geopolitical rivalries and energy shortages contributed to the regional crisis.",
    taExample: "புவிசார் அரசியல் போட்டிகள் மற்றும் ஆற்றல் பற்றாக்குறைகளின் சிக்கலான தொகுப்பு பிராந்திய நெருக்கடிக்கு வழிவகுத்தது.",
    enExample2: "The tech startup relied on a constellation of specialized cloud microservices to handle global user traffic.",
    taExample2: "உலகளாவிய பயனர் போக்குவரத்தைக் கையாள தொழில்நுட்ப ஸ்டார்ட்-அப் பல சிறப்பு கிளவுட் மைக்ரோ சர்வீஸ்களின் கட்டமைப்பை நம்பியிருந்தது.",
    synonyms: ["Configuration", "Cluster", "Array", "Nexus"],
    antonyms: ["Individual entity", "Isolation", "Fragment"]
  },
  {
    word: "Crescendo",
    pos: "noun",
    definition: "A gradual increase in loudness, intensity, or climactic force, especially in music, public rhetoric, or dramatic storytelling.",
    taWord: "படிப்படியான உச்சக்கட்ட எழுச்சி / தீவிரம் அதிகரித்தல்",
    enExample: "The investigative reporter's presentation reached a powerful crescendo with the reveal of leaked financial logs.",
    taExample: "கசிந்த நிதிப் பதிவுகளை வெளிப்படுத்தியதன் மூலம் புலனாய்வு நிருபரின் விளக்கக்காட்சி ஒரு சக்திவாய்ந்த உச்சக்கட்ட எழுச்சியை எட்டியது.",
    enExample2: "Public debate over the proposed environmental regulation built to a crescendo during the televised parliamentary hearing.",
    taExample2: "தொலைக்காட்சி நாடாளுமன்ற விசாரணையின் போது முன்மொழியப்பட்ட சுற்றுச்சூழல் ஒழுங்குமுறை மீதான பொது விவாதம் உச்சக்கட்டத்தை அடைந்தது.",
    synonyms: ["Climax", "Apex", "Culmination", "Escalation"],
    antonyms: ["Decrescendo", "Diminuendo", "Anticlimax", "Subsidance"]
  },
  {
    word: "Canonical",
    pos: "adjective",
    definition: "Conforming to a general rule or acceptable standard; in computing, representing the standard or normalized format of data or code.",
    taWord: "தரநிலையான / அதிகாரப்பூர்வமாக ஏற்றுக்கொள்ளப்பட்ட",
    enExample: "Engineers store user records in a canonical data format to simplify transformation across heterogeneous microservices.",
    taExample: "பல்வேறு மைக்ரோ சர்வீஸ்களுக்கு இடையேயான தரவு மாற்றத்தை எளிதாக்க பொறியாளர்கள் பயனர் பதிவுகளை தரநிலையான வடிவத்தில் சேமிக்கின்றனர்.",
    enExample2: "The professor cited the 1974 research paper as the canonical foundational work in modern cryptography.",
    taExample2: "நவீன குறியாக்கவியலின் தரநிலையான அடிப்படை ஆய்வுக் கட்டுரையாக 1974 ஆம் ஆண்டின் ஆய்வு அறிக்கையை பேராசிரியர் மேற்கோள் காட்டினார்.",
    synonyms: ["Standard", "Authoritative", "Normalized", "Orthodox"],
    antonyms: ["Non-standard", "Unorthodox", "Anomalous", "Deviant"]
  },
  {
    word: "Cohesion",
    pos: "noun",
    definition: "The action or state of cohering or sticking together; in software engineering, the degree to which module elements belong together.",
    taWord: "இணைவுத்தன்மை / ஒருமைப்பாடு",
    enExample: "High cohesion and loose coupling remain the gold standards of resilient software architecture.",
    taExample: "அதிக இணைப்புத்தன்மை மற்றும் தளர்வான பிணைப்பு ஆகியவை நிலையான மென்பொருள் கட்டமைப்பின் பொன் விதிகளாக நீடிக்கின்றன.",
    enExample2: "The prime minister emphasized that economic equality is essential for maintaining social cohesion during turbulent times.",
    taExample2: "கொந்தளிப்பான காலங்களில் சமூக ஒருமைப்பாட்டைப் பேண பொருளாதார சமத்துவம் அவசியம் என்று பிரதமர் வலியுறுத்தினார்.",
    synonyms: ["Unity", "Solidarity", "Consistency", "Integrity"],
    antonyms: ["Fragmentation", "Disunity", "Disconnection", "Discord"]
  },
  {
    word: "Concurrency",
    pos: "noun",
    definition: "The ability of different parts or units of a program, algorithm, or problem to be executed out-of-order or in partial order without affecting the outcome.",
    taWord: "ஒரே நேரத்தில் நிகழும் செயலாக்கம் / உடனிகழ்வுத்திறன்",
    enExample: "The database engine utilizes optimistic concurrency control to handle thousands of simultaneous checkout transactions without locking rows.",
    taExample: "வரிசைகளை முடக்காமல் ஒரே நேரத்தில் ஆயிரக்கணக்கான கட்டணப் பரிவர்த்தனைகளைக் கையாள தரவுத்தள இயந்திரம் உடனிகழ்வு கட்டுப்பாட்டைப் பயன்படுத்துகிறது.",
    enExample2: "Writing reliable concurrency primitives requires careful handling of race conditions and thread synchronization.",
    taExample2: "நம்பகமான உடனிகழ்வு நிரல்களை எழுதுவதற்கு த்ரெட் ஒத்திசைவு மற்றும் முரண்பாடுகளை கவனமாகக் கையாள வேண்டும்.",
    synonyms: ["Parallelism", "Simultaneous execution", "Co-occurrence"],
    antonyms: ["Sequential execution", "Serial processing"]
  },
  {
    word: "Clawback",
    pos: "noun",
    definition: "A provision under which money already paid out, such as executive bonuses or tax incentives, must be returned under specific conditions.",
    taWord: "வழங்கிய நிதியைத் திரும்பப் பெறுதல் / சலுகை மீட்பு",
    enExample: "The board activated the clawback clause to recover millions in performance bonuses after an accounting misstatement was uncovered.",
    taExample: "கணக்கியல் தவறு கண்டறியப்பட்ட பின்னர் செயல்திறன் போனஸாக வழங்கப்பட்ட மில்லியன் டாலர்களைத் திரும்பப் பெற நிர்வாகக் குழு சலுகை மீட்பு விதியை செயல்படுத்தியது.",
    enExample2: "Government contracts now feature strict clawback stipulations if job creation targets are not fulfilled by recipients.",
    taExample2: "வேலைவாய்ப்பு இலக்குகள் எட்டப்படாவிட்டால் மானியங்களைத் திரும்பப் பெறுவதற்கான கடுமையான மீட்பு விதிகள் இப்போது அரசு ஒப்பந்தங்களில் உள்ளன.",
    synonyms: ["Recoupment", "Refund retrieval", "Forfeiture enforcement"],
    antonyms: ["Unconditional disbursement", "Irrevocable payout"]
  },

  // D
  {
    word: "Deliberation",
    pos: "noun",
    definition: "Long and careful consideration, debate, or discussion before reaching a final judgment or decision.",
    taWord: "ஆழ்ந்த பரிசீலனை / கலந்தாலோசனை",
    enExample: "After extensive deliberation, the monetary policy committee decided to keep interest rates steady.",
    taExample: "ஆழ்ந்த பரிசீலனைக்குப் பிறகு, பணவியல் கொள்கைக் குழு வட்டி விகிதங்களை மாற்றாமல் வைத்திருக்க முடிவு செய்தது.",
    enExample2: "The jury's secret deliberations lasted four days before a unanimous verdict was reached.",
    taExample2: "ஒருமனதான தீர்ப்பை எட்டுவதற்கு முன் நடுவர் மன்றத்தின் ரகசிய கலந்தாலோசனை நான்கு நாட்கள் நீடித்தது.",
    synonyms: ["Contemplation", "Reflection", "Consultation", "Pondering"],
    antonyms: ["Haste", "Impulsiveness", "Rash decision"]
  },
  {
    word: "Demystify",
    pos: "verb",
    definition: "Make a difficult or esoteric subject clearer and easier to understand for a broader audience.",
    taWord: "புரியும்படி விளக்குதல் / மர்மத்தை நீக்குதல்",
    enExample: "The senior engineer published an insightful tutorial to demystify complex distributed consensus algorithms.",
    taExample: "சிக்கலான விநியோகிக்கப்பட்ட ஒருமித்த வழிமுறைகளை எளிமையாக விளக்கும் பயனுள்ள கையேட்டை மூத்த பொறியாளர் வெளியிட்டார்.",
    enExample2: "BBC educational broadcasts aim to demystify scientific breakthroughs for the general public.",
    taExample2: "அறிவியல் சாதனைகளை பொதுமக்களுக்கு எளிதாக புரியும்படி விளக்குவதை பிபிசி கல்வி ஒளிபரப்புகள் நோக்கமாகக் கொண்டுள்ளன.",
    synonyms: ["Clarify", "Elucidate", "Simplify", "Illuminate"],
    antonyms: ["Obfuscate", "Complicate", "Mystify", "Confuse"]
  },
  {
    word: "Disenfranchise",
    pos: "verb",
    definition: "To deprive an individual or community of a legal right, privilege, or immunity, especially the right to vote or participate in governance.",
    taWord: "உரிமையைப் பறித்தல் / வாக்குரிமை மறுத்தல்",
    enExample: "Human rights advocates warned that strict new identification laws would disenfranchise marginalized rural voters.",
    taExample: "புதிய கடுமையான அடையாள அட்டைகள் விளிம்புநிலை கிராமப்புற வாக்காளர்களின் வாக்குரிமையைப் பறிக்கும் என்று மனித உரிமை ஆர்வலர்கள் எச்சரித்தனர்.",
    enExample2: "Corporate restructuring without employee representation risks disenfranchising key technical contributors.",
    taExample2: "ஊழியர் பிரதிநிதித்துவம் இல்லாத நிறுவன மறுசீரமைப்பு முக்கிய தொழில்நுட்ப வல்லுநர்களின் உரிமையை பறிக்கும் அபாயத்தைக் கொண்டுள்ளது.",
    synonyms: ["Disempower", "Deprive", "Divest", "Marginalize"],
    antonyms: ["Enfranchise", "Empower", "Include", "Privilege"]
  },
  {
    word: "Dissident",
    pos: "noun",
    definition: "A person who actively opposes official policy, regime authority, or established institutional doctrines.",
    taWord: "கருத்து வேறுபாடு கொண்ட எதிர்ப்பாளர் / அதிருப்தியாளர்",
    enExample: "The exiled political dissident addressed the international human rights forum via secure video uplink.",
    taExample: "நாடுகடத்தப்பட்ட அரசியல் அதிருப்தியாளர் சர்வதேச மனித உரிமைகள் மன்றத்தில் பாதுகாப்பான காணொளி வாயிலாக உரையாற்றினார்.",
    enExample2: "BBC News correspondents reported on the trial of prominent anti-corruption dissidents in the capital city.",
    taExample2: "தலைநகரில் முக்கிய ஊழல் எதிர்ப்புப் போராளிகள் மீதான விசாரணையை பிபிசி செய்தி நிருபர்கள் அறிக்கையிட்டனர்.",
    synonyms: ["Rebel", "Nonconformist", "Protester", "Objector"],
    antonyms: ["Conformist", "Loyalist", "Supporter", "Adherent"]
  },
  {
    word: "Divisive",
    pos: "adjective",
    definition: "Tending to cause disagreement, hostility, or polarization between people or social groups.",
    taWord: "பிளவை உண்டாக்குகிற / பிரித்தாளும் நோக்குடைய",
    enExample: "The editorial criticized the politician's divisive campaign rhetoric for inflaming cultural tensions.",
    taExample: "கலாச்சார பதற்றங்களைத் தூண்டும் அரசியல்வாதியின் பிளவை உண்டாக்கும் பிரச்சார உரையை தலையங்கம் விமர்சித்தது.",
    enExample2: "Introducing unannounced compensation policies proved divisive among engineering team members.",
    taExample2: "அறிவிக்கப்படாத ஊதியக் கொள்கைகளை அறிமுகப்படுத்தியது பொறியியல் குழு உறுப்பினர்களிடையே பிளவை ஏற்படுத்தியது.",
    synonyms: ["Polarizing", "Discordant", "Alienating", "Factional"],
    antonyms: ["Unifying", "Harmonious", "Conciliatory", "Cohesive"]
  },
  {
    word: "Due diligence",
    pos: "noun",
    definition: "Comprehensive appraisal of an asset, company, or transaction undertaken by a prospective buyer to establish assets and liabilities.",
    taWord: "முழுமையான சரிபார்ப்பு / உரிய முன்னாய்வு",
    enExample: "The venture capital firm spent six weeks conducting thorough due diligence on the startup's patents and source code.",
    taExample: "தொடக்க நிறுவனத்தின் காப்புரிமைகள் மற்றும் மூலக் குறியீடுகள் குறித்து முழுமையான முன்னாய்வு செய்ய துணிகர மூலதன நிறுவனம் ஆறு வாரங்கள் செலவிட்டது.",
    enExample2: "Executives failed to exercise proper due diligence before acquiring the overseas supplier, leading to regulatory fines.",
    taExample2: "வெளிநாட்டு சப்ளையரை வாங்குவதற்கு முன் நிர்வாகிகள் சரியான சரிபார்ப்பை மேற்கொள்ளத் தவறியதால் ஒழுங்குமுறை அபராதங்கள் விதிக்கப்பட்டன.",
    synonyms: ["Audit", "Vetting", "Investigation", "Scrutiny"],
    antonyms: ["Carelessness", "Negligence", "Blind trust"]
  },
  {
    word: "Denouement",
    pos: "noun",
    definition: "The final part of a play, film, or narrative in which the strands of the plot are drawn together and matters are resolved.",
    taWord: "கதையின் முடிவு / சிக்கல் அவிழும் இறுதிப் பகுதி",
    enExample: "The literary critic praised the crime novel's unexpected denouement for seamlessly tying up every narrative thread.",
    taExample: "ஒவ்வொரு கதைக் களத்தையும் நேர்த்தியாக இணைத்த குற்ற நாவலின் எதிர்பாராத இறுதிப் பகுதியை இலக்கிய விமர்சகர் பாராட்டினார்.",
    enExample2: "Viewers tuned in to the series finale eager to witness the dramatic denouement of the political saga.",
    taExample2: "அரசியல் நாடகத் தொடரின் விறுவிறுப்பான இறுதித் தீர்வை காண பார்வையாளர்கள் ஆவலுடன் தொலைக்காட்சியைப் பார்த்தனர்.",
    synonyms: ["Resolution", "Finale", "Conclusion", "Culmination"],
    antonyms: ["Beginning", "Exposition", "Prologue", "Introduction"]
  },
  {
    word: "Declarative",
    pos: "adjective",
    definition: "In programming and linguistics, denoting a paradigm that expresses the logic of a computation without describing its detailed control flow.",
    taWord: "விளக்கமான / என்ன செய்ய வேண்டும் என்பதை மட்டும் குறிப்பிடும் பாணி",
    enExample: "React enables developers to build user interfaces using a declarative syntax rather than imperative DOM manipulation.",
    taExample: "நேரடி DOM மாற்றங்களுக்குப் பதிலாக விளக்கமான குறியீட்டு பாணியைப் பயன்படுத்தி பயனர் இடைமுகங்களை உருவாக்க ரியாக்ட் அனுமதிக்கிறது.",
    enExample2: "Declarative database query languages allow data analysts to specify desired results without managing raw memory pointers.",
    taExample2: "விளக்கமான தரவுத்தள வினவல் மொழிகள் தரவு ஆய்வாளர்கள் கணினி நினைவகத்தை கையாளாமல் விரும்பிய முடிவுகளைப் பெற உதவுகின்றன.",
    synonyms: ["Descriptive", "Intent-based", "Expository"],
    antonyms: ["Imperative", "Procedural", "Step-by-step"]
  },
  {
    word: "Deadlock",
    pos: "noun",
    definition: "A situation where two or more processes or parties are unable to act because each is waiting for the other to release resources or concede.",
    taWord: "முட்டுக்கட்டை / தேக்கநிலை",
    enExample: "The database administrator resolved a severe deadlock caused by concurrent transaction locks on shared tables.",
    taExample: "பகிரப்பட்ட அட்டவணைகளில் ஒரே நேரத்தில் ஏற்பட்ட பூட்டுகளால் உண்டான கடுமையான முட்டுக்கட்டையை தரவுத்தள நிர்வாகி சரிசெய்தார்.",
    enExample2: "Diplomatic peace negotiations reached an absolute deadlock when both factions refused to withdraw forces from the frontier.",
    taExample2: "இரு பிரிவினரும் எல்லையிலிருந்து படைகளைத் திரும்பப் பெற மறுத்ததால் அமைதிப் பேச்சுவார்த்தை முழுமையான முட்டுக்கட்டையை அடைந்தது.",
    synonyms: ["Stalemate", "Gridlock", "Impasse", "Standstill"],
    antonyms: ["Progress", "Resolution", "Breakthrough", "Flow"]
  },

  // E
  {
    word: "Egregious",
    pos: "adjective",
    definition: "Outstandingly bad, shocking, or flagrant in character.",
    taWord: "மன்னிக்க முடியாத / அப்பட்டமான கொடிய தவறு",
    enExample: "The regulatory commission imposed heavy penalties for the company's egregious violation of user privacy laws.",
    taExample: "பயனர் தனியுரிமைச் சட்டங்களை அப்பட்டமாக மீறியதற்காக ஒழுங்குமுறை ஆணையம் நிறுவனத்திற்கு கடும் அபராதம் விதித்தது.",
    enExample2: "The lead architect caught an egregious memory leak during the final code review before deployment.",
    taExample2: "வெளியீட்டிற்கு முந்தைய இறுதிக் குறியீடு ஆய்வின் போது முதன்மை கட்டமைப்பாளர் ஒரு கடுமையான நினைவகக் கசிவைக் கண்டறிந்தார்.",
    synonyms: ["Flagrant", "Outrageous", "Appalling", "Monstrous"],
    antonyms: ["Minor", "Inconsequential", "Exemplary", "Commendable"]
  },
  {
    word: "Enclave",
    pos: "noun",
    definition: "A portion of territory surrounded by a larger territory whose inhabitants are culturally or ethnically distinct; a specialized community.",
    taWord: "தனித்த பிரதேசம் / சிறப்பு ஒதுக்குப்புற பகுதி",
    enExample: "The tech hub developed as an affluent innovation enclave surrounded by traditional agricultural districts.",
    taExample: "பாரம்பரிய விவசாய மாவட்டங்களால் சூழப்பட்ட ஒரு வளமான புத்தாக்கப் பகுதியாக அந்த தொழில்நுட்ப மையம் உருவானது.",
    enExample2: "Diplomatic correspondents reported that safe corridors were established to supply humanitarian aid to the besieged enclave.",
    taExample2: "முற்றுகையிடப்பட்ட பகுதிக்கு மனிதாபிமான உதவிகளை வழங்க பாதுகாப்பான வழிகள் அமைக்கப்பட்டதாக தூதரக நிருபர்கள் தெரிவித்தனர்.",
    synonyms: ["Pocket", "Settlement", "Sanctuary", "Territory within"],
    antonyms: ["Mainland", "Open territory", "Cosmopolitan expanse"]
  },
  {
    word: "Enigmatic",
    pos: "adjective",
    definition: "Difficult to interpret or understand; mysterious, obscure, or puzzling.",
    taWord: "புரியாத புதிரான / மர்மமான",
    enExample: "The tech visionary remained an enigmatic figure, rarely granting interviews and avoiding public appearances.",
    taExample: "அரிதாகவே நேர்காணல்கள் அளித்தும் பொது நிகழ்ச்சிகளைத் தவிர்த்தும் வந்த அந்த தொழில்நுட்ப முன்னோடி ஒரு புதிரான நபராகவே இருந்தார்.",
    enExample2: "Scholars continue to debate the enigmatic symbolism in Shakespeare's later romance plays.",
    taExample2: "ஷேக்ஸ்பியரின் பிற்கால நாடகங்களில் உள்ள புதிரான குறியீடுகள் குறித்து அறிஞர்கள் தொடர்ந்து விவாதித்து வருகின்றனர்.",
    synonyms: ["Cryptic", "Inscrutable", "Mysterious", "Unfathomable"],
    antonyms: ["Transparent", "Obvious", "Straightforward", "Lucid"]
  },
  {
    word: "Epistemic",
    pos: "adjective",
    definition: "Relating to knowledge or to the philosophical degree of its validation and certainty.",
    taWord: "அறிவாற்றல் சார்ந்த / மெய்ஞ்ஞானம் தொடர்புடைய",
    enExample: "Scholars examined the epistemic foundations of machine learning models to assess whether AI outputs represent genuine comprehension.",
    taExample: "செயற்கை நுண்ணறிவின் முடிவுகள் உண்மையான புரிதலைக் குறிக்கிறதா என்பதை மதிப்பிட அறிஞர்கள் இயந்திர கற்றலின் அறிவாற்றல் அடிப்படைகளை ஆய்வு செய்தனர்.",
    enExample2: "The research methodology paper highlighted epistemic uncertainty inherent in long-range climate forecasting models.",
    taExample2: "நீண்ட கால காலநிலை முன்கணிப்பு மாதிரிகளில் உள்ள உள்ளார்ந்த அறிவாற்றல் நிச்சயமற்ற தன்மையை அந்த ஆய்வுக் கட்டுரை சுட்டிக்காட்டியது.",
    synonyms: ["Cognitive", "Epistemological", "Knowledge-based", "Intellectual"],
    antonyms: ["Superficial", "Empirical-less", "Instinctual"]
  },
  {
    word: "Equivocal",
    pos: "adjective",
    definition: "Open to more than one interpretation; deliberately ambiguous, uncertain, or questionable.",
    taWord: "இருபொருள்படும் / தெளிவற்ற / ஐயத்திற்குரிய",
    enExample: "The politician gave an equivocal response when questioned about future tax increases, frustrating both reporters and voters.",
    taExample: "எதிர்கால வரி உயர்வு பற்றி கேட்கப்பட்ட போது அரசியல்வாதி இருபொருள்படும் பதிலை அளித்தது செய்தியாளர்களையும் வாக்காளர்களையும் ஏமாற்றமடையச் செய்தது.",
    enExample2: "The laboratory findings yielded equivocal evidence, prompting researchers to conduct a follow-up trial.",
    taExample2: "ஆய்வக முடிவுகள் தெளிவற்ற சான்றுகளை அளித்ததால், ஆராய்ச்சியாளர்கள் கூடுதல் மறு பரிசோதனையை மேற்கொள்ள வேண்டியதாயிற்று.",
    synonyms: ["Ambiguous", "Noncommittal", "Evasive", "Vague"],
    antonyms: ["Unequivocal", "Explicit", "Definite", "Clear-cut"]
  },
  {
    word: "Ebitda",
    pos: "noun",
    definition: "Earnings Before Interest, Taxes, Depreciation, and Amortization; a standard metric used by executives and investors to evaluate core operating profitability.",
    taWord: "வட்டி, வரி மற்றும் தேய்மானத்திற்கு முந்தைய செயல்பாட்டு லாபம்",
    enExample: "The private equity firm evaluated the acquisition target based on a multiple of its normalized annual EBITDA.",
    taExample: "தனியார் முதலீட்டு நிறுவனம் கையகப்படுத்த வேண்டிய நிறுவனத்தை அதன் வருடாந்திர செயல்பாட்டு லாபத்தின் அடிப்படையில் மதிப்பீடு செய்தது.",
    enExample2: "By cutting unnecessary marketing spend, the company improved its EBITDA margin by four hundred basis points.",
    taExample2: "தேவையற்ற சந்தைப்படுத்தல் செலவுகளைக் குறைத்ததன் மூலம், நிறுவனம் தனது செயல்பாட்டு லாப வரம்பை குறிப்பிடத்தக்க அளவு அதிகரித்தது.",
    synonyms: ["Operating cash earnings", "Core operational profit", "Gross cash profit"],
    antonyms: ["Net loss", "Bottom-line deficit"]
  },
  {
    word: "Epilogue",
    pos: "noun",
    definition: "A section or speech at the end of a book, play, or television series that serves as a comment on or conclusion to what has happened.",
    taWord: "முடிவுரை / பின்னுரை",
    enExample: "In the moving epilogue, the author chronicled the lives of the characters ten years after the revolution.",
    taExample: "மனதைத் தொடும் முடிவுரையில், புரட்சிக்குப் பத்து ஆண்டுகளுக்குப் பிறகு கதாபாத்திரங்களின் வாழ்க்கையை ஆசிரியர் விவரித்தார்.",
    enExample2: "The investigative documentary concluded with a cautionary epilogue addressing pending regulatory reforms.",
    taExample2: "புலனாய்வு ஆவணப்படம் நிலுவையில் உள்ள ஒழுங்குமுறை சீர்திருத்தங்கள் குறித்த எச்சரிக்கையான பின்னுரையுடன் முடிவடைந்தது.",
    synonyms: ["Afterword", "Postscript", "Conclusion", "Coda"],
    antonyms: ["Prologue", "Introduction", "Foreword", "Preface"]
  },
  {
    word: "Epiphany",
    pos: "noun",
    definition: "A moment of sudden and profound revelation, realization, or insight.",
    taWord: "திடீர் ஞானோதயம் / மின்னல் போன்ற தெளிவு",
    enExample: "The researcher experienced an epiphany while walking through the park, suddenly realizing the solution to the mathematical proof.",
    taExample: "பூங்காவில் நடைபயிற்சி மேற்கொண்டிருந்த போது ஆராய்ச்சியாளருக்கு திடீர் ஞானோதயம் ஏற்பட்டு, கணக்கின் தீர்வு உடனடியாகப் புரிந்தது.",
    enExample2: "The lead designer had an epiphany that dramatically simplified the application's onboarding flow.",
    taExample2: "பயன்பாட்டின் தொடக்கப் பயன்பாட்டு செயல்முறையை வியத்தகு முறையில் எளிமையாக்கும் ஒரு திடீர் யோசனை தலைமை வடிவமைப்பாளருக்கு தோன்றியது.",
    synonyms: ["Revelation", "Insight", "Realization", "Flash of inspiration"],
    antonyms: ["Confusion", "Oblivion", "Blindness", "Obscurity"]
  },

  // F
  {
    word: "Fiduciary",
    pos: "adjective",
    definition: "Involving trust, especially with regard to the legal relationship between a trustee and beneficiary, or corporate board and shareholders.",
    taWord: "நம்பிக்கை சார்ந்த சட்டப் பொறுப்புடைய / நிதிப் பொறுப்பாளர்",
    enExample: "Corporate board members bear a strict fiduciary duty to act in the best long-term interest of company shareholders.",
    taExample: "நிறுவன பங்குதாரர்களின் நீண்ட கால நலனுக்காக செயல்படும் கடுமையான சட்டப் பொறுப்பு இயக்குநரவை உறுப்பினர்களுக்கு உள்ளது.",
    enExample2: "Financial advisers registered as fiduciaries are legally required to put client interests above their own fee commissions.",
    taExample2: "சட்டப்பூர்வ நிதி ஆலோசகர்கள் தங்கள் சொந்த கமிஷனை விட வாடிக்கையாளரின் நலனுக்கே முன்னுரிமை அளிக்க வேண்டும் என்பது சட்டமாகும்.",
    synonyms: ["Trust-based", "Custodial", "Trustee", "Confidential"],
    antonyms: ["Self-serving", "Unregulated", "Opportunistic"]
  },
  {
    word: "Fault tolerance",
    pos: "noun",
    definition: "The property that enables a system to continue operating properly in the event of the failure of one or more of its components.",
    taWord: "பிழை தாங்கும் திறன் / தடையற்ற இயங்குதிறன்",
    enExample: "Cloud architects design geo-redundant clusters to achieve high fault tolerance during unexpected data center outages.",
    taExample: "எதிர்பாராத தரவு மைய முடக்கங்களின் போது தடையற்ற இயங்குதிறனை அடைய கிளவுட் கட்டமைப்பாளர்கள் பல பிராந்திய கட்டமைப்புகளை உருவாக்குகின்றனர்.",
    enExample2: "The space exploration capsule relies on triple-redundant avionics systems for absolute fault tolerance.",
    taExample2: "விண்வெளி ஆய்வுக் கூண்டு முழுமையான பிழை தாங்கும் திறனுக்காக மூன்று அடுக்கு பாதுகாப்பு கணினி அமைப்புகளை நம்பியுள்ளது.",
    synonyms: ["Resilience", "Redundancy", "Robustness", "High availability"],
    antonyms: ["Single point of failure", "Fragility", "Vulnerability"]
  },
  {
    word: "Filibuster",
    pos: "noun",
    definition: "An action such as a prolonged speech that obstructs progress in a legislative assembly while not technically contravening the required procedures.",
    taWord: "காலந்தாழ்த்தும் உரை / மசோதாவை முடக்கும் நீண்ட பேச்சு",
    enExample: "The senator staged a twenty-hour filibuster on the Senate floor to delay the voting on the contentious budget bill.",
    taExample: "சர்ச்சைக்குரிய பட்ஜெட் மசோதா மீதான வாக்கெடுப்பை தாமதப்படுத்த செனட்டர் அவையில் இருபது மணிநேரம் நீண்ட உரை நிகழ்த்தினார்.",
    enExample2: "BBC parliamentary correspondents debated whether filibuster rules should be reformed to end legislative gridlock.",
    taExample2: "சட்டமன்ற முடக்கத்தை முடிவுக்குக் கொண்டுவர காலந்தாழ்த்தும் விதிகளில் சீர்திருத்தம் கொண்டுவர வேண்டுமா என பிபிசி நிருபர்கள் விவாதித்தனர்.",
    synonyms: ["Stonewalling", "Delaying tactic", "Obstructionism", "Procrastination"],
    antonyms: ["Expedition", "Fast-tracking", "Prompt voting"]
  },
  {
    word: "Frictionless",
    pos: "adjective",
    definition: "Achieved with effortless ease and no resistance; in commerce and software, requiring minimal user effort or technical friction.",
    taWord: "தடைகளற்ற / மிக எளிதான மற்றும் தடையற்ற",
    enExample: "The fintech startup designed a frictionless one-click checkout flow to reduce shopping cart abandonment rates.",
    taExample: "ஷாப்பிங் கார்ட் கைவிடப்படுவதைக் குறைக்க அந்த நிதித் தொழில்நுட்ப நிறுவனம் தடையற்ற ஒற்றை கிளிக் கட்டண முறையை வடிவமைத்தது.",
    enExample2: "Cross-border trade agreements aim to create frictionless supply chains between allied economic regions.",
    taExample2: "நட்பு பொருளாதாரப் பகுதிகளுக்கு இடையே தடையற்ற விநியோகச் சங்கிலிகளை உருவாக்குவதை எல்லை கடந்த வர்த்தக ஒப்பந்தங்கள் நோக்கமாகக் கொண்டுள்ளன.",
    synonyms: ["Seamless", "Effortless", "Smooth", "Unimpeded"],
    antonyms: ["Cumbersome", "Friction-heavy", "Impeded", "Burdensome"]
  },

  // G
  {
    word: "Gamification",
    pos: "noun",
    definition: "The application of typical elements of game playing (e.g., point scoring, badges, competition) to non-game activities like education, fitness, or workplace productivity.",
    taWord: "விளையாட்டு முறைப்படுத்துதல் / உற்சாகப்படுத்தும் உத்தி",
    enExample: "The language learning app leveraged gamification with daily streaks and achievement badges to double user retention.",
    taExample: "மொழி கற்றல் செயலி தினசரி தொடர் சாதனைகள் மற்றும் பேட்ஜ்கள் போன்ற விளையாட்டு உத்திகளைப் பயன்படுத்தி பயனர் பயன்பாட்டை இரட்டிப்பாக்கியது.",
    enExample2: "Scholars examine how enterprise software uses gamification to encourage compliance and boost employee engagement.",
    taExample2: "பணியாளர்களின் ஈடுபாட்டை அதிகரிக்க பெருநிறுவன மென்பொருள்கள் எவ்வாறு விளையாட்டு முறைகளைப் பயன்படுத்துகின்றன என்பதை அறிஞர்கள் ஆராய்கின்றனர்.",
    synonyms: ["Incentivization", "Playful design", "Behavioral reward system"],
    antonyms: ["Strict regulation", "Dull routine", "Pure utility"]
  },
  {
    word: "Granularity",
    pos: "noun",
    definition: "The scale or level of detail in a set of data, analysis, permissions, or system architecture.",
    taWord: "நுணுக்க நிலை / விவரத்தின் ஆழம்",
    enExample: "The analytics platform allows managers to inspect revenue metrics at various levels of granularity, from global down to individual stores.",
    taExample: "வருவாய் புள்ளிவிவரங்களை உலகளாவிய நிலை முதல் தனிப்பட்ட கடைகள் வரையிலான பல்வேறு நுணுக்க நிலைகளில் ஆய்வு செய்ய அந்த தளம் மேலாளர்களை அனுமதிக்கிறது.",
    enExample2: "Security engineers implemented fine granularity in access control policies to limit lateral movement within the cloud network.",
    taExample2: "கிளவுட் நெட்வொர்க்கில் தேவையின்றி ஊடுருவுவதைக் கட்டுப்படுத்த பாதுகாப்பு பொறியாளர்கள் அனுமதி விதிகளில் மிக நுணுக்கமான நிலைகளைச் செயல்படுத்தினர்.",
    synonyms: ["Specificity", "Detail level", "Precision", "Resolution"],
    antonyms: ["Coarseness", "Vagueness", "Broad generality"]
  },
  {
    word: "Growth hacking",
    pos: "noun",
    definition: "A process of rapid experimentation across marketing funnel, product development, and sales segments to identify the most efficient ways to scale a business.",
    taWord: "விரைவு வளர்ச்சி உத்தி / குறைந்த செலவில் பெருவளர்ச்சி காணும் நுட்பம்",
    enExample: "By implementing viral invite mechanics, the early-stage startup used growth hacking to acquire its first million users without paid advertising.",
    taExample: "வைரல் அழைப்பு முறைகளைச் செயல்படுத்தியதன் மூலம், அந்த தொடக்க நிறுவனம் கட்டண விளம்பரமின்றி தனது முதல் பத்து லட்சம் பயனர்களைப் பெற்றது.",
    enExample2: "Top executives caution that while growth hacking accelerates early adoption, sustainable retention requires solid product quality.",
    taExample2: "வளர்ச்சி உத்திகள் ஆரம்பகால பயனர்களை ஈர்த்தாலும், நிலையான வளர்ச்சிக்கு சிறந்த தயாரிப்பு தரமே அவசியம் என்று உயர் நிர்வாகிகள் எச்சரிக்கின்றனர்.",
    synonyms: ["Viral marketing", "Rapid scaling strategy", "Data-driven growth"],
    antonyms: ["Traditional outbound advertising", "Slow organic expansion"]
  },

  // H
  {
    word: "Hyperbole",
    pos: "noun",
    definition: "Exaggerated statements or claims not meant to be taken literally, used for emphasis or dramatic effect.",
    taWord: "மிகைப்படுத்தப்பட்ட கூற்று / உயர்வு நவிற்சி",
    enExample: "Tech critics warned consumers to look past marketing hyperbole when evaluating artificial intelligence claims.",
    taExample: "செயற்கை நுண்ணறிவு உரிமைகோரல்களை மதிப்பிடும்போது விளம்பர மிகைப்படுத்தல்களைக் கடந்து உண்மையை ஆராயுமாறு தொழில்நுட்ப விமர்சகர்கள் எச்சரித்தனர்.",
    enExample2: "The BBC political correspondent noted that both sides in the debate indulged in theatrical hyperbole.",
    taExample2: "விவாதத்தில் இரு தரப்பினரும் மிகைப்படுத்தப்பட்ட நாடகத்தனமான கூற்றுகளைப் பயன்படுத்தியதாக பிபிசி அரசியல் செய்தியாளர் குறிப்பிட்டார்.",
    synonyms: ["Exaggeration", "Overstatement", "Amplification", "Magnification"],
    antonyms: ["Understatement", "Meiosis", "Litotes", "Exactitude"]
  },
  {
    word: "Hermeneutics",
    pos: "noun",
    definition: "The branch of knowledge that deals with interpretation, especially the critical interpretation of biblical texts, philosophical works, or legal statutes.",
    taWord: "விளக்கவுரை இயல் / ஆழ்ந்த நூற்பொருள் ஆய்வு",
    enExample: "Legal scholars apply constitutional hermeneutics to interpret ancient statutory language in modern digital contexts.",
    taExample: "பழைய சட்ட மொழிகளை நவீன டிஜிட்டல் சூழலில் புரிந்துகொள்ள சட்ட அறிஞர்கள் அரசியலமைப்பு விளக்கவுரை இயலைப் பயன்படுத்துகின்றனர்.",
    enExample2: "The literature professor led a seminar on literary hermeneutics, exploring multiple layers of meaning in Renaissance poetry.",
    taExample2: "மறுமலர்ச்சி கால கவிதைகளில் உள்ள பல அடுக்கு அர்த்தங்களை ஆராயும் இலக்கிய விளக்கவுரை கருத்தரங்கை பேராசிரியர் நடத்தினார்.",
    synonyms: ["Exegesis", "Interpretation", "Textual analysis", "Decipherment"],
    antonyms: ["Literalism", "Superficial reading", "Misinterpretation"]
  },
  {
    word: "Hubris",
    pos: "noun",
    definition: "Excessive pride or dangerous self-confidence, often leading to tragic downfall or catastrophic failure.",
    taWord: "மமதை / வீழ்ச்சிக்கு வழிகோலும் வரம்புமீறிய கர்வம்",
    enExample: "Financial historians noted that corporate hubris blinded the investment bank to the systemic risks of subprime mortgages.",
    taExample: "வரம்புமீறிய மமதை காரணமாகவே அந்த முதலீட்டு வங்கி கடன் சந்தையின் அபாயங்களைக் கவனிக்கத் தவறியது என்று வரலாற்று ஆய்வாளர்கள் குறிப்பிட்டனர்.",
    enExample2: "In classic Greek tragedy, the protagonist's fatal hubris inevitably invites retribution from the gods.",
    taExample2: "பாரம்பரிய கிரேக்க சோக நாடகங்களில், கதாநாயகனின் வரம்புமீறிய கர்வம் தவிர்க்க முடியாமல் அழிவை அழைக்கிறது.",
    synonyms: ["Arrogance", "Conceit", "Audacity", "Overconfidence"],
    antonyms: ["Humility", "Modesty", "Prudence", "Diffidence"]
  },

  // I
  {
    word: "Inadvertent",
    pos: "adjective",
    definition: "Not resulting from or achieved through deliberate planning; unintentional, accidental, or oversight.",
    taWord: "கவனக்குறைவான / திட்டமிடப்படாத / தற்செயலான",
    enExample: "An inadvertent configuration error caused a three-hour downtime across the cloud provider's European data center.",
    taExample: "கவனக்குறைவாக செய்யப்பட்ட அமைவுப் பிழை ஐரோப்பிய தரவு மையத்தில் மூன்று மணி நேர தடையை ஏற்படுத்தியது.",
    enExample2: "The BBC broadcaster issued a clarification after an inadvertent slip of the tongue during the live bulletin.",
    taExample2: "நேரலை செய்தி வாசிப்பின் போது தற்செயலாக ஏற்பட்ட நழுவலுக்குப் பிறகு பிபிசி செய்தி நிறுவனம் விளக்கம் அளித்தது.",
    synonyms: ["Unintentional", "Accidental", "Unwitting", "Involuntary"],
    antonyms: ["Deliberate", "Intentional", "Calculated", "Premeditated"]
  },
  {
    word: "Indelible",
    pos: "adjective",
    definition: "Making marks that cannot be removed; permanently memorable or impossible to forget or erase.",
    taWord: "அழியாத / மாற்ற முடியாத நீங்கா நினைவான",
    enExample: "The whistleblower's testimony left an indelible impression on the members of the congressional inquiry panel.",
    taExample: "விசாரணைக் குழு உறுப்பினர்கள் மத்தியில் உண்மையை அம்பலப்படுத்தியவரின் வாக்குமூலம் ஒரு அழியாத தாக்கத்தை ஏற்படுத்தியது.",
    enExample2: "The documentary highlights the indelible cultural legacy of 1960s civil rights activists.",
    taExample2: "1960-களின் சிவில் உரிமைப் போராளிகளின் அழியாத கலாச்சாரப் பாரம்பரியத்தை இந்த ஆவணப்படம் எடுத்துரைக்கிறது.",
    synonyms: ["Inerasable", "Permanent", "Enduring", "Unforgettable"],
    antonyms: ["Erasable", "Ephemeral", "Transient", "Forgettable"]
  },
  {
    word: "Inflection point",
    pos: "noun",
    definition: "A decisive moment or turning point in a situation, project, or economy where a major significant change takes place.",
    taWord: "திருப்புமுனை / போக்கை மாற்றும் முக்கிய தருணம்",
    enExample: "Industry analysts consider the rollout of generative AI as a historic inflection point for the global software sector.",
    taExample: "உருவாக்க செயற்கை நுண்ணறிவின் வருகையை உலகளாவிய மென்பொருள் துறையின் வரலாற்று சிறப்புமிக்க திருப்புமுனையாக ஆய்வாளர்கள் கருதுகின்றனர்.",
    enExample2: "The CEO explained that the quarterly results marked an inflection point toward sustained international profitability.",
    taExample2: "இந்த காலாண்டு முடிவுகள் நிலையான சர்வதேச லாபத்தை நோக்கிய ஒரு முக்கிய திருப்புமுனையாக அமைந்துள்ளது என்று தலைமை நிர்வாகி விளக்கினார்.",
    synonyms: ["Turning point", "Watershed moment", "Crux", "Milestone transition"],
    antonyms: ["Plateau", "Stagnation", "Status quo", "Steady state"]
  },
  {
    word: "Inimical",
    pos: "adjective",
    definition: "Tending to obstruct, harm, or oppose; adverse, hostile, or unfriendly.",
    taWord: "விரோதமான / தீங்கு விளைவிக்கும் / பாதகமான",
    enExample: "Scholars argued that state censorship is fundamentally inimical to genuine scientific inquiry and academic freedom.",
    taExample: "அரசு தணிக்கை என்பது உண்மையான அறிவியல் ஆய்வுக்கும் கல்வி சுதந்திரத்திற்கும் முற்றிலும் பாதகமானது என்று அறிஞர்கள் வாதிட்டனர்.",
    enExample2: "High interest rates proved inimical to early-stage venture capital fundraising across the tech ecosystem.",
    taExample2: "அதிக வட்டி விகிதங்கள் தொழில்நுட்பத் துறையில் ஆரம்பகட்ட முதலீட்டு நிதி திரட்டலுக்கு பாதகமாக அமைந்தன.",
    synonyms: ["Detrimental", "Harmful", "Adverse", "Antagonistic"],
    antonyms: ["Conducive", "Beneficial", "Favorable", "Auspicious"]
  },
  {
    word: "Insurrection",
    pos: "noun",
    definition: "A violent uprising or armed rebellion against an authority, government, or state.",
    taWord: "கிளர்ச்சி / ஆயுதமேந்திய அரசு எதிர்ப்பு எழுச்சி",
    enExample: "BBC World News provided rolling coverage as security forces pushed back against the violent armed insurrection.",
    taExample: "ஆயுதமேந்திய வன்முறைக் கிளர்ச்சியை பாதுகாப்புப் படைகள் முறியடித்ததை பிபிசி வேர்ல்ட் நியூஸ் தொடர்ந்து ஒளிபரப்பியது.",
    enExample2: "Historians examined the social grievances that precipitated the sudden civilian insurrection in the provincial capital.",
    taExample2: "மாகாண தலைநகரில் திடீர் மக்கள் கிளர்ச்சியைத் தூண்டிய சமூகக் குறைகளை வரலாற்று ஆய்வாளர்கள் ஆராய்ந்தனர்.",
    synonyms: ["Rebellion", "Uprising", "Mutiny", "Revolt"],
    antonyms: ["Pacification", "Submission", "Order", "Compliance"]
  },
  {
    word: "Incumbent",
    pos: "noun",
    definition: "The current holder of an official post, political office, or market leadership position.",
    taWord: "பதவியில் இருப்பவர் / நடப்பு தலைவர் / ஆதிக்க நிறுவனம்",
    enExample: "The tech startup aimed to challenge the entrenched legacy incumbent with faster speeds and lower subscription fees.",
    taExample: "வேகமான செயல்திறன் மற்றும் குறைந்த கட்டணங்கள் மூலம் சந்தையில் ஆதிக்கம் செலுத்தும் பழைய நிறுவனத்திற்கு சவால் விட ஸ்டார்ட்-அப் திட்டமிட்டது.",
    enExample2: "Polls suggested that the political incumbent faced an uphill battle against the popular reformist candidate.",
    taExample2: "பிரபலமான சீர்திருத்த வேட்பாளருக்கு எதிராக பதவியில் இருக்கும் அரசியல்வாதி கடுமையான சவாலை எதிர்கொள்கிறார் என கருத்துக் கணிப்புகள் தெரிவிக்கின்றன.",
    synonyms: ["Current holder", "Reigning leader", "Officeholder"],
    antonyms: ["Challenger", "Candidate", "Disruptor", "Successor"]
  },
  {
    word: "Indictment",
    pos: "noun",
    definition: "A formal charge or accusation of a serious crime; a thing that illustrates how bad or corrupt a system is.",
    taWord: "முறையான குற்றப்பத்திரிகை / சீரழிவைக் காட்டும் சான்றாவணம்",
    enExample: "The federal grand jury returned a thirty-count criminal indictment against the fraudulent hedge fund manager.",
    taExample: "மோசடி செய்த முதலீட்டு நிதி மேலாளருக்கு எதிராக ஃபெடரல் நடுவர் குழு முப்பது பிரிவுகளின் கீழ் குற்றப்பத்திரிகையைத் தாக்கல் செய்தது.",
    enExample2: "The investigative report stood as a blistering indictment of the state's neglected public transit infrastructure.",
    taExample2: "அந்த புலனாய்வு அறிக்கை மாநிலத்தின் புறக்கணிக்கப்பட்ட பொதுப் போக்குவரத்து கட்டமைப்பின் மீதான கடுமையான குற்றச்சாட்டாக அமைந்தது.",
    synonyms: ["Formal charge", "Accusation", "Condemnation", "Arraignment"],
    antonyms: ["Acquittal", "Exoneration", "Absolution", "Vindication"]
  },
  {
    word: "Injunction",
    pos: "noun",
    definition: "An authoritative warning or judicial order restraining a person or organization from an action or compelling them to do something.",
    taWord: "நீதிமன்றத் தடை உத்தரவு / சட்டப்பூர்வ கட்டளை",
    enExample: "The court granted an emergency preliminary injunction barring the competitor from distributing the leaked trade secrets.",
    taExample: "கசிந்த வணிக ரகசியங்களை போட்டியாளர் வெளியிடுவதைத் தடுக்கும் அவசர தடை உத்தரவை நீதிமன்றம் பிறப்பித்தது.",
    enExample2: "Environmental groups sought a federal injunction to halt construction near the endangered wildlife sanctuary.",
    taExample2: "அழிந்துவரும் வனவிலங்கு சரணாலயத்திற்கு அருகில் கட்டுமானத்தை நிறுத்த சுற்றுச்சூழல் குழுக்கள் மத்திய தடை உத்தரவைக் கோரின.",
    synonyms: ["Court order", "Restraining order", "Prohibition", "Interdict"],
    antonyms: ["Authorization", "Sanction", "Permit", "Clearance"]
  },

  // J
  {
    word: "Jurisprudence",
    pos: "noun",
    definition: "The theory or philosophy of law; a legal system or body of judicial precedents.",
    taWord: "சட்டவியல் / சட்டத் தத்துவம் / நீதித்துறை முன்மாதிரிகள்",
    enExample: "Scholars analyzed how Supreme Court jurisprudence over privacy rights has evolved with emerging internet technologies.",
    taExample: "இணைய தொழில்நுட்பங்களின் வருகையுடன் தனியுரிமை உரிமைகள் குறித்த உச்ச நீதிமன்ற சட்டவியல் எவ்வாறு பரிணமித்துள்ளது என்பதை அறிஞர்கள் ஆய்வு செய்தனர்.",
    enExample2: "The landmark ruling established a significant new precedent in environmental jurisprudence.",
    taExample2: "அந்த வரலாற்றுச் சிறப்புமிக்க தீர்ப்பு சுற்றுச்சூழல் சட்டவியலில் ஒரு முக்கியமான புதிய முன்மாதிரியை நிறுவியது.",
    synonyms: ["Legal theory", "Philosophy of law", "Case law", "Legal code"],
    antonyms: ["Lawlessness", "Anarchy", "Arbitrary rule"]
  },
  {
    word: "Junta",
    pos: "noun",
    definition: "A military or political group that rules a country after taking power by force, typically following a coup.",
    taWord: "ராணுவக் குழு ஆட்சி / ராணுவ சர்வாதிகாரக் குழு",
    enExample: "The BBC world affairs correspondent reported that the ruling military junta imposed a nationwide communications blackout.",
    taExample: "ஆளும் ராணுவ சர்வாதிகாரக் குழு நாடு தழுவிய தகவல் தொடர்பு முடக்கத்தை விதித்துள்ளதாக பிபிசி சர்வதேச செய்தியாளர் தெரிவித்தார்.",
    enExample2: "Neighboring nations threatened economic sanctions unless the junta agreed to restore civilian democratic elections.",
    taExample2: "ராணுவக் குழு ஜனநாயகத் தேர்தலை மீண்டும் நடத்த ஒப்புக்கொள்ளாவிட்டால் பொருளாதாரத் தடைகள் விதிக்கப்படும் என்று அண்டை நாடுகள் எச்சரித்தன.",
    synonyms: ["Military council", "Regime", "Cabal", "Autocracy"],
    antonyms: ["Civilian democracy", "Elected parliament", "Constitutional government"]
  },

  // K
  {
    word: "Key performance indicator",
    pos: "noun",
    definition: "A quantifiable measure used to evaluate the success of an organization or project in meeting objectives for performance.",
    taWord: "முக்கிய செயல்திறன் அளவுகோல்",
    enExample: "Customer churn rate and monthly recurring revenue serve as the primary Key Performance Indicators for subscription software businesses.",
    taExample: "வாடிக்கையாளர் வெளியேற்ற விகிதம் மற்றும் மாதாந்திர வருவாய் ஆகியவை சந்தா மென்பொருள் வணிகங்களின் முதன்மை செயல்திறன் அளவுகோல்களாகும்.",
    enExample2: "Executives review team KPIs during quarterly business reviews to reallocate corporate resources effectively.",
    taExample2: "கார்ப்பரேட் வளங்களை திறம்பட ஒதுக்க காலாண்டு வணிக ஆய்வுகளின் போது உயர் அதிகாரிகள் குழுவின் செயல்திறன் அளவுகோல்களை ஆய்வு செய்கிறார்கள்.",
    synonyms: ["Performance metric", "Benchmark metric", "Success metric"],
    antonyms: ["Qualitative guesswork", "Arbitrary appraisal"]
  },

  // L
  {
    word: "Linear",
    pos: "adjective",
    definition: "Progressing from one stage to another in a single series of consecutive steps; directly proportional without compounding acceleration.",
    taWord: "நேர்கோட்டுப் பாணியிலான / சீரான முறையில் தொடரும்",
    enExample: "Software complexity often scales exponentially even when feature count grows in a purely linear fashion.",
    taExample: "அம்சங்களின் எண்ணிக்கை நேர்கோட்டு முறையில் சீராக அதிகரித்தாலும் கூட மென்பொருளின் சிக்கல்தன்மை அதிவேகமாக அதிகரிக்கிறது.",
    enExample2: "Modern film writers often eschew linear narrative structure in favor of complex interwoven flashbacks.",
    taExample2: "நவீன திரைப்பட எழுத்தாளர்கள் நேர்கோட்டு கதை சொல்லும் முறையைத் தவிர்த்து பின்னோக்கிய நினைவலைகளைக் கொண்ட உத்திகளைப் பயன்படுத்துகின்றனர்.",
    synonyms: ["Sequential", "Straightforward", "Consecutive", "Proportional"],
    antonyms: ["Non-linear", "Exponential", "Random", "Cyclical"]
  },
  {
    word: "Litmus test",
    pos: "noun",
    definition: "A decisively indicative test or critical standard used to judge the quality, loyalty, or true intent of something.",
    taWord: "உண்மை நிலையை அறியும் உரைகல் / தீர்க்கமான சோதனை",
    enExample: "Handling a high-volume live production outage is the ultimate litmus test for an engineering team's resilience.",
    taExample: "நேரலை இயக்கத்தில் ஏற்படும் பெரும் முடக்கத்தை கையாள்வதே ஒரு பொறியியல் குழுவின் திறமைக்கான இறுதி உரைகல் சோதனையாகும்.",
    enExample2: "The confirmation vote was viewed by commentators as a crucial litmus test of party loyalty in parliament.",
    taExample2: "நாடாளுமன்றத்தில் கட்சி விசுவாசத்தை அறியும் முக்கியமான உரைகல்லாக அந்த ஒப்புதல் வாக்கெடுப்பு பார்க்கப்பட்டது.",
    synonyms: ["Touchstone", "Crucial test", "Acid test", "Benchmark"],
    antonyms: ["Inconclusive indicator", "Superficial trial"]
  },
  {
    word: "Logistical",
    pos: "adjective",
    definition: "Relating to or involving the detailed organization and operational implementation of a complex plan or operation.",
    taWord: "தளவாட மற்றும் செயல்முறை மேலாண்மை சார்ந்த",
    enExample: "Distributing vaccines to remote polar communities presented immense logistical challenges for the health ministry.",
    taExample: "தொலைதூர துருவப் பகுதி மக்களுக்கு தடுப்பூசிகளை வழங்குவது சுகாதார அமைச்சகத்திற்கு மிகப்பெரிய தளவாட மேலாண்மை சவால்களை ஏற்படுத்தியது.",
    enExample2: "The event management team handled all logistical coordination, including venue staging, security, and satellite uplinks.",
    taExample2: "அரங்கு அமைப்பு, பாதுகாப்பு மற்றும் செயற்கைக்கோள் ஒளிபரப்பு உள்ளிட்ட அனைத்து தளவாட ஒருங்கிணைப்புகளையும் குழு நிர்வகித்தது.",
    synonyms: ["Operational", "Organizational", "Planning-related", "Tactical"],
    antonyms: ["Theoretical", "Abstract", "Conceptual"]
  },
  {
    word: "Ludicrous",
    pos: "adjective",
    definition: "So foolish, unreasonable, or out of place as to be amusing or worthy of ridicule.",
    taWord: "நகைப்புக்கிடமான / கேலிக்குரிய / எல்லைமீறிய அபத்தம்",
    enExample: "The board rejected the exorbitant consulting fee proposal as completely ludicrous given the company's deficit.",
    taExample: "நிறுவனத்தின் நிதிப் பற்றாக்குறையைக் கருத்தில் கொண்டு அதிகப்படியான ஆலோசனைக் கட்டண முன்மொழிவை கேலிக்குரியது என நிர்வாகக் குழு நிராகரித்தது.",
    enExample2: "In classic satire, actors use ludicrous exaggerations to critique societal vanity and political incompetence.",
    taExample2: "பாரம்பரிய நையாண்டி நாடகங்களில் சமூக அறியாமையையும் அரசியல் திறமையின்மையையும் விமர்சிக்க நடிகர்கள் நகைப்புக்கிடமான மிகைப்படுத்தல்களைப் பயன்படுத்துகின்றனர்.",
    synonyms: ["Absurd", "Preposterous", "Ridiculous", "Farcical"],
    antonyms: ["Sensible", "Reasonable", "Plausible", "Grave"]
  },
  {
    word: "Liquidity",
    pos: "noun",
    definition: "The availability of liquid assets (such as cash) to a market or company; the ease with which an asset can be converted into ready cash without affecting its market price.",
    taWord: "பணப்புழக்கம் / நீர்மைத் தன்மை / எளிதில் பணமாக்கும் திறன்",
    enExample: "Central banks injected emergency liquidity into the commercial banking system to prevent credit markets from freezing.",
    taExample: "கடன் சந்தைகள் முடங்குவதைத் தடுக்க மத்திய வங்கிகள் வணிக வங்கிகளுக்கு அவசர பணப்புழக்கத்தை வழங்கின.",
    enExample2: "Real estate investments yield long-term gains but lack the immediate liquidity of publicly traded equities.",
    taExample2: "ரியல் எஸ்டேட் முதலீடுகள் நீண்ட கால ஆதாயங்களைத் தந்தாலும், பங்குச் சந்தையைப் போல உடனடியாக பணமாக்கும் திறனைக் கொண்டிருக்கவில்லை.",
    synonyms: ["Cash availability", "Market depth", "Fluid capital", "Solvency"],
    antonyms: ["Illiquidity", "Insolvency", "Capital freeze"]
  },
  {
    word: "Leitmotif",
    pos: "noun",
    definition: "A recurrent theme or musical motif associated throughout a musical or literary composition with a specific person, situation, or idea.",
    taWord: "மீண்டும் மீண்டும் வரும் அடிப்படைக் கருப்பொருள் / மைய இசைக்குறிப்பு",
    enExample: "Film composers skillfully weave a tragic brass leitmotif whenever the antagonist appears on screen.",
    taExample: "வில்லன் திரையில் தோன்றும் போதெல்லாம் திரைப்பட இசையமைப்பாளர்கள் ஒரு சோகமான பித்தளை இசைக் கருப்பொருளை நேர்த்தியாக ஒலிக்க விடுகின்றனர்.",
    enExample2: "The obsession with fleeting digital fame served as the recurring leitmotif throughout the television drama.",
    taExample2: "டிஜிட்டல் புகழின் மீதான அதீத மோகம் அந்த தொலைக்காட்சி நாடகத் தொடர் முழுவதும் மீண்டும் மீண்டும் வரும் மையக் கருப்பொருளாக இருந்தது.",
    synonyms: ["Recurring theme", "Keynote", "Motif", "Central melody"],
    antonyms: ["One-off element", "Incidental tune"]
  },

  // M
  {
    word: "Manifestation",
    pos: "noun",
    definition: "An event, action, or object that clearly shows or embodies something abstract, theoretical, or spiritual.",
    taWord: "வெளிப்பாடு / கண்கூடாகத் தோன்றும் வடிவம்",
    enExample: "The widespread street protests were a visible manifestation of deep public frustration over economic stagnation.",
    taExample: "பொருளாதார தேக்கநிலை குறித்த பொதுமக்களின் ஆழ்ந்த விரக்தியின் கண்கூடான வெளிப்பாடாக இந்த வீதிப் போராட்டங்கள் அமைந்தன.",
    enExample2: "Software bugs are frequently the outward manifestation of underlying architectural misalignments.",
    taExample2: "மென்பொருள் பிழைகள் பெரும்பாலும் கணினிக் கட்டமைப்பில் உள்ள அடிப்படை குறைபாடுகளின் வெளிப்புற வெளிப்பாடாகும்.",
    synonyms: ["Embodiment", "Expression", "Demonstration", "Exemplification"],
    antonyms: ["Hiding", "Concealment", "Suppression", "Abstraction"]
  },
  {
    word: "Microcosm",
    pos: "noun",
    definition: "A community, place, or situation regarded as encapsulating in miniature the characteristic qualities, challenges, or features of something much larger.",
    taWord: "நுண்வடிவம் / சிறுமாதிரி / பெரிய உலகைப் பிரதிபலிக்கும் சிறிய உலகம்",
    enExample: "Sociologists described the diverse university campus as a fascinating microcosm of modern multicultural society.",
    taExample: "பல்வேறு பின்னணிகளைக் கொண்ட இந்த பல்கலைக்கழக வளாகம் நவீன பன்முக சமூகத்தின் அற்புதமான சிறுமாதிரி என்று சமூகவியலாளர்கள் விவரித்தனர்.",
    enExample2: "The local municipal council election served as a microcosm of nationwide political divisions.",
    taExample2: "உள்ளாட்சித் தேர்தல் என்பது நாடு தழுவிய அரசியல் பிளவுகளின் ஒரு சிறிய பிரதிபலிப்பாக அமைந்தது.",
    synonyms: ["Miniature world", "Epitome", "Model in little", "Cross-section"],
    antonyms: ["Macrocosm", "The universe", "Totality"]
  },
  {
    word: "Mitigation",
    pos: "noun",
    definition: "The action of reducing the severity, seriousness, or harmful impact of a problem, risk, or climate disaster.",
    taWord: "பாதிப்பைக் குறைத்தல் / இடர் தணிப்பு",
    enExample: "The cybersecurity incident response team enacted rapid mitigation measures to isolate the compromised database server.",
    taExample: "பாதிக்கப்பட்ட தரவுத்தள சர்வரை தனிமைப்படுத்த இணையப் பாதுகாப்பு குழு உடனடி இடர் தணிப்பு நடவடிக்கைகளை மேற்கொண்டது.",
    enExample2: "The BBC climate summit panel discussed global flood mitigation strategies for vulnerable coastal cities.",
    taExample2: "பாதிக்கப்படக்கூடிய கடலோர நகரங்களுக்கான உலகளாவிய வெள்ள பாதிப்பு தணிப்பு உத்திகளை பிபிசி பருவநிலை மாநாட்டு குழு விவாதித்தது.",
    synonyms: ["Alleviation", "Abatement", "Reduction", "Attenuation"],
    antonyms: ["Aggravation", "Exacerbation", "Intensification"]
  },
  {
    word: "Monolithic",
    pos: "adjective",
    definition: "Formed of a single, indivisible large block; in computing, referring to an architecture where all components are tightly integrated into one program.",
    taWord: "ஒற்றைப் பாறை போன்ற / பிரிக்க முடியாத ஒற்றைக் கட்டமைப்புடைய",
    enExample: "Engineering teams successfully decoupled the legacy monolithic backend into scalable microservices.",
    taExample: "பொறியியல் குழுக்கள் பழைய ஒற்றைக் கட்டமைப்பு மென்பொருளை பல தனித்தனி மைக்ரோ சர்வீஸ்களாகப் பிரிப்பதில் வெற்றி பெற்றன.",
    enExample2: "Critics argued that the state-owned broadcasting monopoly had become too monolithic and bureaucratic to innovate.",
    taExample2: "அரசுக்குச் சொந்தமான ஒளிபரப்பு நிறுவனம் புதுமைகளைப் புகுத்த முடியாத அளவுக்கு இறுக்கமான ஒற்றை அமைப்பாக மாறிவிட்டதாக விமர்சகர்கள் கூறினர்.",
    synonyms: ["Indivisible", "Unitary", "Massive", "Inflexible"],
    antonyms: ["Modular", "Distributed", "Decoupled", "Flexible"]
  },
  {
    word: "Memoization",
    pos: "noun",
    definition: "An optimization technique used in programming to speed up programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.",
    taWord: "நினைவகத்தில் சேமித்து வேகப்படுத்துதல் / முந்தைய முடிவை மறுபயன்படுத்துதல்",
    enExample: "Senior React developers employ memoization hooks to prevent expensive component re-renders when props remain unchanged.",
    taExample: "அளவீடுகள் மாறாமல் இருக்கும்போது கணக்கீடுகளைத் தவிர்த்து செயல்திறனை அதிகரிக்க மூத்த ரியாக்ட் நிரலாளர்கள் மெமோயைசேஷன் உத்திகளைப் பயன்படுத்துகின்றனர்.",
    enExample2: "The dynamic programming algorithm uses recursive memoization to solve complex graph routing problems in polynomial time.",
    taExample2: "சிக்கலான வரைபடப் பாதைக் கணக்குகளை விரைவாகத் தீர்க்க அந்த நிரலாக்கம் முந்தைய முடிவுகளை நினைவகத்தில் சேமிக்கும் உத்தியைப் பயன்படுத்துகிறது.",
    synonyms: ["Caching results", "Look-up table caching", "Result caching"],
    antonyms: ["Re-computation", "Redundant recalculation"]
  },
  {
    word: "Multilateral",
    pos: "adjective",
    definition: "Agreed upon or participated in by three or more parties, especially the governments of different countries.",
    taWord: "பலதரப்பு உடன்பாடுடைய / பல நாடுகள் பங்கேற்கும்",
    enExample: "The BBC diplomatic editor reported that the multilateral trade treaty was signed by twelve Pacific Rim nations.",
    taExample: "பன்னிரண்டு பசிபிக் பெருங்கடல் நாடுகள் அந்த பலதரப்பு வர்த்தக ஒப்பந்தத்தில் கையெழுத்திட்டதாக பிபிசி தூதரக செய்தியாளர் தெரிவித்தார்.",
    enExample2: "Top scholars argue that solving international cybercrime requires strong multilateral governance frameworks.",
    taExample2: "சர்வதேச இணையக் குற்றங்களைத் தீர்க்க வலுவான பலதரப்பு நிர்வாகக் கட்டமைப்பு அவசியம் என முன்னணி அறிஞர்கள் வாதிடுகின்றனர்.",
    synonyms: ["Multi-party", "International", "Collective", "Pluralistic"],
    antonyms: ["Unilateral", "Bilateral", "One-sided"]
  },
  {
    word: "Monologue",
    pos: "noun",
    definition: "A long speech by one actor in a play or movie, or a prolonged talk by one person in a conversation.",
    taWord: "தனிநபர் உரை / ஓரங்கப் பேச்சு",
    enExample: "The veteran actor delivered an electrifying five-minute monologue that earned a standing ovation from the audience.",
    taExample: "அந்த மூத்த நடிகர் ஆற்றிய ஐந்து நிமிட உணர்ச்சிகரமான தனிநபர் உரை பார்வையாளர்களின் எழுந்து நின்று பாராட்டும் கைதட்டலைப் பெற்றது.",
    enExample2: "The late-night TV host opened the broadcast with a satirical monologue reviewing the week's headline news.",
    taExample2: "இரவு நேர தொலைக்காட்சி தொகுப்பாளர் வாரத்தின் முக்கிய செய்திகளை நையாண்டி செய்யும் தனிநபர் பார்வையுடன் நிகழ்ச்சியைத் தொடங்கினார்.",
    synonyms: ["Soliloquy", "Speech", "Address", "Discourse"],
    antonyms: ["Dialogue", "Conversation", "Colloquy", "Interchange"]
  },

  // O
  {
    word: "Orthogonal",
    pos: "adjective",
    definition: "Statistically independent or uncorrelated; in software and mathematics, allowing separate components to be modified without affecting each other.",
    taWord: "ஒன்றுக்கொன்று தொடர்பற்ற / தனித்தனியாக இயங்கக்கூடிய",
    enExample: "Software architects strive to design orthogonal features so that updating payment logic never breaks the notifications engine.",
    taExample: "பணம் செலுத்தும் பகுதியை மாற்றியமைப்பது அறிவிப்பு அமைப்பை பாதிக்காத வகையில் தன்னிச்சையாக இயங்கும் மென்பொருள் கூறுகளை கட்டமைப்பாளர்கள் உருவாக்குகிறார்கள்.",
    enExample2: "The philosopher argued that moral virtue and commercial success are essentially orthogonal dimensions of human life.",
    taExample2: "ஒழுக்க நெறியும் வணிக வெற்றியும் மனித வாழ்க்கையின் ஒன்றுக்கொன்று தொடர்பற்ற இருவேறு பரிமாணங்கள் என்று தத்துவஞானி வாதிட்டார்.",
    synonyms: ["Independent", "Decoupled", "Uncorrelated", "Perpendicular"],
    antonyms: ["Interdependent", "Correlated", "Entangled", "Coupled"]
  },
  {
    word: "Ostensibly",
    pos: "adverb",
    definition: "Apparently or purportedly, but perhaps not actually or truthfully; outwardly on the surface.",
    taWord: "வெளிப்பார்வைக்கு / பாசாங்காக / தோற்ற அளவில்",
    enExample: "The diplomat traveled abroad ostensibly for a trade convention, though insiders knew confidential peace talks were the real purpose.",
    taExample: "வர்த்தக மாநாட்டிற்காக செல்வதாக வெளிப்பார்வைக்குக் கூறி தூதர் பயணம் செய்தாலும், ரகசிய அமைதிப் பேச்சுவார்த்தையே உண்மையான நோக்கமாக இருந்தது.",
    enExample2: "The update was ostensibly designed to patch security bugs, but users discovered it also contained telemetry trackers.",
    taExample2: "இந்த புதுப்பிப்பு வெளிப்பார்வைக்கு பாதுகாப்பு பிழைகளை சரிசெய்ய வடிவமைக்கப்பட்டதாக கூறப்பட்டாலும், கண்காணிப்பு நிரல்களும் அதில் இருந்தது கண்டறியப்பட்டது.",
    synonyms: ["Purportedly", "Apparently", "Seemingly", "On the surface"],
    antonyms: ["Genuinely", "Truly", "In reality", "Authentically"]
  },
  {
    word: "Opportunity cost",
    pos: "noun",
    definition: "The loss of potential gain from other alternatives when one alternative is chosen.",
    taWord: "வாய்ப்பு இழப்புச் செலவு / மாற்று வாய்ப்பின் இழப்பு",
    enExample: "Senior executives evaluated the opportunity cost of investing capital in legacy hardware rather than expanding AI cloud infrastructure.",
    taExample: "கிளவுட் உள்கட்டமைப்பை விரிவாக்குவதற்கு பதிலாக பழைய சாதனங்களில் மூலதனத்தை முதலீடு செய்வதால் ஏற்படும் வாய்ப்பு இழப்பை நிர்வாகிகள் மதிப்பிட்டனர்.",
    enExample2: "Students should consider the opportunity cost of delaying higher education when deciding to enter the immediate job market.",
    taExample2: "உடனடி வேலைக்குச் செல்வதா அல்லது உயர்கல்வி பயில்வதா என முடிவெடுக்கும் போது மாற்று வாய்ப்பின் இழப்பை மாணவர்கள் சிந்திக்க வேண்டும்.",
    synonyms: ["Alternative forfeiture", "Foregone benefit", "Trade-off cost"],
    antonyms: ["Direct cash cost", "Absolute return"]
  },
  {
    word: "Oxymoron",
    pos: "noun",
    definition: "A figure of speech in which apparently contradictory terms appear in conjunction (e.g., 'deafening silence' or 'virtual reality').",
    taWord: "முரண் அணி / ஒன்றோடொன்று முரண்படும் சொற்கோவை",
    enExample: "The BBC commentator quipped that the phrase 'honest politician' often sounds like a classic oxymoron.",
    taExample: "'நேர்மையான அரசியல்வாதி' என்ற சொற்றொடர் பெரும்பாலும் ஒரு உன்னதமான முரண் அணியாகத் தோன்றுகிறது என்று பிபிசி வர்ணனையாளர் நகைச்சுவையாகக் கூறினார்.",
    enExample2: "In modern technology discourse, terms like 'open secret' and 'controlled chaos' are frequently employed oxymorons.",
    taExample2: "நவீன தொழில்நுட்ப விவாதங்களில் 'கட்டுப்படுத்தப்பட்ட குழப்பம்' போன்ற சொற்றொடர்கள் அடிக்கடி பயன்படுத்தப்படும் முரண் அணிகளாகும்.",
    synonyms: ["Contradiction in terms", "Paradoxical phrase", "Antinomy"],
    antonyms: ["Tautology", "Redundancy", "Literal harmony"]
  },

  // P
  {
    word: "Paradigm shift",
    pos: "noun",
    definition: "A fundamental change in the basic concepts, experimental practices, and underlying worldview of a scientific discipline or industry.",
    taWord: "அடிப்படை சிந்தனைப் புரட்சி / கோட்பாட்டு மாற்றம்",
    enExample: "The migration from on-premise computing to serverless cloud infrastructure represented a massive paradigm shift for enterprise IT.",
    taExample: "பழைய சர்வர்களிலிருந்து சர்வர்லெஸ் கிளவுட் கட்டமைப்புக்கு மாறியது நிறுவன தகவல் தொழில்நுட்பத் துறையில் ஒரு பெரிய கோட்பாட்டு மாற்றத்தைக் குறித்தது.",
    enExample2: "Historian Thomas Kuhn coined the term to explain how scientific revolutions overturn established academic dogmas.",
    taExample2: "அறிவியல் புரட்சிகள் எவ்வாறு நிறுவப்பட்ட கல்விசார் கொள்கைகளை மாற்றியமைக்கின்றன என்பதை விளக்க தாமஸ் குன் இந்த சொல்லை உருவாக்கினார்.",
    synonyms: ["Fundamental transformation", "Revolutionary change", "Sea change", "Breakthrough"],
    antonyms: ["Incremental adjustment", "Status quo", "Stagnation"]
  },
  {
    word: "Parsimony",
    pos: "noun",
    definition: "Extreme unwillingness to spend money or use resources; in philosophy and science, the adoption of the simplest explanation that accounts for all facts.",
    taWord: "சிக்கனம் / எளிய விளக்கத்தை ஏற்கும் தத்துவக் கோட்பாடு",
    enExample: "Applying the scientific principle of parsimony, the researchers favored the simplest genetic model that explained the clinical data.",
    taExample: "அறிவியல் சிக்கனக் கோட்பாட்டைப் பயன்படுத்தி, ஆராய்ச்சியாளர்கள் மருத்துவத் தரவுகளை விளக்கும் மிக எளிய மாதிரியை ஏற்றுக்கொண்டனர்.",
    enExample2: "The startup founder managed the early capital with strict parsimony, avoiding lavish office space until profitability was reached.",
    taExample2: "லாபம் ஈட்டும் வரை ஆடம்பர அலுவலகங்களைத் தவிர்த்து ஆரம்ப மூலதனத்தை அந்த நிறுவனர் கடுமையான சிக்கனத்துடன் நிர்வகித்தார்.",
    synonyms: ["Frugality", "Simplicity", "Occam's razor", "Economy"],
    antonyms: ["Extravagance", "Profligacy", "Wastefulness", "Complexity"]
  },
  {
    word: "Preposterous",
    pos: "adjective",
    definition: "Contrary to reason or common sense; utterly absurd, ridiculous, or foolish.",
    taWord: "அபத்தமான / பகுத்தறிவுக்கு முற்றிலும் எதிரான",
    enExample: "The CEO dismissed the acquisition rumors as preposterous speculation that had no grounding in the board's strategy.",
    taExample: "இயக்குநரவையின் உத்தியில் எந்த அடிப்படையும் இல்லாத அபத்தமான ஊகம் என கையகப்படுத்தல் வதந்திகளை தலைமை நிர்வாகி நிராகரித்தார்.",
    enExample2: "In the comedy sketch, the TV actor adopted a preposterous persona that had the studio audience roaring with laughter.",
    taExample2: "அந்த நகைச்சுவை நாடகத்தில் தொலைக்காட்சி நடிகர் ஏற்று நடித்த அபத்தமான கதாபாத்திரம் பார்வையாளர்களை வயிறு குலுங்க சிரிக்க வைத்தது.",
    synonyms: ["Absurd", "Ludicrous", "Nonsensical", "Outrageous"],
    antonyms: ["Sensible", "Rational", "Credible", "Logical"]
  },
  {
    word: "Provenance",
    pos: "noun",
    definition: "The place of origin or earliest known history of something; the chronological record of ownership and custody for a work of art, data, or software dependency.",
    taWord: "தோற்றுவாய் / மூல வரலாறு / நம்பகமான பிறப்பிடப் பதிவு",
    enExample: "Security engineers verify the provenance of open-source packages using digital cryptographic signatures before building artifacts.",
    taExample: "மென்பொருளை உருவாக்கும் முன் டிஜிட்டல் குறியாக்கக் கையொப்பங்களைப் பயன்படுத்தி திறந்த மூல நிரல்களின் தோற்றுவாயை பொறியாளர்கள் சரிபார்க்கின்றனர்.",
    enExample2: "The art gallery confirmed the authentic Renaissance provenance of the newly discovered oil painting.",
    taExample2: "புதிதாகக் கண்டுபிடிக்கப்பட்ட எண்ணெய் ஓவியத்தின் உண்மையான மறுமலர்ச்சிக் கால வரலாற்றுத் தோற்றுவாயை கலைக்கூடம் உறுதிப்படுத்தியது.",
    synonyms: ["Origin", "Source", "Lineage", "Pedigree", "Chronology of custody"],
    antonyms: ["Unknown origin", "Counterfeit source", "Forgery"]
  },
  {
    word: "Product market fit",
    pos: "noun",
    definition: "The degree to which a product satisfies a strong, genuine market demand, evidenced by rapid user growth and high customer retention.",
    taWord: "தயாரிப்பு-சந்தை பொருத்தம் / சந்தை தேவையை துல்லியமாக பூர்த்தி செய்தல்",
    enExample: "After pivoting three times, the SaaS startup finally achieved product market fit and saw monthly signups quadruple.",
    taExample: "மூன்று முறை உத்திகளை மாற்றிய பிறகு அந்த மென்பொருள் நிறுவனம் தயாரிப்பு-சந்தை பொருத்தத்தை அடைந்து மாதாந்திர பதிவுகளை நான்கு மடங்காக உயர்த்தியது.",
    enExample2: "Venture capitalists advise founders not to scale advertising budgets aggressively until product market fit is proven.",
    taExample2: "தயாரிப்பு சந்தைக்கு ஏற்றது என்பது நிரூபிக்கப்படும் வரை விளம்பரச் செலவுகளை அதிரடியாக உயர்த்த வேண்டாம் என்று முதலீட்டாளர்கள் அறிவுறுத்துகின்றனர்.",
    synonyms: ["Market resonance", "Customer demand alignment", "Market validation"],
    antonyms: ["Market mismatch", "Product rejection", "Zero traction"]
  },
  {
    word: "Protagonist",
    pos: "noun",
    definition: "The leading character or one of the major figures in a drama, movie, novel, or real-world political cause.",
    taWord: "கதாநாயகன் / முதன்மைக் கதாபாத்திரம் / இயக்கத்தின் முன்னணித் தலைவர்",
    enExample: "The award-winning television series followed a morally conflicted protagonist striving to rebuild his family's publishing empire.",
    taExample: "விருது பெற்ற அந்த தொலைக்காட்சித் தொடர் குடும்பத்தின் பதிப்பக சாம்ராஜ்யத்தை மீண்டும் உருவாக்கப் போராடும் ஒரு முதன்மைக் கதாபாத்திரத்தைப் பின்தொடர்ந்தது.",
    enExample2: "BBC historical documentaries highlight how obscure reformers often become the central protagonists of democratic revolutions.",
    taExample2: "அறியப்படாத சீர்திருத்தவாதிகள் எவ்வாறு ஜனநாயகப் புரட்சிகளின் முக்கிய கதாநாயகர்களாக மாறுகிறார்கள் என்பதை பிபிசி ஆவணப்படங்கள் எடுத்துக்காட்டுகின்றன.",
    synonyms: ["Main character", "Hero", "Lead", "Champion"],
    antonyms: ["Antagonist", "Adversary", "Nemesis", "Villain"]
  },
  {
    word: "Poetic justice",
    pos: "noun",
    definition: "The fact of experiencing a fitting or deserved retribution for one's actions, especially in an ironically appropriate manner.",
    taWord: "நீதி வெல்லுதல் / வினை விதைத்தவன் வினை அறுக்கும் நிலை",
    enExample: "In a stroke of poetic justice, the notorious computer hacker had his own cryptocurrency wallet drained by a rival cyber group.",
    taExample: "வினை விதைத்தவன் வினை அறுப்பான் என்பதற்கு ஏற்ப பிரபல ஹேக்கரின் சொந்த டிஜிட்டல் பணப்பை எதிர்தரப்பால் சூறையாடப்பட்டது.",
    enExample2: "The screenplay's climax delivered poetic justice when the corrupt corporate villain was undone by the very loophole he created.",
    taExample2: "ஊழல் செய்த வில்லன் தான் உருவாக்கிய சட்ட ஓட்டையாலேயே வீழ்த்தப்பட்டபோது திரைக்கதை சரியான நீதியை வழங்கியது.",
    synonyms: ["Karmic retribution", "Fitting punishment", "Just deserts", "Nemesis"],
    antonyms: ["Injustice", "Unfair impunity", "Miscarriage of justice"]
  },
  {
    word: "Pathos",
    pos: "noun",
    definition: "A quality that evokes pity, compassion, or sadness, especially in drama, literature, or rhetoric.",
    taWord: "பரிதாப உணர்வு / இரக்கத்தைத் தூண்டும் பாணி",
    enExample: "The BBC foreign correspondent's report conveyed the deep human pathos of families displaced by the earthquake.",
    taExample: "நிலநடுக்கத்தால் இடம்பெயர்ந்த குடும்பங்களின் ஆழமான மனிதப் பரிதாப நிலையை பிபிசி நிருபரின் அறிக்கை வெளிப்படுத்தியது.",
    enExample2: "The theater director balanced dark comedic elements with moments of devastating emotional pathos.",
    taExample2: "நாடக இயக்குனர் கருப்பு நகைச்சுவை கூறுகளுடன் மனதை உலுக்கும் பரிதாப உணர்வுத் தருணங்களையும் சமநிலையில் கையாண்டார்.",
    synonyms: ["Poignancy", "Tragedy", "Emotional appeal", "Piteousness"],
    antonyms: ["Apathy", "Indifference", "Callousness", "Cheerfulness"]
  },
  {
    word: "Proof of concept",
    pos: "noun",
    definition: "Evidence, typically derived from an experiment or pilot project, demonstrating that a design concept or business proposal is feasible.",
    taWord: "சாத்தியக்கூறு நிரூபணம் / ஆரம்ப மாதிரி ஆய்வு",
    enExample: "The research and development lab built a working proof of concept demonstrating quantum encryption over fiber-optic cable.",
    taExample: "ஆய்வுக்கூடம் ஆப்டிகல் ஃபைபர் வழியாக குவாண்டம் குறியாக்கத்தை செயல்படுத்தும் சாத்தியக்கூறு மாதிரியை வெற்றிகரமாக நிரூபித்தது.",
    enExample2: "Before greenlighting the multi-million dollar software migration, executives required a tangible proof of concept.",
    taExample2: "கோடிக்கணக்கான ரூபாய் மென்பொருள் மாற்றத்திற்கு ஒப்புதல் அளிப்பதற்கு முன் அதிகாரிகள் உறுதியான சாத்தியக்கூறு ஆதாரத்தைக் கோரினர்.",
    synonyms: ["Feasibility prototype", "Pilot trial", "Demonstration model"],
    antonyms: ["Pure theory", "Untested concept", "Unvalidated claim"]
  },
  {
    word: "Polymorphism",
    pos: "noun",
    definition: "In object-oriented programming, the ability of different classes to respond to the same message or method call in unique, specialized ways.",
    taWord: "பன்முகத்தன்மை / பல வடிவங்களை ஏற்கும் மென்பொருள் திறன்",
    enExample: "By leveraging polymorphism, the rendering engine processes vectors, bitmaps, and 3D meshes through a unified interface.",
    taExample: "பன்முகத்தன்மையை கையாள்வதன் மூலம் வரைபட இயந்திரம் பல வகையான வடிவங்களை ஒரே இடைமுகம் வழியாக சீராக செயலாக்குகிறது.",
    enExample2: "Senior software engineers rely on runtime polymorphism to write clean, extensible plugins without modifying core source code.",
    taExample2: "மூலக் குறியீட்டை மாற்றாமல் புதிய நீட்டிப்புகளை உருவாக்க மூத்த மென்பொருள் பொறியாளர்கள் பன்முகத்தன்மையை நம்பியுள்ளனர்.",
    synonyms: ["Multiformity", "Interface flexibility", "Dynamic dispatch"],
    antonyms: ["Monomorphism", "Rigid typing", "Uniform structure"]
  },

  // Q
  {
    word: "Quantifiable",
    pos: "adjective",
    definition: "Able to be expressed or measured as a quantity, metric, or numerical value.",
    taWord: "அளவிடக்கூடிய / எண்களால் கணக்கிடத்தக்க",
    enExample: "The consulting team presented quantifiable improvements in customer conversion rates following the website redesign.",
    taExample: "இணையதள மறுவடிவமைப்பைத் தொடர்ந்து வாடிக்கையாளர் வருகையில் ஏற்பட்ட அளவிடக்கூடிய முன்னேற்றங்களை ஆலோசனைக் குழு சமர்ப்பித்தது.",
    enExample2: "Scholars emphasize that research conclusions should be grounded in quantifiable empirical data rather than subjective impressions.",
    taExample2: "ஆய்வு முடிவுகள் அகநிலை கருத்துக்களை விட அளவிடக்கூடிய அனுபவத் தரவுகளை அடிப்படையாகக் கொண்டிருக்க வேண்டும் என அறிஞர்கள் வலியுறுத்துகின்றனர்.",
    synonyms: ["Measurable", "Computable", "Determinate", "Calculable"],
    antonyms: ["Qualitative", "Immeasurable", "Intangible", "Incalculable"]
  },
  {
    word: "Quagmire",
    pos: "noun",
    definition: "A soft boggy area of land; an awkward, complex, or hazardous situation from which it is difficult to free oneself.",
    taWord: "சதுப்புநிலம் / மீள முடியாத சிக்கலான நிலை",
    enExample: "BBC diplomatic commentators warned that entering the foreign conflict risked entangling the military in a protracted quagmire.",
    taExample: "வெளிநாட்டு மோதலில் ஈடுபடுவது ராணுவத்தை மீள முடியாத நீண்ட கால சிக்கலில் ஆழ்த்தும் அபாயம் உள்ளதாக பிபிசி வர்ணனையாளர்கள் எச்சரித்தனர்.",
    enExample2: "The software redesign devolved into an architectural quagmire due to shifting business requirements.",
    taExample2: "அடிக்கடி மாறிய வணிகத் தேவைகள் காரணமாக அந்த மென்பொருள் மறுவடிவமைப்பு சிக்கலான முட்டுக்கட்டையில் முடிந்தது.",
    synonyms: ["Morass", "Predicament", "Bog", "Sticky situation"],
    antonyms: ["Simple solution", "Clear path", "Easy escape"]
  },

  // R
  {
    word: "Rate limiting",
    pos: "noun",
    definition: "In computing and API design, a strategy for limiting network traffic by capping how often someone can repeat an action within a specified timeframe.",
    taWord: "கோரிக்கை வேகக் கட்டுப்பாடு / பயன்பாட்டு வரம்பு",
    enExample: "Cloud platforms enforce strict API rate limiting to safeguard servers from brute-force authentication attacks and denial-of-service outages.",
    taExample: "சேவை முடக்கத் தாக்குதல்களிலிருந்து சர்வர்களைப் பாதுகாக்க கிளவுட் தளங்கள் கடுமையான பயன்பாட்டு வேகக் கட்டுப்பாட்டை அமல்படுத்துகின்றன.",
    enExample2: "When the client exceeded the allowed requests per minute, the backend returned a 429 Too Many Requests response code.",
    taExample2: "பயனர் அனுமதிக்கப்பட்ட வரம்பை விட அதிக கோரிக்கைகளை விடுத்தபோது சர்வர் வரம்பு மீறியதற்கான பிழைக் குறியீட்டை அனுப்பியது.",
    synonyms: ["Throttling", "Traffic capping", "Access regulation"],
    antonyms: ["Unlimited throughput", "Unrestricted access"]
  },
  {
    word: "Resonates",
    pos: "verb",
    definition: "Evokes or suggests images, memories, or emotions; produces a deep, positive response or personal connection in people.",
    taWord: "மனதில் ஆழமாகப் பதிதல் / எதிரொலித்தல் / ஒத்திசைதல்",
    enExample: "The CEO's inspiring speech on environmental sustainability resonated deeply with millennial employees and global investors alike.",
    taExample: "சுற்றுச்சூழல் நிலைத்தன்மை குறித்த தலைமை நிர்வாகியின் ஊக்கமளிக்கும் உரை இளம் பணியாளர்கள் மற்றும் முதலீட்டாளர்களின் மனதில் ஆழமாகப் பதிந்தது.",
    enExample2: "The television drama resonates with millions of viewers because its characters grapple with realistic everyday struggles.",
    taExample2: "அன்றாட எதார்த்த வாழ்க்கைப் போராட்டங்களைச் சித்தரிப்பதால் அந்த தொலைக்காட்சி நாடகம் லட்சக்கணக்கான பார்வையாளர்களுடன் உணர்வுபூர்வமாக ஒத்திசைகிறது.",
    synonyms: ["Strikes a chord", "Echoes", "Connects with", "Vibrates with"],
    antonyms: ["Falls flat", "Leaves cold", "Alienates", "Clashes"]
  },
  {
    word: "Robustness",
    pos: "noun",
    definition: "The quality or condition of being strong and in good condition; in computing, the ability of a system to cope with errors during execution.",
    taWord: "வலுவான தன்மை / பிழைகளைத் தாங்கி நிற்கும் உறுதிப்பாடு",
    enExample: "Engineers stress-tested the microservices architecture to verify its robustness under simulated holiday shopping traffic spikes.",
    taExample: "பண்டிகைக் கால அதிக பயனர் வருகையின் போது கணினியின் வலுவான உறுதிப்பாட்டை சரிபார்க்க பொறியாளர்கள் தீவிர சுமை சோதனைகளை மேற்கொண்டனர்.",
    enExample2: "The empirical robustness of the clinical study was verified through independent peer replication across three university labs.",
    taExample2: "அந்த மருத்துவ ஆய்வின் அறிவியல் உறுதிப்பாடு மூன்று பல்கலைக்கழக ஆய்வகங்களின் சுயாதீன சரிபார்ப்பு மூலம் உறுதி செய்யப்பட்டது.",
    synonyms: ["Resilience", "Durability", "Sturdiness", "Fault-tolerance"],
    antonyms: ["Fragility", "Weakness", "Instability", "Vulnerability"]
  },
  {
    word: "Rapprochement",
    pos: "noun",
    definition: "An establishment or resumption of harmonious relations, especially between nations or rival political factions.",
    taWord: "நல்லுறவு மலர்தல் / சமரசம் அடைதல்",
    enExample: "The BBC world service reported a historic diplomatic rapprochement after decades of border hostilities between the two neighboring states.",
    taExample: "இரு அண்டை நாடுகளுக்கு இடையே பல தசாப்த கால எல்லைப் பகையை முடிவுக்குக் கொண்டுவந்த வரலாற்று சிறப்புமிக்க நல்லுறவு மலர்ச்சியை பிபிசி அறிவித்தது.",
    enExample2: "Corporate mediators brokered a fragile rapprochement between the founding partners ahead of the shareholder meeting.",
    taExample2: "பங்குதாரர்கள் கூட்டத்திற்கு முன்னதாக நிறுவன நிறுவனர்களுக்கு இடையே ஒரு சமரசத்தை நடுவர்கள் ஏற்படுத்தினர்.",
    synonyms: ["Reconciliation", "Detente", "Harmonization", "Peacemaking"],
    antonyms: ["Alienation", "Hostility", "Estrangement", "Schism"]
  },
  {
    word: "Referendum",
    pos: "noun",
    definition: "A general vote by the electorate on a single political question which has been referred to them for a direct decision.",
    taWord: "பொது வாக்கெடுப்பு / நேரடி மக்கள் தீர்ப்பு",
    enExample: "The BBC national news provided special continuous coverage of the nationwide constitutional referendum.",
    taExample: "நாடு தழுவிய அரசியலமைப்பு பொது வாக்கெடுப்பு குறித்த சிறப்பு நேரலை செய்திகளை பிபிசி வழங்கியது.",
    enExample2: "Voters turned out in historic numbers to cast their ballots in the binding regional autonomy referendum.",
    taExample2: "பிராந்திய தன்னாட்சி குறித்த பொது வாக்கெடுப்பில் வாக்களிக்க மக்கள் வரலாற்று சாதனை எண்ணிக்கையில் பங்கேற்றனர்.",
    synonyms: ["Plebiscite", "Popular vote", "Ballot measure", "Direct vote"],
    antonyms: ["Executive decree", "Unilateral ruling", "Dictate"]
  },
  {
    word: "Runway",
    pos: "noun",
    definition: "In business and startup financing, the amount of time a company has before it runs out of cash, assuming current income and expenses remain constant.",
    taWord: "நிதி ஆயுட்காலம் / கையிருப்புப் பணத்தின் கால வரம்பு",
    enExample: "Following the successful seed round, the founders calculated that the startup possessed eighteen months of operating runway.",
    taExample: "வெற்றிகரமான நிதித் திரட்டலைத் தொடர்ந்து நிறுவனத்திற்கு பதினெட்டு மாத கால நிதி ஆயுள் உள்ளதாக நிறுவனர்கள் கணக்கிட்டனர்.",
    enExample2: "Executives enacted immediate hiring freezes to preserve the company's financial runway amidst an industry downturn.",
    taExample2: "தொழில்துறை மந்தநிலைக்கு மத்தியில் நிறுவனத்தின் நிதி கையிருப்பை நீட்டிக்க நிர்வாகிகள் உடனடி பணி நியமன முடக்கத்தை அமல்படுத்தினர்.",
    synonyms: ["Financial buffer", "Cash horizon", "Operating longevity"],
    antonyms: ["Zero balance", "Imminent bankruptcy", "Cash depletion"]
  },

  // S
  {
    word: "Semantic",
    pos: "adjective",
    definition: "Relating to meaning in language or logic; in programming and web design, code elements that explicitly describe their human-readable purpose.",
    taWord: "பொருள் உணர்த்தும் / அர்த்தம் சார்ந்த",
    enExample: "Web developers use semantic HTML tags like <nav> and <article> to improve accessibility and search engine indexing.",
    taExample: "இணைய உருவாக்குநர்கள் தேடுபொறி குறியீட்டுத் திறனையும் அணுகலையும் மேம்படுத்த பொருள் உணர்த்தும் HTML குறிச்சொற்களைப் பயன்படுத்துகின்றனர்.",
    enExample2: "Modern natural language processing models perform semantic analysis to understand user intent rather than simple keyword matches.",
    taExample2: "நவீன மொழி செயலாக்க மாதிரிகள் எளிய சொல் பொருத்தத்திற்கு பதிலாக பயனரின் உண்மையான நோக்கத்தைப் புரிந்துகொள்ள பொருள்சார் பகுப்பாய்வை மேற்கொள்கின்றன.",
    synonyms: ["Meaning-based", "Signifying", "Denotative", "Logical"],
    antonyms: ["Syntactic", "Superficial", "Meaningless"]
  },
  {
    word: "Serendipity",
    pos: "noun",
    definition: "The occurrence and development of events by chance in a happy, fortunate, or beneficial way.",
    taWord: "எதிர்பாராத நல்வாய்ப்பு / தற்செயலான அதிர்ஷ்டக் கண்டுபிடிப்பு",
    enExample: "The scientist admitted that the discovery of the groundbreaking antibiotic was a wonderful stroke of serendipity.",
    taExample: "அந்த புரட்சிகரமான மருந்து கண்டுபிடிக்கப்பட்டது ஒரு அற்புதமான எதிர்பாராத நல்வாய்ப்பு என்று விஞ்ஞானி ஒப்புக்கொண்டார்.",
    enExample2: "Tech founders often credit coffee shop conversations and serendipity for sparking their most profitable product ideas.",
    taExample2: "தங்கள் மிக லாபகரமான தயாரிப்பு யோசனைகளைத் தூண்டியதற்கு தேநீர் கடை உரையாடல்களும் தற்செயலான நல்வாய்ப்புகளுமே காரணம் என நிறுவனர்கள் கூறுகின்றனர்.",
    synonyms: ["Fortuitousness", "Happy coincidence", "Good fortune", "Luck"],
    antonyms: ["Misfortune", "Bad luck", "Planned outcome", "Design"]
  },
  {
    word: "Stagnation",
    pos: "noun",
    definition: "A state of lack of activity, growth, circulation, or development; prolonged sluggishness in an economy or career.",
    taWord: "தேக்கநிலை / வளர்ச்சியின்மை",
    enExample: "Central bank economists warned that prolonged wage stagnation was dampening consumer spending across the nation.",
    taExample: "நீண்டகால ஊதியத் தேக்கநிலை நாடு முழுவதும் நுகர்வோர் செலவினங்களை குறைத்து வருவதாக பொருளாதார வல்லுநர்கள் எச்சரித்தனர்.",
    enExample2: "To escape technical stagnation, the software firm encouraged engineers to spend ten percent of their time on open-source exploration.",
    taExample2: "தொழில்நுட்ப தேக்கநிலையிலிருந்து விடுபட மென்பொருள் நிறுவனம் பொறியாளர்களை புதிய ஆய்வு பணிகளில் ஈடுபட ஊக்குவித்தது.",
    synonyms: ["Inactivity", "Sluggishness", "Doldrums", "Torpor"],
    antonyms: ["Growth", "Boom", "Expansion", "Dynamism"]
  },
  {
    word: "Strategic",
    pos: "adjective",
    definition: "Relating to the identification of long-term or overall aims and interests and the means of achieving them effectively.",
    taWord: "வியூக ரீதியான / நீண்ட கால நோக்குடைய",
    enExample: "The board voted in favor of a strategic merger to expand the corporation's footprint in emerging Asian markets.",
    taExample: "வளர்ந்து வரும் ஆசிய சந்தைகளில் நிறுவனத்தின் தடத்தை விரிவுபடுத்த ஒரு வியூக ரீதியான இணைப்பிற்கு இயக்குநரவை ஆதரவாக வாக்களித்தது.",
    enExample2: "In academic chess, grandmasters make subtle pawn sacrifices for long-term strategic advantage.",
    taExample2: "சதுரங்க விளையாட்டில் கிராண்ட்மாஸ்டர்கள் நீண்ட கால வியூக ரீதியான நன்மைக்காக ஆரம்ப காய்களை தியாகம் செய்கிறார்கள்.",
    synonyms: ["Tactical", "Calculated", "Planned", "Far-sighted"],
    antonyms: ["Haphazard", "Short-sighted", "Random", "Impulsive"]
  },
  {
    word: "Substantive",
    pos: "adjective",
    definition: "Having a firm basis in reality and so being important, meaningful, or considerable; dealing with real substance rather than form.",
    taWord: "உண்மையான முக்கியத்துவம் வாய்ந்த / அடிப்படையான",
    enExample: "BBC interviewers pressed the prime minister to offer substantive policy solutions rather than catchy political slogans.",
    taExample: "அரசியல் முழக்கங்களுக்குப் பதிலாக உண்மையான முக்கியத்துவம் வாய்ந்த கொள்கைத் தீர்வுகளை வழங்குமாறு பிரதமருக்கு பிபிசி நேர்காணலாளர்கள் அழுத்தம் கொடுத்தனர்.",
    enExample2: "The audit revealed substantive compliance issues that required immediate operational overhaul.",
    taExample2: "அந்த தணிக்கை உடனடியாக மறுசீரமைக்கப்பட வேண்டிய அடிப்படை இணக்கப் பிரச்சினைகளை வெளிப்படுத்தியது.",
    synonyms: ["Meaningful", "Significant", "Tangible", "Essential"],
    antonyms: ["Superficial", "Inconsequential", "Trivial", "Insubstantial"]
  },
  {
    word: "Symbiosis",
    pos: "noun",
    definition: "A mutually beneficial interaction or relationship between different organisms, individuals, or commercial organizations.",
    taWord: "கூட்டுயிர் வாழ்க்கை / பரஸ்பர நன்மை தரும் கூட்டுறவு",
    enExample: "The commercial partnership created a profitable symbiosis where the hardware maker gained exclusive cloud software tools.",
    taExample: "அந்த வணிகக் கூட்டுறவு இரு நிறுவனங்களுக்கும் பரஸ்பர நன்மை தரும் லாபகரமான கூட்டுறவை உருவாக்கியது.",
    enExample2: "Scholars emphasize the delicate ecological symbiosis between coral reefs and marine algae.",
    taExample2: "பவளப்பாறைகளுக்கும் கடல் பாசிகளுக்கும் இடையே உள்ள மென்மையான பரஸ்பர வாழ்க்கை முறையை அறிஞர்கள் வலியுறுத்துகின்றனர்.",
    synonyms: ["Mutualism", "Interdependence", "Reciprocity", "Cooperation"],
    antonyms: ["Parasitism", "Hostility", "Antagonism", "Conflict"]
  },
  {
    word: "Sedition",
    pos: "noun",
    definition: "Conduct or speech inciting people to rebel against the authority of a state or monarch.",
    taWord: "அரசுத்துரோகம் / புரட்சித் தூண்டுதல்",
    enExample: "The attorney general filed formal sedition charges against the leaders of the plot to overthrow the elected parliament.",
    taExample: "தேர்ந்தெடுக்கப்பட்ட நாடாளுமன்றத்தைக் கவிழ்க்க சதி செய்த தலைவர்கள் மீது அட்டர்னி ஜெனரல் முறையான அரசுத்துரோகக் குற்றச்சாட்டுகளைத் தாக்கல் செய்தார்.",
    enExample2: "BBC legal analysts explained the historic boundaries separating constitutionally protected free speech from unlawful sedition.",
    taExample2: "அரசியலமைப்பு பாதுகாப்பு பெற்ற பேச்சுரிமைக்கும் சட்டவிரோத அரசுத்துரோகத்திற்கும் உள்ள எல்லைகளை பிபிசி சட்ட ஆய்வாளர்கள் விளக்கினர்.",
    synonyms: ["Insurrection", "Treason", "Subversion", "Mutiny"],
    antonyms: ["Loyalty", "Allegiance", "Patriotism", "Obedience"]
  },
  {
    word: "Soliloquy",
    pos: "noun",
    definition: "An act of speaking one's thoughts aloud when by oneself or regardless of any hearers, especially by a character in a play.",
    taWord: "தனிமொழி / நாடகக் கதாபாத்திரத்தின் உள்ளுரை",
    enExample: "Hamlet's famous 'To be or not to be' soliloquy delves into profound philosophical questions of existence and mortality.",
    taExample: "ஹேம்லெட்டின் புகழ்பெற்ற தனிமொழி மனித இருப்பு மற்றும் இறப்பு குறித்த ஆழ்ந்த தத்துவக் கேள்விகளை ஆராய்கிறது.",
    enExample2: "The television scriptwriter used a poignant character soliloquy to conclude the dramatic season finale.",
    taExample2: "நாடகத் தொடரின் இறுதிக் காட்சியை முடிக்க தொலைக்காட்சி கதாசிரியர் உணர்ச்சிகரமான ஒரு கதாபாத்திர தனிமொழியைப் பயன்படுத்தினார்.",
    synonyms: ["Monologue", "Interior discourse", "Self-talk"],
    antonyms: ["Dialogue", "Colloquy", "Bilateral conversation"]
  },
  {
    word: "Satire",
    pos: "noun",
    definition: "The use of humor, irony, exaggeration, or ridicule to expose and criticize people's stupidity, corruption, or vices, particularly in politics.",
    taWord: "நையாண்டி / சமூகக் கேலிச்சித்திரம்",
    enExample: "The British comedy series used biting political satire to mock the absurdities of bureaucratic governance.",
    taExample: "அதிகாரத்துவ நிர்வாகத்தின் அபத்தங்களை கேலி செய்ய அந்த பிரிட்டிஷ் நகைச்சுவைத் தொடர் கூர்மையான அரசியல் நையாண்டியைப் பயன்படுத்தியது.",
    enExample2: "Scholars analyzed Jonathan Swift's essays as foundational masterworks of literary satire.",
    taExample2: "ஜொனாதன் ஸ்விஃப்ட்டின் கட்டுரைகளை இலக்கிய நையாண்டியின் தலைசிறந்த படைப்புகளாக அறிஞர்கள் ஆய்வு செய்தனர்.",
    synonyms: ["Parody", "Mockery", "Irony", "Caricature"],
    antonyms: ["Solemnity", "Praise", "Tribute", "Literal tribute"]
  },
  {
    word: "Subtext",
    pos: "noun",
    definition: "An underlying and often distinct theme, message, or unspoken emotional tension in a piece of writing or conversation.",
    taWord: "உள்வரி / சொல்லப்படாத மறைமுக உட்கருத்து",
    enExample: "The television director praised the actors for conveying the bitter romantic subtext beneath their polite dinner conversation.",
    taExample: "மரியாதையான இரவு உணவு உரையாடலுக்கு அடியில் இருந்த கசப்பான உணர்வுகளை வெளிப்படுத்திய நடிகர்களை தொலைக்காட்சி இயக்குனர் பாராட்டினார்.",
    enExample2: "Diplomatic correspondents parsed the press conference transcript to uncover the subtle geopolitical subtext.",
    taExample2: "செய்தியாளர் சந்திப்பில் பேசப்பட்ட நுட்பமான புவிசார் அரசியல் உள்வரிகளை கண்டறிய நிருபர்கள் அறிக்கையை ஆராய்ந்தனர்.",
    synonyms: ["Undercurrent", "Hidden meaning", "Nuance", "Connotation"],
    antonyms: ["Explicit statement", "Literal text", "Overt message"]
  },

  // T
  {
    word: "Transient",
    pos: "adjective",
    definition: "Lasting only for a short time; impermanent, fleeting, or passing quickly through a place.",
    taWord: "நிலையற்ற / தற்காலிகமான / விரைந்து மறையும்",
    enExample: "Network engineers determined that the packet drop was caused by a transient hardware glitch rather than a permanent fiber break.",
    taExample: "நெட்வொர்க் தரவு இழப்பிற்கு ஒரு தற்காலிக வன்பொருள் கோளாறே காரணம் என்பதை பொறியாளர்கள் கண்டறிந்தனர்.",
    enExample2: "The central bank chairman cautioned that while inflation appeared high, underlying price spikes might prove transient.",
    taExample2: "விலைவாசி உயர்வு அதிகமாகத் தோன்றினாலும், இந்த பணவீக்கக் காரணிகள் தற்காலிகமானவையாகவே இருக்கும் என்று மத்திய வங்கித் தலைவர் எச்சரித்தார்.",
    synonyms: ["Ephemeral", "Fleeting", "Temporary", "Momentary"],
    antonyms: ["Permanent", "Enduring", "Perpetual", "Lasting"]
  },
  {
    word: "Total addressable market",
    pos: "noun",
    definition: "The total available market demand for a product or service, calculated as the maximum potential revenue a business could generate.",
    taWord: "மொத்த சாத்தியமான சந்தை மதிப்பு",
    enExample: "In their investor pitch deck, the founders projected a twenty-billion-dollar total addressable market for autonomous delivery drones.",
    taExample: "முதலீட்டாளர் விளக்கக்காட்சியில், ட்ரோன் விநியோகச் சேவைக்கான மொத்த சாத்தியமான சந்தை மதிப்பை இருபது பில்லியன் டாலராக நிறுவனர் கணித்தனர்.",
    enExample2: "Executives calculated that expanding into healthcare would expand the company's total addressable market by fifty percent.",
    taExample2: "சுகாதாரத் துறையில் நுழைவது நிறுவனத்தின் மொத்த சாத்தியமான சந்தை மதிப்பை ஐம்பது சதவீதம் உயர்த்தும் என அதிகாரிகள் கணக்கிட்டனர்.",
    synonyms: ["TAM", "Market size potential", "Overall revenue horizon"],
    antonyms: ["Niche segment", "Current market share"]
  },
  {
    word: "Trope",
    pos: "noun",
    definition: "A significant or recurrent theme, figurative device, or storytelling cliché in literature, film, or popular culture.",
    taWord: "வழக்கமான கதைக் கூறு / மரபுத் தொடர்",
    enExample: "The film critic commended the sci-fi thriller for subverting the tired Hollywood trope of an omnipotent alien invasion.",
    taExample: "வழக்கமான ஏலியன் படையெடுப்பு என்ற பழைய கதைக் கூறை மாற்றி அமைத்ததற்காக அறிவியல் புனைகதை திரில்லரை திரைப்பட விமர்சகர் பாராட்டினார்.",
    enExample2: "Writers in the writers' room actively brainstormed ways to avoid predictable tropes in the upcoming drama season.",
    taExample2: "நாடகத் தொடரில் யூகிக்கக்கூடிய வழக்கமான மரபுகளைத் தவிர்ப்பதற்கான வழிகளை கதாசிரியர்கள் தீவிரமாக விவாதித்தனர்.",
    synonyms: ["Motif", "Cliche", "Convention", "Archetype"],
    antonyms: ["Original invention", "Unprecedented novelty"]
  },
  {
    word: "Tautology",
    pos: "noun",
    definition: "The saying of the same thing twice in different words, generally considered to be a fault of style or logical circularity.",
    taWord: "கூறியது கூறல் / தேவையற்ற சொல் அடுக்கு",
    enExample: "The editor trimmed phrases like 'free gift' and 'unconfirmed rumor' to eliminate careless tautology from the article.",
    taExample: "கட்டுரையிலிருந்து தேவையற்ற கூறியது கூறல் பிழைகளை நீக்க ஆசிரியர் கூடுதல் சொற்களைத் திருத்தினார்.",
    enExample2: "In philosophical logic, tautologies like 'either it will rain or it will not' are universally true but provide no empirical information.",
    taExample2: "தத்துவ தர்க்கத்தில் 'மழை பெய்யும் அல்லது பெய்யாது' போன்ற கூற்றுகள் எப்போதும் உண்மையாக இருந்தாலும் எந்த புதிய தகவலையும் தருவதில்லை.",
    synonyms: ["Redundancy", "Repetition", "Pleonasms", "Circularity"],
    antonyms: ["Brevity", "Conciseness", "Succinctness"]
  },

  // U
  {
    word: "Unit economics",
    pos: "noun",
    definition: "Direct revenues and costs associated with a specific business model expressed on a per-unit basis (e.g., cost to acquire one customer versus customer lifetime value).",
    taWord: "தனி அலகுப் பொருளாதாரம் / ஒரு வாடிக்கையாளருக்கான லாப நட்ட கணக்கீடு",
    enExample: "The venture fund required the food delivery platform to prove positive unit economics before releasing Series C funding.",
    taExample: "அடுத்த கட்ட நிதியை விடுவிப்பதற்கு முன் ஒரு வாடிக்கையாளருக்கான லாபத்தை நிரூபிக்குமாறு முதலீட்டு நிதி நிறுவனம் கோரியது.",
    enExample2: "By streamlining warehouse automation, the retailer achieved healthy unit economics on low-cost grocery shipments.",
    taExample2: "கிடங்கு தானியங்கி முறையை மேம்படுத்தியதன் மூலம் குறைந்த விலை பொருட்களின் விநியோகத்திலும் சில்லறை நிறுவனம் சிறந்த லாபத்தைப் பெற்றது.",
    synonyms: ["Per-unit profitability", "Marginal economics", "Unit contribution margin"],
    antonyms: ["Gross macro revenue", "Aggregate expenditure"]
  },

  // V
  {
    word: "Viability",
    pos: "noun",
    definition: "Ability to work successfully; commercial, operational, or biological feasibility and endurance.",
    taWord: "சாத்தியக்கூறு / நீடித்து நிலைத்து நிற்கும் திறன்",
    enExample: "Independent auditors verified the long-term economic viability of the proposed high-speed passenger rail network.",
    taExample: "முன்மொழியப்பட்ட அதிவேக ரயில் திட்டத்தின் நீண்ட கால பொருளாதார சாத்தியக்கூறை தணிக்கையாளர்கள் உறுதிப்படுத்தினர்.",
    enExample2: "The startup demonstrated product viability by securing ten thousand paying corporate subscribers in its first quarter.",
    taExample2: "முதல் காலாண்டிலேயே பத்தாயிரம் கட்டணம் செலுத்தும் நிறுவன வாடிக்கையாளர்களைப் பெற்றதன் மூலம் ஸ்டார்ட்-அப் தனது தயாரிப்பு சாத்தியத்தை நிரூபித்தது.",
    synonyms: ["Feasibility", "Workability", "Sustainability", "Practicability"],
    antonyms: ["Futile", "Infeasibility", "Impracticability", "Unviability"]
  },
  {
    word: "Vicarious",
    pos: "adjective",
    definition: "Experienced in the imagination through the feelings or actions of another person.",
    taWord: "பிறர் அனுபவத்தை உணர்தல் / மாற்று வழி அனுபவம்",
    enExample: "Travel documentaries offer viewers a thrilling vicarious experience of scaling treacherous Himalayan summits from home.",
    taExample: "பயண ஆவணப்படங்கள் பார்வையாளர்கள் வீட்டிலிருந்தபடியே இமயமலை உச்சியை ஏறும் மெய்சிலிர்க்கும் மாற்று அனுபவத்தை வழங்குகின்றன.",
    enExample2: "Parents often take vicarious pride in the artistic and sporting achievements of their children.",
    taExample2: "பெற்றோர்கள் தங்கள் குழந்தைகளின் கலை மற்றும் விளையாட்டு சாதனைகளில் ஒருவித உள்ளுணர்வு பெருமிதத்தை அடைகிறார்கள்.",
    synonyms: ["Indirect", "Secondhand", "Empathetic", "Substituted"],
    antonyms: ["Direct", "Firsthand", "Personal", "Primary"]
  },
  {
    word: "Verisimilitude",
    pos: "noun",
    definition: "The appearance of being true or real; the realism or authenticity depicted in a work of art, fiction, or period drama.",
    taWord: "உண்மைத்தன்மை / எதார்த்தமான தோற்றம்",
    enExample: "The historical drama gained widespread critical acclaim for the meticulous verisimilitude of its 18th-century costumes and dialogue.",
    taExample: "18 ஆம் நூற்றாண்டின் ஆடைகள் மற்றும் உரையாடல்களின் அசாத்திய உண்மைத்தன்மைக்காக அந்த வரலாற்று நாடகம் விமர்சகர்களின் பாராட்டைப் பெற்றது.",
    enExample2: "Video game graphic engines strive for photorealistic verisimilitude in lighting, physics, and fluid dynamics.",
    taExample2: "வீடியோ கேம் கிராபிக்ஸ் இயந்திரங்கள் ஒளி மற்றும் இயற்பியலில் நிஜ உலகிற்கு நிகரான உண்மைத்தன்மையை அடைய பாடுபடுகின்றன.",
    synonyms: ["Realism", "Authenticity", "Plausibility", "Lifelikeness"],
    antonyms: ["Artificiality", "Implausibility", "Fictitiousness", "Unreality"]
  },
  {
    word: "Vignette",
    pos: "noun",
    definition: "A brief evocative description, account, or episode in a book or film.",
    taWord: "சுருக்கமான சிறுகாட்சி / சிறிய வர்ணனைப் பகுதி",
    enExample: "The documentary opened with a poignant vignette illustrating the daily struggles of an artisan baker in Paris.",
    taExample: "பாரிஸில் உள்ள ஒரு ரொட்டி தயாரிப்பாளரின் அன்றாடப் போராட்டங்களை சித்தரிக்கும் ஒரு சுருக்கமான காட்சியுடன் ஆவணப்படம் தொடங்கியது.",
    enExample2: "The essay collection is comprised of humorous vignettes capturing life inside a fast-growing Silicon Valley startup.",
    taExample2: "சிலிக்கான் வேலி ஸ்டார்ட்-அப் நிறுவன வாழ்க்கையைப் படம்பிடித்துக் காட்டும் நகைச்சுவையான சிறுகாட்சிகளின் தொகுப்பாக அந்த புத்தகம் உள்ளது.",
    synonyms: ["Sketch", "Snapshot", "Episode", "Portrayal"],
    antonyms: ["Comprehensive saga", "Full epic", "Exhaustive biography"]
  },

  // W
  {
    word: "Whistleblower",
    pos: "noun",
    definition: "A person who informs on a person or organization engaged in an illicit, corrupt, or illegal activity.",
    taWord: "ரகசிய முறைகேட்டை அம்பலப்படுத்துபவர் / விழிப்புணர்வுத் தகவல் அளிப்பவர்",
    enExample: "The corporate whistleblower provided encrypted documents to BBC journalists revealing years of illegal offshore dumping.",
    taExample: "ஆண்டுக் கணக்கில் நடந்த சட்டவிரோத கழிவு கொட்டுதலை அம்பலப்படுத்தும் ஆவணங்களை அந்த நபர் பிபிசி செய்தியாளர்களுக்கு வழங்கினார்.",
    enExample2: "Federal statutes provide robust legal protections to prevent corporate retaliation against internal whistleblowers.",
    taExample2: "நிறுவன முறைகேடுகளை அம்பலப்படுத்துபவர்களுக்கு எதிரான பழிவாங்கலைத் தடுக்க சட்டப்பூர்வ பாதுகாப்புகள் வழங்கப்படுகின்றன.",
    synonyms: ["Informant", "Exposer", "Tipster", "Truth-teller"],
    antonyms: ["Conspirator", "Cover-up accomplice", "Insider collaborator"]
  },

  // Z
  {
    word: "Zeitgeist",
    pos: "noun",
    definition: "The defining spirit, mood, or cultural ethos of a particular period of history as shown by the ideas, art, and beliefs of the time.",
    taWord: "காலத்தின் மனநிலை / ஒரு காலகட்டத்தின் பண்பாட்டுச் சூழல்",
    enExample: "The award-winning television series perfectly captured the paranoid zeitgeist of the post-Cold War era.",
    taExample: "பனிப்போருக்குப் பிந்தைய காலகட்டத்தின் கலாச்சார மனநிலையை அந்த விருது பெற்ற தொலைக்காட்சித் தொடர் கச்சிதமாகப் படம்பிடித்தது.",
    enExample2: "Generative artificial intelligence has unquestionably become the defining technological zeitgeist of the 2020s.",
    taExample2: "உருவாக்க செயற்கை நுண்ணறிவு சந்தேகத்திற்கு இடமின்றி 2020-களின் தொழில்நுட்பக் காலச்சூழலை வரையறுக்கும் அடையாளமாக மாறியுள்ளது.",
    synonyms: ["Spirit of the age", "Cultural climate", "Ethos", "Mood of the era"],
    antonyms: ["Anachronism", "Timelessness"]
  }
];

console.log(`Prepared ${newWords.length} new words for insertion.`);

// Filter out any word that is already in existing database
const wordsToInsert = newWords.filter(item => {
  const isExisting = existingWordsSet.has(item.word.toLowerCase().trim());
  if (isExisting) {
    console.log(`Skipping duplicate: ${item.word}`);
    return false;
  }
  return true;
});

console.log(`Total unique words to insert: ${wordsToInsert.length}`);

// Group by starting letter
const grouped = {};
wordsToInsert.forEach(item => {
  const firstLetter = item.word.charAt(0).toLowerCase();
  if (!grouped[firstLetter]) grouped[firstLetter] = [];
  
  maxId += 1;
  grouped[firstLetter].push({
    id: maxId,
    ...item
  });
});

let totalAdded = 0;
// Update each json file
Object.keys(grouped).forEach(letter => {
  const fileName = `${letter}.json`;
  const filePath = path.join(dataDir, fileName);
  let list = [];
  if (fs.existsSync(filePath)) {
    list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  
  const toAdd = grouped[letter];
  list.push(...toAdd);
  
  // Sort alphabetically by word
  list.sort((a, b) => a.word.localeCompare(b.word));
  
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2) + '\n', 'utf-8');
  totalAdded += toAdd.length;
  console.log(`Updated ${fileName} with ${toAdd.length} words (Total in file now: ${list.length})`);
});

console.log(`SUCCESS: Added ${totalAdded} words to dataset.`);
