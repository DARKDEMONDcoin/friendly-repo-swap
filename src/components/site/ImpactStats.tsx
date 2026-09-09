import { useEffect, useRef, useState } from "react";
import { CalendarCheck2, Clock3, Coins, Layers3, TrendingDown } from "lucide-react";

const stats = [
  { value: 40, prefix: "+", suffix: " ساعة", title: "وقت مستعاد", label: "وقت يعود لفريقك كل شهر", badge: "كل شهر", icon: Clock3, visual: "clock" },
  { value: 70, prefix: "", suffix: "% أقل", title: "تكلفة تشغيل", label: "مقارنة بفريق تقليدي مماثل", badge: "توفير", icon: Coins, visual: "saving" },
  { value: 6, prefix: "", suffix: "/٧ أيام", title: "جاهزية أسبوعية", label: "ستة أيام عمل ويوم للصيانة", badge: "منتظم", icon: CalendarCheck2, visual: "availability" },
  { value: 1000, prefix: "+", suffix: " مهمة", title: "سعة الفريق", label: "قدرة شهرية في باقات الفرق", badge: "شهريًا", icon: Layers3, visual: "tasks" },
];

function StatVisual({ type }: { type: string }) {
  if (type === "clock") {
    return (
      <div className="impact-chart impact-chart-clock" aria-hidden="true">
        <div className="impact-chart-bars"><i /><i /><i /><i /><i /><i /><i /></div>
        <span><Clock3 /> وقت أكثر للعمل المهم</span>
      </div>
    );
  }

  if (type === "saving") {
    return (
      <div className="impact-chart impact-chart-saving" aria-hidden="true">
        <div className="impact-saving-ring"><span>٧٠٪</span></div>
        <div className="impact-saving-copy"><TrendingDown /><span>تكلفة أخف</span><small>بدون أعباء التوظيف</small></div>
      </div>
    );
  }

  if (type === "availability") {
    return (
      <div className="impact-chart impact-chart-availability" aria-hidden="true">
        <div className="impact-days">{Array.from({ length: 7 }, (_, index) => <i key={index} className={index === 6 ? "is-rest" : ""} />)}</div>
        <span>نشاط مستمر طوال الأسبوع</span>
      </div>
    );
  }

  return (
    <div className="impact-chart impact-chart-tasks" aria-hidden="true">
      <div className="impact-task-row"><i /><span /></div>
      <div className="impact-task-row"><i /><span /></div>
      <div className="impact-task-row"><i /><span /></div>
      <small>تتقدّم تلقائيًا</small>
    </div>
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
          <article key={stat.label} className="impact-card" style={{ "--impact-delay": `${index * 130}ms` } as React.CSSProperties}>
            <div className="impact-card-inner">
              <div className="impact-card-head">
                <div className="impact-icon-shell"><stat.icon className="impact-icon" /></div>
                <span className="impact-badge">{stat.badge}</span>
              </div>
              <div className="impact-copy">
                <p className="impact-title">{stat.title}</p>
                <div className="impact-value font-display tabular-nums">
                  {stat.prefix}<AnimatedNumber value={stat.value} />{stat.suffix}
                </div>
                <p className="impact-label">{stat.label}</p>
              </div>
              <StatVisual type={stat.visual} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}