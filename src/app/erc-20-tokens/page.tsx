'use client'

import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import Skeleton from "@/components/skeleton/Skeleton";
import TokensBar from "@/components/echart/TokensBar";
import Wagmiagmi from "@/components/wagmi/Wagmi";

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

const ERC20Tokens = () => {

    const key = '00aa01cefaf84f8fcd088395142c108a2c4aadbc'
    const [localSearchValue, setLocalSearchValue] = useState('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    const [table, setTable] = useState<TableRowData[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = (searchValue: any) => {
        console.log('searchValue', searchValue)
        setLocalSearchValue(searchValue);
        ERC20Tokens(searchValue);
    }

    const ERC20Tokens = async (searchValue: any) => {
        setTable([])
        setLoading(true)
        try {
            const response = await fetch('https://datalayer.decommas.net/datalayer/api/v1/tokens/' + searchValue + '?api-key=' + key);
            const res = await response.json();
            // console.log('res', res.result)
            if (res.result.length) {
                const updatedResults: TableRowData[] = res.result.map((item: any) => {
                    let amount_bg = BigNumber(item.amount);
                    let decimals_bg = BigNumber(Math.pow(10, item.decimals));
                    let rawAmount = Number(amount_bg.div(decimals_bg));

                    item.amount = rawAmount * item.actual_price;
                    item.rawAmount = rawAmount;
                    item.actual_price = formatNumber(Number(item.actual_price))
                    return item
                })

                console.log('updatedResults: ', updatedResults);
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
        console.log('useEffect')
        // ERC20Tokens(localSearchValue);
    }, []);

    return (
        <main>
            {/*<Header onSearch={handleSearch} />*/}
            <Wagmiagmi onSearch={handleSearch} />
            <TokensBar data={table}></TokensBar>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col" className="text-left">
                                    #
                                </th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    Token
                                </th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    Contract
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
                            {table.map((item: {chain_id: any, logo_url: any, symbol: any, actual_price: any, amount: any, address: any, rawAmount: number}, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="py-5 pl-4 pr-3 sm:pl-0">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <img className="h-8 w-8 rounded-full" src={item.logo_url} alt="" />
                                            </div>
                                            <div className="ml-2">
                                                <div className="font-medium text-gray-900">{item.symbol}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-xs text-blue-700 hover:underline"><a href={'https://etherscan.io/address/' + item.address} target="_blank">{item.address}</a></td>
                                    <td>${item.actual_price}</td>
                                    <td>{item.rawAmount}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {loading ? <Skeleton></Skeleton> : ''}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ERC20Tokens;
