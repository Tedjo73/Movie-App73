import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200';

function Dashboard({ user }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/user-reviews/${user.uid}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        params: { userId: user.uid }
      });
      
      setReviews(reviews.filter(review => review.id !== reviewId));
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = Number(rating) || 0;
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <i
          key={i}
          className={`bi bi-star${i <= numRating ? '-fill' : ''}`}
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

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="dashboard-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="display-5 mb-2">My Reviews</h1>
            <p className="text-muted mb-0">
              Manage your movie reviews
            </p>
          </div>
          <Link to="/" className="btn btn-outline-warning">
            <i className="bi bi-house me-2"></i>
            Back to Home
          </Link>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="row">
          {reviews.map((review) => (
            <div key={review.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="d-flex">
                  {review.moviePoster && (
                    <img
                      src={`${IMAGE_BASE_URL}${review.moviePoster}`}
                      alt={review.movieTitle}
                      style={{
                        width: '100px',
                        height: '150px',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <div className="card-body" style={{ flex: 1 }}>
                    <h5 className="card-title">{review.movieTitle}</h5>
                    <div className="star-rating mb-3">
                      {renderStars(review.rating)}
                      <span className="ms-2">{review.rating}/10</span>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text">{review.comment}</p>
                  <small className="text-muted">
                    {formatDate(review.createdAt)}
                  </small>
                </div>
                <div className="card-footer">
                  <div className="d-flex gap-2">
                    <Link
                      to={`/edit-review/${review.id}`}
                      state={{ review }}
                      className="btn btn-sm btn-outline-primary flex-grow-1"
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="btn btn-sm btn-outline-danger flex-grow-1"
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                  <Link
                    to={`/movie/${review.movieId}`}
                    className="btn btn-sm btn-link w-100 mt-2"
                  >
                    View Movie
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center my-5">
          <i className="bi bi-journal-x display-1 text-muted"></i>
          <h3 className="mt-3">No Reviews Yet</h3>
          <p className="text-muted">Start watching movies and share your opinions!</p>
          <Link to="/" className="btn btn-warning mt-3">
            <i className="bi bi-film me-2"></i>
            Discover Movies
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard