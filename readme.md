## How to start the web app
This repo hold both the back-end and the front-end for this project.

To run the front-end, CD into "frontend" directory and run "npm start"
To run the back-end, CD into "backend" directory and run "npm start"

Both of these need to be running for the app to work correctly.

I did a lot more than I thought I was going to because I was bored.

## What I have implemented so far

-I have created a mongo database that stores players, tournaments, and mathches
-The player entries contain the player ID, name, email, password (which gets hashed), the sport that they are signed up for, and their rating.
-The tournament entries contain the tournament ID, title, city, state, country, sport, start date, end date, date the tournament was created, and a list of users signed up for the tournament (however this is not being updated yet).
-The matches entreis contain the first player, the second player, the ID of the tournament that is associated with this match, the winner (this defaults to null but should change to the ID of the player that won), the rating change for the winner, and the start and end date of the match.
-The landing page (which for now just shows upcoming tournaments which it pulls from the backend API)
-The login page and registration pages (both fully functional)
-The dashboard page (which is only available to users that are logged in)
-A page where you can add matches (is is available to all the users that are logged in but eventually maybe we make this exclusive to admins or something)


You can make a path proteced by adding the "ProtectedRoute" component to that route in the app.tsx page for example:

      <Route path="/register" element={<Register />}/>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>

Here the "register" page is free for anyone to use while the "dashboard" is only allowed if you are logged in. 
The restriced pages are hidden on the header until you login. If you try to bypass this by typing in the URL the user will be
redirected to the login page.

If you guys want access to the mongodb collection I can maybe find a way to share that with you or create a new login for you guys im not exactly sure how that works.

If you guys have any more questions let me know. 