import Image from 'next/image'

export default function SchoolCard({ school }) {
  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 card-hover">
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-3xl">
        <Image 
          src={school.image_url} 
          alt={school.name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Floating badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          📍 {school.city}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {school.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-gray-600">
            <span className="text-sm mt-0.5">📍</span>
            <p className="text-sm leading-relaxed line-clamp-2">{school.address}</p>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-sm">🏙️</span>
            <p className="text-sm font-medium">{school.city}, {school.state}</p>
          </div>
          
          {school.contact && (
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm">📞</span>
              <p className="text-sm">{school.contact}</p>
            </div>
          )}
          
          {school.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm">📧</span>
              <p className="text-sm truncate">{school.email}</p>
            </div>
          )}
        </div>
        
        {/* Action button */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Added {new Date(school.created_at).toLocaleDateString()}
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:shadow-lg hover:shadow-indigo-500/25">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}
