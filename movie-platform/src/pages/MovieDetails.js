import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

function MovieDetails({ user }) {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/reviews/${id}`);
      setReviews(response.data);
      
      if (response.data.length > 0) {
        const avg = response.data.reduce((sum, review) => sum + review.rating, 0) / response.data.length;
        setAverageRating(avg.toFixed(1));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <i
          key={i}
          className={`bi bi-star${i <= fullStars ? '-fill' : ''}`}
        ></i>
      );
    }
    return stars;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    try {
      if (timestamp._seconds) {
        const date = new Date(timestamp._seconds * 1000);
        return date.toLocaleDateString();
      }
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Recently';
    }
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">Movie not found</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="movie-hero" 
        style={{
          backgroundImage: movie.backdrop_path 
            ? `url(${BACKDROP_URL}${movie.backdrop_path})` 
            : 'none'
        }}
      >
        <div className="movie-hero-content">
          <div className="container">
            <Link to="/" className="btn btn-outline-warning mb-4">
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </Link>
            
            <div className="row">
              <div className="col-md-4">
                <img
                  src={
                    movie.poster_path
                      ? `${IMAGE_BASE_URL}${movie.poster_path}`
                      : 'https://via.placeholder.com/300x450?text=No+Poster'
                  }
                  alt={movie.title}
                  className="movie-poster-large"
                />
              </div>
              
              <div className="col-md-8">
                <div className="movie-info">
                  <h1>{movie.title}</h1>
                  
                  <div className="movie-meta">
                    <span className="rating-badge me-3">
                      <i className="bi bi-star-fill"></i>
                      {movie.vote_average.toFixed(1)}/10
                    </span>
                    <span className="me-3">
                      {movie.release_date?.substring(0, 4)}
                    </span>
                    {movie.runtime && (
                      <span className="me-3">
                        {formatRuntime(movie.runtime)}
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    {movie.genres?.map((genre) => (
                      <span key={genre.id} className="genre-badge">
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  <p className="lead">{movie.overview}</p>

                  {user && (
                    <Link
                      to={`/add-review/${id}`}
                      state={{ 
                        movieTitle: movie.title,
                        moviePoster: movie.poster_path
                      }}
                      className="btn btn-warning btn-lg mt-3"
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Write a Review
                    </Link>
                  )}
                  
                  {!user && (
                    <div className="mt-3">
                      <Link to="/login" className="btn btn-outline-warning">
                        Login to Write a Review
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container my-5">
        <div className="reviews-section">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>User Reviews ({reviews.length})</h2>
            {reviews.length > 0 && (
              <div className="text-end">
                <h4 className="mb-0">
                  <span className="star-rating me-2">
                    {renderStars(Math.round(averageRating))}
                  </span>
                  <span>{averageRating}/10</span>
                </h4>
              </div>
            )}
          </div>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div>
                    <h5 className="review-author">{review.userName || 'Anonymous'}</h5>
                    <div className="star-rating">
                      {renderStars(review.rating)}
                      <span className="ms-2">{review.rating}/10</span>
                    </div>
                  </div>
                  <small className="text-muted">
                    {formatDate(review.createdAt)}
                  </small>
                </div>
                <p className="review-text">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No reviews yet. Be the first to review this movie!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;