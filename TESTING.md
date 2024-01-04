Test path 2: Owner Test

Path Description:
1. User logs in 
2. Searches for a listing 
3. Checks the price for that listing 
4. Checks their booking requests
5. Accepts a booking request
6. Checks booking history
7. Leaves a review for previous booking

Purpose:
This happy path is meant to capture a user (who is both an owner of a listing and owner of a booking) to navigate through the components to find a desired listing, then accepts their pending booking requests, then goes to leave a review from a previous stay.

Rationale:
We wanted to test various other components not interacted with the admin happy path including:
a) manage booking requests component
b) search bar component
c) review component
d) viewing listing details when search params are included

We wanted to check that there is a smooth happy path for a user who is not only an owner for a listing but an owner for a booking. 

Our approach to component testing was to focus on key differing components throughout our application including:
a) individual display components (we tested for correct rendering for their display both on the hosted and all listing pages)
b) making booking requests (testing modals as is used for reviews error pop up etc)
c) testing the search pop up component (different to modal)
d) testing the nav bar 
e) main components (e.g. listing details, hosting screen which mainly consists of the individual listing)
f) main login and register pages (different component to other pages)
g) creating a listing / hosted listing create

we believe these should cover the majority of different components that make up the application.