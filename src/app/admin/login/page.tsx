import { Suspense } from "react";

import AdminLoginPage from "./login-form";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
      <AdminLoginPage />
    </Suspense>
  );
}
