import React from 'react'
import {STARTUPS_BY_AUTHOR_QUERY} from "@/sanity/lib/queries";
import {client} from "@/sanity/lib/client";
import StartupCard, {StartupCardType} from "@/components/StartupCard";


const UserStartups = async ({authorId}: { authorId: string }) => {
    const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, {id: authorId});
    return (
        <>
            {startups.length > 0 ? startups.map((startup: StartupCardType) => (
                    <StartupCard key={startup._id} post={startup}/>
                )) :
                <p className="no-result">
                    No start ups found.
                </p>
            }
        </>
    )
}
export default UserStartups
