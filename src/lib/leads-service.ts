import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    getDocs,
    writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

export type LeadStage =
    | 'sourced'
    | 'decision_maker_found'
    | 'linkedin_sent'
    | 'in_conversation'
    | 'sample_sent'
    | 'call_scheduled'
    | 'closed_won'
    | 'lost';

export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ActivityNote {
    id: string;
    text: string;
    authorName: string;
    authorEmail?: string;
    createdAt: string;
    type?: 'note' | 'linkedin_message' | 'call' | 'status_change';
}

export interface CompanyLead {
    id?: string;
    companyName: string;
    website: string;
    industry: string;
    companySize?: string;
    dataSourcingNeeds: string[];
    estimatedValue?: number;
    priority: LeadPriority;
    stage: LeadStage;

    // Market & Vendor Intelligence
    fundingRound?: string;
    annualDataBudget?: string;
    competitorVendors?: string[];
    expertWorkforceNeeded?: string;
    whyTheyBuy?: string;
    recommendedOutreachHook?: string;

    // Decision Maker Info
    contactName: string;
    contactRole: string;
    linkedinUrl: string;
    contactEmail?: string;
    contactPhone?: string;

    // Follow-up & Outreach
    assignedVa: string;
    nextFollowUpDate?: string;
    lastContactDate?: string;
    linkedinStatus?: 'not_contacted' | 'request_sent' | 'connected' | 'inmail_sent' | 'replied';

    notes?: ActivityNote[];
    createdAt?: any;
    updatedAt?: any;
}

export const STAGES: { id: LeadStage; label: string; color: string; bg: string; border: string }[] = [
    { id: 'sourced', label: '1. Sourced / Identified', color: 'text-zinc-600', bg: 'bg-zinc-100', border: 'border-zinc-200' },
    { id: 'decision_maker_found', label: '2. DM Found (LinkedIn)', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'linkedin_sent', label: '3. Connection Sent', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'in_conversation', label: '4. In Conversation', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'sample_sent', label: '5. Sample / Pitch Sent', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { id: 'call_scheduled', label: '6. Demo / Call Booked', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    { id: 'closed_won', label: '7. Closed Won 🎉', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'lost', label: 'Archived / Lost', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
];

export const INDUSTRIES = [
    'Data Infrastructure & Annotation Platforms',
    'AI & Machine Learning',
    'Healthcare & BioTech AI',
    'LegalTech & Compliance AI',
    'Autonomous Vehicles & Robotics',
    'FinTech & Banking AI',
    'E-Commerce & Retail',
    'Voice & Multimodal AI',
    'Cybersecurity & OSINT',
    'Other'
];

export const DATA_NEEDS_OPTIONS = [
    'Domain-Expert Annotation Pods',
    'Subcontracted Labeling Workforce',
    'Clinical EHR & Medical Imaging QA',
    'Legal Contract Redline Annotation',
    'LLM Fine-Tuning & Reasoning Datasets',
    'Computer Vision & Video Tracking',
    'Voice & Multilingual Audio Labeling',
    'Ground-Truth Golden Evaluation Sets'
];

const LOCAL_STORAGE_KEY = 'onionlabel_company_leads';

function getLocalLeads(): CompanyLead[] {
    if (typeof window === 'undefined') return SAMPLE_SEED_LEADS as CompanyLead[];
    try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return SAMPLE_SEED_LEADS.map((l, i) => ({ ...l, id: `local-${i + 1}` }));
}

function setLocalLeads(leads: CompanyLead[]) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {}
}

// Subscribe to Leads in real-time with local fallback
export function subscribeToLeads(callback: (leads: CompanyLead[]) => void) {
    try {
        const q = query(collection(db, 'company_leads'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const leads = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                })) as CompanyLead[];
                setLocalLeads(leads);
                callback(leads);
            } else {
                const local = getLocalLeads();
                callback(local);
            }
        }, (error) => {
            console.warn("Firestore subscription fallback to local cache:", error.message);
            const local = getLocalLeads();
            callback(local);
        });
    } catch (err) {
        console.warn("Firestore initialization error, using local leads:", err);
        const local = getLocalLeads();
        callback(local);
        return () => {};
    }
}

