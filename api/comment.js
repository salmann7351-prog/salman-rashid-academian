export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const affiliation = String(body.affiliation || '').trim();
    const comment = String(body.comment || '').trim();
    const website = String(body.website || '').trim();
    const turnstileToken = String(body['cf-turnstile-response'] || body.turnstileToken || '').trim();

    if (website) return res.status(400).json({ error: 'Unable to submit this form.' });
    if (!name || !email || !comment) return res.status(400).json({ error: 'Please complete the required fields.' });
    if (name.length > 120 || email.length > 200 || affiliation.length > 180 || comment.length > 4000) {
      return res.status(400).json({ error: 'One or more fields exceed the allowed length.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });

    if (!process.env.TURNSTILE_SECRET_KEY || !turnstileToken) {
      return res.status(503).json({ error: 'Spam protection is not configured yet.' });
    }

    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken
      })
    });
    const turnstile = await turnstileResponse.json();
    if (!turnstile.success) return res.status(400).json({ error: 'Spam verification failed. Please try again.' });

    if (!process.env.RESEND_API_KEY) {
      return res.status(503).json({ error: 'Comment email delivery is not configured yet.' });
    }

    const to = process.env.COMMENTS_TO_EMAIL || 'salmann7351@gmail.com';
    const from = process.env.COMMENTS_FROM_EMAIL;
    if (!from) return res.status(503).json({ error: 'Comment sender is not configured yet.' });

    const escapeHtml = (value) => value.replace(/[&<>'"]/g, (c) => ({
      '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
    })[c]);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeAffiliation = escapeHtml(affiliation || 'Not provided');
    const safeComment = escapeHtml(comment).replace(/\n/g, '<br>');

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio comment for review from ${name}`,
        html: `<h2>New portfolio comment for approval</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Affiliation / Institution:</strong> ${safeAffiliation}</p><p><strong>Comment:</strong></p><p>${safeComment}</p><hr><p><em>This comment has NOT been published automatically. Review and approve it manually before adding it to the public website.</em></p>`
      })
    });

    if (!emailResponse.ok) {
      return res.status(502).json({ error: 'The comment could not be sent for review.' });
    }

    return res.status(200).json({ ok: true, message: 'Thank you. Your comment has been sent for review.' });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
}
