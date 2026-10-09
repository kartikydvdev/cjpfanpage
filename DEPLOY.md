# Deploying OILFLOW

## GitHub Pages

1. Create a repository and push this folder.
2. Open **Settings -> Pages**.
3. Under *Build and deployment*, set **Source** to `Deploy from a branch`.
4. Choose branch `main` and folder `/ (root)`, then **Save**.
5. The site goes live at `https://<username>.github.io/<repo>/`.

The root `index.html` is the entry point, so no extra configuration is needed.

## Custom domain

1. In **Settings -> Pages -> Custom domain**, enter your domain and save.
2. At your registrar add the records GitHub shows:
   - Apex domain: four `A` records to the GitHub Pages IPs
   - `www` subdomain: a `CNAME` record to `<username>.github.io`
3. Enable **Enforce HTTPS** once the certificate is issued.

## Other hosts

Netlify, Vercel and Cloudflare Pages all work: connect the repository, leave the build command empty, and set the publish directory to the repository root. The relative asset paths mean it also runs from any subfolder.

## Working together

```bash
git checkout -b feature/add-funds
git add .
git commit -m "Update add funds flow"
git push -u origin feature/add-funds
```

Open a pull request for review, then merge to `main`. Every push to `main` republishes the live site automatically.
