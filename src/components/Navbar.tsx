'use client';
import React from 'react'
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';

export default function Navbar() {

    const { data: session } = useSession();
    const user: User = session?.user;
    // const user: User = session?.user as User;

    return (
        <nav className='p-4 md:p-6 shadow-md bg-gray-900 fixed w-full'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a className='text-xl lg:text-3xl md:text-2xl font-bold mb-4 md:mb-0' href="/">
                    Anonymous Messages {session ? (`(${user.username || user.email})`) : ""}
                </a>
                {
                    session ? (
                        <>
                            {/* <span className='mr-4 text-xl font-bold'>Welcome, {user.username || user.email} </span> */}
                            <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button className="w-full md:w-auto bg-slate-100 text-black">Login</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}
