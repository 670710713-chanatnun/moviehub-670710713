// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { getMovies } from '../api/tmdb';
import FeaturedCarousel from '../components/FeaturedCarousel';
import MovieGrid from '../components/MovieGrid';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getMovies();
        setMovies(data);
        setStatus('success');
      } catch (err) {
        setError(err);
        setStatus('error');
      }
    }
    loadData();
  }, []);

  // สุ่มหนังแนะนำ 5 เรื่อง
  const featured = [...movies].sort(() => 0.5 - Math.random()).slice(0, 5);

  return (
    <div className="space-y-8">
      {status === 'success' && featured.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-800">หนังแนะนำสุ่มจาก TMDB</h2>
          <FeaturedCarousel movies={featured} />
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-800">หนังกำลังฉายล่าสุด</h2>
        <MovieGrid movies={movies.slice(0, 8)} status={status} error={error} />
      </section>
    </div>
  );
}