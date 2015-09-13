app.directive('tile', function() {
	return {
		restrict: 'E',
		template: '<div class="tile"></div>',
		// link: function(scope, element, attrs) {
		// 	element.bind('click', function() {
		// 		$newDiv = $(this).closest('div');
		// 		var tileId = $newDiv[0].id;
		// 		var tileCol = tileId.split('-')[0];
		// 		var tileRow = tileId.split('-')[1];
		// 		console.log(tileCol, tileRow);
		// 		$active = $('.tile.num-100').closest('tile');
		// 		$active
		// 			.css({position: 'relative'})
		// 			.animate({
		// 				top: $(this).offset().top - $active.offset().top,
		// 				left: $(this).offset().left - $active.offset().left
		// 			}, {
		// 				complete: function() {
		// 					$newDiv.find('tile').remove();
		// 					$newDiv.append($active);
		// 					$active.css({position:'', left:'', top:''});
		// 				},
		// 				duration: 500
		// 			});
		// 		return false;
		// 	})
		// }
	}
})