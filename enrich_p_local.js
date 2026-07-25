import fs from 'fs';

const map = {
  "Pragmatic": { synonyms: ["Practical", "Realistic"], antonyms: ["Theoretical", "Idealistic"] },
  "Paradigm": { synonyms: ["Model", "Pattern"], antonyms: [] },
  "Proliferate": { synonyms: ["Multiply", "Expand"], antonyms: ["Decrease", "Shrink"] },
  "Precedent": { synonyms: ["Example", "Standard"], antonyms: [] },
  "Pertinent": { synonyms: ["Relevant", "Applicable"], antonyms: ["Irrelevant", "Inapplicable"] },
  "Plausible": { synonyms: ["Credible", "Probable"], antonyms: ["Unlikely", "Impossible"] },
  "Prudent": { synonyms: ["Sensible", "Cautious"], antonyms: ["Reckless", "Careless"] },
  "Proficient": { synonyms: ["Skilled", "Capable"], antonyms: ["Incompetent", "Unskilled"] },
  "Provision": { synonyms: ["Supply", "Provide"], antonyms: ["Remove", "Deprive"] },
  "Predicate": { synonyms: ["Base", "Establish"], antonyms: [] },
  "Permutation": { synonyms: ["Variation", "Arrangement"], antonyms: [] },
  "Paradox": { synonyms: ["Contradiction", "Anomaly"], antonyms: ["Standard", "Norm"] },
  "Parity": { synonyms: ["Equality", "Equivalence"], antonyms: ["Disparity", "Inequality"] },
  "Prerequisite": { synonyms: ["Requirement", "Condition"], antonyms: ["Option", "Choice"] },
  "Propagate": { synonyms: ["Spread", "Transmit"], antonyms: ["Halt", "Contain"] },
  "Pivotal": { synonyms: ["Crucial", "Vital"], antonyms: ["Trivial", "Minor"] },
  "Peripheral": { synonyms: ["Secondary", "Marginal"], antonyms: ["Core", "Central"] },
  "Prohibitive": { synonyms: ["Restrictive", "Excessive"], antonyms: ["Affordable", "Reasonable"] },
  "Protracted": { synonyms: ["Prolonged", "Extended"], antonyms: ["Brief", "Short"] },
  "Plethora": { synonyms: ["Abundance", "Excess"], antonyms: ["Scarcity", "Lack"] },
  "Perfunctory": { synonyms: ["Superficial", "Hasty"], antonyms: ["Thorough", "Careful"] },
  "Preclude": { synonyms: ["Prevent", "Exclude"], antonyms: ["Include", "Permit"] },
  "Presumptuous": { synonyms: ["Arrogant", "Overconfident"], antonyms: ["Humble", "Modest"] },
  "Proactive": { synonyms: ["Anticipatory", "Driven"], antonyms: ["Reactive", "Passive"] },
  "Purview": { synonyms: ["Scope", "Domain"], antonyms: [] },
  "Performant": { synonyms: ["Efficient", "Fast"], antonyms: ["Sluggish", "Slow"] },
  "Polymorphism": { synonyms: ["Versatility", "Flexibility"], antonyms: ["Rigidity", "Uniformity"] },
  "Pervasive": { synonyms: ["Widespread", "Omnipresent"], antonyms: ["Rare", "Scarce"] },
  "Proponent": { synonyms: ["Advocate", "Supporter"], antonyms: ["Opponent", "Critic"] },
  "Partition": { synonyms: ["Divide", "Segment"], antonyms: ["Unite", "Combine"] },
  "Prerogative": { synonyms: ["Right", "Privilege"], antonyms: ["Obligation", "Duty"] },
  "Persist": { synonyms: ["Endure", "Continue"], antonyms: ["Cease", "Stop"] },
  "Palliative": { synonyms: ["Soothing", "Alleviating"], antonyms: ["Aggravating", "Worsening"] },
  "Preempt": { synonyms: ["Forestall", "Anticipate"], antonyms: ["React", "Follow"] },
  "Peculiar": { synonyms: ["Unusual", "Odd"], antonyms: ["Common", "Standard"] },
  "Placid": { synonyms: ["Calm", "Peaceful"], antonyms: ["Turbulent", "Agitated"] },
  "Punctilious": { synonyms: ["Meticulous", "Strict"], antonyms: ["Careless", "Sloppy"] },
  "Provocative": { synonyms: ["Stimulating", "Challenging"], antonyms: ["Dull", "Boring"] },
  "Provisional": { synonyms: ["Temporary", "Conditional"], antonyms: ["Permanent", "Final"] },
  "Pedantic": { synonyms: ["Fussy", "Overexacting"], antonyms: ["Pragmatic", "Informal"] },
  "Parallax": { synonyms: ["Shift", "Displacement"], antonyms: [] },
  "Permeate": { synonyms: ["Pervade", "Infuse"], antonyms: ["Drain", "Deplete"] },
  "Potent": { synonyms: ["Powerful", "Strong"], antonyms: ["Weak", "Ineffective"] },
  "Perceptive": { synonyms: ["Astute", "Observant"], antonyms: ["Oblivious", "Ignorant"] },
  "Prospective": { synonyms: ["Potential", "Expected"], antonyms: ["Current", "Past"] },
  "Paramount": { synonyms: ["Supreme", "Primary"], antonyms: ["Secondary", "Minor"] },
  "Ponder": { synonyms: ["Consider", "Reflect"], antonyms: ["Ignore", "Dismiss"] },
  "Profuse": { synonyms: ["Abundant", "Copious"], antonyms: ["Sparse", "Lacking"] },
  "Procure": { synonyms: ["Acquire", "Obtain"], antonyms: ["Lose", "Forfeit"] },
  "Proprietary": { synonyms: ["Exclusive", "Private"], antonyms: ["Open-source", "Public"] }
};

let dataTs = fs.readFileSync('./src/data.ts', 'utf8');

for (const word in map) {
  const syns = JSON.stringify(map[word].synonyms || []);
  const ants = JSON.stringify(map[word].antonyms || []);
  
  if (word === 'Pragmatic' || word === 'Paradigm') {
      continue; // skip the ones manually patched earlier
  }
  
  const regex = new RegExp('(word: "' + word + '"[\\s\\S]*?pos: "[^"]+")(,?)');
  dataTs = dataTs.replace(regex, "$1,\n    synonyms: " + syns + ",\n    antonyms: " + ants);
}

fs.writeFileSync('./src/data.ts', dataTs);
console.log('Enriched P words locally!');
