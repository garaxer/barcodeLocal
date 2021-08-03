import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import LoginForm from './login/LoginForm';
import Generate from './barcode/Generate';

import Theme from './Theme';
import Header from './Header';
import UserCreate from './users/UserCreate';
import UserEdit from './users/UserEdit';
import UserList from './users/UserList';
import UserChangePassword from './users/UserChangePassword';
import BarcodePanel from './barcode/BarcodePanel';
import UserProfile from './profile/UserProfile';
import Companies from './companies/CompanyList';
import SnackBar from './shared/SnackBar';

const theme = createMuiTheme(Theme);

/**
 * App Contains the routing.
 *
 *
 * Header contains the authentication.
 */
export const App = ({ snackMessage, user, token }) => {
  // While there is no user, display loading page
  const WaitForUser = ({ path, component, children }) => (
    <Route path={path} exact component={user && component}>
      {!user ? <h1>Authenticating...</h1> : children}
    </Route>
  );

  // useEffect(() => {
  //   const getCsrfToken = async () => {
  //     const { data } = await axios.get('/csrf-token');
  //     axios.defaults.headers.post['X-CSRF-Token'] = data.csrfToken;
  //   };
  //   getCsrfToken();
  // }, []);

  const routes = (
    <Switch>
      <Route path="/login" exact>
        <LoginForm />
      </Route>

      <WaitForUser path="/" exact>
        <Generate id={user?.id} token={token} />
      </WaitForUser>
      <WaitForUser path="/barcodes" component={BarcodePanel} />
      <WaitForUser path="/profile" component={UserProfile} />

      <WaitForUser path="/companies" exact>
        <Companies token={token} />
      </WaitForUser>

      <WaitForUser path="/users" exact component={UserList} />
      <WaitForUser path="/users/new" exact component={UserCreate} />

      <WaitForUser path="/users/edit/:id" exact component={UserEdit} />
      <WaitForUser
        path="/users/changepassword/:id"
        exact
        component={UserChangePassword}
      />
      <WaitForUser path="/users/profile/:id" exact component={UserProfile} />

      <Route>
        <h1>Page Not found</h1>
      </Route>
    </Switch>
  );

  return (
    <ThemeProvider theme={theme}>
      {snackMessage !== '' && <SnackBar message={snackMessage} />}

      <Header />
      <main>{routes}</main>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    token: state.auth.token, // Won't be needed once generate.jsx is connected to redux
    snackMessage: state.usersLoading.message,
  };
};

export default connect(mapStateToProps, {})(App);
