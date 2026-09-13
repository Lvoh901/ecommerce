import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiRole } from '@/lib/auth';

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json({ products });
  } catch (error) {
    console.error('List products failed:', error);
    return NextResponse.json({ error: 'Failed to load products.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await apiRole('STAFF');
  if ('error' in gate) return gate.error;
  try {
    const body = await request.json();
    const data = {
      name: String(body.name ?? '').trim(),
      description: String(body.description ?? '').trim(),
      price: Number(body.price),
      category: String(body.category ?? '').trim(),
      image: String(body.image ?? '').trim() || '/placeholder.jpg',
      subcategory: String(body.subcategory ?? '').trim() || 'General',
      rating: Number(body.rating ?? 0),
      reviews: Number(body.reviews ?? 0),
    };
    if (!data.name || !data.category || !Number.isFinite(data.price) || data.price < 0) {
      return NextResponse.json(
        { error: 'Name, category and a valid price are required.' },
        { status: 400 }
      );
    }
    const product = await prisma.product.create({ data });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Create product failed:', error);
    return NextResponse.json({ error: 'Failed to create product.' }, { status: 500 });
  }
}
