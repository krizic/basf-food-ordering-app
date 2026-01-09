import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export function Cart() {
  const { items, subtotal, tax, deliveryFee, total, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add some delicious items from our menu!</p>
        <Link
          to="/menu"
          className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {items.map(item => (
          <div key={item.id} className="flex gap-4 p-4 border-b last:border-b-0">
            {item.menuItem.imageUrl && (
              <img
                src={item.menuItem.imageUrl}
                alt={item.menuItem.name}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.menuItem.name}</h3>
              {Object.keys(item.customizations).length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {Object.entries(item.customizations).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                </p>
              )}
              <p className="text-orange-600 font-medium mt-2">${item.unitPrice.toFixed(2)} each</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  -
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <span className="font-semibold">${item.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-3 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <Link
          to="/checkout"
          className="block w-full bg-orange-500 text-white text-center py-3 rounded-lg font-semibold mt-6 hover:bg-orange-600"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
