let currentSong = new Audio();

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
    let a = await fetch("http://127.0.0.1:5500/songs/");
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

function playMusic(track){
    currentSong.src = "/songs/" + track +".mp3";
    currentSong.play();
    play.src = "/img/pause.svg"
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {

    let songs = await getSongs();
    // console.log(songs);

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

    Array.from ( document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });

    play.addEventListener("click", function(){
        if(currentSong.paused){
            currentSong.play();
            play.src="/img/pause.svg";
        }
        else
        {
            currentSong.pause();
            play.src = "/img/play.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        
    })
    
    
}


main();