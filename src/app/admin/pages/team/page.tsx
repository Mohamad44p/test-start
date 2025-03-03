'use client'

import { columns } from "./columns"
import { teamTableConfig } from "./config"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/Gallary/tabel/data-table"
import { getTeamMembers, PaginationParams, PaginatedResult } from "@/app/actions/pages/team-actions"
import { useState, useEffect, useRef } from "react"
import { TeamMember } from "./columns"

export default function TeamMembers() {
  const [teamMembers, setTeamMembers] = useState<PaginatedResult<TeamMember> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    pageSize: teamTableConfig.defaultPageSize,
    sortBy: 'createdAt',
    sortOrder: 'asc',
    search: '',
  })
  
  const initialRenderRef = useRef(true)
  const isFetchingRef = useRef(false)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      // Prevent concurrent fetches
      if (isFetchingRef.current) return
      
      try {
        isFetchingRef.current = true
        setLoading(true)
        
        // Ensure we're passing a valid object to getTeamMembers
        const params: PaginationParams = {
          page: paginationParams.page || 1,
          pageSize: paginationParams.pageSize || teamTableConfig.defaultPageSize,
          sortBy: paginationParams.sortBy || 'createdAt',
          sortOrder: paginationParams.sortOrder || 'asc',
          search: paginationParams.search || '',
        }
        
        const data = await getTeamMembers(params)
        setTeamMembers(data as PaginatedResult<TeamMember>)
        setError(null)
      } catch (err) {
        console.error('Error fetching team members:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch team members')
      } finally {
        setLoading(false)
        isFetchingRef.current = false
      }
    }

    // Always fetch on initial render
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      fetchTeamMembers()
    } else {
      // After initial render, only fetch when pagination params change
      fetchTeamMembers()
    }
  }, [paginationParams])

  // Handle pagination change
  const handlePaginationChange = async (params: PaginationParams) => {
    // Prevent unnecessary updates if the params haven't changed
    if (
      params.page === paginationParams.page &&
      params.pageSize === paginationParams.pageSize &&
      params.sortBy === paginationParams.sortBy &&
      params.sortOrder === paginationParams.sortOrder &&
      params.search === paginationParams.search
    ) {
      return
    }
    
    // Ensure we're setting a valid object
    setPaginationParams({
      page: params.page || 1,
      pageSize: params.pageSize || teamTableConfig.defaultPageSize,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'asc',
      search: params.search || '',
    })
  }

  if (loading && !teamMembers) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Team Members</h1>
          <Link href="/admin/pages/team/create" passHref prefetch>
            <Button>Add New Team Member</Button>
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading team members...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Team Members</h1>
          <Link href="/admin/pages/team/create" passHref prefetch>
            <Button>Add New Team Member</Button>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Link href="/admin/pages/team/create" passHref prefetch>
          <Button>Add New Team Member</Button>
        </Link>
      </div>
      {teamMembers && (
        <DataTable 
          columns={columns} 
          data={teamMembers} 
          config={teamTableConfig}
          onPaginationChange={handlePaginationChange}
        />
      )}
    </div>
  )
}

