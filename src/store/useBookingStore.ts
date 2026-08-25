// 🏪 Booking Store - App ka main state management
// Yeh store poori booking ki state handle karta hai - screen, hospital, ambulance, fare, OTP sab kuch

import { create } from 'zustand';
import { Hospital } from '../services/mockDataService';
import { FareCalculationResult, computeFare } from '../services/fareCalculator';
import { RouteInfo, fetchDirectionsRoute } from '../services/googleMapsService';
import { UserLocation, DEFAULT_LOCATION } from '../services/locationService';

// 🏠 Screen Management - Konsa screen dikhana hai
export type ScreenType =
  | 'home'
  | 'hospital_select'
  | 'searching_dispatch'
  | 'live_tracking'
  | 'ai_assistant'
  | 'hospital_list'
  | 'booking_history'
  | 'profile'
  | 'destination_search';

// 📋 Booking Status - Booking ki current state
export type BookingStatus =
  | 'idle'
  | 'searching'
  | 'driver_assigned'
  | 'driver_arriving'
  | 'patient_picked_up'
  | 'en_route_hospital'
  | 'completed'
  | 'cancelled';

// 📜 Booking Record - Ek booking ka pura record
export interface BookingRecord {
  id: string;
  timestamp: string;
  hospital: Hospital;
  ambulanceType: 'bls' | 'als'; // 🚑 Sirf BLS ya ALS - Bike hata diya
  fare: FareCalculationResult;
  status: BookingStatus;
  driverName: string;
  ambulanceNumber: string;
}

interface BookingState {
  // 🏠 Current Screen - Abhi konsa screen dikh raha hai
  currentScreen: ScreenType;

  // 📍 Pickup Location - User ki current GPS location
  pickupLocation: UserLocation;

  // 🏥 Hospital Selection - Konsa hospital chuna gaya hai
  selectedHospital: Hospital | null;

  // 🚑 Ambulance Type - BLS ya ALS ambulance
  selectedAmbulanceType: 'bls' | 'als';

  // 🗺️ Route Info - Pickup se hospital tak ka raasta
  routeToPickup: RouteInfo | null;
  routeToHospital: RouteInfo | null;

  // 💰 Fare Calculation - Kitna paisa lagega
  fareCalculation: FareCalculationResult | null;

  // 📋 Booking Status - Booking ki current state
  bookingStatus: BookingStatus;
  activeBookingId: string | null;

  // 🔢 OTP Verification - Driver ke saath verify karne ke liye OTP
  otpCode: string;
  otpVerified: boolean;

  // 📜 Booking History - Purani bookings ka record
  bookingHistory: BookingRecord[];

  // 🎬 Actions - State change karne ke functions
  setCurrentScreen: (screen: ScreenType) => void;
  setPickupLocation: (loc: UserLocation) => void;
  setSelectedHospital: (hospital: Hospital | null) => void;
  setSelectedAmbulanceType: (type: 'bls' | 'als') => void;
  calculateAndSetFare: (distanceKm?: number) => void;
  startBookingFlow: (hospital?: Hospital, ambulanceType?: 'bls' | 'als') => void;
  confirmBookingAndSearch: () => void;
  setBookingStatus: (status: BookingStatus) => void;
  cancelActiveBooking: () => void;
  completeTrip: () => void;
  loadHospitalRoute: () => Promise<void>;
  generateOtp: () => void;
  setOtpVerified: (verified: boolean) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  // 🏠 Default Screen - App kholte hi home screen dikhega
  currentScreen: 'home',

  // 📍 Default Location - Sector 128, Noida ki default location
  pickupLocation: DEFAULT_LOCATION,

  // 🏥 Koi hospital select nahi hua abhi
  selectedHospital: null,

  // 🚑 Default ambulance type BLS hai
  selectedAmbulanceType: 'bls',

  // 🗺️ Route abhi available nahi hai
  routeToPickup: null,
  routeToHospital: null,

  // 💰 Fare abhi calculate nahi hua
  fareCalculation: null,

  // 📋 Booking idle hai - koi active booking nahi
  bookingStatus: 'idle',
  activeBookingId: null,

  // 🔢 OTP default - booking confirm hone pe naya generate hoga
  otpCode: '1234',
  otpVerified: false,

  // 📜 Sample booking history - pichli ek booking ka record
  bookingHistory: [
    {
      id: 'BK-8821',
      timestamp: 'Yesterday, 10:14 PM',
      hospital: {
        id: 'hosp-1',
        name: 'Jaypee Hospital',
        address: 'Sector 128, Noida, Uttar Pradesh 201304',
        latitude: 28.5445,
        longitude: 77.3940,
        distanceKm: 4.2,
        etaMinutes: 9,
        rating: 4.8,
        userRatingsTotal: 3420,
        phone: '+91-120-4122222',
        emergencyAvailable: true,
        icuBedsAvailable: 14,
        specialties: ['Cardiac Care', 'Trauma'],
        openNow: true,
      },
      ambulanceType: 'als',
      fare: computeFare(4.2, 'als'),
      status: 'completed',
      driverName: 'Rajesh Kumar (EMT-Adv)',
      ambulanceNumber: 'UP 16 EM 4092',
    },
  ],

