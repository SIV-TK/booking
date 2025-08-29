
"use client";

import TeacherDashboard from "@/components/teacher/teacher-dashboard";
import { AppLayout } from "@/components/layout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherPage() {
  const { user, loading } = useCurrentUser();

  if (loading || !user) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-3 gap-4">
             <Skeleton className="h-64 col-span-2 w-full" />
             <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <TeacherDashboard user={user} />
    </AppLayout>
  );
}
