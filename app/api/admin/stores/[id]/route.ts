import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Store from '@/lib/models/Store';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return null;
  return session;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await connectDB();
  const { isActive } = await req.json();

  const store = await Store.findByIdAndUpdate(params.id, { isActive }, { new: true });
  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

  return NextResponse.json({ store });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await connectDB();
  await Store.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
