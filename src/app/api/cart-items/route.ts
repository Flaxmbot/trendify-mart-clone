// src/app/api/cart-items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, limit, orderBy } from 'firebase-admin/firestore';

const cartItemsCollection = collection(adminDb, 'cartItems');
const productsCollection = collection(adminDb, 'products');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const sessionId = searchParams.get('sessionId');

    if (id) {
      const docRef = doc(cartItemsCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
      }
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    }

    if (sessionId) {
        const q = query(cartItemsCollection, where("sessionId", "==", sessionId), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(results);
    }
    
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity, size, color, sessionId } = body;

    if (!productId || !quantity || !size || !color || !sessionId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const productRef = doc(productsCollection, productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const newCartItem = {
        productId,
        quantity,
        size,
        color,
        sessionId,
        createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(cartItemsCollection, newCartItem);
    return NextResponse.json({ id: docRef.id, ...newCartItem }, { status: 201 });

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

        const docRef = doc(cartItemsCollection, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
        }

        const body = await request.json();
        const updates: { [key: string]: any } = {};

        if (body.quantity) updates.quantity = body.quantity;
        if (body.size) updates.size = body.size;
        if (body.color) updates.color = body.color;

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

        const docRef = doc(cartItemsCollection, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
        }

        await deleteDoc(docRef);

        return NextResponse.json({ message: 'Cart item deleted successfully' });

    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

      
