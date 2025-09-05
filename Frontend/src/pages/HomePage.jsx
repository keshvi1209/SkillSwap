import React, { useState } from "react";

// Reusable components with enhanced styling
const Header = () => (
  <header className="w-full bg-white shadow-sm border-b border-gray-100">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800 tracking-wide">Skill Match</h1>
      {/* User profile or other header elements can go here */}
    </div>
  </header>
);

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Input = ({ className, ...props }) => (
  <div className="relative flex-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      className={`border rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${className}`}
      {...props}
    />
  </div>
);

const Button = ({ children, className, ...props }) => (
  <button
    className={`bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);


const recommendationsData = [
  { id: 1, title: "Learn React", description: "Build dynamic user interfaces with React, a popular JavaScript library." },
  { id: 2, title: "Learn Python", description: "Dive into Python for data science, web development, and machine learning." },
  { id: 3, title: "Learn Flutter", description: "Create beautiful, cross-platform mobile apps with Google's Flutter framework." },
  { id: 4, title: "Learn C++", description: "Master C++ for high-performance applications, game development, and systems programming." },
];

export default function HomePage() {
  const [search, setSearch] = useState("");

  const filteredData = recommendationsData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800">
      <Header />

      <div className="flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-4xl font-extrabold mb-4 text-center">
          What new interest are you eager to explore?
        </h1>
        <p className="text-xl text-gray-600 mb-8 text-center">
          Discover a community of mentors and learners.
        </p>
        <div className="flex w-full max-w-2xl gap-2">
          <Input
            type="text"
            placeholder="Search skills, topics, or people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button>Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 pb-12">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <Card key={item.id} className="shadow-md hover:shadow-lg transition rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">
            No recommendations found for your search.
          </p>
        )}
      </div>
    </div>
  );
}
