/**
 * Game of Life web app Preset starting states feature module
 *
 *  This module is responsible for displaying preset starting states,
 *  and for handling input to select the starting state.
 *
 */
 
 // display just once
 // get immutable (frozen?) list of boards from model
 // the boards should be copies, can be changed arbitrarily
 // a board may have a name property (optional)
 // display like in bord
 // click changes current board in model, highlight choice
 
  gol.pre = (function(){
  
  let
    configMap = {
      main_html: '<div class="gol-pre-board-list"></div>',
      cell_size_px: 5,
      board_list_class: 'gol-pre-board-list',
      cell_class: 'gol-pre-cell',
      cell_alive_class: 'gol-pre-cell-alive'
    };
    stateMap = {
      container_el: null,
      model: null
    };
    domElementMap = {
      board_list_el: null
    };

  //------------------------ START DOM METHODS ------------------
  const initDomElementMap = function(){
    domElementMap.board_list_el = 
      stateMap.container_el.querySelector( 
        '.' + configMap.board_list_class );
  };
  
  const addBoardList = function () {
    const board_list = stateMap.model.get_preset_starting_boards();
    board_list.forEach( ( preset_board, idx ) => {
      const board_wrapper_el = document.createElement( 'div' );
      board_wrapper_el.classList.add( 'gol-pre-board-wrapper' );
      domElementMap.board_list_el.appendChild( board_wrapper_el );
      
      board_wrapper_el.appendChild(
        createBoardElement( preset_board.board, idx )
      );
      
      board_wrapper_el.appendChild(
        createBoardNameElement( preset_board.name )
      );
    });
  }
  
  const createBoardElement = function( board, idx ){
    
    const col_count = board.get_col_count();
    
    const board_el = document.createElement( 'div' );
    
    board_el.classList.add( 'gol-pre-board' );
    board_el.style.display = 'grid';
    board_el.style.gridTemplateColumns = 
      'repeat(' + col_count  + ', ' + configMap.cell_size_px + 'px)';
    board_el.style.gridAutoRows = 
      configMap.cell_size_px + 'px';
      
    addCells( board, board_el );
    
    board_el.dataset[ 'idx' ] = idx;
    board_el.addEventListener( 'click', onBoardSelected );
    
    return board_el;
  };
  
  const addCells = function( board, board_el ) {
    let cell_el;
    board.forEach( ( x, y, is_alive ) => {
      //console.log( 'cell(' + x + ',' + y + ') ' + is_alive );
      cell_el = document.createElement( 'div' );
      
      cell_el.classList.add( configMap.cell_class );
      cell_el.dataset[ 'x' ] = x;
      cell_el.dataset[ 'y' ] = y;
      if ( is_alive ) {
        cell_el.classList.add( configMap.cell_alive_class );
      }
                  
      board_el.appendChild( cell_el );
    } );
  };
  
  const createBoardNameElement = function( name ) {
    const board_name_element = document.createElement( 'h4' );
    board_name_element.textContent = name;
    board_name_element.classList.add( 'gol-pre-board-name' );
    return board_name_element;
  };
  
  //------------------------ END DOM METHODS ------------------
  
  //------------------------ START EVENT HANDLERS ---------------
  const onBoardSelected = function () {
    const idx = this.dataset.idx;
    stateMap.model.select_preset_starting_board( idx );
  }
  //------------------------ END EVENT HANDLERS ---------------


  //------------------------ START PUBLIC METHODS ---------------
  const initModule = function( container_el, model ) {
    stateMap.container_el = container_el;
    stateMap.model = model;
    
    container_el.innerHTML = configMap.main_html;
    initDomElementMap();
    
    addBoardList();
    
  };
  //------------------------ END PUBLIC METHODS --------------------

  //console.log('loaded gol.pre');

  return {
    init_module : initModule
  };
  
}());