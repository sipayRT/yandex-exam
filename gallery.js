jQuery(document).ready(function ($) {
	/* get images from album */
	$.ajax({
		type: "GET",
		url: 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json',
		dataType: "jsonp",
		success: function(data){
			var imgLimit = 50;
			var fotos = '<ul class="thumb-list-items">';
			for (var i=0; i<imgLimit; i++) {
				fotos += '<li class="thumb-list-item"><a href="?activeImg='+data.entries[i].updated+'" class="thumb-list-item-link" data-origin-image="'+data.entries[i].img.L.href+'" data-remembered-image="'+data.entries[i].updated+'"><img class="thumb-list-item-image" src="'+data.entries[i].img.XXS.href+'" alt="'+data.title+'"></a></li>';
			}
			fotos += '</ul>';
			$('.thumbs-wrapper').append(fotos);
			var itemWidth = $('.thumb-list-item').outerWidth() + 5;
			var itemsWrapWidth = imgLimit*itemWidth;
			$('.thumb-list-items').css('width',itemsWrapWidth);
		},
		complete: function(){
			var cachedImage = locationParse();
			var actualImage = (cachedImage) ? $('[data-remembered-image="'+cachedImage+'"]') : $('.thumb-list-item:first-child .thumb-list-item-link');
			getFullImage(actualImage);
		}
	});

	/* thumb click event */
	$(document).on('click', '.thumb-list-item-link', function(){
		getFullImage(this);
		var itemIndex = $(this).parent().index() + 1;
		scrollItems(itemIndex);
		return false;
	});

	$('.thumbs-wrapper').bind('mousewheel', function(event, delta) {
		scrollItems(0,delta);
    });

});


function getFullImage(active){
	$('.thumb-list-item').removeClass('active-thumb');
	$(active).parent().addClass('active-thumb');
	var bigImage = $(active).attr('data-origin-image');
	$('.view-image').attr('src', bigImage);
}

function locationParse(){
	var params = [];
	var getLocation = window.location.search;
	var paramsArray = getLocation.slice(getLocation.indexOf('?') + 1).split('&');
	for(var i = 0; i < paramsArray.length; i++){
        hash = paramsArray[i].split('=');
        params.push(hash[0]);
        params[hash[0]] = hash[1];
    }
    if(params.activeImg){
    	return params.activeImg
    }else{
    	return false
    }
}

function scrollItems(itemIndex,delta){
	var itemIndex = itemIndex || 0;
	var thumbsWrapperWidth = $('.thumbs-wrapper').outerWidth();
	var thumbListWidth = $('.thumb-list-items').outerWidth();
	var itemWidth = $('.thumb-list-item').outerWidth() + 5;
	var lastItemPosition = thumbsWrapperWidth - thumbListWidth;
	if(itemIndex){
		var itemsWrapperPosition = -(itemWidth*(itemIndex-0.5) - thumbsWrapperWidth/2);
	}else{
		var itemsWrapperPosition = parseInt($('.thumb-list-items').css('left')) + (delta > 0 ? itemWidth*3 : -itemWidth*3);
	}
	if(itemsWrapperPosition <= 0 && itemsWrapperPosition > lastItemPosition ){
		//$('.thumb-list-items').css('left', itemsWrapperPosition);
		$('.thumb-list-items').stop().animate({'left': itemsWrapperPosition},500);
	}else if(itemsWrapperPosition > 0){
		$('.thumb-list-items').stop().animate({'left': 0},500);
	}
	else{
		$('.thumb-list-items').stop().animate({'left': lastItemPosition}, 500, 'easeInOutQuad');
	}
}