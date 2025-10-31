import React, { useState, useEffect } from 'react';
import { Search, Star, Plus, Edit2, Trash2, User } from 'lucide-react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

const MovieReviewApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('userName') || '');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({ userName: '', rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrendingMovies();
    fetchAllReviews();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('userName', currentUser);
    }
  }, [currentUser]);

  const fetchTrendingMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/movies/trending`);
      const data = await response.json();
      setMovies(data.results.slice(0, 12));
    } catch (error) {
      console.error('Error fetching movies:', error);
      const response = await fetch(
        'https://api.themoviedb.org/3/trending/movie/week?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb'
      );
      const data = await response.json();
      setMovies(data.results.slice(0, 12));
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const searchMovies = async (query) => {
    if (!query.trim()) {
      fetchTrendingMovies();
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/movies/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setMovies(data.results.slice(0, 12));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies(searchQuery);
    setCurrentPage('movies');
  };

  const openMovieDetails = (movie) => {
    setSelectedMovie(movie);
    setCurrentPage('movieDetail');
  };

  const handleCreateReview = async () => {
    if (!formData.userName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!formData.comment.trim()) {
      alert('Please write a review');
      return;
    }
    
    const newReview = {
      movieId: selectedMovie.id,
      movieTitle: selectedMovie.title,
      userName: formData.userName,
      rating: formData.rating,
      comment: formData.comment
    };
    
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      
      const createdReview = await response.json();
      setReviews([createdReview, ...reviews]);
      setCurrentUser(formData.userName);
      setFormData({ userName: formData.userName, rating: 5, comment: '' });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error creating review:', error);
      alert('Failed to create review. Please try again.');
    }
  };

  const handleUpdateReview = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews/${editingReview.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: formData.rating,
          comment: formData.comment
        })
      });
      
      const updatedReview = await response.json();
      setReviews(reviews.map(r => r.id === editingReview.id ? updatedReview : r));
      setEditingReview(null);
      setFormData({ userName: currentUser, rating: 5, comment: '' });
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    
    try {
      await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const startEdit = (review) => {
    setEditingReview(review);
    setFormData({ userName: review.userName, rating: review.rating, comment: review.comment });
  };

  const getMovieReviews = (movieId) => {
    return reviews.filter(r => r.movieId === movieId);
  };

  const getUserReviews = () => {
    return reviews.filter(r => r.userName === currentUser);
  };

  const HomePage = () => (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome.</h1>
          <p>Millions of movies, TV shows and people to discover. Explore now.</p>
          <div className="search-bar-hero">
            <input
              type="text"
              placeholder="Search for a movie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="trending-header">
          <h2>Trending</h2>
          <div className="trending-tabs">
            <button className="active">Today</button>
            <button>This Week</button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : (
          <div className="movies-grid">
            {movies.map(movie => (
              <div key={movie.id} onClick={() => openMovieDetails(movie)} className="movie-card">
                <div className="movie-poster">
                  <img 
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450/1e293b/64748b?text=No+Image'}
                    alt={movie.title}
                  />
                  <div className="movie-rating">
                    <Star className="star-icon" />
                    {(movie.vote_average || 0).toFixed(1)}
                  </div>
                </div>
                <h3>{movie.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const MoviesPage = () => (
    <div className="movies-page">
      <div className="container">
        <h1>Discover Movies</h1>
        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : (
          <div className="movies-grid">
            {movies.map(movie => (
              <div key={movie.id} onClick={() => openMovieDetails(movie)} className="movie-card">
                <img 
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450/1e293b/64748b?text=No+Image'}
                  alt={movie.title}
                />
                <h3>{movie.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const MovieDetailPage = () => {
    const movieReviews = getMovieReviews(selectedMovie.id);
    const avgRating = movieReviews.length > 0 
      ? (movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length).toFixed(1)
      : 'N/A';

    return (
      <div className="movie-detail-page">
        <div 
          className="movie-hero"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(15,23,42,1)), url(${selectedMovie.backdrop_path ? `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200'})`,
          }}>
          <div className="container">
            <div className="movie-hero-content">
              <img 
                src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : 'https://via.placeholder.com/300x450'}
                alt={selectedMovie.title}
                className="movie-hero-poster"
              />
              <div className="movie-hero-info">
                <h1>{selectedMovie.title}</h1>
                <div className="movie-stats">
                  <span className="stat">
                    <Star className="star-icon-filled" />
                    {(selectedMovie.vote_average || 0).toFixed(1)}
                  </span>
                  <span>User Rating: {avgRating}</span>
                  <span>{movieReviews.length} Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="overview-section">
            <h2>Overview</h2>
            <p>{selectedMovie.overview || 'No overview available.'}</p>
          </div>

          <div className="reviews-header">
            <h2>Reviews</h2>
            <button 
              onClick={() => {
                setFormData({ userName: currentUser, rating: 5, comment: '' });
                setShowReviewForm(true);
              }} 
              className="btn-primary">
              <Plus className="icon" /> Write Review
            </button>
          </div>

          {showReviewForm && (
            <div className="review-form">
              <h3>Write Your Review</h3>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-buttons">
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <button
                      key={i}
                      onClick={() => setFormData({...formData, rating: i})}
                      className={formData.rating >= i ? 'rating-btn active' : 'rating-btn'}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  rows="4"
                  placeholder="Share your thoughts about this movie..."
                />
              </div>
              <div className="form-actions">
                <button onClick={handleCreateReview} className="btn-primary">Submit Review</button>
                <button onClick={() => setShowReviewForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          )}

          <div className="reviews-list">
            {movieReviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-user">
                    <div className="user-avatar">{review.userName.charAt(0)}</div>
                    <div className="user-info">
                      <h4>{review.userName}</h4>
                      <div className="review-meta">
                        <div className="review-rating">
                          <Star className="star-icon-filled" />
                          <span>{review.rating}/10</span>
                        </div>
                        <span className="review-date">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {currentUser && review.userName === currentUser && (
                    <div className="review-actions">
                      <button onClick={() => startEdit(review)} className="btn-icon edit">
                        <Edit2 />
                      </button>
                      <button onClick={() => handleDeleteReview(review.id)} className="btn-icon delete">
                        <Trash2 />
                      </button>
                    </div>
                  )}
                </div>
                {editingReview?.id === review.id ? (
                  <div className="edit-review">
                    <div className="rating-buttons">
                      {[1,2,3,4,5,6,7,8,9,10].map(i => (
                        <button
                          key={i}
                          onClick={() => setFormData({...formData, rating: i})}
                          className={formData.rating >= i ? 'rating-btn-sm active' : 'rating-btn-sm'}>
                          {i}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => setFormData({...formData, comment: e.target.value})}
                      rows="3"
                    />
                    <div className="edit-actions">
                      <button onClick={handleUpdateReview} className="btn-sm-primary">Save</button>
                      <button onClick={() => setEditingReview(null)} className="btn-sm-secondary">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="review-text">{review.comment}</p>
                )}
              </div>
            ))}
            {movieReviews.length === 0 && (
              <div className="empty-state">
                <p>No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ReviewsPage = () => (
    <div className="reviews-page">
      <div className="container">
        <h1>All Reviews</h1>
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header-simple">
                <div>
                  <h3>{review.movieTitle}</h3>
                  <div className="review-meta">
                    <span className="review-author">{review.userName}</span>
                    <div className="review-rating">
                      <Star className="star-icon-filled" />
                      <span>{review.rating}/10</span>
                    </div>
                    <span className="review-date">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="review-text">{review.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="empty-state">
              <p>No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ProfilePage = () => {
    if (!currentUser) {
      return (
        <div className="profile-page">
          <div className="container">
            <div className="empty-state">
              <User size={64} />
              <p>Set your name by writing a review!</p>
            </div>
          </div>
        </div>
      );
    }

    const userReviews = getUserReviews();
    
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-header">
            <div className="profile-avatar-large">{currentUser.charAt(0)}</div>
            <div className="profile-info">
              <h1>{currentUser}</h1>
              <p className="profile-stats">{userReviews.length} Reviews</p>
            </div>
          </div>

          <h2>My Reviews</h2>
          <div className="reviews-list">
            {userReviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header-simple">
                  <div>
                    <h3>{review.movieTitle}</h3>
                    <div className="review-meta">
                      <div className="review-rating">
                        <Star className="star-icon-filled" />
                        <span>{review.rating}/10</span>
                      </div>
                      <span className="review-date">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="review-actions">
                    <button onClick={() => startEdit(review)} className="btn-icon edit">
                      <Edit2 />
                    </button>
                    <button onClick={() => handleDeleteReview(review.id)} className="btn-icon delete">
                      <Trash2 />
                    </button>
                  </div>
                </div>
                {editingReview?.id === review.id ? (
                  <div className="edit-review">
                    <div className="rating-buttons">
                      {[1,2,3,4,5,6,7,8,9,10].map(i => (
                        <button
                          key={i}
                          onClick={() => setFormData({...formData, rating: i})}
                          className={formData.rating >= i ? 'rating-btn-sm active' : 'rating-btn-sm'}>
                          {i}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => setFormData({...formData, comment: e.target.value})}
                      rows="3"
                    />
                    <div className="edit-actions">
                      <button onClick={handleUpdateReview} className="btn-sm-primary">Save</button>
                      <button onClick={() => setEditingReview(null)} className="btn-sm-secondary">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="review-text">{review.comment}</p>
                )}
              </div>
            ))}
            {userReviews.length === 0 && (
              <div className="empty-state">
                <p>You haven't written any reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="nav-left">
              <h1 className="logo" onClick={() => setCurrentPage('home')}>MovieHub</h1>
              <div className="nav-links">
                <button onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'active' : ''}>
                  Home
                </button>
                <button onClick={() => setCurrentPage('movies')} className={currentPage === 'movies' ? 'active' : ''}>
                  Movies
                </button>
                <button onClick={() => setCurrentPage('reviews')} className={currentPage === 'reviews' ? 'active' : ''}>
                  Reviews
                </button>
              </div>
            </div>
            <div className="nav-right">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                />
                <button onClick={handleSearch}>
                  <Search />
                </button>
              </div>
              {currentUser && (
                <button onClick={() => setCurrentPage('profile')} className="profile-btn">
                  <User />
                  <span>{currentUser}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {currentPage === 'home' && <HomePage />}
      {currentPage === 'movies' && <MoviesPage />}
      {currentPage === 'movieDetail' && selectedMovie && <MovieDetailPage />}
      {currentPage === 'reviews' && <ReviewsPage />}
      {currentPage === 'profile' && <ProfilePage />}
    </div>
  );
};

export default MovieReviewApp;