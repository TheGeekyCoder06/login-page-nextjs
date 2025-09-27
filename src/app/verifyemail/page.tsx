'use client'

import axios from 'axios'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      const response = await axios.post('/api/verifyemail', { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.message);
    }
  }

  useEffect(() => {
    const urlToken = window.location.search.split('=')[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl mb-4'>Verify Email</h1>

      <h2 className='p-2 bg-orange-50 text-black'>
        {token ? token : "no token"}
      </h2>

      {verified && (
        <div className='text-green-500 mt-4'>
          Email verified successfully! You can now{" "}
          <Link href="/login" className='underline'>
            login
          </Link>.
        </div>
      )}

      {error && (
        <div className='text-red-500 mt-4'>
          Verification failed. Token is invalid or expired.
        </div>
      )}
    </div>
  )
}

// Note: This page is accessed via a link sent to the user's email.