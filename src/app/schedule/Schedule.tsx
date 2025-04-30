const colorSchemes: Record<'category' | 'facility' | 'location', ColorScheme> = {
  category: {
    eventColors: {
      individual: '#4CAF50',
      group: '#2196F3',
      crisis: '#F44336'
    }
  },
  facility: {
    eventColors: {
      individual: '#FF9800',
      group: '#9C27B0',
      crisis: '#795548'
    }
  },
  location: {
    eventColors: {
      individual: '#009688',
      group: '#673AB7',
      crisis: '#E91E63'
    }
  }
};

<ScheduleHeader
  showFilters={showFilters}
  setShowFilters={setShowFilters}
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  handlePrev={handlePrev}
  handleNext={handleNext}
  handleToday={handleToday}
  getHeaderTitle={getHeaderTitle}
  currentView={currentView}
  setCurrentView={setCurrentView}
  calendarRef={calendarRef}
  onNewAppointment={handleNewAppointment}
  activeColorScheme={activeColorScheme}
  setActiveColorScheme={setActiveColorScheme}
  colorScheme={colorSchemes[activeColorScheme].eventColors}
/> 