"use client";

import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative pt-32 overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-16 md:mb-24">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-[40px] md:text-[56px] font-light tracking-[-1.4px] mb-8 leading-[1.03] text-stripe-navy"
                    >
                        Join Africans shaping <br className="hidden md:block" />
                        the future of A.I
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-2xl text-[18px] text-stripe-body font-light mb-10 leading-[1.4]"
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
                            className="bg-stripe-purple text-white px-4 py-2 rounded text-[16px] font-normal hover:bg-stripe-purple-hover transition-all"
                        >
                            View Opportunities
                        </Link>
                        <Link
                            href="/experts"
                            className="bg-transparent text-stripe-purple border border-[#b9b9f9] px-4 py-2 rounded text-[16px] font-normal hover:bg-stripe-purple/5 transition-all"
                        >
                            Hire Talent
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Hero Image */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full max-w-[520px] mx-auto px-6 flex justify-center items-end"
            >
                <img
                    src="/lamine.gif"
                    alt="Onionlabel Hero"
                    width="1200"
                    height="1200"
                    className="w-full h-auto block"
                />
            </motion.div>
        </section>
    );
}

