# Formspree setup for Alt. Web Solutions

The contact form has been prepared for Formspree, but it will not send until you replace the placeholder form ID.

## 1. Create your Formspree form

1. Go to Formspree and create/sign in to your account.
2. Create a new form.
3. Set the receiving email to your test email: `itsmisterjames@gmail.com`.
4. Copy the endpoint. It will look like this:

```html
https://formspree.io/f/abcdwxyz
```

## 2. Add your Formspree form ID to the website

Open `index.html` and find this line:

```html
action="https://formspree.io/f/YOUR_FORM_ID"
```

Replace `YOUR_FORM_ID` with the real ID from your Formspree endpoint.

Example:

```html
action="https://formspree.io/f/abcdwxyz"
```

## 3. Deploy and test

1. Commit and push the site to GitHub.
2. Open the live GitHub Pages site.
3. Send one test enquiry.
4. Check your Formspree dashboard and your Gmail inbox.

## Notes

- The recipient email is controlled inside Formspree, not inside the website code.
- The visitor email field uses `name="email"`, so Formspree can use it as the reply-to address.
- The hidden `_subject` field sets the email notification subject.
- The hidden `_gotcha` field is a honeypot spam filter.
