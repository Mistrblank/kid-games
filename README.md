# kid-games
These are games my kid has made introducing him to coding with AI

Static site with two kid games. No accounts, no server, no tracking.

- `index.html`: home page linking both games
- `space-escape/`: Space Escape Math (game settings are at the top of the script)
- `tic-tac-toe/`: Tic Tac Toe vs Robot (rule-based opponent; skill levels are in `SKILL`)
- `space-escape-2/`: Space Escape Math 2 (exploding ship, meteorites, 20 doors)
- `gem-cave/`: Gem Cave (saves progress on the device it's played on)
- `icons/`, `manifest.json`: iPad home-screen icons and app-style settings

Served at https://games.vincej.net (set by the `CNAME` file). All links are relative, so moving to another domain later only means changing `CNAME` and DNS.

## Publish on GitHub Pages

1. Create a public repo `kid-games` under Mistrblank. Upload the *contents* of this folder (not the folder itself) so `index.html` sits at the repo root. `.nojekyll` is hidden on a Mac (Cmd+Shift+. shows it); it's optional, so skipping it is fine.
2. Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. DNS at the vincej.net provider: add `CNAME  games  →  mistrblank.github.io`
4. Back in Settings → Pages, confirm the custom domain shows `games.vincej.net` and the DNS check passes. Once the certificate is issued (usually minutes, can take up to an hour), tick "Enforce HTTPS".
5. Recommended: verify `vincej.net` under GitHub account Settings → Pages → Verified domains, to block subdomain takeover.

ount settings → Pages, to block domain takeover.

## On the iPad

Open the site in Safari → Share → "Add to Home Screen". Do this from the home page for one "Kid Games" icon, or from each game's page for a separate icon per game. They open full screen, and the "← All games" button handles navigation.
