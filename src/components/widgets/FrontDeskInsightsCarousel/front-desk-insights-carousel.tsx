import { FC, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ClinicalInsightCard, type InsightType } from '@/components/molecules/ClinicalInsightCard/clinical-insight-card';
import { Button } from '@/components/atoms/Button/button';
import { cn } from '@/lib/utils';

interface FrontDeskInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  value?: string | number;
  date?: string;
}

interface FrontDeskInsightsCarouselProps {
  patientId: string;
  isFullscreen?: boolean;
}

export const FrontDeskInsightsCarousel: FC<FrontDeskInsightsCarouselProps> = ({
  patientId,
  isFullscreen = false
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // In a real app, this would be fetched from an API based on the patient's data
  const insights: FrontDeskInsight[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Today\'s Check-in Alert',
      description: 'Patient needs to update insurance card before today\'s appointment with Dr. Chen.',
      date: 'Appointment in 45 minutes'
    },
    {
      id: '2',
      type: 'due',
      title: 'Missing Pre-Registration',
      description: 'Pre-registration forms not submitted for upcoming appointment. Send patient portal invitation.',
      date: 'Next visit: Oct 17, 2023'
    },
    {
      id: '3',
      type: 'metric',
      title: 'Outstanding Balance',
      description: 'Payment plan available. Collect minimum $50 at next visit per financial policy.',
      value: '$320.75',
      date: '45 days overdue'
    },
    {
      id: '4',
      type: 'lab',
      title: 'ID & Insurance Verification',
      description: 'Medicare card expired. New card needed before next billing cycle to prevent claim denial.',
      date: 'Expires in 8 days'
    },
    {
      id: '5',
      type: 'warning',
      title: 'Prior Authorization Required',
      description: 'Upcoming procedure requires prior authorization. Insurance verification needed immediately.',
      date: 'Procedure on Nov 2, 2023'
    },
    {
      id: '6',
      type: 'trend_down',
      title: 'Appointment Alert',
      description: 'Patient has missed 2 recent appointments. Reminder call recommended 48hrs before next visit.',
      value: 'High Risk',
      date: 'Last no-show: Sep 8, 2023'
    },
    {
      id: '7',
      type: 'due',
      title: 'Form Completion Needed',
      description: 'Annual HIPAA, consent forms, and ROI authorization need updates. Send forms via patient portal.',
      date: 'Required before Oct 31, 2023'
    },
    {
      id: '8',
      type: 'success',
      title: 'Referral Status',
      description: 'Cardiology referral approved by insurance. Patient needs scheduling assistance.',
      value: 'Approved',
      date: 'Valid until Dec 15, 2023'
    },
    {
      id: '9',
      type: 'trend_up',
      title: 'Preferred Communication',
      description: 'Patient prefers text message reminders and electronic statements. Verified and confirmed.',
      date: 'Updated Sep 5, 2023'
    },
    {
      id: '10',
      type: 'warning',
      title: 'Special Accommodation',
      description: 'Patient requires interpreter services (Spanish). Arrange interpreter for upcoming visit.',
      date: 'Next visit: Oct 17, 2023'
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