// src/app/api/order-items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

const orderItemsCollection = adminDb.collection('orderItems');
const ordersCollection = adminDb.collection('orders');
const productsCollection = adminDb.collection('products');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const orderId = searchParams.get('orderId');

    if (id) {
      const docRef = orderItemsCollection.doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return NextResponse.json({ error: 'Order item not found' }, { status: 404 });
      }
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    }

    if (orderId) {
        const q = await orderItemsCollection.where("orderId", "==", orderId).get();
        const results = q.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(results);
    }

    return NextResponse.json({ error: 'orderId is required' }, { status: 400 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, productId, quantity, price, size, color } = body;

    if (!orderId || !productId || !quantity || !price || !size || !color) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderRef = ordersCollection.doc(orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const productRef = productsCollection.doc(productId);
    const productSnap = await productRef.get();
    if (!productSnap.exists) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const newOrderItem = {
        orderId,
        productId,
        quantity,
        price,
        size,
        color,
        createdAt: new Date().toISOString()
    };

    const docRef = await orderItemsCollection.add(newOrderItem);
    return NextResponse.json({ id: docRef.id, ...newOrderItem }, { status: 201 });

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

        const docRef = orderItemsCollection.doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: 'Order item not found' }, { status: 404 });
        }

        const body = await request.json();
        const updates: { [key: string]: any } = {};

        if (body.quantity) updates.quantity = body.quantity;
        if (body.price) updates.price = body.price;
        if (body.size) updates.size = body.size;
        if (body.color) updates.color = body.color;


        await docRef.update(updates);
        const updatedDoc = await docRef.get();

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

        const docRef = orderItemsCollection.doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: 'Order item not found' }, { status: 404 });
        }

        await docRef.delete();

        return NextResponse.json({ message: 'Order item deleted successfully' });

    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

      
