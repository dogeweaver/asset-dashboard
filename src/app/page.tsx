'use client'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'

const navigation = [
  { name: 'Tokens', href: '#', current: true },
  { name: 'ERC20-Tokens', href: '#', current: true },
  { name: 'NFTs', href: '#', current: false },
  { name: 'Transactions', href: '#', current: false },
]

export default function page() {
  return (
      <div className="flex min-h-[100vh] bg-white">
        {/*<Navbar/>*/}
      </div>
  )
}
