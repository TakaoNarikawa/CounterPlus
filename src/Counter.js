import React, { Component } from 'react'
import Draggable from 'react-draggable';
import { Grid } from '@material-ui/core'

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
            console.log(leftServes_)
        }
    }

    eventLogger = (e, data) => {
        console.log('Event: ', e);
        console.log('Data: ', data);
    };

    render() {

        var scoreViews = (!this.state.posReversed ? [true, false] : [false, true]).map((isP1) => {
            return (
                <ScoreView
                    scoreData={isP1 ? this.state.p1 : this.state.p2}
                    onPositiveSwipe={() => {
                        this.manager.addScore(isP1);
                    }}
                    onNegativeSwipe={() => {
                        this.manager.minusScore(isP1);
                    }
                    }
                    serveIndicate={isP1 ? this.state.leftServes : !this.state.leftServes}
                />
            )
        })

        return (
            <div style={{ display: 'flex', flexDirection: 'col', alignItems: 'center', justifyContent: 'center' }}>
                {scoreViews}
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
        this.setState({ windowHeight: window.innerHeight, windowWidth: window.innerWidth })
    }

    onStartSwipe = (e, data) => {
        this.offset = data.y
    };

    onFinishSwipe = (e, data) => {
        let deltaY = data.y - this.offset;
        let height = window.innerHeight;
        let rate = deltaY / height;

        if (rate > 0.3) {
            this.props.onPositiveSwipe();
        } else if (rate < -0.3) {
            this.props.onNegativeSwipe();
        }
    };

    render() {

        // スワイプ量に合わせて、要素の位置を変更する.
        let style = {
            width: '50vw',
            fontSize: '100',
            height: '100vh',
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
                                            fontSize: Math.min(this.state.windowHeight * 0.5, this.state.windowWidth * 0.45),
                                            userSelect: 'none', margin: 0, marginBottom: '0', padding: 0
                                        }}>{this.props.scoreData.score}</h1>
                                        <h2 style={{
                                            color: '#fff',
                                            fontSize: Math.min(this.state.windowHeight * 0.2, this.state.windowWidth * 0.2),
                                            userSelect: 'none', margin: 0
                                        }}>{this.props.scoreData.set}</h2>
                                    </div>
                                    <hr size="8" style={{ border: 0 }} color={this.props.serveIndicate ? '#ff2477' : 'transparent'} />
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
