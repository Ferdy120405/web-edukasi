const videos = [
    {
        id: "udGrhz693zs",
        title: "Lagu ABC Bahasa Indonesia 🅰️",
        category: "language",
        thumbnail: "https://img.youtube.com/vi/udGrhz693zs/hqdefault.jpg"
    },
    {
        id: "DiEqHhHixEU",
        title: "Lagu Menghitung 1-10 🔢",
        category: "math",
        thumbnail: "https://img.youtube.com/vi/DiEqHhHixEU/hqdefault.jpg"
    },
    {
        id: "zXEq-QO3xTg",
        title: "Suara Hewan Ternak 🐄",
        category: "science",
        thumbnail: "https://img.youtube.com/vi/zXEq-QO3xTg/hqdefault.jpg"
    },
    {
        id: "jYAWf8Y91hA",
        title: "Lagu Warna Warni Alam 🌈",
        category: "science",
        thumbnail: "https://img.youtube.com/vi/jYAWf8Y91hA/hqdefault.jpg"
    },
    {
        id: "e_04ZrNroTo",
        title: "The Wheels on the Bus 🚌",
        category: "language",
        thumbnail: "https://img.youtube.com/vi/e_04ZrNroTo/hqdefault.jpg"
    },
    {
        id: "l4WNrvVjiTw",
        title: "If You're Happy and You Know It 😊",
        category: "language",
        thumbnail: "https://img.youtube.com/vi/l4WNrvVjiTw/hqdefault.jpg"
    },
    {
        id: "_6HzoUcx3eo",
        title: "Old MacDonald Had a Farm 👨‍🌾",
        category: "language",
        thumbnail: "https://img.youtube.com/vi/_6HzoUcx3eo/hqdefault.jpg"
    },
    {
        id: "v608v42cZcg",
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
    },
    {
        id: "2M9I1P9C_z0",
        title: "Lagu Bintang Kecil 🌟",
        category: "language",
        thumbnail: "https://img.youtube.com/vi/2M9I1P9C_z0/hqdefault.jpg"
    },
    {
        id: "Wgb02N9nIeA",
        title: "Belajar Angka 1-20 🔢",
        category: "math",
        thumbnail: "https://img.youtube.com/vi/Wgb02N9nIeA/hqdefault.jpg"
    },
    {
        id: "5LhxpP3vKcw",
        title: "Mengenal Hewan Laut 🐬",
        category: "science",
        thumbnail: "https://img.youtube.com/vi/5LhxpP3vKcw/hqdefault.jpg"
    },
    {
        id: "P3K1Hxu2Hq8",
        title: "Kisah Si Kancil 🦌",
        category: "language",
        thumbnail: "https://img.youtube.com/vi/P3K1Hxu2Hq8/hqdefault.jpg"
    },
    {
        id: "jWMx711Z6tQ",
        title: "Penjumlahan Sederhana ➕",
        category: "math",
        thumbnail: "https://img.youtube.com/vi/jWMx711Z6tQ/hqdefault.jpg"
    },
    {
        id: "cZk2lUXwEMs",
        title: "Cuaca dan Musim 🌦️",
        category: "science",
        thumbnail: "https://img.youtube.com/vi/cZk2lUXwEMs/hqdefault.jpg"
    },
    {
        id: "3H4S5M7F_mQ",
        title: "Lagu Balonku Ada Lima 🎈",
        category: "language",
        thumbnail: "https://img.youtube.com/vi/3H4S5M7F_mQ/hqdefault.jpg"
    },
    {
        id: "0Q0g94O4C_M",
        title: "Pengurangan Buah 🍎",
        category: "math",
        thumbnail: "https://img.youtube.com/vi/0Q0g94O4C_M/hqdefault.jpg"
    },
    {
        id: "8vB5LhxXFvM",
        title: "Kehidupan Dinosaurus 🦖",
        category: "science",
        thumbnail: "https://img.youtube.com/vi/8vB5LhxXFvM/hqdefault.jpg"
    },
    {
        id: "L8N2K8Qx1A4",
        title: "Belajar Membaca 📖",
        category: "language",
        thumbnail: "https://img.youtube.com/vi/L8N2K8Qx1A4/hqdefault.jpg"
    },
    {
        id: "tnmcXuI8nE0",
        title: "Belajar Jam dan Waktu ⏰",
        category: "math",
        thumbnail: "https://img.youtube.com/vi/tnmcXuI8nE0/hqdefault.jpg"
    },
    {
        id: "XxJMMy0Y7D8",
        title: "Pertumbuhan Tanaman 🌱",
        category: "science",
        thumbnail: "https://img.youtube.com/vi/XxJMMy0Y7D8/hqdefault.jpg"
    },
    {
        id: "a3j8Wk7N2QY",
        title: "Jenis-jenis Kendaraan 🚗",
        category: "science",
        thumbnail: "https://img.youtube.com/vi/a3j8Wk7N2QY/hqdefault.jpg"
    },
    {
        id: "M1J9R2Tx8X7",
        title: "Bernyanyi Bersama 🎤",
        category: "language",
        thumbnail: "https://img.youtube.com/vi/M1J9R2Tx8X7/hqdefault.jpg"
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
    modalTitle.innerHTML = `${title} <br><a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" style="display:inline-block; margin-top:10px; font-size:14px; color:#ff5e7e; text-decoration:none;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Buka di YouTube jika video tidak bisa diputar</a>`;
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
    if (e.target === modal) closeModal();
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
