
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth, initializeFirebase, useUser } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addUser } from "@/firebase/firestore/users";

type LoginFormProps = {
  role: "Admin" | "Merchant" | "Customer";
  onSuccessRedirect: string;
};

export function LoginForm({ role, onSuccessRedirect }: LoginFormProps) {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const { user, loading: userLoading } = useUser();
  
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  const getDefaultEmail = () => {
    if (role === 'Admin') return "awn@gmail.com";
    if (role === 'Merchant') return "merchant@awn.com";
    if (role === 'Customer') return "customer@awn.com";
    return "";
  }
  
   const getDefaultPassword = () => {
    if (role === 'Admin') return "awnawn";
    if (role === 'Merchant') return "merchantpass";
    if (role === 'Customer') return "customerpass";
    return "";
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState(getDefaultEmail());
  const [password, setPassword] = useState(getDefaultPassword());
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    // If user is already logged in, redirect to their dashboard.
    if (!userLoading && user) {
      router.replace(onSuccessRedirect);
    }
  }, [user, userLoading, router, onSuccessRedirect]);


  const handleAuthAction = async () => {
    const { auth, firestore } = initializeFirebase();
    if (!auth || !firestore) {
      setError("Firebase is not initialized. Please try again later.");
      return;
    }
    setAuthLoading(true);
    setError(null);

    try {
        if (mode === 'login') {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            // Firestore function 'addUser' already handles auth creation
            await addUser(firestore, {
                name,
                email,
                password,
                role: 'Customer', // Signup is only for customers
                status: 'Active'
            });
             await signInWithEmailAndPassword(auth, email, password);
        }
        router.replace(onSuccessRedirect);
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-in-use') {
          setError(t('emailInUseError', 'This email is already in use. Please try logging in.'));
      } else if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
        setError(t('invalidCredentialsError', "Login failed. The email or password you entered is incorrect."));
      } else {
        console.error("Authentication error:", authError);
        setError(t('unexpectedError', 'An unexpected error occurred. Please try again.'));
      }
    } finally {
      setAuthLoading(false);
    }
  };
  
  const toggleMode = () => {
      setMode(mode === 'login' ? 'signup' : 'login');
      setError(null);
  }

  // Define texts based on role and mode
  let title, description, footerText, footerLinkText, buttonText;

  if (role === 'Customer') {
      if (mode === 'login') {
          title = t('customerLoginTitle', 'Customer Login');
          description = t('customerLoginDescription', 'Enter your details to access your account.');
          buttonText = t('loginButton', 'Login');
          footerText = t('noAccount', "Don't have an account?");
          footerLinkText = t('signUp', 'Sign up');
      } else {
          title = t('customerSignUpTitle', 'Create Account');
          description = t('customerSignUpDescription', 'Join us to start shopping.');
          buttonText = t('signUpButton', 'Create Account');
          footerText = t('alreadyHaveAccount', 'Already have an account?');
          footerLinkText = t('loginButton', 'Login');
      }
  } else { // Admin and Merchant
      title = role === 'Admin' ? t('adminLogin') : t('merchantLogin');
      description = role === 'Admin' ? t('adminLoginDescription') : t('merchantLoginDescription');
      buttonText = t('loginButton');
      footerText = role === 'Admin' ? t('noAdminAccount') : t('createStore');
      footerLinkText = role === 'Admin' ? t('contactSupport') : t('signUp');
  }

  // If loading or already logged in, don't render the form
  if (userLoading || user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="w-full max-w-md" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-center mb-8">
        <Link href="/" className="flex items-center gap-3 text-foreground">
          <div className="p-2.5 bg-primary rounded-lg">
            <Store className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-3xl font-bold font-headline">منصة عون</span>
        </Link>
      </div>

      <Card className="bg-card/60 border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAuthAction();
            }}
            className="space-y-6"
          >
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('toastErrorTitle')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {mode === 'signup' && role === 'Customer' && (
                <div className="space-y-2">
                    <Label htmlFor="name">{t('customerName', 'Full Name')}</Label>
                    <Input 
                        id="name" 
                        type="text"
                        placeholder={t('fullNamePlaceholder', 'Enter your full name')}
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={authLoading}
                    />
                </div>
            )}
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('emailLabel')}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="awn@gmail.com"
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={authLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('passwordLabel')}</Label>
                    {mode === 'login' && (
                        <Link
                            href="#"
                            className="text-sm text-primary hover:underline"
                            >
                            {t('forgotPassword')}
                        </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="awnawn"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={authLoading}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground rtl:left-0 rtl:right-auto rtl:pl-3"
                      disabled={authLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                    </button>
                  </div>
                </div>
              </>
            <Button type="submit" className="w-full h-11 text-base font-bold" disabled={authLoading}>
              {authLoading ? t('loading', 'Loading...') : buttonText}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="mt-4 justify-center text-sm">
          <p className="text-muted-foreground">
             {footerText}{" "}
            <button type="button" onClick={role === 'Customer' ? toggleMode : undefined} className="font-semibold text-primary hover:underline" disabled={role !== 'Customer'}>
              {footerLinkText}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
