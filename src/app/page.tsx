import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Jobs from "@/components/Jobs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Stats />
      <Jobs />

      {/* Featured Story Callout */}
      <section className="py-24 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                Build the frontier <br />
                <span className="opacity-50 italic">with us.</span>
              </h2>
              <p className="text-lg opacity-70 mb-10 leading-relaxed">
                Mercor connects the world's top AI professionals with leading AI labs
                and enterprises. We are powering frontier research, RLHF data, and AI
                agent training at scale.
              </p>
              <button className="bg-primary text-white border-2 border-primary px-8 py-4 rounded-full font-bold hover:bg-transparent transition-all">
                Learn about APEX
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-3xl bg-muted/20 border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent" />
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
