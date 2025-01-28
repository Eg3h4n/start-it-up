import React from 'react'
import {signIn} from "@/auth";

const Page = () => {
    return (
        <>
            <form action={async () => {
                "use server"

                await signIn('google', {redirectTo: "/"});
            }}>
                <button type="submit">Login with Google</button>
            </form>

            <form action={async () => {
                "use server"

                await signIn('github', {redirectTo: "/"});
            }}>
                <button type="submit">Login with Github</button>
            </form>
        </>
    )
}
export default Page
