import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

import DefaultStyle from "./useStyle";

const useStyles = makeStyles(DefaultStyle);

//type HeaderProps = {
//  children?: React.ReactNode;
//  //pathname: string
//};
/*{ children } : HeaderProps*/
const Header = () => {
  let { pathname } = useLocation();

  const classes = useStyles();

  const [title, setTitle] = useState("Generate Barcodes");

  useEffect(() => {
    const path = pathname.split("/").join("").replace(/[0-9]/g, "");

    type Path = {
      [x: string]: string;
    };
    const paths: Path = {
      admin: "Generate Barcodes Admin",
    };
    setTitle(paths[path] || `Generate Barcodes `);
  }, [pathname]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link className={classes.nonLink} to="/">
              {title}
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
