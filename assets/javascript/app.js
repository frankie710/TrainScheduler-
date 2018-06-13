// Initialize Firebase
var config = {
    apiKey: "AIzaSyD3s6VCpIVRrffdENAc-W0DL-UmOmSl3uU",
    authDomain: "trainscheduler-ff74a.firebaseapp.com",
    databaseURL: "https://trainscheduler-ff74a.firebaseio.com",
    projectId: "trainscheduler-ff74a",
    storageBucket: "gs://trainscheduler-ff74a.appspot.com/",
    messagingSenderId: "417465652455"
};
firebase.initializeApp(config);
var database = firebase.database();


$(document).ready(function () {
    $("#submitButton").on("click", "#submitBTN", function () {
        event.preventDefault();
        var rows = "";
        var trainName = $('#newTrain').val().trim();
        var des = $('#newDes').val().trim();
        var time = $("#newTime").val().trim();
        validateTime(time)
        var freq = $('#newFreq').val().trim();


        var timeConvert = moment().format('HH:mm')
        var trainTimeConvert = time.split(":");
        var trainHour = parseInt(trainTimeConvert[0]);
        var trainMinute = parseInt(trainTimeConvert[1]);
        var currentDate = new Date();
        var currentHours = currentDate.getHours();
        var currentMinutes = currentDate.getMinutes();
        var getNowSecs = (currentHours * 60 * 60) + (currentMinutes * 60);
        var getTrainSecs = (trainHour * 60 * 60) + (trainMinute * 60);


        if (getNowSecs > getTrainSecs) {
            var diff = Math.abs(getNowSecs - getTrainSecs);
            var diffMins = diff / 60;
            var nextArrive = diffMins % freq;
            var minsTill = freq - nextArrive;
            var nextTrain = moment().add(minsTill, "minutes").format('HH:mm');
            rows += "<tr><td>" + trainName + "</td><td>" + des + "</td><td>" + freq + "</td><td>" + nextTrain + "</td><td>" + minsTill + "</td><td>";
            $(rows).appendTo("#infoTable");
        }
        else if (getNowSecs < getTrainSecs) {
            var nextTrain = time;
            var diff = Math.abs(getTrainSecs - getNowSecs);
            var diffMins = diff / 60;
            rows += "<tr><td>" + trainName + "</td><td>" + des + "</td><td>" + freq + "</td><td>" + nextTrain + "</td><td>" + diffMins + "</td><td>";
            $(rows).appendTo("#infoTable");
        }


        var trainInfo = {
            Name: trainName,
            Destination: des,
            FirstArrival: time,
            Frequency: freq,
            NextTime: nextTrain,
            MinutesAway: diffMins,
        }



        $('#newTrain').val('');
        $('#newDes').val('');
        $('#newTime').val('');
        $('#newFreq').val('');



        database.ref().push(trainInfo)

        database.ref().on("child_added", function (childSnapshot, prevChildKey) {


            var train = childSnapshot.val().trainName;
            var destination = childSnapshot.val().des;
            var timeArrive = childSnapshot.val().time;
            var freqRate = childSnapshot.val().freq;
            var nextArrival = childSnapshot.val().nextTrain;
            var minsAway = childSnapshot.val().diffMins;
        });

    });


    function validateTime(timeInput) {
        var isValid = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(timeInput);

        if (isValid) {
            var a = 2;
        } else {
            alert('Time is Invalid!');
        }

        return isValid;
    }

});