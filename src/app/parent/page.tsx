
"use client";

import ParentPortal from "@/components/parent/parent-portal";
import { AppLayout } from "@/components/layout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentPage() {
  const { user, loading } = useCurrentUser();

  if (loading || !user) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-2 gap-4">
             <Skeleton className="h-24 w-full" />
             <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ParentPortal user={user} />
    </AppLayout>
  );
}
