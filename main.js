document.addEventListener('DOMContentLoaded', function() {
    
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const currentCover = document.getElementById('current-cover');
    const currentSongEl = document.getElementById('current-song');
    const currentArtistEl = document.getElementById('current-artist');
     
    const songs = [
        {
            title: 'Aj Kal Ve',
            artist: 'Sidhu Moose wala',
            src: '../ajkalve.mp3',  
            cover: '../Album1.jpg'  
        },
        {
            title: 'Bachi Naag di',
            artist: 'Cheema Y',
            src: '../bachinaagdi.mp3',  
            cover: '../Album2.jpg'  
        },
        {
            title: 'Young GOAT',
            artist: 'Cheema Y',
            src: '../YoungGOAT.mp3',  
            cover: '../Album3.jpg'
        }
    ];
    
    let currentSongIndex = 0;
    let isPlaying = false;
    
   
    function loadSong(song) {
        currentSongEl.textContent = song.title;
        currentArtistEl.textContent = song.artist;
        currentCover.src = song.cover;
        audio.src = song.src;
        
        console.log('Loading song:', song.src);
        console.log('Loading cover:', song.cover);
   
        audio.load();
    }
 
    function togglePlay() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }
    
    function playSong() {
        isPlaying = true;
        playBtn.querySelector('i').classList.remove('fa-play');
        playBtn.querySelector('i').classList.add('fa-pause');
        audio.play().catch(e => console.error('Playback failed:', e));
    }
    
    function pauseSong() {
        isPlaying = false;
        playBtn.querySelector('i').classList.remove('fa-pause');
        playBtn.querySelector('i').classList.add('fa-play');
        audio.pause();
    }
    
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(songs[currentSongIndex]);
        if (isPlaying) playSong();
    }
   
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(songs[currentSongIndex]);
        if (isPlaying) playSong();
    }
  
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.setProperty('--progress', `${progressPercent}%`);
        
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
        
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        
        if (duration) {
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
            currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
        }
    }
    
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }
    
    function setVolume() {
        audio.volume = this.value;
    }
    
    function setupCardListeners() {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const songSrc = card.getAttribute('data-song');
                const songCover = card.getAttribute('data-cover');
                const songTitle = card.querySelector('h3').textContent;
                const songArtist = card.querySelector('p').textContent;
                
                if (songSrc) {
                    
                    currentSongIndex = songs.findIndex(song => song.src === songSrc);
                    loadSong({
                        title: songTitle,
                        artist: songArtist,
                        src: songSrc,
                        cover: songCover
                    });
                    playSong();
                }
            });
        });
    }
    
    audio.addEventListener('error', function() {
        console.error('Audio error:', this.error);
        alert('Error loading audio file. Please check console for details.');
    });
    
    currentCover.addEventListener('error', function() {
        console.error('Image failed to load:', this.src);
        this.src = 'https://via.placeholder.com/150'; 
    });
    
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    progressBar.parentElement.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    
    currentSongEl.textContent = "Select a Celestial Tune";
    currentArtistEl.textContent = "";
    setupCardListeners();
   
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        } else if (e.code === 'ArrowRight') {
            audio.currentTime += 5;
        } else if (e.code === 'ArrowLeft') {
            audio.currentTime -= 5;
        }
    });
    console.log('All songs:', songs);
});