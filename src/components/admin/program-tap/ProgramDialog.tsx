"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProgramsPages } from "@/types/program-tab";
import { useToast } from "@/hooks/use-toast";
import {
  createProgram,
  updateProgram,
  deleteProgram,
} from "@/app/actions/program-actions";

interface ProgramDialogProps {
  programs: ProgramsPages[];
  onProgramsUpdate: (updatedPrograms: ProgramsPages[]) => void;
}

export function ProgramDialog({
  programs,
  onProgramsUpdate,
}: ProgramDialogProps) {
  const [open, setOpen] = useState(false);
  const [name_en, setNameEn] = useState("");
  const [name_ar, setNameAr] = useState("");
  const [editingProgram, setEditingProgram] = useState<ProgramsPages | null>(
    null
  );
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (editingProgram) {
        result = await updateProgram({
          id: editingProgram.id,
          name_en,
          name_ar,
        });
      } else {
        result = await createProgram({ name_en, name_ar });
      }

      if (result.success) {
        toast({
          title: `Program ${editingProgram ? "updated" : "created"}`,
          description: `The program has been ${
            editingProgram ? "updated" : "created"
          } successfully.`,
        });
        onProgramsUpdate(result.programs);
        setOpen(false);
        setNameEn("");
        setNameAr("");
        setEditingProgram(null);
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (program: ProgramsPages) => {
    setEditingProgram(program);
    setNameEn(program.name_en);
    setNameAr(program.name_ar);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        const result = await deleteProgram(id);
        if (result.success) {
          toast({
            title: "Program deleted",
            description: "The program has been deleted successfully.",
          });
          onProgramsUpdate(result.programs);
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Programs</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingProgram ? "Edit Program" : "Create Program"}
          </DialogTitle>
          <DialogDescription>
            {editingProgram
              ? "Edit the program details here."
              : "Add a new program here."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name_en" className="text-right">
                Name (EN)
              </Label>
              <Input
                id="name_en"
                value={name_en}
                onChange={(e) => setNameEn(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name_ar" className="text-right">
                Name (AR)
              </Label>
              <Input
                id="name_ar"
                value={name_ar}
                onChange={(e) => setNameAr(e.target.value)}
                className="col-span-3"
                dir="rtl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {editingProgram ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
        {programs.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Existing Programs</h3>
            <ul className="mt-2 space-y-2">
              {programs.map((program) => (
                <li
                  key={program.id}
                  className="flex items-center justify-between"
                >
                  <span>{program.name_en}</span>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(program)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(program.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
