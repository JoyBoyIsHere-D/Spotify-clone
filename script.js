let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1].split(".mp3")[0]);
        }
    }
    return songs;
}

function playMusic(track, pause = false) {
    currentSong.src = "/songs/" + track + ".mp3";
    if (!pause) {
        currentSong.play();
        play.src = "/img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {

    songs = await getSongs();
    playMusic(songs[0], true);

    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        let song1 = song.replaceAll("%20", " ");

        songUL.innerHTML = songUL.innerHTML + `<li> <img  src="/img/music.svg" alt="">
                                                    <div class="info">
                                                        <div>${song1}</div>
                                                        <div>JoyBoyIsHere</div>
                                                    </div>
                                                    <div class="playNow">
                                                        <img class="invert" src="img/play.svg" alt="">
                                                    </div> </li>`;
    }



    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });

    play.addEventListener("click", function () {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/img/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "/img/play.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = currentSong.duration * (percent / 100)
    })

    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = 0
    })
    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = -120 + "%"
    })

    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/songs/")[1].split(".mp3")[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/songs/")[1].split(".mp3")[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
}


main();