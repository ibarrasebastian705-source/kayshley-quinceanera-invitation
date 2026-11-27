# Quinceañera invitation

A responsive, single-page Spanish invitation inspired by the reference's romantic, scroll-led presentation. It uses an original layout and styling, with no assets or wording copied from the reference.

## Preview

Open `index.html` in a browser. The page is plain HTML, CSS, and JavaScript and does not need a build step. Google Fonts and the sample gallery photos load from the internet.

## Personalize

Edit `content.js`:

- Change the name, family names, date, city, ceremony/reception details and map links.
- Update the schedule list and RSVP deadline.
- Replace the four gallery URLs with your own photos. The first gallery photo also appears on the cover.
- Set `musicUrl` to a direct MP3 URL for music you have permission to use. The play/pause control then works with that track.

The sample name, event details, and stock photos are placeholders. Update them before sharing the invitation.

## RSVP behavior

The RSVP form provides a working front-end interaction and saves responses in the visitor's browser using local storage. Responses are not sent to the host, so this demo is not a shared RSVP service. To collect responses centrally, connect the form submit handler in `script.js` to a form service or your own backend.

## Project files

- `index.html` — page structure
- `styles.css` — responsive design and animations
- `content.js` — editable invitation details and media URLs
- `script.js` — countdown, reveal animations, music controls, and RSVP behavior
