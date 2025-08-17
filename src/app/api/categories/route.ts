// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, limit, orderBy } from 'firebase-admin/firestore';

function generateSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const categoriesCollection = collection(adminDb, 'categories');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const docRef = doc(categoriesCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    }

    const q = query(categoriesCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(results);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = generateSlug(name);
    const q = query(categoriesCollection, where("slug", "==", slug), limit(1));
    const existing = await getDocs(q);

    if (!existing.empty) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 });
    }

    const newCategory = {
      name,
      slug,
      description: description || null,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(categoriesCollection, newCategory);
    return NextResponse.json({ id: docRef.id, ...newCategory }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const docRef = doc(categoriesCollection, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        const body = await request.json();
        const updates: { [key: string]: any } = {};

        if (body.name) {
            updates.name = body.name;
            updates.slug = generateSlug(body.name);
        }
        if (body.description !== undefined) {
            updates.description = body.description;
        }

        await updateDoc(docRef, updates);
        const updatedDoc = await getDoc(docRef);

        return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() });

    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const docRef = doc(categoriesCollection, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        await deleteDoc(docRef);

        return NextResponse.json({ message: 'Category deleted successfully' });

    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

          
