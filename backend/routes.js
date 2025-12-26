const router = require('express').Router();
// Note: In a production app, we would import 'pg' here for real DB queries.
// For Round 1 Prototype, we use Mock Logic to demonstrate the architecture.

// --- A. Health Check ---
router.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'SeemantSaathi API is Online', 
        uptime: process.uptime() 
    });
});

// --- B. AI Symptom Check (Mock Integration) ---
router.post('/symptoms/check', (req, res) => {
    const { age, symptoms, duration } = req.body;

    // Simulate AI Processing Delay (500ms)
    setTimeout(() => {
        // Logic: Return dummy data that matches Bhumika's Frontend expectations
        // In Round 2: This will perform an HTTP POST to the Flask BioBERT Server
        
        let diagnosis = "Viral Fever";
        let confidence = 85;
        let severity = "medium";

        // Simple keyword matching for demo
        if (symptoms.includes('chest-pain') || symptoms.includes('breathing')) {
            diagnosis = "Respiratory Infection";
            confidence = 92;
            severity = "high";
        }

        res.status(200).json({
            status: 'success',
            data: {
                diagnosis: diagnosis,
                confidence: confidence,
                severity: severity,
                summary: `Based on ${symptoms.length} symptoms over ${duration} days.`,
                recommendation: severity === "high" ? "Visit Doctor Immediately" : "Rest and Hydration"
            }
        });
    }, 500);
});

// --- C. Doctor Search (Spatial Query Mock) ---
router.get('/doctors/nearby', (req, res) => {
    const { lat, lng } = req.query;

    // In Round 2: PostGIS Query: SELECT * FROM doctors WHERE ST_DWithin(...)
    
    // Mock Response
    res.status(200).json({
        status: 'success',
        results: 3,
        data: [
            {
                id: 1,
                name: "Dr. Ramesh Sharma",
                type: "private",
                distance_km: 5,
                specialty: "General Physician",
                available: true
            },
            {
                id: 2,
                name: "Bhimtal Community Health Centre",
                type: "government",
                distance_km: 8,
                specialty: "Government Hospital",
                available: true
            },
            {
                id: 3,
                name: "Dr. Priya Verma",
                type: "telemedicine",
                distance_km: 0,
                specialty: "Telemedicine Specialist",
                available: true
            }
        ]
    });
});

// --- D. Emergency Alert ---
router.post('/emergency/alert', (req, res) => {
    const { location, symptoms } = req.body;
    
    console.log(`🚨 EMERGENCY TRIGGERED at [${location}] for symptoms: ${symptoms}`);
    
    // Logic: In real world, trigger SMS via Twilio
    
    res.status(200).json({
        status: 'success',
        message: 'Emergency protocol initiated. 108 Ambulance notified.'
    });
});

// --- E. Auth (OTP Mock) ---
router.post('/auth/otp/send', (req, res) => {
    const { phone } = req.body;
    console.log(`📨 Sending OTP to ${phone}`);
    res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
});

router.post('/auth/otp/verify', (req, res) => {
    const { phone, otp } = req.body;
    
    if (otp === "1234") {
        // Return a mock JWT token
        res.status(200).json({ 
            status: 'success', 
            token: "mock_jwt_token_for_hackathon_demo",
            user: { name: "Ram Singh", phone: phone }
        });
    } else {
        res.status(401).json({ status: 'error', message: 'Invalid OTP' });
    }
});

module.exports = router;