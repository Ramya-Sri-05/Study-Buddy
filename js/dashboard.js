// Dashboard JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    loadUserData();
    loadRandomQuote();
    loadNotesFromFiles();
    loadVideosFromFiles();
    loadMarks();
    setupEventListeners();
    loadActivityFeed();
});

// Initialize dashboard with user data
function initializeDashboard() {
    // Get username from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username') || localStorage.getItem('username') || 'Student';
    
    // Display username in sidebar and profile
    document.getElementById('username-display').textContent = username;
    document.getElementById('profile-username').textContent = username;
    document.getElementById('detail-username').textContent = username;
}

// Load user data from home.html and home1.html
function loadUserData() {
    const branch = localStorage.getItem('branch') || 'Not Selected';
    const year = localStorage.getItem('year') || 'Not Selected';
    const subject = localStorage.getItem('subject') || 'Not Selected';
    // Load CGPA from localStorage or calculate
    let cgpa = localStorage.getItem('profileCGPA');
    if (!cgpa) {
        cgpa = calculateCGPA();
    }
    // Update profile display
    document.getElementById('user-branch-year').textContent = `${branch} • Year ${year}`;
    document.getElementById('profile-branch-year').textContent = `${branch} • Year ${year}`;
    document.getElementById('detail-branch').textContent = branch;
    document.getElementById('detail-year').textContent = `Year ${year}`;
    document.getElementById('profile-cgpa-input').value = cgpa;
    document.getElementById('detail-cgpa').textContent = cgpa;
}

// Save CGPA button
if (document.getElementById('save-cgpa-btn')) {
    document.getElementById('save-cgpa-btn').onclick = function() {
        const val = document.getElementById('profile-cgpa-input').value;
        if (val < 0 || val > 10) {
            alert('CGPA must be between 0 and 10');
            return;
        }
        localStorage.setItem('profileCGPA', val);
        document.getElementById('detail-cgpa').textContent = val;
        alert('CGPA saved!');
    };
}

// Calculate CGPA based on marks (average of finalMid/3)
function calculateCGPA() {
    const marks = JSON.parse(localStorage.getItem('marks') || '[]');
    if (marks.length === 0) return '0.00';
    const total = marks.reduce((sum, mark) => sum + mark.finalMid, 0);
    const cgpa = (total / (marks.length * 30) * 10).toFixed(2);
    return cgpa;
}

