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
				fotos += '<li class="thumbs-list-item"><a href="#'+data.entries[i].updated+'" class="thumbs-list-item-link" data-origin-image="'+data.entries[i].img.L.href+'" data-remembered-image="'+data.entries[i].updated+'"><img class="thumbs-list-item-image" src="'+data.entries[i].img.XXS.href+'" alt="'+data.entries[i].title+'"></a></li>';
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
			getFullImage(actualImage,true);
			scrollItems(itemIndex);
			navigationVisibility(itemIndex);
		}
	});

	/* item-link click event */
	$(document).on('click', '.thumbs-list-item-link', function(){
		var itemIndex = $(this).parent().index() + 1;
		if($(this).parent().hasClass('active-thumb')){
			return false
		}else{
			scrollItems(itemIndex);
			getFullImage(this);
			navigationVisibility(itemIndex);
		}
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

    /* resize event */
    $(window).resize(function(){
    	var itemIndex = $('li.active-thumb').index() + 1;
    	scrollItems(itemIndex);
    });

});

/* get big image src */
function getFullImage(active,firstLoad){
	var bigImageSrc = $(active).attr('data-origin-image');
	var bigImageAlt = $(active).find('.thumbs-list-item-image').attr('alt');
	var bigImageItem = '<img class="view-image" src="' + bigImageSrc + '" alt="' + bigImageAlt + '">';
	if(firstLoad){
		$(active).parent().addClass('active-thumb');
		$('.view-image-wrap').prepend(bigImageItem);
	}else{
		var oldItemIndex = $('li.active-thumb').index() + 1;
		$('.thumbs-list-item').removeClass('active-thumb');
		$(active).parent().addClass('active-thumb');
		var newItemIndex = $('li.active-thumb').index() + 1;
		if(newItemIndex > oldItemIndex){
			var newImage = '<div class="view-image-wrap animate-from-right">' + bigImageItem + '</div>';
			$('.big-slide-wrap').append(newImage);
			$('.view-image-wrap:first-child').animate({left:'-100%'}, 300,function(){
				$('.view-image-wrap:not(:last-child)').remove();
			});
			$('.view-image-wrap:last-child').animate({left:0},300);	
		}else{
			var newImage = '<div class="view-image-wrap animate-from-left">' + bigImageItem + '</div>';
			$('.big-slide-wrap').prepend(newImage);	
			$('.view-image-wrap:last-child').animate({left:'100%'}, 300,function(){
				$('.view-image-wrap:not(:first-child)').remove();
			});
			$('.view-image-wrap:first-child').animate({left:0},300);
		}
	}
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

/* show/hide navigation buttons */
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