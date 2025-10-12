import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import {useWorld} from '../../contexts/WorldContext';

// Content Management - All text content in one place
const CONTENT = {
  title: 'Select Your Preferred Date',
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ariaLabels: {
    previousMonth: 'Previous month',
    nextMonth: 'Next month'
  },
  selectedDate: {
    prefix: '✅ Selected:',
    dateFormat: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  },
  schedulingNotes: {
    title: 'ℹ️ Scheduling Notes:',
    items: [
      '• Available Monday through Saturday',
      '• Book up to 2 months in advance',
    ]
  },
  urgentBooking: {
    label: 'Urgent - I need service ASAP',
    disclaimer: '⚠️ Urgent bookings include a $35+ rush service premium & subject to availability.',
    standardNotice: '📅 Standard bookings require 36 hours advance notice to confirm availability.'
  }
};

const CalendarStep = ({ onDateSelect, selectedDate, service }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isUrgent, setIsUrgent] = useState(false);

  const { isHandyman } = useWorld();

  const monthNames = CONTENT.monthNames;
  const weekDays = CONTENT.weekDays;

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateSelectable = (date) => {
    if (!date) return false;
    
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Can't select past dates
    if (date < today) return false;
    
    // If not urgent, require 36 hours advance notice
    if (!isUrgent) {
      const minimumDate = new Date(now.getTime() + (36 * 60 * 60 * 1000)); // 36 hours from now
      minimumDate.setHours(0, 0, 0, 0); // Reset to start of day
      if (date < minimumDate) return false;
    }
    
    // Can't select more than 2 months in advance
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    if (date > maxDate) return false;
    
    // Don't allow Sundays for non-emergency services
    if (date.getDay() === 0 && service?.id !== 'custom') return false;
    
    return true;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === new Date(selectedDate).toDateString();
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    if (isDateSelectable(date)) {
      onDateSelect(date.toISOString().split('T')[0], isUrgent);
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-blue-600" />
        {CONTENT.title}
      </h3>

      {isHandyman && (
        /* Urgent Booking Checkbox - Moved to top and made compact */
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            className="w-5 h-5 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500"
          />
          <div className="flex-1">
            <span className="font-semibold text-gray-900">
              🚨 {CONTENT.urgentBooking.label} 
            </span>
            {isUrgent && (
              <span className="text-sm text-red-700 ml-2">
                {CONTENT.urgentBooking.disclaimer}
              </span>
            )}
          </div>
        </label>
      </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={CONTENT.ariaLabels.previousMonth}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <h4 className="text-xl font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h4>
          
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={CONTENT.ariaLabels.nextMonth}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const selectable = isDateSelectable(date);
            const today = isToday(date);
            const selected = isSelected(date);
            const hovered = hoveredDate && date && date.toDateString() === hoveredDate.toDateString();

            return (
              <button
                key={index}
                onClick={() => date && handleDateClick(date)}
                onMouseEnter={() => date && setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={!selectable}
                className={`
                  relative h-12 rounded-lg transition-all
                  ${!date ? 'cursor-default' : ''}
                  ${selectable 
                    ? 'hover:bg-blue-50 hover:border-blue-300 cursor-pointer' 
                    : 'cursor-not-allowed opacity-40'
                  }
                  ${selected 
                    ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white font-bold shadow-md' 
                    : ''
                  }
                  ${today && !selected 
                    ? 'bg-blue-100 text-blue-700 font-semibold' 
                    : ''
                  }
                  ${hovered && selectable && !selected
                    ? 'bg-blue-50 border-2 border-blue-300'
                    : 'border border-transparent'
                  }
                  ${!selected && !today && date ? 'text-gray-700' : ''}
                `}
              >
                {date && (
                  <>
                    {date.getDate()}
                    {today && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date display */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            {CONTENT.selectedDate.prefix} {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', CONTENT.selectedDate.dateFormat)}
            {isUrgent && <span className="text-red-600 ml-2">(URGENT)</span>}
          </p>
        </div>
      )}

      {/* Info box */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>{CONTENT.schedulingNotes.title}</strong>
        </p>
        <ul className="text-sm text-gray-600 mt-2 space-y-1">
          {CONTENT.schedulingNotes.items.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarStep;