// Load random motivational quote
function loadRandomQuote() {
    const quotes = [
        {
            text: "Education is the most powerful weapon which you can use to change the world.",
            author: "Nelson Mandela"
        },
        {
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs"
        },
        {
            text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            author: "Winston Churchill"
        },
        {
            text: "The future belongs to those who believe in the beauty of their dreams.",
            author: "Eleanor Roosevelt"
        },
        {
            text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.",
            author: "Abigail Adams"
        },
        {
            text: "The more you learn, the more you earn.",
            author: "Warren Buffett"
        },
        {
            text: "Education is not preparation for life; education is life itself.",
            author: "John Dewey"
        },
        {
            text: "Your time is limited, don't waste it living someone else's life.",
            author: "Steve Jobs"
        }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('daily-quote').textContent = randomQuote.text;
    document.getElementById('quote-author').textContent = `- ${randomQuote.author}`;
}

// Load notes from notes.html
function loadNotesFromFiles() {
    const notesFromFile = [
        { title: "Unit 1: Interference", file: "../utilities/interference.pdf", viewed: true },
        { title: "Unit 2: Diffraction", file: "../utilities/diffraction.pdf", viewed: true },
        { title: "Unit 3: Polarization", file: "../utilities/polarization.pdf", viewed: true },
        { title: "Unit 4: Semiconductors", file: "../utilities/semiconductors_merged.pdf", viewed: true },
        { title: "Unit 5: Quantum Mechanics", file: "../utilities/quantum mechanics.pdf", viewed: true }
    ];
    
    const viewedNotesGrid = document.getElementById('viewed-notes-grid');
    viewedNotesGrid.innerHTML = '';
    
    notesFromFile.forEach(note => {
        const noteCard = createNoteCard(note.title, `Available PDF note for ${note.title}`, note.file, true);
        viewedNotesGrid.appendChild(noteCard);
    });
    
    // Load user created notes
    loadUserCreatedNotes();
    
    // Update stats
    updateNotesStats();
}

// Create note card element
function createNoteCard(title, content, file = null, isFromFile = false) {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    noteCard.innerHTML = `
        <div class="note-header">
            <h3>${title}</h3>
            <span class="note-date">${currentDate}</span>
        </div>
        <p>${content}</p>
        <div class="note-actions">
            ${isFromFile ? `<a href="${file}" target="_blank" class="btn-secondary">View PDF</a>` : ''}
            <button class="btn-secondary edit-note">Edit</button>
            <button class="btn-secondary delete-note">Delete</button>
        </div>
    `;
    
    return noteCard;
}

// Load user created notes
function loadUserCreatedNotes() {
    const userNotes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    const createdNotesGrid = document.getElementById('created-notes-grid');
    createdNotesGrid.innerHTML = '';
    
    userNotes.forEach(note => {
        const noteCard = createNoteCard(note.title, note.content);
        createdNotesGrid.appendChild(noteCard);
    });
}

// Update notes statistics
function updateNotesStats() {
    const viewedNotes = 5; // From notes.html
    const userNotes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    
    document.getElementById('notes-viewed').textContent = viewedNotes;
    document.getElementById('notes-created').textContent = userNotes.length;
}

// Load videos from youtube.html
function loadVideosFromFiles() {
    // Get user video state from localStorage or initialize
    let userVideoState = JSON.parse(localStorage.getItem('userVideoState') || 'null');
    if (!userVideoState) {
        userVideoState = [
            { title: "Semi Conductors", watched: false, rated: false, rating: 0 },
            { title: "Interference", watched: false, rated: false, rating: 0 },
            { title: "Diffraction", watched: false, rated: false, rating: 0 },
            { title: "Quantum Mechanics", watched: false, rated: false, rating: 0 },
            { title: "Polarization", watched: false, rated: false, rating: 0 }
        ];
        localStorage.setItem('userVideoState', JSON.stringify(userVideoState));
    }
    
    const videosGrid = document.getElementById('videos-grid');
    videosGrid.innerHTML = '';
    
    userVideoState.forEach((video, idx) => {
        const videoCard = createVideoCard(video, idx);
        videosGrid.appendChild(videoCard);
    });
    
    // Load user reviews
    loadUserReviews();
    
    // Update video stats
    updateVideoStats();
}

// Create video card element
function createVideoCard(video, idx) {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    
    videoCard.innerHTML = `
        <div class="video-thumbnail">
            <i class="fas fa-play-circle"></i>
        </div>
        <div class="video-info">
            <h3>${video.title}</h3>
            <p>${video.watched ? 'Watched' : 'Not watched'} • ${video.rated ? `${video.rating}⭐` : 'Not rated'}</p>
            <div class="video-actions">
                <button class="btn-secondary mark-watched" data-title="${video.title}" data-idx="${idx}">
                    ${video.watched ? 'Mark as Unwatched' : 'Mark as Watched'}
                </button>
                <button class="btn-secondary rate-video" data-title="${video.title}" data-idx="${idx}">
                    ${video.rated ? 'Change Rating' : 'Rate Video'}
                </button>
            </div>
        </div>
    `;
    
    return videoCard;
}

// Load user reviews
function loadUserReviews() {
    const reviews = JSON.parse(localStorage.getItem('videoReviews') || '[]');
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = '';
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="color:#b0b0b0;">No reviews yet.</p>';
        return;
    }
    
    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <div class="review-header">
                <span class="review-title">${review.title}</span>
                <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
            </div>
            <div class="review-text">${review.review}</div>
        `;
        reviewsList.appendChild(reviewItem);
    });
}

// Update video statistics
function updateVideoStats() {
    let userVideoState = JSON.parse(localStorage.getItem('userVideoState') || '[]');
    const watchedCount = userVideoState.filter(v => v.watched).length;
    const ratedCount = userVideoState.filter(v => v.rated).length;
    
    document.getElementById('total-videos').textContent = userVideoState.length;
    document.getElementById('watched-videos').textContent = watchedCount;
    document.getElementById('rated-videos').textContent = ratedCount;
    document.getElementById('videos-watched').textContent = watchedCount;
    document.getElementById('videos-rated').textContent = ratedCount;
}

// Load marks data
function loadMarks() {
    const marks = JSON.parse(localStorage.getItem('marks') || '[]');
    const marksTbody = document.getElementById('marks-tbody');
    marksTbody.innerHTML = '';
    marks.forEach((mark, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${mark.subject}</td>
            <td>${mark.mid1}</td>
            <td>${mark.mid2}</td>
            <td>${mark.finalMid}</td>
            <td>${mark.neededS}</td>
            <td>${mark.neededA}</td>
            <td>${mark.neededB}</td>
            <td>${mark.neededC}</td>
            <td>${mark.neededD}</td>
            <td>${mark.neededE}</td>
            <td><button class="btn-secondary delete-mark" data-index="${index}">Delete</button></td>
        `;
        marksTbody.appendChild(row);
    });
    updateMarksOverview();
    updateMarksChart();
}

