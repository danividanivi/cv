# CV

My resume in JSON Resume format.

## View

- [HTML](index.html)
- [PDF](resume.pdf)

## Build Locally

To build locally:

```sh
npm install -g resume-cli
npm install -g jsonresume-theme-kendall
resume export index.html --theme kendall
resume export resume.pdf --theme kendall
```

## Automated Build

This repository uses GitHub Actions to automatically build and deploy the resume to GitHub Pages on every push.