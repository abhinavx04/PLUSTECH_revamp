# Firestore Security Rules for News Management and Annual Returns

The 403 errors you're seeing are due to Firestore security rules blocking access. You need to update your Firestore security rules to allow authenticated users to read and write to the `news` and `annualReturns` collections.

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
    
    // Annual Returns collection - allow authenticated users to read/write
    match /annualReturns/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Projects collection - allow authenticated users to read/write
    match /projects/{document=**} {
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
    
    // Annual Returns collection - public read for published, authenticated write
    match /annualReturns/{document=**} {
      // Anyone can read published annual returns
      allow read: if resource.data.status == 'published' || request.auth != null;
      // Only authenticated users can write
      allow write: if request.auth != null;
    }

    // Projects collection - public read for published, authenticated write
    match /projects/{document=**} {
      // Anyone can read published projects
      allow read: if resource.data.status == 'published' || request.auth != null;
      // Only authenticated users can create/update/delete
      allow write: if request.auth != null;
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
5. Try loading the Annual Return Management page - it should load
6. Try uploading a PDF and creating an annual return - it should save to Firestore
7. Check the `/about/annual-returns` page - published annual returns should appear

## Firebase Storage Rules (for Uploads)

Since the app now supports image uploads, you also need to configure Firebase Storage rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Storage** → **Rules** tab
4. Replace the existing rules with the rules below
5. Click **Publish**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // ======================
    // NEWS IMAGES
    // ======================
    match /news/images/{imageId} {
      allow read: if true;

      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');

      allow delete: if request.auth != null;
    }

    // ======================
    // ANNUAL RETURN PDFS
    // ======================
    match /annualReturns/pdfs/{pdfId} {
      allow read: if true;

      allow write: if request.auth != null
        && request.resource.size < 50 * 1024 * 1024
        && request.resource.contentType == 'application/pdf';

      allow delete: if request.auth != null;
    }

    // ======================
    // PROJECT IMAGES
    // ======================
    match /projects/images/{imageId} {
      allow read: if true;

      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');

      allow delete: if request.auth != null;
    }

    // ======================
    // CERTIFICATION IMAGES
    // ======================
    match /certifications/images/{imageId} {
      allow read: if true;

      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');

      allow delete: if request.auth != null;
    }

    // ======================
    // CSR ACTIVITY IMAGES
    // ======================
    match /csr/images/{imageId} {
      allow read: if true;

      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');

      allow delete: if request.auth != null;
    }

    // ======================
    // CSR ACTIVITY PDFS
    // ======================
    match /csr/pdfs/{pdfId} {
      allow read: if true;

      allow write: if request.auth != null
        && request.resource.size < 50 * 1024 * 1024
        && request.resource.contentType == 'application/pdf';

      allow delete: if request.auth != null;
    }

    // ======================
    // CAREERS — JD DOCUMENTS (MERGED)
    // Publicly viewable from careers page
    // ======================
    match /careers/jd/{jobId}/{fileName} {
      allow read: if true;

      allow create, update: if request.auth != null
        && request.resource.size < 10 * 1024 * 1024
        && (
          request.resource.contentType == 'application/pdf' ||
          request.resource.contentType == 'application/msword' ||
          request.resource.contentType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );

      allow delete: if request.auth != null;
    }

    // ======================
    // CAREERS — RESUMES (MERGED)
    // Candidate uploads; private to HR/Admin
    // ======================
    match /careers/resumes/{jobId}/{fileName} {
      allow create: if request.resource.size < 10 * 1024 * 1024
        && request.resource.contentType == 'application/pdf';

      allow read, update, delete: if request.auth != null;
    }

    // ======================
    // DEFAULT — DENY EVERYTHING ELSE
    // ======================
    match /{allPaths=**} {
      allow read, write, delete: if false;
    }
  }
}
```

## Troubleshooting

- If you still see 403 errors, make sure you're logged in as an admin user
- Check the browser console for detailed error messages
- Verify your Firebase project ID matches in your `.env` file
- For image upload errors, check Storage rules in Firebase Console

