import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import '../styles/BlogPost.css';

function BlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = "https://nurse-back.onrender.com";
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/blog/${id}`);
        if (!response.ok) {
          throw new Error('Blog post not found');
        }
        const data = await response.json();
        console.log('Fetched blog data:', data);
        
        if (data.blog) {
          setBlog(data.blog);
        } else if (data.blogPost) {
          setBlog(data.blogPost);
        } else {
          setBlog(data);
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Function to format blog content with proper structure
  const formatContent = (content) => {
    if (!content) return null;
    
    const sections = content.split('\n\n');
    
    return sections.map((section, sectionIndex) => {
      const lines = section.split('\n');
      
      // Check if this section has bullet points
      const hasBullets = lines.some(line => line.trim().startsWith('* '));
      
      if (hasBullets) {
        const elements = [];
        let currentText = [];
        let currentBullets = [];
        
        lines.forEach((line, lineIndex) => {
          if (line.trim().startsWith('* ')) {
            // If we have text before bullets, add it as a paragraph
            if (currentText.length > 0) {
              elements.push(
                <p key={`text-${sectionIndex}-${lineIndex}`}>
                  {currentText.join(' ')}
                </p>
              );
              currentText = [];
            }
            // Add to bullet list
            currentBullets.push(line.trim().substring(2));
          } else if (line.trim()) {
            // If we have bullets before text, render them first
            if (currentBullets.length > 0) {
              elements.push(
                <ul key={`ul-${sectionIndex}-${lineIndex}`}>
                  {currentBullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              );
              currentBullets = [];
            }
            currentText.push(line.trim());
          }
        });
        
        // Render any remaining text
        if (currentText.length > 0) {
          elements.push(
            <p key={`text-${sectionIndex}-end`}>
              {currentText.join(' ')}
            </p>
          );
        }
        
        // Render any remaining bullets
        if (currentBullets.length > 0) {
          elements.push(
            <ul key={`ul-${sectionIndex}-end`}>
              {currentBullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          );
        }
        
        return <div key={sectionIndex}>{elements}</div>;
      } else {
        // Regular paragraph without bullets
        return section.trim() ? (
          <p key={sectionIndex}>{section}</p>
        ) : null;
      }
    });
  };

  if (loading) {
    return (
      <div className="blog-page-container">
        <div className="blog-detail-loading">
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-page-container">
        <div className="blog-detail-error">
          <p>Error: {error}</p>
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-page-container">
        <div className="blog-detail-error">
          <p>Blog post not found</p>
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page-container">
      {/* Back Button */}
      <div className="blog-detail-back">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to Blog
        </button>
      </div>

      {/* Hero Section */}
      <section className="blog-detail-hero">
        <div className="blog-detail-hero-content">
          <h1 className="blog-detail-title">{blog.title}</h1>
          {blog.postDate && (
            <p className="blog-detail-date">
              {new Date(blog.postDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          )}
          <div className="blog-detail-divider"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="blog-detail-main">
        <div className="blog-detail-wrapper">
          {blog.imageUrl && (
            <div className="blog-header-image-container">
              <img 
                src={blog.imageUrl} 
                alt={blog.title} 
                className="blog-header-image"
                onError={(e) => {
                  console.log('Image failed to load:', blog.imageUrl);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <article className="blog-post">
            <div className="blog-content">
              {formatContent(blog.content)}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BlogPage;