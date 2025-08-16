import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

function generateSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Get single category by ID
    if (id) {
      const categoryDoc = await getDoc(doc(db, 'categories', id));
      if (!categoryDoc.exists()) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      return NextResponse.json({ id: categoryDoc.id, ...categoryDoc.data() });
    }

    // List categories
    const categoriesCollection = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesCollection);
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(categories);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
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

    const q = query(collection(db, 'categories'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 });
    }

    const newCategory = await addDoc(collection(db, 'categories'), {
      name,
      slug,
      description,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ id: newCategory.id }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Valid ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description } = body;

    const updates: any = {};

    if (name !== undefined) {
      updates.name = name;
      updates.slug = generateSlug(name);
    }

    if (description !== undefined) {
      updates.description = description;
    }

    const categoryRef = doc(db, 'categories', id);
    await updateDoc(categoryRef, updates);

    return NextResponse.json({ message: 'Category updated successfully' });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Valid ID is required" }, { status: 400 });
    }

    await deleteDoc(doc(db, 'categories', id));

    return NextResponse.json({ message: 'Category deleted successfully' });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}
