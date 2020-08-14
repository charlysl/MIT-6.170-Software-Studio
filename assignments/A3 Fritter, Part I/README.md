# Key design decisions

## REST api

All requests start with '/api', which organizes all REST operations under the same namespace.

**Response status codes**

I tried very hard to be consistent with these, so this applies to all:

**200**

For all successful requests that return data, json in all such cases. 

i.e. a freet search.

**201**

For all successful requests that create a resource; a link to the new resource is returned in the location header. 

i.e. create user account, create freet.

**204** 

For all succesful requests that return nothing.

i.e. a freet search with no results, or editing, or deleting, a freet or a user account.

**400**

For all malformed requests.

i.e. Attempting to create a user account without a username or a password, creating or editing a freet of more than 140 characters.

**401**

For all requests that failed because authentication is required but the client did not sign in.

i.e. freet and user account editing and deletion.

**403**

For all requests that failed because they were not allowed. 

i.e. attempting to create or edit a user account with a duplicate username, a freet author attempting to upvote one of his freets.

It should be noted that, by design, it is imposible for a user to edit another user's account or freets just by tampering with the request, would have to sign in as the other user.

Double voting detection, if implemented, would use this code too.

**404**

For all requests for a non-existent resource.

i.e. Attempting to edit, delete or vote a non-existent user account or freet.

**500**

This means that I messed up.

i.e. this is never in the specification.


### Freet management

All freet requests start with '/api/freet':

**Create**:   POST/api/freet

The fields are sent in the body; the user is known from the session.

**Edit**:   PUT/api/freet/:freet_id

Same as above applies.

**Delete**:   DELETE/api/freet/:freet_id

**See the global list of freets**:  GET/api/freet

**Search for freets by author**:  GET/api/freet?author=username

**Upvote**:   POST/api/freet/:freet_id/vote

**Downvote**:   POST/api/freet/:freet_id/vote

I chose POST instead of PUT because voting is an unsafe but not idempotent operation. This is so because there is no requirement to prevent double voting, in which case voting would be idempotent, you can only upvote or downvote once in a row. However, if double voting by the same user was prevented, then, maybe, PUT would have been more appropriate.

So, if PUT, what would the right URL be? In this case, the resource would be just the freet, without the 'vote' bit; it would, essentially, be like editing the freet; in fact, votes are a freet property: 

PUT/api/freet/:freet_id {vote=up|down}

The URL resouce depth of 2 is fine, this is the recommended limit.


### User account management

This adheres quite strictly to REST design principles.

Maybe '/api/account' could have been an alternative to '/api/user'.

All user account requests start with '/api/user':

**Create account**:   POST/api/user     

The username and password are sent in the request body

**Change username and password**:   PUT/api/user      

The username and/or password are sent in the request body; the user id is already known from the session. 

In fact, one of the main decission was for each user to have a unique identifier, as a surrogate key, to allow for the user to change his name.

**Delete account**:   DELETE/api/       

No parameters; the user is known from the session.



### User session management

I decided that the requests should be as follows:

**Sign in**:    POST/api/session/login

**Sing out**:   DELETE/api/session/logout

The reason is that it seems to me that the resource is the user session, which is created by a login, and deleted by a logout.

However, I admit that this decision might be disputable. I am aware that usually these requests are '/login' and 'logout'; given that one of the main goals of REST is to be easy to understand for other developers, I might have broken a convention.

The 'login' and 'logout' suffixes are unnecessary if one follows REST principles strictly, but they serve to clarify the purpose; maybe this a bit of a smell, though, as pointed out above.

POST, in this case, is actually idempotent, but it is good practice for login credentials to be submitted with this method.

Also, I am not entirely sure whether a user session qualifies as a resource to begin with, given its ephemeral nature, and the fact that it does not represent abstract data, but is rather an implementation detail.


## Observations:

**Must be more selective about what to test**

Although the most principled approach would be to test every single operation specification after doing careful input space partitioning, as I did, this just takes an enormous ammount of time which might not be acceptable in a real project, it takes multiples of the implementation time.

I still belive that careful specification of every exported function or method is crucial, and this doesn't take much time, what is not practical is to test every one of them.

I believe that, at the very least, one must fully test all external facing operations, like the REST api.

However, one should be more careful with the implementation. In future projects I will try to just rely on checkRep, and other assertions, to catch most bugs, by automatically preserving representation invariants, which I am already doing anyway, and maybe only write tests for tricky implementation parts.

**This had some positive side-effects**

it forced me to confront handling concurrent promises, for some test setups, specially for testing freet search, and learn about Promise.all.

It also made me meditate of dataflow variables for order finding concurrency, and maybe in the future I will have a close look at Akka, or at something equivalent in javascript.

**Didn't use mockups**

But I may in a future assignment, Jest seems to support them. Setting up some of the tests was a bit of a pain sometimes, but also very instructive.

**I didn't assert javascript parameter types**

did carefully specify them for all exported operations. In future projects I may consider using some tool for this (would JSDoc, or something similar, automatically do this?), or maybe just bite the bullet and learn Typescript to take care of type checking (only structural type checking, I believe, doesn't sound that great, but better than nothing, maybe enough), given that what I did in this project is not robust, and wouldn't have been acceptable in a large project.

**I didn't do much input validation**

which, of couse, if critical for security, but I saw that a future assigmnent is about security, so I was hooping to learn how to properly do it then.

**I loved Jest**

I started out with Mocha, which is what Express in Action uses, but found it hard to work with, and realized it is outdated. There is a reason why Jest is what the assignment mentions. I really like that it tells where in the source code is every console.log.

**I was so overwhelmed with learning, and getting to work, so much new tech**

(node, express, middleware, restful api design, jest, supertest, promises, etc ...) and readings, that I didn't pay much attention to data and code structure, which isn't that great. 

I was quite careful though to find out how to properly organize the different code files in the file system.

However, given that lectures and assignments that cover proper data modelling and design are coming, I would have reviewed this anyway, so I don't mind that I didn't spend that much time on this.

**I designed, specified, and tested the restful api carefully**

It will be very interesting to see how it holds up against future assignments. 

The next assignment will be a Vue client, which I expect to exercise this api, and will allow me to assess the correctness and completeness of my specificaton and my tests; and next I will have to modify the implementation by using a database. 

If I did specify and test the rest api correctly, no changes will be needed to test a rest api that uses a database. 

And if I did specify the business layer correctecly (services directory), I wouldn't need to change the api implementation at all (in the routers directory); 

btw, I just partially tested the business layer, to save time, but will probaby complete these tests when using a database.

**I used Sublime, not an IDE**

Neither did a use a linter. I think I could have saved time if I had, I made typos that would have could instantly but that in some cases were not trivial to debug. 

Or maybe just start using VSCode, which seems to have become the standard.

**Tests always took a few seconds to run**

Even when no promises were timed out by Jest. 

I suspect that this is due to node cold starts, for future assingnments I should configure a hot server that listens to changes in the file system, I hope that this will speed up test runs to the order of milliseconds. 

I will also reduce the default Jest async timeout of 5 seconds to something like 1, if practical.

