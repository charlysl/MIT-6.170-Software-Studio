import React from 'react';

import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome';
import { faSearch }         from '@fortawesome/free-solid-svg-icons';
import { faTimes }          from '@fortawesome/free-solid-svg-icons';

import './SearchBox.css';

/**
* A generic search box.
*
* Has one text input for the search term, that can be cleared. 
* Triggers search when the search icon is clicked or when Enter is pressed.
*
* @param  {string} props.term         - the search term
* @param  {string} props.placeholder  - the search term placeholder
* 
* Callbacks:
*
* @param  {Function} props.onTermChange - To change the search term. 
*         Signature:
*         - @param {string} term - the new search term value
* @param  {Function} props.onSearch     - To trigger search.
* @param  {Function} props.onTermClear  - To clear the search term.
*/
class SearchBox extends React.Component {

  /**
  * Trigger search if Enter was pressed.
  */
  onKeyPress( event ) {
    if (event.key === 'Enter' ) {
      this.props.onSearch();
    }
  }

  render () {
    return (

      <div className="SearchBox">

        <FontAwesomeIcon  icon      = {faSearch} 
                          onClick   = {this.props.onSearch} 
                          className = "SearchBox-icon" />

        <input  type        = "text" 
                name        = "term" 
                value       = {this.props.term}
                placeholder = {this.props.placeholder} 
                onChange    = {(e)=>this.props.onTermChange(e.target.value)}
                onKeyPress  = {this.onKeyPress.bind(this)}
                className   = "SearchBox-input" />

        <FontAwesomeIcon  icon      = {faTimes} 
                          onClick   = {this.props.onTermClear} 
                          className = "SearchBox-icon" />

      </div>

    )
  }
}


export default SearchBox;
