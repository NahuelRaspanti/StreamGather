import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DrawerStream from './DrawerStream';
import StreamGrid from './StreamGrid';
import MultiStream from './MultiStream';
import ButtonList from './ButtonList';
import Logo from '../Images/StreamGatherLogo.png'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: '80px',
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  contentSpacer: theme.mixins.toolbar,
  container: {
    width: '100%'
  },
  buttonList: {
    position: 'absolute',
    right: '30px'
  }
}));

export default function MiniDrawer({streams, user, logout, selectStream, removeStream, selectChat, teatherMode, hideShowChat}) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        style = {{backgroundColor: '#424242', display: `${streams.teatherMode ? 'none' : 'block'}`}}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            StreamGather
          </Typography>
          <img src = {Logo} height = '48px'></img>
          <div className = {classes.buttonList}>
          <ButtonList
          user = {user}
          logout = {logout}
        ></ButtonList>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        style = {{display: `${streams.teatherMode ? 'none' : 'block'}`}}
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {streams.streams.map(str => (
            <DrawerStream stream = {str} selectStream = {selectStream}></DrawerStream>
          ))}
        </List>
      </Drawer>
      <div className = {clsx(classes.contentSpacer, classes.container)} style = {{marginTop: `${streams.teatherMode ? '0px' : '64px'}`}}>
      <MultiStream
        selectedStreams = {streams.selectedStreams}
        removeStream = {removeStream}
        selectChat = {selectChat}
        selectedChat = {streams.selectedChat}
        setTeatherMode = {teatherMode}
        teatherMode = {streams.teatherMode}
        hideChat = {hideShowChat}
        isChatHidden = {streams.isChatHidden}
      >
      </MultiStream>
      <StreamGrid
          streams = {streams.streams}
          selectStream = {selectStream}
          isLoading = {streams.loadingStreams}
          user = {user}
        ></StreamGrid>
      </div>
    </div>
  );
}