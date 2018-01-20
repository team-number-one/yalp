import React from 'react';
import axios from 'axios';
import SwoopEntry from './SwoopEntry.jsx';

class SwoopLocal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      swoops: []
    }
  }

  componentDidMount() {

  }

  getSwoops() {

  }

  render() {
    return(
      <div className="swoopLocal">
        {
          this.state.swoops.map(swoop => {
            return (<SwoopEntry swoopDate={swoop.swoopDate}/>)
          })
        }
      </div>
    )
  }
}

export default SwoopLocal;