import AuthTabs from '@/components/auth/auth-tabs'
import AuthShowcase from '@/components/auth/auth-showcase';
import React from 'react'

const LoginPage = () => {
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