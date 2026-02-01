import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Package, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [status, setStatus] = useState('loading'); // loading, success, failed
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      setStatus('failed');
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await axios.get(`${API}/checkout/status/${sessionId}`);
        setPaymentInfo(res.data);
        
        if (res.data.payment_status === 'paid') {
          setStatus('success');
        } else if (res.data.status === 'expired') {
          setStatus('failed');
        } else if (attempts < 5) {
          // Continue polling
          setTimeout(() => setAttempts(a => a + 1), 2000);
        } else {
          setStatus('failed');
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
        if (attempts < 5) {
          setTimeout(() => setAttempts(a => a + 1), 2000);
        } else {
          setStatus('failed');
        }
      }
    };

    checkStatus();
  }, [sessionId, attempts]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center" data-testid="order-confirmation-loading">
        <Loader2 className="w-16 h-16 text-[#BC4C2E] mx-auto mb-4 animate-spin" />
        <h1 className="font-['Playfair_Display'] text-3xl font-medium mb-4">Processing Your Order</h1>
        <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container mx-auto px-4 py-16 text-center" data-testid="order-confirmation-failed">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="font-['Playfair_Display'] text-3xl font-medium mb-4">Payment Failed</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't process your payment. Please try again or contact support.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/cart">
            <Button variant="outline">Return to Cart</Button>
          </Link>
          <Link to="/contact">
            <Button className="bg-[#BC4C2E] hover:bg-[#9A3412]">Contact Support</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center" data-testid="order-confirmation-success">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="font-['Playfair_Display'] text-4xl font-medium mb-4">Thank You For Your Order!</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
        Your order has been confirmed and will be shipped soon. We've sent a confirmation email with all the details.
      </p>

      <div className="bg-white rounded-xl p-6 max-w-md mx-auto shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-8">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#BC4C2E]" />
            <span>Order Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#BC4C2E]" />
            <span>Email Sent</span>
          </div>
        </div>
        
        {paymentInfo && (
          <div className="mt-4 pt-4 border-t text-left">
            <p className="text-sm text-muted-foreground">Amount Paid</p>
            <p className="text-2xl font-bold">£{(paymentInfo.amount_total / 100).toFixed(2)}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/account">
          <Button variant="outline" className="w-full sm:w-auto">View My Orders</Button>
        </Link>
        <Link to="/">
          <Button className="bg-[#BC4C2E] hover:bg-[#9A3412] w-full sm:w-auto">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
