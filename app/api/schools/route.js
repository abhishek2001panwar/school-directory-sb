import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'schoolImages'

export async function GET() {
  const { data, error } = await supabase.from('schools').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ schools: data })
}

export async function POST(req) {
  try {
    const form = await req.formData()

    const name = String(form.get('name') || '')
    const address = String(form.get('address') || '')
    const city = String(form.get('city') || '')
    const state = String(form.get('state') || '')
    const contact = String(form.get('contact') || '')
    const email_id = String(form.get('email_id') || '')
    const file = form.get('image')

    if (!name || !address || !city || !state || !contact || !email_id || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.${fileExt}`
    const filePath = `schools/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, Buffer.from(arrayBuffer), {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
    const publicUrl = publicData.publicUrl

    const { data, error } = await supabase.from('schools').insert({ name, address, city, state, contact, email_id, image: publicUrl }).select('*').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ school: data }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
