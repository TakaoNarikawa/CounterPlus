import React, { Component } from 'react'
import Hammer from 'react-hammerjs'   // Hammer.jsを使えるように読み込みます.

// スワイプで開いたときの距離.
const SWIPED_DISTANCE = 150

class Cell extends Component {

  constructor() {
    super(...arguments)
    
    this.state = {
      // スワイプされた状態の場合にtrue.
      opened : false,
      // 指で動かしている時の移動距離.
      deltaY : 0
    }
  }

  // スワイプの開始位置を計算して返します.
  // open状態であれば-150pxがスタート地点、それ以外は0px.
  getFirstPosition() {
    return this.state.opened ? -1 * SWIPED_DISTANCE : 0
  }

  // 指でのドラッグが始まった時.
  onPanStart(e) {
    // 最初のCellの位置を設定します.
    this.setState({
      deltaY : this.getFirstPosition()
    })
    console.log("onPanStart");
  }

  // 指でドラッグしている.
  onPan(e) {
    // 指で動かした分だけ、移動距離を変化させます.
    this.setState({
      deltaY : this.getFirstPosition() + e.deltaY
    })
  }

  // ドラッグ終了
  onPanEnd(e) {
    // 移動量に応じて、openedの状態を変更します.

    // スワイプ前は開いていた場合
    if (this.state.opened) {
      // 75px（150pxの半分）の動きがあれば、閉じる.
      if (e.deltaY >= SWIPED_DISTANCE / 2) {
        this.setState({
          opened : false,
          deltaY : 0
        })
      // スワイプ量が少なければ、opened状態はそのまま.
      } else {
        this.setState({
          deltaY : this.getFirstPosition()
        })
      }
    
    // スワイプ前は閉じていた場合
    } else {
      // 75px（150pxの半分）の動きがあれば、開く.
      if (e.deltaY <= -1 * SWIPED_DISTANCE / 2) {
        this.setState({
          opened : true,
          deltaY : -1 * SWIPED_DISTANCE
        })       

      // スワイプ量が少なければ、opened状態はそのまま. 
      } else {
        this.setState({
          deltaY : 0
        })
      }
    }
  }

  render() {

    // スワイプ量に合わせて、要素の位置を変更する.
    let style = {
      transform : `translate(${this.state.deltaY}px, 0)`,
      backgroundColor:'red', 
      height:'100vh'
    }

    // <Hammer>タグでスワイプのアクションを捕捉する.
    // onPanStart、onPan、onPanEnd、それぞれのイベントを扱います.
    // また、「style={style}」で移動距離を設定します.
    return (
      <Hammer
        onPanStart={this.onPanStart.bind(this)} 
        onPan={this.onPan.bind(this)} 
        onPanEnd={this.onPanEnd.bind(this)}>
          <div className="cell" style={style}>cell{this.props.num} </div>
      </Hammer>
    )
  }
}

export default Cell