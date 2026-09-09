import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Play, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { AmbientBackground } from "@/components/site/AmbientBackground";
import { LiquidGlass } from "@/components/site/LiquidGlass";
import { TeamOrbit } from "@/components/site/TeamOrbit";

const HeroObject3D = lazy(() => import("@/components/site/HeroObject3D"));

export function Hero() {
  return (
    <section id="top" className="home-hero">
      <AmbientBackground />
      <ClientOnly fallback={null}>
        <Suspense fallback={null}><HeroObject3D /></Suspense>
      </ClientOnly>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-32 md:pt-40">
        <Reveal>
          <div className="hero-kicker">
            <span className="hero-live-dot" />
            أول فريق رقمي يفهم سوقك ويتكلم بلهجتك
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="hero-title">
            بدل ما تدير كل شيء بنفسك،
            <span>خلّي فريقك ينجزه.</span>
          </h1>
        </Reveal>

        <Reveal delay={150}>
          <p className="hero-lead">
            ستة موظفين رقميين متخصصين يعملون معًا على محتواك ومبيعاتك وتصميمك وتنظيمك وبياناتك — تحت إشرافك، ومن مكان واحد.
          </p>
        </Reveal>

        <Reveal delay={220}>
          <div className="hero-actions">
            <Link to="/auth" search={{ mode: "signup" as const }} className="hero-primary-cta">
              ابدأ مع فريقك مجانًا <ArrowLeft />
            </Link>
            <a href="#workspace" className="hero-secondary-cta">
              <Play /> شاهد مساحة العمل
            </a>
          </div>
        </Reveal>

        <Reveal delay={290}>
          <ul className="hero-assurances">
            {[
              "بدون بطاقة بنكية",
              "موافقتك قبل التنفيذ الحساس",
              "إعداد أول موظف في دقائق",
            ].map((item) => <li key={item}><Check />{item}</li>)}
          </ul>
        </Reveal>

        <Reveal delay={360}>
          <LiquidGlass className="hero-orbit-shell">
            <div className="hero-orbit-topline">
              <span><Sparkles /> فريق سهل</span>
              <span className="hero-status"><i /> يعمل الآن</span>
            </div>
            <TeamOrbit compact />
          </LiquidGlass>
        </Reveal>
      </div>
    </section>
  );
}