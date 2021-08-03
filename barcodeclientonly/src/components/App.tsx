import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import BarcodeHome from "./BarcodeHome";
import DefaultTheme from "./Theme";
import Header from "./Header";

const theme = createTheme(DefaultTheme);

function App() {
  const routes = (
    <Switch>
      <Route path="/">
        <BarcodeHome />
      </Route>
    </Switch>
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header></Header>

        {routes}
      </Router>
    </ThemeProvider>
  );
}

export default App;
