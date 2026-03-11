const videos = [
    {
        id: "J5qWspxS3zI", // Example Cocomelon ID
        title: "Lagu ABC Bahasa Indonesia 🅰️",
        category: "language",
        thumbnail: "https://img.youtube.com/vi/J5qWspxS3zI/hqdefault.jpg"
    },
    {
        id: "v608v42cZcg", // Example Number Song
        title: "Belajar Berhitung 1-10 🔢",
        category: "math",
        thumbnail: "https://img.youtube.com/vi/v608v42cZcg/hqdefault.jpg"
    },
    {
        id: "7Xm8jZ_cWaw", // Example Animal Sounds
        title: "Suara Hewan Ternak 🐄",
        category: "science",
        thumbnail: "https://img.youtube.com/vi/7Xm8jZ_cWaw/hqdefault.jpg"
    },
    {
        id: "XqZsoesa55w", // Baby Shark Indonesian
        title: "Tari Baby Shark 🦈",
        category: "language",
        thumbnail: "https://img.youtube.com/vi/XqZsoesa55w/hqdefault.jpg"
    },
    {
        id: "j-5Zz98yQvQ", // Example Shapes Video
        title: "Mengenal Bentuk & Warna 🟢",
        category: "math",
        thumbnail: "https://img.youtube.com/vi/j-5Zz98yQvQ/hqdefault.jpg"
    },
    {
        id: "T2Yp6VnQQW0", // Example Space/Planets video
        title: "Petualangan Tata Surya 🪐",
        category: "science",
        thumbnail: "https://img.youtube.com/vi/T2Yp6VnQQW0/hqdefault.jpg"
    }
];

const videoGrid = document.getElementById('videoGrid');
const filterBtns = document.querySelectorAll('.cat-btn');

function renderVideos(filter = 'all') {
    videoGrid.innerHTML = '';
    const filteredVideos = filter === 'all' ? videos : videos.filter(v => v.category === filter);
    
    filteredVideos.forEach(video => {
        let catLabel = '';
        if (video.category === 'math') catLabel = 'Matematika';
        else if (video.category === 'science') catLabel = 'Hewan & Alam';
        else if (video.category === 'language') catLabel = 'Musik & Cerita';
        
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <div class="thumbnail-container">
                <img src="${video.thumbnail}" alt="${video.title}" onerror="this.src='https://images.unsplash.com/photo-1548484352-ea579e5233a8?w=500&q=80'">
                <i class="fa-solid fa-circle-play play-icon"></i>
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <span class="video-badge">${catLabel}</span>
            </div>
        `;
        
        card.addEventListener('click', () => openModal(video.id, video.title));
        videoGrid.appendChild(card);
    });
}

// Modal logic
const modal = document.getElementById('videoModal');
const closeBtn = document.querySelector('.close-btn');
const iframeContainer = document.getElementById('iframeContainer');
const modalTitle = document.getElementById('modalTitle');

function openModal(videoId, title) {
    iframeContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    modalTitle.textContent = title;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal open
}

function closeModal() {
    modal.classList.remove('active');
    setTimeout(() => {
        iframeContainer.innerHTML = ''; // Stop video audio after closing
    }, 300);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
});

// Filtering logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // Render videos
        renderVideos(btn.dataset.filter);
    });
});

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderVideos();
});
