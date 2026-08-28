SPOTLIGHT 5–7 · STAGING SCREEN v0.6.5

Temporary GitHub Pages payload for pre-production testing.

It contains:
- public shell + DEMO9 assets;
- FULL loader;
- Yandex Content Gateway URL;
- staging boot that reuses the existing CLEAN session stored on the same dreamteamenglish.github.io origin.

It does NOT contain:
- 210 FULL lesson JSON payloads;
- the full Activities bank;
- private v24-method.js / v24-ai.js;
- any S3 secret key;
- Supabase service_role or other server secret.

Test flow:
1. Sign in to the current production CLEAN.
2. Open this staging GitHub Pages site.
3. Gateway re-validates the existing token at Supabase.
4. FULL content is downloaded directly from Yandex Object Storage.
5. Check grades 5 / 6 / 7, lessons, Activities, prompt and document flow.

DO NOT replace production CLEAN until staging QA is complete.