// Get grade based on percentage
function getGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
}

// Update marks overview
function updateMarksOverview() {
    const marks = JSON.parse(localStorage.getItem('marks') || '[]');
    if (marks.length === 0) {
        document.getElementById('overall-average').textContent = '0%';
        return;
    }
    const totalFinalMid = marks.reduce((sum, mark) => sum + mark.finalMid, 0);
    const average = Math.round(totalFinalMid / marks.length);
    document.getElementById('overall-average').textContent = `${average}/30`;
}

// Update marks chart
function updateMarksChart() {
    const marks = JSON.parse(localStorage.getItem('marks') || '[]');
    const chartContainer = document.getElementById('marks-chart');
    chartContainer.innerHTML = '';
    if (marks.length === 0) {
        chartContainer.innerHTML = '<p style="text-align: center; color: #b0b0b0;">No marks data available</p>';
        return;
    }
    marks.forEach(mark => {
        const chartBar = document.createElement('div');
        chartBar.className = 'chart-bar';
        chartBar.style.height = `${(mark.finalMid/30)*100}%`;
        chartBar.innerHTML = `<span>${mark.subject}</span>`;
        chartContainer.appendChild(chartBar);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            this.classList.add('active');
            
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
    
    // Notes tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const tab = this.getAttribute('data-tab');
            document.querySelectorAll('.notes-section').forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(`${tab}-notes`).style.display = 'block';
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('notes-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const noteCards = document.querySelectorAll('.note-card');
            
            noteCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const content = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Create note button
    const createNoteBtn = document.getElementById('create-note-btn');
    if (createNoteBtn) {
        createNoteBtn.addEventListener('click', function() {
            document.getElementById('create-note-modal').style.display = 'block';
        });
    }
    
    // Add subject button
    const addSubjectBtn = document.getElementById('add-subject-btn');
    if (addSubjectBtn) {
        addSubjectBtn.addEventListener('click', function() {
            document.getElementById('add-subject-modal').style.display = 'block';
        });
    }
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Cancel buttons
    document.getElementById('cancel-add').addEventListener('click', function() {
        document.getElementById('add-subject-modal').style.display = 'none';
    });
    
    document.getElementById('cancel-note').addEventListener('click', function() {
        document.getElementById('create-note-modal').style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Form submissions
    document.getElementById('add-subject-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addSubject();
    });
    
    document.getElementById('create-note-form').addEventListener('submit', function(e) {
        e.preventDefault();
        createNote();
    });
    
    // Video actions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('mark-watched')) {
            toggleVideoWatched(e.target.getAttribute('data-title'), e.target.getAttribute('data-idx'));
        }
        
        if (e.target.classList.contains('rate-video')) {
            rateVideo(e.target.getAttribute('data-title'), e.target.getAttribute('data-idx'));
        }
    });
    
    // Delete marks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-mark')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            deleteMark(index);
        }
    });
    
    // Logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('username');
                window.location.href = 'login.html';
            }
        });
    }
}

// Add subject function (mid1, mid2 only)
function addSubject() {
    const subjectName = document.getElementById('subject-name').value;
    const mid1 = parseFloat(document.getElementById('mid1-marks').value);
    const mid2 = parseFloat(document.getElementById('mid2-marks').value);
    if (mid1 > 30 || mid2 > 30) {
        alert('Mid marks must be <= 30');
        return;
    }
    // Final mid: 75% best + 25% least
    const best = Math.max(mid1, mid2);
    const least = Math.min(mid1, mid2);
    const finalMid = Math.round((0.75 * best + 0.25 * least) * 100) / 100;
    // For each grade, calculate needed in sem (out of 70)
    const needed = {};
    const gradeThresholds = { S: 90, A: 80, B: 70, C: 60, D: 50, E: 40 };
    Object.entries(gradeThresholds).forEach(([grade, threshold]) => {
        let need = Math.ceil(threshold - finalMid);
        need = need > 0 ? need : 0;
        needed[grade] = need > 70 ? '-' : need;
    });
    const mark = {
        subject: subjectName,
        mid1,
        mid2,
        finalMid,
        neededS: needed.S,
        neededA: needed.A,
        neededB: needed.B,
        neededC: needed.C,
        neededD: needed.D,
        neededE: needed.E
    };
    const marks = JSON.parse(localStorage.getItem('marks') || '[]');
    marks.push(mark);
    localStorage.setItem('marks', JSON.stringify(marks));
    document.getElementById('add-subject-form').reset();
    document.getElementById('add-subject-modal').style.display = 'none';
    loadMarks();
    loadUserData();
    addActivity(`Added mid marks for ${subjectName}`);
}

