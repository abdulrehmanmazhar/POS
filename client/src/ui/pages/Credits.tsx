import  { useState } from 'react';

type Customer = {
  id: number;
  name: string;
  address: string;
  contact: string;
  amount: number;
  billLink: string;
};

const Credits = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: 'Ali Khan', address: '123 Street, Lahore', contact: '0321-1234567', amount: 5000, billLink: 'https://example.com/bill/1' },
    { id: 2, name: 'Sara Ahmed', address: '456 Avenue, Karachi', contact: '0332-7654321', amount: 3000, billLink: 'https://example.com/bill/2' },
    { id: 3, name: 'Usman Tariq', address: '789 Road, Islamabad', contact: '0343-9876543', amount: 7000, billLink: 'https://example.com/bill/3' },
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('');

  const handleManageClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setPaymentAmount('');
  };

  const handlePayment = () => {
    if (paymentAmount === '' || paymentAmount <= 0) {
      alert('Please enter a valid payment amount!');
      return;
    }
    if (selectedCustomer) {
      const updatedCustomers = customers.map((customer) =>
        customer.id === selectedCustomer.id
          ? { ...customer, amount: customer.amount - Number(paymentAmount) }
          : customer
      );
      setCustomers(updatedCustomers);
      setSelectedCustomer(null);
      setPaymentAmount('');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Heading */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Udhar</h2>

      {/* User Listing */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Amount</th>
            <th>Bill</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {customers
            .filter((customer) => customer.amount > 0)
            .map((customer, index) => (
              <tr key={customer.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{index + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.contact}</td>
                <td>${customer.amount}</td>
                <td>
                  <a href={customer.billLink} target="_blank" rel="noopener noreferrer">
                    View Bill
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => handleManageClick(customer)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Manage Modal */}
      {selectedCustomer && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            width: '400px',
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>Manage Customer</h3>
          <p><strong>Name:</strong> {selectedCustomer.name}</p>
          <p><strong>Amount Owed:</strong> ${selectedCustomer.amount}</p>
          <div style={{ marginBottom: '20px' }}>
            <label>
              Payment Amount:
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value !== '' ? Number(e.target.value) : '')}
                style={{ marginLeft: '10px', padding: '5px', width: '100%' }}
              />
            </label>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              onClick={() => setSelectedCustomer(null)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              style={{
                padding: '5px 10px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credits;
