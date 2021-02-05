/*************** echart styles configurations for SiteStatisticsPage.js ***************/

export const yAxisSplitLine = {
    show: true,            // 是否显示y轴所有刻度对应的分割线（平行于x轴）
    lineStyle: {
        color: '#15234f',   // y轴所有刻度对应的分割线的颜色
    },
};

export const tooltipStyles = {
    textStyle: {
        color: '#0273f2', // 字体颜色
        fontSize: 12,     // 字体大小
    },
    backgroundColor: Colors.theme,
    borderWidth: 0.5,
    axisPointer: {
        lineStyle: {
            color: '#CECECE', // 点击tooltip时的竖直线的颜色
            width: 0.5,        // 竖线宽度
        },
    },
};