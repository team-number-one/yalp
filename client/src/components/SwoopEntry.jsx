import React from 'react';
import axios from 'axios';

class SwoopEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squad: 0
    }
  }
  componentDidMount() {
    this.verifySquad();
  }

  squadUp() {

  }

  flake() {

  }

  verifySquad() {
    let reqInfo = {
      swoopId: this.props.swoop.id
    }
    axios.post('/squads/get', reqInfo)
      .then(resp => {
        if (resp.data.length > 0) {
          this.setState({squad: resp.data})
        }
      })
  }

  render() {
    return(
      <div>
        <div>
          At {this.props.swoop.business_id} on {this.props.swoop.swoopDate}
        </div>
        {this.state.squad ? 
          this.state.squad.map(squadMember => {
            return {squadMember}
          }) :
          <div>Squad: {this.props.swoop.name}</div>
        }
      </div>
    )
  }
}

export default SwoopEntry;