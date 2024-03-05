import React, { Component } from 'react'
import 'antd/dist/antd.css';
import { Modal, Button } from 'antd';
import './App.css'
class Square extends Component {
    render() {
        return (
            <div className="square"></div>
        )
    }
}
class Board extends Component {
    renderBoard() {
        let board = [];
        for (let i = 1; i <= 324; i++) {
            board.push(<Square key={'square' + i} />)
        };
        for (let i = 1; i <= 5; i++) {
            board.push(<div key={'board' + i} className={'dot dot' + i}></div>)
        }
        return board;
    }
    renderPre() {
        let presuppose = [];
        for (let i = 0; i < 19; i++) {
            let presupposeRow = [];
            for (let j = 0; j < 19; j++) {
                let status = this.props.square[i][j];
                let className = status === 1 ? 'black-pieces' : status === 2 ? 'white-pieces' : '';
                presupposeRow.push(<div key={'presuppose-item' + j} className={"presuppose-item " + className} onClick={this.props.onClick.bind(null, [i, j])}></div>)
            };
            presuppose.push(<div key={'presuppose' + i} className="presuppose-row">{presupposeRow}</div>)
        }
        return presuppose;
    }
    render() {
        return (
            <div className="board-box">
                <div className="board">
                    {this.renderBoard()}
                </div>
                <div className="presuppose">
                    {this.renderPre()}
                </div>
            </div>
        )
    }
}
class History extends Component {
    constructor() {
        super();
        this.state = {
            btns: [],
        }
    }
    renderHistory(stepExplain) {
        let btns = [];
        for (let i = 0; i < stepExplain.length; i++) {
            btns.push(
                <div key={'history' + i}>
                    <div className="step">{stepExplain[i].step}</div>
                    {stepExplain[i].explain?<div className="presuppose-item black-pieces presuppose-item-small"></div>:<div className="presuppose-item white-pieces presuppose-item-small"></div>}
                    <span>落子</span>
                    <div onClick={() => { this.props.onClick(i + 1) }} className="step-button">Go</div>
                </div>
            )
        }
        return btns;
    }
    render() {
        return (
            <div className="history">
                <header className="history-header">历史记录</header>
                <div className='history-content'>
                {this.renderHistory(this.props.stepExplain)}
                </div>
            </div>
        )
    }
}
export default class Game extends Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            text: "",
            history: [
                [[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
            ],
            blackIsNext: true,
            step: 0,
            stepExplain: [],
        }
    }
    handleClick([x, y]) {
        let { history, blackIsNext, step, stepExplain } = this.state;
        let lastEl = JSON.parse(JSON.stringify(history[step]));
        if (lastEl[x][y]) return;
        lastEl[x][y] = blackIsNext ? 1 : 2;

        stepExplain.splice(this.state.step, stepExplain.length);
        history.splice(this.state.step + 1, history.length)

        stepExplain.push({
            step:history.length,
            explain: blackIsNext,
        })
        history.push(lastEl);
        this.setState({
            history,
            blackIsNext: !blackIsNext,
            step: ++step,
            stepExplain
        });
        this.calculateWinner(lastEl, blackIsNext, [x, y]);
    }
    through(step) {
        let { blackIsNext } = this.state;
        step % 2 === 0 ? blackIsNext = true : blackIsNext = false;
        this.setState({
            step,
            blackIsNext
        });
    }
    calculateWinner(square, blackIsNext, [x, y]) {
        let player = blackIsNext ? 1 : 2;
        //横向
        let line1 = square[x].slice(y - 4 < 0 ? 0 : y - 4, y + 5);
        let line1Win = this.isLine(line1, player, 1)
        //纵向
        let line2 = square.slice(x - 4 < 0 ? 0 : x - 4, x + 5);
        let line2Win = this.isLine(line2.map(el => el[y]), player)
        //从右往左斜
        let line3Win = Boolean;
        {
            let before = square.slice(x - 4 < 0 ? 0 : x - 4, x + 1);
            let beforeLine = before.map((item, index) => {
                return item[y + before.length - (index + 1)]
            })
            let after = square.slice(x + 1, x + 5);

            let afterLine = after.map((item, index) => {
                return item[y - (index + 1)]
            })
            line3Win = this.isLine([...beforeLine, ...afterLine], player)
        }
        //从左往右斜
        let line4Win = Boolean;
        {
            let before = square.slice(x - 4 < 0 ? 0 : x - 4, x + 1);
            let beforeLine = before.map((item, index) => {
                return item[y - before.length + index + 1]
            })
            let after = square.slice(x + 1, x + 5);
            let afterLine = after.map((item, index) => {
                return item[y + index + 1]
            })
            line4Win = this.isLine([...beforeLine, ...afterLine], player)
        }
        if (line1Win || line2Win || line3Win || line4Win) {
            this.setState({
                visible: true,
                text: blackIsNext ? '黑子获胜' : '白子获胜'
            })
        }
    }
    isLine(arr, player, b) {
        arr.forEach((item, index) => {
            if (!item) {
                arr[index] = 'null'
            }
        });
        return arr.join().replace(/,/g, '').includes(String(player).repeat(5));
    }
    reset() {
        this.setState({
            history: [
                [[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
            ],
            visible: false,
            text: "",
            blackIsNext: true,
            step: 0,
            stepExplain: [],
        })
    }
    render() {
        let { history, step, blackIsNext, stepExplain } = this.state;
        return (
            <div className="game">
                <Modal onCancel={() => this.reset()} footer={[<Button key='reset' type="primary" onClick={() => this.reset()}>再来一次</Button>]} okText="再来一次" title="提示" visible={this.state.visible}>{this.state.text}</Modal>
                <Board className="board" square={history[step]} onClick={xy => this.handleClick(xy)} />
                <History stepExplain={stepExplain} className="history" blackIsNext={blackIsNext} history={history.length} onClick={i => this.through(i)} />
            </div>
        )
    }
}

