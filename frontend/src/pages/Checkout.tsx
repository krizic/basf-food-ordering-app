import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '../contexts/CartContext';
import { api } from '../services/api';

const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  instructions: z.string().optional(),
  specialInstructions: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

interface DiscountState {
  code: string;
  isValidating: boolean;
  isValid: boolean | null;
  message: string | null;
  discountAmount: number;
  discountType: string | null;
  description: string | null;
}

export function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, tax, deliveryFee, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discount, setDiscount] = useState<DiscountState>({
    code: '',
    isValidating: false,
    isValid: null,
    message: null,
    discountAmount: 0,
    discountType: null,
    description: null,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  const validateDiscountCode = async () => {
    if (!discount.code.trim()) {
      setDiscount(prev => ({
        ...prev,
        isValid: null,
        message: null,
        discountAmount: 0,
        description: null,
      }));
      return;
    }

    setDiscount(prev => ({ ...prev, isValidating: true }));

    try {
      const result = await api.validateDiscount(discount.code, subtotal);
      setDiscount(prev => ({
        ...prev,
        isValidating: false,
        isValid: result.valid,
        message: result.valid ? result.description || 'Discount applied!' : result.message || 'Invalid code',
        discountAmount: result.discountAmount || 0,
        discountType: result.discountType || null,
        description: result.description || null,
      }));
    } catch {
      setDiscount(prev => ({
        ...prev,
        isValidating: false,
        isValid: false,
        message: 'Failed to validate discount code',
        discountAmount: 0,
      }));
    }
  };

  const finalTotal = total - discount.discountAmount;

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = {
        customer: {
          email: data.email,
          phone: data.phone,
        },
        deliveryAddress: {
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          instructions: data.instructions,
        },
        items: items.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          customizations: item.customizations,
        })),
        specialInstructions: data.specialInstructions,
        discountCode: discount.isValid ? discount.code : undefined,
      };

      const result = await api.createOrder(orderData);
      clearCart();
      navigate(`/order-confirmation/${result.orderNumber}`, { 
        state: { order: result, email: data.email } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (optional)
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('street')}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="123 Main Street, Apt 4B"
                />
                {errors.street && (
                  <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('city')}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('postalCode')}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="10001"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Instructions (optional)
                </label>
                <textarea
                  {...register('instructions')}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ring doorbell, leave at door, etc."
                />
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
            <textarea
              {...register('specialInstructions')}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Any special requests for your order..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Placing Order...' : `Place Order • $${finalTotal.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.menuItem.name}
                  </span>
                  <span>${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Discount Code Input */}
            <div className="border-t pt-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discount.code}
                  onChange={(e) => setDiscount(prev => ({
                    ...prev,
                    code: e.target.value.toUpperCase(),
                    isValid: null,
                    message: null,
                    discountAmount: 0,
                  }))}
                  onBlur={validateDiscountCode}
                  placeholder="Enter code"
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    discount.isValid === true ? 'border-green-500 bg-green-50' :
                    discount.isValid === false ? 'border-red-500 bg-red-50' : ''
                  }`}
                />
                {discount.isValidating && (
                  <div className="flex items-center px-3">
                    <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              {discount.message && (
                <p className={`text-sm mt-1 ${discount.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {discount.message}
                </p>
              )}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              {discount.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount {discount.discountType === 'percentage' ? `(${discount.description})` : ''}</span>
                  <span>-${discount.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
