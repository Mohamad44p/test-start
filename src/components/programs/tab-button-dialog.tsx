"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";

interface TabButtonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function TabButtonDialog({ isOpen, onClose, title, content }: TabButtonDialogProps) {
  const { currentLang } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            <div 
              className="prose max-w-none mt-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>
            {currentLang === "ar" ? "إغلاق" : "Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
