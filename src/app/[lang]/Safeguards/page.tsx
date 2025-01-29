import SafeG from "@/components/safeG/SafeG";

export const dynamic = "force-dynamic";

export default function SafeguardsPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <div>
      <SafeG lang={params.lang} />
    </div>
  );
}
