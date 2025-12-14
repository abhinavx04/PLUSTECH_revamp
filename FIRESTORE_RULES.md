# Firestore Security Rules for News Management

The 403 errors you're seeing are due to Firestore security rules blocking access. You need to update your Firestore security rules to allow authenticated users to read and write to the `news` collection.

## How to Update Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Replace the existing rules with the rules below
5. Click **Publish**

## Recommended Rules (for authenticated users only)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // News collection - allow authenticated users to read/write
    match /news/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Default: deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Alternative: Public Read, Authenticated Write (for main page)

If you want the main page to show news without authentication, but only allow authenticated users to create/edit:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // News collection - public read, authenticated write
    match /news/{document=**} {
      allow read: if true;  // Anyone can read
      allow write: if request.auth != null;  // Only authenticated users can write
    }
    
    // Default: deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Testing

After updating the rules:
1. Refresh your admin dashboard
2. Try loading the News Management page - it should load quickly
3. Try creating a news article - it should save to Firestore
4. Check the main page - news should appear

## Firebase Storage Rules (for Image Uploads)

Since the app now supports image uploads, you also need to configure Firebase Storage rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Storage** → **Rules** tab
4. Replace the existing rules with the rules below
5. Click **Publish**

### Recommended Storage Rules (for authenticated users)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // News images - allow authenticated users to upload/read/delete
    match /news/images/{imageId} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      
      // Allow write (upload) for authenticated users with size and type validation
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024  // Max 5MB before compression
        && request.resource.contentType.matches('image/.*');
      
      // Allow delete for authenticated users
      allow delete: if request.auth != null;
    }
    
    // Default: deny all other access
    match /{allPaths=**} {
      allow read, write, delete: if false;
    }
  }
}
```

**Note:** The `write` rule only applies to uploads (create/update). For deletion, you need the explicit `allow delete` rule.

### Alternative: Public Read, Authenticated Write/Delete

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // News images - public read, authenticated write/delete
    match /news/images/{imageId} {
      // Anyone can read
      allow read: if true;
      
      // Only authenticated users can upload
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
      
      // Only authenticated users can delete
      allow delete: if request.auth != null;
    }
    
    // Default: deny all other access
    match /{allPaths=**} {
      allow read, write, delete: if false;
    }
  }
}
```

**Note:** The `write` rule only applies to uploads (create/update). For deletion, you need the explicit `allow delete` rule.

## Troubleshooting

- If you still see 403 errors, make sure you're logged in as an admin user
- Check the browser console for detailed error messages
- Verify your Firebase project ID matches in your `.env` file
- For image upload errors, check Storage rules in Firebase Console

