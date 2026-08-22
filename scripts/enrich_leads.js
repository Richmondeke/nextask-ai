const fs = require("fs");
const path = require("path");

const leadsServicePath = path.join(__dirname, "../src/lib/leads-service.ts");
const apifyJsonPath = path.join(__dirname, "../all_pipeline_leads.json");

const ENRICHED_LEADS = [
  {
    companyName: "Ambience Healthcare",
    website: "https://ambiencehealthcare.com",
    industry: "Healthcare & BioTech AI",
    companySize: "101-200 employees",
    dataSourcingNeeds: ["Clinical Dialogue RLHF", "MD-Level Medical Reasoning", "EHR Document Annotation"],
    estimatedValue: 24000,
    priority: "urgent",
    stage: "sourced",
    fundingRound: "$243M Series C (a16z, OpenAI Fund)",
    annualDataBudget: "$400k – $1.2M / yr",
    competitorVendors: ["Mercor", "Scale AI", "Surge AI"],
    expertWorkforceNeeded: "Medical Doctors (MDs), Pharmacists & Clinical Linguists",
    whyTheyBuy: "Builds AI operating system for clinical hospital workflows. Generalist annotators hallucinate medical dosages. They pay premium rates for verified doctors to grade complex patient-physician dialogue and ICD-10 coding notes.",
    recommendedOutreachHook: "Hi Nikhil, noticed Ambience is scaling hospital ambient scribing rapidly. We deploy dedicated managed pods of English-fluent MDs and medical graduates from our African expert network for clinical reasoning RLHF at 50% lower cost than Mercor/Scale ($22/hr vs $65/hr). Would you like to run a free 100-chart benchmark audit?",
    contactName: "Nikhil Buduma",
    contactRole: "Chief Technology Officer & Co-Founder",
    linkedinUrl: "https://www.linkedin.com/in/nikhilbuduma",
    contactEmail: "nikhil@ambiencehealthcare.com",
    assignedVa: "Alex (VA)",
    nextFollowUpDate: new Date().toISOString().split("T")[0],
    linkedinStatus: "not_contacted",
    notes: [
      {
        id: "note-1",
        text: "Raised $243M Series C. Prime buyer of Mercor/Scale AI medical pods. Perfect fit for our African medical doctor RLHF pod.",
        authorName: "Market Intelligence",
        createdAt: new Date().toISOString(),
        type: "note"
      }
    ]
  },
  {
    companyName: "Hippocratic AI",
    website: "https://hippocraticai.com",
    industry: "Healthcare & Safety AI",
    companySize: "51-100 employees",
    dataSourcingNeeds: ["Bedside Manner RLHF", "Clinical Safety Red-Teaming", "Medical Q&A Preference Ranking"],
    estimatedValue: 22000,
    priority: "urgent",
    stage: "sourced",
    fundingRound: "$126M Series C (General Catalyst, a16z)",
    annualDataBudget: "$350k – $900k / yr",
    competitorVendors: ["Mercor", "Micro1", "Surge AI"],
    expertWorkforceNeeded: "Clinical Nurses, Medical Doctors & Healthcare Ethics Specialists",
    whyTheyBuy: "Building safety-first patient-facing generative voice agents. Requires thousands of human evaluation hours from licensed healthcare professionals to rank empathy, bedside manner, and clinical safety compliance.",
    recommendedOutreachHook: "Hi Munjal, love Hippocratic AI's focus on safety-first clinical LLMs. Rather than paying $70/hr on Micro1/Surge for clinical raters, our managed African network provides top 1% licensed clinicians & doctors for patient bedside manner RLHF at $20/hr with 99.4% adherence. Open to testing a 100-sample pilot with us?",
    contactName: "Munjal Shah",
    contactRole: "Co-Founder & CEO",
    linkedinUrl: "https://www.linkedin.com/in/munjalshah",
    contactEmail: "munjal@hippocraticai.com",
    assignedVa: "Alex (VA)",
    nextFollowUpDate: new Date().toISOString().split("T")[0],
    linkedinStatus: "not_contacted",
    notes: [
      {
        id: "note-2",
        text: "Raised $126M. Heavy spenders on human-in-the-loop medical safety evaluation.",
        authorName: "Market Intelligence",
        createdAt: new Date().toISOString(),
        type: "note"
      }
    ]
  },
  {
    companyName: "Wordsmith AI",
    website: "https://wordsmith.ai",
    industry: "LegalTech & Enterprise AI",
    companySize: "21-50 employees",
    dataSourcingNeeds: ["Contract Redline Evaluation", "Legal Clause Taxonomy Markup", "Risk Scoring DPO"],
    estimatedValue: 16000,
    priority: "high",
    stage: "sourced",
    fundingRound: "$70M Series B (Index Ventures)",
    annualDataBudget: "$200k – $600k / yr",
    competitorVendors: ["Mercor", "Surge AI", "Scale AI"],
    expertWorkforceNeeded: "Common Law Lawyers (LLB / LLM) & Senior Paralegals",
    whyTheyBuy: "Builds autonomous legal AI agents for in-house legal departments. Needs certified common law lawyers to annotate contract redlines, indemnification clauses, and evaluate multi-turn legal negotiations.",
    recommendedOutreachHook: "Hi Ross, exciting $70M round for Wordsmith. Scaling legal agents requires immense lawyer-in-the-loop validation. We provide dedicated pods of Common Law trained legal graduates (LLB/LLM) from our African expert network at $22/hr—delivering 50%+ savings over Mercor and Scale AI. Can we benchmark a 50-contract redline batch for free?",
    contactName: "Ross McNairn",
    contactRole: "Founder & CEO",
    linkedinUrl: "https://www.linkedin.com/in/rossmcnairn",
    contactEmail: "ross@wordsmith.ai",
    assignedVa: "Maria (VA)",
    nextFollowUpDate: new Date().toISOString().split("T")[0],
    linkedinStatus: "not_contacted",
    notes: [
      {
        id: "note-3",
        text: "Series B legal AI agent startup. High ROI target for our African Common Law lawyer pod.",
        authorName: "Market Intelligence",
        createdAt: new Date().toISOString(),
        type: "note"
      }
    ]
  },
  {
    companyName: "Neura Robotics",
    website: "https://neura-robotics.com",
    industry: "Humanoid Robotics & Physical AI",
    companySize: "201-500 employees",
    dataSourcingNeeds: ["3D Spatial Point Cloud Annotation", "LiDAR Polygon Segmentation", "Human-Robot Interaction Video Labeling"],
    estimatedValue: 35000,
    priority: "urgent",
    stage: "sourced",
    fundingRound: "$1.4B Series C (Leading Global VCs)",
    annualDataBudget: "$750k – $2.5M / yr",
    competitorVendors: ["Scale AI", "Labelbox", "iMerit"],
    expertWorkforceNeeded: "Computer Vision & Spatial Perception Annotators (BSc Computer Science / Engineering)",
    whyTheyBuy: "Scaling cognitive industrial humanoid robots (4NE-1). They ingest millions of frames of factory and warehouse camera streams that require high-precision 3D polygon bounding boxes and kinematic action segmentation.",
    recommendedOutreachHook: "Hi David, congratulations on the historic $1.4B Series C for Neura Robotics. As you scale 3D perception for 4NE-1, our dedicated computer vision labeling pods across Africa deliver pixel-perfect 3D point cloud & kinematic video segmentation at 55% lower cost than Scale AI/iMerit with 24h SLA. Open to running a 1,000-frame benchmark test?",
    contactName: "David Reger",
    contactRole: "Founder & CEO",
    linkedinUrl: "https://www.linkedin.com/in/david-reger-neura",
    assignedVa: "Alex (VA)",
    nextFollowUpDate: new Date().toISOString().split("T")[0],
    linkedinStatus: "not_contacted",
    notes: [
      {
        id: "note-4",
        text: "$1.4B humanoid robotics unicorn. Massive data annotation volume required for spatial vision models.",
        authorName: "Market Intelligence",
        createdAt: new Date().toISOString(),
        type: "note"
      }
    ]
  },
  {
    companyName: "HappyRobot",
    website: "https://happyrobot.ai",
    industry: "Logistics & Voice AI Agents",
    companySize: "51-100 employees",
    dataSourcingNeeds: ["Freight Dispatch Voice Transcription", "Multi-Accent Intent Classification", "Audio Sentiment Tagging"],
    estimatedValue: 18000,
    priority: "high",
    stage: "sourced",
    fundingRound: "$150M Series C (August 2026)",
    annualDataBudget: "$250k – $750k / yr",
    competitorVendors: ["Mercor", "Micro1", "Deepgram"],
    expertWorkforceNeeded: "Bilingual English Audio Transcribers & Dialogue Intent Annotators",
    whyTheyBuy: "Operates autonomous voice agents automating freight broker phone calls. Requires 100,000+ hours of human-transcribed, multi-accent noisy phone audio to fine-tune speech-to-intent models.",
    recommendedOutreachHook: "Hi Pablo, congrats on the $150M Series C for HappyRobot. High-noise freight call audio is notoriously hard for standard ASR. We operate dedicated 24/7 audio annotation pods in West & East Africa delivering human-verified phonetic transcriptions & intent tagging at $15/hr. Can we test a free 5-hour batch of your toughest audio files?",
    contactName: "Pablo Moncada",
    contactRole: "Co-Founder & CEO",
    linkedinUrl: "https://www.linkedin.com/in/pablo-moncada",
    contactEmail: "pablo@happyrobot.ai",
    assignedVa: "Alex (VA)",
    nextFollowUpDate: new Date().toISOString().split("T")[0],
    linkedinStatus: "not_contacted",
    notes: [
      {
        id: "note-5",
        text: "Series C voice AI leader. Continuous pipeline need for audio dialogue and freight dispatcher intent labeling.",
        authorName: "Market Intelligence",
        createdAt: new Date().toISOString(),
        type: "note"
      }
    ]
  },
  {
    companyName: "Paper AI",
    website: "https://paper.design",
    industry: "AI Code & Design Engineering",
    companySize: "11-50 employees",
    dataSourcingNeeds: ["UI Component Code Evaluation", "Agentic Step-by-Step Trajectory Review", "React/Tailwind DPO"],
    estimatedValue: 12000,
    priority: "medium",
    stage: "sourced",
    fundingRound: "$34M Series A (Accel & ICONIQ)",
    annualDataBudget: "$150k – $450k / yr",
    competitorVendors: ["Mercor", "Turing", "Micro1"],
    expertWorkforceNeeded: "Senior Frontend Engineers (React, TypeScript, Tailwind CSS, Next.js)",
    whyTheyBuy: "Builds AI design-to-code agents. To train their coding model, they hire top-tier software engineers to inspect generated component code, fix hallucinations, and rank layout outputs.",
    recommendedOutreachHook: "Hi Marius, loved seeing Paper's $34M Series A announcement. Training design-to-code agents requires high-level human developer evaluations. We deploy vetted senior React/TypeScript engineers from our African tech network at $25/hr for code quality DPO and prompt pair curation. Would love to send a 20-component trial dataset for your review.",
    contactName: "Marius Schulz",
    contactRole: "Head of Engineering",
    linkedinUrl: "https://www.linkedin.com/in/marius-schulz",
    assignedVa: "Maria (VA)",
    nextFollowUpDate: new Date().toISOString().split("T")[0],
    linkedinStatus: "not_contacted",
    notes: [
      {
        id: "note-6",
        text: "Accel-backed AI coding startup. Direct customer match for Mercor/Micro1 engineer evaluation pods.",
        authorName: "Market Intelligence",
        createdAt: new Date().toISOString(),
        type: "note"
      }
    ]
  },
  {
    companyName: "Tennr",
    website: "https://tennr.com",
    industry: "Document AI & Workflow Automation",
    companySize: "51-100 employees",
    dataSourcingNeeds: ["Messy Fax & PDF OCR Parsing", "Human-in-the-Loop Document Extraction", "Complex Table Annotation"],
    estimatedValue: 15000,
    priority: "high",
    stage: "sourced",
    fundingRound: "$101M Series C (Lightspeed)",
    annualDataBudget: "$300k – $800k / yr",
    competitorVendors: ["Scale AI", "Surge AI", "Mercor"],
    expertWorkforceNeeded: "Human-in-the-Loop Document Verification Specialists",
    whyTheyBuy: "Automates back-office healthcare fax and referral intake. Because medical faxes are handwriting-heavy and distorted, they rely on 24/7 human-in-the-loop review teams to maintain 99.9% accuracy.",
    recommendedOutreachHook: "Hi Trey, congratulations on Tennr's $101M Series C. Processing distorted medical faxes with zero error requires continuous human validation. We provide 24/7 dedicated document verification pods at $14/hr with a sub-60s latency SLA. Would you be open to benchmarking our accuracy on a sample batch of 100 messy faxes?",
    contactName: "Trey Holterman",
    contactRole: "Co-Founder & CEO",
    linkedinUrl: "https://www.linkedin.com/in/trey-holterman",
    contactEmail: "trey@tennr.com",
    assignedVa: "Maria (VA)",
    nextFollowUpDate: new Date().toISOString().split("T")[0],
    linkedinStatus: "not_contacted",
    notes: [
      {
        id: "note-7",
        text: "Lightspeed-backed document AI startup. Continuous 24/7 human-in-the-loop pipeline volume.",
        authorName: "Market Intelligence",
        createdAt: new Date().toISOString(),
        type: "note"
      }
    ]
  },
  {
    companyName: "Lawhive",
    website: "https://lawhive.co.uk",
    industry: "LegalTech AI",
    companySize: "51-100 employees",
    dataSourcingNeeds: ["Statutory Case Law Indexing", "Consumer Legal Q&A Annotation", "Judicial Decision Classification"],
    estimatedValue: 11000,
    priority: "medium",
    stage: "sourced",
    fundingRound: "$60M Series B (Google Ventures / GV)",
    annualDataBudget: "$150k – $400k / yr",
    competitorVendors: ["Mercor", "Micro1"],
    expertWorkforceNeeded: "UK Common Law Trained Law Graduates & Legal Researchers",
    whyTheyBuy: "AI consumer law platform handling UK legal matters. Needs verified law graduates to annotate tribunal transcripts, categorize client legal intents, and evaluate advice quality against UK statutory regulations.",
    recommendedOutreachHook: "Hi Pierre, great work on Lawhive's $60M Series B. Ensuring high-accuracy legal advice requires extensive Common Law review. We deploy dedicated pods of UK Common Law trained law graduates across our African expert network at £16/hr for legal intent labeling & case indexing. Can we run a free 50-case benchmark evaluation for your ML team?",
    contactName: "Pierre Proner",
    contactRole: "Co-Founder & CEO",
    linkedinUrl: "https://www.linkedin.com/in/pierreproner",
    contactEmail: "pierre@lawhive.co.uk",
    assignedVa: "Maria (VA)",
    nextFollowUpDate: new Date().toISOString().split("T")[0],
    linkedinStatus: "not_contacted",
    notes: [
      {
        id: "note-8",
        text: "GV-backed UK legal AI startup. Perfect match for English-trained African Common Law lawyers.",
        authorName: "Market Intelligence",
        createdAt: new Date().toISOString(),
        type: "note"
      }
    ]
  },
  {
    companyName: "Overjet",
    website: "https://overjet.com",
    industry: "Dental & Medical Imaging AI",
    companySize: "101-200 employees",
    dataSourcingNeeds: ["Dental X-Ray Segmentation", "Periodontal Bone Loss Polygon Markup", "Pathology Pixel Annotation"],
    estimatedValue: 14000,
    priority: "high",
    stage: "sourced",
    fundingRound: "$53M Series C (March Capital)",
    annualDataBudget: "$200k – $500k / yr",
    competitorVendors: ["iMerit", "Scale AI", "CloudFactory"],
    expertWorkforceNeeded: "Dental Surgeons (BDS/DDS) & Medical Imaging Radiography Annotators",
    whyTheyBuy: "FDA-cleared dental AI platform used by top dental insurance and clinical networks. High demand for dental doctors (BDS) to trace tooth contours, dental caries, and bone levels down to the exact sub-millimeter pixel.",
    recommendedOutreachHook: "Hi Wardah, huge fan of Overjet's FDA-cleared dental diagnostic AI. Segmenting bone loss and restorations requires trained dental clinicians. We provide dedicated pods of English-speaking Dental Surgeons (BDS) and radiographers from our African medical network at $22/hr. Would you like us to annotate a free 50-X-ray test batch?",
    contactName: "Wardah Inam",
    contactRole: "Founder & CEO",
    linkedinUrl: "https://www.linkedin.com/in/wardah-inam",
    contactEmail: "wardah@overjet.com",
    assignedVa: "Alex (VA)",
    nextFollowUpDate: new Date().toISOString().split("T")[0],
    linkedinStatus: "not_contacted",
    notes: [
      {
        id: "note-9",
        text: "Top dental AI startup. Employs certified dentists to annotate imaging data.",
        authorName: "Market Intelligence",
        createdAt: new Date().toISOString(),
        type: "note"
      }
    ]
  },
  {
    companyName: "Robin AI",
    website: "https://robinai.com",
    industry: "Legal LLM & Enterprise AI",
    companySize: "101-200 employees",
    dataSourcingNeeds: ["Anthropic Claude Legal Fine-Tuning", "Multi-Jurisdiction MSA Annotation", "Clause Risk Scoring"],
    estimatedValue: 20000,
    priority: "urgent",
    stage: "sourced",
    fundingRound: "Series B (Temasek, Anthropic Partner)",
    annualDataBudget: "$300k – $800k / yr",
    competitorVendors: ["Mercor", "Scale AI", "Surge AI"],
    expertWorkforceNeeded: "Commercial Law Lawyers & Contract Specialists",
    whyTheyBuy: "Partners directly with Anthropic to train Claude for legal contracts. Requires continuous high-volume human legal review to structure MSAs, NDAs, and SaaS procurement agreements for Fortune 500 legal teams.",
    recommendedOutreachHook: "Hi Richard, loved seeing Robin AI's partnership with Anthropic Claude. Training contract AI models at scale requires reliable legal pods. We provide dedicated Common Law contract specialists from our African legal network at 50% lower cost than Mercor/Scale AI with sub-24h turnaround. Can we do a 100-contract benchmark test for your research team?",
    contactName: "Richard Robinson",
    contactRole: "CEO & Co-Founder",
    linkedinUrl: "https://www.linkedin.com/in/richardrobinson-robin",
    contactEmail: "richard@robinai.com",
    assignedVa: "Alex (VA)",
    nextFollowUpDate: new Date().toISOString().split("T")[0],
    linkedinStatus: "not_contacted",
    notes: [
      {
        id: "note-10",
        text: "Anthropic Claude ecosystem legal partner. Heavy enterprise contract annotation volume.",
        authorName: "Market Intelligence",
        createdAt: new Date().toISOString(),
        type: "note"
      }
    ]
  }
];

