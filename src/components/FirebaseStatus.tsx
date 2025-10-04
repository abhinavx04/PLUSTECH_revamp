import React from 'react';
import { db, auth } from '../lib/firebase';

const FirebaseStatus: React.FC = () => {
  const checkFirebaseStatus = () => {
    console.log('=== Firebase Status Check ===');
    console.log('DB:', db);
    console.log('Auth:', auth);
    console.log('DB Type:', typeof db);
    console.log('Auth Type:', typeof auth);
    
    if (db) {
      console.log('✅ Firestore is initialized');
    } else {
      console.log('❌ Firestore is NOT initialized');
    }
    
    if (auth && !('__disabled' in auth)) {
      console.log('✅ Auth is initialized');
    } else {
      console.log('❌ Auth is NOT initialized or disabled');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50">
      <button 
        onClick={checkFirebaseStatus}
        className="bg-blue-600 px-2 py-1 rounded mb-2"
      >
        Check Firebase Status
      </button>
      <div>
        <div>DB: {db ? '✅' : '❌'}</div>
        <div>Auth: {auth && !('__disabled' in auth) ? '✅' : '❌'}</div>
      </div>
    </div>
  );
};

export default FirebaseStatus;
