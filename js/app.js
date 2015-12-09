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
        $scope.meal = [];
        $scope.counter = 0;

        $scope.addDish = function() {
            var blankDish = {id: $scope.counter, name: '', components: []};
            $scope.meal.push(blankDish);
            $scope.addComponent($scope.meal.length - 1);
            $scope.counter++;
        };

        $scope.addComponent = function(index) {
            var blankComponent = {id: $scope.counter, name: '', prepTime: '', cookTime: '', coolTime: '', method: ''};
            $scope.meal[index].components.push(blankComponent);
            $scope.counter++;
        };

        $scope.removeDish = function(index) {
            $scope.meal.splice(index, 1);
        };

        $scope.removeComponent = function(index, parentIndex) {
            $scope.meal[parentIndex].components.splice(index, 1);
        };

    })
    .controller("TimelineController", function ($scope) {
        "use strict";

    });