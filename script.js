// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Smooth scroll for internal nav
const navAnchors = document.querySelectorAll('a[href^="#"]');
navAnchors.forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Active link highlight on scroll
const sections = [...document.querySelectorAll('main.section, section.section')];
const highlightOnScroll = () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const link = document.querySelector(`.nav-links a[href='#${sec.id}']`);
    if (!link) return;
    if (scrollY >= top && scrollY < bottom) link.classList.add('active');
    else link.classList.remove('active');
  });
};
window.addEventListener('scroll', highlightOnScroll);
window.addEventListener('load', highlightOnScroll);

// Reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Footer year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', function() {
  // Sticky nav/highlight and fade-in (already implemented above)

  // --- Contact Form to n8n Webhook ---
  const form = document.querySelector('.contact-form');
  if(form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = form.querySelector('.submit');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const topic = form.querySelector('[name="address"]').value.trim();
      const msgEls = form.querySelectorAll('textarea');
      let subject = '', message = '';
      if(msgEls.length > 1) {
        subject = msgEls[0].value.trim();
        message = msgEls[1].value.trim();
      } else {
        subject = topic; message = '';
      }
      const data = {name, email, phone, subject, message};
      let error = false;
      try {
        const resp = await fetch('https://codervikashpurviya.app.n8n.cloud/webhook-test/7bcef1fc-c461-4a5f-8f36-800eb2acf9e3', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify(data),
        });
        if (!resp.ok) throw new Error('Network request failed');
        btn.textContent = 'Sent!';
        btn.classList.add('sent');
        alert('Message sent successfully!');
        form.reset();
        setTimeout(()=>{
          btn.disabled = false;
          btn.textContent = 'Send Message';
          btn.classList.remove('sent');
        }, 1350);
      } catch(e) {
        error = true;
        btn.textContent='Try Again';
        alert('Failed to send. Please try again.');
        setTimeout(()=>{
          btn.disabled = false; btn.textContent = 'Send Message';
        }, 1200);
      }
    });
  }
});
