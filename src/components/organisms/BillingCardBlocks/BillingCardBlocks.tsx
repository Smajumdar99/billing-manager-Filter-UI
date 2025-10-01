import React from 'react';
import { TaskBlockCard, TaskBlock } from '@/components/atoms/TaskBlockCard/TaskBlockCard';

// Billing section interface
interface BillingSection {
  id: string;
  title: string;
  items: number;
  blocks: TaskBlock[];
}

interface BillingCardBlocksProps {
  onBlockClick?: (blockId: string) => void;
  selectedBlockId?: string | null;
}

/**
 * BillingCardBlocks Component
 * 
 * Displays billing sections like TaskHub with simple card design
 * Based on the billing data structure from the reference images
 */
export const BillingCardBlocks: React.FC<BillingCardBlocksProps> = ({
  onBlockClick,
  selectedBlockId
}) => {
  // Billing sections based on the second image structure - adapted to TaskBlock interface
  const billingSections: BillingSection[] = [
    {
      id: 'claims-status',
      title: 'Claims Status',
      items: 6,
      blocks: [
        {
          id: 'cms-created',
          count: 29,
          label: 'Created',
          textColor: 'text-blue-700',
          criticality: 'high'
        },
        {
          id: 'cms-submitted',
          count: 2,
          label: 'Submitted',
          textColor: 'text-green-700',
          criticality: 'medium'
        },
        {
          id: 'cms-printed',
          count: 1,
          label: 'Printed',
          textColor: 'text-gray-700',
          criticality: 'low'
        },
        {
          id: 'cms-resubmitted',
          count: 1,
          label: 'Re-submitted',
          textColor: 'text-orange-700',
          criticality: 'medium'
        },
        {
          id: 'ub-updated',
          count: 1,
          label: 'Updated',
          textColor: 'text-purple-700',
          criticality: 'low'
        },
        {
          id: 'ub-submitted',
          count: 11,
          label: 'Submitted',
          textColor: 'text-green-700',
          criticality: 'medium'
        }
      ]
    },
    {
      id: 'billable-encounters',
      title: 'Billable Encounters',
      items: 4,
      blocks: [
        {
          id: 'cms-total',
          count: 44,
          label: 'Total',
          textColor: 'text-blue-700',
          criticality: 'high'
        },
        {
          id: 'cms-unbilled',
          count: 37,
          label: 'Unbilled',
          textColor: 'text-orange-700',
          criticality: 'high'
        },
        {
          id: 'cms-billed',
          count: 7,
          label: 'Billed',
          textColor: 'text-green-700',
          criticality: 'medium'
        },
        {
          id: 'ub-total',
          count: 6,
          label: 'Total',
          textColor: 'text-blue-700',
          criticality: 'medium'
        }
      ]
    },
    {
      id: 'encounter-fees',
      title: 'Encounter Fees',
      items: 6,
      blocks: [
        {
          id: 'cms-total-fees',
          count: 33377,
          label: 'Total',
          textColor: 'text-green-700',
          criticality: 'critical'
        },
        {
          id: 'cms-unbilled-fees',
          count: 31829,
          label: 'Unbilled',
          textColor: 'text-orange-700',
          criticality: 'high'
        },
        {
          id: 'cms-billed-fees',
          count: 1548,
          label: 'Billed',
          textColor: 'text-green-700',
          criticality: 'medium'
        },
        {
          id: 'ub-total-fees',
          count: 25766,
          label: 'Total',
          textColor: 'text-green-700',
          criticality: 'high'
        },
        {
          id: 'ub-unbilled-fees',
          count: 390,
          label: 'Unbilled',
          textColor: 'text-orange-700',
          criticality: 'medium'
        },
        {
          id: 'ub-billed-fees',
          count: 25376,
          label: 'Billed',
          textColor: 'text-green-700',
          criticality: 'high'
        }
      ]
    },
    {
      id: 'contract-amounts',
      title: 'Contract Amounts',
      items: 6,
      blocks: [
        {
          id: 'cms-contract-total',
          count: 0,
          label: 'Total',
          textColor: 'text-gray-700',
          criticality: 'low'
        },
        {
          id: 'cms-contract-unbilled',
          count: 0,
          label: 'Unbilled',
          textColor: 'text-gray-700',
          criticality: 'low'
        },
        {
          id: 'cms-contract-billed',
          count: 0,
          label: 'Billed',
          textColor: 'text-gray-700',
          criticality: 'low'
        },
        {
          id: 'ub-contract-total',
          count: 0,
          label: 'Total',
          textColor: 'text-gray-700',
          criticality: 'low'
        },
        {
          id: 'ub-contract-unbilled',
          count: 0,
          label: 'Unbilled',
          textColor: 'text-gray-700',
          criticality: 'low'
        },
        {
          id: 'ub-contract-billed',
          count: 0,
          label: 'Billed',
          textColor: 'text-gray-700',
          criticality: 'low'
        }
      ]
    },
    {
      id: 'adjustments',
      title: 'Adjustments',
      items: 6,
      blocks: [
        {
          id: 'cms-adj-total',
          count: 0,
          label: 'Total',
          textColor: 'text-gray-700',
          criticality: 'low'
        },
        {
          id: 'cms-adj-unbilled',
          count: 0,
          label: 'Unbilled',
          textColor: 'text-gray-700',
          criticality: 'low'
        },
        {
          id: 'cms-adj-billed',
          count: 0,
          label: 'Billed',
          textColor: 'text-gray-700',
          criticality: 'low'
        },
        {
          id: 'ub-adj-total',
          count: 0,
          label: 'Total',
          textColor: 'text-gray-700',
          criticality: 'low'
        },
        {
          id: 'ub-adj-unbilled',
          count: 0,
          label: 'Unbilled',
          textColor: 'text-gray-700',
          criticality: 'low'
        },
        {
          id: 'ub-adj-billed',
          count: 0,
          label: 'Billed',
          textColor: 'text-gray-700',
          criticality: 'low'
        }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
      {billingSections.map((section) => (
        <div key={section.id} className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm overflow-hidden">
          {/* Gradient Pattern Overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/40 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-200/40 to-transparent rounded-full translate-x-12 translate-y-12"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-indigo-200/30 to-transparent rounded-full"></div>
          </div>
          
          {/* Content with relative positioning */}
          <div className="relative z-10">
          <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              {section.title}
            </div>
            <span className="text-sm text-gray-500">({section.items} items)</span>
          </h3>
          
          {/* Cards Grid within each section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {section.blocks.map((block, index) => (
              <div key={block.id} className="w-full">
                <TaskBlockCard
                  {...block}
                  index={index}
                  isSelected={selectedBlockId === block.id}
                  onClick={onBlockClick}
                />
              </div>
            ))}
          </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BillingCardBlocks;
