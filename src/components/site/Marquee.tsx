import { AppIcon, appLabel } from "@/components/site/AppIcon";

const platforms = [
  "instagram",
  "linkedin",
  "facebook",
  "x",
  "tiktok",
  "youtube",
  "pinterest",
  "whatsapp",
  "gmail",
  "slack",
  "shopify",
  "notion",
  "wordpress",
  "figma",
  "canva",
  "analytics",
];

export function Marquee() {
  const row = [...platforms, ...platforms];
  return (
    <section className="border-y border-border bg-background py-10">
      <p className="mb-6 text-center text-sm font-semibold tracking-wide text-muted-foreground">
        فريقك ينشر ويشتغل مباشرة على المنصات اللي تستخدمها
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track brand-icon-track gap-5">
          {row.map((p, i) => (
            <span key={`${p}-${i}`} className="brand-icon-chip" aria-label={appLabel(p)}>
              <AppIcon name={p} colored={false} className="size-6" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
