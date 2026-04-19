"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "Research", href: "/research" },
    { name: "Enterprise", href: "/enterprise" },
    { name: "Experts", href: "/experts" },
    { name: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link href="/" className="text-xl font-bold tracking-tight">
                        Nextask<span className="text-primary">.ai</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-secondary hover:text-foreground transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/join"
                        className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                        Join Discord <MoveRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
