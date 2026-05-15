## Plan: Full Astro Migration with Angular Islands

Migrate the site fully from Analog to Astro in phases, preserving all existing public URLs and markdown content while retaining Angular only for meaningful interactive UI (islands) and using lightweight vanilla JavaScript for tiny DOM helpers. Use rollback checkpoints after each phase. Keep compatibility with current GitHub Pages custom domain deployment and avoid breaking existing tutorial entry paths.

**Steps**
1. Phase 0 - Baseline and Cutover Guardrails
2. Capture route/content baseline from the current site: all public paths, blog slugs, canonical behavior, sitemap entries, robots behavior, and image URLs. This baseline is the acceptance contract for migration. Blocks all later phases.
3. Document rollback mechanism on the new branch: if any phase fails acceptance, revert to last passing phase branch point. Depends on step 2.
4. Phase 1 - Astro Foundation (No Content Switch Yet)
5. Initialize Astro project structure in current repo branch with Tailwind and Markdown content collections. Keep static output target for GitHub Pages and custom domain behavior. Depends on step 2.
6. Add Astro Angular integration via @analogjs/astro-angular and constrain transformed files to Angular island folders to reduce plugin side effects. Depends on step 5.
7. Port global shell and static pages first (home/about/contact/privacy/creative-commons) with visual parity and metadata parity. Depends on step 5; parallel with step 6 after base init.
8. Phase 2 - Content and Blog Route Migration
9. Migrate markdown corpus to Astro content collection with schema equivalent to current PostAttributes contract, including draft handling and date fields. Depends on step 5.
10. Implement blog listing and dynamic blog detail routes in Astro, preserving existing public route patterns exactly (including /blog/{slug}). Depends on step 9.
11. Recreate SEO/meta behavior in Astro layouts/pages: title, description, OG, Twitter tags, canonical, JSON-LD, and sitemap/robots parity. Depends on step 10.
12. Validate image links and asset paths remain stable using existing public image structure and markdown references. Depends on step 10; parallel with step 11.
13. Phase 3 - Interactivity Migration Strategy
14. Migrate substantial interactive behavior to Angular islands (client directives chosen by UX criticality). Depends on step 6 and step 10.
15. Migrate tiny utility interactions (copy code button, external-link tweaks) to vanilla scripts unless proven beneficial as Angular islands. Depends on step 10; parallel with step 14.
16. Enforce hydration boundaries and serialization-safe props between Astro and Angular to avoid runtime mismatch. Depends on step 14.
17. Phase 4 - GitHub Pages Deployment and URL Continuity
18. Configure build/deploy pipeline for GitHub Pages static publishing with custom domain continuity from CNAME. Depends on step 7 and step 10.
19. Preserve existing tutorial entry paths policy: ensure this site keeps stable links/entry points for /pwa-tutorial and similar paths without taking ownership of those apps' internal routing. Depends on step 18.
20. Run production-like smoke tests against deployed preview to confirm route continuity and no regressions in external tutorial app handoff. Depends on step 19.
21. Phase 5 - Verification, Performance, and Final Cutover
22. Execute parity checklist: route map, metadata map, rendered markdown fidelity, search/discoverability files, and accessibility basics. Depends on steps 11-16.
23. Measure performance and bundle impact; verify Angular islands only load where needed and static pages stay near-zero JS. Depends on step 14.
24. Final cutover on mainline branch after all gates pass; keep rollback tag/branch snapshot. Depends on steps 20-23.

**Relevant files**
- `src/content/` - Source markdown corpus and image references to preserve.
- `src/app/post-attributes.ts` - Current front matter contract to mirror in Astro schema.
- `src/app/pages/blog/index.page.ag` - Current blog list behavior and filtering reference.
- `src/app/pages/blog/[slug].page.ag` - Current blog detail route, metadata, and rendering behavior.
- `src/app/shared/directives/code-copy-button.directive.ts` - Utility interaction to migrate as tiny script or island fallback.
- `src/app/shared/directives/external-links.directive.ts` - External link behavior to migrate.
- `public/` - Static assets, including images and robots/CNAME.
- `public/CNAME` - Domain continuity for bneuhausz.dev.
- `vite.config.ts` - Existing prerender/sitemap behavior used as migration parity reference.
- `package.json` - Existing command baseline and dependency transition anchor.

**Verification**
1. Baseline diff check: generated Astro routes must exactly match existing public route inventory for migrated pages.
2. Content parity check: each post slug resolves, front matter fields map correctly, draft posts excluded from public output.
3. SEO parity check: title/description/OG/Twitter/canonical/JSON-LD and sitemap output equivalent or improved.
4. Asset parity check: all markdown-referenced images resolve under the same public paths.
5. Interactivity check: Angular islands hydrate only where intended; tiny utilities work without hydration errors.
6. Deployment check: GitHub Pages output serves custom domain correctly and preserves tutorial entry path behavior.
7. Rollback drill: confirm branch/tag rollback restores last known-good deployment quickly.

**Decisions**
- Direction changed from evaluation to full migration on this branch.
- Keep markdown authoring and migrate existing markdown corpus.
- Preserve all existing URLs exactly for current blog/public routes.
- Use Angular for complex interactive UI; use tiny vanilla scripts for small DOM helpers.
- Execute phased migration with rollback checkpoints.
- Ads remain deferred; architecture should remain ad-compatible.

**Further Considerations**
1. Tutorial path ownership boundary: this repo should preserve stable entry links/paths, but those apps remain deployed and internally routed by their own repos.
2. Angular island placement policy: define strict criteria for when a behavior deserves Angular vs vanilla to control bundle growth.
3. Cutover observability: add a temporary post-cutover monitoring checklist for 404s, metadata regressions, and broken asset references.
