# Project: Best Stays – MVP

## Overview
Best Stays is a real estate listing platform designed for agents to manage property profiles across multiple domains such as "For Sale", "For Rent", and others.

## Tech Stack
- **Frontend**: Next.js 15+
- **Package Manager**: Yarn 2
- **Backend/Storage**: Supabase (DB, Auth, File Storage)
- **Schemas**: Zod
- **Deployment**: Vercel (production), local (dev DB)

## User Roles
- **Admin** – System-level configuration (multi-language, future moderation).
- **Agent** – Core user; can create and manage property listings.

## MVP Scope
- Agents can:
  - Create properties.
  - Add properties to multiple domains (For Sale, For Rent).
  - Define domain-specific content (title, description, images).

## Property Structure
- **Base fields**: Location, coordinates, etc.
- **Per-domain fields**: Title, description, price, domain-specific features.
- **Per-domain images**: Each domain has its own image set.

## AI (Planned Features)
- AI-enhanced images (e.g., cropping, lighting).
- AI parsing of long-form descriptions into structured fields.
- AI-powered multilingual support with reviewable suggestions.

## Localization
- Admin can define supported languages.
- Each field can be translated (auto/manual) and validated via LanguageService.