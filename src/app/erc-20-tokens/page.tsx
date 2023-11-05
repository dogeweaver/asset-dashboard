import type { Metadata } from "next";
import Erc20Tokens from "./Erc20Tokens";

export const metadata: Metadata = {
    title: 'ERC20-tokens',
    description: 'ERC20-tokens',
}

export default function Page() {
    return (
        <Erc20Tokens></Erc20Tokens>
    )
}
