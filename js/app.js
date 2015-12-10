angular.module("Timeline", ["ui.router"])
    .config(function ($stateProvider, $urlRouterProvider) {
        // ui routing config goes here
        $stateProvider
            .state('form', {
                url: '/form',
                templateUrl: 'views/forms.html',
                controller: 'FormController'
            })
            .state('timeline', {
                url: '/timeline',
                templateUrl: 'views/timeline.hmtl',
                controller: 'TimelineController'
            });
        $urlRouterProvider.otherwise('/form');
    })
    .controller("FormController", function ($scope) {
        "use strict";
        $scope.methods = ['Oven', 'Microwave', 'Burner'];
        $scope.meal = [];

        $scope.addDish = function() {
            var blankDish = {name: 'Enter Dish Name', components: []};
            $scope.meal.push(blankDish);
            $scope.addComponent($scope.meal.length - 1);
        };

        $scope.addComponent = function(index) {
            var blankComponent = {name: 'Enter Component Name', time: '00:00:00', method: ''};
            $scope.meal[index].components.push(blankComponent);
        };

        $scope.removeDish = function(index) {
            $scope.meal.splice(index, 1);
        };

        $scope.removeComponent = function(index, parentIndex) {
            $scope.meal[parentIndex].components.splice(index, 1);
        };

    })
    .controller("TimelineController", function ($scope, FoodService) {
        "use strict";

        $scope.meals = FoodService.getMeals();
        var ingredients = $scope.meals;


        //for fullscreen
        $('#btn').on('click', function() {
            if (screenfull.enabled) {
                screenfull.request();
            }
        });

        //global vars
        var windowWidth = $(window).width();
        var startSeconds;
        var animating = false;
        var finished = false;


        //dummy data
        /*
        var ingredients = [
            {
                name: "chicken",
                preptime: 300,
                cooktime: 2100,
                cooltime: 180,
                cookresource: "oven",
                prepresource: ""
            },
            {
                name: "kale",
                preptime: 0,
                cooktime: 200,
                cooltime: 100

            },
            {
                name: "drinks",
                preptime: 300,
                cooktime: 0,
                cooltime: 0

            },
            {
                name: "broccoli",
                preptime: 900,
                cooktime: 1020,
                cooltime: 300
            }
        ];
        */

        //compares ingredient times based on cooktime + preptime
        function compareIng(a,b) {
            var Ta = a.cooktime + a.preptime;
            var Tb = b.cooktime + b.preptime;
            if (Ta < Tb) {
                return -1;
            }
            if (Ta > Tb) {
                return 1;
            }
            return 0;
        }

        //Sort the ingredients array so the timeline is cleaner
        ingredients.sort(compareIng);

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

        //calc the container width based on time
        var containerWidth = findContainerTotalTime(ingredients);
        var marginPoint = -containerWidth + (windowWidth / 2);

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

        // New timeline instance
        var t1 = new TimelineMax({onStart: start, onUpdate: update, onComplete: complete});

        var i;
        var rows =[];
        //dynamic html based on ingredients
        for (i = 0; i < ingredients.length; ++i) {
            var item = ingredients[i];
            var rowHeight = 60 / ingredients.length;
            item.waitTime = containerWidth - item.cooktime - item.preptime - item.cooltime;
            if (item.waitTime < 0) {
                item.waitTime = 0;
            }


            var row = $("<div></div>")
                .css({
                    "height": "" + rowHeight + "vh",
                    "width": "inherit"
                })
                .addClass("row");

            var recipeRow = $("<div class='label'>" + item.name + "</div>")
                .css({
                    "height": "" + rowHeight + "vh"
                })
                .addClass('recipeRow');

            var rs = $('#recipes');
            rs.append(recipeRow);

            var text = $("<span class='innertext'>Wait</span>");
            var wait = $("<div></div>")
                .css({
                    "height": "inherit",
                    "width": item.waitTime,
                    "display": "inline-block"
                })
                .addClass("wait");
            if (item.waitTime && item.waitTime > 50) {
                wait.append(text);
            }

            text = $("<span class='innertext'>Prepare</span>");
            var prepare = $("<div></div>")
                .css({
                    "height": "inherit",
                    "width": item.preptime,
                    "display": "inline-block"
                })
                .addClass("prepare");
            if (item.preptime && item.preptime > 80) {
                prepare.append(text);
            }

            text = $("<span class='innertext'>Cook</span>");
            var cook = $("<div></div>")
                .css({
                    "height": "inherit",
                    "width": item.cooktime,
                    "display": "inline-block"
                })
                .addClass("cook");
            if (item.cooktime && item.cooktime > 50) {
                cook.append(text);
            }

            text = $("<span class='innertext'>Cool</span>");
            var cool = $("<div></div>")
                .css({
                    "height": "inherit",
                    "width": item.cooltime,
                    "display": "inline-block"
                })
                .addClass("cool");
            if (item.cooltime && item.cooltime > 80) {
                cool.append(text);
            }

            //build divs
            row.append(wait).append(prepare).append(cook).append(cool);
            rows.push(row);
            timelineContainer.append(row);
            //set timeline labels
            t1.addLabel("Prepare the " + item.name, item.waitTime);
            t1.addLabel("Cook the " + item.name, item.preptime + item.waitTime);
            t1.addLabel("Let the " + item.name + " cool", item.cooktime + item.preptime + item.waitTime);

        }

        //Tween instantiations
        var animate = TweenMax.to(
            timelineContainer, 10, {ease: Power0.easeNone, "margin-left": marginPoint}
        );

        // add tween to timeline
        t1.add(animate);

        // flip Clock instantiation
        var clock = $('.your-clock').FlipClock(containerWidth,{
            countdown: true,
            clockFace: 'MinuteCounter'
        });

        // When the user clicks the play/pause button
        function togglePause() {
            if (animating) {
                animating = false;
                clock.stop();
                t1.pause();
            } else {
                animating = true;
                clock.start();
                t1.resume();
            }
        }

        //Animated play/pause button
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
            $('#instruction').text("Now: " + t1.currentLabel());
        }

        function complete() {
            animating = false;
            finished = true;
            $('#instruction').text("Your food is ready!");
            console.log('complete');
        }

    })
    .service('FoodService', function() {
        var meals = [];

        var addMeal = function(obj) {
            meals.push(obj);
        };

        var getMeals = function() {
            return meals;
        };

        return {
            addMeal: addMeal,
            getMeals: getMeals
        };
    });