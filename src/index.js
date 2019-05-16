import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
const app = express();
import router from './router';

//DB Setup
mongoose.connect('mongodb://localhost/auth');

//Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log(`Server is listening on PORT ${port}`);

//App SetUp
app.use(morgan('combined')); //Morgan is a logging framework
app.use(bodyParser.json({ type: '*/*' })); //parses a request into json
//Incoming request are passed into bodyParser and morgan middleware.
//Nodemon watches the file for file changes.
router(app);

/**
 * HTTP Module - Handle HTTP request
 * BodyParser - Help parse incoming HTTP requests
 * Morgan - Logging
 * Express - Parse responses + routing
 * MongoDb -Storing data
 * Mongoose - Working with MongoDb
 * Bcrypt -Node js Storing a user password safely
 * Passport - JWT  = Authenticating users with a JWT
 * Passport- Local = Authenticating user with a username/password
 * Passport JS = Authenticating users.
 * 
 */
