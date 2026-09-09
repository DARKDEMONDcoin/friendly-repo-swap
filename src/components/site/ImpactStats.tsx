import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, CalendarCheck2, Clock3, Coins, Layers3 } from "lucide-react";

type Stat = {
  value: number;
  prefix: string;
  suffix: string;
  title: string;
  label: string;
  unit: string;
  delta: string;
  trend: "up" | "down";
  icon: typeof Clock3;
  series: number[];
  meta: { k: string; v: string }[];
};

const stats: Stat[] = [
  {
    value: 40,
    prefix: "+",
    suffix: " ساعة",
    title: "الوقت المستعاد شهريًا",
    label: "متوسط ما يعود لفريقك من ساعات تشغيل",
    unit: "ساعة/شهر",
    delta: "٢٢٪+",
    trend: "up",
    icon: Clock3,
    series: [18, 22, 21, 27, 25, 31, 34, 33, 38, 40],
    meta: [
      { k: "أعلى شهر", v: "٤٦ ساعة" },
      { k: "المتوسط", v: "٣٢ ساعة" },
    ],
  },
  {
    value: 70,
    prefix: "",
    suffix: "%",
    title: "انخفاض تكلفة التشغيل",
    label: "مقارنة بفريق تسويق تقليدي بنفس المهام",
    unit: "مقارنة بالسوق",
    delta: "٧٠٪−",
    trend: "down",
    icon: Coins,
    series: [100, 94, 88, 79, 74, 66, 58, 46, 38, 30],
    meta: [
      { k: "فريق تقليدي", v: "١٠٠٪" },
      { k: "مع سهل", v: "٣٠٪" },
    ],
  },
  {
    value: 6,
    prefix: "",
    suffix: "/٧",
    title: "أيام التشغيل الأسبوعية",
    label: "ستة أيام عمل متواصل ويوم صيانة وتحديث",
    unit: "يوم/أسبوع",
    delta: "٩٨٪ جاهزية",
    trend: "up",
    icon: CalendarCheck2,
    series: [82, 88, 91, 90, 94, 96, 95, 97, 98, 98],
    meta: [
      { k: "زمن الاستجابة", v: "< ٣ دقائق" },
      { k: "التوقف", v: "يوم واحد" },
    ],
  },
  {
    value: 1000,
    prefix: "+",
    suffix: "",
    title: "سعة الفريق الشهرية",
    label: "مهام منشورة ومجدولة في باقات الفرق",
    unit: "مهمة/شهر",
    delta: "٣٫٤×",
    trend: "up",
    icon: Layers3,
    series: [180, 260, 320, 410, 520, 610, 720, 830, 930, 1000],
    meta: [
      { k: "مكتملة", v: "٩٦٪" },
      { k: "تحتاج مراجعة", v: "٤٪" },
    ],
  },
];

function Sparkline({ series, trend }: { series: number[]; trend: "up" | "down" }) {
  const max = Math.max(...series);
  const min = Math.min(...series);
  const span = Math.max(max - min, 1);
  const points = series.map((v, i) => {
    const x = (i / (series.length - 1)) * 100;
    const y = 34 - ((v - min) / span) * 28 - 3;
    return [x, y] as const;
  });
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${line} L100,36 L0,36 Z`;
  const last = points[points.length - 1]!;
  return (
    <svg className={`impact-spark ${trend === "down" ? "is-down" : ""}`} viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
      <path className="impact-spark-area" d={area} />
      <path className="impact-spark-line" d={line} vectorEffect="non-scaling-stroke" />
      <circle className="impact-spark-dot" cx={last[0]} cy={last[1]} r="1.9" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1200, 1);
        setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);
  return <span ref={ref}>{shown.toLocaleString("ar-EG")}</span>;
}

export function ImpactStats() {
  return (
    <section className="impact-strip" aria-label="أثر فريق سهل">
      <div className="impact-grid mx-auto max-w-6xl px-5">
        {stats.map((stat, index) => (
          <article key={stat.title} className="impact-card" style={{ "--impact-delay": `${index * 120}ms` } as React.CSSProperties}>
            <div className="impact-card-inner">
              <header className="impact-card-head">
                <div className="impact-head-id">
                  <span className="impact-icon-shell"><stat.icon className="impact-icon" /></span>
                  <span className="impact-title">{stat.title}</span>
                </div>
                <span className={`impact-delta ${stat.trend === "down" ? "is-down" : "is-up"}`}>
                  {stat.trend === "down" ? <ArrowDownRight /> : <ArrowUpRight />}
                  {stat.delta}
                </span>
              </header>

              <div className="impact-readout">
                <div className="impact-value font-display tabular-nums">
                  {stat.prefix}<AnimatedNumber value={stat.value} />{stat.suffix}
                </div>
                <span className="impact-unit">{stat.unit}</span>
              </div>

              <Sparkline series={stat.series} trend={stat.trend} />

              <p className="impact-label">{stat.label}</p>

              <dl className="impact-meta">
                {stat.meta.map((m) => (
                  <div key={m.k}>
                    <dt>{m.k}</dt>
                    <dd>{m.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
