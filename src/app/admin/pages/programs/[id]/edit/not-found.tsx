import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <h2 className="text-2xl font-bold">Program Not Found</h2>
      <p className="text-gray-500">The program you&apos;re looking for doesn&apos;t exist.</p>
      <Button asChild>
        <Link href="/admin/pages/programs" passHref prefetch>Back to Programs</Link>
      </Button>
    </div>
  );
}
