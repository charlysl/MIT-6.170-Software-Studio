

/**
* Transforms an object into a string of assignments for UPDATE
*
* Example:
*
*   {prop1: val1, prop2: val2} 
*
* is transformed into 
*
*   { "prop1=$1, prop2=$2", [val1, val2] }
*
* @param {Object} - and object
* @return {string, Array} the string of assignments and array of values
*/
module.exports.objectToUpdateAssignments = function ( obj ) {

  let i           = 1,
      assignments = [],
      values      = []
  ;

  Object.keys( obj )
  .filter(( prop )=>{
    return obj.hasOwnProperty( prop )
  })
  .forEach(( prop )=>{
    assignments.push( prop + "=$" + (i++) );
    values.push( obj[ prop ] );
  })
  ;

  const result = {
            assignments:  assignments.join(", "), 
            values
  }

  console.log('objectToUpdateAssignments', obj, result);

  return result;
}
