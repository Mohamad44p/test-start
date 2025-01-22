import { NextResponse } from "next/server"
import type { ComplaintFormData } from "@/types/complaint"
import db from "@/app/db/db"

export async function POST(req: Request) {
  try {
    const data: ComplaintFormData = await req.json()

    const complaint = await db.complaint.create({
      data: {
        type: "REGULAR",
        complaintNumber: `COMP-${Date.now()}`,
        complainantType: data.complainantInfo?.complainantType,
        complainantName: data.complainantInfo?.name,
        complainantGender: data.complainantInfo?.gender,
        complainantEmail: data.complainantInfo?.email,
        complainantPhone: data.complainantInfo?.phone,
        firmName: data.complainantInfo?.firmName,
        firmEmail: data.complainantInfo?.firmEmail,
        firmPhone: data.complainantInfo?.firmPhone,
        description: data.complaintDescription.description,
        entityAgainst: data.complaintDescription.entity,
        filedInCourt: data.complaintDescription.filedInCourt,
        hasPreviousComplaint: data.previousComplaints.hasPreviousComplaint,
        previousComplaintEntity: data.previousComplaints.previousComplaintEntity,
        previousComplaintDate: data.previousComplaints.previousComplaintDate
          ? new Date(data.previousComplaints.previousComplaintDate)
          : null,
        facts: data.complaintDetails.facts,
        confirmed: data.confirmed,
        attachments: {
          create: data.attachments.map((att) => ({
            fileUrl: att.fileUrl,
            fileName: att.fileName,
            fileType: att.fileType,
            fileSize: att.fileSize,
          })),
        },
      },
    })

    return NextResponse.json({
      success: true,
      complaintNumber: complaint.complaintNumber,
    })
  } catch (error) {
    console.error("Complaint submission error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit complaint" }, { status: 500 })
  }
}

