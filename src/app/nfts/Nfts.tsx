'use client'

import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import Wagmiagmi from "@/components/wagmi/Wagmi";
import Skeleton from "@/components/skeleton/Skeleton";

const Nfts = () => {

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
        try {
            const response: Response = await fetch('https://datalayer.decommas.net/datalayer/api/v1/nfts/' + searchValue + '?api-key=' + key);
            const res = await response.json();
            console.log('res', res);
            setBarData(res.result)
            if (res.result.length) {
                setTable(res.result);
                for (let i = 0; i < res.result.length; i++) {
                    // console.log(11111, searchValue)
                    // if (reload) return; // 如果重新请求接口
                    const item = res.result[i];
                    console.log(item.amount);
                    const data = await NFTMetadata(item.chain_name, item.contract_address, item.token_id);
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
        } catch (error) {
            setLoading(false)
            console.log(`querySignatureFromOwn ${error}`);
        }
    }

    const NFTMetadata = async (chain_name: any, contract_address: any, token_id: any) => {
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
        // NFTs(localSearchValue);
    }, []);

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
                        {!barData.length && <Skeleton></Skeleton>}
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

export default Nfts;
