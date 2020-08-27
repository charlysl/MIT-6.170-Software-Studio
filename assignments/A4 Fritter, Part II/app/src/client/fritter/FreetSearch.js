import React from 'react';

import './FreetSearch.css';

import freetAPI from '../api/freetAPI.js';

import SearchBox from '../common/SearchBox';

/**
* @param {Function} props.onFreets - callback to be invoked to notify
* search results; has the following signature:
* - @param {Array{Freet}} freets - the freets
*/
class FreetSearch extends React.Component {

  constructor (props) {
    super(props);

    this.state = {};
    this.state.term = '';
  }

  onTermChange ( term ) {
    this.setState({ term });
  }

  async onSearch () {
    const freets = await freetAPI.search( this.state.term );
    this.props.onFreets( freets );
  }

  onTermClear() {
    this.setState({ term: '' });
  }

  render () {
    return (
      <div className="FreetSearch">

        <SearchBox  term          = {this.state.term}
                    placeholder   = "Enter author name"
                    onTermChange  = {this.onTermChange.bind(this)}
                    onSearch      = {this.onSearch.bind(this)}
                    onTermClear   = {this.onTermClear.bind(this)} />

        <label>
          <input  type="checkbox" 
                  name="sort" 
                  checked={this.props.isSorted}
                  onClick={this.props.onSorted} />
          Sort by votes
        </label>
      </div>
    )
  }

}

export default FreetSearch;