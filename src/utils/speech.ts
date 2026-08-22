// Utility for speech synthesis with British female voice selection

let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const updateVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

const MALE_KEYWORDS = [
  'male',
  'george',
  'oliver',
  'daniel',
  'richard',
  'brian',
  'arthur',
  'david',
  'james',
  'ryan',
  'thomas',
  'alex',
  'fred',
  'steve',
  'guy',
  'man',
  'boy',
  'uk male',
  'us male'
];

const FEMALE_KEYWORDS = [
  'female',
  'woman',
  'google uk english female',
  'hazel',
  'libby',
  'victoria',
  'serena',
  'sonia',
  'martha',
  'fiona',
  'alice',
  'stephanie',
  'kate',
  'susan',
  'claire',
  'samantha',
  'amy',
  'emma',
  'joanna',
  'zira',
  'karen',
  'moira',
  'ava',
  'zoe'
];

function isMaleVoice(voice: SpeechSynthesisVoice): boolean {
  const name = voice.name.toLowerCase();
  return MALE_KEYWORDS.some((kw) => name.includes(kw));
}

function findYoungBritishFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // Filter out all male voices first
  const nonMaleVoices = voices.filter((v) => !isMaleVoice(v));

  // 1. Look for British Female voices (en-GB / en_GB)
  const ukFemaleVoices = nonMaleVoices.filter((v) => {
    const lang = v.lang ? v.lang.toLowerCase().replace('_', '-') : '';
    const name = v.name.toLowerCase();
    const isUK = lang.includes('en-gb') || name.includes('british') || name.includes('uk');
    const isFemale = FEMALE_KEYWORDS.some((kw) => name.includes(kw));
    return isUK && isFemale;
  });

  if (ukFemaleVoices.length > 0) {
    return ukFemaleVoices[0];
  }

  // 2. Any non-male British voice
  const ukNonMale = nonMaleVoices.filter((v) => {
    const lang = v.lang ? v.lang.toLowerCase().replace('_', '-') : '';
    const name = v.name.toLowerCase();
    return lang.includes('en-gb') || name.includes('british') || name.includes('uk');
  });

  if (ukNonMale.length > 0) {
    return ukNonMale[0];
  }

  // 3. Any English female voice
  const enFemale = nonMaleVoices.filter((v) => {
    const lang = v.lang ? v.lang.toLowerCase() : '';
    const name = v.name.toLowerCase();
    return lang.startsWith('en') && FEMALE_KEYWORDS.some((kw) => name.includes(kw));
  });

  if (enFemale.length > 0) {
    return enFemale[0];
  }

  // 4. Any non-male English voice
  const enNonMale = nonMaleVoices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
  if (enNonMale.length > 0) {
    return enNonMale[0];
  }

  return nonMaleVoices[0] || null;
}

export function speakWord(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    // Clean text: strip Tamil unicode range (\u0B80-\u0BFF) so TTS reads English text alone
    const englishOnlyText = text
      .replace(/[\u0B80-\u0BFF]/g, '')
      .replace(/["'\[\]()\/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!englishOnlyText) {
      if (onError) onError();
      return;
    }

    // Fetch fresh voices if cachedVoices is empty
    const freshVoices = window.speechSynthesis.getVoices();
    const voices = freshVoices.length > 0 ? freshVoices : cachedVoices;

    const utterance = new SpeechSynthesisUtterance(englishOnlyText);
    utterance.lang = 'en-GB';
    
    // Higher pitch (1.25) gives a distinctly young female vocal timber
    utterance.pitch = 1.25;
    utterance.rate = 0.92;

    const voice = findYoungBritishFemaleVoice(voices);

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onError) onError();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    if (onError) onError();
  }
}



