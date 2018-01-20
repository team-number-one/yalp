import React from 'react';
import Suggest from './GoogleSuggest.jsx';
import SwoopGlobal from './SwoopGlobal.jsx';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latLin: undefined
    }
  }

  latLinChange(loc) {
    this.setState({ latLin : loc });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.goToListings(this.refs.searchTerm.value, this.state.latLin);
    }
  }

  render() {
    return (
      <div>
        <div>
          <Suggest locChange={this.latLinChange.bind(this)}/>
          <input className="searchBar" ref="searchTerm" onKeyPress={this.handleKeyPress.bind(this)} type="text" size="30" placeholder="What's nearby?" autoFocus/>
          <button type="Search" onClick={e => this.props.goToListings(this.refs.searchTerm.value, this.state.latLin)}>
            Search!
          </button>
        </div>
        <SwoopGlobal />
      </div>
    )
  }
}

export default Search;