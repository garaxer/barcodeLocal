import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import GroupIcon from '@material-ui/icons/Group';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import { drawerStyle } from '../useStyle';
import { ListSubheader } from '@material-ui/core';
const useStyles = makeStyles(drawerStyle);

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface item {
  text: string;
  link: string;
}

interface Props {
  anchor: Anchor;
  items: item[];
  menuIcon: boolean;
}

export default function TemporaryDrawer({
  anchor = 'left',
  items = [
    { text: 'Account', link: '/' },
    { text: 'Settings', link: '/' },
  ],
  menuIcon = true,
}: Props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List subheader={<ListSubheader>Administration</ListSubheader>}>
        <Divider />

        {items.map(({ text, link }, index) => (
          <Link to={link} key={text} className={classes.link}>
            <ListItem button>
              <ListItemIcon>
                {index % 2 === 0 ? <FormatAlignRightIcon /> : <GroupIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );

  return (
    <div key={anchor}>
      {menuIcon ? (
        <IconButton
          onClick={toggleDrawer(anchor, true)}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
      ) : (
        <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
      )}
      <Drawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
      >
        {list(anchor)}
      </Drawer>
    </div>
  );
}
