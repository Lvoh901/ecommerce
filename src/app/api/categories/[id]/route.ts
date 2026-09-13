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
    for (const key of ['name', 'image', 'link', 'description'] as const) {
      if (body[key] !== undefined) data[key] = String(body[key]).trim() || null;
    }
    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.fromPrice !== undefined) {
      const n = Number(body.fromPrice);
      if (!Number.isFinite(n)) {
        return NextResponse.json({ error: 'fromPrice must be a number.' }, { status: 400 });
      }
      data.fromPrice = n;
    }
    const category = await prisma.category.update({ where: { id: Number(id) }, data });
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Update category failed:', error);
    return NextResponse.json({ error: 'Failed to update category.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const gate = await apiRole('STAFF');
  if ('error' in gate) return gate.error;
  try {
    const { id } = await params;
    await prisma.category.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete category failed:', error);
    return NextResponse.json({ error: 'Failed to delete category.' }, { status: 500 });
  }
}
