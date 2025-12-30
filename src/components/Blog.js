import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ResourcePage.css"; // Using the same CSS
import Footer from "./Footer";

function Blog() {
  const API_BASE_URL = "https://nurse-back.onrender.com";
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  
  const blogSectionRef = useRef(null);
  const INITIAL_BLOGS_COUNT = 4;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const blogRes = await fetch(`${API_BASE_URL}/blog`);
        
        if (!blogRes.ok) {
          throw new Error("Failed to load blog posts.");
        }

        const blogData = await blogRes.json();
        setBlogs(blogData.blogPosts || []);

      } catch (err) {
        console.error("Error loading blog posts:", err);
        setError(`Failed to load blog posts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [API_BASE_URL]);

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const toggleBlogs = () => {
    if (showAllBlogs && blogSectionRef.current) {
      blogSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowAllBlogs(!showAllBlogs);
  };

  const displayedBlogs = showAllBlogs ? blogs : blogs.slice(0, INITIAL_BLOGS_COUNT);

  if (loading) {
    return (
      <div className="resource-container">
        <p>Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resource-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="resource-container">
      {/* Blog Posts Section */}
      {blogs.length > 0 && (
        <section className="resource-section" ref={blogSectionRef}>
          <div className="title-container">
            <h2>Blog</h2>
          </div>

          <div className="resource-grid">
            {displayedBlogs.map((post) => (
              <div
                key={post._id}
                className="resource-card blog-card-clickable"
                onClick={() => handleBlogClick(post._id)}
                style={{ cursor: 'pointer' }}
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="resource-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.content?.slice(0, 150)}...</p>
                  {post.postDate && (
                    <small>{new Date(post.postDate).toLocaleDateString()}</small>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* BLOGS SHOW MORE/LESS BUTTON */}
          {blogs.length > INITIAL_BLOGS_COUNT && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                className="show-more-btn"
                onClick={toggleBlogs}
              >
                {showAllBlogs
                  ? '▲ Show Less Blogs'
                  : `▼ Show More Blogs (${blogs.length - INITIAL_BLOGS_COUNT} more)`
                }
              </button>
            </div>
          )}
        </section>
      )}

      {blogs.length === 0 && (
        <div className="resource-section">
          <p>No blog posts available at the moment.</p>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Blog;