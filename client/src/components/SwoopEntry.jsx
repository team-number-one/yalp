import React from 'react';
import axios from 'axios';

class SwoopEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squad: 0,
      userInSquad: false,
      userInfo: JSON.parse(localStorage.loggedUser),
      // better to check with sqaudIds than squad array because if youre the only one in
      // squad it won't work as expected
      squadIds: 0
    }
    this.squadUp = this.squadUp.bind(this);
    this.flake = this.flake.bind(this);
    this.deleteSwoopHandler = this.deleteSwoopHandler.bind(this);
    this.deleteSwoopsSquads = this.deleteSwoopsSquads.bind(this);
  }
  componentDidMount() {
    this.verifySquad();
  }

  squadUp() {
    let reqInfo = {
      userId: this.state.userInfo.id,
      swoopId: this.props.swoop.id
    }
    axios.post('/squads/add', reqInfo)
      .then(
        this.verifySquad()
      )
  }

  flake() {
    let reqInfo = {
      userId: this.state.userInfo.id,
      swoopId: this.props.swoop.id
    }
    axios.post('/squads/delete', reqInfo)
      .then(
        this.verifySquad()
      )
  }

  verifySquad() {
    let reqInfo = {
      swoopId: this.props.swoop.id
    }
    axios.post('/squads/get', reqInfo)
      .then(resp => {
        if (resp.data.length > 0) {
          let squadStr = ''
          let squadIds = [];
          for (let i = 0; i < resp.data.length; i++) {
            squadIds.push(resp.data[i].id)
            if (resp.data[i].id !== this.state.userInfo.id) {
              squadStr += `, ${resp.data[i].name}`;
            }
          }
          if (squadIds.includes(this.state.userInfo.id)) {
            if (this.state.userInfo.id === this.props.swoop.user_id) {
              squadStr = squadStr.slice(2)
            }
            this.setState({userInSquad: true, squad: squadStr, squadIds: squadIds})
          } else {
            if (this.state.userInfo.id === this.props.swoop.user_id) {
              squadStr = squadStr.slice(2)
            }
            this.setState({userInSquad: false, squad: squadStr, squadIds: squadIds});
          }
        }
        //if you were only one in squad and leave, need to account for that with this else
        else {
          this.setState({userInSquad: false, squad: 0, squadIds: 0});
        }
      })
  }

  deleteSwoopsSquads() {
    let reqInfo = {
      swoopId: this.props.swoop.id
    }
    axios.post('/swoops/squads/delete', reqInfo)
  }

  deleteSwoopHandler() {
    this.deleteSwoopsSquads();
    this.props.deleteSwoop(this.state.userInfo.id, this.props.swoop.business_id, this.props.swoop.swoopDate);
  }

  render() {
    return(
      <div>
        <div>
          At {this.props.swoop.business_name} on {this.props.swoop.swoopDate}
        </div>
        {this.state.squadIds ? 
          this.state.userInSquad ?
          <div>Squad: {this.props.swoop.name}{this.state.squad}, You</div>
          : <div>Squad: {this.props.swoop.name}{this.state.squad}</div>
          : <div>Squad: {this.props.swoop.name}</div>
        }
        <div>
          {/* is it user own swoop? */}
          { this.props.swoop.user_id !== this.state.userInfo.id ? 
            this.state.userInSquad ?
            <button className="deleteSquad" onClick={this.flake}>Flake</button>
            : <button className="addSquad" onClick={this.squadUp}>Squad Up!</button>
            : <button className="deleteSwoop" onClick={this.deleteSwoopHandler}>Cancel the swoop</button>
        }
        </div>
      </div>
    )
  }
}

export default SwoopEntry;
