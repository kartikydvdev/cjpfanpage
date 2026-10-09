# Deploying OILFLOW

## GitHub Pages

1. Push this folder to a repository.
2. **Settings -> Pages**.
3. Source: `Deploy from a branch`; branch `main`, folder `/ (root)`; **Save**.
4. Live at `https://<username>.github.io/<repo>/`.

The root `index.html` is the entry point, so no further configuration is needed.

## Custom domain

1. **Settings -> Pages -> Custom domain**: enter the domain and save.
2. At your registrar add what GitHub shows:
   - Apex: four `A` records to the GitHub Pages IPs
   - `www`: a `CNAME` record to `<username>.github.io`
3. Enable **Enforce HTTPS** once the certificate is issued.

## Other hosts

Netlify, Vercel and Cloudflare Pages work too: connect the repository, leave the build command empty, set the publish directory to the repository root. Relative asset paths mean it also runs from a subfolder.

## Collaborating

```bash
git checkout -b feature/my-change
git add .
git commit -m "Describe the change"
git push -u origin feature/my-change
```

Open a pull request, review, then merge to `main`. Every merge republishes the live site.
