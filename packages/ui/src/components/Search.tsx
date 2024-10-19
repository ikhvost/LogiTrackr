import { useState } from 'react'

interface Props {
  onSearch: (query: string) => void
}

export const Search = ({ onSearch }: Props) => {
  const [query, setQuery] = useState('')
  const handleSearch = () => onSearch(query)

  return (
    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
      <input
        type="text"
        placeholder="Search by ID or type..."
        className="w-full md:w-3/4 p-4 rounded-full border-0 focus:ring-2 focus:ring-indigo-300 transition text-gray-700 text-lg"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out"
      >
        Search
      </button>
    </div>
  )
}
