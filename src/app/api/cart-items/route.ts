import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const itemsCollection = collection(db, 'carts', sessionId, 'items');
    const itemsSnapshot = await getDocs(itemsCollection);
    const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(items);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity, size, color, sessionId } = body;

    if (!sessionId) {
        return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    if (!productId || !quantity || !size || !color) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const itemsCollection = collection(db, 'carts', sessionId, 'items');
    const newItem = await addDoc(itemsCollection, {
        productId,
        quantity,
        size,
        color,
        createdAt: new Date().toISOString()
    });

    return NextResponse.json({ id: newItem.id }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const sessionId = searchParams.get('sessionId');
    const body = await request.json();

    if (!sessionId) {
        return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 });
    }

    const itemRef = doc(db, 'carts', sessionId, 'items', id);
    await updateDoc(itemRef, body);

    return NextResponse.json({ message: 'Cart item updated successfully' });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 });
    }

    await deleteDoc(doc(db, 'carts', sessionId, 'items', id));

    return NextResponse.json({ message: 'Cart item deleted successfully' });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}