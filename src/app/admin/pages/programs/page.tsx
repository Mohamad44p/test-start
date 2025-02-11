import { getPrograms, deleteProgram } from "@/app/actions/pages/programsAction";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil, Plus, Trash } from "lucide-react";

export default async function AdminPrograms() {
  const { data: programs } = await getPrograms();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programs Management</h1>
        <Link href="/admin/pages/programs/create" passHref prefetch>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Program
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs?.map((program) => (
          <div
            key={program.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-48">
              <Image
                src={program.imageUrl}
                alt={program.name_en}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{program.name_en}</h3>
              <p className="text-gray-600 mt-2 line-clamp-2">
                {program.description_en}
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <Link href={`/admin/pages/programs/${program.id}/edit`} passHref prefetch>
                  <Button variant="outline" size="sm">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteProgram(program.id);
                  }}
                >
                  <Button variant="destructive" size="sm">
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
