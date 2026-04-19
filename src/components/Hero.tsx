"use client";

import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PROFILES_ROW_1 = [
    { name: "Sarah K.", role: "AI Researcher", image: "/talent/african_1.png" },
    { name: "Nicholas", role: "Software Engineer", image: "/talent/african_2.png" },
    { name: "Tara", role: "Data Scientist", image: "/talent/african_3.png" },
    { name: "Andrew", role: "UX Designer", image: "/talent/african_4.png" },
];

const PROFILES_ROW_2 = [
    { name: "Elena M.", role: "Project Manager", image: "/talent/african_5.png" },
    { name: "Samuel T.", role: "Cloud Engineer", image: "/talent/african_6.png" },
    { name: "Zainab B.", role: "QA Lead", image: "/talent/african_7.png" },
    { name: "Ibrahim S.", role: "Backend Developer", image: "/talent/african_8.png" },
];

export default function Hero() {
    return (
        <section className="relative pt-32 pb-32 overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-24">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-[40px] md:text-[64px] font-bold tracking-tight mb-8 leading-[1.1] text-zinc-900"
                    >
                        Join Africans shaping <br className="hidden md:block" />
                        the future of A.I
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-2xl text-lg md:text-xl text-zinc-600 mb-10 leading-relaxed"
                    >
                        Join 700K+ MAs, PhDs, and college graduates working and earning as AI trainers.
                        Work from wherever and whenever. No AI experience needed.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            href="/signup"
                            className="bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                        >
                            View Opportunities
                        </Link>
                        <Link
                            href="/experts"
                            className="bg-white text-zinc-900 border border-zinc-200 px-10 py-4 rounded-full text-lg font-bold hover:bg-zinc-50 transition-all"
                        >
                            Hire Talent
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Profiles Carousels */}
            <div className="relative space-y-8 w-full overflow-hidden">
                {/* Row 1: Right to Left */}
                <div className="flex gap-6 animate-scroll w-fit hover:pause">
                    {[...PROFILES_ROW_1, ...PROFILES_ROW_1, ...PROFILES_ROW_1, ...PROFILES_ROW_1].map((profile, i) => (
                        <div
                            key={`r1-${i}`}
                            className="flex-shrink-0 w-[240px] md:w-[280px] h-[320px] md:h-[360px] rounded-[32px] overflow-hidden relative shadow-sm border border-zinc-100"
                        >
                            <Image
                                src={profile.image}
                                alt={profile.name}
                                fill
                                className="object-cover"
                                priority={i < 4}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="font-bold text-xl mb-1">{profile.name}</p>
                                <p className="text-sm opacity-80">{profile.role}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Row 2: Left to Right */}
                <div className="flex gap-6 animate-scroll-reverse w-fit hover:pause">
                    {[...PROFILES_ROW_2, ...PROFILES_ROW_2, ...PROFILES_ROW_2, ...PROFILES_ROW_2].map((profile, i) => (
                        <div
                            key={`r2-${i}`}
                            className="flex-shrink-0 w-[240px] md:w-[280px] h-[320px] md:h-[360px] rounded-[32px] overflow-hidden relative shadow-sm border border-zinc-100"
                        >
                            <Image
                                src={profile.image}
                                alt={profile.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="font-bold text-xl mb-1">{profile.name}</p>
                                <p className="text-sm opacity-80">{profile.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-280px * 4 - 1.5rem * 4)); }
                }
                @keyframes scroll-reverse {
                    0% { transform: translateX(calc(-280px * 4 - 1.5rem * 4)); }
                    100% { transform: translateX(0); }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                .animate-scroll-reverse {
                    animation: scroll-reverse 45s linear infinite;
                }
                .hover\:pause:hover {
                    animation-play-state: paused;
                }
                @media (max-width: 768px) {
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(calc(-240px * 4 - 1.5rem * 4)); }
                    }
                    @keyframes scroll-reverse {
                        0% { transform: translateX(calc(-240px * 4 - 1.5rem * 4)); }
                        100% { transform: translateX(0); }
                    }
                }
            `}</style>
        </section>
    );
}

