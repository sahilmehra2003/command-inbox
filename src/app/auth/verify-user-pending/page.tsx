"use client"
import { Button } from '@/components/ui/button'
import { Card,CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const VerifyUserPendingPage = () => {
    const searchParams=useSearchParams()
    const email=searchParams.get("email");
    return (
     <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
       {/* // Todo need to create a theme toggler */}
          
          <div className="absolute top-4 right-4">
              {/* Theme Toggle */}
          </div>
          <Card className="relative z-10 w-full max-w-md border shadow-xl">
                <CardContent className="flex flex-col items-center p-8 text-center">
                    <h1 className="mb-3 text-2xl font-bold">Verification email sent</h1>
                    <p className="mb-6 text-muted-foreground">
                         We&apos;ve sent a verification link to:
                    </p>
                    <div className="mb-6 w-full rounded-lg border bg-muted/50 px-3 py-3 font-medium break-all">
            {email ? (
              <p>
                We&apos;ve sent a verification email to {" "}
                <strong>{ email.replace(/"/g, ' ')}</strong>
              </p>
            ) : (
              <p>
                We&apos;ve sent a verification email to your registered email
                address.
              </p>
            )}
          </div>
           <p className="mb-8 text-sm text-muted-foreground">
            Please check your inbox and click the verification link to activate
            your account.
          </p>

          <Button asChild className="w-full">
            <Link href="/auth/login">I&apos;ve verified my email</Link>
          </Button>

          <p className="mt-4 text-xs text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder.
          </p>
          </CardContent>
        </Card>
     </div>
  )
}

export default VerifyUserPendingPage;