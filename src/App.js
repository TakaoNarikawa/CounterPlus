import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, IconButton, Image } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import Counter from './Counter'
import { RemoveScroll } from 'react-remove-scroll';

import { createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const theme = createMuiTheme({
  type: 'light',
  palette: {
    primary: {
      light: '#000000', // 基本の色よりも明るい色
      main: '#3B2D47', // 基本の色
      contrastText: '#fff', // テキストの色
    },
  },
});

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <meta name="apple-mobile-web-app-capable" content="yes"></meta>
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"></meta>
      <RemoveScroll>
        <MuiThemeProvider theme={theme} >
          <AppBar position="static" color="primary">
            <Toolbar>
              <img src="https://i.imgur.com/FJvqzT4.png" alt="Kitten" height="30" />
            </Toolbar>
          </AppBar>
        </MuiThemeProvider>
        <Counter />
      </RemoveScroll>
    </div >
  );
}