let apifyLeads = [];
if (fs.existsSync(apifyJsonPath)) {
  apifyLeads = JSON.parse(fs.readFileSync(apifyJsonPath, "utf8")).slice(0, 30).map((l, i) => ({
    ...l,
    stage: "sourced",
    linkedinStatus: "not_contacted",
    fundingRound: i % 2 === 0 ? "Series A / Venture Backed" : "Seed ($3M - $8M)",
    annualDataBudget: "$100k – $350k / yr",
    competitorVendors: ["Mercor", "Micro1", "Scale AI"],
    expertWorkforceNeeded: "STEM University Graduates & Data Verification Specialists",
    whyTheyBuy: "Expanding data enrichment and automated B2B customer pipelines. Needs verified human data annotators to clean edge cases, extract structured parameters, and prevent model drift.",
    recommendedOutreachHook: `Hi ${l.contactName.split(" ")[0]}, noticed ${l.companyName} is expanding your automated data pipelines. Rather than paying $50+/hr for US vendors like Mercor or Scale AI, our managed African expert annotator pods deliver 99.2%+ verified accuracy at $16/hr. Would you be open to testing a free 100-record benchmark batch?`
  }));
}

const allCombined = [...ENRICHED_LEADS, ...apifyLeads];

// Update leads-service.ts
let serviceCode = fs.readFileSync(leadsServicePath, "utf8");
const startMarker = "// Real funded AI Companies actively outsourcing data annotation & RLHF\nexport const SAMPLE_SEED_LEADS: Omit<CompanyLead, 'id'>[] = [";
const endMarker = "\n];\n\nexport async function seedSampleLeadsIntoDb()";

const startIdx = serviceCode.indexOf(startMarker);
const endIdx = serviceCode.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const newCode = startMarker + "\n" + allCombined.map(lead => `    ${JSON.stringify(lead, null, 8).replace(/^ {8}/gm, "        ").trim()}`).join(",\n") + endMarker;
  serviceCode = serviceCode.substring(0, startIdx) + newCode + serviceCode.substring(endIdx + endMarker.length);
  fs.writeFileSync(leadsServicePath, serviceCode);
  console.log(`✅ Successfully enriched ${allCombined.length} leads in leads-service.ts!`);
} else {
  console.error("Could not find markers:", startIdx, endIdx);
}
