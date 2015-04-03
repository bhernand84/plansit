
function ShowWaitLoader(){
    var waitDialog = $('#loading');
    var waitImage = $('#loading-image');
    waitDialog.addClass('loading');
    waitImage.addClass('loading-image');
}

function CloseWaitLoader(){
    var waitDialog = $('#loading');
    var waitImage = $('#loading-image');
    waitDialog.removeClass('loading');
    waitImage.removeClass('loading-image');

}

function checkRefParam() {
        var paramValue = getRequestParameter('ref');
        if (paramValue) {
            writeCookie('ref', paramValue);
    }
}
function getRequestParameter(name) {
    name = name.toLowerCase();
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search.toLowerCase()))
        return decodeURIComponent(name[1]);
}