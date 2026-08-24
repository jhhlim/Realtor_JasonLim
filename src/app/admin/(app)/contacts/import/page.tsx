import { ContactImportWizard } from "@/features/crm/contact-import-wizard";

export const metadata = { title: "Import contacts" };

export default function ImportContactsPage() {
  return <ContactImportWizard mode="apple" />;
}
