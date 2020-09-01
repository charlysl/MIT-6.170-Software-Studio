import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// from https://stackoverflow.com/questions/34093913/how-to-debug-react-router
class DebugRouter extends BrowserRouter {
  constructor(props){
    super(props);
    console.log('initial history is: ', 
                JSON.stringify(this.history, null,2));
    this.history.listen((location, action)=>{
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      );
      console.log(`The last navigation action was ${action}`, 
                  JSON.stringify(this.history, null,2));
    });
  }
}

export default DebugRouter;
