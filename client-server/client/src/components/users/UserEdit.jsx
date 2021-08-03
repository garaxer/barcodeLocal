import { pick } from '../../util';
import React, { useEffect } from 'react';
import UserForm from './UserForm';
import { Typography, Container, Paper } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { fetchUser, editUser } from '../../actions/users';
import { editUserFields, editUserFieldsAsAdmin } from './formFields';
import userStyle from '../useStyle';

const useStyles = makeStyles(userStyle);

const UserEdit = (props) => {
  const { fetchUser, editUser, user, token, id, error, admin } = props;
  const classes = useStyles();

  useEffect(() => {
    if (!user) {
      console.log('Getting users in the edit form');
      fetchUser(token, id);
    } else {
      //console.log(user);
    }
  }, [user, id, fetchUser, token]);

  const onSubmit = (formValues) => {
    const mapPermissions = admin
      ? {
          ...formValues,
          permission: formValues.permission ? 'admin' : 'none',
        }
      : {
          name: formValues.name,
          email: formValues.email,
        };
    console.log(mapPermissions);

    editUser(token, id, mapPermissions);
  };

  return (
    <Container className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h4">Editing User: {user?.name}</Typography>
        {user && (
          <UserForm
            formFields={admin ? editUserFieldsAsAdmin : editUserFields}
            initialValues={{
              ...pick(['name', 'email'], user),
              permission: user.permission === 'admin',
            }}
            onSubmit={onSubmit}
          />
        )}

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
      </Paper>
    </Container>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const admin = state.auth.user?.permission === 'admin';
  return {
    user: state.users[id],
    token: state.auth.token,
    error: state.usersLoading.error,
    id,
    admin,
  };
};

export default connect(mapStateToProps, { fetchUser, editUser })(UserEdit);
