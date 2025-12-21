import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader } from 'lucide-react'
import { getSearchIndex } from '@/services/SearchService'
import type { SearchResult } from '@/services/SearchService'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    // 模拟搜索延迟
    const timer = setTimeout(() => {
      const searchIndex = getSearchIndex()
      const searchResults = searchIndex.search(query, 8)
      setResults(searchResults)
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url)
    setIsOpen(false)
    setQuery('')
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      building: '建筑',
      knowledge: '知识',
      province: '省份',
    }
    return labels[type] || type
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="搜索建筑、知识..."
          className="w-full rounded-lg border border-ink-gray/20 bg-paper-white px-4 py-2 pl-10 pr-10 text-sm text-ink-black placeholder-ink-gray/50 transition-all focus:border-vermilion focus:outline-none focus:ring-1 focus:ring-vermilion"
        />

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-gray/50" />

        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-ink-gray/10"
          >
            <X className="h-4 w-4 text-ink-gray/50" />
          </button>
        )}

        {isLoading && (
          <Loader className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-vermilion" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-ink-gray/20 bg-paper-white shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center px-4 py-8">
                <Loader className="h-5 w-5 animate-spin text-vermilion" />
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleResultClick(result)}
                    className="w-full border-b border-ink-gray/10 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-ink-gray/5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-ink-black">{result.title}</p>
                        {result.description && (
                          <p className="mt-1 line-clamp-1 text-sm text-ink-gray">
                            {result.description}
                          </p>
                        )}
                      </div>
                      <span className="flex-shrink-0 rounded-full bg-vermilion/10 px-2 py-0.5 text-xs text-vermilion">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : query ? (
              <div className="px-4 py-8 text-center text-ink-gray/50">
                <p>未找到匹配结果</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
