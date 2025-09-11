import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Header = () => (
  <header className="w-full bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg animate-fade-in">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="bg-gray-700 p-2 rounded-lg mr-3 shadow-md animate-pulse">
          <svg
            className="w-8 h-8 text-blue-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Skill Match
        </h1>
      </div>
      <nav className="hidden md:flex space-x-6">
        <a
          href="#"
          className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
        >
          Home
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
        >
          Explore
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
        >
          Community
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
        >
          About
        </a>
      </nav>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105">
        Sign In
      </button>
    </div>
  </header>
);

const Card = ({ children, className = "", onClick }) => (
  <div
    className={`bg-gray-800 rounded-xl border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

const Input = ({ className = "", ...props }) => (
  <div className="relative flex-1">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      className={`border-2 border-gray-700 bg-gray-800 rounded-full pl-12 pr-6 py-3 w-full focus:outline-none focus:border-blue-500 transition-all text-gray-200 placeholder-gray-500 ${className}`}
      {...props}
    />
  </div>
);

const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const baseClasses =
    "px-6 py-3 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-400 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500 ",
    secondary:
      "bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500 w-32",
    outline:
      "border-2 border-blue-500 text-blue-400 hover:bg-blue-900 focus:ring-blue-500",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex justify-center">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-400">
          ★
        </span>
      ))}
      {halfStar && <span className="text-yellow-400">☆</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-500">
          ★
        </span>
      ))}
    </div>
  );
};

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decodedtoken = token ? jwtDecode(token) : null;
  const currentUserId = decodedtoken ? decodedtoken.id : null;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recRes = await fetch(
          `http://localhost:5000/recommendations/${currentUserId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!recRes.ok) {
          throw new Error(`HTTP error! status: ${recRes.status}`);
        }

        const recData = await recRes.json();
        const ids = recData.recommendations;

        if (!ids || ids.length === 0) {
          setRecommendations([]);
          return;
        }

        const detailsPromises = ids.map(async (id) => {
          const res = await fetch(`http://localhost:5000/getdetails/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) {
            throw new Error(`Failed to fetch details for user ${id}`);
          }
          return res.json();
        });

        const users = await Promise.all(detailsPromises);
        console.log("Fetched user details:", users);
        setRecommendations(users);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [currentUserId]);

  const filteredData = recommendations.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.canTeach?.some((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
      ) ||
      item.toLearn?.some((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 font-sans antialiased text-gray-200">
      <Header />

      <div className="flex flex-col items-center justify-center py-16 px-2 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
            Discover Your Next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Learning Journey
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Connect with skilled mentors and curious learners. Share what you
            know, learn what you don't.
          </p>
          <div className="flex flex-col sm:flex-row w-full max-w-2xl gap-4 mx-auto">
            <Input
              type="text"
              placeholder="Search people, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button>Search</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-white">
            Recommended Connections
          </h2>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center">
            Loading recommendations...
          </p>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredData.map((item, index) => (
              <Card
                key={item._id}
                className="cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() =>
                  navigate("/userdetail", { state: { user: item } })
                }
              >
                <div className="relative">
                  <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.name || "User"}
                    className="w-24 h-24 object-cover rounded-full mx-auto -mt-12 border-4 border-gray-800 shadow-lg transform hover:scale-110 transition-all duration-300"
                  />
                </div>
                <CardContent className="text-center">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {item.name || "Unknown User"}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    {item.email || ""}
                  </p>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-300 mb-2">
                      Can Teach:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {item.canTeach && item.canTeach.length > 0 ? (
                        item.canTeach.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">
                          No teaching skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-300 mb-2">
                      Wants to Learn:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {item.toLearn && item.toLearn.length > 0 ? (
                        item.toLearn.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">
                          No learning skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  <Button className="mt-2">Connect</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">
              {currentUserId
                ? "No recommendations found."
                : "Please log in to see recommendations."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
