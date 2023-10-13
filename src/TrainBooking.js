import React, { useState } from 'react';
import './App.css'

function TrainBooking() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [numTickets, setNumTickets] = useState(0);
  const [bookingDetails, setBookingDetails] = useState(null);

  const fetchTrains = async () => {
    const response = await fetch(`http://localhost:5000/usertrains?source=${source}&destination=${destination}`);
    const data = await response.json();
    setTrains(data);
  };

  const bookTickets = async () => {
    if (selectedTrain && numTickets > 0) {
      
      const response = await fetch(`http://localhost:5000/bookTickets/${selectedTrain.trainNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numTickets: numTickets,
          trainName: selectedTrain.trainName,
        }),
      });
  
      const bookingData = await response.json();
      setBookingDetails(bookingData);
  
      // Update the local state to reflect the reduced number of seats
      setSelectedTrain({ ...selectedTrain, seats: selectedTrain.seats - numTickets });
    }
  };
  

  return (
    <div className='adminbg'>
      <h1>Train Booking</h1>
      <form>
        <label>
          Source:
          <input type="text" value={source} onChange={(e) => setSource(e.target.value)} />
        </label>
        <label>
          Destination:
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
        </label>
        <button type="button" onClick={fetchTrains}>Search Trains</button>
      </form>
      <div>
        <h2>Available Trains:</h2>
        <ul>
          {trains.map((train) => (
            <li key={train.trainNumber}>
              Train Name: {train.trainName} - Train Number: {train.trainNumber} - Number of seats Available: {train.seats}
              <button onClick={() => setSelectedTrain(train)}>Select Train</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedTrain && (
        <div>
          <h2>Booking Details for {selectedTrain.trainName}</h2>
          <label>
            Number of Tickets:
            <input type="number" value={numTickets} onChange={(e) => setNumTickets(e.target.value)} />
          </label>
          <button type="button" onClick={bookTickets}>Book Tickets</button>
        </div>
      )}
      {bookingDetails && (
        <div>
          <h2>Booking Confirmation:</h2>
          <p>Booking ID: {bookingDetails.bookingId}</p>
          <p>Train Name: {bookingDetails.trainName}</p>
          <p>Number of Tickets: {bookingDetails.numTickets}</p>
          <p>Total Amount: {bookingDetails.totalAmount}</p>
        </div>
      )}
    </div>
  );
}

export default TrainBooking;
