export interface Entity {
    text: string;
    label: string;
}

export interface AssessmentTask {
    id: string;
    type: 'categorization' | 'sentiment' | 'ner' | 'fact-check';
    title: string;
    description: string;
    content: any; // Can be string or object depending on type
    options?: string[];
    correctAnswer: string | Entity[];
}

export interface MrnEvaluationData {
    prompt: string;
    responseA: string;
    responseB: string;
}

export const assessmentQuestions: AssessmentTask[] = [
    {
        id: 'task-1',
        type: 'categorization',
        title: 'Query Categorization',
        description: 'Categorize the user query into the appropriate intent.',
        content: '"I need to book a flight from London to New York for next Friday morning, preferably business class."',
        options: ['Travel Booking', 'Customer Support', 'General Inquiry', 'Technical Issue'],
        correctAnswer: 'Travel Booking'
    },
    {
        id: 'task-2',
        type: 'sentiment',
        title: 'Sentiment Analysis',
        description: 'Determine the sentiment of the following customer feedback.',
        content: '"I am extremely disappointed with the service I received today. The representative was rude and my issue remains unresolved after two hours on hold."',
        options: ['Positive', 'Neutral', 'Negative', 'Frustrated'],
        correctAnswer: 'Negative'
    },
    {
        id: 'task-3',
        type: 'ner',
        title: 'Named Entity Recognition (NER)',
        description: 'Identify the ENTITIES in the following text segment.',
        content: "Tim Cook announced that Apple's new headquarters in Lagos, Nigeria will open next month.",
        correctAnswer: [
            { text: 'Tim Cook', label: 'PERSON' },
            { text: 'Apple', label: 'ORG' },
            { text: 'Lagos', label: 'LOC' },
            { text: 'Nigeria', label: 'LOC' }
        ]
    },
    {
        id: 'task-4',
        type: 'fact-check',
        title: 'Fact Checking',
        description: 'Verify if the claim is supported or contradicted by the provided source text.',
        content: {
            claim: "The Great Wall of China is the only man-made structure visible from space with the naked eye.",
            source: "Astronauts from the Apollo missions have confirmed that while many man-made structures like cities and highways are visible from low Earth orbit, the Great Wall of China is notoriously difficult to see without aid due to its color blending with the natural environment."
        },
        correctAnswer: 'Contradicted'
    }
];

export const mrnEvaluationData: MrnEvaluationData = {
    prompt: "Explain how important Catherine the Great's personal participation in Russia's smallpox vaccine launch was to convincing her people to be vaccinated.",
    responseA: "It was decisive — without Catherine rolling up her own sleeve, Russia probably wouldn't have had a mass inoculation campaign at all. (And yes, historians get pedantic here: what she promoted in 1768 was variolation/inoculation, not Jenner's cowpox vaccine of 1796 — the idea of deliberately giving someone a mild case of smallpox using matter from a human pustule. The principle, and the public-relations problem, were the same.)\n\n1. Why Russians were terrified of it\n* Smallpox was a national trauma. In the 1760s it killed 10% of those infected and left many more blind or scarred; earlier tsars (Peter II in 1730) had died of it.\n* Inoculation looked insane. You were intentionally giving a healthy person of the \"heaven-sent\" disease.",
    responseB: "Catherine the Great's personal participation in introducing smallpox immunization to Russia was not just important—it was the single most crucial factor in the success of the campaign. Without her leading by example, it is highly unlikely the practice would have gained traction among the Russian people.\n\nTo understand the magnitude of her actions, it helps to look at the historical context, the profound risks she took, and the brilliant public relations strategy she built around her survival.\n\n(Note: The procedure Catherine underwent in 1768 was called variolation or inoculation, which involved deliberately infecting a patient with a mild strain of live human smallpox. Edward Jenner's safer cowpox-based \"vaccine\" was not invented until 1796. However, the intent and public health impact were the same.)"
};

/**
 * Calculates the total assessment score based on answers.
 * Returns a score out of 100.
 */
export const calculateAssessmentScore = (answers: Record<string, string | Entity[]>): number => {
    if (!answers) return 0;

    let correctCount = 0;
    assessmentQuestions.forEach(task => {
        const userAnswer = answers[task.id];

        if (task.type === 'ner') {
            const userEntities = Array.isArray(userAnswer) ? (userAnswer as Entity[]) : [];
            const correctEntities = Array.isArray(task.correctAnswer) ? (task.correctAnswer as Entity[]) : [];

            let matches = 0;
            correctEntities.forEach((ce) => {
                if (userEntities.some((ue) => ue.text === ce.text && ue.label === ce.label)) {
                    matches++;
                }
            });

            if (matches === correctEntities.length && userEntities.length === correctEntities.length) {
                correctCount++;
            }
        } else if (userAnswer === task.correctAnswer) {
            correctCount++;
        }
    });

    return Math.round((correctCount / assessmentQuestions.length) * 100);
};

export const getTaskById = (id: string): AssessmentTask | undefined => {
    return assessmentQuestions.find((t: AssessmentTask) => t.id === id);
};
