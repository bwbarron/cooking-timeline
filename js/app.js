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
    .controller("TimelineController", function ($scope) {
        "use strict";

    });