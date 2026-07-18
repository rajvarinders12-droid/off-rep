import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-400 dark:text-zinc-600" />
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 animate-pulse">
        Loading admin dashboard...
      </p>
    </div>
  );
}
