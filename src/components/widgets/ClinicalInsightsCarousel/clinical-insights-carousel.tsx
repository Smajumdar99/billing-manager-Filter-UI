import { FC, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ClinicalInsightCard, type InsightType } from '@/components/molecules/ClinicalInsightCard/clinical-insight-card';
import { Button } from '@/components/atoms/Button/button';
import { cn } from '@/lib/utils';

interface ClinicalInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  value?: string | number;
  date?: string;
}

interface ClinicalInsightsCarouselProps {
  patientId: string;
  isFullscreen?: boolean;
}

export const ClinicalInsightsCarousel: FC<ClinicalInsightsCarouselProps> = ({
  patientId,
  isFullscreen = false
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // In a real app, this would be fetched from an API based on the patient's data
  const insights: ClinicalInsight[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Blood Pressure Alert',
      description: 'Systolic pressure trending higher than usual over the last 3 readings',
      value: '145/90',
      date: '2 hours ago'
    },
    {
      id: '2',
      type: 'trend_up',
      title: 'A1C Improvement',
      description: 'Significant improvement in A1C levels over the past 3 months',
      value: '6.2%',
      date: '5 days ago'
    },
    {
      id: '3',
      type: 'due',
      title: 'Medication Review Due',
      description: 'Annual medication review is due in the next 2 weeks',
      date: 'Due in 14 days'
    },
    {
      id: '4',
      type: 'lab',
      title: 'New Lab Results',
      description: 'Comprehensive metabolic panel results are ready for review',
      date: '1 day ago'
    },
    {
      id: '5',
      type: 'metric',
      title: 'Depression Screening',
      description: 'PHQ-9 score has decreased, showing positive response to treatment',
      value: '-4pts',
      date: '1 week ago'
    },
    {
      id: '6',
      type: 'vital',
      title: 'Heart Rate Variability',
      description: 'Showing improved pattern during rest periods',
      value: '+15%',
      date: '3 days ago'
    },
    {
      id: '7',
      type: 'success',
      title: 'Care Plan Goals',
      description: 'Patient has completed 3 out of 4 quarterly health goals',
      value: '75%',
      date: 'Updated today'
    },
    {
      id: '8',
      type: 'trend_down',
      title: 'Missed Appointments',
      description: 'Decrease in appointment attendance over last quarter',
      value: '-20%',
      date: 'Last quarter'
    }
  ];

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -320 : 320;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="relative flex-1 w-full">
        {/* Gradient Masks */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none",
          !canScrollLeft && "hidden"
        )} />
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none",
          !canScrollRight && "hidden"
        )} />

        {/* Scroll Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border hover:bg-white",
            !canScrollLeft && "hidden"
          )}
          onClick={() => scrollTo('left')}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border hover:bg-white",
            !canScrollRight && "hidden"
          )}
          onClick={() => scrollTo('right')}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>

        {/* Cards Container */}
        <div
          ref={scrollContainerRef}
          className="h-full w-full overflow-x-auto scrollbar-hide"
          onScroll={handleScroll}
        >
          <div className={cn(
            "inline-flex gap-3 p-3 min-w-full",
            isFullscreen ? "flex-wrap justify-center" : "flex-nowrap"
          )}>
            {insights.map(insight => (
              <ClinicalInsightCard
                key={insight.id}
                type={insight.type}
                title={insight.title}
                description={insight.description}
                value={insight.value}
                date={insight.date}
                className="shadow-sm hover:shadow-md transition-shadow duration-200"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 