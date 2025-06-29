import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, Clock, Star, Building, Globe, Eye, Info, Phone, Calendar, Users, Car, Wifi, Coffee, Shield, Zap, Heart, GraduationCap, Plane, Train, Home, ShoppingBag, Utensils, Hotel, Cast as Gas, Camera, X } from 'lucide-react';
import GoogleMaps3DViewer from './GoogleMaps3DViewer';
import BuildingViewer from './BuildingViewer';
import InfrastructureViewer from './InfrastructureViewer';

interface AddressResult {
  id: string;
  address: string;
  type: string;
  coordinates: { lat: number; lng: number };
  category: 'building' | 'infrastructure' | 'landmark' | 'business' | 'residential';
  details: {
    name: string;
    description: string;
    rating?: number;
    reviews?: number;
    operatingHours?: string;
    phone?: string;
    website?: string;
    features?: string[];
    yearBuilt?: string;
    floors?: number;
    capacity?: number;
    specialties?: string[];
  };
  realTimeData?: {
    status: string;
    occupancy?: number;
    waitTime?: string;
    nextDeparture?: string;
    availability?: string;
  };
  accessibility?: {
    wheelchairAccessible: boolean;
    elevators: boolean;
    parkingAvailable: boolean;
    publicTransport: boolean;
  };
  image?: string;
}

interface GlobalAddressSearchProps {
  onAddressSelect?: (address: AddressResult) => void;
  placeholder?: string;
  className?: string;
}

