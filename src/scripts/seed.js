import { db } from './lib/firebase.js';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

const jobs = [
    {
        title: 'Senior ML Engineer',
        company: 'Vertex AI Labs',
        location: 'Remote (Global)',
        type: 'Full-time',
        salary: '$180k - $250k',
        tags: ['PyTorch', 'Agents', 'LLM'],
        postedAt: new Date().toISOString()
    },
    {
        title: 'AI Research Scientist',
        company: 'Frontier Research',
        location: 'San Francisco, CA',
        type: 'Contract',
        salary: '$150/hr',
        tags: ['RLHF', 'Fine-tuning'],
        postedAt: new Date().toISOString()
    },
    {
        title: 'Backend Scalability Expert',
        company: 'Nextask',
        location: 'Hybrid',
        type: 'Full-time',
        salary: '$160k - $220k',
        tags: ['Next.js', 'Go', 'Firebase'],
        postedAt: new Date().toISOString()
    }
];

async function seedData() {
    console.log('Seeding jobs...');
    for (const job of jobs) {
        await addDoc(collection(db, 'jobs'), job);
    }
    console.log('Jobs seeded!');

    // Add a dummy superadmin profile for reference (User would need to be created in Auth first)
    // This is just a template
    /*
    await setDoc(doc(db, 'profiles', 'SUPERADMIN_UID'), {
        fullName: 'Super Admin',
        email: 'admin@nextask.ai',
        role: 'superadmin',
        createdAt: new Date().toISOString(),
        status: 'Vetted'
    });
    */
}

seedData();
