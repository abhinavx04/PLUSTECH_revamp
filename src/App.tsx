import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Tailwind CSS Test Suite
          </h1>
          <p className="text-lg text-gray-600">
            Testing various Tailwind CSS utilities and components
          </p>
        </header>

        {/* Color Palette Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-red-500 h-16 rounded-lg flex items-center justify-center text-white font-medium">Red</div>
            <div className="bg-blue-500 h-16 rounded-lg flex items-center justify-center text-white font-medium">Blue</div>
            <div className="bg-green-500 h-16 rounded-lg flex items-center justify-center text-white font-medium">Green</div>
            <div className="bg-yellow-500 h-16 rounded-lg flex items-center justify-center text-white font-medium">Yellow</div>
            <div className="bg-purple-500 h-16 rounded-lg flex items-center justify-center text-white font-medium">Purple</div>
            <div className="bg-pink-500 h-16 rounded-lg flex items-center justify-center text-white font-medium">Pink</div>
          </div>
        </section>

        {/* Typography Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Typography</h2>
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-gray-900">Heading 1 - Extra Large</h1>
            <h2 className="text-4xl font-bold text-gray-800">Heading 2 - Large</h2>
            <h3 className="text-3xl font-semibold text-gray-700">Heading 3 - Medium</h3>
            <h4 className="text-2xl font-medium text-gray-600">Heading 4 - Small</h4>
            <p className="text-lg text-gray-500 leading-relaxed">
              This is a paragraph with larger text and relaxed line height. 
              It should display properly with Tailwind's typography utilities.
            </p>
            <p className="text-sm text-gray-400 italic">
              Small italic text for captions or secondary information.
            </p>
          </div>
        </section>

        {/* Spacing and Layout Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Spacing & Layout</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Card 1</h3>
                <p className="text-gray-600">This card demonstrates padding and margin utilities.</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Card 2</h3>
                <p className="text-gray-600">Responsive grid layout with gap spacing.</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg md:col-span-2 lg:col-span-1">
                <h3 className="text-lg font-medium mb-2">Card 3</h3>
                <p className="text-gray-600">This card spans multiple columns on different screen sizes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Elements Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Interactive Elements</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              Primary Button
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              Secondary Button
            </button>
            <button className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-200">
              Outline Button
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200">
              Gradient Button
            </button>
          </div>
        </section>

        {/* Form Elements Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Form Elements</h2>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Input
                </label>
                <input 
                  type="text" 
                  placeholder="Enter some text..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Dropdown
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Check this box
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Responsive Design Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Responsive Design</h2>
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-green-800 font-medium">
              <span className="block sm:hidden">📱 Mobile: You're on a small screen</span>
              <span className="hidden sm:block md:hidden">📱 Tablet: You're on a medium screen</span>
              <span className="hidden md:block lg:hidden">💻 Desktop: You're on a large screen</span>
              <span className="hidden lg:block xl:hidden">🖥️ Large Desktop: You're on an extra large screen</span>
              <span className="hidden xl:block">🖥️ Extra Large: You're on a very large screen</span>
            </p>
          </div>
        </section>

        {/* Animation and Effects Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Animations & Effects</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <p className="text-center font-medium">Hover to Scale</p>
            </div>
            <div className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transform hover:rotate-3 transition-all duration-300 cursor-pointer">
              <p className="text-center font-medium">Hover to Rotate</p>
            </div>
            <div className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <p className="text-center font-medium">Hover to Lift</p>
            </div>
            <div className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg transform hover:skew-x-12 transition-all duration-300 cursor-pointer">
              <p className="text-center font-medium">Hover to Skew</p>
            </div>
          </div>
        </section>

        {/* Status Indicator */}
        <div className="bg-green-500 text-white p-4 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2">✅ Tailwind CSS is Working!</h3>
          <p className="text-green-100">
            If you can see all the styled elements above, Tailwind CSS is properly configured and working in your project.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
