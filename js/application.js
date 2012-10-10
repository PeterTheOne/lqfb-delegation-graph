$(function(){

    /*function gameLoop() {
        //update();
        //draw();
    }

    var intervalId;

    function startGameLoop() {
        intervalId = setInterval(gameLoop, 1000 / FPS);
    }

    function endGameLoop() {
        clearInterval(intervalId);
    }*/


    lqfbDelegationGraph.start();
});

function getURLParameter(name) {
    var result = decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
    if (result && result != 'null') {
        return result;
    }
    return null;
}

function stripTrailingSlash(str) {
    if(str.substr(-1) == '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

