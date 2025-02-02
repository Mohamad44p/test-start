"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { createProgramTab, updateProgramTab } from "@/app/actions/program-tab-actions"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { CreateProgramTabInput, ProgramTab } from "@/types/program-tab"
import { RichTextEditor } from '@/components/Editor/RichTextEditor'
import * as z from "zod"

const programTabSchema = z.object({
    title_en: z.string().min(1, "English title is required"),
    title_ar: z.string().min(1, "Arabic title is required"),
    slug: z.string().min(1, "Slug is required"),
    content_en: z.string().min(1, "English content is required"),
    content_ar: z.string().min(1, "Arabic content is required"),
})

interface ProgramTabFormProps {
    programTab?: ProgramTab
}

export default function ProgramTabForm({ programTab }: ProgramTabFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<CreateProgramTabInput>({
        resolver: zodResolver(programTabSchema),
        defaultValues: programTab || {
            title_en: "",
            title_ar: "",
            slug: "",
            content_en: "",
            content_ar: "",
        },
    })

    async function onSubmit(data: CreateProgramTabInput) {
        setIsSubmitting(true)
        try {
            const result = programTab
                ? await updateProgramTab({ ...data, id: programTab.id })
                : await createProgramTab(data)

            if (result.success) {
                toast({
                    title: `Program tab ${programTab ? "updated" : "created"}`,
                    description: `Your program tab has been ${programTab ? "updated" : "created"} successfully.`,
                })
                router.push("/admin/program-tabs")
            } else if (result.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Unexpected error:", error)
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{programTab ? "Edit" : "Create"} Program Tab</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter slug" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Tabs defaultValue="english" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="english">English</TabsTrigger>
                                <TabsTrigger value="arabic">Arabic</TabsTrigger>
                            </TabsList>
                            <TabsContent value="english">
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title (English)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter English title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="content_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Content (English)</FormLabel>
                                                <FormControl>
                                                    <RichTextEditor
                                                        content={field.value}
                                                        onChange={field.onChange}
                                                        dir="ltr"
                                                        placeholder="Write your content in English..."
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TabsContent>
                            <TabsContent value="arabic">
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title_ar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title (Arabic)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Arabic title" {...field} className="text-right" dir="rtl" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="content_ar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Content (Arabic)</FormLabel>
                                                <FormControl>
                                                    <RichTextEditor
                                                        content={field.value}
                                                        onChange={field.onChange}
                                                        dir="rtl"
                                                        placeholder="Write your content in Arabic..."
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <Button
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="w-full"
                >
                    {isSubmitting ? "Submitting..." : (programTab ? "Update" : "Create") + " Program Tab"}
                </Button>
            </CardFooter>
        </Card>
    )
}