import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Grid, MenuItem, Menu, Button, Card, CardContent, CardActions } from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { ArrowBackIos, ArrowForwardIos, SwapHorizOutlined } from '@material-ui/icons';
import Counter from './Counter'
import { RemoveScroll } from 'react-remove-scroll';

import { createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
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

class ResultView extends Component {

  constructor(props) {
    super(props);
    if (!this.props.location || !this.props.location.state) {
      this.props.history.push({ pathname: '/' })
    }
    this.classes = props.classes;
    this.state = {
      windowWidth: window.innerWidth
    }
    this.handleResize = this.handleResize.bind(this);
    console.log(this.props.location.state)
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.addEventListener("resize", null);
  }
  handleResize(WindowSize, event) {
    this.setState({ windowWidth: window.innerWidth })
  }

  render() {
    let header = (
      <div>
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"></meta>
        <MuiThemeProvider theme={theme} >
          <AppBar position="static" color="primary">
            <Toolbar>
              <Grid
                justify="space-between" // Add it here :)
                container
              >
                <Grid item>
                  <IconButton aria-label="undo" className={this.classes.margin}
                    onClick={() => {
                      this.props.history.push({ pathname: '/' })
                    }}>
                    <ArrowBackIos color="secondary" />
                  </IconButton>
                </Grid>

                <Grid item>
                  <img src="https://i.imgur.com/WLv1TO2.png" alt="CounterPlus" height="20vw"
                    style={{
                      position: 'absolute', top: '50%',
                      transform: 'translate(-100%, -50%)'
                    }} />
                </Grid>

              </Grid>
            </Toolbar>
          </AppBar>
        </MuiThemeProvider>
        <div style={{ backgroundColor: '#364150' }}></div>
      </div>
    )

    return (
      <div className={this.classes.root} >
        {header}
        <ResultCard data={this.props.location.state.result} classes={this.classes} />
      </div >
    );
  }
}

class ResultCard extends Component {

  constructor(props) {
    super(props);
    this.data = this.props.data
  }

  subResStr = () => {
    let arr = this.data.map((res) =>
      res.p1score + " - " + res.p2score,
    )
    var res = "("
    for (var ele of arr) {
      res += ele + ", "
    }
    res = res.slice(0, res.length - 2);
    res += ")"
    return res
  }

  render() {
    let finalRes = this.data[this.data.length - 1];
    let subRes = this.data.map((res) =>
      <Typography variant="h4" component="p">
        {res.p1score} - {res.p2score}
      </Typography>
    )

    return (
      <div>
        <Card className={this.props.classes.card} style={{
          margin: 50
        }}>
          <CardContent>
            <div style={{ textAlign: 'center' }}>
              <Typography className={this.props.classes.title} color="textSecondary" gutterBottom>
                対戦結果
            </Typography>

              <Typography variant="h1" component="h1">
                {finalRes.p1set} - {finalRes.p2set}
              </Typography>
              <Typography className={this.props.classes.pos} variant="h5" color="textSecondary" style={{ padding: 15 }}>
                各セット スコア
            </Typography>
              {subRes}
            </div>
          </CardContent>
        </Card>

        <Grid
          justify="flex-end" // Add it here :)
          container
        >
          <FacebookShareButton url={"https://caprolactam2450.github.io/CounterPlus/"}>
            <FacebookIcon round />
          </FacebookShareButton>
          <TwitterShareButton url={"https://caprolactam2450.github.io/CounterPlus/"}
            title={"試合の結果\n" + finalRes.p1set + " - " + finalRes.p2set + this.subResStr() + "\n"}
            via={"CounterPlus"}
            style={{ paddingLeft: 10, paddingRight: 20 }}>
            <TwitterIcon round />
          </TwitterShareButton>

        </Grid>


      </div>
    )
  }
}

export default withRouter(withStyles(useStyles)(ResultView));
