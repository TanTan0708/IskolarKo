document.addEventListener("DOMContentLoaded", function () {
    

  // ========================================
    // API CONFIGURATION - EDIT THESE VALUES
    // ========================================
    fetch(`/api/proxy?message=Hello%20scholarship%20finder`)
    .then(res => res.json())
    .then(data => {
        console.log("AI Reply:", data);
    });

    const AI_MODEL = "mistralai/mistral-7b-instruct:free"; // e.g., "meta-llama/llama-3.2-3b-instruct:free"

    // Data arrays for autocomplete
    const philippineUniversities = [
        "University of the Philippines Diliman", "University of the Philippines Manila", "University of the Philippines Los Baños",
        "Ateneo de Manila University", "De La Salle University", "University of Santo Tomas", "Far Eastern University",
        "Adamson University", "University of the East", "National University", "Polytechnic University of the Philippines",
        "Technological University of the Philippines", "Mapúa University", "Saint Louis University", "University of San Carlos",
        "Silliman University", "Central Philippine University", "Xavier University", "Mindanao State University",
        "University of the Philippines Visayas", "Philippine Normal University", "Bataan Peninsula State University",
        "Bulacan State University", "Cavite State University", "Laguna State Polytechnic University", 
        "Southern Luzon State University", "Bicol University", "University of Northern Philippines"
    ];

    const philippineCities = [
        "Manila", "Quezon City", "Makati", "Pasig", "Taguig", "Muntinlupa", "Parañaque", "Las Piñas", "Marikina", "Pasay",
        "Caloocan", "Malabon", "Navotas", "Valenzuela", "San Juan", "Mandaluyong",
        "Antipolo", "Bacoor", "Dasmariñas", "Imus", "General Trias", "Silang", "Carmona", "Biñan", "Santa Rosa", "Cabuyao",
        "San Pedro", "Calamba", "Los Baños", "San Pablo", "Lipa", "Batangas City", "Tanauan", "Santo Tomas",
        "Cebu City", "Lapu-Lapu", "Mandaue", "Talisay", "Toledo", "Bohol", "Tagbilaran", "Dumaguete", "Bacolod", "Iloilo City",
        "Davao City", "Cagayan de Oro", "Butuan", "General Santos", "Koronadal", "Tacloban", "Ormoc", "Maasin",
        "Baguio", "La Trinidad", "Dagupan", "San Fernando", "Angeles", "Malolos", "Meycauayan", "San Jose del Monte"
    ];

    const courses = {
        college: [
            "Computer Science", "Information Technology", "Computer Engineering", "Electronics Engineering", "Electrical Engineering",
            "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Industrial Engineering", "Aerospace Engineering",
            "Business Administration", "Marketing", "Finance", "Accounting", "Economics", "Management", "Human Resources",
            "Psychology", "Sociology", "Political Science", "Communication", "Journalism", "Mass Communication",
            "Education", "Elementary Education", "Secondary Education", "Special Education", "Physical Education",
            "Medicine", "Nursing", "Pharmacy", "Physical Therapy", "Medical Technology", "Dentistry", "Veterinary Medicine",
            "Architecture", "Interior Design", "Fine Arts", "Graphic Design", "Multimedia Arts",
            "Law", "Criminology", "Public Administration", "International Relations",
            "Biology", "Chemistry", "Physics", "Mathematics", "Statistics", "Environmental Science",
            "Agriculture", "Forestry", "Fisheries", "Food Technology", "Animal Science",
            "Tourism", "Hotel and Restaurant Management", "Culinary Arts", "Hospitality Management"
        ],
        senior_high: ["STEM", "ABM", "GAS", "HUMSS", "TVL-ICT", "TVL-HE", "TVL-IA", "Arts and Design", "Sports"],
        junior_high: ["N/A"],
        elementary: ["N/A"]
    };

    // Autocomplete functionality
    function setupAutocomplete(inputId, suggestionsId, dataArray) {
        const input = document.getElementById(inputId);
        const suggestions = document.getElementById(suggestionsId);
        let currentFocus = -1;

        input.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            suggestions.innerHTML = '';
            currentFocus = -1;

            if (!value) {
                suggestions.style.display = 'none';
                return;
            }

            const matches = dataArray.filter(item => 
                item.toLowerCase().includes(value)
            ).slice(0, 10);

            if (matches.length > 0) {
                matches.forEach(match => {
                    const div = document.createElement('div');
                    div.className = 'autocomplete-suggestion';
                    div.textContent = match;
                    div.addEventListener('click', function() {
                        input.value = match;
                        suggestions.style.display = 'none';
                    });
                    suggestions.appendChild(div);
                });
                suggestions.style.display = 'block';
            } else {
                suggestions.style.display = 'none';
            }
        });

        input.addEventListener('keydown', function(e) {
            const items = suggestions.querySelectorAll('.autocomplete-suggestion');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentFocus = Math.min(currentFocus + 1, items.length - 1);
                updateActiveItem(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentFocus = Math.max(currentFocus - 1, -1);
                updateActiveItem(items);
            } else if (e.key === 'Enter' && currentFocus >= 0) {
                e.preventDefault();
                items[currentFocus].click();
            } else if (e.key === 'Escape') {
                suggestions.style.display = 'none';
                currentFocus = -1;
            }
        });

        function updateActiveItem(items) {
            items.forEach((item, index) => {
                item.classList.toggle('active', index === currentFocus);
            });
        }

        document.addEventListener('click', function(e) {
            if (!input.contains(e.target) && !suggestions.contains(e.target)) {
                suggestions.style.display = 'none';
            }
        });
    }

    // Setup autocomplete for schools, locations, and courses
    setupAutocomplete('school', 'schoolSuggestions', philippineUniversities);
    setupAutocomplete('location', 'locationSuggestions', philippineCities);

    // Handle educational level changes
    document.getElementById('educationalLevel').addEventListener('change', function() {
        const level = this.value;
        const yearLevelSelect = document.getElementById('yearLevel');
        const courseInput = document.getElementById('course');
        
        // Update year level options
        yearLevelSelect.innerHTML = '<option value="">Select your year level</option>';
        
        let yearOptions = [];
        switch(level) {
            case 'elementary':
                yearOptions = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
                break;
            case 'junior_high':
                yearOptions = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
                break;
            case 'senior_high':
                yearOptions = ['Grade 11', 'Grade 12'];
                break;
            case 'college':
                yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', '6th Year', '7th Year', '8th Year', '9th Year', '10th Year'];
                break;
        }
        
        yearOptions.forEach(year => {
            const option = document.createElement('option');
            option.value = year.toLowerCase().replace(' ', '_');
            option.textContent = year;
            yearLevelSelect.appendChild(option);
        });

        // Update course autocomplete
        const courseData = courses[level] || ['N/A'];
        courseInput.value = '';
        setupAutocomplete('course', 'courseSuggestions', courseData);
    });

    // Form submission
    document.getElementById('scholarshipForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        
        if (AI_MODEL === "YOUR_AI_MODEL_HERE") {
            alert('Please edit the AI_MODEL variable in the JavaScript code with your chosen AI model.');
            return;
        }

        // Collect form data
        const formData = {
            educationalLevel: document.getElementById('educationalLevel').value,
            school: document.getElementById('school').value,
            location: document.getElementById('location').value,
            course: document.getElementById('course').value,
            yearLevel: document.getElementById('yearLevel').value,
            averageGrade: document.getElementById('averageGrade').value,
            familyIncome: document.getElementById('familyIncome').value
        };

        // Create prompt
        const prompt = `I am a student looking for scholarships in the Philippines. Here are my details:

    Educational Level: ${formData.educationalLevel.replace('_', ' ')}
    School: ${formData.school}
    Location: ${formData.location}
    Course/Strand: ${formData.course}
    Year Level: ${formData.yearLevel.replace('_', ' ')}
    Average Grade: ${formData.averageGrade.replace('_', '-')}
    Annual Family Income: ${formData.familyIncome.replace('_', '-').replace('k', ',000').replace('m', ',000,000')}

    Please provide me with a comprehensive list of scholarships that I am eligible for, including:
    1. Government scholarships (CHED, DOST, etc.)
    2. Private scholarships
    3. University-specific scholarships
    4. Foundation scholarships
    5. Corporate scholarships

    For each scholarship, please include:
    - Scholarship name
    - Eligibility requirements
    - Application process
    - Deadlines (if known)
    - Amount/Coverage
    - Contact information or website

    Please prioritize scholarships that best match my profile and provide practical advice on how to apply.`;

        // Show loading
        document.getElementById('loading').style.display = 'block';
        document.getElementById('results').style.display = 'none';
        document.getElementById('submitBtn').disabled = true;

        try {
            const response = await fetch('/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "mistral-7b",
                    messages: [{ role: "user", content: userInput }]
                })
            });


            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const result = data.choices[0].message.content;
                document.getElementById('resultsContent').innerHTML = result.replace(/\n/g, '<br>');
                document.getElementById('results').style.display = 'block';
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('Error:', error);
            document.getElementById('resultsContent').innerHTML = `
                <div class="error">
                    <strong>Error:</strong> Failed to get scholarship recommendations. 
                    Please check your API key and model name, then try again.
                    <br><br>
                    <strong>Error details:</strong> ${error.message}
                </div>
            `;
            document.getElementById('results').style.display = 'block';
        } finally {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('submitBtn').disabled = false;
        }
    });

    // Initialize course autocomplete with college courses by default
    setupAutocomplete('course', 'courseSuggestions', courses.college);
    
});
