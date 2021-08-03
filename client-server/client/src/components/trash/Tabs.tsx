// Shows the users profile, which for now just shows the barcodes they made.
// Todo make a generic list component that admin section uses as well.
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {
  Typography,
  Container,
  Paper,
  AppBar,
  Tabs,
  Tab,
  Box,
} from '@material-ui/core';

import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme: Theme) => ({
  profileText: {
    //backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Typography>{children}</Typography>}
    </div>
  );
}

const UserShow = (props: any) => {
  const { match } = props;

  const classes = useStyles();
  const user = useSelector((state: any) => state.auth.user);
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Container>
      <Typography className={classes.profileText} variant="h4">
        Profile of {user?.name ?? '...'}
      </Typography>
      <Paper>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Barcodes" />
            <Tab label="User Details" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            Item a
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            Item Two
          </TabPanel>
        </SwipeableViews>
      </Paper>
    </Container>
  );
};

export default UserShow;
