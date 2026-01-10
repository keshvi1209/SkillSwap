import StarRating from "../common/StarRating";

const ProfileHeader = ({ user, averageRating, reviewCount, onMessageClick }) => {
  return (
    <section className="bg-gradient-to-br from-gray-800/80 to-gray-800/50 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden backdrop-blur-sm">
      <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

      <div className="p-8 sm:p-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src="https://via.placeholder.com/150"
                alt={user.name}
                className="h-32 w-32 rounded-2xl border-4 border-gray-700/50 shadow-xl object-cover"
              />
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{user.name}</h1>

                {/* Rating Summary */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <StarRating rating={averageRating} />
                  <span className="text-sm text-gray-400">
                    {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                  </span>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm">{user.email}</span>
                  </div>

                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-sm">{user.phone}</span>
                  </div>

                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-sm">{user.location}</span>
                  </div>

                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="text-sm">{user.address}</span>
                  </div>
                </div>
              </div>

              {/* Message Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={onMessageClick}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg transition-all font-medium shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;