// Initialize EmailJS
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// Slideshow functionality
class ImageSlideshow {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        // Initialize with sample images
        // To add your own images, upload them to the 'background_index' folder and add their paths here
        this.slides = [
            'background_index/vintage1.jpg',
            'background_index/vintage2.jpg',
            'background_index/vintage3.jpg',
            'background_index/vintage4.jpg'
        ];

        // Create slide elements
        const container = document.querySelector('.slideshow-container');
        this.slides.forEach((imagePath, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.style.backgroundImage = `url('${imagePath}')`;
            if (index === 0) slide.classList.add('active');
            container.appendChild(slide);
        });

        this.slideElements = document.querySelectorAll('.slide');
        this.startAutoPlay();
    }

    nextSlide() {
        this.slideElements[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % this.slideElements.length;
        this.slideElements[this.currentSlide].classList.add('active');
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }

    // Public method to add images
    addImages(imagePaths) {
        const container = document.querySelector('.slideshow-container');
        const existingSlides = document.querySelectorAll('.slide');
        existingSlides.forEach(slide => slide.remove());

        this.slides = imagePaths;
        this.currentSlide = 0;

        imagePaths.forEach((imagePath, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.style.backgroundImage = `url('${imagePath}')`;
            if (index === 0) slide.classList.add('active');
            container.appendChild(slide);
        });

        this.slideElements = document.querySelectorAll('.slide');
        this.startAutoPlay();
    }
}

// Form functionality
class NewsletterForm {
    constructor() {
        this.form = document.getElementById('newsletterForm');
        this.emailInput = document.getElementById('email');
        this.submitBtn = document.getElementById('submitBtn');
        this.formMessage = document.getElementById('formMessage');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        const email = this.emailInput.value.trim();

        // Validate email
        if (!email || !this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const originalText = this.submitBtn.textContent;
        this.submitBtn.innerHTML = '<span class="spinner"></span>';
        this.submitBtn.disabled = true;

        try {
            // Demo version - simulates saving the email
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Add success animation to button
            this.submitBtn.classList.add('success-animation');

            this.showMessage('✓ Successfully subscribed! Check your email for confirmation.', 'success');
            this.emailInput.value = '';

            // Save email to local storage for demo purposes
            this.saveEmailToDemo(email);

            // Remove animation class after animation completes
            setTimeout(() => {
                this.submitBtn.classList.remove('success-animation');
            }, 800);

        } catch (error) {
            console.error('Error:', error);
            this.showMessage('An error occurred. Please try again later.', 'error');
        } finally {
            this.submitBtn.innerHTML = originalText;
            this.submitBtn.disabled = false;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(message, type) {
        this.formMessage.textContent = message;
        this.formMessage.className = `form-message ${type}`;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.formMessage.className = 'form-message';
        }, 5000);
    }

    saveEmailToDemo(email) {
        let subscribers = JSON.parse(localStorage.getItem('aiyanas_subscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('aiyanas_subscribers', JSON.stringify(subscribers));
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize slideshow
    const slideshow = new ImageSlideshow();

    // Initialize form
    const form = new NewsletterForm();

    // Display subscriber count in console
    const subscribers = JSON.parse(localStorage.getItem('aiyanas_subscribers') || '[]');
    console.log(`Total subscribers: ${subscribers.length}`, subscribers);

    // Expose methods for external use (e.g., adding more images)
    window.aiyanas = {
        slideshow,
        form,
        addImages: (paths) => slideshow.addImages(paths)
    };
});

// Optional: EmailJS integration (uncomment when you have credentials)
/*
emailjs.init(EMAILJS_PUBLIC_KEY);

async function handleEmailJSSubmit(email) {
    try {
        const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_email: email,
            from_name: 'Aiyanas',
            message: 'Thank you for subscribing to our newsletter!'
        });
        return true;
    } catch (error) {
        console.error('EmailJS Error:', error);
        return false;
    }
}
*/
