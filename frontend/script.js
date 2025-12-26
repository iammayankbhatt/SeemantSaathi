/* * SeemantSaathi Frontend Logic
 * Implemented by Bhumika Bhatt
 * Contains: Map logic, Multi-language support, and UI interactivity
 */

// Language state
let currentLanguage = 'en';
let selectedSymptoms = ["fever", "headache", "body-pain"];
let map;

// First aid tips data (with Hindi translations)
// TODO: In Round 2, this data can be fetched from a database
const firstAidTips = [
    {
        en: {title: "Fever Management", tips: ["Drink plenty of fluids", "Take paracetamol as directed", "Use cool compresses on forehead", "Rest and avoid exertion"]},
        hi: {title: "बुखार प्रबंधन", tips: ["बहुत सारा तरल पदार्थ पिएं", "निर्देशानुसार पैरासिटामोल लें", "माथे पर ठंडे सेक लगाएं", "आराम करें और परिश्रम से बचें"]}
    },
    {
        en: {title: "Minor Burns", tips: ["Cool burn with running water for 10-15 minutes", "Cover with sterile gauze", "Don't apply ice directly", "Don't break blisters"]},
        hi: {title: "मामूली जलन", tips: ["बहते पानी से 10-15 मिनट के लिए जलन को ठंडा करें", "बाँझ पट्टी से ढकें", "सीधे बर्फ न लगाएं", "फफोले न फोड़ें"]}
    },
    {
        en: {title: "Cuts & Wounds", tips: ["Clean with soap and water", "Apply pressure to stop bleeding", "Use antiseptic cream", "Cover with clean bandage"]},
        hi: {title: "कटे और घाव", tips: ["साबुन और पानी से साफ करें", "रक्तस्राव रोकने के लिए दबाव डालें", "एंटीसेप्टिक क्रीम लगाएं", "साफ पट्टी से ढकें"]}
    },
    {
        en: {title: "Diarrhea", tips: ["Drink ORS solution", "Avoid solid foods initially", "Stay hydrated with clear fluids", "Consult doctor if persists >24hrs"]},
        hi: {title: "दस्त", tips: ["ओआरएस घोल पिएं", "शुरू में ठोस भोजन से बचें", "स्पष्ट तरल पदार्थों से हाइड्रेटेड रहें", "यदि >24 घंटे तक बना रहे तो डॉक्टर से सलाह लें"]}
    },
    {
        en: {title: "Sprains & Strains", tips: ["Rest the injured area", "Ice for 20 minutes every 2-3 hours", "Compress with elastic bandage", "Elevate the injured limb"]},
        hi: {title: "मोच और खिंचाव", tips: ["घायल क्षेत्र को आराम दें", "हर 2-3 घंटे में 20 मिनट के लिए बर्फ लगाएं", "लोचदार पट्टी से संपीड़ित करें", "घायल अंग को ऊपर उठाएं"]}
    },
    {
        en: {title: "Heat Stroke", tips: ["Move to cool place", "Remove excess clothing", "Use cool wet cloths", "Drink cool water slowly"]},
        hi: {title: "लू लगना", tips: ["ठंडी जगह पर ले जाएं", "अतिरिक्त कपड़े हटाएं", "ठंडे गीले कपड़े का उपयोग करें", "धीरे-धीरे ठंडा पानी पिएं"]}
    }
];

// Emergency centers data (near Bhimtal, Uttarakhand)
// TODO: In Round 2, this will use PostGIS to find nearest centers based on user GPS
const emergencyCenters = [
    {name: "Bhimtal Community Health Centre", lat: 29.340, lng: 79.555, type: "government", phone: "05942-123456", distance: "8 km"},
    {name: "Haldwani Government Hospital", lat: 29.221, lng: 79.526, type: "government", phone: "05946-234567", distance: "35 km"},
    {name: "Kathgodam Medical Centre", lat: 29.268, lng: 79.548, type: "private", phone: "05946-345678", distance: "25 km"},
    {name: "Nainital District Hospital", lat: 29.392, lng: 79.463, type: "government", phone: "05942-456789", distance: "15 km"},
    {name: "Rikhanikhal Emergency Clinic", lat: 29.305, lng: 79.610, type: "private", phone: "05942-567890", distance: "12 km"}
];