// Create Lead
export async function createLead(lead: Omit<CompanyLead, 'id'>) {
    try {
        const docRef = await addDoc(collection(db, 'company_leads'), {
            ...lead,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.warn("Saving lead locally due to Firestore permission/offline state:", error);
        const current = getLocalLeads();
        const newId = `lead-${Date.now()}`;
        const newLead = { ...lead, id: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        setLocalLeads([newLead as CompanyLead, ...current]);
        return newId;
    }
}

// Update Lead
export async function updateLead(id: string, updates: Partial<CompanyLead>) {
    try {
        const docRef = doc(db, 'company_leads', id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.warn("Updating lead locally:", error);
        const current = getLocalLeads();
        const updated = current.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l);
        setLocalLeads(updated);
    }
}

// Delete Lead
export async function deleteLead(id: string) {
    try {
        await deleteDoc(doc(db, 'company_leads', id));
    } catch (error) {
        console.warn("Deleting lead locally:", error);
        const current = getLocalLeads();
        setLocalLeads(current.filter(l => l.id !== id));
    }
}

// Add Note to Lead
export async function addLeadNote(leadId: string, currentNotes: ActivityNote[] = [], newNote: Omit<ActivityNote, 'id' | 'createdAt'>) {
    const noteWithMeta: ActivityNote = {
        id: Math.random().toString(36).substring(2, 9),
        ...newNote,
        createdAt: new Date().toISOString()
    };
    try {
        const docRef = doc(db, 'company_leads', leadId);
        await updateDoc(docRef, {
            notes: [noteWithMeta, ...(currentNotes || [])],
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.warn("Adding note locally:", error);
        const current = getLocalLeads();
        const updated = current.map(l => {
            if (l.id === leadId) {
                return { ...l, notes: [noteWithMeta, ...(l.notes || [])] };
            }
            return l;
        });
        setLocalLeads(updated);
    }
    return noteWithMeta;
}

// Real funded AI Companies actively outsourcing data annotation & RLHF
export const SAMPLE_SEED_LEADS: Omit<CompanyLead, 'id'>[] = [
    {
        "companyName": "Snorkel AI",
        "website": "https://snorkel.ai",
        "industry": "Data Infrastructure & Annotation Platforms",
        "companySize": "201-500 employees",
        "dataSourcingNeeds": [
            "Domain-Expert Annotation Pods",
            "Ground-Truth Golden Evaluation Sets",
            "LLM Fine-Tuning & Reasoning Datasets"
        ],
        "estimatedValue": 28000,
        "priority": "urgent",
        "stage": "sourced",
        "fundingRound": "$135M Series C (Lightspeed, Greylock)",
        "annualDataBudget": "$450k – $1.2M / yr",
        "competitorVendors": [
            "Scale AI",
            "Appen",
            "Surge AI"
        ],
        "expertWorkforceNeeded": "STEM Graduates, Medical Doctors (MDs) & Legal Experts",
        "whyTheyBuy": "Snorkel provides programmatic labeling software, but enterprise clients continuously demand verified human domain experts to build golden benchmark ground-truth datasets for validation. They partner with external workforce pods to fulfill customer contracts.",
        "recommendedOutreachHook": "Hi Alex, love how Snorkel is pioneering programmatic labeling. When enterprise clients need verified human domain experts (MDs, lawyers, STEM grads) to build ground-truth golden datasets, OnionLabel provides dedicated managed African expert pods at $18/hr—saving 50% vs US brokers. Open to a 100-sample benchmark comparison?",
        "contactName": "Alex Ratner",
        "contactRole": "Co-Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/alex-ratner",
        "contactEmail": "alex@snorkel.ai",
        "assignedVa": "Alex (Operations)",
        "nextFollowUpDate": "2026-08-22",
        "linkedinStatus": "not_contacted",
        "notes": [
            {
                "id": "snork-1",
                "text": "Prime data infrastructure partner. Subcontracts domain-expert annotation for enterprise banking and healthcare clients.",
                "authorName": "Market Intelligence",
                "createdAt": "2026-08-21T06:00:00.000Z",
                "type": "note"
            }
        ]
    },
    {
        "companyName": "Labelbox",
        "website": "https://labelbox.com",
        "industry": "Data Infrastructure & Annotation Platforms",
        "companySize": "201-500 employees",
        "dataSourcingNeeds": [
            "Subcontracted Labeling Workforce",
            "Clinical EHR & Medical Imaging QA",
            "Ground-Truth Golden Evaluation Sets"
        ],
        "estimatedValue": 32000,
        "priority": "urgent",
        "stage": "sourced",
        "fundingRound": "$189M Series D (SoftBank, a16z, Kleiner Perkins)",
        "annualDataBudget": "$600k – $1.5M / yr",
        "competitorVendors": [
            "Mercor",
            "Scale AI",
            "CloudFactory"
        ],
        "expertWorkforceNeeded": "Multimodal Annotators, Clinical Doctors & CS Evaluators",
        "whyTheyBuy": "Labelbox is primarily a data platform and frequently partners with managed workforce services to deliver end-to-end annotation services to Fortune 500 AI teams.",
        "recommendedOutreachHook": "Hi Manu, big admirer of Labelbox's data curation ecosystem. We operate dedicated pods of English-fluent domain experts (MDs, CS engineers, legal researchers) across Africa that integrate seamlessly into Labelbox for high-throughput enterprise customer labeling at 50% lower unit cost.",
        "contactName": "Manu Sharma",
        "contactRole": "Co-Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/manusharma",
        "contactEmail": "manu@labelbox.com",
        "assignedVa": "Alex (Operations)",
        "nextFollowUpDate": "2026-08-22",
        "linkedinStatus": "not_contacted",
        "notes": [
            {
                "id": "lb-1",
                "text": "Major workforce partnership opportunity. Labelbox customers actively seek managed labeling capacity.",
                "authorName": "Market Intelligence",
                "createdAt": "2026-08-21T06:00:00.000Z",
                "type": "note"
            }
        ]
    },
    {
        "companyName": "V7 Labs (V7 Go)",
        "website": "https://v7labs.com",
        "industry": "Data Infrastructure & Annotation Platforms",
        "companySize": "51-100 employees",
        "dataSourcingNeeds": [
            "Clinical EHR & Medical Imaging QA",
            "Legal Contract Redline Annotation",
            "Computer Vision & Video Tracking"
        ],
        "estimatedValue": 20000,
        "priority": "urgent",
        "stage": "sourced",
        "fundingRound": "$33M Series A (Radical Ventures, Temasek)",
        "annualDataBudget": "$250k – $600k / yr",
        "competitorVendors": [
            "Scale AI",
            "Encord",
            "Sama"
        ],
        "expertWorkforceNeeded": "Medical Doctors (Radiology/Pathology), Document Analysts",
        "whyTheyBuy": "V7 Go automates document and visual AI workflows, but requires high-skill human verification for complex healthcare records and financial filings.",
        "recommendedOutreachHook": "Hi Alberto, noticed V7 Go's expansion into GenAI document workflows and biomedical vision. We provide turnkey pods of licensed MDs and Common Law legal graduates to verify complex edge-cases and train multimodal models at $18-$22/hr.",
        "contactName": "Alberto Rizzoli",
        "contactRole": "Co-Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/albertorizzoli",
        "contactEmail": "alberto@v7labs.com",
        "assignedVa": "Alex (Operations)",
        "nextFollowUpDate": "2026-08-22",
        "linkedinStatus": "not_contacted"
    },
    {
        "companyName": "Encord",
        "website": "https://encord.com",
        "industry": "Data Infrastructure & Annotation Platforms",
        "companySize": "51-100 employees",
        "dataSourcingNeeds": [
            "Computer Vision & Video Tracking",
            "Clinical EHR & Medical Imaging QA",
            "Ground-Truth Golden Evaluation Sets"
        ],
        "estimatedValue": 22000,
        "priority": "urgent",
        "stage": "sourced",
        "fundingRound": "$50M Series B (Next47, Y Combinator, Crane)",
        "annualDataBudget": "$300k – $800k / yr",
        "competitorVendors": [
            "Scale AI",
            "V7 Labs",
            "Superb AI"
        ],
        "expertWorkforceNeeded": "Surgical Video Annotators, Radiologists & Biomedical Engineers",
        "whyTheyBuy": "Encord powers multimodal and biomedical AI. Their customers require certified medical practitioners to annotate surgical feeds, DICOM images, and spatial video datasets.",
        "recommendedOutreachHook": "Hi Ulrik, following Encord's rapid growth in multimodal and biomedical data. We can supply Encord enterprise customers with dedicated medical doctor pods for surgical and DICOM labeling at 50% below US broker pricing with 24-48h turnaround.",
        "contactName": "Ulrik Stig Hansen",
        "contactRole": "Co-Founder & President",
        "linkedinUrl": "https://www.linkedin.com/in/ulrikstighansen",
        "contactEmail": "ulrik@encord.com",
        "assignedVa": "Alex (Operations)",
        "nextFollowUpDate": "2026-08-22",
        "linkedinStatus": "not_contacted"
    },
    {
        "companyName": "Cleanlab",
        "website": "https://cleanlab.ai",
        "industry": "Data Infrastructure & Annotation Platforms",
        "companySize": "11-50 employees",
        "dataSourcingNeeds": [
            "LLM Fine-Tuning & Reasoning Datasets",
            "Ground-Truth Golden Evaluation Sets",
            "Domain-Expert Annotation Pods"
        ],
        "estimatedValue": 16000,
        "priority": "high",
        "stage": "sourced",
        "fundingRound": "$30M Series A (Menlo Ventures, Bain Capital)",
        "annualDataBudget": "$180k – $450k / yr",
        "competitorVendors": [
            "Scale AI",
            "Surge AI"
        ],
        "expertWorkforceNeeded": "Data Quality Auditors, CS Graduates & Subject Matter Specialists",
        "whyTheyBuy": "Cleanlab automatically flags label errors and hallucinations in AI datasets, but enterprise customers need human experts to audit and correct the flagged issues.",
        "recommendedOutreachHook": "Hi Curtis, huge fan of Cleanlab's data-centric AI approach. Once Cleanlab identifies corrupted or hallucinated dataset rows, our managed network of African STEM and legal experts can rapidly audit and correct the data at high throughput.",
        "contactName": "Curtis Northcutt",
        "contactRole": "Co-Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/curtis-northcutt",
        "contactEmail": "curtis@cleanlab.ai",
        "assignedVa": "Alex (Operations)",
        "nextFollowUpDate": "2026-08-22",
        "linkedinStatus": "not_contacted"
    },
    {
        "companyName": "Kili Technology",
        "website": "https://kili-technology.com",
        "industry": "Data Infrastructure & Annotation Platforms",
        "companySize": "51-100 employees",
        "dataSourcingNeeds": [
            "Subcontracted Labeling Workforce",
            "Legal Contract Redline Annotation",
            "LLM Fine-Tuning & Reasoning Datasets"
        ],
        "estimatedValue": 18000,
        "priority": "high",
        "stage": "sourced",
        "fundingRound": "$30M Series A (Balderton Capital)",
        "annualDataBudget": "$200k – $500k / yr",
        "competitorVendors": [
            "Appen",
            "Scale AI",
            "Labelbox"
        ],
        "expertWorkforceNeeded": "Common Law Attorneys, Financial Analysts, French/English Bilinguals",
        "whyTheyBuy": "Kili serves major European and US enterprises in banking, defense, and legal tech, requiring strict confidentiality and specialized domain expertise.",
        "recommendedOutreachHook": "Hi François-Xavier, impressed by Kili's enterprise LLM evaluation platform. We partner with annotation platforms to provide vetted African legal scholars, doctors, and bilingual specialists for high-security labeling contracts.",
        "contactName": "François-Xavier Leduc",
        "contactRole": "Co-Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/francoisxavierleduc",
        "contactEmail": "fx@kili-technology.com",
        "assignedVa": "Alex (Operations)",
        "nextFollowUpDate": "2026-08-22",
        "linkedinStatus": "not_contacted"
    },
    {
        "companyName": "Datasaur.ai",
        "website": "https://datasaur.ai",
        "industry": "Data Infrastructure & Annotation Platforms",
        "companySize": "11-50 employees",
        "dataSourcingNeeds": [
            "Domain-Expert Annotation Pods",
            "LLM Fine-Tuning & Reasoning Datasets",
            "Voice & Multilingual Audio Labeling"
        ],
        "estimatedValue": 14000,
        "priority": "high",
        "stage": "sourced",
        "fundingRound": "$8M Series A (Initialized Capital, Y Combinator)",
        "annualDataBudget": "$150k – $350k / yr",
        "competitorVendors": [
            "Prodigy",
            "Scale AI",
            "Labelbox"
        ],
        "expertWorkforceNeeded": "NLP Linguists, Legal & Technical Evaluators",
        "whyTheyBuy": "Datasaur builds NLP data labeling tooling and often bundles managed workforce pods for enterprise clients scaling complex text workflows.",
        "recommendedOutreachHook": "Hi Ivan, love Datasaur's focus on NLP & LLM data infrastructure. If your customers need dedicated domain pods to accelerate labeling throughput, OnionLabel provides vetted African specialists at $16-$20/hr.",
        "contactName": "Ivan Lee",
        "contactRole": "Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/ivan-lee",
        "contactEmail": "ivan@datasaur.ai",
        "assignedVa": "Alex (Operations)",
        "nextFollowUpDate": "2026-08-22",
        "linkedinStatus": "not_contacted"
    },
    {
        "companyName": "Superb AI",
        "website": "https://superb-ai.com",
        "industry": "Data Infrastructure & Annotation Platforms",
        "companySize": "51-100 employees",
        "dataSourcingNeeds": [
            "Computer Vision & Video Tracking",
            "Subcontracted Labeling Workforce",
            "Ground-Truth Golden Evaluation Sets"
        ],
        "estimatedValue": 17000,
        "priority": "high",
        "stage": "sourced",
        "fundingRound": "$35M Series B (Korea Development Bank, Premier Partners)",
        "annualDataBudget": "$200k – $450k / yr",
        "competitorVendors": [
            "Scale AI",
            "Encord",
            "CloudFactory"
        ],
        "expertWorkforceNeeded": "3D Point Cloud Annotators, Computer Vision Specialists",
        "whyTheyBuy": "Provides automated computer vision data pipelines and needs human-in-the-loop workforce for QA verification and edge-case classification.",
        "recommendedOutreachHook": "Hi Hyunsoo, great work scaling Superb AI's vision data platform. We provide dedicated STEM workforce pods for 3D point cloud and video QA verification at 50% lower cost with 99.2% QA accuracy.",
        "contactName": "Hyunsoo Kim",
        "contactRole": "Co-Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/hyunsoo-kim",
        "contactEmail": "hyunsoo@superb-ai.com",
        "assignedVa": "Alex (Operations)",
        "nextFollowUpDate": "2026-08-22",
        "linkedinStatus": "not_contacted"
    },
    {
        "companyName": "Dataloop AI",
        "website": "https://dataloop.ai",
        "industry": "Data Infrastructure & Annotation Platforms",
        "companySize": "101-200 employees",
        "dataSourcingNeeds": [
            "Subcontracted Labeling Workforce",
            "Domain-Expert Annotation Pods",
            "Computer Vision & Video Tracking"
        ],
        "estimatedValue": 24000,
        "priority": "urgent",
        "stage": "sourced",
        "fundingRound": "$50M Series B (NGP Capital, Amiti)",
        "annualDataBudget": "$300k – $800k / yr",
        "competitorVendors": [
            "Scale AI",
            "Appen",
            "Sama"
        ],
        "expertWorkforceNeeded": "Full-Stack Annotation Teams, Domain Evaluators",
        "whyTheyBuy": "Dataloop operates an enterprise marketplace connecting AI builders with workforce providers to label petabyte-scale unstructured data.",
        "recommendedOutreachHook": "Hi Eran, impressed by Dataloop's enterprise data engine and marketplace. We would love to explore listing OnionLabel as a specialized domain-expert workforce partner for your medical and legal AI enterprise customers.",
        "contactName": "Eran Shlomo",
        "contactRole": "Co-Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/eranshlomo",
        "contactEmail": "eran@dataloop.ai",
        "assignedVa": "Alex (Operations)",
        "nextFollowUpDate": "2026-08-22",
        "linkedinStatus": "not_contacted"
    },
    {
        "companyName": "Rime Labs",
        "website": "https://rime.ai",
        "industry": "Data Infrastructure & Annotation Platforms",
        "companySize": "11-50 employees",
        "dataSourcingNeeds": [
            "Voice & Multilingual Audio Labeling",
            "LLM Fine-Tuning & Reasoning Datasets",
            "Ground-Truth Golden Evaluation Sets"
        ],
        "estimatedValue": 15000,
        "priority": "high",
        "stage": "sourced",
        "fundingRound": "$20M Series A (Theory Ventures)",
        "annualDataBudget": "$150k – $400k / yr",
        "competitorVendors": [
            "Scale AI",
            "ElevenLabs",
            "Appen"
        ],
        "expertWorkforceNeeded": "Phonetic Linguists, Native African Dialect Speakers",
        "whyTheyBuy": "Building next-gen expressive speech synthesis. Requires extensive native-speaker phoneme alignment, audio emotion rating, and multilingual African dialect datasets.",
        "recommendedOutreachHook": "Hi Gaurav, love Rime's breakthrough work in real-time neural speech synthesis. If you need native phoneme alignment and diverse African accent datasets to expand voice models, we provide turnkey linguistic pods on demand.",
        "contactName": "Gaurav Bharaj",
        "contactRole": "Co-Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/gauravbharaj",
        "contactEmail": "gaurav@rime.ai",
        "assignedVa": "Alex (Operations)",
        "nextFollowUpDate": "2026-08-22",
        "linkedinStatus": "not_contacted"
    },
    {
        "companyName": "Ambience Healthcare",
        "website": "https://ambiencehealthcare.com",
        "industry": "Healthcare & BioTech AI",
        "companySize": "101-200 employees",
        "dataSourcingNeeds": [
                "Clinical Dialogue RLHF",
                "MD-Level Medical Reasoning",
                "EHR Document Annotation"
        ],
        "estimatedValue": 24000,
        "priority": "urgent",
        "stage": "sourced",
        "fundingRound": "$243M Series C (a16z, OpenAI Fund)",
        "annualDataBudget": "$400k – $1.2M / yr",
        "competitorVendors": [
                "Mercor",
                "Scale AI",
                "Surge AI"
        ],
        "expertWorkforceNeeded": "Medical Doctors (MDs), Pharmacists & Clinical Linguists",
        "whyTheyBuy": "Builds AI operating system for clinical hospital workflows. Generalist annotators hallucinate medical dosages. They pay premium rates for verified doctors to grade complex patient-physician dialogue and ICD-10 coding notes.",
        "recommendedOutreachHook": "Hi Nikhil, noticed Ambience is scaling hospital ambient scribing rapidly. We deploy dedicated managed pods of English-fluent MDs and medical graduates from our African expert network for clinical reasoning RLHF at 50% lower cost than Mercor/Scale ($22/hr vs $65/hr). Would you like to run a free 100-chart benchmark audit?",
        "contactName": "Nikhil Buduma",
        "contactRole": "Chief Technology Officer & Co-Founder",
        "linkedinUrl": "https://www.linkedin.com/in/nikhilbuduma",
        "contactEmail": "nikhil@ambiencehealthcare.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-1",
                        "text": "Raised $243M Series C. Prime buyer of Mercor/Scale AI medical pods. Perfect fit for our African medical doctor RLHF pod.",
                        "authorName": "Market Intelligence",
                        "createdAt": "2026-08-19T09:38:11.516Z",
                        "type": "note"
                }
        ]
},
    {
        "companyName": "Hippocratic AI",
        "website": "https://hippocraticai.com",
        "industry": "Healthcare & Safety AI",
        "companySize": "51-100 employees",
        "dataSourcingNeeds": [
                "Bedside Manner RLHF",
                "Clinical Safety Red-Teaming",
                "Medical Q&A Preference Ranking"
        ],
        "estimatedValue": 22000,
        "priority": "urgent",
        "stage": "sourced",
        "fundingRound": "$126M Series C (General Catalyst, a16z)",
        "annualDataBudget": "$350k – $900k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Surge AI"
        ],
        "expertWorkforceNeeded": "Clinical Nurses, Medical Doctors & Healthcare Ethics Specialists",
        "whyTheyBuy": "Building safety-first patient-facing generative voice agents. Requires thousands of human evaluation hours from licensed healthcare professionals to rank empathy, bedside manner, and clinical safety compliance.",
        "recommendedOutreachHook": "Hi Munjal, love Hippocratic AI's focus on safety-first clinical LLMs. Rather than paying $70/hr on Micro1/Surge for clinical raters, our managed African network provides top 1% licensed clinicians & doctors for patient bedside manner RLHF at $20/hr with 99.4% adherence. Open to testing a 100-sample pilot with us?",
        "contactName": "Munjal Shah",
        "contactRole": "Co-Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/munjalshah",
        "contactEmail": "munjal@hippocraticai.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-2",
                        "text": "Raised $126M. Heavy spenders on human-in-the-loop medical safety evaluation.",
                        "authorName": "Market Intelligence",
                        "createdAt": "2026-08-19T09:38:11.516Z",
                        "type": "note"
                }
        ]
},
    {
        "companyName": "Wordsmith AI",
        "website": "https://wordsmith.ai",
        "industry": "LegalTech & Enterprise AI",
        "companySize": "21-50 employees",
        "dataSourcingNeeds": [
                "Contract Redline Evaluation",
                "Legal Clause Taxonomy Markup",
                "Risk Scoring DPO"
        ],
        "estimatedValue": 16000,
        "priority": "high",
        "stage": "sourced",
        "fundingRound": "$70M Series B (Index Ventures)",
        "annualDataBudget": "$200k – $600k / yr",
        "competitorVendors": [
                "Mercor",
                "Surge AI",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "Common Law Lawyers (LLB / LLM) & Senior Paralegals",
        "whyTheyBuy": "Builds autonomous legal AI agents for in-house legal departments. Needs certified common law lawyers to annotate contract redlines, indemnification clauses, and evaluate multi-turn legal negotiations.",
        "recommendedOutreachHook": "Hi Ross, exciting $70M round for Wordsmith. Scaling legal agents requires immense lawyer-in-the-loop validation. We provide dedicated pods of Common Law trained legal graduates (LLB/LLM) from our African expert network at $22/hr—delivering 50%+ savings over Mercor and Scale AI. Can we benchmark a 50-contract redline batch for free?",
        "contactName": "Ross McNairn",
        "contactRole": "Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/rossmcnairn",
        "contactEmail": "ross@wordsmith.ai",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-3",
                        "text": "Series B legal AI agent startup. High ROI target for our African Common Law lawyer pod.",
                        "authorName": "Market Intelligence",
                        "createdAt": "2026-08-19T09:38:11.516Z",
                        "type": "note"
                }
        ]
},
    {
        "companyName": "Neura Robotics",
        "website": "https://neura-robotics.com",
        "industry": "Humanoid Robotics & Physical AI",
        "companySize": "201-500 employees",
        "dataSourcingNeeds": [
                "3D Spatial Point Cloud Annotation",
                "LiDAR Polygon Segmentation",
                "Human-Robot Interaction Video Labeling"
        ],
        "estimatedValue": 35000,
        "priority": "urgent",
        "stage": "sourced",
        "fundingRound": "$1.4B Series C (Leading Global VCs)",
        "annualDataBudget": "$750k – $2.5M / yr",
        "competitorVendors": [
                "Scale AI",
                "Labelbox",
                "iMerit"
        ],
        "expertWorkforceNeeded": "Computer Vision & Spatial Perception Annotators (BSc Computer Science / Engineering)",
        "whyTheyBuy": "Scaling cognitive industrial humanoid robots (4NE-1). They ingest millions of frames of factory and warehouse camera streams that require high-precision 3D polygon bounding boxes and kinematic action segmentation.",
        "recommendedOutreachHook": "Hi David, congratulations on the historic $1.4B Series C for Neura Robotics. As you scale 3D perception for 4NE-1, our dedicated computer vision labeling pods across Africa deliver pixel-perfect 3D point cloud & kinematic video segmentation at 55% lower cost than Scale AI/iMerit with 24h SLA. Open to running a 1,000-frame benchmark test?",
        "contactName": "David Reger",
        "contactRole": "Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/david-reger-neura",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-4",
                        "text": "$1.4B humanoid robotics unicorn. Massive data annotation volume required for spatial vision models.",
                        "authorName": "Market Intelligence",
                        "createdAt": "2026-08-19T09:38:11.516Z",
                        "type": "note"
                }
        ]
},
    {
        "companyName": "HappyRobot",
        "website": "https://happyrobot.ai",
        "industry": "Logistics & Voice AI Agents",
        "companySize": "51-100 employees",
        "dataSourcingNeeds": [
                "Freight Dispatch Voice Transcription",
                "Multi-Accent Intent Classification",
                "Audio Sentiment Tagging"
        ],
        "estimatedValue": 18000,
        "priority": "high",
        "stage": "sourced",
        "fundingRound": "$150M Series C (August 2026)",
        "annualDataBudget": "$250k – $750k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Deepgram"
        ],
        "expertWorkforceNeeded": "Bilingual English Audio Transcribers & Dialogue Intent Annotators",
        "whyTheyBuy": "Operates autonomous voice agents automating freight broker phone calls. Requires 100,000+ hours of human-transcribed, multi-accent noisy phone audio to fine-tune speech-to-intent models.",
        "recommendedOutreachHook": "Hi Pablo, congrats on the $150M Series C for HappyRobot. High-noise freight call audio is notoriously hard for standard ASR. We operate dedicated 24/7 audio annotation pods in West & East Africa delivering human-verified phonetic transcriptions & intent tagging at $15/hr. Can we test a free 5-hour batch of your toughest audio files?",
        "contactName": "Pablo Moncada",
        "contactRole": "Co-Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/pablo-moncada",
        "contactEmail": "pablo@happyrobot.ai",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-5",
                        "text": "Series C voice AI leader. Continuous pipeline need for audio dialogue and freight dispatcher intent labeling.",
                        "authorName": "Market Intelligence",
                        "createdAt": "2026-08-19T09:38:11.516Z",
                        "type": "note"
                }
        ]
},
    {
        "companyName": "Paper AI",
        "website": "https://paper.design",
        "industry": "AI Code & Design Engineering",
        "companySize": "11-50 employees",
        "dataSourcingNeeds": [
                "UI Component Code Evaluation",
                "Agentic Step-by-Step Trajectory Review",
                "React/Tailwind DPO"
        ],
        "estimatedValue": 12000,
        "priority": "medium",
        "stage": "sourced",
        "fundingRound": "$34M Series A (Accel & ICONIQ)",
        "annualDataBudget": "$150k – $450k / yr",
        "competitorVendors": [
                "Mercor",
                "Turing",
                "Micro1"
        ],
        "expertWorkforceNeeded": "Senior Frontend Engineers (React, TypeScript, Tailwind CSS, Next.js)",
        "whyTheyBuy": "Builds AI design-to-code agents. To train their coding model, they hire top-tier software engineers to inspect generated component code, fix hallucinations, and rank layout outputs.",
        "recommendedOutreachHook": "Hi Marius, loved seeing Paper's $34M Series A announcement. Training design-to-code agents requires high-level human developer evaluations. We deploy vetted senior React/TypeScript engineers from our African tech network at $25/hr for code quality DPO and prompt pair curation. Would love to send a 20-component trial dataset for your review.",
        "contactName": "Marius Schulz",
        "contactRole": "Head of Engineering",
        "linkedinUrl": "https://www.linkedin.com/in/marius-schulz",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-6",
                        "text": "Accel-backed AI coding startup. Direct customer match for Mercor/Micro1 engineer evaluation pods.",
                        "authorName": "Market Intelligence",
                        "createdAt": "2026-08-19T09:38:11.516Z",
                        "type": "note"
                }
        ]
},
    {
        "companyName": "Tennr",
        "website": "https://tennr.com",
        "industry": "Document AI & Workflow Automation",
        "companySize": "51-100 employees",
        "dataSourcingNeeds": [
                "Messy Fax & PDF OCR Parsing",
                "Human-in-the-Loop Document Extraction",
                "Complex Table Annotation"
        ],
        "estimatedValue": 15000,
        "priority": "high",
        "stage": "sourced",
        "fundingRound": "$101M Series C (Lightspeed)",
        "annualDataBudget": "$300k – $800k / yr",
        "competitorVendors": [
                "Scale AI",
                "Surge AI",
                "Mercor"
        ],
        "expertWorkforceNeeded": "Human-in-the-Loop Document Verification Specialists",
        "whyTheyBuy": "Automates back-office healthcare fax and referral intake. Because medical faxes are handwriting-heavy and distorted, they rely on 24/7 human-in-the-loop review teams to maintain 99.9% accuracy.",
        "recommendedOutreachHook": "Hi Trey, congratulations on Tennr's $101M Series C. Processing distorted medical faxes with zero error requires continuous human validation. We provide 24/7 dedicated document verification pods at $14/hr with a sub-60s latency SLA. Would you be open to benchmarking our accuracy on a sample batch of 100 messy faxes?",
        "contactName": "Trey Holterman",
        "contactRole": "Co-Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/trey-holterman",
        "contactEmail": "trey@tennr.com",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-7",
                        "text": "Lightspeed-backed document AI startup. Continuous 24/7 human-in-the-loop pipeline volume.",
                        "authorName": "Market Intelligence",
                        "createdAt": "2026-08-19T09:38:11.516Z",
                        "type": "note"
                }
        ]
},
    {
        "companyName": "Lawhive",
        "website": "https://lawhive.co.uk",
        "industry": "LegalTech AI",
        "companySize": "51-100 employees",
        "dataSourcingNeeds": [
                "Statutory Case Law Indexing",
                "Consumer Legal Q&A Annotation",
                "Judicial Decision Classification"
        ],
        "estimatedValue": 11000,
        "priority": "medium",
        "stage": "sourced",
        "fundingRound": "$60M Series B (Google Ventures / GV)",
        "annualDataBudget": "$150k – $400k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1"
        ],
        "expertWorkforceNeeded": "UK Common Law Trained Law Graduates & Legal Researchers",
        "whyTheyBuy": "AI consumer law platform handling UK legal matters. Needs verified law graduates to annotate tribunal transcripts, categorize client legal intents, and evaluate advice quality against UK statutory regulations.",
        "recommendedOutreachHook": "Hi Pierre, great work on Lawhive's $60M Series B. Ensuring high-accuracy legal advice requires extensive Common Law review. We deploy dedicated pods of UK Common Law trained law graduates across our African expert network at £16/hr for legal intent labeling & case indexing. Can we run a free 50-case benchmark evaluation for your ML team?",
        "contactName": "Pierre Proner",
        "contactRole": "Co-Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/pierreproner",
        "contactEmail": "pierre@lawhive.co.uk",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-8",
                        "text": "GV-backed UK legal AI startup. Perfect match for English-trained African Common Law lawyers.",
                        "authorName": "Market Intelligence",
                        "createdAt": "2026-08-19T09:38:11.516Z",
                        "type": "note"
                }
        ]
},
    {
        "companyName": "Overjet",
        "website": "https://overjet.com",
        "industry": "Dental & Medical Imaging AI",
        "companySize": "101-200 employees",
        "dataSourcingNeeds": [
                "Dental X-Ray Segmentation",
                "Periodontal Bone Loss Polygon Markup",
                "Pathology Pixel Annotation"
        ],
        "estimatedValue": 14000,
        "priority": "high",
        "stage": "sourced",
        "fundingRound": "$53M Series C (March Capital)",
        "annualDataBudget": "$200k – $500k / yr",
        "competitorVendors": [
                "iMerit",
                "Scale AI",
                "CloudFactory"
        ],
        "expertWorkforceNeeded": "Dental Surgeons (BDS/DDS) & Medical Imaging Radiography Annotators",
        "whyTheyBuy": "FDA-cleared dental AI platform used by top dental insurance and clinical networks. High demand for dental doctors (BDS) to trace tooth contours, dental caries, and bone levels down to the exact sub-millimeter pixel.",
        "recommendedOutreachHook": "Hi Wardah, huge fan of Overjet's FDA-cleared dental diagnostic AI. Segmenting bone loss and restorations requires trained dental clinicians. We provide dedicated pods of English-speaking Dental Surgeons (BDS) and radiographers from our African medical network at $22/hr. Would you like us to annotate a free 50-X-ray test batch?",
        "contactName": "Wardah Inam",
        "contactRole": "Founder & CEO",
        "linkedinUrl": "https://www.linkedin.com/in/wardah-inam",
        "contactEmail": "wardah@overjet.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-9",
                        "text": "Top dental AI startup. Employs certified dentists to annotate imaging data.",
                        "authorName": "Market Intelligence",
                        "createdAt": "2026-08-19T09:38:11.516Z",
                        "type": "note"
                }
        ]
},
    {
        "companyName": "Robin AI",
        "website": "https://robinai.com",
        "industry": "Legal LLM & Enterprise AI",
        "companySize": "101-200 employees",
        "dataSourcingNeeds": [
                "Anthropic Claude Legal Fine-Tuning",
                "Multi-Jurisdiction MSA Annotation",
                "Clause Risk Scoring"
        ],
        "estimatedValue": 20000,
        "priority": "urgent",
        "stage": "sourced",
        "fundingRound": "Series B (Temasek, Anthropic Partner)",
        "annualDataBudget": "$300k – $800k / yr",
        "competitorVendors": [
                "Mercor",
                "Scale AI",
                "Surge AI"
        ],
        "expertWorkforceNeeded": "Commercial Law Lawyers & Contract Specialists",
        "whyTheyBuy": "Partners directly with Anthropic to train Claude for legal contracts. Requires continuous high-volume human legal review to structure MSAs, NDAs, and SaaS procurement agreements for Fortune 500 legal teams.",
        "recommendedOutreachHook": "Hi Richard, loved seeing Robin AI's partnership with Anthropic Claude. Training contract AI models at scale requires reliable legal pods. We provide dedicated Common Law contract specialists from our African legal network at 50% lower cost than Mercor/Scale AI with sub-24h turnaround. Can we do a 100-contract benchmark test for your research team?",
        "contactName": "Richard Robinson",
        "contactRole": "CEO & Co-Founder",
        "linkedinUrl": "https://www.linkedin.com/in/richardrobinson-robin",
        "contactEmail": "richard@robinai.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-10",
                        "text": "Anthropic Claude ecosystem legal partner. Heavy enterprise contract annotation volume.",
                        "authorName": "Market Intelligence",
                        "createdAt": "2026-08-19T09:38:11.516Z",
                        "type": "note"
                }
        ]
},
    {
        "companyName": "Plata Card",
        "website": "https://platacard.mx",
        "industry": "Financial Services",
        "companySize": "157 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "urgent",
        "stage": "sourced",
        "contactName": "Mario Suarez",
        "contactRole": "Fiscal",
        "linkedinUrl": "https://www.linkedin.com/in/mario-suarez-846325b6",
        "contactEmail": "mario.suarez@platacard.mx",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-0",
                        "text": "Extracted via Apify / Apollo. Location: Mexico City, Mexico. Org Revenue: < 500k.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Mario, noticed Plata Card is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Plata Card",
        "website": "https://platacard.mx",
        "industry": "Financial Services",
        "companySize": "157 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Miguel Briones",
        "contactRole": "Brand Ambassador",
        "linkedinUrl": "https://www.linkedin.com/in/mobriones",
        "contactEmail": "miguel.briones@platacard.mx",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-20",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-1",
                        "text": "Extracted via Apify / Apollo. Location: Ciudad Obregón, Mexico. Org Revenue: < 500k.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Miguel, noticed Plata Card is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Jamison Private Wealth Management",
        "website": "https://jamisonwealth.com",
        "industry": "Financial Services,Financial Services",
        "companySize": "6 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Jack Miller",
        "contactRole": "Wealth Advisor",
        "linkedinUrl": "https://www.linkedin.com/in/jack-miller-2023",
        "contactEmail": "jackmiller@jamisonwealth.com, jack@jamisonwealth.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-21",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-2",
                        "text": "Extracted via Apify / Apollo. Location: Alpharetta, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Jack, noticed Jamison Private Wealth Management is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Tempero Bio",
        "website": "https://temperobio.com",
        "industry": "Pharmaceutical Manufacturing",
        "companySize": "3 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "high",
        "stage": "sourced",
        "contactName": "Paul Johnson",
        "contactRole": "Chief Executive Officer",
        "linkedinUrl": "https://www.linkedin.com/in/paul-johnson-60883b3",
        "contactEmail": "paul@temperobio.com",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-3",
                        "text": "Extracted via Apify / Apollo. Location: Moorestown, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Paul, noticed Tempero Bio is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Prairie Sky Financial Group",
        "website": "https://prairieskyfg.com",
        "industry": "Financial Services,Financial Services",
        "companySize": "5 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "urgent",
        "stage": "sourced",
        "contactName": "Mark Lucaccioni",
        "contactRole": "Principal",
        "linkedinUrl": "https://www.linkedin.com/in/mark-lucaccioni-cfp%C2%AE-07731914",
        "contactEmail": "marklucaccioni@prairieskyfg.com, mark@prairieskyfg.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-20",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-4",
                        "text": "Extracted via Apify / Apollo. Location: Westchester, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Mark, noticed Prairie Sky Financial Group is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Fort Bend County EDC",
        "website": "https://fortbendcounty.com",
        "industry": "International Trade and Development",
        "companySize": "10 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Lauren Fuller",
        "contactRole": "Research & Policy Coordinator",
        "linkedinUrl": "https://www.linkedin.com/in/lauren-fuller-mpp-0a0832216",
        "contactEmail": "",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-21",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-5",
                        "text": "Extracted via Apify / Apollo. Location: Houston, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Lauren, noticed Fort Bend County EDC is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Columbia Discount",
        "website": "https://columbia.com",
        "industry": "Appliances, Electrical, and Electronics Manufacturing,Software",
        "companySize": "7 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "high",
        "stage": "sourced",
        "contactName": "Sean Reilly",
        "contactRole": "Radiological controls technician",
        "linkedinUrl": "https://www.linkedin.com/in/sean-reilly-9a6a29215",
        "contactEmail": "sreilly@columbia.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-6",
                        "text": "Extracted via Apify / Apollo. Location: , US. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Sean, noticed Columbia Discount is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Plata Card",
        "website": "https://platacard.mx",
        "industry": "Financial Services",
        "companySize": "157 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Rodolfo Garcia",
        "contactRole": "Nesting coach",
        "linkedinUrl": "https://www.linkedin.com/in/rodolfo-garcia-ba777224b",
        "contactEmail": "rodolfo.garcia@platacard.mx",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-20",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-7",
                        "text": "Extracted via Apify / Apollo. Location: Miguel Hidalgo, Mexico. Org Revenue: < 500k.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Rodolfo, noticed Plata Card is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Fort Bend County EDC",
        "website": "https://fortbendcounty.com",
        "industry": "International Trade and Development",
        "companySize": "10 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "urgent",
        "stage": "sourced",
        "contactName": "Rachelle Kanak",
        "contactRole": "Executive Vice President of Marketing & Operations",
        "linkedinUrl": "https://www.linkedin.com/in/rachelle-kanak-bb580564",
        "contactEmail": "",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-21",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-8",
                        "text": "Extracted via Apify / Apollo. Location: Houston, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Rachelle, noticed Fort Bend County EDC is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Columbia Discount",
        "website": "https://columbia.com",
        "industry": "Appliances, Electrical, and Electronics Manufacturing,Software",
        "companySize": "7 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "high",
        "stage": "sourced",
        "contactName": "Benjamin West",
        "contactRole": "Manager - Digital and Supply Chain Technology",
        "linkedinUrl": "https://www.linkedin.com/in/thebenwest",
        "contactEmail": "bwest@columbia.com",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-9",
                        "text": "Extracted via Apify / Apollo. Location: Gresham, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Benjamin, noticed Columbia Discount is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Columbia Discount",
        "website": "https://columbia.com",
        "industry": "Appliances, Electrical, and Electronics Manufacturing,Software",
        "companySize": "7 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Steve Loftin",
        "contactRole": "owner",
        "linkedinUrl": "https://www.linkedin.com/in/steve-loftin-93bab643",
        "contactEmail": "stevel@columbia.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-20",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-10",
                        "text": "Extracted via Apify / Apollo. Location: nashville, united states. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Steve, noticed Columbia Discount is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Prairie Sky Financial Group",
        "website": "https://prairieskyfg.com",
        "industry": "Financial Services,Financial Services",
        "companySize": "5 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Brennan Harrington",
        "contactRole": "Wealth Advisor",
        "linkedinUrl": "https://www.linkedin.com/in/brennanharrington",
        "contactEmail": "brennan@prairieskyfg.com",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-21",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-11",
                        "text": "Extracted via Apify / Apollo. Location: Lake Bluff, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Brennan, noticed Prairie Sky Financial Group is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Jamison Private Wealth Management",
        "website": "https://jamisonwealth.com",
        "industry": "Financial Services,Financial Services",
        "companySize": "6 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "urgent",
        "stage": "sourced",
        "contactName": "John Hansford",
        "contactRole": "Advisory Associate",
        "linkedinUrl": "https://www.linkedin.com/in/johnh0305",
        "contactEmail": "johnhansford@jamisonwealth.com, john@jamisonwealth.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-12",
                        "text": "Extracted via Apify / Apollo. Location: Atlanta Metropolitan Area, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi John, noticed Jamison Private Wealth Management is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Fort Bend County EDC",
        "website": "https://fortbendcounty.com",
        "industry": "International Trade and Development",
        "companySize": "10 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Patrick Cooper",
        "contactRole": "business attraction and research",
        "linkedinUrl": "https://www.linkedin.com/in/patrick-cooper-850216234",
        "contactEmail": "",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-20",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-13",
                        "text": "Extracted via Apify / Apollo. Location: houston, united states. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Patrick, noticed Fort Bend County EDC is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Prairie Sky Financial Group",
        "website": "https://prairieskyfg.com",
        "industry": "Financial Services,Financial Services",
        "companySize": "5 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Jennifer Sapp",
        "contactRole": "Operations Manager",
        "linkedinUrl": "https://www.linkedin.com/in/jennifer-sapp-a7a8983",
        "contactEmail": "jeasapp@aol.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-21",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-14",
                        "text": "Extracted via Apify / Apollo. Location: Westchester, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Jennifer, noticed Prairie Sky Financial Group is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Plata Card",
        "website": "https://platacard.mx",
        "industry": "Financial Services",
        "companySize": "157 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "high",
        "stage": "sourced",
        "contactName": "OMAR ARMENTA",
        "contactRole": "Embajador de marca",
        "linkedinUrl": "https://www.linkedin.com/in/omar-ambrosio-armenta-640a34133",
        "contactEmail": "omar.armenta@platacard.mx",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-15",
                        "text": "Extracted via Apify / Apollo. Location: Privada Villa Corregidora, Mexico. Org Revenue: < 500k.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi OMAR, noticed Plata Card is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Plata Card",
        "website": "https://platacard.mx",
        "industry": "Financial Services",
        "companySize": "157 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "urgent",
        "stage": "sourced",
        "contactName": "Mariana M.",
        "contactRole": "Social Media Supervisor",
        "linkedinUrl": "https://www.linkedin.com/in/mariana-m-1a2610170",
        "contactEmail": "",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-20",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-16",
                        "text": "Extracted via Apify / Apollo. Location: Mexico City, Mexico. Org Revenue: < 500k.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Mariana, noticed Plata Card is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Columbia Discount",
        "website": "https://columbia.com",
        "industry": "Appliances, Electrical, and Electronics Manufacturing,Software",
        "companySize": "7 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Jackie Swarts",
        "contactRole": "Senior Information Technology Program Manager",
        "linkedinUrl": "https://www.linkedin.com/in/jackieswarts",
        "contactEmail": "jswarts@columbia.com",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-21",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-17",
                        "text": "Extracted via Apify / Apollo. Location: Portland, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Jackie, noticed Columbia Discount is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Columbia Discount",
        "website": "https://columbia.com",
        "industry": "Appliances, Electrical, and Electronics Manufacturing,Software",
        "companySize": "7 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "high",
        "stage": "sourced",
        "contactName": "Bill Weide",
        "contactRole": "Senior Information Security Engineering Manager",
        "linkedinUrl": "https://www.linkedin.com/in/bill-weide-979b9b5b",
        "contactEmail": "bweide@columbia.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-18",
                        "text": "Extracted via Apify / Apollo. Location: , United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Bill, noticed Columbia Discount is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Fort Bend County EDC",
        "website": "https://fortbendcounty.com",
        "industry": "International Trade and Development",
        "companySize": "10 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Nicole Brennan",
        "contactRole": "Marketing and Communications Coordinator",
        "linkedinUrl": "https://www.linkedin.com/in/nicole-brennan-4a637a1b6",
        "contactEmail": "",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-20",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-19",
                        "text": "Extracted via Apify / Apollo. Location: Houston, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Nicole, noticed Fort Bend County EDC is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Triumph Car Wash Parts",
        "website": "https://triumphcwp.com",
        "industry": "Manufacturing",
        "companySize": "2 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "urgent",
        "stage": "sourced",
        "contactName": "Anne Strilec",
        "contactRole": "Administrative Extraordinaire",
        "linkedinUrl": "https://www.linkedin.com/in/astrilec",
        "contactEmail": "anne@triumphcwp.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-21",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-20",
                        "text": "Extracted via Apify / Apollo. Location: Oakville, Canada. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Anne, noticed Triumph Car Wash Parts is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "TIOGA COUNTY PARTNERSHIP FOR COMMUNITY HEALTH",
        "website": "https://tiogapartnership.org",
        "industry": "Other",
        "companySize": "1 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "high",
        "stage": "sourced",
        "contactName": "Sue Sticklin",
        "contactRole": "Executive Director",
        "linkedinUrl": "https://www.linkedin.com/in/sue-sticklin-7492074b",
        "contactEmail": "sue@tiogapartnership.org",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-21",
                        "text": "Extracted via Apify / Apollo. Location: Wellsboro, United States. Org Revenue: Not Available.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Sue, noticed TIOGA COUNTY PARTNERSHIP FOR COMMUNITY HEALTH is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Triumph Car Wash Parts",
        "website": "https://triumphcwp.com",
        "industry": "Manufacturing",
        "companySize": "2 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Vince MacNeil",
        "contactRole": "Chief Executive Officer",
        "linkedinUrl": "https://www.linkedin.com/in/vince-macneil-54833428",
        "contactEmail": "vince@triumphcwp.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-20",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-22",
                        "text": "Extracted via Apify / Apollo. Location: , Canada. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Vince, noticed Triumph Car Wash Parts is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Tempero Bio",
        "website": "https://temperobio.com",
        "industry": "Pharmaceutical Manufacturing",
        "companySize": "3 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "John Wagner",
        "contactRole": "Chief Medical Officer",
        "linkedinUrl": "https://www.linkedin.com/in/johnwagnermdphd",
        "contactEmail": "john@temperobio.com",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-21",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-23",
                        "text": "Extracted via Apify / Apollo. Location: Cambridge, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi John, noticed Tempero Bio is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Todd County Animal Clinic",
        "website": "https://toddcountyanimal.com",
        "industry": "Research Services,Scientific Research",
        "companySize": "1 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "urgent",
        "stage": "sourced",
        "contactName": "John Laster",
        "contactRole": "Business Owner",
        "linkedinUrl": "https://www.linkedin.com/in/john-laster-71970896",
        "contactEmail": "john@toddcountyanimal.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-24",
                        "text": "Extracted via Apify / Apollo. Location: Elkton, United States. Org Revenue: < 500k.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi John, noticed Todd County Animal Clinic is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "FORCE Automation INC",
        "website": "https://forceautomationusa.com",
        "industry": "Industrial Machinery Manufacturing,Architecture Firm\b Engineering Firm",
        "companySize": "2 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Klimentsi Manko",
        "contactRole": "Engineering Manager",
        "linkedinUrl": "https://www.linkedin.com/in/klimentsi-manko-72041545",
        "contactEmail": "klimentsi@forceautomationusa.com",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-20",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-25",
                        "text": "Extracted via Apify / Apollo. Location: Southington, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Klimentsi, noticed FORCE Automation INC is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Space Theory",
        "website": "https://spacetheory.com",
        "industry": "Design Services,Architecture Firm\b Engineering Firm",
        "companySize": "2 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Virginie Remy",
        "contactRole": "Creative Director",
        "linkedinUrl": "https://www.linkedin.com/in/virginie-remy-88aa1222",
        "contactEmail": "virginie.est@gmail.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-21",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-26",
                        "text": "Extracted via Apify / Apollo. Location: New York, United States. Org Revenue: < 500k.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Virginie, noticed Space Theory is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Kairos Pharma Ltd. (NYSE: KAPA)",
        "website": "https://kairospharma.com",
        "industry": "Biotechnology",
        "companySize": "2 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "high",
        "stage": "sourced",
        "contactName": "John Yu",
        "contactRole": "Chief Executive Officer",
        "linkedinUrl": "https://www.linkedin.com/in/john-yu-37630614a",
        "contactEmail": "john@kairospharma.com",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-19",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-27",
                        "text": "Extracted via Apify / Apollo. Location: Los Angeles, United States. Org Revenue: < 500k.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi John, noticed Kairos Pharma Ltd. (NYSE: KAPA) is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "Camber",
        "website": "https://cambercloud.com",
        "industry": "Software Development",
        "companySize": "2 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "urgent",
        "stage": "sourced",
        "contactName": "Lauren Davidowski",
        "contactRole": "Creative Ops & Strategy",
        "linkedinUrl": "https://www.linkedin.com/in/lauren-davidowski-5ab57a6",
        "contactEmail": "ldavidowski@gmail.com",
        "assignedVa": "Alex (VA)",
        "nextFollowUpDate": "2026-08-20",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-28",
                        "text": "Extracted via Apify / Apollo. Location: San Francisco Bay Area, United States. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Series A / Venture Backed",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Lauren, noticed Camber is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
},
    {
        "companyName": "FORCE Automation INC",
        "website": "https://forceautomationusa.com",
        "industry": "Industrial Equipment",
        "companySize": "2 employees",
        "dataSourcingNeeds": [
                "B2B Contact Data Enrichment",
                "Web Scraping & Extraction",
                "Human-in-the-Loop Annotation"
        ],
        "estimatedValue": 6500,
        "priority": "medium",
        "stage": "sourced",
        "contactName": "Lukasz Poplawski",
        "contactRole": "Company Owner",
        "linkedinUrl": "https://www.linkedin.com/in/lukasz-poplawski-703a25138",
        "contactEmail": "mlody06053@gmail.com",
        "assignedVa": "Maria (VA)",
        "nextFollowUpDate": "2026-08-21",
        "linkedinStatus": "not_contacted",
        "notes": [
                {
                        "id": "note-apify-29",
                        "text": "Extracted via Apify / Apollo. Location: , US. Org Revenue: 500k - 1 Million.",
                        "authorName": "Apify Ingestion",
                        "createdAt": "2026-08-19T09:26:17.798Z",
                        "type": "note"
                }
        ],
        "fundingRound": "Seed ($3M - $8M)",
        "annualDataBudget": "$100k – $350k / yr",
        "competitorVendors": [
                "Mercor",
                "Micro1",
                "Scale AI"
        ],
        "expertWorkforceNeeded": "STEM University Graduates & Data Verification Specialists",
        "whyTheyBuy": "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
        "recommendedOutreachHook": "Hi Lukasz, noticed FORCE Automation INC is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?"
}
];

