import { Suspense } from 'react'
import { columns } from './columns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import db from '@/app/db/db'
import { ComplaintTableSkeleton } from './loading'
import { DataTable } from '@/components/admin/Gallary/tabel/data-table'
import { complaintsTableConfig } from './config'
import { Complaint } from '@/types/complaint'
import { cache } from 'react'
import { revalidatePath } from 'next/cache'

// Type-safe wrapper for DataTable specifically for Complaints
function ComplaintsDataTable({ data }: { data: Complaint[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      config={complaintsTableConfig}
    />
  )
}

// Use ISR with 30-second revalidation for the complaints page
export const revalidate = 30

// Keep dynamic routing for real-time updates via route handlers
export const dynamic = 'force-dynamic'

// Trigger manual revalidation when needed
export async function revalidateComplaints() {
  'use server'
  revalidatePath('/admin/complaints')
}

const getComplaintStats = cache(async () => {
  const [total, pending, inReview, resolved] = await Promise.all([
    db.complaint.count(),
    db.complaint.count({ where: { status: 'PENDING' } }),
    db.complaint.count({ where: { status: 'IN_REVIEW' } }),
    db.complaint.count({ where: { status: 'RESOLVED' } }),
  ])

  return { total, pending, inReview, resolved }
})

const getComplaints = cache(async (status?: string): Promise<Complaint[]> => {
  const complaints = await db.complaint.findMany({
    where: status && status !== 'all' ? { 
      status: status.toUpperCase().replace('-', '_') 
    } : undefined,
    include: {
      attachments: true,
      notes: true,
    },
    orderBy: { submittedAt: 'desc' },
  }) as unknown as Complaint[]

  return complaints
})

export default async function ComplaintsPage({
  searchParams,
}: {
  searchParams?: { status?: string }
}) {
  const stats = await getComplaintStats()
  const complaints = await getComplaints(searchParams?.status)

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <StatsCard title="Total Complaints" value={stats.total} />
        <StatsCard title="Pending" value={stats.pending} type="warning" />
        <StatsCard title="In Review" value={stats.inReview} type="info" />
        <StatsCard title="Resolved" value={stats.resolved} type="success" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaints Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-review">In Review</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Suspense fallback={<ComplaintTableSkeleton />}>
                <ComplaintsDataTable data={complaints} />
              </Suspense>
            </TabsContent>
            <TabsContent value="pending">
              <Suspense fallback={<ComplaintTableSkeleton />}>
                <ComplaintsDataTable data={await getComplaints('PENDING')} />
              </Suspense>
            </TabsContent>
            <TabsContent value="in-review">
              <Suspense fallback={<ComplaintTableSkeleton />}>
                <ComplaintsDataTable data={await getComplaints('IN_REVIEW')} />
              </Suspense>
            </TabsContent>
            <TabsContent value="resolved">
              <Suspense fallback={<ComplaintTableSkeleton />}>
                <ComplaintsDataTable data={await getComplaints('RESOLVED')} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatsCardProps {
  title: string;
  value: number;
  type?: 'default' | 'warning' | 'info' | 'success';
}

function StatsCard({ title, value, type = 'default' }: StatsCardProps) {
  return (
    <Card className={`${type === 'warning' ? 'border-yellow-500' : 
                      type === 'info' ? 'border-blue-500' : 
                      type === 'success' ? 'border-green-500' : 
                      'border-gray-200'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
