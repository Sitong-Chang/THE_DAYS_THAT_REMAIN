# THE DAYS THAT REMAIN｜留下来的日子

An interactive bilingual archival exhibition for ARHU 101, based on Zhu Runcang's *贞丰八年血泪录*.

## Run locally
Because the site loads `data/records.json` with `fetch`, do not open `index.html` directly as a `file://` URL. Start a local server from this folder:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy
Upload the contents of this folder to a GitHub repository. In Vercel, import the repository and use the project root (the folder containing `index.html`) as the Root Directory. No build command is required; the site is static.

## Archive and method
- Primary source: 朱润苍：《贞丰八年血泪录》，《近代史资料》第54号，中国社会科学院近代史研究所编，1984年，第234–263页.
- Digitized volume: https://www.krzzjn.com/uploadfile/2020/0918/20200918011535847.pdf
- The author states that dates follow the lunar calendar and that the account is selective and may omit details.
- This exhibit presents a curated sample of dated entries, not a complete transcription.
- Event descriptions are paraphrases. Short Chinese fragments are quoted from the digitized text; OCR errors may exist, so verify against the original page scan before expanding quotations.
- Blank space must not be interpreted as evidence that nothing happened on that date.
- Gregorian years are shown as year-level orientation only. Individual lunar dates are not converted.

## Contents
- `index.html` — exhibition structure
- `css/style.css` — visual system and responsive layout
- `js/app.js` — calendar navigation, bilingual toggle, unfolding reader
- `data/records.json` — curated dated records with source page references
