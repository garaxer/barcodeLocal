import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import exportToCsv from '../../util/exportToCsv';
import Search from '../shared/Search';

import {
  Typography,
  Container,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  Paper,
  ButtonGroup,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Link, useRouteMatch } from 'react-router-dom';
import { fetchUsers, deleteUser, getUsers } from '../../actions/users';
import Delete from '../shared/FormElements/Delete';
import MuiAlert from '@material-ui/lab/Alert';
import { clearUserErrors } from '../../actions';
import userStyle from '../useStyle';
import UserTable from './UserTable';
const useStyles = makeStyles(userStyle);

const UserListWrapper = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const [total, setTotal] = useState(5);

  const {
    dispatchFetchUsers,
    users,
    deleteUser,
    error,
    clearUserErrors,
  } = props;

  const { url } = useRouteMatch();
  const [optionsFilter, setOptionsFilter] = useState(null);

  useEffect(() => {
    const options = {
      pagination: { page: -1, perPage: 1 },
      sort: { field: 'createdat', order: 'DESC' },
      filter: {},
    };
    dispatchFetchUsers(options, setTotal);
  }, [dispatchFetchUsers]);

  useEffect(() => {
    clearUserErrors();
    return () => clearUserErrors();
  }, [clearUserErrors]);

  const handleDelete = (ids) => () => {
    ids.forEach((id) => deleteUser(id));
  };

  const handleExport = () => {
    const callExportToCsv = ({ payload }) => {
      const fields = ['name', 'email', 'permission', 'createdAt'];
      exportToCsv(payload, fields, 'users');
    };

    fetchUsers()(callExportToCsv);
  };

  const onSearch = (value) => {
    if (!value) {
      return setOptionsFilter(null);
    }
    setOptionsFilter({ name: value });
  };

  const handleLoadMore = () => {
    const options = {
      pagination: { page: parseInt(users.length / 5) + 1, perPage: 5 },
      sort: { field: 'createdat', order: 'DESC' },
      filter: optionsFilter || {},
    };

    dispatchFetchUsers(options);
  };

  const UserEditButtons = (id) => (
    <>
      <ButtonGroup
        size="small"
        color="secondary"
        aria-label="outlined secondary button group"
      >
        <Button>
          <Link className={`${classes.link}`} to={`${url}/edit/${id}`}>
            Edit
          </Link>
        </Button>

        <Button>
          <Link className={classes.link} to={`${url}/changepassword/${id}`}>
            Change Password
          </Link>
        </Button>
      </ButtonGroup>
    </>
  );

  const UserProfileLink = (id, name) => (
    <Link className={classes.link} to={`${url}/profile/${id}`}>
      {name}
    </Link>
  );

  // filter the user based of searched filter
  const generateListItems = () => {
    const filterUsersWithNulls = optionsFilter
      ? users.filter((user) =>
          Object.keys(optionsFilter).every((x) =>
            user[x]
              .toString()
              .toLowerCase()
              .includes(optionsFilter[x].toLowerCase())
          )
        )
      : users;
    const filteredUsers = filterUsersWithNulls.map((x) =>
      x.company_id ? x : { ...x, company_id: '' }
    );
    if (!filteredUsers) {
      return <div>No Users</div>;
    }
    console.log(filteredUsers);
    return !matches ? (
      <>
        <Typography className={classes.marginBottom} variant="h4">
          Edit Users
        </Typography>
        <Paper>
          <List>
            {filteredUsers
              ?.sort((a, b) =>
                b.createdat.toUpperCase() < a.createdat.toUpperCase() ? -1 : 0
              )
              .map((user) => {
                if (!user.id) {
                  return <div>No Users Found</div>;
                }
                return (
                  <ListItem key={user.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <AccountCircle />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={UserProfileLink(user.id, user.name)}
                      secondary={`email: ${user.email}, id: ${
                        user.id
                      }, roles: ${user.permission ?? 'none'}`}
                    />
                    <ListItemSecondaryAction>
                      <UserEditButtons id={user.id} />
                      <Delete handleDelete={handleDelete([user.id])} />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
          </List>
        </Paper>
        {false && (
          <Button
            className={classes.marginTop}
            color="secondary"
            fullWidth
            variant="contained"
            onClick={handleLoadMore}
          >
            Load 5 More
          </Button>
        )}
      </>
    ) : (
      <UserTable
        data={filteredUsers}
        total={total}
        title="User Table"
        handleDelete={handleDelete}
        UserEditButtons={UserEditButtons}
        UserProfileLink={UserProfileLink}
      ></UserTable>
    );
  };

  return (
    <Container className={classes.root}>
      <div className={`${classes.flexEnd} ${classes.marginBottom}`}>
        <Search onSearch={onSearch} placeholder="Search by Name" />
        <div>
          <Link className={classes.link} to={`${url}/new`}>
            <Button color="primary" aria-label="Create" startIcon={<AddIcon />}>
              Create User
            </Button>
          </Link>
          <Button
            color="primary"
            aria-label="Create"
            startIcon={<GetAppIcon />}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>

      {generateListItems()}

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
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    users: Object.values(state.users),
    error: state.usersLoading.error,
  };
};

export default connect(mapStateToProps, {
  dispatchFetchUsers: getUsers,
  deleteUser,
  clearUserErrors,
})(UserListWrapper);
