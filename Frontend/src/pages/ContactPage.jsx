import React from 'react';
import '../components/styles.css';

const ContactPage = () => {
  return (
    <div className="container">
      <h2>Contact Us</h2>
      <div className="card">
        <p>We'd love to hear from you! Please fill out the form below and we will get in touch with you shortly.</p>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <input type="text" placeholder="Subject" />
          <textarea rows="5" placeholder="Your Message"></textarea>
          <button className="button-primary" type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;