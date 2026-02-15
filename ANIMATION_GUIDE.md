# 🎨 Velora Animation & Effects Guide

A comprehensive guide to all animations, effects, and interactive elements in Velora.

## 📦 New Components Created

### 1. **Spinner Components** (`src/components/shared/spinner.tsx`)

Various loading animations to enhance user experience:

```tsx
import { 
  Spinner, 
  GradientSpinner, 
  PulseSpinner, 
  DotsSpinner,
  OrbitSpinner,
  RippleSpinner,
  InfinitySpinner,
  LoadingScreen 
} from "@/components/shared/spinner";
```

#### Available Spinners:
- **GradientSpinner** - Rotating gradient ring
- **PulseSpinner** - Pulsing circles with gradient
- **DotsSpinner** - Bouncing dots animation
- **OrbitSpinner** - Orbiting particles
- **RippleSpinner** - Expanding ripples
- **InfinitySpinner** - Figure-8 animation
- **LoadingScreen** - Full-screen loading overlay

#### Usage:
```tsx
<Spinner size="lg" variant="gradient" />
<LoadingScreen message="Loading products..." />
```

---

### 2. **Animated Buttons** (`src/components/shared/animated-button.tsx`)

Enhanced buttons with various hover and click animations:

```tsx
import { 
  AnimatedButton, 
  MagneticButton,
  FloatingButton,
  TiltButton,
  LiquidButton,
  NeonButton 
} from "@/components/shared/animated-button";
```

#### Available Buttons:
- **AnimatedButton** - Basic animated button with loading states
- **MagneticButton** - Button with magnetic hover effect
- **FloatingButton** - Floating action button with ripple
- **TiltButton** - 3D tilt effect on hover
- **LiquidButton** - Liquid gradient animation
- **NeonButton** - Glowing neon effect

#### Usage:
```tsx
<AnimatedButton 
  variant="gradient" 
  animation="bounce"
  glow={true}
  isLoading={isLoading}
>
  Add to Cart
</AnimatedButton>

<LiquidButton onClick={handleCheckout}>
  Checkout Now
</LiquidButton>

<NeonButton color="cyan">
  Shop Now
</NeonButton>
```

---

### 3. **Animation Components** (`src/components/shared/animations.tsx`)

Reusable animation wrappers for scroll and entrance effects:

```tsx
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  ScaleOnScroll,
  Parallax,
  TextReveal,
  BlurFade,
  Flip,
  BounceIn,
  HoverLift,
  PageTransition,
  Floating,
  PulseGlow,
  Shake,
  Typewriter
} from "@/components/shared/animations";
```

#### Available Animations:
- **FadeIn** - Fade in with direction
- **StaggerContainer/StaggerItem** - Staggered children animations
- **ScaleOnScroll** - Scale effect based on scroll position
- **Parallax** - Parallax scroll effect
- **TextReveal** - Word-by-word text reveal
- **BlurFade** - Blur to clear fade effect
- **BounceIn** - Bounce entrance animation
- **HoverLift** - Lift on hover with shadow
- **Floating** - Continuous floating animation
- **PulseGlow** - Pulsing glow effect
- **Shake** - Shake animation (for errors)
- **Typewriter** - Character-by-character typing

#### Usage:
```tsx
<FadeIn direction="up" delay={0.2}>
  <h1>Welcome to Velora</h1>
</FadeIn>

<StaggerContainer staggerDelay={0.1}>
  {products.map(product => (
    <StaggerItem key={product.id}>
      <ProductCard {...product} />
    </StaggerItem>
  ))}
</StaggerContainer>

<Parallax speed={0.5}>
  <HeroImage />
</Parallax>
```

---

### 4. **Special Effects** (`src/components/shared/effects.tsx`)

Celebration and interaction effects:

```tsx
import {
  Confetti,
  Fireworks,
  Sparkles,
  SuccessCheckmark,
  HeartAnimation,
  CartBadgeAnimation,
  NotificationToast
} from "@/components/shared/effects";
```

#### Available Effects:
- **Confetti** - Falling confetti celebration
- **Fireworks** - Firework burst animation
- **Sparkles** - Continuous sparkle effect
- **SuccessCheckmark** - Animated checkmark
- **HeartAnimation** - Heart burst for wishlist
- **CartBadgeAnimation** - Bouncing cart badge
- **NotificationToast** - Animated toast notifications

#### Usage:
```tsx
const [showConfetti, setShowConfetti] = useState(false);

<Confetti 
  trigger={showConfetti} 
  particleCount={100}
  duration={3000}
/>

<HeartAnimation 
  isLiked={isLiked} 
  onClick={() => setIsLiked(!isLiked)} 
/>

<Sparkles active={true}>
  <Badge>Featured</Badge>
</Sparkles>
```

---

### 5. **Enhanced Product Card** (`src/components/shared/product-card.tsx`)

3D product cards with advanced hover effects:

#### Features:
- ✅ 3D tilt effect on mouse move
- ✅ Image carousel on hover
- ✅ Confetti on add to cart
- ✅ Heart animation for wishlist
- ✅ Floating action buttons
- ✅ Gradient overlays
- ✅ Smooth transitions

---

## 🎨 CSS Animation Classes

All available in `globals.css`:

### Entrance Animations:
```css
.animate-fade-in      /* Fade in from bottom */
.animate-slide-up     /* Slide up with fade */
.animate-scale-in     /* Scale from 0.95 to 1 */
.animate-rotate-in    /* Rotate in from -200deg */
.animate-flip-in-x    /* Flip in from X axis */
.animate-zoom-in-up   /* Zoom in from bottom */
.animate-slide-in-left-bounce  /* Slide with bounce */
.animate-light-speed-in        /* Light speed entrance */
```

