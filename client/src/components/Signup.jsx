import React from 'react';
import { Link } from 'react-router-dom';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animal: ''
    }
    this.formData = {
      name: '',
      email: '',
      username: '',
      password: ''
    };
  }

  getFormData(e) {
    if (e) {
      e.preventDefault();
    }
    if (!this.refs.name.value) {
      document.getElementById("name").placeholder = "Please enter a valid name...";
    }
    if (!this.refs.email.value) {
      document.getElementById("email").placeholder = "Please enter a valid email...";
    }
    if (!this.refs.username.value) {
      document.getElementById("username").placeholder = "Please enter a valid username...";
    }
    if (!this.refs.password.value) {
      document.getElementById("password").placeholder = "Please enter a valid password...";
    }
    this.formData = {
      name: this.refs.name.value,
      email: this.refs.email.value,
      username: this.refs.username.value,
      password: this.refs.password.value
    }
    let filledIn = true;
    for (let key in this.formData) {
      if (!this.formData[key]) {
        filledIn = false;
        document.getElementById(`${key}`).placeholder = `Please enter a valid ${key}...`;
      }
    }
    if (filledIn) {
      this.props.createUser(this.formData)
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.getFormData();
    }
  }

  render() {
    return(
      <div>
        <button onClick={this.props.history.goBack}>Go Back</button>
        <form onSubmit={ this.getFormData.bind(this) } >
          <input ref="name" id="name" type="text" placeholder="Name" autoFocus/>
          <input ref="email" id="email" type="text" placeholder="E-mail" />
          <input ref="username" id="username" type="text" placeholder="Username" />
          <input ref="password" id="password" type="password" placeholder="Password" />
          <input className='submitCreateForm' type="submit" value="Create Account" onKeyPress={this.handleKeyPress.bind(this)}/>
        </form>
      </div>
    )
  }
}


export default Signup;
