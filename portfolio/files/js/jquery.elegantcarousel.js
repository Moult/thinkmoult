/*
 * jQuery Elegant Slider v2.0
 *
 * TERMS OF USE - jQuery Elegant Slider
 * 
 * Copyright � 2012 Spab Rice
 * All rights reserved.
 * 
*/


(function($){
 
    $.fn.extend({
         
        //pass the options variable to the function
        elegantcarousel: function(options) {
 
 
            //Set the default values, use comma to separate the settings, example:
            var defaults = {
				delay:150,
				fade:300,
				slide:500,
				effect:'fade',
				orientation: 'horizontal',
				captionFade: 150,
				loop: false,
				autoplay: true,
				time: 3000,
				stopAutoplay: false
            }
                 
            var options =  $.extend(defaults, options);
 
            return this.each(function() {
                var o = options;
				 
				$easing="easeInOutQuart";  //  easing effect
				
				
				function start(element) {
					
					carousel = $(element);
					$carousel_container = $(carousel).find('.carousel_container');
					$li = $(carousel).find('.carousel_container ul li');
					
					visible_width = parseInt($carousel_container.css('width'), 10);
					visible_height = parseInt($carousel_container.css('height'), 10);

					number_items = $li.size();
					item_width = parseInt($li.css('width'), 10);
					item_height = parseInt($li.css('height'), 10);
					item_marginRight = parseInt($li.css('marginRight'), 10);
					item_marginLeft = parseInt($li.css('marginLeft'), 10);
					item_marginTop = parseInt($li.css('marginTop'), 10);
					item_marginBottom = parseInt($li.css('marginBottom'), 10);
										
					if (o.orientation == 'horizontal') 	{ visible_items = Math.ceil(visible_width/(item_width+item_marginRight+item_marginLeft)); }
					else 								{ visible_items = Math.ceil(visible_height/(item_height+item_marginTop+item_marginBottom)); }
					slides = Math.ceil(number_items/visible_items);
					
					set_item_classes_visibility();
					set_next_prev_classes(element);
					if (o.effect == 'slide') { set_item_position(); }
					if (o.autoplay) { interval = setInterval(autoplay, o.time); } else { interval = false; }
					
				}
				start(this);
				
				function set_item_classes_visibility() {
					$li.each(function(index) {
						var class_number = Math.floor((index+visible_items)/visible_items);
						$(this).addClass('visible_'+class_number);
						if (class_number == '1') 	{ $(this).css('display','block'); $(this).find('.inner').css('display','block'); }
						else 						{ $(this).css('display','none'); $(this).find('.inner').css('display','none'); }
					});
				}
				
				
				function set_next_prev_classes(element) {
					var visible_item_class = $(element).find('.carousel_container ul li:visible').attr('class');
					var visible_id = visible_item_class.split('_');
					var min_items = Math.floor(visible_width/item_width);
										
					$('.carousel_prev').each(function(){
						var rel = $(this).attr('rel');
						if (rel == $(element).attr('id') ) {
							if (!o.loop) {
								if (visible_id[1] ==  '1') { $(this).addClass('disable'); }
									else { $(this).removeClass('disable'); }
							} else if (min_items >= number_items) {	$(this).addClass('disable'); $(this).parent('.carousel-nav').hide();
							} else { $(this).removeClass('disable'); $(this).parent('.carousel-nav').show(); }
						}
					});
					
					$('.carousel_next').each(function(){
						var rel = $(this).attr('rel');
						if (rel == $(element).attr('id') ) {
							if (!o.loop) {
								if (visible_id[1] ==  slides) { $(this).addClass('disable'); }
									else { $(this).removeClass('disable'); }
							} else if (min_items >= number_items) {	$(this).addClass('disable'); $(this).parent('.carousel-nav').hide();
							} else { $(this).removeClass('disable'); $(this).parent('.carousel-nav').show(); }
						}
					});
				}
				
				
				function set_item_position() {	
					$li.each(function() {
						$(this).css('display','none');
						$(this).css('position','absolute');
						
						if (o.orientation == 'horizontal') {
							$(this).css('top','0');
							$(this).css('left',visible_width+parseInt($carousel_container.css('paddingLeft'))+parseInt($carousel_container.css('paddingRight')), 10);
						}
						else if (o.orientation == 'vertical') {
							$(this).css('left','0');
							$(this).css('top',visible_height+parseInt($carousel_container.css('paddingTop'))+parseInt($carousel_container.css('paddingBottom')), 10);
						}
						
					});
					
					$carousel_container.find("li.visible_1").each(function(index) { 
						$(this).css('display','block');
						
						if (o.orientation == 'horizontal') {
							var left_position = (index * (item_width+item_marginRight+item_marginLeft)) + parseInt($carousel_container.css('paddingLeft'), 10);
							$(this).css('left',left_position);
						}
						
						else if (o.orientation == 'vertical') {
							var top_position = (index * (item_height+item_marginTop+item_marginBottom)) + parseInt($carousel_container.css('paddingTop'), 10);
							$(this).css('top',top_position);
						}
						
					});
				}
				
				
				
				
				function show_next_prev(method, element) {						
					
					$target = $(element).find('.carousel_container');
					
					visible_width = parseInt($target.css('width'), 10);
					visible_height = parseInt($target.css('height'), 10);
					
					number_items = $target.find("li").size();
					item_width = parseInt($target.find("li").css('width'), 10);
					item_height = parseInt($target.find("li").css('height'), 10);
					item_marginRight = parseInt($target.find("li").css('marginRight'), 10); item_marginLeft = parseInt($target.find("li").css('marginLeft'), 10);
					item_marginTop = parseInt($target.find("li").css('marginTop'), 10);	item_marginBottom = parseInt($target.find("li").css('marginBottom'), 10);
					
					if (o.orientation == 'horizontal') 	{ visible_items = Math.ceil(visible_width/(item_width+item_marginRight+item_marginLeft)); }
					else 								{ visible_items = Math.ceil(visible_height/(item_height+item_marginTop+item_marginBottom)); }
					slides = Math.ceil(number_items/visible_items);
					
					// Fade in items ####
					function show_items_fade(id) {
						var next_class_name = 'visible_'+id;
						$target.find("li."+next_class_name).css('display','block');
						$target.find("li."+next_class_name).each(function(index) { 
							var delay = (index) * o.delay;
							if (method == 'prev') { var delay = ((visible_items-1)-index)*o.delay; }
							var index_item = (index+1);
								$(this).find('.inner').delay(delay).fadeIn(o.fade, function(){
									if(index_item == visible_items || id == slides) { set_next_prev_classes(element); };
								});
						});
					}
					
					// Slide in items ####
					function show_items_slide(id) {
						var next_class_name = 'visible_'+id;
						$target.find("li."+next_class_name+" .inner").css('display','block');
						$target.find("li."+next_class_name).each(function(index) { 
							$(this).css('display','block');																	 
							var delay = (index) * o.delay;
							if (method == 'prev') { var delay = ((visible_items-1)-index)*o.delay; }
							var index_item = (index+1);
							if (o.orientation == 'horizontal') {
								var left_position = (index * (item_width+item_marginRight+item_marginLeft)) + parseInt($target.css('paddingLeft'), 10);
								$(this).delay(delay).animate({
									left: left_position
									}, o.slide, $easing, function(){
										if(index_item == visible_items || id == slides) { set_next_prev_classes(element); };
								});
							}
							else if (o.orientation == 'vertical') {
								var top_position = (index * (item_height+item_marginTop+item_marginBottom)) + parseInt($target.css('paddingTop'), 10);
								$(this).delay(delay).animate({
									top: top_position
									}, o.slide, $easing, function(){
										if(index_item == visible_items || id == slides) { set_next_prev_classes(element); };
								});
							}
						});
					}
					
					var visible_item_class = $target.find("li:visible").attr('class');
					visible_id = visible_item_class.split('_');
					var next_id = parseInt(visible_id[1], 10) + 1;
					var prev_id = parseInt(visible_id[1], 10) - 1;
					
					// take first or last id if loop is true
					if (visible_id[1] == 1)  { prev_id = slides; }
					if (visible_id[1] == slides)  { next_id = 1; }
					
					switch (o.effect)	{
						
					// Fade out items ####
					case 'fade':
						$target.find("li:visible").each(function(index) { 
							var delay = (index) * o.delay;
							var index_item = (index+1);
							var last_item = $target.find("li."+visible_item_class).size();  //it can not be simply 'visible_item' because if the last serie has less it does'nt work
							
							if (method == 'prev') { delay = ((visible_items-1)-index)*o.delay; last_item = 1; }
							
							$(this).find('.inner').delay(delay).fadeOut(o.fade, function(){
								if(index_item == last_item) {
									$('li.'+visible_item_class).css('display','none');
									if (method == 'next') 		{ show_items_fade(next_id); }
									else if (method == 'prev') 	{ show_items_fade(prev_id); }
								}													  
							});
						});
					break;
					
					// Slide out items ####
					case 'slide': 
					
						// setting position new if loop=true depending on method and orientation
						$target.find("li.visible_"+prev_id).each(function(index) { 
							if (o.orientation == 'horizontal') {
								if (method == 'next') 		{ var left_position = visible_width+parseInt($target.css('paddingLeft'),10)+parseInt($target.css('paddingRight'),10); }
								else if (method == 'prev')	{ var left_position = '-'+item_width+'px'; }
								$(this).css('left',left_position);
							}
								
							else if (o.orientation == 'vertical') {
								if (method == 'next') 		{ var top_position = visible_height+parseInt($target.css('paddingTop'),10)+parseInt($target.css('paddingBottom'),10); }
								else if (method == 'prev') 	{ var top_position = '-'+item_height+'px'; }
								$(this).css('top',top_position);
							}
								
						});
						
						$target.find("li."+visible_item_class).each(function(index) { 
							var delay = (index) * o.delay;  
							var zindex = index + 10;
							var index_item = (index+1);
							var last_item = $target.find("li."+visible_item_class).size();  //it can not be simply 'visible_item' because if the last serie has less it does'nt work
							
							if (method == 'prev') { delay = ((visible_items-1)-index)*o.delay; zindex = ((visible_items-1)-index)+10; last_item = 1;  }
							
							$(this).css('z-index',zindex);
							
							if (o.orientation == 'horizontal') {
								if (method == 'next') 		{ var left_position = '-'+item_width; }
								else if (method == 'prev')	{ var left_position = visible_width+parseInt($target.css('paddingLeft'),10)+parseInt($target.css('paddingRight'),10); } 
								$(this).delay(delay).animate({
									left: left_position
									}, o.slide, $easing, function(){
									 if(index_item == last_item) {
										$target.find('li.'+visible_item_class).css('display','none');
										if (method == 'next') 	{ show_items_slide(next_id); }
										else if (method == 'prev')	{ show_items_slide(prev_id); }
									}
									
								});
							}
							
							else if (o.orientation == 'vertical') {
								
								if (method == 'next') 		{ var top_position = '-'+item_height; }
								else if (method == 'prev') 	{ var top_position = visible_height+parseInt($target.css('paddingTop'),10)+parseInt($target.css('paddingBottom'),10); } 
								$(this).delay(delay).animate({
									top: top_position
									}, o.slide, $easing, function(){
									 if(index_item == last_item) {
										$target.find('li.'+visible_item_class).css('display','none');
										if (method == 'next') 		{ show_items_slide(next_id); }
										else if (method == 'prev')	{ show_items_slide(prev_id); }
									}
								});
							}
						});
					break;
					
					}
				}
		
				
				//  Set autoplay if true 
				
				
				function autoplay() {
					var visible_item_class = $(carousel).find('.carousel_container ul li:visible').attr('class');
					var visible_id = visible_item_class.split('_');
					var rel_id = $(carousel).attr('id');
					
					if (!o.loop) {
						if (visible_id[1] ==  slides) { clearInterval(interval); }
							else { show_next_prev('next', '#'+rel_id); }
					} else { show_next_prev('next', '#'+rel_id); }
			   }
				
				
				// Next or Prev event
				$('.carousel_next').click(function() { 
					var this_class = $(this).attr('class');
					var relelement = $(this).attr('rel');
					if (!relelement) { alert("Please enter a rel attribute"); } 
					if(this_class.search( 'disable' ) <=0) { 
						clearInterval(interval); 
						if (o.autoplay && !o.stopAutoplay) { interval = setInterval(autoplay, o.time); } 
						show_next_prev('next', '#'+relelement);
					}
					return(false); 
				});
				
				$('.carousel_prev').click(function() { 
					var this_class = $(this).attr('class'); 
					var relelement = $(this).attr('rel');
					if (!relelement) { alert("Please enter a rel attribute"); } 
					if(this_class.search( 'disable' ) <=0) { 
						clearInterval(interval); 
						if (o.autoplay && !o.stopAutoplay) { interval = setInterval(autoplay, o.time); } 
						show_next_prev('prev', '#'+relelement);
					} 
					return(false); 
				})
								
				// Fade in Caption
				$li.hover(	function() { clearInterval(interval); $(this).find('.caption').fadeIn(o.captionFade); }, 
							function () { $(this).find('.caption').fadeOut(o.captionFade); if (o.autoplay && !o.stopAutoplay) { interval = setInterval(autoplay, o.time); } });
             
            });
        }
    });
     
})(jQuery);

