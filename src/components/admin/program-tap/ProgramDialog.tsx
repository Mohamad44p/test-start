"use client";

import { useState, useEffect } from "react";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { ProgramsPages, ProgramCategory } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import {
  createProgram,
  updateProgram,
  createCategory,
  getCategories,
  deleteProgram,
} from "@/app/actions/program-actions";

interface ProgramDialogProps {
  programs: ProgramsPages[];
  onProgramsUpdate: (updatedPrograms: ProgramsPages[]) => void;
}

export function ProgramDialog({ programs, onProgramsUpdate }: ProgramDialogProps) {
  const [open, setOpen] = useState(false);
  const [name_en, setNameEn] = useState("");
  const [name_ar, setNameAr] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [newCategoryEn, setNewCategoryEn] = useState("");
  const [newCategoryAr, setNewCategoryAr] = useState("");
  const [categories, setCategories] = useState<Omit<ProgramCategory, 'programs'>[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramsPages | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const result = await getCategories();
    if (result.success && result.categories) {
      setCategories(result.categories);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryEn || !newCategoryAr) {
      toast({
        title: "Error",
        description: "Please fill in both English and Arabic names for the category",
        variant: "destructive",
      });
      return;
    }

    const result = await createCategory({
      name_en: newCategoryEn,
      name_ar: newCategoryAr,
    });

    if (result.success && result.newCategory) {
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      });
      setCategories(result.categories || []);
      setNewCategoryEn("");
      setNewCategoryAr("");
      setShowNewCategory(false);
      setCategoryId(result.newCategory.id);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (editingProgram) {
        result = await updateProgram({
          id: editingProgram.id,
          name_en,
          name_ar,
          categoryId,
        });
      } else {
        result = await createProgram({ 
          name_en, 
          name_ar, 
          categoryId 
        });
      }

      if (result.success) {
        toast({
          title: `Program ${editingProgram ? "updated" : "created"}`,
          description: `The program has been ${editingProgram ? "updated" : "created"} successfully.`,
        });
        onProgramsUpdate(result.programs);
        setOpen(false);
        resetForm();
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

  const resetForm = () => {
    setNameEn("");
    setNameAr("");
    setCategoryId("");
    setEditingProgram(null);
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
            {/* Category Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* New Category Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNewCategory(!showNewCategory)}
              className="w-full"
            >
              {showNewCategory ? "Cancel New Category" : "Create New Category"}
            </Button>

            {/* New Category Fields */}
            {showNewCategory && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newCategoryEn" className="text-right">
                    Category (EN)
                  </Label>
                  <Input
                    id="newCategoryEn"
                    value={newCategoryEn}
                    onChange={(e) => setNewCategoryEn(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newCategoryAr" className="text-right">
                    Category (AR)
                  </Label>
                  <Input
                    id="newCategoryAr"
                    value={newCategoryAr}
                    onChange={(e) => setNewCategoryAr(e.target.value)}
                    className="col-span-3"
                    dir="rtl"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleCreateCategory}
                  className="w-full"
                >
                  Create Category
                </Button>
              </>
            )}

            {/* Program Name Fields */}
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
              {editingProgram ? "Update" : "Create"} Program
            </Button>
          </DialogFooter>
        </form>

        {/* Existing Programs List */}
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
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingProgram(program);
                        setNameEn(program.name_en);
                        setNameAr(program.name_ar);
                        setCategoryId(program.categoryId || "");
                        setOpen(true);
                      }}
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
