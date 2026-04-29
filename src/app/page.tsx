import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Jobs from "@/components/Jobs";
import PromptSection from "@/components/PromptSection";
import Benefits from "@/components/Benefits";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <FadeIn>
        <Hero />
      </FadeIn>
      <FadeIn delay={0.2}>
        <Stats />
      </FadeIn>
      <FadeIn>
        <Jobs />
      </FadeIn>
      <PromptSection />

      {/* Featured Story Callout */}
      <section className="py-32 bg-stripe-dark text-white border-t border-stripe-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-[40px] md:text-[56px] font-light tracking-[-1.4px] mb-8 leading-[1.03]">
                Shape how the next generation <br />
                <span className="text-zinc-400 italic">of A.I. thinks.</span>
              </h2>
              <p className="text-[18px] text-[rgba(255,255,255,0.7)] font-light mb-10 leading-[1.4] max-w-lg">
                Onionlabel connects the world's top AI professionals with leading AI labs
                and enterprises. We are powering frontier research, RLHF data, and AI
                agent training at scale.
              </p>
              <Link href="/signup" className="inline-block bg-stripe-purple text-white px-4 py-2 rounded text-[16px] font-normal hover:bg-stripe-purple-hover transition-all">
                Get Started Now
              </Link>
            </div>
            <div className="relative w-full rounded-md bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-stripe-ambient">
              <img src="/Onionhit.gif" alt="Onionlabel AI Showcase" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      <FadeIn>
        <Benefits />
      </FadeIn>
      <FadeIn>
        <FAQ />
      </FadeIn>
      <Footer />
    </main>
  );
}
