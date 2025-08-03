'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignInPage() {
  const [email, setEmail] = useState('demo@university.edu');
  const [password, setPassword] = useState('demo123');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Grant Tracker 2.0
          </h1>
          <p className='mt-2 text-gray-600'>
            Multi-Year Federal Grant Management Platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-center'>Sign In (Demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='mb-1 block text-sm font-medium text-gray-700'
                >
                  Email
                </label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='mb-1 block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder='Enter your password'
                  required
                />
              </div>

              <Button type='submit' className='w-full'>
                Sign In
              </Button>
            </form>

            <div className='mt-4 text-center'>
              <p className='text-sm text-gray-600'>
                Demo Credentials: demo@university.edu / demo123
              </p>
              <p className='mt-2 text-xs text-gray-500'>
                This is a demonstration. Click "Sign In" to access the
                dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
