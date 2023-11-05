'use client'

import React, { useState, useEffect } from 'react';
import TransactionsModal from '../../components/transactipnsModal/TransactionsModal'
import Header from "@/components/header/Header";
import Skeleton from "@/components/skeleton/Skeleton";
import TransactionsLine from "@/components/echart/TransactionsLine";
import Wagmiagmi from "@/components/wagmi/Wagmi";

const Transactions = () => {

    const key = '00aa01cefaf84f8fcd088395142c108a2c4aadbc'
    const [searchValue, setSearchValue] = useState('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    const [localSearchValue, setLocalSearchValue] = useState('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    const [table, setTable] = useState([])
    const [chainName, setChainName] = useState()
    const [txHash, setTxHash] = useState()
    const [visible, setVisible] = useState(true)
    const [loading, setLoading] = useState(false)

    const handleSearch = (searchValue) => {
        console.log('searchValue', searchValue)
        setLocalSearchValue(searchValue);
        fetchTransactions(searchValue);
    }

    const fetchTransactions = async (searchValue) => {
        console.log('fetchTransactions')
        setTable([])
        setLoading(true)
        try {
            const response = await fetch('https://datalayer.decommas.net/datalayer/api/v1/transactions/' + searchValue + '?api-key=' + key);
            const res = await response.json();
            console.log('res', res)
            if (res.result.length) {
                const updatedResults = res.result.map((item: any) => {
                    item.block_timestamp_t = new Date(item.block_timestamp * 1000).toLocaleDateString()
                    item.fees = +item.fee / 1e18
                    item.value = formatNumber(Number(item.value))
                    return item
                })
                setTable(updatedResults)
                setLoading(false)
            } else {
                setLoading(false)
                setTable([])
            }
        } catch (error) {
            setLoading(false)
            console.log(`querySignatureFromOwn ${error}`);
        }
    }

    // 格式化数字
    const formatNumber = (number: number): string  => {
        return number.toLocaleString('en-US', { useGrouping: true, minimumFractionDigits: 0 });
    }

    const openModal = (item: any) => {
        setChainName(item.chain_name)
        setTxHash(item.hash)
        setVisible(false)
    }

    useEffect(() => {
        console.log('useeffect')
        // fetchTransactions(searchValue);
    }, []);

    return (
        <main>
            {/*<Header onSearch={handleSearch} />*/}
            <Wagmiagmi onSearch={handleSearch} />
            <TransactionsLine data={table}></TransactionsLine>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col" className="text-left pr-10">#</th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Date</th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Hash</th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Block</th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">From</th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">To</th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">fee</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {table.map((item: {block_timestamp_t: any, block_number: any, from_address: any, to_address: any, value: any, hash: any}, index) => (
                                <tr key={item.block_number}>
                                    <td>{index + 1}</td>
                                    <td className="py-4 pr-2 cursor-pointer hover:text-blue-700" onClick={() => {openModal(item)}}><div className="w-40">{item.block_timestamp_t}</div></td>
                                    <td className="hover:text-blue-700 hover:underline"><a href={'https://etherscan.io/tx/' + item.hash} target="_blank" className="mr-4 text-xs">{(item.hash).substring(0, 10) + '...'}</a></td>
                                    <td>
                                        <a href={'https://etherscan.io/block/' + item.block_number} target="_blank" className="inline-flex items-center rounded-md bg-green-50 mr-2 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            {item.block_number}
                                        </a>
                                    </td>
                                    <td className="text-xs text-blue-700 hover:underline"><a href={'https://etherscan.io/address/' + item.from_address} target="_blank">{item.from_address}</a></td>
                                    <td className="pr-2 text-xs hover:text-blue-700 hover:underline"><a href={'https://etherscan.io/address/' + item.to_address} target="_blank">{item.to_address}</a></td>
                                    <td>${item.fees}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {loading ? <Skeleton></Skeleton> : ''}
                    </div>
                </div>
            </div>
            {visible ?
                <div></div> :
                <TransactionsModal
                    chainName = {chainName} txHash= {txHash}
                    onClose={() => setVisible(true)} ></TransactionsModal>}
        </main>
    );
};

export default Transactions;
