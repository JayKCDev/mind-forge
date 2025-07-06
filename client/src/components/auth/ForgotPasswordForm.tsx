"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSubmit?: (data: ForgotPasswordFormData) => void;
  isLoading?: boolean;
}

const ForgotPasswordForm = ({ onSubmit, isLoading = false }: ForgotPasswordFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (data: ForgotPasswordFormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      // Default behavior - you can implement your password reset logic here
      console.log("Password reset data:", data);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-customgreys-secondarybg border-customgreys-dirtyGrey/20">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white-50">
              Check your email
            </CardTitle>
            <CardDescription className="text-customgreys-dirtyGrey">
              We've sent a password reset link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary-700/20 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary-700" />
              </div>
              <p className="text-sm text-customgreys-dirtyGrey mb-6">
                If an account with that email exists, you'll receive a password reset link shortly.
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center text-primary-700 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-customgreys-secondarybg border-customgreys-dirtyGrey/20">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-white-50">
            Forgot your password?
          </CardTitle>
          <CardDescription className="text-customgreys-dirtyGrey">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white-50 font-normal">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-customgreys-dirtyGrey w-4 h-4" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-customgreys-primarybg border-customgreys-dirtyGrey/30 text-white-50 placeholder:text-customgreys-dirtyGrey focus:border-primary-700 focus:ring-primary-700"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary-700 hover:bg-primary-600 text-white-100 font-medium py-3"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Link
              href="/signin"
              className="inline-flex items-center text-primary-700 hover:text-primary-600 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;