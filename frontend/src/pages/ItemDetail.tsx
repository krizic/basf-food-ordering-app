import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { MenuItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { api } from '../services/api';

export function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchItem() {
      try {
        setLoading(true);
        const data = await api.getMenuItem(id!);
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load item');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (item) {
      addItem(item, quantity, customizations);
      setQuantity(1);
      setCustomizations({});
    }
  };

  const calculatePrice = () => {
    if (!item) return 0;
    let price = Number(item.price);
    item.options?.forEach(option => {
      const selected = customizations[option.name];
      if (selected) {
        const choice = option.choices.find(c => c.name === selected);
        if (choice?.priceDelta) {
          price += Number(choice.priceDelta);
        }
      }
    });
    return price * quantity;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-80 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600 mb-4">{error || 'Item not found'}</p>
        <Link to="/menu" className="text-orange-500 hover:underline">
          ← Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/menu" className="text-orange-500 hover:underline">
          ← Back to Menu
        </Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-80 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-lg">No image available</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full mb-2">
                {item.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
            </div>
            <span className="text-2xl font-bold text-orange-600">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>

          {item.description && (
            <p className="mt-4 text-gray-600 text-lg">{item.description}</p>
          )}

          {!item.isAvailable && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              This item is currently unavailable
            </div>
          )}

          {/* Customization Options */}
          {item.options && item.options.length > 0 && (
            <div className="mt-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Customize Your Order</h2>
              {item.options.map(option => (
                <div key={option.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {option.name} {option.isRequired && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    value={customizations[option.name] || ''}
                    onChange={(e) => setCustomizations(prev => ({ ...prev, [option.name]: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select {option.name}</option>
                    {option.choices.map(choice => (
                      <option key={choice.name} value={choice.name}>
                        {choice.name} {choice.priceDelta > 0 && `(+$${choice.priceDelta.toFixed(2)})`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-semibold"
              >
                -
              </button>
              <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-semibold"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-8">
            <button
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className={`w-full py-3 rounded-lg text-lg font-semibold transition-colors ${
                item.isAvailable
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add to Cart - ${calculatePrice().toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700">Category</h3>
            <p className="text-gray-600">{item.category}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700">Availability</h3>
            <p className={item.isAvailable ? 'text-green-600' : 'text-red-600'}>
              {item.isAvailable ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
