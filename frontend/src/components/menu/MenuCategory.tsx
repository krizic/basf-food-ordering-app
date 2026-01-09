interface Props {
  categories: string[];
  selected: string[];
  onSelect: (categories: string[]) => void;
}

export function MenuCategory({ categories, selected, onSelect }: Props) {
  const isAllSelected = selected.length === 0;

  const handleCategoryClick = (category: string) => {
    if (selected.includes(category)) {
      // Deselect category
      onSelect(selected.filter(c => c !== category));
    } else {
      // Add category to selection
      onSelect([...selected, category]);
    }
  };

  const handleAllClick = () => {
    // Clear all selections to show all items
    onSelect([]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleAllClick}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          isAllSelected
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected.includes(category)
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