// Language toggle function
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    updateLanguage();
}

// Update all text elements to current language
function updateLanguage() {
    document.getElementById('language-toggle-btn').innerHTML = `
        <i class="fas fa-globe"></i>
        <span>${currentLanguage === 'en' ? 'हिंदी' : 'English'}</span>
    `;
    
    document.querySelectorAll('[data-en]').forEach(element => {
        if (element.hasAttribute('data-hi')) {
            const text = currentLanguage === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-hi');
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                const placeholder = currentLanguage === 'en' ? 
                    element.getAttribute('data-placeholder-en') : 
                    element.getAttribute('data-placeholder-hi');
                if (placeholder) element.placeholder = placeholder;
            } else {
                element.innerHTML = text;
            }
        }
    });
    
    // Update select options
    document.querySelectorAll('option').forEach(option => {
        if (option.hasAttribute('data-en')) {
            option.textContent = currentLanguage === 'en' ? 
                option.getAttribute('data-en') : 
                option.getAttribute('data-hi');
        }
    });
    
    // Update symptom options
    document.querySelectorAll('.symptom-option').forEach(option => {
        if (option.hasAttribute('data-en')) {
            option.textContent = currentLanguage === 'en' ? 
                option.getAttribute('data-en') : 
                option.getAttribute('data-hi');
        }
    });
}

