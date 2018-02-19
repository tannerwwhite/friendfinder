// LOAD DATA
// Link routes to the friend data array
var friendsData = require("../data/friends.js");
// console.log(friendsData);

// Routes
module.exports = function(app) {

    // GET route returns friend data array displayed in JSON format for the user on the /api/friends page route
    app.get("/api/friends", function(req, res) {
        res.json(friendsData);
    });

    // POST route takes in user info from the survey form input that was sent to the friends API from the survey page...
    // and pushes the data as a JSON object to the stored friends data array
    app.post("/api/friends", function(req, res) {
        friendsData.push(req.body);
    });
};