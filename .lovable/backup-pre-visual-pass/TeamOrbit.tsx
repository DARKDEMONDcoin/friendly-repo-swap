import { UserRound } from "lucide-react";
import { team } from "@/data/team";
import { Portrait } from "@/components/site/Portrait";
import { LiquidGlass } from "@/components/site/LiquidGlass";
import { cn } from "@/lib/utils";

const outcomes: Record<string, { short: string; detail: string }> = {
  sonny: { short: "ينشر عنك كل يوم", detail: "من الفكرة إلى التصميم والجدولة" },
  eva: { short: "ترتّب بريدك ومواعيدك", detail: "وتترك لك ما يحتاج قرارك فقط" },
  sam: { short: "يجلب فرص بيع حقيقية", detail: "ويتابعها حتى تصبح جاهزة" },
  nour: { short: "تكتب محتوى يظهر في البحث", detail: "من الكلمة إلى صفحة جاهزة للنشر" },
  dana: { short: "تصمّم كل موادك", detail: "بهوية واحدة لكل المقاسات" },
  adam: { short: "يحوّل أرقامك إلى قرار", detail: "ويخبرك ماذا توقف وماذا تضاعف" },
};

export function TeamOrbit({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("team-orbit", compact && "team-orbit-compact")}>
      <div className="orbit-rings" aria-hidden />
      <LiquidGlass className="orbit-user">
        <span className="orbit-user-icon"><UserRound /></span>
        <strong>أنت تقود</strong>
        <small>والفريق ينفّذ</small>
      </LiquidGlass>
      <div className="orbit-rail" aria-label="فريق سهل">
        {team.map((member, index) => (
          <LiquidGlass
            key={member.id}
            className={`orbit-employee orbit-employee-${index + 1}`}
            style={{ "--employee-tone": member.tint, "--float-delay": `${index * -0.7}s` } as React.CSSProperties}
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
        ))}
      </div>
    </div>
  );
}