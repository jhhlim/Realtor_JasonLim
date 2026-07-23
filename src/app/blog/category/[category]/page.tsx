import { redirect } from "next/navigation";

/** Category routes redirect to the filtered blog index. */
export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  redirect(`/blog?category=${encodeURIComponent(category)}`);
}
