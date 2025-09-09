import React, { useState } from 'react';

const UserDetail = () => {
  // Sample user data
  const [user, setUser] = useState({
    name: "Alex Johnson",
    title: "Frontend Developer & UI Designer",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    contact: {
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      social: {
        twitter: "@alexj",
        linkedin: "alexjohnson"
      }
    },
    location: "San Francisco, CA",
    rating: 4.7,
    feedback: [
      { id: 1, user: "Sarah M.", comment: "Alex is an amazing React tutor! Highly recommended.", rating: 5, date: "2 weeks ago" },
      { id: 2, user: "Michael T.", comment: "Explained complex concepts in a simple way.", rating: 4.5, date: "1 month ago" },
      { id: 3, user: "Jessica L.", comment: "Patient and knowledgeable. Great teacher!", rating: 4.8, date: "3 months ago" }
    ]
  });

  // Skills to teach data with all requested fields
  const [skillsToTeach, setSkillsToTeach] = useState([
    {
      id: 1,
      skill: "React",
      experience: 2,
      description: "Good at it",
      proficiency: "beginner",
      mode: "offline",
      languages: ["English", "Spanish"],
      tags: ["Development"],
      availability: {
        mode: "daily",
        time: {
          start: "14:03",
          end: "13:04"
        }
      }
    },
    {
      id: 2,
      skill: "JavaScript",
      experience: 4,
      description: "Strong knowledge of modern JS features",
      proficiency: "intermediate",
      mode: "online",
      languages: ["English"],
      tags: ["Web Development", "Programming"],
      availability: {
        mode: "weekends",
        time: {
          start: "10:00",
          end: "16:00"
        }
      }
    }
  ]);

  // Skills to learn data with all requested fields
  const [skillsToLearn, setSkillsToLearn] = useState([
    {
      id: 1,
      skill: "Acting",
      proficiency: "beginner",
      mode: "offline",
      languages: ["Hindi", "English"],
      tags: ["art"]
    },
    {
      id: 2,
      skill: "Guitar",
      proficiency: "beginner",
      mode: "online",
      languages: ["English"],
      tags: ["music", "instrument"]
    }
  ]);

  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('skills');

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      alert(`Message sent to ${user.name}: ${message}`);
      setMessage("");
      setIsChatOpen(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return stars;
  };

  const ProficiencyBadge = ({ level }) => {
    let colorClass = "";
    switch(level) {
      case "beginner": colorClass = "bg-green-100 text-green-800"; break;
      case "intermediate": colorClass = "bg-blue-100 text-blue-800"; break;
      case "advanced": colorClass = "bg-purple-100 text-purple-800"; break;
      case "expert": colorClass = "bg-indigo-100 text-indigo-800"; break;
      default: colorClass = "bg-gray-100 text-gray-800";
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  const ModeBadge = ({ mode }) => {
    const isOnline = mode === "online";
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${isOnline ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
        {isOnline ? "Online" : "Offline"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-800">SkillExchange</h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-indigo-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto py-3 px-4">
        <div className="max-w-10xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
          {/* Profile Header */}
          <div className="md:flex bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
            <div className="md:flex-shrink-0 flex justify-center">
              <div className="relative">
                <img
                  className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-2xl"
                  src={user.profilePic}
                  alt={user.name}
                />
                <div className="absolute bottom-2 right-2 h-8 w-8 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
            <div className="mt-6 md:mt-0 md:ml-8 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-indigo-100 mt-2 text-lg">{user.title}</p>
                  <div className="flex items-center mt-4">
                    <svg className="w-5 h-5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-lg font-semibold">{user.rating}</span>
                    <span className="ml-2 text-indigo-200">(128 reviews)</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="flex items-center justify-center bg-white text-indigo-600 hover:bg-indigo-50 py-3 px-6 rounded-lg shadow-md transition duration-200 font-semibold"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Start Chat
                </button>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Info */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-indigo-200">Email</p>
                    <p className="text-white">{user.contact.email}</p>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-indigo-200">Phone</p>
                    <p className="text-white">{user.contact.phone}</p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-indigo-200">Location</p>
                    <p className="text-white">{user.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('skills')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'skills' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Skills
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'feedback' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Feedback & Reviews
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'about' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                About
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-8">
            {activeTab === 'skills' && (
              <div className="space-y-8">
                {/* Skills to Teach */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Skills I Can Teach
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skillsToTeach.map((skill) => (
                      <div key={skill.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-gray-900">{skill.skill}</h3>
                          <div className="flex space-x-2">
                            <ProficiencyBadge level={skill.proficiency} />
                            <ModeBadge mode={skill.mode} />
                          </div>
                        </div>
                        
                        <p className="mt-2 text-gray-600">{skill.description}</p>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                            <p className="text-gray-900">{skill.experience} years</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Languages</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {skill.languages.map((lang, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Availability</h4>
                            <p className="text-gray-900 capitalize">{skill.availability.mode}</p>
                            <p className="text-sm text-gray-600">{skill.availability.time.start} - {skill.availability.time.end}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {skill.tags.map((tag, index) => (
                                <span key={index} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <button className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200">
                          Request to Learn
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Skills to Learn */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Skills I Want to Learn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skillsToLearn.map((skill) => (
                      <div key={skill.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-gray-900">{skill.skill}</h3>
                          <div className="flex space-x-2">
                            <ProficiencyBadge level={skill.proficiency} />
                            <ModeBadge mode={skill.mode} />
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Languages</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {skill.languages.map((lang, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {skill.tags.map((tag, index) => (
                                <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
                          Offer to Teach
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Feedback & Reviews</h2>
                {user.feedback.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 text-lg">{item.user}</h3>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      {renderStars(item.rating)}
                      <span className="ml-2 text-sm font-semibold text-gray-700">{item.rating}</span>
                    </div>
                    <p className="mt-3 text-gray-600">{item.comment}</p>
                  </div>
                ))}
                
                <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Your Feedback</h3>
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-8 h-8 text-gray-300 cursor-pointer hover:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    rows="3" 
                    placeholder="Share your experience..."
                  ></textarea>
                  <button className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-200">
                    Submit Feedback
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'about' && (
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About Me</h2>
                <div className="prose prose-indigo">
                  <p className="text-gray-600 mb-4">
                    Hello! I'm Alex, a passionate frontend developer with over 5 years of experience building modern web applications. 
                    I specialize in React and love creating intuitive user interfaces that provide great user experiences.
                  </p>
                  <p className="text-gray-600 mb-4">
                    When I'm not coding, you can find me hiking in the mountains, reading tech blogs, or experimenting with new programming languages. 
                    I believe in continuous learning and enjoy sharing my knowledge with others.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Education</h3>
                  <ul className="list-disc list-inside text-gray-600 mb-4">
                    <li>BS in Computer Science, Stanford University (2014-2018)</li>
                    <li>Frontend Web Development Nanodegree, Udacity (2019)</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Experience</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Senior Frontend Developer, TechCorp Inc. (2020-Present)</li>
                    <li>Web Developer, Digital Solutions LLC (2018-2020)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Chat with {user.name}</h3>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 h-96 overflow-y-auto bg-gray-50">
              <div className="flex justify-start mb-4">
                <div className="bg-white rounded-lg p-4 max-w-xs shadow-md">
                  <p className="text-sm">Hello! How can I help you today?</p>
                  <span className="text-xs text-gray-500 block mt-1">10:30 AM</span>
                </div>
              </div>
              <div className="flex justify-end mb-4">
                <div className="bg-indigo-100 rounded-lg p-4 max-w-xs shadow-md">
                  <p className="text-sm">I wanted to ask about React best practices</p>
                  <span className="text-xs text-gray-500 block mt-1">10:32 AM</span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 py-10">Start a conversation with {user.name}</p>
            </div>
            <div className="p-4 border-t">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-l-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-indigo-600 text-white py-3 px-6 rounded-r-lg hover:bg-indigo-700 transition duration-200"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;