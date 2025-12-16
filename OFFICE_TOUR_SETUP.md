# 🚀 Office Tour Setup Guide

## Overview

I've created **3 mind-blowing office tour experiences** for your website:

1. **Interactive Floor Plan** - Navigate through an animated floor map
2. **Parallax Scroll Tour** - Cinematic scrolling experience with depth
3. **3D Bento Gallery** - Modern grid with 3D card flips

## 📁 File Structure

```
src/
├── components/
│   └── office/
│       ├── OfficeShowcase.tsx         (Interactive Floor Plan)
│       ├── OfficeParallaxTour.tsx     (Parallax Scroll)
│       └── Office3DGallery.tsx        (3D Gallery)
├── pages/
│   └── OfficeTourPage.tsx             (Main selector page)
└── ...

public/
└── office/                             ⬅️ CREATE THIS FOLDER
    ├── reception/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── 3.jpg
    ├── production/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   ├── bg.jpg     (for parallax)
    │   ├── mid.jpg    (for parallax)
    │   └── fg.jpg     (for parallax)
    ├── robotics/
    ├── workspace/
    ├── cafeteria/
    └── ... (add more sections as needed)
```

## 🎨 Image Organization

### Option 1: Simple Setup (For Gallery & Floor Plan)
Just organize your photos by room/section:

```
public/office/
├── reception/
│   ├── 1.jpg
│   ├── 2.jpg
│   └── 3.jpg
├── production/
│   ├── 1.jpg
│   ├── 2.jpg
│   └── 3.jpg
└── etc...
```

### Option 2: Advanced Setup (For Parallax Experience)
For the parallax effect, you'll need **3 layers per room** for depth effect:

```
public/office/entrance/
├── bg.jpg    (background layer - furthest back)
├── mid.jpg   (middle layer - medium depth)
└── fg.jpg    (foreground layer - closest to viewer)
```

**How to create layers from a single photo:**
1. Use Photoshop or GIMP
2. Separate elements by depth:
   - **Background**: Walls, windows, ceiling
   - **Midground**: Furniture, equipment
   - **Foreground**: Objects in front (chairs, desks)
3. Save as separate images with transparency
4. OR just use the same image 3 times (simpler but less dramatic effect)

## 🔧 Setup Instructions

### Step 1: Add to Routing

In your `App.tsx` or routing file:

```typescript
import { OfficeTourPage } from './pages/OfficeTourPage';

// Add route:
<Route path="/office-tour" element={<OfficeTourPage />} />
```

### Step 2: Add Images

1. Create `public/office/` folder
2. Add subfolders for each room/section
3. Add your photos (JPG or PNG, recommended size: 1920x1080)

### Step 3: Customize the Data

#### For Interactive Floor Plan (`OfficeShowcase.tsx`):

Edit the `officeData` array (around line 18):

```typescript
const officeData: Room[] = [
  {
    id: 'your-room-id',
    name: 'Your Room Name',
    description: 'Description of the room',
    images: [
      '/office/your-room/1.jpg',
      '/office/your-room/2.jpg',
    ],
    position: { x: 20, y: 30 },  // Position on map (0-100)
    icon: '🏢',  // Emoji icon
  },
  // Add more rooms...
];
```

#### For Parallax Tour (`OfficeParallaxTour.tsx`):

Edit the `sections` array (around line 19):

```typescript
const sections: OfficeSection[] = [
  {
    id: 'section-id',
    title: 'Section Title',
    subtitle: 'Subtitle text',
    images: {
      background: '/office/section/bg.jpg',
      midground: '/office/section/mid.jpg',
      foreground: '/office/section/fg.jpg',
    },
    description: 'Your description',
    highlights: ['Feature 1', 'Feature 2', 'Feature 3'],
    color: '#3B82F6',  // Hex color for theme
  },
  // Add more sections...
];
```

#### For 3D Gallery (`Office3DGallery.tsx`):

Edit the `galleryImages` array (around line 18):

```typescript
const galleryImages: GalleryImage[] = [
  {
    id: 'unique-id',
    src: '/office/room/photo.jpg',
    title: 'Photo Title',
    category: 'Production',  // Used for filtering
    description: 'Photo description',
    location: 'Floor 1',
    time: 'Morning',
    size: 'large',  // 'small' | 'medium' | 'large'
  },
  // Add more images...
];
```

