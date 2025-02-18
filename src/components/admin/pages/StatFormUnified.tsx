"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  createStat,
  updateStat,
  type StatFormData,
} from "@/app/actions/pages/statActions";
import {
  AVAILABLE_ICONS,
  ICON_CATEGORIES,
  type IconName,
  type CategoryName,
} from "@/config/icons";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Stat } from "@prisma/client";

const StatSchema = z.object({
  name_en: z.string().min(1, "English name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  value: z.number().int().positive("Value must be a positive integer"),
  icon: z.string().min(1, "Icon is required"),
  suffix_en: z.string().min(1, "English suffix is required"),
  suffix_ar: z.string().min(1, "Arabic suffix is required"),
});

interface StatFormProps {
  stat?: Stat;
  mode: "create" | "edit";
}

export function StatFormUnified({ stat, mode }: StatFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryName | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState({
    left: false,
    right: true,
  });

  const form = useForm<StatFormData>({
    resolver: zodResolver(StatSchema),
    defaultValues: stat || {
      name_en: "",
      name_ar: "",
      value: 0,
      icon: "",
      suffix_en: "total",
      suffix_ar: "إجمالي",
    },
  });

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowScrollButtons({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 5,
      });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [selectedCategory]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const filteredIcons = Object.entries(AVAILABLE_ICONS).filter(([name]) => {
    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      ICON_CATEGORIES[selectedCategory]?.includes(name as IconName);
    return matchesSearch && matchesCategory;
  });

  const onSubmit = async (data: StatFormData) => {
    setIsSubmitting(true);
    try {
      const response =
        mode === "create"
          ? await createStat(data)
          : await updateStat(stat!.id, data);

      if (!response.success) {
        throw new Error(response.error as string);
      }

      toast({
        title: `Stat ${mode === "create" ? "created" : "updated"}`,
        description: `Your stat has been successfully ${
          mode === "create" ? "created" : "updated"
        }.`,
      });

      router.push("/admin/pages/stats");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create New Stat" : "Edit Stat"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter stat name in English"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arabic Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم الإحصائية بالعربية"
                      {...field}
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter stat value"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {field.value ? (
                            <>
                              {React.createElement(
                                AVAILABLE_ICONS[field.value as IconName],
                                { className: "mr-2 h-5 w-5" }
                              )}
                              {field.value}
                            </>
                          ) : (
                            "Select an icon"
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[360px] p-0"
                      side="right"
                      align="start"
                    >
                      <div className="sticky top-0 bg-background border-b z-10">
                        <div className="p-4 pb-2">
                          <Input
                            placeholder="Search icons..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mb-2"
                          />
                        </div>
                        <div className="relative px-2 pb-2">
                          {showScrollButtons.left && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/80 backdrop-blur-sm"
                              onClick={() => scroll("left")}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                          )}
                          <div
                            ref={scrollContainerRef}
                            className="overflow-x-auto scrollbar-hide px-8"
                            onScroll={checkScroll}
                          >
                            <div className="flex gap-2 px-2 min-w-max">
                              <Button
                                variant={
                                  selectedCategory === "all"
                                    ? "default"
                                    : "ghost"
                                }
                                size="sm"
                                onClick={() => setSelectedCategory("all")}
                              >
                                All
                              </Button>
                              {Object.keys(ICON_CATEGORIES).map((category) => (
                                <Button
                                  key={category}
                                  variant={
                                    selectedCategory === category
                                      ? "default"
                                      : "ghost"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    setSelectedCategory(
                                      category as CategoryName
                                    )
                                  }
                                  className="whitespace-nowrap"
                                >
                                  {category}
                                </Button>
                              ))}
                            </div>
                          </div>
                          {showScrollButtons.right && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/80 backdrop-blur-sm"
                              onClick={() => scroll("right")}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <ScrollArea className="h-[300px]">
                        <div className="grid grid-cols-4 gap-1 p-4">
                          {filteredIcons.map(([name, Icon]) => (
                            <Button
                              key={name}
                              variant={
                                field.value === name ? "default" : "ghost"
                              }
                              className="flex flex-col items-center justify-center h-[72px] py-1 px-2 hover:bg-muted"
                              onClick={() => field.onChange(name)}
                              type="button"
                            >
                              <Icon className="h-6 w-6 mb-1" />
                              <span className="text-[10px] leading-tight truncate w-full text-center">
                                {name}
                              </span>
                            </Button>
                          ))}
                        </div>
                        {filteredIcons.length === 0 && (
                          <div className="p-4 text-center text-muted-foreground">
                            No icons found
                          </div>
                        )}
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="suffix_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Suffix</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter suffix in English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="suffix_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arabic Suffix</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اللاحقة بالعربية"
                      {...field}
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/pages/stats")}
                className="w-full"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting
                  ? `${mode === "create" ? "Creating" : "Updating"}...`
                  : mode === "create"
                  ? "Create Stat"
                  : "Update Stat"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
