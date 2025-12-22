import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import api from '../api.js';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Video, Clock, User, BookOpen 
} from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup localizer
const localizer = momentLocalizer(moment);

const ScheduleCalendar = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('week'); // Default to Week view
  const [date, setDate] = useState(new Date());
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await api.get('/meet/my-calendar');
        
        const formattedEvents = res.data.map(meet => ({
          id: meet._id,
          title: meet.skillName,
          start: new Date(meet.startTime),
          end: new Date(meet.endTime),
          resource: meet, 
          // Helper flag to determine role
          isTeaching: meet.teacherId._id === userId 
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Failed to load calendar", err);
      }
    };
    fetchMeetings();
  }, [userId]);

  const handleEventClick = (event) => {
    const link = event.resource.meetLink;
    if (window.confirm(`Ready to join the session for ${event.title}?`)) {
      window.open(link, "_blank");
    }
  };

  // --- CUSTOM COMPONENTS ---

  // 1. Custom Toolbar
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
      setDate(moment(toolbar.date).subtract(1, view).toDate());
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
      setDate(moment(toolbar.date).add(1, view).toDate());
    };

    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
      setDate(new Date());
    };

    const label = () => {
      return <span className="text-xl font-bold text-white tracking-tight">{toolbar.label}</span>;
    };

    return (
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 p-1">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
             <CalendarIcon className="text-white" size={20} />
          </div>
          {label()}
        </div>

        <div className="flex items-center space-x-6">
            {/* View Switcher */}
            <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
                {['month', 'week', 'day'].map((item) => (
                    <button
                        key={item}
                        onClick={() => {
                            setView(item);
                            toolbar.onView(item);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            view === item 
                            ? 'bg-slate-700 text-white shadow-md' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center space-x-2">
                <button onClick={goToBack} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={goToCurrent} className="text-xs font-bold px-3 py-1 bg-slate-800 text-indigo-400 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
                    TODAY
                </button>
                <button onClick={goToNext} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
      </div>
    );
  };

  // 2. Custom Event Card
  const CustomEvent = ({ event }) => {
    const isTeaching = event.isTeaching;
    
    return (
      <div className={`h-full w-full p-2 rounded-lg border-l-4 flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer
        ${isTeaching 
            ? 'bg-indigo-900/40 border-indigo-500 hover:bg-indigo-900/60' 
            : 'bg-emerald-900/40 border-emerald-500 hover:bg-emerald-900/60'
        }`}
      >
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isTeaching ? 'text-indigo-300' : 'text-emerald-300'}`}>
                    {isTeaching ? 'Teaching' : 'Learning'}
                </span>
                {event.resource.meetLink && <Video size={12} className={isTeaching ? 'text-indigo-400' : 'text-emerald-400'} />}
            </div>
            <h3 className="text-xs font-bold text-white leading-tight line-clamp-2">{event.title}</h3>
        </div>
        
        <div className="mt-2 flex items-center text-[10px] text-slate-400 space-x-2">
             <span className="flex items-center">
                <Clock size={10} className="mr-1" />
                {moment(event.start).format('h:mm A')}
             </span>
             {isTeaching && (
                 <span className="flex items-center">
                    <User size={10} className="mr-1" />
                    Student
                 </span>
             )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 font-sans flex items-center justify-center">
      {/* Container */}
      <div className="w-full max-w-6xl bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden p-8 relative">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 h-[700px]">
            {/* INJECT CUSTOM CSS FOR DARK THEME OVERRIDES */}
            <style>{`
                .rbc-calendar { font-family: inherit; }
                .rbc-header { padding: 12px 0; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #1e293b !important; }
                .rbc-today { background-color: rgba(79, 70, 229, 0.05); }
                .rbc-off-range-bg { background-color: transparent; }
                .rbc-time-view, .rbc-month-view { border: none !important; }
                .rbc-time-header-content { border-left: 1px solid #1e293b !important; }
                .rbc-time-content { border-top: 1px solid #1e293b !important; }
                .rbc-time-gutter .rbc-timeslot-group { border-bottom: 1px solid #1e293b !important; }
                .rbc-timeslot-group { border-bottom: 1px solid #1e293b !important; min-height: 60px !important; }
                .rbc-day-slot .rbc-time-slot { border-top: 1px solid #1e293b !important; }
                .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #1e293b !important; }
                .rbc-time-view .rbc-header { border-bottom: 1px solid #1e293b !important; }
                .rbc-day-slot .rbc-events-container { margin-right: 0 !important; }
                .rbc-event { background: transparent !important; border: none !important; padding: 2px !important; outline: none !important; }
                .rbc-label { color: #64748b; font-size: 11px; font-weight: 600; }
                .rbc-current-time-indicator { background-color: #f43f5e; height: 2px; }
            `}</style>

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view} // Controlled view
                onView={setView} // Update state when view changes
                date={date} // Controlled date
                onNavigate={setDate} // Update state when navigating
                style={{ height: '100%' }}
                onSelectEvent={handleEventClick}
                components={{
                    toolbar: CustomToolbar,
                    event: CustomEvent, 
                }}
            />
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;