// src/pages/MovieDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovie } from '../api/tmdb';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchDetail() {
      setStatus('loading');
      setError(null);
      try {
        const data = await getMovie(id);
        if (!ignore) {
          setMovie(data);
          setStatus('success');
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
          setStatus('error');
        }
      }
    }

    fetchDetail();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (status === 'loading') {
    return <div className="py-20 text-center text-slate-500">กำลังโหลดข้อมูล...</div>;
  }

  if (status === 'error') {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <p>เกิดข้อผิดพลาด: {error?.message}</p>
        <Link to="/movies" className="mt-4 inline-block text-sm text-blue-600 underline">
          กลับไปหน้าหนังทั้งหมด
        </Link>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="space-y-6">
      <Link to="/movies" className="text-sm font-medium text-blue-600 hover:underline">
        &larr; กลับไปหน้าค้นหา
      </Link>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="overflow-hidden rounded-xl bg-slate-100">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} className="w-full object-cover" />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center text-slate-400">
              ไม่มีรูปภาพ
            </div>
          )}
        </div>

        <div className="space-y-4 md:col-span-2">
          <h1 className="text-3xl font-bold text-slate-800">{movie.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {movie.year && <span>ปี {movie.year}</span>}
            {movie.genre && <span className="rounded bg-slate-100 px-2 py-1">{movie.genre}</span>}
            {movie.rating && <span className="font-semibold text-amber-500">★ {movie.rating}</span>}
          </div>
          <p className="text-slate-600 leading-relaxed">{movie.detail}</p>
        </div>
      </div>
    </div>
  );
}