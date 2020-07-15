/**
 * Game of Life web app shell module.
 *
 *  This module is responsible for creating and coordinating 
 *  the different MVC modules.
 *
 */
 
  gol.shell = (function(){
    
    const
      configMap = {
        main_html:  
                      '<div class="gol-shell">'
                      + '<header>'
                      +   '<h1 class="gol-shell-title">Conway\'s Game of Life</h1>'
                      + '</header>'
                      + '<nav class="gol-shell-nav"></nav>'
                      + '<main class="gol-shell-main"></main>'
                      + '<footer class="gol-shell-footer"></footer>'
                      + '<aside class="gol-shell-aside"></aside>'
                    + '</div>'
      };
      stateMap = {
        container_el: null
      };
      domElementMap = {
        bord_container_el: null,
        anim_container_el: null
      };
    
    //----------------------- START DOM METHODS --------------
    const initDomElementMap = function(){
      domElementMap.bord_container_el = 
        document.querySelector( '.gol-shell-main' );
      domElementMap.anim_container_el = 
        document.querySelector( '.gol-shell-footer' );
      domElementMap.dim_container_el = 
        document.querySelector( '.gol-shell-nav' );
      domElementMap.pre_container_el = 
        document.querySelector( '.gol-shell-aside' );
    };
    //----------------------- END DOM METHODS ----------------
    
    //----------------------- START PUBLIC METHODS ----------------
    const initModule = function( container_el ){
      stateMap.container_el = container_el;
      container_el.innerHTML = configMap.main_html;
      initDomElementMap();
      
      gol.bord.init_module( domElementMap.bord_container_el, gol.model );
      gol.anim.init_module( domElementMap.anim_container_el, gol.model );
      gol.dim.init_module(  domElementMap.dim_container_el,  gol.model );
      gol.pre.init_module(  domElementMap.pre_container_el,  gol.model );
    };
    //----------------------- END PUBLIC METHODS ------------------
    
    //console.log('loaded gol.shell');
    
    return {
      init_module: initModule
    };
  }());
  