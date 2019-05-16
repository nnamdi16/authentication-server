// @ts-nocheck
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
const Schema = mongoose.Schema;

//Define our model
const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String
});

//OnSave Hook, encrypt password
//Before saving a model, run this function.
userSchema.pre('save', function(next) {
	//get access to the user model => user is the instance of the userModel
	const user = this;
	console.log(user);

	//Generate a salt then run callback
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return next(err);
		}

		//Hash password(encrypt) using the salt
		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) {
				return next(err);
			}

			//Override plain text password with encrypted password
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) {
			return callback(err);
		}
		callback(null, isMatch);
	});
};
//Create the model class
const ModelClass = mongoose.model('user', userSchema);

//Export the model

export default ModelClass;

//When you save the password you generate a salt - encrypted string  or a randomly generated string of character
/**
 * By combining a salt and a plain password we get a hashed password
 */

/**
	* JSON Web Token 
	Take the userId and encrypt it with some secret string which produces a JSON Web token
	When signing in if the user gives us his JSON web token, we decrypt it and that gives him access
  */