  // 🏠 Screen Change - Ek screen se doosre pe jaao
  setCurrentScreen: (screen) => set({ currentScreen: screen }),

  // 📍 Pickup Location Update - User ki location change hui
  setPickupLocation: (loc) => {
    set({ pickupLocation: loc });
    const { selectedHospital } = get();
    if (selectedHospital) {
      get().calculateAndSetFare();
    }
  },

  // 🏥 Hospital Select - User ne hospital chuna
  setSelectedHospital: (hospital) => {
    set({ selectedHospital: hospital });
    if (hospital) {
      get().calculateAndSetFare(hospital.distanceKm);
      get().loadHospitalRoute();
    }
  },

  // 🚑 Ambulance Type Change - BLS ya ALS select kiya
  setSelectedAmbulanceType: (type) => {
    set({ selectedAmbulanceType: type });
    get().calculateAndSetFare();
  },

  // 💰 Fare Calculate - Distance ke hisaab se paisa calculate karo
  calculateAndSetFare: (customDistanceKm?: number) => {
    const { selectedHospital, selectedAmbulanceType } = get();
    const dist = customDistanceKm ?? selectedHospital?.distanceKm ?? 3.5;
    const fare = computeFare(dist, selectedAmbulanceType);
    set({ fareCalculation: fare });
  },

  // 🗺️ Hospital Route Load - Hospital tak ka raasta load karo (OSRM/Google se)
  loadHospitalRoute: async () => {
    const { pickupLocation, selectedHospital } = get();
    if (!selectedHospital) return;

    try {
      const route = await fetchDirectionsRoute(
        { latitude: pickupLocation.latitude, longitude: pickupLocation.longitude },
        { latitude: selectedHospital.latitude, longitude: selectedHospital.longitude }
      );
      set({ routeToHospital: route });
    } catch (err) {
      console.warn('Route load error:', err);
    }
  },

  // 🚀 Booking Flow Start - Hospital select karke booking shuru karo
  startBookingFlow: (hospital, ambulanceType) => {
    if (hospital) {
      set({ selectedHospital: hospital });
    }
    if (ambulanceType) {
      set({ selectedAmbulanceType: ambulanceType });
    }
    get().calculateAndSetFare();
    set({ currentScreen: 'hospital_select' });
  },

  // ✅ Booking Confirm - Ambulance search shuru karo, OTP generate karo
  confirmBookingAndSearch: () => {
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    // 🔢 Naya OTP generate karo booking confirm hone pe
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    set({
      bookingStatus: 'searching',
      activeBookingId: bookingId,
      currentScreen: 'searching_dispatch',
      otpCode: otp,
      otpVerified: false,
    });
  },

  // 📋 Status Update - Booking ka status change karo
  setBookingStatus: (status) => set({ bookingStatus: status }),

  // ❌ Cancel Booking - Booking cancel karo, home pe jaao
  cancelActiveBooking: () => {
    set({
      bookingStatus: 'cancelled',
      currentScreen: 'home',
      activeBookingId: null,
      otpVerified: false,
    });
  },

  // 🏁 Trip Complete - Safar pura hua, history mein save karo
  completeTrip: () => {
    const { selectedHospital, selectedAmbulanceType, fareCalculation, activeBookingId, bookingHistory } = get();
    if (selectedHospital && fareCalculation) {
      const record: BookingRecord = {
        id: activeBookingId || `BK-${Date.now()}`,
        timestamp: 'Just now',
        hospital: selectedHospital,
        ambulanceType: selectedAmbulanceType,
        fare: fareCalculation,
        status: 'completed',
        driverName: 'Rajesh Kumar (EMT-Adv)',
        ambulanceNumber: 'UP 16 EM 4092',
      };
      set({
        bookingHistory: [record, ...bookingHistory],
        bookingStatus: 'completed',
        currentScreen: 'booking_history',
        activeBookingId: null,
        otpVerified: false,
      });
    } else {
      set({ bookingStatus: 'idle', currentScreen: 'home', activeBookingId: null });
    }
  },

  // 🔢 OTP Generate - Naya 4-digit OTP banao
  generateOtp: () => {
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    set({ otpCode: otp, otpVerified: false });
  },

  // ✅ OTP Verify - Driver ne sahi OTP daala ya nahi
  setOtpVerified: (verified) => set({ otpVerified: verified }),
}));
