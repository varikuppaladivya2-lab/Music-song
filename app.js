// ── Song Library ──────────────────────────────────────────────────────────────
// Using royalty-free demo tracks from the internet
const songs = [
  {
    title: "Chill Vibes",
    artist: "Lo-Fi Collective",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/song1/300/300"
  },
  {
    title: "Summer Breeze",
    artist: "Acoustic Dream",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/song2/300/300"
  },
  {
    title: "Night Drive",
    artist: "Synthwave Studio",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/song3/300/300"
  },
  {
    title: "Mountain Echo",
    artist: "Nature Sounds",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "https://picsum.photos/seed/song4/300/300"
  },
  {
    title: "Urban Pulse",
    artist: "City Beats",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    cover: "https://picsum.photos/seed/song5/300/300"
  }
];

// ── State ─────────────────────────────────────────────────────────────────────
let currentIndex = 0;
let isPlaying = false;

// ── DOM Refs ──────────────────────────────────────────────────────────────────
const audio       = document.getElementById("audio");
const albumImg    = document.getElementById("album-img");
const songTitle   = document.getElementById("song-title");
const songArtist  = document.getElementById("song-artist");
const progressBar = document.getElementById("progress-bar");
const currentTime = document.getElementById("current-time");
const durationEl  = document.getElementById("duration");
const volumeBar   = document.getElementById("volume-bar");
const btnPlay     = document.getElementById("btn-play");
const btnPrev     = document.getElementById("btn-prev");
const btnNext     = document.getElementById("btn-next");
const autoplayChk = document.getElementById("autoplay-check");
const playlistEl  = document.getElementById("playlist");
const albumArt    = document.querySelector(".album-art");

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(secs) {
  if (isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Load Song ─────────────────────────────────────────────────────────────────
function loadSong(index) {
  const song = songs[index];
  audio.src        = song.src;
  albumImg.src     = song.cover;
  songTitle.textContent  = song.title;
  songArtist.textContent = song.artist;
  progressBar.value = 0;
  currentTime.textContent = "0:00";
  durationEl.textContent  = "0:00";
  updatePlaylistHighlight();
}

// ── Play / Pause ──────────────────────────────────────────────────────────────
function playSong() {
  audio.play();
  isPlaying = true;
  btnPlay.innerHTML = "&#9646;&#9646;"; // pause icon
  albumArt.classList.add("spinning");
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  btnPlay.innerHTML = "&#9654;"; // play icon
  albumArt.classList.remove("spinning");
}

function togglePlay() {
  isPlaying ? pauseSong() : playSong();
}

// ── Navigation ────────────────────────────────────────────────────────────────
function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressBar.value = pct;
  currentTime.textContent = formatTime(audio.currentTime);
  durationEl.textContent  = formatTime(audio.duration);
});

progressBar.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// ── Volume ────────────────────────────────────────────────────────────────────
audio.volume = 0.8;
volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value / 100;
});

// ── Autoplay on song end ──────────────────────────────────────────────────────
audio.addEventListener("ended", () => {
  if (autoplayChk.checked) {
    nextSong();
  } else {
    pauseSong();
    progressBar.value = 0;
    currentTime.textContent = "0:00";
  }
});

// ── Playlist ──────────────────────────────────────────────────────────────────
function buildPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="track-title">${song.title}</div>
      <div class="track-artist">${song.artist}</div>
    `;
    li.addEventListener("click", () => {
      currentIndex = i;
      loadSong(i);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function updatePlaylistHighlight() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach((li, i) => {
    li.classList.toggle("active", i === currentIndex);
  });
}

// ── Button Events ─────────────────────────────────────────────────────────────
btnPlay.addEventListener("click", togglePlay);
btnPrev.addEventListener("click", prevSong);
btnNext.addEventListener("click", nextSong);

// ── Init ──────────────────────────────────────────────────────────────────────
buildPlaylist();
loadSong(currentIndex);