// Create note function
function createNote() {
    const noteTitle = document.getElementById('note-title').value;
    const noteContent = document.getElementById('note-content').value;
    
    const note = {
        title: noteTitle,
        content: noteContent,
        date: new Date().toISOString()
    };
    
    const userNotes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    userNotes.push(note);
    localStorage.setItem('userNotes', JSON.stringify(userNotes));
    
    // Reset form and close modal
    document.getElementById('create-note-form').reset();
    document.getElementById('create-note-modal').style.display = 'none';
    
    // Reload notes
    loadUserCreatedNotes();
    updateNotesStats();
    
    // Add to activity
    addActivity(`Created new note: ${noteTitle}`);
}

// Toggle video watched status
function toggleVideoWatched(title, idx) {
    let userVideoState = JSON.parse(localStorage.getItem('userVideoState') || '[]');
    if (userVideoState[idx]) {
        userVideoState[idx].watched = !userVideoState[idx].watched;
        localStorage.setItem('userVideoState', JSON.stringify(userVideoState));
        loadVideosFromFiles();
        addActivity(`${userVideoState[idx].watched ? 'Watched' : 'Unwatched'} video: ${title}`);
    }
}

// Rate video function
function rateVideo(title, idx) {
    const rating = prompt(`Rate "${title}" (1-5 stars):`);
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) return;
    const review = prompt(`Write a review for "${title}":`);
    if (!review) return;
    
    let userVideoState = JSON.parse(localStorage.getItem('userVideoState') || '[]');
    if (userVideoState[idx]) {
        userVideoState[idx].rated = true;
        userVideoState[idx].rating = parseInt(rating);
        localStorage.setItem('userVideoState', JSON.stringify(userVideoState));
    }
    
    const videoReview = {
        title: title,
        rating: parseInt(rating),
        review: review,
        date: new Date().toISOString()
    };
    
    const reviews = JSON.parse(localStorage.getItem('videoReviews') || '[]');
    reviews.push(videoReview);
    localStorage.setItem('videoReviews', JSON.stringify(reviews));
    
    loadUserReviews();
    updateVideoStats();
    loadVideosFromFiles();
    addActivity(`Rated "${title}" with ${rating} stars`);
}

// Delete mark function
function deleteMark(index) {
    if (confirm('Are you sure you want to delete this mark?')) {
        const marks = JSON.parse(localStorage.getItem('marks') || '[]');
        const deletedMark = marks.splice(index, 1)[0];
        localStorage.setItem('marks', JSON.stringify(marks));
        
        loadMarks();
        loadUserData();
        
        addActivity(`Deleted marks for ${deletedMark.subject}`);
    }
}

// Add activity to recent activity list and persist
function addActivity(activityText) {
    let activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
    const activity = {
        text: activityText,
        icon: randomActivityIcon(),
        time: 'Just now'
    };
    activities.unshift(activity);
    if (activities.length > 5) activities = activities.slice(0, 5);
    localStorage.setItem('recentActivities', JSON.stringify(activities));
    loadActivityFeed();
}

function randomActivityIcon() {
    const icons = ['fas fa-plus-circle', 'fas fa-play-circle', 'fas fa-chart-line', 'fas fa-edit'];
    return icons[Math.floor(Math.random() * icons.length)];
}

// Load activity feed from localStorage
function loadActivityFeed() {
    const activityList = document.getElementById('activity-list');
    let activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
    activityList.innerHTML = '';
    if (!activities.length) {
        activityList.innerHTML = '<p style="color:#b0b0b0;">No recent activity yet.</p>';
        return;
    }
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <i class="${activity.icon}"></i>
            <div class="activity-content">
                <h4>${activity.text}</h4>
                <span class="activity-time">${activity.time}</span>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}