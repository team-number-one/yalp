import React from 'react';
import axios from 'axios';
import SwoopEntry from './SwoopEntry.jsx';

class SwoopLocal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: JSON.parse(localStorage.loggedUser),
      swoops: 0,
      ownSwoops: 0,
      swoopDay: '01',
      swoopMonth: '01',
      swoopYear: '2018',
      swoopHour: '01',
      swoopMinute: '00',
      swoopAMPM: 'AM'
    }
    this.handleClick = this.handleClick.bind(this);
    this.addSwoop = this.addSwoop.bind(this);
    this.handleChangeMonth = this.handleChangeMonth.bind(this);
    this.handleChangeDay = this.handleChangeDay.bind(this);
    this.handleChangeYear = this.handleChangeYear.bind(this);
    this.handleChangeHour = this.handleChangeHour.bind(this);
    this.handleChangeMinute = this.handleChangeMinute.bind(this);
    this.handleChangeAMPM = this.handleChangeAMPM.bind(this);
  }

  componentDidMount() {
    this.getSwoops(this.state.userInfo.id, this.props.business.id)
    this.getOwnSwoops(this.state.userInfo.id, this.props.business.id)
  }

  getSwoops(userId, businessId) {
    let reqInfo = {
      userId: userId,
      businessId: businessId
    }
    axios.post('/swoops/get', reqInfo)
      .then(resp => {
        this.setState({swoops: resp.data});
      })
  }

  getOwnSwoops(userId, businessId) {
    let reqInfo = {
      userId: userId,
      businessId: businessId
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

  addSwoop() {
    var swoopDate = `${this.state.swoopMonth}/${this.state.swoopDay}/${this.state.swoopYear} ${this.state.swoopHour}:${this.state.swoopMinute} ${this.state.swoopAMPM}`;
    if (this.state.swoopDay !== 0 && this.state.swoopMonth !== 0 && this.state.swoopYear !== 0 && this.state.swoopHour !== 0 && this.state.swoopMinute !== 0) {
      let reqInfo = {
        userId: this.state.userInfo.id,
        businessId: this.props.business.id,
        businessName: this.props.business.name,
        swoopDate: swoopDate
      }  
      axios.post('/swoops/add', reqInfo)
      .then(resp => {
        axios.post('/swoops/get/own', reqInfo)
        .then(resp => {
          this.setState({ownSwoops: resp.data});
        })  
      })
    } else {
      window.alert('Invalid date or time');
    }
  }

  handleClick() {
    this.getSwoops(this.state.userInfo.id, this.props.business.id)
    this.getOwnSwoops(this.state.userInfo.id, this.props.business.id)
  }

  handleChangeMonth(event) {
    this.setState({swoopMonth: event.target.value});
  }

  handleChangeDay(event) {
    this.setState({swoopDay: event.target.value});
  }

  handleChangeYear(event) {
    this.setState({swoopYear: event.target.value});
  }

  handleChangeHour(event) {
    this.setState({swoopHour: event.target.value});
  }

  handleChangeMinute(event) {
    this.setState({swoopMinute: event.target.value});
  }

  handleChangeAMPM(event) {
    this.setState({swoopAMPM: event.target.value});
  }

  render() {
    return(
      <div className="swoopLocal">
        <button onClick={this.handleClick}>Local Swoops</button>
        <div className="dateTime">
        Month: 
          <select value={this.state.swoopMonth} onChange={this.handleChangeMonth}>
            <option value={"01"}>01</option>
            <option value={"02"}>02</option>
            <option value={"03"}>03</option>
            <option value={"04"}>04</option>
            <option value={"05"}>05</option>
            <option value={"06"}>06</option>
            <option value={"07"}>07</option>
            <option value={"08"}>08</option>
            <option value={"09"}>09</option>
            <option value={"10"}>10</option>
            <option value={"11"}>11</option>
            <option value={"12"}>12</option>
          </select>

          <br />
        Day: 
          <select value={this.state.swoopDay} onChange={this.handleChangeDay}>
            <option value={"01"}>01</option>
            <option value={"02"}>02</option>
            <option value={"03"}>03</option>
            <option value={"04"}>04</option>
            <option value={"05"}>05</option>
            <option value={"06"}>06</option>
            <option value={"07"}>07</option>
            <option value={"08"}>08</option>
            <option value={"09"}>09</option>
            <option value={"10"}>10</option>
            <option value={"11"}>11</option>
            <option value={"12"}>12</option>
            <option value={"13"}>13</option>
            <option value={"14"}>14</option>
            <option value={"15"}>15</option>
            <option value={"16"}>16</option>
            <option value={"17"}>17</option>
            <option value={"18"}>18</option>
            <option value={"19"}>19</option>
            <option value={"20"}>20</option>
            <option value={"21"}>21</option>
            <option value={"22"}>22</option>
            <option value={"23"}>23</option>
            <option value={"24"}>24</option>
            <option value={"25"}>25</option>
            <option value={"26"}>26</option>
            <option value={"27"}>27</option>
            <option value={"28"}>28</option>
            <option value={"29"}>29</option>
            <option value={"30"}>30</option>
            <option value={"31"}>31</option>
          </select>

  
          <br />
        Year: 
          <select value={this.state.swoopYear} onChange={this.handleChangeYear}>
            <option value={"2018"}>2018</option>
          </select>

          <br />
        Hour: 
          <select value={this.state.swoopHour} onChange={this.handleChangeHour}>
            <option value={"01"}>01</option>
            <option value={"02"}>02</option>
            <option value={"03"}>03</option>
            <option value={"04"}>04</option>
            <option value={"05"}>05</option>
            <option value={"06"}>06</option>
            <option value={"07"}>07</option>
            <option value={"08"}>08</option>
            <option value={"09"}>09</option>
            <option value={"10"}>10</option>
            <option value={"11"}>11</option>
            <option value={"12"}>12</option>
          </select>

  
          <br />
        Minute: 
          <select value={this.state.swoopMinute} onChange={this.handleChangeMinute}>
            <option value={"00"}>00</option>
            <option value={"15"}>15</option>
            <option value={"30"}>30</option>
            <option value={"45"}>45</option>
          </select>
    
          <br />
        AM/PM: 
          <select value={this.state.swoopAMPM} onChange={this.handleChangeAMPM}>
            <option value={"AM"}>AM</option>
            <option value={"PM"}>PM</option>
          </select>
  
          <br />
        </div>
        <div className="planSwoop">
        <button onClick={this.addSwoop}>Tryna Swoop</button>
        </div>
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


