import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css'

class RegistrationForm extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    };
  }

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleRegistration = () => {
    const { username, password } = this.state;
    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
      })
      .catch(error => console.error('Error:', error));
  };

  render() {
    return (
      <div className="Form">
        <h1>Registration</h1>
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={this.handleInputChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleRegistration}>Register</button>
        <p>Already Registered <button><Link to="/login">Login</Link></button></p>
      </div>
    );
  }
}

export default RegistrationForm;

