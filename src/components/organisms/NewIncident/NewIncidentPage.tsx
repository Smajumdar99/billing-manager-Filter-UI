import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/atoms/Input/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select'
import { Textarea } from '@/components/atoms/Textarea/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup/radio-group'
import { Label } from '@/components/atoms/Label/label'
import { Button } from '@/components/atoms/Button/button'


/**
 * BodyDiagramAnnotation Component
 * 
 * Interactive body diagram for marking injury locations with drawing tools
 */
interface BodyDiagramProps {
  annotations: string
  onChange: (annotations: string) => void
}

const BodyDiagramAnnotation: React.FC<BodyDiagramProps> = ({ annotations, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(3)
  const [brushColor, setBrushColor] = useState('#ff0000')
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')

  // Initialize canvas with body diagram
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size for both front and back views
    canvas.width = 800
    canvas.height = 600

    // Draw modern body diagrams
    drawModernBodyDiagrams(ctx)

    // Load existing annotations if any
    if (annotations && annotations !== '') {
      try {
        // If it's a base64 image, restore it
        if (annotations.startsWith('data:image')) {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
          }
          img.src = annotations
        }
      } catch (e) {
        console.warn('Failed to restore annotations:', e)
      }
    }
  }, [])

  const drawModernBodyDiagrams = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas with subtle background
    ctx.clearRect(0, 0, 800, 600)
    
    // Create subtle background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 600)
    bgGradient.addColorStop(0, '#fafbfc')
    bgGradient.addColorStop(1, '#f1f5f9')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, 800, 600)
    
    // Draw front and back views with modern styling
    drawModernFrontView(ctx, 120, 50)
    drawModernBackView(ctx, 520, 50)
    
    // Add modern titles with shadow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
    ctx.shadowBlur = 2
    ctx.shadowOffsetY = 1
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('FRONT VIEW', 200, 30)
    ctx.fillText('BACK VIEW', 600, 30)
    
    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0
    
    // Add elegant dividing line with gradient
    const lineGradient = ctx.createLinearGradient(400, 0, 400, 600)
    lineGradient.addColorStop(0, 'rgba(203, 213, 225, 0.3)')
    lineGradient.addColorStop(0.5, 'rgba(203, 213, 225, 0.8)')
    lineGradient.addColorStop(1, 'rgba(203, 213, 225, 0.3)')
    ctx.strokeStyle = lineGradient
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(400, 0)
    ctx.lineTo(400, 600)
    ctx.stroke()
  }

  const drawModernFrontView = (ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) => {
    // Create body gradient for depth
    const bodyGradient = ctx.createRadialGradient(
      offsetX + 80, offsetY + 200, 20,
      offsetX + 80, offsetY + 200, 120
    )
    bodyGradient.addColorStop(0, '#ffffff')
    bodyGradient.addColorStop(0.7, '#f8fafc')
    bodyGradient.addColorStop(1, '#e2e8f0')
    
    // Set modern styling
    ctx.fillStyle = bodyGradient
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    // Add subtle shadow for all body parts
    ctx.shadowColor = 'rgba(59, 130, 246, 0.15)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    // Head - more realistic oval shape
    ctx.beginPath()
    ctx.ellipse(offsetX + 80, offsetY + 50, 38, 48, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Neck - smoother connection
    ctx.beginPath()
    ctx.roundRect(offsetX + 68, offsetY + 95, 24, 28, 8)
    ctx.fill()
    ctx.stroke()
    
    // Torso - anatomically shaped with curves
    ctx.beginPath()
    ctx.moveTo(offsetX + 45, offsetY + 120)
    ctx.quadraticCurveTo(offsetX + 35, offsetY + 140, offsetX + 38, offsetY + 180)
    ctx.lineTo(offsetX + 42, offsetY + 235)
    ctx.quadraticCurveTo(offsetX + 45, offsetY + 245, offsetX + 55, offsetY + 245)
    ctx.lineTo(offsetX + 105, offsetY + 245)
    ctx.quadraticCurveTo(offsetX + 115, offsetY + 245, offsetX + 118, offsetY + 235)
    ctx.lineTo(offsetX + 122, offsetY + 180)
    ctx.quadraticCurveTo(offsetX + 125, offsetY + 140, offsetX + 115, offsetY + 120)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Left Arm (upper) - more natural curve
    ctx.beginPath()
    ctx.ellipse(offsetX + 18, offsetY + 155, 16, 42, -0.4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Left Arm (lower) - tapered forearm
    ctx.beginPath()
    ctx.ellipse(offsetX + 8, offsetY + 215, 13, 38, -0.3, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Right Arm (upper)
    ctx.beginPath()
    ctx.ellipse(offsetX + 142, offsetY + 155, 16, 42, 0.4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Right Arm (lower)
    ctx.beginPath()
    ctx.ellipse(offsetX + 152, offsetY + 215, 13, 38, 0.3, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Left Leg (thigh) - more muscular shape
    ctx.beginPath()
    ctx.ellipse(offsetX + 62, offsetY + 285, 20, 52, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Left Leg (calf) - tapered lower leg
    ctx.beginPath()
    ctx.ellipse(offsetX + 62, offsetY + 355, 16, 48, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Right Leg (thigh)
    ctx.beginPath()
    ctx.ellipse(offsetX + 98, offsetY + 285, 20, 52, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Right Leg (calf)
    ctx.beginPath()
    ctx.ellipse(offsetX + 98, offsetY + 355, 16, 48, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Reset shadow for labels
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    // Modern labels with better typography
    ctx.fillStyle = '#475569'
    ctx.font = '12px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Head', offsetX + 80, offsetY + 55)
    ctx.fillText('Chest', offsetX + 80, offsetY + 160)
    ctx.fillText('Abdomen', offsetX + 80, offsetY + 210)
    ctx.fillText('L.Arm', offsetX + 15, offsetY + 160)
    ctx.fillText('R.Arm', offsetX + 145, offsetY + 160)
    ctx.fillText('L.Leg', offsetX + 62, offsetY + 330)
    ctx.fillText('R.Leg', offsetX + 98, offsetY + 330)
  }

  const drawModernBackView = (ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) => {
    // Create body gradient for depth (back view)
    const bodyGradient = ctx.createRadialGradient(
      offsetX + 80, offsetY + 200, 20,
      offsetX + 80, offsetY + 200, 120
    )
    bodyGradient.addColorStop(0, '#ffffff')
    bodyGradient.addColorStop(0.7, '#f8fafc')
    bodyGradient.addColorStop(1, '#e2e8f0')
    
    // Set modern styling
    ctx.fillStyle = bodyGradient
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    // Add subtle shadow
    ctx.shadowColor = 'rgba(59, 130, 246, 0.15)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    // Head (back) - same as front
    ctx.beginPath()
    ctx.ellipse(offsetX + 80, offsetY + 50, 38, 48, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Neck
    ctx.beginPath()
    ctx.roundRect(offsetX + 68, offsetY + 95, 24, 28, 8)
    ctx.fill()
    ctx.stroke()
    
    // Back Torso - broader shoulders, tapered waist
    ctx.beginPath()
    ctx.moveTo(offsetX + 42, offsetY + 120)
    ctx.quadraticCurveTo(offsetX + 32, offsetY + 140, offsetX + 35, offsetY + 180)
    ctx.lineTo(offsetX + 40, offsetY + 235)
    ctx.quadraticCurveTo(offsetX + 43, offsetY + 245, offsetX + 55, offsetY + 245)
    ctx.lineTo(offsetX + 105, offsetY + 245)
    ctx.quadraticCurveTo(offsetX + 117, offsetY + 245, offsetX + 120, offsetY + 235)
    ctx.lineTo(offsetX + 125, offsetY + 180)
    ctx.quadraticCurveTo(offsetX + 128, offsetY + 140, offsetX + 118, offsetY + 120)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Enhanced spine line with gradient
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    const spineGradient = ctx.createLinearGradient(offsetX + 80, offsetY + 120, offsetX + 80, offsetY + 240)
    spineGradient.addColorStop(0, '#6366f1')
    spineGradient.addColorStop(0.5, '#8b5cf6')
    spineGradient.addColorStop(1, '#a855f7')
    ctx.strokeStyle = spineGradient
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(offsetX + 80, offsetY + 125)
    ctx.lineTo(offsetX + 80, offsetY + 240)
    ctx.stroke()
    
    // Add vertebrae dots for detail
    ctx.fillStyle = '#6366f1'
    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      ctx.arc(offsetX + 80, offsetY + 130 + (i * 14), 2, 0, 2 * Math.PI)
      ctx.fill()
    }
    
    // Reset styling for limbs
    ctx.fillStyle = bodyGradient
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2.5
    ctx.shadowColor = 'rgba(59, 130, 246, 0.15)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    // Left Arm (upper) - back view positioning
    ctx.beginPath()
    ctx.ellipse(offsetX + 18, offsetY + 155, 16, 42, -0.4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Left Arm (lower)
    ctx.beginPath()
    ctx.ellipse(offsetX + 8, offsetY + 215, 13, 38, -0.3, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Right Arm (upper)
    ctx.beginPath()
    ctx.ellipse(offsetX + 142, offsetY + 155, 16, 42, 0.4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Right Arm (lower)
    ctx.beginPath()
    ctx.ellipse(offsetX + 152, offsetY + 215, 13, 38, 0.3, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Left Leg (thigh) - back view
    ctx.beginPath()
    ctx.ellipse(offsetX + 62, offsetY + 285, 20, 52, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Left Leg (calf)
    ctx.beginPath()
    ctx.ellipse(offsetX + 62, offsetY + 355, 16, 48, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Right Leg (thigh)
    ctx.beginPath()
    ctx.ellipse(offsetX + 98, offsetY + 285, 20, 52, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Right Leg (calf)
    ctx.beginPath()
    ctx.ellipse(offsetX + 98, offsetY + 355, 16, 48, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Reset shadow for labels
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    // Modern labels
    ctx.fillStyle = '#475569'
    ctx.font = '12px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Head', offsetX + 80, offsetY + 55)
    ctx.fillText('Upper Back', offsetX + 80, offsetY + 160)
    ctx.fillText('Lower Back', offsetX + 80, offsetY + 210)
    ctx.fillText('L.Arm', offsetX + 15, offsetY + 160)
    ctx.fillText('R.Arm', offsetX + 145, offsetY + 160)
    ctx.fillText('L.Leg', offsetX + 62, offsetY + 330)
    ctx.fillText('R.Leg', offsetX + 98, offsetY + 330)
  }



  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = tool === 'eraser' ? '#f8f9fa' : brushColor
    ctx.lineWidth = brushSize
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    // Save current canvas state as annotations
    const canvas = canvasRef.current
    if (!canvas) return

    const dataURL = canvas.toDataURL()
    onChange(dataURL)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawModernBodyDiagrams(ctx)
    onChange('')
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Body Diagram - Mark Injury Locations:
        </Label>
        
        {/* Drawing Tools */}
        <div className="flex flex-wrap gap-2 mb-3 p-2 bg-white rounded border">
          <div className="flex items-center gap-2">
            <Label className="text-xs font-medium">Tool:</Label>
            <Button
              type="button"
              onClick={() => setTool('pen')}
              variant={tool === 'pen' ? 'default' : 'secondary'}
              size="sm"
            >
              Pen
            </Button>
            <Button
              type="button"
              onClick={() => setTool('eraser')}
              variant={tool === 'eraser' ? 'default' : 'secondary'}
              size="sm"
            >
              Eraser
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="text-xs font-medium">Size:</Label>
            <input
              type="range"
              min="1"
              max="10"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-16"
            />
            <span className="text-xs">{brushSize}px</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="text-xs font-medium">Color:</Label>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-8 h-6 rounded border"
            />
          </div>
          
          <Button
            type="button"
            onClick={clearCanvas}
            variant="destructive"
            size="sm"
          >
            Clear
          </Button>
        </div>
        
        {/* Canvas */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="border border-gray-300 rounded cursor-crosshair bg-white"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Click and drag to mark injury locations on the body diagram. Use different colors to indicate different types of injuries.
        </p>
      </div>
    </div>
  )
}

/**
 * NewIncidentPage Component
 * 
 * Incident reporting form based on the original form structure from 20 years ago.
 * Maintains all the original fields and sections for comprehensive incident documentation.
 */

interface IncidentFormData {
  // Basic Information (Image 1)
  programName: string
  subjectName: string
  address: string
  dateTime: string
  gender: string
  mrNumber: string
  roomNumber: string
  injury: 'Yes' | 'No'
  floor: string
  comment: string
  
  // Staff Information (Image 1)
  attendingMD: string
  discoveredReportedBy: string
  personsInvolvedNotSubject: string
  incident: string
  location: string
  building: string
  locationComment: string
  equipmentRelated: 'Yes' | 'No'
  residentComment: string
  
  // Notifications (Image 2)
  responsiblePartyNotified: 'Yes' | 'No'
  responsiblePartyDateTime: string
  responsiblePartyName: string
  leftMessage: string
  mdNotified: 'Yes' | 'No'
  supervisorNotified: 'Yes' | 'No'
  
  // Restraints and Monitoring (Image 3)
  restraints: 'Yes' | 'No'
  restraintType: string
  monitoringProgram: 'Yes' | 'No'
  toiletTraining: 'Yes' | 'No'
  fallAlarms: 'Yes' | 'No'
  weightLoss: 'Yes' | 'No'
  painMeds: 'Yes' | 'No'
  lastMealTime: string
  lastToiletedTime: string
  lastPainMedsTime: string
  medications: string
  
  // Incident Details (Image 4)
  situation: string
  background: string
  assessment: string
  requestRecommendation: string
  personsAssigned: string
  treatment: string
  currentPT: string
  transport: string
  actionTaken: string
  followUpDate: string
  finalComment: string
  
  // Body Diagram Annotations
  bodyDiagramAnnotations: string // JSON string of annotation data
  
  // Staff Verification (Image 5)
  staffSignature: 'Yes' | 'No'
  staffSignatureDate: string
  
  // Reviews (Image 6)
  directorOfNursingComment: string
  directorOfNursingSignature: string
  directorOfNursingDate: string
  administratorComment: string
  administratorSignature: string
  administratorDate: string
  medicalOfficerComment: string
  medicalOfficerSignature: string
  medicalOfficerDate: string
  medicalDirectorComment: string
  medicalDirectorSignature: string
  medicalDirectorDate: string
}

interface NewIncidentPageProps {
  onClose?: () => void;
}

const NewIncidentPage: React.FC<NewIncidentPageProps> = ({ onClose }) => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState<IncidentFormData>({
    // Basic Information (Image 1)
    programName: '',
    subjectName: '',
    address: '',
    dateTime: '',
    gender: '',
    mrNumber: '',
    roomNumber: '',
    injury: 'No',
    floor: '',
    comment: '',
    
    // Staff Information (Image 1)
    attendingMD: '',
    discoveredReportedBy: '',
    personsInvolvedNotSubject: '',
    incident: '',
    location: '',
    building: '',
    locationComment: '',
    equipmentRelated: 'No',
    residentComment: '',
    
    // Notifications
    responsiblePartyNotified: 'No',
    responsiblePartyDateTime: '',
    responsiblePartyName: '',
    leftMessage: '',
    mdNotified: 'No',
    supervisorNotified: 'No',
    
    // Restraints and Monitoring
    restraints: 'No',
    restraintType: '',
    monitoringProgram: 'No',
    toiletTraining: 'No',
    fallAlarms: 'No',
    weightLoss: 'No',
    painMeds: 'No',
    lastMealTime: '',
    lastToiletedTime: '',
    lastPainMedsTime: '',
    medications: '',
    
    // Incident Details
    situation: '',
    background: '',
    assessment: '',
    requestRecommendation: '',
    personsAssigned: '',
    treatment: '',
    currentPT: '',
    transport: '',
    actionTaken: '',
    followUpDate: '',
    finalComment: '',
    
    // Body Diagram Annotations
    bodyDiagramAnnotations: '',
    
    // Staff Verification
    staffSignature: 'No',
    staffSignatureDate: '',
    
    // Reviews
    directorOfNursingComment: '',
    directorOfNursingSignature: '',
    directorOfNursingDate: '',
    administratorComment: '',
    administratorSignature: '',
    administratorDate: '',
    medicalOfficerComment: '',
    medicalOfficerSignature: '',
    medicalOfficerDate: '',
    medicalDirectorComment: '',
    medicalDirectorSignature: '',
    medicalDirectorDate: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof IncidentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      console.log('Submitting incident report:', formData)
      
      // Here you would typically send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Incident report submitted successfully!')
      
      // Navigate back to incidents or call onClose
      if (onClose) {
        onClose()
      } else {
        navigate('/incidents')
      }
      
    } catch (error) {
      console.error('Error submitting incident report:', error)
      alert('Error submitting incident report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (onClose) {
      onClose()
    } else {
      navigate('/incidents')
    }
  }

  return (
    <div className="min-h-full bg-gray-50 p-6 pt-0 pb-24">
      <div className="w-full max-w-6xl mx-auto">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section - Image 1 */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">

            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name:
                </Label>
                <Input
                  type="text"
                  value={formData.programName}
                  onChange={(e) => handleInputChange('programName', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Date and Time:
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => handleInputChange('dateTime', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender:
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  MR #:
                </Label>
                <Input
                  type="text"
                  value={formData.mrNumber}
                  onChange={(e) => handleInputChange('mrNumber', e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name:
                </Label>
                <Input
                  type="text"
                  value={formData.subjectName}
                  onChange={(e) => handleInputChange('subjectName', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Room #:
                </Label>
                <Input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Injury:
                </Label>
                <RadioGroup value={formData.injury} onValueChange={(value) => handleInputChange('injury', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="injury-yes" />
                    <Label htmlFor="injury-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="injury-no" />
                    <Label htmlFor="injury-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor:
                </Label>
                <Select value={formData.floor} onValueChange={(value) => handleInputChange('floor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Floor">1st Floor</SelectItem>
                    <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                    <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                    <SelectItem value="4th Floor">4th Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Address:
                </Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment:
                </Label>
                <Textarea
                  value={formData.comment}
                  onChange={(e) => handleInputChange('comment', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          {/* Staff Information Section - Image 1 */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">

            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Attending MD:
                </Label>
                <Select value={formData.attendingMD} onValueChange={(value) => handleInputChange('attendingMD', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                    <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Incident:
                </Label>
                <Select value={formData.incident} onValueChange={(value) => handleInputChange('incident', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fall">Fall</SelectItem>
                    <SelectItem value="Medication Error">Medication Error</SelectItem>
                    <SelectItem value="Equipment Failure">Equipment Failure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Location:
                </Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select Location --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Patient Room">Patient Room</SelectItem>
                    <SelectItem value="Hallway">Hallway</SelectItem>
                    <SelectItem value="Bathroom">Bathroom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Building:
                </Label>
                <Select value={formData.building} onValueChange={(value) => handleInputChange('building', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Building">Main Building</SelectItem>
                    <SelectItem value="East Wing">East Wing</SelectItem>
                    <SelectItem value="West Wing">West Wing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Discovered/Reported By:
                </Label>
                <Select value={formData.discoveredReportedBy} onValueChange={(value) => handleInputChange('discoveredReportedBy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="EnsofTek Admin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nurse">Nurse</SelectItem>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Persons Involved (Not Subject):
                </Label>
                <Input
                  type="text"
                  value={formData.personsInvolvedNotSubject}
                  onChange={(e) => handleInputChange('personsInvolvedNotSubject', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Related:
                </Label>
                <RadioGroup value={formData.equipmentRelated} onValueChange={(value) => handleInputChange('equipmentRelated', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="equipment-yes" />
                    <Label htmlFor="equipment-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="equipment-no" />
                    <Label htmlFor="equipment-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Comment:
                </Label>
                <Textarea
                  value={formData.locationComment}
                  onChange={(e) => handleInputChange('locationComment', e.target.value)}
                  rows={2}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Resident Comment:
                </Label>
                <Textarea
                  value={formData.residentComment}
                  onChange={(e) => handleInputChange('residentComment', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Notifications Section - Image 2 */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">

            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsible Party Notified:
                </Label>
                <RadioGroup value={formData.responsiblePartyNotified} onValueChange={(value) => handleInputChange('responsiblePartyNotified', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="responsible-party-yes" />
                    <Label htmlFor="responsible-party-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="responsible-party-no" />
                    <Label htmlFor="responsible-party-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Date and Time:
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.responsiblePartyDateTime}
                  onChange={(e) => handleInputChange('responsiblePartyDateTime', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Name:
                </Label>
                <Input
                  type="text"
                  value={formData.responsiblePartyName}
                  onChange={(e) => handleInputChange('responsiblePartyName', e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                LEFT MESSAGE:
              </Label>
              <Input
                type="text"
                value={formData.leftMessage}
                onChange={(e) => handleInputChange('leftMessage', e.target.value)}
              />
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  MD Notified:
                </Label>
                <RadioGroup value={formData.mdNotified} onValueChange={(value) => handleInputChange('mdNotified', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="md-notified-yes" />
                    <Label htmlFor="md-notified-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="md-notified-no" />
                    <Label htmlFor="md-notified-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Supervisor Notified:
                </Label>
                <RadioGroup value={formData.supervisorNotified} onValueChange={(value) => handleInputChange('supervisorNotified', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="supervisor-notified-yes" />
                    <Label htmlFor="supervisor-notified-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="supervisor-notified-no" />
                    <Label htmlFor="supervisor-notified-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Restraints and Monitoring Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Restraints:
                </Label>
                <RadioGroup value={formData.restraints} onValueChange={(value) => handleInputChange('restraints', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="restraints-yes" />
                    <Label htmlFor="restraints-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="restraints-no" />
                    <Label htmlFor="restraints-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Type:
                </Label>
                <Input
                  type="text"
                  value={formData.restraintType}
                  onChange={(e) => handleInputChange('restraintType', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Monitoring Program:
                </Label>
                <RadioGroup value={formData.monitoringProgram} onValueChange={(value) => handleInputChange('monitoringProgram', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="monitoring-yes" />
                    <Label htmlFor="monitoring-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="monitoring-no" />
                    <Label htmlFor="monitoring-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Toilet Training:
                </Label>
                <RadioGroup value={formData.toiletTraining} onValueChange={(value) => handleInputChange('toiletTraining', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="toilet-training-yes" />
                    <Label htmlFor="toilet-training-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="toilet-training-no" />
                    <Label htmlFor="toilet-training-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Fall Alarms:
                </Label>
                <RadioGroup value={formData.fallAlarms} onValueChange={(value) => handleInputChange('fallAlarms', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="fall-alarms-yes" />
                    <Label htmlFor="fall-alarms-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="fall-alarms-no" />
                    <Label htmlFor="fall-alarms-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Last Meal:
                </Label>
                <Input
                  type="text"
                  value={formData.lastMealTime}
                  onChange={(e) => handleInputChange('lastMealTime', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Last Toileted:
                </Label>
                <Input
                  type="text"
                  value={formData.lastToiletedTime}
                  onChange={(e) => handleInputChange('lastToiletedTime', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight Loss:
                </Label>
                <RadioGroup value={formData.weightLoss} onValueChange={(value) => handleInputChange('weightLoss', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="weight-loss-yes" />
                    <Label htmlFor="weight-loss-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="weight-loss-no" />
                    <Label htmlFor="weight-loss-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Last Pain Meds:
                </Label>
                <Input
                  type="text"
                  value={formData.lastPainMedsTime}
                  onChange={(e) => handleInputChange('lastPainMedsTime', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Pain Meds Given:
                </Label>
                <RadioGroup value={formData.painMeds} onValueChange={(value) => handleInputChange('painMeds', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="pain-meds-yes" />
                    <Label htmlFor="pain-meds-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="pain-meds-no" />
                    <Label htmlFor="pain-meds-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="mt-4">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Medications:
              </Label>
              <Textarea
                value={formData.medications}
                onChange={(e) => handleInputChange('medications', e.target.value)}
                rows={3}
                placeholder="blood: glucose meter, testosterone cyp, micro (bulk), testosterone (bulk), urinary tract inflamph test, bun test, testosterone, ICD10:A01.05(Typhoid fever with other complications), ICD10:A01.2(Paratyphoid fever B), ICD10:A01.3(Paratyphoid fever C), ICD10:A01.4(Paratyphoid fever, unspecified), ICD10:A38.1(Scarlet fever with..."
              />
            </div>
          </div>

          {/* Incident Details Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            
            {/* SBAR Format - Top 4 text areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Situation:
                </Label>
                <Textarea
                  value={formData.situation}
                  onChange={(e) => handleInputChange('situation', e.target.value)}
                  rows={4}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Background:
                </Label>
                <Textarea
                  value={formData.background}
                  onChange={(e) => handleInputChange('background', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment:
                </Label>
                <Textarea
                  value={formData.assessment}
                  onChange={(e) => handleInputChange('assessment', e.target.value)}
                  rows={4}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Request/Recommendation:
                </Label>
                <Textarea
                  value={formData.requestRecommendation}
                  onChange={(e) => handleInputChange('requestRecommendation', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            
            {/* Body Diagram Section */}
            <div className="mb-6">
              <BodyDiagramAnnotation
                annotations={formData.bodyDiagramAnnotations}
                onChange={(annotations) => handleInputChange('bodyDiagramAnnotations', annotations)}
              />
            </div>
            
            {/* Middle row with Persons Assigned and Treatment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Persons Assigned:
                </Label>
                <Input
                  type="text"
                  value={formData.personsAssigned}
                  onChange={(e) => handleInputChange('personsAssigned', e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment:
                  </Label>
                  <RadioGroup value={formData.treatment} onValueChange={(value) => handleInputChange('treatment', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="treatment-yes" />
                      <Label htmlFor="treatment-yes" className="text-sm">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="treatment-no" />
                      <Label htmlFor="treatment-no" className="text-sm">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex-1">
                  <Input
                    type="text"
                    value={formData.treatment}
                    onChange={(e) => handleInputChange('treatment', e.target.value)}
                    className="mt-6"
                    placeholder="Treatment details"
                  />
                </div>
              </div>
            </div>
            
            {/* Current PT and Transport row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Current PT:
                </Label>
                <RadioGroup value={formData.currentPT} onValueChange={(value) => handleInputChange('currentPT', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="current-pt-yes" />
                    <Label htmlFor="current-pt-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="current-pt-no" />
                    <Label htmlFor="current-pt-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Transport:
                  </Label>
                  <RadioGroup value={formData.transport} onValueChange={(value) => handleInputChange('transport', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="transport-yes" />
                      <Label htmlFor="transport-yes" className="text-sm">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="transport-no" />
                      <Label htmlFor="transport-no" className="text-sm">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex-1">
                  <Input
                    type="text"
                    value={formData.transport}
                    onChange={(e) => handleInputChange('transport', e.target.value)}
                    className="mt-6"
                    placeholder="Transport details"
                  />
                </div>
              </div>
            </div>
            
            {/* Action Taken - Large text area */}
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Action Taken:
              </Label>
              <Textarea
                value={formData.actionTaken}
                onChange={(e) => handleInputChange('actionTaken', e.target.value)}
                rows={6}
              />
            </div>
            
            {/* Bottom row with Follow Up Date and Comment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow Up Date:
                </Label>
                <Input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment:
                </Label>
                <Textarea
                  value={formData.finalComment}
                  onChange={(e) => handleInputChange('finalComment', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Staff Verification and Reviews Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            
            {/* Staff Verification */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-700 mb-4">
                I verify that the above is true and accurate to the best of my knowledge. I also understand that any willful omission or falsification is fraudulent, and may be punishable to the full extent of the law.:
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Staff:
                  </Label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id="staff-signature-checkbox"
                      checked={formData.staffSignature === 'Yes'}
                      onChange={(e) => handleInputChange('staffSignature', e.target.checked ? 'Yes' : 'No')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="staff-signature-checkbox" className="text-sm">
                      Click this check box to eSign.
                    </Label>
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Date:
                  </Label>
                  <Input
                    type="date"
                    value={formData.staffSignatureDate}
                    onChange={(e) => handleInputChange('staffSignatureDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Reviewed By Section */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Reviewed By</h3>
              
              {/* Director of Nursing */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Director of Nursing:
                    </Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="director-nursing-checkbox"
                        checked={formData.directorOfNursingSignature === 'Yes'}
                        onChange={(e) => handleInputChange('directorOfNursingSignature', e.target.checked ? 'Yes' : 'No')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="director-nursing-checkbox" className="text-sm">
                        Click this check box to eSign.
                      </Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Date:
                    </Label>
                    <Input
                      type="date"
                      value={formData.directorOfNursingDate}
                      onChange={(e) => handleInputChange('directorOfNursingDate', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Comments:
                  </Label>
                  <Textarea
                    value={formData.directorOfNursingComment}
                    onChange={(e) => handleInputChange('directorOfNursingComment', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              {/* Administrator */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Administrator:
                    </Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="administrator-checkbox"
                        checked={formData.administratorSignature === 'Yes'}
                        onChange={(e) => handleInputChange('administratorSignature', e.target.checked ? 'Yes' : 'No')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="administrator-checkbox" className="text-sm">
                        Click this check box to eSign.
                      </Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Date:
                    </Label>
                    <Input
                      type="date"
                      value={formData.administratorDate}
                      onChange={(e) => handleInputChange('administratorDate', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Comments:
                  </Label>
                  <Textarea
                    value={formData.administratorComment}
                    onChange={(e) => handleInputChange('administratorComment', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              {/* Medical Officer */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Medical Officer:
                    </Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="medical-officer-checkbox"
                        checked={formData.medicalOfficerSignature === 'Yes'}
                        onChange={(e) => handleInputChange('medicalOfficerSignature', e.target.checked ? 'Yes' : 'No')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="medical-officer-checkbox" className="text-sm">
                        Click this check box to eSign.
                      </Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Date:
                    </Label>
                    <Input
                      type="date"
                      value={formData.medicalOfficerDate}
                      onChange={(e) => handleInputChange('medicalOfficerDate', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Comments:
                  </Label>
                  <Textarea
                    value={formData.medicalOfficerComment}
                    onChange={(e) => handleInputChange('medicalOfficerComment', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              {/* Medical Director */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Medical Director:
                    </Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="medical-director-checkbox"
                        checked={formData.medicalDirectorSignature === 'Yes'}
                        onChange={(e) => handleInputChange('medicalDirectorSignature', e.target.checked ? 'Yes' : 'No')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="medical-director-checkbox" className="text-sm">
                        Click this check box to eSign.
                      </Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Date:
                    </Label>
                    <Input
                      type="date"
                      value={formData.medicalDirectorDate}
                      onChange={(e) => handleInputChange('medicalDirectorDate', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Comments:
                  </Label>
                  <Textarea
                    value={formData.medicalDirectorComment}
                    onChange={(e) => handleInputChange('medicalDirectorComment', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
      
      {/* Sticky Footer Button Bar */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end gap-4 py-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleBack}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={() => {
                // Trigger form submission by finding and clicking the hidden submit button
                const form = document.querySelector('form')
                if (form) {
                  const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
                  form.dispatchEvent(submitEvent)
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewIncidentPage
