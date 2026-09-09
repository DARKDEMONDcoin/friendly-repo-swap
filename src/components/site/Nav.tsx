import { LogoMark } from "@/components/site/LogoMark";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { label: "الموظفون", to: "/employees" },
  { label: "الحلول", to: "/use-cases" },
  { label: "المزايا", to: "/features" },
  { label: "التكاملات", to: "/integrations" },
  { label: "كيف يعمل", to: "/how-it-works" },
  { label: "الأسعار", to: "/pricing" },
  { label: "قصص النجاح", to: "/stories" },
  { label: "المدونة", to: "/blog" },
] as const;

export function Nav({ variant = "over" }: { variant?: "over" | "solid" }) {
  const [open, setOpen] = useState(false);
  const solid = variant === "solid";

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 py-4 text-white",
        solid && "text-foreground",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5">
        <Link to="/" className="nav-floating-control pointer-events-auto group flex items-center gap-2.5 rounded-full py-1.5 pe-4 ps-1.5">
          <LogoMark className="size-9" />
          <span className="font-display text-xl font-extrabold tracking-tight">سهل</span>
        </Link>

        <ul className="pointer-events-auto hidden items-center gap-1 2xl:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={cn(
                  "nav-floating-control relative rounded-full px-3 py-2 text-[0.93rem] font-medium transition-colors",
                  solid ? "text-ink-soft hover:text-primary" : "text-white/90 hover:text-white",
                )}
                activeProps={{
                  className: solid ? "text-primary font-bold" : "text-white font-bold",
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="pointer-events-auto hidden items-center gap-2 md:flex">
          <Link
            to="/app"
            className={cn(
              "nav-floating-control rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              solid ? "text-ink-soft hover:text-primary" : "text-white/90 hover:text-white",
            )}
          >
            جرّب الموظفين
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signin" as const }}
            className={cn(
              "nav-floating-control rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              solid ? "text-ink-soft hover:text-primary" : "text-white/90 hover:text-white",
            )}
          >
            دخول
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signup" as const }}
            className={cn(
              "group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-bold transition-transform duration-300 hover:-translate-y-0.5",
              solid ? "bg-foreground text-background" : "bg-white text-ink",
            )}
          >
            <span className="relative z-10">أنشئ حسابك</span>
          </Link>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
          className={cn(
            "nav-floating-control pointer-events-auto size-10 rounded-full 2xl:hidden",
            solid ? "text-foreground" : "text-white",
          )}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </nav>

      <div
        className={cn(
          "pointer-events-auto transition-[max-height,opacity] duration-400 2xl:hidden",
          open
            ? "max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain opacity-100"
            : "max-h-0 overflow-hidden opacity-0",
        )}
      >
        <div className="mx-4 my-3 rounded-2xl border border-border bg-card p-3 text-foreground shadow-card">
          <ul className="grid grid-cols-2 gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  onClick={() => setOpen(false)}
                  to={l.to}
                  className="block rounded-xl px-3 py-2.5 text-[0.95rem] font-medium hover:bg-secondary"
                  activeProps={{ className: "bg-secondary text-primary font-bold" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/70 pt-3">
            <Link
              onClick={() => setOpen(false)}
              to="/auth"
              search={{ mode: "signin" as const }}
              className="block rounded-xl border border-border px-3 py-2.5 text-center font-bold hover:bg-secondary"
            >
              تسجيل الدخول
            </Link>
            <Link
              onClick={() => setOpen(false)}
              to="/auth"
              search={{ mode: "signup" as const }}
              className="block rounded-xl bg-foreground px-3 py-2.5 text-center font-bold text-background"
            >
              أنشئ حسابك
            </Link>
            <Link
              onClick={() => setOpen(false)}
              to="/app"
              className="col-span-2 block rounded-xl px-3 py-2.5 text-center font-bold text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-aurora)" }}
            >
              جرّب الموظفين مجانًا الآن ←
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
