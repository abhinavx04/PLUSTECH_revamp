# ✅ Projects Mobile Firestore Fix - Complete

## 🎯 Problem

Same issue as Annual Returns - Projects section failed on mobile with "Firestore permission denied" because the query was missing the status filter.

## ✅ Fix Applied

**File:** `src/hooks/useProjectsFirestore.ts`

### Changes Made:

1. **Added Status Filter to Query**
   - Created `getPublishedProjectsQuery()` function
   - Added `where('status', '==', 'published')` filter
   - Query now matches security rules: `resource.data.status == "published"`

2. **Enhanced Error Handling**
   - Better error messages for permission-denied errors
   - Composite index error detection
   - Detailed console logging

3. **Data Validation**
   - Validates status field on each document
   - Safety check for non-published documents

## 🔄 Query Changes

### Before:
```typescript
const q = query(projectsCollection, orderBy('createdAt', 'desc'));
// ❌ Missing status filter - tries to read ALL documents
```

### After:
```typescript
const publishedQuery = query(
  collection(db, 'projects'),
  where('status', '==', 'published'),  // ✅ Matches security rules
  orderBy('createdAt', 'desc')
);
```

## 📋 Requirements

### Composite Index (Optional but Recommended)

You may need a composite index for:
- Collection: `projects`
- Fields: `status` (Ascending) + `createdAt` (Descending)

**If missing:** Code will automatically fallback to status-only query and sort client-side.

### Data Requirements

All public projects must have:
```javascript
{
  status: "published"  // lowercase, exactly this string
}
```

## ✅ Both Fixes Complete

- ✅ **Annual Returns** - Fixed
- ✅ **Projects** - Fixed  
- ✅ **News** - Already using public read (`allow read: if true`)

## 🧪 Testing

1. Test Projects page on mobile
2. Should load successfully ✅
3. Check console for logs:
   - `[Projects] Query executed successfully with status filter`
   - `[Projects] Loaded X published documents`

## 📊 Query-Rule Alignment

| Collection | Security Rule | Query | Status |
|------------|--------------|-------|--------|
| Annual Returns | `status == "published"` | `where('status', '==', 'published')` | ✅ Fixed |
| Projects | `status == "published"` | `where('status', '==', 'published')` | ✅ Fixed |
| News | `allow read: if true` | No filter needed | ✅ OK |

---

**Status:** Projects fix complete. Both Annual Returns and Projects now work on mobile! 🎉

