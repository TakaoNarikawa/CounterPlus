import React, { Component } from 'react'
import { render } from 'react-dom'
import { makeStyles } from '@material-ui/core/styles';
import Draggable from 'react-draggable';

const SWIPED_DISTANCE = 150

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
            }
        }
    }

    eventLogger = (e, data) => {
        console.log('Event: ', e);
        console.log('Data: ', data);
    };

    render() {

        return (
            <div style={{ display: 'flex', flexDirection: 'col', alignItems: 'center', justifyContent: 'center' }}>
                <ScoreView
                    scoreData={this.state.p1}
                    onPositiveSwipe={() => {
                        console.log("positive swipe")
                    }}
                    onNegativeSwipe={() => {
                        console.log("negative swipe")
                    }
                    }
                    bgColor='red'
                />
                <ScoreView
                    scoreData={this.state.p2}
                    onPositiveSwipe={() => {
                        console.log("positive swipe")
                    }}
                    onNegativeSwipe={() => {
                        console.log("negative swipe")
                    }
                    }
                    bgColor='blue'
                />
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
            height: '100vh',
            fontSize: '100',
            backgroundColor: this.props.bgColor
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
                        <div>
                            <div style={{
                                textAlign: 'center',
                            }}>
                                <h1 style={{ margin: 0, marginBottom: '0', padding: 0, fontSize: Math.min(this.state.windowHeight * 0.5, this.state.windowWidth * 0.7), backgroundColor: 'green' }}>{this.props.scoreData.score}</h1>
                                <h2 style={{ margin: 0, fontSize: Math.min(this.state.windowHeight * 0.2, this.state.windowWidth * 0.2), height: this.state.windowHeight * 0.2 }}>{this.props.scoreData.score}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>

        )
    }
}

export default Counter