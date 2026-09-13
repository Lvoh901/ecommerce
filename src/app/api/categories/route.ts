import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiRole } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('List categories failed:', error);
    return NextResponse.json({ error: 'Failed to load categories.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await apiRole('STAFF');
  if ('error' in gate) return gate.error;
  try {
    const body = await request.json();
    const data = {
      name: String(body.name ?? '').trim(),
      fromPrice: Number(body.fromPrice),
      image: String(body.image ?? '').trim() || '/placeholder.jpg',
      link: String(body.link ?? '').trim() || '/shop',
      description: String(body.description ?? '').trim() || null,
    };
    if (!data.name || !Number.isFinite(data.fromPrice)) {
      return NextResponse.json({ error: 'Name and a valid fromPrice are required.' }, { status: 400 });
    }
    const category = await prisma.category.create({ data });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Create category failed:', error);
    return NextResponse.json({ error: 'Failed to create category.' }, { status: 500 });
  }
}
