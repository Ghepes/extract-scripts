
window.$ = window.$ || {};

( function ( $ ) {
	
	$( function () {
	
		/* Prepare Interface */

		var productType = $( '#product_type' );
		
		if ( productType.length ) {
			
			$( '#pro_title' ).each( function () {
				var outer = $( this ).prop( 'outerHTML' );

				$( this ).prop( 'outerHTML', '<p class="listar-editor-separator"></p>' );

				productType.before( outer );
			} );
		}

		$( '.store_address.store_location_wrap' ).each( function () {
			$( this ).prev().prev().css( { display : 'none' } );
		} );

		if ( $.isFunction( $.fn.select2 ) ) {
			$( '.wcfm_ledger_filter_wrap select' ).select2( {
				minimumResultsForSearch: -1
			} );
		}

		$( '.listar-wcfm-warning-message' ).each( function () {
			var outer = $( this ).removeClass( 'hidden' ).addClass( 'unhidden' ).prop( 'outerHTML' );

			$( this ).prop( 'outerHTML', '' );

			$( '#wcfmu-feature-missing-message' ).each( function () {
				$( this ).after( outer );
			} );
		} );

		$( '.wc-setup-content h1' ).each( function () {
			if ( ! $( '.wc-setup-steps li.active' ).length && ! $( 'body' ).hasClass( 'wcfm-store-setup' ) ) {
				$( this ).prop( 'innerHTML', 'Marketplace Setup Wizard' );
				$( this ).next().prop( 'outerHTML', '' );
			}

		} );

		setInterval( function () {
			$( '.attachment-thumbnail' ).each( function() {
				if ( '' === $( this ).attr( 'src' ) ) {
					$( this ).hide();
				}
			} );
		}, 1000 );
		
		/* Resources and persons */
		
		function verifyResourcesAndPersons( elem, changed ) {
			setTimeout( function () {
				//alert(3);
				if ( 'booking' === elem.val() ) {
					$( '#_wc_booking_has_resources, #_wc_booking_has_persons' ).removeClass( 'wcfm_custom_hide wcfm_ele_hide wcfm_hide' ).addClass( 'wcfm-checkbox wcfm_ele wcfm_half_ele_checkbox simple variable booking non-pw-gift-card' );
					$( '#_wc_booking_has_resources + p, #_wc_booking_has_persons + p' ).removeClass( 'wcfm_custom_hide wcfm_ele_hide wcfm_hide' ).addClass( 'wcfm_title wcfm-checkbox wcfm_ele wcfm_half_ele_checkbox virtual_ele_title' );
				} else {
					$( '#_wc_booking_has_resources, #_wc_booking_has_persons' ).addClass( 'wcfm_custom_hide wcfm_ele_hide wcfm_hide' );
					$( '#_wc_booking_has_resources + p, #_wc_booking_has_persons + p' ).addClass( 'wcfm_custom_hide wcfm_ele_hide wcfm_hide' );
				}
				
				$( '#_wc_booking_has_resources' ).each( function () {
					if ( true === changed ) {
						if ( ! $( this ).is( ':checked' ) ) {
							$( this ).val( 'enable' ).attr( 'value', 'enable' );
						} else {
							$( this ).val( 'yes' ).attr( 'value', 'yes' );
						}
					}

					if ( 'yes' === $( this ).val() ) {
						$( this ).prop( 'checked', true );
						$( '.resources.booking.accommodation-booking' ).removeClass( 'wcfm_ele_hide' ).removeClass( 'wcfm_ele_hide' ).removeClass( 'wcfm_block_hide' ).removeClass( 'wcfm_head_hide' );
					}
				} );
				
				$( '#_wc_booking_has_persons' ).each( function () {
					if ( true === changed ) {
						if ( ! $( this ).is( ':checked' ) ) {
							$( this ).val( 'enable' ).attr( 'value', 'enable' );
						} else {
							$( this ).val( 'yes' ).attr( 'value', 'yes' );
						}
					}

					if ( 'yes' === $( this ).val() ) {
						$( this ).prop( 'checked', true );
						$( '.persons.booking.accommodation-booking' ).removeClass( 'wcfm_ele_hide' ).removeClass( 'wcfm_ele_hide' ).removeClass( 'wcfm_block_hide' ).removeClass( 'wcfm_head_hide' );
					}
				} );
			}, 3000 );
		}
		
		$( '#product_type' ).each( function () {
			verifyResourcesAndPersons( $( this ) );
		} );
		
		$( document.body ).on( 'wcfm_product_type_changed', function() {
			verifyResourcesAndPersons( $( '#product_type' ), true );
		});
		
		$( document.body ).on( 'click', '#_wc_booking_has_resources, #_wc_booking_has_persons', function() {
			verifyResourcesAndPersons( $( '#product_type' ), true );
		});
		
		$( '.wcfm_module_box' ).each( function () {
			
			var indexes = [
				'membership',
				'vendor_badges',
				'vendor_followers',
				'chatbox',
				'vendor_verification',
				'catalog',
				'sell_items_catalog',
				'product_popup',
				'product_mulivendor'
			];
			
			for ( var ii = 0; ii < indexes.length; ii++ ) {
				if ( $( this ).attr( 'class' ).indexOf( indexes[ ii ] ) >= 0 ) {
					$( this ).parent().addClass( 'hidden' );
				}
			}
		} );
		
		$( '#wcfm-main-contentainer .wcfm-container-box .wcfm-container a[href*="products-manage"]' ).each( function () {
			$( this ).attr( 'href', $( this ).attr( 'href' ) + '#bookable' );
		} );
		
		if( window.location.hash ) {
			if( window.location.hash.indexOf( 'bookable' ) >= 0 ) {
				$( '#product_type' ).each( function () {
					var theSelect = $( this );

					theSelect.find( 'option' ).each( function () {
						$( this ).removeAttr( 'selected' ).prop( 'selected', false );

						if ( 'booking' === $( this ).attr( 'value' ) ) {
							$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
						}
					} );
				
					theSelect.trigger( 'change' );
				} );
			}
		}
	} );
} )( jQuery );


