'use client'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useRouter, usePathname} from 'next/navigation';
import React, { useState, useEffect } from 'react';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname();

    const [query, setQuery] = useState('')
    const navbar = [
        { name: 'Tokens', href: '/tokens', current: pathname.match(/^\/tokens$/) },
        { name: 'ERC20-Tokens', href: 'erc-20-tokens', current: pathname.match('/erc-20-tokens') },
        { name: 'NFTs', href: 'nfts', current: pathname.match('/nfts') },
        { name: 'Transactions', href: 'transactions', current: pathname.match('/transactions') },
    ]

    //
    // useEffect(() => {
    //     setQuery(window.location.search.substring(1))
    //     console.log(111)
    //     console.log('Navbar侧边栏 useEffect', query)
    // }, [router]);

    return (
        <div className="flex w-60 flex-col h-full">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
                <div className="flex h-16 shrink-0 items-center">
                    <img
                        className="h-12 w-auto"
                        src="/logo.png"
                        alt="Your Company"
                    />
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" className="-mx-2 space-y-1">
                                {navbar.map((item) => (
                                    <li key={item.name}>
                                        <span onClick={() => {router.push(item.href + '?' + query )}}
                                            className={classNames(
                                                item.current ? 'bg-gray-800 text-white' : 'cursor-pointer text-gray-400 hover:text-white hover:bg-gray-800',
                                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                            )}
                                        >
                                            {item.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}
