"use client";

import Link from "next/link";
import Logo from "./ui/Logo";

const footerLinks = [
    {
        title: "Platform",
        links: [
            { name: "Find work", href: "/opportunities" },
            { name: "Help center", href: "/support" },
            { name: "Stories", href: "/stories" },
        ],
    },
    {
        title: "Company",
        links: [
            { name: "Careers", href: "/careers" },
            { name: "Blog", href: "/blog" },
            { name: "Security", href: "/security" },
        ],
    },
    {
        title: "Contact",
        links: [
            { name: "Support", href: "mailto:support@nextask.ai" },
            { name: "Sales", href: "mailto:sales@nextask.ai" },
            { name: "Press", href: "mailto:press@nextask.ai" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-zinc-100 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                    <div className="col-span-2">
                        <Logo className="mb-6" />
                        <p className="text-secondary max-w-xs text-sm leading-relaxed">
                            Defining the future of work by connecting the world's top AI professionals
                            with leading labs and enterprises.
                        </p>
                    </div>

                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">{group.title}</h4>
                            <ul className="space-y-4">
                                {group.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-secondary hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-secondary">
                        © {new Date().getFullYear()} Nexttask AI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/legal/terms" className="text-xs text-secondary hover:text-foreground">Terms</Link>
                        <Link href="/legal/privacy" className="text-xs text-secondary hover:text-foreground">Privacy</Link>
                        <Link href="/legal/cookies" className="text-xs text-secondary hover:text-foreground">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
