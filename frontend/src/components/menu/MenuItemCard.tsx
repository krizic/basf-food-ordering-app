import { useState } from 'react';
import type { MenuItem } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface Props {
  item: MenuItem;
}

export function MenuItemCard({ item }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item, quantity, customizations);
    setQuantity(1);
    setCustomizations({});
    setIsExpanded(false);
  };

  const handleItemClick = () => {
    window.open(`/menu/${item.id}`, '_blank');
  };

  const calculatePrice = () => {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
          loading="lazy"
          onClick={handleItemClick}
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 
            className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-orange-600 transition-colors"
            onClick={handleItemClick}
          >
            {item.name}
          </h3>
          <span className="text-orange-600 font-semibold">${Number(item.price).toFixed(2)}</span>
        </div>
        {item.description && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
        )}

        {isExpanded ? (
          <div className="mt-4 space-y-4">
            {item.options?.map(option => (
              <div key={option.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {option.name} {option.isRequired && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={customizations[option.name] || ''}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, [option.name]: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500"
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

            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium">Quantity:</span>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Add ${calculatePrice().toFixed(2)}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full mt-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
