import React, { useEffect } from 'react';
import { Typography, Paper } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { fetchUser, editUser } from '../../actions/users';
import userStyle from '../useStyle';
import UserForm from './UserForm';

import { passwordFields } from './formFields';

const useStyles = makeStyles(userStyle);

const UserCreate = (props) => {
  const { fetchUser, editUser, user, token, id, error } = props;
  const classes = useStyles();

  useEffect(() => {
    if (!user) {
      token && fetchUser(token, id);
    }
  }, [user, id, fetchUser, token]);

  const onSubmit = (formValues) => {
    editUser(token, id, formValues, true);
  };

  return (
    <div className={`${classes.smallForm} ${classes.root}`}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h4">Changing password of: {user?.name}</Typography>
        {user && <UserForm formFields={passwordFields} onSubmit={onSubmit} />}
        {error && token && (
          <MuiAlert
            className={classes.alert}
            elevation={6}
            variant="filled"
            severity="error"
          >
            {error}
          </MuiAlert>
        )}
      </Paper>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  return {
    user: state.users[id],
    token: state.auth.token,
    error: state.usersLoading.error,
    id: id,
  };
};

export default connect(mapStateToProps, { fetchUser, editUser })(UserCreate);
