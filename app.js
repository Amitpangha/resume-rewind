// Telegram Web App initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing Telegram Web App...");
    
    // Check if Telegram Web App is available
    if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Initialize
        tg.ready();
        tg.expand(); // Expand to full screen
        tg.enableClosingConfirmation();
        
        console.log("Telegram Web App initialized");
        
        // Show Telegram user info if available
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            const userInfo = document.getElementById('userInfo');
            const userName = document.getElementById('userName');
            
            if (userInfo && userName) {
                userInfo.classList.remove('hidden');
                userName.textContent = 
                    `${user.first_name || ''} ${user.last_name || ''}`.trim() || `User ${user.id}`;
            }
        }
        
        // Initialize all functionality
        initializeApp(tg);
    } else {
        console.log("Not in Telegram, running in standalone mode");
        // Still initialize app functions
        initializeApp(null);
    }
});

function initializeApp(tg) {
    console.log("Initializing application functions...");
    
    // Character counter
    const resumeText = document.getElementById('resumeText');
    const charCount = document.getElementById('charCount');
    
    if (resumeText && charCount) {
        resumeText.addEventListener('input', function() {
            const length = resumeText.value.length;
            charCount.textContent = length;
            
            if (length < 100) {
                charCount.style.color = '#ff6b6b';
            } else if (length < 500) {
                charCount.style.color = '#f39c12';
            } else {
                charCount.style.color = '#27ae60';
            }
        });
        
        // Trigger once on load
        resumeText.dispatchEvent(new Event('input'));
    }
    
    // Free Analysis Button - SIMULATED VERSION (No API needed)
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            console.log("Analyze button clicked");
            const text = resumeText.value.trim();
            
            if (text.length < 50) {
                alert('Please paste a longer resume (at least 50 characters) for accurate analysis.');
                return;
            }
            
            // Show loading, hide main app
            document.getElementById('mainApp').classList.add('hidden');
            document.getElementById('loadingSection').classList.remove('hidden');
            
            console.log("Starting analysis...");
            
            // Simulate AI analysis with timeout
            setTimeout(function() {
                console.log("Analysis complete, showing results...");
                showAnalysisResult(text, tg);
            }, 2000); // 2 seconds delay
        });
    }
    
    // Premium Button - OPEN STRIPE CHECKOUT
    const premiumBtn = document.getElementById('premiumBtn');
    if (premiumBtn) {
        premiumBtn.addEventListener('click', function() {
            console.log("Premium button clicked");
            // Test Stripe link (replace with your actual Stripe link later)
            const testStripeLink = 'https://buy.stripe.com/test_6oU14m1Fa4Ra74y8LZdjO00';
            
            if (tg) {
                tg.showAlert('Opening secure payment page...');
                // Open in Telegram's browser
                tg.openLink(testStripeLink);
            } else {
                // Open in new tab if not in Telegram
                window.open(testStripeLink, '_blank');
            }
        });
    }
    
    // Upgrade Button in results
    const upgradeBtn = document.getElementById('upgradeBtn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            console.log("Upgrade button clicked");
            const testStripeLink = 'https://buy.stripe.com/test_00g5nP6jF1m7b5O3cc';
            
            if (tg) {
                tg.showAlert('Unlocking premium features...');
                // Send data to bot
                tg.sendData(JSON.stringify({
                    action: 'upgrade',
                    userId: tg.initDataUnsafe?.user?.id || 'unknown',
                    timestamp: Date.now()
                }));
                tg.openLink(testStripeLink);
            } else {
                window.open(testStripeLink, '_blank');
            }
        });
    }
    
    // New Analysis Button
    const newAnalysisBtn = document.getElementById('newAnalysisBtn');
    if (newAnalysisBtn) {
        newAnalysisBtn.addEventListener('click', function() {
            console.log("New analysis button clicked");
            document.getElementById('resultSection').classList.add('hidden');
            document.getElementById('mainApp').classList.remove('hidden');
            if (resumeText) {
                resumeText.value = '';
                resumeText.dispatchEvent(new Event('input'));
            }
        });
    }
    
    console.log("All event listeners attached successfully");
}

