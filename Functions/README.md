# Functions

This function is designed to run on demand, it takes a JSON parameter *message* and uses that to update the *quickclick* count in the primary DB. Due to similar products it updates the value for all products sharing the same *name*.

## What it does
There is two files:
- [package.json](package.json)
  - This file contains the dependencies for the Cloud Function to work, that is MySQL client
- [index.js](index.js)
  - This script accepts all input and uses the body of "message" to pass along a mysql update query to the primary DB. 
  
## Setup Guide
1. Create a new Cloud Function and paste in both the *index.js* and *package.json*
2. You will need to update the MySQL parameters to the relative options
3. Update the URL in [GetData.js](../Site/GetData.js) (Line 202)

  
## Notes
* You may encounter CORS errors calling the Cloud Function from the website. Using DNS and CNames will help with this, or failing that the Chrome CORS Extension: (Click Here)[https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en]

## Todo
* Add data validation on input
* If scale is larger put update in a pub/sub que so updates can be more scalabe.