import React, { useState } from 'react';
import { makeStyles, IconButton, InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import useStyle from '../useStyle';

const useStyles = makeStyles(useStyle);
const SearchField = (props) => {
  const { onSearch, placeholder } = props;
  const [searchValue, setSearchValue] = useState('');
  const [dirty, setDirty] = useState(false);
  const classes = useStyles();

  const keyPress = (e) => {
    e.key !== 'Enter' && setDirty(true);
    e.key === 'Enter' && dirty && onSearch(searchValue);
    //e.preventDefault();
  };

  return (
    <Paper className={classes.searchBox}>
      <InputBase
        className={classes.searchField}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search barcodes records' }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={keyPress}
      />
      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
        onClick={() => dirty && onSearch(searchValue)}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
export default SearchField;
