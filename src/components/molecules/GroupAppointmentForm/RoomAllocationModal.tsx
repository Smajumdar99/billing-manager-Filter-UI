import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '../../atoms/Dialog/dialog';
import { Button } from '../../atoms/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../atoms/Select/select';
import { Input } from '../../atoms/Input';
import { Badge } from '../../atoms/Badge';
import { Card, CardContent } from '../../atoms/Card';
import { 
  BuildingOfficeIcon, 
  MapPinIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Types for room management
interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  program: string;
  status: 'available' | 'booked' | 'maintenance';
  equipment: string[];
  bookedBy?: string;
  bookedTime?: string;
  nextAvailable?: string;
}

interface RoomAllocationModalProps {
  open: boolean;
  onClose: () => void;
  onRoomSelected: (room: Room) => void;
  selectedDate?: string;
  selectedTime?: string;
}

// Mock data for behavioral clinic rooms
const mockRooms: Room[] = [
  // Building A - Therapy Rooms
  {
    id: 'A101',
    name: 'Therapy Room A101',
    building: 'Main Building A',
    floor: 1,
    capacity: 2,
    program: 'Individual Therapy',
    status: 'available',
    equipment: ['Comfortable seating', 'Whiteboard', 'Sound proofing']
  },
  {
    id: 'A102',
    name: 'Family Room A102',
    building: 'Main Building A',
    floor: 1,
    capacity: 6,
    program: 'Family Therapy',
    status: 'booked',
    equipment: ['Round table', 'Multiple chairs', 'Toys corner'],
    bookedBy: 'Dr. Sarah Johnson',
    bookedTime: '2:00 PM - 3:00 PM',
    nextAvailable: '4:00 PM'
  },
  {
    id: 'A201',
    name: 'Group Session A201',
    building: 'Main Building A',
    floor: 2,
    capacity: 12,
    program: 'Group Therapy',
    status: 'available',
    equipment: ['Circle seating', 'Projector', 'Flip chart', 'Sound system']
  },
  {
    id: 'A202',
    name: 'CBT Room A202',
    building: 'Main Building A',
    floor: 2,
    capacity: 2,
    program: 'CBT',
    status: 'maintenance',
    equipment: ['Desk setup', 'Computer', 'Printer'],
    nextAvailable: 'Tomorrow 9:00 AM'
  },
  
  // Building B - Specialized Rooms
  {
    id: 'B101',
    name: 'Play Therapy B101',
    building: 'Pediatric Building B',
    floor: 1,
    capacity: 4,
    program: 'Child Therapy',
    status: 'available',
    equipment: ['Play materials', 'Child-safe furniture', 'Art supplies', 'Sensory tools']
  },
  {
    id: 'B102',
    name: 'Assessment Room B102',
    building: 'Pediatric Building B',
    floor: 1,
    capacity: 3,
    program: 'Assessment',
    status: 'booked',
    equipment: ['Testing materials', 'Recording equipment', 'Observation mirror'],
    bookedBy: 'Dr. Michael Chen',
    bookedTime: '1:30 PM - 2:30 PM',
    nextAvailable: '3:00 PM'
  },
  {
    id: 'B201',
    name: 'EMDR Suite B201',
    building: 'Pediatric Building B',
    floor: 2,
    capacity: 2,
    program: 'EMDR',
    status: 'available',
    equipment: ['EMDR equipment', 'Reclining chairs', 'Dim lighting controls']
  },
  
  // Building C - Group Facilities
  {
    id: 'C101',
    name: 'Large Group Hall C101',
    building: 'Community Building C',
    floor: 1,
    capacity: 25,
    program: 'Group Therapy',
    status: 'available',
    equipment: ['Theater seating', 'Stage area', 'Audio/Visual system', 'Kitchen access']
  },
  {
    id: 'C102',
    name: 'Workshop Room C102',
    building: 'Community Building C',
    floor: 1,
    capacity: 15,
    program: 'Skills Training',
    status: 'available',
    equipment: ['Workshop tables', 'Craft supplies', 'Storage cabinets']
  },
  {
    id: 'C201',
    name: 'Meditation Room C201',
    building: 'Community Building C',
    floor: 2,
    capacity: 8,
    program: 'Mindfulness',
    status: 'booked',
    equipment: ['Meditation cushions', 'Soft lighting', 'Sound system', 'Plants'],
    bookedBy: 'Dr. Lisa Thompson',
    bookedTime: '3:00 PM - 4:00 PM',
    nextAvailable: '5:00 PM'
  }
];

const programs = [
  'All Programs',
  'Individual Therapy',
  'Family Therapy', 
  'Group Therapy',
  'Child Therapy',
  'CBT',
  'EMDR',
  'Assessment',
  'Skills Training',
  'Mindfulness'
];

const buildings = [
  'All Buildings',
  'Main Building A',
  'Pediatric Building B', 
  'Community Building C'
];

const floors = [
  'All Floors',
  'Floor 1',
  'Floor 2'
];

