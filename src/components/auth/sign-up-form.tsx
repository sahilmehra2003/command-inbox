"use client";

import React, { useState } from "react";
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

import { SignUpInput, signUpSchema } from "@/validators/auth.validator";

import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



const SignUpForm = () => {
 
  const [showPassword, setShowPassword] = useState(false);
  
  const router=useRouter()
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const {isSubmitting}=form.formState

  async function onSubmit(data: SignUpInput) {
    await authClient.signUp.email({
      ...data,
    },{
      onError:error=>{
        toast.error(error.error.message || "Failed to sign up")
      },
      onSuccess:(ctx)=>{
        toast.success( ctx.data?.message || "Account created successfully");
        router.push(`/auth/verify-user-pending?email=${encodeURIComponent(data.email)}`);
      }
    })
  }

  // google oauth login
  const handleGoogleLogin=async()=>{
    await authClient.signIn.social({
      provider:"google",
      callbackURL:"/"
    },{
      onError:error=>{
        toast.error(error.error.message || "Google Login failed")
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
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Full Name
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      type="text"
                      placeholder="John Doe"
                      aria-invalid={fieldState.invalid}
                      className="h-12 rounded-xl"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

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
            </FieldGroup>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-xl font-medium cursor-pointer"
            disabled={isSubmitting}
          >
            Create Account
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

<Button
  type="button"
  variant="outline"
  className="h-12 w-full rounded-xl cursor-pointer"
  onClick={handleGoogleLogin}
>
  <Image
    src="/google.svg"
    alt="Google"
    width={50}
    height={20}
    className="h-4 w-4"
  />

  <span className="ml-2">
    Continue with Google
  </span>
</Button>
        </form>

        <div className="pt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            className="font-medium text-primary hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;