export default function GlobalAddressSearch({ 
  onAddressSelect, 
  placeholder = "Search any address, building, or landmark...",
  className = ""
}: GlobalAddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Comprehensive mock address database
  const mockAddresses: AddressResult[] = [
    // Hospitals
    {
      id: 'nyp-weill-cornell',
      address: '525 E 68th St, New York, NY 10065',
      type: 'Hospital',
      category: 'infrastructure',
      coordinates: { lat: 40.7648, lng: -73.9540 },
      details: {
        name: 'NewYork-Presbyterian/Weill Cornell Medical Center',
        description: 'Leading academic medical center with cutting-edge research and patient care',
        rating: 4.2,
        reviews: 1847,
        operatingHours: '24/7 Emergency, Outpatient: 6 AM - 10 PM',
        phone: '+1 (212) 746-5454',
        website: 'https://www.nyp.org',
        features: ['Emergency Care', 'Trauma Center', 'Cancer Center', 'Heart Surgery', 'Neurology', 'Pediatrics'],
        yearBuilt: '1877',
        capacity: 862,
        specialties: ['Cardiology', 'Oncology', 'Neurosurgery', 'Transplant Surgery', 'Emergency Medicine']
      },
      realTimeData: {
        status: 'Open - Normal Operations',
        occupancy: 78,
        waitTime: '45 minutes (Emergency)',
        availability: 'Accepting patients'
      },
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        parkingAvailable: true,
        publicTransport: true
      },
      image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    // Universities
    {
      id: 'columbia-university',
      address: '116th St & Broadway, New York, NY 10027',
      type: 'University',
      category: 'infrastructure',
      coordinates: { lat: 40.8075, lng: -73.9626 },
      details: {
        name: 'Columbia University',
        description: 'Ivy League research university with world-class programs',
        rating: 4.5,
        reviews: 3421,
        operatingHours: 'Campus: 24/7, Offices: Mon-Fri 9 AM - 5 PM',
        phone: '+1 (212) 854-1754',
        website: 'https://www.columbia.edu',
        features: ['Research Facilities', 'Libraries', 'Student Housing', 'Sports Complex', 'Medical School', 'Law School'],
        yearBuilt: '1754',
        capacity: 33000,
        specialties: ['Medicine', 'Law', 'Business', 'Engineering', 'Journalism', 'Arts & Sciences']
      },
      realTimeData: {
        status: 'Open - Academic Session',
        occupancy: 85,
        availability: 'Tours available'
      },
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        parkingAvailable: true,
        publicTransport: true
      },
      image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    // Airports
    {
      id: 'jfk-airport',
      address: 'Queens, NY 11430',
      type: 'Airport',
      category: 'infrastructure',
      coordinates: { lat: 40.6413, lng: -73.7781 },
      details: {
        name: 'John F. Kennedy International Airport',
        description: 'Major international gateway serving New York City',
        rating: 3.8,
        reviews: 15420,
        operatingHours: '24/7 Operations',
        phone: '+1 (718) 244-4444',
        website: 'https://www.jfkairport.com',
        features: ['International Flights', 'Duty Free Shopping', 'Restaurants', 'Lounges', 'Car Rental', 'Hotels'],
        capacity: 62500000,
        yearBuilt: '1948',
        specialties: ['International Hub', 'Cargo Operations', 'Private Aviation', 'Transit Hub']
      },
      realTimeData: {
        status: 'Operational - Normal',
        occupancy: 67,
        nextDeparture: 'Flight AA123 to London - 14:30',
        availability: 'Average 15 min departure delay'
      },
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        parkingAvailable: true,
        publicTransport: true
      },
      image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    // Railway Stations
    {
      id: 'penn-station',
      address: '4 Pennsylvania Plaza, New York, NY 10001',
      type: 'Railway Station',
      category: 'infrastructure',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      details: {
        name: 'Pennsylvania Station (Penn Station)',
        description: 'Major transportation hub serving Amtrak, NJ Transit, and LIRR',
        rating: 3.2,
        reviews: 7834,
        operatingHours: '24/7 Operations',
        phone: '+1 (212) 630-6401',
        website: 'https://www.amtrak.com',
        features: ['Amtrak Services', 'NJ Transit', 'LIRR', 'Subway Access', 'Shopping', 'Dining'],
        capacity: 650000,
        yearBuilt: '1910',
        specialties: ['Long Distance Rail', 'Regional Rail', 'Commuter Rail', 'Subway Hub']
      },
      realTimeData: {
        status: 'Operational - Heavy Traffic',
        occupancy: 88,
        nextDeparture: 'Acela Express to Boston - 14:20',
        availability: 'Northeast Regional delayed 20 minutes'
      },
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        parkingAvailable: false,
        publicTransport: true
      },
      image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    // Commercial Buildings
    {
      id: 'empire-state-building',
      address: '20 W 34th St, New York, NY 10001',
      type: 'Commercial Building',
      category: 'building',
      coordinates: { lat: 40.7484, lng: -73.9857 },
      details: {
        name: 'Empire State Building',
        description: 'Iconic Art Deco skyscraper and New York landmark',
        rating: 4.7,
        reviews: 89000,
        operatingHours: 'Observatory: 8 AM - 2 AM daily',
        phone: '+1 (212) 736-3100',
        website: 'https://www.esbnyc.com',
        features: ['Observatory', 'LED Light Show', 'High-Speed Elevators', 'Broadcast Facilities', 'Office Space'],
        yearBuilt: '1931',
        floors: 102,
        capacity: 15000
      },
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        parkingAvailable: false,
        publicTransport: true
      },
      image: 'https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    // Residential Buildings
    {
      id: 'one-manhattan-square',
      address: '252 South St, New York, NY 10002',
      type: 'Residential Complex',
      category: 'building',
      coordinates: { lat: 40.7089, lng: -73.9870 },
      details: {
        name: 'One Manhattan Square',
        description: 'Luxury residential tower with premium amenities',
        rating: 4.4,
        reviews: 567,
        operatingHours: '24/7 Concierge',
        phone: '+1 (212) 252-7777',
        features: ['Luxury Apartments', 'Rooftop Garden', 'Fitness Center', 'Pool', 'Concierge', 'Parking'],
        yearBuilt: '2019',
        floors: 80,
        capacity: 815
      },
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        parkingAvailable: true,
        publicTransport: true
      },
      image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    // Businesses
    {
      id: 'times-square-starbucks',
      address: '1585 Broadway, New York, NY 10036',
      type: 'Coffee Shop',
      category: 'business',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      details: {
        name: 'Starbucks Times Square',
        description: 'Iconic Starbucks location in the heart of Times Square',
        rating: 4.1,
        reviews: 2341,
        operatingHours: '5:30 AM - 11:00 PM daily',
        phone: '+1 (212) 944-6690',
        features: ['WiFi', 'Mobile Order', 'Outdoor Seating', 'Gift Cards', 'Rewards Program'],
        yearBuilt: '2010'
      },
      accessibility: {
        wheelchairAccessible: true,
        elevators: false,
        parkingAvailable: false,
        publicTransport: true
      },
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    // Hotels
    {
      id: 'plaza-hotel',
      address: '768 5th Ave, New York, NY 10019',
      type: 'Hotel',
      category: 'business',
      coordinates: { lat: 40.7648, lng: -73.9754 },
      details: {
        name: 'The Plaza Hotel',
        description: 'Legendary luxury hotel overlooking Central Park',
        rating: 4.6,
        reviews: 8934,
        operatingHours: '24/7 Front Desk',
        phone: '+1 (212) 759-3000',
        website: 'https://www.theplazany.com',
        features: ['Luxury Suites', 'Spa', 'Fine Dining', 'Concierge', 'Valet Parking', 'Business Center'],
        yearBuilt: '1907',
        floors: 20,
        capacity: 282
      },
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        parkingAvailable: true,
        publicTransport: true
      },
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    // Shopping Centers
    {
      id: 'brookfield-place',
      address: '200 Vesey St, New York, NY 10281',
      type: 'Shopping Center',
      category: 'business',
      coordinates: { lat: 40.7135, lng: -74.0154 },
      details: {
        name: 'Brookfield Place',
        description: 'Upscale shopping and dining destination in Lower Manhattan',
        rating: 4.3,
        reviews: 4567,
        operatingHours: 'Mon-Sat: 10 AM - 9 PM, Sun: 11 AM - 7 PM',
        phone: '+1 (212) 978-1698',
        website: 'https://www.brookfieldplaceny.com',
        features: ['Luxury Shopping', 'Fine Dining', 'Waterfront Views', 'Events Space', 'Art Installations'],
        yearBuilt: '2015',
        floors: 4
      },
      accessibility: {
        wheelchairAccessible: true,
        elevators: true,
        parkingAvailable: true,
        publicTransport: true
      },
      image: 'https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filteredResults = mockAddresses.filter(address =>
        address.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.details.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.details.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(filteredResults);
      setIsOpen(true);
      setIsLoading(false);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleAddressClick = (address: AddressResult) => {
    setQuery(address.address);
    setIsOpen(false);
    setSelectedAddress(address);
    setShowViewer(true);
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hospital': return Heart;
      case 'university': return GraduationCap;
      case 'airport': return Plane;
      case 'railway station': return Train;
      case 'commercial building': return Building;
      case 'residential complex': return Home;
      case 'coffee shop': return Coffee;
      case 'hotel': return Hotel;
      case 'shopping center': return ShoppingBag;
      case 'restaurant': return Utensils;
      case 'gas station': return Gas;
      default: return MapPin;
    }
  };

  const getIconColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hospital': return 'text-red-600';
      case 'university': return 'text-blue-600';
      case 'airport': return 'text-green-600';
      case 'railway station': return 'text-purple-600';
      case 'commercial building': return 'text-gray-600';
      case 'residential complex': return 'text-orange-600';
      case 'coffee shop': return 'text-amber-600';
      case 'hotel': return 'text-pink-600';
      case 'shopping center': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const renderViewer = () => {
    if (!selectedAddress) return null;

    if (selectedAddress.category === 'infrastructure') {
      // Convert to infrastructure format
      const infrastructureData = {
        id: selectedAddress.id,
        name: selectedAddress.details.name,
        type: selectedAddress.type.toLowerCase().replace(' ', '') as 'hospital' | 'university' | 'airport' | 'railway',
        coordinates: selectedAddress.coordinates,
        address: selectedAddress.address,
        rating: selectedAddress.details.rating || 4.0,
        reviews: selectedAddress.details.reviews || 100,
        description: selectedAddress.details.description,
        features: selectedAddress.details.features || [],
        operatingHours: selectedAddress.details.operatingHours || 'Contact for hours',
        contact: {
          phone: selectedAddress.details.phone,
          website: selectedAddress.details.website
        },
        specialties: selectedAddress.details.specialties,
        capacity: selectedAddress.details.capacity,
        yearEstablished: selectedAddress.details.yearBuilt ? parseInt(selectedAddress.details.yearBuilt) : undefined,
        realTimeData: selectedAddress.realTimeData,
        accessibility: selectedAddress.accessibility || {
          wheelchairAccessible: false,
          elevators: false,
          parkingAvailable: false,
          publicTransport: false
        },
        image: selectedAddress.image || 'https://images.pexels.com/photos/273230/pexels-photo-273230.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        category: selectedAddress.type
      };

      return (
        <InfrastructureViewer 
          infrastructure={infrastructureData} 
          onClose={() => setShowViewer(false)}
        />
      );
    } else if (selectedAddress.category === 'building') {
      // Convert to building format
      const buildingData = {
        id: selectedAddress.id,
        name: selectedAddress.details.name,
        address: selectedAddress.address,
        type: selectedAddress.type,
        height: selectedAddress.details.floors ? `${selectedAddress.details.floors} floors` : 'Unknown height',
        floors: selectedAddress.details.floors || 1,
        yearBuilt: selectedAddress.details.yearBuilt || 'Unknown',
        architect: 'Unknown',
        color: 'Modern Glass and Steel',
        materials: ['Steel Frame', 'Glass Curtain Wall', 'Concrete Foundation', 'Modern Cladding'],
        area: {
          total: selectedAddress.details.capacity ? `${selectedAddress.details.capacity * 1000} sq ft` : 'Unknown',
          perFloor: '2,500 sq ft average'
        },
        features: selectedAddress.details.features || ['Modern Design', 'Professional Management'],
        coordinates: selectedAddress.coordinates
      };

      return (
        <BuildingViewer 
          building={buildingData} 
          onClose={() => setShowViewer(false)}
        />
      );
    } else {
      // For businesses and other types, show Google Maps 3D viewer
      return (
        <GoogleMaps3DViewer
          landmark={{
            name: selectedAddress.details.name,
            coordinates: selectedAddress.coordinates,
            location: selectedAddress.address.split(',')[0],
            country: 'United States'
          }}
          onClose={() => setShowViewer(false)}
          isFullscreen={false}
        />
      );
    }
  };

  return (
    <>
      <div ref={searchRef} className={`relative ${className}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            onFocus={() => query.length >= 2 && setIsOpen(true)}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((address) => {
                  const IconComponent = getIcon(address.type);
                  const iconColor = getIconColor(address.type);
                  
                  return (
                    <button
                      key={address.id}
                      onClick={() => handleAddressClick(address)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <IconComponent className={`h-5 w-5 ${iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {address.details.name}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                {address.type}
                              </span>
                              <Eye className="h-4 w-4 text-blue-600" title="3D View Available" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{address.address}</p>
                          <p className="text-xs text-gray-500 mb-2">{address.details.description}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {address.details.rating && (
                              <span className="flex items-center">
                                <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                                {address.details.rating} ({address.details.reviews?.toLocaleString()})
                              </span>
                            )}
                            {address.details.operatingHours && (
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {address.details.operatingHours.split(',')[0]}
                              </span>
                            )}
                            {address.realTimeData?.status && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                address.realTimeData.status.includes('Open') || address.realTimeData.status.includes('Operational')
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {address.realTimeData.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : query.length >= 2 && !isLoading ? (
              <div className="px-4 py-6 text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No addresses found</p>
                <p className="text-xs">Try a different search term</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* 3D Viewer Modal */}
      {showViewer && selectedAddress && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {renderViewer()}
          </div>
        </div>
      )}
    </>
  );
}