export async function seedSampleLeadsIntoDb() {
    const batch = writeBatch(db);
    for (const lead of SAMPLE_SEED_LEADS) {
        const docRef = doc(collection(db, 'company_leads'));
        batch.set(docRef, {
            ...lead,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    }
    await batch.commit();
}

export function exportLeadsToCsv(leads: CompanyLead[]): string {
    const headers = [
        'Company Name',
        'Website',
        'Industry',
        'Company Size',
        'Data Sourcing Needs',
        'Estimated Value ($)',
        'Priority',
        'Stage',
        'Contact Name',
        'Contact Role',
        'LinkedIn URL',
        'Contact Email',
        'Assigned VA',
        'Next Follow Up Date',
        'LinkedIn Status'
    ];

    const rows = leads.map(l => [
        `"${(l.companyName || '').replace(/"/g, '""')}"`,
        `"${(l.website || '').replace(/"/g, '""')}"`,
        `"${(l.industry || '').replace(/"/g, '""')}"`,
        `"${(l.companySize || '').replace(/"/g, '""')}"`,
        `"${(l.dataSourcingNeeds?.join(', ') || '').replace(/"/g, '""')}"`,
        l.estimatedValue || 0,
        l.priority || 'medium',
        l.stage || 'sourced',
        `"${(l.contactName || '').replace(/"/g, '""')}"`,
        `"${(l.contactRole || '').replace(/"/g, '""')}"`,
        `"${(l.linkedinUrl || '').replace(/"/g, '""')}"`,
        `"${(l.contactEmail || '').replace(/"/g, '""')}"`,
        `"${(l.assignedVa || '').replace(/"/g, '""')}"`,
        l.nextFollowUpDate || '',
        l.linkedinStatus || 'not_contacted'
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
