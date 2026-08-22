import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { apiKey, count = 50, category = 'rlhf' } = body;

        const token = apiKey || process.env.APIFY_API_TOKEN;
        if (!token) {
            return NextResponse.json({ error: 'Apify API token is required.' }, { status: 400 });
        }

        // Configure targeted actor payload for data annotation buyers
        const ACTOR_ID = 'IoSHqwTR9YGhzccez'; // Leads Finder
        
        let jobTitles = [
            "Head of Data Operations",
            "Data Operations Manager",
            "Head of Data Quality",
            "Director of Machine Learning",
            "VP of AI",
            "Lead ML Engineer",
            "Head of RLHF",
            "AI Evaluation Lead",
            "Chief Technology Officer",
            "Founder"
        ];

        let keywords = [
            "rlhf",
            "human in the loop",
            "computer vision",
            "data annotation",
            "data labeling",
            "llm evaluation",
            "foundation models",
            "robotics perception"
        ];

        if (category === 'healthcare') {
            jobTitles = ["Chief Medical AI Officer", "Head of Clinical AI", "VP Healthcare AI", "Director of Medical Imaging", "CTO"];
            keywords = ["clinical ai", "medical imaging", "healthcare llm", "ehr parsing", "radiology ai"];
        } else if (category === 'legal') {
            jobTitles = ["Head of Legal Tech", "VP AI", "Head of Machine Learning", "Chief Legal Officer", "CTO", "Founder"];
            keywords = ["legal ai", "contract analysis", "document extraction", "compliance ai", "legal tech"];
        } else if (category === 'robotics') {
            jobTitles = ["Head of Perception", "Computer Vision Director", "Robotics AI Lead", "VP Autonomous Systems", "CTO"];
            keywords = ["spatial ai", "robotics vision", "3d annotation", "lidar", "autonomous systems", "embodied ai"];
        }

        const inputPayload = {
            contact_job_title: jobTitles,
            seniority_level: ["Founder", "C-Level", "VP", "Head", "Director", "Manager"],
            functional_level: ["Engineering", "Operations", "Product"],
            contact_location: ["united states", "united kingdom", "canada", "germany"],
            company_keywords: keywords,
            size: ["11-20", "21-50", "51-100", "101-200", "201-500"],
            funding: ["Seed", "Series A", "Series B", "Series C"],
            email_status: ["validated"],
            fetch_count: Math.min(Number(count) || 50, 100)
        };

        // Call Apify API to run actor
        const runRes = await fetch(`https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputPayload)
        });

        const runData = await runRes.json();
        if (!runRes.ok) {
            const approvalUrl = runData.error?.data?.approvalUrl || (runData.error?.message?.includes('approvePermissions') ? 'https://console.apify.com/actors/IoSHqwTR9YGhzccez?approvePermissions=true' : null);
            return NextResponse.json({ 
                error: runData.error?.message || 'Apify run failed',
                approvalUrl
            }, { status: 400 });
        }

        const runId = runData.data?.id;
        const datasetId = runData.data?.defaultDatasetId;

        // Poll for completion (up to 60s)
        let isDone = false;
        let attempts = 0;
        while (!isDone && attempts < 30) {
            await new Promise(r => setTimeout(r, 2000));
            attempts++;
            const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
            const statusData = await statusRes.json();
            const status = statusData.data?.status;
            if (status === 'SUCCEEDED') {
                isDone = true;
            } else if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
                return NextResponse.json({ error: `Apify run ended with status: ${status}` }, { status: 500 });
            }
        }
        if (!datasetId) {
            return NextResponse.json({ error: 'No dataset returned from Apify' }, { status: 500 });
        }

        // Fetch dataset items
        const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&limit=100`);
        const items = await datasetRes.json();

        // Transform Apify items to OnionLabel CompanyLead format
        const leads = (items || []).map((item: any) => ({
            companyName: item.company_name || item.company_domain || 'Unknown Company',
            website: item.company_website || item.company_domain || '',
            industry: item.industry || 'AI & Machine Learning',
            companySize: item.company_size || '51-200 employees',
            dataSourcingNeeds: [
                'LLM Fine-Tuning Datasets',
                'Human-in-the-Loop Annotation',
                'Model Evaluation & RLHF'
            ],
            estimatedValue: 8500,
            priority: 'high',
            stage: 'sourced',
            contactName: item.full_name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Decision Maker',
            contactRole: item.job_title || 'Head of AI / Data',
            linkedinUrl: item.linkedin || '',
            contactEmail: item.email || '',
            assignedVa: 'Alex (VA)',
            nextFollowUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            linkedinStatus: 'not_contacted',
            notes: [
                {
                    id: `note-${Date.now()}`,
                    text: `Imported via Apify Leads Finder. Funding: ${item.company_total_funding || 'Venture Backed'}. Location: ${item.city || ''}, ${item.country || 'US'}.`,
                    authorName: 'Apify Automation',
                    createdAt: new Date().toISOString(),
                    type: 'note'
                }
            ]
        }));

        return NextResponse.json({ success: true, count: leads.length, leads });
    } catch (error: any) {
        console.error('Apify route error:', error);
        return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
    }
}
