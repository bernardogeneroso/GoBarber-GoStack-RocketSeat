import React from "react";
import { Switch } from "react-router-dom";

import Route from "./Route";

import SigIn from "../pages/SignIn";
import SigOut from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import Dashboard from "./../pages/Dashboard";
import Profile from "./../pages/Profile";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={SigIn} exact />
      <Route path="/signup" component={SigOut} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />

      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/profile" component={Profile} isPrivate />
    </Switch>
  );
};

export default Routes;
