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
			canvas.width = element[0].clientWidth; // offsetWidth include borders and padding
			canvas.height = element[0].clientHeight;
			temp_canvas.width = canvas.width;
			temp_canvas.height = canvas.height;
			var ctx = canvas.getContext('2d');
			var temp_ctx = temp_canvas.getContext('2d');

			/* Drawing on the temporary canvas and later copying into the canvas*/
			temp_ctx.lineWidth = 3;
			temp_ctx.lineJoin = 'round';
			temp_ctx.lineCap = 'round';
			temp_ctx.strokeStyle = 'black';
			temp_ctx.fillStyle = 'black';

			var mouse = {x: 0, y: 0};
			var start_mouse = {x:0, y:0};
			





			// paint functions
			var paint_pencil = function(e) {

				mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
				mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
				//console.log(mouse.x + " "+mouse.y);
				// Saving all the points in an array
				ppts.push({x: mouse.x, y: mouse.y});

				if (ppts.length < 3) {
					var b = ppts[0];
					temp_ctx.beginPath();
					//ctx.moveTo(b.x, b.y);
					//ctx.lineTo(b.x+50, b.y+50);
					temp_ctx.arc(b.x, b.y, temp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
					temp_ctx.fill();
					temp_ctx.closePath();
					return;
				}
				
				// Tmp canvas is always cleared up before drawing.
				temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
				
				temp_ctx.beginPath();
				temp_ctx.moveTo(ppts[0].x, ppts[0].y);
				
				for (var i = 0; i < ppts.length; i++) 
					temp_ctx.lineTo(ppts[i].x, ppts[i].y);
				
				temp_ctx.stroke();
				
			};
			
			var paint_line = function(e) {

				mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
				mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;	
				// Tmp canvas is always cleared up before drawing.
		    	temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
		 
		    	temp_ctx.beginPath();
		    	temp_ctx.moveTo(start_mouse.x, start_mouse.y);
		    	temp_ctx.lineTo(mouse.x, mouse.y);
		    	temp_ctx.stroke();
		    	temp_ctx.closePath();
			}

			var paint_square = function(e) {
				mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
				mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;	
				// Tmp canvas is always cleared up before drawing.
		    	temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
		 		temp_ctx.beginPath();
		    	temp_ctx.moveTo(start_mouse.x, start_mouse.y);

				var x = Math.min(mouse.x, start_mouse.x);
				var y = Math.min(mouse.y, start_mouse.y);
				var width = Math.abs(mouse.x - start_mouse.x);
				var height = Math.abs(mouse.y - start_mouse.y);
				temp_ctx.strokeRect(x, y, width, height);
				temp_ctx.closePath();
			}

			var paint_circle = function(e) {
				mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
				mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;	
				// Tmp canvas is always cleared up before drawing.
		    	temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
		 
		    	var x = (mouse.x + start_mouse.x) / 2;
		    	var y = (mouse.y + start_mouse.y) / 2;
		 
		    	//var radius = Math.max(Math.abs(mouse.x - start_mouse.x), Math.abs(mouse.y - start_mouse.y)) / 2;
		    	var a = mouse.x - start_mouse.x;
		    	var b = mouse.y - start_mouse.y;
		    	var r = Math.sqrt(a*a + b*b);
		 
			    temp_ctx.beginPath();
		    	//temp_ctx.arc(x, y, radius, 0, Math.PI*2, false);
		    	temp_ctx.arc(start_mouse.x, start_mouse.y, r, 0, 2*Math.PI);
		    	// temp_ctx.arc(x, y, 5, 0, Math.PI*2, false);
		    	temp_ctx.stroke();
		    	temp_ctx.closePath();
			}

			var paint_ellipse = function(e) {
				mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
				mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;	
				// Tmp canvas is always cleared up before drawing.
		    	temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
		 
		    	var x = start_mouse.x;
		    	var y = start_mouse.y;
		    	var w = (mouse.x - x);
		    	var h = (mouse.y - y);
		 		
		  		temp_ctx.save(); // save state
		        temp_ctx.beginPath();

		        temp_ctx.translate(x, y);
		        temp_ctx.scale(w/2, h/2);
		        temp_ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);

		        temp_ctx.restore(); // restore to original state
		        temp_ctx.stroke();
		        temp_ctx.closePath();

			}

			var move_eraser = function(e){
				mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
				mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;	
				// Tmp canvas is always cleared up before drawing.
				temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
				var tmp_lw = temp_ctx.lineWidth;
				var tmp_ss = temp_ctx.strokeStyle;
				temp_ctx.lineWidth = 1;
				temp_ctx.strokeStyle = 'black';
				temp_ctx.beginPath();
		    	temp_ctx.strokeRect(mouse.x, mouse.y, eraser_width, eraser_width);
		    	temp_ctx.stroke();
		    	temp_ctx.closePath();
		    	// restore linewidth
		    	temp_ctx.lineWidth = tmp_lw;
		    	temp_ctx.strokeStyle = tmp_ss;
			}

			var paint_text = function(e) {
				// Tmp canvas is always cleared up before drawing.
		    	temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
		     	mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
				mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;	

		    	var x = Math.min(mouse.x, start_mouse.x);
		    	var y = Math.min(mouse.y, start_mouse.y);
		    	var width = Math.abs(mouse.x - start_mouse.x);
		    	var height = Math.abs(mouse.y - start_mouse.y);
		     
		    	textarea.style.left = x + 'px';
		    	textarea.style.top = y + 'px';
		    	textarea.style.width = width + 'px';
		    	textarea.style.height = height + 'px';
		     
		    	textarea.style.display = 'block';
			}

			var paint_eraser = function(e) {
				mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
				mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;	
				// erase from the main ctx
		    	ctx.clearRect(mouse.x, mouse.y, eraser_width, eraser_width);
			}





			// Event listeners
			// Mouse-Down 
			temp_canvas.addEventListener('mousedown', function(e) {
				
				mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
				mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
				start_mouse.x = mouse.x;
		    	start_mouse.y = mouse.y;	
		    	temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);

		    	var tool = scope.tool;
				if (tool === 'pencil') {
					temp_canvas.addEventListener('mousemove', paint_pencil, false);
					ppts.push({x: mouse.x, y: mouse.y});
					paint_pencil(e);
				}
				
				if (tool === 'line') {
					temp_canvas.addEventListener('mousemove', paint_line, false);
		    	}

				if (tool === 'square') {
					temp_canvas.addEventListener('mousemove', paint_square, false);	
				}
				
				if (tool === 'circle') {
					temp_canvas.addEventListener('mousemove', paint_circle, false);
		    		// Mark the center
		    		
		    		temp_ctx.beginPath();
					//ctx.moveTo(b.x, b.y);
					//ctx.lineTo(b.x+50, b.y+50);
					temp_ctx.arc(start_mouse.x, start_mouse.y, temp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
					temp_ctx.fill();
					temp_ctx.closePath();
					// copy to real canvas
					ctx.drawImage(temp_canvas, 0, 0);	
				}

				if (tool === 'ellipse') {
					temp_canvas.addEventListener('mousemove', paint_ellipse, false);
		    	}

		    	if (tool === 'text') {
		    		temp_canvas.addEventListener('mousemove', paint_text, false);
		    		textarea.style.display = 'none'; // important to hide when clicked outside
		    	}

		    	if (tool === 'eraser') {
		    		temp_canvas.addEventListener('mousemove', paint_eraser, false);
		    		// erase from the main ctx
		    		ctx.clearRect(mouse.x, mouse.y, eraser_width, eraser_width);		
		    	}

		    	if (tool === 'fill') {
		    		var replacement_color = hex_to_color(temp_ctx.strokeStyle);
		    		//console.log(temp_ctx.strokeStyle);	
		    		var red_component = {'red':255, 'lime':0, 'blue':0, 'orange':255, 'yellow':255, 'magenta':255, 
								'cyan':0, 'purple':128, 'brown':165, 'gray':128, 'lavender':230, 
								'white':255, 'black':0};
					var green_component = {'red':0, 'lime':255, 'blue':0, 'orange':165, 'yellow':255, 'magenta':0, 
								'cyan':255, 'purple':0, 'brown':42, 'gray':128, 'lavender':230, 
								'white':255, 'black':0};
					var blue_component = {'red':0, 'lime':0, 'blue':255, 'orange':0, 'yellow':0, 'magenta':255, 
								'cyan':255, 'purple':128, 'brown':42, 'gray':128, 'lavender':250, 
								'white':255, 'black':0};												

		    		var replace_r = red_component[replacement_color];
		    		var replace_g = green_component[replacement_color];
		    		var replace_b = blue_component[replacement_color];

		    		var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
					var pix = imgd.data;
					// pix is row-wise straightened array
					var pos = 4 * (canvas.width * mouse.y + mouse.x);
					var target_color = map_to_color(pix[pos],pix[pos+1],pix[pos+2],pix[pos+3]);
					
					// start the flood fill algorithm
					if (replacement_color !== target_color) {
						var Q = [pos];
						while (Q.length > 0) {
							pos = Q.shift();
							if (map_to_color(pix[pos],pix[pos+1],pix[pos+2],pix[pos+3]) !== target_color)
								continue; // color is already changed

							var left = find_left_most_similar_pixel(pix, pos, target_color);
							var right = find_right_most_similar_pixel(pix, pos, target_color);
							// replace color
							//console.log('right: '+ (right/4)%canvas.width + ' '+ Math.floor(right/(4*canvas.width))  );
							//console.log(j+'. '+(right-left));
							for (var i=left; i<=right; i=i+4) {
								pix[i] = replace_r;
								pix[i+1] = replace_g;
								pix[i+2] = replace_b;
								pix[i+3] = 255; // not transparent

								var top = i - 4*canvas.width;
								var down = i + 4*canvas.width;

								if (top >= 0 && map_to_color(pix[top], pix[top+1], pix[top+2], pix[top+3]) === target_color) 
									Q.push(top); 

								if (down < pix.length && map_to_color(pix[down], pix[down+1],pix[down+2],pix[down+3]) === target_color)
									Q.push(down);
							}
							
						}	
						
						// Draw the ImageData at the given (x,y) coordinates.
						ctx.putImageData(imgd, 0, 0);	
							
					}

					
		    	} // tool==='fill'
				
			}, false); // event listener
				
			// for filling	
			var find_left_most_similar_pixel = function(pix, pos, target_color) {
				var y = Math.floor(pos/(4*canvas.width));
				var left = pos;
				var end = y * canvas.width * 4;
				while (end < left) {
					if (map_to_color(pix[left-4],pix[left-3],pix[left-2],pix[left-1]) === target_color)
						left = left - 4;
					else
						break;
				}
				return left;
			}

			var find_right_most_similar_pixel = function(pix, pos, target_color) {
				var y = Math.floor(pos/(4*canvas.width));
				var right = pos;
				var end = (y+1) * canvas.width * 4 - 4;
				while (end > right) {
					if (map_to_color(pix[right+4],pix[right+5],pix[right+6],pix[right+7]) === target_color)
						right = right + 4;
					else
						break;
				}
				return right;
			}

			var hex_to_color = function(hex) {
			    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		    	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		    	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		        	return r + r + g + g + b + b;
		    		});

		    	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		    	var r = parseInt(result[1], 16),
		            g = parseInt(result[2], 16),
		            b = parseInt(result[3], 16);
		    	
				return map_to_color(r, g, b, 255);
			}

			var map_to_color = function(r,g,b,a) {
				if (a === 0)
					return 'white';
				else {
					if (r===255 && g===0 && b===0)
						return 'red';
					if (r===0 && g===255 && b===0)
						return 'lime';
					if (r===0 && g===0 && b===255)
						return 'blue';
					if (r===255 && g===255 && b===0)
						return 'yellow';
					if (r===255 && g===0 && b===255)
						return 'magenta';
					if (r===0 && g===255 && b===255)
						return 'cyan';
					if (r===255 && g===165 && b===0)
						return 'orange';
					if (r===128 && g===0 && b===128)
						return 'purple';
					if (r===128 && g===128 && b===128)
						return 'gray';
					if (r===0 && g===0 && b===0)
						return 'black';
					if (r===230 && g===230 && b===250)
						return 'lavender';
					if (r===165 && g===42 && b===42)
						return 'brown';
				}

				return 'white';
			}


			var tools_func = {'pencil':paint_pencil, 'line':paint_line, 'square':paint_square, 
					'circle':paint_circle, 'ellipse':paint_ellipse, 'eraser':paint_eraser,
					'text':paint_text};


			tmp_canvas.addEventListener('mouseup', function() {
				
				var tool = scope.tool;	
				temp_canvas.removeEventListener('mousemove', tools_func[tool], false);			
				// Writing down to real canvas now
				// text-tool is managed when textarea.blur() event
				if (tool !='text') {
					ctx.drawImage(temp_canvas, 0, 0);
					// keep the image in the undo_canvas
					//undo_canvas_top = next_undo_canvas(undo_canvas_top);
					//var uctx = undo_canvas[undo_canvas_top]['uctx'];
					//uctx.clearRect(0, 0, canvas.width, canvas.height);
					//uctx.drawImage(canvas, 0, 0);
					//undo_canvas[undo_canvas_top]['redoable'] = false;
				}


				// Clearing tmp canvas
				temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
				
				// Emptying up Pencil Points
				ppts = [];
			}, false);

	
		}	
		
	}
})
