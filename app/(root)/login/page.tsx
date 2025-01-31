import React from 'react'
import {signIn} from "@/auth";
import {Button} from "@/components/ui/button";

const Page = () => {
    return (
        <>
            <section className="pink_container !min-h-[230px]">
                {/*<h1 className="heading">Login</h1>*/}
                <form action={async () => {
                    "use server"

                    await signIn('google', {redirectTo: "/"});
                }}>
                    <Button type="submit" className="startup-card_btn text-white m-5">Login with Google
                    </Button>
                </form>

                <form action={async () => {
                    "use server"

                    await signIn('github', {redirectTo: "/"});
                }}>
                    <Button type="submit" className="startup-card_btn text-white">Login with Github</Button>
                </form>
            </section>
            {/*<div className="startup-form">*/}
            {/*    <form action={async () => {*/}
            {/*        "use server"*/}

            {/*        await signIn('google', {redirectTo: "/"});*/}
            {/*    }}>*/}
            {/*        <Button type="submit" className="startup-card_btn text-white">Login with Google*/}
            {/*        </Button>*/}
            {/*    </form>*/}

            {/*    <form action={async () => {*/}
            {/*        "use server"*/}

            {/*        await signIn('github', {redirectTo: "/"});*/}
            {/*    }}>*/}
            {/*        <Button type="submit" className="startup-card_btn text-white">Login with Github</Button>*/}
            {/*    </form>*/}

            {/*</div>*/}
        </>
    )
}
export default Page
