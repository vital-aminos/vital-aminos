# Vital Aminos — site

Research-peptide storefront landing page (structure based on afterhours-labs.com,
rebranded to **Vital Aminos**).

## Files
- `index.html` — markup: access gate + full page (promo bar, header, hero, product grid, quality, about, footer)
- `styles.css` — dark theme, gold accent, responsive
- `app.js` — access-gate logic + product grid rendering

## Access gate
On entry the site is hidden behind a modal that requires the visitor to:
1. **Select a research role** (Principal Investigator, Research Scientist, … Other)
2. **Confirm they are at least 21** and affirm qualified-researcher / research-use-only status

"Remember me for 5 days" stores the grant in `localStorage` (`va_access_grant`); otherwise the
gate appears on every visit. "Decline & exit" links away to google.com.

All copy is framed as **For Research Use Only — not for human or veterinary use**.

## Run
```bash
python -m http.server 8777
```
Then open http://localhost:8777/

To re-test the gate: run `localStorage.clear()` in the browser console and reload.
