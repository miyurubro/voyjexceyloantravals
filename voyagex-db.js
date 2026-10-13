/**
 * VoyageX Ceylon Travels - Master Data & Sync Engine
 * Real-time synchronization for Tourist Portal, Admin Control, Fleet GPS & Tour Plans
 */

(function (global) {
    const STORAGE_KEY = 'voyagex_ceylon_db_v1';
    const SYNC_CHANNEL = 'voyagex_channel_sync';
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(SYNC_CHANNEL) : null;

    // Sri Lanka Curated Top Attractions
    const SRI_LANKA_DESTINATIONS = [
        {
            id: 'sigiriya',
            name: 'Sigiriya Rock Fortress',
            sinhalaName: 'සීගිරිය',
            region: 'Cultural Triangle',
            category: 'heritage',
            lat: 7.9570,
            lng: 80.7603,
            image: 'images/tour_sigiriya.png',
            desc: 'The UNESCO 5th-century palace in the sky with ancient frescoes, water gardens and breathtaking 360° summit views.',
            recommendedHours: 3.5,
            tag: 'Top Rated UNESCO'
        },
        {
            id: 'kandy',
            name: 'Temple of the Sacred Tooth Relic (Kandy)',
            sinhalaName: 'ශ්‍රී දළදා මාළිගාව',
            region: 'Central Highlands',
            category: 'heritage',
            lat: 7.2936,
            lng: 80.6413,
            image: 'images/tour_kandy.png',
            desc: 'The spiritual heart of Sri Lanka housing the sacred tooth relic of Lord Buddha inside a golden roofed royal palace.',
            recommendedHours: 2.5,
            tag: 'Spiritual Wonder'
        },
        {
            id: 'ella',
            name: 'Nine Arch Bridge & Ella Rock',
            sinhalaName: 'ඇල්ල ආරුක්කු නවයේ පාලම',
            region: 'Hill Country',
            category: 'nature',
            lat: 6.8768,
            lng: 81.0608,
            image: 'images/tour_ella.png',
            desc: 'Famous colonial viaduct surrounded by dense jungle and tea plantations, with iconic blue trains passing over.',
            recommendedHours: 3.0,
            tag: 'Scenic & Photography'
        },
        {
            id: 'nuwaraeliya',
            name: 'Nuwara Eliya Tea Country & Gregory Lake',
            sinhalaName: 'නුවරඑළිය තේ වතු',
            region: 'Hill Country',
            category: 'nature',
            lat: 6.9697,
            lng: 80.7891,
            image: 'images/tea.jpg',
            desc: 'Known as Little England with cool misty climate, sprawling emerald tea estates, colonial bungalows and waterfalls.',
            recommendedHours: 4.0,
            tag: 'Misty Highlands'
        },
        {
            id: 'yala',
            name: 'Yala National Park Safari',
            sinhalaName: 'යාල ජාතික වනෝද්‍යානය',
            region: 'Southern Wildlife',
            category: 'wildlife',
            lat: 6.3686,
            lng: 81.5204,
            image: 'images/thebest.jpg',
            desc: 'World famous sanctuary boasting the highest leopard density on earth, wild elephants, sloth bears, and crocodiles.',
            recommendedHours: 4.5,
            tag: 'Leopard & Safari'
        },
        {
            id: 'galle',
            name: 'Galle Dutch Fort & Lighthouse',
            sinhalaName: 'ගාල්ල ලන්දේසි කොටුව',
            region: 'Southern Coast',
            category: 'coastal',
            lat: 6.0268,
            lng: 80.2170,
            image: 'images/tours.jpg',
            desc: 'Living 17th-century European fortress on the ocean rim with cobblestone lanes, chic cafes and historic bastion walls.',
            recommendedHours: 3.0,
            tag: 'Ocean Ramparts'
        },
        {
            id: 'mirissa',
            name: 'Mirissa Whale Watching & Coconut Tree Hill',
            sinhalaName: 'මිරිස්ස තල්මසුන් නැරඹීම',
            region: 'Southern Coast',
            category: 'coastal',
            lat: 5.9465,
            lng: 80.4578,
            image: 'images/bghome.png',
            desc: 'Tropical crescent bay famous for blue whale and dolphin excursions, surfing, and the palm tree sunset dome.',
            recommendedHours: 3.5,
            tag: 'Whales & Sunset'
        },
        {
            id: 'minneriya',
            name: 'Minneriya Wild Elephant Gathering',
            sinhalaName: 'මින්නේරිය අලි රංචුව',
            region: 'North Central',
            category: 'wildlife',
            lat: 8.0336,
            lng: 80.8994,
            image: 'images/service_guide.png',
            desc: 'The largest congregation of Asian elephants in the world around the ancient Minneriya tank reservoir.',
            recommendedHours: 3.5,
            tag: 'World Wonder Wildlife'
        },
        {
            id: 'anuradhapura',
            name: 'Anuradhapura Sacred Ancient Kingdom',
            sinhalaName: 'අනුරාධපුර පුජා නගරය',
            region: 'Ancient Cities',
            category: 'heritage',
            lat: 8.3500,
            lng: 80.4037,
            image: 'images/custom.png',
            desc: '2,500-year-old capital boasting towering white stupas (Ruwanwelisaya) and the sacred Jaya Sri Maha Bodhi tree.',
            recommendedHours: 4.0,
            tag: 'Ancient Heritage'
        },
        {
            id: 'colombo',
            name: 'Colombo City & Lotus Tower',
            sinhalaName: 'කොළඹ නෙළුම් කුළුණ',
            region: 'Western Province',
            category: 'urban',
            lat: 6.9271,
            lng: 79.8612,
            image: 'images/CityOfDreams.jpg',
            desc: 'Sri Lanka’s vibrant commercial capital blending colonial architecture, bustling markets, and the 350m Lotus Tower.',
            recommendedHours: 3.0,
            tag: 'Capital City'
        },
        {
            id: 'dambulla',
            name: 'Dambulla Golden Cave Temples',
            sinhalaName: 'දඹුල්ල රන් විහාරය',
            region: 'Cultural Triangle',
            category: 'heritage',
            lat: 7.8567,
            lng: 80.6485,
            image: 'images/service_transport.png',
            desc: 'Magnificent ancient cave monastery featuring 153 Buddha statues and stunning ceiling mural frescoes.',
            recommendedHours: 2.5,
            tag: 'Ancient Caves'
        },
        {
            id: 'trincomalee',
            name: 'Trincomalee & Pigeon Island Marine Park',
            sinhalaName: 'ත්‍රිකුණාමලය පරවි දූපත',
            region: 'Eastern Province',
            category: 'coastal',
            lat: 8.5874,
            lng: 81.2152,
            image: 'images/bord.png',
            desc: 'Pristine white sand beaches, turquoise waters for coral snorkeling, blacktip reef sharks, and Koneswaram temple.',
            recommendedHours: 4.0,
            tag: 'Coral Snorkeling'
        }
    ];

    // Initial Company Fleet
    const INITIAL_VEHICLES = [
        {
            id: 'veh_01',
            plateNumber: 'WP CAG-4512',
            model: 'Toyota KDH Super GL Luxury Van',
            type: 'Van (9 Seater)',
            capacity: 9,
            driverName: 'Sunil Perera',
            driverPhone: '+94777520883',
            driverPhoto: 'images/service_guide.png',
            driverRating: 4.9,
            lat: 7.2906,
            lng: 80.6337,
            currentLocationName: 'Kandy Lake Round, Central Province',
            status: 'En Route',
            speed: '45 km/h',
            heading: 140,
            currentPlanId: 'plan_vx_101',
            assignedTourists: ['Emily Watson (UK)', 'Marco Rossi (IT)']
        },
        {
            id: 'veh_02',
            plateNumber: 'WP WP-8821',
            model: 'Toyota Land Cruiser Prado 4x4',
            type: 'Luxury SUV (5 Seater)',
            capacity: 5,
            driverName: 'Nimal Fernando',
            driverPhone: '+94703154013',
            driverPhoto: 'images/service_guide.png',
            driverRating: 5.0,
            lat: 7.9620,
            lng: 80.7550,
            currentLocationName: 'Sigiriya Rock Access Road, Matale',
            status: 'At Attraction',
            speed: '0 km/h',
            heading: 0,
            currentPlanId: null,
            assignedTourists: []
        },
        {
            id: 'veh_03',
            plateNumber: 'WP CAB-1190',
            model: 'Toyota Prius Luxury Hybrid',
            type: 'Sedan (4 Seater)',
            capacity: 4,
            driverName: 'Kasun Jayawardena',
            driverPhone: '+94712345678',
            driverPhoto: 'images/service_guide.png',
            driverRating: 4.8,
            lat: 6.8720,
            lng: 81.0450,
            currentLocationName: 'Ella Pass Valley, Badulla',
            status: 'En Route',
            speed: '38 km/h',
            heading: 210,
            currentPlanId: null,
            assignedTourists: []
        },
        {
            id: 'veh_04',
            plateNumber: 'WP ND-6743',
            model: 'Luxury Coaster Coach',
            type: 'Mini Coach (22 Seater)',
            capacity: 22,
            driverName: 'Dinesh Bandara',
            driverPhone: '+94778899001',
            driverPhoto: 'images/service_guide.png',
            driverRating: 4.9,
            lat: 6.0350,
            lng: 80.2200,
            currentLocationName: 'Galle Fort Ramparts, Southern Province',
            status: 'Parked',
            speed: '0 km/h',
            heading: 0,
            currentPlanId: null,
            assignedTourists: []
        }
    ];

    // Initial Live Sri Lanka Special Events (Cultural, Wildlife, Seasonal)
    const INITIAL_EVENTS = [
        {
            id: 'evt_01',
            title: 'Kandy Esala Perahera Cultural Procession',
            sinhalaTitle: 'මහනුවර ඇසළ පෙරහැර මංගල්‍යය',
            location: 'Kandy City & Temple of the Tooth',
            lat: 7.2936,
            lng: 80.6413,
            radiusKm: 15,
            category: 'cultural',
            date: 'Today & Tonight (Special Festival)',
            highlight: 'Spectacular royal pageant with 50+ decorated tuskers, traditional Kandyan dancers, and fire jugglers. Best view near Dalada Maligawa after 6:30 PM.',
            active: true
        },
        {
            id: 'evt_02',
            title: 'Peak Asian Elephant Gathering (120+ Herd)',
            sinhalaTitle: 'මින්නේරිය දැවැන්ත අලි රංචුව',
            location: 'Minneriya National Park Tank',
            lat: 8.0336,
            lng: 80.8994,
            radiusKm: 22,
            category: 'wildlife',
            date: 'Active Daily from 3:30 PM to 6:00 PM',
            highlight: 'Massive wild elephant herd spotted near reservoir banks with tender calves. Rare photo window right now! Chauffeur can arrange private 4x4 entry.',
            active: true
        },
        {
            id: 'evt_03',
            title: 'Blue Whale & Dolphin Migration Pod Sighted',
            sinhalaTitle: 'මිරිස්ස මුහුදේ නිල් තල්මසුන්',
            location: 'Mirissa Marine Trench Off-Coast',
            lat: 5.9465,
            lng: 80.4578,
            radiusKm: 18,
            category: 'wildlife',
            date: 'Morning Window 6:30 AM - 11:30 AM',
            highlight: 'Unusually calm sea conditions with 3 blue whales breaching within 4 nautical miles. Catamaran expeditions running right now.',
            active: true
        },
        {
            id: 'evt_04',
            title: 'Scenic Ramboda Falls Peak Cascade & Tea Plucking Experience',
            sinhalaTitle: 'රම්බොඩ දියඇල්ල සහ තේ අත්දැකීම',
            location: 'Ramboda Pass, Nuwara Eliya Road',
            lat: 7.0520,
            lng: 80.7010,
            radiusKm: 15,
            category: 'scenic',
            date: 'Fresh Morning Visibility',
            highlight: 'Crystal clear misty mountain panorama. High-elevation tea factory has live fresh green leaf tea plucking workshops for visitors today.',
            active: true
        },
        {
            id: 'evt_05',
            title: 'Galle Fort Sunset Artisan & Street Gastronomy Fair',
            sinhalaTitle: 'ගාල්ල කොටුව සවස කලා හා ආහාර සැණකෙළිය',
            location: 'Galle Dutch Fort Ramparts',
            lat: 6.0268,
            lng: 80.2170,
            radiusKm: 14,
            category: 'cultural',
            date: 'Evenings from 4:30 PM',
            highlight: 'Local gemstone crafters, live acoustic folk violinists, and fresh grilled lobster stalls set along the historic sea walls.',
            active: true
        }
    ];

    // Initial 5 Sample Tourist Submissions for Testing the 5-Tourist Group Flow
    const INITIAL_TOURISTS = [
        {
            id: 'tourist_101',
            referenceCode: 'VX-7821',
            name: 'Emily Watson',
            country: 'United Kingdom',
            phone: '+447911123456',
            email: 'emily.watson@example.co.uk',
            groupSize: 2,
            travelDates: '2026-10-18 to 2026-10-25',
            durationDays: 7,
            vibe: 'Cultural & Nature Discovery',
            priorities: ['sigiriya', 'kandy', 'ella', 'yala', 'galle'],
            notes: 'Love history, scenic photography, and comfortable private transport.',
            createdAt: '2026-10-13T10:15:00Z',
            assignedPlanId: 'plan_vx_101',
            status: 'assigned'
        },
        {
            id: 'tourist_102',
            referenceCode: 'VX-7822',
            name: 'Marco Rossi',
            country: 'Italy',
            phone: '+393401234567',
            email: 'marco.rossi@example.it',
            groupSize: 2,
            travelDates: '2026-10-19 to 2026-10-26',
            durationDays: 7,
            vibe: 'Scenic Highlands & Coast',
            priorities: ['kandy', 'sigiriya', 'nuwaraeliya', 'ella', 'mirissa'],
            notes: 'Interested in Ceylon tea trails and whale watching.',
            createdAt: '2026-10-13T11:20:00Z',
            assignedPlanId: 'plan_vx_101',
            status: 'assigned'
        },
        {
            id: 'tourist_103',
            referenceCode: 'VX-7823',
            name: 'Akira Tanaka',
            country: 'Japan',
            phone: '+819012345678',
            email: 'akira.tanaka@example.jp',
            groupSize: 1,
            travelDates: '2026-10-20 to 2026-10-27',
            durationDays: 7,
            vibe: 'Ancient Heritage & Tranquility',
            priorities: ['sigiriya', 'anuradhapura', 'kandy', 'nuwaraeliya', 'colombo'],
            notes: 'Keen on Buddhist heritage, temple architecture, and peaceful nature.',
            createdAt: '2026-10-13T12:05:00Z',
            assignedPlanId: null,
            status: 'pending'
        },
        {
            id: 'tourist_104',
            referenceCode: 'VX-7824',
            name: 'Sarah Jenkins',
            country: 'Australia',
            phone: '+61412345678',
            email: 'sarah.j@example.au',
            groupSize: 2,
            travelDates: '2026-10-21 to 2026-10-28',
            durationDays: 7,
            vibe: 'Wildlife & Adventure',
            priorities: ['ella', 'yala', 'mirissa', 'galle', 'sigiriya'],
            notes: 'Huge wildlife fan! Want to spot leopards, elephants and surf southern coast.',
            createdAt: '2026-10-13T13:40:00Z',
            assignedPlanId: null,
            status: 'pending'
        },
        {
            id: 'tourist_105',
            referenceCode: 'VX-7825',
            name: 'Liam O\'Connor',
            country: 'Ireland',
            phone: '+353871234567',
            email: 'liam.oc@example.ie',
            groupSize: 3,
            travelDates: '2026-10-22 to 2026-10-29',
            durationDays: 7,
            vibe: 'Signature Ceylon Grand Tour',
            priorities: ['sigiriya', 'kandy', 'ella', 'yala', 'mirissa'],
            notes: 'Family trip. Need spacious air-conditioned vehicle with courteous guide.',
            createdAt: '2026-10-13T14:10:00Z',
            assignedPlanId: null,
            status: 'pending'
        }
    ];

    // Initial Tour Plan
    const INITIAL_TOUR_PLANS = [
        {
            id: 'plan_vx_101',
            title: 'Ceylon Golden Heritage & Highland Odyssey',
            slug: 'ceylon-golden-heritage-highland-odyssey',
            generatedDate: '2026-10-13T15:00:00Z',
            durationDays: 7,
            totalTravelers: 4,
            assignedTourists: ['tourist_101', 'tourist_102'],
            assignedVehicleId: 'veh_01',
            assignedDriver: {
                name: 'Sunil Perera',
                phone: '+94777520883',
                rating: 4.9,
                vehicleModel: 'Toyota KDH Super GL Luxury Van',
                plate: 'WP CAG-4512'
            },
            status: 'Active & Confirmed',
            destinations: ['sigiriya', 'kandy', 'nuwaraeliya', 'ella', 'yala', 'galle'],
            itinerary: [
                {
                    day: 1,
                    title: 'Airport Arrival & Sigiriya Ancient Citadel',
                    destination: 'sigiriya',
                    highlights: 'VIP welcome at Colombo BIA airport, private transfer to Sigiriya, climb the iconic 5th-century Lion Rock fortress at golden hour.',
                    stay: 'Sigiriya Heritage Eco Resort',
                    driveTime: '3.5 hrs'
                },
                {
                    day: 2,
                    title: 'Dambulla Golden Caves & Kandy Royal Capital',
                    destination: 'kandy',
                    highlights: 'Explore Dambulla cave murals, scenic drive through spice hills to Kandy. Evening puja ceremony at Temple of the Sacred Tooth Relic.',
                    stay: 'The Grand Kandyan Hotel',
                    driveTime: '2.5 hrs'
                },
                {
                    day: 3,
                    title: 'Misty Tea Gardens & Little England',
                    destination: 'nuwaraeliya',
                    highlights: 'Scenic hill climb past Ramboda Falls. Tour Mackwoods high-grown tea factory with tea tasting and leisurely stroll along Lake Gregory.',
                    stay: 'Grand Hotel Nuwara Eliya',
                    driveTime: '2.5 hrs'
                },
                {
                    day: 4,
                    title: 'Iconic Blue Train & Nine Arch Bridge',
                    destination: 'ella',
                    highlights: 'Breathtaking mountain railway journey to Ella. Walk across the architectural Nine Arch Viaduct surrounded by lush forest.',
                    stay: '98 Acres Resort & Spa Ella',
                    driveTime: '2.0 hrs'
                },
                {
                    day: 5,
                    title: 'Ravana Falls & Yala Leopard Safari',
                    destination: 'yala',
                    highlights: 'Descend through Ravana waterfalls gorge to the dry zone. Private 4x4 open-top jeep safari in Block 1 for leopards and elephants.',
                    stay: 'Cinnamon Wild Yala',
                    driveTime: '2.5 hrs'
                },
                {
                    day: 6,
                    title: 'Southern Golden Coastline & Galle Dutch Fort',
                    destination: 'galle',
                    highlights: 'Drive along the turquoise southern ocean rim. Walk atop the 17th-century Galle Fort ramparts, sunset lighthouse view and dining.',
                    stay: 'Fort Bazaar Boutique Hotel',
                    driveTime: '2.0 hrs'
                },
                {
                    day: 7,
                    title: 'Colombo City Highlights & Airport Departure',
                    destination: 'colombo',
                    highlights: 'Morning coastal highway cruise, brief panoramic tour of Colombo Lotus Tower and Independence Square, transfer to airport for departure.',
                    stay: 'Departure',
                    driveTime: '2.0 hrs'
                }
            ],
            notes: 'Generated automatically by VoyageX Ceylon AI from aggregated tourist priority votes with optimal geographical routing.'
        }
    ];

    // Initial Alerts
    const INITIAL_ALERTS = [
        {
            id: 'alt_01',
            vehicleId: 'veh_01',
            vehiclePlate: 'WP CAG-4512',
            driverName: 'Sunil Perera',
            driverPhone: '+94777520883',
            eventId: 'evt_01',
            eventTitle: 'Kandy Esala Perahera Cultural Procession',
            distanceKm: 0.8,
            timestamp: new Date().toISOString(),
            status: 'sent',
            alertMessage: 'SPECIAL SIGHT NEARBY! Vehicle WP CAG-4512 is currently 0.8 km from Kandy Esala Perahera. Don\'t miss the festive procession near Temple of the Tooth!'
        }
    ];

    // Data Store Class
    class VoyageXDB {
        constructor() {
            this.listeners = [];
            this.init();
            this.listenToSync();
            this.initServerSync();
        }

        init() {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                this.state = {
                    destinations: SRI_LANKA_DESTINATIONS,
                    vehicles: INITIAL_VEHICLES,
                    events: INITIAL_EVENTS,
                    tourists: INITIAL_TOURISTS,
                    tourPlans: INITIAL_TOUR_PLANS,
                    alerts: INITIAL_ALERTS,
                    lastSync: new Date().toISOString()
                };
                this.save(false);
            } else {
                try {
                    this.state = JSON.parse(stored);
                    if (!this.state.destinations || this.state.destinations.length === 0) this.state.destinations = SRI_LANKA_DESTINATIONS;
                    if (!this.state.vehicles || this.state.vehicles.length === 0) this.state.vehicles = INITIAL_VEHICLES;
                    if (!this.state.events || this.state.events.length === 0) this.state.events = INITIAL_EVENTS;
                    if (!this.state.tourists) this.state.tourists = INITIAL_TOURISTS;
                    if (!this.state.tourPlans) this.state.tourPlans = INITIAL_TOUR_PLANS;
                    if (!this.state.alerts) this.state.alerts = INITIAL_ALERTS;
                } catch (e) {
                    console.error('Failed to parse stored DB, resetting to defaults', e);
                    this.state = {
                        destinations: SRI_LANKA_DESTINATIONS,
                        vehicles: INITIAL_VEHICLES,
                        events: INITIAL_EVENTS,
                        tourists: INITIAL_TOURISTS,
                        tourPlans: INITIAL_TOUR_PLANS,
                        alerts: INITIAL_ALERTS,
                        lastSync: new Date().toISOString()
                    };
                    this.save(false);
                }
            }
        }

        initServerSync() {
            // Check if running on localhost / HTTP server
            if (window.location.protocol.startsWith('http')) {
                this.pullFromServer();
                // Periodic polling for multi-client / multi-tab synchronization
                setInterval(() => {
                    this.pullFromServer();
                }, 2500);
            }
        }

        async pullFromServer() {
            try {
                const res = await fetch('/api/sync');
                if (res.ok) {
                    const serverData = await res.json();
                    if (serverData && serverData.lastSync) {
                        // Compare timestamps
                        if (!this.state.lastSync || new Date(serverData.lastSync).getTime() > new Date(this.state.lastSync).getTime()) {
                            this.state = serverData;
                            try {
                                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
                            } catch (e) {}
                            this.notifyListeners();
                        }
                    } else if (this.state && (!serverData || Object.keys(serverData).length === 0)) {
                        // Seed server database if empty
                        this.pushToServer();
                    }
                }
            } catch (e) {
                // Server might be offline or running file://, silent fallback
            }
        }

        async pushToServer() {
            if (!window.location.protocol.startsWith('http')) return;
            try {
                await fetch('/api/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.state)
                });
            } catch (e) {
                // silent fallback
            }
        }

        save(notify = true) {
            this.state.lastSync = new Date().toISOString();
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            } catch (e) {
                console.warn('Storage quota error', e);
            }
            if (notify) {
                this.broadcast();
            }
            this.pushToServer();
        }

        broadcast() {
            if (channel) {
                try {
                    channel.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
                } catch (e) {
                    // ignore
                }
            }
            this.notifyListeners();
        }

        listenToSync() {
            if (channel) {
                channel.onmessage = (event) => {
                    if (event.data && event.data.type === 'SYNC_UPDATE') {
                        this.reloadFromStorage();
                    }
                };
            }

            window.addEventListener('storage', (e) => {
                if (e.key === STORAGE_KEY) {
                    this.reloadFromStorage();
                }
            });
        }

        reloadFromStorage() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    this.state = JSON.parse(stored);
                    this.notifyListeners();
                }
            } catch (e) {
                console.error(e);
            }
        }

        subscribe(callback) {
            if (typeof callback === 'function') {
                this.listeners.push(callback);
            }
            return () => {
                this.listeners = this.listeners.filter(cb => cb !== callback);
            };
        }

        notifyListeners() {
            for (const cb of this.listeners) {
                try {
                    cb(this.state);
                } catch (e) {
                    console.error('Error in listener', e);
                }
            }
        }

        // --- Data Retrieval Methods ---

        getDestinations() {
            return this.state.destinations || SRI_LANKA_DESTINATIONS;
        }

        getDestinationById(id) {
            return this.getDestinations().find(d => d.id === id);
        }

        getVehicles() {
            return this.state.vehicles || [];
        }

        getVehicleById(id) {
            return this.getVehicles().find(v => v.id === id);
        }

        getEvents() {
            return this.state.events || [];
        }

        getTourists() {
            return this.state.tourists || [];
        }

        getTouristById(id) {
            return this.getTourists().find(t => t.id === id || t.referenceCode === id);
        }

        getTourPlans() {
            return this.state.tourPlans || [];
        }

        getTourPlanById(id) {
            return this.getTourPlans().find(p => p.id === id || p.slug === id);
        }

        getAlerts() {
            return this.state.alerts || [];
        }

        // --- Tourist Submission ---

        saveTourist(touristData) {
            const id = 'tourist_' + Date.now();
            const refCode = 'VX-' + Math.floor(1000 + Math.random() * 9000);
            const newTourist = {
                id,
                referenceCode: refCode,
                name: touristData.name || 'Anonymous Traveler',
                country: touristData.country || 'International',
                phone: touristData.phone || '',
                email: touristData.email || '',
                groupSize: parseInt(touristData.groupSize, 10) || 1,
                travelDates: touristData.travelDates || 'Flexible',
                durationDays: parseInt(touristData.durationDays, 10) || 7,
                vibe: touristData.vibe || 'Curated Exploration',
                priorities: Array.isArray(touristData.priorities) ? touristData.priorities : [],
                notes: touristData.notes || '',
                createdAt: new Date().toISOString(),
                assignedPlanId: null,
                status: 'pending'
            };

            this.state.tourists.unshift(newTourist);
            this.save();
            return newTourist;
        }

        // --- Fleet / Vehicle Management & GPS Tracking ---

        updateVehiclePosition(vehicleId, lat, lng, locationName, status = null, speed = null) {
            const vehicle = this.getVehicleById(vehicleId);
            if (!vehicle) return null;

            vehicle.lat = lat;
            vehicle.lng = lng;
            if (locationName) vehicle.currentLocationName = locationName;
            if (status) vehicle.status = status;
            if (speed !== null) vehicle.speed = speed;

            this.save();
            // Automatically re-evaluate proximity alerts whenever a vehicle moves!
            this.checkProximityAlerts();
            return vehicle;
        }

        updateVehicleStatus(vehicleId, updates) {
            const vehicle = this.getVehicleById(vehicleId);
            if (!vehicle) return null;
            Object.assign(vehicle, updates);
            this.save();
            return vehicle;
        }

        // --- Distance Calculation (Haversine formula in Kilometers) ---

        calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        }

        // --- Geofenced Event Proximity Detection Engine ---
        // Compares all vehicles against all active events in Sri Lanka
        checkProximityAlerts() {
            const vehicles = this.getVehicles();
            const events = this.getEvents().filter(e => e.active);
            const triggeredAlerts = [];

            for (const veh of vehicles) {
                for (const evt of events) {
                    const dist = this.calculateDistance(veh.lat, veh.lng, evt.lat, evt.lng);
                    const thresholdKm = evt.radiusKm || 15;

                    if (dist <= thresholdKm) {
                        // Check if an alert already exists for this vehicle & event within the last 2 hours
                        const existing = this.state.alerts.find(a => 
                            a.vehicleId === veh.id && a.eventId === evt.id &&
                            (Date.now() - new Date(a.timestamp).getTime()) < 2 * 60 * 60 * 1000
                        );

                        if (!existing) {
                            const newAlert = {
                                id: 'alt_' + Date.now() + '_' + Math.floor(Math.random() * 100),
                                vehicleId: veh.id,
                                vehiclePlate: veh.plateNumber,
                                driverName: veh.driverName,
                                driverPhone: veh.driverPhone,
                                eventId: evt.id,
                                eventTitle: evt.title,
                                eventCategory: evt.category,
                                highlight: evt.highlight,
                                distanceKm: parseFloat(dist.toFixed(1)),
                                timestamp: new Date().toISOString(),
                                status: 'active',
                                alertMessage: `🚨 SPECIAL SIGHT NEARBY (${dist.toFixed(1)} km)! Vehicle ${veh.plateNumber} is near "${evt.title}". Tip: ${evt.highlight}`
                            };
                            this.state.alerts.unshift(newAlert);
                            triggeredAlerts.push(newAlert);
                        }
                    }
                }
            }

            if (triggeredAlerts.length > 0) {
                this.save();
            }
            return triggeredAlerts;
        }

        // --- Add or Update Special Event ---

        saveEvent(eventData) {
            let evt = null;
            if (eventData.id) {
                evt = this.state.events.find(e => e.id === eventData.id);
            }
            if (evt) {
                Object.assign(evt, eventData);
            } else {
                evt = {
                    id: 'evt_' + Date.now(),
                    title: eventData.title || 'New Sri Lanka Special Highlight',
                    location: eventData.location || 'Sri Lanka',
                    lat: parseFloat(eventData.lat) || 7.8731,
                    lng: parseFloat(eventData.lng) || 80.7718,
                    radiusKm: parseFloat(eventData.radiusKm) || 15,
                    category: eventData.category || 'cultural',
                    date: eventData.date || 'Active Today',
                    highlight: eventData.highlight || '',
                    active: eventData.active !== undefined ? eventData.active : true
                };
                this.state.events.unshift(evt);
            }
            this.save();
            this.checkProximityAlerts();
            return evt;
        }

        // --- Smart Auto-Generation Engine ---
        // Analyzes tourist preferences, aggregates priority votes,
        // orders sights by optimal Sri Lanka geographic route,
        // and builds an all-inclusive Master Itinerary.
        autoGenerateTourPlan(touristIds = [], customTitle = null) {
            const allTourists = this.getTourists();
            // If no tourist IDs provided, pick up to 5 unassigned pending tourists
            let selectedTourists = [];
            if (touristIds && touristIds.length > 0) {
                selectedTourists = allTourists.filter(t => touristIds.includes(t.id));
            } else {
                selectedTourists = allTourists.filter(t => t.status === 'pending').slice(0, 5);
            }

            if (selectedTourists.length === 0) {
                // If all are assigned, pick any 5 tourists for demonstration
                selectedTourists = allTourists.slice(0, 5);
            }

            // 1. Calculate Destination Priority Scores across selected tourists
            const scores = {};
            selectedTourists.forEach(tourist => {
                const prefs = tourist.priorities || [];
                prefs.forEach((destId, index) => {
                    // Higher rank gives more points: 1st choice = 10 pts, 2nd = 8 pts, etc.
                    const points = Math.max(1, 10 - index * 2);
                    scores[destId] = (scores[destId] || 0) + points;
                });
            });

            // 2. Sort by highest score
            const sortedDestIds = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

            // Top picks (choose between 4 and 7 top rated destinations)
            let chosenDestIds = sortedDestIds.slice(0, 6);
            if (chosenDestIds.length < 3) {
                chosenDestIds = ['sigiriya', 'kandy', 'ella', 'yala', 'galle'];
            }

            // 3. Optimal Sri Lanka Geographic Touring Sequence:
            // Standard circuit: Airport/Negombo -> Cultural Triangle (Sigiriya/Dambulla/Anuradhapura) -> Kandy -> Nuwara Eliya -> Ella -> Yala/Udawalawe -> South Coast (Mirissa/Galle) -> Colombo
            const GEOGRAPHIC_ORDER = [
                'anuradhapura',
                'sigiriya',
                'dambulla',
                'minneriya',
                'kandy',
                'nuwaraeliya',
                'ella',
                'udawalawe',
                'yala',
                'mirissa',
                'galle',
                'colombo',
                'trincomalee'
            ];

            // Order chosen destinations by the geographic corridor
            chosenDestIds.sort((a, b) => {
                const idxA = GEOGRAPHIC_ORDER.indexOf(a);
                const idxB = GEOGRAPHIC_ORDER.indexOf(b);
                return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
            });

            // 4. Assign an Available Driver & Vehicle
            const vehicles = this.getVehicles();
            const assignedVehicle = vehicles.find(v => !v.currentPlanId) || vehicles[0];

            // 5. Build Day-by-Day Itinerary
            const destinationsMeta = this.getDestinations();
            const daysCount = Math.max(chosenDestIds.length, 5);
            const itinerary = [];

            const totalTravelers = selectedTourists.reduce((sum, t) => sum + (t.groupSize || 1), 0);

            chosenDestIds.forEach((destId, i) => {
                const dest = destinationsMeta.find(d => d.id === destId);
                const dayNum = i + 1;
                let dayTitle = '';
                let highlights = '';
                let stay = '';
                let driveTime = '2.0 - 3.5 hrs';

                if (destId === 'sigiriya' || destId === 'dambulla') {
                    dayTitle = 'Lion Rock Citadel & Ancient Cave Frescoes';
                    highlights = 'Private sunrise climb of Sigiriya rock fortress, royal water gardens, and Dambulla cave murals.';
                    stay = 'Habarana Village by Cinnamon / Sigiriya Water Garden';
                } else if (destId === 'kandy') {
                    dayTitle = 'Kandy Sacred Kingdom & Royal Botanical Sanctuary';
                    highlights = 'Evening visit to the Temple of the Sacred Tooth Relic, Kandyan drumming performance, and Peradeniya gardens.';
                    stay = 'The Grand Kandyan / Earl\'s Regency Hotel';
                } else if (destId === 'nuwaraeliya') {
                    dayTitle = 'Highland Tea Estate & Misty Waterfalls';
                    highlights = 'Scenic drive past Ramboda Falls. Hand-pluck tea leaves at an artisanal tea estate, English high tea, and Lake Gregory.';
                    stay = 'Grand Hotel Nuwara Eliya / Heritance Tea Factory';
                } else if (destId === 'ella') {
                    dayTitle = 'Nine Arch Viaduct & Ella Gap Panorama';
                    highlights = 'Walk across the Nine Arch colonial bridge for train crossings, Little Adam\'s Peak sunset hike, and Ravana falls.';
                    stay = '98 Acres Resort & Spa / EKHO Ella';
                } else if (destId === 'yala') {
                    dayTitle = 'Wild Safari Expedition & Leopard Tracking';
                    highlights = 'Open-top 4x4 safari through Yala National Park Block 1 with expert tracker. Leopard, elephant, and sloth bear sighting.';
                    stay = 'Cinnamon Wild Yala / Jetwing Yala';
                } else if (destId === 'mirissa') {
                    dayTitle = 'Ocean Whale Cruise & Coconut Tree Hill Sunset';
                    highlights = 'Early morning blue whale observation cruise, surf lessons, and golden sunset atop Coconut Tree Hill.';
                    stay = 'Triple O Six Mirissa / Sri Sharavi Beach Villas';
                } else if (destId === 'galle') {
                    dayTitle = 'Galle UNESCO Dutch Fort & Colonial Ramparts';
                    highlights = 'Walk along historic 17th-century ramparts and lighthouse, artisan jewellery shops, and beachside dining.';
                    stay = 'Fort Bazaar / Amangalla Galle';
                } else {
                    dayTitle = `${dest ? dest.name : 'Scenic Exploration'} Discovery`;
                    highlights = `Exclusive exploration of ${dest ? dest.name : 'the destination'} with private chauffeur guide and cultural tasting.`;
                    stay = 'Luxury Partner Heritage Resort';
                }

                itinerary.push({
                    day: dayNum,
                    title: dayTitle,
                    destination: destId,
                    destinationName: dest ? dest.name : destId,
                    highlights: highlights,
                    stay: stay,
                    driveTime: driveTime
                });
            });

            // 6. Create the Tour Plan Object
            const planId = 'plan_vx_' + Date.now().toString().slice(-5);
            const planTitle = customTitle || `VoyageX Ceylon Tour: ${selectedTourists.map(t => t.name.split(' ')[0]).join(' & ')} Group`;
            const planSlug = planTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            const newPlan = {
                id: planId,
                title: planTitle,
                slug: planSlug + '-' + planId,
                generatedDate: new Date().toISOString(),
                durationDays: daysCount,
                totalTravelers: totalTravelers,
                assignedTourists: selectedTourists.map(t => t.id),
                assignedVehicleId: assignedVehicle ? assignedVehicle.id : 'veh_01',
                assignedDriver: {
                    name: assignedVehicle ? assignedVehicle.driverName : 'Sunil Perera',
                    phone: assignedVehicle ? assignedVehicle.driverPhone : '+94777520883',
                    rating: assignedVehicle ? assignedVehicle.driverRating : 4.9,
                    vehicleModel: assignedVehicle ? assignedVehicle.model : 'Toyota KDH Luxury Van',
                    plate: assignedVehicle ? assignedVehicle.plateNumber : 'WP CAG-4512'
                },
                status: 'Auto-Generated & Ready',
                destinations: chosenDestIds,
                itinerary: itinerary,
                notes: `Auto-generated for ${selectedTourists.length} tourists based on top ranked preferences (${chosenDestIds.join(', ')}).`
            };

            // Update tourist statuses
            selectedTourists.forEach(t => {
                t.status = 'assigned';
                t.assignedPlanId = planId;
            });

            // Update assigned vehicle
            if (assignedVehicle) {
                assignedVehicle.currentPlanId = planId;
                assignedVehicle.assignedTourists = selectedTourists.map(t => `${t.name} (${t.country})`);
            }

            this.state.tourPlans.unshift(newPlan);
            this.save();
            return newPlan;
        }

        // --- Manual Tour Plan Editing ---

        updateTourPlan(planId, updates) {
            const plan = this.getTourPlanById(planId);
            if (!plan) return null;
            Object.assign(plan, updates);
            this.save();
            return plan;
        }

        deleteTourPlan(planId) {
            this.state.tourPlans = this.state.tourPlans.filter(p => p.id !== planId);
            this.save();
        }

        // --- WhatsApp Messaging Generators ---

        getSiteBaseUrl() {
            // Determine live or local base URL
            const loc = window.location;
            const pathname = loc.pathname;
            const dir = pathname.substring(0, pathname.lastIndexOf('/') + 1);
            return `${loc.protocol}//${loc.host}${dir}`;
        }

        buildWhatsAppShareUrl(phoneNumber, message) {
            // Clean phone number (strip spaces, dashes, ensure + or country code)
            let cleaned = (phoneNumber || '').replace(/[^0-9]/g, '');
            if (!cleaned.startsWith('94') && cleaned.startsWith('0')) {
                cleaned = '94' + cleaned.substring(1);
            }
            const encodedText = encodeURIComponent(message);
            return `https://wa.me/${cleaned}?text=${encodedText}`;
        }

        // 1. WhatsApp Message for Driver
        buildDriverWhatsAppMessage(plan) {
            const planUrl = `${this.getSiteBaseUrl()}tour-plan.html?planId=${plan.id}`;
            const touristNames = (plan.assignedTourists || []).map(tId => {
                const t = this.getTouristById(tId);
                return t ? `${t.name} (${t.country}, ${t.groupSize} pax)` : tId;
            }).join(', ');

            return `*VOYAGEX CEYLON TRAVELS - TOUR ASSIGNMENT* 🚗🇱🇰\n\n` +
                   `Hello *${plan.assignedDriver ? plan.assignedDriver.name : 'Driver'}*,\n` +
                   `You have been assigned to lead an upcoming tour!\n\n` +
                   `📋 *Trip*: ${plan.title}\n` +
                   `👥 *Tourists*: ${touristNames || 'Group of ' + plan.totalTravelers + ' travelers'}\n` +
                   `🗓️ *Duration*: ${plan.durationDays} Days\n` +
                   `🚘 *Vehicle*: ${plan.assignedDriver ? plan.assignedDriver.vehicleModel : 'Assigned Fleet'} (${plan.assignedDriver ? plan.assignedDriver.plate : ''})\n\n` +
                   `📍 *View Complete Day-by-Day Tour Plan & GPS Route on Our Website*:\n` +
                   `${planUrl}\n\n` +
                   `Please check the pickup schedule and confirm with dispatch. Hotline: +94777520883.`;
        }

        // 2. WhatsApp Message for Tourists
        buildTouristWhatsAppMessage(plan, tourist) {
            const planUrl = `${this.getSiteBaseUrl()}tour-plan.html?planId=${plan.id}`;
            const driver = plan.assignedDriver || {};

            return `*WELCOME TO SRI LANKA - VOYAGEX CEYLON TRAVELS* 🌴✨\n\n` +
                   `Dear *${tourist ? tourist.name : 'Valued Traveler'}*,\n` +
                   `Your customized Sri Lanka Tour Plan has been crafted based on your top destination choices!\n\n` +
                   `🗺️ *Your Trip*: ${plan.title}\n` +
                   `⏳ *Duration*: ${plan.durationDays} Days / ${plan.durationDays - 1} Nights\n` +
                   `👨‍✈️ *Chauffeur Guide*: ${driver.name || 'Private Chauffeur'} (${driver.phone || '+94777520883'})\n` +
                   `🚗 *Vehicle*: ${driver.vehicleModel || 'Luxury Private Van'} [${driver.plate || ''}]\n\n` +
                   `👉 *View Your Live Tour Itinerary & Interactive Map Online*:\n` +
                   `${planUrl}\n\n` +
                   `Feel free to reach out anytime via this chat. We look forward to creating unforgettable memories in paradise!`;
        }

        // 3. Proximity Event Alert WhatsApp Message
        buildEventAlertWhatsAppMessage(alert) {
            const evt = this.getEvents().find(e => e.id === alert.eventId);
            const veh = this.getVehicleById(alert.vehicleId);

            return `*SPECIAL SIGHT ALERT - VOYAGEX LIVE RADAR* 🚨🇱🇰\n\n` +
                   `Dear Driver *${alert.driverName}* & Travelers,\n` +
                   `Your vehicle is currently within *${alert.distanceKm} km* of an extraordinary special highlight:\n\n` +
                   `🌟 *${alert.eventTitle}*\n` +
                   `📍 *Location*: ${evt ? evt.location : 'Nearby'}\n` +
                   `💡 *Highlight*: ${alert.highlight || (evt ? evt.highlight : 'Prime viewing open now!')}\n\n` +
                   `We recommend a short detour or stop to experience this memorable event. Have a wonderful journey!`;
        }
    }

    // Export singleton to window
    global.VoyageXDB = new VoyageXDB();

})(window);
