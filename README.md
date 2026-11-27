# Quinceañera invitation

A responsive, single-page Spanish invitation inspired by the reference's romantic, scroll-led presentation. It uses an original layout and styling, with no assets or wording copied from the reference.

## Live editing

Open `editor.html` in a browser to see the live editor. Update the fields on the left and the invitation preview refreshes as you type. Your draft is kept in that browser when local storage is available. Choose **Descargar cambios** to download an updated `content.js`; replace the existing file in this folder with the downloaded copy to make those changes part of the project.

You can also open `index.html` directly to view the invitation.

## Preview

The page is plain HTML, CSS, and JavaScript and does not need a build step. Google Fonts and the sample gallery photos load from the internet.

## Personalize

Edit `content.js`:

- Change the name, family names, date, city, ceremony/reception details and map links.
- Update the schedule list and RSVP deadline.
- Replace the sample photo URLs with your own. They appear as page backgrounds, including the cover.

The sample name, event details, and stock photos are placeholders. Update them before sharing the invitation.

## RSVP behavior

The RSVP form provides a working front-end interaction and saves responses in the visitor's browser using local storage. Responses are not sent to the host, so this demo is not a shared RSVP service. To collect responses centrally, connect the form submit handler in `script.js` to a form service or your own backend.

## Project files

- `index.html` — page structure
- `styles.css` — responsive design and animations
- `content.js` — editable invitation details and media URLs
- `script.js` — countdown, reveal animations, music controls, and RSVP behavior
- `editor.html`, `editor.css`, and `editor.js` — in-browser live editor and preview
