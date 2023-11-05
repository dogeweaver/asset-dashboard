import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

function TokensBar({ data }) {
    console.log('echarts', data)
    const chartRef = useRef(null);


    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);
        chartInstance.showLoading({ text: 'loading...' });
        // 定义一个基础的option结构
        let option = {
            title: {
                text: "TOKENS",
                textStyle: {
                    fontSize: 20
                }
            },
            grid: {
                // left: "100px",
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
            series: [{
                data: [],
                type: 'bar'
            }],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
        };
        if (data && data.length > 0) {
            const names = data.map(item => item.chain_name);
            const amounts = data.map(item => item.amount);
            option.xAxis.data = names;
            option.series[0].data = amounts;

            setTimeout(() => {
                chartInstance.setOption(option);
                chartInstance.hideLoading();
            }, 500);
        } else {
            option.xAxis.data = ['No Data']; // 可以设为空数组，如果你不希望显示类目轴
            option.series[0].data = [0];
            option.series[0].label = {
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

export default TokensBar;
