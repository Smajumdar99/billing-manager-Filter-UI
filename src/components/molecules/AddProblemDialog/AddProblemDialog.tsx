import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select';
import { Autocomplete, AutocompleteOption } from '@/components/atoms/Autocomplete/Autocomplete';
import { ExclamationTriangleIcon, CalendarIcon } from '@heroicons/react/24/outline';

/**
 * AddProblemDialog Component
 * 
 * Professional dialog for adding problems to treatment plans.
 * Based on the legacy form content provided by the user.
 * 
 * Follows Apple-style design principles with clean, intuitive UX.
 * Uses consistent dialog styling pattern.
 */

interface Problem {
  id: string;
  coding: string;
  title: string;
  details: string;
  relatedTo: string;
  beginDate: string;
  endDate: string;
  accessPrograms: string;
  occurrence: string;
  outcome: string;
  comments: string;
  provider: string;
  priority: 'High' | 'Medium' | 'Low';
}

// Medical coding interface for enhanced search functionality
interface MedicalCode {
  code: string;
  description: string;
  shortDescription: string;
  category: 'ICD-10' | 'DSM-5';
}

// Comprehensive medical coding database for behavioral health
const MEDICAL_CODES: MedicalCode[] = [
  // ICD-10 Codes for Behavioral Health
  { code: 'A04.4', description: 'Other intestinal Escherichia coli infections', shortDescription: 'Other intestinal Escherichia coli infections', category: 'ICD-10' },
  { code: 'A04.8', description: 'Other specified bacterial intestinal infections', shortDescription: 'Other specified bacterial intestinal infections', category: 'ICD-10' },
  { code: 'A04.9', description: 'Bacterial intestinal infection, unspecified', shortDescription: 'Bacterial intestinal infection, unspecified', category: 'ICD-10' },
  { code: 'A06.1', description: 'Chronic intestinal amebiasis', shortDescription: 'Chronic intestinal amebiasis', category: 'ICD-10' },
  { code: 'A06.3', description: 'Ameboma of intestine', shortDescription: 'Ameboma of intestine', category: 'ICD-10' },
  { code: 'A07.8', description: 'Other specified protozoal intestinal diseases', shortDescription: 'Other specified protozoal intestinal diseases', category: 'ICD-10' },
  { code: 'A07.9', description: 'Protozoal intestinal disease, unspecified', shortDescription: 'Protozoal intestinal disease, unspecified', category: 'ICD-10' },
  { code: 'A08.4', description: 'Viral intestinal infection, unspecified', shortDescription: 'Viral intestinal infection, unspecified', category: 'ICD-10' },
  { code: 'A08.8', description: 'Other specified intestinal infections', shortDescription: 'Other specified intestinal infections', category: 'ICD-10' },
  { code: 'A18.89', description: 'Tuberculosis of other sites', shortDescription: 'Tuberculosis of other sites', category: 'ICD-10' },
  { code: 'A19.1', description: 'Acute miliary tuberculosis of multiple sites', shortDescription: 'Acute miliary tuberculosis of multiple sites', category: 'ICD-10' },
  { code: 'F10.10', description: 'Alcohol use disorder, mild', shortDescription: 'Alcohol use disorder, mild', category: 'ICD-10' },
  { code: 'F10.20', description: 'Alcohol use disorder, moderate', shortDescription: 'Alcohol use disorder, moderate', category: 'ICD-10' },
  { code: 'F10.21', description: 'Alcohol use disorder, moderate, in remission', shortDescription: 'Alcohol use disorder, moderate, in remission', category: 'ICD-10' },
  { code: 'F32.0', description: 'Major depressive disorder, single episode, mild', shortDescription: 'Major depressive disorder, single episode, mild', category: 'ICD-10' },
  { code: 'F32.1', description: 'Major depressive disorder, single episode, moderate', shortDescription: 'Major depressive disorder, single episode, moderate', category: 'ICD-10' },
  { code: 'F32.2', description: 'Major depressive disorder, single episode, severe without psychotic features', shortDescription: 'Major depressive disorder, single episode, severe', category: 'ICD-10' },
  { code: 'F33.0', description: 'Major depressive disorder, recurrent, mild', shortDescription: 'Major depressive disorder, recurrent, mild', category: 'ICD-10' },
  { code: 'F33.1', description: 'Major depressive disorder, recurrent, moderate', shortDescription: 'Major depressive disorder, recurrent, moderate', category: 'ICD-10' },
  { code: 'F41.0', description: 'Panic disorder without agoraphobia', shortDescription: 'Panic disorder without agoraphobia', category: 'ICD-10' },
  { code: 'F41.1', description: 'Generalized anxiety disorder', shortDescription: 'Generalized anxiety disorder', category: 'ICD-10' },
  { code: 'F43.10', description: 'Post-traumatic stress disorder, unspecified', shortDescription: 'Post-traumatic stress disorder, unspecified', category: 'ICD-10' },
  { code: 'F43.12', description: 'Post-traumatic stress disorder, chronic', shortDescription: 'Post-traumatic stress disorder, chronic', category: 'ICD-10' },
  { code: 'F90.0', description: 'Attention-deficit hyperactivity disorder, predominantly inattentive type', shortDescription: 'ADHD, predominantly inattentive type', category: 'ICD-10' },
  { code: 'F90.1', description: 'Attention-deficit hyperactivity disorder, predominantly hyperactive type', shortDescription: 'ADHD, predominantly hyperactive type', category: 'ICD-10' },
  { code: 'F90.2', description: 'Attention-deficit hyperactivity disorder, combined type', shortDescription: 'ADHD, combined type', category: 'ICD-10' },
  
  // DSM-5 Codes for Behavioral Health
  { code: '296.20', description: 'Major Depressive Disorder, Single Episode, Unspecified', shortDescription: 'Major Depressive Disorder, Single Episode', category: 'DSM-5' },
  { code: '296.21', description: 'Major Depressive Disorder, Single Episode, Mild', shortDescription: 'Major Depressive Disorder, Single Episode, Mild', category: 'DSM-5' },
  { code: '296.22', description: 'Major Depressive Disorder, Single Episode, Moderate', shortDescription: 'Major Depressive Disorder, Single Episode, Moderate', category: 'DSM-5' },
  { code: '296.30', description: 'Major Depressive Disorder, Recurrent Episode, Unspecified', shortDescription: 'Major Depressive Disorder, Recurrent', category: 'DSM-5' },
  { code: '300.00', description: 'Anxiety Disorder, Unspecified', shortDescription: 'Anxiety Disorder, Unspecified', category: 'DSM-5' },
  { code: '300.01', description: 'Panic Disorder', shortDescription: 'Panic Disorder', category: 'DSM-5' },
  { code: '300.02', description: 'Generalized Anxiety Disorder', shortDescription: 'Generalized Anxiety Disorder', category: 'DSM-5' },
  { code: '309.81', description: 'Posttraumatic Stress Disorder', shortDescription: 'Posttraumatic Stress Disorder', category: 'DSM-5' },
  { code: '314.00', description: 'Attention-Deficit/Hyperactivity Disorder, Predominantly Inattentive Presentation', shortDescription: 'ADHD, Predominantly Inattentive', category: 'DSM-5' },
  { code: '314.01', description: 'Attention-Deficit/Hyperactivity Disorder, Predominantly Hyperactive-Impulsive Presentation', shortDescription: 'ADHD, Predominantly Hyperactive-Impulsive', category: 'DSM-5' },
  { code: '314.01', description: 'Attention-Deficit/Hyperactivity Disorder, Combined Presentation', shortDescription: 'ADHD, Combined Presentation', category: 'DSM-5' },
  { code: '303.90', description: 'Alcohol Use Disorder, Unspecified', shortDescription: 'Alcohol Use Disorder', category: 'DSM-5' },
  { code: '305.00', description: 'Alcohol Use Disorder, Mild', shortDescription: 'Alcohol Use Disorder, Mild', category: 'DSM-5' },
  { code: '301.83', description: 'Borderline Personality Disorder', shortDescription: 'Borderline Personality Disorder', category: 'DSM-5' },
  { code: '295.90', description: 'Schizophrenia Spectrum and Other Psychotic Disorder, Unspecified', shortDescription: 'Schizophrenia Spectrum Disorder', category: 'DSM-5' },
];

