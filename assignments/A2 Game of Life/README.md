
##(a) What concerns you identified, and how you separated them

I grouped concerns into separate modules (in src/js and src/css) as follows:

- The Shell module (gol.shell.js)

  the layout of the program

- The Dimensions feature module (gol.dim.js)

  how to set the board's dimensions

- The Board feature module (gol.bord.js)

  how an arbitrary starting configuration is created

  the layout of the board

- The Animation feature module (gol.anim.js)

  how the game is animated 
  
  how the user starts and stops an animation while it is running
  
- The Preset feature module (gol.pre.js)

  how the collection of preset starting states is displayed
  
  how the user selects a preset starting state

- The Model module (gol.model.js)

  the rules of the game
  
  edge behaviour
  
  how the board is represented

- The Data module  (gol.data.js)

  the collection of preset starting states
  

##(b) How you exploited functionals in your code

I decided to represent the board as a list (see makeBoard in gol.model.js).
This allowed me to easily exploit the default Array functionals. If instead I had represented the board as an array of arrays, I would have had to implement its own functionals, more complex. The tradeoff is that I had to maintain board dimensions and cell coordinates separately.

The board's rep is encapsulated by the makeBoard closure, which exports a forEach method, and is the only way for clients (the feature modules) to get a board's state, each cell's state in turn, with its coordinates. The fact that the board is represented as a list is completely hidden.

The private functional forEachNeighbour inside makeBoard abstracts iteration over a cell's neighbours.

Modules iterate over the preset initial states collection using map and forEach.


##(c) Any interesting design ideas you had or tradeoffs that you made

###How I used the Model-View-Controller design pattern

I decided to structure the app as described in the book Single Page Applications (Mikowski), and it paid off. 

The organizing principle is the Model View Controller pattern. 
The whole point of applying separation of concerns and organizing code into modules is that each module can be understood and modified in isolation. The MVC pattern is a systematic design for achiving this goal, and minimizes coupling between modules.

The Shell module is responsible for the app's general layout and for bootstraping the feature modules.

Each feature module contains the view and the controller for a set of related concerns.
The feature modules must not communicate (to minimize dependencies). If user input handled by one feature module should cause, say, another feature module to refresh its view, the right way to reason about it is that what should trigger the view refresh is in fact a change in the model, which was caused by said input. The model would signal such a change by publishing events (instead of using callbacks, more cumbersome). 

The use of events eliminates coupling between feature modules. Their only dependency is on the Model's API (which documents the events). Events also decouple the Model from feature modules, the depency is one-way, from feature modules to the Model.

Unlike the book, I didn't use any libraries. I implemented my own, very simple publish/suscribe mechanism for Model synthetic events (see the gevent closure in gol.util.js). I saw no need for an anchor API.

The tradeoff is that,  although the learning curve was rather steep, now I am well prepared for designing and implementing Single Page Applications in vanilla JavaScript.

> See [the notes](https://docs.google.com/document/d/1CE09C3VuBsZ4lW5KP41j-aJsDtCUVR_rPev98pJtt7w/edit?usp=sharing) I took while reading the book.

###Other design decisions

I also separated the data (in this case it's just the preset states collection) into its own module, given that is should be maintained independently. Although a board is represented in the model as a list of booleans, I decided to represent preset boards (in the Data module) as array literals of  _0_  and  _1_ . The reason is that this is much easier to type than  _true_  and   _false_ . However, when loaded into de module the 1s and 0s are transformed into booleans. This was trivial by using Array map. The tradeoff was worth it as this design decision saved much time, by allowing a more convenient notation.

> So, by designing a [little language](https://ocw.mit.edu/ans7870/6/6.005/s16/classes/26-little-languages/index.html), business logic that would normally belong to the Model could instead be stored as Data, and be understood and modified separately.

###Criticism

The visual design can be improved. 
- There is too much empty space at laptop size. Maybe the board should be much bigger, and the other placed controlls to the side. 
- In mobile the board cells are probably too small to be touched with any precision.
- At large sizes (~8000 cells) animation is way too slow, each step taking more than seconds. This would need to be optimized.
