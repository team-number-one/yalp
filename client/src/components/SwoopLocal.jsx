import React from 'react';
import axios from 'axios';
import SwoopEntry from './SwoopEntry.jsx';


class SwoopLocal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: JSON.parse(localStorage.loggedUser),
      swoops: 0,
      ownSwoops: 0
    }
    // this.deleteSwoop = this.deleteSwoop.bind(this);
  }

  componentDidMount() {
    this.getSwoops(this.state.userInfo.id)
    this.getOwnSwoops(this.state.userInfo.id)
  }

  getSwoops(userId) {
    let reqInfo = {
      userId: userId,
      businessId: this.props.businessId
    }
    axios.post('/swoops/get', reqInfo)
      .then(resp => {
        this.setState({swoops: resp.data});
      })
  }

  getOwnSwoops(userId) {
    let reqInfo = {
      userId: userId,
      businessId: this.props.businessId
    }
    axios.post('/swoops/get/own', reqInfo)
      .then(resp => {
        this.setState({ownSwoops: resp.data});
      })   
  }

  deleteSwoop(userId, businessId, swoopDate) {
    let reqInfo = {
      userId: userId,
      businessId: businessId,
      swoopDate: swoopDate
    }
    axios.post('/swoops/delete', reqInfo)
      .then(resp => {
        axios.post('/swoops/get/own', reqInfo)
        .then(resp => {
          this.setState({ownSwoops: resp.data});
        })  
      })
  }

  render() {
    return(
      <div className="swoopLocal">
      <div>Your own Swoops:</div>
      {this.state.ownSwoops.length ?
        this.state.ownSwoops.map(swoop => {
          return <SwoopEntry deleteSwoop={this.deleteSwoop.bind(this)} swoop={swoop}/>
        }) :
        <div>No swoops</div>
      }
      <div>Friend Swoops:</div>
      {this.state.swoops.length ? 
        this.state.swoops.map(swoop => {
          return <SwoopEntry swoop={swoop}/> 
        }) :
        <div>No swoops</div>
      }
      </div>
    )
  }
}

export default SwoopLocal;
