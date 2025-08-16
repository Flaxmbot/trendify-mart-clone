import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orderItems, orders, products } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const orderId = searchParams.get('orderId');
    const productId = searchParams.get('productId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'id';
    const order = searchParams.get('order') || 'desc';

    // Get single order item by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const orderItem = await db.select()
        .from(orderItems)
        .where(eq(orderItems.id, parseInt(id)))
        .limit(1);

      if (orderItem.length === 0) {
        return NextResponse.json({ 
          error: 'Order item not found' 
        }, { status: 404 });
      }

      return NextResponse.json(orderItem[0]);
    }

    // Build query with filters
    let query = db.select().from(orderItems);
    const conditions = [];

    if (orderId) {
      if (isNaN(parseInt(orderId))) {
        return NextResponse.json({ 
          error: "Valid order ID is required",
          code: "INVALID_ORDER_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(orderItems.orderId, parseInt(orderId)));
    }

    if (productId) {
      if (isNaN(parseInt(productId))) {
        return NextResponse.json({ 
          error: "Valid product ID is required",
          code: "INVALID_PRODUCT_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(orderItems.productId, parseInt(productId)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const orderDirection = order === 'asc' ? asc : desc;
    const sortField = sort === 'orderId' ? orderItems.orderId :
                     sort === 'productId' ? orderItems.productId :
                     sort === 'quantity' ? orderItems.quantity :
                     sort === 'price' ? orderItems.price :
                     orderItems.id;
    
    query = query.orderBy(orderDirection(sortField));

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
    const { orderId, productId, quantity, price, size, color } = body;

    // Validate required fields
    if (!orderId) {
      return NextResponse.json({ 
        error: "Order ID is required",
        code: "MISSING_ORDER_ID" 
      }, { status: 400 });
    }

    if (!productId) {
      return NextResponse.json({ 
        error: "Product ID is required",
        code: "MISSING_PRODUCT_ID" 
      }, { status: 400 });
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json({ 
        error: "Valid quantity is required",
        code: "INVALID_QUANTITY" 
      }, { status: 400 });
    }

    if (!price || price <= 0) {
      return NextResponse.json({ 
        error: "Valid price is required",
        code: "INVALID_PRICE" 
      }, { status: 400 });
    }

    if (!size || typeof size !== 'string' || size.trim() === '') {
      return NextResponse.json({ 
        error: "Size is required",
        code: "MISSING_SIZE" 
      }, { status: 400 });
    }

    if (!color || typeof color !== 'string' || color.trim() === '') {
      return NextResponse.json({ 
        error: "Color is required",
        code: "MISSING_COLOR" 
      }, { status: 400 });
    }

    // Validate foreign key references
    if (isNaN(parseInt(orderId))) {
      return NextResponse.json({ 
        error: "Valid order ID is required",
        code: "INVALID_ORDER_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(productId))) {
      return NextResponse.json({ 
        error: "Valid product ID is required",
        code: "INVALID_PRODUCT_ID" 
      }, { status: 400 });
    }

    // Check if order exists
    const orderExists = await db.select()
      .from(orders)
      .where(eq(orders.id, parseInt(orderId)))
      .limit(1);

    if (orderExists.length === 0) {
      return NextResponse.json({ 
        error: "Order not found",
        code: "ORDER_NOT_FOUND" 
      }, { status: 400 });
    }

    // Check if product exists
    const productExists = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(productId)))
      .limit(1);

    if (productExists.length === 0) {
      return NextResponse.json({ 
        error: "Product not found",
        code: "PRODUCT_NOT_FOUND" 
      }, { status: 400 });
    }

    // Create order item
    const newOrderItem = await db.insert(orderItems)
      .values({
        orderId: parseInt(orderId),
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        price: parseFloat(price),
        size: size.trim(),
        color: color.trim()
      })
      .returning();

    return NextResponse.json(newOrderItem[0], { status: 201 });

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

    // Check if order item exists
    const existingOrderItem = await db.select()
      .from(orderItems)
      .where(eq(orderItems.id, parseInt(id)))
      .limit(1);

    if (existingOrderItem.length === 0) {
      return NextResponse.json({ 
        error: 'Order item not found' 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and update fields if provided
    if (body.orderId !== undefined) {
      if (!body.orderId || isNaN(parseInt(body.orderId))) {
        return NextResponse.json({ 
          error: "Valid order ID is required",
          code: "INVALID_ORDER_ID" 
        }, { status: 400 });
      }

      // Check if order exists
      const orderExists = await db.select()
        .from(orders)
        .where(eq(orders.id, parseInt(body.orderId)))
        .limit(1);

      if (orderExists.length === 0) {
        return NextResponse.json({ 
          error: "Order not found",
          code: "ORDER_NOT_FOUND" 
        }, { status: 400 });
      }

      updates.orderId = parseInt(body.orderId);
    }

    if (body.productId !== undefined) {
      if (!body.productId || isNaN(parseInt(body.productId))) {
        return NextResponse.json({ 
          error: "Valid product ID is required",
          code: "INVALID_PRODUCT_ID" 
        }, { status: 400 });
      }

      // Check if product exists
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
      if (!body.quantity || body.quantity <= 0) {
        return NextResponse.json({ 
          error: "Valid quantity is required",
          code: "INVALID_QUANTITY" 
        }, { status: 400 });
      }
      updates.quantity = parseInt(body.quantity);
    }

    if (body.price !== undefined) {
      if (!body.price || body.price <= 0) {
        return NextResponse.json({ 
          error: "Valid price is required",
          code: "INVALID_PRICE" 
        }, { status: 400 });
      }
      updates.price = parseFloat(body.price);
    }

    if (body.size !== undefined) {
      if (!body.size || typeof body.size !== 'string' || body.size.trim() === '') {
        return NextResponse.json({ 
          error: "Size is required",
          code: "MISSING_SIZE" 
        }, { status: 400 });
      }
      updates.size = body.size.trim();
    }

    if (body.color !== undefined) {
      if (!body.color || typeof body.color !== 'string' || body.color.trim() === '') {
        return NextResponse.json({ 
          error: "Color is required",
          code: "MISSING_COLOR" 
        }, { status: 400 });
      }
      updates.color = body.color.trim();
    }

    // Update order item
    const updated = await db.update(orderItems)
      .set(updates)
      .where(eq(orderItems.id, parseInt(id)))
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

    // Check if order item exists
    const existingOrderItem = await db.select()
      .from(orderItems)
      .where(eq(orderItems.id, parseInt(id)))
      .limit(1);

    if (existingOrderItem.length === 0) {
      return NextResponse.json({ 
        error: 'Order item not found' 
      }, { status: 404 });
    }

    // Delete order item
    const deleted = await db.delete(orderItems)
      .where(eq(orderItems.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Order item deleted successfully',
      deletedItem: deleted[0]
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}