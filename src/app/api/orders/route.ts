import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single order fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const order = await db.select()
        .from(orders)
        .where(eq(orders.id, parseInt(id)))
        .limit(1);

      if (order.length === 0) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      return NextResponse.json(order[0]);
    }

    // List orders with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select().from(orders);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(orders.customerName, `%${search}%`),
          like(orders.customerEmail, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(orders.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply sorting
    const sortColumn = sort === 'totalAmount' ? orders.totalAmount :
                      sort === 'customerName' ? orders.customerName :
                      sort === 'status' ? orders.status :
                      orders.createdAt;

    query = query.orderBy(order === 'asc' ? asc(sortColumn) : desc(sortColumn));

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.customerName || typeof body.customerName !== 'string' || !body.customerName.trim()) {
      return NextResponse.json({ 
        error: "Customer name is required",
        code: "MISSING_CUSTOMER_NAME" 
      }, { status: 400 });
    }

    if (!body.customerEmail || typeof body.customerEmail !== 'string' || !body.customerEmail.trim()) {
      return NextResponse.json({ 
        error: "Customer email is required",
        code: "MISSING_CUSTOMER_EMAIL" 
      }, { status: 400 });
    }

    if (!body.customerPhone || typeof body.customerPhone !== 'string' || !body.customerPhone.trim()) {
      return NextResponse.json({ 
        error: "Customer phone is required",
        code: "MISSING_CUSTOMER_PHONE" 
      }, { status: 400 });
    }

    if (!body.shippingAddress || typeof body.shippingAddress !== 'string' || !body.shippingAddress.trim()) {
      return NextResponse.json({ 
        error: "Shipping address is required",
        code: "MISSING_SHIPPING_ADDRESS" 
      }, { status: 400 });
    }

    if (!body.totalAmount || typeof body.totalAmount !== 'number' || body.totalAmount <= 0) {
      return NextResponse.json({ 
        error: "Valid total amount is required",
        code: "INVALID_TOTAL_AMOUNT" 
      }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customerEmail.trim())) {
      return NextResponse.json({ 
        error: "Valid email address is required",
        code: "INVALID_EMAIL" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      customerName: body.customerName.trim(),
      customerEmail: body.customerEmail.trim().toLowerCase(),
      customerPhone: body.customerPhone.trim(),
      shippingAddress: body.shippingAddress.trim(),
      totalAmount: body.totalAmount,
      status: body.status?.trim() || 'pending',
      createdAt: new Date().toISOString()
    };

    const newOrder = await db.insert(orders)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newOrder[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if order exists
    const existingOrder = await db.select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and sanitize fields if provided
    if (body.customerName !== undefined) {
      if (typeof body.customerName !== 'string' || !body.customerName.trim()) {
        return NextResponse.json({ 
          error: "Customer name must be a non-empty string",
          code: "INVALID_CUSTOMER_NAME" 
        }, { status: 400 });
      }
      updates.customerName = body.customerName.trim();
    }

    if (body.customerEmail !== undefined) {
      if (typeof body.customerEmail !== 'string' || !body.customerEmail.trim()) {
        return NextResponse.json({ 
          error: "Customer email must be a non-empty string",
          code: "INVALID_CUSTOMER_EMAIL" 
        }, { status: 400 });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.customerEmail.trim())) {
        return NextResponse.json({ 
          error: "Valid email address is required",
          code: "INVALID_EMAIL" 
        }, { status: 400 });
      }
      updates.customerEmail = body.customerEmail.trim().toLowerCase();
    }

    if (body.customerPhone !== undefined) {
      if (typeof body.customerPhone !== 'string' || !body.customerPhone.trim()) {
        return NextResponse.json({ 
          error: "Customer phone must be a non-empty string",
          code: "INVALID_CUSTOMER_PHONE" 
        }, { status: 400 });
      }
      updates.customerPhone = body.customerPhone.trim();
    }

    if (body.shippingAddress !== undefined) {
      if (typeof body.shippingAddress !== 'string' || !body.shippingAddress.trim()) {
        return NextResponse.json({ 
          error: "Shipping address must be a non-empty string",
          code: "INVALID_SHIPPING_ADDRESS" 
        }, { status: 400 });
      }
      updates.shippingAddress = body.shippingAddress.trim();
    }

    if (body.totalAmount !== undefined) {
      if (typeof body.totalAmount !== 'number' || body.totalAmount <= 0) {
        return NextResponse.json({ 
          error: "Total amount must be a positive number",
          code: "INVALID_TOTAL_AMOUNT" 
        }, { status: 400 });
      }
      updates.totalAmount = body.totalAmount;
    }

    if (body.status !== undefined) {
      if (typeof body.status !== 'string' || !body.status.trim()) {
        return NextResponse.json({ 
          error: "Status must be a non-empty string",
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
      updates.status = body.status.trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: "No valid fields to update",
        code: "NO_UPDATE_FIELDS" 
      }, { status: 400 });
    }

    const updated = await db.update(orders)
      .set(updates)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if order exists
    const existingOrder = await db.select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const deleted = await db.delete(orders)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Order deleted successfully',
      deletedOrder: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}