// Show analysis results (SIMULATED - No API needed)
function showAnalysisResult(resumeText, tg) {
    console.log("Showing analysis results...");
    
    const loadingSection = document.getElementById('loadingSection');
    const resultSection = document.getElementById('resultSection');
    
    if (loadingSection) loadingSection.classList.add('hidden');
    if (resultSection) resultSection.classList.remove('hidden');
    
    // Calculate a "score" based on text length and content (simulated)
    const score = calculateSimulatedScore(resumeText);
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) {
        scoreDisplay.textContent = `${score}/100`;
        // Color based on score
        if (score < 50) scoreDisplay.style.color = '#ff6b6b';
        else if (score < 70) scoreDisplay.style.color = '#f39c12';
        else scoreDisplay.style.color = '#27ae60';
    }
    
    // Generate simulated analysis
    const analysisHTML = generateSimulatedAnalysis(resumeText, score);
    const analysisResult = document.getElementById('analysisResult');
    if (analysisResult) {
        analysisResult.innerHTML = analysisHTML;
    }
    
    // Send analytics to bot if in Telegram
    if (tg) {
        try {
            tg.sendData(JSON.stringify({
                action: 'analysis_completed',
                userId: tg.initDataUnsafe?.user?.id || 'unknown',
                score: score,
                length: resumeText.length,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.log("Could not send analytics:", e);
        }
    }
    
    console.log("Results displayed successfully");
}

// Simulated scoring algorithm
function calculateSimulatedScore(text) {
    let score = 50; // Base score
    
    // Score based on length
    if (text.length > 1000) score += 15;
    else if (text.length > 500) score += 10;
    else if (text.length > 200) score += 5;
    
    // Score based on keywords
    const keywords = ['experience', 'project', 'skill', 'education', 'achievement', 
                     'responsibility', 'leadership', 'managed', 'developed', 'created'];
    const foundKeywords = keywords.filter(keyword => 
        text.toLowerCase().includes(keyword)
    ).length;
    score += foundKeywords * 3;
    
    // Score based on numbers (quantifiable achievements)
    const numbers = text.match(/\d+/g);
    if (numbers && numbers.length > 2) score += 10;
    
    // Add some random variation
    score += Math.floor(Math.random() * 15) - 5;
    
    // Keep between 30-95
    return Math.min(Math.max(score, 30), 95);
}

// Generate simulated analysis
function generateSimulatedAnalysis(text, score) {
    const issues = [
        "Resume length could be optimized for ATS scanning",
        "Consider adding more quantifiable achievements",
        "Some action verbs could be stronger (use 'led', 'managed', 'developed')",
        "Formatting may not be fully ATS-compatible",
        "Keyword density could be improved for your industry",
        "Consider adding a professional summary section",
        "Bullet points could be more achievement-focused",
        "Education section might need more details"
    ];
    
    const suggestions = [
        "Add numbers to quantify achievements (e.g., 'Increased sales by 30%')",
        "Use more industry-specific keywords from job descriptions",
        "Keep resume to 1-2 pages maximum for best results",
        "Start bullet points with strong action verbs",
        "Include a professional summary at the top (2-3 lines)",
        "Use consistent formatting and fonts throughout",
        "Remove unnecessary personal information",
        "Tailor resume for each job application"
    ];
    
    // Randomly select issues and suggestions
    const selectedIssues = [];
    const selectedSuggestions = [];
    
    for (let i = 0; i < 3; i++) {
        const randomIssue = issues[Math.floor(Math.random() * issues.length)];
        if (!selectedIssues.includes(randomIssue)) selectedIssues.push(randomIssue);
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        if (!selectedSuggestions.includes(randomSuggestion)) selectedSuggestions.push(randomSuggestion);
    }
    
    let html = `<h3><i class="fas fa-exclamation-triangle" style="color: #ff6b6b;"></i> Key Issues Found:</h3><ul>`;
    selectedIssues.forEach(issue => {
        html += `<li style="margin-bottom: 8px;">${issue}</li>`;
    });
    html += `</ul>`;
    
    html += `<h3 style="margin-top: 25px;"><i class="fas fa-lightbulb" style="color: #f39c12;"></i> Free Suggestions:</h3><ul>`;
    selectedSuggestions.forEach(suggestion => {
        html += `<li style="margin-bottom: 8px;">${suggestion}</li>`;
    });
    html += `</ul>`;
    
    html += `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                   color: white; padding: 20px; margin-top: 30px; border-radius: 10px; border: none;">
            <h3><i class="fas fa-crown"></i> Premium Analysis Locked</h3>
            <p>Your current score: <strong>${score}/100</strong></p>
            <p>Upgrade to <strong>Resume Rewind Premium ($9)</strong> to unlock:</p>
            <ul style="margin-left: 20px;">
                <li><strong>Full ATS compatibility score</strong> with detailed report</li>
                <li><strong>AI-rewritten resume version</strong> (professionally rewritten)</li>
                <li><strong>Industry-specific keyword optimization</strong></li>
                <li><strong>Customized cover letter template</strong></li>
                <li><strong>Detailed formatting fixes</strong> with before/after examples</li>
                <li><strong>Priority email support</strong> for 30 days</li>
            </ul>
            <button class="btn" id="premiumInResults" style="margin-top: 15px; background: white; color: #5d3fd3;">
                <i class="fas fa-rocket"></i> Upgrade Now - $9 (One-time)
            </button>
        </div>
    `;
    
    // Add event listener to the new button
    setTimeout(function() {
        const premiumInResults = document.getElementById('premiumInResults');
        if (premiumInResults) {
            premiumInResults.addEventListener('click', function() {
                const testStripeLink = 'https://buy.stripe.com/test_00g5nP6jF1m7b5O3cc';
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.openLink(testStripeLink);
                } else {
                    window.open(testStripeLink, '_blank');
                }
            });
        }
    }, 100);
    
    return html;
}

// Fallback: If Telegram not loaded after 3 seconds, show anyway
setTimeout(function() {
    if (!window.Telegram || !window.Telegram.WebApp) {
        console.log("Telegram Web App not detected, running in standalone mode");
        initializeApp(null);
    }
}, 3000);


