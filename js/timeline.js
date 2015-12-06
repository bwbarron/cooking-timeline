/**
 * Created by iguest on 12/6/15.
 */
$(document).ready(function() {

    var ing1 = {
        name: "chicken",
        preptime: 300,
        prepstart: 1600,
        cooktime: 3000,
        cookstart: 2000
    };

    var ing2 = {
        name: "broccoli",
        preptime: 600,
        prepstart: 2000,
        cooktime: 1000,
        cookstart: 2600
    };

    var box = $('#box');
    var box2 = $('#box2');
    var playhead = $('#playhead');

    var timeline = new TimelineMax({
        onStart: start,
        onUpdate: update,
        onComplete: complete
    });
    var box2Time = 3;

    // ( variable,
    // animation length,
    // {
    // css properties
    // },
    // position in timeline
    // )

    TweenMax.to(
        playhead, 3, { right: 0 }
    );

    timeline.to(
        box, 3, { width: 100 }, 0
    ).to(
        box2, 3, { width: 100 }
    );

    //callback functions for elemtents if we want
    function start() {
        console.log('timeline started');
    }

    function update() {
        console.log(timeline.progress().toFixed(2));
    }

    function complete() {
        console.log('complete');
    }
});