/**
 *  The DOM utilities modules.
 *
 *  Public functions:
 *
 *  - time( fn, msg )
 *    Times the execution time of the given function, which will
 *.   be printed on the console after execution.
 *    @param fn Function
 *    @param args Array. The arguments.
 *    @param msg A message, like the functions name, to identify the log.
 *
 */
 
gol.util_b = (function(){
    const time = function( fn, args, msg ) {
      const start = Date.now();
      fn.apply( this, args );
      const end = Date.now();
      
      const millis = end - start;
      console.log( msg + ' time: ' + millis + ' ms' );
    };
    
    return {
      time
    }
  }());
 