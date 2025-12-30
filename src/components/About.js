import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/About.css'
import Footer from './Footer';
import Carousel from './Carousel';

const ceoPic = `${process.env.PUBLIC_URL}/cheryl.webp`;
const API_BASE_URL = "https://nurse-back.onrender.com";

const aboutContent = {
  title: "About Us",
  subtitle: "Holistic Concierge Nursing Professionals",
  sections: [
  {
  heading: "Our Mission",
  text: `At Holistic Concierge Nursing Professionals, we deliver exceptional, personalized nursing care in Boca Raton that empowers individuals to achieve optimal health in the comfort of their home. As a premier concierge nurse service in Boca Raton, West Palm Beach, and Delray Beach, we provide specialized care for women's health, compassionate support for veterans, and dignified guidance for seniors.

We treat every client as a whole person, honoring their unique values and goals. Our expert clinical care is grounded in respect, compassion, and integrity helping individuals live with confidence, independence, and improved quality of life at home.`
},
    {
      heading: "Our Story",
      text: `After more than 25 years as a registered nurse, Cheryl founded Holistic Concierge Nursing Professionals to give families personal, compassionate, and truly coordinated care. Her experience at world-class hospitals like Johns Hopkins and Hershey Medical Center showed her both the incredible resilience of patients and the challenges families face navigating a complex healthcare system. Her team manages every detail of care, from post-surgical recovery and dementia care to ongoing wellness, so you can focus on what matters most: each other.`
    },
    {
      heading: "Our Core Values",
      list: [
        "💛 Compassion in Practice – We lead with empathy, understanding each person's story and situation.",
        "🌿 Excellence in Care – Our services reflect 24+ years of clinical leadership and advanced nursing expertise.",
        "🤝 Trust through Transparency – Licensed in multiple states and bound by strict ethical standards, we prioritize honesty and patient safety and follow Medicare guidelines.",
        "✨ Personalized Wellness – We design every plan around your unique health, lifestyle, and environment."
      ]
    },
    {
      heading: "Why Us?",
      text: `At Holistic Concierge Nursing Professionals, leadership isn't just about experience, it's about vision. Cheryl brings not only decades of clinical mastery but also a belief in redefining what nursing care can be: proactive, holistic, accessible, and deeply personal. Cheryl leads a growing team of experts dedicated to closing the gaps in traditional healthcare and opening doors to more fulfilling, dignified, and client-centered healing experiences.`
    }
  ],
  founder: {
    name: "Cheryl Ruthman, MSN, RN",
    title: "Founder & CEO",
    description: `I am the founder and owner of Holistic Concierge Nursing Professionals, a private concierge nursing company, offering a personal healthcare experience to clients on a national level.`,
    education: `I achieved my Registered Nursing Degree and went on to further my education with a Master's Degree in Nursing Leadership.`,
    passion: `My true passion is providing strong, quality-of-care services in the relaxed setting of a client's home, especially for dementia and aging adults, before and after surgery. This personalized care supports aging in place, impacts recovery time, wellness, and mental stability, all in the comfort of home. Through virtual coordination and nurse-on-demand access, clients stay healthier in their environment.`,
    closing: `If you agree with the importance of personal, individualized health care, please don't hesitate to reach out to learn more about Holistic Concierge Nursing Professionals. You'll be glad you did!`
  }
}

function About() {
  const navigate = useNavigate();
  const [aboutVideo, setAboutVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutVideo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/about-video`);
        if (response.ok) {
          const data = await response.json();
          if (data.videos && data.videos.length > 0) {
            setAboutVideo(data.videos[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching about video:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutVideo();
  }, []);

  return (
    <div className="about-container">
      <header className="about-header">
        <h1>{aboutContent.title}</h1>
        <h2>{aboutContent.subtitle}</h2>
        <div className="about-buttons">
          <button onClick={() => navigate('/contact')}>Contact Now</button>
          <a href="https://docs.google.com/forms/d/1xU2q8VmYtgmlWc7C89t4gOZ4odlqHvoF9Jvyf3eO974/viewform?pli=1&pli=1&edit_requested=true" target="_blank" rel="noopener noreferrer">
            <button>Request a Consultation</button>
          </a>
        </div>
      </header>

      <main className="about-main">
        {aboutContent.sections.map((section, index) => (
          <section key={index} className="about-section">
            <h3>{section.heading}</h3>
            {section.text && <p>{section.text}</p>}
            {section.list && (
              <ul>
                {section.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {!isLoading && aboutVideo && (
          <section className="about-video-section">
            <div className="about-video-content-wrapper">
              <div className="about-video-text-content">
                <h2>{aboutVideo.title}</h2>
                {aboutVideo.description && (
                  <p className="about-video-description">{aboutVideo.description}</p>
                )}
              </div>
              <div className="about-video-container">
                <video
                  className="about-feature-video"
                  controls
                  preload="metadata"
                >
                  <source src={aboutVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </section>
        )}

        <section className="carousel-section-wrapper">
          <Carousel />
        </section>

        <section className="about-founder">
          <div className="founder-content">
            <div className="founder-text">
              <h3>{aboutContent.founder.title}</h3>
              <h4>{aboutContent.founder.name}</h4>
              <p>{aboutContent.founder.description}</p>
              <p>{aboutContent.founder.education}</p>
              <p>{aboutContent.founder.passion}</p>
              <p>{aboutContent.founder.closing}</p>
            </div>

            <div className="founder-image">
              <img src={ceoPic} alt="Cheryl Ruthman, MSN, RN" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default About