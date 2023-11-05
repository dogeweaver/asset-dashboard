'use client'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import React, {useState, useEffect, ChangeEvent} from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useRouter } from 'next/navigation';

const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, base, zora],
    [
        publicProvider()
    ]
);
import { configureChains } from 'wagmi';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

interface HeaderProps {
    onSearch: (searchValue: string) => void;
    onchangeQuery: (query: string) => void;
}

export default function Header({ onSearch, onchangeQuery }: HeaderProps) {

    const router = useRouter()
    // const query = location.search.substring(1);

    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    const key = '00aa01cefaf84f8fcd088395142c108a2c4aadbc'
    const [query, setQuery] = useState('');
    const [inputValue, setInputValue] = useState(query ? query : '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
    // const [inputValue, setInputValue] = useState('');
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);

    // input 框改变 存值
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log("handleInputChange: ", event);
        setInputValue(event.target.value);
    }

    // 搜索
    const handleSearch = () => {
        console.log(inputValue, inputValue.length)
        if (inputValue.length !== 42) {
            return
        }
        router.push('?' + inputValue);
        onSearch(inputValue);
    }

    // 连接
    const onConnect = () => {
        console.log('连接')
        connect()
        setConnecting(true)
    }

    // 断开连接
    const onDisconnect = () => {
        console.log('断开连接')
        disconnect()
        setDisconnecting(true)
    }

    // 页面一载入就执行
    useEffect(() => {
        console.log('window.location', window.location)
        const query = window.location.search.substring(1);
        console.log('window.location.search.substring(1);', query)
        // setInputValue(query ? query : '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
        // 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045

        console.log('header 页面一载入就执行')
        console.log('query', query)
        console.log('address', address)
        console.log('inputValue', inputValue)

        if(connecting) { // 刚刚点击连接钱包
            console.log('刚刚点击连接钱包')
            router.push('?' + address);
            onSearch(address as string);
            setInputValue(address as string);
            setConnecting(false)
            return
        }

        // if (!inputValue) {
        //     router.push('?' + address);
        //     onSearch(address);
        //     setInputValue('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
        //     console.log('inputvalue', inputValue)
        // }

        if (!address && !query) {
            router.push('?' + inputValue);
            onSearch(inputValue);
            setInputValue(inputValue);
        }

        if (query && !disconnecting) { // 有搜索参数且不是刚刚点击断开连接
            console.log('有 query', query)
            router.push('?' + query);
            onSearch(query);
        }

        setDisconnecting(false)

    }, [address, isConnected]);


    return (
        <div className="self-stretch lg:gap-x-6 py-2 mb-5 pt-10">
            <div className="absolute right-10 top-8">
                {isConnected ?
                    <div>
                        <div className="absolute right-10 top-8 -z-50"></div>
                        <button className="flex-none rounded-md px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-indigo-600" onClick={onDisconnect}>Disconnect</button>
                    </div> :
                    <button className="flex-none rounded-md px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-indigo-600" onClick={onConnect}>Connect Wallet</button>
                }
            </div>
            {/*<WagmiConfig config={wagmiConfig}>*/}
            {/*    <RainbowKitProvider chains={chains}>*/}
            {/*        <div className="absolute right-10 top-8">*/}
            {/*            <ConnectButton />*/}
            {/*        </div>*/}
            {/*    </RainbowKitProvider>*/}
            {/*    /!*<div>{address}</div>*!/*/}
            {/*</WagmiConfig>*/}

    <div className="flex flex-1 border-b-gray-200 border-b pb-2">
                <label htmlFor="search-field" className="sr-only">Search</label>
                <div className="relative w-full">
                    <MagnifyingGlassIcon
                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                        aria-hidden="true"
                    />
                    <input
                        value={inputValue}
                        onChange={handleInputChange}
                        className="block h-full w-full border-0 bg-transparent py-0 pl-8 outline-0 pr-0 focus:ring-0 sm:text-sm"
                        placeholder="Enter your address"
                        type="text"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={!inputValue}
                    className={`flex-none rounded-md px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
    ${!inputValue ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600'}`}
                >
                    search
                </button>
            </div>
        </div>
    )
}
