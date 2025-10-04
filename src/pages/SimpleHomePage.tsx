import React from 'react';

const SimpleHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-black text-white p-4">
        <h1 className="text-2xl font-bold">PlusTech - Simple Test</h1>
      </header>
      <main className="p-8">
        <h2 className="text-3xl font-bold text-black mb-4">Welcome to PlusTech</h2>
        <p className="text-gray-600 text-lg">
          This is a simple test page to verify the application is working.
        </p>
        <div className="mt-8 space-y-4">
          <a 
            href="/admin/login" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Admin Login
          </a>
          <br />
          <a 
            href="/test" 
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Test Route
          </a>
        </div>
      </main>
    </div>
  );
};

export default SimpleHomePage;
