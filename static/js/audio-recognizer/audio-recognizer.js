(function (){
    var AudioRecognizer = function(){
        var xmlhttp;

        this.initialize = function (onSuccess){
            if (window.XMLHttpRequest)  // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
            else  // code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");

            xmlhttp.onreadystatechange=function()
            {
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                    onSuccess(xmlhttp.responseText);
            }
        }

        this.recognize = function (flacData){
            xmlhttp.open("POST", "http://43.82.40.45:3010/recognize?timeout=10", true);
            xmlhttp.setRequestHeader("Content-Type", "audio/x-flac; rate=16000");
            xmlhttp.send(flacData);
        }
    }

    window.AudioRecognizer = AudioRecognizer;

})();