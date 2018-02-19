// NPM package dependencies
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Create express app instance for express server configuration
var app = express();

// Sets up the initial port
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allow the assets folder to be used for static content
app.use(express.static("public"));

// Point the server to the route files
require("./routing/apiRoutes")(app);
require("./routing/htmlRoutes")(app);

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});