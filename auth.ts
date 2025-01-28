import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import {client} from "@/sanity/lib/client";
import {AUTHOR_BY_EMAIL_QUERY} from "@/sanity/lib/queries";
import {writeClient} from "@/sanity/lib/write-client";

// ({clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET})

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [Google, Github],
    // pages: {
    //     signIn: "/login",
    // },
    callbacks: {
        async signIn({user, account, profile}) {
            const isGoogle = account?.provider === "google";
            const isGitHub = account?.provider === "github";

            // Extract the provider-specific unique identifier
            const providerId = isGoogle ? profile?.sub : isGitHub ? String(profile?.id) : null;

            // console.log("Profile Object:", profile);
            // const {sub, email, name, picture} = profile;

            if (!providerId) {
                console.error("Provider ID is undefined!");
                return false; // Prevent sign-in if no ID is found
            }

            try {
                console.log("Fetching user with email:", providerId);
                const existingUser = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_EMAIL_QUERY, {email: user.email});
                console.log("Existing User:", existingUser);

                if (!existingUser) {
                    console.log("Creating new user in Sanity...");
                    await writeClient.create({
                        _type: 'author',
                        email: user.email,
                        google_provider_id: isGoogle ? providerId : "",
                        github_provider_id: isGitHub ? String(providerId) : "",
                        name: user.name,
                        username: account?.providerAccountId,
                        image: user.image,
                        bio: ""
                    })
                } else {
                    if (isGoogle && existingUser.google_provider_id == "") {
                        console.log("Updating user with Google provider ID...");
                        await writeClient.patch(existingUser._id)
                            .set({google_provider_id: providerId})  // Set the Google provider ID
                            .commit();
                    }
                    if (isGitHub && existingUser.github_provider_id == "") {
                        console.log("Updating user with GitHub provider ID...");
                        await writeClient.patch(existingUser._id)
                            .set({github_provider_id: String(providerId)})  // Set the GitHub provider ID
                            .commit();
                    }
                }
                console.log("signin success:")

                return true;

            } catch (error) {
                console.log("signin error:", error)
                return false;
            }
        },
        async jwt({token, account, profile}) {
            // If the user is signing in or the account has been updated
            if (account && profile) {
                console.log("Profile Email:", profile.email);
                // Use email to search for the existing user in Sanity, regardless of provider
                const email = profile.email; // Email is shared across both Google and GitHub

                if (email) {
                    // Fetch the user from Sanity by email (this will handle users across providers)
                    const user = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_EMAIL_QUERY, {email});

                    if (user) {
                        console.log("User email found");
                        // If user exists, store the user ID in the token
                        token.id = user._id; // User's unique ID in Sanity
                        token.email = user.email; // Ensure email is consistent
                    } else {
                        console.warn("JWT: No user found for email:", email);
                    }
                }
            }

            return token;
        },
        async session({session, token}) {
            if (token?.id) {
                Object.assign(session, {id: token.id});
            } else {
                console.warn("Session: No ID found in token.");
            }
            return session;
        }
        // async redirect({url, baseUrl}) {
        //     return url.startsWith(baseUrl) ? url : baseUrl + '/';
        // }
    }
})