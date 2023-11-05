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

interface WagmiagmiProps {
    onSearch: (searchValue: any) => void;
    onchangeQuery?: (query: any) => void;  // 使用 ? 来标记这个属性为可选
}

const Wagmiagmi: React.FC<WagmiagmiProps> = ({ onSearch, onchangeQuery }) => {
    const handleSearch = (searchValue: any) => {
        onSearch(searchValue);
    }
    const handlechangeQuery = (query: any) => {
        onSearch(query);
    }
    return (
        <WagmiConfig config={config}>
            <Header onSearch={handleSearch} onchangeQuery={handlechangeQuery} />
        </WagmiConfig>
    )
}

export default Wagmiagmi;
