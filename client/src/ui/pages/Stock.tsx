import React, { useState } from 'react';

interface Product {
  id: number; // Added a unique ID for easier management
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const Stock: React.FC = () => {
  // Mock data
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Laptop', category: 'Electronics', price: 1200, quantity: 10 },
    { id: 2, name: 'T-shirt', category: 'Clothing', price: 25, quantity: 0 },
    { id: 3, name: 'Book', category: 'Books', price: 15, quantity: 20 },
  ]);

  const [viewInStock, setViewInStock] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEditChange = (field: keyof Product, value: string | number) => {
    if (selectedProduct) {
      setSelectedProduct({ ...selectedProduct, [field]: value });
    }
  };

  const handleDoneEdit = () => {
    if (selectedProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id ? selectedProduct : product
        )
      );
      setSelectedProduct(null);
    }
  };

  const handleDelete = () => {
    if (selectedProduct) {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== selectedProduct.id));
      setSelectedProduct(null);
    }
  };

  const filteredProducts = viewInStock
    ? products.filter((product) => product.quantity > 0)
    : products.filter((product) => product.quantity === 0);

  return (
    <div style={{ padding: '20px' }}>
      {/* Info Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ flex: 1, margin: '10px', padding: '20px', border: '1px solid #ddd', textAlign: 'center' }}>
          <h4>Total Products</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{products.length}</p>
        </div>
        <div style={{ flex: 1, margin: '10px', padding: '20px', border: '1px solid #ddd', textAlign: 'center' }}>
          <h4>Stock Value</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            ${products.reduce((acc, product) => acc + product.price * product.quantity, 0)}
          </p>
        </div>
        <div style={{ flex: 1, margin: '10px', padding: '20px', border: '1px solid #ddd', textAlign: 'center' }}>
          <h4>Total Categories</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {Array.from(new Set(products.map((product) => product.category))).length}
          </p>
        </div>
      </div>

      {/* Stock Management Section */}
      <div>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setViewInStock(true)}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: viewInStock ? '#007BFF' : '#DDD',
              color: '#FFF',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            In Stock Products
          </button>
          <button
            onClick={() => setViewInStock(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: !viewInStock ? '#007BFF' : '#DDD',
              color: '#FFF',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Out of Stock Products
          </button>
        </div>

        {/* Product List */}
        <div style={{ width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Product Name</th>
                <th style={{ padding: '10px' }}>Category</th>
                <th style={{ padding: '10px' }}>Price</th>
                <th style={{ padding: '10px' }}>Remaining Quantity</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{product.name}</td>
                  <td style={{ padding: '10px' }}>{product.category}</td>
                  <td style={{ padding: '10px' }}>${product.price}</td>
                  <td style={{ padding: '10px' }}>{product.quantity}</td>
                  <td style={{ padding: '10px' }}>
                    <button
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#28a745',
                        color: '#FFF',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedProduct(product)}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Editing Product */}
      {selectedProduct && (
  <div
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      backgroundColor: '#FFF',
      border: '1px solid #ddd',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      width: '500px',
    }}
  >
    <h3>Manage Product</h3>
    {/* Reference Row */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
        padding: '10px',
        border: '1px solid #ddd',
        marginBottom: '20px',
        borderRadius: '4px',
      }}
    >
      <span><strong>Name:</strong> {selectedProduct.name}</span>
      <span><strong>Category:</strong> {selectedProduct.category}</span>
      <span><strong>Price:</strong> ${selectedProduct.price}</span>
      <span><strong>Quantity:</strong> {selectedProduct.quantity}</span>
    </div>

    {/* Input Fields */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div>
        <label>Product Name:</label>
        <input
          type="text"
          value={selectedProduct.name}
          onChange={(e) => handleEditChange('name', e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          value={selectedProduct.price}
          onChange={(e) => handleEditChange('price', parseFloat(e.target.value))}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <div>
        <label>Remaining Quantity:</label>
        <input
          type="number"
          value={selectedProduct.quantity}
          onChange={(e) => handleEditChange('quantity', parseInt(e.target.value, 10))}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
    </div>

    {/* Action Buttons */}
    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
      <button
        onClick={handleDelete}
        style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: '#FFF', border: 'none' }}
      >
        Delete
      </button>
      <button
        onClick={() => setSelectedProduct(null)}
        style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#FFF', border: 'none' }}
      >
        Cancel
      </button>
      <button
        onClick={handleDoneEdit}
        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#FFF', border: 'none' }}
      >
        Done Edit
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Stock;
