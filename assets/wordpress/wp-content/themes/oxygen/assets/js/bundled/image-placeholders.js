( function( $, roow ) {
	"use strict";
	
	// Each body image
	$( 'body' ).on( 'lazyunveilread', '.lazyload', function( ev ) {
		$( ev.target.parentNode ).addClass( 'image-loaded' );
	} );
	
} )( jQuery, window );