import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';

type TableRowData = {
    legendData: any,
    actual_price: string,
    address: string,
    amount: number,
    chain_id: number,
    chain_name: string,
    decimals: number,
    logo_url: string,
    name: string,
    rawAmount: number,
    symbol: string
}

function TransactionsLine({ data }: {data: TableRowData[]}) {
    console.log('echarts', data)
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);
        chartInstance.showLoading('default', { text: 'loading...' });

        // 定义一个基础的option结构
        let option: EChartOption = {
            title: {
                text: "Assets Distribution",
                textStyle: {
                    fontSize: 20
                }
            },
            series: [
                {
                    name: 'Assets',
                    type: 'pie',
                    radius: '55%',
                    data: [],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                // data: [data.legendData]
                data: []
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params: any) {
                    // console.log('params', params)
                    return params.data.name + ': ' + params.value + ' (' + params.percent + '%)';
                }
            },
        };
        if (data && data.length > 0) {
            // const names = data.map(item => item.chain_name);
            // const amounts = data.map(item => item.amount);
            console.log(data)
            const pieData = data.map((token: {amount: any, actual_price: any, chain_name: any}, ) => ({
                value: parseFloat(token.amount) * parseFloat(token.actual_price),
                name: token.chain_name
            }));
            option.series![0].data = pieData;

            setTimeout(() => {
                chartInstance.setOption(option);
                chartInstance.hideLoading();
            }, 500);
        } else {
            option.series![0].data = [{ value: 0, name: 'No Data' }];
            // option.series[0].label = {
            //     show: true,
            //     position: 'top',
            //     formatter: 'No Data'
            // };
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
