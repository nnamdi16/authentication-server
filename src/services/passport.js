// @ts-nocheck
import passport from 'passport';
import User from '../models/user';
import { config } from '../../config';
import passportStrategy from 'passport-jwt';
import LocalStrategy from 'passport-local';
const JwtStrategy = passportStrategy.Strategy;
const ExtractJwt = passportStrategy.ExtractJwt;

//Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
	//Verify this email and password, call done with the user if it is the correct username and password otherwise call done false.
	User.findOne({ email: email }, (err, user) => {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false);
		}

		//Compare password is equal to user password
		user.comparePassword(password, (err, isMatch) => {
			if (err) {
				return done(err);
			}
			if (!isMatch) {
				return done(null, false);
			}
			return done(null, user);
		});
	});
});

//In passport a strategy is a method for authenticating a user

//Set up options for JwtStrategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

//Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
	//Check if the user ID in the payload exist.
	//If it does call done with a user or else call done without a user.
	User.findById(payload.sub, (err, user) => {
		if (err) {
			return done(err, false);
		}
		if (user) {
			done(null, user);
		} else {
			done(null, false);
		}
	});
});
//Payload is the decoded jwt token

//Tell passport to use the strategy
passport.use(jwtLogin);
passport.use(localLogin);
