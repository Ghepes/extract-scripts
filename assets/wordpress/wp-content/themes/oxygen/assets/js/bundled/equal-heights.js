;(function($) {

    $.fn.equalHeights = function() {
        var maxHeight = 0,
            $this = $(this);

        $this.each( function() {
            var height = $(this).innerHeight();

            if ( height > maxHeight ) { maxHeight = height; }
        });

        return $this.css('min-height', maxHeight);
    };

    // auto-initialize plugin
    $('[data-equal]').each(function(){
        var $this = $(this),
            target = $this.data('equal');
            
        $this.find(target).equalHeights();
        	        
        imagesLoaded($this.find(target), function()
        {
	    	$this.find(target).css('min-height', '').equalHeights();   
        });
    });
    
    //# start: modified by Arlind Nushi
    $(window).on('lab.resize', function(ev)
    {
    	$('[data-equal]').each(function(){
    	
		    var $this = $(this),
	        target = $this.data('equal');
	        $this.find(target).css('min-height', '').equalHeights();
	    });
    });
    //# end: modified by Arlind Nushi

})(jQuery);