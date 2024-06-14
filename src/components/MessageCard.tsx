import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/message'
import { useToast } from './ui/use-toast'
import { ApiResponse } from './../types/ApiResponse';
import axios, { AxiosError } from 'axios'

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void,
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {

    const { toast } = useToast();
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            console.log(response.data)
            toast({
                title: response.data.message
            })
            if (response.data.success) {
                onMessageDelete(message._id || "")
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message || "Failed to fetch message settings";
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    }
    function formatDate(inputDate: Date) {
        // Parse the input date string
        const date = new Date(inputDate);

        // Array of month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Extract and format components
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        // Get hours and format to 12-hour format
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        // Construct the formatted date string
        const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;

        return formattedDate;
    }

    return (
        <Card >
            <CardHeader>
                <div className="flex justify-between">
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"> <X className='w-5 h-5' /> </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <CardDescription>{formatDate(message.createdAt)}</CardDescription>
            </CardHeader>
        </Card>
    )
}