// Predefined problems list for typeahead functionality
const PREDEFINED_PROBLEMS: AutocompleteOption[] = [
  { value: 'Connected with Community Resources', label: 'Connected with Community Resources' },
  { value: 'Effective Social Functioning', label: 'Effective Social Functioning' },
  { value: 'Fulfill-Legal Obligations', label: 'Fulfill-Legal Obligations' },
  { value: 'Improved Physical Health', label: 'Improved Physical Health' },
  { value: 'Improvement in Marriage Relationships', label: 'Improvement in Marriage Relationships' },
  { value: 'Increased Freedom from Financial Concerns', label: 'Increased Freedom from Financial Concerns' },
  { value: 'Increased Freedom from Substances', label: 'Increased Freedom from Substances' },
  { value: 'Increased Inner Peace', label: 'Increased Inner Peace' },
  { value: 'Reduced Family Stress', label: 'Reduced Family Stress' },
  { value: 'Reduced Stress', label: 'Reduced Stress' },
  { value: 'Stable Emotional/Behavioral Functioning', label: 'Stable Emotional/Behavioral Functioning' }
];

interface AddProblemDialogProps {
  open: boolean;
  onClose: () => void;
  onAddProblem: (problem: Problem) => void;
  existingProblems: Problem[];
  editingProblem?: Problem | null;
}

