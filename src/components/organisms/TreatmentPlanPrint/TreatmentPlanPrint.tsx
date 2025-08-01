import React from 'react';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';

/**
 * TreatmentPlanPrint Component
 * 
 * A printer-friendly component that renders the complete treatment plan
 * in a professional A4 format suitable for patient documentation.
 * 
 * Features:
 * - Professional healthcare document layout
 * - A4 page format with proper margins
 * - Complete treatment plan data display
 * - Signature sections with actual signature images
 * - Print-optimized styling (no colors, proper fonts)
 * - Page breaks for multi-page content
 * - Header and footer on each page
 */

interface TreatmentPlanPrintProps {
  formData: TreatmentPlanFormData;
  patientInfo?: {
    name: string;
    dob: string;
    mrn: string;
    address?: string;
    phone?: string;
  };
  facilityInfo?: {
    name: string;
    address: string;
    phone: string;
    logo?: string;
  };
}

const TreatmentPlanPrint: React.FC<TreatmentPlanPrintProps> = ({
  formData,
  patientInfo,
  facilityInfo
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="print-container">
      {/* Print-specific styles */}
      <style>{`
        @media print {
          .print-container {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.4;
            color: black;
            background: white;
            margin: 0;
            padding: 0;
          }
          
          .page {
            width: 8.5in;
            min-height: 11in;
            margin: 0.5in;
            padding: 0;
            page-break-after: auto;
            background: white;
          }
          
          .page-header {
            border-bottom: 2px solid black;
            padding-bottom: 10pt;
            margin-bottom: 20pt;
          }
          
          .section {
            margin-bottom: 20pt;
            page-break-inside: avoid;
          }
          
          .section-title {
            font-size: 14pt;
            font-weight: bold;
            border-bottom: 1px solid black;
            padding-bottom: 5pt;
            margin-bottom: 10pt;
          }
          
          .subsection-title {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 8pt;
            margin-top: 15pt;
          }
          
          .field-row {
            display: flex;
            margin-bottom: 8pt;
          }
          
          .field-label {
            font-weight: bold;
            width: 150pt;
            flex-shrink: 0;
          }
          
          .field-value {
            flex: 1;
          }
          
          .checkbox-item {
            margin-bottom: 5pt;
          }
          
          .signature-section {
            border: 1px solid black;
            padding: 15pt;
            margin: 15pt 0;
            page-break-inside: avoid;
          }
          
          .signature-image {
            max-width: 200pt;
            max-height: 60pt;
            border: 1px solid #ccc;
            margin: 5pt 0;
          }
          
          .page-footer {
            position: fixed;
            bottom: 0.5in;
            left: 0.5in;
            right: 0.5in;
            text-align: center;
            font-size: 10pt;
            border-top: 1px solid black;
            padding-top: 5pt;
          }
          
          .no-print {
            display: none !important;
          }
        }
        
        /* Screen styles for preview */
        @media screen {
          .print-container {
            max-width: 8.5in;
            margin: 20px auto;
            padding: 20px;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.4;
          }
          
          .page {
            width: 100%;
            min-height: 11in;
            background: white;
          }
          
          .page-header {
            border-bottom: 2px solid black;
            padding-bottom: 10pt;
            margin-bottom: 20pt;
          }
          
          .section {
            margin-bottom: 20pt;
          }
          
          .section-title {
            font-size: 14pt;
            font-weight: bold;
            border-bottom: 1px solid black;
            padding-bottom: 5pt;
            margin-bottom: 10pt;
          }
          
          .subsection-title {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 8pt;
            margin-top: 15pt;
          }
          
          .field-row {
            display: flex;
            margin-bottom: 8pt;
          }
          
          .field-label {
            font-weight: bold;
            width: 150pt;
            flex-shrink: 0;
          }
          
          .field-value {
            flex: 1;
          }
          
          .checkbox-item {
            margin-bottom: 5pt;
          }
          
          .signature-section {
            border: 1px solid black;
            padding: 15pt;
            margin: 15pt 0;
          }
          
          .signature-image {
            max-width: 200pt;
            max-height: 60pt;
            border: 1px solid #ccc;
            margin: 5pt 0;
          }
        }
      `}</style>

      <div className="page">
        {/* Page Header */}
        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {facilityInfo?.logo && (
                <img src={facilityInfo.logo} alt="Facility Logo" style={{ height: '40pt', marginBottom: '10pt' }} />
              )}
              <div style={{ fontSize: '16pt', fontWeight: 'bold' }}>
                {facilityInfo?.name || 'Healthcare Facility'}
              </div>
              {facilityInfo?.address && (
                <div style={{ fontSize: '10pt', marginTop: '5pt' }}>
                  {facilityInfo.address}
                </div>
              )}
              {facilityInfo?.phone && (
                <div style={{ fontSize: '10pt' }}>
                  Phone: {facilityInfo.phone}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18pt', fontWeight: 'bold' }}>TREATMENT PLAN</div>
              <div style={{ fontSize: '10pt', marginTop: '5pt' }}>
                Generated: {formatDateTime(new Date().toISOString())}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Information Section */}
        <div className="section">
          <div className="section-title">PATIENT INFORMATION</div>
          <div className="field-row">
            <div className="field-label">Patient Name:</div>
            <div className="field-value">{formData.patientName || patientInfo?.name || 'Not specified'}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Lived Name:</div>
            <div className="field-value">{formData.patientLivedName || 'Not specified'}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Pronouns:</div>
            <div className="field-value">{formData.patientPronouns || 'Not specified'}</div>
          </div>
          {patientInfo?.dob && (
            <div className="field-row">
              <div className="field-label">Date of Birth:</div>
              <div className="field-value">{formatDate(patientInfo.dob)}</div>
            </div>
          )}
          {patientInfo?.mrn && (
            <div className="field-row">
              <div className="field-label">Medical Record #:</div>
              <div className="field-value">{patientInfo.mrn}</div>
            </div>
          )}
          <div className="field-row">
            <div className="field-label">Patient ID:</div>
            <div className="field-value">{formData.patientId || 'Not specified'}</div>
          </div>
        </div>

        {/* Plan Details Section */}
        <div className="section">
          <div className="section-title">PLAN DETAILS</div>
          <div className="field-row">
            <div className="field-label">Plan Name:</div>
            <div className="field-value">{formData.planName || 'Not specified'}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Plan Type:</div>
            <div className="field-value">{formData.planType || 'Not specified'}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Start Date:</div>
            <div className="field-value">{formatDate(formData.startDate)}</div>
          </div>
          <div className="field-row">
            <div className="field-label">End Date:</div>
            <div className="field-value">{formatDate(formData.endDate)}</div>
          </div>
          {formData.planType === 'Review' && formData.dateLastReviewed && (
            <div className="field-row">
              <div className="field-label">Date Last Reviewed:</div>
              <div className="field-value">{formatDate(formData.dateLastReviewed)}</div>
            </div>
          )}
        </div>

        {/* Diagnoses & Facilities Section */}
        <div className="section">
          <div className="section-title">DIAGNOSES & FACILITIES</div>
          
          <div className="subsection-title">Active Diagnoses</div>
          {formData.activeDiagnoses && formData.activeDiagnoses.length > 0 ? (
            formData.activeDiagnoses.map((diagnosis, index) => (
              <div key={index} className="checkbox-item">• {diagnosis}</div>
            ))
          ) : (
            <div>No active diagnoses specified</div>
          )}

          <div className="subsection-title">Selected Facilities</div>
          {formData.selectedFacilities && formData.selectedFacilities.length > 0 ? (
            formData.selectedFacilities.map((facility, index) => (
              <div key={index} className="checkbox-item">• {facility}</div>
            ))
          ) : (
            <div>No facilities selected</div>
          )}

          <div className="subsection-title">Selected Programs</div>
          {formData.selectedPrograms && formData.selectedPrograms.length > 0 ? (
            formData.selectedPrograms.map((program, index) => (
              <div key={index} className="checkbox-item">• {program}</div>
            ))
          ) : (
            <div>No programs selected</div>
          )}
        </div>

        {/* Recovery Goal Section */}
        {formData.recoveryGoal && (
          <div className="section">
            <div className="section-title">RECOVERY GOAL</div>
            <div>{formData.recoveryGoal}</div>
          </div>
        )}

        {/* Conditions Section */}
        {formData.conditions && formData.conditions.length > 0 && (
          <div className="section">
            <div className="section-title">CONDITIONS</div>
            {formData.conditions.map((condition, index) => (
              <div key={condition.id} style={{ marginBottom: '15pt' }}>
                <div className="subsection-title">Condition {index + 1}</div>
                <div className="field-row">
                  <div className="field-label">Code:</div>
                  <div className="field-value">{condition.code}</div>
                </div>
                <div className="field-row">
                  <div className="field-label">Description:</div>
                  <div className="field-value">{condition.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Problems Section */}
        {formData.problems && formData.problems.length > 0 && (
          <div className="section">
            <div className="section-title">PROBLEMS & OBJECTIVES</div>
            {formData.problems.map((problem, index) => (
              <div key={problem.id} style={{ marginBottom: '20pt', border: '1px solid #ccc', padding: '10pt' }}>
                <div className="subsection-title">Problem {index + 1}: {problem.title}</div>
                <div className="field-row">
                  <div className="field-label">Coding:</div>
                  <div className="field-value">{problem.coding}</div>
                </div>
                <div className="field-row">
                  <div className="field-label">Details:</div>
                  <div className="field-value">{problem.details}</div>
                </div>
                <div className="field-row">
                  <div className="field-label">Related To:</div>
                  <div className="field-value">{problem.relatedTo}</div>
                </div>
                <div className="field-row">
                  <div className="field-label">Begin Date:</div>
                  <div className="field-value">{formatDate(problem.beginDate)}</div>
                </div>
                <div className="field-row">
                  <div className="field-label">End Date:</div>
                  <div className="field-value">{formatDate(problem.endDate)}</div>
                </div>
                <div className="field-row">
                  <div className="field-label">Access Programs:</div>
                  <div className="field-value">{problem.accessPrograms}</div>
                </div>
                <div className="field-row">
                  <div className="field-label">Occurrence:</div>
                  <div className="field-value">{problem.occurrence}</div>
                </div>
                <div className="field-row">
                  <div className="field-label">Outcome:</div>
                  <div className="field-value">{problem.outcome}</div>
                </div>
                <div className="field-row">
                  <div className="field-label">Provider:</div>
                  <div className="field-value">{problem.provider}</div>
                </div>
                <div className="field-row">
                  <div className="field-label">Priority:</div>
                  <div className="field-value">{problem.priority}</div>
                </div>
                {problem.comments && (
                  <div className="field-row">
                    <div className="field-label">Comments:</div>
                    <div className="field-value">{problem.comments}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Strengths Section */}
        {formData.strengths && formData.strengths.length > 0 && (
          <div className="section">
            <div className="section-title">STRENGTHS</div>
            {formData.strengths.map((strength) => (
              <div key={strength.id} style={{ marginBottom: '10pt' }}>
                <div className="field-row">
                  <div className="field-label">{strength.title}:</div>
                  <div className="field-value">{strength.description} (Category: {strength.category})</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Weaknesses Section */}
        {formData.weaknesses && formData.weaknesses.length > 0 && (
          <div className="section">
            <div className="section-title">WEAKNESSES</div>
            {formData.weaknesses.map((weakness) => (
              <div key={weakness.id} style={{ marginBottom: '10pt' }}>
                <div className="field-row">
                  <div className="field-label">{weakness.title}:</div>
                  <div className="field-value">
                    {weakness.description} (Category: {weakness.category}, Impact: {weakness.impactLevel})
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Plan Notes Section */}
        {formData.planNotes && (
          <div className="section">
            <div className="section-title">PLAN NOTES</div>
            <div>{formData.planNotes}</div>
          </div>
        )}

        {/* Discharge Planning Section */}
        <div className="section">
          <div className="section-title">DISCHARGE PLANNING</div>
          
          <div className="subsection-title">Initial Discharge Plan</div>
          {formData.initialDischargePlan && formData.initialDischargePlan.length > 0 ? (
            formData.initialDischargePlan.map((plan, index) => (
              <div key={index} className="checkbox-item">• {plan}</div>
            ))
          ) : (
            <div>No discharge plan specified</div>
          )}
          
          {formData.customDischargePlan && (
            <div style={{ marginTop: '10pt' }}>
              <div className="field-label">Custom Discharge Plan:</div>
              <div>{formData.customDischargePlan}</div>
            </div>
          )}

          <div className="subsection-title">Initial Discharge Criteria</div>
          {formData.initialDischargeCriteria && formData.initialDischargeCriteria.length > 0 ? (
            formData.initialDischargeCriteria.map((criteria, index) => (
              <div key={index} className="checkbox-item">• {criteria}</div>
            ))
          ) : (
            <div>No discharge criteria specified</div>
          )}
          
          {formData.customDischargeCriteria && (
            <div style={{ marginTop: '10pt' }}>
              <div className="field-label">Custom Discharge Criteria:</div>
              <div>{formData.customDischargeCriteria}</div>
            </div>
          )}

          {formData.otherNotableItems && (
            <div style={{ marginTop: '15pt' }}>
              <div className="subsection-title">Other Notable Items</div>
              <div>{formData.otherNotableItems}</div>
            </div>
          )}
        </div>

        {/* Patient Agreements Section */}
        {formData.patientAgreements && (
          <div className="section">
            <div className="section-title">PATIENT AGREEMENTS</div>
            <div className="checkbox-item">
              {formData.patientAgreements.adhereToRecommendations ? '☑' : '☐'} I agree to adhere to the recommendations and conditions outlined in this plan.
            </div>
            <div className="checkbox-item">
              {formData.patientAgreements.agreeWithServicesTypes ? '☑' : '☐'} Yes, I am agreement with the types and levels of services included in the plan.
            </div>
            <div className="checkbox-item">
              {formData.patientAgreements.receivedCopyOfPlan ? '☑' : '☐'} Yes, I have received a copy of this plan.
            </div>
            <div className="checkbox-item">
              {formData.patientAgreements.textForAgreement ? '☑' : '☐'} Text for Agreement.
            </div>
          </div>
        )}

        {/* Plan Agreements Section */}
        {formData.planAgreements && (
          <div className="section">
            <div className="section-title">PLAN AGREEMENTS</div>
            <div className="checkbox-item">
              {formData.planAgreements.agreeToFollowPlan ? '☑' : '☐'} I agree to follow this plan.
            </div>
          </div>
        )}

        {/* Signatures Section */}
        <div className="section">
          <div className="section-title">SIGNATURES</div>
          
          {/* Patient/Guardian Signature */}
          {formData.signatures?.personSignature && (
            <div className="signature-section">
              <div className="subsection-title">Patient/Guardian Signature</div>
              <div className="field-row">
                <div className="field-label">Status:</div>
                <div className="field-value">
                  {formData.signatures.personSignature.signed ? 'Signed' : 'Pending'}
                </div>
              </div>
              {formData.signatures.personSignature.signed && (
                <>
                  <div className="field-row">
                    <div className="field-label">Signed By:</div>
                    <div className="field-value">{formData.signatures.personSignature.signedBy}</div>
                  </div>
                  <div className="field-row">
                    <div className="field-label">Signed Date:</div>
                    <div className="field-value">{formatDateTime(formData.signatures.personSignature.signedDate)}</div>
                  </div>
                  {formData.signatures.personSignature.signatureData && (
                    <div style={{ marginTop: '10pt' }}>
                      <div className="field-label">Signature:</div>
                      <img 
                        src={formData.signatures.personSignature.signatureData} 
                        alt="Patient/Guardian Signature" 
                        className="signature-image"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Care Team Signatures */}
          {formData.signatures?.careTeamSignatures && formData.signatures.careTeamSignatures.length > 0 && (
            <div className="signature-section">
              <div className="subsection-title">Care Team Signatures</div>
              {formData.signatures.careTeamSignatures.map((signature) => (
                <div key={signature.id} style={{ marginBottom: '15pt' }}>
                  <div className="field-row">
                    <div className="field-label">Provider:</div>
                    <div className="field-value">{signature.providerName} ({signature.title})</div>
                  </div>
                  <div className="field-row">
                    <div className="field-label">Status:</div>
                    <div className="field-value">
                      {signature.signed ? `Signed on ${formatDateTime(signature.signedDate)}` : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="page-footer">
          <div>
            Treatment Plan - Page 1 of 1 | Generated: {formatDateTime(new Date().toISOString())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanPrint;