// Show first aid guide
function showFirstAidGuide() {
    const modal = document.getElementById('first-aid-modal');
    const tipsContainer = document.getElementById('first-aid-tips');
    
    tipsContainer.innerHTML = '';
    
    firstAidTips.forEach(tip => {
        const tipData = tip[currentLanguage];
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-card';
        tipElement.innerHTML = `
            <h4><i class="fas fa-heartbeat"></i> ${tipData.title}</h4>
            <ul style="margin-left: 20px;">
                ${tipData.tips.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
        tipsContainer.appendChild(tipElement);
    });
    
    modal.style.display = 'block';
}

// Show emergency centers on map
function showEmergencyCenters() {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    
    // Add emergency center markers
    emergencyCenters.forEach(center => {
        let iconColor = center.type === "government" ? "blue" : "red";
        
        L.marker([center.lat, center.lng], {
            icon: L.divIcon({
                html: `<div style="background-color: ${iconColor}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white;"><i class="fas fa-hospital"></i></div>`,
                className: 'custom-marker',
                iconSize: [28, 28]
            })
        }).addTo(map)
        .bindPopup(`<strong>${center.name}</strong><br>Type: ${center.type}<br>Phone: ${center.phone}<br>Distance: ${center.distance}`);
    });
    
    // Fit bounds to show all emergency centers
    const bounds = L.latLngBounds(emergencyCenters.map(c => [c.lat, c.lng]));
    map.fitBounds(bounds);
    
    // Show alert
    const message = currentLanguage === 'en' ? 
        `Showing ${emergencyCenters.length} emergency centers near you. Red markers are private hospitals, blue are government facilities.` :
        `आपके निकट ${emergencyCenters.length} आपातकालीन केंद्र दिखा रहा है। लाल मार्कर निजी अस्पताल हैं, नीले सरकारी सुविधाएं हैं।`;
    
    alert(message);
}

// Initialize the map
function initMap() {
    // Set coordinates for Bhimtal, Uttarakhand
    map = L.map('map').setView([29.344, 79.562], 12);
    
    // Add tile layer (using OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add initial markers for doctors (hardcoded for demo)
    const doctorLocations = [
        {name: "Dr. Sharma Clinic", lat: 29.348, lng: 79.560, type: "private"},
        {name: "Bhimtal Community Health Centre", lat: 29.340, lng: 79.555, type: "government"},
        {name: "Dr. Verma Telemedicine Center", lat: 29.352, lng: 79.565, type: "telemedicine"}
    ];
    
    // Add markers to map
    doctorLocations.forEach(location => {
        let iconColor = location.type === "government" ? "blue" : (location.type === "telemedicine" ? "green" : "red");
        
        L.marker([location.lat, location.lng], {
            icon: L.divIcon({
                html: `<div style="background-color: ${iconColor}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${location.type === "government" ? "G" : (location.type === "telemedicine" ? "T" : "P")}</div>`,
                className: 'custom-marker',
                iconSize: [24, 24]
            })
        }).addTo(map)
        .bindPopup(`<strong>${location.name}</strong><br>Type: ${location.type}<br>Click on doctor card for details`);
    });
    
    // Add user location marker
    L.marker([29.344, 79.562], {
        icon: L.divIcon({
            html: `<div style="background-color: #2a7de1; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;"><i class="fas fa-user"></i></div>`,
            className: 'custom-marker',
            iconSize: [30, 30]
        })
    }).addTo(map)
    .bindPopup(`<strong>Your Location</strong><br>Bhimtal Village`).openPopup();
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    
    // Language toggle
    document.getElementById('language-toggle-btn').addEventListener('click', toggleLanguage);
    
    // First aid modal
    document.getElementById('show-first-aid').addEventListener('click', showFirstAidGuide);
    document.getElementById('close-first-aid').addEventListener('click', function() {
        document.getElementById('first-aid-modal').style.display = 'none';
    });
    
    // Emergency centers button
    document.getElementById('show-emergency-centers').addEventListener('click', showEmergencyCenters);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('first-aid-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Symptom selection
    document.querySelectorAll('.symptom-option').forEach(option => {
        option.addEventListener('click', function() {
            const symptom = this.getAttribute('data-symptom');
            const index = selectedSymptoms.indexOf(symptom);
            
            if (index > -1) {
                // Remove symptom
                selectedSymptoms.splice(index, 1);
                this.classList.remove('selected');
            } else {
                // Add symptom
                selectedSymptoms.push(symptom);
                this.classList.add('selected');
            }
            
            console.log("Selected symptoms:", selectedSymptoms);
        });
    });
    
    // Check symptoms button
    // TODO: Connect this to backend API (BioBERT Model)
    document.getElementById('check-symptoms').addEventListener('click', function() {
        const age = document.getElementById('age').value;
        const duration = document.getElementById('duration').value;
        
        // Show loading
        document.getElementById('ai-results-container').innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--primary);"></i>
                <p style="margin-top: 10px;">${currentLanguage === 'en' ? 'AI is analyzing symptoms...' : 'एआई लक्षणों का विश्लेषण कर रहा है...'}</p>
            </div>
        `;
        
        document.getElementById('doctor-results-container').innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--primary);"></i>
                <p style="margin-top: 10px;">${currentLanguage === 'en' ? 'Finding available doctors...' : 'उपलब्ध डॉक्टर ढूंढ रहे हैं...'}</p>
            </div>
        `;
        
        setTimeout(showAIResults, 1500);
        setTimeout(showDoctorResults, 2000);
    });
});

// Show AI results (hardcoded for demo)
function showAIResults() {
    const aiResultsHTML = `
        <div style="margin-bottom: 20px;">
            <p><strong>${currentLanguage === 'en' ? 'Patient Profile:' : 'रोगी प्रोफ़ाइल:'}</strong> ${document.getElementById('age').value} ${currentLanguage === 'en' ? 'years old' : 'वर्ष'}, ${currentLanguage === 'en' ? 'symptoms for' : 'लक्षणों की अवधि'} ${document.getElementById('duration').options[document.getElementById('duration').selectedIndex].text}</p>
            <p><strong>${currentLanguage === 'en' ? 'Symptoms Detected:' : 'पाए गए लक्षण:'}</strong> ${selectedSymptoms.map(s => {
                const el = document.querySelector(`[data-symptom="${s}"]`);
                return el ? el.textContent : s.replace('-', ' ');
            }).join(', ')}</p>
        </div>
        
        <div class="condition-card">
            <div class="condition-name">
                <span>${currentLanguage === 'en' ? 'Viral Fever' : 'वायरल बुखार'}</span>
                <span>85% ${currentLanguage === 'en' ? 'confidence' : 'आत्मविश्वास'}</span>
            </div>
            <p>${currentLanguage === 'en' ? 'Common during season changes, usually resolves in 3-5 days with proper rest and hydration.' : 'मौसम बदलने के दौरान आम, आमतौर पर उचित आराम और हाइड्रेशन के साथ 3-5 दिनों में ठीक हो जाता है।'}</p>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: 85%"></div>
            </div>
            <div class="severity severity-medium">
                <i class="fas fa-exclamation-triangle"></i> ${currentLanguage === 'en' ? 'Medium Severity - See doctor within 24 hours' : 'मध्यम गंभीरता - 24 घंटे के भीतर डॉक्टर को दिखाएं'}
            </div>
        </div>
        
        <div class="condition-card">
            <div class="condition-name">
                <span>${currentLanguage === 'en' ? 'Dengue' : 'डेंगू'}</span>
                <span>10% ${currentLanguage === 'en' ? 'confidence' : 'आत्मविश्वास'}</span>
            </div>
            <p>${currentLanguage === 'en' ? 'Possible if fever persists beyond 3 days with severe body pain. Get a blood test to confirm.' : 'यदि 3 दिनों से अधिक समय तक बुखार गंभीर शरीर दर्द के साथ बना रहे तो संभव है। पुष्टि के लिए रक्त परीक्षण करवाएं।'}</p>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: 10%"></div>
            </div>
            <div class="severity severity-high">
                <i class="fas fa-exclamation-circle"></i> ${currentLanguage === 'en' ? 'High Severity - Get tested immediately' : 'उच्च गंभीरता - तुरंत परीक्षण करवाएं'}
            </div>
        </div>
        
        <div class="condition-card">
            <div class="condition-name">
                <span>${currentLanguage === 'en' ? 'Common Cold' : 'सामान्य सर्दी'}</span>
                <span>5% ${currentLanguage === 'en' ? 'confidence' : 'आत्मविश्वास'}</span>
            </div>
            <p>${currentLanguage === 'en' ? 'Less likely given high fever. Monitor symptoms and rest.' : 'उच्च बुखार को देखते हुए कम संभावना है। लक्षणों की निगरानी करें और आराम करें।'}</p>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: 5%"></div>
            </div>
            <div class="severity severity-low">
                <i class="fas fa-check-circle"></i> ${currentLanguage === 'en' ? 'Low Severity - Self-care recommended' : 'कम गंभीरता - स्व-देखभाल की सिफारिश की जाती है'}
            </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #e7f3ff; border-radius: 8px;">
            <h4><i class="fas fa-lightbulb"></i> ${currentLanguage === 'en' ? 'AI Recommendation' : 'एआई सिफारिश'}</h4>
            <p>${currentLanguage === 'en' ? 'Based on your symptoms, we recommend consulting a doctor within 24 hours. You can use telemedicine option for immediate consultation or visit a nearby clinic.' : 'आपके लक्षणों के आधार पर, हम 24 घंटे के भीतर डॉक्टर से परामर्श करने की सलाह देते हैं। आप तत्काल परामर्श के लिए टेलीमेडिसिन विकल्प का उपयोग कर सकते हैं या पास की क्लिनिक में जा सकते हैं।'}</p>
        </div>
    `;
    
    document.getElementById('ai-results-container').innerHTML = aiResultsHTML;
}

