var activities = [];



// load activities array from localStorage
var loadActivities = function() {
    activities = JSON.parse(localStorage.getItem("activities"));
    // if there is nothing for this in localStorage, get out
    if (!activities){
        activities = [];
        return;
    } 
    // otherwise replace empty textarea values with corresponding activities array.text
    else {
        $("textarea").each(function() {
            for (var i = 0; i < activities.length; ++i) { 
                if (activities[i].id === parseInt($(this).attr("id"))){
                $(this).val(activities[i].text);
                }
            
            }
        });
    }    
};

var clearAll = function (){
    var confirmClear = window.confirm("This will clear your current schedule. Are you sure you want a new schedule?")
        if (confirmClear){
            activities = [];
            saveActivity();
            return window.location.assign((href = "./index.html"));
        }
        else {
            return;
        }
}

$("#clear").on("click", clearAll);

// save activities array to localStorage
var saveActivity = function() {
    localStorage.setItem("activities", JSON.stringify(activities));
};

// Save activities on button click
$(".saveBtn").on("click", function(){
        // get textarea text and id
        activityText = $(this).prev().children("textarea").val().trim();
        activityId = $(this).prev().children("textarea").attr("id");
        // convert id to integer
        activityIndex = parseInt(activityId);
        // store id integer and text in an object
        activityObj = {id: activityIndex, text: activityText};
        // if there are no objects in activities array then push
        if (activities.length === 0) {
            activities.push(activityObj);
            console.log(activities);
        }
        // otherwise, loop over activities array
        else { 
            for (var i = 0; i < activities.length; ++i) {
                // if an object id matches the new activity id, delete it
                if (activities[i].id === activityObj.id) {
                    activities.splice(activities[i].id, 1);
                }
            }
            // push the new activityObj
            activities.push(activityObj);
            // sort the objects by id so the next time it is updated the correct item will be spliced
            activities.sort((a, b) => a.id - b.id);
        }
        // save activities array to localStorage
        saveActivity();
});

// blur save
$(".activity-text").on("blur", function(){
    // get textarea text and id
    activityText = $(this).val().trim();
    activityId = $(this).attr("id");
    // convert id to integer
    activityIndex = parseInt(activityId);
    // store id integer and text in an object
    activityObj = {id: activityIndex, text: activityText};
    // if there are no objects in activities array then push
    if (activities.length === 0) {
        activities.push(activityObj);
        console.log(activities);
    }
    // otherwise, loop over activities array
    else { 
        for (var i = 0; i < activities.length; ++i) {
            // if an object id matches the new activity id, delete it
            if (activities[i].id === activityObj.id) {
                activities.splice(activities[i].id, 1);
            }
        }
        // push the new activityObj
        activities.push(activityObj);
        // sort the objects by id so the next time it is updated the correct item will be spliced
        activities.sort((a, b) => a.id - b.id);
    }
    // save activities array to localStorage
    saveActivity();
});

// audit each time block and determine the status of the activity as past, present, or future
var timeStatusAudit = function() {
    $(".hour").each(function (){
    // set current time to military time rounded down on the hour
    var currentTime = Math.floor(moment().format('H'));
    // set time for comparison by parsing the unique data-time attribute for each hour div
    var activityTime = parseInt($(this).attr("data-time"));
    if (activityTime === currentTime) {
        $(this).siblings(".activity").removeClass("future").addClass("present");
    }
    else if (activityTime - currentTime < 0) {
        $(this).siblings(".activity").removeClass("future");
        $(this).siblings(".activity").removeClass("present").addClass("past");
    }
    else if (activityTime - currentTime > 0) {
        $(this).siblings(".activity").removeClass("present");
        $(this).siblings(".activity").removeClass("past").addClass("future");
    }
    });
    // update activity time status every 15 minutes
    setTimeout(timeStatusAudit, 900000);
};



// Set current date (added time for user clarity)
var setDateTime = function() {
$("#date").text(moment().format('dddd, MMMM Do, hh:mm a')); 
// update current time every 15 minutes
setTimeout(setDateTime, 900000);
};

setDateTime();
timeStatusAudit();
loadActivities();