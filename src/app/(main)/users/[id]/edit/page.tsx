import React, { Suspense } from "react";
import EditUserClient from "./EditUserClient";
import { AppSkeleton } from "@/components";

export default function EditUserPage() {
  return (
    <Suspense
      fallback={
        <div className="container-fluid p-0">
          <div className="p-4 rounded-3 border" style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
            <AppSkeleton width="40%" height={24} className="mb-3" />
            <AppSkeleton width="100%" height={45} className="mb-2" />
            <AppSkeleton width="100%" height={45} />
          </div>
        </div>
      }
    >
      <EditUserClient />
    </Suspense>
  );
}
