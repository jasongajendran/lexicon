import fs from 'fs';

const words = [
  { id: 1, word: "Pragmatic", taWord: "நடைமுறைசார்ந்த", pos: "adj." },
  { id: 2, word: "Paradigm", taWord: "மாதிரி / சிந்தனை முறை", pos: "noun" },
  { id: 3, word: "Proliferate", taWord: "பெருகுதல்", pos: "verb" },
  { id: 4, word: "Precedent", taWord: "முன்னுதாரணம்", pos: "noun" },
  { id: 5, word: "Pertinent", taWord: "பொருத்தமான", pos: "adj." },
  { id: 6, word: "Plausible", taWord: "நம்பகத்தன்மையான", pos: "adj." },
  { id: 7, word: "Prudent", taWord: "விவேகமான", pos: "adj." },
  { id: 8, word: "Proficient", taWord: "திறமையான", pos: "adj." },
  { id: 9, word: "Provision", taWord: "ஏற்பாடு செய்தல்", pos: "verb" },
  { id: 10, word: "Predicate", taWord: "அடிப்படையாகக் கொள்ளுதல்", pos: "verb" },
  { id: 11, word: "Permutation", taWord: "வரிசைமாற்று", pos: "noun" },
  { id: 12, word: "Paradox", taWord: "முரண்பாடு", pos: "noun" },
  { id: 13, word: "Parity", taWord: "சமநிலை", pos: "noun" },
  { id: 14, word: "Prerequisite", taWord: "முன்நிபந்தனை", pos: "noun" },
  { id: 15, word: "Propagate", taWord: "பரவுதல்", pos: "verb" },
  { id: 16, word: "Pivotal", taWord: "முக்கியமான / மையமான", pos: "adj." },
  { id: 17, word: "Peripheral", taWord: "புறம்பான / இரண்டாம்நிலை", pos: "adj." },
  { id: 18, word: "Prohibitive", taWord: "தடுக்கும் / அதிக செலவான", pos: "adj." },
  { id: 19, word: "Protracted", taWord: "நீடித்த", pos: "adj." },
  { id: 20, word: "Plethora", taWord: "மிகுதி / ஏராளம்", pos: "noun" },
  { id: 21, word: "Perfunctory", taWord: "மேலோட்டமான", pos: "adj." },
  { id: 22, word: "Preclude", taWord: "தடுத்தல்", pos: "verb" },
  { id: 23, word: "Presumptuous", taWord: "துணிச்சலான / அளவுக்கு மீறிய", pos: "adj." },
  { id: 24, word: "Proactive", taWord: "முன்கூட்டியே செயல்படும்", pos: "adj." },
  { id: 25, word: "Purview", taWord: "அதிகார எல்லை / பொறுப்பு", pos: "noun" },
  { id: 26, word: "Performant", taWord: "சிறப்பான செயல்திறன்", pos: "adj." },
  { id: 27, word: "Polymorphism", taWord: "பல்லுருவாக்கம்", pos: "noun" },
  { id: 28, word: "Pervasive", taWord: "பரவலான", pos: "adj." },
  { id: 29, word: "Proponent", taWord: "ஆதரவாளர்", pos: "noun" },
  { id: 30, word: "Partition", taWord: "பிரித்தல்", pos: "verb" },
  { id: 31, word: "Prerogative", taWord: "தனிச்சிறப்புரிமை", pos: "noun" },
  { id: 32, word: "Persist", taWord: "நிலைத்திருத்தல்", pos: "verb" },
  { id: 33, word: "Palliative", taWord: "தற்காலிக நிவாரணம்", pos: "adj." },
  { id: 34, word: "Preempt", taWord: "முன்கூட்டியே தடுத்தல்", pos: "verb" },
  { id: 35, word: "Peculiar", taWord: "விசித்திரமான", pos: "adj." },
  { id: 36, word: "Placid", taWord: "அமைதியான", pos: "adj." },
  { id: 37, word: "Punctilious", taWord: "மிகக் கவனமான", pos: "adj." },
  { id: 38, word: "Provocative", taWord: "ஆத்திரமூட்டும்", pos: "adj." },
  { id: 39, word: "Provisional", taWord: "தற்காலிக", pos: "adj." },
  { id: 40, word: "Pedantic", taWord: "அதிகப்படியான நுட்பம்", pos: "adj." },
  { id: 41, word: "Parallax", taWord: "இடமாறு தோற்றம்", pos: "noun" },
  { id: 42, word: "Permeate", taWord: "ஊடுருவுதல்", pos: "verb" },
  { id: 43, word: "Potent", taWord: "சக்திவாய்ந்த", pos: "adj." },
  { id: 44, word: "Perceptive", taWord: "கூர்ந்தறிவுள்ள", pos: "adj." },
  { id: 45, word: "Prospective", taWord: "வருங்கால", pos: "adj." },
  { id: 46, word: "Paramount", taWord: "முதன்மையான", pos: "adj." },
  { id: 47, word: "Ponder", taWord: "ஆழமாகச் சிந்தித்தல்", pos: "verb" },
  { id: 48, word: "Profuse", taWord: "ஏராளமான", pos: "adj." },
  { id: 49, word: "Procure", taWord: "கொள்முதல் செய்தல்", pos: "verb" },
  { id: 50, word: "Proprietary", taWord: "தனியுரிமை கொண்ட", pos: "adj." }
];

let dataTs = fs.readFileSync('./src/data.ts', 'utf8');

words.forEach(w => {
  const regex = new RegExp(`(word:\\s*"${w.word}",\\n\\s*definition:\\s*"[^"]+",\\n\\s*enExample:\\s*"[^"]+",\\n\\s*taExample:\\s*"[^"]+")`, 'g');
  dataTs = dataTs.replace(regex, `$1,\n    taWord: "${w.taWord}",\n    pos: "${w.pos}"`);
});

fs.writeFileSync('./src/data.ts', dataTs);
