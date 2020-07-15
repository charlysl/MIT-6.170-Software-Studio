/**
 * The Game of Life web app Model module
 *
 *  This document has the following sections:
 *  1. This module's public methods
 *  2. The board object's public methods
 *  3. Model events
 *
 * 1. This module's public methods:
 *
 *  These methods allow state management of a Game of Life, giving access to 
 *  the starting boards, the current board, and perform state transitions. 
 *
 *  - get_current_board()
 *    Get the current board of a game of life.
 *    @return a board object
 *
 *  - get_preset_starting_boards()
 *    Get a list of preset starting boards.
 *    @return a list of board objects
 *
 *  - select_preset_starting_board( idx )
 *    Select a  preset starting board as the current boarrd.
 *    Publishes a gol-boardchanged event, passing the selected board as an argument.
 *    @param idx Integer. Selected board index in preset starting board list.
 *
 *  - set_dimensions( row_count, col_count )
 *    Set new board dimensions. The board will be cleared.
 *    Publishes a gol-boardresized event, passing the resized board as an argument.
 *    @param row_count Integer. The new number of rows in the board. 
 *    Must be positive.
 *    @param col_count Integer. The new number of columns in the board. 
 *    Must be positive
 *
 *  - take_step()
 *    Take a step from the current state to the next state.
 *    Publishes a gol-boardchanged event, passing the next board as an argument.
 *    @return
 *
 *
 * 2. The board object's public methods
 *
 *  Represents a state of the Game of Life.
 *  A Game of Live consists of a 2D board of cells.
 *  Each cell can be in one of two states:
 *  - false: dead
 *  - true : alive
 *
 *  Factory method:
 *
 * - makeBoard( row_count, col_count, preset_cell_list )
 *   @param  row_count Integer. Number of rows in the board, default 24.
 *   @param  col_count Integer. Number of columns in the board, default 24.
 *   @param  preset_cell_list Array of boolean. 
 *          Array to preset the initial state of all cells. 
 *          Must be in row order, and of size row_count * col_count.
 *          Default is that all cells will be dead initially.
 *   @return A new board object.
 *
 *  Public methods:
 *
 *  - get_row_count()
 *    Gets the number of rows in the board.
 *    @return Integer. The number of rows.
 *
 *  - get_col_count()
 *    Gets the number of columns in the board.
 *    @return Integer. The number of columns.
 *
 *  - forEach( fn )
 *    A functional to iterate over each cell in turn.
 *    @param fn A function with the following signature:
 *            @param x      Integer. Cell's column coordinate.
 *            @param y      Integer. Cell's row coordinate.
 *            @param state  Boolean. State of cell at (x,y)
 *
 *  - set_cell_state( x, y, new_state )
 *    Sets the state of the cell at (x,y).
 *    The coordinate origin (0,0) is the top left cell.
 *    @param x     Integer The cell's column. Must be 0 <= x < col_count.
 *    @param y     Integer The cell's row.    Must be 0 <= y < row_count.
 *    @param new_state Boolean The cell's new state.
 *
 *
 * Model events:
 *
 *  Feature modules are totally independent and decoupled from each other.
 *  This decoupling is achieved by basing the apps design on the
 *  Model-View-Controller pattern.
 *  
 *  Feature modules, which implement a concern's view and controller,
 *  must not directly interact with each other.
 *  The only module they must interact with is the Model.
 *  Indirect interaction can be achieved via Model events.
 *  The event mechanism is gol.util.gevent, in the gol.util.js module.
 *  Feature models should suscribe to the appropriate model events
 *  to refresh their view. 
 *
 *  The model publishes the following events:
 *  - gol-boardchanged
 *    The state of the current board has changed.
 *    Event data: the current board
 *  - gol-boardresized
 *    The current board has changed, and may have different dimensions.
 *    Feature models can suscribe to this event to refresh the view. 
 *    Event data: the current board
 *  - gol-boardselected
 *    A preset board was selected; the current board has changed, 
 *    and may have different dimensions.
 *    Event data: the current board
 */
 
