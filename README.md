# NextGen Home Tutors - React + Netlify Functions

## Run locally
```
npm install
npm run dev            # UI only (forms show a friendly message without the function)
npx netlify dev        # UI + serverless function together
```

## Deploy on Netlify
1. Push to GitHub, then Netlify > Add new site > Import. Build: `npm run build`, publish: `dist` (already in netlify.toml).
2. Add env var `SHEET_WEBHOOK_URL` (see below). Redeploy.

## Free Google Sheet setup (5 min)
1. Create a Google Sheet. Extensions > Apps Script. Paste:
```
function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var s = SpreadsheetApp.getActive().getSheetByName(d.type) || SpreadsheetApp.getActive().insertSheet(d.type);
  if (s.getLastRow() === 0) s.appendRow(Object.keys(d));
  s.appendRow(Object.values(d).map(String));
  return ContentService.createTextOutput("ok");
}
```
2. Deploy > New deployment > Web app > Execute as: Me, Access: Anyone. Copy the URL into `SHEET_WEBHOOK_URL`.

## Client must provide
Logo, real parent reviews, fee details (edit `FEES` in src/App.jsx), final service areas, working hours, privacy policy and terms text.
