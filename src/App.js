import React, { useState } from 'react';
import styled from 'styled-components';

import { AppBar, Toolbar, Typography, Grid, ToggleButton } from '@material-ui/core'


export default () => {

  const [redoEnabled, undoEnabled, posReversed, swipeReversed] = useState(false)

  const title = (iconSize) => {

    const StyledImg = styled.img`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(0%, -50%);
  `
    const StyledTypography = styled(Typography)`
    flexGrow: 1;
  `
    return (
      <Grid item>
        <StyledTypography
          variant="h6"
        >
          <img
            src="https://i.imgur.com/WLv1TO2.png"
            alt="CounterPlus"
            height={iconSize}
          />
        </StyledTypography>
      </Grid>
    )
  };

  const menu = () => {

    const StyledToggleButton = styled(ToggleButton)`
    border: 0,
    borderRadius: 50
  `

    return (
      <Grid item>
        <div>
          <StyledToggleButton
            value='posReversed'
            selected={this.state.posReversed}
            onChange={() => { this.setState() }}
          >

          </StyledToggleButton>
        </div>
      </Grid>
    )
  }

  const StyledAppBar = AppBar
  return (
    <div>
      <StyledAppBar>
        <Toolbar>
          <Grid
            justify='space-between'
            container
          >
            {title(30)}
          </Grid>
        </Toolbar>
      </StyledAppBar>
    </div>
    )
  };
  
  /*
  
class App extends Component {

        constructor(props) {
        super(props);
      this.classes = props.classes;
    this.state = {
        windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      redoEnabled: false,
      undoEnabled: false,
      posReversed: false,
      swipeReversed: false,
      anchorEl: null,
      setAnchorEl: null,
      setNum: 5
    }
    this.manager = new ScoreManager();
    this.manager.updateBarInterface = (redo, undo) => {
        this.setState({
          redoEnabled: redo,
          undoEnabled: undo,
        })
      }
      this.manager.onEndGame = (res) => {
        this.props.history.push({
          pathname: '/CounterPlus/result',
          state: { result: res }
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

        setTimeout(function () {
          window.scrollTo(0, 0);
          this.setState({ windowWidth: window.innerWidth })
        }.bind(this), 500)
      }

      handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget })
      }

      handleClose = () => {
        this.setState({ anchorEl: null })
      }

      render() {

        let appBar = (left, right) => {
      if (this.state.windowWidth > 450) {
        return (
          <AppBar position="fixed" color="primary" style={{ boxShadow: 'none' }}>
        <Toolbar>
          <Grid
            justify="space-between" // Add it here :)
            container
          >
            {left("20vw", "0%")}

            {right}

          </Grid>
        </Toolbar>
      </AppBar>
      )
      } else if (this.state.windowWidth > 370) {
        return (
          <AppBar position="fixed" color="primary" style={{ boxShadow: 'none' }}>
        <Toolbar>
          <Grid
            justify="space-between" // Add it here :)
            container
          >
            {left("12vw", "0%")}

            {right}

          </Grid>
        </Toolbar>
      </AppBar>
      )
      } else {
        return (
          <AppBar position="fixed" color="primary" style={{ boxShadow: 'none' }}>
        <Toolbar>
          <Grid
            justify="space-between" // Add it here :)
            container
          >
            {left("8vw", "0%")}

            {right}

          </Grid>
        </Toolbar>
      </AppBar>
      )
    }
  }

    let title = (iconSize, transform) => {
      return (
        <Grid item>
        <Typography variant="h6" className={this.classes.title}>
          <img src="https://i.imgur.com/WLv1TO2.png" alt="CounterPlus" height={iconSize}
            style={{
              position: 'absolute', top: '50%', left: { transform },
              transform: 'translate(0%, -50%)'
            }} />
        </Typography>
      </Grid>
      )
    }

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
                pathname: '/CounterPlus/result',
                state: { result: res }
              })
            }}><div style={{ textAlign: 'center' }}>対戦結果を見る</div></MenuItem>

            <MenuItem >
              <FormControlLabel
                value="swipeReversed"
                control={<
                  Checkbox color="primary"
                  onChange={e => {
                    this.setState({ swipeReversed: !this.state.swipeReversed });
                    this.handleClose();
                  }}
                  checked={this.state.swipeReversed}
                />}
                label="スワイプの向きを逆にする"
                labelPlacement="start"
                style={{ marginLeft: 0 }}
              />
            </MenuItem>

            <MenuItem >
              <FormControl>
                <Select
                  value={this.state.setNum}
                  onChange={(e) => {
                    let finalSetNum = this.manager.calcFinalSetNum(e.target.value)
                    if (this.manager.p1.set > finalSetNum || this.manager.p2.set > finalSetNum) {
                      alert("現在のセット数は\nすでに指定された数のファイナルセットを上回っています")
                    } else {
                      this.setState({ setNum: e.target.value })
                      this.manager.changeGameset(e.target.value)
                    }
                  }}
                  name="name"
                  inputProps={{
                    name: 'gameset',
                    id: 'gameset-id',
                  }}
                >
                  <MenuItem value={3}>3ゲーム</MenuItem>
                  <MenuItem value={5}>5ゲーム</MenuItem>
                  <MenuItem value={7}>7ゲーム</MenuItem>
                </Select>
              </FormControl>

            </MenuItem>


          </Menu>

        </div>
      </Grid >
      )
      return (
      <div className={this.classes.root} >
        <Helmet>
          <meta name="apple-mobile-web-app-title" content="CounterPlus" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <title>CounterPlus</title>
        </Helmet>

        <RemoveScroll>
          <MuiThemeProvider theme={theme} >
            {appBar(title, menu)}
          </MuiThemeProvider>
          <div>
            <Counter
              manager={this.manager}
              initialPosReversed={this.state.posReversed}
              swipeReversed={this.state.swipeReversed}
            />
          </div>
        </RemoveScroll>
      </div >
      );
    }
  }
  
  export default withRouter(withStyles(useStyles)(App));
  
*/