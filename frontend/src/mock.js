// Mock data for Emergent clone

export const features = [
  {
    id: 1,
    title: "Build websites and mobile apps",
    description: "Transform your ideas into fully functional websites and mobile apps with instant deployment, seamless data connections, and powerful scalability.",
    icon: "monitor"
  },
  {
    id: 2,
    title: "Build custom agents",
    description: "Create intelligent AI agents that automate tasks, handle customer interactions, and enhance your application capabilities.",
    icon: "bot"
  },
  {
    id: 3,
    title: "Build powerful integrations",
    description: "Connect to any API, database, or service. Seamlessly integrate payment processors, authentication providers, and third-party tools.",
    icon: "plug"
  }
];

export const pricingPlans = [
  {
    id: 1,
    name: "Free",
    icon: "gift",
    description: "Get started with essential features at no cost",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      "1 project",
      "Basic AI assistance",
      "Community support",
      "Emergent subdomain",
      "1GB storage"
    ]
  },
  {
    id: 2,
    name: "Standard",
    icon: "target",
    description: "Perfect for first-time builders",
    monthlyPrice: 17,
    annualPrice: 204,
    annualSave: 36,
    features: [
      "5 projects",
      "Advanced AI assistance",
      "Priority support",
      "Custom domain",
      "10GB storage",
      "Advanced analytics"
    ],
    popular: true
  },
  {
    id: 3,
    name: "Pro",
    icon: "sparkles",
    description: "Built for serious creators and brands",
    monthlyPrice: 167,
    annualPrice: 2004,
    annualSave: 396,
    features: [
      "Unlimited projects",
      "Premium AI models",
      "24/7 priority support",
      "Multiple custom domains",
      "100GB storage",
      "Advanced analytics",
      "Team collaboration",
      "API access"
    ]
  }
];

export const faqs = [
  {
    id: 1,
    question: "What can I build with Emergent?",
    answer: "With Emergent, you can build full-stack web applications, mobile apps, landing pages, e-commerce sites, SaaS products, custom AI agents, and powerful integrations. From simple websites to complex enterprise applications, Emergent handles it all."
  },
  {
    id: 2,
    question: "How does Emergent's pricing work?",
    answer: "Emergent offers transparent pricing with three tiers: Free for getting started, Standard for growing projects, and Pro for enterprise needs. You can pay monthly or annually (with savings). All plans include AI assistance and scale with your needs."
  },
  {
    id: 3,
    question: "Do I need coding experience to use Emergent?",
    answer: "No coding experience required! Emergent's AI understands natural language, so you can describe what you want to build, and it creates production-ready code. However, developers can also dive into the code and customize everything."
  },
  {
    id: 4,
    question: "How is Emergent different from other no-code platforms?",
    answer: "Unlike traditional no-code platforms, Emergent generates real, production-ready code that you own. It supports complex logic, custom integrations, and scales infinitely. You're never locked in - export and self-host anytime."
  },
  {
    id: 5,
    question: "What happens to the code Emergent creates?",
    answer: "You own all the code Emergent generates. It's real React, Node.js, and MongoDB code that you can export, modify, and deploy anywhere. No vendor lock-in, no proprietary formats."
  }
];

export const showcaseImages = [
  {
    id: 1,
    title: "Series B Funded",
    description: "Backed by leading investors to help you build and launch faster than ever.",
    badge: "Y Combinator S24",
    mainText: "Series B Funded 🎉",
    image: "https://assets.emergent.sh/assets/showcase/series_b_landing.webp"
  },
  {
    id: 2,
    title: "Build Faster",
    description: "Ship production-ready apps in minutes, not months.",
    mainText: "10x Faster Development",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
  },
  {
    id: 3,
    title: "AI-Powered",
    description: "Let AI handle the complexity while you focus on your vision.",
    mainText: "Intelligent Code Generation",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
  }
];

export const authProviders = [
  { id: 1, name: "Google", icon: "chrome" },
  { id: 2, name: "GitHub", icon: "github" },
  { id: 3, name: "Apple", icon: "apple" },
  { id: 4, name: "Facebook", icon: "facebook" }
];
