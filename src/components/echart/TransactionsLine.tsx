import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';

type TableRowData = {
    actual_price: string,
    address: string,
    amount: number,
    chain_id: number,
    chain_name: string,
    decimals: number,
    logo_url: string,
    name: string,
    rawAmount: number,
    symbol: string,
    block_timestamp: any,
    fees: any
}

function TransactionsLine({ data }: {data: TableRowData[]}) {
    console.log('TransactionsLine data', data)
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);
        let option: EChartOption = {
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
            }]
        };
        if (data && data.length > 0) {
            const dates = data.map((item: {block_timestamp: any}) => new Date(item.block_timestamp * 1000).toLocaleDateString());
            const fees = data.map(item => +item.fees); // 如果数据是wei, 这样可以转换成eth
            (option.xAxis as EChartOption.XAxis).data = dates;
            option.series![0].data = fees;

            setTimeout(() => {
                chartInstance.setOption(option);

            }, 500);
        } else {
            (option.xAxis as EChartOption.XAxis).data = ['No Data'];
            option.series![0].data = [0];
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
