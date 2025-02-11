"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { updateStat, type StatFormData } from "@/app/actions/pages/statActions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Stat } from "@prisma/client"

const StatSchema = z.object({
  name_en: z.string().min(1, "English name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  value: z.number().int().positive("Value must be a positive integer"),
  icon: z.string().min(1, "Icon is required"),
  suffix_en: z.string().min(1, "English suffix is required"),
  suffix_ar: z.string().min(1, "Arabic suffix is required"),
})

export function StatEditForm({ stat }: { stat: Stat }) {
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<StatFormData>({
    resolver: zodResolver(StatSchema),
    defaultValues: {
      name_en: stat.name_en,
      name_ar: stat.name_ar,
      value: stat.value,
      icon: stat.icon,
      suffix_en: stat.suffix_en,
      suffix_ar: stat.suffix_ar,
    },
  })

  const onSubmit = async (data: StatFormData) => {
    try {
      await updateStat(stat.id, data)
      toast({
        title: "Success",
        description: "Stat updated successfully",
      })
      router.push('/admin/pages/stats')
      router.refresh()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stat",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Stat</CardTitle>
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
                    <Input {...field} />
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
                    <Input {...field} dir="rtl" />
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
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                    <Input {...field} />
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
                    <Input {...field} dir="rtl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/pages/stats')}
                className="w-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full">
                Update Stat
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
