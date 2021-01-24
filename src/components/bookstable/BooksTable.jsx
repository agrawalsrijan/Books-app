import React, { useEffect } from "react";
import { connect } from "react-redux";
import { addItem } from "../../redux/cart/cart.actions";
import PropTypes from "prop-types";
import clsx from "clsx";

import { lighten, makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Rating from "@material-ui/lab/Rating";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

import Select from "@material-ui/core/Select";

import InputAdornment from "@material-ui/core/InputAdornment";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import SearchIcon from "@material-ui/icons/Search";
import { get } from "idb-keyval";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Title",
  },
  { id: "authors", numeric: false, disablePadding: false, label: "Authors" },
  { id: "price", numeric: true, disablePadding: false, label: "Price" },
  {
    id: "average_rating",
    numeric: true,
    disablePadding: false,
    label: "Rating",
  },
  {
    id: "language_code",
    numeric: false,
    disablePadding: false,
    label: "Language",
  },
  {
    id: "isbn",
    numeric: true,
    disablePadding: false,
    label: "ISBN",
  },
  {
    id: "ratings_count",
    numeric: true,
    disablePadding: false,
    label: "Ratings Count",
  },
  {
    id: "bookID",
    numeric: true,
    disablePadding: false,
    label: "Book ID",
  },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, columnsToShow, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {columnsToShow.map((column) => {
          return headCells.map((headCell) => {
            if (column === headCell.id) {
              return (
                <TableCell
                  key={headCell.id}
                  align={"left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              );
            }
          });
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {},
}));

function getStyles(name, columnsToShow, theme) {
  return {
    fontWeight:
      columnsToShow.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const theme = useTheme();
  const {
    numSelected,
    columnsToShow,
    setColumnsToShow,
    searchTerm,
    setSearchTerm,
  } = props;
  const names = [
    "authors",
    "average_rating",
    "bookID",
    "isbn",
    "language_code",
    "price",
    "ratings_count",
    "title",
  ];

  const handleChange = (e) => {
    setColumnsToShow(e.target.value);
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <Typography
        className={classes.title}
        variant="h5"
        id="tableTitle"
        component="div"
      >
        Books
      </Typography>

      <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-name-label">Columns To Display</InputLabel>
        <Select
          labelId="demo-mutiple-name-label"
          id="demo-mutiple-name"
          multiple
          value={columnsToShow}
          onChange={handleChange}
          input={<Input />}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, columnsToShow, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="SEARCH"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Start Typing To Search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  stars: {
    display: "flex",
    flexDirection: "column",
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
}));

function BooksTable({ booksData, addItem }) {
  const classes = useStyles();
  const [dataToShow, setDataToShow] = React.useState(booksData);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  // const [dense, setDense] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [columnsToShow, setColumnsToShow] = React.useState([
    "title",
    "authors",
    "average_rating",
    "price",
    "language_code",
  ]);

  useEffect(() => {
    if (booksData?.length === 0) {
      let offlineData;
      get("allBooks").then((data) => {
        offlineData = data;
        console.log("offline", offlineData);
        setDataToShow(offlineData);
      });
    } else {
      console.log("inside wrong");
      setDataToShow(booksData);
    }
  }, [booksData]);

  useEffect(() => {
    if (!searchTerm) {
      setDataToShow(booksData);
    } else {
      let reg = new RegExp(`^${searchTerm}`, "i");
      let filteredResults = booksData.filter(
        (book) => reg.test(book.title) || reg.test(book.authors)
      );
      if (filteredResults.length > 0) {
        setDataToShow(filteredResults);
      } else {
        setDataToShow(booksData);
      }
    }
  }, [searchTerm, booksData]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = booksData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (dataToShow?.length > 0) {
    var emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, dataToShow?.length - page * rowsPerPage);
  }
  if (dataToShow && dataToShow.length > 0) {
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            columnsToShow={columnsToShow}
            setColumnsToShow={setColumnsToShow}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={"small"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={dataToShow?.length}
                columnsToShow={columnsToShow}
              />
              <TableBody>
                {stableSort(dataToShow, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    // const isItemSelected = isSelected(row.bookID);

                    return (
                      <TableRow hover tabIndex={-1} key={row.bookID}>
                        <TableCell>
                          <AddShoppingCartIcon
                            fontSize="large"
                            style={{ cursor: "pointer", color: "green" }}
                            onClick={() => addItem(row)}
                          />
                        </TableCell>
                        {columnsToShow.map((columnName) => {
                          if (columnName === "average_rating") {
                            return (
                              <TableCell align="left">
                                <Rating
                                  name="average-rating-read"
                                  defaultValue={row[columnName]}
                                  precision={0.5}
                                  readOnly
                                />
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell align="left">
                                {row[columnName]}
                              </TableCell>
                            );
                          }
                        })}
                        {/*   */}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 33 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataToShow.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    );
  } else {
    return (
      <React.Fragment>
        <h2>No data to show</h2>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (item) => dispatch(addItem(item)),
  };
};

export default connect(null, mapDispatchToProps)(BooksTable);
