$(function(){
    var ASR = function(){
        Recorder = this;
        Recorder.initialize = initialize;
        Recorder.start = start;
        Recorder.stop = stop;
        Recorder.onStatusUpdate = on_status_update;
        Recorder.onWavData = on_wav_data;

        function initialize(){
        //IE brower doesn't support context audio recorder
        //Recorder.recorderInstance = new ContextAudioRecorder();
        if (Recorder.recorderInstance && Recorder.recorderInstance.initialize(Recorder.onStatusUpdate)){

            } else {
            Recorder.recorderInstance = new FlashAudioRecorder();
            Recorder.recorderInstance.initialize(Recorder.onStatusUpdate);

            }
            var recorderButton = document.getElementById(RECORDER_BUTTON_ID);
            recorderButton.onmousedown = Recorder.start;
            recorderButton.onmouseup = Recorder.stop;

            wavToFlac = new WavToFlac();
            wavToFlac.initialize(on_flac_data);

            audioRecognizer = new AudioRecognizer();
            audioRecognizer.initialize(on_recongnize_result);

        }

        function on_wav_data(){
            console.log("Recorder on_wav_data");
            var wavData = Recorder.recorderInstance.getWavData();
            var wavData_Uint8Array = new Uint8Array(wavData);
            wavToFlac.wav_to_flac(wavData_Uint8Array);
        }

        function on_flac_data(flacData){
            console.log("Recorder on_flac_data");
            audioRecognizer.recognize(flacData);
        }

        // Handle the recognize result
        function on_recongnize_result(result){
            console.log("Recorder on_recongnize_result");
            var jsonResult = JSON.parse(result);
            // jsonResult format: {id: "SCRL-MARD2-Z820-45-speech/2017-06-21/16-38-21", hypotheses: Array(1), status: 0}
            // jsonResult.hypotheses[0] format: {utterance: "嗯", confidence: 1}
            var recognizeResult = jsonResult.hypotheses[0].utterance;
            if (recognizeResult == "")
                recognizeResult="No Recognize Result";
            document.getElementById("recognizeResult").innerHTML = recognizeResult;
        }

        function start(){
            console.log("Recorder start");
            document.getElementById("recognizeResult").innerHTML = "Recording...";
            Recorder.recorderInstance && Recorder.recorderInstance.start();
        }

        function stop(){
            console.log("Recorder stop");
            document.getElementById("recognizeResult").innerHTML = "Recognizing...";
            Recorder.recorderInstance && Recorder.recorderInstance.stop();
        }

        function on_status_update(e){
            var $level = $('.level .progress');
            switch (e.status){
                case "ready":
                    console.log("Recorder on_status_update ready" );
                    break;
                case "record_finish":
                    console.log("Recorder record_finish" );
                    Recorder.onWavData();
                    $level.css({height: 0});
                    break;
                case "microphone_level":
                    $level.css({height: e.level * 100 + '%'});
                    //console.info('microphone_level');
                    break;
                case "error":
                    console.log("Recorder on_status_update error: " + e.status);
                    break;
            }
        }

    };
    window.RECORDER_BUTTON_ID = "recorderButton"
    window.RECORDER_APP_ID = "recorderApp";
    asr = new ASR();
    asr.initialize();
});