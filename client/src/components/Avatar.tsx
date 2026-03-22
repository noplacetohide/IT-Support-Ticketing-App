import type { Assignee } from "@/types/tickets";

export function Avatar({ assignee, size = "sm" }: { assignee: Assignee; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  const colors = ["bg-violet-500", "bg-pink-500", "bg-teal-500", "bg-amber-500", "bg-blue-500"];
  const color = colors[parseInt(assignee.id.replace("u", "")) % colors.length];
  return (
    <div className={`${sz} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0`}>
      {assignee.initials?.trim()?.[0]}
    </div>
  );
}