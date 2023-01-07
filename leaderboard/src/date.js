function getTimestamp(){

    const date = document.lastModified;

    document.getElementById('timestamp').innerHTML = "Leaderboard last updated: " + date;
}
