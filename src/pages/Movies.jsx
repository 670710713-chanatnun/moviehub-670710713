// src/pages/Movies.jsx
import { useState, useEffect } from 'react';
import MovieGrid from '../components/MovieGrid';
import { getMovies } from '../api/tmdb';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const loadMovies = async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await getMovies();
      setMovies(data);
      setStatus('success');
    } catch (err) {
      setError(err);
      setStatus('error');
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  // รายการแนวหนังทั้งหมดจากข้อมูลที่มี
  const genres = [...new Set(movies.map((m) => m.genre).filter(Boolean))];

  // กรองหนังตามการค้นหาและแนวที่เลือก
  const shown = movies.filter((m) => {
    const matchQuery = m.title.toLowerCase().includes(query.toLowerCase());
    const matchGenre = !selectedGenre || m.genre === selectedGenre;
    return matchQuery && matchGenre;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">หนังทั้งหมด</h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="ค้นหาชื่อหนัง..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทุกแนว</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <MovieGrid
        movies={shown}
        status={status}
        error={error}
        onRetry={loadMovies}
      />
    </div>
  );
}