import { getProgram } from "@/app/actions/pages/programsAction";
import { notFound } from "next/navigation";
import EditProgramForm from "./EditProgramForm";

interface EditProgramPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProgram(props: EditProgramPageProps) {
  const params = await props.params;
  const { data: program, success } = await getProgram(params.id);

  if (!success || !program) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Program</h1>
        <p className="text-gray-500 mt-2">Update program details.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <EditProgramForm program={program} />
      </div>
    </div>
  );
}
