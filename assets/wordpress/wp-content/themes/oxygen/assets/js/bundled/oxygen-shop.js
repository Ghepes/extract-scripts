;(function( $, window, undefined ) {
	"use strict";

	$( document ).ready( function() {
		
		/**
		 * Setup Loop Products
		 */
		var setupLoopProducts = function() {
			
			$( '.products .type-product' ).each( function( i, product ) {

				if ( ! product.oxygenProductSetup ) {
					var $product = $( product );
					
					// Init Image Gallery
					setupProductImageGallery( $product );
					
					// Init Tooltips
					if ( $().tooltip ) {
						$product.find( 'i[data-toggle="tooltip"]' ).tooltip();
					}
					
					// Mark as setup
					product.oxygenProductSetup = true;
				}
			} );
		}
		
		/**
		 * Product gallery swiping
		 */
		var setupProductImageGallery = function( $product ) {
			var $productImages = $product.find( '.product-images' ),
				$nav = $productImages.find( '.product-images--navigation' ),
				$images = $productImages.find( '.featured-image .image-placeholder' ),
				totalImages = $images.length,
				currentIndex = 0,
				zindexCounter = 100;
			
			if ( ! $productImages.hasClass( 'preview-type-gallery' ) ) {
				return;
			}
			
			// Set active index function
			var setActiveImage = function( i, backwards ) {
				var $next = $images.eq( i );
					
				gsap.set( $next, {
					zIndex : zindexCounter,
				} );
				
				gsap.fromTo( $next, {
					x : backwards ? '-100%' : '100%',
					autoAlpha : 0,
				}, {
					duration: 0.45,
					autoAlpha : 1,
					x : '0%',
					ease : Circ.easeOut
				} );
				
				// Animate iamges container height
				if ( $productImages.outerHeight() != $next.outerHeight() ) {
					gsap.to( $productImages, { duration: 0.4, height : $next.outerHeight() } );
				}
				
				zindexCounter++;
			}
			
			// Get Next Index
			var getNextIndex = function( isPrev ) {
				
				if ( isRTL() ) {
					isPrev = isPrev ? false : true;
				}
				
				currentIndex += isPrev ? -1 : 1;
				currentIndex = currentIndex % totalImages;
				
				if ( currentIndex < 0 ) {
					currentIndex = totalImages + currentIndex;
				}
				
				return currentIndex;
			}
			
			// Navigation click events
			$nav.on( 'click', function( ev ) {
				ev.preventDefault();
				var isPrev = $( this ).hasClass( 'product-images--prev' );
				
				setActiveImage( getNextIndex( isPrev ), isPrev );
			} );
			
			// Swipe events
			$productImages.on( 'swipeleft', function() {
				setActiveImage( getNextIndex() );
			} );
			
			$productImages.on( 'swiperight', function() {
				setActiveImage( getNextIndex( true ), true );
			} );
		}
		
		/**
		 * Init loop products
		 */
		setupLoopProducts();
		
		jQuery( document ).on( 'yith_infs_adding_elem post-load', setupLoopProducts );

		/**
		 * Adding to wishlist (loading indicator)
		 */
		$( '.products' ).on( 'click', '.type-product .yith-add-to-wishlist .yith-wcwl-add-button a', function( ev ) {
			$( this ).closest( '.type-product' ).addClass( 'adding-to-wishlist' );
		} );
		
		/**
		 * Added to Wishlist
		 */
		$( document.body ).on( 'added_to_wishlist', function( ev, el, el_wrap ) {
			var $product = $( el ).closest( '.type-product' );
			$product.addClass( 'yith-added-to-wishlist' ).removeClass( 'adding-to-wishlist' );
		} );
		
		/**
		 * Adding to cart (loading indicator)
		 */
		$( document ).on( 'adding_to_cart', function( ev, $btn, data ) {
			
			if ( $btn ) {
				var $product = $btn.closest( '.product, .type-cross-sells, .product-item' );
				$product.addClass( 'is-adding-to-cart' );
			}
			
		} );
		
		/**
		 * Added to cart
		 */
		$( document ).on( 'added_to_cart', function( ev, cart_fragments, cart_hash, $btn ) {
			
			if ( $btn ) {
				var $product = $btn.closest( '.product, .type-cross-sells' );
				$product.removeClass( 'is-adding-to-cart' ).addClass( 'added-to-cart' );
				
				// Auto-remove class "added-to-cart"
				setTimeout( function() {
					$product.removeClass( 'added-to-cart' );
				}, 1500 );
			}

			updateCartItemsNumber( cart_fragments.labMiniCartCount );
			updateHeaderCart( cart_fragments.labMiniCartSubtotal, cart_fragments.labMiniCart );
		} );
			
		/**
		 * Single Product Gallery
		 */
		$( '.product-gallery' ).each( function( i, el ) {
			
			var $container = $( el ),
				$productImage = $container.find( '.product-images' ),
				$productThumbnails = $container.find( '.product-thumbnails' ),
				$thumbnails = $productThumbnails.find( 'a' );
			
			$thumbnails.first().addClass( 'active' );
			
			// Product Images Carousel
			$productImage.slick( {
				slide : '.woocommerce-product-gallery__image',
				infinite : false,
				arrows : true,
				autoplay : oxygen_single_product_params.product_image_autoswitch > 0,
				autoplaySpeed : oxygen_single_product_params.product_image_autoswitch * 1000,
				rtl : isRTL(),
				adaptiveHeight: true
			} );
			
			$productImage.on( 'beforeChange', function( ev, slick, currentSlide, nextSlide ) {
				$productThumbnails.find( 'a' ).removeClass( 'active' ).eq( nextSlide ).addClass( 'active' );
				
				// Thumbnails Pagination
				var $activeSlides = $productThumbnails.find( '.slick-active' ),
					thumbnailsCurrentSlide = $activeSlides.first().index(),
					thumbnailsSlidesToShow = $productThumbnails.slick( 'slickGetOption', 'slidesToShow' ),
					maxIndex = $productThumbnails.find( '.slick-slide' ).length - thumbnailsSlidesToShow;
				
				if ( currentSlide < nextSlide ) {
					if ( nextSlide == $activeSlides.last().index() ) {
						$productThumbnails.slick( 'slickGoTo', Math.min( thumbnailsCurrentSlide + thumbnailsSlidesToShow - 1, maxIndex ) );
					}
				} else {
					if ( nextSlide == $activeSlides.first().index() ) {
						$productThumbnails.slick( 'slickGoTo', Math.max( thumbnailsCurrentSlide - thumbnailsSlidesToShow + 1, 0 ) );
					}
				}
			} );
			
			// Loop carousel arrows
			var nextReset = false,
				prevReset = true;
				
			$productImage.on( 'click', '.slick-arrow', function() {
				var isNext = jQuery( this ).hasClass( 'slick-next' ),
					currentSlide = $productImage.slick( 'slickCurrentSlide' ),
					totalProducts = $productImage.find( '.woocommerce-product-gallery__image' ).length,
					maxSlide = totalProducts - $productImage.slick( 'slickGetOption', 'slidesToShow' );
										
				// Reset to last slide
				if ( prevReset && 0 == currentSlide ) {
					$productImage.slick( 'slickGoTo', maxSlide );
					prevReset = false;
				}
				
				if ( 0 == currentSlide ) {
					prevReset = true;
				}
				
				// Reset to first slide
				if ( nextReset && currentSlide == maxSlide ) {
					$productImage.slick( 'slickGoTo', 0 );
					nextReset = false;
				}
				
				if ( currentSlide == maxSlide ) {
					nextReset = true;
				}
			} );
			
			// Product Thumbnails Carousel
			$productThumbnails.slick( {
				slide : '.woocommerce-product-gallery__image',				
				slidesToShow : 4,
				slidesToScroll : 1,
				swipeToSlide : true,
				infinite : false,
				rtl : isRTL(),
			} );
			
			$productThumbnails.on( 'click', '.woocommerce-product-gallery__image a', function( ev ) {
				ev.preventDefault();
				
				var index = $( this ).parent().index();
				$productImage.slick( 'slickGoTo', index );
			} );
			
			// Image Zoom function
			var initZoomImage = function( $el ) {
				
				if ( wc_single_product_params && 1 == parseInt( wc_single_product_params.zoom_enabled, 10 ) ) {
					
					// Images smaller than the gallery container are disabled
					if ( $el.find( 'img' ).data( 'large_image_width' ) < public_vars.productsGalleryWidth ) {
						return;
					}
								
					var zoomImageOptions = {
						touch : false,
						url : $el.attr( 'href' )
					}
					
					if ( 'ontouchstart' in window ) {
						zoomImageOptions.on = 'click';
					}
							
					if ( typeof window.productZoomImageOptions == 'object' ) {
						zoomImageOptions = $.extend( zoomImageOptions, window.productZoomImageOptions );
					}
					
					
					$el.zoom( zoomImageOptions );	
				}
			}
			
			// Image Zoom
			public_vars.productsGalleryWidth = $productImage.width();

			if ( $container.hasClass( 'zoom' ) ) {
				$productImage.find( '.woocommerce-product-gallery__image a' ).each( function( i, el ) {
					var $image = $( el );
					initZoomImage( $image );
				} );
			}
			
			// Lightbox open function
			var openedItems = {};

			var lightboxOpen = $.debounce( 10, function( index ) {
				var items = [];
				var $pswp = $( '.pswp' );

				if ( $pswp.hasClass( 'pswp--open' ) ) {
					return;
				}
				
				$productImage.find( '.woocommerce-product-gallery__image' ).each( function( i, image ) {
					var $image = $( image ),
						$link = $image.find( '> a:has(img)' ),
						$image = $link.find( 'img' );
					
					items.push( {
						src : $link.attr( 'href' ),
						w : $image.data( 'large_image_width' ),
						h : $image.data( 'large_image_height' ),
						title: $image.attr( 'data-caption' ) ? $image.attr( 'data-caption' ) : $image.attr( 'title' )
					} );
				} );
		
				var options = $.extend( {
					index: index
				}, wc_single_product_params.photoswipe_options );
		
				// Initializes and opens PhotoSwipe.
				var photoswipe = new PhotoSwipe( $pswp[0], PhotoSwipeUI_Default, items, options );
				photoswipe.init();
			} );
			
			// Lightbox trigger
			if ( $container.hasClass( 'lightbox' ) ) {
				$productImage.on( 'click', '.woocommerce-product-gallery__image > a, .product-gallery-lightbox-trigger', function( ev ) {
					ev.preventDefault();
					var index = parseInt( $( this ).closest( '.woocommerce-product-gallery__image' ).attr( 'data-slick-index' ), 10 );
					lightboxOpen( index );
				} );
			}
			
			// When product zoom is disabled, open lightbox if possible
			if ( ! $container.hasClass( 'zoom' ) ) {
				
				$productImage.on( 'click', '.woocommerce-product-gallery__image:has(.product-gallery-lightbox-trigger) > a', function( ev ) {
					ev.preventDefault();
					
					var index = parseInt( $( this ).closest( '.woocommerce-product-gallery__image' ).attr( 'data-slick-index' ), 10 );
					lightboxOpen( index );
				} );
			}
			
			// Variation form
			var currentVariationImage = null;
			
			$.fn.wc_variations_image_update = function( variation ) {

				// Remove variation images
				if ( currentVariationImage ) {	
					$productImage.slick( 'slickRemove', true, true );
					$productThumbnails.slick( 'slickRemove', true, true );
					currentVariationImage = null;
				}

				console.log( variation );
				
				// Change variation image
				if ( variation && parseInt( variation.image_id, 10 ) && 'oxygen_image' in variation ) {
					// Add image
					$productImage.slick( 'slickAdd', variation.oxygen_image, true, true );
					$productThumbnails.slick( 'slickAdd', variation.oxygen_thumbnail, true, true );
					
					// Init zoom
					if ( $container.hasClass( 'zoom' ) ) {
						initZoomImage( $productImage.find( 'a' ).first() );
					}
					
					// Reset index
					$productImage.slick( 'slickGoTo', 0 );
					$productThumbnails.slick( 'slickGoTo', 0 );
					
					currentVariationImage = variation.image_id;
				}
			}

		} );
		
		/**
		 * Update cart alt button
		 */
		$( '.cart-update-buttons--update-cart' ).on( 'click', function( ev ) {
			ev.preventDefault();
			$( '[name="update_cart"]' ).click();
		} );
		
		/**
		 * Update cart button state
		 */
		var cartButtonCheckToggle = function() {
			$( '.cart-update-buttons--update-cart' )[ $( '[name="update_cart"]' ).is( ':disabled' ) ? 'addClass' : 'removeClass' ]( 'disabled' );
		};
		
		$( '.woocommerce-cart' ).on( 'click change', '.quantity input', $.debounce( 10, cartButtonCheckToggle ) );
		$( document.body ).on( 'updated_wc_div', cartButtonCheckToggle );
		
		/**
		 * Coupon form alt
		 */
		$( '#coupon_code_alt' ).on( 'keydown', function( ev ) {
			if ( 13 == ev.keyCode ) {
				$( '[name="apply_coupon_alt"]' ).click();
			}
		} );
		
		$( '.woocommerce-cart [name="apply_coupon_alt"]' ).on( 'click', function( ev ) {
			$( '#coupon_code' ).val( $( '#coupon_code_alt' ).val() );
			$( '[name="apply_coupon"]' ).click();
		} );
		
		/**
		 * Quantity Buttons for WooCommerce
		 */
		var replaceWooCommerceQuantityButtons = function() {
			jQuery( document.body ).trigger( 'country_to_state_changed' ); // Update Select2 Boxes
			
			$( '.quantity' ).each( function( i, el ) {
				var $quantity = $( el ),
					$button = $quantity.find( '.qty' );

				if ( $quantity.hasClass( 'buttons_added' ) ) {
					return;
				}

				$quantity.addClass( 'buttons_added' );

				$button.before( '<input type="button" value="-" class="plusminus minus">' );
				$button.after( '<input type="button" value="+" class="plusminus plus">' );
			} );
		};

		replaceWooCommerceQuantityButtons();
		
		$( document.body ).on( 'updated_wc_div cart_page_refreshed cart_totals_refreshed', replaceWooCommerceQuantityButtons );
		
		/**
		 * Quantity increment/decrement
		 */
		$( 'body' ).on( 'click', 'input[type="button"].plusminus', function() {
			var $this = $( this ),
				$quantity = $this.parent().find( '.qty' ),
				add = 1;

			if ( $this.hasClass( 'minus' ) ) {
				add = -1;
			}
			
			var newVal = +$quantity.val() + add;
			
			if ( newVal < 0 ) {
				newVal = 0;
			}

			$quantity.val( newVal ).trigger( 'change' );
		} );
		
		/**
		 * Update header cart from session storage
		 */
		var miniCartUpdateFromSessionStorage = function() {
			if ( sessionStorage ) {
				var fragments = null;
				
				if ( typeof wc_cart_fragments_params !== 'undefined' && wc_cart_fragments_params.fragment_name ) {
					fragments = $.parseJSON( sessionStorage.getItem( wc_cart_fragments_params.fragment_name ) );
				}
				
				if ( fragments ) {
					$( '.cart-ribbon' ).find( '.number' ).html( fragments.labMiniCartCount );
					updateHeaderCart( fragments.labMiniCartSubtotal, fragments.labMiniCart );

					if ( ! fragments.labMiniCartCount ) {
						public_vars.$cartItems.html( fragments[ 'div.widget_shopping_cart_content' ] ).css( 'opacity', 1 );
					}
				} else {
					$( '.cart-ribbon' ).find( '.number' ).html( '0' );
				}
			}
		};
			
		miniCartUpdateFromSessionStorage();
		
		$( document.body ).on( 'wc_fragments_refreshed', miniCartUpdateFromSessionStorage );
		
	} );

} )( jQuery, window );