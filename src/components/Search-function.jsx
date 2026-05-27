import React from 'react'

function SearchFunction({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-function">
      {/* Search box updates the parent AnimationGrid state */}
      <input
        type="search"
        placeholder="Search by title, category, or tag"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}

export default SearchFunction