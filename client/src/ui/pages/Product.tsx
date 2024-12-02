import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Product {
  name: string;
  category: string;
  price: number;
}

const Product: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [categories, setCategories] = useState<string[]>(['Electronics', 'Clothing', 'Books']);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');

  const handleAddCategory = (): void => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!productName || !selectedCategory || !price) {
      alert('Please fill in all fields');
      return;
    }

    const newProduct: Product = {
      name: productName,
      category: selectedCategory,
      price: parseFloat(price),
    };

    console.log(newProduct);

    // Clear form inputs
    setProductName('');
    setSelectedCategory('');
    setPrice('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Add Product</h2>
      <form onSubmit={handleFormSubmit}>
        {/* Product Name */}
        <div style={{ marginBottom: '10px' }}>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
            placeholder="Enter product name"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Category Section */}
        <div style={{ marginBottom: '10px' }}>
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newCategory}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
            placeholder="Add new category"
            style={{ width: 'calc(100% - 60px)', padding: '8px', marginRight: '8px' }}
          />
          <button type="button" onClick={handleAddCategory} style={{ padding: '8px' }}>
            Add
          </button>
        </div>

        {/* Price */}
        <div style={{ marginBottom: '10px' }}>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
            placeholder="Enter product price"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" style={{ padding: '10px 20px' }}>
          Done
        </button>
      </form>
    </div>
  );
};

export default Product;
