import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { Typography, Container, Button, List} from '@material-ui/core';

import { fetchUser } from '../../actions/users';

import { makeStyles } from '@material-ui/core/styles';
import userStyle from './userStyle';
const useStyles = makeStyles(userStyle);

const UserShow = ({id, user, token, fetchUser }) => {
  const classes = useStyles();

  useEffect(()=>{
    token && !user && fetchUser(token, id)
  },[token, user, fetchUser, id])
  
  const generateListItems = () => {
    if (!user) {
      return <div>Loading... (Should take a few seconds)</div>
    }
    return <p> In progress, will show a users barcodes, much like the profile.</p>


  }
  return (
    <Container className={classes.root}>
      <div className={classes.flexEnd}>
        <Typography variant="h4">
          Barcode History of {user?.name}.
        </Typography>
        <Button className={classes.newButton} variant="contained" color="primary">Edit This User</Button>
      </div>
      <div className={classes.paperbg}>
        <List>
          {generateListItems()}
        </List>
      </div>   
    </Container>
  )
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  return {
    user: state.users[id],
    token: state.auth.token,
    id
  };
}

export default connect(mapStateToProps, {fetchUser })(UserShow);
