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

async function main(){
    let songs = await getSongs();
    console.log(songs);

    let audio = new Audio(songs[0]);
    //audio.play();

    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        let song1 = song.replaceAll("%20", " ").replaceAll("%26"," ").replaceAll("%2C J%C3%A9ja"," ");
        
        songUL.innerHTML = songUL.innerHTML + `<li> ${song1} </li>`;  
    }
    audio.addEventListener("loadeddata",()=>{
        let duration = audio.duration;
        console.log(duration, audio.currentSrc, );
    })
}


main();