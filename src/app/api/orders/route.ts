// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

const ordersCollection = adminDb.collection('orders');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single order fetch by ID
    if (id) {
      const docRef = ordersCollection.doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    }

    // List orders with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query: admin.firestore.Query = ordersCollection;

    if (status) {
      query = query.where('status', '==', status);
    }
    
    // Note: Firestore requires composite indexes for queries with multiple inequalities or an orderBy on a different field.
    // For simplicity, this example only supports searching by name OR email, not both at once with other filters.
    // A more advanced implementation might require creating those indexes in Firebase.
    if (search) {
        // This is a simplified search. For full text search, a third-party service like Algolia is recommended.
        // We will just search by customer name for this example.
        query = query.where('customerName', '>=', search).where('customerName', '<=', search + '\uf8ff');
    }

    query = query.orderBy(sortBy, order as 'asc' | 'desc').limit(limit);
    
    const querySnapshot = await query.get();
    const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.customerName || !body.customerEmail || !body.totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newOrder = {
      ...body,
      createdAt: new Date().toISOString(),
      status: body.status || 'pending'
    };

    const docRef = await ordersCollection.add(newOrder);
    return NextResponse.json({ id: docRef.id, ...newOrder }, { status: 201 });

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

    const docRef = ordersCollection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const body = await request.json();
    await docRef.update(body);
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
    
    const docRef = ordersCollection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ message: 'Order deleted successfully' });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

  
