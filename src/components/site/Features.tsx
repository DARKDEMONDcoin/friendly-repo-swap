import { useCallback } from "react";
import type { MouseEvent } from "react";
import { Languages, ShieldCheck, Zap, Layers, Video, Wallet, Sparkles, Check, X } from "lucide-react";
import { Reveal } from "@/components/Reveal";

type Item = {
  icon: typeof Languages;
  title: string;
  body: string;
  span: string;
  motion: string;
  tags: string[];
  visual?: "dialects" | "memory";
  metric?: { value: string; label: string };
};

const items: Item[] = [
  {
    icon: Languages,
    title: "عربي أصيل، مش ترجمة",
    body: "يكتب بالفصحى وبالمصري والخليجي والمغاربي، ويولّد صوراً بنص عربي منسّق بدون حروف مكسورة.",
    span: "md:col-span-2",
    motion: "icon-flip",
    tags: ["فصحى", "مصري", "خليجي", "مغاربي"],
    visual: "dialects",
  },
  {
    icon: Video,
    title: "فيديو قصير تلقائي",
    body: "ريلز وتيك توك من مقال أو منتج، مع تعليق صوتي عربي وترجمة على الشاشة.",
    span: "",
    motion: "icon-play",
    tags: ["Reels", "TikTok", "Shorts"],
    metric: { value: "٤٠ ثانية", label: "من مقال إلى فيديو" },
  },
  {
    icon: Zap,
    title: "نشر في التوقيت الذكي",
    body: "يتعلّم متى يتفاعل جمهورك فعلاً ويجدول النشر على أساسه.",
    span: "",
    motion: "icon-spark",
    tags: ["جدولة ذكية", "توقيت محلي"],
    metric: { value: "+٣٢٪", label: "متوسط زيادة التفاعل" },
  },
  {
    icon: Layers,
    title: "ذاكرة مشتركة للفريق",
    body: "كل موظف يعرف علامتك التجارية، منتجاتك، ونبرتك — سياق واحد يتحدث تلقائياً.",
    span: "md:col-span-2",
    motion: "icon-stack",
    tags: ["هوية العلامة", "نبرة الصوت", "كتالوج المنتجات"],
    visual: "memory",
  },
  {
    icon: Wallet,
    title: "رصيد شفاف يترحّل",
    body: "تشوف تكلفة كل مهمة بالضبط، والرصيد غير المستخدم ينتقل للشهر التالي.",
    span: "",
    motion: "icon-tilt",
    tags: ["تسعير واضح", "بدون هدر"],
    metric: { value: "٠ مفاجآت", label: "في الفاتورة" },
  },
  {
    icon: ShieldCheck,
    title: "موافقتك قبل أي نشر",
    body: "وضع المراجعة اختياري: راجع كل شيء، أو اترك الفريق يشتغل بالكامل.",
    span: "",
    motion: "icon-lock",
    tags: ["مراجعة", "صلاحيات"],
    metric: { value: "نقرة واحدة", label: "للموافقة أو التعديل" },
  },
];

const compare = [
  { bad: "ترجمة حرفية للعربية", good: "كتابة عربية أصيلة بلهجتك" },
  { bad: "أدوات متفرقة وربط يدوي", good: "فريق واحد بذاكرة مشتركة" },
  { bad: "فواتير مفاجئة بالدولار", good: "رصيد شفاف يترحّل" },
];

function DialectVisual() {
  return (
    <div className="feature-visual feature-visual-dialects" aria-hidden="true">
      <div className="fv-line">
        <span className="fv-chip fv-chip-active">الفصحى</span>
        <span className="fv-chip">المصري</span>
        <span className="fv-chip">الخليجي</span>
        <span className="fv-chip">المغاربي</span>
      </div>
      <div className="fv-card">
        <p className="fv-text">أطلقنا اليوم تجربة جديدة تليق بعملائنا في المنطقة.</p>
        <div className="fv-bars">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

function MemoryVisual() {
  return (
    <div className="feature-visual feature-visual-memory" aria-hidden="true">
      <div className="fv-core"><Sparkles className="size-4" /></div>
      <div className="fv-nodes">
        {["محتوى", "إعلانات", "دعم", "تحليلات", "سيو"].map((n) => (
          <span key={n} className="fv-node">{n}</span>
        ))}
      </div>
    </div>
  );
}

export function Features() {
  const onMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <section id="features" className="features-section scroll-mt-24 border-y border-border py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="section-eyebrow">
                <Sparkles className="size-3.5" />
                لماذا سهل
              </span>
              <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.15] font-black md:text-5xl">
                كل ما ينقص الأدوات الأجنبية — <span className="text-gradient">مبني من الأساس</span>
              </h2>
            </div>
            <p className="max-w-sm leading-relaxed text-muted-foreground md:text-end">
              منصّة واحدة صُمِّمت للسوق العربي: لغة، توقيت، منصّات، وتسعير يفهم شغلك.
            </p>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <ul className="compare-strip mt-8">
            {compare.map((c) => (
              <li key={c.good} className="compare-item">
                <span className="compare-bad"><X className="size-3.5" />{c.bad}</span>
                <span className="compare-good"><Check className="size-3.5" />{c.good}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 110} className={it.span}>
              <article
                onMouseMove={onMove}
                className="feature-glass-card group relative h-full overflow-hidden rounded-3xl border border-border p-7"
              >
                <span className="feature-spotlight" aria-hidden="true" />
                <div className="relative flex h-full flex-col">
                  <span className="feature-icon-shell grid size-11 place-items-center rounded-2xl">
                    <it.icon className={`feature-icon ${it.motion} size-5`} strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-extrabold">{it.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{it.body}</p>

                  {it.visual === "dialects" && <DialectVisual />}
                  {it.visual === "memory" && <MemoryVisual />}

                  {it.metric && (
                    <div className="feature-metric mt-5">
                      <strong>{it.metric.value}</strong>
                      <span>{it.metric.label}</span>
                    </div>
                  )}

                  <ul className="feature-tags mt-auto pt-5">
                    {it.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
