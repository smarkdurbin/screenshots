function imageRefresh(imageURL, targetID, lastTimestamp) {
    document.getElementById(targetID).src = imageURL+'?timestamp='+Date.now();
    console.log(lastTimestamp);
}