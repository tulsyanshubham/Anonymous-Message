'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schema/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Sign_up() {
  const [username, setUsername] = useState('');
  const [usernameMesage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-unique-username?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? 'Something went wrong');
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/sign-up', data);
      toast({
        title: response.data.Success ? 'Success' : 'Failed',
        description: response.data.message,
        // variant: response.data.Success ? 'default' : 'destructive'
      });
      router.replace(`/verify/${username}`);

    } catch (error) {
      // console.log("Error in sign-up", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      setUsernameMessage(errorMessage ?? 'Something went wrong');
      toast({
        title: 'Failed',
        description: errorMessage,
        variant: 'destructive',
      });

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-lg p-8 space-y-8 bg-gray-950 border-2 border-gray-700 rounded-lg shadow-md mx-2'>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Anonymous Message</h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>

            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} onChange={(e) => { field.onChange(e); debouncedUsername(e.target.value) }} />
                  </FormControl>
                    {isCheckingUsername && <Loader2 className='animate-spin' />}
                    <p className={`text-sm ${usernameMesage === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
                        {usernameMesage}
                    </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
                    <Input type='password' placeholder="password" {...field} />
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
              ) : ("Sign Up")}
            </Button>
            </div>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <Link href='/sign-in' className='text-blue-600 hover:text-blue-800'>
            Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