const AddProblemDialog: React.FC<AddProblemDialogProps> = ({
  open,
  onClose,
  onAddProblem,
  existingProblems,
  editingProblem
}) => {
  const [formData, setFormData] = useState({
    coding: '',
    title: '',
    details: '',
    relatedTo: 'Mental Health',
    beginDate: '',
    endDate: '',
    accessPrograms: '120 of 120 selected',
    occurrence: 'Unknown or N/A',
    outcome: 'Unassigned',
    comments: '',
    provider: 'Ensoftek Admin',
    priority: 'High' as 'High' | 'Medium' | 'Low'
  });

  const [codingSearch, setCodingSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'ICD-10' | 'DSM-5'>('ALL');
  const [showCodingResults, setShowCodingResults] = useState(false);
  const [selectedCode, setSelectedCode] = useState<MedicalCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Initialize form data when editing a problem
  useEffect(() => {
    if (editingProblem) {
      setFormData({
        coding: editingProblem.coding,
        title: editingProblem.title,
        details: editingProblem.details,
        relatedTo: editingProblem.relatedTo,
        beginDate: editingProblem.beginDate,
        endDate: editingProblem.endDate,
        accessPrograms: editingProblem.accessPrograms,
        occurrence: editingProblem.occurrence,
        outcome: editingProblem.outcome,
        comments: editingProblem.comments,
        provider: editingProblem.provider,
        priority: editingProblem.priority
      });
    } else {
      // Reset form for new problem
      setFormData({
        coding: '',
        title: '',
        details: '',
        relatedTo: 'Mental Health',
        beginDate: '',
        endDate: '',
        accessPrograms: '120 of 120 selected',
        occurrence: 'Unknown or N/A',
        outcome: 'Unassigned',
        comments: '',
        provider: 'Ensoftek Admin',
        priority: 'Medium'
      });
    }
  }, [editingProblem, open]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Constants for performance optimization
  const RESULTS_PER_PAGE = 20;
  const MIN_SEARCH_LENGTH = 2;
  const DEBOUNCE_DELAY = 300;

  // Filter medical codes based on search and category with performance optimizations
  const getFilteredCodes = () => {
    let filtered = MEDICAL_CODES;
    
    // Filter by category first (most efficient)
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(code => code.category === selectedCategory);
    }
    
    // Only search if minimum length is met
    if (codingSearch.trim() && codingSearch.trim().length >= MIN_SEARCH_LENGTH) {
      const searchTerm = codingSearch.toLowerCase().trim();
      filtered = filtered.filter(code => 
        code.code.toLowerCase().includes(searchTerm) ||
        code.description.toLowerCase().includes(searchTerm) ||
        code.shortDescription.toLowerCase().includes(searchTerm)
      );
    } else if (codingSearch.trim() && codingSearch.trim().length < MIN_SEARCH_LENGTH) {
      // If search is too short, return empty to encourage longer search
      return [];
    }
    
    // Implement pagination
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const endIndex = startIndex + RESULTS_PER_PAGE;
    
    return {
      results: filtered.slice(startIndex, endIndex),
      totalResults: filtered.length,
      hasMore: filtered.length > endIndex,
      currentPage,
      totalPages: Math.ceil(filtered.length / RESULTS_PER_PAGE)
    };
  };

  // Handle coding search input with debouncing
  const handleCodingSearchChange = (value: string) => {
    setCodingSearch(value);
    setSelectedCode(null);
    setCurrentPage(1); // Reset to first page on new search
    
    // Clear existing timer
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    
    // Set loading state for better UX
    if (value.trim().length >= MIN_SEARCH_LENGTH) {
      setIsLoading(true);
    }
    
    // Debounce the search to avoid excessive filtering
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowCodingResults(value.length > 0);
    }, DEBOUNCE_DELAY);
    
    setSearchDebounceTimer(timer);
    
    // Show results immediately if clearing search
    if (value.length === 0) {
      setShowCodingResults(false);
      setIsLoading(false);
    }
  };

  // Handle code selection
  const handleCodeSelect = (code: MedicalCode) => {
    setSelectedCode(code);
    setCodingSearch(code.code);
    setFormData(prev => ({ ...prev, coding: code.code }));
    setShowCodingResults(false);
  };

  // Clear coding selection
  const clearCodingSelection = () => {
    setSelectedCode(null);
    setCodingSearch('');
    setFormData(prev => ({ ...prev, coding: '' }));
    setShowCodingResults(false);
  };

  // Handle adding the problem
  const handleAddProblem = () => {
    if (!formData.coding || !formData.title) {
      return;
    }

    const newProblem: Problem = {
      id: editingProblem?.id || Date.now().toString(),
      coding: formData.coding,
      title: formData.title,
      details: formData.details,
      relatedTo: formData.relatedTo,
      beginDate: formData.beginDate,
      endDate: formData.endDate,
      accessPrograms: formData.accessPrograms,
      occurrence: formData.occurrence,
      outcome: formData.outcome,
      comments: formData.comments,
      provider: formData.provider,
      priority: formData.priority
    };

    onAddProblem(newProblem);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Clear end date when Clear button is clicked
  const clearEndDate = () => {
    handleInputChange('endDate', '');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-hidden p-0 flex flex-col bg-gradient-to-br from-orange-50 to-blue-100">
        {/* Dialog Title */}
        <div className="px-4 py-3 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
            {editingProblem ? 'Edit Problem' : 'Add Problems'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {editingProblem 
              ? 'Update the problem information and details.'
              : 'Add a new problem to the treatment plan with detailed information and tracking.'
            }
          </p>
        </div>

        {/* Main content */}
        <div className="flex-1 min-h-0 overflow-hidden p-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Immersive Coding Search */}
            <div className="flex items-start gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0 pt-2">
                Coding:
              </label>
              <div className="flex-1 relative">
                {/* Main Input Display */}
                {selectedCode ? (
                  <div 
                    className="min-h-[40px] w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors"
                    onClick={() => setShowCodingResults(true)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-blue-600">
                          {selectedCode.code}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          selectedCode.category === 'ICD-10' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {selectedCode.category}
                        </span>
                        <span className="text-sm text-gray-700 truncate">
                          {selectedCode.shortDescription}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearCodingSelection();
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      type="text"
                      value={codingSearch}
                      onChange={(e) => handleCodingSearchChange(e.target.value)}
                      placeholder="Type to search medical codes..."
                      className="w-full pr-10"
                      onFocus={() => setShowCodingResults(true)}
                    />
                    {codingSearch && (
                      <button
                        type="button"
                        onClick={clearCodingSelection}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        title="Clear search"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {/* Immersive Dropdown Menu */}
                {showCodingResults && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                    {/* Header with Category Tabs */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-gray-600 mr-2">Categories:</span>
                        {(['ALL', 'ICD-10', 'DSM-5'] as const).map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                              selectedCategory === category
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            {category}
                            {category !== 'ALL' && (
                              <span className="ml-1 text-xs opacity-75">
                                ({MEDICAL_CODES.filter(c => c.category === category).length})
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Results List */}
                    <div className="max-h-80 overflow-y-auto">
                      {(() => {
                        const filteredData = getFilteredCodes();
                        
                        // Handle loading state
                        if (isLoading) {
                          return (
                            <div className="px-4 py-8 text-center">
                              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                              <p className="text-gray-500 text-sm">Searching codes...</p>
                            </div>
                          );
                        }
                        
                        // Handle minimum search length requirement
                        if (codingSearch.trim() && codingSearch.trim().length < MIN_SEARCH_LENGTH) {
                          return (
                            <div className="px-4 py-8 text-center">
                              <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <p className="text-gray-500 text-sm font-medium">Type at least {MIN_SEARCH_LENGTH} characters</p>
                              <p className="text-gray-400 text-xs mt-1">
                                Enter more characters to search through thousands of medical codes
                              </p>
                            </div>
                          );
                        }
                        
                        // Handle empty array case
                        if (Array.isArray(filteredData) && filteredData.length === 0) {
                          return (
                            <div className="px-4 py-8 text-center">
                              <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V3a1 1 0 00-1-1h-4a1 1 0 00-1 1v3.306" />
                              </svg>
                              <p className="text-gray-500 text-sm font-medium">No codes found</p>
                              <p className="text-gray-400 text-xs mt-1">
                                Try adjusting your search or category filter
                              </p>
                            </div>
                          );
                        }
                        
                        // Handle pagination object case
                        if (filteredData && typeof filteredData === 'object' && 'results' in filteredData) {
                          const { results, hasMore, totalResults } = filteredData;
                          
                          if (results.length === 0) {
                            return (
                              <div className="px-4 py-8 text-center">
                                <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V3a1 1 0 00-1-1h-4a1 1 0 00-1 1v3.306" />
                                </svg>
                                <p className="text-gray-500 text-sm font-medium">No codes found</p>
                                <p className="text-gray-400 text-xs mt-1">
                                  Try adjusting your search or category filter
                                </p>
                              </div>
                            );
                          }
                          
                          return (
                            <div className="py-2">
                              {results.map((code: MedicalCode, index: number) => (
                                <button
                                  key={`${code.code}-${index}`}
                                  type="button"
                                  onClick={() => handleCodeSelect(code)}
                                  className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-gray-50 last:border-b-0"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                      <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        {code.code}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                          code.category === 'ICD-10' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-purple-100 text-purple-700'
                                        }`}>
                                          {code.category}
                                        </span>
                                      </div>
                                      <p className="text-sm font-medium text-gray-900 mb-1">
                                        {code.shortDescription}
                                      </p>
                                      <p className="text-xs text-gray-600 line-clamp-2">
                                        {code.description}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                              
                              {/* Load More Button */}
                              {hasMore && (
                                <div className="px-4 py-3 border-t border-gray-100">
                                  <button
                                    type="button"
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors font-medium"
                                  >
                                    Load More ({totalResults - results.length} remaining)
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        }
                        
                        // Fallback
                        return (
                          <div className="px-4 py-8 text-center">
                            <p className="text-gray-500 text-sm">No results to display</p>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {(() => {
                          const filteredData = getFilteredCodes();
                          if (Array.isArray(filteredData)) {
                            return filteredData.length > 0 ? `Showing ${filteredData.length} codes` : 'No results found';
                          } else if (filteredData && typeof filteredData === 'object' && 'results' in filteredData) {
                            const { results, totalResults } = filteredData;
                            return results.length > 0 
                              ? `Showing ${results.length} of ${totalResults} codes` 
                              : 'No results found';
                          }
                          return 'No results found';
                        })()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowCodingResults(false)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {/* Click Outside Handler */}
                {showCodingResults && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowCodingResults(false)}
                  />
                )}
              </div>
            </div>

            {/* Title */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Title<span className="text-red-500">*</span>:
              </label>
              <div className="flex-1">
                <Autocomplete
                  options={PREDEFINED_PROBLEMS}
                  value={formData.title}
                  onChange={(value) => handleInputChange('title', value)}
                  placeholder="Select or type a problem title..."
                  className="w-full"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex items-start gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0 pt-2">
                Details<span className="text-red-500">*</span>:
              </label>
              <div className="flex-1">
                <Textarea
                  rows={4}
                  value={formData.details}
                  onChange={(e) => handleInputChange('details', e.target.value)}
                  placeholder="Enter detailed description of the problem"
                  className="resize-none"
                />
              </div>
            </div>

            {/* Related To */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Related To<span className="text-red-500">*</span>:
              </label>
              <div className="flex-1">
                <Select value={formData.relatedTo} onValueChange={(value) => handleInputChange('relatedTo', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mental Health">Mental Health</SelectItem>
                    <SelectItem value="Physical Health">Physical Health</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Educational">Educational</SelectItem>
                    <SelectItem value="Behavioral">Behavioral</SelectItem>
                    <SelectItem value="Environmental">Environmental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Begin Date */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Begin Date<span className="text-red-500">*</span>:
              </label>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  type="date"
                  value={formData.beginDate}
                  onChange={(e) => handleInputChange('beginDate', e.target.value)}
                  className="flex-1"
                />
                <CalendarIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* End Date */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                End Date:
              </label>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="flex-1"
                />
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearEndDate}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Access Programs */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Access Programs:
              </label>
              <div className="flex-1">
                <Select value={formData.accessPrograms} onValueChange={(value) => handleInputChange('accessPrograms', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="120 of 120 selected">120 of 120 selected</SelectItem>
                    <SelectItem value="All Programs">All Programs</SelectItem>
                    <SelectItem value="Selected Programs">Selected Programs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Occurrence */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Occurrence:
              </label>
              <div className="flex-1">
                <Select value={formData.occurrence} onValueChange={(value) => handleInputChange('occurrence', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unknown or N/A">Unknown or N/A</SelectItem>
                    <SelectItem value="First Occurrence">First Occurrence</SelectItem>
                    <SelectItem value="Recurring">Recurring</SelectItem>
                    <SelectItem value="Chronic">Chronic</SelectItem>
                    <SelectItem value="Acute">Acute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Outcome */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Outcome:
              </label>
              <div className="flex-1">
                <Select value={formData.outcome} onValueChange={(value) => handleInputChange('outcome', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Improving">Improving</SelectItem>
                    <SelectItem value="Stable">Stable</SelectItem>
                    <SelectItem value="Worsening">Worsening</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Comments */}
            <div className="flex items-start gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0 pt-2">
                Comments:
              </label>
              <div className="flex-1">
                <Textarea
                  rows={3}
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  placeholder="Additional comments or notes"
                  className="resize-none"
                />
              </div>
            </div>

            {/* Provider */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Provider:
              </label>
              <div className="flex-1">
                <Select value={formData.provider} onValueChange={(value) => handleInputChange('provider', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ensoftek Admin">Ensoftek Admin</SelectItem>
                    <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                    <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
                    <SelectItem value="Lisa Rodriguez, LCSW">Lisa Rodriguez, LCSW</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Priority:
              </label>
              <div className="flex-1">
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value as 'High' | 'Medium' | 'Low')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="Low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="py-2.5 px-4">
          <Button variant="ghost" onClick={handleCancel} className="px-3 h-9 font-normal border-gray-200 text-sm">
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={handleAddProblem}
            disabled={!formData.coding || !formData.title}
          >
            {editingProblem ? 'Save Changes' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProblemDialog;
