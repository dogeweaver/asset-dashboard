import type { Metadata } from "next";
import Nfts from "./Nfts";

export const metadata: Metadata = {
    title: 'NFTs',
    description: 'NFTs',
}

export default function Page() {
    return (
        <Nfts></Nfts>
    )
}