// Show doctor results (hardcoded for demo)
function showDoctorResults() {
    const doctorResultsHTML = `
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f0fff4; border-radius: 8px;">
            <p><i class="fas fa-info-circle"></i> ${currentLanguage === 'en' ? 'Found 3 doctors/clinics near you (Bhimtal, Uttarakhand)' : 'आपके निकट 3 डॉक्टर/क्लिनिक मिले (भीमताल, उत्तराखंड)'}</p>
        </div>
        
        <div class="doctor-card">
            <div class="doctor-header">
                <div class="doctor-info">
                    <h4>${currentLanguage === 'en' ? 'Dr. Ramesh Sharma' : 'डॉ. रमेश शर्मा'}</h4>
                    <div class="doctor-specialty">${currentLanguage === 'en' ? 'General Physician' : 'सामान्य चिकित्सक'}</div>
                    <div class="availability">
                        <i class="fas fa-circle"></i> ${currentLanguage === 'en' ? 'Available Today' : 'आज उपलब्ध'}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 24px; color: var(--primary);">5km</div>
                    <div style="font-size: 12px;">${currentLanguage === 'en' ? 'Distance' : 'दूरी'}</div>
                </div>
            </div>
            
            <div class="doctor-details">
                <div class="detail">
                    <i class="fas fa-clock"></i>
                    <span>${currentLanguage === 'en' ? 'Wait Time: 15 mins' : 'प्रतीक्षा समय: 15 मिनट'}</span>
                </div>
                <div class="detail">
                    <i class="fas fa-rupee-sign"></i>
                    <span>${currentLanguage === 'en' ? 'Consultation: ₹200' : 'परामर्श: ₹200'}</span>
                </div>
                <div class="detail">
                    <i class="fas fa-phone"></i>
                    <span>05942-234567</span>
                </div>
            </div>
            
            <div class="doctor-actions">
                <button class="action-btn call" onclick="alert(currentLanguage === 'en' ? 'Calling Dr. Sharma at 05942-234567...' : 'डॉ. शर्मा को 05942-234567 पर कॉल किया जा रहा है...')">
                    <i class="fas fa-phone-alt"></i> ${currentLanguage === 'en' ? 'Call Now' : 'अभी कॉल करें'}
                </button>
                <button class="action-btn book" onclick="alert(currentLanguage === 'en' ? 'Appointment booked with Dr. Sharma for today at 4:30 PM' : 'डॉ. शर्मा के साथ आज शाम 4:30 बजे नियुक्ति बुक की गई')">
                    <i class="fas fa-calendar-check"></i> ${currentLanguage === 'en' ? 'Book Appointment' : 'नियुक्ति बुक करें'}
                </button>
            </div>
        </div>
        
        <div class="doctor-card">
            <div class="doctor-header">
                <div class="doctor-info">
                    <h4>${currentLanguage === 'en' ? 'Bhimtal Community Health Centre' : 'भीमताल सामुदायिक स्वास्थ्य केंद्र'}</h4>
                    <div class="doctor-specialty">${currentLanguage === 'en' ? 'Government Hospital' : 'सरकारी अस्पताल'}</div>
                    <div class="availability">
                        <i class="fas fa-circle"></i> ${currentLanguage === 'en' ? 'Open 24/7' : '24/7 खुला'}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 24px; color: var(--primary);">8km</div>
                    <div style="font-size: 12px;">${currentLanguage === 'en' ? 'Distance' : 'दूरी'}</div>
                </div>
            </div>
            
            <div class="doctor-details">
                <div class="detail">
                    <i class="fas fa-clock"></i>
                    <span>${currentLanguage === 'en' ? 'Wait Time: 45 mins' : 'प्रतीक्षा समय: 45 मिनट'}</span>
                </div>
                <div class="detail">
                    <i class="fas fa-rupee-sign"></i>
                    <span>${currentLanguage === 'en' ? 'Consultation: Free' : 'परामर्श: मुफ्त'}</span>
                </div>
                <div class="detail">
                    <i class="fas fa-phone"></i>
                    <span>05942-123456</span>
                </div>
            </div>
            
            <div class="doctor-actions">
                <button class="action-btn call" onclick="alert(currentLanguage === 'en' ? 'Calling Community Health Centre at 05942-123456...' : 'सामुदायिक स्वास्थ्य केंद्र को 05942-123456 पर कॉल किया जा रहा है...')">
                    <i class="fas fa-phone-alt"></i> ${currentLanguage === 'en' ? 'Call Now' : 'अभी कॉल करें'}
                </button>
                <button class="action-btn book" onclick="alert(currentLanguage === 'en' ? 'No appointment needed for government hospital. You can visit directly.' : 'सरकारी अस्पताल के लिए किसी नियुक्ति की आवश्यकता नहीं है। आप सीधे जा सकते हैं।')">
                    <i class="fas fa-hospital"></i> ${currentLanguage === 'en' ? 'Visit Directly' : 'सीधे जाएं'}
                </button>
                <button class="action-btn video" onclick="alert(currentLanguage === 'en' ? 'Connecting to telemedicine service... This would integrate with e-Sanjeevani in full implementation.' : 'टेलीमेडिसिन सेवा से जुड़ रहे हैं... पूर्ण कार्यान्वयन में यह ई-संजीवनी के साथ एकीकृत होगा।')">
                    <i class="fas fa-video"></i> ${currentLanguage === 'en' ? 'Telemedicine' : 'टेलीमेडिसिन'}
                </button>
            </div>
        </div>
        
        <div class="doctor-card">
            <div class="doctor-header">
                <div class="doctor-info">
                    <h4>${currentLanguage === 'en' ? 'Dr. Priya Verma' : 'डॉ. प्रिया वर्मा'}</h4>
                    <div class="doctor-specialty">${currentLanguage === 'en' ? 'Telemedicine Specialist' : 'टेलीमेडिसिन विशेषज्ञ'}</div>
                    <div class="availability">
                        <i class="fas fa-circle"></i> ${currentLanguage === 'en' ? 'Available Now' : 'अभी उपलब्ध'}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 24px; color: var(--primary);">12km</div>
                    <div style="font-size: 12px;">${currentLanguage === 'en' ? 'Distance' : 'दूरी'}</div>
                </div>
            </div>
            
            <div class="doctor-details">
                <div class="detail">
                    <i class="fas fa-clock"></i>
                    <span>${currentLanguage === 'en' ? 'Wait Time: 0 mins' : 'प्रतीक्षा समय: 0 मिनट'}</span>
                </div>
                <div class="detail">
                    <i class="fas fa-rupee-sign"></i>
                    <span>${currentLanguage === 'en' ? 'Consultation: ₹150' : 'परामर्श: ₹150'}</span>
                </div>
                <div class="detail">
                    <i class="fas fa-laptop-medical"></i>
                    <span>${currentLanguage === 'en' ? 'Video Consultation' : 'वीडियो परामर्श'}</span>
                </div>
            </div>
            
            <div class="doctor-actions">
                <button class="action-btn video" onclick="alert(currentLanguage === 'en' ? 'Starting video consultation with Dr. Verma... This would connect via e-Sanjeevani in full implementation.' : 'डॉ. वर्मा के साथ वीडियो परामर्श शुरू किया जा रहा है... पूर्ण कार्यान्वयन में यह ई-संजीवनी के माध्यम से जुड़ेगा।')">
                    <i class="fas fa-video"></i> ${currentLanguage === 'en' ? 'Start Video Call' : 'वीडियो कॉल शुरू करें'}
                </button>
                <button class="action-btn book" onclick="alert(currentLanguage === 'en' ? 'Telemedicine appointment scheduled for right now!' : 'टेलीमेडिसिन नियुक्ति अभी के लिए निर्धारित की गई!')">
                    <i class="fas fa-calendar-check"></i> ${currentLanguage === 'en' ? 'Book Now' : 'अभी बुक करें'}
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('doctor-results-container').innerHTML = doctorResultsHTML;
}