const fileInput = document.getElementById('fileInput');
const caption = document.querySelector('.caption');
const allPhotos = document.getElementById('all-photos');
const thumbnails = document.getElementById('thumbnails');
const darkModeToggle = document.getElementById('darkModeToggle');
const viewModeToggle = document.getElementById('viewModeToggle');
const postTime = document.getElementById('post-time');
const header = document.querySelector('.header');

let images = [];
let photoOrder = [];

fileInput.addEventListener('change', handleFileSelect);
darkModeToggle.addEventListener('change', toggleDarkMode);
viewModeToggle.addEventListener('change', toggleViewMode);

function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length < 1 || files.length > 4) {
        alert('1〜4枚の画像を選択してください');
        return;
    }

    images = [...images, ...Array.from(files)];
    if (images.length > 4) {
        images = images.slice(0, 4);
    }
    photoOrder = Array.from({ length: images.length }, (_, i) => i);
    updateLayout();
    updateImages();
    updateThumbnails();
}

function updateLayout() {
    const numberOfPhoto = images.length;
    allPhotos.className = `image-grid layout-${numberOfPhoto}`;
    allPhotos.innerHTML = '';

    for (let i = 0; i < numberOfPhoto; i++) {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';
        imageWrapper.dataset.index = i;

        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.textContent = '画像をアップロードしてください';

        imageWrapper.appendChild(placeholder);
        allPhotos.appendChild(imageWrapper);
    }
}

function updateImages() {
    const imageWrappers = document.querySelectorAll('.image-wrapper');
    imageWrappers.forEach((wrapper, index) => {
        let img = wrapper.querySelector('img');
        const placeholder = wrapper.querySelector('.placeholder');
        const file = images[photoOrder[index]];
        if (file) {
            if (!img) {
                img = document.createElement('img');
                wrapper.insertBefore(img, placeholder);
            }
            img.src = URL.createObjectURL(file);
            img.id = `photo-${index}`;
            placeholder.style.display = 'none';
        } else {
            if (img) {
                wrapper.removeChild(img);
            }
            placeholder.style.display = 'block';
        }
    });
}

function updateThumbnails() {
    thumbnails.innerHTML = '';
    images.forEach((file, index) => {
        const thumbnailWrapper = document.createElement('div');
        thumbnailWrapper.className = 'thumbnail-wrapper';
        thumbnailWrapper.dataset.index = index;

        const thumbnail = document.createElement('img');
        thumbnail.className = 'thumbnail';
        thumbnail.src = URL.createObjectURL(file);

        const leftArrow = document.createElement('div');
        leftArrow.className = 'thumbnail-arrow thumbnail-arrow-left';
        leftArrow.innerHTML = '&#8249;';
        leftArrow.addEventListener('click', () => {
            const currentIndex = photoOrder.indexOf(index);
            if (currentIndex > 0) {
                const temp = photoOrder[currentIndex];
                photoOrder[currentIndex] = photoOrder[currentIndex - 1];
                photoOrder[currentIndex - 1] = temp;
                updateImages();
                updateThumbnails();
            }
        });

        const rightArrow = document.createElement('div');
        rightArrow.className = 'thumbnail-arrow thumbnail-arrow-right';
        rightArrow.innerHTML = '&#8250;';
        rightArrow.addEventListener('click', () => {
            const currentIndex = photoOrder.indexOf(index);
            if (currentIndex < images.length - 1) {
                const temp = photoOrder[currentIndex];
                photoOrder[currentIndex] = photoOrder[currentIndex + 1];
                photoOrder[currentIndex + 1] = temp;
                updateImages();
                updateThumbnails();
            }
        });

        const deleteButton = document.createElement('div');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            images.splice(index, 1);
            photoOrder = photoOrder.filter(i => i !== index);
            photoOrder = photoOrder.map(i => (i > index ? i - 1 : i));
            updateLayout();
            updateImages();
            updateThumbnails();
        });

        thumbnailWrapper.appendChild(leftArrow);
        thumbnailWrapper.appendChild(thumbnail);
        thumbnailWrapper.appendChild(rightArrow);
        thumbnailWrapper.appendChild(deleteButton);
        thumbnails.appendChild(thumbnailWrapper);
    });

    // Thumbnail側の順序を更新
    const thumbnailWrappers = document.querySelectorAll('.thumbnail-wrapper');
    thumbnailWrappers.forEach((wrapper, index) => {
        wrapper.style.order = photoOrder.indexOf(parseInt(wrapper.dataset.index));
    });
}

function moveImage(index, direction) {
    const newIndex = photoOrder[index] + direction;
    if (newIndex >= 0 && newIndex < images.length) {
        const temp = photoOrder[index];
        photoOrder[index] = photoOrder[index + direction];
        photoOrder[index + direction] = temp;
        updateImages();
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function toggleViewMode() {
    const post = document.querySelector('.post');

    if (viewModeToggle.checked) {
        post.classList.add('timeline-mode');
    } else {
        post.classList.remove('timeline-mode');
    }
}

function updatePostTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? '午後' : '午前';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    postTime.textContent = `${ampm}${formattedHours}:${formattedMinutes} · ${year}年${month}月${day}日`;
}

updatePostTime();
setInterval(updatePostTime, 60000);