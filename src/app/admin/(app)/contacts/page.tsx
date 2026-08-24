import { redirect } from "next/navigation";

import { listContacts } from "@/features/crm/actions/contacts";
import { ContactsTable } from "@/features/crm/contacts-table";

export const metadata = { title: "Contacts" };

export default async function AdminContactsPage() {
  let contacts;
  try {
    contacts = await listContacts({ crmOnly: true });
  } catch {
    redirect("/admin/login?error=supabase_not_configured");
  }

  return <ContactsTable contacts={contacts} />;
}
