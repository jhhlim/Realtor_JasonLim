import { AdminSidebar } from "@/components/crm/admin-sidebar";
import { GlobalQuickAdd } from "@/components/crm/global-quick-add";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let email: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
  } catch {
    email = null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar userEmail={email} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <GlobalQuickAdd />
    </div>
  );
}
