import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Note: In this environment, we expect the service account to be available via environment or we skip.
// For the purpose of this task, I'll use a hack to just write the data to a local file that the app can read if firestore isn't accessible, 
// OR I'll use the MCP tools in a loop (but carefully).
// Actually, I'll just try to use a node script with the firebase-admin SDK if I can find the service account.
// Since I don't see a service account key, I'll use the MCP tools again but correctly this time.

const jobs = [
    {
        title: "Frontier Research Engineer (AI)",
        pay: "$150/hr",
        hires: "12 hired recently",
        tags: ["AI", "Research", "Frontier"],
        company: "OpenAI",
        description: "Work on the next generation of large language models.",
        createdAt: new Date().toISOString()
    },
    {
        title: "Senior Rust Systems Engineer",
        pay: "$120/hr",
        hires: "8 hired recently",
        tags: ["Systems", "Rust", "Crypto"],
        company: "Solana",
        description: "Build high-performance blockchain infrastructure.",
        createdAt: new Date().toISOString()
    },
    {
        title: "PhD Researcher (Quantum Computing)",
        pay: "$180/hr",
        hires: "2 hired recently",
        tags: ["Quantum", "Research", "PhD"],
        company: "Google Quantum AI",
        description: "Push the boundaries of quantum supremacy.",
        createdAt: new Date().toISOString()
    },
    {
        title: "Full Stack Engineer (Next.js)",
        pay: "$90/hr",
        hires: "25 hired recently",
        tags: ["Engineering", "Product", "Vercel"],
        company: "Linear",
        description: "Craft beautiful and fast user experiences.",
        createdAt: new Date().toISOString()
    }
];

// I'll use a script that uses the 'firebase' package (client sdk) to seed data if I can run it.
// But MCP tools are better if I can get them to work.
// I suspect the 'document' field in firestore_add_document expects a specific structure.
// Let's try to use 'run_command' to run a small node script that uses the firebase package.
