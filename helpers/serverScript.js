module.exports = {
    // Function that calculates values from the passed data.
    calcAccuracy : function(typedRound, quote)
    {
        // Grabs values from passed data.
        var numTypedChars = typedRound.typedText.length;
        var errorCount = typedRound.numErrors;
        var timeTaken = typedRound.time / 60;   // Converted to minutes for WPM calculation.

        // Checks if the user submitted a shorter string and gave up early.
        // Each missed character counts as another error and is added
        // to the total.
        if (quote.length > numTypedChars) {
            var diff = 0;
            diff += (quote.length - numTypedChars);
            errorCount += diff;
        }
        // Calculates values.
        var wordsCount = numTypedChars / 5; // This calc balances words of different length.
        var wpmCalc = (wordsCount - errorCount) / timeTaken;
        // Accuracy is determined by removing the number of errors from the number
        // of typed characters and divided by the length of the quote string.
        // It should be the percentage of the quote the user correctly typed
        // without errors.
        var accuracyCalc = ((numTypedChars - errorCount) / quote.length) * 100;

        // Updates the data object's values while also reducing the number
        // of decimal places.
        typedRound.wpm = wpmCalc.toFixed(2);
        typedRound.accuracy = accuracyCalc.toFixed(0);
        typedRound.numErrors = errorCount;

        // Sends data object back to be saved.
        return typedRound;
    },



    // Function that determines which message to show user depending on their accuracy score.
    getMessage : function(score) {
        // Static list of messages.
        var msgs = ["Perfect!", "Nice job!", "Not too shabby!", "Not bad; not good, but not bad.", "I have seen worse.", "Who needs computers anyways?!"];
        var msg;
        // Determines which message to return.
        switch (true) {
            case score == 100:
                msg = msgs[0];
                break;
            case score > 90:
                msg = msgs[1];
                break;
            case score > 80:
                msg = msgs[2];
                break;
            case score > 70:
                msg = msgs[3];
                break;
            case score > 60:
                msg = msgs[4];
                break;
            default:
                msg = msgs[5];
                break;
        }
        return msg;
    }
};






// helpers:
// https://www.speedtypingonline.com/typing-equations
// https://stackoverflow.com/questions/35749288/separate-file-for-routes-in-express
// https://stackoverflow.com/questions/5464362/javascript-using-a-condition-in-switch-case