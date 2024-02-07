let currSong = new Audio();
let currFolder;
let songs;

//function to convert seconds into minutes
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

// starts from here
async function getSongs(folder) {
  currFolder = folder;  
  let a = await fetch(`./${folder}`);                   //folder used
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
//   console.log(as);
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }

   //showing all the songs in the playlist
   let songUL = document.querySelector(".songList ul");
   songUL.innerHTML = "";
   for (const song of songs) {
     songUL.innerHTML += `<li>   
         <img class="invert" src="img/music.svg" alt="music">
             <div class="info">
                 <div>${
                   song
                     .split(`/${currFolder}/`)[1]                   //folder
                     .replaceAll("%20", " ")
                     .replaceAll("%5B", "[")
                     .replaceAll("%5D", "]")
                     .replaceAll("%2B", " ")
                     .split(".mp3")[0]
                 }</div>
                 <div class="singerName">Abhi</div>
             </div>
 
             <div class="playNow">
                 <img class="invert" src="img/play.svg" alt="play">
             </div></li>`;
   }

    // attach event listener to each song
  //my idea
  document.querySelectorAll(".songList li").forEach((e, idx) => {
    e.addEventListener("click", () => {
      playMusic(songs[idx]);
      e.querySelector(".playNow img").src = "img/pause.svg";
      convertToPlayBtn();
    });
  });

  playMusic(songs[0],true);


}

// playing the music
const playMusic = (track, pause = false) => {
  //first glance, automatically it will select first song on list
  currSong.src = track;
  if (!pause) {
    currSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerText = track
    .split(`/${currFolder}/`)[1]                                       //folder
    .replaceAll("%20", " ")
    .replaceAll("%5B", "[")
    .replaceAll("%5D", "]")
    .replaceAll("%2B", " ")
    .split(".mp3")[0];
  document.querySelector(".songtime").innerText = `00:00 / 00:00`;
};


async function displayAlbums(){
    let a = await fetch("./sngs");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");

    let cardContainer = document.querySelector(".cardContainer");

    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        let e = array[index];
        if(e.href.includes("/sngs/")){
            let folder = e.href.split("/sngs/")[1];
            let a = await fetch(`./sngs/${folder}/info.json`);
            let info_data = await a.json();
            cardContainer.innerHTML += `<div data-folder="sngs/${folder}" class="card">
            <div class="play">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"/>
                        </svg>
            </div>
            <img src="sngs/${folder}/cover.jpg" alt="">
            <h2>${info_data.title}</h2>
            <p>${info_data.description}</p>
        </div>`
        }
    }

    document.querySelectorAll(".card").forEach((card)=>{
        card.addEventListener("click",async (details)=>{{
            console.log(details.currentTarget.dataset.folder)
            await getSongs(`${details.currentTarget.dataset.folder}`);
        }})
      })
}


//2nd  function
async function main() {
  // extracting songs from the directory
  await getSongs("songs");

  playMusic(songs[0], true);

  displayAlbums();
  // attach event listener to each song
  //my idea
  document.querySelectorAll(".songList li").forEach((e, idx) => {
    e.addEventListener("click", () => {
      playMusic(songs[idx]);
      e.querySelector(".playNow img").src = "img/pause.svg";
      convertToPlayBtn();
    });
  });


  // attach event listener to play and pause the song
  play.addEventListener("click", () => {
    if (currSong.paused) {
      currSong.play();
      play.src = "img/pause.svg";
      convertTopauseBtn();
    } 
    else {
      currSong.pause();
      play.src = "img/play.svg";
      convertToPlayBtn2();
    }
  });

  // an event listener to update the time
  currSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currSong.currentTime
    )} / ${secondsToMinutesSeconds(currSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currSong.currentTime / currSong.duration) * 100 + "%";
      let timeRatio = currSong.currentTime / currSong.duration;
    // document.querySelector(".seekbar").style.backgroundColor = `rgb(${153*timeRatio}, ${11*timeRatio}, ${136*timeRatio})`;  
    document.querySelector(".seekbar").style.backgroundColor = `rgb(${0*timeRatio}, ${117*timeRatio}, ${255*timeRatio})`;  

     // to play the next song automatically when current song is finished
     let songIndex = songs.indexOf(currSong.src);
      if((currSong.currentTime === currSong.duration) && (songIndex !== (songs.length - 1))){
          playMusic(songs[++songIndex]);
          convertToPlayBtn();
          convertTopauseBtn();
        }
      else if(currSong.currentTime === currSong.duration && songIndex === songs.length - 1){
        convertToPlayBtn2();
        play.src = "img/play.svg";
      }  

  });

  // an event listener to seek the song
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currSong.currentTime = (currSong.duration * percent) / 100;
  });

//resposiveness for hamburgur functionality
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "0";
  })

  //responsiveness for hamburger close functionality
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-120%";
  })

  // event listener for next button
  next.addEventListener("click",()=>{
    currSong.pause();
    let index = songs.indexOf(currSong.src);
    convertToPlayBtn2();
    if(index + 1 < songs.length){
        playMusic(songs[index + 1]);
        convertTopauseBtn();
    }
    else if(index + 1 === songs.length){
        currSong.currentTime = 0;
        play.src = "img/play.svg";
    }
  })

  // event listener for previous button
  previous.addEventListener("click",()=>{
    currSong.pause();
    let index = songs.indexOf(currSong.src);
    convertToPlayBtn2();
    if(index - 1 >= 0){
      playMusic(songs[index - 1]);
      convertTopauseBtn();
    }
    else if(index - 1 < 0){
        currSong.currentTime = 0;
        play.src = "img/play.svg";
    }
  })

  //event listener for volume
  document.querySelector(".range input").addEventListener("change",(e)=>{
    currSong.volume = e.target.value/100;
  })

 //event listener to toggle from mute to unmute and viceversa
 document.querySelector(".volume>img").addEventListener("click",(elem)=>{
    if(elem.target.src.includes("img/volume.svg"))
    {
        elem.target.src = "img/mute.svg";
        currSong.volume = 0;
        document.querySelector(".range input").value = 0;
    }
    else{
        elem.target.src = "img/volume.svg";
        currSong.volume = 0.6;
        document.querySelector(".range input").value = 60;
    }
 })
}

main();

// it will convert play to pause img and vice versa (agar automatically aur aise hi click karke koi dusra gana baja to)
function convertToPlayBtn() {
    document.querySelectorAll(".songList li").forEach((elem, indx) => {
      if (currSong.src !== songs[indx])
        elem.querySelector(".playNow img").src = "img/play.svg";
    });
  }

  //for playbar to play
  function convertToPlayBtn2() {
    document.querySelectorAll(".songList li").forEach((element, indx) => {
      if (currSong.src === songs[indx])
        element.querySelector(".playNow img").src = "img/play.svg";
    });
  }

  //for playbar to pause
  function convertTopauseBtn() {
    document.querySelectorAll(".songList li").forEach((element, indx) => {
      if (currSong.src === songs[indx])
        element.querySelector(".playNow img").src = "img/pause.svg";
    });
  }


