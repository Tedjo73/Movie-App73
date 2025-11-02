import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://movie-app73-pfnf.vercel.app/';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const [popular, topRated, nowPlaying] = await Promise.all([
        axios.get(`${API_URL}/movies/popular`),
        axios.get(`${API_URL}/movies/top-rated`),
        axios.get(`${API_URL}/movies/now-playing`)
      ]);
      
      setPopularMovies(popular.data.results.slice(0, 6));
      setTopRatedMovies(topRated.data.results.slice(0, 6));
      setNowPlayingMovies(nowPlaying.data.results.slice(0, 6));
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieCard = (movie) => (
    <div key={movie.id} className="col-md-6 col-lg-4 col-xl-2 mb-4">
      <Link to={`/movie/${movie.id}`} className="text-decoration-none">
        <div className="movie-card">
          <img
            src={
              movie.poster_path
                ? `${IMAGE_BASE_URL}${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Poster'
            }
            alt={movie.title}
            className="movie-poster"
          />
          <div className="movie-card-body">
            <h6 className="movie-title">{movie.title}</h6>
            <div className="d-flex justify-content-between align-items-center">
              <span className="rating-badge">
                <i className="bi bi-star-fill"></i>
                {movie.vote_average.toFixed(1)}
              </span>
              <small className="text-muted">
                {movie.release_date?.substring(0, 4)}
              </small>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">
          <span style={{ color: '#F5C518' }}>Discover</span> Movies
        </h1>
        <p className="lead text-muted">
          Browse movies, read reviews, and share your opinions
        </p>
      </div>

      {/* Now Playing */}
      <section className="mb-5">
        <h2 className="section-title">Now Playing</h2>
        <div className="row">
          {nowPlayingMovies.map(renderMovieCard)}
        </div>
      </section>

      {/* Popular Movies */}
      <section className="mb-5">
        <h2 className="section-title">Popular Movies</h2>
        <div className="row">
          {popularMovies.map(renderMovieCard)}
        </div>
      </section>

      {/* Top Rated */}
      <section className="mb-5">
        <h2 className="section-title">Top Rated</h2>
        <div className="row">
          {topRatedMovies.map(renderMovieCard)}
        </div>
      </section>
    </div>
  );
}

export default Home;