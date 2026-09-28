# OpenImpact

> **Collaborative, transparent proof of work tool**

OpenImpact is a decentralized, milestone-driven funding and proof-of-work platform designed for open-source software projects, public goods, and non-profit initiatives operating under 501(c)(6) fiscal sponsorship.

---

## Key Features

- **Smart Milestone Escrow**: Grant capital is held securely in regulated milestone-based escrow accounts and released strictly upon verifiable deliverable completion.
- **GitHub PR & Commit Sync**: Automatically links merged GitHub pull requests, signed commits, and deployment transactions directly to milestone deliverables.
- **OpenProof Engine**: On-chain and cryptographic peer-reviewed audit protocol validating contributor deliverables and financial receipts.
- **Proof of Contribution Certificates**: Generate official, verifiable proof of work certificates with SHA-256 signatures, print layouts, and shareable verification URLs.
- **Evidence & Artifact Inspector**: Upload, inspect, and endorse real-world impact artifacts (audit reports, deployment logs, WHOIS records, and lease agreements).
- **Multi-Currency & FX Exchange**: Real-time currency conversions across USD, EUR, NGN, GBP, JPY, CAD, AUD, and BRL for international collectives.

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/openimpact/openimpact.git
   cd openimpact
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Motion
- **Build System**: Vite, ESBuild, TSX
- **Backend Server**: Express (Node.js runtime, port 3000)

---

## Project Architecture

```
openimpact/
├── src/
│   ├── components/       # UI Components (Modals, Panels, Views)
│   │   ├── ProofContributionModal.tsx  # Proof of Work Certificate Generator
│   │   ├── DocumentViewerModal.tsx     # In-App Evidence Document Reader
│   │   ├── OpenProofInspector.tsx      # Cryptographic Evidence Ledger
│   │   ├── LandingPage.tsx             # Main Landing & Showcase
│   │   ├── ProjectDetail.tsx           # Escrow & Milestone Breakdown
│   │   ├── Header.tsx                  # Global Navigation
│   │   └── Footer.tsx                  # Global Footer & Language Settings
│   ├── data/             # Project Mock Data & Evidence Records
│   ├── utils/            # Formatters, Currency FX, & Badge Engines
│   ├── types.ts          # Core TypeScript Interfaces
│   ├── App.tsx           # Application Orchestrator
│   └── main.tsx          # Client Entry Point
├── server.ts             # Express API Proxy & Static Asset Server
├── metadata.json         # Platform Metadata
└── package.json          # Dependencies & Scripts
```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
