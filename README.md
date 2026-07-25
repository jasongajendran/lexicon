# Pragmatic Lexicon — Engineer's Vocabulary 📖⚡

**Pragmatic Lexicon** is a modern, high-performance vocabulary learning and flashcard application engineered specifically for software developers, architects, and technology professionals. It provides clear, pragmatic definitions, contextual usage examples in software engineering scenarios, structured phonetic parts of speech, and dual-language translation support in **Tamil** (`taWord` & `taExample`).

---

## 🌟 Key Features

- 📂 **Modular & Compressed Data Bundles**: All 690+ curated terms are partitioned into modular, letter-based JSON files (`src/data/a.json` through `z.json`) for minimal file size, fast bundler loading, and Git-friendly diffs.
- 🌐 **Dual-Language Contextual Learning**: Real-world software engineering examples in English accompanied by accurate Tamil translations and terminology.
- 🎴 **Interactive 3D Flashcard Deck**: Flip cards with active recall practice, deck shuffling, progress bar, mastery tracking (`CheckCircle2`), and bookmarking.
- 🔊 **Native Web Speech Pronunciation**: Integrated browser Speech Synthesis API (`window.speechSynthesis`) for accurate English pronunciation.
- 🔍 **Instant Search & Deep Filtering**: Instant fuzzy search across terms, definitions, and Tamil terms; alphabetical A–Z jump filters; and parts of speech filtering (`noun`, `verb`, `adj.`).
- 🔖 **Local Persistence**: Save bookmarked terms locally for targeted revision sessions.
- 🎨 **Editorial Aesthetic**: High-contrast, dark-mode design with smooth Framer Motion layout transitions, custom typography, and responsive touch controls.

---

## 📁 Repository & Data Architecture

```
.
├── src/
│   ├── components/
│   │   ├── BottomNav.tsx          # Mobile navigation dock
│   │   ├── FilterSheet.tsx        # Mobile/tablet drawer filter
│   │   ├── FlashcardView.tsx      # 3D interactive flashcard deck
│   │   ├── WordCard.tsx           # Grid card item layout
│   │   ├── WordDetailModal.tsx    # Comprehensive term modal view
│   │   └── WordRow.tsx            # List row item layout
│   ├── data/                      # Modular, letter-based JSON bundles
│   │   ├── a.json                 # Terms starting with 'A'
│   │   ├── b.json                 # Terms starting with 'B'
│   │   ├── ...                    # (c.json through y.json)
│   │   └── z.json                 # Terms starting with 'Z'
│   ├── utils/
│   │   └── speech.ts              # Web Speech API helper
│   ├── App.tsx                    # Main app engine & layout
│   ├── data.ts                    # Main data loader aggregator
│   ├── index.css                  # Tailwind CSS styling & animations
│   ├── main.tsx                   # React app entry point
│   └── types.ts                   # LexiconWord type definitions
├── metadata.json                  # Application metadata configuration
├── package.json                   # Project dependencies & scripts
├── README.md                      # Project documentation
├── tsconfig.json                  # TypeScript compiler settings
└── vite.config.ts                 # Vite bundler configuration
```

---

## 🧩 Data Bundle Schema (`LexiconWord`)

Each JSON file (`src/data/*.json`) contains an array of compressed `LexiconWord` objects. Unused optional fields (such as empty `antonyms` or `synonyms`) are omitted to keep bundle file sizes compact:

```json
[
  {
    "id": 1,
    "word": "Pragmatic",
    "definition": "practical rather than idealistic",
    "enExample": "Let's be pragmatic and ship the MVP first.",
    "taExample": "நாம் நடைமுறைசார்ந்த அணுகுமுறையை கடைபிடித்து முதலில் MVP-யை வெளியிடுவோம்.",
    "taWord": "நடைமுறைசார்ந்த",
    "pos": "adj.",
    "synonyms": ["Practical", "Realistic"],
    "antonyms": ["Theoretical", "Idealistic"]
  }
]
```

### TypeScript Interface (`src/types.ts`)
```typescript
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
}
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Local Development

1. **Clone repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will be served on `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite 6
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion v12)
- **Icons**: Lucide React
- **Speech**: Web Speech Synthesis API

---

## 📄 License

MIT License. Designed and built for developers & technology professionals worldwide.
