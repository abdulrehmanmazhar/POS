import React, { useState } from "react";
import "./styles/Customer.css";

const Customer = () => {
  const [view, setView] = useState("add"); // "add" for form, "list" for customer list
  const [customers, setCustomers] = useState([
    { id: 1, name: "John Doe", contact: "123456789", address: "123 Main St" },
    { id: 2, name: "Jane Smith", contact: "987654321", address: "456 Oak Ave" },
  ]);
  const [newCustomer, setNewCustomer] = useState({ name: "", contact: "", address: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const addCustomer = () => {
    if (newCustomer.name && newCustomer.contact && newCustomer.address) {
      setCustomers([
        ...customers,
        {
          id: customers.length + 1,
          ...newCustomer,
        },
      ]);
      setNewCustomer({ name: "", contact: "", address: "" });
    }
  };

  const deleteCustomer = (id: number) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const editCustomer = (id: number) => {
    const customerToEdit = customers.find((customer) => customer.id === id);
    if (customerToEdit) {
      setNewCustomer(customerToEdit);
      deleteCustomer(id);
      setView("add"); // Switch to add view for editing
    }
  };

  return (
    <div className="customer-page">
      {/* Top bar */}
      <div className="top-bar">
        <button
          className={`top-bar-button ${view === "add" ? "active" : ""}`}
          onClick={() => setView("add")}
        >
          Add Customer
        </button>
        <button
          className={`top-bar-button ${view === "list" ? "active" : ""}`}
          onClick={() => setView("list")}
        >
          Customer List
        </button>
      </div>

      {/* Dynamic content */}
      {view === "add" ? (
        <div className="create-customer">
          <h2>Create New Customer</h2>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              placeholder="Enter customer's name"
            />
          </div>
          <div className="form-group">
            <label>Contact</label>
            <input
              type="text"
              name="contact"
              value={newCustomer.contact}
              onChange={handleInputChange}
              placeholder="Enter customer's contact"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={newCustomer.address}
              onChange={handleInputChange}
              placeholder="Enter customer's address"
            />
          </div>
          <button className="add-button" onClick={addCustomer}>
            Add Customer
          </button>
        </div>
      ) : (
        <div className="customer-list">
          <h2>Customer List</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.contact}</td>
                  <td>{customer.address}</td>
                  <td>
                    <button className="edit-button" onClick={() => editCustomer(customer.id)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => deleteCustomer(customer.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customer;
