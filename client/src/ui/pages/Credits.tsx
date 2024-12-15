import React, { useEffect, useState } from 'react';
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const Credits = () => {
  const [customers, setCustomers] = useState([]);
  const [credits, setCredits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentCredit, setCurrentCredit] = useState(null);
  const [updatedUdhar, setUpdatedUdhar] = useState(0);

  const fetchCustomers = async () => {
    try {
      const { data } = await axiosInstance.get("/get-customers");
      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers.");
    }
  };

  const populateCredits = async () => {
    try {
      const creditArray = [];

      for (const customer of customers) {
        if (customer.udhar > 0 && customer.orders.length > 0) {
          const mostRecentOrderId = customer.orders[customer.orders.length - 1];
          // console.log(customer._id)
          try {
            const { data: orderData } = await axiosInstance.get(`/get-order/${mostRecentOrderId}`);
            creditArray.push({
              id: customer._id,
              name: customer.name,
              address: customer.address,
              contact: customer.contact,
              udhar: customer.udhar,
              billLink: orderData.order.bill,
            });
          } catch (error) {
            console.error(`Error fetching order for customer ${customer._id}:`, error);
          }
        }
      }
      setCredits(creditArray);
    } catch (error) {
      console.error("Error populating credits:", error);
      toast.error("Failed to populate credits.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [showModal]);

  useEffect(() => {
    if (customers.length > 0) {
      populateCredits();
    }
  }, [customers]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleDateChange = (e) => setFilterDate(e.target.value);

  const handleManageClick = (credit) => {
    setCurrentCredit(credit);
    setUpdatedUdhar(credit.udhar);
    setShowModal(true);
  };

  const handleUpdateUdhar = async () => {
    if (!currentCredit) return;
    // console.log(currentCredit)
  
    try {
      const { data } = await axiosInstance.put(`/returnUdhar/${currentCredit.id}`, {
        returnUdhar: updatedUdhar,
      });
  
      // Display success toast message
      toast.success(data.message);
      // console.error(data);
  
      setShowModal(false);
    } catch (error) {
      console.error("Error updating udhar:", error);
  
      // Display error toast message
      toast.error(
        error
      );
    }
  };
  

  const filteredCredits = credits.filter((credit) => {
    let creditDate = '';

    try {
      const match = credit.billLink.match(/(\d{4}-\d{2}-\d{2})/);
      creditDate = match ? match[1] : '';
    } catch (error) {
      console.error(`Invalid date in billLink for credit ID ${credit.id}:`, credit.billLink);
    }

    return (
      credit.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filterDate || creditDate === filterDate)
    );
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Credits</h2>

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
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Udhar</th>
            <th>Bill</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {filteredCredits.map((credit, index) => (
            <tr key={credit.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{index + 1}</td>
              <td>{credit.name}</td>
              <td>{credit.address}</td>
              <td>{credit.contact}</td>
              <td>{credit.udhar}</td>
              <td>
                <a href={credit.billLink} target="_blank" rel="noopener noreferrer">
                  View Bill
                </a>
              </td>
              <td>
                <button
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleManageClick(credit)}
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '300px',
            textAlign: 'center',
          }}>
            <h3>Update Udhar</h3>
            <p>Current Udhar: {currentCredit.udhar}</p>
            <input
              type="number"
              value={updatedUdhar}
              onChange={(e) => setUpdatedUdhar(Number(e.target.value))}
              style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '10px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUdhar}
                style={{
                  padding: '10px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credits;
