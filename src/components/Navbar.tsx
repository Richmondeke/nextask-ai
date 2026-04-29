"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MoveRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "./ui/Logo";

const navLinks = [
    { name: "Opportunities", href: "/opportunities" },
    { name: "Enterprise", href: "/enterprise" },
    { name: "Experts", href: "/experts" },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stripe-border">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Logo />
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[15px] font-medium text-stripe-body hover:text-stripe-navy transition-colors tracking-normal"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-[15px] font-medium text-stripe-body hover:text-stripe-navy transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-stripe-purple text-white px-4 py-2 rounded text-[16px] font-normal flex items-center gap-2 hover:bg-stripe-purple-hover transition-all"
                        >
                            Join Onionlabel <MoveRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <button
                        className="p-2 -mr-2 md:hidden text-stripe-body hover:text-stripe-navy transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-stripe-border overflow-hidden"
                    >
                        <div className="px-6 py-8 space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-lg font-normal text-stripe-navy"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-6 border-t border-stripe-border space-y-4">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-lg font-normal text-stripe-navy"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full bg-stripe-purple text-white px-6 py-3 rounded text-center text-[16px] font-normal"
                                >
                                    Join Onionlabel
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

