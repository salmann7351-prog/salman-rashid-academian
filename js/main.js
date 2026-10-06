document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function () {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});


document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('comment-form');
  const status = document.getElementById('comment-form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    status.textContent = 'Sending for review...';

    const data = new FormData(form);
    const token = window.turnstile && typeof window.turnstile.getResponse === 'function'
      ? window.turnstile.getResponse()
      : '';
    data.append('cf-turnstile-response', token);

    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries()))
      });
      const result = await response.json();
      status.textContent = result.message || result.error || 'Your comment has been sent for review.';
      if (response.ok) {
        form.reset();
        if (window.turnstile && typeof window.turnstile.reset === 'function') window.turnstile.reset();
      }
    } catch (error) {
      status.textContent = 'Unable to submit right now. Please try again later.';
    }
  });
});
