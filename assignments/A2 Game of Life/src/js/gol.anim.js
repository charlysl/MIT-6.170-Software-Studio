/**
 * Game of Life web app Animation feature module
 *
 *  This module is responsible for animating a Game of Life,
 *  and for handling input for starting and stopping the animation.
 *
 *  This feature module is separate of the board feature module,
 *  about the mere existence of which it needs to make no assumptions. 
 *  They are completely decoupled and communicate indirectly through
 +  the module via util.gevent.publish/suscribe.
 *  
 */
 
 gol.anim = (function(){
  
  const
    configMap = {
      interval_time_millis: 300,
      anim_class: '.gol-anim',
      start_button_class: '.gol-anim-start-button',
      stop_button_class: '.gol-anim-stop-button',
      main_html:    ''
        + '<div class="gol-anim">'
          + '<button class="gol-anim-start-button">Start</button>'
          + '<button class="gol-anim-stop-button" disabled="true">Stop'
          + '   </button>'
        + '</div>'
    },
    stateMap = {
      container_el: null,
      timer_id: null
    },
    domElementMap = {
      anim_el: null,
      start_button_el: null,
      stop_button_el: null
    }
    ;
    
  //------------------------ START DOM METHODS ------------------
  const initDomElementMap = function(){
    domElementMap.anim_el = 
      stateMap.container_el.querySelector( configMap.anim_class );
    domElementMap.start_button_el = 
      stateMap.container_el.querySelector( configMap.start_button_class );
    domElementMap.stop_button_el = 
      stateMap.container_el.querySelector( configMap.stop_button_class );
  };
  
  
  const toggle_buttons = function () {
    let is_started = domElementMap.start_button_el.disabled;
    domElementMap.start_button_el.disabled = !is_started;
    domElementMap.stop_button_el.disabled = is_started;
  }
  //------------------------ END DOM METHODS ------------------


  //------------------------ START EVENT HANDLERS ---------------
  const on_start = function(){
    toggle_buttons();
    
    stateMap.timer_id = setInterval( () => {
      //gol.util_b.time( () => {
        stateMap.model.take_step();
      //}, [], 'take_step' );
      //console.log('tick');
    },
    configMap.interval_time_millis);
  }
  
  const on_stop = function(){
    toggle_buttons();
    clearInterval( stateMap.timer_id );
  }
  //------------------------ END EVENT HANDLERS ---------------

  
  //------------------------ START PUBLIC METHODS ---------------
  const initModule = function( container_el, model ) {
    stateMap.container_el = container_el;
    stateMap.model = model;
    
    container_el.innerHTML = configMap.main_html;
    initDomElementMap();
        
    domElementMap.start_button_el.addEventListener( 'click', on_start );
    domElementMap.stop_button_el.addEventListener( 'click', on_stop );
  };
  //------------------------ END PUBLIC METHODS --------------------

  //console.log( 'loaded gol.anim' ); 
  
  return {
    init_module: initModule
  };
}());