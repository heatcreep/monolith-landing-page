'use client';
import { useForm } from 'react-hook-form'
import { supabase } from "../supabase-client";
import { useState } from 'react';
import toast from 'react-hot-toast';

interface FormData {
  email: string;
}

export default function Home() {
  const { register, handleSubmit } = useForm<FormData>();

  const [loading, setLoading] = useState(false)

  const onSubmit = async (formData: FormData) => {
    setLoading(true)
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

      if (resendError) {
        toast.error('Error sending email:', resendError.message)
      } else {
        toast.success('Thanks! Please check your email for a confirmation link to delete your account.')
      }
    } else {
      toast.error('No user found with that email.')
    }
    setLoading(false)
  }


  return (
    <>
      <h1 className='text-3xl'>We&apos;re sorry to see you go!</h1>
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
          disabled={loading}
          className="bg-amber-100 text-slate-800 disabled:bg-slate-50 p-2 rounded-md font-bold"
          onClick={handleSubmit(onSubmit)}>Submit
        </button>
      </div>
    </>
  );
}
