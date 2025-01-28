import {defineType, defineField} from "sanity";
import {UserIcon} from "@sanity/icons";

export const author = defineType({
    name: 'author',
    title: 'Author',
    type: 'document',
    icon: UserIcon,
    fields: [
        defineField({
            name: 'email',
            type: 'string'
        }),
        defineField({
            name: 'google_provider_id',
            type: 'string'
        }),
        defineField({
            name: 'github_provider_id',
            type: 'string'
        }),
        defineField({
            name: 'name',
            type: 'string'
        }),
        defineField({
            name: 'username',
            type: 'string'
        }),
        defineField({
            name: 'image',
            type: 'url'
        }),
        defineField({
            name: 'bio',
            type: 'text'
        }),
    ],
    preview: {
        select: {
            title: 'name',
        }
    }
})