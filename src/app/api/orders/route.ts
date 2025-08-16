import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const orderDoc = await getDoc(doc(db, 'orders', id));
      if (!orderDoc.exists()) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ id: orderDoc.id, ...orderDoc.data() });
    }

    const ordersCollection = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersCollection);
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(orders);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, totalAmount, status, items } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !totalAmount || !items) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newOrderRef = await addDoc(collection(db, 'orders'), {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        totalAmount,
        status: status || 'pending',
        createdAt: new Date().toISOString()
    });

    const itemsCollection = collection(db, 'orders', newOrderRef.id, 'items');
    for (const item of items) {
        await addDoc(itemsCollection, item);
    }

    return NextResponse.json({ id: newOrderRef.id }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const orderRef = doc(db, 'orders', id);
    await updateDoc(orderRef, body);

    return NextResponse.json({ message: 'Order updated successfully' });

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
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await deleteDoc(doc(db, 'orders', id));

    return NextResponse.json({ message: 'Order deleted successfully' });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}