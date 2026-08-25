# 🚑 SaveLife — Real-Time Emergency Ambulance Dispatch & Trauma Network

> **Next-Generation Emergency Medical Dispatch & Hospital Navigation System**  
> *Built for rapid 3–4 minute response times in Sector 128, Noida Expressway & Delhi NCR.*

[![Expo](https://img.shields.io/badge/Expo-52.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-brown?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![NVIDIA NIM](https://img.shields.io/badge/NVIDIA_NIM-LLM_AI-76B900?style=for-the-badge&logo=nvidia&logoColor=white)](https://build.nvidia.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

---

## 📖 Overview (परियोजना परिचय)

**SaveLife** is a real-time emergency healthcare and ambulance dispatch application designed to provide instant medical transportation, hospital discovery, and AI-guided first-aid assistance during critical emergencies.

The app features a **Rapido/Blinkit-inspired ride booking UI**, live Leaflet web maps, real-time shrinking route polylines, 3D animated ambulance beacons, transparent distance-based fare calculations, and verified Sector 128 Noida hospital networks.

---

## 🛠️ Complete Tech Stack (तकनीकी संरचना)

| Layer | Technology Used | Description (विवरण) |
| :--- | :--- | :--- |
| **Framework** | **Expo (SDK 52) + React Native** | Cross-platform mobile and web application framework. |
| **Language** | **TypeScript 5.3** | Strict type safety and compile-time verification across all components. |
| **State Management** | **Zustand 5.0** | Lightweight, reactive global stores (`useBookingStore`, `useDriverStore`, `useChatStore`). |
| **Mapping & GIS** | **Leaflet 1.9 + CartoDB Voyager** | Interactive high-resolution vector road tiles with custom DOM markers and polylines. |
| **Navigation & Routing** | **OSRM / Google Directions API** | Real street-level road polyline generation and distance-time computation. |
| **Geolocation** | **HTML5 Geolocation + Expo Location** | Live device GPS tracking and reverse geocoding for precise pickup addresses. |
| **AI Triage Assistant** | **NVIDIA NIM API (`meta/llama-3.1-70b-instruct`)** | 24/7 medical first-aid triage, symptom assessment, and hospital recommendations. |
| **Audio Synthesizer** | **Web Audio API + SpeechSynthesis** | Procedural sound oscillators (Sonar Ping, 110 BPM CPR Metronome, Siren Tones, Voice TTS). |
| **Icons & UI Assets** | **Lucide React Native** | Clean, accessible vector medical and navigation iconography. |
| **Deployment** | **Vercel Zero-Config SPA** | Production static bundle export configured via `vercel.json` and `npm run build`. |

---

## 📂 Project Directory & Module Guide (कौनसा मॉड्यूल किस काम के लिए है)

```
savelife/
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   └── ChatBubble.tsx             # 💬 NVIDIA NIM AI chat bubbles & hospital referral cards
│   │   ├── booking/
│   │   │   ├── AmbulanceTypeSelector.tsx  # 🚑 BLS (Basic) vs ALS (ICU) interactive ambulance selector
│   │   │   ├── FareSummaryCard.tsx        # 💰 Transparent fare breakdown card with direct book action
│   │   │   └── HospitalItem.tsx           # 🏥 Hospital list item card with photo, doctor on-duty & ICU beds
│   │   ├── common/
│   │   │   ├── BottomNavBar.tsx           # 📱 Global 5-tab navigation bar with floating center AI Orb
│   │   │   ├── EtherealOrb.tsx            # 🔮 CSS keyframe animated glowing ethereal plasma orb
│   │   │   └── PulsingPuck.tsx            # 📍 Animated GPS location puck with accuracy ripple
│   │   ├── home/
│   │   │   ├── AddressChip.tsx            # 📍 Current pickup address pill with GPS trigger
│   │   │   ├── DualActionCards.tsx        # 🚑 Emergency Ambulance & Find Hospital hero cards
│   │   │   └── SearchTriggerPill.tsx      # 🔍 "Where is the emergency?" search trigger bar
│   │   ├── map/
│   │   │   ├── LiveMapView.web.tsx        # 🗺️ Leaflet Web map with 3D strobe ambulance & shrinking polyline
│   │   │   └── LiveMapView.tsx            # 🗺️ React Native Maps native fallback
│   │   └── tracking/
│   │       ├── DriverCard.tsx             # 👨‍✈️ Captain profile, vehicle number & "Never Cancels ⭐" badge
│   │       └── TripActions.tsx            # 🛡️ Safety toolkit, vitals pre-submission & EMT direct line
│   ├── constants/
│   │   ├── ambulanceTypes.ts              # 🚑 BLS and ALS ambulance specifications, features & base rates
│   │   └── colors.ts                      # 🎨 Color palette (Emerald, Crimson, Royal Blue, Slate Dark)
│   ├── hooks/
│   │   ├── useDriverSimulation.ts         # 🚗 Real-time vehicle motion & dynamic route shrinking physics
│   │   └── useLiveLocation.ts             # 🛰️ Device GPS location hook with auto-geocoding
│   ├── screens/
│   │   ├── HomeScreen.tsx                 # 🏠 Main emergency dispatch hub, siren audio & Sector 128 carousel
│   │   ├── DestinationSearchScreen.tsx    # 🔍 Live search with doctor tags & quick hospital chips
│   │   ├── HospitalSelectScreen.tsx       # 🏥 Hospital choice, BLS/ALS selector & route mini-map preview
│   │   ├── DispatchSearchScreen.tsx       # 🔮 4s Ethereal Orb countdown & emergency telemetry log
│   │   ├── LiveTrackingScreen.tsx         # 🗺️ Rapido-style tracking, 4-box PIN [2][9][7][9] & arrived state
│   │   ├── AiAssistantScreen.tsx          # 🤖 NVIDIA NIM Medical AI, STT Mic, Mute toggle & CPR metronome
│   │   ├── HospitalListScreen.tsx         # 🏥 Sector 128 Trauma Centers, Doctor rosters & Phone dialer
│   │   ├── BookingHistoryScreen.tsx       # 📜 Past medical dispatches & resume active trip
│   │   └── ProfileScreen.tsx              # 👤 Emergency Medical ID (Blood Group O+ve, Allergies, SOS)
│   ├── services/
│   │   ├── fareService.ts                 # 💵 Distance-based fare calculation (Base + Per Km + GST)
│   │   ├── googleMapsService.ts           # 🛣️ OSRM & Google Directions routing & Geocoding
│   │   ├── locationService.ts             # 📍 Browser GPS detection & Sector 128 Noida presets
│   │   ├── mockDataService.ts             # 🏥 Verified Sector 128 hospital data, doctors & MOCK_DRIVER
│   │   ├── nvidiaAiService.ts             # 🤖 NVIDIA NIM meta/llama-3.1-70b-instruct API connector
│   │   └── soundService.ts                # 🔊 Web Audio API oscillators (Sonar, Siren, CPR Metronome, TTS)
│   └── store/
│       ├── useBookingStore.ts             # 🏪 Screen navigation, active booking, pickup & OTP store
│       ├── useDriverStore.ts              # 🚗 Driver coordinates, heading, phase & route polyline
│       └── useChatStore.ts                # 💬 AI conversation history & NVIDIA NIM loading state
├── App.tsx                                # 📱 Root application container & screen router
├── vercel.json                            # ⚡ Vercel zero-config single-page app deployment config
└── package.json                           # 📦 Project dependencies & build scripts
```

---

## ✨ Key Features (मुख्य विशेषताएं)

### 1. 🗺️ Hyper-Realistic Live Route Map
- **OpenStreetMap / CartoDB Voyager HD Tiles**: Crisp rendering of roads, landmarks, and street labels (`Noida-Greater Noida Expressway`, `Pragati Marg`, `Jaypee Greens Wish Town`).
- **3D Ambulance with Flashing LED Strobe Siren**: Top-down 3D ambulance vehicle icon with alternating **Red & Blue flashing LED strobe lights** (`@keyframes siren-strobe`) and smooth heading angle alignment.
- **Double-Cased Dynamically Shrinking Route Polyline**: High-contrast blue route line that automatically shortens in real time behind the approaching vehicle as it drives closer to the user's doorstep.
- **Live Sector 128 Patrol Fleet**: 3 live active ambulance units patrolling Wish Town and the Expressway with real-time response counters.

### 2. 🚑 Rapido-Style Booked Screen (Pixel-Perfect)
- **Royal Blue Header Banner**: Dynamic header switching between *"Walk to your pickup-point"* and *"🚨 AMBULANCE ARRIVED AT YOUR LOCATION"*.
- **In-Screen 4-Box PIN**: Secure 4-digit code displayed in **4 individual bordered square boxes** `[ 2 ] [ 9 ] [ 7 ] [ 9 ]` with a 1-tap copy action (*"✓ Copied"*).
- **Captain Profile Card**: Vehicle registration (`UP 16 EM 4092`), exact model (`FORCE TRAVELLER 3350 ICU-ALS`), medical equipment badges, and purple `[ Never Cancels ⭐ ]` trust badge.
- **5-Minute Arrival Protection**: Prevents accidental trip cancellations while emergency paramedics are en route.

### 3. 🏥 Verified Sector 128 Noida Hospital Network
- **Jaypee Hospital (Sector 128, Noida)** — *0.8 km • 3 mins • 18 ICU Beds • Dr. Rajesh Sharma (Director Cardiac)*
- **Yatharth Super Speciality Hospital (Sector 110)** — *2.1 km • 5 mins • 14 ICU Beds • Dr. Amit Gupta (Trauma Lead)*
- **Felix Hospital (Sector 137, Noida)** — *2.8 km • 7 mins • 11 ICU Beds • Dr. Sneha Roy (Emergency Medicine)*
- **Max Super Speciality Hospital (Noida Hub)** — *3.5 km • 8 mins • 24 ICU Beds • Dr. Vikram Malhotra (Neuro/Trauma)*
- **Fortis Hospital (Sector 62)** — *4.2 km • 11 mins • 16 ICU Beds • Dr. P. K. Mishra (Cardiology)*
- **Kailash Hospital & Neuro Institute (Sector 27)** — *4.8 km • 12 mins • 12 ICU Beds • Dr. Arvind Kumar*
- **Apollo Hospitals (Sector 26)** — *5.1 km • 13 mins • 15 ICU Beds • Dr. Sunita Rao*
- **Metro Heart Institute with Multispeciality (Sector 12)** — *5.6 km • 14 mins • 10 ICU Beds*

### 4. 🤖 NVIDIA NIM Medical AI & Emergency Tools
- **NVIDIA NIM meta/llama-3.1-70b-instruct**: Fast AI emergency triage and first-aid instructions.
- **CPR Metronome (110 BPM)**: Audio-visual chest compression tool matching international resuscitation guidelines.
- **Audio Mute Control**: Muted by default with a header speaker button (`Volume2` / `VolumeX`) for user control.

---

## 🚀 Getting Started (शुरू कैसे करें)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/kartik098ki/savelife.git
cd savelife
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NVIDIA_NIM_API_KEY=your_nvidia_nim_api_key
```

### 4. Run Development Server
```bash
# Start Web application
npm run web

# Or with Expo CLI
npx expo start --web --port 8081
```
Open **[http://localhost:8081](http://localhost:8081)** in your browser.

---

## ⚡ Deployment on Vercel (Vercel पर डिप्लॉयमेंट)

The project includes pre-configured **`vercel.json`** for zero-config production deployment:

```bash
# Test production web export locally
npm run build
```

### Steps to Deploy:
1. Push your code to GitHub (`git push origin main`).
2. Log in to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Select **`kartik098ki/savelife`**.
4. Vercel automatically detects `vercel.json` and runs `npm run build` with output directory `dist`.
5. Add your `NVIDIA_NIM_API_KEY` and `GOOGLE_MAPS_API_KEY` under **Environment Variables**.
6. Click **Deploy**! 🚀

---

## 👨‍💻 Author & Contributions
- **Kartik Guleria** — [GitHub Profile](https://github.com/kartik098ki)
- Repository: [https://github.com/kartik098ki/savelife](https://github.com/kartik098ki/savelife)

---

## 📄 License
This project is licensed under the MIT License.
