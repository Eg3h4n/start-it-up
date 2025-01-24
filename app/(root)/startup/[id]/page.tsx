import React from 'react'
import {client} from "@/sanity/lib/client";
import {STARTUPS_BY_ID_QUERY} from "@/sanity/lib/queries";
import {notFound} from "next/navigation";
import {formatDate} from "@/lib/utils";
import Link from 'next/link';
import Image from "next/image";

// export const experimental_ppr = true;

const Page = async ({params}: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;

    const post = await client.fetch(STARTUPS_BY_ID_QUERY, {id});

    if (!post) return (
        notFound()
    )

    return (
        <>
            <section className="pink_container !min-h-[230px]">
                <p className="tag">
                    {formatDate(post?._createdAt)}
                </p>
                <h1 className="heading">
                    {post?.title}
                </h1>
                <p className="sub-heading !max-w-5xl">
                    {post?.description}
                </p>
            </section>
            <section className="section_container">
                <img src={post.image} alt="thumbnail" className="w-full h-autoq rounded-xl"/>
                <div className="space-y-5 mt-10 max-w-4xl mx-auto">
                    <div className="flex-between gap-5">
                        <Link href={`/user/${post?.author?.id}`} className="flex gap-2 items-center mb-3">
                            <Image src={post?.author?.image} alt="avatar" width={64} height={64}
                                   className="rounded-full drop-shadow-md"/>
                            <div>
                                <p className="text-20-medium">
                                    {post?.author?.name}
                                </p>

                            </div>

                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Page
