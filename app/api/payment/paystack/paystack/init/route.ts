import { NextRequest, NextResponse } from 'next/server';
import { CheckoutPayload } from '@/hooks/useCheckout';

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutPayload = await req.json();
    const { billing, total, orderNumber } = body;
    const { email, firstName, lastName } = billing;

    if (!email || !total) {
      return NextResponse.json({ error: 'Email and total amount are required.' }, { status: 400 });
    }
    
    if (!process.env.PAYSTACK_SECRET_KEY) {
        throw new Error('Paystack secret key is not configured.');
    }

    const paystackData = {
      email: email,
      amount: Math.round(total * 100), // Amount in Kobo
      metadata: {
        order_id: orderNumber,
        customer_name: `${firstName} ${lastName}`,
      },
      callback_url: process.env.NEXT_PUBLIC_PAYSTACK_CALLBACK_URL,
    };

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackData),
    });

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json();
      console.error('Paystack API Error:', errorData);
      throw new Error(errorData.message || 'Failed to initialize Paystack transaction.');
    }

    const responseData = await paystackResponse.json();

    if (responseData.status === true) {
      return NextResponse.json({ authorization_url: responseData.data.authorization_url });
    } else {
      throw new Error('Paystack initialization failed.');
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}