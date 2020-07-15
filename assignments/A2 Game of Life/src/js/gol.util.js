/**
 *  The utilities module.
 *
 *  This module contains helper functions that must not access the DOM.
 *  The reason is that this way said functions can be used by the Model
 *
 *  Public functions:
 *  - assert( boolean_expression, msg )
 *    Asserts boolean_expression:
 *      - if true:  does nothing
 *      - if false: throws a string with the following format:
 *          'assertion failed: ' + msg
 *
 *  The gevent sub-namespace provides methods to manage custom global events.
 *  Such events are intended for the model to asynchronously bradcast event
 *  to feature modules and to the shell.
 *  (see Page 154 Design People Events of the SPA book)
 *  //TODO 15/7/2020 sort out unsubscribe when suscriber is removed from DOM
 *  - gevent.suscribe( suscriber, event_name, event_handler )
 *    Have the suscriber suscribe to the event_name custom global event
 *    with the event_handler function.
 *    @param suscriber DOMElement. 
 *    @param event_name String. 
 *                      Event's name, with the app's namespace root as prefix.
 *    @param event_handler Funcion. When the event occurs, it is invoked with
 *                         the event object as the first argument, followed
 *                         by any other arguments published by the event.
 *                         The value of this in the event_handler will be
 *                         that of the suscriber DOM element.
 *  - gevent.publish( event_name, ...args )
 *    The event_handler function suscribed to event_name is invoked by this 
 *    event. This method is meant to be invoked by the model.
 */
 
gol.util = (function(){
    
    const assert = function( boolean_expression, msg ) {
      if( !boolean_expression ) {
        throw 'assertion failed: ' + msg + '\n' + (new Error()).stack;
      }
    };
        
    //--------------------- START gevent METHODS -----------------
    gevent = (function(){
      
      const eventMap = {};
      
      suscribe = function ( suscriber, event_name, event_handler ) {
        if ( !eventMap[ event_name ] ) {
          eventMap[ event_name ] = [];
        }
        
        eventMap[ event_name ].push( {
            suscriber, 
            event_handler
        });
      }
    
      publish = function ( event_name, ...args ) {
        if ( !eventMap[ event_name ] ) {
          return;
        }
        
        eventMap[ event_name ].forEach( ( suscription ) => {
          suscription.event_handler.apply( 
            suscription.suscriber, 
            args );
        });
      }
      
      return {
        suscribe,
        publish
      };
    }());
    //--------------------- END gevent METHODS -----------------
    
    
    return {
      assert,
      gevent
    };
      
  }());
  