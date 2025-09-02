import Image from 'next/image'

export default function SchoolCard({ school }) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
      <div className="relative w-full h-64 overflow-hidden">
        <Image src={school.image_url} alt={school.name} fill className="object-cover " />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{school.name}</h3>
        <p className="text-sm text-gray-600">{school.address}</p>
        <p className="text-sm mt-1">{school.city}</p>
      </div>
    </div>
  )
}
