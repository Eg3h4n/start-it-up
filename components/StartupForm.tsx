"use client"

import React, {useActionState, useState} from 'react'
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor"
import {Send} from "lucide-react";
import {formSchema} from "@/lib/validation";
import {z} from "zod";
import {useToast} from "@/hooks/use-toast"
import {useRouter} from "next/navigation";
import {createPitch} from "@/lib/actions";

const StartupForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState("");
    const {toast} = useToast();
    const router = useRouter();

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                imageUrl: formData.get("imageUrl") as string,
                pitch
            }

            await formSchema.parseAsync(formValues);

            const result = await createPitch(prevState, formData, pitch);

            if (result.status === "SUCCESS") {
                toast({
                    title: "Success",
                    description: "Your startup pitch has been created successfully."
                });

                router.push(`/startup/${result._id}`);
            }
            return result;
        } catch (e) {
            if (e instanceof z.ZodError) {
                const fieldErrors = e.flatten().fieldErrors;

                setErrors(fieldErrors as unknown as Record<string, string>);

                toast({
                    title: "Error",
                    description: "Please check your inputs and try again",
                    variant: "destructive",
                })

                return {...prevState, error: "Validation failed.", status: "ERROR"};
            }

            toast({
                title: "Error",
                description: "An unexpected error occurred.",
                variant: "destructive",
            })
            return {...prevState, error: "An unexpected error has occured", status: "ERROR"};


        }
    };

    const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        error: "",
        status: "INITIAL"
    });

    return (
        <form action={formAction} className="startup-form">
            <div>
                <label htmlFor="title" className="startup-form_label">Title</label>
                <Input id="title" name="title" className="startup-form_input" required
                       placeholder="Name of your startup"/>

                {errors.title && <p className="startup-form_error">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="startup-form_label">Description</label>
                <Textarea id="description" name="description" className="startup-form_textarea" required
                          placeholder="Shortly describe your startup"/>

                {errors.description && <p className="startup-form_error">{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="category" className="startup-form_label">Category</label>
                <Input id="category" name="category" className="startup-form_input" required
                       placeholder="Startup Category (Tech, Health, Education, etc..)"/>

                {errors.category && <p className="startup-form_error">{errors.category}</p>}
            </div>

            <div>
                <label htmlFor="imageUrl" className="startup-form_label">Image URL</label>
                <Input id="imageUrl" name="imageUrl" className="startup-form_input" required
                       placeholder="URL of your image"/>

                {errors.imageUrl && <p className="startup-form_error">{errors.imageUrl}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="pitch" className="startup-form_label">Pitch</label>

                <MDEditor
                    value={pitch}
                    onChange={(value) => setPitch(value as string)}
                    id="pitch"
                    preview="edit"
                    height={300}
                    style={{borderRadius: 20, overflow: "hidden"}}
                    textareaProps={
                        {
                            placeholder: "Briefly describe your startup and what makes you stand out",
                        }
                    }
                    previewOptions={{
                        disallowedElements: ["style"]
                    }}
                />

                {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
            </div>

            <Button type="submit"
                    className="startup-form_btn text-white"
                    disabled={isPending}
            >
                {isPending ? "Submitting..." : "Submit Your Startup"}
                <Send className="size-6 ml-2"/>
            </Button>
        </form>
    )
};

export default StartupForm
