angular.module("Timeline", ["ui.router"])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('form', {
                url: '/form',
                templateUrl: 'views/forms.html',
                controller: 'FormController'
            })
            .state('timeline', {
                url: '/timeline',
                templateUrl: 'views/timeline.html',
                controller: 'TimelineController'
            });
        $urlRouterProvider.otherwise('/form');
    })
    .directive('timeIsPresent', function() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, controller) {
                controller.$validators.timeIsPresent = function(modelValue) {
                    var timeInputs = getAllElementsWithAttribute("time-is-present");
                    for (var i = 0; i < timeInputs.length; i++) {
                        if (timeInputs[i].value !== "00:00:00" && timeInputs[i].value !== "") {
                            return true;
                        }
                    }
                    return false;
                };

                function getAllElementsWithAttribute(attribute) {
                    var matchingElements = [];
                    var allElements = document.getElementsByTagName('*');
                    for (var i = 0, n = allElements.length; i < n; i++) {
                        if (allElements[i].getAttribute(attribute) !== null) {
                            matchingElements.push(allElements[i]);
                        }
                    }
                    return matchingElements;
                }
            }
        };
    })
    .controller("FormController", function ($scope, FoodService) {
        "use strict";
        $scope.methods = ['Oven', 'Microwave', 'Burner', 'Grill'];
        $scope.preps = ['Microwave', 'Mixer', 'Blender', 'Other'];
        $scope.meal = [];

        $scope.addComponent = function() {
            var blankComponent = {name: '', prepTime: '', cookTime: '', coolTime: '', method: ''};
            $scope.meal.push(blankComponent);
        };

        $scope.removeComponent = function(index) {
            $scope.meal.splice(index, 1);
        };

        $scope.submit = function() {
            FoodService.setMeal($scope.meal);
            console.log($scope.meal);
        }

    })
    .controller("TimelineController", function ($scope, FoodService) {
        "use strict";

        $scope.meals = FoodService.getMeals();
        var ingredients = $scope.meals;

        function parseSeconds(timeString) {
            var hours = 3600 * parseInt(timeString.splice(0,2));
            var minutes = 60 * parseInt(timeString.splice(3,5));
            var seconds = parseInt(timeString.splice(6,8));

            return hours + minutes + seconds;
        }


        //for fullscreen
        /*
        $('#btn').on('click', function() {
            if (screenfull.enabled) {
                screenfull.request();
            }
        });
        */



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
            var Ta = a.cookTime + a.prepTime;
            var Tb = b.cookTime + b.prepTime;
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
                var total = item.prepTime + item.cookTime;
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
            item.waitTime = containerWidth - item.cookTime - item.prepTime - item.coolTime;
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
                    "width": item.prepTime,
                    "display": "inline-block"
                })
                .addClass("prepare");
            if (item.prepTime && item.prepTime > 80) {
                prepare.append(text);
            }

            text = $("<span class='innertext'>Cook</span>");
            var cook = $("<div></div>")
                .css({
                    "height": "inherit",
                    "width": item.cookTime,
                    "display": "inline-block"
                })
                .addClass("cook");
            if (item.cookTime && item.cookTime > 50) {
                cook.append(text);
            }

            text = $("<span class='innertext'>Cool</span>");
            var cool = $("<div></div>")
                .css({
                    "height": "inherit",
                    "width": item.coolTime,
                    "display": "inline-block"
                })
                .addClass("cool");
            if (item.coolTime && item.coolTime > 80) {
                cool.append(text);
            }

            //build divs
            row.append(wait).append(prepare).append(cook).append(cool);
            rows.push(row);
            timelineContainer.append(row);
            //set timeline labels
            t1.addLabel("Prepare the " + item.name, item.waitTime);
            t1.addLabel("Cook the " + item.name, item.prepTime + item.waitTime);
            t1.addLabel("Let the " + item.name + " cool", item.cookTime + item.prepTime + item.waitTime);

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
        var meals;

        var setMeal = function(obj) {
            meals = obj;
        };

        var getMeals = function() {
            return meals;
        };

        return {
            setMeal: setMeal,
            getMeals: getMeals
        };
    });