import { useState } from 'react'

function SearchBar({ onSearch, onReset }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('name')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) {
      onReset()
      return
    }
    onSearch(type, query.trim())
  }

  const handleClear = () => {
    setQuery('')
    onReset()
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="name">Search by Name</option>
        <option value="course">Search by Course</option>
      </select>
      <input
        type="text"
        placeholder={`Enter ${type}...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="btn btn-primary btn-small">Search</button>
      <button type="button" className="btn btn-secondary btn-small" onClick={handleClear}>Clear</button>
    </form>
  )
}

export default SearchBar
