angular.module("Timeline", ["ui.router"])
    .config(function ($stateProvider, $urlRouterProvider) {
        // ui routing config goes here
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
                        for (var i = 0; i < scope.meal.length; i++) {
                            for (var j = 0; i < scope.meal[i].components.length; j++) {
                                var component = scope.meal[i].components[j];
                                if (component.prepTime === '00:00:00' && component.cookTime === '00:00:00' && component.coolTime === '00:00:00') {
                                    return false;
                                }
                            }
                        }
                        return true;
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