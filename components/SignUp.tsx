"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { createUser } from "@/app/actions";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import { z } from "zod";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formSchema = authFormSchema("sign-up");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await createUser({ ...data });
      console.log(response, "this is response here===");
      toast.success("Account created successfully. Please sign in.");
      router.push("/sign-in");
    } catch (error) {
      console.log(error);
      toast.error("oops! error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#4B4D4F] to-[#4B4D4F33] p-0.5 rounded-2xl w-[95%] md:w-[60%] lg:w-fit lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3>Practice job interviews with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            <FormField
              control={form.control}
              name="name"
              label="Name"
              placeholder="Your Name"
              type="text"
            />

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button
              className="!w-full !bg-primary-200 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin duration-500" />
                  Creating...
                </span>
              ) : (
                "Create an Account"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          Have an account already?
          <Link href="/sign-in" className="font-bold text-user-primary ml-1">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
