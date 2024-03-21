const fileInput = document.getElementById('fileInput');
const caption = document.querySelector('.caption');
const allPhotos = document.getElementById('all-photos');
const thumbnails = document.getElementById('thumbnails');
const updateButton = document.getElementById('updateButton');
const darkModeToggle = document.getElementById('darkModeToggle');
const postTime = document.getElementById('post-time');

let images = [];
let photoOrder = [];

fileInput.addEventListener('change', handleFileSelect);
updateButton.addEventListener('click', updatePhotoOrder);
darkModeToggle.addEventListener('change', toggleDarkMode);

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
    updateButton.style.display = 'inline-block';
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
                wrapper.appendChild(img);
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

        const thumbnail = document.createElement('img');
        thumbnail.className = 'thumbnail';
        thumbnail.src = URL.createObjectURL(file);

        const thumbnailNumber = document.createElement('input');
        thumbnailNumber.className = 'thumbnail-number';
        thumbnailNumber.type = 'number';
        thumbnailNumber.value = photoOrder[index] + 1;
        thumbnailNumber.min = 1;
        thumbnailNumber.max = images.length;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            images.splice(index, 1);
            photoOrder = Array.from({ length: images.length }, (_, i) => i);
            updateLayout();
            updateImages();
            updateThumbnails();
            if (images.length === 0) {
                updateButton.style.display = 'none';
            }
        });

        thumbnailWrapper.appendChild(thumbnail);
        thumbnailWrapper.appendChild(thumbnailNumber);
        thumbnailWrapper.appendChild(deleteButton);
        thumbnails.appendChild(thumbnailWrapper);
    });
}

function updatePhotoOrder() {
    const thumbnailNumbers = document.querySelectorAll('.thumbnail-number');
    const newPhotoOrder = Array.from(thumbnailNumbers).map(input => parseInt(input.value) - 1);

    if (newPhotoOrder.some(order => order < 0 || order >= images.length)) {
        alert('無効な番号が指定されました');
        updateThumbnails();
        return;
    }

    if (new Set(newPhotoOrder).size !== newPhotoOrder.length) {
        alert('重複した番号が指定されました');
        updateThumbnails();
        return;
    }

    photoOrder = newPhotoOrder;
    updateImages();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
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