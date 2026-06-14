"use client"
import AuthTabs from '@/components/auth/auth-tabs'
import AuthShowcase from '@/components/auth/auth-showcase';
import React, { useEffect } from 'react'
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  // if user is already logged in no need to show him login page redirect the user.
  const router=useRouter();
  useEffect(()=>{
    authClient.getSession().then(session=>{
      if (session.data!=null) {
        router.push("/");
      }
    })
  },[router]);
  return (
    <div className="min-h-screen bg-background">
  <div className="mx-auto flex min-h-screen max-w-7xl">
    
    <div className="w-full lg:w-[45%] flex items-center justify-center p-8">
      <AuthTabs />
    </div>

    <div className="hidden lg:flex lg:w-[55%]">
      <AuthShowcase />
    </div>

  </div>
</div>
  );
};

export default LoginPage