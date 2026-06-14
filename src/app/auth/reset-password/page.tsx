"use client"
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter,useSearchParams } from "next/navigation";
import { ResetPasswordInput,resetPasswordSchema } from "@/validators/auth.validator";
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
import { Eye, EyeOff } from "lucide-react";



const ResetPasswordPage = () => {
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
    const searchParams=useSearchParams()
    const token=searchParams.get("token")!;
    const router=useRouter();
    const form=useForm<ResetPasswordInput>({
        resolver:zodResolver(resetPasswordSchema),
        mode:"onChange",
        defaultValues:{
            password:"",
            confirmPassword:""
        }
    })
    const {isSubmitting}=form.formState;
    async function onSubmit(data:ResetPasswordInput) {
        await authClient.resetPassword({
            newPassword:data.password,
            token
        },{
           onError:error=>{
              toast.error(error.error.message || "Password reset failed");
           }, 
            onSuccess:(ctx)=>{
              toast.success(ctx.data?.message || "Password reset successful");
              router.push("/auth/login");
            }
        })
        
    }
  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
     <CardHeader className="space-y-6  px-0">
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
      Create your account
    </h2>

    <p className="max-w-sm text-sm text-muted-foreground">
      Join Command Inbox and take control of your emails,
      meetings and productivity.
    </p>
  </div>
</CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-5">
            <FieldGroup>

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Password
                    </FieldLabel>

                    <div className="relative">
                      <Input
                        {...field}
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        aria-invalid={fieldState.invalid}
                        className="h-12 rounded-xl pr-10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Password
                    </FieldLabel>

                    <div className="relative">
                      <Input
                        {...field}
                        id={field.name}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        aria-invalid={fieldState.invalid}
                        className="h-12 rounded-xl pr-10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

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
            disabled={isSubmitting}
          >
            Reset Password
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">
                Continue with
              </span>
            </div>
          </div>
        </form>

        <div className="pt-6 text-center text-sm text-muted-foreground">
          Go back to
          <button
            type="button"
            className="font-medium text-primary hover:underline cursor-pointer"
            onClick={()=>router.push("/auth/login")}
          >
            Sign In
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResetPasswordPage;