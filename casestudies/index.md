# Grouped Case Studies — Index

**Source:** grouped.com/case-studies  
**Last synced:** March 11, 2026  
**Total:** 7 case studies

This file serves as the manifest for all case study markdown files in this directory. Each entry maps to a `.md` file with full frontmatter and content.

---

## All Case Studies

| File | Artist | Key Result | Tags |
|---|---|---|---|
| `forrest-frank.md` | Forrest Frank | 1.2M followers in 35 days | fan-voting, premiere-access, focus-group |
| `somo.md` | SoMo | Sold-out album release party + livestream | livestreams, premiere-access, ticket-sales |
| `pardyalone.md` | PardyAlone | $35,000+ ARR from tour M&G | subscriptions, recurring-revenue, meet-and-greet |
| `jake-scott.md` | Jake Scott | 300 paid members in 24 hours | subscriptions, urgency, merch |
| `nic-d.md` | Nic D | Merch + paid tier growth via early album access | premiere-access, merch, bundle |
| `michael-minelli.md` | Michael Minelli | Thousands in merch, fan-designed | fan-voting, discussion-forums, zero-cost |
| `mike.md` | MIKE. | Automated subscriber growth via Instagram | social-automations, free-trials, instagram |

---

## Frontmatter Schema

Each case study file uses consistent frontmatter. Use this schema when adding new entries:

```yaml
---
title: ""              # Full display title
slug: ""               # URL slug (kebab-case)
artist: ""             # Artist display name
genre: ""              # Genre
community_name: ""     # Name of their Grouped community
community_url: ""      # https://app.grouped.com/[handle]
source_url: ""         # Original grouped.com article URL
image_url: ""          # Headshot image from grouped.com (direct URL)
published: YYYY-MM-DD  # Original publish date
tags: []               # Array of lowercase kebab-case tags
features_used: []      # Grouped features used (human-readable)
stats:                 # Array of 3-4 highlight stats
  - value: ""
    label: ""
---
```

---

## Tag Reference

Use these tags consistently across all case studies:

| Tag | Meaning |
|---|---|
| `fan-voting` | Artist used polls or image votes inside the Group |
| `premiere-access` | Fans got content/access before public release |
| `focus-group` | Fans influenced creative decisions |
| `social-growth` | Result included follower or reach growth |
| `subscriptions` | Artist runs a paid tier |
| `recurring-revenue` | Revenue is ongoing, not one-time |
| `merch` | Merch was part of the strategy |
| `livestreams` | Artist used live video inside Grouped |
| `ticket-sales` | Event tickets sold through the Group |
| `meet-and-greet` | M&G used as a membership perk |
| `social-automations` | Third-party IG/comment automation involved |
| `free-trials` | Free trial offer used to drive signups |
| `bundle` | Merch + membership combo offer |
| `urgency` | Limited-time or limited-quantity mechanic |
| `zero-cost` | Campaign had minimal or no upfront cost |
| `discussion-forums` | Discussion tab used as part of strategy |
| `album-release` | Tied to a music release campaign |
| `instagram` | Instagram was the primary source channel |

---

## Adding New Case Studies

1. Create a new `.md` file in this directory using the slug as the filename
2. Copy the frontmatter schema above and fill in all fields
3. Add the entry to the table in this index file
4. Add any new tags to the tag reference above if needed
5. Commit to GitHub — the site will pick it up on next build
