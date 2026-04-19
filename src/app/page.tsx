import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Jobs from "@/components/Jobs";
import PromptSection from "@/components/PromptSection";
import Benefits from "@/components/Benefits";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <Jobs />
      <PromptSection />
      <Benefits />
      <FAQ />

      {/* Featured Story Callout */}
      <section className="py-32 bg-white text-zinc-900 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-[40px] md:text-[56px] font-bold tracking-tight mb-8 leading-[1.1]">
                Shape how the next generation <br />
                <span className="text-zinc-400 italic">of A.I. thinks.</span>
              </h2>
              <p className="text-lg text-zinc-600 mb-10 leading-relaxed max-w-lg">
                Nexttask connects the world's top AI professionals with leading AI labs
                and enterprises. We are powering frontier research, RLHF data, and AI
                agent training at scale through our specialized APEX program.
              </p>
              <Link href="/signup" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10">
                Join the APEX Program
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                "/showcase/collab-1.png",
                "/showcase/research-1.png",
                "/showcase/workspace-1.png",
                "/talent/backend-1.png"
              ].map((img, i) => (
                <div key={i} className="aspect-square rounded-[32px] bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden relative shadow-inner">
                  <img src={img} alt="Showcase" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
