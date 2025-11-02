import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://movie-app73-pfnf.vercel.app/';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      const response = await axios.get(`${API_URL}/movies/search`, {
        params: { query }
      });
      setMovies(response.data.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
      alert('Failed to search movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">
          <span style={{ color: '#F5C518' }}>Search</span> Movies
        </h1>
        <p className="lead text-muted">Find your favorite movies</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search for a movie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-warning search-btn" type="submit">
              <i className="bi bi-search me-2"></i>
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Searching...</p>
        </div>
      )}

      {/* Results */}
      {!loading && searched && (
        <div className="mt-5">
          {movies.length > 0 ? (
            <>
              <h3 className="section-title">
                Search Results ({movies.length})
              </h3>
              <div className="row">
                {movies.map((movie) => (
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
                              {movie.release_date?.substring(0, 4) || 'N/A'}
                            </small>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center my-5">
              <i className="bi bi-film display-1 text-muted"></i>
              <h3 className="mt-3">No movies found</h3>
              <p className="text-muted">Try searching with different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;