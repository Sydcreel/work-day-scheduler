//variables

var currentDay = $("#currentDay");
var timeBlock = $(".time-block");
var scheduleZone = $(".schedule");

var taskItems = [];

var currentDate = moment().format("dddd, MMMM Do");
var currentHour = moment().format("H");

// if no tasks to do, set up object array

function startSchedule(){
    //go thru each timeblock.
    timeBlock.each(function(){
        var currentBlock = $(this);
        var currentBlockHour = parseInt(currentBlock.attr("data-hour"));

        var taskObj = {
            hour: currentBlockHour,
            text: ""
        }
        //add obj to item array
        taskItems.push(taskObj);
    });

    //now save array to Local storage -->stringify

    localStorage.setItem("tasks", JSON.stringify(taskItems));

}

//color-coded time block -- based on current time

function colorBlock(){
    timeBlock.each(function(){
        var currentBlock = $(this);
        var currentBlockHour = parseInt(timeBlock.attr("data-hour"))
        //style for blocks based on current time of day
        if (currentBlockHour === currentHour) {
            currentBlock.addClass("present").removeClass("future past")
        }
        if (currentBlockHour > currentHour) {
            currentBlock.addClass("future").removeClass("present past")
        }
        else {
            currentBlock.addClass("past").removeClass("future present")
        }
    });    
}


//render the schedule to page

function renderSchedule(){
    taskItems = localStorage.getItem("tasks");
    taskItems = JSON.parse(taskItems);
    //for loop to iterate through task array
    for (var i = 0; i < taskItems.length; i++) {
        //set variables that get entered in their respective time blocks.
        var itemTime = taskItems[i].hour;
        var itemTask = taskItems[i].text;

        $("data-hour=" + itemTime + "]").children("textarea").val(itemTask);
    }

    //console.log(taskItems);
}

//save task

function saveTask(){
    //parent block
    var thisBlock = $(this).parent();
    //update variables
    var hourUpdate = $(this).parent().attr("data-hour");
    var itemAdd = ($(this).parent()).children("textarea").val();

    //for loop to iterate thru task items and update to match hours, new variable
    for (var x = 0; x < taskItems.length; x++){
        if (taskItems[x].hour === hourUpdate){
            //delegate text
            taskItems.text = itemAdd
        }
    }
    //now set item to localstorage, stringify task items
    localStorage.setItem("tasks", JSON.stringify(taskItems))
    //call renderSchedule

    renderSchedule();



}

//define what happens when document loads up

$(document).ready(function(){
    //call colorBlock
    colorBlock();
    //verify there is nothing in local storage then call startSchedule if there is nothing in LS
    if (!localStorage.getItem("tasks")){
        startSchedule();
    }
    //print date
    currentDay.text(currentDate);

    //call render
    renderSchedule();
    //save input when task item's save button is clicked.
    scheduleZone.on("click", "button", saveTask);

});