### Attention Animations:
```css
.animate-bounce-slow   /* Gentle bounce */
.animate-float         /* Floating up/down */
.animate-pulse-glow    /* Pulsing glow shadow */
.animate-heartbeat     /* Heartbeat scale */
.animate-rubber-band   /* Rubber band effect */
.animate-tada          /* Tada/wiggle */
.animate-swing         /* Pendulum swing */
.animate-jello         /* Jello wobble */
.animate-shake         /* Shake error effect */
.animate-flash         /* Flash opacity */
```

### Special Effects:
```css
.animate-gradient      /* Animated gradient background */
.animate-gradient-text /* Animated text gradient */
.animate-border-dance  /* Morphing border radius */
.animate-morph         /* Blob morphing */
.animate-spin-slow     /* Slow rotation */
```

### Hover Utilities:
```css
.hover-scale           /* Scale 1.05 on hover */
.hover-rotate          /* Rotate 5deg on hover */
.hover-skew            /* Skew on hover */
.hover-lift            /* Lift with shadow */
```

### 3D Utilities:
```css
.perspective-1000      /* 3D perspective */
.preserve-3d          /* Preserve 3D transforms */
.backface-hidden      /* Hide backface */
```

---

## 💡 Usage Examples

### Homepage Animations:
```tsx
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animations";

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <FadeIn direction="up" delay={0.2}>
        <HeroSection />
      </FadeIn>
      
      <StaggerContainer staggerDelay={0.1}>
        {features.map((feature, i) => (
          <StaggerItem key={i}>
            <FeatureCard {...feature} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
```

### Add to Cart with Confetti:
```tsx
import { Confetti } from "@/components/shared/effects";
import { AnimatedButton } from "@/components/shared/animated-button";

export function ProductCard({ product }) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(product);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 500);
  };
  
  return (
    <>
      <Confetti trigger={showConfetti} particleCount={20} />
      <AnimatedButton 
        variant="gradient"
        animation="bounce"
        glow
        onClick={handleAddToCart}
      >
        Add to Cart
      </AnimatedButton>
    </>
  );
}
```

### Loading States:
```tsx
import { Spinner, LoadingScreen } from "@/components/shared/spinner";

// Inline loading
{isLoading && <Spinner size="lg" variant="gradient" />}

// Full screen loading
{isPageLoading && <LoadingScreen message="Loading products..." />}
```

### Scroll Animations:
```tsx
import { ScaleOnScroll, Parallax } from "@/components/shared/animations";

<ScaleOnScroll>
  <ProductShowcase />
</ScaleOnScroll>

<Parallax speed={0.3}>
  <BackgroundImage />
</Parallax>
```

---

## 🎯 Best Practices

### 1. **Performance**
- Use `will-change` sparingly on animated elements
- Prefer `transform` and `opacity` for animations (GPU accelerated)
- Use `layoutId` in Framer Motion for shared element transitions
- Implement `reduced-motion` media query support

### 2. **User Experience**
- Keep animations under 300-500ms for micro-interactions
- Use easing functions: `ease-out` for entrances, `ease-in-out` for continuous
- Provide visual feedback on all interactive elements
- Don't over-animate - less is more

### 3. **Accessibility**
```tsx
// Respect user preferences
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4. **Mobile Considerations**
- Use `touch-manipulation` CSS class for mobile
- Reduce animation complexity on mobile devices
- Test on actual devices, not just emulators

---

## 🔧 Custom Animation Speeds

Adjust animation timing with Tailwind classes:

```tsx
// Fast
<motion.div transition={{ duration: 0.2 }} />

// Normal
<motion.div transition={{ duration: 0.4 }} />

// Slow
<motion.div transition={{ duration: 0.8 }} />

// Spring physics
<motion.div 
  transition={{ 
    type: "spring", 
    stiffness: 300, 
    damping: 20 
  }} 
/>
```

---

## 📱 Animation Presets

### E-commerce Specific:

**Add to Cart:**
```tsx
<button className="animate-bounce-slow hover:scale-105 transition-transform">
  🛒 Add to Cart
</button>
```

**Product Card Hover:**
```tsx
<motion.div
  whileHover={{ y: -8, scale: 1.02 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  <ProductCard />
</motion.div>
```

**Price Update:**
```tsx
<motion.span
  key={price}
  initial={{ scale: 1.2, color: "#10B981" }}
  animate={{ scale: 1, color: "inherit" }}
>
  ${price}
</motion.span>
```

**Success State:**
```tsx
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", stiffness: 200 }}
>
  ✓ Added!
</motion.div>
```

---

## 🎊 Celebration Triggers

Use these moments to trigger animations:

- ✅ Add to cart → Confetti burst
- ✅ Purchase complete → Fireworks
- ✅ Add to wishlist → Heart burst
- ✅ Newsletter signup → Success checkmark
- ✅ Page load → Staggered entrance
- ✅ Scroll to section → Fade in elements
- ✅ Hover on product → 3D tilt
- ✅ Click button → Scale down feedback

---

## 📚 Additional Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Animations](https://tailwindcss.com/docs/animation)
- [CSS Tricks Animation Guide](https://css-tricks.com/almanac/properties/a/animation/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

---

**Note:** All animations respect `prefers-reduced-motion` for accessibility.
