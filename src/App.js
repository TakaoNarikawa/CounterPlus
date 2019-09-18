import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Typography, IconButton, Grid } from '@material-ui/core'
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import Counter from './Counter'
import { RemoveScroll } from 'react-remove-scroll';

import { createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core/styles';

import ScoreManager from './ScoreManager'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const theme = createMuiTheme({
  type: 'light',
  palette: {
    primary: {
      light: '#000000',
      main: '#364150',
      contrastText: '#fff',
    },
    // button enabled
    secondary: {
      light: '#000000',
      main: '#C2BDCE',
      contrastText: '#fff',
    },
    // button disabled
    error: {
      light: '#000000',
      main: '#2b2133',
      contrastText: '#fff',
    },
  },
});

class App extends Component {

  constructor(props) {
    super();
    this.classes = props.classes;
    console.log(this.classes)
    this.state = {
      redoEnabled: false,
      undoEnabled: false
    }
    this.manager = new ScoreManager();
    this.manager.updateBarInterface = (redo, undo) => {
      this.setState({
        redoEnabled: redo,
        undoEnabled: undo
      })
    }
  }

  render() {
    return (
      <div className={this.classes.root} >
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"></meta>
        <RemoveScroll>
          <MuiThemeProvider theme={theme} >
            <AppBar position="static" color="primary">
              <Toolbar>

                <Grid
                  justify="space-between" // Add it here :)
                  container
                >
                  <Grid item>
                    <Typography variant="h6" className={this.classes.title}>
                      <img src="https://i.imgur.com/WLv1TO2.png" alt="CounterPlus" height="20vw"
                        style={{
                          position: 'absolute', top: '50%',
                          transform: 'translate(0%, -50%)'
                        }} />
                    </Typography>
                  </Grid>

                  <Grid item>
                    <div>
                      <IconButton aria-label="undo" disabled={!this.state.undoEnabled} className={this.classes.margin}
                        onClick={() => {
                          this.manager.undo();
                        }}>
                        <ArrowBackIos color={this.state.undoEnabled ? "secondary" : "error"} />
                      </IconButton>
                      <IconButton aria-label="redo" disabled={!this.state.redoEnabled} className={this.classes.margin}
                        onClick={() => {
                          this.manager.redo();
                        }}>
                        <ArrowForwardIos color={this.state.redoEnabled ? "secondary" : "error"} />
                      </IconButton>
                    </div>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
          </MuiThemeProvider>
          <div style={{ backgroundColor: '#364150' }}><Counter manager={this.manager} /></div>
        </RemoveScroll>
      </div >
    );
  }
}

export default withStyles(useStyles)(App);