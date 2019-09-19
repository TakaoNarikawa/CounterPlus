import React, { Component } from 'react'
import Draggable from 'react-draggable';
import { Grid, Box } from '@material-ui/core'

const xor = (a, b) => {
    return (a || b) && !(a && b);
}

class Counter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            p1: {
                score: 0,
                set: 0
            },
            p2: {
                score: 0,
                set: 0
            },
            leftServes: true,
            posReversed: false
        }
        this.manager = this.props.manager;
        this.manager.updateContentInterface = (p1_, p2_, leftServes_, posReversed_) => {
            this.setState({
                p1: {
                    score: p1_.score,
                    set: p1_.set
                },
                p2: {
                    score: p2_.score,
                    set: p2_.set
                },
                leftServes: leftServes_,
                posReversed: posReversed_
            })
        }
    }
    render() {
        var scoreViews = (!xor(this.state.posReversed, this.props.initialPosReversed) ? [true, false] : [false, true]).map((isP1) => {
            return (
                <ScoreView
                    scoreData={isP1 ? this.state.p1 : this.state.p2}
                    onPositiveSwipe={() => {
                        if (!this.props.swipeReversed) {
                            this.manager.addScore(isP1);
                        } else {
                            this.manager.minusScore(isP1);
                        }
                    }}
                    onNegativeSwipe={() => {
                        if (!this.props.swipeReversed) {
                            this.manager.minusScore(isP1);
                        } else {
                            this.manager.addScore(isP1);
                        }

                    }
                    }
                    serveIndicate={isP1 ? this.state.leftServes : !this.state.leftServes}
                    key={isP1 ? 0 : 1}
                />
            )
        })

        return (
            <div>

                <div style={{ display: 'flex', flexDirection: 'col', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: '#364150', paddingTop: 30 }}>
                    {scoreViews}
                </div>
                {(this.state.p1.score + this.state.p2.score) % 6 === 0 && (this.state.p1.score > 0 || this.state.p2.score > 0) ? <Notification /> : null}

            </div>
        )
    }
}


class Notification extends Component {

    constructor() {
        super();
        this.state = {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth
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
            this.setState({ windowHeight: window.innerHeight, windowWidth: window.innerWidth })
        }.bind(this), 500)
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', position: 'absolute', marginTop: 80, width: '100vw' }}>
                <Box
                    color="#fff"
                    bgcolor="rgba(0,0,0,0.5)"
                    fontSize={Math.min(this.state.windowHeight * 0.08, this.state.windowWidth * 0.08)}
                    p={{ xs: 2, sm: 3, md: 4 }}
                    style={{ borderRadius: 15 }}
                >
                    タオル使用可能
                </Box>
            </div>

        )
    }
}

class ScoreView extends Component {
    offset = 0

    constructor() {
        super();
        this.state = {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth
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
            this.setState({ windowHeight: window.innerHeight, windowWidth: window.innerWidth })
        }.bind(this), 500)
    }

    onStartSwipe = (e, data) => {
        this.offset = data.y
    };

    onFinishSwipe = (e, data) => {
        let deltaY = data.y - this.offset;

        if (deltaY > 100) {
            this.props.onPositiveSwipe();
        } else if (deltaY < -100) {
            this.props.onNegativeSwipe();
        }
    };

    render() {

        // スワイプ量に合わせて、要素の位置を変更する.
        let style = {
            width: '50vw',
            fontSize: '100',
            height: this.state.windowHeight,
        }

        return (
            <Draggable
                axis="none"
                handle=".handle"
                defaultPosition={{ x: 0, y: 0 }}
                position={null}
                grid={[25, 25]}
                scale={1}
                onStart={this.onStartSwipe}
                onDrag={this.handleDrag}
                onStop={this.onFinishSwipe}>
                <div>
                    <div className="handle" style={style}>


                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                            style={{ minHeight: '100vh' }}
                        >
                            <Grid item xs={12}>
                                <div>
                                    <div style={{
                                        textAlign: 'center', marginTop: -70
                                    }}>
                                        <h1 style={{
                                            color: '#fff',
                                            fontSize: Math.min(this.state.windowHeight * 0.45, this.state.windowWidth * 0.45),
                                            userSelect: 'none', margin: 0, marginBottom: '0', padding: 0
                                        }}>{this.props.scoreData.score}</h1>
                                        <h2 style={{
                                            color: '#fff',
                                            fontSize: Math.min(this.state.windowHeight * 0.1, this.state.windowWidth * 0.2),
                                            userSelect: 'none', margin: 0
                                        }}>{this.props.scoreData.set}</h2>
                                    </div>
                                    <hr size="8" style={{ border: 0, width: Math.min(this.state.windowHeight * 0.5, this.state.windowWidth * 0.45) }} color={this.props.serveIndicate ? '#ff2477' : 'transparent'} />
                                </div>
                            </Grid>
                        </Grid>

                    </div>
                </div>
            </Draggable>

        )
    }
}

export default Counter
