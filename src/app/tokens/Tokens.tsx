'use client'

import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import Skeleton from "@/components/skeleton/Skeleton";
import TokensBar from "@/components/echart/TokensBar";
import Wagmiagmi from "@/components/wagmi/Wagmi";
import TokensPie from "@/components/echart/TokensPie";

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const Tokens = () => {

    const key = '00aa01cefaf84f8fcd088395142c108a2c4aadbc'
    const [localSearchValue, setLocalSearchValue] = useState('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    const [table, setTable] = useState([])
    const [data, setData] = useState('')
    const [loading, setLoading] = useState(true)

    // header搜索
    const handleSearch = (searchValue: any) => {
        console.log('token页面的 handleSearch', searchValue)
        setLocalSearchValue(searchValue);
        AllTokensMetadata(searchValue);
    }

    // 数据请求
    const AllTokensMetadata = async (searchValue: any) => {
        // setTable([])
        // setLoading(true)
        try {
            const response = await fetch('https://datalayer.decommas.net/datalayer/api/v1/coins/' + searchValue + '?api-key=' + key);
            const res = await response.json();
            if (res.result.length) {
                const updatedResults = res.result.map((item: any) => {
                    let amount_bg = BigNumber(item.amount);
                    let decimals_bg = BigNumber(Math.pow(10, item.decimals));
                    let rawAmount = Number(amount_bg.div(decimals_bg));
                    item.amount = rawAmount * item.actual_price;
                    item.rawAmount = rawAmount;
                    item.actual_price = formatNumber(Number(item.actual_price));
                    item.chain_name = capitalizeFirstLetter(item.chain_name);
                    return item
                })
                setTable(updatedResults)
            } else {
                setTable([])
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(`querySignatureFromOwn ${error}`);
        }
    }

    // 格式化数字
    const formatNumber = (number: number): string  => {
        return number.toLocaleString('en-US', { useGrouping: true, minimumFractionDigits: 0 });
    }

    useEffect(() => {
        console.log('token 页面的 useEffect')
        console.log('data', localSearchValue)
        // AllTokensMetadata(localSearchValue);
    }, []);

    return (
        <main>
            <Wagmiagmi onSearch={handleSearch} />
            <div className="flex-col lg:flex lg:flex-row">
                <div className="lg:w-1/2 w-full h-96 relative">
                    {!loading ?
                        <TokensPie data={table}></TokensPie> :
                        <div className="flex justify-center items-center h-full">
                            <div className="flex">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                                <div className="text-sm ml-2">loading...</div>
                            </div>
                        </div>
                    }
                </div>
                <div className="lg:w-1/2 w-full h-96 relative">
                    {!loading ?
                        <TokensBar data={table}></TokensBar> :
                        <div className="flex justify-center items-center h-full">
                            <div className="flex">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                                <div className="text-sm ml-2">loading...</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col" className="text-left pr-5">
                                    #
                                </th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    Chain
                                </th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    Token
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Price
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Amount
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {table.map((item: {chain_id: any, chain_name: string, logo_url: any, symbol: any, actual_price: any, amount: any, rawAmount: number}, index) => (
                                <tr key={item.chain_id}>
                                    <td>{index + 1}</td>
                                    <td className="py-5 pl-4 pr-3 sm:pl-0">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <img className="h-8 w-8 rounded-full" src={item.logo_url} alt="" />
                                            </div>
                                            <div className="ml-2">
                                                <div className="font-medium text-gray-900">{item.chain_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{item.symbol}</td>
                                    <td>${item.actual_price}</td>
                                    <td>{item.rawAmount}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {loading && <Skeleton></Skeleton>}
                        {table.length}
                        {!loading && table.length === 0 && (
                            <div className="flex justify-center items-center text-center h-96 text-gray-600">
                                No data
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Tokens;
