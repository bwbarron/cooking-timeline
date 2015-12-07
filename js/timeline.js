/**
 * Created by Brad on 12/6/15.
 */
$(document).ready(function() {
    //dummy data
    var ingredients = [
        {
        name: "chicken",
        preptime: 300,
        prepstart: 0,
        cooktime: 2100,
        cookstart: 300
    },
        {
        name: "broccoli",
        preptime: 900,
        prepstart: 300,
        cooktime: 1020,
        cookstart: 1200
    },
        {
        name: "sauce",
        preptime: 600,
        prepstart: 1200,
        cooktime: 0,
        cookstart: 1800 }
    ];

    //Get the full width of the timeline in pixels
    function findContainerTotalTime(ingredients) {
        var time = 0;
        var i;
        for (i = 0; i < ingredients.length; ++i) {
            var item = ingredients[i];
            var total = item.preptime + item.cooktime;
            if (total > time) {
                time = total;
            }
        }
        return time;
    }

    var containerWidth = findContainerTotalTime(ingredients);
    console.log(containerWidth);

    // add timeline div to doc
    var timelineContainer = $('#timelineContainer');
    timelineContainer.css({
            "position": "fixed",
            "width": containerWidth,
            "height": "800px",
            "margin-left": containerWidth,
            "overflow": "hidden",
            "background-color": "#2f59ce",
            "z-index": "-1"
        });

    var i;
    for (i = 0; i < ingredients.length; ++i) {
        var item = ingredients[i];
        var rowHeight = 800 / ingredients.length;
        console.log(rowHeight);
        var waitTime = containerWidth - item.cooktime - item.preptime;
        var row = $("<div></div>")
            .css({
                "height": "" + rowHeight + "px",
                "width": "inherit"
            })
            .addClass("row");

        var wait = $("<div></div>")
            .css({
                "height": "inherit",
                "width": waitTime,
                "display": "inline-block"
            })
            .addClass("wait");

        var prepare = $("<div></div>")
            .css({
                "height": "inherit",
                "width": item.preptime,
                "display": "inline-block"
            })
            .addClass("prepare");

        var cook = $("<div></div>")
            .css({
            "height": "inherit",
            "width": item.cooktime,
            "display": "inline-block"
            })
            .addClass("cook");

        row.append(wait).append(prepare).append(cook);
        timelineContainer.append(row);
    }

    var playhead = $('#playhead');

    var timeline = new TimelineMax({
        onStart: start,
        onUpdate: update,
        onComplete: complete
    });

    //"margin-left": -containerWidth works
    TweenMax.to(
        timelineContainer, 2, {ease: Power0.easeNone, "margin-left": -containerWidth / 2 }
    );

    //callback functions for elements if we want
    function start() {
        console.log('timeline started');
    }

    function update() {
        //console.log(timeline.progress().toFixed(2));
    }

    function complete() {
        console.log('complete');
    }
});