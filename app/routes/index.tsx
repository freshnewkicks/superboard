import type { LoaderArgs } from "@remix-run/node"
import { useEffect } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { TopNav } from "@gComp/TopNav"
import { requireUser } from "~/session.server";
import { redirectWithError } from "~/user.server";

export const loader = async({ request }: LoaderArgs) => {
    const USER = await requireUser(request)

    if (!USER) {
        return await redirectWithError(request)
    }
    
}

const Index = () => {
    const LOADER = useTypedLoaderData<typeof loader>()

    useEffect(() => {
        console.log(LOADER)
    }, [LOADER])

    return (
        <>
            <TopNav />
            <h1>Test</h1>
        </>
    )
}

export default Index;