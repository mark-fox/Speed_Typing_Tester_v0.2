var elapsedTime = 0;        // Holds count of seconds.
var theInterval;            // Interval object.
var setString;              // String from API.
var youMayStart = false;    // Flag that 'Start' button was pressed.
var numErrors = 0;          // Error counter.
var setStringArray = [];    // Array to hold characters of string.
var errorFlag = false;      // Flag that wrong key was pressed.
var winner = false;         // Flag that string has been completed.

var scoreTbl, asc1 = 1;



// Function ran at start that adds event listeners to specific elements.
function addMyListeners() {

/******
 START BUTTON - typethis.hbs
 ******/
    $('#startBtn').click(function () {
        // Checks if interval has been set already to avoid activating
        // multiple instances (speeds up clock).
        if (theInterval == null) {
            theInterval = setInterval(function () {
                elapsedTime++;
                var minutes = Math.floor(elapsedTime / 60);
                var seconds = Math.floor(elapsedTime % 60);
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                // Sets element's text to the count. Ran every second.
                $('#timer').text(minutes + ":" + seconds);
            }, 1000);
            // Activates flag that other functions use.
            youMayStart = true;
        }
    });




/******
 DONE BUTTON - typethis.hbs
 ******/
    $('#doneBtn').click(function () {
        // Checks if flag is activated before continuing.
        if (youMayStart) {
            // Stops the time counter.
            clearInterval(theInterval);
            youMayStart = false;
            // Sets hidden elements' values to be passed to server.
            $('#hiddenTypedText').val($('#typedText').text());
            $('#numErrors').val(numErrors);
            $('#timeTaken').val(elapsedTime);
        }
        else {
            console.log("uh uh uhh; gotta try first!");
            return false;
        }
    });




/******
 TYPING EVENTS - typethis.hbs
 ******/
    // Prevents Copy and Paste within div.
    $('#typingMessage').bind('copy', function() {
        console.log("trying to copy is wrong!");
        return false;
    });
    $('#typingMessage').bind('paste', function() {
        console.log("trying to paste is wrong!");
        return false;
    });

    // Keypress event that checks input for correct values.
    $('#typingMessage').keypress(function(e) {
        // Prevents any further action if flags are set.
        if (youMayStart == false || winner == true) { return false; }
        // Checks if variable is empty and assigns string value to it.
        if (setString == null) {
            setString = $('#msgToType').text();
            //// Splits string into char array. Currently not in use.
            // for (var i = 0; i < setString.length; i++) {
            //     setStringArray[i] = setString.charCodeAt(i);
            // }
        }
        // Grabs value entered already.
        var typedString = $('#typedText').text();
        // Runs function to check if strings match.
        if (checkWin(setString, typedString)) { return; }

        // Loops through element value.
        for (i = 0; i < typedString.length; i++) {
            // Compares each character.
            if (setString.charAt(i) != typedString.charAt(i)) {
                // Checks for periods, which don't seem to work in above check.
                if (setString.charAt(i) != "." && typedString.charAt(i) != ".") {
                    // Sets flag and runs border color changing function.
                    errorFlag = true;
                    borderColor(1);
                    return;
                }
            }
        }
        // Combines current value with entered key and adds to element.
        var newString = typedString + String.fromCharCode(e.which);
        $('#typedText').text(newString);
        checkWin(setString, newString);
    });

    // Keyup event that checks for certain keys.
    $('#typingMessage').keyup(function(e) {
        // Checks for backspace keypress.
        if (e.keyCode == 8) {
            // Captures element's value and slices it.
            var typedString = $('#typedText').text();
            typedString = typedString.slice(0, -1);
            $('#typedText').text(typedString);
            // Resets border color.
            borderColor(999);
        }

        if (errorFlag) {
            numErrors++;
            errorFlag = false;
        }

        if (e.which == 13) {
            $('#doneBtn').trigger('click');
        }
    })
}




/******
 TABLE SORT FUNCTION - table.hbs
 ******/
function sortScoreTbl(tbody, col, asc) {
    asc1 *= -1;
    // Captures 'tr's in variable.
    var myRows = tbody.rows;
    // Counts number of rows.
    var numRows = myRows.length;
    // Defines empty variables to be filled in.
    var rowsArray = new Array();
    var rowCells, numCells;
    // Loops through table rows.
    for (var i = 0; i < numRows; i++) {
        // Captures 'td's in row.
        rowCells = myRows[i].cells;
        // Counts number of cells.
        numCells = rowCells.length;
        rowsArray[i] = new Array();
        // Saves cell value to array.
        for (var j = 0; j < numCells; j++) {
            rowsArray[i][j] = rowCells[j].innerHTML;
        }
    }
    rowsArray.sort(function(a, b) {
        // Makes default return value variable and parses passed values.
        var retval = 0;
        var fA = parseFloat(a[col]);
        var fB = parseFloat(b[col]);
        if (a[col] != b[col]) {
            // First checks if numerical.
            if ((fA == a[col]) && (fB == b[col])) {
                retval = (fA > fB) ? asc : asc * -1;
            }
            // Non-numerical?
            else {
                retval = (a[col] > b[col]) ? asc : asc * -1;
            }
        }
        return retval;

    });

    // Adds values back to table.
    for (i = 0; i < numRows; i++) {
        myRows[i].innerHTML = "<td>" + rowsArray[i].join("</td><td>") + ("</td>");
    }
}





/******
 BORDER COLOR CHANGING FUNCTION - typethis.hbs
 ******/
function borderColor(option) {
    // Defines initial CSS string.
    var theColor = "4px solid";
    // Determines which change to make based on provided parameter.
    switch (option) {
        case 1:     // RED for wrong!
            theColor += " #ff0e1b";
            break;
        case 2:     // GREEN for complete!
            theColor += " #4aeb4d";
            break;
        default:    // Blank for otherwise.
            theColor = "0";
            break;
    }
    // Changes CSS of textbox border.
    $('#msgToType').css("border", theColor);
}




/******
 WIN CHECK FUNCTION - typethis.hbs
 ******/
function checkWin(string1, string2) {
    if (string1 === string2) {
        winner = true;
        borderColor(2);
        return true;
    }
    else { return false; }
}



// Actions ran at start:
addMyListeners();
scoreTbl = $('#tblRows');
$('#typingMessage').focus();





// helpers:
// http://stackoverflow.com/questions/109086/stop-setinterval-call-in-javascript
// http://stackoverflow.com/questions/4604057/jquery-keypress-ctrlc-or-some-combo-like-that
// http://stackoverflow.com/questions/1772179/get-character-value-from-keycode-in-javascript-then-trim
// http://stackoverflow.com/questions/3977792/how-to-convert-keycode-to-character-using-javascript
// http://stackoverflow.com/questions/25872902/how-can-i-detect-ctrl-v-in-javascript-for-ie-and-firefox
// https://forums.asp.net/t/1662177.aspx?Capture+a+Client+Side+KeyPress+with+Javascript+and+Run+a+Server+Side+Event+with+ASP+NET+VB+NET
// http://www.mkyong.com/jquery/how-to-detect-copy-paste-and-cut-behavior-with-jquery/
// https://www.w3schools.com/angular/angular_validation.asp
// http://jsfiddle.net/kgondra/qGf45/
// https://codereview.stackexchange.com/questions/37632/sorting-an-html-table-with-javascript
// https://stackoverflow.com/questions/3149362/capture-key-press-or-keydown-event-on-div-element