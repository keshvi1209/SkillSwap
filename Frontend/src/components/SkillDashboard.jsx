import React, { useState } from 'react';

const SkillsDashboard = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    name: '',
    type: 'learn',
    proficiency: 'beginner',
    availability: 'part-time'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    
    const skillWithId = {
      ...newSkill,
      id: Date.now(),
      addedDate: new Date().toLocaleDateString()
    };
    
    setSkills([...skills, skillWithId]);
    
    // Reset form
    setNewSkill({
      name: '',
      type: 'learn',
      proficiency: 'beginner',
      availability: 'part-time'
    });
  };

  const getProficiencyColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability) => {
    return availability === 'full-time' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <header className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          Skill<span className="text-indigo-600 animate-pulse">Hub</span> 
          <span className="text-xl align-top ml-2">✨</span>
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Your personal skills dashboard to track what you want to 
          <span className="text-green-500 font-medium"> learn </span> 
          and what you can 
          <span className="text-purple-500 font-medium"> teach</span>
        </p>
        <div className="mt-4 h-1 w-24 bg-indigo-500 mx-auto rounded-full"></div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Skill Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-10 transition-all hover:shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Skill Name
              </label>
              <input
                type="text"
                name="name"
                value={newSkill.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., React, UX Design"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Skill Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="learn"
                    checked={newSkill.type === 'learn'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-500 focus:ring-green-500"
                  />
                  <span className="ml-2 text-gray-700">To Learn 🌱</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="teach"
                    checked={newSkill.type === 'teach'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-700">To Teach 🎓</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Proficiency Level
              </label>
              <select
                name="proficiency"
                value={newSkill.proficiency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Availability
              </label>
              <select
                name="availability"
                value={newSkill.availability}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="part-time">Part-time</option>
                <option value="full-time">Full-time</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="mt-6 w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            Add Skill +
          </button>
        </form>

        {/* Skills Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            Skills Summary
            <span className="ml-2 bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {skills.length} total
            </span>
          </h2>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800">To Learn</h3>
                <p className="text-2xl font-bold">
                  {skills.filter(s => s.type === 'learn').length}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800">To Teach</h3>
                <p className="text-2xl font-bold">
                  {skills.filter(s => s.type === 'teach').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Skills</h2>
        
        {skills.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500">No skills added yet. Start by adding your first skill!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((skill) => (
              <div 
                key={skill.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
                  skill.type === 'learn' ? 'border-green-500' : 'border-purple-500'
                } transition-transform hover:scale-105`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">{skill.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      skill.type === 'learn' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {skill.type === 'learn' ? 'Learning' : 'Teaching'}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Proficiency:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        getProficiencyColor(skill.proficiency)
                      }`}>
                        {skill.proficiency.charAt(0).toUpperCase() + skill.proficiency.slice(1)}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Availability:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        getAvailabilityColor(skill.availability)
                      }`}>
                        {skill.availability === 'full-time' ? 'Full-time' : 'Part-time'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500 mt-4">
                      Added on: {skill.addedDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsDashboard;