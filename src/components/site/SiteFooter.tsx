import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { AppIcon } from "@/components/site/AppIcon";

const cols: { t: string; l: { label: string; to: string }[] }[] = [
  {
    t: "المنتج",
    l: [
      { label: "الموظفون", to: "/employees" },
      { label: "المزايا", to: "/features" },
      { label: "التكاملات", to: "/integrations" },
      { label: "كيف يعمل", to: "/how-it-works" },
      { label: "الأسعار", to: "/pricing" },
    ],
  },
  {
    t: "الحلول",
    l: [
      { label: "المتاجر الإلكترونية", to: "/use-cases/ecommerce" },
      { label: "المطاعم والكافيهات", to: "/use-cases/restaurants" },
      { label: "العيادات", to: "/use-cases/clinics" },
      { label: "العقار والمقاولات", to: "/use-cases/realestate" },
      { label: "كل القطاعات", to: "/use-cases" },
    ],
  },
  {
    t: "الشركة",
    l: [
      { label: "من نحن", to: "/about" },
      { label: "قصص النجاح", to: "/stories" },
      { label: "المدونة", to: "/blog" },
      { label: "الأسئلة الشائعة", to: "/faq" },
      { label: "تواصل معنا", to: "/contact" },
    ],
  },
  {
    t: "قانوني وأمان",
    l: [
      { label: "الأمان", to: "/security" },
      { label: "سياسة الخصوصية", to: "/privacy" },
      { label: "شروط الاستخدام", to: "/terms" },
      { label: "ملفات الارتباط", to: "/cookies" },
      { label: "الاستخدام المقبول", to: "/acceptable-use" },
      { label: "معالجة البيانات (DPA)", to: "/dpa" },
      { label: "المعالِجون الفرعيون", to: "/subprocessors" },
      { label: "الاشتراك والاسترداد", to: "/refunds" },
    ],
  },
];

const integrations = ["instagram", "linkedin", "x", "tiktok", "gmail", "slack", "notion", "shopify"];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-glow" aria-hidden />
      <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-16">
        <div className="site-footer-cta">
          <div className="site-footer-sheen" aria-hidden />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="site-footer-badge">
                <span className="site-footer-dot" />
                فريقك جاهز للعمل الآن
              </span>
              <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                وظّف فريق «سهل» وابدأ خلال دقائق
              </h2>
              <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">
                بدون بطاقة، بدون تعقيد — جرّب مجانًا وشوف النتيجة بنفسك.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/auth/signup" className="site-footer-primary">
                ابدأ مجانًا
                <ArrowUpRight className="size-4" strokeWidth={2.6} />
              </Link>
              <Link to="/contact" className="site-footer-ghost">
                تحدّث معنا
              </Link>
            </div>
          </div>
        </div>

        <div className="site-footer-panel mt-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div>
              <Link to="/" className="flex items-center gap-2.5">
                <span
                  className="grid size-9 place-items-center rounded-xl text-primary-foreground"
                  style={{ backgroundImage: "var(--gradient-aurora)" }}
                >
                  <Sparkles className="size-4.5" strokeWidth={2.4} />
                </span>
                <span className="font-display text-xl font-extrabold">سهل</span>
              </Link>
              <p className="mt-4 max-w-xs leading-relaxed text-muted-foreground">
                فريق موظفين بالذكاء الاصطناعي، يعمل بالعربية على مدار الساعة لأصحاب المشاريع — ينشر،
                يصمّم، يردّ، ويبيع نيابة عنك.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {integrations.map((a) => (
                  <span key={a} className="site-footer-chip">
                    <AppIcon name={a} className="size-4.5" />
                  </span>
                ))}
              </div>
            </div>
            {cols.map((c) => (
              <nav key={c.t} aria-label={c.t}>
                <h3 className="site-footer-title">{c.t}</h3>
                <ul className="mt-4 space-y-2">
                  {c.l.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="site-footer-link">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="site-footer-divider" />

          <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} سهل. جميع الحقوق محفوظة.</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="site-footer-pill">
                <span className="site-footer-dot" />
                جميع الأنظمة تعمل
              </span>
              <span className="site-footer-pill">صُنع بالعربية 🇸🇦</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
