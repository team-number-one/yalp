import React from 'react';
import axios from 'axios';
import SwoopEntry from './SwoopEntry.jsx';


class SwoopGlobal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: JSON.parse(localStorage.loggedUser),
      swoops: 0
    }
  }

  componentDidMount() {
    this.getSwoops(this.state.userInfo.id)
  }

  getSwoops(userId) {
    let reqInfo = {
      userId: userId
    }
    axios.post('/swoops/get', reqInfo)
      .then(resp => {
        this.setState({swoops: resp.data});
      })
  }

  render() {
    return(
      <div className="swoopGlobal">
      <div>Swoops:</div>
        {this.state.swoops ? 
          this.state.swoops.map(swoop => {
            return <SwoopEntry swoop={swoop}/> 
          }) :
          <div>No swoops</div>
        }
      </div>
    )
  }
}

export default SwoopGlobal;
