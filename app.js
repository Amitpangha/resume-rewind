// Telegram Web App initialization
const tg = window.Telegram.WebApp;
tg.expand(); // Expand to full screen
tg.enableClosingConfirmation(); // Prevent accidental closing

// Show Telegram user info if available
if (tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    document.getElementById('userInfo').classList.remove('hidden');
    document.getElementById('userName').textContent = 
        `${user.first_name || ''} ${user.last_name || ''}`.trim() || `User ${user.id}`;
}

// Character counter
const resumeText = document.getElementById('resumeText');
const charCount = document.getElementById('charCount');

resumeText.addEventListener('input', () => {
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

// Free Analysis Button
document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const text = resumeText.value.trim();
    
    if (text.length < 50) {
        alert('Please paste a longer resume (at least 50 characters) for accurate analysis.');
        return;
    }
    
    // Show loading, hide main app
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loadingSection').classList.remove('hidden');
    
    // Simulate AI analysis (we'll replace with real API later)
    setTimeout(() => {
        showAnalysisResult(text);
    }, 2500);
});

// Premium Button
document.getElementById('premiumBtn').addEventListener('click', () => {
    tg.showAlert('Redirecting to secure payment...');
    // In production: open Stripe/Telegram Stars payment
    window.open('https://buy.stripe.com/test_00g5nP6jF1m7b5O3cc', '_blank');
});

// Upgrade Button in results
document.getElementById('upgradeBtn').addEventListener('click', () => {
    tg.showAlert('Unlocking premium features...');
    // Save user ID and mark as premium in your backend
    tg.sendData(JSON.stringify({
        action: 'upgrade',
        userId: tg.initDataUnsafe.user?.id,
        timestamp: Date.now()
    }));
    window.open('https://buy.stripe.com/test_00g5nP6jF1m7b5O3cc', '_blank');
});

// New Analysis Button
document.getElementById('newAnalysisBtn').addEventListener('click', () => {
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    resumeText.value = '';
    charCount.textContent = '0';
});

// Show analysis results
function showAnalysisResult(resumeText) {
    document.getElementById('loadingSection').classList.add('hidden');
    document.getElementById('resultSection').classList.remove('hidden');
    
    // Calculate a "score" based on text length and content (simulated)
    const score = calculateSimulatedScore(resumeText);
    document.getElementById('scoreDisplay').textContent = `${score}/100`;
    
    // Generate simulated analysis
    const analysisHTML = generateSimulatedAnalysis(resumeText, score);
    document.getElementById('analysisResult').innerHTML = analysisHTML;
    
    // Send analytics to your backend
    tg.sendData(JSON.stringify({
        action: 'analysis_completed',
        userId: tg.initDataUnsafe.user?.id,
        score: score,
        length: resumeText.length
    }));
}

// Simulated scoring algorithm
function calculateSimulatedScore(text) {
    let score = 50; // Base score
    
    // Score based on length
    if (text.length > 1000) score += 15;
    else if (text.length > 500) score += 10;
    else if (text.length > 200) score += 5;
    
    // Score based on keywords
    const keywords = ['experience', 'project', 'skill', 'education', 'achievement', 'responsibility'];
    const foundKeywords = keywords.filter(keyword => 
        text.toLowerCase().includes(keyword)
    ).length;
    score += foundKeywords * 3;
    
    // Add some random variation (simulating AI)
    score += Math.floor(Math.random() * 10) - 5;
    
    return Math.min(Math.max(score, 30), 95); // Keep between 30-95
}

// Generate simulated analysis
function generateSimulatedAnalysis(text, score) {
    const issues = [
        "Resume length could be optimized for ATS scanning",
        "Consider adding more quantifiable achievements",
        "Some action verbs could be stronger",
        "Formatting may not be fully ATS-compatible",
        "Keyword density could be improved"
    ].slice(0, 2 + Math.floor(Math.random() * 2));
    
    const suggestions = [
        "Add numbers to quantify achievements (e.g., 'Increased sales by 30%')",
        "Use more industry-specific keywords",
        "Keep resume to 1-2 pages maximum",
        "Start bullet points with strong action verbs",
        "Include a professional summary at the top"
    ].slice(0, 2);
    
    let html = `<h3><i class="fas fa-exclamation-triangle"></i> Key Issues Found:</h3><ul>`;
    issues.forEach(issue => {
        html += `<li>${issue}</li>`;
    });
    html += `</ul>`;
    
    html += `<h3 style="margin-top: 20px;"><i class="fas fa-lightbulb"></i> Free Suggestions:</h3><ul>`;
    suggestions.forEach(suggestion => {
        html += `<li>${suggestion}</li>`;
    });
    html += `</ul>`;
    
    html += `
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h4><i class="fas fa-lock"></i> Premium Analysis Locked</h4>
            <p>Upgrade to see:</p>
            <ul>
                <li><strong>Full ATS compatibility score</strong></li>
                <li><strong>AI-rewritten resume version</strong></li>
                <li><strong>Industry-specific keyword optimization</strong></li>
                <li><strong>Customized cover letter template</strong></li>
                <li><strong>Detailed formatting fixes</strong></li>
            </ul>
        </div>
    `;
    
    return html;
}

// Handle Telegram events
tg.onEvent('viewportChanged', () => {
    tg.expand();
});

// Back button handling
tg.BackButton.onClick(() => {
    if (document.getElementById('resultSection').classList.contains('hidden')) {
        tg.close();
    } else {
        document.getElementById('resultSection').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
    }
});