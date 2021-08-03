import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {
  Typography,
  Toolbar,
  AppBar,
  Container,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { logout, fetchMe } from '../actions/users';
import { signedOut } from '../actions';

import { connect } from 'react-redux';

import Drawer from './shared/Drawer';
import { headerStyle } from './useStyle';
import MakeBarcodes from './barcode/MakeBarcodes';
import { push } from 'connected-react-router';
// linear-gradient(112deg, #327085 0%, #327085 50%, #134758 50%, #134758 100%)

const useStyles = makeStyles(headerStyle);

export const Header = ({
  logout,
  fetchMe,
  token,
  loginError,
  user,
  signedOut,
  pathname,
  push,
}) => {
  const classes = useStyles();

  const { id, permission } = user ?? {};

  const [anchorEl, setAnchorEl] = useState(null); // show the top right menu button
  const [title, setTitle] = useState('Barcode Generation'); // show the top right menu button

  useEffect(() => {
    // if there is an error when trying to login, (with the token) then remove the token as it isn't valid.
    if (loginError) {
      localStorage.removeItem('csrfToken');
      push('/login');
    }
  }, [loginError, push]);

  useEffect(() => {
    // If the user has just signed in we don't have to fetch the user again
    const token = localStorage.getItem('csrfToken');
    if (token && !user) {
      fetchMe(); // fetch a user with the same token.
    } else if (!user) {
      signedOut();
      push('/login');
    }
  }, [fetchMe, user, signedOut, push]);

  const handleLogoutClick = (e) => {
    logout(token);
    localStorage.removeItem('csrfToken');
    push('/login');
  };

  // Change the header text based on pathname
  useEffect(() => {
    const path = pathname.split('/').join('').replace(/[0-9]/g, '');
    const paths = {
      users: 'User Administration',
      usersprofile: `${user?.name || 'Users'}  - Profile`,
      barcodes: 'Barcode Administration',
      companies: 'Company Administration',
      userschangepassword: 'Change Password',
      usersedit: 'Edit Account Details',
    };

    setTitle(paths[path] || `Barcode Generator`);
  }, [pathname, user]);

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          {permission === 'admin' && (
            <Drawer
              items={[
                { text: 'Barcodes', link: '/barcodes' },
                { text: 'Users', link: '/users' },
              ]}
            />
          )}
          <Typography variant="h6" className={classes.title}>
            <Link to={user ? '/' : '/login'} className={classes.link}>
              DNRME Survey Integration - {title}
            </Link>
          </Typography>

          {user && (
            <>
              <div>
                <Typography className={classes.menuButton} variant="subtitle2">
                  User: {user.name}{' '}
                </Typography>
              </div>
              <Button
                className={classes.colourInherit}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                endIcon={<ArrowDropDownIcon />}
              >
                <Typography>Account</Typography>
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <Link
                  onClick={() => setAnchorEl(null)}
                  to={`/users/profile/${id}`}
                  className={classes.link}
                >
                  <MenuItem>Profile</MenuItem>
                </Link>

                <Link
                  onClick={() => setAnchorEl(null)}
                  to={`/users/changepassword/${id}`}
                  className={classes.link}
                >
                  <MenuItem>Change Password</MenuItem>
                </Link>
                <Link
                  onClick={() => setAnchorEl(null)}
                  to={`/users/edit/${id}`}
                  className={classes.link}
                >
                  <MenuItem>Edit Account Details</MenuItem>
                </Link>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    handleLogoutClick();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </Container>

      <MakeBarcodes />
    </AppBar>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  loginError: state.auth.loginError,
  pathname: state.router.location.pathname,
});

export default connect(mapStateToProps, { logout, fetchMe, signedOut, push })(
  Header
);
