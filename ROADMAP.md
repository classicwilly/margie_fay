# Wonky Sprout OS - Roadmap to Final Boss Level

This roadmap provides a phased, prioritized plan to move the project from its current state to a fully built, polished, highly available, scalable, and empathetic final product.

## Phase 1: Core AI & Personas (complete)

- Implemented 5 personas: Grandma, Grandpa, Bob, Marge, Random
- Added fallback persona: Calm Guide
- Server-side persona merging in `/api/gemini` and functions-based `aiProxy`
- Client-side persona selection & `getAdvice` API

## Phase 2: Decision Flow & Consent (complete)

- Decision-paralysis detection hook & UI
- AI Consent modal (client) with allowPII flow
- Server-side PII sanitization and consent-aware auditing
- Offline queue for AI requests in `localStorage` with auto-flush

## Phase 3: Integrations & Connectors (in progress)

- Google Workspace connector (server) with OAuth & service-account flows
- Offline connectors for non-Google alternatives
- UI components use connectors facade (client)

## Phase 4: Infra & Scalability (in progress)

- Dockerfile for client & server (existing)
- K8s skeleton with deployment & HPA
- Redis cache option configured and used in server

## Phase 5: Security & Hardening (in progress)

- Audit logger & rate-limiter implemented
- PII scrubbing with explicit consent; enforce PII policies in server
- Prepare RBAC templates for cloud environment; recommended use: HashiCorp Vault or Cloud-managed secrets

## Phase 6: UX & Product Distinctiveness (iterative)

- Persona-driven onboarding & subtle personalization (digital heirlooms)
- Gamification & user research to shape the 'not just another app' perception; likely to involve UX research sprints and design phases

## Phase 7: Testing & Release Strategy (in progress)

- Unit/E2E/Visual tests updated for persona & consent flows
- Add performance & load tests to simulate 20 concurrent users and HPA behavior
- Define GA rollout phases: private alpha, beta (100 users), production (open)

## Suggested Timeline (sprints)

- Sprint 1 (2 weeks): Persona refinement, stable unit & e2e tests, decision hook UX polish
- Sprint 2 (2 weeks): Connectors & offline improvements, add service worker if desired
- Sprint 3 (2 weeks): Infra & HPA, Redis & secrets, basic DR plan & observability
- Sprint 4 (2 weeks): Security audit, community user testing, UX polish
- Ongoing: AI persona tuning, user research, and iterative productization

## Final Acceptance Criteria

- All personas produce stable outputs matching persona tone & style (automated style tests)
- Offline & connector fallbacks work reliably and data remains private
- Consent flows are explicit and auditable (audit logs & optional telemetry)
- Observability & security tooling in place (Prometheus/Grafana/Tracing/Sentry)
- Production deployment using Kubernetes/Helm or Cloud Run with RBAC and secrets management

---

If you'd like I can now: implement any of the remaining Phase 3-6 tasks in code, setup a CI pipeline for deployment to Cloud Run or AKS/EKS/GKE, or prepare a production checklist and runbook for launch and scaling.
