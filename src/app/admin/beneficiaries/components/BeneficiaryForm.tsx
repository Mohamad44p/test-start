"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/lib/ImageUpload"
import { beneficiarySchema, type BeneficiaryFormInput } from "@/lib/schema/beneficiarySchema"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { CategorySelector } from "./CategorySelector"
import { Category } from "@prisma/client"
import { createBeneficiary, updateBeneficiary } from "@/app/actions/beneficiaryActions"

interface BeneficiaryFormProps {
  categories: Category[]
  initialData?: Partial<BeneficiaryFormInput>
  mode: 'create' | 'edit'
  id?: string
  buttonText?: string
}

export function BeneficiaryForm({ 
  categories: initialCategories, 
  initialData, 
  mode,
  id,
  buttonText = "Save Beneficiary" 
}: BeneficiaryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState(initialCategories)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<BeneficiaryFormInput>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: initialData || {
      title_en: "",
      title_ar: "",
      description_en: "",
      description_ar: "",
      longDescription_en: "",
      longDescription_ar: "",
      imageUrl: "",
      ctaText: "",
      ctaLink: "",
      categoryId: "",
    },
  })

  async function handleSubmit(data: BeneficiaryFormInput) {
    setIsSubmitting(true)
    const formData = new FormData()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString())
      }
    })

    try {
      const result = mode === 'edit' && id
        ? await updateBeneficiary(id, formData)
        : await createBeneficiary(formData)

      if (result.success) {
        toast({ title: "Success", description: "Beneficiary saved successfully" })
        router.refresh()
        router.push("/admin/beneficiaries")
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong"
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewCategory = (category: Category) => {
    setCategories((prev) => [...prev, category])
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Beneficiary Details</CardTitle>
        <CardDescription>Add or edit beneficiary information.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beneficiary Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onUpload={(url) => field.onChange(url || "")}
                      defaultImage={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategorySelector
                      categories={categories}
                      value={field.value}
                      onChange={field.onChange}
                      onNewCategory={handleNewCategory}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs defaultValue="english">
              <TabsList>
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="arabic">Arabic</TabsTrigger>
              </TabsList>
              
              <TabsContent value="english" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (English)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (English)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longDescription_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Long Description (English)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="arabic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Arabic)</FormLabel>
                      <FormControl>
                        <Input {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Arabic)</FormLabel>
                      <FormControl>
                        <Textarea {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longDescription_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Long Description (Arabic)</FormLabel>
                      <FormControl>
                        <Textarea {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ctaText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Text</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ctaLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Link</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {buttonText}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
