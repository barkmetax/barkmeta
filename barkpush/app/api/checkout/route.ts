import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PACKAGES, WRITING, type PackageKey, type WritingKey } from '@/lib/packages';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      publishingPackage,
      writingPackage,
      brandName,
      brandUrl,
      country,
      contactName,
      contactEmail,
      description,
      keywords,
    } = body;

    const pubPkg = PACKAGES[publishingPackage as PackageKey];
    const writePkg = WRITING[writingPackage as WritingKey];

    if (!pubPkg || !writePkg) {
      return NextResponse.json({ error: 'Invalid package selection' }, { status: 400 });
    }

    const lineItems: {
      price_data: { currency: string; product_data: { name: string }; unit_amount: number };
      quantity: number;
    }[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: pubPkg.name },
          unit_amount: pubPkg.price,
        },
        quantity: 1,
      },
    ];

    if (writePkg.price > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: writePkg.name },
          unit_amount: writePkg.price,
        },
        quantity: 1,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      metadata: {
        name,
        email,
        publishingPackage,
        writingPackage,
        brandName,
        brandUrl,
        country,
        contactName: contactName || '',
        contactEmail: contactEmail || '',
        description: description?.slice(0, 500) || '',
        keywords: keywords || '',
      },
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/order/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
