;(function( $, window, undefined ) {
	"use strict";

	$( document ).ready( function() {
		
		// Loop through products
		$( '.products:has(.type-product)' ).each( function( i, products ) {
			var $container = $( products ),
				items = [],
				quickview = new QuickView();

			if ( $container.is( 'section' ) ) {
				return;
			}
				
			// Set container
			quickview.setContainer( products );
			
			// Fetch items
			quickview.fetchItems();
			
			// Assign events
			$container.find( '.type-product' ).each( function( i, product ) {
				var $product = $( product );
				
				$product.on( 'click', '.quick-view a', function( ev ) {
					ev.preventDefault();
					quickview.open( i );
				} );
			} );
			
			// Render items
			if ( $( window ).width() >= 992 ) {
				quickview.render();
			}

			// Support for YITH Infinite Scroll
			$( document ).on( 'yith_infs_added_elem', function( ev, $products ) {
				$products.each( function( i, product ) {
					var $product = $( product ),
						template = $product.find( '.product-quickview-template' ).html();

					if ( template ) {
						quickview.addItem( template );
					}

					$product.on( 'click', '.quick-view a', function( ev ) {
						ev.preventDefault();
						quickview.open( $product.index() );
					} );
				} );

				if ( $( window ).width() >= 992 ) {
					quickview.render();
				}
			} );
		} );
	} );
	
	/**
	 * Quickvew Private Methods
	 */
	var _index = 0;
	
	var qvGetPercentageIndex = function( i ) {
		var slideWidth = this.getSlideWidth(),
			slideScreenWidth = this.getSlideScreenWidth(),
			winWidth = $( window ).width(),
			x = ( winWidth / 2 ) - ( slideWidth / 2 ) - ( i * slideScreenWidth );
			
		if ( isRTL() ) {
			return -x;
		}

		return x;
	}
	
	/**
	 * Quickview Class
	 */
	var QuickView = function() {
		
		// Instance id
		this.instanceId = ++_index;
		
		// Container
		this.container = null;
		
		// Items
		this.items = [];
		
		// Rendered
		this.needsRender = true;
		
		// Is open
		this.isOpen = false;
		
		// Preview size (side spacing)
		this.previewSize = 100;
		
		// Close with escape
		$( window ).on( 'keydown', function( ev ) {
			if ( 27 == ev.keyCode ) {
				this.close();
			} else if ( this.isOpen && ( 37 == ev.keyCode || 39 == ev.keyCode ) ) {
				
				if ( 37 == ev.keyCode ) {
					this.prev();
				} else {
					this.next();
				}
			}
		}.bind( this ) );
		
		// Resize events
		this.resize = $.debounce( 350, function() {
			this.setPreviewSize();
			this.setCurrent( this.current, true );
		}.bind( this ) );
	}
	
	/**
	 * Quickview Methods
	 */
	QuickView.prototype = {
		
		/**
		 * Constructor
		 */
		constructor : QuickView,
		
		/**
		 * Set container
		 */
		setContainer : function( container ) {
			this.container = container;
		},
		
		/**
		 * Fetch items
		 */
		fetchItems : function() {
			var self = this,
				$items = $( this.container ).find( '.type-product' );
			
			$items.each( function( i, product ) {
				var $product = $( product ),
					template = $product.find( '.product-quickview-template' ).html();
				
				if ( template ) {
					self.addItem( template );
				}
			} );
		},
		
		/**
		 * Add items
		 */
		addItem : function( item ) {
			this.items.push( item );
			
			return this;
		},
		
		/**
		 * Get Slide Width
		 */
		getSlideWidth : function() {
			return this.$items.first().find( '.product-quickview' ).outerWidth();
		},
		
		/**
		 * Get slide screen width
		 */
		getSlideScreenWidth : function() {
			var slideWidth = this.getSlideWidth(),
				winWidth = $( window ).width();
			
			return slideWidth + ( winWidth - slideWidth ) / 2 - this.previewSize;
		},
		
		/**
		 * Set current slide
		 */
		setCurrent : function( index, noAnimation ) {
			
			if ( index < 0 || index >= this.items.length ) {
				return;
			}
			
			// Disable animations
			if ( noAnimation ) {
				this.$list.addClass( 'product-quickview--no-animations' );
			}
			
			// Slide the track
			gsap.set( this.$track, {
				x : qvGetPercentageIndex.call( this, index ),
			} );
			
			// Current item
			this.$items.removeClass( 'product-quickview--current' ).eq( index ).addClass( 'product-quickview--current' );
			
			// Initialize current slide
			this.$track.one( 'transitionend', $.debounce( 100, function() { this.initialize( this.$items.eq( index ) ); }.bind( this ) ) );
			
			// Hide arrows
			this.$prev[ index <= 0 ? 'addClass' : 'removeClass' ]( 'product-quickview--hidden' );
			this.$next[ index + 1 >= this.$items.length ? 'addClass' : 'removeClass' ]( 'product-quickview--hidden' );
			
			// Enable animations again
			if ( noAnimation ) {
				setTimeout( function() { this.$list.removeClass( 'product-quickview--no-animations' ); }.bind( this ), 1 );
			}

			// Save current slide
			this.current = index;
		},
		
		/**
		 * Set preview size
		 */
		setPreviewSize : function() {
			var width = this.getSlideScreenWidth();
			
			this.$track.css( {
				minWidth : width,
				maxWidth : width,
			} );
		},
		
		/**
		 * Render items
		 */
		render : function() {
			var self = this;
			
			var instanceId = 'product-quickview--instance-' + this.instanceId;
			
			this.$overlay = $( '.product-quickview--overlay.' + instanceId );
			this.$list = $( '.product-quickview--list.' + instanceId );
			
			// Append to the document
			if ( 0 == this.$overlay.length ) {
				$( 'body' ).append( '<div class="product-quickview--overlay ' + instanceId + '"></div>' );
				$( 'body' ).append( '<div class="product-quickview--list ' + instanceId + '"></div>' );
			
				this.$overlay = $( '.product-quickview--overlay.' + instanceId );
				this.$list = $( '.product-quickview--list.' + instanceId );
			}
			
			// Overlay close
			this.$overlay.on( 'click', this.close.bind( this ) );
			
			// Empty list
			this.$list.empty();
			
			// Append items
			$.each( this.items, function( i, template ) {
				var $item = $( '<div class="product-quickview--item"></div>' );
				$item.append( template ).appendTo( self.$list );
			} );
			
			// Items
			this.$items = this.$list.children();
			
			// Scrollable summary (fixes bug when too much description causes title to disappear)
			this.$items.each( function( i, el ) {
				var $el = $( el ),
					$summary = $( el ).find( '.summary' );
				
				if ( $summary.prop( 'scrollHeight' ) > $el.height() ) {
					$summary.addClass( 'summary-scroll' );
				}
			} );
			
			// Track
			this.$list.wrapInner( '<div class="product-quickview--track"></div>' );
			this.$track = this.$list.find( '.product-quickview--track' );
			
			// Arrows
			this.$prev = $( '<a href="#" class="product-quickview--arrow product-quickview--prev"></a>' );
			this.$next = $( '<a href="#" class="product-quickview--arrow product-quickview--next"></a>' );
			
			if ( this.items.length > 1 ) {
				this.$list.append( this.$prev ).append( this.$next );
			}
			
			// Next-prev events
			$( '.product-quickview--arrow' ).on( 'click', this.handleNextPrev.bind( this ) );
			
			// Close button
			this.$close = $( '<a href="#" class="product-quickview--close"></a>' );
			this.$list.append( this.$close );
			
			// Close event
			this.$close.on( 'click', function( ev ) {
				ev.preventDefault();
				self.close();
			} );
			
			// Set current
			this.setCurrent( 0, true );
			
			// Rendering completed
			this.needsRender = false;
		},
		
		/**
		 * Initialize slides
		 */
		initialize : function( $item ) {
			
			if ( ! $item.length || $item[0].qvInitialized ) {
				return;
			}
			
			// Slick Slider
			if ( $().slick ) {
				var $productImages = $item.find( '.product-images' );
				
				$productImages.slick( {						
					rtl : isRTL(),
					adaptiveHeight: true,
					accessibility : false
				} );
			}
			
			// Mark as initialized
			$item[0].qvInitialized = true;
		},
		
		/**
		 * Open quickview
		 */
		open : function( index ) {
			if ( this.needsRender ) {
				this.render();
			}
			
			// Set spacing
			this.setPreviewSize();
			
			// Set current
			if ( 'number' == typeof index ) {
				this.setCurrent( index, true );
			}
			
			// Show
			this.show();
			
			// Attach resize event
			window.addEventListener( 'resize', this.resize, { passive: true, capture: true } );
		},
		
		/**
		 * Hide
		 */
		close : function() {
			this.$overlay.removeClass( 'product-quickview--visible' );
			this.$list.removeClass( 'product-quickview--visible' );
			this.isOpen = false;
			
			// Dettach resize event
			window.removeEventListener( 'resize', this.resize );
		},
		
		/**
		 * Next-previous navigation handler
		 */
		handleNextPrev : function( ev ) {
			ev.preventDefault();
			
			if ( $( ev.srcElement ).hasClass( 'product-quickview--prev' ) ) {
				this.prev();
			} else {
				this.next();
			}
		},
		
		/**
		 * Prev
		 */
		prev : function() {
			var move = isRTL() ? 1 : -1;
			this.setCurrent( this.current + move );
		},
		
		/**
		 * Next
		 */
		next : function() {
			var move = isRTL() ? -1 : 1;
			this.setCurrent( this.current + move );
		},
		
		/**
		 * Show
		 */
		show : function() {
			this.$overlay.addClass( 'product-quickview--visible' );
			this.$list.addClass( 'product-quickview--visible' );
			this.isOpen = true;
		},
	}

} )( jQuery, window );