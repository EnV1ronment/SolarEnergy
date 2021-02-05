import React, {Component} from 'react';
import {
    View,
    ART
} from 'react-native';

export class HcdWaveView extends Component {
    static defaultProps = {
        powerPercent: 50, //0-100
        proportion: 0.5,//0-1
        surfaceWidth: 300,
        surfaceHeigth: 300,
        backgroundColor: '#FF7800',
        stroke: 'white',
        fill: 'white',
        strokeWidth: 2,
        superViewBackgroundColor: "blue",
        type: 'dc' //ac:交流 dc:直流
    }

    constructor(props) {
        super(props);
        this.proportion = this.props.proportion;//Arc control
        this.surfaceWidth = this.props.surfaceWidth;
        this.surfaceHeigth = this.props.surfaceHeigth;
        this.radius = this.surfaceWidth / 2.0;
        this.state = {
            a: 1.5,
            b: 0,
            increase: false,
            flashCount: 0
        };
    }

    componentDidMount() {
        this.intervalTimer = setInterval(() => {
            let a = this.state.a;
            let b = this.state.b;
            let increase = this.state.increase;
            if (increase) {
                a += 0.01;
                a -= 0.01
            }
            if (a <= 1) {
                increase = true
            }
            if (a >= 1.5) {
                increase = false
            }
            b += 0.1;
            this.setState({
                a: a,
                b: b,
                increase: increase
            })
        }, 20)
    }

    componentWillUnmount() {
        this.intervalTimer && clearTimeout(this.intervalTimer)
    }

    artView() {
        return <View style={{backgroundColor: 'rgba(0,0,0.0)'}}>
            <ART.Surface width={this.surfaceWidth} height={this.surfaceHeigth}>
                {this.artDrawBg(30, "rgb(0,166,255)")}
                {this.artDrawBg(39, "rgb(8,22,67)")}
                {this.artDrawWave()}
            </ART.Surface>
        </View>
    }

// 画背景
    artDrawBg(diff, color) {
        const radius = this.props.surfaceWidth / 2 - diff;
        const linePath = new ART.Path()
            .moveTo(radius + diff, diff)
            .arc(0, radius * 2, radius)
            .arc(0, -radius * 2, radius)
            .close();
        return (
            <ART.Shape d={linePath} strokeWidth={0} fill={color}/>
        )
    }

    artDrawWave() {
        let powerPercent = parseInt(this.props.powerPercent);
        const radius = this.props.surfaceWidth / 2 - 40;
        if (powerPercent <= 100) {
            const centerX = this.props.surfaceWidth / 2;
            const centerY = this.props.surfaceHeigth / 2;
            const a = this.state.a;
            const b = this.state.b;
            const amplitude = 10;
            let currentLinePointY = radius * 2 + 60 - radius * 2 * (this.props.powerPercent / 100.0);
            let startX = 40;
            let endX = this.props.surfaceWidth - startX;
            let startPoint, endPoint;
            const linePath = new ART.Path();
            for (let x = startX; x <= endX; x++) {
                let y = a * Math.sin(x / 180 * Math.PI + 4 * b / Math.PI) * amplitude + currentLinePointY;
                if (y < centerY) {
                    let circleY = centerY - Math.sqrt(Math.pow(radius, 2) - Math.pow(centerX - x, 2));
                    if (y < circleY) {
                        y = circleY
                    }
                } else if (y > centerY) {
                    let circleY = centerY + Math.sqrt(Math.pow(radius, 2) - Math.pow(centerX - x, 2));
                    if (y > circleY) {
                        y = circleY
                    }
                }
                if (x == startX) {
                    linePath.moveTo(x, y);
                    startPoint = [x, y]
                } else if (x == endX) {
                    endPoint = [x, y]
                }
                linePath.lineTo(x, y)
            }
            linePath.moveTo(endPoint[0], endPoint[1]);
            linePath.arc(-2 * radius, 0, radius);
            linePath.close();
            return (
                <ART.Shape d={linePath} strokeWidth={0} fill={'rgb(1,151,233)'}/>
            )
        } else {
            const linePath = new ART.Path()
                .moveTo(radius + 40, 40)
                .arc(0, radius * 2, radius)
                .arc(0, -radius * 2, radius)
                .close();
            return (
                <ART.Shape d={linePath} strokeWidth={0} fill={'rgb(8,22,67)'}/>
            )
        }
    }

    typeView() {
        return this.artView()
    }

    render() {
        return (
            <View style={{
                width: this.props.surfaceWidth,
                height: this.props.surfaceHeigth,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.0)',
            }}>
                {this.typeView()}
            </View>
        )
    }
}