'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient.js'
import { v4 as uuidv4 } from 'uuid'
import ProtectedRoute from '../../components/ProtectedRoute'

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
  const router = useRouter()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  // Clear message when component mounts
  useEffect(() => {
    setMessage(null)
  }, [])

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
          console.error('Upload error:', uploadError)
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
        console.error('Insert error:', insertError)
        throw new Error(insertError.message)
      }

      setMessage('✅ School added successfully!')
      reset()
      
      // Force router refresh to ensure clean state
      router.refresh()
      
      // Optional: Redirect to schools page after success
      setTimeout(() => {
        router.push('/schools')
      }, 2000)
      
    } catch (err) {
      console.error(err)
      setMessage(`❌ ${err.message}`)
    }

    setSubmitting(false)
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            ➕ Add New School
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share an amazing educational institution with our community. Help others discover great schools!
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  📋 Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">🏫 School Name</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors bg-white/70 backdrop-blur-sm" 
                      placeholder="Enter school name..."
                      {...register('name')} 
                    />
                    {errors.name && <p className="text-red-500 text-sm flex items-center gap-1">⚠️ {errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">📧 Email Address</label>
                    <input 
                      type="email" 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors bg-white/70 backdrop-blur-sm" 
                      placeholder="school@example.com"
                      {...register('email')} 
                    />
                    {errors.email && <p className="text-red-500 text-sm flex items-center gap-1">⚠️ {errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  📍 Location Details
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">🏠 Full Address</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors bg-white/70 backdrop-blur-sm" 
                      placeholder="123 School Street, Education District..."
                      {...register('address')} 
                    />
                    {errors.address && <p className="text-red-500 text-sm flex items-center gap-1">⚠️ {errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">🏙️ City</label>
                      <input 
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors bg-white/70 backdrop-blur-sm" 
                        placeholder="Enter city name..."
                        {...register('city')} 
                      />
                      {errors.city && <p className="text-red-500 text-sm flex items-center gap-1">⚠️ {errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">🗺️ State</label>
                      <input 
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors bg-white/70 backdrop-blur-sm" 
                        placeholder="Enter state name..."
                        {...register('state')} 
                      />
                      {errors.state && <p className="text-red-500 text-sm flex items-center gap-1">⚠️ {errors.state.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Media */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  📞 Contact & Media
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">📱 Contact Number</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors bg-white/70 backdrop-blur-sm" 
                      placeholder="+1 (555) 123-4567"
                      {...register('contact')} 
                    />
                    {errors.contact && <p className="text-red-500 text-sm flex items-center gap-1">⚠️ {errors.contact.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">📸 School Image</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors bg-white/70 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                      type="file" 
                      accept="image/*" 
                      {...register('image')} 
                    />
                    {errors.image && <p className="text-red-500 text-sm flex items-center gap-1">⚠️ {errors.image.message}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button 
                  disabled={submitting} 
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1" 
                  type="submit"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Adding School...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      🚀 Add School to Directory
                    </span>
                  )}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-xl border-2 ${
                  message.includes('✅') 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <p className="font-medium">{message}</p>
                  {message.includes('✅') && (
                    <p className="text-sm mt-1 opacity-75">Redirecting to schools page...</p>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
