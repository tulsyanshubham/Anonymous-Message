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
        <nav className='px-2 py-4 md:p-6 shadow-md bg-gray-900 fixed w-full'>
            <div className='container mx-auto flex flex-row justify-between items-center'>
                <a className='text-ms lg:text-3xl md:text-2xl font-bold md:mb-0' href="/">
                    Anonymous Messages {session ? (`(${user.username || user.email})`) : ""}
                </a>
                {
                    session ? (
                        <>
                            {/* <span className='mr-4 text-xl font-bold'>Welcome, {user.username || user.email} </span> */}
                            <Button className='w-fit md:w-auto' onClick={() => signOut()}>Logout</Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button className="w-fit md:w-auto bg-slate-100 text-black">Login</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}
