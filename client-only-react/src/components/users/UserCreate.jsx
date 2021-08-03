import React, { useEffect } from 'react';
import { Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';
import { newUser } from '../../actions/users';
import UserForm from './UserForm';
import userStyle from '../useStyle';
import formFields from './formFields';

const useStyles = makeStyles(userStyle);

const UserCreate = (props) => {
  const classes = useStyles();
  const { token, newUser, error, loading } = props;

  const onSubmit = (formValues) => {
    const mapPermissions = {
      ...formValues,
      permission: formValues.permission ? 'admin' : '',
    };
    newUser(token, mapPermissions);
  };

  useEffect(() => {
    if (loading) {
      console.log('loading');
    }
  }, [loading, error]);

  return (
    <div className={`${classes.smallForm} ${classes.root}`}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h4">Create User</Typography>

        <UserForm formFields={formFields} onSubmit={onSubmit} />

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
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  error: state.usersLoading.error,
  loading: state.usersLoading.loading,
});
export default connect(mapStateToProps, { newUser })(UserCreate);
