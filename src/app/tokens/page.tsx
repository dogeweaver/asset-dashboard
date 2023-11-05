import type { Metadata } from "next";
import Tokens from "./Tokens";

export const metadata: Metadata = {
    title: 'Tokens',
    description: 'Tokens',
}

export default function Page() {
    return (
        <Tokens></Tokens>
    )
}
