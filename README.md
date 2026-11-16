# THE DAYS THAT REMAIN — V2

A more experimental, text-led archival exhibition built from the existing curated record set.

## Design changes
- Removes the long explanatory panels from the exhibition surface.
- Makes short source fragments the main visual material.
- Uses oversized editorial typography, a dark archive field, a red interlude, and a contrasting paper-colored final-record section.
- Year tabs filter fragments; selecting a fragment unfolds a reading sheet with date, source page, original Chinese fragment, and a secondary paraphrase.
- Adds an all-record index and scroll progress indicator.
- Keeps the source citation compact at the end.

## Run locally
```bash
python -m http.server 8000
```
Open http://localhost:8000. Do not open `index.html` as a `file://` URL because the archive data is loaded with `fetch`.

## Deploy
Upload the contents of this folder to the GitHub repository root and redeploy on Vercel. No build command is required.

## Important source note
The record dataset is reused from the current V1 project. It is a curated sample, not a full transcription. The short Chinese fragments are carried over from V1 and should be checked against the original scan before final submission. Curatorial explanation and methodology have intentionally been moved out of the main exhibit; include them in the separate worksheet / written interpretation.
