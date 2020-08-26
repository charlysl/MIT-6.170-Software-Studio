import React from 'react';

import freetAPI from '../api/freetAPI.js';

/**
* @param {Function} props.onFreets - callback to be invoked to notify
* search results; has the following signature:
* - @param {Array{Freet}} freets - the freets
*/
class FreetSearch extends React.Component {

  async search ( event ) {
    const author = event.target.author;
    const freets = await freetAPI.search( author );
    this.props.onFreets( freets );
  }

  render () {
    return (
      <div>
        <input type="text" name="author" placeholder="Enter author name" />
        <button onClick={this.search.bind(this)}>Search</button>
        <label>
          Sort by votes
          <input  type="checkbox" 
                  name="sort" 
                  checked={this.props.isSorted}
                  onClick={this.props.onSorted} />
        </label>
      </div>
    )
  }

}

export default FreetSearch;