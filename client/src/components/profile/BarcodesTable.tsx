import React, { useState } from 'react';
import clsx from 'clsx';
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
} from '@material-ui/core';

import GenerateBarcodeButton from '../shared/GenerateBarcodeButton';
import { getFormattedDate } from '../../util';
interface Data {
  id: number;

  bprefix: string;
  bnumber: number;
  createdat: string;
  creator_id: number;
}

function createData(
  id: number,

  bprefix: string,
  bnumber: number,
  creator_id: number,
  createdat: string
): Data {
  return { bprefix, bnumber, createdat, creator_id, id };
}

const dummyRows = [createData(1, 'Loading', 1, 1, '1')];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'id', numeric: false, disablePadding: false, label: 'id' },
  { id: 'bprefix', numeric: true, disablePadding: false, label: 'Prefix' },
  { id: 'bnumber', numeric: true, disablePadding: false, label: 'Number' },
  {
    id: 'createdat',
    numeric: true,
    disablePadding: false,
    label: 'Date Created',
  },
  {
    id: 'creator_id',
    numeric: true,
    disablePadding: false,
    label: 'Creator id',
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  filterHeads: { id: boolean; creator_id: boolean };
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    filterHeads,
  } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells
          .filter(
            ({ id }) => (id === 'creator_id' ? filterHeads.creator_id : true)
            // Fix this with map and some
          )
          .filter(({ id }) => (id === 'id' ? filterHeads.id : true))
          .map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        <TableCell>Re-Generate</TableCell>
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
  })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  title: string;
  barcodesSelected: string[];
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, title, barcodesSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}
      {numSelected > 0 ? (
        <div onClick={(e) => e.stopPropagation()}>
          <GenerateBarcodeButton barcodes={barcodesSelected} />
        </div>
      ) : (
        <></> // Can add a search here instead
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  })
);

export default function EnhancedTable({
  data = dummyRows,
  total,
  title = 'Barcodes Table',
  filterHeads = { id: false, creator_id: false },
  changeOptions,
}: {
  data: Data[];
  total: number;
  title: string;
  showCreator: boolean;
  filterHeads: { id: boolean; creator_id: boolean };
  changeOptions: (options: {
    page: number;
    perPage: number;
    field: string;
    order: string;
  }) => void;
}) {
  const classes = useStyles();
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Data>('createdat');
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [changedOrder, setChangedOrder] = useState(false);

  const rows = data; // Can do stuff to data here

  // If we get more rows we don't need to show the placeholder anymore
  // Need to change this to use a callback inside
  React.useEffect(() => {
    setLoading(false);
  }, [rows]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setChangedOrder(true);
    changeOptions({
      page: 1,
      perPage: rowsPerPage,
      field: property,
      order: isAsc ? 'desc' : 'asc',
    });
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      //.slice(0, 5)
      const newSelecteds = stableSort(rows, getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    // Check if we need more data
    if (
      changedOrder ||
      (newPage > page && rowsPerPage * (newPage + 1) > data.length)
    ) {
      setLoading(true);
      changeOptions({
        page: newPage + 1,
        perPage: rowsPerPage,
        field: orderBy,
        order: order,
      });
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    if (changedOrder || (value > rowsPerPage && value > rows.length)) {
      setLoading(true);
      changeOptions({
        page: 1,
        perPage: value,
        field: orderBy,
        order: order,
      });
    }
    setRowsPerPage(value);
    setPage(0);
  };

  const getBarcodesFromIds = (ids: number[]): string[] => {
    const barcodes = ids.flatMap((newID) =>
      rows
        .filter(({ id }) => newID === id)
        .map(({ bnumber, bprefix }) => `${bprefix}${bnumber}`)
    );
    console.log(barcodes);
    return barcodes;
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          barcodesSelected={getBarcodesFromIds(selected)}
          title={`${title}`}
          numSelected={selected.length}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={true ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={Math.min(rowsPerPage, rows.length - page * rowsPerPage)}
              filterHeads={filterHeads}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell>'Loading...'</TableCell>
                </TableRow>
              ) : (
                stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        {filterHeads.id && (
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.id}
                          </TableCell>
                        )}
                        <TableCell align="right">{row.bprefix}</TableCell>
                        <TableCell align="right">{row.bnumber}</TableCell>
                        <TableCell align="right">
                          {`${getFormattedDate(new Date(row.createdat))}`}
                        </TableCell>
                        {filterHeads.creator_id && (
                          <TableCell align="right">{row.creator_id}</TableCell>
                        )}

                        <TableCell align="right">
                          <div onClick={(e) => e.stopPropagation()}>
                            <GenerateBarcodeButton
                              barcodes={[`${row.bprefix}${row.bnumber}`]}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: (true ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 15, 30]}
          component="div"
          count={total /*rows.length*/}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