## 🎯 Which Experience Should You Use?

### Use **Interactive Floor Plan** if:
- ✅ You want users to explore at their own pace
- ✅ You want to show spatial relationships
- ✅ You have a clear floor plan layout
- ✅ Quick implementation needed

### Use **Parallax Scroll Tour** if:
- ✅ You want a cinematic, storytelling experience
- ✅ You want to guide users through a narrative
- ✅ You have stunning photography
- ✅ Want maximum "WOW" factor

### Use **3D Bento Gallery** if:
- ✅ You have lots of photos to showcase
- ✅ You want filterable categories
- ✅ Want a modern, trendy design
- ✅ Users should browse freely

### Pro Tip: Use All Three!
The `OfficeTourPage` lets users **choose their experience** - best of all worlds!

## 🎬 Advanced Customizations

### Add More Animations

In any component, you can add more Framer Motion effects:

```typescript
<motion.div
  whileHover={{ scale: 1.1, rotate: 5 }}
  whileTap={{ scale: 0.95 }}
  animate={{ y: [0, -10, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
>
  Your content
</motion.div>
```

### Add Sound Effects

```typescript
const playHoverSound = () => {
  const audio = new Audio('/sounds/hover.mp3');
  audio.play();
};

<button onMouseEnter={playHoverSound}>
  Hover me!
</button>
```

### Add Video Backgrounds

Replace image sources with video:

```typescript
<video autoPlay loop muted className="w-full h-full object-cover">
  <source src="/office/production/video.mp4" type="video/mp4" />
</video>
```

## 🔥 Bonus Features Included

✨ **Interactive Elements**
- Pulsing room markers
- Hover tooltips
- Smooth transitions
- 3D card flips

🎨 **Visual Effects**
- Parallax depth
- Particle animations
- Gradient overlays
- Scan line effects
- Glow effects

📱 **Responsive Design**
- Mobile-optimized
- Touch-friendly
- Adaptive layouts

♿ **Accessibility**
- Keyboard navigation ready
- ARIA labels (can be added)
- Reduced motion support (can be added)

## 📊 Performance Tips

1. **Optimize Images**:
   ```bash
   # Use imagemagick or similar
   convert input.jpg -resize 1920x1080 -quality 85 output.jpg
   ```

2. **Lazy Load Images**:
   ```typescript
   <img loading="lazy" src="..." alt="..." />
   ```

3. **Use WebP Format**:
   ```html
   <picture>
     <source srcset="image.webp" type="image/webp">
     <img src="image.jpg" alt="...">
   </picture>
   ```

## 🚀 Going Even Further

### Add 360° Panoramas

Install pannellum:
```bash
npm install pannellum-react
```

```typescript
import { Pannellum } from "pannellum-react";

<Pannellum
  width="100%"
  height="600px"
  image="/office/360/reception.jpg"
  pitch={10}
  yaw={180}
  autoLoad
/>
```

### Add AR View

Use AR.js or 8th Wall for augmented reality features.

### Add Virtual Tour Links

Connect rooms like a virtual walkthrough:

```typescript
const roomConnections = {
  reception: ['hallway', 'office'],
  hallway: ['reception', 'production'],
  // etc...
};
```

## 🐛 Troubleshooting

**Images not showing?**
- Check file paths are correct
- Ensure images are in `public/` folder
- Check browser console for 404 errors

**Animations stuttering?**
- Reduce image sizes
- Enable hardware acceleration in browser
- Check for console errors

**Mobile issues?**
- Test touch events
- Check viewport settings
- Reduce particle count for mobile

## 📞 Need Help?

The components are fully customizable. Look for:
- `// Edit this array` comments in the code
- Commented sections explaining functionality
- TypeScript interfaces for data structure

## 🎉 You're Ready!

1. Add your images to `public/office/`
2. Update the data arrays with your content
3. Add route to your app
4. Test on different devices

Your office tour is now ready to blow users' minds! 🤯

---

**Pro Tips:**
- Take photos from interesting angles
- Use consistent lighting across photos
- Consider a professional photographer
- Add ambient sounds for immersion
- Update regularly with new content

