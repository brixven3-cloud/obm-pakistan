import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Store from '@/lib/models/Store';

const storeSchema = z.object({
  name:            z.string().min(2).max(60),
  slug:            z.string().min(2).max(40).regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
  businessType:    z.enum(['mobile','property','laptop','cloth','perfume','other']),
  tagline:         z.string().max(120).optional(),
  whatsappNumber:  z.string().regex(/^\+92\d{10}$/, 'Format: +92300xxxxxxx'),
  theme:           z.enum(['blue','green','darkGold','pink','teal','coral']).default('green'),
  sections:        z.object({
    header: z.object({ logo: z.string().optional(), announcement: z.string().optional() }).optional(),
    hero:   z.object({ headline: z.string(), subheadline: z.string().optional(), imageUrl: z.string().optional() }).optional(),
    about:  z.object({ title: z.string().optional(), body: z.string().optional(), imageUrl: z.string().optional() }).optional(),
  }).optional(),
});

// GET — fetch my store
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const store = await Store.findOne({ ownerId: session.user.id }).lean();
  return NextResponse.json({ store: store ?? null });
}

// POST — create store
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body   = await req.json();
  const parsed = storeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();

  const existing = await Store.findOne({ ownerId: session.user.id });
  if (existing) return NextResponse.json({ error: 'Store already exists' }, { status: 409 });

  const slugTaken = await Store.findOne({ slug: parsed.data.slug });
  if (slugTaken) return NextResponse.json({ error: 'Slug already taken — choose another' }, { status: 409 });

  const store = await Store.create({ ...parsed.data, ownerId: session.user.id });
  return NextResponse.json({ store }, { status: 201 });
}

// PATCH — update store
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body   = await req.json();
  const parsed = storeSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();

  if (parsed.data.slug) {
    const slugTaken = await Store.findOne({ slug: parsed.data.slug, ownerId: { $ne: session.user.id } });
    if (slugTaken) return NextResponse.json({ error: 'Slug already taken' }, { status: 409 });
  }

  const store = await Store.findOneAndUpdate(
    { ownerId: session.user.id },
    { $set: parsed.data },
    { new: true }
  );

  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });
  return NextResponse.json({ store });
}
