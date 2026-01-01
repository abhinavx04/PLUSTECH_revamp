# Image Optimization Guide

## Critical Issue: Large Images Blocking Performance

Lighthouse audit shows images are **2-3MB each**, causing massive performance penalties:
- Total network payload: **18.4 MB**
- Estimated savings: **13+ MB** by optimizing images

## Impacted Images (Priority Order)

### Highest Priority (2-3MB each)
1. `/automated-customised-materialhandling/1.png` - 2.3 MB → Target: ~150 KB
2. `/automated-customised-materialhandling/2.png` - 3.0 MB → Target: ~150 KB
3. `/automated-customised-materialhandling/3.png` - 2.4 MB → Target: ~150 KB
4. `/robotic/indoor-painting_and_door_opening.png` - 1.8 MB → Target: ~120 KB
5. `/robotic/scooter-metal_plastic-part.png` - 1.3 MB → Target: ~100 KB

### Medium Priority (800KB-1MB)
6. `/robotic/2-wheeler-fueltanks_plaSTIC.png` - 858 KB → Target: ~80 KB
7. `/home/NAHAR_1.png` - 853 KB → Target: ~80 KB
8. `/home/NAHAR_2.png` - 597 KB → Target: ~60 KB

### Lower Priority (but still important)
9. `/office/entrance/entrance.jpeg` - 147 KB → Target: ~50 KB
10. `/newlogo.png` - 19 KB → Target: ~8 KB (also needs width/height)

## Optimization Steps

### 1. Convert to WebP Format (70-80% size reduction)

Use one of these tools:

#### Option A: Using cwebp (Recommended)
```bash
# Install WebP tools
# macOS: brew install webp
# Windows: Download from https://developers.google.com/speed/webp/download

# Convert PNG to WebP (quality 85 is good balance)
cwebp -q 85 input.png -o output.webp

# Convert JPEG to WebP
cwebp -q 85 input.jpg -o output.webp

# Batch convert (example)
for file in automated-customised-materialhandling/*.png; do
  cwebp -q 85 "$file" -o "${file%.png}.webp"
done
```

#### Option B: Using Online Tools
- [Squoosh](https://squoosh.app/) - Google's online image optimizer (recommended)
- [CloudConvert](https://cloudconvert.com/png-to-webp)
- [ImageOptim](https://imageoptim.com/) (macOS)

#### Option C: Using ImageMagick
```bash
# Install ImageMagick first
convert input.png -quality 85 output.webp
```

### 2. Resize Images to Display Dimensions

Images are loaded much larger than displayed. Resize to actual display size:

**Current vs Display Sizes:**
- `automated-customised-materialhandling/*.png`: 1406x1080 → Display: 569x320 → **Resize to: 1138x640 (2x for retina)**
- `robotic/*.png`: 1483x1080 → Display: 711x400 → **Resize to: 1422x800 (2x for retina)**
- `home/NAHAR_1.png`: 1794x770 → Display: 414x178 → **Resize to: 828x356 (2x for retina)**

**Using ImageMagick:**
```bash
# Resize and convert in one step
convert input.png -resize 1138x640 -quality 85 output.webp

# Maintain aspect ratio
convert input.png -resize 1138x640^ -gravity center -extent 1138x640 -quality 85 output.webp
```

**Using cwebp:**
```bash
# Resize during conversion
cwebp -resize 1138 640 -q 85 input.png -o output.webp
```

### 3. Update Code to Use WebP with Fallback

Update image references to use WebP with PNG/JPEG fallback:

```tsx
// Before
<img src="/automated-customised-materialhandling/1.png" alt="..." />

// After
<picture>
  <source srcSet="/automated-customised-materialhandling/1.webp" type="image/webp" />
  <img src="/automated-customised-materialhandling/1.png" alt="..." width={569} height={320} />
</picture>
```

Or update OptimizedImage component to handle WebP automatically.

### 4. Expected Results

After optimization:
- **Before**: 18.4 MB total
- **After**: ~2-3 MB total (85-90% reduction)
- **Page Load**: 3-5x faster
- **LCP Improvement**: 2-4 seconds faster
- **Mobile Performance**: Dramatically improved

## Quick Win: Use Squoosh.app

1. Go to [squoosh.app](https://squoosh.app/)
2. Drag and drop each image
3. Select **WebP** format
4. Set quality to **85**
5. Resize to 2x display dimensions (see above)
6. Download optimized image
7. Replace in `/public` folder

## Implementation Priority

1. **Week 1**: Optimize top 5 largest images (automated-customised-materialhandling + robotic)
2. **Week 2**: Optimize remaining project images
3. **Week 3**: Optimize all remaining images

## Testing

After optimization, verify:
- Images still look good visually
- No layout shifts (images maintain dimensions)
- Lighthouse Performance score improves by 20-30 points
- Network payload reduces by 80%+

---

**Note**: This is a one-time manual task but has the highest performance impact (13+ MB savings).

