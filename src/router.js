import * as Authentication from './controllers/authentication';
import passportService from './services/passport';
import passport from 'passport';

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
export default function(app) {
	app.get('/', requireAuth, (req, res) => {
		res.send({ hi: 'there' });
	});
	app.post('/signin', requireSignin, Authentication.signin);
	app.post('/signup', Authentication.signUp);
}
