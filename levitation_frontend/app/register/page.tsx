"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useGlobalState } from "../contexts/global-state";

interface RegisterResponse {
    token: string;
    error?: string;
  }

// Define the form validation schema
const formSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
})

export default function RegisterPage() {
  // Initialize form with validation schema
  const {setIsLoading} = useGlobalState();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      
      const response = await fetch('https://levitation.api.corevision.live/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data: RegisterResponse = await response.json();

      if(!data.token) {
        toast({
          title: "Registration Failed",
          description: "Invaid arguments."
        });
      }else{
        // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Show success message
      toast({
        title: "Registration Successful",
        description: "You have been successfully logged in.",
        variant: "default",
      });

      // Redirect to products page
      router.push('/');
      }
      
      
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function route(url: string){
    router.push(url);
  }

  return (
    <div className="fixed top-14 bottom-0 right-0 left-0 bg-black flex items-center justify-center p-4">
        <div className=" fixed top-0 right-0 left-0 h-14 bg-zinc-800 flex justify-between items-center pl-[5vw] pr-[5vw]">
            <h1 className=" text-white">Levitation</h1>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={()=>route("/login")}>
                Login
            </Button>
        </div>
      <div className="w-full max-w-[1000px] flex rounded-lg overflow-hidden bg-zinc-900">
        {/* Left side - Image */}
        <div className="relative hidden md:block w-1/2 h-[600px]">
          <Image 
            src="/api/placeholder/500/600"
            alt="Office space"
            layout="fill"
            objectFit="cover"
            className="rounded-l-lg"
          />
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="h-full flex flex-col">

            <div className="flex-grow flex flex-col justify-center">
              <h1 className="text-white text-3xl font-bold mb-4">
                Sign up to begin journey
              </h1>
              <p className="text-zinc-400 text-sm mb-8">
                This is basic signup page which is used for levitation assignment purpose.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">Enter your name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter Name" 
                            className="bg-zinc-800 border-zinc-700 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-zinc-500 text-xs">
                          This name will be displayed with your inquiry
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter Email ID" 
                            className="bg-zinc-800 border-zinc-700 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-zinc-500 text-xs">
                          This email will be displayed with your inquiry
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Enter the Password" 
                            className="bg-zinc-800 border-zinc-700 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Registering in..." : "Register"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="text-zinc-400 hover:text-zinc-300"
                      onClick={()=>route("/login")}
                    >
                      Already have an account?
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}