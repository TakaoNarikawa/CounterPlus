import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Grid, MenuItem, Menu, Button } from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { ArrowBackIos, ArrowForwardIos, SwapHorizOutlined } from '@material-ui/icons';
import Counter from './Counter'
import { RemoveScroll } from 'react-remove-scroll';

import { createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core/styles';

import ScoreManager from './ScoreManager'

import MenuIcon from '@material-ui/icons/Menu';

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
    super(props);
    this.classes = props.classes;
    this.state = {
      windowWidth: window.innerWidth,
      redoEnabled: false,
      undoEnabled: false,
      posReversed: false,
      anchorEl: null,
      setAnchorEl: null
    }
    this.manager = new ScoreManager();
    this.manager.updateBarInterface = (redo, undo) => {
      this.setState({
        redoEnabled: redo,
        undoEnabled: undo,
      })
    }

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.addEventListener("resize", null);
  }
  handleResize(WindowSize, event) {
    console.log("fooo")
    this.setState({ windowWidth: window.innerWidth })
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {

    let appBar = (left, right) => {
      if (this.state.windowWidth > 500) {
        return (
          <AppBar position="static" color="primary" style={{ boxShadow: 'none' }}>
            <Toolbar>
              <Grid
                justify="space-between" // Add it here :)
                container
              >
                {left}

                {right}

              </Grid>
            </Toolbar>
          </AppBar>
        )
      } else {
        return (
          <div>
            <AppBar position="static" color="primary" style={{ boxShadow: 'none' }}>
              <Toolbar>
                <Grid
                  justify="space-between" // Add it here :)
                  container
                >
                  <div />

                  {right}

                </Grid>
              </Toolbar>
            </AppBar>
          </div>
        )
      }
    }

    let title = (
      <Grid item>
        <Typography variant="h6" className={this.classes.title}>
          <img src="https://i.imgur.com/WLv1TO2.png" alt="CounterPlus" height="20vw"
            style={{
              position: 'absolute', top: '50%',
              transform: 'translate(0%, -50%)'
            }} />
        </Typography>
      </Grid>
    )

    let menu = (
      <Grid item>
        <div>

          <ToggleButton
            value="posReversed"
            selected={this.state.posReversed}
            onChange={() => {
              this.setState({ posReversed: !this.state.posReversed })
            }}
            style={{
              border: 0, bordeRadius: '50'
            }}
          >
            <SwapHorizOutlined color={this.state.posReversed ? "secondary" : "error"} />
          </ToggleButton>

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

          <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
            <MenuIcon color="secondary" />
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={() => {
              let conf = window.confirm('現在のスコアをリセットしても良いですか？');
              if (conf) {
                this.manager.reset()
              }
              this.handleClose();
            }}>リセット</MenuItem>
            <MenuItem onClick={() => {
              let res = this.manager.result();
              this.props.history.push({
                pathname: '/result',
                state: { result: res }
              })

            }}>対戦結果を見る</MenuItem>
          </Menu>

        </div>
      </Grid>
    )
    return (
      <div className={this.classes.root} >
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <RemoveScroll>
          <MuiThemeProvider theme={theme} >
            {appBar(title, menu)}
          </MuiThemeProvider>
          <div style={{ backgroundColor: '#364150' }}><Counter manager={this.manager} initialPosReversed={this.state.posReversed} /></div>
        </RemoveScroll>
      </div >
    );
  }
}

export default withRouter(withStyles(useStyles)(App));