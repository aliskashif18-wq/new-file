// Blog Application JavaScript
class BlogApp {
    constructor() {
        this.posts = this.loadPosts();
        this.currentFilter = 'all';
        this.editingPostId = null;
        this.isAdmin = false; // Start as non-admin, checkAdminStatus will set it properly
        this.adminPassword = 'weareashif-6289837466a@'; // Change this to your desired password
        this.settings = this.loadAdvancedSettings();
        this.init();
    }

    init() {
        console.log('BlogApp initializing...');
        // Check admin status first
        this.isAdmin = this.checkAdminStatus();
        this.setupEventListeners();
        this.renderPosts();
        this.updateStats();
        this.loadSettings();
        this.updateAdminUI();
        this.applyTheme();
        this.updateSocialLinks();
        // Delay populateAdvancedSettings to ensure DOM is ready
        setTimeout(() => {
            this.populateAdvancedSettings();
        }, 100);
        console.log('BlogApp initialized successfully');
    }

    // Admin Authentication
    checkAdminStatus() {
        // Only return true if both rememberAdmin AND isAdmin are set
        return localStorage.getItem('rememberAdmin') === 'true' && localStorage.getItem('isAdmin') === 'true';
    }

    setAdminStatus(isAdmin) {
        if (isAdmin) {
            localStorage.setItem('isAdmin', 'true');
        } else {
            localStorage.removeItem('isAdmin');
        }
        this.isAdmin = isAdmin;
        this.updateAdminUI();
    }

    updateAdminUI() {
        const adminBtn = document.querySelector('.admin-btn');
        const neutralBtn = document.getElementById('neutralAdminBtn');
        if (this.isAdmin) {
            if(adminBtn) adminBtn.style.display = 'flex';
            if(neutralBtn) neutralBtn.style.display = 'none';
        } else {
            if(adminBtn) adminBtn.style.display = 'none';
            if(neutralBtn) neutralBtn.style.display = 'flex';
        }
    }

    showAdminLogin() {
        document.getElementById('adminLoginModal').classList.add('active');
        document.getElementById('adminPassword').focus();
    }

    hideAdminLogin() {
        document.getElementById('adminLoginModal').classList.remove('active');
        document.getElementById('adminPassword').value = '';
    }

    authenticateAdmin(password) {
        if (password === this.adminPassword) {
            this.setAdminStatus(true);
            this.hideAdminLogin();
            
            // Ask to remember this device if not already remembered
            if (localStorage.getItem('rememberAdmin') !== 'true') {
                const remember = confirm('Do you want to remember this device for admin login?');
                if (remember) {
                    localStorage.setItem('rememberAdmin', 'true');
                }
            }
            
            this.toggleAdminPanel();
            this.showMessage('Admin access granted!', 'success');
            return true;
        } else {
            this.showMessage('Invalid password. Access denied.', 'error');
            return false;
        }
    }

    logoutAdmin() {
        this.setAdminStatus(false);
        localStorage.removeItem('rememberAdmin');
        this.hideAdminLogin();
        // Close admin panel if open
        const panel = document.getElementById('adminPanel');
        if (panel.classList.contains('active')) {
            panel.classList.remove('active');
        }
        this.showMessage('Logged out successfully.', 'success');
    }

