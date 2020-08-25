import React from 'react';

import freetAPI from '../api/freetAPI.js';

const onClick = async function ( event, onFreets ) {
  const author = event.target.author;
  const freets = await freetAPI.search( author );
  onFreets( freets );
}

/**
* @param {Function} props.onFreets - callback to be invoked to notify
* search results; has the following signature:
* - @param {Array{Freet}} freets - the freets
*/
const FreetSearch = function ( props ) {

  return (
    <div>
      <input type="text" name="author" placeholder="Enter author name" />
      <button onClick={(e)=>onClick(e, props.onFreets)}>Search</button>
      <label>
        Sort by votes
        <input type="checkbox" name="sort" />
      </label>
    </div>
  )
}

export default FreetSearch;