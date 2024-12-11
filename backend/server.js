// Get the packages we need
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    secrets = require('./config/secrets'),
    bodyParser = require('body-parser');

const cors = require('cors');

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;
app.options('*', cors());

// Connect to a MongoDB --> Uncomment this once you have a connection string!!
mongoose.connect(secrets.mongo_connection, { useNewUrlParser: true });

// Allow CORS for all origins (cross-origin requests from any domain)
app.use(cors({
    origin: '*', // Allow requests from all origins
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require('./routes');
app.use('/api', routes);

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
