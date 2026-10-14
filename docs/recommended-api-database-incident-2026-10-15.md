# Recommended carwash API incident (2026-10-15)

## Impact

On the public user site, the recommended carwash request could remain pending and then appear as `canceled` in browser DevTools. The home page could show an error instead of a recommendation while signed out.

## Findings

- A direct request to `/api/open/carwashes/recommended?latitude=35.14&longitude=126.9` returned HTTP 500 after about 10 seconds.
- The response included `JDBCConnectionException: could not extract ResultSet`.
- Railway backend logs recorded MySQL SQL error 1053 / SQLState 08S01 and `Server shutdown in progress` while `CarwashService.findNearestCarwashByUserLocation` was executing.
- The frontend Axios timeout is 5 seconds. The backend failure took longer than that, so the browser could abort/mark the request canceled before it received the server's eventual 500. `canceled` is therefore not itself an HTTP response code.
- The available evidence points to a transient backend-to-MySQL connection interruption (consistent with Railway service sleep/resume), not invalid default coordinates or a login requirement. Root cause of the database shutdown still needs Railway-side confirmation.

## Resolution

- Always render the local example recommendation immediately; replace it with API data once the request succeeds.
- Label the card as an example while no API recommendation is available, so fallback content is not mistaken for live results.
- Keep the API call enabled for signed-out users and retain the default coordinates when browser geolocation is unavailable.
- The public production alias still served the prior error UI after the new deployment was Ready, while the version-specific preview showed the updated card. A stale service-worker cache is a likely explanation, but needs confirmation and a scope-safe cleanup strategy.
- Demo mode already registers MSW at the root scope. Enabling the PWA worker in that build is unsafe because both workers compete for the same scope; this was tested and reverted.

## Verification and follow-up

- Add component coverage for fallback display while the request is pending and after it fails.
- Verify the production bundle includes the new behavior after deployment.
- Resolve stale production service-worker caches without competing with the MSW worker, then verify with an existing browser session.
- Backend follow-up: inspect Railway MySQL sleep/restart and connection-pool lifecycle around the recorded error. Do not change Railway sizing/always-on settings without reviewing the possible cost impact.
