$(document).ready(function() {
    var box = $('#box');
    var box2 = $('#box2');
    var timeline = new TimelineLite({
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

    timeline.to(
        box,
        1,
        {
            left: 0
        }
    ).to(
        box2,
        1,
        {
            left: 0
        }

    );

    //callback functions for elemtents if we want
    function start() {
        console.log('timeline started');
    }

    function update() {
        console.log('update');
    }

    function complete() {
        console.log('complete');
    }
});