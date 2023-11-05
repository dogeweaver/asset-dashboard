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
    symbol: string
}

function TokensBar({ data }: {data: TableRowData[]}) {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);
        // 定义一个基础的option结构
        let option: EChartOption = {
            title: {
                text: "Value In USD",
                textStyle: {
                    fontSize: 20
                }
            },
            grid: {
                // left: "100px",
                bottom: "20%",
                right: "0%",
            },
            xAxis: {
                type: 'category',
                data: [],
                axisLabel: {
                    rotate: -45, // 设置横坐标标签倾斜 45 度
                }
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
            const names = data.map((item: {name: string}) => item.name);
            const amounts = data.map((item: {amount: number}) => item.amount);
            (option.xAxis as EChartOption.XAxis).data = names;
            option.series![0].data = amounts;

            setTimeout(() => {
                chartInstance.setOption(option);
            }, 500);
        } else {
            (option.xAxis as EChartOption.XAxis).data = ['No Data']; // 可以设为空数组，如果你不希望显示类目轴
            option.series![0].data = [0];
            (option.series![0] as echarts.EChartOption.SeriesBar).label = {
                show: true,
                position: 'top',
                formatter: 'No Data'
            };
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
