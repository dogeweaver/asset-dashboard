import type { Metadata } from "next";
import Transactions from "./Transactions";

export const metadata: Metadata = {
    title: 'Transactions',
    description: 'Transactions',
}

export default function Page() {
    return (
        <Transactions></Transactions>
    )
}
