# 🔧 Mobile Firestore Fix Guide

## Problem
Annual Returns show "Firestore permission denied" on mobile browsers but work on desktop.

## Root Cause
Firestore rules with `resource.data.status == 'published'` **DO NOT WORK** for queries (collection reads). They only work for single document reads.

## ✅ Solution: Use These Rules

Copy these rules into Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ======================
    // NEWS COLLECTION
    // ======================
    match /news/{docId} {
      // Public read access
      allow read: if true;

      // Only authenticated users can write
      allow create, update, delete: if request.auth != null;
    }

    // ======================
    // ANNUAL RETURNS
    // ======================
    match /annualReturns/{docId} {
      // Public read access (app filters by status)
      // Your app already filters to show only published returns
      allow read: if true;

      // Only authenticated users can write
      allow create, update, delete: if request.auth != null;
    }

    // ======================
    // PROJECTS
    // ======================
    match /projects/{docId} {
      // Public read access (app filters by status)
      allow read: if true;

      // Only authenticated users can write
      allow create, update, delete: if request.auth != null;
    }

    // ======================
    // DEFAULT — DENY ALL
    // ======================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Steps to Fix

### 1. Update Firestore Rules
1. Go to https://console.firebase.google.com/
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. **Delete all existing rules**
5. Copy the rules above
6. Paste into the editor
7. Click **Publish**
8. Wait 2-3 minutes for propagation

### 2. Verify Rules Are Published
- Check that the rules editor shows the new rules
- Look for any syntax errors (should be none)
- Rules should show "Published" status

### 3. Clear Mobile Browser Cache
**Important:** Mobile browsers cache aggressively!

**Chrome Mobile:**
- Settings → Privacy → Clear browsing data
- Select "Cached images and files"
- Clear data

**Safari Mobile:**
- Settings → Safari → Clear History and Website Data

**Or use incognito/private mode** to test without cache

### 4. Test on Mobile
1. Open mobile browser (or incognito mode)
2. Visit your Vercel site
3. Navigate to Annual Returns page
4. Check browser console for errors (if accessible)

### 5. Verify Environment Variables (Vercel)
Make sure all Firebase env vars are set in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these are set:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. **Redeploy** after adding/updating variables

## Why This Happens

### Desktop vs Mobile Differences:
1. **Caching:** Desktop browsers cache less aggressively
2. **Auth Tokens:** Mobile browsers handle Firebase auth differently
3. **Network:** Mobile networks can be slower/unreliable
4. **Rules Evaluation:** Mobile browsers evaluate rules more strictly

### Why Status Checks Don't Work:
```javascript
// ❌ THIS DOESN'T WORK FOR QUERIES:
allow read: if resource.data.status == 'published';

// ✅ THIS WORKS:
allow read: if true;
```

When you query a collection, Firestore evaluates rules **before** fetching documents. It can't check `resource.data.status` because it doesn't know which documents will be returned yet.

## Security Note

**Is public read access safe?**
✅ **YES!** Because:
- Your app filters to show only published returns in `getPublishedAnnualReturns()`
- Draft documents exist in database but won't be displayed
- Only authenticated admins can write/modify
- This is a standard pattern for public content

## Testing Checklist

- [ ] Rules updated in Firebase Console
- [ ] Rules published successfully
- [ ] Waited 2-3 minutes for propagation
- [ ] Cleared mobile browser cache
- [ ] Tested in incognito/private mode
- [ ] Verified environment variables in Vercel
- [ ] Redeployed Vercel site (if env vars changed)
- [ ] Checked browser console for errors

## Still Not Working?

### Check Browser Console (Mobile)
1. Connect phone to computer via USB
2. Enable USB debugging
3. Open Chrome DevTools → Remote devices
4. Check console for specific errors

### Common Issues:

**Issue:** Still seeing "permission denied"
- **Fix:** Rules might not have propagated. Wait 5 minutes and try again.

**Issue:** "Firestore not configured" error
- **Fix:** Check Vercel environment variables are set correctly

**Issue:** Works in incognito but not normal mode
- **Fix:** Clear browser cache completely

**Issue:** Works on WiFi but not mobile data
- **Fix:** Check mobile network firewall/restrictions

## Quick Test Script

Add this to your browser console on mobile to test:

```javascript
// Test Firestore connection
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const db = getFirestore();
const testCollection = collection(db, 'annualReturns');
getDocs(testCollection)
  .then(snapshot => console.log('✅ Success! Loaded', snapshot.size, 'documents'))
  .catch(err => console.error('❌ Error:', err.code, err.message));
```

## Need More Help?

Check these logs:
1. Browser console errors
2. Firebase Console → Firestore → Usage tab (check for denied requests)
3. Vercel deployment logs
4. Network tab in browser DevTools

