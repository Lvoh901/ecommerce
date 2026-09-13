import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiRole } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const gate = await apiRole('STAFF');
  if ('error' in gate) return gate.error;
  try {
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {};
    for (const key of ['name', 'description', 'category', 'image', 'subcategory'] as const) {
      if (body[key] !== undefined) data[key] = String(body[key]).trim();
    }
    for (const key of ['price', 'rating', 'reviews'] as const) {
      if (body[key] !== undefined) {
        const n = Number(body[key]);
        if (!Number.isFinite(n)) {
          return NextResponse.json({ error: `${key} must be a number.` }, { status: 400 });
        }
        data[key] = n;
      }
    }
    const product = await prisma.product.update({ where: { id: Number(id) }, data });
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Update product failed:', error);
    return NextResponse.json({ error: 'Failed to update product.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const gate = await apiRole('STAFF');
  if ('error' in gate) return gate.error;
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete product failed:', error);
    return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
  }
}
