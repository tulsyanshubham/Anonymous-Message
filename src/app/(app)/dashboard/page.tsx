'use client';
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/message';
import { acceptMessageSchema } from '@/schema/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

export default function page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message.id !== messageId));
  }

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);

    try {

      const response = await axios.get<ApiResponse>('/api/accept-message');
      setValue('acceptMessages', response.data.isAcceptingMessages);

    } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "Failed to fetch message settings";
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

    } finally {
      setIsSwitchLoading(false);
    }

  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {

      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: 'Success',
          description: 'Messages refreshed',
        });
      }
    } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "Failed to fetch message settings";
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages(false);
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages])

  //handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post('/api/accept-message', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "Failed to change message settings";
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }

  // const {username} = session?.user as User;
  const { username } = session?.user;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileURL = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL);
    toast({
      title: 'URL copied to clipboard',
    });
  }


  if (!session || !session.user) return (
    <div>
      <h1>Please login</h1>
    </div>
  )
  else
    return (
      <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb--2">Copy Your Unique Link</h2>{' '}
          <div className="flex items center">
            <input type="text" value={profileURL} disabled className="w-full p-2 mr-2 inpt-bordered input" />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
          <div className="mb-4">
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="ml-2">
              Accept Messages: {acceptMessages ? 'On' : 'Off'}
            </span>
          </div>
          <Separator />
          <Button className='mt-4' variant='outline'
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
              </>
            ) : (
              <>
                <RefreshCcw className='h-4 w-4' />
              </>
            )}
          </Button>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (messages.map((message,index) => (
              <MessageCard key={index} message={message} onMessageDelete={handleDeleteMessage} />
            ))):(
              <p className="text-center">No messages</p>
            )}
          </div>
        </div>
      </div>
    )
}
