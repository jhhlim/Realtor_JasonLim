# Site images

Listing, neighborhood, and blog imagery is loaded from Unsplash URLs
(`https://images.unsplash.com/...`) configured in mock data and `siteConfig.media`.

Local binary assets are optional. Prefer remote Unsplash (or your CDN) URLs so
`next/image` can optimize without committing large files.

If you add local files here, place them under this folder and reference paths
like `/images/your-file.jpg` in `src/config/site.ts`.
