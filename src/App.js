import React, { Component } from 'react';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import TrainBooking from './TrainBooking';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/trainbooking" element={<TrainBooking />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
