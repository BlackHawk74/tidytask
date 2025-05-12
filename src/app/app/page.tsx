"use client"

import { useState, useEffect } from "react"; 
import { DraggableTaskBoard } from "@/components/draggable-task-board";
import { Skeleton } from "@/components/ui/skeleton"; 

export default function AppPage() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className="container mx-auto py-6">
      {/* Render board only after mounting, show skeleton otherwise */}
      {hasMounted ? (
        <DraggableTaskBoard />
      ) : (
        // Simple skeleton loading state
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      )}
    </div>
  );
}
