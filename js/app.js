angular.module("Timeline", ["ui.router"])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('form', {
                url: '/form',
                templateUrl: 'views/forms.html',
                controller: 'FormController'
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
    .controller("FormController", function ($scope) {
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

    })
    .controller("TimelineController", function ($scope) {
        "use strict";

    });