/** 
* The bootstrapping module.
*
* This module is responsible for bootstrapping the Game of Life web app.
*
* It creates the gol namespace, which is required by all modules.
*
*/

gol = (function(){
          
  const init_module = function( container_el ) {
    gol.model.init_module();
    gol.shell.init_module( container_el );
    
    //console.log('loaded gol');
  };

  return {
    init_module
  };

}());
