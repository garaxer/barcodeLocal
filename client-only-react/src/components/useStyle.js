export default (theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
    // fontFamily: "'Heebo', sans-serif",
    // backgroundColor: '#f0f0f0',
  },
  alternate: {
    backgroundColor: '#f0f0f2',
  },
  paper: {
    padding: theme.spacing(2),
  },
  padded: {
    padding: theme.spacing(2),
  },
  alert: {
    marginTop: theme.spacing(2),
  },
  loginSmallForm: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    minWidth: 300,
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2),
    },
  },
  loginForm: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  smallForm: {
    display: 'flex',
    // justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paperbg: {
    backgroundColor: theme.palette.background.paper,
  },
  newButton: {
    marginBottom: theme.spacing(2),
  },
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
  flexEnd: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  form: {
    '& .MuiTextField-root': {
      // margin: theme.spacing(1),
      width: 400,
      marginBottom: theme.spacing(2),
    },
  },
  spaced: {
    flexGrow: 1,
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },

  marginTop: {
    marginTop: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  field: {
    marginBottom: theme.spacing(2),
    minWidth: 300,
  },
  searchBox: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  searchField: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
});

const drawerWidth = 240;
/* Drawer*/
export const headerStyle = (theme) => ({
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  colourInherit: {
    color: 'inherit',
  },
});

export const drawerStyle = (theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  menuButton: {
    // marginRight: theme.spacing(2),
  },
  rotated: {
    transform: 'rotate(-180deg)',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
});
