import React, { useState, useEffect } from 'react';

import { Paper, Button, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';

import { login } from '../../actions/users';
import { connect } from 'react-redux';

import userStyle from '../useStyle';
const useStyles = makeStyles(userStyle);

const LoginForm = ({ login, error }) => {
  const classes = useStyles();

  // Form Field State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    error && setLoading(false);
  }, [error]);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setLoading(true);
    login({ email, password });
  };

  return (
    <div className={`${classes.loginForm} `}>
      <Paper className={`${classes.loginSmallForm}`}>
        <Typography variant="h4" gutterBottom>
          Enter Your Credentials
        </Typography>
        <form onSubmit={handleLoginClick} noValidate>
          <div>
            <TextField
              fullWidth
              required
              id="email"
              label="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <TextField
              fullWidth
              required
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            fullWidth
            disabled={loading}
            type="submit"
            variant="contained"
            color="secondary"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </Button>
          {error && (
            <MuiAlert
              className={classes.alert}
              elevation={6}
              variant="filled"
              severity="error"
            >
              {error}
            </MuiAlert>
          )}
        </form>
      </Paper>
    </div>
  );
};

const mapStateToProps = (state) => ({
  error: state.auth.loginError,
});

export default connect(mapStateToProps, { login })(LoginForm);
