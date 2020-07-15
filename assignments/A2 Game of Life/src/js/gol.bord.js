/**
 * Game of Life web app Board feature module
 *
 *  This module is responsible for displaying the Game of Life board,
 *  and for handling input for creating an arbitrary starting state.
 *
 *  Subscribes to the following model events:
 *  - gol-boardchanged
 *  - gol-boardresized
 *
 */
 
 gol.bord = (function(){
  
  let
    configMap = {
      main_html: '<div class="gol-bord-board"></div>',
      cell_class: 'gol-bord-cell',
      cell_alive_class: 'gol-bord-cell-alive',
      cell_width_px: 8
    };
    stateMap = {
      container_el: null,
      model: null
    };
    domElementMap = {
      board_el: null
    };

  //------------------------ START DOM METHODS ------------------
  const initDomElementMap = function(){
    domElementMap.board_el = 
      stateMap.container_el.querySelector( '.gol-bord-board' );
  };
  
  const createView = function(){
    removeCells();
    
    const col_count = stateMap.model.get_current_board().get_col_count();
    
    const board_el = domElementMap.board_el;
    
    board_el.style.gridTemplateColumns = 
      'repeat(' + col_count  + ', ' + configMap.cell_width_px + 'px)';
    board_el.style.gridAutoRows = configMap.cell_width_px + 'px';
      
    addCells();
    
  };

    
  const removeCells = function(){
    const cell_list = domElementMap.board_el.querySelectorAll( 
      '.' + configMap.cell_class );
    
    if ( !cell_list ) {
      return;
    }

    cell_list.forEach( ( cell_el ) => {
      //When an element is removed from the document, any function that 
      //is subscribed “on” that deleted element must be removed.
      cell_el.removeEventListener( 'click', onCellClicked );

      domElementMap.board_el.removeChild( cell_el );
    });
  };
  
  const addCells = function() {
    let cell_el;
    stateMap.model.get_current_board().forEach( ( x, y, is_alive ) => {
      //console.log( 'cell(' + x + ',' + y + ') ' + is_alive );
      cell_el = document.createElement( 'div' );
      
      cell_el.classList.add( configMap.cell_class );
      cell_el.dataset[ 'x' ] = x;
      cell_el.dataset[ 'y' ] = y;
      if ( is_alive ) {
        cell_el.classList.add( configMap.cell_alive_class );
      }
      
      cell_el.addEventListener( 'click', onCellClicked );
      
      gol.util.gevent.suscribe( 
        cell_el, 'gol-cellstatechanged', onCellStateChanged );
      
      domElementMap.board_el.appendChild( cell_el );
    } );
  };
  
  //------------------------ END DOM METHODS --------------------

  //------------------------ START EVENT HANDLERS ---------------
  const onCellClicked = function(){
    console.info(this);
    
    let x = Number.parseInt( this.dataset[ 'x' ] );
    let y = Number.parseInt( this.dataset[ 'y' ] );
    let is_alive = this.classList.contains( configMap.cell_alive_class );

    // toggle cell's state  '
    gol.model.get_current_board().set_cell_state( x, y, !is_alive );
  };
  
  const onCellStateChanged = function( x, y, is_alive ){ 
    const selector = '.' 
                      + configMap.cell_class 
                      + '[' + 'data-x="' + x + '"]'
                      + '[' + 'data-y="' + y + '"]';
    const cell_el = document.querySelector( selector );
      
    if ( is_alive ) {
      cell_el.classList.add( configMap.cell_alive_class );
    } else {
      cell_el.classList.remove( configMap.cell_alive_class );
    }    
  };
  
  const onBoardChanged = function ( board ) {
    //gol.util_b.time ( () => {
    board.forEach( ( x, y, is_alive ) => {
      onCellStateChanged( x, y, is_alive );
    });
    //}), [], 'onBoardChanged');
  };
  
  const onBoardResized = function ( board ) {
    //console.log('onBoardResized');
    createView();
  };
  
  //------------------------ END EVENT HANDLERS -----------------
  
  //------------------------ START PUBLIC METHODS ---------------
  const initModule = function( container_el, model ) {
    stateMap.container_el = container_el;
    stateMap.model = model;
    
    container_el.innerHTML = configMap.main_html;
    initDomElementMap();
    
    createView();
    
    gol.util.gevent.suscribe( domElementMap.board_el, 
                              'gol-boardchanged', 
                              onBoardChanged );
    gol.util.gevent.suscribe(  domElementMap.board_el, 
                              'gol-boardresized', 
                              onBoardResized );
    gol.util.gevent.suscribe( domElementMap.board_el, 
                              'gol-boardselected', 
                              onBoardResized );
  };
  //------------------------ END PUBLIC METHODS --------------------

  //console.log('loaded gol.bord');

  return {
    init_module : initModule
  };
  
}());