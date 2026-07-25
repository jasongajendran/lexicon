const fs = require('fs');
const path = require('path');

const advancedWords = {
  A: [
    {
      word: "Alacrity",
      definition: "Brisk and cheerful readiness.",
      enExample: "She accepted the invitation with alacrity.",
      taExample: "அவள் அழைப்பை மிகுந்த சுறுசுறுப்புடன் ஏற்றுக்கொண்டாள்.",
      taWord: "சுறுசுறுப்பு",
      pos: "noun",
      synonyms: ["Eagerness", "Willingness", "Readiness"],
      antonyms: ["Apathy", "Reluctance"]
    },
    {
      word: "Ameliorate",
      definition: "Make (something bad or unsatisfactory) better.",
      enExample: "The reform did much to ameliorate living standards.",
      taExample: "சீர்திருத்தம் வாழ்க்கைத் தரத்தை மேம்படுத்த பெரிதும் உதவியது.",
      taWord: "மேம்படுத்து",
      pos: "verb",
      synonyms: ["Improve", "Enhance", "Benefit"],
      antonyms: ["Worsen", "Exacerbate"]
    },
    {
      word: "Audacious",
      definition: "Showing a willingness to take surprisingly bold risks.",
      enExample: "He made an audacious decision to quit his job.",
      taExample: "அவர் தனது வேலையை விட்டுவிலக ஒரு துணிச்சலான முடிவை எடுத்தார்.",
      taWord: "துணிச்சலான",
      pos: "adj.",
      synonyms: ["Bold", "Daring", "Fearless"],
      antonyms: ["Timid", "Cowardly"]
    }
  ],
  B: [
    {
      word: "Bellicose",
      definition: "Demonstrating aggression and willingness to fight.",
      enExample: "The general made some bellicose statements about his country's enemies.",
      taExample: "ஜெனரல் தனது நாட்டின் எதிரிகளைப் பற்றி சில சண்டையிடும் அறிக்கைகளை வெளியிட்டார்.",
      taWord: "சண்டையிட விரும்புகிற",
      pos: "adj.",
      synonyms: ["Aggressive", "Hostile", "Warlike"],
      antonyms: ["Peaceable", "Pacifist"]
    },
    {
      word: "Benevolent",
      definition: "Well meaning and kindly.",
      enExample: "He was a benevolent leader who cared for his people.",
      taExample: "அவர் தனது மக்களைப் பேணிக்காத்த ஒரு கருணையுள்ள தலைவர்.",
      taWord: "கருணையுள்ள",
      pos: "adj.",
      synonyms: ["Kind", "Compassionate", "Generous"],
      antonyms: ["Malevolent", "Cruel"]
    },
    {
      word: "Bolster",
      definition: "Support or strengthen.",
      enExample: "The fall in interest rates is starting to bolster confidence.",
      taExample: "வட்டி விகிதங்களின் வீழ்ச்சி நம்பிக்கையை பலப்படுத்தத் தொடங்கியுள்ளது.",
      taWord: "பலப்படுத்து",
      pos: "verb",
      synonyms: ["Strengthen", "Support", "Reinforce"],
      antonyms: ["Undermine", "Weaken"]
    }
  ],
  C: [
    {
      word: "Capricious",
      definition: "Given to sudden and unaccountable changes of mood or behavior.",
      enExample: "A capricious and often brutal administration.",
      taExample: "கணிக்க முடியாத மற்றும் அடிக்கடி மிருகத்தனமான நிர்வாகம்.",
      taWord: "கணிக்க முடியாத",
      pos: "adj.",
      synonyms: ["Fickle", "Inconstant", "Variable"],
      antonyms: ["Stable", "Consistent"]
    },
    {
      word: "Castigate",
      definition: "Reprimand (someone) severely.",
      enExample: "He was castigated for not setting a good example.",
      taExample: "ஒரு நல்ல முன்னுதாரணத்தை அமைக்காததற்காக அவர் கடுமையாக கண்டிக்கப்பட்டார்.",
      taWord: "கடுமையாக கண்டி",
      pos: "verb",
      synonyms: ["Reprimand", "Rebuke", "Admonish"],
      antonyms: ["Praise", "Commend"]
    },
    {
      word: "Conundrum",
      definition: "A confusing and difficult problem or question.",
      enExample: "One of the most difficult conundrums for the experts.",
      taExample: "நிபுணர்களுக்கு இது மிகவும் கடினமான புதிர்களில் ஒன்றாகும்.",
      taWord: "புதிர்",
      pos: "noun",
      synonyms: ["Problem", "Difficult question", "Puzzle"],
      antonyms: ["Solution"]
    }
  ],
  D: [
    {
      word: "Dearth",
      definition: "A scarcity or lack of something.",
      enExample: "There is a dearth of evidence.",
      taExample: "ஆதாரங்களின் பற்றாக்குறை உள்ளது.",
      taWord: "பற்றாக்குறை",
      pos: "noun",
      synonyms: ["Lack", "Scarcity", "Shortage"],
      antonyms: ["Abundance", "Surplus"]
    },
    {
      word: "Deleterious",
      definition: "Causing harm or damage.",
      enExample: "Divorce is assumed to have deleterious effects on children.",
      taExample: "விவாகரத்து குழந்தைகள் மீது தீங்கு விளைவிக்கும் தாக்கங்களை ஏற்படுத்தும் என்று கருதப்படுகிறது.",
      taWord: "தீங்கு விளைவிக்கும்",
      pos: "adj.",
      synonyms: ["Harmful", "Damaging", "Detrimental"],
      antonyms: ["Beneficial", "Advantageous"]
    },
    {
      word: "Dichotomy",
      definition: "A division or contrast between two things that are or are represented as being opposed or entirely different.",
      enExample: "A rigid dichotomy between science and mysticism.",
      taExample: "அறிவியலுக்கும் ஆன்மீகத்திற்கும் இடையிலான ஒரு கடுமையான இருபிரிவு.",
      taWord: "இருபிரிவு",
      pos: "noun",
      synonyms: ["Division", "Separation", "Contrast"],
      antonyms: ["Similarity", "Unity"]
    }
  ],
  E: [
    {
      word: "Eclectic",
      definition: "Deriving ideas, style, or taste from a broad and diverse range of sources.",
      enExample: "Her musical tastes are eclectic.",
      taExample: "அவளது இசை ரசனைகள் பலதரப்பட்டவை.",
      taWord: "பலதரப்பட்ட",
      pos: "adj.",
      synonyms: ["Wide-ranging", "Broad-based", "Diverse"],
      antonyms: ["Narrow", "Dogmatic"]
    },
    {
      word: "Eloquent",
      definition: "Fluent or persuasive in speaking or writing.",
      enExample: "An eloquent speech.",
      taExample: "ஒரு சொல்திறன் மிக்க உரை.",
      taWord: "சொல்திறன் மிக்க",
      pos: "adj.",
      synonyms: ["Fluent", "Persuasive", "Articulate"],
      antonyms: ["Inarticulate"]
    },
    {
      word: "Esoteric",
      definition: "Intended for or likely to be understood by only a small number of people with a specialized knowledge or interest.",
      enExample: "Esoteric philosophical debates.",
      taExample: "சிலருக்கு மட்டுமே தெரிந்த தத்துவ விவாதங்கள்.",
      taWord: "ரகசியமான / சிலருக்கு மட்டுமே தெரிந்த",
      pos: "adj.",
      synonyms: ["Obscure", "Arcane", "Complex"],
      antonyms: ["Common", "Familiar"]
    }
  ],
  F: [
    {
      word: "Facetious",
      definition: "Treating serious issues with deliberately inappropriate humor.",
      enExample: "A facetious remark.",
      taExample: "ஒரு வேடிக்கையான கருத்து.",
      taWord: "வேடிக்கையான",
      pos: "adj.",
      synonyms: ["Flippant", "Glib", "Tongue-in-cheek"],
      antonyms: ["Serious", "Solemn"]
    },
    {
      word: "Fallacious",
      definition: "Based on a mistaken belief.",
      enExample: "Fallacious arguments.",
      taExample: "தவறான வாதங்கள்.",
      taWord: "தவறான",
      pos: "adj.",
      synonyms: ["False", "Untrue", "Wrong"],
      antonyms: ["True", "Correct"]
    },
    {
      word: "Fastidious",
      definition: "Very attentive to and concerned about accuracy and detail.",
      enExample: "He chooses his words with fastidious care.",
      taExample: "அவர் தனது வார்த்தைகளை மிகவும் நேர்த்தியான கவனத்துடன் தேர்ந்தெடுக்கிறார்.",
      taWord: "நேர்த்தியான",
      pos: "adj.",
      synonyms: ["Scrupulous", "Punctilious", "Meticulous"],
      antonyms: ["Careless", "Sloppy"]
    }
  ],
  G: [
    {
      word: "Galvanize",
      definition: "Shock or excite (someone) into taking action.",
      enExample: "The urgency of his voice galvanized them into action.",
      taExample: "அவரது குரலின் அவசரம் அவர்களைச் செயல்படத் தூண்டியது.",
      taWord: "தூண்டு",
      pos: "verb",
      synonyms: ["Jolt", "Shock", "Startle"],
      antonyms: ["Demotivate", "Deter"]
    },
    {
      word: "Garrulous",
      definition: "Excessively talkative, especially on trivial matters.",
      enExample: "A garrulous cab driver.",
      taExample: "ஒரு வாயாடி வாடகை மகிழுந்து ஓட்டுநர்.",
      taWord: "வாயாடி",
      pos: "adj.",
      synonyms: ["Talkative", "Voluble", "Loquacious"],
      antonyms: ["Taciturn", "Reticent"]
    },
    {
      word: "Gregarious",
      definition: "(of a person) fond of company; sociable.",
      enExample: "He was a popular and gregarious man.",
      taExample: "அவர் ஒரு பிரபலமான மற்றும் சமூகமாகப் பழகும் மனிதர்.",
      taWord: "சமூகமாக பழகும்",
      pos: "adj.",
      synonyms: ["Sociable", "Company-loving", "Convivial"],
      antonyms: ["Unsociable", "Reserved"]
    }
  ],
  H: [
    {
      word: "Hackneyed",
      definition: "(of a phrase or idea) lacking significance through having been overused.",
      enExample: "Hackneyed old sayings.",
      taExample: "பழமையான சொலவடைகள்.",
      taWord: "பழமையான / தேய்வழக்கான",
      pos: "adj.",
      synonyms: ["Overused", "Overworked", "Clichéd"],
      antonyms: ["Original", "Fresh"]
    },
    {
      word: "Halcyon",
      definition: "Denoting a period of time in the past that was idyllically happy and peaceful.",
      enExample: "The halcyon days of the mid-1980s.",
      taExample: "1980களின் நடுப்பகுதியில் அமைதியான நாட்கள்.",
      taWord: "அமைதியான",
      pos: "adj.",
      synonyms: ["Serene", "Calm", "Pleasant"],
      antonyms: ["Troubled", "Stormy"]
    },
    {
      word: "Hubris",
      definition: "Excessive pride or self-confidence.",
      enExample: "The self-assured hubris among economists was shaken in the late 1980s.",
      taExample: "பொருளாதார நிபுணர்களிடையேயான தன்னம்பிக்கை ஆணவம் 1980களின் பிற்பகுதியில் ஆட்டம் கண்டது.",
      taWord: "ஆணவம்",
      pos: "noun",
      synonyms: ["Arrogance", "Conceit", "Haughtiness"],
      antonyms: ["Humility", "Modesty"]
    }
  ],
  I: [
    {
      word: "Iconoclast",
      definition: "A person who attacks cherished beliefs or institutions.",
      enExample: "Notorious as an iconoclast, that music critic isn’t afraid to go after sacred cows.",
      taExample: "மரபுகளை உடைப்பவர் என்று பெயரெடுத்த அந்த இசை விமர்சகர் புனிதமானவற்றையும் விமர்சிக்க தயங்குவதில்லை.",
      taWord: "மரபுகளை உடைப்பவர்",
      pos: "noun",
      synonyms: ["Critic", "Skeptic", "Heretic"],
      antonyms: ["Conformist", "Believer"]
    },
    {
      word: "Inexorable",
      definition: "Impossible to stop or prevent.",
      enExample: "The seemingly inexorable march of new technology.",
      taExample: "புதிய தொழில்நுட்பத்தின் தடுக்க முடியாத முன்னேற்றம்.",
      taWord: "தடுக்க முடியாத",
      pos: "adj.",
      synonyms: ["Relentless", "Unstoppable", "Inevitable"],
      antonyms: ["Flexible", "Preventable"]
    },
    {
      word: "Intransigent",
      definition: "Unwilling or refusing to change one's views or to agree about something.",
      enExample: "Her father had tried persuasion, but she was intransigent.",
      taExample: "அவளது தந்தை சம்மதிக்க வைக்க முயன்றார், ஆனால் அவள் விட்டுகொடுக்காதவளாக இருந்தாள்.",
      taWord: "விட்டுகொடுக்காத",
      pos: "adj.",
      synonyms: ["Uncompromising", "Stubborn", "Obstinate"],
      antonyms: ["Compliant", "Flexible"]
    }
  ],
  J: [
    {
      word: "Jargon",
      definition: "Special words or expressions that are used by a particular profession or group and are difficult for others to understand.",
      enExample: "Legal jargon can be confusing for laypeople.",
      taExample: "சட்டத்துறை துறைசார் மொழி சாதாரண மக்களுக்கு குழப்பமாக இருக்கலாம்.",
      taWord: "துறைசார் மொழி",
      pos: "noun",
      synonyms: ["Slang", "Idiom", "Cant"],
      antonyms: ["Standard language"]
    },
    {
      word: "Jocular",
      definition: "Fond of or characterized by joking; humorous or playful.",
      enExample: "She sounded in a jocular mood.",
      taExample: "அவள் ஒரு வேடிக்கையான மனநிலையில் இருந்தாள்.",
      taWord: "வேடிக்கையான",
      pos: "adj.",
      synonyms: ["Humorous", "Amusing", "Comic"],
      antonyms: ["Serious", "Earnest"]
    },
    {
      word: "Juxtapose",
      definition: "Place or deal with close together for contrasting effect.",
      enExample: "Black-and-white photos of slums were starkly juxtaposed with color images.",
      taExample: "சேரிகளின் கறுப்பு-வெள்ளை புகைப்படங்கள் வண்ணப் படங்களுடன் அருகருகே ஒப்பிடப்பட்டன.",
      taWord: "அருகில் வைத்து ஒப்பிடு",
      pos: "verb",
      synonyms: ["Collocate", "Compare", "Contrast"],
      antonyms: []
    }
  ],
  K: [
    {
      word: "Keen",
      definition: "Having or showing eagerness or enthusiasm.",
      enExample: "Keen believers in the monetary system.",
      taExample: "பணவியல் அமைப்பில் கூர்மையான நம்பிக்கை கொண்டவர்கள்.",
      taWord: "கூர்மையான / ஆர்வமுள்ள",
      pos: "adj.",
      synonyms: ["Eager", "Anxious", "Intent"],
      antonyms: ["Apathetic", "Reluctant"]
    },
    {
      word: "Knell",
      definition: "The sound of a bell, especially when rung solemnly for a death or funeral.",
      enExample: "The defeat sounded the death knell for the company.",
      taExample: "அந்தத் தோல்வி நிறுவனத்திற்கு சாவு மணியாக அமைந்தது.",
      taWord: "சாவு மணி",
      pos: "noun",
      synonyms: ["Toll", "Ringing", "Chime"],
      antonyms: []
    },
    {
      word: "Kudos",
      definition: "Praise and honor received for an achievement.",
      enExample: "Kudos to everyone who put the event together.",
      taExample: "நிகழ்வை ஒருங்கிணைத்த அனைவருக்கும் பாராட்டுகள்.",
      taWord: "பாராட்டு",
      pos: "noun",
      synonyms: ["Prestige", "Cachet", "Glory"],
      antonyms: ["Dishonor", "Criticism"]
    }
  ],
  L: [
    {
      word: "Laconic",
      definition: "(of a person, speech, or style of writing) using very few words.",
      enExample: "His laconic reply suggested a lack of interest.",
      taExample: "அவரது சுருக்கமான பதில் ஆர்வமின்மையைக் காட்டியது.",
      taWord: "சுருக்கமான",
      pos: "adj.",
      synonyms: ["Brief", "Concise", "Terse"],
      antonyms: ["Verbose", "Loquacious"]
    },
    {
      word: "Languid",
      definition: "Displaying or having a disinclination for physical exertion or effort; slow and relaxed.",
      enExample: "They turned with languid movements from back to front so as to tan evenly.",
      taExample: "சமமாக வெயில் படுவதற்கு அவர்கள் மெதுவாகவும் தளர்வாகவும் திரும்பினார்கள்.",
      taWord: "தளர்வான",
      pos: "adj.",
      synonyms: ["Relaxed", "Unhurried", "Slow"],
      antonyms: ["Energetic", "Active"]
    },
    {
      word: "Loquacious",
      definition: "Tending to talk a great deal; talkative.",
      enExample: "Never loquacious, Sarah was now totally lost for words.",
      taExample: "எப்போதுமே அதிகம் பேசாத சாரா, இப்போது பேசுவதற்கு வார்த்தைகளின்றி தவித்தார்.",
      taWord: "அதிகம் பேசும்",
      pos: "adj.",
      synonyms: ["Talkative", "Voluble", "Garrulous"],
      antonyms: ["Reticent", "Taciturn"]
    }
  ],
  M: [
    {
      word: "Magnanimous",
      definition: "Very generous or forgiving, especially toward a rival or someone less powerful than oneself.",
      enExample: "She should be magnanimous in victory.",
      taExample: "அவள் வெற்றியில் பெருந்தன்மையாக இருக்க வேண்டும்.",
      taWord: "பெருந்தன்மையான",
      pos: "adj.",
      synonyms: ["Generous", "Charitable", "Benevolent"],
      antonyms: ["Mean-spirited", "Selfish"]
    },
    {
      word: "Malleable",
      definition: "Easily influenced; pliable.",
      enExample: "Anna was shaken enough to be malleable.",
      taExample: "அன்னா எளிதாக வளைக்கக்கூடிய அளவிற்கு அதிர்ச்சியடைந்தாள்.",
      taWord: "வளைக்கக்கூடிய",
      pos: "adj.",
      synonyms: ["Suggestible", "Susceptible", "Impressionable"],
      antonyms: ["Intractable", "Rigid"]
    },
    {
      word: "Mitigate",
      definition: "Make less severe, serious, or painful.",
      enExample: "He wanted to mitigate misery in the world.",
      taExample: "அவர் உலகின் துயரத்தை குறைக்க விரும்பினார்.",
      taWord: "குறை",
      pos: "verb",
      synonyms: ["Alleviate", "Reduce", "Diminish"],
      antonyms: ["Aggravate", "Intensify"]
    }
  ],
  N: [
    {
      word: "Nadir",
      definition: "The lowest point in the fortunes of a person or organization.",
      enExample: "They had reached the nadir of their sufferings.",
      taExample: "அவர்கள் தங்கள் துன்பங்களின் அடிமட்டத்தை எட்டியிருந்தனர்.",
      taWord: "அடிமட்டம்",
      pos: "noun",
      synonyms: ["Lowest point", "Bottom", "Rock bottom"],
      antonyms: ["Zenith", "Peak"]
    },
    {
      word: "Nascent",
      definition: "Just coming into existence and beginning to display signs of future potential.",
      enExample: "The nascent space industry.",
      taExample: "வளரும் விண்வெளித் துறை.",
      taWord: "வளரும்",
      pos: "adj.",
      synonyms: ["Developing", "Growing", "Emerging"],
      antonyms: ["Developed", "Mature"]
    },
    {
      word: "Nuance",
      definition: "A subtle difference in or shade of meaning, expression, or sound.",
      enExample: "The nuances of facial expression and body language.",
      taExample: "முக பாவனைகள் மற்றும் உடல் மொழியின் நுணுக்கங்கள்.",
      taWord: "நுணுக்கம்",
      pos: "noun",
      synonyms: ["Subtle distinction", "Shade", "Subtlety"],
      antonyms: []
    }
  ],
  O: [
    {
      word: "Obdurate",
      definition: "Stubbornly refusing to change one's opinion or course of action.",
      enExample: "I argued this point with him, but he was obdurate.",
      taExample: "நான் இந்த விஷயத்தை அவரிடம் வாதிட்டேன், ஆனால் அவர் பிடிவாதமாக இருந்தார்.",
      taWord: "பிடிவாதமான",
      pos: "adj.",
      synonyms: ["Stubborn", "Obstinate", "Inflexible"],
      antonyms: ["Malleable", "Compliant"]
    },
    {
      word: "Obfuscate",
      definition: "Render obscure, unclear, or unintelligible.",
      enExample: "The spelling changes will deform some familiar words and obfuscate their etymological origins.",
      taExample: "எழுத்து மாற்றங்கள் சில தெரிந்த வார்த்தைகளை சிதைத்து அவற்றின் மூலத்தை குழப்பிவிடும்.",
      taWord: "குழப்பு",
      pos: "verb",
      synonyms: ["Obscure", "Confuse", "Blur"],
      antonyms: ["Clarify", "Elucidate"]
    },
    {
      word: "Ostentatious",
      definition: "Characterized by vulgar or pretentious display; designed to impress or attract notice.",
      enExample: "Books that people buy and display ostentatiously but never actually finish.",
      taExample: "மக்கள் வாங்கி பகட்டாகக் காட்டும் ஆனால் படித்து முடிக்காத புத்தகங்கள்.",
      taWord: "பகட்டான",
      pos: "adj.",
      synonyms: ["Showy", "Pretentious", "Conspicuous"],
      antonyms: ["Plain", "Unobtrusive"]
    }
  ],
  P: [
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
  ],
  Q: [
    {
      word: "Quagmire",
      definition: "An awkward, complex, or hazardous situation.",
      enExample: "A legal quagmire.",
      taExample: "ஒரு கடினமான சட்டச் சிக்கல் நிலை.",
      taWord: "கடினமான நிலை / சிக்கல்",
      pos: "noun",
      synonyms: ["Muddle", "Mess", "Predicament"],
      antonyms: ["Solution", "Boon"]
    },
    {
      word: "Quell",
      definition: "Put an end to (a rebellion or other disorder), typically by the use of force.",
      enExample: "Extra police were called to quell the disturbance.",
      taExample: "கலவரத்தை அடக்க கூடுதல் காவல்துறையினர் அழைக்கப்பட்டனர்.",
      taWord: "அடக்கு",
      pos: "verb",
      synonyms: ["End", "Crush", "Quash"],
      antonyms: ["Foment", "Incite"]
    },
    {
      word: "Quixotic",
      definition: "Exceedingly idealistic; unrealistic and impractical.",
      enExample: "A vast and perhaps quixotic project.",
      taExample: "ஒரு பெரிய மற்றும் நடைமுறைக்கு ஒவ்வாத கற்பனைத் திட்டம்.",
      taWord: "நடைமுறைக்கு ஒவ்வாத கற்பனை",
      pos: "adj.",
      synonyms: ["Idealistic", "Romantic", "Visionary"],
      antonyms: ["Pragmatic", "Practical"]
    }
  ],
  R: [
    {
      word: "Recalcitrant",
      definition: "Having an obstinately uncooperative attitude toward authority or discipline.",
      enExample: "A class of recalcitrant fifteen-year-olds.",
      taExample: "அடங்காத பதினைந்து வயதுடைய ஒரு வகுப்பு.",
      taWord: "அடங்காத",
      pos: "adj.",
      synonyms: ["Uncooperative", "Intractable", "Insubordinate"],
      antonyms: ["Docile", "Compliant"]
    },
    {
      word: "Relegate",
      definition: "Consign or dismiss to an inferior rank or position.",
      enExample: "They aim to prevent women from being relegated to a secondary role.",
      taExample: "பெண்களை இரண்டாம் நிலைக்குத் தரமிறக்குவதைத் தடுக்க அவர்கள் விரும்புகிறார்கள்.",
      taWord: "தரமிறக்கு",
      pos: "verb",
      synonyms: ["Downgrade", "Lower", "Demote"],
      antonyms: ["Promote", "Upgrade"]
    },
    {
      word: "Resilient",
      definition: "(of a person or animal) able to withstand or recover quickly from difficult conditions.",
      enExample: "Babies are generally far more resilient than new parents realize.",
      taExample: "புதிய பெற்றோர்கள் உணர்ந்ததை விட குழந்தைகள் பொதுவாக மீள்திறன் கொண்டவர்கள்.",
      taWord: "மீள்திறன் கொண்ட",
      pos: "adj.",
      synonyms: ["Tough", "Hardy", "Quick to recover"],
      antonyms: ["Vulnerable", "Fragile"]
    }
  ],
  S: [
    {
      word: "Sagacious",
      definition: "Having or showing keen mental discernment and good judgment; shrewd.",
      enExample: "They were sagacious enough to avoid any outright confrontation.",
      taExample: "அவர்கள் எந்தவொரு நேரடியான மோதலையும் தவிர்க்கும் அளவுக்கு விவேகமானவர்களாக இருந்தனர்.",
      taWord: "விவேகமான",
      pos: "adj.",
      synonyms: ["Wise", "Clever", "Intelligent"],
      antonyms: ["Foolish", "Stupid"]
    },
    {
      word: "Surreptitious",
      definition: "Kept secret, especially because it would not be approved of.",
      enExample: "They carried on a surreptitious affair.",
      taExample: "அவர்கள் ஒரு ரகசிய உறவைத் தொடர்ந்தனர்.",
      taWord: "ரகசியமான",
      pos: "adj.",
      synonyms: ["Secret", "Stealthy", "Clandestine"],
      antonyms: ["Blatant", "Open"]
    },
    {
      word: "Sycophant",
      definition: "A person who acts obsequiously toward someone important in order to gain advantage.",
      enExample: "He was surrounded by sycophants.",
      taExample: "அவர் முகஸ்துதி செய்பவர்களால் சூழப்பட்டிருந்தார்.",
      taWord: "முகஸ்துதி செய்பவர்",
      pos: "noun",
      synonyms: ["Toady", "Creep", "Flatterer"],
      antonyms: []
    }
  ],
  T: [
    {
      word: "Taciturn",
      definition: "(of a person) reserved or uncommunicative in speech; saying little.",
      enExample: "After such gatherings she would be taciturn and morose.",
      taExample: "இதுபோன்ற கூட்டங்களுக்குப் பிறகு அவள் அதிகம் பேசாமல் இருப்பாள்.",
      taWord: "அதிகம் பேசாத",
      pos: "adj.",
      synonyms: ["Untalkative", "Uncommunicative", "Reticent"],
      antonyms: ["Talkative", "Loquacious"]
    },
    {
      word: "Tenacious",
      definition: "Tending to keep a firm hold of something; clinging or adhering closely.",
      enExample: "A tenacious grip.",
      taExample: "ஒரு பிடிவாதமான பிடி.",
      taWord: "பிடிவாதமான",
      pos: "adj.",
      synonyms: ["Firm", "Tight", "Fast"],
      antonyms: ["Loose", "Weak"]
    },
    {
      word: "Trepidation",
      definition: "A feeling of fear or agitation about something that may happen.",
      enExample: "The men set off in fear and trepidation.",
      taExample: "அந்த மனிதர்கள் பயத்துடனும் அச்சத்துடனும் புறப்பட்டனர்.",
      taWord: "அச்சம்",
      pos: "noun",
      synonyms: ["Fear", "Apprehension", "Dread"],
      antonyms: ["Calm", "Equanimity"]
    }
  ],
  U: [
    {
      word: "Ubiquitous",
      definition: "Present, appearing, or found everywhere.",
      enExample: "His ubiquitous influence was felt by all the family.",
      taExample: "அவரது எங்கும் நிறைந்த செல்வாக்கை குடும்பத்தினர் அனைவரும் உணர்ந்தனர்.",
      taWord: "எங்கும் நிறைந்த",
      pos: "adj.",
      synonyms: ["Omnipresent", "Everywhere", "Pervasive"],
      antonyms: ["Rare", "Scarce"]
    },
    {
      word: "Uncanny",
      definition: "Strange or mysterious, especially in an unsettling way.",
      enExample: "An uncanny feeling that she was being watched.",
      taExample: "அவள் கண்காணிக்கப்படுகிறாள் என்ற விசித்திரமான உணர்வு.",
      taWord: "விசித்திரமான",
      pos: "adj.",
      synonyms: ["Eerie", "Unnatural", "Weird"],
      antonyms: ["Normal", "Ordinary"]
    },
    {
      word: "Usurp",
      definition: "Take (a position of power or importance) illegally or by force.",
      enExample: "Richard usurped the throne.",
      taExample: "ரிச்சர்ட் சிம்மாசனத்தை பறித்துக்கொண்டார்.",
      taWord: "பறித்துக்கொள்",
      pos: "verb",
      synonyms: ["Seize", "Take over", "Appropriate"],
      antonyms: ["Surrender", "Relinquish"]
    }
  ],
  V: [
    {
      word: "Vacillate",
      definition: "Alternate or waver between different opinions or actions; be indecisive.",
      enExample: "I had for a time vacillated between teaching and journalism.",
      taExample: "கற்பித்தல் மற்றும் இதழியலுக்கு இடையே நான் சில காலம் ஊசலாடினேன்.",
      taWord: "ஊசலாடு",
      pos: "verb",
      synonyms: ["Dither", "Be indecisive", "Waver"],
      antonyms: ["Resolute", "Decide"]
    },
    {
      word: "Venerate",
      definition: "Regard with great respect; revere.",
      enExample: "Mother Teresa is venerated as a saint.",
      taExample: "அன்னை தெரசா ஒரு புனிதராக மதிக்கப்படுகிறார்.",
      taWord: "மதி",
      pos: "verb",
      synonyms: ["Revere", "Respect", "Worship"],
      antonyms: ["Despise", "Disrespect"]
    },
    {
      word: "Vociferous",
      definition: "(especially of a person or speech) vehement or clamorous.",
      enExample: "He was a vociferous opponent of the takeover.",
      taExample: "அவர் கையகப்படுத்துதலின் சத்தமாக வெளிப்படுத்தும் எதிர்ப்பாளராக இருந்தார்.",
      taWord: "சத்தமாக வெளிப்படுத்தும்",
      pos: "adj.",
      synonyms: ["Loud", "Vocal", "Outspoken"],
      antonyms: ["Silent", "Quiet"]
    }
  ],
  W: [
    {
      word: "Wane",
      definition: "(of a state or feeling) decrease in vigor, power, or extent; become weaker.",
      enExample: "Confidence in the dollar waned.",
      taExample: "டாலர் மீதான நம்பிக்கை தேய்ந்தது.",
      taWord: "தேய் / குறை",
      pos: "verb",
      synonyms: ["Decrease", "Decline", "Diminish"],
      antonyms: ["Wax", "Grow"]
    },
    {
      word: "Whimsical",
      definition: "Playfully quaint or fanciful, especially in an appealing and amusing way.",
      enExample: "A whimsical sense of humor.",
      taExample: "ஒரு விசித்திரமான நகைச்சுவை உணர்வு.",
      taWord: "விசித்திரமான",
      pos: "adj.",
      synonyms: ["Fanciful", "Playful", "Mischievous"],
      antonyms: ["Serious", "Practical"]
    },
    {
      word: "Winsome",
      definition: "Attractive or appealing in appearance or character.",
      enExample: "A winsome smile.",
      taExample: "ஒரு கவர்ச்சியான புன்னகை.",
      taWord: "கவர்ச்சியான",
      pos: "adj.",
      synonyms: ["Appealing", "Engaging", "Charming"],
      antonyms: ["Unattractive", "Repellent"]
    }
  ],
  X: [
    {
      word: "Xenophobia",
      definition: "Dislike of or prejudice against people from other countries.",
      enExample: "The resurgence of racism and xenophobia.",
      taExample: "இனவெறி மற்றும் அந்நியர் மீதான வெறுப்பு மீண்டும் எழுச்சி பெறுதல்.",
      taWord: "அந்நியர் மீதான வெறுப்பு",
      pos: "noun",
      synonyms: ["Prejudice", "Intolerance", "Bigotry"],
      antonyms: ["Tolerance", "Acceptance"]
    },
    {
      word: "X factor",
      definition: "A variable in a given situation that could have the most significant impact on the outcome.",
      enExample: "The x factor in this election is the youth vote.",
      taExample: "இந்தத் தேர்தலில் சிறப்பு அம்சம் இளைஞர்களின் வாக்கு.",
      taWord: "சிறப்பு அம்சம்",
      pos: "noun",
      synonyms: ["Unknown quantity", "Special quality"],
      antonyms: []
    }
  ],
  Y: [
    {
      word: "Yearn",
      definition: "Have an intense feeling of longing for something, typically something that one has lost or been separated from.",
      enExample: "She yearned for a glimpse of him.",
      taExample: "அவள் அவனைக் காண ஏங்கினாள்.",
      taWord: "ஏங்கு",
      pos: "verb",
      synonyms: ["Long", "Pine", "Crave"],
      antonyms: ["Despise", "Dislike"]
    },
    {
      word: "Yokel",
      definition: "An uneducated and unsophisticated person from the countryside.",
      enExample: "A naive yokel.",
      taExample: "ஒரு அப்பாவி கிராமத்து ஆள்.",
      taWord: "கிராமத்து ஆள்",
      pos: "noun",
      synonyms: ["Bumpkin", "Peasant", "Rustic"],
      antonyms: ["Sophisticate", "City slicker"]
    }
  ],
  Z: [
    {
      word: "Zealot",
      definition: "A person who is fanatical and uncompromising in pursuit of their religious, political, or other ideals.",
      enExample: "He was a zealot for the cause of reform.",
      taExample: "அவர் சீர்திருத்தத்திற்கான ஒரு அதி தீவிரவாதியாக இருந்தார்.",
      taWord: "அதி தீவிரவாதி",
      pos: "noun",
      synonyms: ["Fanatic", "Extremist", "Radical"],
      antonyms: ["Moderate", "Conservative"]
    },
    {
      word: "Zenith",
      definition: "The time at which something is most powerful or successful.",
      enExample: "Under Justinian, the Byzantine Empire reached its zenith.",
      taExample: "ஜஸ்டினியனின் கீழ், பைசாந்தியப் பேரரசு அதன் உச்சத்தை எட்டியது.",
      taWord: "உச்சம்",
      pos: "noun",
      synonyms: ["Peak", "Pinnacle", "Climax"],
      antonyms: ["Nadir", "Bottom"]
    }
  ]
};

const letters = Object.keys(advancedWords);

letters.forEach(letter => {
  const filePath = path.join(__dirname, 'src', `data_${letter}.ts`);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Calculate new IDs by finding the maximum ID currently in the file
    const idRegex = /id:\s*(\d+)/g;
    let match;
    let maxId = 0;
    while ((match = idRegex.exec(content)) !== null) {
      const id = parseInt(match[1]);
      if (id > maxId) maxId = id;
    }
    
    let newId = maxId > 0 ? maxId + 1 : letter.charCodeAt(0) * 100;
    
    let addedContent = "";
    advancedWords[letter].forEach(wordData => {
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
    
    // Insert before the last ];
    content = content.replace(/\s*\];\s*$/, `${addedContent}\n];\n`);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated data_${letter}.ts with ${advancedWords[letter].length} words.`);
  } else {
    console.log(`File data_${letter}.ts does not exist!`);
  }
});

