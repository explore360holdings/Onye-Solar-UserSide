
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
        console.error('Paystack verification failed: No reference provided.');
        return NextResponse.redirect(new URL('/payment/error?reason=no_reference', req.url));
    }
    
    if (!process.env.PAYSTACK_SECRET_KEY) {
        throw new Error('Paystack secret key is not configured.');
    }

    try {
        // 2. Make a secure, server-to-server call to Paystack's verification endpoint
        const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        if (!paystackResponse.ok) {
            const errorData = await paystackResponse.json();
            console.error('Paystack verification API Error:', errorData);
            throw new Error(errorData.message || 'Failed to verify transaction with Paystack.');
        }

        const data = await paystackResponse.json();

        // 3. Check the transaction status from Paystack's response
        if (data.data.status === 'success') {
            // SUCCESS!
            // Here is where you should update your database.
            // e.g., find the order by the reference or metadata and mark it as 'paid'.
            const orderId = data.data.metadata.order_id;
            console.log(`Payment successful for Order ID: ${orderId}. Updating database...`);

            // 4. Redirect the user to your final success page
            // We pass the orderId so the success page can display it.
            return NextResponse.redirect(new URL(`/payment/success?orderId=${orderId}`, req.url));
        } else {
            // The payment was not successful (e.g., failed, abandoned)
            console.error(`Paystack verification failed for reference ${reference}. Status: ${data.data.status}`);
            return NextResponse.redirect(new URL(`/payment/error?reason=${data.data.status}`, req.url));
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
        console.error('Verification Error:', errorMessage);
        return NextResponse.redirect(new URL('/payment/error?reason=internal_error', req.url));
    }
}