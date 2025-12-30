import React, { useState, useEffect, useCallback } from "react";
import "../styles/Admin.css";

function Admin() {
  // --- State Variables ---
  const [files, setFiles] = useState([]);
  const [section, setSection] = useState("testimonials");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [stars, setStars] = useState(0);
  const [testimonial, setTestimonial] = useState("");
  const [address, setAddress] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  
  // --- Edit Mode State ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const API_BASE_URL = "https://nurse-back.onrender.com";

  // --- Handlers for Input Changes ---
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setMessage("");
    if (selectedFiles.length > 0) {
      const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
      let fileType = 'file';
      if (selectedFiles[0].type.startsWith('video/')) fileType = 'video';
      else if (selectedFiles[0].type.startsWith('image/')) fileType = 'image';
      else if (selectedFiles[0].type === 'application/pdf') fileType = 'PDF';
      setMessage(`Selected: ${selectedFiles.length} ${fileType}(s) (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
    }
  };

  const handleSectionChange = (e) => {
    const newSection = e.target.value;
    setSection(newSection);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setName("");
    setLink("");
    setStars(0);
    setTestimonial("");
    setAddress("");
    setText("");
    setDate("");
    setFiles([]);
    setMessage("");
    setIsEditMode(false);
    setEditingItemId(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // --- Helper Function to Get Dynamic Labels ---
  const getFieldInfo = useCallback(() => {
    switch (section) {
      case "testimonials":
        return { 
          name: "Customer Name",
          testimonial: "Testimonial Text",
          stars: "Star Rating (0-5)",
          requiresImage: false,
          requiresName: true,
          requiresTestimonial: true,
          acceptVideo: false,
          imageOptional: true
        };
      case "home-video":
        return { 
          title: "Video Title",
          description: "Video Description (Optional)",
          requiresVideo: true,
          requiresTitle: true,
          acceptVideo: true
        };
      case "home-services":
        return { 
          title: "Service Title",
          description: "Service Description",
          requiresImage: false,
          requiresTitle: true,
          requiresDescription: true,
          acceptVideo: false,
          imageOptional: true
        };
      case "services":
        return { 
          title: "Service Title",
          description: "Service Description (Can be long)",
          requiresImage: true,
          requiresTitle: true,
          requiresDescription: true,
          acceptVideo: false
        };
      case "about-video":
        return { 
          title: "Video Title",
          description: "Video Description (Optional)",
          requiresVideo: true,
          requiresTitle: true,
          acceptVideo: true
        };
      case "address":
        return { 
          address: "Company Address",
          requiresAddress: true,
          requiresImage: false,
          requiresVideo: false
        };
      case "social":
        return { 
          name: "Social Media Name",
          link: "URL Link",
          requiresImage: true,
          requiresName: true,
          requiresLink: true,
          acceptVideo: false
        };
      case "blog":
        return { 
          title: "Blog Post Title",
          text: "Blog Post Content",
          date: "Publication Date (Optional)",
          requiresTitle: true,
          requiresText: true,
          requiresImage: false,
          acceptVideo: false,
          imageOptional: true
        };
      case "pdf":
        return { 
          title: "PDF Document Title",
          description: "Document Description",
          requiresTitle: true,
          requiresDescription: true,
          requiresPDF: true,
          acceptPDF: true
        };
      default:
        return { title: "Title" };
    }
  }, [section]);

  // --- Edit Item ---
  const editItem = (item) => {
    setIsEditMode(true);
    setEditingItemId(item._id);
    
    // Populate form fields based on section
    if (section === "testimonials") {
      setName(item.name || "");
      setTestimonial(item.testimonial || "");
      setStars(item.stars || 0);
    } else if (section === "address") {
      setAddress(item.address || "");
    } else if (section === "social") {
      setName(item.name || "");
      setLink(item.link || "");
    } else if (section === "blog") {
      setTitle(item.title || "");
      setText(item.content || "");
      setDate(item.postDate ? new Date(item.postDate).toISOString().split('T')[0] : "");
    } else {
      setTitle(item.title || "");
      setDescription(item.description || "");
    }
    
    setMessage(`✏️ Editing mode: Update the fields and click "Update" to save changes.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- File Upload/Update Logic ---
  const handleUpload = async () => {
    const fieldInfo = getFieldInfo();

    // Special handling for address
    if (section === "address") {
      if (!address.trim()) {
        setMessage("❌ Please enter an address");
        return;
      }

      setIsUploading(true);
      setMessage("⏳ Processing...");

      try {
        const endpoint = isEditMode 
          ? `${API_BASE_URL}/address/${editingItemId}`
          : `${API_BASE_URL}/address`;
        
        const method = isEditMode ? "PUT" : "POST";
        
        const res = await fetch(endpoint, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: address.trim() }),
        });
        const data = await res.json();

        if (res.ok) {
          setMessage(`✅ Address ${isEditMode ? 'updated' : 'saved'} successfully!`);
          resetForm();
          loadItems();
          loadStats();
        } else {
          setMessage(`❌ Operation failed: ${data.error || "Unknown error"}`);
        }
      } catch (err) {
        console.error("Operation error:", err);
        setMessage("❌ Operation failed: Network error.");
      } finally {
        setIsUploading(false);
      }
      return;
    }

    // Validation for edit mode - files are optional when editing
    if (!isEditMode) {
      if (!fieldInfo.imageOptional && !fieldInfo.requiresPDF && (!files || files.length === 0)) {
        setMessage("❌ Please select a file first!");
        return;
      }

      if (fieldInfo.requiresPDF && (!files || files.length === 0)) {
        setMessage("❌ Please select a PDF file!");
        return;
      }
    }

    // Check file type if files are provided
    if (files && files.length > 0) {
      if (fieldInfo.acceptVideo) {
        const allVideos = files.every(f => f.type.startsWith('video/'));
        if (!allVideos) {
          setMessage("❌ Please select only video files!");
          return;
        }
      } else if (fieldInfo.acceptPDF) {
        const allPDFs = files.every(f => f.type === 'application/pdf');
        if (!allPDFs) {
          setMessage("❌ Please select only PDF files!");
          return;
        }
      } else {
        const allImages = files.every(f => f.type.startsWith('image/'));
        if (!allImages && !fieldInfo.imageOptional) {
          setMessage("❌ Please select only image files!");
          return;
        }
      }
    }

    // Field validations
    if (fieldInfo.requiresTitle && !title.trim()) {
      setMessage(`❌ Please enter ${fieldInfo.title.toLowerCase()}`);
      return;
    }

    if (fieldInfo.requiresDescription && !description.trim()) {
      setMessage(`❌ Please enter ${fieldInfo.description.toLowerCase()}`);
      return;
    }

    if (fieldInfo.requiresName && !name.trim()) {
      setMessage(`❌ Please enter ${fieldInfo.name.toLowerCase()}`);
      return;
    }

    if (fieldInfo.requiresLink && !link.trim()) {
      setMessage(`❌ Please enter ${fieldInfo.link.toLowerCase()}`);
      return;
    }

    if (fieldInfo.requiresTestimonial && !testimonial.trim()) {
      setMessage(`❌ Please enter ${fieldInfo.testimonial.toLowerCase()}`);
      return;
    }

    if (fieldInfo.requiresText && !text.trim()) {
      setMessage(`❌ Please enter ${fieldInfo.text.toLowerCase()}`);
      return;
    }

    // Prepare Upload/Update
    setIsUploading(true);
    setMessage(isEditMode ? "⏳ Updating..." : "⏳ Uploading...");
    
    const formData = new FormData();
    
    // Add files and data based on section
    if (section === "testimonials") {
      if (files && files.length > 0) {
        formData.append("image", files[0]);
      }
      formData.append("name", name.trim());
      formData.append("testimonial", testimonial.trim());
      formData.append("stars", stars);
    } else if (section === "home-video" || section === "about-video") {
      if (files && files.length > 0) {
        formData.append("video", files[0]);
      }
      formData.append("title", title.trim());
      if (description.trim()) {
        formData.append("description", description.trim());
      }
    } else if (section === "home-services") {
      if (files && files.length > 0) {
        formData.append("icon", files[0]);
      }
      formData.append("title", title.trim());
      formData.append("description", description.trim());
    } else if (section === "services") {
      if (files && files.length > 0) {
        formData.append("image", files[0]);
      }
      formData.append("title", title.trim());
      formData.append("description", description.trim());
    } else if (section === "social") {
      if (files && files.length > 0) {
        formData.append("icon", files[0]);
      }
      formData.append("name", name.trim());
      formData.append("link", link.trim());
    } else if (section === "blog") {
      if (files && files.length > 0) {
        formData.append("image", files[0]);
      }
      formData.append("title", title.trim());
      formData.append("content", text.trim());
      if (date.trim()) {
        formData.append("postDate", date.trim());
      }
    } else if (section === "pdf") {
      if (files && files.length > 0) {
        formData.append("pdf", files[0]);
      }
      formData.append("title", title.trim());
      formData.append("description", description.trim());
    }

    // Make API Call
    try {
      const endpoint = isEditMode 
        ? `${API_BASE_URL}/${section}/${editingItemId}`
        : `${API_BASE_URL}/${section}/upload`;
      
      const method = isEditMode ? "PUT" : "POST";
      
      const res = await fetch(endpoint, {
        method: method,
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${isEditMode ? 'Update' : 'Upload'} successful!`);
        resetForm();
        loadItems();
        loadStats();
      } else {
        setMessage(`❌ Operation failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Operation error:", err);
      setMessage("❌ Operation failed: Network error.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- Fetching Items ---
  const loadItems = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/${section}`);
      if (!res.ok) {
        if (res.status === 404) {
          setItems([]);
          return;
        }
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      
      const itemsArray = data.testimonials || data.videos || data.services || data.socialLinks || data.addresses || data.blogPosts || data.pdfs || [];
      setItems(itemsArray);
    } catch (err) {
      console.error("Error loading items:", err);
      setItems([]);
    }
  }, [section]);

  // --- Fetching Upload Statistics ---
  const loadStats = useCallback(async () => {
    try {
      const sections = ["testimonials", "home-video", "home-services", "services", "about-video", "address", "social", "blog", "pdf"];
      const newStats = {};
      
      for (const sec of sections) {
        try {
          const res = await fetch(`${API_BASE_URL}/${sec}`);
          if (res.ok) {
            const data = await res.json();
            const itemsArray = data.testimonials || data.videos || data.services || data.socialLinks || data.addresses || data.blogPosts || data.pdfs || [];
            newStats[sec] = itemsArray.length;
          }
        } catch (err) {
          console.error(`Error loading stats for ${sec}:`, err);
        }
      }
      
      setStats(newStats);
    } catch (err) {
      console.error("Error loading stats:", err);
      setStats({});
    }
  }, []);

  // --- Deleting an Item ---
  const deleteItem = async (itemId, displayName) => {
    if (!window.confirm(`Are you sure you want to delete "${displayName}"?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${section}/${itemId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ "${displayName}" deleted successfully!`);
        setItems(prevItems => prevItems.filter(item => item._id !== itemId));
        loadStats();
      } else {
        setMessage(`❌ Delete failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("❌ Delete failed: Network error.");
    }
  };

  // --- Effect Hooks ---
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const fieldInfo = getFieldInfo();

  const sectionNames = {
    "testimonials": "Testimonials",
    "home-video": "Home Page Video",
    "home-services": "Home Page Services",
    "services": "Services Page",
    "about-video": "About Us Video",
    "address": "Company Address",
    "social": "Social Media Links",
    "blog": "Blog Posts",
    "pdf": "PDF Documents"
  };

  // --- JSX Rendering ---
  return (
    <div className="admin-container">
      <h2 className="admin-title">🏥 Nurse Today - Admin Panel</h2>
      
      {/* Stats Display */}
      <div className="stats-section">
        <h3 className="stats-title">📊 Items Count:</h3>
        {Object.keys(stats).length > 0 ? (
          <div className="stats-grid">
            {Object.entries(stats).map(([key, count]) => (
              <div key={key} className="stat-card">
                <strong>{sectionNames[key] || key}:</strong> {count} item(s)
              </div>
            ))}
          </div>
        ) : (
          <p className="no-stats">Statistics not available. Try uploading content!</p>
        )}
      </div>

      {/* Upload/Edit Form */}
      <div className="upload-form">
        <h3 className="form-title">
          {isEditMode ? '✏️ Edit Item' : '📤 Add New Item'}
        </h3>
        
        {isEditMode && (
          <div style={{ 
            padding: '12px', 
            background: '#fff3cd', 
            border: '1px solid #ffc107', 
            borderRadius: '8px', 
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>✏️ <strong>Edit Mode:</strong> Update the fields below</span>
            <button 
              onClick={resetForm}
              style={{
                padding: '6px 12px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ✖️ Cancel Edit
            </button>
          </div>
        )}
        
        <div className="form-group">
          <label className="form-label">Section:</label>
          <select
            value={section}
            onChange={handleSectionChange}
            disabled={isUploading || isEditMode}
            className="form-select"
          >
            <option value="testimonials">💬 Testimonials</option>
            <option value="home-video">🎥 Home Page Video</option>
            <option value="home-services">🏠 Home Page Services</option>
            <option value="services">🔧 Services Page</option>
            <option value="about-video">📹 About Us Video</option>
            <option value="address">📍 Company Address</option>
            <option value="social">🔗 Social Media Links</option>
            <option value="blog">📝 Blog Posts</option>
            <option value="pdf">📄 PDF Documents</option>
          </select>
        </div>

        {/* Testimonials Fields */}
        {section === "testimonials" && (
          <>
            <div className="form-group">
              <label className="form-label">{fieldInfo.name}:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isUploading}
                className="form-input"
                placeholder="Enter customer name"
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{fieldInfo.testimonial}:</label>
              <textarea
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                disabled={isUploading}
                className="form-textarea"
                placeholder="Enter testimonial"
                maxLength={1000}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{fieldInfo.stars} (Optional):</label>
              <input
                type="number"
                value={stars}
                onChange={(e) => setStars(Math.min(5, Math.max(0, parseInt(e.target.value) || 0)))}
                disabled={isUploading}
                className="form-input"
                placeholder="0-5"
                min="0"
                max="5"
              />
            </div>
          </>
        )}

        {/* Title Fields */}
        {(section === "home-video" || section === "home-services" || section === "services" || section === "about-video" || section === "blog" || section === "pdf") && (
          <div className="form-group">
            <label className="form-label">{fieldInfo.title}:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              className="form-input"
              placeholder={`Enter ${fieldInfo.title.toLowerCase()}`}
              maxLength={100}
            />
          </div>
        )}

        {/* Description Fields */}
        {(section === "home-video" || section === "home-services" || section === "services" || section === "about-video" || section === "pdf") && (
          <div className="form-group">
            <label className="form-label">{fieldInfo.description}:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              className="form-textarea"
              placeholder={`Enter ${fieldInfo.description.toLowerCase()}`}
              maxLength={section === "services" ? 5000 : 2000}
            />
          </div>
        )}

        {/* Blog Post Fields */}
        {section === "blog" && (
          <>
            <div className="form-group">
              <label className="form-label">{fieldInfo.text}:</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isUploading}
                className="form-textarea"
                placeholder="Enter blog post content"
                maxLength={50000}
                style={{ minHeight: '200px' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{fieldInfo.date}:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isUploading}
                className="form-input"
              />
              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                💡 Leave empty to use current date
              </small>
            </div>
          </>
        )}

        {/* Address Field */}
        {section === "address" && (
          <div className="form-group">
            <label className="form-label">{fieldInfo.address}:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isUploading}
              className="form-input"
              placeholder="Enter company address"
              maxLength={500}
            />
          </div>
        )}

        {/* Social Media Fields */}
        {section === "social" && (
          <>
            <div className="form-group">
              <label className="form-label">{fieldInfo.name}:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isUploading}
                className="form-input"
                placeholder="e.g., Facebook, Instagram"
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{fieldInfo.link}:</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                disabled={isUploading}
                className="form-input"
                placeholder="https://example.com"
                maxLength={500}
              />
            </div>
          </>
        )}

        {/* File Upload */}
        {section !== "address" && (
          <div className="form-group">
            <label className="form-label">
              Select {fieldInfo.acceptVideo ? 'Video' : fieldInfo.acceptPDF ? 'PDF' : 'Image'}
              {(fieldInfo.imageOptional || isEditMode) && ' (Optional)'}:
            </label>
            <input
              type="file"
              accept={fieldInfo.acceptVideo ? "video/*" : fieldInfo.acceptPDF ? "application/pdf" : "image/*"}
              onChange={handleFileChange}
              disabled={isUploading}
              className="form-file-input"
            />
            {isEditMode && (
              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                💡 Leave empty to keep existing file
              </small>
            )}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`upload-button ${isUploading ? 'disabled' : ''}`}
        >
          {isUploading ? '⏳ Processing...' : isEditMode ? '✅ Update' : '📤 Upload'}
        </button>

        {message && (
          <p className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>

      {/* Items List */}
      <div className="items-section">
        <h3 className="items-title">
          🖼️ {sectionNames[section]} Items ({items.length})
        </h3>
        
        {items.length > 0 ? (
          <div className="items-grid">
            {items.map((item) => {
              const displayTitle = item.title || item.name || item.address || "Untitled";
              const displayDescription = item.description || item.testimonial || item.text || '';
              const mediaUrl = item.imageUrl || item.videoUrl || item.iconUrl || item.pdfUrl;
              const isVideo = item.videoUrl || item.videoPublicId;
              const isPDF = item.pdfUrl || item.pdfPublicId;
              
              return (
                <div key={item._id} className="item-card">
                  {mediaUrl && (
                    <>
                      {isVideo ? (
                        <video
                          src={mediaUrl}
                          controls
                          className="item-image"
                          style={{ maxHeight: '200px' }}
                        />
                      ) : isPDF ? (
                        <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px', textAlign: 'center' }}>
                          <span style={{ fontSize: '48px' }}>📄</span>
                          <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                            PDF Document
                            {item.fileSize && ` (${(item.fileSize / 1024 / 1024).toFixed(2)} MB)`}
                          </p>
                        </div>
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={displayTitle}
                          className="item-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </>
                  )}
                  
                  <div className="item-content">
                    <h4 className="item-title">{displayTitle}</h4>
                    
                    {item.stars > 0 && (
                      <p className="item-image-count">⭐ {item.stars} / 5 stars</p>
                    )}
                    
                    {item.postDate && (
                      <p className="item-image-count">
                        📅 {new Date(item.postDate).toLocaleDateString()}
                      </p>
                    )}
                    
                    {displayDescription && (
                      <p className="item-description">
                        {displayDescription.length > 150
                          ? `${displayDescription.substring(0, 150)}...`
                          : displayDescription
                        }
                      </p>
                    )}
                    
                    {section === "social" && item.link && (
                      <p className="item-link">
                        🔗 <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a>
                      </p>
                    )}

                    {isPDF && item.pdfUrl && (
                      <a 
                        href={item.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          display: 'inline-block', 
                          marginTop: '10px', 
                          padding: '8px 16px', 
                          background: '#007bff', 
                          color: 'white', 
                          borderRadius: '4px', 
                          textDecoration: 'none',
                          fontSize: '14px'
                        }}
                      >
                        📥 Download PDF
                      </a>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        onClick={() => editItem(item)}
                        style={{
                          flex: 1,
                          padding: '0px 10px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item._id, displayTitle)}
                        className="delete-button"
                        style={{ flex: 1 }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-items">
            No items uploaded yet in "{sectionNames[section]}" section.
          </p>
        )}
      </div>
    </div>
  );
}

export default Admin;