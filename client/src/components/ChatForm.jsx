import React from 'react';
import axios from 'axios';

class ChatForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      chatId: undefined
    };

    this.handleChange = this.handleChange.bind(this);

    // this.chatData = {
    //   name: this.refs.name.value,
    //   email: this.refs.email.value,
    //   username: this.refs.username.value,
    //   password: this.refs.password.value
    // }
  }

  componentDidMount() {
    this.getChat();
  }

  sendMessage(event) {
    event.preventDefault();
    let chatData = {
      text: this.state.value,
      chatId: this.state.chatId,
      sender: JSON.parse(localStorage.getItem('loggedUser')).id
    }

    axios.post('/server/dm/message', chatData)
      .then(resp => {
        this.getChat();
        this.setState({ value: '' });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getChat() {
    let user1 = JSON.parse(localStorage.getItem('loggedUser')).id;
    let user2 = this.props.friend.id;

    axios.get(`/server/dm/log?user1=${user1}&user2=${user2}`)
      .then(resp => {
        this.props.receiveMsgs(resp.data[0]);
        this.setState({ chatId: resp.data[1] });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <form action="#" onSubmit={this.sendMessage.bind(this)} >
        <input type="text" value={this.state.value} onChange={this.handleChange} id="m" autoComplete="off" className="dm-input" placeholder="Hungry? Form a Squad and grab a bite!" required/>
        <button >Send</button>
      </form>
    );
  }
}

export default ChatForm;