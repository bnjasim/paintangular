angular.module('main', [])

.directive('paintangular', function() {
	
	return {
		restrict: 'E',
		replace: true,
		scope: {},

		controller: ['$scope', function($scope) {
			$scope.color = 'black'; // default stroke color
			$scope.tools = 'pencil';
			$scope.size = 2;

			$scope.setColor = function(c) {
				$scope.color = c;
				console.log(c);
			}

			$scope.setTool = function(t) {
				$scope.tool = t;
				console.log(t);
			}

			$scope.chooseSize = function(s) {
				$scope.size = s;
				console.log(s);
			}			
		}],

		templateUrl: "template.html"
    	
	}
})

.directive('canvasable', function() {

	return {
		restrict: 'A',
		require: '^paintangular',

		link: function(scope, element, attrs, paintCtrl) {
			var canvas = element.children().eq(0)[0];
			var temp_canvas = element.children().eq(1)[0];
			canvas.width = element[0].clientWidth;
			canvas.height = element[0].clientHeight;
			temp_canvas.width = canvas.width;
			temp_canvas.height = canvas.height;
			
		}
	}
})
