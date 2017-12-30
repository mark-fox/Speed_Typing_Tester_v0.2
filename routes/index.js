var express = require('express');
var router = express.Router();
var passport = require('passport');

// Gets a random quote from API.
var quoteGrab = require('../helpers/quoteGrabber');

// Empty variables to hold values later.
var quote;
var currentUser;

// Grabs the model.
var Round = require('../models/typingRound');

// Grabs server functions.
var myFunctions = require('../helpers/serverScript');





/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.redirect('/table');
});

router.get('/table', isLoggedIn, function(req, res, next) {
    // Queries database for all entries.
    Round.find({}, function(err, docs) {
        // TODO probably can find the current user's scores this way.
        if(err) {
            return next(err);
        }
        // Sorts results with the largest WPM at the top.
        docs.sort(function(a,b) {
            return b.wpm - a.wpm;
        });

        // Renders page with the returned query results.
        res.render('table', {title: "Speed Typing Stat Tracker", typingScores: docs});
    });
});





// GET login page
router.get('/login', function(req, res, next) {
    res.render('login');
});

// POST login action
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/table',
    failureRedirect: '/login',
    failureFlash: true
}));





// GET logout action
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});





// GET signup page
router.get('/signup', function(req, res, next) {
    res.render('signup')
});
// POST signup action
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/table',
    failureRedirect: '/signup',
    failureFlash: true
}));





// GET typing page
router.get('/typethis', isLoggedIn, function(req, res, next) {
    // Grabs a quote collection from API.
    quoteGrab(function (data, error) {
        if (error) {
            res.render('error', {error: error.message});
        }
        // Stores quote in variable and removes any trailing spaces.
        quote = data[0].trim();
        // Renders page.
        res.render('typethis', { msgToType: quote });
    });
});






// POST results page
router.post('/results', function(req, res, next) {
    // Captures passed values into variables.
    var inputText = req.body.typedText;
    var numOfErrors = req.body.numErrors;
    var totalTime = req.body.timeTaken;

    // Creates a JSON object of fields and values for new Round object.
    var newEntry = {user: currentUser.local.username,
                    time: totalTime,
                    numErrors: numOfErrors,
                    typedText: inputText,
                    userid: currentUser._id};
    // Creates new Round object.
    var newRound = new Round(newEntry);
    // Runs functions to receive calculated values.
    newRound = myFunctions.calcAccuracy(newRound, quote);
    var msg = myFunctions.getMessage(newRound.accuracy);

    // Saves object to database.
    newRound.save(function(err) {
        if(err) {
            console.log('your error sir: ' + err.message);
            throw err;
        }
        // Renders page.
        res.render('results', {accuracyMessage: msg, typingRoundData: newRound});
    });
});




// GET 'Another' button's action.
router.get('/anotherGo', function(req, res) {
    res.redirect('/typethis');
});




// Function to check authentication before continuing.
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // Stores current user object in variable for use later.
        currentUser = req.user;
        return next();
    }
    res.redirect('/login');
}



module.exports = router;




// helpers:
// http://stackoverflow.com/questions/13782698/get-total-number-of-items-on-json-object
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
// https://stackoverflow.com/questions/17934207/handlebars-js-custom-function-sort
// https://www.npmjs.com/package/handlebars.numeral