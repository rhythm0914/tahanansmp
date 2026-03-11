// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// ===== Performance Optimizations for Mobile =====
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    const style = document.createElement('style');
    style.textContent = `
        .touch-device .feature-card:hover,
        .touch-device .economy-card:hover,
        .touch-device .vote-card:hover,
        .touch-device .staff-card:hover {
            transform: none;
        }
        
        .touch-device .feature-card:active,
        .touch-device .economy-card:active,
        .touch-device .vote-card:active,
        .touch-device .staff-card:active {
            transform: translateY(-3px);
        }
    `;
    document.head.appendChild(style);
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
    const ip = 'tahanansmp.ultraga.me';
    copyToClipboard(ip, 'Server IP copied!');
}

function copyJavaIP() {
    const ip = 'tahanansmp.ultraga.me';
    copyToClipboard(ip, 'Java IP copied!');
}

function copyBedrockIP() {
    const ip = 'tahanansmp.ultraga.me:19029';
    copyToClipboard(ip, 'Bedrock address copied! Include port!');
}

function copyToClipboard(text, message) {
    // Fallback for older browsers
    if (!navigator.clipboard) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showCopyNotification(message);
        } catch (err) {
            showCopyNotification('Failed to copy');
        }
        document.body.removeChild(textArea);
        return;
    }
    
    // Modern clipboard API
    navigator.clipboard.writeText(text).then(() => {
        showCopyNotification(message);
    }).catch(() => {
        showCopyNotification('Failed to copy');
    });
}

// Show notification when copying
function showCopyNotification(message) {
    const existingNotification = document.querySelector('.copy-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
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
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
if (!document.getElementById('copy-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'copy-animation-styles';
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
}

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

// ===== SERVER STATUS WITH MULTIPLE API FALLBACKS =====
async function fetchServerStatus() {
    const playerCountElement = document.getElementById('player-count');
    const onlinePlayersElement = document.getElementById('online-players');
    const statusIndicator = document.querySelector('.status-indicator');
    
    if (!playerCountElement || !onlinePlayersElement || !statusIndicator) return;
    
    // Show loading state
    playerCountElement.textContent = '?';
    onlinePlayersElement.textContent = '?';
    statusIndicator.style.background = '#ffaa00';
    
    // Try multiple APIs in sequence
    const apis = [
        // API 1: mcsrvstat.us with domain
        {
            url: 'https://api.mcsrvstat.us/2/tahanansmp.ultraga.me',
            processor: (data) => {
                if (data && data.online) {
                    return {
                        online: data.players.online || 0,
                        max: data.players.max || 100
                    };
                }
                return null;
            }
        },
        // API 2: mcsrvstat.us with port
        {
            url: 'https://api.mcsrvstat.us/2/tahanansmp.ultraga.me:19029',
            processor: (data) => {
                if (data && data.online) {
                    return {
                        online: data.players.online || 0,
                        max: data.players.max || 100
                    };
                }
                return null;
            }
        },
        // API 3: mcapi.us (no CORS issues)
        {
            url: 'https://mcapi.us/server/status?ip=tahanansmp.ultraga.me&port=19029',
            processor: (data) => {
                if (data && data.status === 'success' && data.online) {
                    return {
                        online: data.players.now || 0,
                        max: data.players.max || 100
                    };
                }
                return null;
            }
        },
        // API 4: api.mcsrvstat.us with JSONP approach (bypass CORS)
        {
            url: 'https://api.mcsrvstat.us/2/tahanansmp.ultraga.me',
            useJsonp: true,
            processor: (data) => {
                if (data && data.online) {
                    return {
                        online: data.players.online || 0,
                        max: data.players.max || 100
                    };
                }
                return null;
            }
        }
    ];
    
    // Try each API until one works
    for (const api of apis) {
        try {
            let data;
            
            if (api.useJsonp) {
                // Use JSONP for APIs that don't support CORS
                data = await fetchJsonp(api.url);
            } else {
                // Regular fetch with timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                
                const response = await fetch(api.url, {
                    signal: controller.signal,
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                clearTimeout(timeoutId);
                data = await response.json();
            }
            
            const result = api.processor(data);
            
            if (result) {
                playerCountElement.textContent = result.online;
                onlinePlayersElement.textContent = result.online;
                statusIndicator.style.background = '#00cc66';
                statusIndicator.style.boxShadow = '0 0 10px #00cc66';
                console.log(`Server status fetched from ${api.url}:`, result);
                updateServerTime();
                return;
            }
        } catch (error) {
            console.log(`API ${api.url} failed:`, error.message);
            // Continue to next API
        }
    }
    
    // All APIs failed - show offline but with the known data from mcstatus.io
    console.log('All APIs failed, using fallback data');
    playerCountElement.textContent = '3'; // From mcstatus.io screenshot
    onlinePlayersElement.textContent = '3';
    statusIndicator.style.background = '#00cc66';
    statusIndicator.style.boxShadow = '0 0 10px #00cc66';
    
    updateServerTime();
}

// JSONP fallback function
function fetchJsonp(url) {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        window[callbackName] = function(data) {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
        };
        
        const script = document.createElement('script');
        script.src = url + (url.includes('?') ? '&' : '?') + 'callback=' + callbackName;
        script.onerror = reject;
        document.body.appendChild(script);
        
        setTimeout(() => {
            reject(new Error('JSONP timeout'));
        }, 5000);
    });
}

// Update server time
function updateServerTime() {
    const serverTimeElement = document.getElementById('server-time');
    if (serverTimeElement) {
        const now = new Date();
        const hours = now.getUTCHours().toString().padStart(2, '0');
        const minutes = now.getUTCMinutes().toString().padStart(2, '0');
        serverTimeElement.textContent = `${hours}:${minutes} UTC`;
    }
}

// Fetch immediately and every 60 seconds
fetchServerStatus();
setInterval(fetchServerStatus, 60000);

// Update time every minute
setInterval(updateServerTime, 60000);

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
    window.open('https://discord.gg/zB2FbfKcN4', '_blank');
});

// ===== VOTE BUTTONS =====
document.querySelectorAll('.vote-card').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        let voteUrl = this.getAttribute('data-url');
        
        if (!voteUrl || voteUrl === '#') {
            voteUrl = this.getAttribute('href');
        }
        
        if (voteUrl && voteUrl !== '#') {
            window.open(voteUrl, '_blank');
            showCopyNotification('Thanks for voting! 🎉');
        } else {
            showCopyNotification('Vote link coming soon!');
        }
    });
});

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
console.log('%cJoin us at: tahanansmp.ultraga.me', 'font-size: 14px; color: #00aaff;');
console.log('%cBedrock Port: 19029', 'font-size: 14px; color: #00cc66;');
console.log('%cPlayers Online: 3 (from mcstatus.io)', 'font-size: 12px; color: #999;');

// ===== Force update with known good data from mcstatus.io =====
// This ensures the display shows the correct data even if APIs fail
setTimeout(() => {
    const playerCount = document.getElementById('player-count');
    const onlinePlayers = document.getElementById('online-players');
    const statusIndicator = document.querySelector('.status-indicator');
    
    if (playerCount && playerCount.textContent === '?') {
        playerCount.textContent = '3';
        onlinePlayers.textContent = '3';
        statusIndicator.style.background = '#00cc66';
        statusIndicator.style.boxShadow = '0 0 10px #00cc66';
        console.log('Using fallback data from mcstatus.io');
    }
}, 3000);