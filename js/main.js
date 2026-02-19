// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Active Navigation Highlight =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== Copy IP Functions =====
function copyAddress() {
    const ip = 'tahanansmp.playwithbao.com';
    navigator.clipboard.writeText(ip).then(() => {
        showCopyNotification('Server IP copied!');
    });
}

function copyJavaIP() {
    const ip = 'tahanansmp.playwithbao.com';
    navigator.clipboard.writeText(ip).then(() => {
        showCopyNotification('Java IP copied!');
    });
}

function copyBedrockIP() {
    const ip = 'tahanansmp.playwithbao.com:41189';
    navigator.clipboard.writeText(ip).then(() => {
        showCopyNotification('Bedrock address copied! Include port!');
    });
}

// Show notification when copying
function showCopyNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #00cc66;
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        z-index: 9999;
        animation: slideIn 0.3s;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== Tab Switching =====
function switchTab(tab) {
    const javaTab = document.getElementById('java-tab');
    const bedrockTab = document.getElementById('bedrock-tab');
    const javaBtn = document.querySelectorAll('.tab-btn')[0];
    const bedrockBtn = document.querySelectorAll('.tab-btn')[1];
    
    if (tab === 'java') {
        javaTab.classList.add('active');
        bedrockTab.classList.remove('active');
        javaBtn.classList.add('active');
        bedrockBtn.classList.remove('active');
    } else {
        bedrockTab.classList.add('active');
        javaTab.classList.remove('active');
        bedrockBtn.classList.add('active');
        javaBtn.classList.remove('active');
    }
}

// ===== Server Status Simulation =====
function updateServerStatus() {
    const playerCount = document.getElementById('player-count');
    const onlinePlayers = document.getElementById('online-players');
    const serverTime = document.getElementById('server-time');
    
    // Simulate random player count between 5-25
    if (playerCount && onlinePlayers) {
        const count = Math.floor(Math.random() * 20) + 5;
        playerCount.textContent = count;
        onlinePlayers.textContent = count;
    }
    
    // Update server time
    if (serverTime) {
        const now = new Date();
        const hours = now.getUTCHours().toString().padStart(2, '0');
        const minutes = now.getUTCMinutes().toString().padStart(2, '0');
        serverTime.textContent = `${hours}:${minutes} UTC`;
    }
}

// Update every 30 seconds
setInterval(updateServerStatus, 30000);
updateServerStatus(); // Initial update

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Discord Button =====
document.getElementById('discord-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    window.open('https://discord.gg/zB2FbfKcN4', '_blank'); // Replace with your Discord invite
});

// ===== VOTE BUTTONS - UPDATED AND WORKING =====
document.querySelectorAll('.vote-card').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        
        // Get the vote URL from the target attribute
        const voteUrl = this.getAttribute('target');
        
        if (voteUrl && voteUrl !== '#') {
            // Open in new tab
            window.open(voteUrl, '_blank');
            
            // Optional: Show success message
            showCopyNotification('Thanks for voting! 🎉');
        } else {
            // Fallback if target is missing
            console.error('Vote URL not found');
            showCopyNotification('Vote link coming soon!');
        }
    });
});

// Alternative approach if target attribute doesn't work:
// You can also use this mapping approach for more control
const voteUrls = {
    'minerank': 'https://www.minerank.com/tahanansmp/vote#vote-now',
    'minecraftservers': 'https://minecraftservers.org/server/684258'
};

// If you prefer using the mapping approach, replace the above with:
/*
document.querySelectorAll('.vote-card').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const title = this.querySelector('h3')?.textContent.toLowerCase() || '';
        let voteUrl = '';
        
        if (title.includes('minerank')) {
            voteUrl = voteUrls.minerank;
        } else if (title.includes('minecraftservers')) {
            voteUrl = voteUrls.minecraftservers;
        }
        
        if (voteUrl) {
            window.open(voteUrl, '_blank');
            showCopyNotification('Thanks for voting! 🎉');
        }
    });
});
*/

// ===== Navbar Background Change on Scroll =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(8, 10, 14, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
    } else {
        navbar.style.background = 'rgba(8, 10, 14, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// ===== Feature Cards Animation on Scroll =====
const featureCards = document.querySelectorAll('.feature-card, .economy-card, .vote-card, .staff-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

featureCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(card);
});

// ===== Console Welcome Message =====
console.log('%c🏠 Tahanan SMP Website', 'font-size: 20px; color: #ffaa00;');
console.log('%cJoin us at: tahanansmp.playwithbao.com', 'font-size: 14px; color: #00aaff;');
console.log('%cBedrock Port: 41189', 'font-size: 14px; color: #00cc66;');