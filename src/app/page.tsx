'use client';
import { useForm } from 'react-hook-form'
import { supabase } from "./supabase-client";
import { useState } from 'react';

interface FormData {
  email: string;
}

export default function Home() {
  const { register, handleSubmit } = useForm<FormData>();

  const [error, setError] = useState('')

  const onSubmit = async (formData: FormData) => {
    // Get user
    let { data: user, error } = await supabase.from('profiles').select("*").eq('email', formData.email)

    if (error) console.log('Error retrieving user:', error.message)

    console.log(user)

    // Delete user
    if (user !== null && user.length > 0) {
      console.log('User found:', user[0])
      console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
      const { error: resendError } = await supabase.functions.invoke('resend', {
        body: { email: formData.email }
      })

      if (resendError) console.log('Error resending email:', resendError.message)
    } else {
      setError('User not found')
    }
  }


  return (
    <main
      className="relative min-h-screen grid grid-cols-1 content-center bg-center bg-cover w-full"
      style={{ backgroundImage: `url("/landing-bg.png")` }}
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="bg-stone-900 text-amber-50 p-16 rounded-lg z-10 relative flex space-y-4 flex-col items-center justify-center text-center">
        <h1 className='text-3xl'>We're sorry to see you go!</h1>
        <p>
          To delete your account, please use the email registered with your account.<br />
          This will be the same email associated with your Discord account.</p>
        <div className="flex space-x-2">
          <form
            className="flex flex-col items-center justify-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="border border-gray-300 p-2 rounded"
              style={{ color: 'black' }}
              id="email"
              type="email"
              placeholder='Email'
              {...register('email', { required: true })} />
          </form>
          <button
            className="bg-amber-100 text-slate-800 p-2 rounded-md font-bold"
            onClick={handleSubmit(onSubmit)}>Submit
          </button>
        </div>
        {error && <p className="text-rose-600">{error}</p>}
      </div>
    </main>
  );
}
