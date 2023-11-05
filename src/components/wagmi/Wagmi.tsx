import { WagmiConfig, createConfig, mainnet } from 'wagmi'
import { createPublicClient, http } from 'viem'
import Header from "@/components/header/Header";

const config = createConfig({
    autoConnect: true,
    publicClient: createPublicClient({
        chain: mainnet,
        transport: http()
    }),
})

export default function Wagmi({ onSearch, onchangeQuery }) {
    const handleSearch = (searchValue) => {
        onSearch(searchValue);
    }
    const handlechangeQuery = (query) => {
        onSearch(query);
    }
    return (
        <WagmiConfig config={config}>
            <Header onSearch={handleSearch} onchangeQuery={handlechangeQuery} />
        </WagmiConfig>
    )
}