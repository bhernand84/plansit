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