'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { signInSchema } from '@/schema/signInSchema';
import { signIn } from 'next-auth/react';

export default function page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    setIsSubmitting(false);
    if (result?.error) {
      console.log(result.error.substring(7))
      toast({
        title: "Login Failed",
        description: result.error.substring(7),
        variant: "destructive"
      })
    }
    if (result?.url) {
      router.replace('/dashboard');
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-lg p-8 space-y-8 bg-gray-900 rounded-lg shadow-md mx-2'>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Anonymous Message</h1>
          <p className="mb-4">Sign in to continue your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username/email" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="password" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type='submit' disabled={isSubmitting} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-200 ease-in-out transform hover:scale-105' >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                  </>
                ) : ("Sign In")}
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            New to Anonymous Message?{' '}
            <Link href='/sign-up' className='text-blue-600 hover:text-blue-800'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
