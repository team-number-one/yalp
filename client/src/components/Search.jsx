import React from 'react';
import Suggest from './GoogleSuggest.jsx';

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

  render() {
    return (
      <div>
        <Suggest locChange={this.latLinChange.bind(this)}/>
        <input className="searchBar" ref="searchTerm" type="text" size="30" placeholder="What's nearby?" />
        <button type="Search" onClick={e => this.props.goToListings(this.refs.searchTerm.value, this.latLin)}>
          Search!
        </button>
      </div>
    )
  }
}

export default Search;