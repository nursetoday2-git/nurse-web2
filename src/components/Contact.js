import React from 'react'
import '../styles/Contact.css'
import Footer from './Footer'

const contactContent = {
  title: "Contact",
  subtitle: "Expert Nursing Services for Optimal Health and Wellness",
  company: "Holistic Concierge Nursing",
  info: {
    address: "Lancaster, PA",
    phone: "717-686-7193",
    email: "cheryl@nursetoday.info",
    hours: "Available for Nursing 24/7",
  },
  socials: [
    { name: "Facebook", url: "https://www.facebook.com/people/Holistic-Concierge-Nursing/61552123784210/?mibextid=LQQJ4d" },
    { name: "Instagram", url: "https://www.instagram.com/holisticconciergenursing/" },
  ],
  copyright: "© 2025 Nurse Today",
  buttons: [
    { label: "📞 Call Now", action: "tel:+17176867193" },
    { label: "📧 Email Us", action: "mailto:cheryl@nursetoday.info" },
    { label: "📍 Get Directions", action: "https://www.google.com/maps/search/Lancaster,+PA" }
  ]
}

function Contact() {
  return (
    <div className="contact-page-container">
      <header className="contact-page-header">
        <h1>{contactContent.title}</h1>
        <h2>{contactContent.subtitle}</h2>
      </header>

      <main className="contact-page-main">
        <section className="contact-page-section">
          <h3>{contactContent.company}</h3>
          <p><strong>Address:</strong> {contactContent.info.address}</p>
          <p><strong>Phone:</strong> {contactContent.info.phone}</p>
          <p><strong>Hours:</strong> {contactContent.info.hours}</p>
        </section>

        <section className="contact-page-section">
          <h3>Contact Us</h3>
          <p><strong>Phone:</strong> +1 {contactContent.info.phone}</p>
          <p><strong>Email:</strong> {contactContent.info.email}</p>
        </section>

        <section className="contact-page-section">
          <h3>Reach Us</h3>
          <p>{contactContent.info.address}</p>

          <h3>Open Hours</h3>
          <p>{contactContent.info.hours}</p>
        </section>

        <div className="contact-page-buttons">
          {contactContent.buttons.map((btn, index) => (
            <a key={index} href={btn.action} className="contact-btn">
              {btn.label}
            </a>
          ))}
        </div>

        <section className="contact-page-socials">
          {contactContent.socials.map((social, index) => (
            <a key={index} href={social.url} className="social-contact-link">
              {social.name}
            </a>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
