import React, { Component } from 'react';
import axios from 'axios';
import './App.css'

const API_BASE_URL = 'http://localhost:5000';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      train: {},
      seatsToAdd: 0,
      seatsToDelete: 0,
      allTrains: [],
    };
  }

  fetchAllTrains = () => {
    axios.get(`${API_BASE_URL}/getAllTrains`)
      .then((response) => {
        this.setState({ allTrains: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  componentDidMount() {
    // Fetch all trains when the component loads
    this.fetchAllTrains();
  }

  handleAddTrain = () => {
    axios.post(`${API_BASE_URL}/addTrain`, this.state.train)
      .then((response) => {
        console.log(response.data);
        this.fetchAllTrains();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleDeleteTrain = (trainNumber) => {
    axios.delete(`${API_BASE_URL}/deleteTrain/${trainNumber}`)
      .then(() => {
        console.log(`Train ${trainNumber} deleted`);
        this.fetchAllTrains();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleAddSeats = (trainNumber) => {
    axios.put(`${API_BASE_URL}/addSeats/${trainNumber}`, { seats: this.state.seatsToAdd })
      .then((response) => {
        console.log(`Added ${this.state.seatsToAdd} seats to train ${trainNumber}`);
        this.setState({ train: response.data });
        this.fetchAllTrains();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleDeleteSeats = (trainNumber) => {
    axios.delete(`${API_BASE_URL}/deleteSeats/${trainNumber}`, { data: { seats: this.state.seatsToDelete } })
      .then((response) => {
        console.log(`Deleted ${this.state.seatsToDelete} seats from train ${trainNumber}`);
        this.setState({ train: response.data });
        this.fetchAllTrains();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { allTrains, train, seatsToAdd, seatsToDelete } = this.state;

    return (
      <div className='adminbg'>
        <div>
          <h2>All Trains</h2>
          <ul>
            {allTrains.map((t) => (
              <li key={t.trainNumber}>Train Name :{t.trainName} - Train Number: {t.trainNumber} - Number of seats Available: {t.seats}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Add Train</h2>
          <input
            type="text"
            placeholder="Train Name"
            onChange={(e) => this.setState({ train: { ...train, trainName: e.target.value } })}
          />
          <input
            type="text"
            placeholder="Train Number"
            onChange={(e) => this.setState({ train: { ...train, trainNumber: e.target.value } })}
          />
          <input
            type="text"
            placeholder="PNR Number"
            onChange={(e) => this.setState({ train: { ...train, pnrNumber: e.target.value } })}
          />
          <input
            type="text"
            placeholder="Source"
            onChange={(e) => this.setState({ train: { ...train, source: e.target.value } })}
          />
          <input
            type="text"
            placeholder="Destination"
            onChange={(e) => this.setState({ train: { ...train, destination: e.target.value } })}
          />
          <input
            type="text"
            placeholder="Number of seats"
            onChange={(e) => this.setState({ train: { ...train, seats: e.target.value } })}
          />
          
          <button onClick={this.handleAddTrain}>Add Train</button>
        </div>
        <div>
          <h2>Delete Train</h2>
          <input
            type="text"
            placeholder="Train Number"
            onChange={(e) => this.setState({ train: { ...train, trainNumber: e.target.value } })}
          />
          <button onClick={() => this.handleDeleteTrain(train.trainNumber)}>Delete Train</button>
        </div>
        <div>
          <h2>Add Seats</h2>
          <input
            type="number"
            placeholder="Seats to Add"
            onChange={(e) => this.setState({ seatsToAdd: e.target.value })}
          />
          <input
            type="text"
            placeholder="Train Number"
            onChange={(e) => this.setState({ train: { ...train, trainNumber: e.target.value } })}
          />
          <button onClick={() => this.handleAddSeats(train.trainNumber)}>Add Seats</button>
        </div>
        <div>
          <h2>Delete Seats</h2>
          <input
            type="number"
            placeholder="Seats to Delete"
            onChange={(e) => this.setState({ seatsToDelete: e.target.value })}
          />
          <input
            type="text"
            placeholder="Train Number"
            onChange={(e) => this.setState({ train: { ...train, trainNumber: e.target.value } })}
          />
          <button onClick={() => this.handleDeleteSeats(train.trainNumber)}>Delete Seats</button>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
