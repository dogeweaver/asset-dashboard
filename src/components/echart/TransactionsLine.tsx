import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

function TransactionsLine({ data }) {
    console.log('data', data)
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);
        chartInstance.showLoading({ text: 'loading...' });
        let option = {
            title: {
                text: "Transaction Fees Over Time",
                textStyle: {
                    fontSize: 20
                }
            },
            grid: {
                left: "50px",
                bottom: "8%",
                right: "0%",
            },
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'value'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            series: [{
                data: [],
                type: 'line',
                smooth: true,
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                }
            }]
        };
        if (data && data.length > 0) {
            const dates = data.map(item => new Date(item.block_timestamp * 1000).toLocaleDateString());
            const fees = data.map(item => +item.fee / 1e18); // 如果数据是wei, 这样可以转换成eth
            option.xAxis.data = dates;
            option.series[0].data = fees;

            setTimeout(() => {
                chartInstance.setOption(option);

                chartInstance.hideLoading();
            }, 500);
        } else {
            option.xAxis.data = ['No Data'];
            option.series[0].data = [0];
            option.series[0].label = { // 添加这个标签配置
                show: true,
                position: 'top',
                formatter: 'No Data'
            };
            chartInstance.hideLoading();
        }

        chartInstance.setOption(option);

        // 返回一个清理函数，在组件卸载时卸载图表实例
        return () => {
            chartInstance.dispose();
        };
    }, [data]);

    return (
        <div ref={chartRef} className="w-full h-96"></div>
    );
}

export default TransactionsLine;
