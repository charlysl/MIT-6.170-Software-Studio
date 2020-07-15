/**
 * Game of Life web app Dimension feature module
 *
 *  This module is responsible for setting dimensions of a Game of Life board.
 *
 */
 
gol.dim = (function(){
  const
    configMap = {
      dim_class: '.gol-dim',
      rows_class: '.gol-dim-rows',
      cols_class: '.gol-dim-cols',
      button_class : '.gol-dim-button',
      main_html:    
          '<div class="gol-dim">'
          + '<div class="gol-dim-inputs">'
            + '<div class="gol-dim-row-inputs">'
              + '<label for="gol-dim-rows-id">Rows:</label>'
              + '<input id="gol-dim-rows-id" class="gol-dim-rows"'
                + ' type="text" size="2" maxlength="2" />'
            + '</div>'
            + '<div class="gol-dim-col-inputs">'
              + '<label for="gol-dim-cols-id">Columns:</label>'
              + '<input id="gol-dim-cols-id" class="gol-dim-cols'
                + ' type="text" size="2" maxlength="2" />'
            + '</div>'
          + '</div>'
          + '<button class="gol-dim-button">Resize Board</button>'
        + '</div>'
    },
    stateMap = {
      container_el: null,
      model: null
    },
    domElementMap = {
      dim_el: null,
      rows_el: null,
      cols_el: null,
      button_el: null
    }
    ;
    
    //--------------- START DOM METHODS -------------------
    const init_dom_element_map = function() {
      domElementMap.dim_el = 
        stateMap.container_el.querySelector( configMap.dim_class );

      let dim_el = domElementMap.dim_el;
      
      domElementMap.rows_el = dim_el.querySelector( configMap.rows_class );
      domElementMap.cols_el = dim_el.querySelector( configMap.cols_class );
      domElementMap.button_el = 
        dim_el.querySelector( configMap.button_class );
    }
    
    const initView = function () {
      const board = stateMap.model.get_current_board();
      onRowsChanged( board );
      onColsChanged( board );
    }

    //--------------- END DOM METHODS -------------------

    //--------------- START EVENT HANDLERS -------------------
    const onResize = function () {
      const num_rows = Number.parseInt( domElementMap.rows_el.value );
      const num_cols = Number.parseInt( domElementMap.cols_el.value );
      stateMap.model.set_dimensions( num_rows, num_cols );
    }
    
    const onRowsChanged = function ( board ) {
      const row_number = board.get_row_count();
      domElementMap.rows_el.value = '' + row_number;
    }
    
    const onColsChanged = function ( board ) {
      const col_number = board.get_col_count();
      domElementMap.cols_el.value = '' + col_number;
    }    
    //--------------- END EVENT HANDLERS -------------------

    
    //--------------- START PUBLIC METHODS -------------------
    const initModule = function( container_el, model ) {
      stateMap.container_el = container_el;
      stateMap.model = model;
      container_el.innerHTML = configMap.main_html;
      init_dom_element_map();
      
      initView();
      
      domElementMap.button_el.addEventListener( 'click', onResize );
      
      gol.util.gevent.suscribe( domElementMap.rows_el, 
                                'gol-boardselected', 
                                onRowsChanged );
                                
      gol.util.gevent.suscribe( domElementMap.rows_el, 
                                'gol-boardselected', 
                                onColsChanged );
    }
    //--------------- END PUBLIC METHODS -------------------

    //console.log( 'loaded gol.dim' ); 

    return {
      init_module: initModule
    };
    
}());