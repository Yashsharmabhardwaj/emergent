# Emergent Clone - Project Documentation

## Overview
A pixel-perfect clone of the Emergent website (emergent.sh) built with React, featuring all main pages and interactive elements.

## Pages Implemented
1. **Home** (`/`) - Hero, Features, Pricing, FAQs
2. **Features** (`/features`) - Detailed features showcase
3. **Pricing** (`/pricing`) - Pricing plans with comparison table
4. **FAQs** (`/faqs`) - Frequently asked questions with accordion
5. **Enterprise** (`/enterprise`) - Enterprise features and contact form

## Key Features

### 1. Hero Section
- Animated "E" logo
- Gradient background (cyan to blue to purple)
- Multi-provider authentication UI:
  - Google (primary button)
  - GitHub, Apple, Facebook (icon buttons)
  - Email option
- Series B funding announcement card with:
  - Y Combinator S24 badge
  - $70M funding showcase
  - Gradient background
  - Mock browser window
  - Navigation dots

### 2. Features Section
- Three main features with icons:
  - Build websites and mobile apps
  - Build custom agents
  - Build powerful integrations
- Hover effects on feature cards
- Mock screenshot showcase

### 3. Pricing Section
- Three pricing tiers: Free ($0), Standard ($17), Pro ($167)
- Individual/Enterprise toggle
- Annual/Monthly pricing toggle
- Feature lists with checkmarks
- "Most Popular" badge on Standard plan
- Gradient button on popular plan

### 4. FAQ Section
- Accordion component (shadcn)
- 5 common questions with detailed answers
- Smooth expand/collapse animations

### 5. Navigation & Footer
- Fixed navigation bar with blur effect
- Navigation links: Features, Pricing, FAQs, Enterprise
- "Get Started" CTA button
- Footer with:
  - Product, Resources, Company columns
  - Social media links (Twitter, GitHub, LinkedIn, YouTube)
  - Copyright notice

## Mock Data Location
All content is stored in `/app/frontend/src/mock.js`:
- `features` - Feature descriptions
- `pricingPlans` - Pricing tier details
- `faqs` - FAQ questions and answers
- `showcaseImages` - Carousel images
- `authProviders` - Authentication provider details

## Design System

### Colors
- **Background**: White (#FFFFFF), Light gradients (cyan-50, blue-50, purple-50)
- **Primary**: Black (#000000)
- **Accent**: Cyan to Blue gradient (#00D9FF to #0066FF)
- **Text**: Black (primary), Gray-600 (secondary)
- **Success**: Green-600

### Typography
- **Headings**: Bold, 4xl-6xl font sizes
- **Body**: Regular, gray-600 color
- **Buttons**: Medium font weight

### Components Used
- shadcn/ui components (Button, Accordion, etc.)
- lucide-react icons
- Tailwind CSS for styling

## Interactive Elements (Frontend Mock)
All authentication buttons show toast notifications when clicked.
Form submissions display success messages.
Navigation between pages works seamlessly.
Hover states on cards, buttons, and links.

## Future Backend Integration
When ready for backend:
1. Replace mock data in `mock.js` with API calls
2. Add authentication flows for each provider
3. Connect pricing selection to payment processing
4. Store contact form submissions
5. Add user dashboard after authentication

## Technology Stack
- **Frontend**: React 19, React Router
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **State**: React hooks

## Notes
- All authentication is currently frontend-only with mock behavior
- Toast notifications confirm user actions
- Responsive design works across all screen sizes
- Smooth animations and transitions throughout
- Color contrast meets accessibility standards
