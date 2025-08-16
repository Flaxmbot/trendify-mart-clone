import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cartItems, products } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const sessionId = searchParams.get('sessionId');
    const productId = searchParams.get('productId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single record fetch by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(cartItems)
        .where(eq(cartItems.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Cart item not found' 
        }, { status: 404 });
      }

      return NextResponse.json(record[0]);
    }

    // List with filtering
    let query = db.select().from(cartItems).orderBy(desc(cartItems.createdAt));

    // Apply filters
    const filters = [];
    if (sessionId) {
      filters.push(eq(cartItems.sessionId, sessionId));
    }
    if (productId) {
      if (isNaN(parseInt(productId))) {
        return NextResponse.json({ 
          error: "Valid product ID is required",
          code: "INVALID_PRODUCT_ID" 
        }, { status: 400 });
      }
      filters.push(eq(cartItems.productId, parseInt(productId)));
    }

    if (filters.length > 0) {
      query = query.where(and(...filters));
    }

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
    if (!body.productId || isNaN(parseInt(body.productId))) {
      return NextResponse.json({ 
        error: "Valid product ID is required",
        code: "MISSING_PRODUCT_ID" 
      }, { status: 400 });
    }

    if (!body.quantity || isNaN(parseInt(body.quantity)) || parseInt(body.quantity) < 1) {
      return NextResponse.json({ 
        error: "Valid quantity (minimum 1) is required",
        code: "INVALID_QUANTITY" 
      }, { status: 400 });
    }

    if (!body.size || typeof body.size !== 'string' || body.size.trim() === '') {
      return NextResponse.json({ 
        error: "Size is required",
        code: "MISSING_SIZE" 
      }, { status: 400 });
    }

    if (!body.color || typeof body.color !== 'string' || body.color.trim() === '') {
      return NextResponse.json({ 
        error: "Color is required",
        code: "MISSING_COLOR" 
      }, { status: 400 });
    }

    if (!body.sessionId || typeof body.sessionId !== 'string' || body.sessionId.trim() === '') {
      return NextResponse.json({ 
        error: "Session ID is required",
        code: "MISSING_SESSION_ID" 
      }, { status: 400 });
    }

    // Verify product exists
    const productExists = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(body.productId)))
      .limit(1);

    if (productExists.length === 0) {
      return NextResponse.json({ 
        error: "Product not found",
        code: "PRODUCT_NOT_FOUND" 
      }, { status: 400 });
    }

    // Create cart item
    const newCartItem = await db.insert(cartItems)
      .values({
        productId: parseInt(body.productId),
        quantity: parseInt(body.quantity),
        size: body.size.trim(),
        color: body.color.trim(),
        sessionId: body.sessionId.trim(),
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newCartItem[0], { status: 201 });

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
    const body = await request.json();

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existingRecord = await db.select()
      .from(cartItems)
      .where(eq(cartItems.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Cart item not found' 
      }, { status: 404 });
    }

    // Prepare update object
    const updates: any = {};

    // Validate and set fields if provided
    if (body.productId !== undefined) {
      if (isNaN(parseInt(body.productId))) {
        return NextResponse.json({ 
          error: "Valid product ID is required",
          code: "INVALID_PRODUCT_ID" 
        }, { status: 400 });
      }

      // Verify product exists
      const productExists = await db.select()
        .from(products)
        .where(eq(products.id, parseInt(body.productId)))
        .limit(1);

      if (productExists.length === 0) {
        return NextResponse.json({ 
          error: "Product not found",
          code: "PRODUCT_NOT_FOUND" 
        }, { status: 400 });
      }

      updates.productId = parseInt(body.productId);
    }

    if (body.quantity !== undefined) {
      if (isNaN(parseInt(body.quantity)) || parseInt(body.quantity) < 1) {
        return NextResponse.json({ 
          error: "Valid quantity (minimum 1) is required",
          code: "INVALID_QUANTITY" 
        }, { status: 400 });
      }
      updates.quantity = parseInt(body.quantity);
    }

    if (body.size !== undefined) {
      if (typeof body.size !== 'string' || body.size.trim() === '') {
        return NextResponse.json({ 
          error: "Size must be a non-empty string",
          code: "INVALID_SIZE" 
        }, { status: 400 });
      }
      updates.size = body.size.trim();
    }

    if (body.color !== undefined) {
      if (typeof body.color !== 'string' || body.color.trim() === '') {
        return NextResponse.json({ 
          error: "Color must be a non-empty string",
          code: "INVALID_COLOR" 
        }, { status: 400 });
      }
      updates.color = body.color.trim();
    }

    if (body.sessionId !== undefined) {
      if (typeof body.sessionId !== 'string' || body.sessionId.trim() === '') {
        return NextResponse.json({ 
          error: "Session ID must be a non-empty string",
          code: "INVALID_SESSION_ID" 
        }, { status: 400 });
      }
      updates.sessionId = body.sessionId.trim();
    }

    // Update the record
    const updated = await db.update(cartItems)
      .set(updates)
      .where(eq(cartItems.id, parseInt(id)))
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existingRecord = await db.select()
      .from(cartItems)
      .where(eq(cartItems.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Cart item not found' 
      }, { status: 404 });
    }

    // Delete the record
    const deleted = await db.delete(cartItems)
      .where(eq(cartItems.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Cart item deleted successfully',
      deletedItem: deleted[0]
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}