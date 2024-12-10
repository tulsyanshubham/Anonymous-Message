"use client";
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schema/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
// import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

export default function VerifyAccount() {
    const router = useRouter();
    const param = useParams<{ username: string }>();
    const { toast } = useToast();

    //zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '',
        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            // console.log(data)
            const response = await axios.post('/api/verify-code', {
                username: param.username,
                code: data.code
            });

            toast({
                title: "Success",
                description: response.data.message,
            })

            router.replace('/sign-in')
        } catch (error) {
            console.log("Error in sign-up", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast({
                title: 'Signup Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='w-full max-w-lg p-8 space-y-8 bg-gray-950 border-2 border-gray-700 rounded-lg shadow-md mx-2'>
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">Verify Your Account</h1>
                    <p className="mb-4">Enter the verification code sent to your mail</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col items-center justify-center">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Verification Code</FormLabel> */}
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-200 ease-in-out transform hover:scale-105' >
                            Verify
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
