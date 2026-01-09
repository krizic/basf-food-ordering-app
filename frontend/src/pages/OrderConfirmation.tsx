import { useParams, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Order } from '../types';

interface OrderWithEstimate extends Order {
  estimatedDelivery?: string;
}

export function OrderConfirmation() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState<OrderWithEstimate | null>(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!order && orderNumber) {
      api.getOrder(orderNumber, location.state?.email)
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [orderNumber, order, location.state?.email]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-8">{error || 'Unable to find order details'}</p>
        <Link
          to="/"
          className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const statusSteps = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentStepIndex = statusSteps.indexOf(order.status || 'PENDING');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your order</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="text-2xl font-bold text-orange-600">{order.orderNumber}</p>
        </div>

        {/* Order Status */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Order Status</h3>
          <div className="flex justify-between">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    index <= currentStepIndex
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStepIndex ? '✓' : index + 1}
                </div>
                <p className="text-xs mt-1 text-center">{step.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Delivery */}
        {order.estimatedDelivery && (
          <div className="text-center py-4 bg-orange-50 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Estimated Delivery</p>
            <p className="text-lg font-semibold text-orange-600">
              {new Date(order.estimatedDelivery).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        )}

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Delivery Address</h3>
            <p className="text-gray-600">
              {order.deliveryAddress.street}<br />
              {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
            </p>
          </div>
        )}

        {/* Order Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total Paid</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-4">
          A confirmation email has been sent to your email address.
        </p>
        <Link
          to="/menu"
          className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600"
        >
          Order Again
        </Link>
      </div>
    </div>
  );
}
