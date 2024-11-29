import { useRef, useState, useEffect, useMemo } from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.css';

function App() {
  const [currentMusicDetails, setCurrentMusicDetails] = useState({
    songName: 'Chasing',
    songArtist: 'NEFFEX',
    songSrc: './Assets/Songs/Chasing - NEFFEX.mp3',
    songAvatar: './Assets/Images/image1.jpg',
  });

  const [audioProgress, setAudioProgress] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [musicIndex, setMusicIndex] = useState(0);
  const [musicTotalLength, setMusicTotalLength] = useState('00:00');
  const [musicCurrentTime, setMusicCurrentTime] = useState('00:00');
  const [videoIndex, setVideoIndex] = useState(0);
  const currentAudio = useRef();

  // Memoize the musicAPI array to prevent recreation on each render
  const musicAPI = useMemo(() => [
    {
      songName: 'Chasing',
      songArtist: 'NEFFEX',
      songSrc: './Assets/Songs/Chasing - NEFFEX.mp3',
      songAvatar: './Assets/Images/image1.jpg',
    },
    {
      songName: 'AURORA - Runaway',
      songArtist: 'Aurora Aksnes',
      songSrc: './Assets/Songs/AURORA - Runaway (Lyrics).mp3',
      songAvatar: './Assets/Images/image4.jpg',
    },
    {
      songName: 'Catch Me If I Fall',
      songArtist: 'TEGNENT',
      songSrc: './Assets/Songs/Catch Me If I Fall - NEFFEX.mp3',
      songAvatar: './Assets/Images/image2.jpg',
    },
    {
      songName: 'Call Out My Name',
      songArtist: 'The Weeknd',
      songSrc: './Assets/Songs/The Weeknd - Call Out My Name (Official Audio).mp3',
      songAvatar: './Assets/Images/image8.jfif',
    },
    {
      songName: 'Feel It Coming',
      songArtist: 'The Weeknd',
      songSrc: './Assets/Songs/_Feel It Coming ft. Daft Punk.mp3',
      songAvatar: './Assets/Images/image9.jpg',
    },
    {
      songName: 'Starboy',
      songArtist: 'The Weeknd',
      songSrc: './Assets/Songs/Starboy ft. Daft Punk.mp3',
      songAvatar: './Assets/Images/image10.jpg',
    },
  ], []); // Empty dependency array ensures the array is only computed once

  const vidArray = [
    './Assets/Videos/Video1.mp4',
    './Assets/Videos/Video2.mp4',
    './Assets/Videos/Video3.mp4',
  ];

  useEffect(() => {
    // When the song index changes, update the audio source and play it
    updateCurrentMusicDetails(musicIndex);
  }, [musicIndex]);

  const updateCurrentMusicDetails = (index) => {
    const music = musicAPI[index];
    currentAudio.current.src = music.songSrc;
    setCurrentMusicDetails({
      songName: music.songName,
      songArtist: music.songArtist,
      songSrc: music.songSrc,
      songAvatar: music.songAvatar,
    });
  };

  const handleNextSong = () => {
    const nextIndex = (musicIndex + 1) % musicAPI.length;
    setMusicIndex(nextIndex);
  };

  const handlePrevSong = () => {
    const prevIndex = (musicIndex - 1 + musicAPI.length) % musicAPI.length;
    setMusicIndex(prevIndex);
  };

  const handleAudioPlay = () => {
    if (currentAudio.current.paused) {
      currentAudio.current.play().then(() => {
        setIsAudioPlaying(true);
      }).catch((error) => {
        console.error('Audio play failed:', error);
      });
    } else {
      currentAudio.current.pause();
      setIsAudioPlaying(false);
    }
  };

  const handleAudioUpdate = () => {
    const duration = currentAudio.current.duration || 0;
    const currentTime = currentAudio.current.currentTime;

    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);
    setMusicTotalLength(`${totalMinutes.toString().padStart(2, '0')} : ${totalSeconds.toString().padStart(2, '0')}`);

    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    setMusicCurrentTime(`${currentMinutes.toString().padStart(2, '0')} : ${currentSeconds.toString().padStart(2, '0')}`);

    setAudioProgress((currentTime / duration) * 100 || 0);
  };

  const handleMusicProgressBar = (e) => {
    const value = e.target.value;
    setAudioProgress(value);
    currentAudio.current.currentTime = (value / 100) * currentAudio.current.duration;
  };

  const handleSongClick = (index) => {
    setMusicIndex(index);
  };

  const handleChangeBackground = () => {
    setVideoIndex((prev) => (prev + 1) % vidArray.length);
  };

  return (
    <div className="container">
      <audio
        src={currentMusicDetails.songSrc}
        ref={currentAudio}
        onTimeUpdate={handleAudioUpdate}
        onEnded={handleNextSong}
      ></audio>
      <video src={vidArray[videoIndex]} loop muted autoPlay className="backgroundVideo"></video>
      <div className="blackScreen"></div>
      <div className="musicContainer">
        <div className="playerSection">
          <p className="musicPlayer">Music Player</p>
          <p className="musicHeadName">{currentMusicDetails.songName}</p>
          <p className="musicArtistName">{currentMusicDetails.songArtist}</p>
          <img
            src={currentMusicDetails.songAvatar}
            className="songAvatar"
            alt="song Avatar"
          />
          <div className="musicTimerDiv">
            <p className="musicCurrentTime">{musicCurrentTime}</p>
            <p className="musicTotalLength">{musicTotalLength}</p>
          </div>
          <input
            type="range"
            name="musicProgressBar"
            className="musicProgressBar"
            value={audioProgress}
            onChange={handleMusicProgressBar}
          />
          <div className="musicControlers">
            <i className="fa-solid fa-backward musicControler" onClick={handlePrevSong}></i>
            <i
              className={`fa-solid ${isAudioPlaying ? 'fa-pause-circle' : 'fa-circle-play'} playBtn`}
              onClick={handleAudioPlay}
            ></i>
            <i className="fa-solid fa-forward musicControler" onClick={handleNextSong}></i>
          </div>
        </div>
        <div className="songListSection">
          <h3>Song List</h3>
          <ul className="songList">
            {musicAPI.map((song, index) => (
              <li
                key={index}
                className={`songListItem ${musicIndex === index ? 'activeSong' : ''}`}
                onClick={() => handleSongClick(index)}
              >
                <img src={song.songAvatar} alt="Song Thumbnail" />
                <div>
                  <p>{song.songName}</p>
                  <p>{song.songArtist}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="changeBackBtn" onClick={handleChangeBackground}>
        Change Background
      </div>
    </div>
  );
}

export default App;
