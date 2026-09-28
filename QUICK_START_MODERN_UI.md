# Quick Start - Modern UI Components for OpenImpact

Get your impact platform modernized in minutes! 🚀

## Step 1: Import Components (1 minute)

```tsx
import { ModernButton, ModernCard, ImpactCard, FundingCard } from '@/components/ui';
import { ModernHeader } from '@/components/ui/ModernHeader';
```

## Step 2: Pick Your First Component (1 minute)

**Easy Wins:**
- ✨ ModernButton - Replace all buttons
- ✨ ModernCard - Replace all cards
- ✨ ModernInput - Update forms

**High Impact:**
- 🔥 ModernHeader - Update navigation
- 🔥 ImpactCard - Display metrics
- 🔥 FundingCard - Show projects

## Step 3: Use Components (2 minutes)

### Example 1: Modern Button
```tsx
<ModernButton variant="primary" size="lg">
  Fund This Project
</ModernButton>

<ModernButton variant="success" isLoading>
  Processing Payment...
</ModernButton>
```

### Example 2: Impact Metrics
```tsx
<ImpactCard
  title="Communities Served"
  metric="Total Impact"
  value="2,458"
  trend={{ value: 24.5, direction: 'up' }}
  description="Growing impact each month"
/>
```

### Example 3: Funding Project
```tsx
<FundingCard
  projectTitle="Build Tech Center"
  description="Creating opportunities for rural youth"
  fundedAmount={75000}
  targetAmount={100000}
  currency="NGN"
  supportersCount={148}
  daysRemaining={15}
  onClick={() => openProjectDetail()}
/>
```

### Example 4: Form Input
```tsx
<ModernInput
  label="Project Title"
  placeholder="Enter project name"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  helperText="Give your project a compelling title"
/>
```

### Example 5: Header Navigation
```tsx
<ModernHeader
  logo={<img src="logo.png" alt="OpenImpact" className="w-8" />}
  navLinks={[
    { label: 'Projects', onClick: () => navigate('/projects') },
    { label: 'Opportunities', onClick: () => navigate('/opportunities') },
    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
  ]}
  actions={<ModernButton variant="primary">Connect</ModernButton>}
/>
```

## Common Patterns

### Dashboard Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <ImpactCard title="Active" metric="Projects" value="248" />
  <ImpactCard title="Total" metric="Funded" value="₦2.5M" />
  <ImpactCard title="Community" metric="Supporters" value="8,234" />
</div>
```

### Project Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {projects.map(project => (
    <FundingCard
      key={project.id}
      projectTitle={project.title}
      description={project.description}
      fundedAmount={project.funded}
      targetAmount={project.target}
      currency="NGN"
      supportersCount={project.supporters}
    />
  ))}
</div>
```

### Loading State
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    await submitProject();
    setShowSuccess(true);
  } finally {
    setIsSubmitting(false);
  }
};

<ModernButton isLoading={isSubmitting} onClick={handleSubmit}>
  Create Project
</ModernButton>
```

## Component Variants

### Buttons
```tsx
<ModernButton variant="primary">Primary</ModernButton>
<ModernButton variant="secondary">Secondary</ModernButton>
<ModernButton variant="outline">Outline</ModernButton>
<ModernButton variant="ghost">Ghost</ModernButton>
<ModernButton variant="success">Success</ModernButton>
<ModernButton variant="danger">Danger</ModernButton>
```

### Cards
```tsx
<ModernCard variant="default">Default</ModernCard>
<ModernCard variant="glassmorphic">Glassmorphic</ModernCard>
<ModernCard variant="gradient">Gradient</ModernCard>
<ModernCard variant="elevated">Elevated</ModernCard>
<ModernCard variant="impact">Impact</ModernCard>
```

### Sizes
```tsx
<ModernButton size="sm">Small</ModernButton>
<ModernButton size="md">Medium</ModernButton>
<ModernButton size="lg">Large</ModernButton>
```

## Icons with Lucide

```tsx
import { Heart, TrendingUp, Users, Target } from 'lucide-react';

<ModernButton icon={<Heart className="w-4 h-4" />}>
  Support
</ModernButton>

<ImpactCard
  icon={<TrendingUp className="w-6 h-6" />}
  title="Growth"
  metric="This Month"
  value="↑ 42%"
/>
```

## Dark Mode

All components automatically support dark mode:
```tsx
// Light theme (default)
<ImpactCard title="Projects" value="248" />

// Dark mode (automatic via Tailwind)
// Just include dark: classes in your HTML
// <html class="dark"> enables dark mode
```

## Customization

### Add Custom Styles
```tsx
<ModernButton 
  variant="primary" 
  className="rounded-full"
>
  Pill Button
</ModernButton>
```

### Override Colors
Edit Tailwind config in your theme:
```ts
theme: {
  extend: {
    colors: {
      impact: {
        50: '#f0f9ff',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
      }
    }
  }
}
```

## Testing Your Work

After implementing each component, check:
- ✅ Visual appearance on desktop
- ✅ Responsive on mobile
- ✅ Dark mode works
- ✅ Keyboard navigation works
- ✅ No console errors
- ✅ Animations are smooth

## Troubleshooting

### Components Not Found
Check that files are in correct location:
```
src/components/ui/
├── ModernButton.tsx
├── ModernCard.tsx
├── ModernInput.tsx
├── ImpactCard.tsx
├── FundingCard.tsx
├── ModernHeader.tsx
└── index.ts
```

### Styles Not Applying
Ensure Tailwind CSS is properly configured in your project.

### Dark Mode Not Working
Make sure `darkMode: 'class'` is in your Tailwind config.

## Next Steps

1. ✅ Start with ModernButton
2. ✅ Add ModernCard to dashboard
3. ✅ Use ImpactCard for metrics
4. ✅ Display projects with FundingCard
5. ✅ Update forms with ModernInput
6. ✅ Add ModernHeader navigation

Then read `MODERN_UI_COMPONENTS.md` for comprehensive documentation!

---

**You're ready! Start implementing and watch your platform transform.** ✨
