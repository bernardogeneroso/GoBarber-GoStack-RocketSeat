import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SigIn from '../pages/SignIn';
import SigOut from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';

import Dashboard from './../pages/Dashboard';

const Routes: React.FC = () => {
	return (
		<Switch>
			<Route path="/" component={SigIn} exact />
			<Route path="/signup" component={SigOut} />
			<Route path="/forgot-password" component={ForgotPassword} />

			<Route path="/dashboard" component={Dashboard} isPrivate />
		</Switch>
	);
};

export default Routes;
