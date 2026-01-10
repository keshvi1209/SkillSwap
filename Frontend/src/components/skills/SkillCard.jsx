import { useState } from "react";
import ProficiencyBadge from "../common/ProficiencyBadge";
import ModeBadge from "../common/ModeBadge";
import BookingModal from "../booking/BookingModal";

const SkillCard = ({ skill, userId }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookSlot = () => setShowBookingModal(true);

  const handleConfirmBooking = (bookingDetails) => {
    setShowBookingModal(false);
    // onBookSlot(bookingDetails);
  };

  return (
    <>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-900 to-emerald-900 px-6 py-4">
          <h3 className="text-xl font-bold text-gray-100 mb-2">{skill.skill}</h3>
          <div className="flex flex-wrap gap-2">
            <ProficiencyBadge level={skill.proficiency} />
            <ModeBadge mode={skill.mode} />
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Description */}
          {skill.description && (
            <p className="text-gray-300 text-sm leading-relaxed">{skill.description}</p>
          )}

          {/* Experience */}
          {skill.experience && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-2 bg-amber-500/20 rounded-full">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-100">{skill.experience} years</span>
              <span className="text-sm text-gray-400">experience</span>
            </div>
          )}

          {/* Languages */}
          {skill.languages?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {skill.languages.map((lang, idx) => (
                  <span key={idx} className="bg-gray-800 text-teal-300 px-3 py-1.5 rounded-md text-xs font-medium border border-gray-700">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {skill.tags?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag, idx) => (
                  <span key={idx} className="bg-violet-900 text-violet-300 px-3 py-1.5 rounded-md text-xs font-medium border border-violet-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Schedule */}
          {/* {skill.availability?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Weekly Schedule
              </h4>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 space-y-2">
                {skill.availability.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
                    <div className="w-12 flex-shrink-0">
                      <span className="text-xs font-bold text-teal-400 uppercase">{slot.day.slice(0, 3)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-amber-400 bg-amber-900/20 px-2 py-1 rounded border border-amber-700">{slot.startTime}</span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-xs font-medium text-violet-400 bg-violet-900/20 px-2 py-1 rounded border border-violet-700">{slot.endTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>

        {/* Book Slot Button */}
        <div className="px-6 pb-6">
          <button
            onClick={handleBookSlot}
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-gray-100 font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book a Session
          </button>
        </div>
      </div>

      <BookingModal
        skill={skill}
        userId={userId}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleConfirmBooking}
      />
    </>
  );
};

export default SkillCard;

