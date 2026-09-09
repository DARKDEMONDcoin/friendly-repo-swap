import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  CheckCircle2,
  ChevronLeft,
  CircleGauge,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Globe2,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  Monitor,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
} from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { AvatarUploader } from "@/components/app/AvatarUploader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { COUNTRIES } from "@/data/team-portraits";
import { useRegion } from "@/hooks/use-region";
import { supabase } from "@/integrations/supabase/client";
import {
  type NotificationPreferences,
  useNotificationPreferences,
  useProfile,
  useTasks,
  useUpdateNotificationPreferences,
  useUpdateProfile,
  useUpdateWorkspace,
  useWorkspace,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات | سهل" },
      { name: "description", content: "إدارة مساحة عمل سهل والحساب والأمان والتنبيهات والتكاملات." },
      { property: "og:title", content: "الإعدادات | سهل" },
      { property: "og:description", content: "إدارة مساحة عمل سهل والحساب والأمان والتنبيهات والتكاملات." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

const tabs = [
  { id: "workspace", label: "مساحة العمل", hint: "الهوية والتفضيلات", icon: Building2 },
  { id: "account", label: "الحساب والأمان", hint: "بياناتك وكلمة المرور", icon: ShieldCheck },
  { id: "notifications", label: "التنبيهات", hint: "ما يصلك ومتى", icon: Bell },
  { id: "appearance", label: "المظهر واللغة", hint: "الوضع الداكن والعرض", icon: Palette },
  { id: "billing", label: "الاستخدام والباقات", hint: "حالة تجربتك", icon: CreditCard },
] as const;

type TabId = (typeof tabs)[number]["id"];

const field =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

type NotificationDraft = Omit<NotificationPreferences, "user_id" | "created_at" | "updated_at">;

const defaultNotifications: NotificationDraft = {
  approval_ready: true,
  integration_disconnected: true,
  publishing_failed: true,
  weekly_summary: true,
  task_digest: true,
  digest_frequency: "weekly",
  timezone: "Africa/Cairo",
};

function isTab(value: string | null): value is TabId {
  return tabs.some((item) => item.id === value);
}

function SettingsPage() {
  const [tab, setTab] = useState<TabId>("workspace");
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { data: workspace, isLoading: workspaceLoading } = useWorkspace();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: tasks, isLoading: tasksLoading } = useTasks(workspace?.id);

  const doneCount = (tasks ?? []).filter((task) => task.status === "done").length;
  const profileScore = useMemo(() => {
    if (!workspace || !profile) return 0;
    const values = [
      workspace.name,
      workspace.industry,
      workspace.tone,
      workspace.website,
      workspace.country,
      profile.full_name,
      profile.dialect,
    ];
    return Math.round((values.filter(Boolean).length / values.length) * 100);
  }, [workspace, profile]);

  useEffect(() => {
    const readTab = () => {
      const requested = new URLSearchParams(window.location.search).get("tab");
      if (isTab(requested)) setTab(requested);
    };
    readTab();
    window.addEventListener("popstate", readTab);
    return () => window.removeEventListener("popstate", readTab);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function chooseTab(next: TabId) {
    setTab(next);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.pushState({}, "", url);
  }

  const loading = workspaceLoading || profileLoading;

  return (
    <AppShell title="الإعدادات" lead="تحكّم في مساحة عملك وحسابك من مكان واحد.">
      <section className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="mb-1 text-xs font-bold text-primary">مركز التحكّم</p>
          <h1 className="font-display text-2xl font-black sm:text-3xl">اضبط سهل على طريقة عملك</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            إعدادات واضحة للعلامة والحساب والتنبيهات، مع وصول مباشر إلى كل اتصال مهم.
          </p>
        </div>
        <div className="min-w-52 rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-xs font-bold">
            <span>اكتمال مساحة العمل</span>
            <span className="text-primary">{profileScore}٪</span>
          </div>
          <Progress value={profileScore} aria-label={`اكتمال مساحة العمل ${profileScore}٪`} />
        </div>
      </section>

      {notice ? (
        <div
          role="status"
          className={cn(
            "mb-5 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold",
            notice.type === "success"
              ? "border-primary/25 bg-primary/10 text-foreground"
              : "border-destructive/30 bg-destructive/10 text-destructive",
          )}
        >
          {notice.type === "success" ? <CheckCircle2 className="size-4" /> : <Bell className="size-4" />}
          {notice.text}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <nav
          aria-label="أقسام الإعدادات"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:block lg:space-y-1.5 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {tabs.map((item) => {
            const active = tab === item.id;
            return (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                onClick={() => chooseTab(item.id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "h-auto min-w-max justify-start gap-3 rounded-lg border px-3.5 py-3 text-start lg:w-full",
                  active
                    ? "border-primary/25 bg-primary/10 text-foreground shadow-sm hover:bg-primary/10"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground",
                )}
              >
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-md", active ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                  <item.icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold">{item.label}</span>
                  <span className="hidden text-xs font-medium text-muted-foreground lg:block">{item.hint}</span>
                </span>
              </Button>
            );
          })}
        </nav>

        <main className="min-w-0">
          {loading ? <SettingsLoading /> : null}
          {!loading && tab === "workspace" && workspace ? (
            <WorkspacePanel workspace={workspace} onNotice={setNotice} />
          ) : null}
          {!loading && tab === "account" && profile ? (
            <AccountPanel profile={profile} onNotice={setNotice} />
          ) : null}
          {tab === "notifications" ? <NotificationsPanel onNotice={setNotice} /> : null}
          {tab === "appearance" ? <AppearancePanel /> : null}
          {tab === "billing" ? (
            <BillingPanel doneCount={doneCount} loading={tasksLoading} />
          ) : null}
        </main>
      </div>
    </AppShell>
  );
}

function PanelHeader({ icon: Icon, title, description }: { icon: typeof Building2; title: string; description: string }) {
  return (
    <header className="mb-6 flex gap-3 border-b border-border pb-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <h2 className="font-display text-xl font-black">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </header>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return <section className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-7">{children}</section>;
}

function SettingsLoading() {
  return (
    <div className="rounded-lg border border-border bg-card p-7" aria-label="جارٍ تحميل الإعدادات">
      <div className="mb-7 h-12 w-48 animate-pulse rounded-lg bg-secondary" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((item) => <div key={item} className="h-20 animate-pulse rounded-lg bg-secondary/70" />)}
      </div>
    </div>
  );
}

type WorkspaceData = NonNullable<ReturnType<typeof useWorkspace>["data"]>;
type ProfileData = NonNullable<ReturnType<typeof useProfile>["data"]>;
type NoticeSetter = (notice: { type: "success" | "error"; text: string }) => void;

function WorkspacePanel({ workspace, onNotice }: { workspace: WorkspaceData; onNotice: NoticeSetter }) {
  const updateWorkspace = useUpdateWorkspace();

  return (
    <SettingsCard>
      <PanelHeader icon={Building2} title="مساحة العمل" description="هذه التفاصيل توجه الفريق عند إنشاء أي محتوى أو مهمة." />
      <form
        className="space-y-6"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const name = String(form.get("name") ?? "").trim();
          if (name.length < 2) {
            onNotice({ type: "error", text: "اسم النشاط يجب أن يتكوّن من حرفين على الأقل." });
            return;
          }
          try {
            await updateWorkspace.mutateAsync({
              id: workspace.id,
              patch: {
                name,
                initials: String(form.get("initials") ?? "").trim().slice(0, 3) || name.slice(0, 2),
                industry: String(form.get("industry") ?? "").trim(),
                website: String(form.get("website") ?? "").trim() || null,
                country: String(form.get("country") ?? "").trim() || null,
                tone: String(form.get("tone") ?? "").trim(),
                banned_words: String(form.get("banned") ?? "")
                  .split(/[،,\n]/)
                  .map((word) => word.trim())
                  .filter(Boolean),
              },
            });
            onNotice({ type: "success", text: "تم حفظ إعدادات مساحة العمل." });
          } catch {
            onNotice({ type: "error", text: "تعذّر حفظ مساحة العمل. أعد المحاولة." });
          }
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="اسم النشاط" required><input name="name" required defaultValue={workspace.name} className={field} /></Field>
          <Field label="الأحرف المختصرة" hint="تظهر في صورة مساحة العمل"><input name="initials" maxLength={3} defaultValue={workspace.initials} className={field} /></Field>
          <Field label="المجال"><input name="industry" defaultValue={workspace.industry} className={field} /></Field>
          <Field label="الدولة">
            <select name="country" defaultValue={workspace.country ?? ""} className={field}>
              <option value="">اختر الدولة</option>
              {COUNTRIES.map((item) => <option key={item.code} value={item.name}>{item.name}</option>)}
            </select>
          </Field>
          <Field label="الموقع الإلكتروني" hint="اختياري">
            <div className="relative"><Globe2 className="absolute right-3 top-3 size-4 text-muted-foreground" /><input name="website" type="url" dir="ltr" defaultValue={workspace.website ?? ""} placeholder="https://example.com" className={cn(field, "pe-9")} /></div>
          </Field>
        </div>
        <Field label="نبرة العلامة" hint="صف كيف تريد أن يبدو صوت علامتك">
          <textarea name="tone" defaultValue={workspace.tone} className={cn(field, "min-h-28 resize-y")} />
        </Field>
        <Field label="الكلمات الممنوعة" hint="افصل بينها بفاصلة عربية أو اكتب كل كلمة في سطر">
          <textarea name="banned" defaultValue={workspace.banned_words.join("، ")} className={cn(field, "min-h-24 resize-y")} />
        </Field>
        <Button type="submit" disabled={updateWorkspace.isPending} className="gap-2">
          {updateWorkspace.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {updateWorkspace.isPending ? "جارٍ الحفظ" : "حفظ التغييرات"}
        </Button>
      </form>
    </SettingsCard>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-sm font-extrabold">{label}{required ? <span className="text-destructive">*</span> : null}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function AccountPanel({ profile, onNotice }: { profile: ProfileData; onNotice: NoticeSetter }) {
  const { country, setCountry } = useRegion();
  const updateProfile = useUpdateProfile();
  const [email, setEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "حساب تجريبي");
      setAnonymous(Boolean(data.user?.is_anonymous));
    });
  }, []);

  return (
    <div className="space-y-5">
      <SettingsCard>
        <PanelHeader icon={User} title="بيانات الحساب" description="بياناتك الشخصية واللغة التي يكتب بها فريقك." />
        <form
          className="space-y-5"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            try {
              await updateProfile.mutateAsync({ id: profile.id, patch: { full_name: String(form.get("full_name") ?? "").trim(), dialect: String(form.get("dialect") ?? "") } });
              onNotice({ type: "success", text: "تم تحديث بيانات حسابك." });
            } catch {
              onNotice({ type: "error", text: "تعذّر تحديث الحساب." });
            }
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="الاسم"><input name="full_name" defaultValue={profile.full_name ?? ""} className={field} /></Field>
            <Field label="البريد الإلكتروني"><div className="relative"><Mail className="absolute right-3 top-3 size-4 text-muted-foreground" /><input value={email} readOnly className={cn(field, "pe-9 text-muted-foreground")} /></div></Field>
            <Field label="لهجة المحتوى">
              <select name="dialect" defaultValue={profile.dialect} className={field}>
                {["خليجية", "مصرية", "شامية", "مغاربية", "فصحى معاصرة"].map((dialect) => <option key={dialect}>{dialect}</option>)}
              </select>
            </Field>
            <Field label="زيّ الفريق في الصور" hint="يغيّر مظهر الموظفين في الصور التي ينشئها سهل">
              <select value={country} onChange={(event) => setCountry(event.target.value)} className={field}>
                {COUNTRIES.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
              </select>
            </Field>
          </div>
          <Button type="submit" disabled={updateProfile.isPending} className="gap-2"><Save className="size-4" />حفظ الحساب</Button>
        </form>
      </SettingsCard>

      <SettingsCard>
        <PanelHeader icon={LockKeyhole} title="الأمان" description="استخدم كلمة مرور قوية ومختلفة عن حساباتك الأخرى." />
        {anonymous ? (
          <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm">
            أنت تستخدم التجربة حالياً. <Link to="/auth" search={{ mode: "signup" }} className="font-bold text-primary underline">أنشئ حساباً دائماً</Link> لإدارة كلمة المرور.
          </div>
        ) : (
          <form
            className="max-w-xl space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const password = String(form.get("password") ?? "");
              const confirm = String(form.get("confirm") ?? "");
              if (password.length < 8) return onNotice({ type: "error", text: "كلمة المرور يجب أن تكون ٨ أحرف على الأقل." });
              if (password !== confirm) return onNotice({ type: "error", text: "كلمتا المرور غير متطابقتين." });
              setPasswordBusy(true);
              const { error } = await supabase.auth.updateUser({ password });
              setPasswordBusy(false);
              if (error) onNotice({ type: "error", text: "تعذّر تغيير كلمة المرور." });
              else {
                event.currentTarget.reset();
                onNotice({ type: "success", text: "تم تغيير كلمة المرور بنجاح." });
              }
            }}
          >
            <Field label="كلمة المرور الجديدة">
              <div className="relative"><input name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" className={cn(field, "ps-10")} /><Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword((value) => !value)} className="absolute left-1 top-1 size-8" aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button></div>
            </Field>
            <Field label="تأكيد كلمة المرور"><input name="confirm" type={showPassword ? "text" : "password"} autoComplete="new-password" className={field} /></Field>
            <Button type="submit" disabled={passwordBusy} className="gap-2">{passwordBusy ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}تغيير كلمة المرور</Button>
          </form>
        )}
        <div className="mt-6 border-t border-border pt-5">
          <Button type="button" variant="outline" className="gap-2 text-destructive hover:text-destructive" onClick={async () => { await supabase.auth.signOut(); window.location.assign("/"); }}><LogOut className="size-4" />تسجيل الخروج من هذا الجهاز</Button>
        </div>
      </SettingsCard>
    </div>
  );
}

function NotificationsPanel({ onNotice }: { onNotice: NoticeSetter }) {
  const { data, isLoading } = useNotificationPreferences();
  const update = useUpdateNotificationPreferences();
  const [preferences, setPreferences] = useState(defaultNotifications);

  useEffect(() => {
    if (!data) return;
    setPreferences({
      approval_ready: data.approval_ready,
      integration_disconnected: data.integration_disconnected,
      publishing_failed: data.publishing_failed,
      weekly_summary: data.weekly_summary,
      task_digest: data.task_digest,
      digest_frequency: data.digest_frequency,
      timezone: data.timezone,
    });
  }, [data]);

  const options = [
    { key: "approval_ready", title: "جاهزية عنصر للموافقة", description: "عندما ينتظر منشور أو تصميم قرارك." },
    { key: "publishing_failed", title: "فشل النشر", description: "تنبيه فوري عند تعذّر نشر محتوى مجدول." },
    { key: "integration_disconnected", title: "انقطاع اتصال", description: "عندما يحتاج حساب مرتبط إلى إعادة تسجيل الدخول." },
    { key: "task_digest", title: "ملخص المهام", description: "ملخص بالمهام التي أتمها الفريق وما ينتظر قرارك." },
    { key: "weekly_summary", title: "التقرير الأسبوعي", description: "نظرة موجزة على أداء الفريق كل أسبوع." },
  ] as const;

  if (isLoading) return <SettingsLoading />;

  return (
    <SettingsCard>
      <PanelHeader icon={Bell} title="التنبيهات" description="اختر الأحداث المهمة فقط، ويمكنك تعديلها في أي وقت." />
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.key} className="flex items-center justify-between gap-5 rounded-lg border border-border p-4">
            <div><p className="text-sm font-extrabold">{option.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{option.description}</p></div>
            <Switch checked={preferences[option.key]} onCheckedChange={(checked) => setPreferences((current) => ({ ...current, [option.key]: checked }))} aria-label={option.title} />
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
        <Field label="وتيرة الملخص">
          <select value={preferences.digest_frequency} onChange={(event) => setPreferences((current) => ({ ...current, digest_frequency: event.target.value }))} className={field}>
            <option value="daily">يومي</option><option value="weekly">أسبوعي</option><option value="monthly">شهري</option>
          </select>
        </Field>
        <Field label="المنطقة الزمنية">
          <select value={preferences.timezone} onChange={(event) => setPreferences((current) => ({ ...current, timezone: event.target.value }))} className={field}>
            <option value="Asia/Riyadh">الرياض</option><option value="Africa/Cairo">القاهرة</option><option value="Asia/Dubai">دبي</option><option value="Africa/Casablanca">الدار البيضاء</option>
          </select>
        </Field>
      </div>
      <Button
        type="button"
        className="mt-6 gap-2"
        disabled={update.isPending}
        onClick={async () => {
          try {
            await update.mutateAsync(preferences);
            onNotice({ type: "success", text: "تم حفظ تفضيلات التنبيهات." });
          } catch {
            onNotice({ type: "error", text: "تعذّر حفظ تفضيلات التنبيهات." });
          }
        }}
      >
        {update.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}حفظ التنبيهات
      </Button>
    </SettingsCard>
  );
}

function ConnectionsPanel({ workspaceId }: { workspaceId: string | undefined }) {
  return (
    <div className="space-y-5">
      <SettingsCard>
        <PanelHeader icon={Link2} title="الاتصالات" description="أوامر واتساب والوصول إلى حسابات النشر المرتبطة." />
        <Link to="/app/integrations" className="group flex items-center justify-between gap-4 rounded-lg border border-border p-4 transition hover:border-primary/30 hover:bg-primary/5">
          <span className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-secondary"><Workflow className="size-5" /></span><span><span className="block text-sm font-extrabold">إدارة كل التكاملات</span><span className="mt-1 block text-xs text-muted-foreground">منصات التواصل، البريد، المواقع وأدوات العمل</span></span></span>
          <ChevronLeft className="size-5 text-muted-foreground transition group-hover:-translate-x-1 group-hover:text-primary" />
        </Link>
      </SettingsCard>
      {workspaceId ? <SettingsCard><WhatsAppCommand workspaceId={workspaceId} /></SettingsCard> : <SettingsLoading />}
    </div>
  );
}

function BillingPanel({ doneCount, loading }: { doneCount: number; loading: boolean }) {
  const limit = 50;
  const usage = Math.min(100, (doneCount / limit) * 100);
  return (
    <SettingsCard>
      <PanelHeader icon={CircleGauge} title="الاستخدام والباقات" description="أرقام حقيقية من مهام مساحة العمل الحالية." />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-5"><p className="text-xs font-bold text-primary">الخطة الحالية</p><p className="mt-2 text-xl font-black">التجربة المجانية</p><p className="mt-2 text-sm text-muted-foreground">ابدأ بدون بطاقة دفع، ثم اختر الباقة المناسبة عند الحاجة.</p></div>
        <div className="rounded-lg border border-border p-5"><div className="flex items-center justify-between"><p className="text-sm font-extrabold">المهام المكتملة</p><Sparkles className="size-5 text-primary" /></div><p className="mt-3 text-3xl font-black">{loading ? "—" : doneCount}<span className="text-base font-semibold text-muted-foreground"> / {limit}</span></p><Progress value={usage} className="mt-4" /></div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"><div><p className="text-sm font-extrabold">هل تحتاج سعة أكبر؟</p><p className="mt-1 text-xs text-muted-foreground">قارن الحدود والمزايا قبل اختيار خطتك.</p></div><Button asChild className="gap-2"><Link to="/pricing">عرض الباقات<ChevronLeft className="size-4" /></Link></Button></div>
      <p className="mt-4 text-xs text-muted-foreground">لا توجد وسيلة دفع مرتبطة بهذه المساحة حالياً.</p>
    </SettingsCard>
  );
}

function SecretsPanel() {
  const queryClient = useQueryClient();
  const load = useServerFn(listSecrets);
  const save = useServerFn(upsertSecrets);
  const remove = useServerFn(deleteSecret);
  const test = useServerFn(testAiProviders);
  const [note, setNote] = useState<string | null>(null);
  const [showValue, setShowValue] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ["app-secrets"], queryFn: () => load() });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["app-secrets"] });
  const saveMutation = useMutation({
    mutationFn: (input: { entries?: { name: string; value: string }[]; bulk?: string }) => save({ data: input }),
    onSuccess: async (result) => { setNote(result.saved > 0 ? `تم حفظ ${result.saved} مفتاح بنجاح.` : "لم يُقرأ أي مفتاح. تأكد من صيغة NAME=value."); await refresh(); },
    onError: () => setNote("تعذّر حفظ المفتاح."),
  });
  const deleteMutation = useMutation({ mutationFn: (name: string) => remove({ data: { name } }), onSuccess: async () => { setNote("تم حذف المفتاح."); await refresh(); } });
  const testMutation = useMutation({ mutationFn: () => test(), onSuccess: (result) => setNote(result.message), onError: () => setNote("تعذّر الاختبار.") });

  return (
    <SettingsCard>
      <PanelHeader icon={KeyRound} title="مفاتيح الذكاء" description="تُحفظ القيم بعيداً عن المتصفح ولا نعرضها كاملة بعد الحفظ." />
      {note ? <p role="status" className="mb-5 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold">{note}</p> : null}
      <div className="mb-6 space-y-2">
        <h3 className="text-sm font-black">المحفوظ حالياً</h3>
        {isLoading ? <div className="h-16 animate-pulse rounded-lg bg-secondary" /> : null}
        {!isLoading && (data?.stored ?? []).length === 0 ? <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">لا يوجد مفتاح محفوظ بعد.</p> : null}
        {(data?.stored ?? []).map((secret) => <div key={secret.name} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 text-sm"><span className="font-mono font-bold">{secret.name}</span><span className="flex items-center gap-3"><span className="font-semibold text-primary">{secret.preview}</span><Button type="button" size="sm" variant="ghost" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(secret.name)} className="text-destructive hover:text-destructive">حذف</Button></span></div>)}
      </div>
      {(data?.missing ?? []).length ? <div className="mb-6"><h3 className="mb-2 text-sm font-black">مفاتيح ينتظرها التطبيق</h3><div className="grid gap-2 sm:grid-cols-2">{(data?.missing ?? []).map((item) => <div key={item.name} className="rounded-lg border border-dashed border-border p-3"><p className="break-all font-mono text-xs font-bold">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">{item.label}</p></div>)}</div></div> : null}
      <form className="space-y-4 rounded-lg bg-secondary/50 p-5" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const values = new FormData(form); const name = String(values.get("name") ?? "").trim(); const value = String(values.get("value") ?? "").trim(); saveMutation.mutate({ entries: name && value ? [{ name, value }] : [], bulk: String(values.get("bulk") ?? "") }); form.reset(); }}>
        <h3 className="text-sm font-black">إضافة أو تحديث مفتاح</h3>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="اسم المفتاح"><input name="name" placeholder="GEMINI_API_KEY" className={cn(field, "font-mono")} /></Field><Field label="القيمة"><div className="relative"><input name="value" type={showValue ? "text" : "password"} autoComplete="off" className={cn(field, "ps-10")} /><Button type="button" variant="ghost" size="icon" className="absolute left-1 top-1 size-8" onClick={() => setShowValue((value) => !value)} aria-label={showValue ? "إخفاء القيمة" : "إظهار القيمة"}>{showValue ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button></div></Field></div>
        <Field label="إضافة عدة مفاتيح" hint="سطر لكل مفتاح بصيغة NAME=value"><textarea name="bulk" spellCheck={false} placeholder={"GEMINI_API_KEY=…\nOPENROUTER_API_KEY=…"} className={cn(field, "min-h-28 resize-y font-mono")} /></Field>
        <div className="flex flex-wrap gap-3"><Button type="submit" disabled={saveMutation.isPending} className="gap-2">{saveMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}حفظ المفتاح</Button><Button type="button" variant="outline" onClick={() => testMutation.mutate()} disabled={testMutation.isPending} className="gap-2">{testMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}اختبار الاتصال</Button></div>
      </form>
    </SettingsCard>
  );
}