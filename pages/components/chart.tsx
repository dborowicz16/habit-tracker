import React from "react";
import ReactEcharts from "echarts-for-react";

const Chart = ({ selectedHabit }: { selectedHabit: any }) => {
    console.log('data is', selectedHabit);
    const option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            show: false
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                type: 'gauge',
                startAngle: 90,
                endAngle: -270,
                pointer: {
                    show: false
                },
                progress: {
                    show: true,
                    overlap: false,
                    roundCap: true,
                    clip: false,
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: '#418756'
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 40,
                        color: [
                            [1, '#d3d3d3']    // Background color for the remaining part
                        ],
                    }
                },
                splitLine: {
                    show: false,
                    distance: 0,
                    length: 10
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false,
                    distance: 50
                },
                data: [1],
                title: {
                    fontSize: 14
                },
                detail: {
                    width: 50,
                    height: 14,
                    fontSize: 14,
                    color: 'inherit',
                    borderColor: 'inherit',
                    borderRadius: 20,
                    borderWidth: 1,
                    formatter: `${selectedHabit.currentValue} ${selectedHabit.goalValue}`
                }
            }
        ]
    };
    return <ReactEcharts option={option} />;
}
export default Chart;