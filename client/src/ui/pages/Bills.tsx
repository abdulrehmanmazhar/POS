import React, { useState } from 'react';

type Bill = {
  id: number;
  name: string;
  address: string;
  contact: string;
  billDate: string; // ISO format for simplicity
  billLink: string;
};

const Bills = () => {
  const [bills, setBills] = useState<Bill[]>([
    { id: 1, name: 'Ali Khan', address: '123 Street, Lahore', contact: '0321-1234567', billDate: '2024-12-01', billLink: 'https://example.com/bill/1' },
    { id: 2, name: 'Sara Ahmed', address: '456 Avenue, Karachi', contact: '0332-7654321', billDate: '2024-11-30', billLink: 'https://example.com/bill/2' },
    { id: 3, name: 'Usman Tariq', address: '789 Road, Islamabad', contact: '0343-9876543', billDate: '2024-12-02', billLink: 'https://example.com/bill/3' },
  ]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterDate, setFilterDate] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
  };

  const handleSortChange = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    setBills((prevBills) =>
      [...prevBills].sort((a, b) =>
        sortDirection === 'asc'
          ? new Date(a.billDate).getTime() - new Date(b.billDate).getTime()
          : new Date(b.billDate).getTime() - new Date(a.billDate).getTime()
      )
    );
  };

  const filteredBills = bills.filter((bill) =>
    bill.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!filterDate || bill.billDate === filterDate)
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Heading */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Bills</h2>

      {/* Search, Date, and Sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '20px' }}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            padding: '10px',
            flex: '2',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
        
        {/* Date Filter */}
        <input
          type="date"
          value={filterDate}
          onChange={handleDateChange}
          style={{
            padding: '10px',
            flex: '1',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
        
        {/* Sort Button */}
        <button
          onClick={handleSortChange}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Sort by Date ({sortDirection === 'asc' ? 'Newest' : 'Oldest'})
        </button>
      </div>

      {/* Bill Listing */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Bill</th>
          </tr>
        </thead>
        <tbody>
          {filteredBills.map((bill, index) => (
            <tr key={bill.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{index + 1}</td>
              <td>{bill.name}</td>
              <td>{bill.address}</td>
              <td>{bill.contact}</td>
              <td>{new Date(bill.billDate).toLocaleDateString()}</td>
              <td>
                <a href={bill.billLink} target="_blank" rel="noopener noreferrer">
                  View Bill
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bills;
