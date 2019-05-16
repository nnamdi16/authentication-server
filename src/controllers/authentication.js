import User from '../models/user';
import { config } from '../../config';
import jwt from 'jwt-simple';

//sub - subject iat: issued at time
const tokenForUser = user => {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};
export const signUp = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	if (!email || !password) {
		return res.status(422).send({ error: 'You must provide email and password' });
	}
	//Check if a user already exist
	User.findOne(
		{
			email: email
		},
		(err, existingUser) => {
			if (err) {
				return next(err);
			}

			//If a user does exist return an error
			if (existingUser) {
				return res.status(422).send({
					error: 'Email is in use'
				});
			}

			//If a user does not exist create and save a new record
			const user = new User({
				email: email,
				password: password
			});
			user.save(() => {
				if (err) {
					return next(err);
				}
				// res.json(user);
				res.json({ token: tokenForUser(user) });
			});
		}
	);
};

export const signin = (req, res, next) => {
	res.send({ token: tokenForUser(req.user) });
};
