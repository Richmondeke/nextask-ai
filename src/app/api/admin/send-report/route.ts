import { NextResponse } from 'next/server';
import { sendEmailReportToAdmins, AdminReportData } from '@/lib/email-service';
import { SAMPLE_SEED_LEADS } from '@/lib/leads-service';
import { ADMIN_EMAILS } from '@/lib/constants';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        
        const adminEmails = body.emails || ADMIN_EMAILS;

        const stageLabels: Record<string, string> = {
            sourced: '1. Sourced',
            decision_maker_found: '2. DM Found',
            linkedin_sent: '3. Outreach Sent',
            in_conversation: '4. In Conversation',
            sample_sent: '5. Sample Sent',
            call_scheduled: '6. Demo Booked',
            closed_won: '7. Closed Won 🎉',
            lost: 'Archived'
        };

        const topAccounts = SAMPLE_SEED_LEADS.slice(0, 6).map(l => ({
            name: l.companyName,
            funding: l.fundingRound || 'Series B / Growth',
            decisionMaker: `${l.contactName} (${l.contactRole})`,
            targetProfile: l.expertWorkforceNeeded || 'STEM / Domain Specialists',
            budget: l.annualDataBudget || `$${((l.estimatedValue || 15000) * 12).toLocaleString()}/yr`
        }));

        const accountStatuses = SAMPLE_SEED_LEADS.slice(0, 10).map(l => ({
            name: l.companyName,
            funding: l.fundingRound || 'Growth Stage',
            decisionMaker: `${l.contactName} (${l.contactRole})`,
            targetProfile: l.expertWorkforceNeeded || 'Domain Evaluators',
            stage: l.stage,
            stageLabel: stageLabels[l.stage] || l.stage,
            priority: l.priority,
            priorityColor: l.priority === 'urgent' ? '#0f172a' : '#64748b',
            owner: l.assignedVa || 'Alex (Operations)',
            followUp: l.nextFollowUpDate || 'Active',
            value: `$${(l.estimatedValue || 0).toLocaleString()}/mo`
        }));

        const recentSignups = [
            { name: 'Dr. Amina O.', role: 'Medical Doctor (MBBS)', country: 'Nigeria 🇳🇬', specialty: 'Clinical EHR QA & Medical NLP', status: 'Vetted' },
            { name: 'Tariq K.', role: 'Senior ML Engineer', country: 'Kenya 🇰🇪', specialty: 'PyTorch / RLHF Tool-Use', status: 'Pending Review' },
            { name: 'Chidi E.', role: 'Common Law Attorney', country: 'Ghana 🇬🇭', specialty: 'Legal QA & SEC Benchmarks', status: 'Vetted' },
            { name: 'Dr. Farhan M.', role: 'Pharmacologist (PharmD)', country: 'Egypt 🇪🇬', specialty: 'Drug Interaction & Safety RLHF', status: 'Vetted' },
            { name: 'Nathalie M.', role: 'Linguistics & French Specialist', country: 'Cameroon 🇨🇲', specialty: 'Multilingual Audio Annotation', status: 'New' }
        ];

        const totalValue = SAMPLE_SEED_LEADS.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
        const urgentCount = SAMPLE_SEED_LEADS.filter(l => l.priority === 'urgent').length;

        const reportData: AdminReportData = {
            totalLeads: SAMPLE_SEED_LEADS.length,
            totalPipelineValue: totalValue,
            urgentAccounts: urgentCount,
            topAccounts,
            accountStatuses,
            dailySignupsCount: 18,
            totalTalentPool: 1482,
            pendingReviewsCount: 14,
            recentSignups,
            adminEmails
        };

        const result = await sendEmailReportToAdmins(reportData);

        return NextResponse.json({
            success: true,
            recipients: adminEmails,
            reportSummary: {
                totalAccounts: reportData.totalLeads,
                pipelineValue: reportData.totalPipelineValue,
                urgentCount: reportData.urgentAccounts,
                dailySignups: reportData.dailySignupsCount,
                totalTalentPool: reportData.totalTalentPool
            },
            deliveryMethod: result.method
        });
    } catch (error: any) {
        console.error('Send report route error:', error);
        return NextResponse.json({ error: error.message || 'Failed to dispatch report' }, { status: 500 });
    }
}
