"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/context/LanguageContext"

export function AnonymousComplaintForm() {
  interface FormData {
    date: string
    complaintNumber: string
    willProvideContact: boolean
    description: string
    entityAgainst: string
    filedInCourt: boolean
    previousComplaint: boolean
    previousEntityAgainst: string
    previousFilingDate: string
    receivedResponse: boolean
    responseDate: string
    factsAndGrounds: string
    attachments: File[]
    confirmed: boolean
  }

  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split("T")[0],
    complaintNumber: Math.random().toString(36).substr(2, 9),
    willProvideContact: false,
    description: "",
    entityAgainst: "",
    filedInCourt: false,
    previousComplaint: false,
    previousEntityAgainst: "",
    previousFilingDate: "",
    receivedResponse: false,
    responseDate: "",
    factsAndGrounds: "",
    attachments: [],
    confirmed: false,
  })

  const { currentLang } = useLanguage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    if (!formData.description.trim()) {
      toast({
        title: currentLang === "ar" ? "خطأ" : "Error",
        description: currentLang === "ar" ? "الوصف مطلوب" : "Description is required",
        variant: "destructive",
      })
      return false
    }
    if (!formData.entityAgainst.trim()) {
      toast({
        title: currentLang === "ar" ? "خطأ" : "Error",
        description:
          currentLang === "ar"
            ? "الجهة المشتكى عليها مطلوبة"
            : "Entity against which the complaint is filed is required",
        variant: "destructive",
      })
      return false
    }
    if (!formData.factsAndGrounds.trim()) {
      toast({
        title: currentLang === "ar" ? "خطأ" : "Error",
        description: currentLang === "ar" ? "الحقائق والأسباب مطلوبة" : "Facts and grounds are required",
        variant: "destructive",
      })
      return false
    }
    if (!formData.confirmed) {
      toast({
        title: currentLang === "ar" ? "خطأ" : "Error",
        description: currentLang === "ar" ? "يجب تأكيد تفاصيل الشكوى" : "You must confirm the complaint details",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/complaints/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "ANONYMOUS",
          complaintDescription: {
            description: formData.description,
            entity: formData.entityAgainst,
            filedInCourt: formData.filedInCourt,
          },
          previousComplaints: {
            hasPreviousComplaint: formData.previousComplaint,
            previousComplaintEntity: formData.previousEntityAgainst,
            previousComplaintDate: formData.previousFilingDate,
            receivedResponse: formData.receivedResponse,
            responseDate: formData.responseDate,
          },
          complaintDetails: {
            facts: formData.factsAndGrounds,
          },
          attachments: formData.attachments.map((file) => ({
            fileUrl: URL.createObjectURL(file),
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          })),
          confirmed: formData.confirmed,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit complaint")
      }

      const result = await response.json()
      if (result.success) {
        toast({
          title: currentLang === "ar" ? "تم تقديم الشكوى" : "Complaint Submitted",
          description:
            currentLang === "ar"
              ? `تم تقديم شكواك بنجاح. رقم الشكوى: ${result.complaintNumber}`
              : `Your complaint has been successfully submitted. Complaint number: ${result.complaintNumber}`,
        })
        // Reset form
        setFormData({
          date: new Date().toISOString().split("T")[0],
          complaintNumber: Math.random().toString(36).substr(2, 9),
          willProvideContact: false,
          description: "",
          entityAgainst: "",
          filedInCourt: false,
          previousComplaint: false,
          previousEntityAgainst: "",
          previousFilingDate: "",
          receivedResponse: false,
          responseDate: "",
          factsAndGrounds: "",
          attachments: [],
          confirmed: false,
        })
      } else {
        throw new Error(result.error || "Failed to submit complaint")
      }
    } catch (error) {
      console.error("Error submitting complaint:", error)
      toast({
        title: currentLang === "ar" ? "خطأ" : "Error",
        description: error instanceof Error ? error.message : "Failed to submit complaint. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const labels = {
    en: {
      date: "Date",
      complaintNumber: "Complaint Number",
      willProvideContact: "Are you willing to provide a tool to contact you?",
      yes: "Yes",
      no: "No",
      description: "Description of the Complaint",
      entityAgainst: "The entity against which the complaint is filed",
      filedInCourt: "Was this complaint filed in a court of law?",
      previousComplaint: "Have you filed a similar complaint in the past?",
      previousEntityAgainst: "The entity against which the previous complaint was filed",
      previousFilingDate: "Date of filing",
      receivedResponse: "Have you received a response to the previous complaint?",
      responseDate: "Date of the response",
      factsAndGrounds: "Facts and grounds of the complaint",
      attachments: "Attachments and documents of the complaint (Optional)",
      confirmation:
        "I, the complainant (Anonymous), do hereby assert and confirm that the aforementioned information, data and attachments are genuine, legitimate and accurate, and I undertake to bear full legal liability if they were found to be otherwise at any point of time, or if the complaint was found to be filed maliciously or with ill-intention.",
      submit: "Submit Anonymous Complaint",
      submitting: "Submitting...",
    },
    ar: {
      date: "التاريخ",
      complaintNumber: "رقم الشكوى",
      willProvideContact: "هل أنت على استعداد لتقديم وسيلة للاتصال بك؟",
      yes: "نعم",
      no: "لا",
      description: "وصف الشكوى",
      entityAgainst: "الجهة المشتكى عليها",
      filedInCourt: "هل تم تقديم هذه الشكوى في المحكمة؟",
      previousComplaint: "هل قدمت شكوى مماثلة في الماضي؟",
      previousEntityAgainst: "الجهة التي قدمت ضدها الشكوى السابقة",
      previousFilingDate: "تاريخ التقديم",
      receivedResponse: "هل تلقيت رداً على الشكوى السابقة؟",
      responseDate: "تاريخ الرد",
      factsAndGrounds: "حقائق وأسباب الشكوى",
      attachments: "المرفقات والوثائق الخاصة بالشكوى (اختياري)",
      confirmation:
        "أنا، مقدم الشكوى (مجهول الهوية)، أؤكد وأقر بأن المعلومات والبيانات والمرفقات المذكورة أعلاه صحيحة وشرعية ودقيقة، وأتعهد بتحمل المسؤولية القانونية الكاملة إذا تبين أنها غير ذلك في أي وقت، أو إذا تبين أن الشكوى قدمت بسوء نية أو بقصد الإضرار.",
      submit: "تقديم شكوى مجهولة",
      submitting: "جاري التقديم...",
    },
  }

  const t = labels[currentLang as keyof typeof labels]

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="date">{t.date}</Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className={currentLang === "ar" ? "text-right" : "text-left"}
              />
            </div>
            <div>
              <Label htmlFor="complaintNumber">{t.complaintNumber}</Label>
              <Input
                type="text"
                id="complaintNumber"
                name="complaintNumber"
                value={formData.complaintNumber}
                readOnly
                className={currentLang === "ar" ? "text-right" : "text-left"}
              />
            </div>
          </div>

          <div className="mt-6">
            <Label>{t.willProvideContact}</Label>
            <RadioGroup
              onValueChange={(value) => handleRadioChange("willProvideContact", value === "yes")}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="willProvideContact-yes" />
                <Label htmlFor="willProvideContact-yes">{t.yes}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="willProvideContact-no" />
                <Label htmlFor="willProvideContact-no">{t.no}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mt-6">
            <Label htmlFor="description">{t.description}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className={`mt-2 ${currentLang === "ar" ? "text-right" : "text-left"}`}
            />
          </div>

          <div className="mt-6">
            <Label htmlFor="entityAgainst">{t.entityAgainst}</Label>
            <Input
              type="text"
              id="entityAgainst"
              name="entityAgainst"
              value={formData.entityAgainst}
              onChange={handleInputChange}
              required
              className={`mt-2 ${currentLang === "ar" ? "text-right" : "text-left"}`}
            />
          </div>

          <div className="mt-6">
            <Label>{t.filedInCourt}</Label>
            <RadioGroup
              onValueChange={(value) => handleRadioChange("filedInCourt", value === "yes")}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="filedInCourt-yes" />
                <Label htmlFor="filedInCourt-yes">{t.yes}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="filedInCourt-no" />
                <Label htmlFor="filedInCourt-no">{t.no}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mt-6">
            <Label>{t.previousComplaint}</Label>
            <RadioGroup
              onValueChange={(value) => handleRadioChange("previousComplaint", value === "yes")}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="previousComplaint-yes" />
                <Label htmlFor="previousComplaint-yes">{t.yes}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="previousComplaint-no" />
                <Label htmlFor="previousComplaint-no">{t.no}</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.previousComplaint && (
            <>
              <div className="mt-6">
                <Label htmlFor="previousEntityAgainst">{t.previousEntityAgainst}</Label>
                <Input
                  type="text"
                  id="previousEntityAgainst"
                  name="previousEntityAgainst"
                  value={formData.previousEntityAgainst}
                  onChange={handleInputChange}
                  required
                  className={`mt-2 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                />
              </div>

              <div className="mt-6">
                <Label htmlFor="previousFilingDate">{t.previousFilingDate}</Label>
                <Input
                  type="date"
                  id="previousFilingDate"
                  name="previousFilingDate"
                  value={formData.previousFilingDate}
                  onChange={handleInputChange}
                  required
                  className={`mt-2 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                />
              </div>

              <div className="mt-6">
                <Label>{t.receivedResponse}</Label>
                <RadioGroup
                  onValueChange={(value) => handleRadioChange("receivedResponse", value === "yes")}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="receivedResponse-yes" />
                    <Label htmlFor="receivedResponse-yes">{t.yes}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="receivedResponse-no" />
                    <Label htmlFor="receivedResponse-no">{t.no}</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.receivedResponse && (
                <div className="mt-6">
                  <Label htmlFor="responseDate">{t.responseDate}</Label>
                  <Input
                    type="date"
                    id="responseDate"
                    name="responseDate"
                    value={formData.responseDate}
                    onChange={handleInputChange}
                    required
                    className={`mt-2 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                  />
                </div>
              )}
            </>
          )}

          <div className="mt-6">
            <Label htmlFor="factsAndGrounds">{t.factsAndGrounds}</Label>
            <Textarea
              id="factsAndGrounds"
              name="factsAndGrounds"
              value={formData.factsAndGrounds}
              onChange={handleInputChange}
              required
              className={`mt-2 ${currentLang === "ar" ? "text-right" : "text-left"}`}
            />
          </div>

          <div className="mt-6">
            <Label>{t.attachments}</Label>
            <Input
              type="file"
              multiple
              className="mt-2"
              onChange={(e) => setFormData((prev) => ({ ...prev, attachments: Array.from(e.target.files || []) }))}
            />
          </div>

          <div className="mt-6 flex items-center space-x-2">
            <Checkbox
              id="confirmed"
              checked={formData.confirmed}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, confirmed: checked as boolean }))}
            />
            <Label
              htmlFor="confirmed"
              className={`text-sm ${currentLang === "ar" ? "text-right mr-2" : "text-left ml-2"}`}
            >
              {t.confirmation}
            </Label>
          </div>

          <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? t.submitting : t.submit}
          </Button>
        </CardContent>
      </Card>
    </motion.form>
  )
}

