// Shows the users profile, which for now just shows the barcodes they made.
// Todo make a generic list component that admin section uses as well.

import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import exportToCsv from '../../util/exportToCsv';
import { Container, Button, useMediaQuery } from '@material-ui/core';
import { getBarcodes } from '../../actions/barcodes';
import { fetchUser } from '../../actions/users';

import GetAppIcon from '@material-ui/icons/GetApp';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import userStyle from '../useStyle';
import Search from '../shared/Search';
import UserBarcodes from './BarcodesList';
import BarcodesTable from './BarcodesTable';

const useStyles = makeStyles(userStyle);

const UserShow = (props) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const classes = useStyles();
  const [filter, setFilter] = useState(null);
  const [total, setTotal] = useState(5);
  const [loading, setLoading] = useState(false);

  const { id } = props.match.params;

  const selectorReturningObject = (state) => {
    // todo: https://react-redux.js.org/api/hooks
    // can use import { createSelector } from 'reselect'
    // declare it outside (dependency injection)

    const barcodes =
      state.barcodes &&
      Object.values(state.barcodes).filter(
        (v) => v?.creator_id?.toString() === id
      );
    const filteredBarcodes = filter
      ? barcodes.filter((barcode) =>
          Object.keys(filter).every((x) => barcode[x].toString() === filter[x])
        )
      : barcodes;
    return {
      user: state.users[id],
      token: state.auth.token,
      barcodes: filteredBarcodes,
      query: state.router.location.query,
    };
  };

  const { user, token, barcodes } = useSelector(
    selectorReturningObject,
    shallowEqual
  );

  const dispatch = useDispatch();

  //useMemo(async () => {
  //  let a = await getBarcodes();
  //  console.log(a);
  //}, []);

  useMemo(() => {
    !user && dispatch(fetchUser(token, id));
  }, [user, token, id, dispatch]);

  useMemo(() => {
    const options = {
      pagination: { page: 1, perPage: 5 },
      sort: { field: 'createdat', order: 'DESC' },
      filter: { creator_id: id },
    };
    id && dispatch(getBarcodes(options, setTotal));
  }, [id, dispatch]);

  const handleLoadMore = () => {
    setLoading(true);
    console.log(barcodes.length);
    const options = {
      pagination: { page: parseInt(barcodes.length / 5) + 1, perPage: 5 },
      sort: { field: 'createdat', order: 'DESC' },
      filter: { creator_id: id },
    };
    //rangeStart: barcodes.length + 1,
    //rangeEnd: barcodes.length + 6,
    console.log(options);

    const callBack = (total) => {
      setLoading(false);
      setTotal(total);
    };

    dispatch(getBarcodes(options, callBack));
    //setBcount(bcount + 5);
  };

  const handleExport = () => {
    const options = {
      pagination: { page: -1, perPage: 1 },
      sort: { field: 'createdat', order: 'DESC' },
      filter: { creator_id: id },
    };

    const callExportToCsv = ({ payload }) => {
      const fields = ['bprefix', 'bnumber', 'creator_id', 'createdAt'];
      exportToCsv(payload, fields);
    };

    getBarcodes(options)(callExportToCsv);
  };

  const onSearch = (value) => {
    //TODO: fix this basic search, a more generic one is required.

    const bprefix = /[A-Za-z]+/.exec(value);
    const bprefixFilter = bprefix ? { bprefix: bprefix[0] } : {};
    const bnumber = /\d+/.exec(value);
    const bnumberFilter = bnumber ? { bnumber: bnumber[0] } : {};
    const filter = value
      ? { ...bprefixFilter, ...bnumberFilter, creator_id: id }
      : { creator_id: id };
    setFilter(filter);

    const options = {
      pagination: { page: 1, perPage: 5 },
      sort: { field: 'createdat', order: 'DESC' },
      filter,
    };

    dispatch(getBarcodes(options, setTotal));
  };

  /* Changes the options and gets additional barcodes */
  const changeOptions = ({ page, perPage, field, order }) => {
    console.log({ page, perPage });
    const options = {
      pagination: { page, perPage },
      sort: { field, order },
      filter: { ...filter, creator_id: id },
    };

    dispatch(getBarcodes(options, setTotal));
  };

  const generateListItems = () => {
    if (!user) {
      return <div>No user found</div>;
    }
    return matches ? (
      barcodes && (
        <BarcodesTable
          data={barcodes}
          total={total}
          changeOptions={changeOptions}
          title={`Barcode History of ${user?.name ?? '...'}:`}
        />
      )
    ) : (
      <>
        <UserBarcodes
          title={`Barcode History of ${user?.name ?? '...'}:`}
          barcodes={barcodes}
          handleLoadMore={handleLoadMore}
          loading={loading}
        />
      </>
    );
  };

  return (
    <Container className={classes.root}>
      <div className={`${classes.flexEnd} ${classes.marginBottom}`}>
        <Search
          onSearch={onSearch}
          placeholder="Search Barcodes.
         e.g. AP or AP12345"
        />

        <Button
          onClick={handleExport}
          color="primary"
          aria-label="Export"
          startIcon={<GetAppIcon />}
        >
          Export
        </Button>
      </div>

      {generateListItems()}
    </Container>
  );
};

export default UserShow;
