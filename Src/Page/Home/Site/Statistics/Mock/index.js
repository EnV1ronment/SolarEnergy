export const energyStatisticsMockData = {
    xData: structureXData(),
    yData: [
        [1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2],
        [4, 5, 6, 4, 5, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2],
        [7, 8, 9, 10, 5, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2],
        // [7, 8, 9, 3, 4, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2],
    ],
    lineChartOption: {
        series: [
            {
                type: 'bar',
                name: 'Generation',
                unit: '%',
                color: '#00a6ff', // 可选，默认是主题色蓝色
                step: 'start',// 可选，如果想要阶梯状的折线图就传这个属性
            },
            {
                type: 'bar',
                name: 'Consumption',
                unit: '%',
                color: '#f59a23', // 可选，默认是主题色蓝色
                step: 'start',// 可选，如果想要阶梯状的折线图就传这个属性
            },
            {
                type: 'bar',
                name: 'Feed-in',
                unit: '%',
                color: '#d9001b', // 可选，默认是主题色蓝色
                step: 'start',// 可选，如果想要阶梯状的折线图就传这个属性
            },
            // {
            //     type: 'bar',
            //     name: 'Battery',
            //     unit: '%',
            //     color: '#70b603', // 可选，默认是主题色蓝色
            //
            //     step: 'start',// 可选，如果想要阶梯状的折线图就传这个属性
            // },
        ],
    },
};

export const electricityFeeMockData = {
    xData: structureXData(),
    yData: [
        [1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2],
        [4, 5, 6, 4, 5, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2],
    ],
    backgroundColor: Colors.theme,
    lineChartOption: {
        series: [
            {
                type: 'bar',
                name: 'Electricity Fee',
                unit: '%',
                color: '#00a6ff',
            },
            {
                type: 'bar',
                name: 'Profit',
                unit: '%',
                color: '#70b603',
            },
        ],
    },
};

function structureXData() {
    const data = [];
    for (let i = 1; i <= 30; i++) {
        const str = `0${i}`;
        const a = str.substr(str.length - 2);
        data.push(`2020-01-${a}`);
    }
    return data;
}