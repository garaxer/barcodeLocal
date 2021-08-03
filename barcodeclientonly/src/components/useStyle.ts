import { Theme } from "@material-ui/core/styles";

const DefaultStyle = (theme: Theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  nonLink: { textDecoration: "none", color: "inherit" },
  body: { backgroundColor: "red" },
  searchBox: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },
  searchField: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  /*Generate Styles*/
  fieldContainer: {
    marginBottom: theme.spacing(2),
  },
  field: {
    //paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),

    minWidth: 300,
  },
});

export default DefaultStyle;
