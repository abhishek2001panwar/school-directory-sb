import SchoolCard from '../../components/SchoolCard'
import { supabase } from '../../lib/supabaseClient.js'

export const revalidate = 0

export default async function SchoolsPage() {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Schools</h1>
        <p className="text-red-600">Failed to load schools: {error.message}</p>
      </div>
    )
  }

  const schools = data || []

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Schools</h1>
      {schools.length === 0 ? (
        <p className="text-gray-600">No schools yet. Add one from the "Add School" page.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {schools.map(s => <SchoolCard key={s.id} school={s} />)}
        </div>
      )}
    </div>
  )
}
