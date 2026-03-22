import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useSaveProfile } from "@/hooks/useAuthMutations";
import type { ProfileFormData } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  email?: string;
}

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { token, setUser } = useAuth();
  const saveProfileMutation = useSaveProfile();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    saveProfileMutation.reset();
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("profile.errors.firstNameRequired");
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = t("profile.errors.firstNameMin");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("profile.errors.lastNameRequired");
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = t("profile.errors.lastNameMin");
    }

    if (!formData.dob) {
      newErrors.dob = t("profile.errors.dobRequired");
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      if (dobDate >= today) {
        newErrors.dob = t("profile.errors.dobFuture");
      }
    }

    if (!formData.gender) {
      newErrors.gender = t("profile.errors.genderRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("profile.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("profile.errors.emailInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    saveProfileMutation.mutate(
      { token: token!, profileData: formData },
      {
        onSuccess: (result) => {
          setUser(result.user);
          navigate("/", { replace: true });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-linear-to-br from-background via-background to-muted/30">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-lg relative z-10 shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center mb-2 shadow-lg shadow-primary/20">
            <svg
              className="w-8 h-8 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t("profile.title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("profile.subtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {saveProfileMutation.error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center animate-in fade-in slide-in-from-top-1 duration-200">
              {saveProfileMutation.error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  {t("profile.firstName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder={t("profile.firstNamePlaceholder")}
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className={cn(errors.firstName && "border-destructive focus-visible:ring-destructive/30")}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive animate-in fade-in duration-200">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Middle Name */}
              <div className="space-y-1.5">
                <Label htmlFor="middleName" className="text-sm font-medium">
                  {t("profile.middleName")}
                </Label>
                <Input
                  id="middleName"
                  placeholder={t("profile.middleNamePlaceholder")}
                  value={formData.middleName}
                  onChange={(e) => handleChange("middleName", e.target.value)}
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  {t("profile.lastName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder={t("profile.lastNamePlaceholder")}
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className={cn(errors.lastName && "border-destructive focus-visible:ring-destructive/30")}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive animate-in fade-in duration-200">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* DOB & Gender Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div className="space-y-1.5">
                <Label htmlFor="dob" className="text-sm font-medium">
                  {t("profile.dob")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className={cn(
                    "appearance-none",
                    errors.dob && "border-destructive focus-visible:ring-destructive/30"
                  )}
                />
                {errors.dob && (
                  <p className="text-xs text-destructive animate-in fade-in duration-200">
                    {errors.dob}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-sm font-medium">
                  {t("profile.gender")} <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange("gender", value)}
                >
                  <SelectTrigger
                    id="gender"
                    className={cn(
                      errors.gender && "border-destructive focus:ring-destructive/30"
                    )}
                  >
                    <SelectValue placeholder={t("profile.genderPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("profile.genderMale")}</SelectItem>
                    <SelectItem value="female">{t("profile.genderFemale")}</SelectItem>
                    <SelectItem value="other">{t("profile.genderOther")}</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      {t("profile.genderPreferNot")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-xs text-destructive animate-in fade-in duration-200">
                    {errors.gender}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                {t("profile.email")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("profile.emailPlaceholder")}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={cn(errors.email && "border-destructive focus-visible:ring-destructive/30")}
              />
              {errors.email && (
                <p className="text-xs text-destructive animate-in fade-in duration-200">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={saveProfileMutation.isPending}
              className={cn(
                "w-full h-11 text-sm font-semibold tracking-wide transition-all duration-300",
                "bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              )}
            >
              {saveProfileMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {t("profile.saving")}
                </span>
              ) : (
                t("profile.submit")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}





// // TODO
// import { useRef, type JSX } from "react";
// import { format, isPast, isToday, isTomorrow, parseISO } from "date-fns";
// import {
//   Plus,
//   CalendarDays,
//   ChevronDown,
//   X,
//   GripVertical,
//   AlertCircle,
//   Flame,
//   Minus,
//   Search,
//   User,
//   LogOut
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// type Priority = "High" | "Mid" | "Low";
// type Status = "TODO" | "InProgress" | "Completed";

// interface Assignee {
//   id: string;
//   name: string;
//   avatar: string;
//   initials: string;
// }

// interface Ticket {
//   id: string;
//   title: string;
//   description: string;
//   status: Status;
//   priority: Priority;
//   assigneeId: string;
//   createdAt: string;
//   dueDate: string;
// }

// // ─── Dummy Data ───────────────────────────────────────────────────────────────

// const ASSIGNEES: Assignee[] = [
//   { id: "u1", name: "Arjun Mehta", avatar: "", initials: "AM", },
//   { id: "u2", name: "Priya Sharma", avatar: "", initials: "PS" },
//   { id: "u3", name: "Rohan Das", avatar: "", initials: "RD" },
//   { id: "u4", name: "Sneha Iyer", avatar: "", initials: "SI" },
//   { id: "u5", name: "Vikram Nair", avatar: "", initials: "VN" },
// ];

// const INITIAL_TICKETS: Ticket[] = [
//   {
//     id: "t1", title: "Design new onboarding flow",
//     description: "Redesign the user onboarding experience to reduce drop-off rates. Include tooltips, progress indicators, and contextual help text across all major steps.",
//     status: "TODO", priority: "High", assigneeId: "u1",
//     createdAt: "2025-03-01", dueDate: "2026-03-28",
//   },
//   {
//     id: "t2", title: "Fix authentication bug",
//     description: "Users are being logged out unexpectedly after 10 minutes even when they have active sessions. Investigate JWT token refresh logic.",
//     status: "TODO", priority: "High", assigneeId: "u2",
//     createdAt: "2025-03-05", dueDate: "2026-03-23",
//   },
//   {
//     id: "t3", title: "Add dark mode support",
//     description: "Implement system-wide dark mode using CSS variables and Tailwind dark class. Ensure all components are themed correctly.",
//     status: "TODO", priority: "Mid", assigneeId: "u3",
//     createdAt: "2025-03-08", dueDate: "2026-04-10",
//   },
//   {
//     id: "t4", title: "Migrate database to PostgreSQL",
//     description: "Move from MySQL to PostgreSQL. Write migration scripts, update ORM configs, and test all queries for compatibility.",
//     status: "InProgress", priority: "High", assigneeId: "u4",
//     createdAt: "2025-02-20", dueDate: "2026-03-22",
//   },
//   {
//     id: "t5", title: "Build reporting dashboard",
//     description: "Create an analytics dashboard with charts showing user growth, revenue trends, and feature usage. Use Recharts.",
//     status: "InProgress", priority: "Mid", assigneeId: "u1",
//     createdAt: "2025-03-10", dueDate: "2026-04-05",
//   },
//   {
//     id: "t6", title: "Write API documentation",
//     description: "Document all REST endpoints using OpenAPI 3.0. Include request/response examples, auth headers, and error codes.",
//     status: "InProgress", priority: "Low", assigneeId: "u5",
//     createdAt: "2025-03-12", dueDate: "2026-04-15",
//   },
//   {
//     id: "t7", title: "Set up CI/CD pipeline",
//     description: "Configure GitHub Actions for automated testing, building, and deployment to staging and production environments.",
//     status: "Completed", priority: "Mid", assigneeId: "u2",
//     createdAt: "2025-02-10", dueDate: "2026-03-01",
//   },
//   {
//     id: "t8", title: "Performance audit & optimisation",
//     description: "Run Lighthouse audits, identify bottlenecks, and optimise bundle size, image loading, and API response times.",
//     status: "Completed", priority: "High", assigneeId: "u3",
//     createdAt: "2025-02-15", dueDate: "2026-03-10",
//   },
//   {
//     id: "t9", title: "User feedback survey integration",
//     description: "Embed NPS survey after key user actions using a third-party SDK. Store results and display in admin panel.",
//     status: "Completed", priority: "Low", assigneeId: "u4",
//     createdAt: "2025-02-18", dueDate: "2026-03-15",
//   },
// ];

// const PRIORITY_CONFIG: Record<Priority, { label: string; icon: JSX.Element; classes: string }> = {
//   High: {
//     label: "High",
//     icon: <Flame size={11} />,
//     classes: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
//   },
//   Mid: {
//     label: "Mid",
//     icon: <AlertCircle size={11} />,
//     classes: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
//   },
//   Low: {
//     label: "Low",
//     icon: <Minus size={11} />,
//     classes: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
//   },
// };

// const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string }> = {
//   TODO: { label: "To Do", color: "text-slate-500", dot: "bg-slate-400" },
//   InProgress: { label: "In Progress", color: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
//   Completed: { label: "Completed", color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
// };

// function dueDateStyle(dateStr: string) {
//   const d = parseISO(dateStr);
//   if (isPast(d) && !isToday(d)) return "text-red-500 dark:text-red-400 font-semibold";
//   if (isToday(d)) return "text-orange-500 dark:text-orange-400 font-semibold";
//   if (isTomorrow(d)) return "text-amber-500 dark:text-amber-400 font-semibold";
//   return "text-slate-500 dark:text-slate-400";
// }

// function Avatar({ assignee, size = "sm" }: { assignee: Assignee; size?: "sm" | "md" }) {
//   const sz = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
//   const colors = ["bg-violet-500", "bg-pink-500", "bg-teal-500", "bg-amber-500", "bg-blue-500"];
//   const color = colors[parseInt(assignee.id.replace("u", "")) % colors.length];
//   return (
//     <div className={`${sz} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0`}>
//       {assignee.initials?.trim()?.[0]}
//     </div>
//   );
// }

// // ─── Multi-Select Dropdown ────────────────────────────────────────────────────

// interface MultiSelectProps {
//   label: string;
//   options: { value: string; label: string; extra?: JSX.Element }[];
//   selected: string[];
//   onChange: (vals: string[]) => void;
// }

// function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   const toggle = (val: string) =>
//     onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         onClick={() => setOpen((o) => !o)}
//         className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-sm font-medium transition-all
//           ${selected.length
//             ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-500"
//             : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
//           }`}
//       >
//         {label}
//         {selected.length > 0 && (
//           <span className="bg-blue-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
//             {selected.length}
//           </span>
//         )}
//         <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
//       </button>
//       {open && (
//         <>
//           <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
//           <div className="absolute top-full mt-1 left-0 z-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm shadow-xl min-w-50 py-1 overflow-hidden">
//             {options.map((opt) => (
//               <button
//                 key={opt.value}
//                 onClick={() => toggle(opt.value)}
//                 className="min-w-50 flex items-center justify-start gap-2.5 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 transition-colors"
//               >
//                 <div className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all
//                   ${selected.includes(opt.value)
//                     ? "bg-blue-500 border-blue-500"
//                     : "border-slate-300 dark:border-slate-600"}`}>
//                   {selected.includes(opt.value) && <X size={10} className="text-white" strokeWidth={3} />}
//                 </div>
//                 {opt.extra}
//                 {opt.label}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// // ─── Date Filter ──────────────────────────────────────────────────────────────

// function DateFilter({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
//   return (
//     <div className="flex items-center gap-1.5">
//       <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
//         <CalendarDays size={14} />
//         {label}
//       </label>
//       <input
//         type="date"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="px-2.5 py-1.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//       />
//       {value && (
//         <button onClick={() => onChange("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
//           <X size={14} />
//         </button>
//       )}
//     </div>
//   );
// }

// // ─── Ticket Modal ─────────────────────────────────────────────────────────────

// interface ModalProps {
//   ticket: Partial<Ticket> | null;
//   onClose: () => void;
//   onSave: (t: Ticket) => void;
// }

// function TicketModal({ ticket, onClose, onSave }: ModalProps) {
//   const isNew = !ticket?.id;
//   const [form, setForm] = useState<Partial<Ticket>>({
//     title: "",
//     description: "",
//     dueDate: "",
//     priority: "Mid",
//     assigneeId: "",
//     status: "TODO",
//     createdAt: format(new Date(), "yyyy-MM-dd"),
//     ...ticket,
//   });

//   const set = (key: keyof Ticket, val: string) => setForm((f) => ({ ...f, [key]: val }));

//   const handleSave = () => {
//     if (!form.title?.trim()) return;
//     onSave({
//       id: form.id || `t${Date.now()}`,
//       title: form.title!,
//       description: form.description || "",
//       status: form.status as Status,
//       priority: form.priority as Priority,
//       assigneeId: form.assigneeId || "",
//       createdAt: form.createdAt || format(new Date(), "yyyy-MM-dd"),
//       dueDate: form.dueDate || "",
//     });
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
//           <div>
//             <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
//               {isNew ? "Create Ticket" : "Edit Ticket"}
//             </h2>
//             {!isNew && (
//               <p className="text-xs text-slate-400 mt-0.5">{ticket?.id}</p>
//             )}
//           </div>
//           <button onClick={onClose} className="w-8 h-8 rounded-sm flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-all">
//             <X size={16} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5 space-y-4">
//           {/* Title */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Title *</label>
//             <input
//               type="text"
//               value={form.title}
//               onChange={(e) => set("title", e.target.value)}
//               placeholder="Enter ticket title..."
//               className="w-full px-3.5 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 transition"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
//             <textarea
//               value={form.description}
//               onChange={(e) => set("description", e.target.value)}
//               placeholder="Add a description..."
//               rows={3}
//               className="w-full px-3.5 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 transition resize-none"
//             />
//           </div>

//           {/* Row: Due Date + Priority */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Due Date</label>
//               <input
//                 type="date"
//                 value={form.dueDate}
//                 onChange={(e) => set("dueDate", e.target.value)}
//                 className="w-full px-3.5 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
//               <select
//                 value={form.priority}
//                 onChange={(e) => set("priority", e.target.value)}
//                 className="w-full px-3.5 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               >
//                 <option value="High">🔥 High</option>
//                 <option value="Mid">⚡ Mid</option>
//                 <option value="Low">➖ Low</option>
//               </select>
//             </div>
//           </div>

//           {/* Assignee */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Assignee</label>
//             <select
//               value={form.assigneeId}
//               onChange={(e) => set("assigneeId", e.target.value)}
//               className="w-full px-3.5 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//             >
//               <option value="">— Unassigned —</option>
//               {ASSIGNEES.map((a) => (
//                 <option key={a.id} value={a.id}>{a.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
//           <button onClick={onClose} className="px-4 py-2 rounded-sm text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!form.title?.trim()}
//             className="px-5 py-2 rounded-sm text-sm font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-sm shadow-blue-500/20"
//           >
//             {isNew ? "Create Ticket" : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Ticket Card ──────────────────────────────────────────────────────────────

// interface CardProps {
//   ticket: Ticket;
//   onClick: () => void;
//   onDragStart: (e: React.DragEvent) => void;
//   isCompleted: boolean;
// }

// function TicketCard({ ticket, onClick, onDragStart, isCompleted }: CardProps) {
//   const assignee = ASSIGNEES.find((a) => a.id === ticket.assigneeId);
//   const pc = PRIORITY_CONFIG[ticket.priority];

//   return (
//     <div
//       draggable={!isCompleted}
//       onDragStart={isCompleted ? undefined : onDragStart}
//       onClick={onClick}
//       className={`group bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 p-3.5 
//         shadow-sm hover:shadow-md dark:shadow-none dark:hover:border-slate-600 transition-all
//         ${!isCompleted ? "cursor-grab active:cursor-grabbing hover:-translate-y-0.5" : "cursor-pointer opacity-80"}
//       `}
//     >
//       {/* Top row: drag handle + priority badge */}
//       <div className="flex items-start justify-between gap-2 mb-2">
//         <div className="flex items-center gap-1.5 min-w-0">
//           {!isCompleted && (
//             <GripVertical size={13} className="text-slate-300 dark:text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors" />
//           )}
//           <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${pc.classes}`}>
//             {pc.icon}
//             {pc.label}
//           </span>
//         </div>
//         <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-mono">{ticket.id}</span>
//       </div>

//       {/* Title */}
//       <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1.5 leading-snug line-clamp-2">
//         {ticket.title}
//       </p>

//       {/* Description */}
//       <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed line-clamp-2">
//         {ticket.description}
//       </p>

//       {/* Footer */}
//       <div className="flex items-center justify-between">
//         {ticket.dueDate ? (
//           <div className={`flex items-center gap-1 text-xs ${dueDateStyle(ticket.dueDate)}`}>
//             <CalendarDays size={11} />
//             <span>{format(parseISO(ticket.dueDate), "MMM d")}</span>
//           </div>
//         ) : (
//           <span className="text-xs text-slate-300 dark:text-slate-600">No due date</span>
//         )}
//         {assignee ? (
//           <div className="flex items-center gap-1.5">
//             <span className="text-[11px] text-slate-500 dark:text-slate-400">{assignee.name.split(" ")[0]}</span>
//             <Avatar assignee={assignee} size="sm" />
//           </div>
//         ) : (
//           <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
//             <User size={11} className="text-slate-400" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Column ───────────────────────────────────────────────────────────────────

// interface ColumnProps {
//   status: Status;
//   tickets: Ticket[];
//   onDrop: (ticketId: string, targetStatus: Status) => void;
//   onCardClick: (t: Ticket) => void;
//   onDragStart: (ticketId: string) => void;
// }

// function Column({ status, tickets, onDrop, onCardClick, onDragStart }: ColumnProps) {
//   const [isDragOver, setIsDragOver] = useState(false);
//   const cfg = STATUS_CONFIG[status];
//   const isCompleted = status === "Completed";

//   const COLUMN_STYLES: Record<Status, string> = {
//     TODO: "bg-slate-50 dark:bg-slate-900/50",
//     InProgress: "bg-blue-50/50 dark:bg-blue-950/20",
//     Completed: "bg-emerald-50/50 dark:bg-emerald-950/20",
//   };

//   return (
//     <div
//       onDragOver={(e) => { if (!isCompleted) { e.preventDefault(); setIsDragOver(true); } }}
//       onDragLeave={() => setIsDragOver(false)}
//       onDrop={(e) => {
//         e.preventDefault();
//         setIsDragOver(false);
//         if (!isCompleted) {
//           const id = e.dataTransfer.getData("ticketId");
//           if (id) onDrop(id, status);
//         }
//       }}
//       className={`flex flex-col rounded-lg border transition-all min-h-125
//         ${COLUMN_STYLES[status]}
//         ${isDragOver
//           ? "border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-900/30"
//           : "border-slate-200 dark:border-slate-700/50"
//         }`}
//     >
//       {/* Column header */}
//       <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 dark:border-slate-700/50">
//         <div className="flex items-center gap-2">
//           <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
//           <h3 className={`text-sm font-bold tracking-tight ${cfg.color}`}>{cfg.label}</h3>
//           <span className="ml-1 text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
//             {tickets.length}
//           </span>
//         </div>
//         {isCompleted && (
//           <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">drop disabled</span>
//         )}
//       </div>

//       {/* Cards */}
//       <div className="flex flex-col gap-2.5 p-3 flex-1">
//         {tickets.length === 0 && (
//           <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-40">
//             <div className="w-10 h-10 rounded-sm bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-2">
//               <Search size={16} className="text-slate-400" />
//             </div>
//             <p className="text-xs text-slate-400 dark:text-slate-500">No tickets</p>
//           </div>
//         )}
//         {tickets.map((t) => (
//           <TicketCard
//             key={t.id}
//             ticket={t}
//             isCompleted={isCompleted}
//             onClick={() => onCardClick(t)}
//             onDragStart={(e) => {
//               e.dataTransfer.setData("ticketId", t.id);
//               onDragStart(t.id);
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function JiraBoard() {
//     const { logout } = useAuth();
//   const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
//   const [modal, setModal] = useState<{ open: boolean; ticket: Partial<Ticket> | null }>({ open: false, ticket: null });

//   // Filters
//   const [statusFilter, setStatusFilter] = useState<string[]>([]);
//   const [assigneeFilter, setAssigneeFilter] = useState<string[]>([]);
//   const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
//   const [createdAfter, setCreatedAfter] = useState("");
//   const [dueAfter, setDueAfter] = useState("");

//   const activeFiltersCount = statusFilter.length + assigneeFilter.length + priorityFilter.length + (createdAfter ? 1 : 0) + (dueAfter ? 1 : 0);

//   const clearAll = () => {
//     setStatusFilter([]); setAssigneeFilter([]); setPriorityFilter([]);
//     setCreatedAfter(""); setDueAfter("");
//   };

//   const filtered = tickets.filter((t) => {
//     if (statusFilter.length && !statusFilter.includes(t.status)) return false;
//     if (assigneeFilter.length && !assigneeFilter.includes(t.assigneeId)) return false;
//     if (priorityFilter.length && !priorityFilter.includes(t.priority)) return false;
//     if (createdAfter && t.createdAt < createdAfter) return false;
//     if (dueAfter && t.dueDate && t.dueDate < dueAfter) return false;
//     return true;
//   });

//   const byStatus = (s: Status) => filtered.filter((t) => t.status === s);

//   const handleDrop = (ticketId: string, newStatus: Status) => {
//     setTickets((prev) =>
//       prev.map((t) => (t.id === ticketId && t.status !== "Completed" ? { ...t, status: newStatus } : t))
//     );
//   };

//   const handleSave = (t: Ticket) => {
//     setTickets((prev) => {
//       const exists = prev.find((x) => x.id === t.id);
//       return exists ? prev.map((x) => (x.id === t.id ? t : x)) : [...prev, t];
//     });
//     setModal({ open: false, ticket: null });
//   };

//   const COLUMNS: Status[] = ["TODO", "InProgress", "Completed"];

//   return (
//     <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
//       {/* Top bar */}
//       <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-sm bg-blue-600 flex items-center justify-center flex-shrink-0">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
//                 <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
//                 <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div>
//               <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none">Project Board</h1>
//             </div>
//           </div>
//          <div className="flex justify-end items-center gap-2">
//            <button
//             onClick={() => setModal({ open: true, ticket: null })}
//             className="flex items-center gap-2 px-4 py-2 rounded-sm bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold transition-all shadow-sm shadow-blue-500/30"
//           >
//             <Plus size={16} strokeWidth={2.5} />
//             Create Ticket
//           </button>
//             <button
//             onClick={() => {
//               logout();
//               setModal({ open: true, ticket: null })}}
//             className="flex items-center gap-2 px-4 py-2 rounded-sm bg-red-500 hover:bg-red-700 active:scale-95 text-white text-sm font-bold transition-all shadow-sm shadow-blue-500/30"
//           >
//             <LogOut size={16} strokeWidth={2.5} />
//             logout?
//           </button>
//          </div>
//         </div>
//       </div>

//       {/* Filters bar */}
//       <div className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-2.5">
//           <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">Filters</span>

//           <MultiSelect
//             label="Status"
//             selected={statusFilter}
//             onChange={setStatusFilter}
//             options={COLUMNS.map((s) => ({
//               value: s,
//               label: STATUS_CONFIG[s].label,
//               extra: <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].dot} flex-shrink-0`} />,
//             }))}
//           />

//           <MultiSelect
//             label="Assignee"
//             selected={assigneeFilter}
//             onChange={setAssigneeFilter}
//             options={ASSIGNEES.map((a) => ({
//               value: a.id,
//               label: a.name,
//               extra: <Avatar assignee={a} size="sm" />,
//             }))}
//           />

//           <MultiSelect
//             label="Priority"
//             selected={priorityFilter}
//             onChange={setPriorityFilter}
//             options={(["High", "Mid", "Low"] as Priority[]).map((p) => ({
//               value: p,
//               label: p,
//               extra: <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${PRIORITY_CONFIG[p].classes}`}>{PRIORITY_CONFIG[p].icon}</span>,
//             }))}
//           />

//           <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

//           <DateFilter label="Created after" value={createdAfter} onChange={setCreatedAfter} />
//           <DateFilter label="Due after" value={dueAfter} onChange={setDueAfter} />

//           {activeFiltersCount > 0 && (
//             <button
//               onClick={clearAll}
//               className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1"
//             >
//               <X size={12} />
//               Clear all ({activeFiltersCount})
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Board */}
//       <div className="max-w-7xl mx-auto px-6 py-6">
//         <div className="grid grid-cols-3 gap-5">
//           {COLUMNS.map((s) => (
//             <Column
//               key={s}
//               status={s}
//               tickets={byStatus(s)}
//               onDrop={handleDrop}
//               onCardClick={(t) => setModal({ open: true, ticket: t })}
//               onDragStart={() => {}}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {modal.open && (
//         <TicketModal
//           ticket={modal.ticket}
//           onClose={() => setModal({ open: false, ticket: null })}
//           onSave={handleSave}
//         />
//       )}
//     </div>
//   );
// }