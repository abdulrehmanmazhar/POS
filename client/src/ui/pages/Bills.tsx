import React, { useEffect, useState } from 'react';
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

type Bill = {
  id: number; // Added id field
  name: string;
  address: string;
  contact: string;
  billDate: string; // ISO format
  billLink: string;
};

const Bills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterDate, setFilterDate] = useState<string>('');
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/get-orders");
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  const billCreator = async () => {
    try {
      const billArray: Bill[] = [];
      for (let order of orders) {
        try {
          const { data } = await axiosInstance.get(`/get-customer/${order.customerId}`);
          const customerData = data.customer;
          const bill: Bill = {
            id: order.id, // Ensure 'id' is present in 'order'
            name: customerData.name,
            address: customerData.address,
            contact: customerData.contact,
            billDate: order.updatedAt,
            billLink: order.bill,
          };
          billArray.push(bill);
        } catch (error) {
          console.error(`Error fetching customer data for order ${order.id}:`, error);
        }
      }
      setBills(billArray);
    } catch (error) {
      console.error("Error creating bills:", error);
      toast.error("Failed to create bills.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      billCreator();
    }
  }, [orders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
  };

  const handleSortChange = () => {
    const sortedBills = [...bills].sort((a, b) => {
      return sortDirection === 'asc'
        ? new Date(a.billDate).getTime() - new Date(b.billDate).getTime()
        : new Date(b.billDate).getTime() - new Date(a.billDate).getTime();
    });
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    setBills(sortedBills);
  };

  const filteredBills = bills.filter((bill) => {
    const billDate = new Date(bill.billDate).toISOString().split('T')[0]; // Normalize billDate
    return (
      bill.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filterDate || billDate === filterDate)
    );
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Bills</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ padding: '10px', flex: '2', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <input
          type="date"
          value={filterDate}
          onChange={handleDateChange}
          style={{ padding: '10px', flex: '1', border: '1px solid #ddd', borderRadius: '4px' }}
        />
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
                   Bill Link
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
