import { updateHeroStep, deleteHeroStep } from '@/app/actions/pages/hero'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const data = await request.json()
  const result = await updateHeroStep(Number(params.id), data)
  return NextResponse.json(result)
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const result = await deleteHeroStep(Number(params.id))
  return NextResponse.json(result)
}
