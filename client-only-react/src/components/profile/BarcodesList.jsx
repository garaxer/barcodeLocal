// filter the user based of searched filter
import React from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GenerateBarcodeButton from '../shared/GenerateBarcodeButton';

import userStyle from '../useStyle';
import { getFormattedDate } from '../../util';

const useStyles = makeStyles(userStyle);

const UsersBarcodes = ({
  title,
  barcodes,
  showCreatedBy = false,
  handleLoadMore,
  loading,
}) => {
  const classes = useStyles();

  const generateListItems = () => {
    if (!barcodes) {
      return <div>Loading...</div>;
    }
    if (Array.isArray(barcodes) && !barcodes.length) {
      return <ListItem>No barcodes found.</ListItem>;
    }
    return barcodes?.map(({ bprefix, bnumber, createdat, creator_id }, i) => {
      return (
        <ListItem
          key={`${bprefix}${bnumber}`}
          className={i % 2 ? classes.alternate : ''}
        >
          <ListItemText
            primary={`${bprefix}${bnumber}`}
            secondary={`Created: ${getFormattedDate(new Date(createdat))} ${
              showCreatedBy ? `| Created By USER ID: ${creator_id}` : ''
            }`}
          />
          <ListItemSecondaryAction>
            <GenerateBarcodeButton barcodes={[`${bprefix}${bnumber}`]} />
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  };

  return (
    <>
      <Typography variant="h6">{title}</Typography>

      <Paper>
        <List>{generateListItems()}</List>
      </Paper>
      <Button
        disabled={loading}
        className={classes.marginTop}
        color="secondary"
        fullWidth
        variant="contained"
        onClick={handleLoadMore}
      >
        Load 5 More
      </Button>
    </>
  );
};
export default UsersBarcodes;
