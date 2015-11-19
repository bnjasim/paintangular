angular.module('main', [])

.directive('paintangular', function() {
	
	return {
		restrict: 'E',
		replace: true,
		scope: {},

		controller: ['$scope', function($scope) {
			$scope.color = 'black'; // default stroke color

			$scope.setColor = function(c) {
				$scope.color = c;
				console.log(c);
			}
		}],

		templateUrl: "template.html"
    	
	}
})

