export interface LexiconWord {
  id: number;
  word: string;
  definition: string;
  enExample: string;
  taExample: string;
  taWord: string;
  pos: string;
  synonyms?: string[];
  antonyms?: string[];
  enExample2?: string;
  taExample2?: string;
}
