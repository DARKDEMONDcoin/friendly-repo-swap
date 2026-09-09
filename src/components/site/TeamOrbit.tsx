import { useEffect, useState } from "react";
import { team } from "@/data/team";
import { Portrait } from "@/components/site/Portrait";
import { LiquidGlass } from "@/components/site/LiquidGlass";
import { MenaMap } from "@/components/site/MenaMap";
import { cn } from "@/lib/utils";

const outcomes: Record<string, { short: string; detail: string }> = {
  sonny: { short: "ينشر عنك كل يوم", detail: "من الفكرة إلى التصميم والجدولة" },
  eva: { short: "ترتّب بريدك ومواعيدك", detail: "وتترك لك ما يحتاج قرارك فقط" },
  sam: { short: "يجلب فرص بيع حقيقية", detail: "ويتابعها حتى تصبح جاهزة" },
  nour: { short: "تكتب محتوى يظهر في البحث", detail: "من الكلمة إلى صفحة جاهزة للنشر" },
  dana: { short: "تصمّم كل موادك", detail: "بهوية واحدة لكل المقاسات" },
  adam: { short: "يحوّل أرقامك إلى قرار", detail: "ويخبرك ماذا توقف وماذا تضاعف" },
};

const actionPrefixes = ["أعمل الآن على", "أنجزت لك", "أراجع الآن", "جهّزت لك"];

const ROUTES = [
  { x: 700, y: 62 },
  { x: 300, y: 62 },
  { x: 875, y: 250 },
  { x: 125, y: 250 },
  { x: 700, y: 438 },
  { x: 300, y: 438 },
];

const MAP_EDGES = [
  { x: 560, y: 198 },
  { x: 440, y: 198 },
  { x: 622, y: 248 },
  { x: 378, y: 248 },
  { x: 560, y: 302 },
  { x: 440, y: 302 },
];

function curve(x: number, y: number, index: number) {
  const start = MAP_EDGES[index] ?? { x: 500, y: 250 };
  const mx = (start.x + x) / 2;
  const my = (start.y + y) / 2;
  const dx = x - start.x;
  const dy = y - start.y;
  return `M${start.x} ${start.y} Q${(mx - dy * 0.14).toFixed(1)} ${(my + dx * 0.14).toFixed(1)} ${x} ${y}`;
}

const STEP_MS = 3200;
const TRAVEL_MS = 1100;

export function TeamOrbit({ compact = false, mapCenter = false, dark = false }: { compact?: boolean; mapCenter?: boolean; dark?: boolean }) {
  const [step, setStep] = useState(0);
  const [arrived, setArrived] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  // كل موظف يتقدّم في قائمته الخاصة حتى يذكر كل ما يقدّمه ثم يبدأ جولة جديدة
  const [spoken, setSpoken] = useState<number[]>(() => team.map(() => 0));

  useEffect(() => {
    const speaker = step % ROUTES.length;
    setSpoken((prev) => {
      const next = [...prev];
      next[speaker] = (prev[speaker] ?? 0) + 1;
      return next;
    });
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setArrived(true);
      return;
    }
    setArrived(false);
    const arrive = window.setTimeout(() => setArrived(true), TRAVEL_MS);
    const next = window.setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => {
      window.clearTimeout(arrive);
      window.clearTimeout(next);
    };
  }, [step]);

  const active = step % ROUTES.length;
  const activeConnection = hovered ?? active;


  return (
    <div className={cn("team-orbit", compact && "team-orbit-compact", dark && "team-orbit-dark")}>
      <svg className="orbit-connections" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden>
        {ROUTES.map((r, index) => (
          <path
            key={index}
            id={`orbit-route-${index}`}
            className={cn("orbit-connection", activeConnection === index && "is-active")}
            d={curve(r.x, r.y, index)}
          />
        ))}
        <circle key={step} className="orbit-travel-dot" r="6">
          <animateMotion dur={`${TRAVEL_MS}ms`} begin="0s" fill="freeze" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1">
            <mpath href={`#orbit-route-${activeConnection}`} />
          </animateMotion>
        </circle>
      </svg>

      {mapCenter ? (
        <div className="orbit-map-center">
          <MenaMap orbit />
          <small><b>من قلب المنطقة</b><span>يفهم فريقك السوق، ثم يسلّم كل مهمة لمتخصصها</span></small>
        </div>
      ) : (
        <LiquidGlass className="orbit-user">
          <strong>أنت تقود</strong>
          <small>والفريق ينفّذ</small>
        </LiquidGlass>
      )}

      <div className="orbit-rail" aria-label="فريق سهل">
        {team.map((member, index) => {
          const count = spoken[index] ?? 0;
          const taskIndex = count > 0 ? (count - 1) % member.tasks.length : 0;
          const task = member.tasks[taskIndex];
          const prefix = actionPrefixes[Math.floor((count - 1) / member.tasks.length + member.tasks.length) % actionPrefixes.length];
          const isActive = active === index;
          const isLast = taskIndex === member.tasks.length - 1;
          return (
            <div
              key={member.id}
              className={cn("orbit-slot", `orbit-employee-${index + 1}`)}
              onPointerEnter={() => setHovered(index)}
              onPointerLeave={() => setHovered(null)}
              onFocusCapture={() => setHovered(index)}
              onBlurCapture={() => setHovered(null)}
            >
              {isActive && count > 0 ? (
                <div
                  className={cn("orbit-bubble", arrived ? "is-said" : "is-typing")}
                  role="status"
                  style={{ "--employee-tone": member.tint } as React.CSSProperties}
                >
                  <span className="orbit-bubble-head">
                    <span className="orbit-bubble-avatar" aria-hidden>
                      <Portrait memberId={member.id} name={member.name} className="size-full" />
                      <i />
                    </span>
                    <span className="orbit-bubble-id">
                      <strong>{member.name}</strong>
                      <b>{member.role}</b>
                    </span>
                  </span>
                  {arrived && task ? (
                    <span key={`${member.id}-${count}`} className="orbit-bubble-text">
                      {prefix} {task}
                    </span>
                  ) : (
                    <span className="orbit-bubble-typing" aria-label="يكتب الآن"><i /><i /><i /></span>
                  )}
                  <span className="orbit-bubble-apps" aria-hidden>
                    {member.apps.slice(0, 5).map((app) => (
                      <AppIcon key={app} name={app} className="size-3" />
                    ))}
                  </span>
                  <span className="orbit-bubble-foot">
                    <span className="orbit-bubble-progress" aria-hidden>
                      {member.tasks.map((_, dot) => (
                        <i key={dot} className={cn(dot <= taskIndex && "is-on")} />
                      ))}
                    </span>
                    <em>{isLast && arrived ? "أنهيت عرض ما أقدّمه" : `${taskIndex + 1} من ${member.tasks.length}`}</em>
                  </span>
                </div>
              ) : null}

              <LiquidGlass
                className={cn("orbit-employee", isActive && arrived && "is-lit")}
                style={{ "--employee-tone": member.tint, "--float-delay": `${index * -0.7}s` } as React.CSSProperties}
                tabIndex={0}
              >
                <span className="orbit-portrait">
                  <Portrait memberId={member.id} name={member.name} eager={index < 3} className="size-full" />
                  <i aria-hidden />
                </span>
                <span className="orbit-copy">
                  <strong>{member.name}</strong>
                  <small>{outcomes[member.id]?.short}</small>
                  {!compact ? <em>{outcomes[member.id]?.detail}</em> : null}
                </span>
              </LiquidGlass>
            </div>
          );
        })}
      </div>
    </div>
  );
}
