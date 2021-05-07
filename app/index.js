// require packages and setting port
const express = require('express');
const port = 8000;
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// cors setup
var allowedOrigins = ['http://localhost:3000', 'http://localhost:8000'];
app.use(cors({
    origin: function(origin, callback){
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
}));

// models requirements
const db = require("./app/models");

// routes requirements
const index = require('./app/routes/index');
const auth = require('./app/routes/auth.routes');
const users = require('./app/routes/user.routes');
const images = require('./app/routes/image.routes');

// json parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// db init
const Role = db.role;

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });
    Role.create({
        id: 2,
        name: "admin"
    });
}

// force is set to true for dev
db.sequelize.sync({force: true}).then(() => {
    console.log("Drop and resync DB");
    initial()
})

// for prod, just swap above with:
// db.sequelize.sync();

// routing
app.use('/', index);
app.use('/api/auth', auth);
app.use('/api/test', users);
app.use('/api/images', images);

// server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});