gol.model = (function() {
  //IMPORTS
  assert = gol.util.assert;

  const
    configMap = {
      default_row_count: 24,
      default_col_count: 24,
      min_row_count:     24,
      min_col_count:     24,
    },
    stateMap = {
      current_board: null,
      preset_board_list: null,
    }
    ;

  // Abstraction Function
  //  Represents the state Game of Life, where current_board represents the
  //  current state; preset_board_list represents a collection of preset
  //  initial states
  //
  // Representation Invariant
  //  typeof( stateMap.current_board ) === 'Object'
  //
  // Safety From Rep Exposure
  //  The current_board and preset_board_list variables are never exposed. 
  //  They are local variables and no public method exposes them.
  //  The current_board object is returned by get_current_board().
  //  This is safe and documented as said object's public methods
  //  are safe.
  //  get_preset_starting_boards() makes a copy so that preset_board_list
  //  is not exposed.


  //------------------- START PUBLIC OBJECTS ---------------------

  //------------------- START makeBoard() ------------------------
  const makeBoard = function(
    row_count = configMap.default_row_count,
    col_count = configMap.default_col_count,
    preset_cell_list = []) {

    let
      cell_list;
    
    // The state is represeted as an array in order to take advantage of
    //  Array functionals such as Array.forEach and Array.map
    //  If, instead, it had been represented as an array of arrays, it would
    //  not have been possible to exploit such functionality out of the box,
    //  complicating implementation.
    //
    // Abstraction Function
    //  Represents a Game of Life board of row_count rows by col_count 
    //  columns.
    //  cell_list[i] represents the state of cell y * col_count + x
    //
    // Representation Invariant
    //  row_count and col_count must be positive integers:
    //    row_count.isInteger() === true
    //    col_count.isInteger() === true
    //    row_count >= 24
    //    col_count >= 24
    //  cell_list instanceof Array
    //  cell_list.length === row_count * col_count
    //  typeof( cell_list[ i ] ) === 'boolean' 
    //    for all 0 < i < cell_list.length
    //
    // Safety From Rep Exposure
    //  The rep consists of local variables inside a make function and is only 
    //  in scope of closures (the public methods) that never expose it: 
    //  Two of said variables are primitives, and are hence safe from aliasing.
    //  cell_list elements are also primitives, same applies.
    //  The cell_list variable is not aliased. It is instanciated internally
    //  in an empty state, and never exposed. 
    //  When initialized with a preset board, the elements, which are
    //  primitives, are copied.
    //  The same applies to the cell_list object. Its contents can only be 
    //  accessed via forEach, never directly, and only set via set_cell_state.

    //------------------- START  makeBoard PRIVATE METHODS ---------------------

    // makeBoard PRIVATE PRODUCERS

    /**
     * Produce a board that represents the next state of the
     * Game of Life based on this board.
     *
     */
    const take_step = function() {
      const new_cell_list = [];

      forEach( ( x, y, is_alive ) => {
        let next_state = apply_rules_to_cell( x, y, is_alive );
        let idx = get_cell_index( x, y );

        new_cell_list[idx] = next_state;
      });
      
      return makeBoard( row_count, col_count, new_cell_list );
    }


    // makeBoard PRIVATE OBSERVERS

    /**
     * Applies the rules of the Game of Life to the cell at (x,y)
     * @return Boolean. The next state of the cell at (x,y)
     */
    const apply_rules_to_cell = function(x, y, is_alive) {
      const alive_neighbours_count = count_neighbours_alive(x, y);

      let is_survivor = is_alive && (alive_neighbours_count == 2
        || alive_neighbours_count == 3);
      let next_state;
      if (is_survivor || (!is_alive && alive_neighbours_count == 3)) {
        next_state = true;
      } else {
        next_state = false;
      }

      return next_state;
    }

    const assert_x = function(x) {
      assert(Number.isInteger(x), 'x=' + x + ' is not an integer');
      assert(x >= 0, 'x is ' + x);
      assert(x < col_count,
        'x=' + x + ' is >= col_count=' + col_count);
    }

    const assert_y = function(y) {
      assert(Number.isInteger(y), 'y=' + y + ' is not an integer');
      assert(y >= 0, 'y is ' + y);
      assert(y < row_count,
        'y=' + y + ' is >= row_count=' + row_count);
    }

    const check_rep = function() {
      assert( Number.isInteger( row_count ), 
        'row_count=' + row_count + ' is not an integer' );
      assert( Number.isInteger( col_count ), 
        'col_count=' + row_count + ' is not an integer' );
      assert( row_count >= configMap.min_row_count, 'row_count is ' 
        + row_count + ' < ' + configMap.min_row_count);
      assert( col_count >= configMap.min_col_count, 'col_count is ' 
        + col_count + ' < ' + configMap.min_col_count);
      assert( cell_list instanceof Array, 'cell_list is not an array' );
      assert( cell_list.length === row_count * col_count,
        'cell_list.length is ' + cell_list.length
        + ' row_count=' + row_count
        + ' col_count=' + col_count
      );
      cell_list.forEach( ( state ) => {
        assert( typeof ( state ) === 'boolean', 'state is: ' + state );
      });
    };

    const get_cell_index = function(x, y) {
      assert_x( x );
      assert_y( y );

      let idx = y * col_count + x;

      //console.log(
      //  'get_cell_index(' + x + ',' + y + ') = ' + idx);

      return idx;
    }

    /**
     * Modify this method to implement a different edge behaviour.
     *
     * From problem statement:
     *  "Edge Behavior: When live cells reach the edge of the grid, 
     *   there are a number of ways they could behave, including: 
     *      cells off the board could simply all be “dead” cells, or 
     *      “live” cells could wrap around the edge of the board. 
     *   Any behavior is acceptable, so long as your implementation is 
     *   consistent and reasonable."
     */
    const count_neighbours_alive = function( x, y ) {
      let alive_neighbours_count = 0;

      forEachNeighbour( x, y, ( x_neighbour, y_neighbour ) => {
          const is_in_bounds = get_is_in_bounds( x_neighbour, y_neighbour );

          if ( is_in_bounds ) {
            // count out of bounds "neighbour" as dead.
            const is_neighbour_alive = 
              is_cell_alive( x_neighbour, y_neighbour );
            if ( is_neighbour_alive ) {
              alive_neighbours_count++;
            }
          }
       });

      return alive_neighbours_count;
    };
    
    /**
     * Calls fn( x_neighbour, y_neighbour ) for each neighbour 
     * of the cell at (x,y).
     */
    const forEachNeighbour = function ( x, y, fn ) {
      // can't use functionals, need to iterate over fixed number of cells
      for (let y_neighbour = y - 1; y_neighbour <= y + 1; y_neighbour++) {
        for (let x_neighbour = x - 1; x_neighbour <= x + 1; x_neighbour++) {
          const is_current_cell = ( y_neighbour == y && x_neighbour == x );
          if ( is_current_cell ) {
            continue;
          } else {
            fn( x_neighbour, y_neighbour );
          }
        }
      }      
    }

    const get_is_in_bounds = function(x, y) {
      return x >= 0 && y >= 0 && x < col_count && y < row_count;
    };

    const is_cell_alive = function(x, y) {
      return cell_list[get_cell_index(x, y)];
    }

    // makeBoard PRIVATE MUTATORS

    const init = function () {
      cell_list = [];
      
      if ( preset_cell_list.length == 0 ) {
        // can't use map, cell_list is still empty
        for ( let i = 0; i < row_count * col_count; i++ ) {
          cell_list[i] = false;
        }
      } else {
        cell_list = Array.from( preset_cell_list );
      }
  
      check_rep();
    }

    //------------------- END  makeBoard() PRIVATE METHODS ---------------------


    //------------------- START makeBoard() PUBLIC METHODS ---------------------

    // makeBoard PUBLIC OBSERVERS

    const get_row_count = function() {
      return row_count;
    };

    const get_col_count = function() {
      return col_count
    };

    const forEach = function( fn ) {
      let x = 0,
          y = 0
      ;

      cell_list.forEach( ( is_alive ) => {
        if ( x > 0 && x % col_count == 0 ) {
          x = 0;
          y++;
        }

        fn( x, y, is_alive );

        x++;
      });
    };

    // makeBoard PUBLIC MUTATORS

    const set_cell_state = function(x, y, new_state) {
      const idx = get_cell_index(x, y);
      cell_list[idx] = new_state;

      gol.util.gevent.publish('gol-cellstatechanged', x, y, new_state);

      //console.log(
      //  'set_cell_state(' + x + ',' + y + ',' + new_state + '):');
      //console.info(cell_list);
      
      check_rep();
    };

    //------------------- END makeBoard() PUBLIC METHODS ---------------------

    let obj = {
      get_row_count,
      get_col_count,
      forEach,
      set_cell_state,
      take_step
    };
    
    init();

    return obj;

  };
  //------------------- END makeBoard() ------------------------
  //------------------- END PUBLIC OBJETCS ---------------------



  //------------------- START PRIVATE METHODS ---------------------

  const check_rep = function() {
    assert(typeof (stateMap.current_board) === 'object');
  };
  
  const initPresetBoards = function () {
    stateMap.preset_board_list = 
      gol.data.pre_board_list.map( ( pre_board ) => {
        return {
                name:   pre_board.name,
                board:  makeBoard( 
                          pre_board.row_count, 
                          pre_board.col_count,
                          pre_board.cell_list.map( ( state01 ) => {
                            return state01 == 1;
                          }))
                }
      });
  }

  //------------------- END PRIVATE METHODS ---------------------



  //------------------- START PUBLIC METHODS ---------------------

  const init_module = function() {
    stateMap.current_board = makeBoard();

    initPresetBoards();

    check_rep();
  };

  // OBSERVERS

  const get_current_board = function() {
    return stateMap.current_board;
  };

  const get_preset_starting_boards = function() {
    return Array.from( stateMap.preset_board_list );
  };
  
  // MUTATORS
  
  const select_preset_starting_board = function ( idx ) {
    stateMap.current_board = stateMap.preset_board_list[ idx ].board;
    gol.util.gevent.publish('gol-boardselected', stateMap.current_board);
    
    check_rep();
  };

  const set_dimensions = function( row_count, col_count ) {
    stateMap.current_board = makeBoard( row_count, col_count );
    assert( stateMap.current_board.get_row_count() == row_count );
    assert( stateMap.current_board.get_col_count() == col_count );
    gol.util.gevent.publish('gol-boardresized', stateMap.current_board);
    
    check_rep();
  };

  const take_step = function() {
    stateMap.current_board = stateMap.current_board.take_step();
    gol.util.gevent.publish('gol-boardchanged', stateMap.current_board);
    
    check_rep();
  };

  //------------------- END PUBLIC METHODS ---------------------

  return {
    init_module,
    get_current_board,
    get_preset_starting_boards,
    select_preset_starting_board,
    set_dimensions,
    take_step
  };

}());
