import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ClaimsAcceptanceWidgetProps {
  className?: string
}

interface ClaimsData {
  submitted: number
  approved: number
  acceptanceRate: number
  firstPassRate: number
  firstPassCount: number
  secondTimeCount: number
  multipleTimesCount: number
  secondTimePercentage: number
  multipleTimesPercentage: number
}

// Mock data matching the image
const mockClaimsData: ClaimsData = {
  submitted: 2800,
  approved: 2492,
  acceptanceRate: 89,
  firstPassRate: 90,
  firstPassCount: 2520,
  secondTimeCount: 140,
  multipleTimesCount: 140,
  secondTimePercentage: 5,
  multipleTimesPercentage: 5
}

export const ClaimsAcceptanceWidget: React.FC<ClaimsAcceptanceWidgetProps> = ({
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-gray-900">Claims Acceptance</h3>
          <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md">
            Action required
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md">
            <FontAwesomeIcon icon="expand" className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md">
            <FontAwesomeIcon icon="ellipsis" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-600">Claims Acceptance Rate</span>
          <FontAwesomeIcon icon="info-circle" className="w-3 h-3 text-gray-400" />
        </div>
        
        <div className="flex items-center gap-4 mb-3">
          <div className="text-4xl font-bold text-gray-900">
            {mockClaimsData.acceptanceRate}%
          </div>
          <div className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md">
            Excellent
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Submitted:</span> {mockClaimsData.submitted.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Approved:</span> {mockClaimsData.approved.toLocaleString()}
          </div>
        </div>
        
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
          View more details
        </button>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First-pass acceptance rate */}
        <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700 mb-1">
              First-pass acceptance rate
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">
                {mockClaimsData.firstPassRate}%
              </span>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon="arrow-up" className="w-3 h-3 text-green-600" />
                <span className="px-1.5 py-0.5 text-xs font-medium text-green-700 bg-green-200 rounded">
                  Excellent
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            {mockClaimsData.firstPassCount.toLocaleString()} of claims have submitted and accepted on first submission.
          </div>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            View Details
          </button>
        </div>

        {/* Accepted on second time submission */}
        <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700 mb-1">
              Accepted on second time submission
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-amber-600">
                {mockClaimsData.secondTimePercentage}
              </span>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon="arrow-down" className="w-3 h-3 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            {mockClaimsData.secondTimeCount} of claims have submitted and accepted on second submission.
          </div>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            View Details
          </button>
        </div>

        {/* Accepted on more than 3 times */}
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700 mb-1">
              Accepted on more than 3 times
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-600">
                {mockClaimsData.multipleTimesPercentage}%
              </span>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon="arrow-down" className="w-3 h-3 text-red-600" />
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            {mockClaimsData.multipleTimesCount} of claims have submitted and accepted on third or more numbers of times submission.
          </div>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClaimsAcceptanceWidget
