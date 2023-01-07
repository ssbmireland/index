function getTimestamp(){

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let time = date.getHours() + ":" + date.getMinutes();

    let currentTime = `${day}/${month}/${year} ${time}`

    document.getElementById('timestamp').innerHTML = "Leaderboard last updated: " + currentTime;
}
