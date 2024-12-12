import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

interface Product {
  name: string;
  category: string;
  price: number;
  stockQty: number;
}

const Product: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [stockQty, setStockQty] = useState<string>('');
  const [categories, setCategories] = useState<string[]>(['Electronics', 'Clothing', 'Books']);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [refreshCategories, setRefreshCategories] = useState<boolean>(false); // State to trigger useEffect

  const syncCategory = () => {
    axiosInstance
      .get('/get-products')
      .then((response) => {
        const uniqueCategories: string[] = Array.from(
          new Set(response.data.products.map((product: Product) => product.category))
        );
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  };

  useEffect(() => {
    syncCategory();
  }, [refreshCategories]); // Trigger only on page load or refreshCategories change

  const handleAddCategory = (): void => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!productName || !selectedCategory || !price || !stockQty) {
      alert('Please fill in all fields');
      return;
    }

    const newProduct: Product = {
      name: productName,
      category: selectedCategory,
      price: parseFloat(price),
      stockQty: parseInt(stockQty, 10),
    };

    axiosInstance
      .post('/add-product', newProduct)
      .then(() => {
        toast.success('Product added successfully');
        setRefreshCategories((prev) => !prev); // Trigger category refresh
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'An error occurred');
      });

    // Clear form inputs
    setProductName('');
    setSelectedCategory('');
    setPrice('');
    setStockQty('');
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
            <option value="" disabled>
              Select a category
            </option>
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

        {/* Stock Quantity */}
        <div style={{ marginBottom: '10px' }}>
          <label>Stock Quantity:</label>
          <input
            type="number"
            value={stockQty}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setStockQty(e.target.value)}
            placeholder="Enter stock quantity"
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
