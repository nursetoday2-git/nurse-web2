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
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});

  const API_BASE_URL = "https://nurse-back.onrender.com"; // Change to your backend URL

  // --- Handlers for Input Changes ---
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setMessage("");
    if (selectedFiles.length > 0) {
      const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
      const fileType = selectedFiles[0].type.startsWith('video/') ? 'video' : 'image';
      setMessage(`Selected: ${selectedFiles.length} ${fileType}(s) (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
    }
  };

  const handleSectionChange = (e) => {
    const newSection = e.target.value;
    setSection(newSection);
    setTitle("");
    setDescription("");
    setName("");
    setLink("");
    setStars(0);
    setTestimonial("");
    setAddress("");
    setFiles([]);
    setMessage("");
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
          requiresImage: true,
          requiresName: true,
          requiresTestimonial: true,
          acceptVideo: false
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
          requiresImage: true,
          requiresTitle: true,
          requiresDescription: true,
          acceptVideo: false
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
      default:
        return { title: "Title" };
    }
  }, [section]);

  // --- File Upload Logic ---
  const handleUpload = async () => {
    const fieldInfo = getFieldInfo();

    // Special handling for address (no file upload)
    if (section === "address") {
      if (!address.trim()) {
        setMessage("❌ Please enter an address");
        return;
      }

      setIsUploading(true);
      setMessage("⏳ Uploading...");

      try {
        const endpoint = `${API_BASE_URL}/address`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: address.trim() }),
        });
        const data = await res.json();

        if (res.ok) {
          setMessage(`✅ Address saved successfully!`);
          setAddress("");
          loadItems();
          loadStats();
        } else {
          setMessage(`❌ Upload failed: ${data.error || "Unknown error"}`);
        }
      } catch (err) {
        console.error("Upload error:", err);
        setMessage("❌ Upload failed: Network error.");
      } finally {
        setIsUploading(false);
      }
      return;
    }

    // File validations for other sections
    if (!files || files.length === 0) {
      setMessage("❌ Please select a file first!");
      return;
    }

    // Check file type based on section
    if (fieldInfo.acceptVideo) {
      const allVideos = files.every(f => f.type.startsWith('video/'));
      if (!allVideos) {
        setMessage("❌ Please select only video files!");
        return;
      }
    } else if (fieldInfo.requiresImage) {
      const allImages = files.every(f => f.type.startsWith('image/'));
      if (!allImages) {
        setMessage("❌ Please select only image files!");
        return;
      }
    }

    // Validation based on section
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

    // Prepare Upload
    setIsUploading(true);
    setMessage("⏳ Uploading...");
    
    const formData = new FormData();
    
    // Add files and data based on section
    if (section === "testimonials") {
      formData.append("image", files[0]);
      formData.append("name", name.trim());
      formData.append("testimonial", testimonial.trim());
      formData.append("stars", stars);
    } else if (section === "home-video" || section === "about-video") {
      formData.append("video", files[0]);
      formData.append("title", title.trim());
      if (description.trim()) {
        formData.append("description", description.trim());
      }
    } else if (section === "home-services") {
      formData.append("icon", files[0]);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
    } else if (section === "services") {
      formData.append("image", files[0]);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
    } else if (section === "social") {
      formData.append("icon", files[0]);
      formData.append("name", name.trim());
      formData.append("link", link.trim());
    }

    // Make API Call
    try {
      const endpoint = `${API_BASE_URL}/${section}/upload`;
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Upload successful! Item saved in "${section}" section.`);
        
        // Add new item to list
        const newItem = data.testimonial || data.video || data.service || data.socialLink;
        if (newItem) {
          setItems(prevItems => [newItem, ...prevItems]);
        }

        // Clear form fields
        setFiles([]);
        setTitle("");
        setDescription("");
        setName("");
        setLink("");
        setStars(0);
        setTestimonial("");
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }

        // Refresh stats
        loadStats();
      } else {
        setMessage(`❌ Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed: Network error. Make sure the server is running.");
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
      
      // Extract items based on section
      const itemsArray = data.testimonials || data.videos || data.services || data.socialLinks || data.addresses || [];
      setItems(itemsArray);
    } catch (err) {
      console.error("Error loading items:", err);
      setItems([]);
    }
  }, [section]);

  // --- Fetching Upload Statistics ---
  const loadStats = useCallback(async () => {
    try {
      const sections = ["testimonials", "home-video", "home-services", "services", "about-video", "address", "social"];
      const newStats = {};
      
      for (const sec of sections) {
        try {
          const res = await fetch(`${API_BASE_URL}/${sec}`);
          if (res.ok) {
            const data = await res.json();
            const itemsArray = data.testimonials || data.videos || data.services || data.socialLinks || data.addresses || [];
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
        setItems(prevItems =>
          prevItems.filter(item => item._id !== itemId)
        );
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

  // Get field info
  const fieldInfo = getFieldInfo();

  // Section names mapping
  const sectionNames = {
    "testimonials": "Testimonials",
    "home-video": "Home Page Video",
    "home-services": "Home Page Services",
    "services": "Services Page",
    "about-video": "About Us Video",
    "address": "Company Address",
    "social": "Social Media Links"
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

      {/* Upload Form */}
      <div className="upload-form">
        <h3 className="form-title">📤 Add New Item</h3>
        
        <div className="form-group">
          <label className="form-label">Section:</label>
          <select
            value={section}
            onChange={handleSectionChange}
            disabled={isUploading}
            className="form-select"
          >
            <option value="testimonials">💬 Testimonials</option>
            <option value="home-video">🎥 Home Page Video</option>
            <option value="home-services">🏠 Home Page Services</option>
            <option value="services">🔧 Services Page</option>
            <option value="about-video">📹 About Us Video</option>
            <option value="address">📍 Company Address</option>
            <option value="social">🔗 Social Media Links</option>
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

        {/* Video/Service Title Fields */}
        {(section === "home-video" || section === "home-services" || section === "services" || section === "about-video") && (
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
        {(section === "home-video" || section === "home-services" || section === "services" || section === "about-video") && (
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
                placeholder="e.g., Facebook, Instagram, LinkedIn"
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

        {/* File Upload (not for address) */}
        {section !== "address" && (
          <div className="form-group">
            <label className="form-label">
              Select {fieldInfo.acceptVideo ? 'Video' : 'Image'}:
            </label>
            <input
              type="file"
              accept={fieldInfo.acceptVideo ? "video/*" : "image/*"}
              onChange={handleFileChange}
              disabled={isUploading}
              className="form-file-input"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={isUploading || (section !== "address" && files.length === 0)}
          className={`upload-button ${isUploading || (section !== "address" && files.length === 0) ? 'disabled' : ''}`}
        >
          {isUploading ? '⏳ Uploading...' : '📤 Upload'}
        </button>

        {message && (
          <p className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>

      {/* Items List Display */}
      <div className="items-section">
        <h3 className="items-title">
          🖼️ {sectionNames[section]} Items ({items.length})
        </h3>
        
        {items.length > 0 ? (
          <div className="items-grid">
            {items.map((item) => {
              const displayTitle = item.title || item.name || item.address || "Untitled";
              const displayDescription = item.description || item.testimonial || '';
              const mediaUrl = item.imageUrl || item.videoUrl || item.iconUrl;
              const isVideo = item.videoUrl || item.videoPublicId;
              
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
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={displayTitle}
                          className="item-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            console.warn(`Failed to load image: ${mediaUrl}`);
                          }}
                        />
                      )}
                    </>
                  )}
                  
                  <div className="item-content">
                    <h4 className="item-title">{displayTitle}</h4>
                    
                    {item.stars > 0 && (
                      <p className="item-image-count">
                        ⭐ {item.stars} / 5 stars
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

                    <button
                      onClick={() => deleteItem(item._id, displayTitle)}
                      className="delete-button"
                    >
                      🗑️ Delete
                    </button>
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