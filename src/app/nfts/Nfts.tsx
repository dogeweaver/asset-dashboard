'use client'

import React, { useState, useEffect, useRef } from 'react';
import BigNumber from 'bignumber.js';
import Wagmiagmi from "@/components/wagmi/Wagmi";
import Skeleton from "@/components/skeleton/Skeleton";

const Nfts = () => {

    const abortControllerRef = useRef(new AbortController());

    interface TableItem {
        image_url: string;
        collection_name: string;
        name: string;
        contract_address: string;
        amount: number;
        // ... 其他属性
    }

    const key = '00aa01cefaf84f8fcd088395142c108a2c4aadbc'
    // const [searchValue, setSearchValue] = useState('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    const [localSearchValue, setLocalSearchValue] = useState('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    const [table, setTable] = useState<TableItem[]>([]);
    const [barData, setBarData] = useState([])
    const [loading, setLoading] = useState(true)
    const [reload, setReload] = useState(false)

    const handleSearch = (searchValue: any) => {
        console.log('searchValue', searchValue)
        // 取消之前的请求
        abortControllerRef.current.abort();
        // 创建一个新的 abort controller 为下一个请求做准备
        abortControllerRef.current = new AbortController();
        // 设置新的本地搜索值并触发新的请求
        setLocalSearchValue(searchValue);
        NFTs(searchValue);
        setReload(true)
    }
    const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

    const delayedNFTMetadata = async (chain_name: any, contract_address: any, token_id: any, delayMs: any) => {
        await delay(delayMs);
        return NFTMetadata(chain_name, contract_address, token_id);
    };


    // coins NFTS
    const NFTs = async (searchValue: any) => {
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;
        try {
            const response: Response = await fetch(
                'https://datalayer.decommas.net/datalayer/api/v1/nfts/' + searchValue + '?api-key=' + key,
                { signal }
            );
            const res = await response.json();
            console.log('res', res);
            setBarData(res.result);
            setTable(res.result)
            if (res.result.length) {
                for (let i = 0; i < res.result.length; i++) {
                    if (signal.aborted) {
                        // 如果请求已被取消，则退出循环
                        console.log('Request has been cancelled, exiting loop');
                        setLoading(false)
                        return;
                    }
                    const item = res.result[i];
                    const data = await NFTMetadata(item.chain_name, item.contract_address, item.token_id, { signal });
                    console.log(data);
                    item.image_url = data.image_url;
                    item.collection_name = data.collection_name;
                    item.name = data.name;
                    console.log(item);
                    // 使用函数式更新来更新表格中的一条信息
                    const updatedTable = [...table];
                    setTable(prevTable => {
                        // 创建一个新的数组，包含之前的所有项和新更新的项
                        const updatedTable = [...prevTable];
                        // 使用新的数据项替换旧的数据项
                        updatedTable[i] = item;
                        return updatedTable;
                    });
                    // 如果不是最后一个元素，等待500ms
                    if (i !== res.result.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
                setReload(false)
            } else {
                setReload(false)
                setLoading(false)
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Request has been cancelled');
            } else {
                // 处理其他类型的错误
                console.log(`querySignatureFromOwn ${error}`);
            }
            setTimeout(() => {
                setLoading(false)
            }, 1000)
            console.log(`querySignatureFromOwn ${error}`);
        }
    }

    const NFTMetadata = async (chain_name: any, contract_address: any, token_id: any, signal: any) => {
        try {
            const response: Response = await fetch('https://datalayer.decommas.net/datalayer/api/v1/nft_metadata/' + chain_name + '/' + contract_address + '/' + token_id + '/?api-key=' + key);
            const res = await response.json();
            console.log('NFTMetadata', res.result);
            return res.result;
        } catch (error) {
            console.log(`querySignatureFromOwn ${error}`);
        }
    }

    // 格式化数字
    const formatNumber = (number: number): string  => {
        return number.toLocaleString('en-US', { useGrouping: true, minimumFractionDigits: 0 });
    }

    useEffect(() => {
        // 当组件卸载时，这个函数会被调用
        return () => {
            // 取消所有挂起的请求
            abortControllerRef.current.abort();
        };
    }, []); // 空依赖数组表示这个effect只在组件挂载和卸载时运行

    return (
        <main>
            <Wagmiagmi onSearch={handleSearch} />
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col" className="text-left pr-10">
                                    #
                                </th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    NFT
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Collection
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Contract
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Amount
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {table.map((item: {image_url: any, collection_name: any, name: any, contract_address: any, amount: any}, index: number) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div className="flex items-center">
                                            <div className="h-11 w-11 flex-shrink-0">
                                                <img className="h-11 w-11 rounded-full" src={item.image_url} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-medium text-gray-900">{item.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 pl-4 pr-3 sm:pl-0">
                                        <div className="font-medium text-gray-900">{item.collection_name}</div>
                                    </td>
                                    <td className="text-xs text-blue-700 hover:underline"><a href={'https://etherscan.io/address/' + item.contract_address} target="_blank">{item.contract_address}</a></td>
                                    <td>{item.amount}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {!barData.length && loading && <Skeleton></Skeleton>}
                        {!loading && !barData.length && (
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

export default Nfts;
