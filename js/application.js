$(function(){
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

