jQuery(document).ready(function ($) {

	/* get images from album */
	$.ajax({
		type: "GET",
		url: 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json',
		dataType: "jsonp",
		success: function(data){
			var imgLimit = 50;
			var fotos = '<ul class="thumbs-list">';
			for (var i=0; i<imgLimit; i++) {
				fotos += '<li class="thumbs-list-item"><a href="#'+data.entries[i].updated+'" class="thumbs-list-item-link" data-origin-image="'+data.entries[i].img.L.href+'" data-remembered-image="'+data.entries[i].updated+'"><img class="thumbs-list-item-image" src="'+data.entries[i].img.XXS.href+'" alt="'+data.title+'"></a></li>';
			}
			fotos += '</ul>';
			$('.thumbs-wrapper').append(fotos);
			var itemWidth = $('.thumbs-list-item').outerWidth() + 5;
			var itemsWrapWidth = imgLimit*itemWidth;
			$('.thumbs-list').css('width',itemsWrapWidth);
		},
		complete: function(){
			var hashedImage = locationParse();
			var actualImage = (hashedImage) ? $('[data-remembered-image="'+hashedImage+'"]') : $('.thumbs-list-item:first-child .thumbs-list-item-link');
			var itemIndex = actualImage.parent().index() + 1;
			getFullImage(actualImage);
			scrollItems(itemIndex);
			navigationVisibility(itemIndex);
		}
	});

	/* item-link click event */
	$(document).on('click', '.thumbs-list-item-link', function(){
		var itemIndex = $(this).parent().index() + 1;
		scrollItems(itemIndex);
		getFullImage(this);
		navigationVisibility(itemIndex);
	});

	/* navigation-button click event */
	$(document).on('click', '.navigation-button', function(e){
		var direction = ($(this).hasClass('nav-right')) ? 1 : -1;
		navigation(direction);
	});

	/* scroll event */
	$('.thumbs-wrapper').bind('mousewheel', function(event, delta) {
		scrollItems(0,delta);
    });

});

/* get big image src */
function getFullImage(active){
	$('.thumbs-list-item').removeClass('active-thumb');
	$(active).parent().addClass('active-thumb');
	var bigImage = $(active).attr('data-origin-image');
	$('.view-image').attr('src', bigImage);
}

/* get hash value from address-line */
function locationParse(){
	var getLocation = location.hash.substr(1);
    if(getLocation){
    	return getLocation
    }
}

/* scroll calculations */
function scrollItems(itemIndex,delta){
	var itemIndex = itemIndex || 0;
	var thumbsWrapperWidth = $('.thumbs-wrapper').outerWidth();
	var thumbListWidth = $('.thumbs-list').outerWidth();
	var itemWidth = $('.thumbs-list-item').outerWidth() + 5;
	var lastItemPosition = thumbsWrapperWidth - thumbListWidth;
	if(itemIndex){
		var itemsWrapperPosition = -(itemWidth*(itemIndex-0.5) - thumbsWrapperWidth/2);
	}else{
		var itemsWrapperPosition = parseInt($('.thumbs-list').css('left')) + (delta > 0 ? itemWidth*3 : -itemWidth*3);
	}
	if(itemsWrapperPosition <= 0 && itemsWrapperPosition > lastItemPosition ){
		$('.thumbs-list').stop().animate({'left': itemsWrapperPosition},500);
	}else if(itemsWrapperPosition > 0){
		$('.thumbs-list').stop().animate({'left': 0},500);
	}else{
		$('.thumbs-list').stop().animate({'left': lastItemPosition}, 500);
	}
}

/* navigation functionality */
function navigation(direction){
	var itemIndex = $('li.active-thumb').index() + 1 + direction;
	var activeItem = $('.thumbs-list-item:nth-child('+itemIndex+') .thumbs-list-item-link');
	location.hash = activeItem.attr('data-remembered-image');
	scrollItems(itemIndex);
	getFullImage(activeItem);
	navigationVisibility(itemIndex);
}

function navigationVisibility(itemIndex){
	var activeItemIndex = $('li.active-thumb').index() + 1;
	var itemsCount = $('.thumbs-list-item').length;
	if(itemIndex == 1){
		$('.nav-left').removeClass('navigation-button').fadeOut();
	}else if(itemIndex == itemsCount){
		$('.nav-right').removeClass('navigation-button').fadeOut();
	}else{
		$('.nav-left, .nav-right').addClass('navigation-button').fadeIn();
	}

}