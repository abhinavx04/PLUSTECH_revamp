# 🔄 How to Replace Placeholder Images

## Current Status

✅ **Medium Plan Implemented!**
- 11 office sections configured
- 3 placeholder images per section
- Interactive Floor Plan active
- Easy to add/remove sections

## 📍 Your Office Sections

1. **Entrance** 🚪
2. **Engineering** ⚙️
3. **Marketing** 📢
4. **Projects** 📋
5. **Management** 👔
6. **HR** 👥
7. **Managing Director** 👤
8. **Break Room** ☕
9. **Kitchen** 🍽️
10. **Pooja Room** 🕉️
11. **Directors Room** 🏛️

## 🔄 Replacing Placeholder Images

### Step 1: Organize Your Images

Create this folder structure in `public/`:

```
public/
└── office/
    ├── entrance/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── 3.jpg
    ├── engineering/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── 3.jpg
    ├── marketing/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── 3.jpg
    ├── projects/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── 3.jpg
    ├── management/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── 3.jpg
    ├── hr/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── 3.jpg
    ├── managing-director/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── 3.jpg
    ├── break-room/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── 3.jpg
    ├── kitchen/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── 3.jpg
    ├── pooja-room/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── 3.jpg
    └── directors-room/
        ├── 1.jpg
        ├── 2.jpg
        └── 3.jpg
```

### Step 2: Update the Code

Open `src/components/office/OfficeShowcase.tsx` and find the `officeData` array.

**Replace this:**
```typescript
images: [
  getPlaceholderImage('Entrance', 0),
  getPlaceholderImage('Entrance', 1),
  getPlaceholderImage('Entrance', 2),
],
```

**With this:**
```typescript
images: [
  '/office/entrance/1.jpg',
  '/office/entrance/2.jpg',
  '/office/entrance/3.jpg',
],
```

### Step 3: Repeat for All Sections

Do this for each section in the `officeData` array.

## ➕ Adding a New Section

To add a new section, add a new object to the `officeData` array:

```typescript
{
  id: 'new-section-id',
  name: 'New Section Name',
  description: 'Description of the new section',
  images: [
    '/office/new-section/1.jpg',
    '/office/new-section/2.jpg',
    '/office/new-section/3.jpg',
  ],
  position: { x: 50, y: 50 }, // Adjust position (0-100)
  icon: '🏢', // Choose an emoji
},
```

## ➖ Removing a Section

Simply delete the entire object from the `officeData` array.

## 🎨 Changing Positions

Edit the `position` property:
- `x`: 0 (left) to 100 (right)
- `y`: 0 (top) to 100 (bottom)

Example:
```typescript
position: { x: 50, y: 50 } // Center of the map
```

## 🎯 Changing Icons

Replace the emoji in the `icon` property:
```typescript
icon: '🚪', // Use any emoji
```

## 📝 Changing Descriptions

Update the `description` field:
```typescript
description: 'Your new description here',
```

## ✅ Quick Checklist

- [ ] Images organized in `public/office/[section-name]/` folders
- [ ] Updated `officeData` array with real image paths
- [ ] Tested on `/facility` route
- [ ] All images loading correctly
- [ ] Positions look good on the map

## 🚀 You're Done!

Once you replace the placeholders, your Interactive Floor Plan will be fully customized!