    // Advanced Settings Management
    loadAdvancedSettings() {
        const stored = localStorage.getItem('advancedSettings');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            social: {
                twitter: '',
                facebook: '',
                instagram: '',
                linkedin: '',
                youtube: '',
                github: ''
            },
            theme: {
                primaryColor: '#2563eb',
                accentColor: '#f59e0b',
                fontFamily: 'Inter',
                fontSize: '16px',
                themeStyle: 'light'
            },
            auth: {
                enableLogin: true,
                enableSignup: false,
                enableComments: false
            },
            seo: {
                metaKeywords: '',
                metaDescription: '',
                googleAnalytics: '',
                facebookPixel: ''
            },
            advanced: {
                postsPerPage: 9,
                enableRSS: false,
                enableSitemap: false,
                enableSearch: false,
                enableNewsletter: false
            }
        };
    }

    saveAdvancedSettings() {
        localStorage.setItem('advancedSettings', JSON.stringify(this.settings));
    }

    applyTheme() {
        const root = document.documentElement;
        const theme = this.settings.theme;
        
        // Apply colors
        root.style.setProperty('--primary-color', theme.primaryColor);
        root.style.setProperty('--accent-color', theme.accentColor);
        
        // Apply font
        document.body.style.fontFamily = theme.fontFamily;
        document.body.style.fontSize = theme.fontSize;
        
        // Apply theme style
        if (theme.themeStyle === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (theme.themeStyle === 'auto') {
            // Auto theme based on system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    updateSocialLinks() {
        const social = this.settings.social;
        const socialLinks = document.querySelectorAll('.social-links a');
        
        // Update footer social links
        if (socialLinks.length >= 4) {
            if (social.twitter) socialLinks[0].href = social.twitter;
            if (social.facebook) socialLinks[1].href = social.facebook;
            if (social.instagram) socialLinks[2].href = social.instagram;
            if (social.linkedin) socialLinks[3].href = social.linkedin;
        }
    }

    // Local Storage Management
    loadPosts() {
        const stored = localStorage.getItem('blogPosts');
        if (stored) {
            return JSON.parse(stored);
        }
        // Default posts for demo
        return [
            {
                id: 1,
                title: "Welcome to The Begin Read",
                category: "lifestyle",
                excerpt: "Discover the journey of creating meaningful content and sharing stories that inspire and connect.",
                content: "Welcome to The Begin Read! This is your space to explore, learn, and grow through carefully crafted content. Our mission is to provide you with valuable insights, inspiring stories, and practical knowledge that can make a difference in your daily life.\n\nWhether you're interested in technology, lifestyle tips, or travel adventures, we've got something special for you. Each post is thoughtfully created to bring value to your reading experience.\n\nThank you for joining us on this journey. Let's begin reading together!",
                image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
                date: new Date().toISOString(),
                views: 1250
            },
            {
                id: 2,
                title: "The Future of Web Development",
                category: "tech",
                excerpt: "Exploring the latest trends and technologies shaping the future of web development in 2024.",
                content: "Web development continues to evolve at a rapid pace, with new frameworks, tools, and methodologies emerging regularly. In 2024, we're seeing several key trends that are reshaping how we build web applications.\n\n**Key Trends:**\n- AI-powered development tools\n- Serverless architecture\n- Progressive Web Apps (PWAs)\n- WebAssembly for performance\n- Enhanced accessibility standards\n\nThese innovations are making web development more efficient, accessible, and powerful than ever before. Developers who stay current with these trends will be well-positioned for success in the evolving landscape.",
                image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
                date: new Date(Date.now() - 86400000).toISOString(),
                views: 890
            },
            {
                id: 3,
                title: "Sustainable Travel: Exploring Responsibly",
                category: "travel",
                excerpt: "How to travel the world while minimizing your environmental impact and supporting local communities.",
                content: "Sustainable travel is more than just a trend—it's a responsibility we all share as global citizens. As we explore the world, it's crucial to consider the impact of our journeys on the environment and local communities.\n\n**Sustainable Travel Tips:**\n- Choose eco-friendly accommodations\n- Support local businesses and artisans\n- Minimize plastic waste\n- Use public transportation when possible\n- Respect local cultures and traditions\n- Offset your carbon footprint\n\nBy making conscious choices, we can ensure that the beautiful places we visit remain pristine for future generations to enjoy. Every small action counts toward creating a more sustainable travel industry.",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
                date: new Date(Date.now() - 172800000).toISOString(),
                views: 567
            }
        ];
    }

    savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }

    loadSettings() {
        const settings = localStorage.getItem('blogSettings');
        if (settings) {
            const parsed = JSON.parse(settings);
            document.getElementById('blogTitle').value = parsed.title || 'The Begin Read';
            document.getElementById('blogDescription').value = parsed.description || 'Discover stories, insights, and inspiration in every post';
            document.getElementById('blogAuthor').value = parsed.author || 'Admin';
            
            // Update page title and hero
            document.querySelector('.nav-logo h1').textContent = parsed.title || 'The Begin Read';
            document.querySelector('.hero-title').textContent = `Welcome to ${parsed.title || 'The Begin Read'}`;
            document.querySelector('.hero-subtitle').textContent = parsed.description || 'Discover stories, insights, and inspiration in every post';
        }
    }

    saveSettings() {
        const settings = {
            title: document.getElementById('blogTitle').value,
            description: document.getElementById('blogDescription').value,
            author: document.getElementById('blogAuthor').value
        };
        localStorage.setItem('blogSettings', JSON.stringify(settings));
    }

    // Event Listeners
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Admin panel toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.admin-btn')) {
                this.toggleAdminPanel();
            }
            if (e.target.closest('.neutral-admin-btn')) {
                this.showAdminLogin();
            }
            if (e.target.closest('.close-admin')) {
                this.toggleAdminPanel();
            }
        });

        // Admin login form
        document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;
            this.authenticateAdmin(password);
        });

        // Close login modal
        document.getElementById('closeLoginModalBtn').addEventListener('click', () => {
            this.hideAdminLogin();
        });

        document.getElementById('cancelLoginBtn').addEventListener('click', () => {
            this.hideAdminLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logoutAdmin();
        });

        // Advanced Settings Forms (with error handling)
        const socialForm = document.getElementById('socialForm');
        if (socialForm) {
            socialForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSocialSettings();
            });
        }

        const themeForm = document.getElementById('themeForm');
        if (themeForm) {
            themeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveThemeSettings();
            });
        }

        const authForm = document.getElementById('authForm');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAuthSettings();
            });
        }

        const seoForm = document.getElementById('seoForm');
        if (seoForm) {
            seoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSeoSettings();
            });
        }

        const advancedForm = document.getElementById('advancedForm');
        if (advancedForm) {
            advancedForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAdvancedOptions();
            });
        }

        // Backup & Export (with error handling)
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }

        const importBtn = document.getElementById('importDataBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                const importFile = document.getElementById('importFile');
                if (importFile) importFile.click();
            });
        }

        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => {
                this.importData(e.target.files[0]);
            });
        }

        const resetBtn = document.getElementById('resetDataBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetAllData();
            });
        }

        // Admin tabs
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchAdminTab(e.target.dataset.tab);
            });
        });

        // New post form
        document.getElementById('newPostForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPost();
        });

        // Clear form button
        document.getElementById('clearFormBtn').addEventListener('click', () => {
            this.clearForm();
        });

        // Settings form
        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
            this.showMessage('Settings saved successfully!', 'success');
        });

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Close modal button
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Footer filter links
        document.querySelectorAll('.footer-section a[data-filter]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setFilter(e.target.dataset.filter);
                // Scroll to posts
                document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Mobile menu toggle
        document.querySelector('.hamburger').addEventListener('click', () => {
            this.toggleMobileMenu();
        });
    }

    // Post Management
    createPost() {
        const title = document.getElementById('postTitle').value;
        const category = document.getElementById('postCategory').value;
        const image = document.getElementById('postImage').value;
        const excerpt = document.getElementById('postExcerpt').value;
        const content = document.getElementById('postContent').value;

        if (!title || !category || !content) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        const newPost = {
            id: Date.now(),
            title,
            category,
            excerpt: excerpt || content.substring(0, 150) + '...',
            content,
            image: image || this.getDefaultImage(category),
            date: new Date().toISOString(),
            views: 0
        };

        this.posts.unshift(newPost);
        this.savePosts();
        this.renderPosts();
        this.updateStats();
        this.clearForm();
        this.showMessage('Post created successfully!', 'success');
        this.switchAdminTab('posts');
    }

    updatePost(id) {
        const postIndex = this.posts.findIndex(p => p.id === id);
        if (postIndex === -1) return;

        const title = document.getElementById('postTitle').value;
        const category = document.getElementById('postCategory').value;
        const image = document.getElementById('postImage').value;
        const excerpt = document.getElementById('postExcerpt').value;
        const content = document.getElementById('postContent').value;

        this.posts[postIndex] = {
            ...this.posts[postIndex],
            title,
            category,
            excerpt: excerpt || content.substring(0, 150) + '...',
            content,
            image: image || this.getDefaultImage(category)
        };

        this.savePosts();
        this.renderPosts();
        this.renderAdminPosts();
        this.clearForm();
        this.editingPostId = null;
        this.showMessage('Post updated successfully!', 'success');
        this.switchAdminTab('posts');
    }

    deletePost(id) {
        if (confirm('Are you sure you want to delete this post?')) {
            this.posts = this.posts.filter(p => p.id !== id);
            this.savePosts();
            this.renderPosts();
            this.renderAdminPosts();
            this.updateStats();
            this.showMessage('Post deleted successfully!', 'success');
        }
    }

    editPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        document.getElementById('postTitle').value = post.title;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postImage').value = post.image;
        document.getElementById('postExcerpt').value = post.excerpt;
        document.getElementById('postContent').value = post.content;

        this.editingPostId = id;
        this.switchAdminTab('new');
        
        // Update form submit handler
        const form = document.getElementById('newPostForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.updatePost(id);
        };
    }

    // Rendering
    renderPosts() {
        const grid = document.getElementById('postsGrid');
        const filteredPosts = this.currentFilter === 'all' 
            ? this.posts 
            : this.posts.filter(post => post.category === this.currentFilter);

        if (filteredPosts.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>No posts found</h3>
                    <p>There are no posts in the "${this.currentFilter}" category yet.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filteredPosts.map(post => `
            <div class="post-card" onclick="blogApp.openPost(${post.id})">
                ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image">` : ''}
                <div class="post-content">
                    <span class="post-category ${post.category}">${post.category}</span>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-meta">
                        <div class="post-date">
                            <i class="fas fa-calendar"></i>
                            <span>${this.formatDate(post.date)}</span>
                        </div>
                        <a href="#" class="read-more" onclick="event.stopPropagation(); blogApp.openPost(${post.id})">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderAdminPosts() {
        const list = document.getElementById('adminPostsList');
        
        if (this.posts.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>No posts yet</h3>
                    <p>Create your first post to get started!</p>
                </div>
            `;
            return;
        }

        list.innerHTML = this.posts.map(post => `
            <div class="admin-post-item">
                <div class="admin-post-header">
                    <div>
                        <div class="admin-post-title">${post.title}</div>
                        <div class="admin-post-meta">
                            <span class="post-category ${post.category}">${post.category}</span>
                            <span>${this.formatDate(post.date)}</span>
                            <span>${post.views} views</span>
                        </div>
                    </div>
                    <div class="admin-post-actions">
                        <button class="btn-edit" onclick="blogApp.editPost(${post.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-danger" onclick="blogApp.deletePost(${post.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // UI Interactions
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderPosts();
    }

    toggleAdminPanel() {
        const panel = document.getElementById('adminPanel');
        if (!panel) {
            console.error('Admin panel element not found');
            return;
        }
        
        panel.classList.toggle('active');
        console.log('Admin panel toggled, active:', panel.classList.contains('active'));
        
        if (panel.classList.contains('active')) {
            this.renderAdminPosts();
        }
    }

    switchAdminTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.admin-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}Tab`).classList.add('active');
        
        // Re-populate advanced settings when advanced tab is opened
        if (tab === 'advanced') {
            setTimeout(() => {
                this.populateAdvancedSettings();
            }, 100);
        }
    }

    openPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        // Increment views
        post.views++;
        this.savePosts();
        this.updateStats();

        // Show modal
        document.getElementById('modalTitle').textContent = post.title;
        document.getElementById('modalBody').innerHTML = `
            <div class="post-meta" style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-200);">
                <span class="post-category ${post.category}">${post.category}</span>
                <span style="margin-left: 1rem; color: var(--gray-500);">
                    <i class="fas fa-calendar"></i> ${this.formatDate(post.date)}
                </span>
                <span style="margin-left: 1rem; color: var(--gray-500);">
                    <i class="fas fa-eye"></i> ${post.views} views
                </span>
            </div>
            ${post.image ? `<img src="${post.image}" alt="${post.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--border-radius); margin-bottom: 2rem;">` : ''}
            <div style="white-space: pre-line; line-height: 1.8;">${post.content}</div>
        `;
        
        document.getElementById('postModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('postModal').classList.remove('active');
    }

    clearForm() {
        document.getElementById('postTitle').value = '';
        document.getElementById('postCategory').value = '';
        document.getElementById('postImage').value = '';
        document.getElementById('postExcerpt').value = '';
        document.getElementById('postContent').value = '';
        
        // Reset form submit handler
        const form = document.getElementById('newPostForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.createPost();
        };
        
        this.editingPostId = null;
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('active');
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getDefaultImage(category) {
        const images = {
            tech: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
            lifestyle: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
            travel: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop'
        };
        return images[category] || images.lifestyle;
    }

    updateStats() {
        document.getElementById('totalPosts').textContent = this.posts.length;
        
        const totalViews = this.posts.reduce((sum, post) => sum + post.views, 0);
        document.getElementById('totalViews').textContent = totalViews.toLocaleString();
        
        // Simulate reader count (you could implement actual analytics)
        const readers = Math.floor(totalViews * 0.3);
        document.getElementById('totalReaders').textContent = readers.toLocaleString();
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Insert at the top of admin content
        const adminContent = document.querySelector('.admin-content');
        adminContent.insertBefore(messageDiv, adminContent.firstChild);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Advanced Settings Methods
    populateAdvancedSettings() {
        try {
            // Populate social media settings
            const twitterUrl = document.getElementById('twitterUrl');
            if (twitterUrl) twitterUrl.value = this.settings.social.twitter;
            
            const facebookUrl = document.getElementById('facebookUrl');
            if (facebookUrl) facebookUrl.value = this.settings.social.facebook;
            
            const instagramUrl = document.getElementById('instagramUrl');
            if (instagramUrl) instagramUrl.value = this.settings.social.instagram;
            
            const linkedinUrl = document.getElementById('linkedinUrl');
            if (linkedinUrl) linkedinUrl.value = this.settings.social.linkedin;
            
            const youtubeUrl = document.getElementById('youtubeUrl');
            if (youtubeUrl) youtubeUrl.value = this.settings.social.youtube;
            
            const githubUrl = document.getElementById('githubUrl');
            if (githubUrl) githubUrl.value = this.settings.social.github;

            // Populate theme settings
            const primaryColor = document.getElementById('primaryColor');
            if (primaryColor) primaryColor.value = this.settings.theme.primaryColor;
            
            const accentColor = document.getElementById('accentColor');
            if (accentColor) accentColor.value = this.settings.theme.accentColor;
            
            const fontFamily = document.getElementById('fontFamily');
            if (fontFamily) fontFamily.value = this.settings.theme.fontFamily;
            
            const fontSize = document.getElementById('fontSize');
            if (fontSize) fontSize.value = this.settings.theme.fontSize;
            
            const themeStyle = document.getElementById('themeStyle');
            if (themeStyle) themeStyle.value = this.settings.theme.themeStyle;

            // Populate auth settings
            const enableLogin = document.getElementById('enableLogin');
            if (enableLogin) enableLogin.checked = this.settings.auth.enableLogin;
            
            const enableSignup = document.getElementById('enableSignup');
            if (enableSignup) enableSignup.checked = this.settings.auth.enableSignup;
            
            const enableComments = document.getElementById('enableComments');
            if (enableComments) enableComments.checked = this.settings.auth.enableComments;

            // Populate SEO settings
            const metaKeywords = document.getElementById('metaKeywords');
            if (metaKeywords) metaKeywords.value = this.settings.seo.metaKeywords;
            
            const metaDescription = document.getElementById('metaDescription');
            if (metaDescription) metaDescription.value = this.settings.seo.metaDescription;
            
            const googleAnalytics = document.getElementById('googleAnalytics');
            if (googleAnalytics) googleAnalytics.value = this.settings.seo.googleAnalytics;
            
            const facebookPixel = document.getElementById('facebookPixel');
            if (facebookPixel) facebookPixel.value = this.settings.seo.facebookPixel;

            // Populate advanced settings
            const postsPerPage = document.getElementById('postsPerPage');
            if (postsPerPage) postsPerPage.value = this.settings.advanced.postsPerPage;
            
            const enableRSS = document.getElementById('enableRSS');
            if (enableRSS) enableRSS.checked = this.settings.advanced.enableRSS;
            
            const enableSitemap = document.getElementById('enableSitemap');
            if (enableSitemap) enableSitemap.checked = this.settings.advanced.enableSitemap;
            
            const enableSearch = document.getElementById('enableSearch');
            if (enableSearch) enableSearch.checked = this.settings.advanced.enableSearch;
            
            const enableNewsletter = document.getElementById('enableNewsletter');
            if (enableNewsletter) enableNewsletter.checked = this.settings.advanced.enableNewsletter;
            
            console.log('Advanced settings populated successfully');
        } catch (error) {
            console.error('Error populating advanced settings:', error);
        }
    }

    saveSocialSettings() {
        try {
            const twitterUrl = document.getElementById('twitterUrl');
            const facebookUrl = document.getElementById('facebookUrl');
            const instagramUrl = document.getElementById('instagramUrl');
            const linkedinUrl = document.getElementById('linkedinUrl');
            const youtubeUrl = document.getElementById('youtubeUrl');
            const githubUrl = document.getElementById('githubUrl');

            this.settings.social = {
                twitter: twitterUrl ? twitterUrl.value : '',
                facebook: facebookUrl ? facebookUrl.value : '',
                instagram: instagramUrl ? instagramUrl.value : '',
                linkedin: linkedinUrl ? linkedinUrl.value : '',
                youtube: youtubeUrl ? youtubeUrl.value : '',
                github: githubUrl ? githubUrl.value : ''
            };
            this.saveAdvancedSettings();
            this.updateSocialLinks();
            this.showMessage('Social media links saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving social settings:', error);
            this.showMessage('Error saving social media links.', 'error');
        }
    }

    saveThemeSettings() {
        try {
            const primaryColor = document.getElementById('primaryColor');
            const accentColor = document.getElementById('accentColor');
            const fontFamily = document.getElementById('fontFamily');
            const fontSize = document.getElementById('fontSize');
            const themeStyle = document.getElementById('themeStyle');

            this.settings.theme = {
                primaryColor: primaryColor ? primaryColor.value : '#2563eb',
                accentColor: accentColor ? accentColor.value : '#f59e0b',
                fontFamily: fontFamily ? fontFamily.value : 'Inter',
                fontSize: fontSize ? fontSize.value : '16px',
                themeStyle: themeStyle ? themeStyle.value : 'light'
            };
            this.saveAdvancedSettings();
            this.applyTheme();
            this.showMessage('Theme settings applied successfully!', 'success');
        } catch (error) {
            console.error('Error saving theme settings:', error);
            this.showMessage('Error saving theme settings.', 'error');
        }
    }

    saveAuthSettings() {
        this.settings.auth = {
            enableLogin: document.getElementById('enableLogin').checked,
            enableSignup: document.getElementById('enableSignup').checked,
            enableComments: document.getElementById('enableComments').checked
        };
        this.saveAdvancedSettings();
        
        // Update admin UI based on login setting
        if (!this.settings.auth.enableLogin) {
            this.setAdminStatus(true); // Auto-login if login is disabled
        }
        
        this.showMessage('Authentication settings saved successfully!', 'success');
    }

    saveSeoSettings() {
        this.settings.seo = {
            metaKeywords: document.getElementById('metaKeywords').value,
            metaDescription: document.getElementById('metaDescription').value,
            googleAnalytics: document.getElementById('googleAnalytics').value,
            facebookPixel: document.getElementById('facebookPixel').value
        };
        this.saveAdvancedSettings();
        this.updateMetaTags();
        this.showMessage('SEO settings saved successfully!', 'success');
    }

    saveAdvancedOptions() {
        this.settings.advanced = {
            postsPerPage: parseInt(document.getElementById('postsPerPage').value),
            enableRSS: document.getElementById('enableRSS').checked,
            enableSitemap: document.getElementById('enableSitemap').checked,
            enableSearch: document.getElementById('enableSearch').checked,
            enableNewsletter: document.getElementById('enableNewsletter').checked
        };
        this.saveAdvancedSettings();
        this.showMessage('Advanced options saved successfully!', 'success');
    }

    updateMetaTags() {
        const seo = this.settings.seo;
        
        // Update meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = seo.metaKeywords;

        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = seo.metaDescription;

        // Add Google Analytics
        if (seo.googleAnalytics) {
            this.addGoogleAnalytics(seo.googleAnalytics);
        }

        // Add Facebook Pixel
        if (seo.facebookPixel) {
            this.addFacebookPixel(seo.facebookPixel);
        }
    }

    addGoogleAnalytics(gaId) {
        // Remove existing GA script
        const existingGA = document.querySelector('script[src*="gtag"]');
        if (existingGA) existingGA.remove();

        // Add new GA script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
        `;
        document.head.appendChild(script2);
    }

    addFacebookPixel(pixelId) {
        // Remove existing FB Pixel script
        const existingFB = document.querySelector('script[src*="fbevents"]');
        if (existingFB) existingFB.remove();

        // Add new FB Pixel script
        const script = document.createElement('script');
        script.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
        `;
        document.head.appendChild(script);
    }

    exportData() {
        const data = {
            posts: this.posts,
            settings: this.settings,
            blogSettings: {
                title: document.getElementById('blogTitle').value,
                description: document.getElementById('blogDescription').value,
                author: document.getElementById('blogAuthor').value
            },
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blog-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('Data exported successfully!', 'success');
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.posts) this.posts = data.posts;
                if (data.settings) this.settings = data.settings;
                if (data.blogSettings) {
                    document.getElementById('blogTitle').value = data.blogSettings.title;
                    document.getElementById('blogDescription').value = data.blogSettings.description;
                    document.getElementById('blogAuthor').value = data.blogSettings.author;
                }

                this.savePosts();
                this.saveAdvancedSettings();
                this.renderPosts();
                this.populateAdvancedSettings();
                this.applyTheme();
                this.updateSocialLinks();

                this.showMessage('Data imported successfully!', 'success');
            } catch (error) {
                this.showMessage('Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    resetAllData() {
        if (confirm('Are you sure you want to reset ALL data? This cannot be undone!')) {
            localStorage.clear();
            location.reload();
        }
    }
}

// --- SEARCH BAR LOGIC ---
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const searchButton = document.getElementById('searchButton');

function fuzzyMatchScore(a, b) {
    // Lower score = better. Good for short strings, titles, typos, etc.
    a = a.toLowerCase(); b = b.toLowerCase()
    if (a === b) return 0;
    if (b.length === 0) return 1000;
    // Substring exact
    if (a.includes(b)) return a.length - b.length;
    // Typo close (edit distance)
    let dp = Array.from({length: a.length+1}, () => Array(b.length+1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
    return dp[a.length][b.length];
}

function getPostMatches(query) {
    const posts = window.blogApp ? window.blogApp.posts : [];
    if (!query) return [];
    return posts.map(post => {
        const fields = [post.title, post.excerpt||'', post.category||''];
        let bestScore = Math.min(...fields.map(f => fuzzyMatchScore(f, query)));
        return { post, score: bestScore };
    })
    .filter(({score}) => score < Math.max(5, Math.floor(query.length/2)+2)) // fuzzy but not too distant
    .sort((a, b) => a.score - b.score)
    .slice(0, 8);
}

let suggestionIdx = -1, suggestionList = [];

function showSuggestions(query) {
    searchSuggestions.innerHTML = '';
    suggestionList = getPostMatches(query);
    if (suggestionList.length === 0) {
        searchSuggestions.innerHTML = `<li>No matching posts found</li>`;
        searchSuggestions.classList.add('active');
        suggestionIdx = -1;
        return;
    }
    suggestionList.forEach(({post}, i) => {
        const item = document.createElement('li');
        item.innerHTML = `<strong>${post.title}</strong><br><span style='font-size:0.92em;color:#6b7280;'>${post.excerpt ? post.excerpt.slice(0,50)+(post.excerpt.length>50?'...':'') : ''}</span>`;
        item.tabIndex = 0;
        item.onclick = () => selectSuggestion(i);
        item.onmouseenter = () => highlightSuggestion(i);
        if (i === suggestionIdx) item.classList.add('active');
        searchSuggestions.appendChild(item);
    });
    searchSuggestions.classList.add('active');
}

function hideSuggestions() {
    searchSuggestions.classList.remove('active');
    searchSuggestions.innerHTML = '';
    suggestionIdx = -1;
}

function highlightSuggestion(i) {
    let items = searchSuggestions.querySelectorAll('li');
    items.forEach((el, idx) => el.classList.toggle('active', idx===i));
    suggestionIdx = i;
}

function selectSuggestion(i) {
    if (suggestionList[i]) {
        hideSuggestions();
        window.blogApp.openPost(suggestionList[i].post.id);
        searchInput.blur();
    }
}

searchInput.addEventListener('input', e => {
    const value = searchInput.value.trim();
    if (value) showSuggestions(value);
    else hideSuggestions();
});

searchInput.addEventListener('keydown', e => {
    if (['ArrowUp','ArrowDown','Enter'].includes(e.key)) {
        let max = suggestionList.length;
        if (e.key === 'ArrowDown') { suggestionIdx = (suggestionIdx+1)%max; highlightSuggestion(suggestionIdx); }
        if (e.key === 'ArrowUp') { suggestionIdx = (suggestionIdx-1+max)%max; highlightSuggestion(suggestionIdx); }
        if (e.key === 'Enter' && suggestionIdx >= 0) { e.preventDefault(); selectSuggestion(suggestionIdx); }
    }
});

searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) showSuggestions(searchInput.value.trim());
});

searchInput.addEventListener('blur', () => {
    setTimeout(hideSuggestions, 180); // let click fire
});

searchButton.addEventListener('click', e => {
    if (suggestionList.length > 0) selectSuggestion(0);
    else if (searchInput.value.trim()) showSuggestions(searchInput.value.trim());
});


// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogApp = new BlogApp();
    initializeImageLoading();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add loading animation to images
function initializeImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for smooth loading
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}