const RoomAllocationModal: React.FC<RoomAllocationModalProps> = ({
  open,
  onClose,
  onRoomSelected,
  selectedDate,
  selectedTime
}) => {
  // Filter states
  const [selectedProgram, setSelectedProgram] = useState('All Programs');
  const [selectedBuilding, setSelectedBuilding] = useState('All Buildings');
  const [selectedFloor, setSelectedFloor] = useState('All Floors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Filter rooms based on selected criteria
  const filteredRooms = useMemo(() => {
    return mockRooms.filter(room => {
      const matchesProgram = selectedProgram === 'All Programs' || room.program === selectedProgram;
      const matchesBuilding = selectedBuilding === 'All Buildings' || room.building === selectedBuilding;
      const matchesFloor = selectedFloor === 'All Floors' || room.floor === parseInt(selectedFloor.split(' ')[1]);
      const matchesSearch = searchQuery === '' || 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesProgram && matchesBuilding && matchesFloor && matchesSearch;
    });
  }, [selectedProgram, selectedBuilding, selectedFloor, searchQuery]);

  // Get status color and icon
  const getStatusDisplay = (room: Room) => {
    switch (room.status) {
      case 'available':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircleIcon className="w-4 h-4" />,
          label: 'Available'
        };
      case 'booked':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircleIcon className="w-4 h-4" />,
          label: 'Booked'
        };
      case 'maintenance':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <WrenchScrewdriverIcon className="w-4 h-4" />,
          label: 'Maintenance'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <ClockIcon className="w-4 h-4" />,
          label: 'Unknown'
        };
    }
  };

  const handleRoomSelect = (room: Room) => {
    if (room.status === 'available') {
      setSelectedRoom(room);
    }
  };

  const handleBookRoom = () => {
    if (selectedRoom) {
      onRoomSelected(selectedRoom);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[1200px] lg:max-w-[1400px] p-0 flex flex-col h-[800px] max-h-[90vh] overflow-auto bg-gradient-to-br from-blue-50 to-indigo-100"
        aria-describedby="room-allocation-dialog-desc"
      >
        {/* Accessible dialog title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">Room Allocation and Booking</DialogTitle>
        {/* Accessible dialog description for screen readers, visually hidden */}
        <DialogDescription id="room-allocation-dialog-desc" className="sr-only">
          View available rooms and book them for appointments with filters for program, building, and floor
        </DialogDescription>
        
        {/* Dialog Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                Room Allocation
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Find and book the perfect room for your appointment
                {selectedDate && selectedTime && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • {selectedDate} at {selectedTime}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span>Booked</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Maintenance</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="px-6 py-4 bg-white/60 backdrop-blur-sm border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            
            {/* Program Filter */}
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="h-10 bg-white border-gray-200 focus:border-blue-400">
                <SelectValue placeholder="Select Program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map(program => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Building Filter */}
            <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
              <SelectTrigger className="h-10 bg-white border-gray-200 focus:border-blue-400">
                <SelectValue placeholder="Select Building" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map(building => (
                  <SelectItem key={building} value={building}>{building}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Floor Filter */}
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="h-10 bg-white border-gray-200 focus:border-blue-400">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                {floors.map(floor => (
                  <SelectItem key={floor} value={floor}>{floor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Main Content - Room Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRooms.map(room => {
              const statusDisplay = getStatusDisplay(room);
              const isSelected = selectedRoom?.id === room.id;
              const isAvailable = room.status === 'available';
              
              return (
                <Card 
                  key={room.id}
                  className={`
                    cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1
                    ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
                    ${isAvailable ? 'hover:shadow-blue-100' : 'opacity-75'}
                    ${!isAvailable ? 'cursor-not-allowed' : ''}
                  `}
                  onClick={() => handleRoomSelect(room)}
                >
                  <CardContent className="p-4">
                    {/* Room Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{room.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{room.id}</p>
                      </div>
                      <Badge className={`${statusDisplay.color} border text-xs px-2 py-1 flex items-center gap-1`}>
                        {statusDisplay.icon}
                        {statusDisplay.label}
                      </Badge>
                    </div>
                    
                    {/* Room Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <BuildingOfficeIcon className="w-3 h-3" />
                        <span>{room.building}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPinIcon className="w-3 h-3" />
                        <span>Floor {room.floor} • Capacity: {room.capacity}</span>
                      </div>
                      <div className="text-xs">
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {room.program}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Equipment */}
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Equipment:</p>
                      <div className="flex flex-wrap gap-1">
                        {room.equipment.slice(0, 2).map(eq => (
                          <Badge key={eq} variant="secondary" className="text-xs px-1.5 py-0.5">
                            {eq}
                          </Badge>
                        ))}
                        {room.equipment.length > 2 && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            +{room.equipment.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Booking Info */}
                    {room.status === 'booked' && (
                      <div className="bg-red-50 p-2 rounded text-xs">
                        <p className="font-medium text-red-800">Booked by: {room.bookedBy}</p>
                        <p className="text-red-600">{room.bookedTime}</p>
                        <p className="text-red-600">Next: {room.nextAvailable}</p>
                      </div>
                    )}
                    
                    {room.status === 'maintenance' && (
                      <div className="bg-yellow-50 p-2 rounded text-xs">
                        <p className="font-medium text-yellow-800">Under Maintenance</p>
                        <p className="text-yellow-600">Available: {room.nextAvailable}</p>
                      </div>
                    )}
                    
                    {isSelected && isAvailable && (
                      <div className="bg-blue-50 p-2 rounded text-xs mt-2">
                        <p className="font-medium text-blue-800">✓ Selected for booking</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more rooms.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <DialogFooter className="py-3 px-6 bg-white/80 backdrop-blur-sm border-t border-gray-200">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-600">
              {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
              {selectedRoom && (
                <span className="ml-4 text-blue-600 font-medium">
                  Selected: {selectedRoom.name}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="px-4 h-9 font-normal border-gray-200 text-sm"
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                onClick={handleBookRoom}
                disabled={!selectedRoom}
                className="px-6 h-9"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Book Room
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomAllocationModal;
