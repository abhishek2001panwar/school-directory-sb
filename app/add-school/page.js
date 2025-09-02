'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient.js'
import { v4 as uuidv4 } from 'uuid'

const schema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  contact: z.string().min(7),
  email: z.string().email(),
  image: z.any().refine(files => files && files.length === 1, 'Image is required')
})

export default function AddSchoolPage() {
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (values) => {
    setSubmitting(true)
    setMessage(null)

    try {
      const file = values.image[0]
      let imageUrl = null

      if (file) {
        // unique filename
        const fileName = `${uuidv4()}-${file.name}`

        // upload to bucket
        const { error: uploadError } = await supabase.storage
          .from('school-image') // bucket name
          .upload(fileName, file, {
            contentType: file.type,
          })

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        // get public URL
        const { data: publicUrlData } = supabase.storage
          .from('school-image')
          .getPublicUrl(fileName)

        imageUrl = publicUrlData.publicUrl
      }

      // insert into schools table
      const { error: insertError } = await supabase.from('schools').insert([
        {
          name: values.name,
          address: values.address,
          city: values.city,
          state: values.state,
          contact: values.contact,
          email: values.email,
          image_url: imageUrl,
        },
      ])

      if (insertError) {
        throw new Error(insertError.message)
      }

      setMessage('✅ School added successfully!')
      reset()
    } catch (err) {
      console.error(err)
      setMessage(`❌ ${err.message}`)
    }

    setSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Add School</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-2xl shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input className="mt-1 w-full border rounded-xl px-3 py-2" {...register('name')} />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="mt-1 w-full border rounded-xl px-3 py-2" {...register('email')} />
            {errors.email_id && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Address</label>
            <input className="mt-1 w-full border rounded-xl px-3 py-2" {...register('address')} />
            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input className="mt-1 w-full border rounded-xl px-3 py-2" {...register('city')} />
            {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">State</label>
            <input className="mt-1 w-full border rounded-xl px-3 py-2" {...register('state')} />
            {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Contact</label>
            <input className="mt-1 w-full border rounded-xl px-3 py-2" {...register('contact')} />
            {errors.contact && <p className="text-red-600 text-sm mt-1">{errors.contact.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">School Image</label>
            <input className="mt-1 w-full" type="file" accept="image/*" {...register('image')} />
            {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>}
          </div>
        </div>
        <button disabled={submitting} className="w-full sm:w-auto px-5 py-2 rounded-xl bg-black text-white disabled:opacity-60" type="submit">
          {submitting ? 'Saving...' : 'Save School'}
        </button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  )
}
