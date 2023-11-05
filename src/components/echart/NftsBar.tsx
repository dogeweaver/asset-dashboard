import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

function NftsBar({ data }) {
    console.log('data', data)
    const chartRef = useRef(null);
    // const chart = echarts.init(chartRef.current);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);
        chartInstance.showLoading({ text: 'loading...' });
        let option = {
            title: {
                text: 'Ethereum Amounts by Chain',
                textStyle: {
                    fontSize: 20
                }
            },
            grid: {
                left: "160px",
                bottom: "8%",
                right: "0%",
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Amount',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: (params) => {
                            const colorList = ['#3B82F6', '#9333EA', '#F59E0B', '#EF4444', '#10B981'];
                            return colorList[params.dataIndex % colorList.length];
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: () => ''
                    }
                }
            ]
        };
        if (data && data.length > 0) {
            const names = data.map(item => item.chain_name);
            const amounts = data.map(item => item.amount);
            const prices = data.map(item => item.actual_price);
            option.xAxis.data = names;
            option.series[0].data = amounts.map((amount, index) => ({
                value: amount,
                itemStyle: {
                    color: option.series[0].itemStyle.color({ dataIndex: index })
                }
            }));
            option.series[0].label.formatter = (params) => {
                return prices[params.dataIndex]; // 使用闭包中的prices
            };


            setTimeout(() => {
                chartInstance.setOption(option);
                chartInstance.hideLoading();
            }, 500);
        } else {
            // 没有数据时的处理
            option.xAxis.data = ['No Data'];
            option.series[0].data = [{ value: 0 }];
            option.series[0].label.formatter = 'No Data';
            chartInstance.setOption(option);
            chartInstance.hideLoading();
        }
        chartInstance.setOption(option);

        // 清除加载动画
        // chartInstance.hideLoading();

        // 返回一个清理函数，在组件卸载时卸载图表实例
        return () => {
            chartInstance.dispose();
        };

    }, [data]);

    return (
        <div ref={chartRef} className="w-full h-96"></div>
    );
}

export default NftsBar;
