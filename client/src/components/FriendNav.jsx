import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Button, Modal, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import ChatForm from './ChatForm.jsx';

class FriendNav extends React.Component {
  constructor(props) {
    super(props);

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);

		this.state = {
			showModal: false,
			friends: [],
			messageWith: {},
			msgs: []
		};
  }

  receiveMsgs(messages) {
  	this.setState({ msgs: messages });
  }

	handleClose() {
		this.setState({ showModal: false });
	}

	handleShow(friend) {
		this.setState({ showModal: true, messageWith: friend });
	}

  componentWillMount() {
  	let id = JSON.parse(localStorage.getItem('loggedUser')).id;
    axios.get(`/user/friends/${id}`)
      .then(resp => {
        if (resp.status === 200) {
        	this.setState({ friends: resp.data });
        }
      })
      .catch(err => {
        console.log('Something went wrong..');
      });
  }

  render() {
		return (
			<div>
			<Navbar fixedBottom className="navs">
				<Nav>
					<NavItem href="#">
						About
					</NavItem>
				</Nav>
				<Nav pullRight className="friendsNav">
					<NavDropdown title="Friends" id="basic-nav-dropdown">
					  {this.state.friends.map(friend => {
					  	return <MenuItem key={friend.id}><span className="menuitem-friend">{friend.name}</span><Button bsStyle="primary" className="chatBtn" onClick={() => this.handleShow(friend)}>Message</Button></MenuItem>
					  })}
					</NavDropdown>
				</Nav>
			</Navbar>
			<Modal show={this.state.showModal} onHide={this.handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>{this.state.messageWith.name}</Modal.Title>
				</Modal.Header>
				<Modal.Body className="dm-body">
			    <ul id="messages">
			      {this.state.msgs.map(msg => <li key={msg.id}>{JSON.parse(localStorage.getItem('loggedUser')).name} - {msg.text} - {msg.created_at}</li>)}
			    </ul>
				</Modal.Body>
				<Modal.Footer>
				  <ChatForm receiveMsgs={this.receiveMsgs.bind(this)} friend={this.state.messageWith} />
				</Modal.Footer>
			</Modal>
			</div>
		)
  }
}

export default FriendNav;
