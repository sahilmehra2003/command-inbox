"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ForgotPasswordInput,forgotPasswordSchema } from "@/validators/auth.validator";
import { authClient } from "@/lib/auth-client";



const ForgotPasswordPage = () => {
    const router=useRouter();
    const form=useForm<ForgotPasswordInput>({
        resolver:zodResolver(forgotPasswordSchema),
        mode:"onChange",
        defaultValues:{
            email:""
        }
    })
     async function onSubmit(data:ForgotPasswordInput) {
         console.log("data: ",data);
          await authClient.requestPasswordReset({
            email:data.email,
            redirectTo:"/auth/reset-password",
         },{
            onError:error=>{
                toast.error(error.error.message || "Failed to send password reset email.");
            },
            onSuccess:(ctx)=>{
                toast.success(ctx.data?.message || "Password reset email sent");
            }
         })
    }
  return (
     <Card className="w-full border-0 shadow-none bg-transparent">
         <CardHeader className="space-y-6 px-0">
      <div className="space-y-1">
        <CardTitle className="text-4xl font-bold tracking-tight">
          Command Inbox
        </CardTitle>
    
        <p className="text-xs text-muted-foreground">
          Powered by Corsair
        </p>
      </div>
    
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back
        </h2>
    
        <p className="max-w-sm text-sm text-muted-foreground">
          Sign in to access your inbox, calendar, AI assistant
          and workflow dashboard.
        </p>
      </div>
    </CardHeader>
    <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5">
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Email Address
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder="john@example.com"
                      aria-invalid={fieldState.invalid}
                      className="h-12 rounded-xl"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <Button
            type="submit"
            className="h-12 w-full rounded-xl font-medium cursor-pointer"
            >
            Send Reset Email
          </Button>
        </form>
        <div className="pt-6 text-center text-sm text-muted-foreground">
          Go back to 
          <button
            type="button"
            className="font-medium text-primary hover:underline cursor-pointer"
            onClick={()=>router.push("/auth/login")}
          >
            Sign In Page
          </button>
        </div>
    </CardContent>
    </Card>
  )
}

export default ForgotPasswordPage;