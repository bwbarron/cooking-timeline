/**
 * Created by Brad on 12/6/15.
 */
$(document).ready(function() {
    //for fullscreen
    $('#btn').on('click', function() {
        if (screenfull.enabled) {
            screenfull.request();
        }
    });

    var windowWidth = $(window).width();
    var startSeconds;
    var animating = false;
    var finished = false;


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
    var marginPoint = -containerWidth + (windowWidth / 2);
    console.log(containerWidth);

    // add timeline div to doc
    var timelineContainer = $('#timelineContainer');
    timelineContainer.css({
            "position": "fixed",
            "width": containerWidth,
            "height": "inherit",
            "margin-left": windowWidth / 2,
            "overflow": "hidden",
            "z-index": "-1"
        });

    var t1 = new TimelineMax({onStart: start, onUpdate: update, onComplete: complete});

    var i;
    var rows =[];
    for (i = 0; i < ingredients.length; ++i) {
        var item = ingredients[i];
        var rowHeight = timelineContainer.height() / ingredients.length;
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
        rows.push(row);
        timelineContainer.append(row);
        //t1.addLabel("Prepare " + item.name, )
    }

    var playhead = $('#playhead');

    var timeline = new TimelineMax({
        onStart: start,
        onUpdate: update,
        onComplete: complete
    });




    //Tween
    var animate = TweenMax.to(
        timelineContainer, 5, {ease: Power0.easeNone, "margin-left": marginPoint}
    );

    t1.add(animate);

    function togglePause() {
        if (animating) {
            animating = false;
            $('#play').attr('display', 'block');
            $('#pause').attr('display', 'none');
            t1.pause();
        } else {
            animating = true;
            $('#pause').attr('display', 'block');
            $('#play').attr('display', 'none');
            t1.resume();
        }
    }

    $(".play-button").click(function() {

    });


    var flip = true,
        pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
        play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26",
        $animation = $('#animation');

    $(".ytp-play-button").on('click', function() {
        togglePause();
        flip = !flip;
        $animation.attr({
            "from": flip ? pause : play,
            "to": flip ? play : pause
        }).get(0).beginElement();
    });


    //callback functions for elements if we want
    function start() {
        console.log('timeline started');
        startSeconds = new Date().getTime() / 1000;
        animating = true;
    }

    function update() {
        //console.log(timeline.progress().toFixed(2));
    }

    function complete() {
        animating = false;
        finished = true;
        console.log('complete');
    }
});