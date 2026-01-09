import { Link } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { MenuItemCard } from '../components/menu/MenuItemCard';

export function Home() {
  const { items, loading } = useMenu();
  const featuredItems = items.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Delicious Food, Delivered Fast
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Order your favorite meals without creating an account. Quick, easy, and convenient.
          </p>
          <Link
            to="/menu"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🍕</div>
              <h3 className="font-semibold text-lg mb-2">Wide Selection</h3>
              <p className="text-gray-600">Choose from dozens of delicious options</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your food in 30-45 minutes</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-semibold text-lg mb-2">No Account Needed</h3>
              <p className="text-gray-600">Order as a guest with zero friction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Featured Items</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              to="/menu"
              className="inline-block border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
