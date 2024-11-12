/**
 Theme Name:       Listar
 Theme URI:        http://listar.directory/
 Author:           Web Design Trade
 Author URI:       https://themeforest.net/user/webdesigntrade
 File Description: Theme's main JavaScript to WordPress admin

 @package Listar
 */

/* Hide the following variables from JSHint because they are globally declared earlier by other scripts */

/* global wp, listarLocalizeAndAjax, listarIconSelector, jQuery, listarSiteURL, listarThemeURL, listarSiteCountryCode */

/*
 * Set 'wp' to its existing value (if present)
 *
 * @link https://make.wordpress.org/core/handbook/best-practices/coding-standards/javascript/#globals
 */

window.wp = window.wp || {};

( function ( $ ) {

	'use strict';

	var updatingCallToActionWidget = false;
	var preventEvenCallStack1 = false;
	var firstGalleryResize = false;
	var multipleRegionsActive = $( 'body' ).hasClass( 'listar-multiple-regions-enabled' );

	/* Customizer *********************************************************/

	/* Properly using .bind() method for wp.customize, instead of .on() */

	if ( undefined !== wp.customize ) {

		wp.customize.bind( 'ready', function () {

			var
				customize = this,
				changedFontList = false,
				currentURL = window.location.href,
				update_fonts_hash = 'listar_google_fonts';

			currentURL = currentURL.replace( '#' + update_fonts_hash, '' );

			/* Set initial Customizer section to display, depending on current URL hash */

			if ( window.location.hash ) {

				/* Prevent duplicated '#' */
				var customizer_section_id = window.location.hash.replace( /#/g, '' );

				if ( $( '#accordion-section-' + customizer_section_id ).length > 0 ) {
					customize.section( customizer_section_id ).expand();
				}

			}

			/* For Google Fonts section: detect if user is deleting and/or adding new Google Fonts */

			customize.bind( 'save', function () {
				setTimeout( function(){
					var
						newGoogleFontControl = $( '#_customize-input-listar_new_google_font_control' ),
						deleteGoogleFontControl = $( '#_customize-input-listar_delete_google_font_control' );

					if ( newGoogleFontControl.length > 0 ) {
						newGoogleFontControl = newGoogleFontControl.val();
					} else {
						newGoogleFontControl = '';
					}

					if ( deleteGoogleFontControl.length > 0 ) {
						deleteGoogleFontControl = deleteGoogleFontControl.val();
					} else {
						deleteGoogleFontControl = 'none';
					}

					if ( - 1 !== deleteGoogleFontControl.indexOf( 'fonts.googleapis.com' ) || - 1 !== newGoogleFontControl.indexOf( 'fonts.googleapis.com' ) ) {
						changedFontList = true;
					}

				}, 100 );
			} );

			customize.bind( 'saved', function () {
				if ( changedFontList ) {
					$( '#customize-control-listar-new-google-font-control, #customize-control-listar-delete-google-font-control' ).css( { display: 'none' } );
					$( '.updating-google-fonts a' ).attr( 'href', currentURL + "#" + update_fonts_hash );
					$( '.updating-google-fonts' ).removeClass( 'hidden' );

					window.location.hash = update_fonts_hash;
					location.reload();
				}
			} );

			/*
			 * If by any reason the Customizer page doesn't refresh when adding or deleting
			 * Google Fonts, allow user to do it manually
			 */
			$( 'body' ).on( 'click', '.updating-google-fonts a', function ( e ) {
				e.preventDefault();
				e.stopPropagation();

				window.location.href = currentURL;
				window.location.hash = update_fonts_hash;
				location.reload();
			} );

			/*
			 * Append links after primary and secondary Google Fonts selectors, so users can
			 * check details about the current selected fonts.
			 */

			$( '#_customize-input-listar_primary_google_font_control, #_customize-input-listar_secondary_google_font_control' ).each( function () {
				var font = "";

				if ( '' !== $( this ).val() ) {
					font = $( this ).val();
					font = font.split( 'family=' );
					font = font[1];
					font = font.substring( 0, font.indexOf( '&' ) );
					font = font.substring( 0, font.indexOf( ':' ) );
					font = font.replace( / /g, '+' );
					$( this ).after( '<p class="listar-check-font"><a target="_blank" href="https://fonts.google.com/specimen/' + font + '">' + listarLocalizeAndAjax.goToGoogleFonts + '</a></p>' );
				} else {
					$( this ).after( '<p class="listar-check-font"><a target="_blank" href="https://fonts.google.com/">' + listarLocalizeAndAjax.goToGoogleFonts + '</a></p>' );
				}
			} );

			/*
			 * Update these links when the fonts are changed
			 */
			$( 'body' ).on( 'change', '#_customize-input-listar_primary_google_font_control, #_customize-input-listar_secondary_google_font_control', function ( e ) {
				var font = $( this ).val();

				font = font.split( 'family=' );
				font = font[1];
				font = font.substring( 0, font.indexOf( '&' ) );
				font = font.substring( 0, font.indexOf( ':' ) );
				font = font.replace( / /g, '+' );

				$( this ).siblings( '.listar-check-font' ).each( function () {
					$( this ).find( 'a' ).attr( 'href', 'https://fonts.google.com/specimen/' + font );
				} );
			} );

			/*
			 * Hide language settings, replace by a link to display it
			 */

			$( '#customize-control-listar_google_font_language_subset_control' ).each( function () {
				$( this ).prepend( '<p class="listar-show-advanced-fonts"><a href="#">' + listarLocalizeAndAjax.showAdvancedSettings + '</a></p>' );
				$( '.listar-show-advanced-fonts' ).siblings().css( { display : 'none' } );
			} );

			$( 'body' ).on( 'click', '.listar-show-advanced-fonts a', function ( e ) {
				e.preventDefault();
				e.stopPropagation();
				$( this ).parent().siblings().css( { display : 'block' } );
				$( this ).prop( 'innerHTML', listarLocalizeAndAjax.hideAdvancedSettings );
				$( this ).parent().attr( 'class', 'listar-hide-advanced-fonts' );
				$( '#google-fonts-help-languages' ).css( { display : 'none' } );

			} );

			$( 'body' ).on( 'click', '.listar-hide-advanced-fonts a', function ( e ) {
				e.preventDefault();
				e.stopPropagation();
				$( this ).parent().siblings().css( { display : 'none' } );
				$( this ).prop( 'innerHTML', listarLocalizeAndAjax.showAdvancedSettings );
				$( this ).parent().attr( 'class', 'listar-show-advanced-fonts' );
			} );
		} );
	}// End if().

	/* Convert Classic to Gutenber blocks, if available */
	setTimeout( function () {
		if ( $( '.editor-block-list__layout' ).length ) {
			wp.data.select( 'core/editor' ).getBlocks().forEach( function( block ){
				if ( 'core/freeform' === block.name ) {
					wp.data.dispatch( 'core/editor' ).replaceBlocks( block.clientId, wp.blocks.rawHandler( {
						HTML: wp.blocks.getBlockContent( block )
					} ) );
				}
			} );
		}
	}, 1500 );

	/* General ************************************************************/

	$( function () {

		/* Global variables for this scope ****************************/

		var
			mediaUploader = 0,
			defaultThemeColor = '#258bd5',
			userIntro,
			profilePicTR,
			priceRange,
			priceRangeValue,
			priceAverage,
			currentIconField,
			countTerms,
			mediaManager,
			preventCallStack,
			updatingWidget,
			updatingWidgetInterval,
			autosaving = false,
			updatingCustomMetaBoxes = false,
			lastJSON;
		
		/* Global variables for Operating Hours ***********************/
		
		var
			currentDay,
			currentDayLetter,
			currentDayAbbr,
			selectedOpenHour,
			selectedCloseHour,
			currentRealOpenHour,
			currentRealCloseHour,
			selectedOpenAttr,
			selectedCloseAttr,
			currentHour,
			hourFormatFront,
			hourOpenPlaceholder,
			hourClosePlaceholder,
			hasMultiPleHoursPerDay = false;

		/* General functions ******************************************/
		
		function tryParseJSON( jsonString ){
			
			/* Reference: https://stackoverflow.com/a/20392392/7765298 */
			
			try {
				var o = JSON.parse( jsonString );

				if ( o && typeof o === 'object' ) {
					return o;
				}
			}
			catch ( e ) {}

			return false;
		};

		/* Toggle meta fields visibility according to current page template */

		function updateMetaVisibleFields() {
			setTimeout( function() {

				if ( $( 'body' ).hasClass( 'post-type-page' ) ) {
					var template = $( '#page_template, .editor-page-attributes__template select' );

					if ( template.length ) {
						template = template.eq( 0 ).val();
					} else if ( 'undefined' !== typeof wp.data ) {
						template = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'template' );
					} else {
						template = '';
					}

					if ( 'default' === template || '' === template ) {
						$( '#listar_meta_box_page_subtitle, #listar_meta_box_page_intro' ).css( { display: 'block' } );
						$( '#listar_meta_box_frontpage_title, [id*="listar_meta_box_cover_video"].postbox, [id*="listar_meta_box_cover_video_minimum_screen_width"].postbox' ).css( { display: 'none' } );
					} else if ( template.indexOf( 'front-' ) >= 0 ) {
						$( '#listar_meta_box_frontpage_title, #listar_meta_box_page_subtitle, [id*="listar_meta_box_cover_video"].postbox, [id*="listar_meta_box_cover_video_minimum_screen_width"].postbox' ).css( { display: 'block' } );
					} else {
						$( '#listar_meta_box_page_subtitle, #listar_meta_box_page_intro' ).css( { display: 'block' } );
						$( '#listar_meta_box_frontpage_title, [id*="listar_meta_box_cover_video"].postbox, [id*="listar_meta_box_cover_video_minimum_screen_width"].postbox' ).css( { display: 'none' } );
					}

					if ( template.indexOf( 'medium-width-page' ) >= 0 ) {
						$( 'body' ).addClass( 'medium-width-page' );
					} else {
						$( 'body' ).removeClass( 'medium-width-page' );
					}
				}

				equalizeWordPressGalleryHeights( $( '.wp-block-gallery' ) );

			}, 500 );
		}

		function toggleCheckboxDependantField( checkField, dependant, hideParent, inverse ) {
			
			if ( undefined === inverse ) {
				inverse = false;
			}
			
			$( checkField ).each( function () {
				dependant = true === hideParent ? $( dependant ).parent() : $( dependant );
				
				if ( $( this ).is( ':checked' ) ) {
					dependant.removeClass( 'hidden' );
					
					if ( inverse ) {
						dependant.addClass( 'hidden' );
					}
				} else {
					dependant.addClass( 'hidden' );
					
					if ( inverse ) {
						dependant.removeClass( 'hidden' );
					}
				}
			} );
		}
		
		function fixListingCoordinates( latField, lngField ) {
			var returnValue = true;
			var hasAlert1 = false;
			var hasAlert2 = false;
			var hasAlert3 = false;
			
			if ( latField.length && lngField.length ) {
				if ( 'string' === typeof latField.val() ) {
					var latFieldInitial = latField.val().replace( /\s+/g, '' );
					
					// Does the string contains '.-' or '-.'?
					latFieldInitial = latFieldInitial.replace( '.-', '' ).replace( '-.', '-' );
					latField.val( latFieldInitial );
					
					// Does the string contains a hyphen out of position?
					if ( latFieldInitial.indexOf( '-' ) > 0 ) {
						var hyphenPos = latFieldInitial.indexOf( '-' );
						latFieldInitial = latFieldInitial.substring(0, hyphenPos ) + latFieldInitial.substring( hyphenPos + 1 );
						latField.val( latFieldInitial );
					}
					
					// Is the first character a dot?
					if ( '.' === latFieldInitial.charAt( 0 ) ) {
						latFieldInitial = latFieldInitial.substring(1);
						latField.val( latFieldInitial );
					}

					latFieldInitial = latFieldInitial.replace( '.-', '' ).replace( '-.', '-' );
					latField.val( latFieldInitial );
					
					var sanitizedLat = latFieldInitial.replace( /[^0-9\.-]/g, '' );
					var countDotsLat = '' !== sanitizedLat && sanitizedLat.indexOf( '.' ) >= 0 ? ( sanitizedLat.match( /\./g ) || [] ).length : 0;
					var countHyphensLat = '' !== sanitizedLat && sanitizedLat.indexOf( '-' ) >= 0 ? ( sanitizedLat.match( /\-/g ) || [] ).length : 0;

					if ( ( latFieldInitial !== sanitizedLat ) ) {
						hasAlert1 = true;
						latField.val( sanitizedLat );
						returnValue = false;
					}
					
					var testFloatLat = sanitizedLat;
					
					if ( '' !== testFloatLat ) {
						testFloatLat = Number( testFloatLat );
						
						if ( testFloatLat < -90 || testFloatLat > 90 ) {
							hasAlert2 = true;
							returnValue = false;
						}
					}

					if ( countDotsLat > 1 || countHyphensLat > 1 ) {
						hasAlert3 = true;
						returnValue = false;
					}
				}
				
				if ( 'string' === typeof lngField.val() ) {
					var lngFieldInitial = lngField.val().replace( /\s+/g, '' );
					
					// Does the string contains '.-' or '-.'?
					lngFieldInitial = lngFieldInitial.replace( '.-', '' ).replace( '-.', '-' );
					lngField.val( lngFieldInitial );
					
					// Does the string contains a hyphen out of position?
					if ( lngFieldInitial.indexOf( '-' ) > 0 ) {
						var hyphenPos = lngFieldInitial.indexOf( '-' );
						lngFieldInitial = lngFieldInitial.substring(0, hyphenPos ) + lngFieldInitial.substring( hyphenPos + 1 );
						lngField.val( lngFieldInitial );
					}
					
					// Is the first character a dot?
					if ( '.' === lngFieldInitial.charAt( 0 ) ) {
						lngFieldInitial = lngFieldInitial.substring(1);
						lngField.val( lngFieldInitial );
					}
					
					var sanitizedLng = lngFieldInitial.replace( /[^0-9\.-]/g, '' );
					var countDotsLng = '' !== sanitizedLng && sanitizedLng.indexOf( '.' ) >= 0 ? ( sanitizedLng.match( /\./g ) || [] ).length : 0;
					var countHyphensLng = '' !== sanitizedLng && sanitizedLng.indexOf( '-' ) >= 0 ? ( sanitizedLng.match( /\-/g ) || [] ).length : 0;

					if ( ( lngFieldInitial !== sanitizedLng ) ) {
						hasAlert1 = true;
						lngField.val( sanitizedLng );
						returnValue = false;
					}
					
					var testFloatLng = sanitizedLng;
					
					if ( '' !== testFloatLng ) {
						testFloatLng = Number( testFloatLng );
						
						if ( testFloatLng < -180 || testFloatLng > 180 ) {
							hasAlert2 = true;
							returnValue = false;
						}
					}

					if ( countDotsLng > 1 || countHyphensLng > 1 ) {
						hasAlert3 = true;
						returnValue = false;
					}
				}
			}

			if ( hasAlert1 ) {
				alert( listarLocalizeAndAjax.fixCoordinates1 );
			}

			if ( hasAlert2 ) {
				alert( listarLocalizeAndAjax.fixCoordinates2 );
			}

			if ( hasAlert3 ) {
				alert( listarLocalizeAndAjax.fixCoordinates3 );
			}

			return returnValue;
		}
		
		function fixLastCharacterCoordinates( latField, lngField ) {
			var sanitizedLat = '';
			var sanitizedLng = '';
			var returnValue  = true;
			
			if ( latField.length && lngField.length ) {
				if ( 'string' === typeof latField.val() ) {
					var latFieldInitial = latField.val().replace( /\s+/g, '' );
					
					// Does the string contains '.-' or '-.'?
					latFieldInitial = latFieldInitial.replace( '.-', '' ).replace( '-.', '-' );
					latField.val( latFieldInitial );
					
					// Does the string contains a hyphen out of position?
					if ( latFieldInitial.indexOf( '-' ) > 0 ) {
						var hyphenPos = latFieldInitial.indexOf( '-' );
						latFieldInitial = latFieldInitial.substring(0, hyphenPos ) + latFieldInitial.substring( hyphenPos + 1 );
						latField.val( latFieldInitial );
					}

					if ( '' !== latField.val() ) {
						var sanitizedLat = latFieldInitial.replace( /[^0-9\.-]/g, '' );

						// Is the last character a dot or hyphen?
						if ( '.' === sanitizedLat.slice( -1 ) || '-' === sanitizedLat.slice( -1 ) ) {
							sanitizedLat = sanitizedLat.slice( 0, -1 );
						}

						// Is the first character a dot?
						if ( '.' === sanitizedLat.charAt( 0 ) ) {
							sanitizedLat = sanitizedLat.substring(1);
						}
						
						latField.val( sanitizedLat );
					}
				}
			}
			
			if ( lngField.length && lngField.length ) {
				if ( 'string' === typeof lngField.val() ) {
					var lngFieldInitial = lngField.val().replace( /\s+/g, '' );
					
					// Does the string contains '.-' or '-.'?
					lngFieldInitial = lngFieldInitial.replace( '.-', '' ).replace( '-.', '-' );
					lngField.val( lngFieldInitial );
					
					// Does the string contains a hyphen out of position?
					if ( lngFieldInitial.indexOf( '-' ) > 0 ) {
						var hyphenPos = lngFieldInitial.indexOf( '-' );
						lngFieldInitial = lngFieldInitial.substring(0, hyphenPos ) + lngFieldInitial.substring( hyphenPos + 1 );
						lngField.val( lngFieldInitial );
					}

					if ( '' !== lngField.val() ) {
						var sanitizedLng = lngFieldInitial.replace( /[^0-9\.-]/g, '' );

						// Is the last character a dot or hyphen?
						if ( '.' === sanitizedLng.slice( -1 ) || '-' === sanitizedLng.slice( -1 ) ) {
							sanitizedLng = sanitizedLng.slice( 0, -1 );
						}

						// Is the first character a dot?
						if ( '.' === sanitizedLng.charAt( 0 ) ) {
							sanitizedLng = sanitizedLng.substring(1);
						}
						
						lngField.val( sanitizedLng );
					}
				}
			}
			
			if ( ( '' === sanitizedLat && '' !== sanitizedLng ) || ( '' === sanitizedLng && '' !== sanitizedLat ) || '.' === sanitizedLat || '-' === sanitizedLat || '.' === sanitizedLng || '-' === sanitizedLng ) {
				returnValue = false;
				alert( listarLocalizeAndAjax.fixCoordinates4 );
			}
			
			return returnValue;
		}
	
		// Remove all unwanted HTML tags (mainly <script>), except these.

		function stripHTMLTags( _html ) {
			var _tags = [ ], _tag = '';
			for ( var _a = 1; _a < arguments.length; _a ++ )
			{
				_tag = arguments[_a].replace( /<|>/g, '' ).trim();
				if ( arguments[_a].length > 0 )
					_tags.push( _tag, '/' + _tag );
			}

			if ( ! ( typeof _html === 'string' ) && ! ( _html instanceof String ) )
				return '';
			else if ( _tags.length === 0 )
				return _html.replace( /<(\s*\/?)[^>]+>/g, '' );
			else
			{
				var _re = new RegExp( '<(?!(' + _tags.join( '|' ) + ')\s*\/?)[^>]+>', 'g' );
				return _html.replace( _re, '' );
			}
		}

		// Seems to contain a URL.

		function containURLPattern( string ) {
			return string.indexOf( 'http://' ) >= 0 || string.indexOf( 'https://' ) >= 0 ? string : '';
		}

		function extractContent( s ) {
			var span = $( '<span>' + s + '</span>' );
			var finalHTML = '';

			span.find( '*' ).each( function () {
				finalHTML += $( this ).prop( 'outerHTML' );
			} );

			return finalHTML;
		}

		function richMediaFieldsetAppend( mediaValue ) {

			// Create fieldset dynamic fieldset inputs.

			var rand = Math.floor( ( Math.random() * 99999999 ) + 1 );

			if ( 'string' !== typeof mediaValue ) {
				mediaValue = '';
			}

			$( '.listar-business-rich-media-fields .listar-boxed-fields-inner-2' ).append( '<p class="form-field listar-form-field-full"><label for="company_business_rich_media_value_' + rand + '">' + listarLocalizeAndAjax.mediaLinkOrCode + '</label><textarea class="input-text" name="company_business_rich_media_value_' + rand + '" id="company_business_rich_media_value_' + rand + '" >' + mediaValue + '</textarea><small class="description">' + listarLocalizeAndAjax.enterMediaValue + '</small></p>' );
		}
				
		function sanitizePricingFields( field, allowDot, allowComma ) {
			var priceVal = field.val();

			if ( 'string' === typeof priceVal && 'undefined' !== priceVal ) {
				priceVal = priceVal.replace( /[^0-9\.,]/g, '' ).replace( '..', '.' ).replace( '.,', '.' ).replace( ',.', ',' ).replace( ',,', ',' );
			} else {
				priceVal = '';
			}
			
			if ( '' === priceVal || undefined === priceVal || 'undefined' === priceVal ) {
				priceVal = '';
			}
			
			if ( false === allowDot ) {
				priceVal = priceVal.replace( /\./g, '' );
			}
			
			if ( false === allowComma ) {
				priceVal = priceVal.replace( /\,/g, '' );
			}
			
			field.val( priceVal );
		}

		function validatePhoneCharacters( fields ) {
			fields.each( function () {
				var field = $( this );
				var str = field.val();

				field.val( validatePhoneCharactersString( str ) );
			} );
		}

		function validatePhoneCharactersString( str ) {
			return str
				.replace( /[^+()0-9 -]/g, '' )
				.replace( '+ ', '+' )
				.replace( ' +', '+' )
				.replace( /  /g, '' )
				.replace( /^\s+/g, ''); // If first character is a space, remove it.
		}
			
		function checkFieldsVisibility() {
			setInterval( function () {
				$( '#listar_who_can_complaint' ).each( function () {
					if ( 'logged-users' === $( this ).val() ) {
						$( '.listar_disable_complaint_email_field' ).addClass( 'hidden' );
					} else {
						$( '.listar_disable_complaint_email_field' ).removeClass( 'hidden' );
					}
				} );

				$( '#listar_distance_unit' ).each( function () {
					if ( 'mi' === $( this ).val() ) {
						$( '.listar_meters_if_lower_than' ).addClass( 'hidden' );
					} else {
						$( '.listar_meters_if_lower_than' ).removeClass( 'hidden' );
					}
				} );
			}, 500 );
		}
		
		function forceSelectSelected( theSelect ) {

			/* For Safari browser */
			theSelect.not( '[data-multiple_text],[multiple]' ).find( 'option' ).each( function () {
				if ( 'selected' === $( this ).attr( 'selected' ) ) {
					$( this ).prop( 'selected', true );
				} else {
					$( this ).prop( 'selected', false );
				}
			} );
		}
		
		function getGeolocatedData( originalData, geolocationType ) {			
			if ( ! Array.isArray( originalData ) ) {
				return;
			}

			var markerCounterAfterLoadJSON = '';
			var getGeolocatedDataURL = listarSiteURL + '/wp-content/plugins/listar-addons/inc/geolocate-data.php';
			var dataToSend = '';
			var modifiedData = [];
			var mod;
			
			if ( 'undefined' === typeof geolocationType ) {
				geolocationType = 'address';
			}
			
			if ( Array.isArray( originalData ) ) {
			
				for ( var ori = 0; ori < originalData.length; ori++ ) {
					var tempArray = [];
					
					tempArray.push( 'data-order-' + ori );
					tempArray.push( originalData[ ori ][0] );
					tempArray.push( originalData[ ori ][1] );
					tempArray.push( originalData[ ori ][2] );
					tempArray.push( originalData[ ori ][3] );
					modifiedData.push( tempArray );
					
					$( '.listar-data-geolocated, .listar-data-not-geolocated' )
						.removeClass( 'listar-data-geolocated' )
						.removeClass( 'listar-data-not-geolocated' );
					
					dataToSend += ',{"data-order-' + ori + '":"' + originalData[ ori ][1] + '"}';
				}
			}

			if ( 'string' === typeof geolocationType && '' !== dataToSend ) {
				var markerCounterAfterLoadJSON = { send_data : '[{"type":"' + geolocationType + '"}' + dataToSend + ']' };

				$.ajax( {
					url: getGeolocatedDataURL,
					type: 'POST',
					data: markerCounterAfterLoadJSON,
					cache    : false,
					timeout  : 30000
					
				} ).done( function ( response ) {
						
					for ( mod = 0; mod < modifiedData.length; mod++ ) {
						if ( '' !== $( modifiedData[mod][1] ).val() && undefined !== $( modifiedData[mod][1] ).val() ) {
							$( modifiedData[mod][1] ).addClass( 'listar-data-not-geolocated' );
						}

						$( modifiedData[mod][3] ).addClass( 'listar-data-not-geolocated' );
						$( modifiedData[mod][4] ).addClass( 'listar-data-not-geolocated' );
					}

					if ( response ) {
						var data = $.parseJSON( response );

						$.each( data, function() {
							var dataOrder = 'string' === typeof this.order ? this.order : false;

							if ( 'string' !== typeof this.lat && 'string' !== typeof this.lng ) {

								if ( '' !== this.lat && '' !== this.lng  ) {
									
									var dataLat = this.lat;
									var dataLng = this.lng;

									for ( mod = 0; mod < modifiedData.length; mod++ ) {
										if ( dataOrder === modifiedData[mod][0] ) {
											
											$( modifiedData[mod][3] )
												.removeClass( 'listar-data-not-geolocated' )
												.addClass( 'listar-data-geolocated' );
											
											$( modifiedData[mod][3] ).find( 'input[type="text"]' ).val( dataLat );
											
											$( modifiedData[mod][4] )
												.removeClass( 'listar-data-not-geolocated' )
												.addClass( 'listar-data-geolocated' );
											
											$( modifiedData[mod][4] ).find( 'input[type="text"]' ).val( dataLng );

											$( modifiedData[mod][1] )
												.removeClass( 'listar-data-not-geolocated' )
												.addClass( 'listar-data-geolocated' );
										}
									}
								} 
							}
						} );
					}
					
					$( '.listar-data-not-geolocated' ).each( function () {
						var input = $( this ).find( 'input[type="text"]' );
						var fieldName = '';
						
						if ( input.length ) {
							fieldName = input.attr( 'name' );
						
							if ( fieldName.indexOf( '_lat' ) >= 0 || fieldName.indexOf( '_lng' ) >= 0 || fieldName.indexOf( '_longitude' ) >= 0 ) {
								input.val( '' );
								$( this ).removeClass( 'listar-data-not-geolocated' );
								input.removeClass( 'listar-data-not-geolocated' );
							}
						}
					} );
				} );
			}
		}

		/**
		 * Apply a icon button (eye icon) to certain icon/image input fields,
		 * allowing users to append an image or an icon to respective field
		 */
		function appendIconButtons() {
			var fieldNames = [
				'term_meta[term_icon]',
				'listar-element-data-media',
				'listar_search_tip_icon'
			];

			setTimeout( function () {
				if ( ! $( 'body' ).hasClass( 'options-php' ) ) {
					var fieldsCount = fieldNames.length;

					for ( var i = 0; i < fieldsCount; i++ ) {
						appendIcon( fieldNames[ i ] );
					}
				}

				appendIconButtonsByClass();
				appendIconButtonsByClassOther();
			}, 500 );
		}

		/* For dynamic Gutenberg fields / fields without 'name' attribute */
		
		if ( $( '.menu.ui-sortable' ).length ) {
			setTimeout( function () {
				appendIconButtonsByClass();
			}, 1000 );
		}
		
		$( 'body' ).on( 'change DOMSubtreeModified DOMNodeInserted DOMNodeRemoved', '.menu.ui-sortable', function () {
			setTimeout( function () {
				appendIconButtonsByClass();
				appendIrisColorPicker();
			}, 1000 );
		} );
				
		function checkOpenHourSelected( theSelect ) {
			var startTimeWrapper = theSelect.parents( '.listar-business-start-time-field' );
			var dayRow = theSelect.parent().parent().parent();
			
			forceSelectSelected( theSelect );

			if ( startTimeWrapper.length ) {
				setTimeout( function () {
					var currentOpenValue = theSelect.val();
					var hasChanged = 0;
						
					if ( '11:59 PM' === currentOpenValue ) {
						theSelect.val( '00:00 AM' ).attr( 'value', '00:00 AM' );
						forceSelectSelected( theSelect );
						theSelect.select2().trigger( 'change' );
						currentOpenValue = '00:00 AM';
						hasChanged = 15;
					}
					
					setTimeout( function () {
						if ( currentOpenValue.indexOf( ' AM' ) >=0 || currentOpenValue.indexOf( ' PM' ) >= 0  ) {
							var currentOpenOrder = theSelect.attr( 'data-multiple-order' );
							var currentCloseValue  = dayRow.find( '.listar-business-end-time-field select[data-multiple-order="' + currentOpenOrder + '"]' ).val();

							if ( getTotalMinutes( currentOpenValue ) >= getTotalMinutes( currentCloseValue ) ) {
								dayRow.find( '.listar-business-end-time-field select[data-multiple-order="' + parseInt( currentOpenOrder, 10 ) + '"]' ).val( '11:59 PM' ).attr( 'value', '11:59 PM' );
								
								dayRow.find( '.listar-business-end-time-field select[data-multiple-order="' + parseInt( currentOpenOrder, 10 ) + '"] option' ).each( function () {
									$( this ).removeAttr( 'selected' ).prop( 'selected', false );

									if ( '11:59 PM' === $( this ).attr( 'value' ) ) {
										$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
										$( this ).parent().val( '11:59 PM' ).attr( 'value', '11:59 PM' );
									}
								} );
								
								forceSelectSelected( dayRow.find( '.listar-business-end-time-field select[data-multiple-order="' + parseInt( currentOpenOrder, 10 ) + '"]' ) );
								dayRow.find( '.listar-business-end-time-field select[data-multiple-order="' + parseInt( currentOpenOrder, 10 ) + '"]' ).select2().trigger( 'change' );
							}

							startTimeWrapper.parent().removeClass( 'listar-hide-multiple-hours-buttons' );
							startTimeWrapper.siblings( '.listar-business-end-time-field' ).find( 'select' ).prop( 'disabled', false );
							startTimeWrapper.find( 'select' ).prop( 'disabled', false );
						} else {
							startTimeWrapper.siblings( '.listar-business-end-time-field' ).find( 'select' ).prop( 'disabled', true );
							startTimeWrapper.find( 'select' ).prop( 'disabled', true );
							theSelect.prop( 'disabled', false );
							startTimeWrapper.parent().addClass( 'listar-hide-multiple-hours-buttons' );
						}
					}, hasChanged );
				}, 15 );
			}
		}
				
		function checkCloseHourSelected( theSelect ) {
			if ( theSelect.parents( '.listar-business-end-time-field' ).length ) {
				var endTimeWrapper = theSelect.parents( '.listar-business-end-time-field' );
				var dayRow = theSelect.parent().parent().parent();
				
				forceSelectSelected( theSelect );

				if ( endTimeWrapper.length ) {
					setTimeout( function () {
						var currentCloseValue = theSelect.val();
						
						if ( '00:00 AM' === currentCloseValue ) {
							theSelect.val( '11:59 PM' ).attr( 'value', '11:59 PM' );
							forceSelectSelected( theSelect );
							theSelect.select2().trigger( 'change' );
						} else {
							var currentCloseOrder = theSelect.attr( 'data-multiple-order' );
							var currentOpenValue  = dayRow.find( '.listar-business-start-time-field select[data-multiple-order="' + currentCloseOrder + '"]' ).val();

							if ( getTotalMinutes( currentCloseValue ) <= getTotalMinutes( currentOpenValue ) ) {
								theSelect.val( '11:59 PM' ).attr( 'value', '11:59 PM' );
								
								theSelect.find( 'option' ).each( function () {
									$( this ).removeAttr( 'selected' ).prop( 'selected', false );

									if ( '11:59 PM' === $( this ).attr( 'value' ) ) {
										$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
										$( this ).parent().val( '11:59 PM' ).attr( 'value', '11:59 PM' );
									}
								} );
								
								forceSelectSelected( theSelect );
								theSelect.select2().trigger( 'change' );
								
								if ( 0 === theSelect.parent().parent().find( 'select[data-multiple-order="' + ( parseInt( currentCloseOrder, 10 ) + 1 ) + '"]' ).length ) {
									dayRow.find( '.listar-business-start-time-field .listar-multiple-hours-plus' )[0].click();
								}

								setTimeout( function () {
									theSelect.parent().parent().parent().find( '.listar-business-start-time-field select[data-multiple-order="' + ( parseInt( currentCloseOrder, 10 ) + 1 ) + '"]' ).val( '00:00 AM' ).attr( 'value', '00:00 AM' );
									forceSelectSelected( theSelect.parent().parent().parent().find( '.listar-business-start-time-field select[data-multiple-order="' + ( parseInt( currentCloseOrder, 10 ) + 1 ) + '"]' ) );
									theSelect.parent().parent().parent().find( '.listar-business-start-time-field select[data-multiple-order="' + ( parseInt( currentCloseOrder, 10 ) + 1 ) + '"]' ).select2().trigger( 'change' );
									theSelect.parent().parent().find( 'select[data-multiple-order="' + ( parseInt( currentCloseOrder, 10 ) + 1 ) + '"]' ).val( currentCloseValue ).attr( 'value', currentCloseValue );
									
									theSelect.parent().parent().find( 'select[data-multiple-order="' + ( parseInt( currentCloseOrder, 10 ) + 1 ) + '"] option' ).each( function () {
										$( this ).removeAttr( 'selected' ).prop( 'selected', false );
										
										if ( $( this ).attr( 'value' ) === currentCloseValue ) {
											$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
											$( this ).parent().val( currentCloseValue ).attr( 'value', currentCloseValue );
										}
									} );

									forceSelectSelected( theSelect.parent().parent().find( 'select[data-multiple-order="' + ( parseInt( currentCloseOrder, 10 ) + 1 ) + '"]' ) );
									theSelect.parent().parent().find( 'select[data-multiple-order="' + ( parseInt( currentCloseOrder, 10 ) + 1 ) + '"]' ).select2().trigger( 'change' );
								}, 20 );
							}
						}
					}, 13 );
				}
			}
		}
				
		function getTotalMinutes( inputTime ) {

			if ( -1 === inputTime.indexOf( ' AM' ) && -1 === inputTime.indexOf( ' PM' ) ) {
				return 0;
			}

			var inputHours = Number(inputTime.match(/^(\d+)/)[1]);
			var inputMinutes = Number(inputTime.match(/:(\d+)/)[1]);
			var AMPM = inputTime.match(/\s(.*)$/)[1];
			var totalMinutes = 0;
			var inputHoursString = 0;
			var inputMinutesString = 0;

			if ( 'PM' === AMPM && inputHours < 12 ) {
				inputHours = inputHours + 12;
			}

			if( 'AM' === AMPM && 12 === inputHours ) {
				inputHours = inputHours - 12;
			}

			inputHoursString = inputHours.toString();
			inputMinutesString = inputMinutes.toString();

			if( inputHours < 10 ) {
				inputHoursString = '0' + inputHoursString;
			};

			if( inputMinutes < 10 ) {
				inputMinutesString = '0' + inputMinutesString;
			}

			totalMinutes = ( parseInt( inputHoursString, 10 ) * 60 ) + parseInt( inputMinutesString, 10 );

			return totalMinutes;
		}
		
		function appendIrisColorPicker(){
			$( 'input[class*="menu_icon_color"]' ).each( function() {
				var colorField = $( this );

				if ( ! colorField.hasClass( 'wp-color-picker' ) ) {
					colorField.addClass( 'wp-color-picker');
					
					var labelText = $("label[for='" + this.id + "']").text();
					
					$( this ).wrap( '<label>' + labelText + '</label>' );
					
					if ( $( '.wp-color-picker' ).length && $.fn.iris ) {
						colorField.wpColorPicker();
						colorField.iris( 'option', 'palettes', [ '#F3315A', '#b11b11', '#84132B', '#543647', '#b23365', '#a640e2', '#a093c3', '#999', '#0CA5B0', '#2F906A', '#009bdd', '#00627e' ] );
					}
				}
			} );
		}
		
		function restartWPJobManagerTooltips() {
			if ( $.isFunction( $.fn.tipTip ) ) {
				$( '.tips, .help_tip' ).tipTip( {
					'attribute' : 'data-tip',
					'fadeIn' : 50,
					'fadeOut' : 50,
					'delay' : 200
				} );
			}
		}
			
		function updateGeocodingProvider( providerSelect ) {
			var provider = providerSelect.val();

			if ( 'undefined' === typeof provider || '' === provider ) {
				provider = 'mapplus';
			}

			$( '.listar-geocoding-providers p, .listar-geocoding-providers-keys p' ).addClass( 'hidden' );
			$( '.listar-geocoding-providers p.listar-' + provider + '-provider-description, .listar-geocoding-providers-keys p.listar-' + provider + '-provider-key' ).removeClass( 'hidden' );
		}
		
		function updateMapProvider( providerSelect ) {
			var provider = providerSelect.val();

			if ( 'undefined' === typeof provider || '' === provider ) {
				provider = 'mapplus';
			}

			$( '.listar-map-providers p, .listar-map-providers-keys p' ).addClass( 'hidden' );
			$( '.listar-map-providers p.listar-' + provider + '-provider-description, .listar-map-providers-keys p.listar-' + provider + '-provider-key' ).removeClass( 'hidden' );
		}
		
		function appendIconButtonsByClassOther() {
			
			var fieldClasses = [
				'input[class*="custom_package_option_icon"]'
			];

			var fieldsCount = fieldClasses.length;

			for ( var i = 0; i < fieldsCount; i++ ) {
				appendIcon( fieldClasses[ i ], true );
			}
		}
		
		function appendIconButtonsByClass() {
			var fieldClasses = [
				'.editor-block-inspector__advanced .components-base-control:last-child .components-text-control__input',
				'.block-editor-block-inspector__advanced .components-base-control:last-child .components-text-control__input',
				'input[class*="menu_icon_field"]',
				'.edit-menu-item-classes'
			];

			if ( $( '.wp-block.is-selected .wp-block-paragraph, p.wp-block.is-selected[data-type="core/paragraph"], .menu.ui-sortable' ).length ) {
				if ( ! $( 'body' ).hasClass( 'options-php' ) ) {
					var fieldsCount = fieldClasses.length;

					for ( var i = 0; i < fieldsCount; i++ ) {
						appendIcon( fieldClasses[ i ], true );
					}
				}
			}
		}

		/* Helper function out of loop to avoid JSHINT warning */

		function appendIcon( fieldName, byClass ) {
			var selector = 'input[name^="' + fieldName + '"]';

			if ( 'undefined' !== typeof byClass ) {
				selector = fieldName;
			}

			$( selector ).each( function () {
				var field = $( this );
				var fieldNameSelector = '';

				/* Were the buttons already appended before? */
				if ( field.parent().find( '.choose-icon' ).length ) {
					return true;
				}

				if ( ! field[0].hasAttribute( 'name' ) ) {
					field.attr( 'name', 'dynamic-field-' + Math.floor( ( Math.random() * 99999 ) + 1 ) );
				}

				fieldNameSelector = field.attr( 'name' );

				if ( 0 === field.parent().find( '.choose-icon' ).length ) {
					var
						iconHref = '<a name="' + listarLocalizeAndAjax.chooseIconLibrary + '" data-icon-field="' + fieldNameSelector + '" class="choose-icon dashicons dashicons-visibility thickbox" href="#TB_inline"></a>',
						iconImageHref = '<a class="upload-image-button choose-image dashicons dashicons-format-image" href="#"></a>';

					field.parent()
						.append( iconHref )
						.append( iconImageHref );
					
					field.addClass( 'listar-appended-icon-class' );
					
					if ( '.edit-menu-item-classes' === fieldName ) {
						field.parent()
							.append( '<a class="listar-menu-icon-low-stroke" href="#">' + listarLocalizeAndAjax.iconReduceStroke + '</a>' );
					}
				}
			} );
		}

		/* Move background image URL from 'data-background-image' attribute to 'background-image' style */

		function convertDataBackgroundImage( elem ) {

			elem = 'undefined' !== typeof elem ? elem : $( '[data-background-image]' );

			elem.each( function () {
				$( this ).css( { 'background-image': 'url(' + $( this ).attr( 'data-background-image' ) + ')' } );
				$( this ).removeAttr( 'data-background-image' ).removeClass( 'no-image' );

				/* Sometimes the 'no-image' class is present on parent elements (max 3 levels) */
				$( this ).parent().removeClass( 'no-image' );
				$( this ).parent().parent().removeClass( 'no-image' );
				$( this ).parent().parent().parent().removeClass( 'no-image' );
			} );
		}

		/**
		 * For One Click Demo Import
		 * Automatically restarts the demo data importing process in case of fail.
		 * Max three attempties.
		 * Specially developed for slow/shared servers.
		 */

		var
			reimportAttempties = 0;

		function oneClickDemoReimport() {
			var reimport = setInterval( function () {
				var importNoticeSuccess = $( '.ocdi-imported-content-imported--success' );

				if ( $( '.ocdi-imported-content-imported--error + p' ).length ) {
					reimportAttempties++;

					if ( 5 === reimportAttempties ) {
						$( '.ocdi-imported-content-imported--error + p' ).after( '<p>' + listarLocalizeAndAjax.refreshPage + '</p>' );
						clearInterval( reimport );
					} else {
						$( '.ocdi-imported-content-imported--error + p' ).each( function () {
							$( this ).prop( 'outerHTML', '' );
						} );

						$( '.ocdi-imported-content-imported--error' ).each( function () {
							$( this ).prop( 'outerHTML', '' );
						} );

						$( '.js-ocdi-install-plugins-before-import[href="#"]' ).each( function () {
							$( this )[0].click();
						} );
						
						setTimeout( function () {
							$( '.ocdi-imported.js-ocdi-imported' ).css( { display : 'none' } );
						}, 50 );
					}
				}

				if ( importNoticeSuccess.length ) {
					clearInterval( reimport );
				}
			}, 500 );
		}

		$( 'body.appearance_page_one-click-demo-import' ).each( function () {
			oneClickDemoReimport();
		} );
		
		/* START DEPRECATED IMPORT RE-CLICK ***************************/

		/**
		 * For One Click Demo Import
		 * Automatically restarts the demo data importing process in case of fail.
		 * Max three attempties.
		 * Specially developed for slow/shared servers.
		 */
		
		/*

		var
			reimportActive = false,
			reimportAttempties = 0,
			ocdiLoading = $( '.ocdi__ajax-loader.js-ocdi-ajax-loader' );

		$( 'body' ).on( 'click', function () {
			setTimeout( function () {
				if ( ! reimportActive && $( '.ocdi__ajax-loader.js-ocdi-ajax-loader' ).length > 0 ) {
					if ( 'block' === ocdiLoading.css( 'display' ) ) {
						ocdiLoading
							.html( '<span class="spinner"></span> ' + listarLocalizeAndAjax.importing + ' . . .' )
							.addClass( 'show' );

						$( 'body' ).addClass( 'importing-demo-data' );
						$( '.listar-demo-importer-intro' ).prop( 'innerHTML', '<br/>' );

						reimportActive = true;
						oneClickDemoReimport();
					}
				}
			}, 50 );
		} );

		function oneClickDemoReimport() {
			var reimport = setInterval( function () {
				var importNoticeSuccess = $( '.js-ocdi-ajax-response' ).find( '.notice-success' );

				if ( $( '.js-ocdi-gl-item-container h3' ).length > 1 ) {
					$( '.js-ocdi-gl-item-container h3' ).prop( 'outerHTML', '' );
				}

				if ( $( '.js-ocdi-ajax-response .notice-error' ).length || $( '.js-ocdi-ajax-response .notice-warning' ).length ) {
					reimportAttempties++;

					if ( 4 === reimportAttempties ) {
						$( '.js-ocdi-ajax-response .notice-error,.js-ocdi-ajax-response .notice-warning' ).addClass( 'show' );
						$( '.ocdi__response.js-ocdi-ajax-response' ).append( '<div class="notice notice-error is-dismissible show try-again"><p></p></div>' );
						$( '.notice-error.try-again p' ).append( listarLocalizeAndAjax.refreshPage );

						ocdiLoading.removeClass( 'show' );
						clearInterval( reimport );
					} else {
						if ( $( '.js-ocdi-ajax-response .notice-warning' ).length ) {
							$( '.js-ocdi-ajax-response .notice-warning' ).prop( 'outerHTML', '' );
						}

						if ( $( '.js-ocdi-ajax-response .notice-error' ).length ) {
							$( '.js-ocdi-ajax-response .notice-error' ).prop( 'outerHTML', '' );
						}

						$( '.button.js-ocdi-import-data' ).trigger( 'click' );
					}
				}

				if ( importNoticeSuccess.length ) {
					ocdiLoading.removeClass( 'show' );
					importNoticeSuccess.css( { display: 'block' } );
					clearInterval( reimport );
				}
			}, 1000 );
		}
		*/
		
		/* END DEPRECATED IMPORT RE-CLICK ***************************/

		/* Equalize WordPress gallery item heights */

		function equalizeWordPressGalleryHeights( currentGallery, verifyWidth ) {
			if ( ! preventEvenCallStack1 ) {
				var delay = 100;

				preventEvenCallStack1 = true;

				if ( 'undefined' === typeof verifyWidth ) {
					verifyWidth = false;
				}
				
				setTimeout( function () {
					var checkUpdate = $( '.listar-update-this-gallery' );

					if ( 'undefined' === typeof currentGallery ) {
						currentGallery = $( '.wp-block-gallery' );
					}

					if ( checkUpdate.length ) {
						currentGallery = checkUpdate;
					}
					
				}, 15 );
				
				if ( currentGallery.find( 'img' ).length ) {
					if ( 0 === currentGallery.find( 'img' ).eq( 0 ).height() ) {
						delay = 2000;
					} else {
						delay = 0;
					}
				}
				
				if ( ! firstGalleryResize ) {
					firstGalleryResize = true;
					delay = 2000;
				}
				
				setTimeout( function () {

					/* For Gutenberg gallery */
					setTimeout( function () {
						currentGallery.each( function () {
							var gallery = $( this );
							var doUpdate = true;	

							if ( ! gallery[0].hasAttribute( 'data-last-width' ) ) {
								gallery.attr( 'data-last-width', gallery.width() );
							}

							if ( verifyWidth ) {
								if ( parseInt( gallery.attr( 'data-last-width' ), 10 ) === parseInt( gallery.width(), 10 ) ) {
									doUpdate = false;
								} else {
									gallery.attr( 'data-last-width', gallery.width() );
								}
							}

							if ( doUpdate ) {
								gallery.removeClass( 'listar-equalize-gallery' );
							}

							setTimeout( function () {
								if ( doUpdate ) {
									gallery.find( 'img' ).each( function () {
										var galleryImg = $( this );
										galleryImg.css( { height : '', width : '', 'min-width' : '' } );

										setTimeout( function () {
											var imgWidth = galleryImg.width();
											var imgHeight = galleryImg.height();
											var proportion = imgWidth / imgHeight;
											var newHeight = galleryImg.parents( '.blocks-gallery-item' ).height();
											var newWidth1 = galleryImg.parents( '.blocks-gallery-item' ).width();
											var newWidth2 = Math.ceil( newHeight * proportion ) + 2;
											var newWidth = 0;

											if ( newWidth1 > newWidth2 ) {
												newWidth = newWidth1;
												newHeight = Math.ceil( newWidth / proportion );
											} else {
												newWidth = newWidth2;
											}

											if ( 0 !== newWidth % 2 ) {
												newWidth++;
											}

											if ( 0 !== newHeight % 2 ) {
												newHeight++;
											}

											galleryImg.css( { height : newHeight, width : newWidth, 'min-width' : newWidth } );
										}, 150 );
									} );
								}
							}, 50 );

							setTimeout( function () {
								gallery.addClass( 'listar-equalize-gallery' );
							}, 350 );
						} );
					}, 50 );

					setTimeout( function () {
						preventEvenCallStack1 = false;
					}, 500 );
				}, delay );
			}
		}

		/* Prepare interface (backend) ********************************/

		setInterval( function () {
			
			// Closes unwanted Woocommerce Survey modal.
			// 
			$( '.woocommerce-navigation-opt-out-modal__actions' ).each( function () {
				$( this ).parent().find( '.components-modal__header' ).each( function () {
					$( this ).find( 'button' ).each( function () {
						$( this )[0].click();
					} );
				} );
			} );

			$( '.woocommerce-navigation-opt-out-modal__actions a[href*="automattic.survey"]' ).each( function () {
				$( this ).parent().find( 'button' ).each( function () {
					$( this )[0].click();
				} );
			} );					
			
		}, 1000 );

		$( '.update-core-php #update-plugins-table [href*="wp-job-manager-wc-paid-listings"]' ).each( function (){
			$( this ).parents( '.plugin-title' ).each( function () {
				$( this ).parent().prop( 'outerHTML', '' );
			} );
		} );

		$( '[name="woocommerce_feature_order_attribution_enabled"]' ).each( function (){
			$( this ).parents( 'tr' ).each( function () {
				$( this ).prop( 'outerHTML', '' );
			} );
		} );
		
		/* Force Add Listing as the second sub menu of Listings WP menu */
		
		var detectAddListing = setInterval( function () {
			$( '#menu-posts-job_listing' ).each( function () {
				if ( 0 === $( this ).find( 'a[href*="post-new.php?post_type=job_listing"]' ).length ) {
					$( this ).find( 'li.wp-first-item' ).each( function () {
						$( this ).after( '<li><a href="' + listarLocalizeAndAjax.addListingURLBackend + '">' + listarLocalizeAndAjax.addListing + '</a></li>' );
						clearInterval( detectAddListing );
					} );
				} else {
					clearInterval( detectAddListing );
				}
			} );
		}, 500 );
		
		$( '#message.error' ).each( function () {
			if ( ! $( this ).find( 'a[href*="wclovers"]' ).length ) {
				$( this ).addClass( 'listar-force-display' );
			} else {
				$( this ).css( { display : 'none' } );
			}
		} );

		if ( window.location.hash ) {
			var h = window.location.hash.replace( /#/g, '' );

			if ( h.indexOf( '__edit-' ) >= 0 ) {
				$( '.listar_theme_options_field' ).css( { display: 'none' } );
				$( '.' + h ).css( { display: '' } );
				$( 'a[data-id=' + h + ']' ).parent().addClass( 'active' );

				if ( $( 'a[data-id=' + h + ']' ).parent().hasClass( 'scoop-hasmenu' ) ) {
					$( 'a[data-id=' + h + ']' ).siblings( 'ul' ).find( 'a' ).each( function () {
						var menuItem = $( this ).attr( 'data-id' );
						$( '.' + menuItem ).css( { display: '' } );
					} );
				}
			}
		} else {

			setTimeout( function () {
				var lastThemeOptionsScreen = $( '#listar_last_theme_options_screen' ).val();
				
				if ( 'string' === typeof lastThemeOptionsScreen && lastThemeOptionsScreen.indexOf( '__' ) >= 0 && $( 'a[data-id=' + lastThemeOptionsScreen + ']' ).length > 0 ) {
					$( 'a[data-id=' + lastThemeOptionsScreen + ']' ).trigger( 'click' );
				} else {
					if ( $( 'a[data-id=__directory-config]' ).length > 0 ) {
						$( 'a[data-id=__directory-config]' ).trigger( 'click' );
					} else {
						$( 'a[data-id=__edit-branding]' ).trigger( 'click' );
					}
				}
			}, 100 );
		}
		
		/* Redirect and alert if powered cache is active */
		
		if ( '1' === listarLocalizeAndAjax.poweredCacheActive ) {
			if ( ! $( 'body' ).hasClass( 'plugins-php' ) ) {
				window.location.replace( '' );
				window.location.replace( window.listarSiteURL + '/wp-admin/plugins.php?plugin_status=all&paged=1&s' );
			} else {
				alert( listarLocalizeAndAjax.disablePoweredCache );
			}
		}

		/* Remove unwanted license links for certain plugins */
		$( 'a[href*="plugins.php?action=deactivate"][href*="wp-job-manager-wc-paid-listings"]' ).each( function () {
			var pluginLinkSiblings = $( this ).parent().siblings( '*' );
			var pluginLink = $( this ).parent().prop( 'outerHTML', $( this ).prop( 'outerHTML' ).replace( ' | ', '' ) );

			if ( pluginLinkSiblings.length ) {
				//pluginLinkSiblings.prop( 'outerHTML', '' );
			}
		} );
		
		/* Hide WP Job Manager custom fields */
		
		$( '#_job_business_raw_contents' ).each( function () {
			$( this ).parents( '.form-field' ).css( { display : 'none' } );
		} );

		$( 'input[name="wpjm_job_listings_archive_slug"],input[name="wpjm_job_base_slug"],input[name="job_manager_enable_salary"],input[name="job_manager_display_location_address"],input[name="job_manager_job_listing_pagination_type"],input[name="job_manager_hide_expired_content"],input[name="job_manager_enable_remote_position"],select[name="job_manager_paid_listings_flow"]' ).each( function () {
			$( this ).parents( 'tr' ).css( { display : 'none' } );
		} );
		
		$( 'a[href*="#settings-job_visibility"]' ).each( function () {
			$( this ).css( { display : 'none' } );
		} );

		if ( $( 'body' ).hasClass( 'job_listing_page_job-manager-settings' ) ) {
			
			/* Set new tab as initial for WP Job Manger Settings */
			$( 'a[href="#settings-job_listings"]' )[0].click();
			
			/* Hide undesired (or not supported yet) fields from WP Job Manger Settings */
			
                        $( '#setting-job_manager_enable_categories, #setting-job_manager_enable_default_category_multiselect, #setting-job_manager_enable_types, #setting-job_manager_enable_remote_position,[name*="job_manager_email_employer_expiring_job"]' ).parent().parent().parent().css( { display: 'none' } );
			$( '#setting-job_manager_category_filter_type, #setting-job_manager_date_format, #setting-job_manager_google_maps_api_key' ).parent().parent().css( { display: 'none' } );
			$( '#setting-job_manager_hide_filled_positions, #setting-job_manager_hide_expired, #setting-job_manager_multi_job_type, #setting-job_manager_regions_filter, #hubhood-reviews_allow_images, #setting-job_manager_enable_regions_filter' ).parent().parent().parent().css( { display: 'none' } );
			$( 'input[name=job_manager_category_filter_type],input[name=job_manager_date_format],input[name="job_manager_allowed_application_method"]' ).parent().parent().parent().parent().css( { display: 'none' } );
                        $( '#setting-job_manager_enable_registration' ).parent().parent().parent().css( { display: 'none' } );
		}
				
		/* Display/hide custom excerpt field */
		toggleCheckboxDependantField( '#_job_business_use_custom_excerpt', '#_job_business_custom_excerpt', true );
		
		// Always keep Lazy Load feature from Smush plugin deactivated.
		
		$( '#smush-cancel-lazyload' ).each( function() {
			$( this )[0].click();
		} );
				
		/* Return only characters for princing fields - 0 until 9 and dot (.) */
		$( 'input[class*="price-range"]' ).each( function () {
			sanitizePricingFields( $( this ) );
		} );
				
		/* Return only characters for princing fields - 0 until 9 and dot (.) */
		$( 'input[name*="priceaverage"]' ).each( function () {
			sanitizePricingFields( $( this ) );
		} );
		
		// Force display for the 'Duration' field for Claim packages
		
		$( '#product-type' ).each( function() {
			if ( 'job_package' === $( this ).val() || 'job_package_subscription' === $( this ).val() ) {
				$( '._job_listing_duration_field' ).css( { display : 'block' } );
			}
		} );
		
		// Hide listing packages submenu under Users menu.
		
		$( '.wp-submenu a[href="users.php?page=wc_paid_listings_packages"]' ).each( function() {
			$( this ).parent().prop( 'outerHTML', '' );
		} );
		
		$( '#woocommerce_navigation_enabled' ).each( function() {
			$( this ).parents( 'tr' ).prop( 'outerHTML', '' );
		} );
		
		// Hide unwanted options from WP Super Cache.
		
		$( '.tab1 .questionCon' ).each( function() {
			if ($( this ).find( '#wpFastestCacheStatus,#wpFastestCacheLoggedInUser,#wpFastestCacheMobile,#wpFastestCacheGzip,#wpFastestCacheMinifyHtml,#wpFastestCacheLBC,#wpFastestCacheDisableEmojis,#wpFastestCacheLanguage' ).length ) {
				$( this ).css( { display : 'block' } );
			}
		} );
		
		$( '.wp-submenu a[href="users.php?page=wc_paid_listings_packages"]' ).each( function() {
			$( this ).parent().prop( 'outerHTML', '' );
		} );
			
		// If it is a Woocommerce listing package, set Listar package options.
		
		var updatingProductOptions = false;

		function updateProductOptions() {
			if ( ! updatingProductOptions ) {
				updatingProductOptions = true;

				$( '#product-type' ).each( function () {
					if ( 'job_package' === $( this ).val() || 'job_package_subscription' === $( this ).val() ) {
						var packageOptionsData = $( '#listar_meta_box_package_options_field' ).val();

						if ( '' !== packageOptionsData && 'string' === typeof packageOptionsData ) {
							var parsedTerms = JSON.parse( packageOptionsData );

							for( var fieldKey in parsedTerms ) {
								if ( fieldKey.indexOf( 'custom_package_option' ) >= 0 ) {
									if ( fieldKey.indexOf( 'custom_package_option_activation' ) >= 0 || fieldKey.indexOf( 'custom_package_option_display' ) >= 0 || fieldKey.indexOf( 'custom_package_option_required' ) >= 0 ) {
										if ( 'on' === parsedTerms[ fieldKey ] ) {
											$( 'input[name="' + fieldKey + '"]' ).each( function () {
												$( this ).prop( 'checked', true );
											} );
										}
									} else if ( fieldKey.indexOf( 'custom_package_option_icon' ) >= 0 && '0' !== parsedTerms[ fieldKey ] ) {
										$( 'input[name="' + fieldKey + '"]' ).each( function () {
											$( this ).val( parsedTerms[ fieldKey ] );
										} );
									} else if ( fieldKey.indexOf( 'custom_package_option_limit' ) >= 0 && '0' !== parsedTerms[ fieldKey ] ) {
										$( 'input[name="' + fieldKey + '"]' ).each( function () {
											$( this ).val( parsedTerms[ fieldKey ] );
										} );
									}
								}
							}
						}

						$( 'input[name*="custom_package_option_activation"]' ).each( function () {
							if ( $( this ).is( ':checked' ) ) {
								$( this ).parents( 'td' ).next().removeClass( 'listar-visibility-hidden' );
								$( this ).parents( 'td' ).next().next().removeClass( 'listar-visibility-hidden' );

								var nextInput = $( this ).parents( 'td' ).next( 'td' ).next( 'td' ).find( 'input' );

								if ( nextInput.is( ':checked' ) ) {
									nextInput.parents( 'td' ).next( 'td' ).removeClass( 'listar-visibility-hidden' );
								}
							}
						} );

						$( '.listar-enable-package-customization input[type="checkbox"]' ).each( function () {
							if ( $( this ).is( ':checked' ) ) {
								$( this ).parents( 'tr' ).siblings( 'tr' ).removeClass( 'hidden' );
							}
						} );
					}
				} );
				
				setTimeout( function () {
					updatingProductOptions = false;
				}, 200 );
			}
		}
		
		updateProductOptions();
		
		// Append readable titles for custom fields.
			
		var orderedClaimFields = [
			[ 'verification_details'   , listarLocalizeAndAjax.verificationDetails ],
			[ 'listing_id'             , listarLocalizeAndAjax.claimListingID ],
			[ 'listing_permalink'      , '' ],
			[ 'useful_claim_links'     , listarLocalizeAndAjax.usefulClaimLinks ],
			/* SEPARATOR ==========================================================*/
			[ 'new_author_name'       , listarLocalizeAndAjax.newAuthorName ],
			[ 'new_author_nickname'   , listarLocalizeAndAjax.newAuthorNickname ],
			[ 'new_author_email'      , listarLocalizeAndAjax.newAuthorEmail ],
			[ 'new_author_phone'      , listarLocalizeAndAjax.newAuthorPhone ],
			[ 'new_author_website'    , listarLocalizeAndAjax.newAuthorWebsite ],
			[ 'new_author_id'         , listarLocalizeAndAjax.newAuthorID ],
			[ 'new_order_id'          , listarLocalizeAndAjax.newOrderID ],
			[ 'new_package_id'        , listarLocalizeAndAjax.newWoocommerceProductID ],
			[ 'new_user_package_id'   , listarLocalizeAndAjax.newUserPackageID ],
			[ 'new_job_duration'      , listarLocalizeAndAjax.newPackageDuration ],
			[ 'new_job_expires'       , listarLocalizeAndAjax.newPackageExpiration ],
			[ 'new_featured'          , listarLocalizeAndAjax.newFeaturedStatus ],
			[ 'new_job_businessclaim' , listarLocalizeAndAjax.newUserClaimStatus ],
			/* SEPARATOR ==========================================================*/
			[ 'last_author_name'       , listarLocalizeAndAjax.lastAuthorName ],
			[ 'last_author_nickname'   , listarLocalizeAndAjax.lastAuthorNickname ],
			[ 'last_author_email'      , listarLocalizeAndAjax.lastAuthorEmail ],
			[ 'last_author_phone'      , listarLocalizeAndAjax.lastAuthorPhone ],
			[ 'last_author_website'    , listarLocalizeAndAjax.lastAuthorWebsite ],
			[ 'last_author_id'         , listarLocalizeAndAjax.lastAuthorID ],
			[ 'last_order_id'          , listarLocalizeAndAjax.lastOrderID ],
			[ 'last_package_id'        , listarLocalizeAndAjax.lastWoocommerceProductID ],
			[ 'last_user_package_id'   , listarLocalizeAndAjax.lastUserPackageID ],
			[ 'last_job_duration'      , listarLocalizeAndAjax.lastPackageDuration ],
			[ 'last_job_expires'       , listarLocalizeAndAjax.lastPackageExpiration ],
			[ 'last_featured'          , listarLocalizeAndAjax.lastFeaturedStatus ],
			[ 'last_job_businessclaim' , listarLocalizeAndAjax.lastUserClaimStatus ]
		];
		
		for ( var cf = 0; cf < orderedClaimFields.length; cf++ ) {

			$( '#postcustomstuff input[value*="' + orderedClaimFields[ cf ][0] + '"]' ).each( function() {
				var fieldLabel = orderedClaimFields[ cf ][1];
				
				$( this ).parent().find( 'label' ).removeClass( 'screen-reader-text' ).prop( 'innerHTML', fieldLabel );
				
				/* Order the fields */
				
				if ( 0 !== cf ) {
					var fieldContent = $( this ).parent().parent().prop( 'outerHTML' );
					
					$( this ).parent().parent().prop( 'outerHTML', '' );
					
					for ( var g = 1; g < 10; g++ ) {
						if ( $( '#postcustomstuff input[value*="' + orderedClaimFields[ cf - g ][0] + '"]' ).length ) {
							$( '#postcustomstuff input[value*="' + orderedClaimFields[ cf - g ][0] + '"]' ).parent().parent().after( fieldContent );
							break;
						}
					}
				}
				
				/* Rework display for the Verification Details field */

				if ( cf === orderedClaimFields.length - 1 ) {
					var descriptionLabelInput = $( '#postcustomstuff input[value*="' + orderedClaimFields[0][0] + '"]' );

					var firstField = descriptionLabelInput.parents( 'td' ).prop( 'outerHTML' );

					/* Verification Details field */
					descriptionLabelInput.parents( 'td' ).siblings( 'td' ).find( 'textarea' ).attr( 'placeholder', orderedClaimFields[0][1] ).css( { width: 'calc(100% - 20px)', height : '172px', paddingTop : '5px', paddingBottom : '5px' } );
					descriptionLabelInput.parents( 'td' ).siblings( 'td' ).attr( 'colspan', '2' );
					descriptionLabelInput.parents( 'td' ).siblings( 'td label' ).removeClass( 'screen-reader-text' ).prop( 'innerHTML', fieldLabel );
					descriptionLabelInput.parents( '#the-list' ).prepend( '<tr style="display:none;">' + firstField + '</tr>' );
					descriptionLabelInput.parents( 'td' ).prop( 'outerHTML', '' );
					
					/* Append separators */
					var listingIDLabelTR = $( '#postcustomstuff input[value*="listing_id"]' ).parents( 'tr' );
					var lastAuthorNameLabelTR = $( '#postcustomstuff input[value*="last_author_name"]' ).parents( 'tr' );
					
					listingIDLabelTR.after( '<tr><td colspan="2"><div class="listar-custom-fields-separator"></div></td></tr>' );
					lastAuthorNameLabelTR.before( '<tr><td colspan="2"><div class="listar-custom-fields-separator"></div></td></tr>' );
					
					/* Useful links for the claim */
					$( '#postcustomstuff input[value*="useful_claim_links"]' ).each( function () {
						var claimedListingID = $( this ).parents( '#the-list' ).find( 'input[value="listar_meta_box_listing_id"]' ).parents( 'td' ).siblings( 'td' ).find( 'textarea' ).prop( 'innerHTML' );
						var claimedListingPermalink = $( this ).parents( '#the-list' ).find( 'input[value="listar_meta_box_listing_permalink"]' ).parents( 'td' ).siblings( 'td' ).find( 'textarea' ).prop( 'innerHTML' );
						var claimedNewAuthorID = $( this ).parents( '#the-list' ).find( 'input[value="listar_meta_box_new_author_id"]' ).parents( 'td' ).siblings( 'td' ).find( 'textarea' ).prop( 'innerHTML' );
						var claimedLastAuthorID = $( this ).parents( '#the-list' ).find( 'input[value="listar_meta_box_last_author_id"]' ).parents( 'td' ).siblings( 'td' ).find( 'textarea' ).prop( 'innerHTML' );
						var claimedOrderID = $( this ).parents( '#the-list' ).find( 'input[value="listar_meta_box_new_order_id"]' ).parents( 'td' ).siblings( 'td' ).find( 'textarea' ).prop( 'innerHTML' );

						$( this ).parents( 'td' ).siblings( 'td' ).find( 'textarea' ).prop( 'outerHTML', '' );
						$( this ).parents( 'td' ).siblings( 'td' ).append( '<div class="listar-claim-useful-links"></div>' );
						
						if ( undefined !== claimedOrderID && 'undefined' !== claimedOrderID ) {
							$( '.listar-claim-useful-links' )
								.append( '<a target="_blank" class="button" href="' + listarSiteURL + '/wp-admin/post.php?post=' + claimedOrderID + '&action=edit">' + listarLocalizeAndAjax.claimOrder + '</a>' );
						}
						
						if ( undefined !== claimedListingID && 'undefined' !== claimedListingID && undefined !== claimedListingPermalink && 'undefined' !== claimedListingPermalink ) {
							$( '.listar-claim-useful-links' )
								.append( '<a target="_blank" class="button" href="' + listarSiteURL + '/wp-admin/post.php?post=' + claimedListingID + '&action=edit' + '">' + listarLocalizeAndAjax.claimedListingEditor + '</a>' )
								.append( '<a target="_blank" class="button" href="' + claimedListingPermalink + '?preview=true' + '">' + listarLocalizeAndAjax.claimedListingView + '</a>' );
						}
						
						if ( undefined !== claimedNewAuthorID && 'undefined' !== claimedNewAuthorID ) {
							$( '.listar-claim-useful-links' )
								.append( '<a target="_blank" class="button" href="' + listarSiteURL + '/wp-admin/user-edit.php?user_id=' + claimedNewAuthorID + '">' + listarLocalizeAndAjax.claimedNewAuthor + '</a>' );
						}
						
						if ( undefined !== claimedLastAuthorID && 'undefined' !== claimedLastAuthorID ) {
							$( '.listar-claim-useful-links' )
								.append( '<a target="_blank" class="button" href="' + listarSiteURL + '/wp-admin/user-edit.php?user_id=' + claimedLastAuthorID + '">' + listarLocalizeAndAjax.claimedLastAuthor + '</a>' );
						}
						
						$( this ).parents( '#the-list' ).find( 'input[value="listar_meta_box_listing_permalink"]' ).parents( 'tr' ).css( { display : 'none' } );
					} );
				}
			} );
		}
		
		/* START MENU PRICE LIST =====================================*/
				
		function hasPriceListItems() {
			if ( $( '.listar-price-item[data-visibility="true"]' ).length ) {
				$( '.listar-price-builder-items-wrapper' ).addClass( 'listar-builder-has-price-itens' );
			} else {
				$( '.listar-price-builder-items-wrapper' ).removeClass( 'listar-builder-has-price-itens' );
			}
		}



                function verifyUserAvatarImageUpload() {
                        $( '.listar-user-account-avatar-image' ).each( function () {
                                if ( $( this )[0].hasAttribute( 'style' ) ) {
                                        if ( $( this ).attr( 'style' ).indexOf( 'file-upload.png' ) >= 0 || $( this ).attr( 'style' ).indexOf( 'empty-avatar.png' ) >= 0 || $( this ).attr( 'style' ).indexOf( '.gravatar.' ) >= 0 ) {
                                                $( this ).parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-account-avatar-image-button.fa-plus' ).removeClass( 'hidden' );
                                                $( this ).parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-account-avatar-image-button.fa-times' ).addClass( 'hidden' );
                                        } else {
                                                $( this ).parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-account-avatar-image-button.fa-plus' ).addClass( 'hidden' );
                                                $( this ).parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-account-avatar-image-button.fa-times' ).removeClass( 'hidden' );
                                        }                                        
                                } else {
                                        $( this ).attr( 'style', ' ' );
                                }
                        } );

                        setTimeout( function () {
                                isVerifiyingImageUpload = false;
                        }, 50 );
                }

                var isVerifiyingImageUpload = false;
                var fieldDeleteOldImage = false;
                var updateImageField = true;

                verifyUserAvatarImageUpload();

                $( 'body' ).on( 'click', '.listar-user-account-avatar-image, .listar-user-account-avatar-image-add', function ( e ) {
                        e.preventDefault();
                        e.stopPropagation();

                        if ( ! $( this ).parents( '.listar-user-account-avatar-image-wrapper' ).hasClass( 'listar-uploading-image-ajax' ) ) {
                                $( this ).parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-image-upload-field' )[0].click();
                        }
                } );

                $( 'body' ).on( 'click', '.listar-user-account-avatar-image-remove', function ( e ) {
                        e.preventDefault();
                        e.stopPropagation();

                        var confirmExclusion = true;
                        var fileInputField = $( this );

                        if ( fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-upload-file-ajax' ).length ) {
                                confirmExclusion = confirm( listarLocalizeAndAjax.deleteImage );
                        }

                        if ( confirmExclusion ) {                                
                                isVerifiyingImageUpload = true;
                                updateImageField = true;
                                fieldDeleteOldImage = false;

                                if ( fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-image-upload-field' ).hasClass( 'listar-upload-file-ajax' ) ) {
                                        var fieldImageID = 0;
                                        
                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-price-item-image-val-id' ).each( function () {
                                                fieldImageID = $( this ).val();

                                                if ( 'undefined' === typeof fieldImageID || undefined === fieldImageID || 'undefined' === fieldImageID || 'NaN' === fieldImageID || 0 === fieldImageID || '0' === fieldImageID|| '' === fieldImageID  ) {
                                                        fieldImageID = 0;
                                                        fieldDeleteOldImage = false;
                                                } else {
                                                        fieldDeleteOldImage = fieldImageID;
                                                }
                                        } );

                                        if ( false !== fieldDeleteOldImage ) {
                                                var myFormData = new FormData();
                                                myFormData.append( 'action', 'delete' );
                                                myFormData.append( 'delete_image', fieldDeleteOldImage );

                                                fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).addClass( 'listar-uploading-image-ajax' );

                                                $.ajax( {
                                                        url: window.listarAddonsDirectoryURL + '/inc/file-upload-ajax.php',
                                                        type: 'POST',
                                                        processData: false, // important
                                                        contentType: false, // important
                                                        dataType: 'json',
                                                        data: myFormData,
                                                        success: function( jsonData ) {
                                                                fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).removeClass( 'listar-uploading-image-ajax' );
                                                                verifyUserAvatarImageUpload();
                                                        },
                                                        error: function( xhr, ajaxOptions, thrownError ) {
                                                                var hasErrorMessage = false;

                                                                if ( 'string' === typeof xhr.message ) {
                                                                        if ( '' !== xhr.message ) {
                                                                                hasErrorMessage = true;
                                                                                alert( xhr.message );
                                                                        }
                                                                }

                                                                if ( ! hasErrorMessage ) {
                                                                        alert( thrownError );
                                                                }

                                                                fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).removeClass( 'listar-uploading-image-ajax' );
                                                                verifyUserAvatarImageUpload();
                                                        }
                                                } );
                                        }
                                }

                                fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-account-avatar-image' ).css( { 'background-image' : 'url( ' + fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-account-avatar-image' ).attr( 'data-fallback-image' ) + ' )' } );
                                fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-image-upload-field' ).val( '' );
                                fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-price-item-image-val-url' ).val( '' );
                                fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-price-item-image-val-id' ).val( '' );
                                fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-image-upload-field' ).trigger( 'change' );
                                fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-image-upload-field-reset' ).val( 1 ).attr( 'value', 1 );

                                verifyUserAvatarImageUpload();
                        }
                } );

                $( 'body' ).on( 'change', '.listar-user-image-upload-field', function() {
                        var field = $( this );
                        const [file] = field[0].files;
                        updateImageField = true;
                        fieldDeleteOldImage = false;

                        if ( file ) {
                                if ( field.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-image-upload-field' ).hasClass( 'listar-upload-file-ajax' ) ) {
                                        var fieldImageID = 0;
                                        
                                        field.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-price-item-image-val-id' ).each( function () {
                                                fieldImageID = $( this ).val();

                                                if ( 'undefined' === typeof fieldImageID || undefined === fieldImageID || 'undefined' === fieldImageID || 'NaN' === fieldImageID || 0 === fieldImageID || '0' === fieldImageID || '' === fieldImageID ) {
                                                        fieldImageID = 0;
                                                        fieldDeleteOldImage = false;
                                                } else {
                                                        fieldDeleteOldImage = fieldImageID;
                                                }
                                        } );
                                }

                                if ( false !== fieldDeleteOldImage ) {
                                        var tempConfirm = confirm( listarLocalizeAndAjax.deleteEarlierImage );
                                        
                                        if ( tempConfirm ) {
                                                updateImageField = true;
                                        } else {                                                
                                                updateImageField = false;
                                                field.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-image-upload-field' ).val( '' );
                                                return false;
                                        }
                                }

                                if ( updateImageField ) {
                                        field.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-account-avatar-image' ).css( { 'background-image' : 'url( ' + URL.createObjectURL(file) + ' )' } );
                                        field.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-image-upload-field-reset' ).val( 0 ).attr( 'value', 0 );
                                }
                        }

                        verifyUserAvatarImageUpload();
                } );

                $( 'body' ).on( 'change', '.listar-upload-file-ajax', function() {
                        if ( ! isVerifiyingImageUpload && updateImageField ) {                         
                                var fileInputField = $( this );

                                if ( ! fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).hasClass( 'listar-uploading-image-ajax' ) ) {
                                        var fileInput = fileInputField.prop('files')[0];
                                        var myFormData = new FormData();
                                        myFormData.append( 'the_file', fileInput );
                                        myFormData.append( 'extensions_allowed', 'jpg jpeg gif png JPG JPEG GIF PNG' );
                                        myFormData.append( 'type', 'all' );
                                        myFormData.append( 'action', 'upload' );

                                        if ( false !== fieldDeleteOldImage ) {
                                                myFormData.append( 'delete_image', fieldDeleteOldImage );
                                        }

                                        fileInputField.val('');
                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).addClass( 'listar-uploading-image-ajax' );

                                        $.ajax( {
                                                url: window.listarAddonsDirectoryURL + '/inc/file-upload-ajax.php',
                                                type: 'POST',
                                                processData: false, // important
                                                contentType: false, // important
                                                dataType: 'json',
                                                data: myFormData,
                                                success: function( jsonData ) {
                                                        console.log( jsonData.url );
                                                        console.log( jsonData.id );                                        

                                                        if ( 'string' === typeof jsonData.message ) {
                                                                if ( '' !== jsonData.message || 'undefined' === typeof jsonData.url || 'undefined' === typeof jsonData.id ) {
                                                                        alert( jsonData.message );
                                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-account-avatar-image' ).css( { 'background-image' : '' } );
                                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-image-upload-field' ).val( '' );
                                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-price-item-image-val-url' ).val( '' );
                                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-price-item-image-val-id' ).val( '' );
                                                                } else {
                                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-price-item-image-val-url' ).val( jsonData.url );
                                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-price-item-image-val-id' ).val( jsonData.id );
                                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-account-avatar-image' ).css( { 'background-image' : 'url(' + jsonData.url + ')' } );
                                                                }
                                                        }

                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).removeClass( 'listar-uploading-image-ajax' );
                                                        verifyUserAvatarImageUpload();
                                                },
                                                error: function( xhr, ajaxOptions, thrownError ) {
                                                        var hasErrorMessage = false;

                                                        if ( 'string' === typeof xhr.message ) {
                                                                if ( '' !== xhr.message ) {
                                                                        hasErrorMessage = true;
                                                                        alert( xhr.message );
                                                                }
                                                        }

                                                        if ( ! hasErrorMessage ) {
                                                                alert( thrownError );
                                                        }

                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-account-avatar-image' ).css( { 'background-image' : '' } );
                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-user-image-upload-field' ).val( '' );
                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-price-item-image-val-url' ).val( '' );
                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).find( '.listar-price-item-image-val-id' ).val( '' );

                                                        fileInputField.parents( '.listar-user-account-avatar-image-wrapper' ).removeClass( 'listar-uploading-image-ajax' );
                                                        verifyUserAvatarImageUpload();
                                                }
                                        } );
                                }
                        }
                } );

		function createPriceListItem( listItemID, listCategoryID, priceTag, priceTitle, pricePrice, priceDescr, priceLink, priceLabel, priceImageURL, priceImageID ) {
                        var verifiedItemID = false;
                        var verifiedCategoryID = false;

                        if ( ! ( 'string' !== typeof listItemID || undefined === listItemID || 'undefined' === listItemID || 'NaN' === listItemID || '0' === listItemID || '' === listItemID ) ) {
                                if ( listItemID.indexOf( 'price-item-' ) >= 0 ) {
                                        verifiedItemID = true;
                                }
                        }

                        if ( ! ( 'string' !== typeof listCategoryID || undefined === listCategoryID || 'undefined' === listCategoryID || 'NaN' === listCategoryID || '0' === listCategoryID || '' === listCategoryID ) ) {
                                if ( listCategoryID.indexOf( 'price-category-' ) >= 0 ) {
                                        verifiedCategoryID = true;
                                }
                        }

                        var itemID = ! verifiedItemID ? 'price-item-' + ( Math.floor( Math.random() * 999999 ) + 100000 ) : listItemID;
                        var itemCategory = ! verifiedCategoryID ? '' : listCategoryID;
                        var itemTable = '';
                        var itemControls = '';

                        $( '.listar-price-builder-items-wrapper' ).append( '<div class="listar-price-item" id="' + itemID + '" data-category="' + itemCategory + '" data-visibility="false"></div>' );
                        $( '#' + itemID ).append( '<div class="listar-price-list-items-controls"></div>' );

                        itemControls = $( '#' + itemID ).find( '.listar-price-list-items-controls' );

                        itemControls.append( '<div class="listar-price-list-item-control-bottom fa fa-arrow-down"></div>' );
                        itemControls.append( '<div class="listar-price-list-item-control-top fa fa-arrow-up"></div>' );
                        itemControls.append( '<div class="listar-price-list-item-control-left fa fa-arrow-left hidden listar-hidden hidden"></div>' );
                        itemControls.append( '<div class="listar-price-list-item-control-right fa fa-arrow-right hidden listar-hidden hidden"></div>' );
                        itemControls.append( '<div class="listar-price-list-item-control-delete fa fa-times"></div>' );

                        $( '#' + itemID ).append( '<table></table>' );

                        itemTable = $( '#' + itemID + ' table' );

                        var labelsHTML = '<select class="listar-price-item-label-val">';

                        if ( 'string' === typeof listarLocalizeAndAjax.label.info ) {
                                var labelTarget = listarLocalizeAndAjax.label;

                                labelsHTML += '<option value="" default selected class="listar-default-select-option">' + listarLocalizeAndAjax.selectLabel + '</option>';                                

                                for ( var k in labelTarget ){
                                        if ( labelTarget.hasOwnProperty( k ) ) {
                                                labelsHTML += '<option value="' + k + '">' + labelTarget[k] + '</option>';
                                        }
                                }
                        }

                        labelsHTML += '</select>';

                        itemTable.append( '<tr><td class="listar-price-item-image"><div class="listar-user-account-avatar-image-wrapper"><input type="file" class="listar-upload-file-ajax listar-user-image-upload-field hidden"><input type="hidden" class="listar-price-item-image-val-url hidden"><input type="hidden" class="listar-price-item-image-val-id hidden"><div class="listar-user-account-avatar-image-button listar-user-account-avatar-image-add fas fa-plus hidden"></div><div class="listar-user-account-avatar-image-button listar-user-account-avatar-image-remove fas fa-times hidden"></div><div class="listar-user-account-avatar-image" data-fallback-image="' + window.listarThemeURL + '/assets/images/file-upload.png' + '"></div></div></td><td></td></tr>' );
                        itemTable.append( '<tr class="listar-price-item-tag-tr"><td class="listar-price-item-tag"><input type="text" class="listar-price-item-tag-val" placeholder="' + listarLocalizeAndAjax.featuredTag + '"></td><td></td></tr>' );
                        itemTable.append( '<tr><td class="listar-price-item-title"><input type="text" class="listar-price-item-title-val" placeholder="' + listarLocalizeAndAjax.title + '" required="required"></td><td class="listar-price-item-price"><input type="text" class="listar-price-item-price-val" placeholder="' + listarLocalizeAndAjax.price + '"></td></tr>' );
                        itemTable.append( '<tr><td class="listar-price-item-descr" colspan="2"><textarea class="listar-price-item-descr-val" placeholder="' + listarLocalizeAndAjax.description + '"></textarea></td></tr>' );
                        itemTable.append( '<tr><td class="listar-price-item-link"><input type="url" class="listar-price-item-link-val" placeholder="' + listarLocalizeAndAjax.link + '"></td><td class="listar-price-item-label">' + labelsHTML + '</td></tr>' );

                        // If a category is selected.

                        if ( ! verifiedItemID ) {
                                $( '.listar-price-builder-category[data-selected="selected"]' ).each( function () {
                                        $( '#' + itemID ).attr( 'data-category', $( this ).attr( 'id' ) );
                                } );
                        }

                        // Set saved values (coming from JSON).

                        if ( ! ( 'string' !== typeof priceTag || undefined === priceTag || 'undefined' === priceTag || 'NaN' === priceTag || '0' === priceTag || '' === priceTag ) ) {
                                itemTable.find( '.listar-price-item-tag-val' ).val( priceTag );
                        }

                        if ( ! ( 'string' !== typeof priceTitle || undefined === priceTitle || 'undefined' === priceTitle || 'NaN' === priceTitle || '0' === priceTitle || '' === priceTitle ) ) {
                                itemTable.find( '.listar-price-item-title-val' ).val( priceTitle );
                        }

                        if ( ! ( 'string' !== typeof pricePrice || undefined === pricePrice || 'undefined' === pricePrice || 'NaN' === pricePrice || '0' === pricePrice || '' === pricePrice ) ) {
                                itemTable.find( '.listar-price-item-price-val' ).val( pricePrice );
                        }

                        if ( ! ( 'string' !== typeof priceDescr || undefined === priceDescr || 'undefined' === priceDescr || 'NaN' === priceDescr || '0' === priceDescr || '' === priceDescr ) ) {
                                itemTable.find( '.listar-price-item-descr-val' ).val( priceDescr );
                        }

                        if ( ! ( 'string' !== typeof priceLink || undefined === priceLink || 'undefined' === priceLink || 'NaN' === priceLink || '0' === priceLink || '' === priceLink ) ) {
                                itemTable.find( '.listar-price-item-link-val' ).val( priceLink );
                        }

                        if ( ! ( 'string' !== typeof priceImageURL || undefined === priceImageURL || 'undefined' === priceImageURL || 'NaN' === priceImageURL || '0' === priceImageURL || '' === priceImageURL ) ) {
                                itemTable.find( '.listar-price-item-image .listar-user-account-avatar-image' ).css( { 'background-image' : 'url(' + priceImageURL + ')' } );
                                itemTable.find( '.listar-price-item-image-val-url' ).val( priceImageURL );
                        } else {
                                itemTable.find( '.listar-price-item-image .listar-user-account-avatar-image' ).each( function () {
                                        $( this ).css( { 'background-image' : 'url(' + $( this ).attr( 'data-fallback-image' ) + ')' } );
                                } );
                        }

                        if ( ! ( 'string' !== typeof priceImageID || undefined === priceImageID || 'undefined' === priceImageID || 'NaN' === priceImageID || '0' === priceImageID || '' === priceImageID ) ) {
                                itemTable.find( '.listar-price-item-image-val-id' ).val( priceImageID );
                        }

                        if ( ! ( 'string' !== typeof priceLabel || undefined === priceLabel || 'undefined' === priceLabel || 'NaN' === priceLabel || '0' === priceLabel || '' === priceLabel ) ) {
                                itemTable.find( '.listar-price-item-label-val' ).val( priceLabel );
                                itemTable.find( 'option' ).each( function () {
                                        if ( priceLabel === $( this ).attr( 'value' ) ) {
                                                $( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
                                        }
                                } );
                        }

                        priceListCategoryItemsVisibility( itemCategory );

                        verifyUserAvatarImageUpload();

                        return itemID;
                }

		function highlightPriceListCategory( categoryID ) {
			$( '.listar-price-builder-categories-wrapper' ).find( '.listar-price-builder-category' ).attr( 'data-selected', 'not-selected' );

			$( '#' + categoryID ).each( function () {
				$( this ).attr( 'data-selected', 'selected' );
			} );
		}

		function priceListCategoryItemsVisibility( itemCategory ) {

			var categoryVisibility = '';

			if ( undefined !== itemCategory && '' !== itemCategory && 'string' === typeof itemCategory ) {
				categoryVisibility = itemCategory;
			} else {
				categoryVisibility = 'unknown-category';
			}

			if ( ! $( '.listar-price-builder-category' ).length ) {

				// Turn every item visible if no categories found.

				$( '.listar-price-item' ).each( function () {
					$( this ).attr( 'data-visibility', 'true' );
				} );
			} else {

				// Prepare to turn price items visible only for this category.

				$( '.listar-price-item' ).each( function () {
					$( this ).attr( 'data-visibility', 'false' );
				} );
			}

			$( '.listar-price-item[data-category="' + categoryVisibility + '"]' ).each( function () {
				$( this ).attr( 'data-visibility', 'true' );
			} );

			hasPriceListItems();

			return categoryVisibility;
		}

		function createPriceListCategory( listCategoryID, priceCat ) {
			var verifiedCategoryID = false;

			if ( ! ( 'string' !== typeof listCategoryID || undefined === listCategoryID || 'undefined' === listCategoryID || 'NaN' === listCategoryID || '0' === listCategoryID || '' === listCategoryID ) ) {
				if ( listCategoryID.indexOf( 'price-category-' ) >= 0 ) {
					verifiedCategoryID = true;
				}
			}

			var itemID = 'price-category-' + ( Math.floor( Math.random() * 999999 ) + 100000 );
			var itemCategory = ! verifiedCategoryID ? itemID : listCategoryID;

			if ( ! $( '#' + itemCategory ).length ) {

				// Category no exists yet.

				$( '.listar-price-list-add-category' ).before( '<div class="listar-price-builder-category" id="' + itemCategory + '"><div class="listar-price-list-category-delete fa fa-times"></div><input type="text" class="listar-price-builder-category-val" placeholder="' + listarLocalizeAndAjax.category + '" required="required"></div>' );

				// Set saved values (coming from JSON).

				if ( ! ( 'string' !== typeof priceCat || undefined === priceCat || 'undefined' === priceCat || 'NaN' === priceCat || '0' === priceCat || '' === priceCat ) ) {
					$( '#' + itemCategory ).find( 'input' ).val( priceCat );
				}
			}

			if ( 1 === $( '.listar-price-builder-categories-wrapper input' ).length ) {
				$( '.listar-price-item' ).each( function () {
					$( this ).attr( 'data-category', itemCategory );
				} );
			}

			highlightPriceListCategory( itemCategory );

			// Turn price items visible for this category.

			priceListCategoryItemsVisibility( itemCategory );

			return itemCategory;
		}

		$( 'body' ).on( 'click', '.listar-price-list-add-category', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			createPriceListCategory();
		} );

		$( 'body' ).on( 'click', '.listar-price-list-add-item', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var selectedCategory = undefined;

			$( '.listar-price-builder-category[id*="price-category-"][data-selected="selected"]' ).each( function () {
				selectedCategory = $( this ).attr( 'id' );
			} );

			createPriceListItem( undefined, selectedCategory );
		} );

		$( 'body' ).on( 'click', '.listar-price-builder-category-val', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var categoryID = $( this ).parent().attr( 'id' );

			highlightPriceListCategory( categoryID );

			priceListCategoryItemsVisibility( categoryID );
		} );

                $( 'body' ).on( 'change', '.listar-price-item-label-val', function ( e ) {
                        var elem = $( this );

                        setTimeout( function () {
                                var currentVal = elem.val();

                                elem.find( 'option' ).each( function () {
                                        if ( currentVal === $( this ).attr( 'value' ) ) {
                                                $( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
                                        } else {
                                                $( this ).removeAttr( 'selected' ).prop( 'selected', false );
                                        }
                                } );

                        }, 20 );
                } );

		$( 'body' ).on( 'click', '.listar-price-list-item-control-top', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var currentAction = $( this );
			var currentElement = currentAction.parents( '.listar-price-item' );

			currentElement.prevAll( '.listar-price-item[data-visibility="true"]' ).first().each( function () {

				var outerItem = currentElement.clone();

				$( this ).before( outerItem );
				currentElement.prop( 'outerHTML', '' );
			} );
		} );

		$( 'body' ).on( 'click', '.listar-price-list-item-control-bottom', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var currentAction = $( this );
			var currentElement = currentAction.parents( '.listar-price-item' );

			currentElement.nextAll( '.listar-price-item[data-visibility="true"]' ).first().each( function () {
				var outerItem = currentElement.clone();

				$( this ).after( outerItem );
				currentElement.prop( 'outerHTML', '' );
			} );
		} );

		$( 'body' ).on( 'click', '.listar-price-list-item-control-delete', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var confirmExclusion = confirm( listarLocalizeAndAjax.excludeItem );

			if ( confirmExclusion ) {
				$( this ).parents( '.listar-price-item' ).prop( 'outerHTML', '' );
			}
		} );

		$( 'body' ).on( 'change paste keyup', '.listar-price-item-price-val', function ( e ) {
			sanitizePricingFields( $( this ) );
		} );

		$( 'body' ).on( 'change paste keyup', '#listar_manual_featured_regions', function ( e ) {
			sanitizePricingFields( $( this ), false );
		} );

		$( 'body' ).on( 'change paste keyup', '.listar-manual-default-region', function ( e ) {
			sanitizePricingFields( $( this ), false, false );
		} );

		$( 'body' ).on( 'click', '.listar-price-list-category-delete', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var confirmExclusion = confirm( listarLocalizeAndAjax.excludeCategory );

			if ( confirmExclusion ) {
				var priceCategoryID = $( this ).parents( '.listar-price-builder-category' ).attr( 'id' );
				var siblingCatNext = $( this ).parents( '.listar-price-builder-category' ).next( '.listar-price-builder-category' );
				var siblingCat = siblingCatNext.length ? siblingCatNext : $( this ).parents( '.listar-price-builder-category' ).prev( '.listar-price-builder-category' );
				var confirmExclusion2 = $( '.listar-price-item[data-category="' + priceCategoryID + '"]' ).length ? confirm( listarLocalizeAndAjax.excludeItems ) : false;

				$( this ).parents( '.listar-price-builder-category' ).prop( 'outerHTML', '' );

				if ( confirmExclusion2 ) {
					$( '.listar-price-item[data-category="' + priceCategoryID + '"]' ).each( function () {
						$( this ).prop( 'outerHTML', '' );
					} );
				}

				if ( siblingCat.length ) {

					// If not deleted, move items from the deleted category to the sibling category found.

					$( '.listar-price-item[data-category="' + priceCategoryID + '"]' ).each( function () {
						$( this ).attr( 'data-category', siblingCat.attr( 'id' ) );
					} );

					siblingCat.find( 'input' )[0].click();
				} else {

					// No categories remaining.

					$( '.listar-price-item' ).each( function () {
						$( this ).attr( 'data-category', '' );
					} );

					priceListCategoryItemsVisibility();
				}
			}
		} );

		/* Prepare wrapper for menu/catalog price list */
		$( '#_job_business_use_price_list' ).each( function () {
			var
				priceListEnablerFieldset = $( this ).parent(),
				priceListFieldset = $( '#_job_business_price_list_content' ).parent();
				
			priceListFieldset.addClass( 'hidden' );

			var
				priceListOutput = priceListEnablerFieldset.prop( 'outerHTML' ),
				priceListFieldsetContent = priceListFieldset.prop( 'outerHTML' );

			priceListEnablerFieldset.before( '<div class="listar-business-catalog-fields listar-boxed-fields-price-list hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner hidden"></div></div></div>' );

			priceListEnablerFieldset.prop( 'outerHTML', '' );

			$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-wrapper' ).prepend( priceListOutput );

			$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-inner' ).before( '<div class="listar-catalog-files-header"></div>' );
				$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-catalog-files-header' ).append( $( '#_job_business_price_list_content' ).siblings( 'label' ).find( 'span' ).prop( 'outerHTML' ) );

			priceListFieldset.prop( 'outerHTML', '' );

			// Construct the price list builder.

			setTimeout( function () {
				$( '#_job_business_price_list_content' ).parent().each( function () {
					$( this ).before( '<div class="listar-price-list-builder"></div>' );

					var priceBuilder = $( '.listar-price-list-builder' );

					priceBuilder.append( '<div class="listar-price-builder-categories"><div class="listar-price-builder-categories-wrapper"><a href="#" class="listar-price-list-add-category fa fa-plus">' + listarLocalizeAndAjax.category + '</a></div></div>' );
					priceBuilder.append( '<div class="listar-price-builder-items"><div class="listar-price-builder-items-wrapper"></div><a href="#" class="listar-price-list-add-item fa fa-plus">' + listarLocalizeAndAjax.item + '</a></div>' );

					// Read the data saved.
					var savedJSON = $( '#_job_business_price_list_content' ).val();
					var parsedData = tryParseJSON( savedJSON );

					if ( false !== parsedData ) {

						$.each( parsedData, function() {

							//JSONValues += '{"category_id":"' + priceCatID + '","category":"' + priceCat + '","item_id":"' 
							//+ priceItemID + '","tag":"' + priceTag + '","title":"' + priceTitle + '",\n\
							//"price":"' + pricePrice + '","description":"' + priceDescr + '"},';


							var priceCatID  = 'string' === typeof this.category_id ? decodeURIComponent( this.category_id ) : '';
							var priceCat    = 'string' === typeof this.category ? decodeURIComponent( this.category ) : '';
							var priceItemID = 'string' === typeof this.item_id ? decodeURIComponent( this.item_id ) : '';
							var priceTag    = 'string' === typeof this.tag ? decodeURIComponent( this.tag ) : '';
							var priceTitle  = 'string' === typeof this.title ? decodeURIComponent( this.title ) : '';
							var pricePrice  = 'string' === typeof this.price ? decodeURIComponent( this.price ) : '';
							var priceDescr  = 'string' === typeof this.description ? decodeURIComponent( this.description ) : '';
                                                        var priceLink   = 'string' === typeof this.link ? decodeURIComponent( this.link ) : '';
	                                                var priceImageURL  = 'string' === typeof this.imageURL ? decodeURIComponent( this.imageURL ) : '';
	                                                var priceImageID  = 'string' === typeof this.imageID ? decodeURIComponent( this.imageID ) : '';
	                                                var priceLabel  = 'string' === typeof this.label ? decodeURIComponent( this.label ) : '';

	                                                createPriceListItem( priceItemID, priceCatID, priceTag, priceTitle, pricePrice, priceDescr, priceLink, priceLabel, priceImageURL, priceImageID );

							if ( ! ( 'string' !== typeof priceCat || undefined === priceCat || 'undefined' === priceCat || 'NaN' === priceCat || '0' === priceCat || '' === priceCat ) ) {
								createPriceListCategory( priceCatID, priceCat );
							}
						} );
					}

				} );
			}, 500 );

			// Is price list active?

			setTimeout( function () {
				priceListEnablerFieldset = $( '#_job_business_use_price_list' ).parent();

				$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-inner' ).append( priceListFieldsetContent );

				if ( $( '#_job_business_use_price_list' ).is( ':checked' ) ) {
					$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-inner' ).removeClass( 'hidden' );
				}
			}, 100 );
		} );
		
		/* ENDS MENU PRICE LIST ======================================*/
		
		// Hide unwanted Woocommerce Paid Listings notifications.
		
		$( 'a[href*="section=helper#wp-job-manager-wc-paid-listings_row"]' ).each( function () {
			$( this ).parents( '.updated' ).css( { display : 'none' } );
		} );
		
		setTimeout( function () {
			$( '#adv-settings input[value="add-job_listing_category"], #adv-settings input[value="add-job_listing_region"], #adv-settings input[value="add-job_listing_amenity"]' ).each( function () {
				if ( ! $( this ).is( ':checked' ) ) {
					$( this ).parent( 'label' )[0].click();
				}
			} );
		}, 50 );
		
		setInterval( function () {
			if ( $( '#lazy_load' ).is( ':checked' ) ) {
				$( '#lazy_load' ).prop( 'checked', false );
				$( '.sui-button.sui-button-gray.next' )[0].click();
			}
		}, 100 );
		
		$( '#woocommerce_currency_pos' ).each( function() {
			$( this ).parents( 'tr' ).css( { display : 'none' } );
		} );

		convertDataBackgroundImage();

		$( '#scoop' ).each( function () {
			$( this ).css( { opacity: 0 } );
			$( this ).css( { display: 'block' } );
			$( this ).stop().animate( { opacity: 1 }, { duration: 1000 } );
			$( '#loading-options' ).css( { display: 'none' } );
		} );
		
		/* Display/hide recommended appointment URLs */
		toggleCheckboxDependantField( '#listar_recommended_appointment_services_disable', '.listar_recommended_appointment_services', false, true );
		
		$( '#listar_recommended_appointment_services' ).each( function () {
			var fieldLabel = $( this ).parent().siblings( 'th' ).prop( 'innerHTML' );
			var fieldVal = $( this ).val();

			$( this ).addClass( 'hidden' );
			$( this ).after( '<div class="listar-recommended-booking-services"></div>' );
			
			for ( var i = 0; i < 12; i++ ) {
				$( '.listar-recommended-booking-services' ).append( '<p><input type="text" name="listar-appointment-service-' + i + '" placeholder="https://"></input></p>' );
			}
			
			if ( 'string' === typeof fieldVal ) {
				if ( fieldVal.indexOf( '|||||' ) >=0 ) {
					var appointmentURLs = fieldVal.split( '|||||' );
					
					for ( var i = 0; i < appointmentURLs.length; i++ ) {
						$( '.listar-recommended-booking-services input[name="listar-appointment-service-' + i + '"]' ).val( appointmentURLs[ i ] );
					}
				}
			}
			
		} );

		$( '#powered_cache_remove_query_string' ).each( function () {
			$( this ).parents( 'tr' ).prop( 'outerHTML', '' );
		} );

		$( 'input[name="autoptimize_optimize_logged"]' ).each( function () {
			$( this ).parents( 'tr' ).prop( 'outerHTML', '' );
		} );
			
		$( '#_company_featured_listing_category, #_company_featured_listing_region, #_company_business_rich_media_values' ).each( function () {
			$( this ).parents( '.form-field' ).addClass( 'hidden' );
		} );
		
		function featuredListingCategorySelect() {
			var postType = $( 'body' ).hasClass( 'post-type-job_listing' ) ? 'job_listing' : '';
			var currentSelected = false;
			var hasFoundSelected = false;
			
			$( '#_company_featured_listing_category' ).each( function () {
				currentSelected = $( this ).val();
			} );

			if( 'job_listing' === postType ){
				
				setTimeout( function () {
					var selectedCats = [];
						
					var wpDataSelect = 'undefined' !== typeof wp.data ? wp.data : '';
					
					wpDataSelect = '' !== wpDataSelect ? wp.data.select( 'core/editor' ) : null;
						
					if ( null !== wpDataSelect && '' !== wpDataSelect ) {

						// Using Gutenberg editor.

						var selectedCats = wp.data.select( 'core/editor' );
						selectedCats = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'listing_categories' );
					} else {

						// Using Classic editor.

						var classicTax = $( 'input[name*="job_listing_category][]' );

						if ( classicTax.length ) {

							selectedCats = [];

							classicTax.each( function () {
								if ( $( this ).is( ':checked' ) ) {
									selectedCats.push( parseInt( $( this ).val(), 10 ) );
								}
							} );
						}
					}
					
					var selectedCatsAsArray = [];
					var countSelectedCats = 0;
					var allListingCategoriesCounter = 0;
					var listingCategoriesOutput = '';
					var parsedTerms = false;

					$( '.listar-featured-job-categories' ).each( function () {
						$( this ).prop( 'outerHTML', '' );
					} );

					Object.keys( selectedCats ).forEach( function( key ) {
						selectedCatsAsArray.push( selectedCats[key] );
					} );

					//console.log( selectedCatsAsArray );

					parsedTerms = JSON.parse( listarLocalizeAndAjax.allListingCategories );

					///featuredListingCategorySelect( selectedCats );

					/* Getting selected terms for listings and doing things */
					//alert( wp.data.select( 'core/editor' ).getCurrentPostAttribute( 'categories' ) );
					//alert( wp.data.select( 'core/editor' ) );
					//console.log(wp.data.select( 'core/editor' ));

					if ( 'undefined' !== typeof parsedTerms ) {
						allListingCategoriesCounter = parsedTerms.length;
						countSelectedCats = selectedCatsAsArray.length;
					}

					if ( allListingCategoriesCounter && countSelectedCats > 1 ) {

						listingCategoriesOutput = '<p class="form-field listar-featured-job-categories"><label for="_company_excerpt">' + listarLocalizeAndAjax.featuredCategory + ':</label><select id="featured_job_category"></select></p>';
						
						$( '#_company_featured_listing_category' ).each( function () {
							$( this ).parents( '.form-field' ).after( listingCategoriesOutput );
						} );

						for ( var n = 0; n < allListingCategoriesCounter; n++ ) {
							var tempCategory = parsedTerms[ n ];
							//console.log( tempCategory );

							if ( 'number' === typeof tempCategory.id && 'string' === typeof tempCategory.name ) {
								//alert( tempCategory.id );
								$( '#featured_job_category' ).append( '<option value="' + tempCategory.id + '">' + tempCategory.name + '</option>' );
							}
						}

						$( '#featured_job_category option' ).each( function () {
							var testCategoryID = parseInt( $( this ).attr( 'value' ), 10 );

							if ( -1 === selectedCatsAsArray.indexOf( testCategoryID ) ) {
								$( this ).prop( 'outerHTML', '' );
							} else {
								$( this ).removeAttr( 'data-select2-id' ).removeAttr( 'class' );

								if ( currentSelected === $( this ).attr( 'value' ) ) {
									$( '#_company_featured_listing_category' ).val( currentSelected );
									$( '#featured_job_category' ).val( currentSelected );
									$( this ).attr( 'selected', 'selected' );
									
									hasFoundSelected = true;
								} else {
									$( this ).removeAttr( 'selected' );
								}
							}
						} );

						if ( 0 === $( '#featured_job_category option' ).length ) {
							$( '.listar-featured-job-categories' ).prop( 'outerHTML', '' );
						}
										
						if ( ! hasFoundSelected ) {
							$( '#_company_featured_listing_category' ).val( '' );
						}
					} else {
                                                $( '#_company_featured_listing_category' ).val( '' );
                                        }
				}, 100 );
			}
		}
		
		function featuredListingRegionSelect() {
			if ( multipleRegionsActive ) {
				var postType = $( 'body' ).hasClass( 'post-type-job_listing' ) ? 'job_listing' : '';
				var currentSelected = false;
				var hasFoundSelected = false;

				$( '#_company_featured_listing_region' ).each( function () {
					currentSelected = $( this ).val();
				} );

				if( 'job_listing' === postType ){

					setTimeout( function () {
						var selectedRegs = [];
						
						var wpDataSelect = 'undefined' !== typeof wp.data ? wp.data : '';
					
						wpDataSelect = '' !== wpDataSelect ? wp.data.select( 'core/editor' ) : null;

						if ( null !== wpDataSelect && '' !== wpDataSelect ) {
							
							// Using Gutenberg editor.
							
							var selectedRegs = wp.data.select( 'core/editor' );
							selectedRegs = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'listing_regions' );
						} else {
							
							// Using Classic editor.
							
							var classicTax = $( 'input[name*="job_listing_region][]' );
							
							if ( classicTax.length ) {
								
								selectedRegs = [];
								
								classicTax.each( function () {
									if ( $( this ).is( ':checked' ) ) {
										selectedRegs.push( parseInt( $( this ).val(), 10 ) );
									}
								} );
							}
						}
						
						var selectedRegsAsArray = [];
						var countSelectedRegs = 0;
						var allListingRegionsCounter = 0;
						var listingRegionsOutput = '';
						var parsedTerms = false;

						$( '.listar-featured-job-regions' ).each( function () {
							$( this ).prop( 'outerHTML', '' );
						} );

						Object.keys( selectedRegs ).forEach( function( key ) {
							selectedRegsAsArray.push( selectedRegs[key] );
						} );

						//console.log( selectedRegsAsArray );

						parsedTerms = JSON.parse( listarLocalizeAndAjax.allListingRegions );

						///featuredListingRegionSelect( selectedRegs );

						/* Getting selected terms for listings and doing things */
						//alert( wp.data.select( 'core/editor' ).getCurrentPostAttribute( 'regions' ) );
						//alert( wp.data.select( 'core/editor' ) );
						//console.log(wp.data.select( 'core/editor' ));

						if ( 'undefined' !== typeof parsedTerms ) {
							allListingRegionsCounter = parsedTerms.length;
							countSelectedRegs = selectedRegsAsArray.length;
						}

						if ( allListingRegionsCounter && countSelectedRegs > 1 ) {

							listingRegionsOutput = '<p class="form-field listar-featured-job-regions"><label for="_company_excerpt">' + listarLocalizeAndAjax.featuredRegion + ':</label><select id="featured_job_region"></select></p>';

							$( '#_company_featured_listing_region' ).each( function () {
								$( this ).parents( '.form-field' ).after( listingRegionsOutput );
							} );

							for ( var n = 0; n < allListingRegionsCounter; n++ ) {
								var tempRegion = parsedTerms[ n ];
								//console.log( tempRegion );

								if ( 'number' === typeof tempRegion.id && 'string' === typeof tempRegion.name ) {
									//alert( tempRegion.id );
									$( '#featured_job_region' ).append( '<option value="' + tempRegion.id + '">' + tempRegion.name + '</option>' );
								}
							}

							$( '#featured_job_region option' ).each( function () {
								var testRegionID = parseInt( $( this ).attr( 'value' ), 10 );

								if ( -1 === selectedRegsAsArray.indexOf( testRegionID ) ) {
									$( this ).prop( 'outerHTML', '' );
								} else {
									$( this ).removeAttr( 'data-select2-id' ).removeAttr( 'class' );

									if ( currentSelected === $( this ).attr( 'value' ) ) {
										$( '#_company_featured_listing_region' ).val( currentSelected );
										$( '#featured_job_region' ).val( currentSelected );
										$( this ).attr( 'selected', 'selected' );

										hasFoundSelected = true;
									} else {
										$( this ).removeAttr( 'selected' );
									}
								}
							} );

							if ( 0 === $( '#featured_job_region option' ).length ) {
								$( '.listar-featured-job-regions' ).prop( 'outerHTML', '' );
							}

							if ( ! hasFoundSelected ) {
								$( '#_company_featured_listing_region' ).val( '' );
							}
						} else {
                                                        $( '#_company_featured_listing_region' ).val( '' );
                                                }
					}, 100 );
				}
			}
		}
		
		$( 'body' ).on( 'change', '#featured_job_category', function () {
			$( '#_company_featured_listing_category' ).val( $( this ).val() );
		} );
		
		$( 'body' ).on( 'click', '.components-panel__body.is-opened .components-checkbox-control__label, .components-panel__body.is-opened .components-checkbox-control__input, #job_listing_regionchecklist li, #job_listing_categorychecklist li', function () {
			featuredListingCategorySelect();
			featuredListingRegionSelect();
		} );
		
		var blockLoaded = false;
		var blockLoadedInterval = setInterval(function() {
			if ( document.getElementById('post-title-0') || $( 'input#title[name="post_title"]' ).length ) {
				featuredListingCategorySelect();
				blockLoaded = true;
			}

			if ( blockLoaded ) {
			    clearInterval( blockLoadedInterval );
			}
		}, 500);
		
		if ( multipleRegionsActive ) {
			$( 'body' ).on( 'change', '#featured_job_region', function () {
				$( '#_company_featured_listing_region' ).val( $( this ).val() );
			} );

			$( 'body' ).on( 'click', '.components-panel__body.is-opened .components-checkbox-control__label, .components-panel__body.is-opened .components-checkbox-control__input', function () {
				featuredListingRegionSelect();
			} );

			var blockLoaded2 = false;
			var blockLoadedInterval2 = setInterval(function() {
				if ( document.getElementById('post-title-0') || $( 'input#title[name="post_title"]' ).length ) {
					featuredListingRegionSelect();
					blockLoaded2 = true;
				}

				if ( blockLoaded2 ) {
				    clearInterval( blockLoadedInterval2 );
				}
			}, 500);
		}

		$( '#listar_operating_hours_format' ).each( function () {
			if ( '24' === $( this ).val() ) {
				$( '.listar_theme_options_field.listar_operating_hours_suffix' ).css( { display : 'table-row' } );
			} else {
				$( '.listar_theme_options_field.listar_operating_hours_suffix' ).css( { display : 'none' } );
			}
			
			if ( window.location.hash ) {
				var h2 = window.location.hash.replace( /#/g, '' );

				if ( -1 === h2.indexOf( 'directory-config' ) ) {
					$( '.listar_theme_options_field.listar_operating_hours_suffix' ).css( { display : 'none' } );
				}
			}
		} );

		setTimeout( function () {
			var hasPhones = false;

			$( '.wp_job_manager_meta_data #_company_phone, .wp_job_manager_meta_data #_company_fax, .wp_job_manager_meta_data #_company_mobile, .wp_job_manager_meta_data #_company_whatsapp' ).each( function () {
				if ( ! hasPhones ) {
					hasPhones = true;

					var phoneFields = new Array();
					var fieldIndex = 0;

					if ( $( '.wp_job_manager_meta_data #_company_phone' ).length ) {
						phoneFields.push( '#_company_phone' );
					}

					if ( $( '.wp_job_manager_meta_data #_company_fax' ).length ) {
						phoneFields.push( '#_company_fax' );
					}

					if ( $( '.wp_job_manager_meta_data #_company_mobile' ).length ) {
						phoneFields.push( '#_company_mobile' );
					}

					if ( $( '.wp_job_manager_meta_data #_company_whatsapp' ).length ) {
						phoneFields.push( '#_company_whatsapp' );
					}

					for ( fieldIndex = 0; fieldIndex < phoneFields.length; fieldIndex++ ) {
						var inputField = document.querySelector( phoneFields[ fieldIndex ] );
						var myUrlPattern = '.local';
						var siteHostname = window.location.hostname;
						var hostnameHasDot = siteHostname.indexOf( '.' ) >= 0 ? true : false;

						if ( 'localhost' === siteHostname || '127.0.0.1' === siteHostname || siteHostname.indexOf( myUrlPattern ) >= 0 || '' === siteHostname || ! hostnameHasDot ) {
							window.intlTelInput( inputField, {
								initialCountry: listarSiteCountryCode,
								nationalMode: true,
								formatOnDisplay: true,
								autoPlaceholder: 'aggressive',
								preferredCountries: [ listarSiteCountryCode ],
								utilsScript: listarThemeURL + '/assets/lib/intl-tel-input/build/js/utils.js?' + Math.floor( ( Math.random() * 99999999 ) + 1 ) // Just for formatting/placeholders etc.
							} );
						} else {
							const tempJquery = $;

							window.intlTelInput( inputField, {
								initialCountry: 'auto',
								nationalMode: true,
								formatOnDisplay: true,
								autoPlaceholder: 'aggressive',
								preferredCountries: [ listarSiteCountryCode ],
								geoIpLookup: function( callback ) {
									tempJquery.get( 'https://ipinfo.io', function() {}, 'jsonp' ).always( function( resp ) {
									      var countryCode = ( resp && resp.country ) ? resp.country : '';
									      callback( countryCode );
									} );
								},
								utilsScript: listarThemeURL + '/assets/lib/intl-tel-input/build/js/utils.js?' + Math.floor( ( Math.random() * 99999999 ) + 1 ) // Just for formatting/placeholders etc.
							} );
						}
					}
				}
			} );

			if ( $( '#listar_primary_fallback_listing_reference' ).length ) {
				var referenceAdresses = [
					[ '#listar_primary_fallback_listing_reference', $( '#listar_primary_fallback_listing_reference' ).val(), $( 'input[name="listar_primary_fallback_geolocated_lat"]' ).parents( 'tr' ), $( 'input[name="listar_primary_fallback_geolocated_lng"]' ).parents( 'tr' ) ],
					[ '#listar_secondary_fallback_listing_reference', $( '#listar_secondary_fallback_listing_reference' ).val(), $( 'input[name="listar_secondary_fallback_geolocated_lat"]' ).parents( 'tr' ), $( 'input[name="listar_secondary_fallback_geolocated_lng"]' ).parents( 'tr' ) ]
				];

				getGeolocatedData( referenceAdresses );
			}

			if ( $( '.listar-term-location-primary-reference-address' ).length ) {
				var referenceAdresses = [
					[ '.listar-term-location-primary-reference-address', $( '.listar-term-location-primary-reference-address' ).val(), $( '.listar-term-location-primary-reference-latitude' ).parents( 'tr' ), $( '.listar-term-location-primary-reference-longitude' ).parents( 'tr' ) ],
					[ '.listar-term-location-secondary-reference-address', $( '.listar-term-location-secondary-reference-address' ).val(), $( '.listar-term-location-secondary-reference-latitude' ).parents( 'tr' ), $( '.listar-term-location-secondary-reference-longitude' ).parents( 'tr' ) ]
				];

				getGeolocatedData( referenceAdresses );
			}
		}, 1000 );
		
		setTimeout( function () {
			var select2Selectors = $( '.listar-use-select2' );
			
			select2Selectors.each( function () {
				forceSelectSelected( $( this ) );
			} );

			if ( $.isFunction( $.fn.select2 ) ) {
				select2Selectors.select2( {
					minimumResultsForSearch: 3
				} );
				
				$( 'select[name="_job_business_products_label"]' ).each( function () {
					if ( $( this ).siblings( '.select2' ).length ) {
						$( this ).siblings( '.select2' ).prop( 'outerHTML', '' );
						$( this ).select2( 'destroy' );
						$( this ).select2();
					}
				} );
			}
		}, 2000 );

		if ( $( '#submit-job-form' ).length && $( '#job_region' ).length ) {
			if ( '' !== $( '#job_region' ).val() ) {
				$( '#job_region' ).parent().removeClass( 'listar-showing-placeholder' ).addClass( 'listar-hidding-placeholder' );
			} else {
				$( '#job_region' ).parent().addClass( 'listar-showing-placeholder' ).removeClass( 'listar-hidding-placeholder' );
			}
		}
		
		if ( $( '.nav-tab-wrapper .nav-tab' ).length < 6 ) {

			$( '#loco-poinit .loco-paths code' ).each( function () {
				var innerText = $( this ).prop( 'innerHTML' );

				if ( innerText.indexOf( 'languages/loco/' ) >= 0 ) {
					$( this ).parents( 'tr' ).addClass( 'listar-loco-path listar-loco-custom' );
				} else if ( innerText.indexOf( 'languages/themes/' ) >= 0 || innerText.indexOf( 'languages/plugins/' ) >= 0 ) {
					$( this ).parents( 'tr' ).addClass( 'listar-loco-path listar-loco-system' );
				} else {
					$( this ).parents( 'tr' ).addClass( 'listar-loco-path listar-loco-author' );
				}
			} );

			$( '.listar-loco-custom' ).each( function () {			
				var outerHTML = '';
				var parentLoco = $( this ).parent();

				$( this ).find( 'code' ).after( ' <strong>(' + listarLocalizeAndAjax.locoRecommended + ')</strong>' );				

				outerHTML = $( this ).prop( 'outerHTML' );
				
				$( this ).parents( '.loco-paths' ).find( '.compact' ).eq( 0 ).before( outerHTML );
				$( this ).parents( '.loco-paths' ).append( '<tr class="compact listar-more-loco-paths"><td><a href="#">' + listarLocalizeAndAjax.locoMoreOptions + '</a></td></tr>' );
				$( this ).prop( 'outerHTML', '' );
				
				parentLoco.find( '.listar-loco-custom input[type="radio"]' ).prop( 'checked', true );
			} );

			$( 'a[href="themes.php?page=tgmpa-install-plugins"]' ).not( '.wp-not-current-submenu' ).each( function () {
				if ( ! $( 'body' ).hasClass( 'appearance_page_tgmpa-install-plugins' ) ) {
					$( '#toplevel_page_themes-page-tgmpa-install-plugins' ).css( { display : 'block' } );
				}
			} );
		} else {
			$( '.loco-paths .compact' ).addClass( 'listar-unhide' );
		}

		$( '#adminmenu li[id*="wp-themes-listar-docs"] a, #adminmenu li[id*="listar-wordpress-directory-theme"] a' ).each( function () {
			$( this ).attr( 'target', '_blank' );
		} );

		$( '.notice-warning a' ).each( function () {
			if ( $( this )[0].hasAttribute( 'href' ) ) {
				if ( $( this ).attr( 'href' ).indexOf( 'admin.php?page=powered-cache' ) >= 0 ) {
					$( this ).parents( '.notice-warning' ).prop( 'outerHTML', '' );
				}
			}
		} );

		$( '.error h2' ).each( function () {
			if ( $( this ).prop( 'innerHTML' ).indexOf( 'Powered Cache' ) >= 0 ) {
				$( this ).parents( '.error' ).prop( 'outerHTML', '' );
			}
		} );
				
		/* Organize custom location fields fields */
		$( '#_job_location' ).each( function () {
			$( this ).after( '<a href="#" class="listar-location-show-advanced">' + listarLocalizeAndAjax.addressAdvanced + '</a>' );
			$( this ).parents( 'p' ).after( '<div class="listar-custom-location-fields listar-boxed-fields-label-customizer hidden listar-clear-both"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner"></div></div></div><p class="form-field form-field-checkbox hidden"></p>' );

			var
				customLocationField1 = $( '#_job_customlatitude' ).parents( '.form-field' );

			var
				customLocationField2 = customLocationField1.next(),
				customLocationField3 = customLocationField2.next(),
				customLocationField4 = customLocationField3.next();

			var
				customLocationOutput =
					customLocationField1.prop( 'outerHTML' ) +
					customLocationField2.prop( 'outerHTML' ) +
					customLocationField3.prop( 'outerHTML' ) +
					customLocationField4.prop( 'outerHTML' );

			customLocationField1.prop( 'outerHTML', '' );
			customLocationField2.prop( 'outerHTML', '' );
			customLocationField3.prop( 'outerHTML', '' );
			customLocationField4.prop( 'outerHTML', '' );

			$( '.listar-custom-location-fields .listar-boxed-fields-inner' ).append( customLocationOutput );
		} );
				
		/* Advanced fields for listing location */
		setTimeout( function () {
			$( '#_job_locationselector' ).each( function () {
				if ( 'location-custom' === $( this ).val() ) {
					$( '#_job_customlocation' ).parents( '.form-field' ).css( { display : 'block' } );
					$( this ).parents( '.listar-custom-location-fields' ).removeClass( 'listar-remove-last-border' );
				} else {
					$( '#_job_customlocation' ).parents( '.form-field' ).css( { display : 'none' } );
					$( this ).parents( '.listar-custom-location-fields' ).addClass( 'listar-remove-last-border' );
				}
			} );
		}, 500 );

		$( '#adminmenu .toplevel_page_smush div.wp-menu-image.svg' ).each( function () {
			$( this ).attr( 'style', '' );
			$( this ).parents( '#toplevel_page_smush' ).css( { display : 'list-item' } );
		} );

		/* Avoid line breaks */

		$( '#_job_location' ).each( function () {
			if ( 'undefined' !== typeof $( this ).attr( 'value' ) ) {
				$( this ).attr( 'value', $( this ).attr( 'value' ).replace( /( \r\ n| \n| \r\r\n|\n|\r)/gm, ' ' ) );
			} else if ( 'undefined' !== typeof $( this ).prop( 'innerHTML' ) ) {
				$( this ).prop( 'innerHTML', $( this ).prop( 'innerHTML' ).replace( /( \r\ n| \n| \r\r\n|\n|\r)/gm, ' ' ) );
			}
		} );
		
		/* Cancel Smush Limit for 50 images */
		setTimeout( function () {
			$( '#smush-box-bulk .sui-box-body' ).each( function () {
				var thisSmush = $( this );
				setInterval( function () {
					var smushButton = thisSmush.find( '.wp-smush-all.sui-button.wp-smush-started' ).not( '.sui-button-blue' );
					var smushBlueButton = thisSmush.find( '.wp-smush-all.sui-button.sui-button-blue.wp-smush-started' );
					
					if ( smushBlueButton.length ) {
						if ( smushButton.length ) {
							if ( 0 === smushButton.parents( '#bulk-smush-resume-button.sui-hidden' ).length ) {
								smushButton[0].click();
							}
						}
					}
				}, 500 );
			} );
		}, 20000 );
		
		var completedPagespeed = false;
		var modal_loading_pagespeed = $( '<div class="autoptimize-loading listar-clean-cache-loading"></div>' );
		
		function executePagespeedImprovement( action ) {
			var pagespeedIncreaseURL = listarSiteURL + '/wp-content/plugins/listar-addons/inc/improve-pagespeed.php';
			var dumbData = { my_data : '[{"action":"' + action + '"}]' };

			if ( 0 === $( '.autoptimize-loading.listar-clean-cache-loading' ).length ) {
				modal_loading_pagespeed.appendTo( 'body' ).show();
			}
			
			$.ajax( {
				url      : pagespeedIncreaseURL,
				type     : 'POST',
				cache    : false,
				data     : dumbData,
				timeout  : 30000
			} ).done( function ( response ) {
				if ( 'Done' === response ) {
					modal_loading_pagespeed.remove();
					completedPagespeed = true;
				}
			} );

			setTimeout( function () {
				if ( ! completedPagespeed ) {
					executePagespeedImprovement( action );
				}
			}, 30000 );
		}

		$( '#listar_activate_pagespeed' ).each( function () {	
			
			var action = 'disable';
			
			if ( $( this ).is( ':checked' ) ) {
				action = 'enable';
			}
			
			executePagespeedImprovement( action );
		} );

		/* Make certain widget elements sortable (on DOM ready) */

		function makeSortable( element ) {
			if ( element.length > 0 ) {
				element.sortable( {
					connectWith: '.listar-elements-wrapper',
					update: function () {
						var widgetContent = $( this ).parent();
						widgetContent.find( '.elements-json' ).trigger( 'change' );
						updateJSON( widgetContent );
					}
				} );
			}
		}

		makeSortable( $( '.listar-elements-wrapper' ) );

		/* Set certain filds to be hidden on Call to Action widget */

		function checkCallToActionWidget() {
			if ( ! updatingCallToActionWidget ) {
				updatingCallToActionWidget = true;

				setTimeout( function () {
					$( '[id*="_listar_call_to_action"]' ).each( function () {
						$( this ).find( 'select[id*="design"]' ).each( function () {
							var design = $( this ).val();

							if ( 'wavy-badge' === design || 'wavy-badge-bordered' === design || 'circular' === design || 'circular-bordered' === design ) {
								$( this ).parents( '.widget-content' ).find( '.listar-wavy-top-field, .listar-wavy-bottom-field, .listar-horizontal-bg-align-field, .listar-vertical-bg-align-field' ).css( { display : 'none' } );
								$( this ).parents( '.widget-content' ).find( '.listar-badge-animations' ).css( { display : 'block' } );
							} else {
								$( this ).parents( '.widget-content' ).find( '.listar-wavy-top-field, .listar-wavy-bottom-field, .listar-horizontal-bg-align-field, .listar-vertical-bg-align-field' ).css( { display : 'block' } );
								$( this ).parents( '.widget-content' ).find( '.listar-badge-animations' ).css( { display : 'none' } );
							}
						} );
					} );
					updatingCallToActionWidget = false;
				}, 200 );
			}
		}

		$( 'body' ).on( 'change', '[id*="_listar_call_to_action"] select[id*="design"]', function () {
			checkCallToActionWidget();
		} );

		checkCallToActionWidget();

		/* Also, make certain widget elements sortable if the widget be created dynamically */

		$( 'body' ).on( 'DOMSubtreeModified', '.widget-inside', function () {
			$( this ).find( '.listar-elements-wrapper' ).each( function () {
				if ( ! $( this ).hasClass( 'ui-sortable' ) ) {
					makeSortable( $( this ) );
				} else {
					updateJSON( $( this ).parent() );
				}
			} );
			checkCallToActionWidget();
		} );

		/* Apply icon buttons to all icon/image input fields */

		appendIconButtons();

		if ( '' === $( '#titlewrap input' ).attr( 'value' ) ) {
			$( '#_job_useuseremail' ).prop( 'checked', true );
		}

		userIntro = $( '#user-intro-table' ).prop( 'outerHTML' );

		$( '#user-intro-table' ).prop( 'outerHTML', '' );
		$( '.user-description-wrap' ).parent().parent().before( userIntro );
		$( '#user-intro-table' ).css( { display: 'block' } );

		profilePicTR = $( '#profile-pic-table tr' ).prop( 'outerHTML' );

		$( '#profile-pic-table' ).prop( 'outerHTML', '' );
		$( '.user-profile-picture' ).before( profilePicTR );
		$( '.user-profile-picture th' ).prop( 'innerHTML', $( '.user-profile-picture th' ).prop( 'innerHTML' ) + ' (Gravatar)' );

		/* Price range */

		priceRange = $( '#_job_pricerange' );
		priceRangeValue = priceRange.attr( 'value' );

		if ( priceRange.length ) {
			priceRange.after( '<div class="price-range-fields"></div>' );

			$( '.price-range-fields' )
				.append( '<span class="price-range-symbol">' + listarLocalizeAndAjax.wooCurrencySymbol + '</span>' )
				.append( '<input class="price-range-from" type="text" placeholder="15">' )
				.append( '<span class="price-range-separator">~</span>' )
				.append( '<span class="price-range-symbol">' + listarLocalizeAndAjax.wooCurrencySymbol + '</span>' )
				.append( '<input class="price-range-to" type="text" placeholder="45">' );

			/* Check/get saved price range */
			if ( - 1 !== priceRangeValue.indexOf( '/////' ) ) {
				var priceValues = priceRangeValue.split( '/////' );
				if ( 'string' === typeof priceValues[0] && undefined !== priceValues[0] && 'undefined' !== priceValues[0] && 'NaN' !== priceValues[0]  ) {
					$( '.price-range-from' ).val( parseFloat( priceValues[0] ) );
				};

				if ( 'string' === typeof priceValues[1] && undefined !== priceValues[1] && 'undefined' !== priceValues[1] && 'NaN' !== priceValues[1]  ) {
					$( '.price-range-to' ).val( parseFloat( priceValues[1] ) );
				};
			}
		}

		priceAverage = $( '#_job_priceaverage' );

		if ( priceAverage.length ) {
			priceAverage.before( '<span class="price-average-symbol">' + listarLocalizeAndAjax.wooCurrencySymbol + ' </span>' );
		}

		/* Hide SMTP Setting fields */

		$( '#swpsmtp_settings_form' ).each( function () {
			$( '#swpsmtp_from_email, #swpsmtp_reply_to_email, #swpsmtp_force_from_name_replace, #swpsmtp_bcc_email' ).parent().parent().css( { 'display' : 'none' } );
			$( '#swpsmtp_force_from_name_replace' ).parent().parent().siblings( '.description' ).each( function () {
				$( this ).css( { 'display' : 'none' } );
			} );
		} );

		if ( $( 'body' ).hasClass( 'job_listing_page_job-manager-settings' ) ) {
			
			/* Set new tab as initial for WP Job Manger Settings */
			$( 'a[href="#settings-job_listings"]' )[0].click();
			
			/* Hide undesired (or not supported yet) fields from WP Job Manger Settings */
			
			$( '#setting-job_manager_category_filter_type, #setting-job_manager_date_format, #setting-job_manager_google_maps_api_key' ).parent().parent().css( { display: 'none' } );
			$( '#setting-job_manager_hide_filled_positions, #setting-job_manager_hide_expired, #setting-job_manager_enable_types, #setting-job_manager_multi_job_type, #setting-job_manager_regions_filter, #setting-wpjmr_allow_images, #setting-job_manager_enable_regions_filter' ).parent().parent().parent().css( { display: 'none' } );
			$( 'input[name=job_manager_category_filter_type],input[name=job_manager_date_format]' ).parent().parent().parent().parent().css( { display: 'none' } );
                        $( '#setting-job_manager_user_requires_account,#setting-job_manager_enable_registration' ).parent().parent().parent().css( { display: 'none' } );
		}

		/* Change TGMA link after all plugins installed */

		$( '.appearance_page_tgmpa-install-plugins #tgmpa-plugins .colspanchange a' ).each( function () {
			var thisElement = $( this );

			if ( thisElement[0].hasAttribute( 'href' ) ) {
				if ( thisElement.attr( 'href' ).indexOf( 'wp-admin/' ) >= 0 ) {
					var temp = thisElement.attr( 'href' ).split( 'wp-admin/' );

					if ( '' === temp[1] ) {
						thisElement.attr( 'href', thisElement.attr( 'href' ) + '/themes.php?page=one-click-demo-import' );
						thisElement.prop( 'innerHTML', '<strong>' + listarLocalizeAndAjax.goToDemoImportPage + '</strong>' );
					}
				}
			}
		} );

		function hoursFormatReplace( string ) {
			var hoursFormat24Search = [
				'01:00 PM',
				'01:30 PM',
				'02:00 PM',
				'02:30 PM',
				'03:00 PM',
				'03:30 PM',
				'04:00 PM',
				'04:30 PM',
				'05:00 PM',
				'05:30 PM',
				'06:00 PM',
				'06:30 PM',
				'07:00 PM',
				'07:30 PM',
				'08:00 PM',
				'08:30 PM',
				'09:00 PM',
				'09:30 PM',
				'10:00 PM',
				'10:30 PM',
				'11:00 PM',
				'11:30 PM',
				'11:59 PM'
			];

			var hoursFormat24Replace = [
				'13:00',
				'13:30',
				'14:00',
				'14:30',
				'15:00',
				'15:30',
				'16:00',
				'16:30',
				'17:00',
				'17:30',
				'18:00',
				'18:30',
				'19:00',
				'19:30',
				'20:00',
				'20:30',
				'21:00',
				'21:30',
				'22:00',
				'22:30',
				'23:00',
				'23:30',
				'24:00'
			];
			
			if ( '12' === listarLocalizeAndAjax.operatingHoursFormat ) {
				return string;
			}

			for ( var hourIndex = 0; hourIndex < hoursFormat24Search.length; hourIndex++ ) {
				string = string.replace( hoursFormat24Search[ hourIndex ], hoursFormat24Replace[ hourIndex ] );
			}
			
			return string;
		}

		/* Append Business Hours fields */
		$( 'input[name*="_job_business_hours_"]' ).each( function () {
			$( this ).parents( '.form-field' ).addClass( 'fieldset-job_business_hours_hidden' );
		} );

		/* Append Business Hours fields */
		$( 'input[name="_job_business_hours_monday"]' ).each( function () {
			var hoursForm  = '';
			var realOpenCloseValues = [];
			var realValuesFields = $( 'input[id*="_job_business_hours_"]' );

			realValuesFields.each( function () {
				var currentValue = $( this ).val();
				var multipleDayValues = [];

				if ( currentValue.indexOf( '***' ) >= 0 ) {
					var multiple = currentValue.split( '***' );

					for ( var mt = 0; mt < multiple.length; mt++ ) {
						var currentMultipleValue = multiple[ mt ];

						if ( currentMultipleValue.indexOf( '-' ) >= 0 ) {
							var doubleM = currentMultipleValue.split( '-' );
							doubleM[0] = doubleM[0].trim();
							doubleM[1] = doubleM[1].trim();

							multipleDayValues.push( [ doubleM[0], doubleM[1] ] );
						} else {
							multipleDayValues.push( [ '', '' ] );
						}
					}
				} else {
					if ( currentValue.indexOf( '-' ) >= 0 ) {
						var double = currentValue.split( '-' );
						double[0] = double[0].trim();
						double[1] = double[1].trim();

						multipleDayValues.push( [ double[0], double[1] ] );
					} else {
						multipleDayValues.push( [ '', '' ] );
					}
				}

				realOpenCloseValues.push( multipleDayValues );
			} );

			var days = [
				[ 'Monday', listarLocalizeAndAjax.monday ],
				[ 'Tuesday', listarLocalizeAndAjax.tuesday ],
				[ 'Wednesday', listarLocalizeAndAjax.wednesday ],
				[ 'Thursday', listarLocalizeAndAjax.thursday ],
				[ 'Friday', listarLocalizeAndAjax.friday ],
				[ 'Saturday', listarLocalizeAndAjax.saturday ],
				[ 'Sunday', listarLocalizeAndAjax.sunday ]
			];

			var hoursOpen = [
				[ 'Closed', listarLocalizeAndAjax.closed ],
				[ 'Open 24 Hours', listarLocalizeAndAjax.open ],
				[ '00:00 AM', '00:00 AM' ],
				[ '00:30 AM', '00:30 AM' ],
				[ '01:00 AM', '01:00 AM' ],
				[ '01:30 AM', '01:30 AM' ],
				[ '02:00 AM', '02:00 AM' ],
				[ '02:30 AM', '02:30 AM' ],
				[ '03:00 AM', '03:00 AM' ],
				[ '03:30 AM', '03:30 AM' ],
				[ '04:00 AM', '04:00 AM' ],
				[ '04:30 AM', '04:30 AM' ],
				[ '05:00 AM', '05:00 AM' ],
				[ '05:30 AM', '05:30 AM' ],
				[ '06:00 AM', '06:00 AM' ],
				[ '06:30 AM', '06:30 AM' ],
				[ '07:00 AM', '07:00 AM' ],
				[ '07:30 AM', '07:30 AM' ],
				[ '08:00 AM', '08:00 AM' ],
				[ '08:30 AM', '08:30 AM' ],
				[ '09:00 AM', '09:00 AM' ],
				[ '09:30 AM', '09:30 AM' ],
				[ '10:00 AM', '10:00 AM' ],
				[ '10:30 AM', '10:30 AM' ],
				[ '11:00 AM', '11:00 AM' ],
				[ '11:30 AM', '11:30 AM' ],
				[ '12:00 PM', '12:00 PM' ],
				[ '12:30 PM', '12:30 PM' ],
				[ '01:00 PM', '01:00 PM' ],
				[ '01:30 PM', '01:30 PM' ],
				[ '02:00 PM', '02:00 PM' ],
				[ '02:30 PM', '02:30 PM' ],
				[ '03:00 PM', '03:00 PM' ],
				[ '03:30 PM', '03:30 PM' ],
				[ '04:00 PM', '04:00 PM' ],
				[ '04:30 PM', '04:30 PM' ],
				[ '05:00 PM', '05:00 PM' ],
				[ '05:30 PM', '05:30 PM' ],
				[ '06:00 PM', '06:00 PM' ],
				[ '06:30 PM', '06:30 PM' ],
				[ '07:00 PM', '07:00 PM' ],
				[ '07:30 PM', '07:30 PM' ],
				[ '08:00 PM', '08:00 PM' ],
				[ '08:30 PM', '08:30 PM' ],
				[ '09:00 PM', '09:00 PM' ],
				[ '09:30 PM', '09:30 PM' ],
				[ '10:00 PM', '10:00 PM' ],
				[ '10:30 PM', '10:30 PM' ],
				[ '11:00 PM', '11:00 PM' ],
				[ '11:30 PM', '11:30 PM' ],
				[ '11:59 PM', '11:59 PM' ]
			];

			var hoursClose = hoursOpen.slice();

			hoursClose.shift();
			hoursClose.shift();

			$( this ).parent().before( '<p class="listar-clear-both"></p><div class="listar-business-hours-fields hidden"></div>' );

			hoursForm = $( '.listar-business-hours-fields' );
			hoursForm.append( '<fieldset class="fieldset-job_hours fieldset-type-business-hours"></fieldset>' );
			hoursForm.find( 'fieldset' ).append( '<div class="listar-hours-table-wrapper" style="display: block;"><table></table></div>' );

			// Headings.
			hoursForm.find( 'table' ).append( '<thead></thead>' );
			hoursForm.find( 'table thead' ).append( '<th>' + listarLocalizeAndAjax.day + '</th>' );
			hoursForm.find( 'table thead' ).append( '<th>' + listarLocalizeAndAjax.opens + '</th>' );
			hoursForm.find( 'table thead' ).append( '<th>' + listarLocalizeAndAjax.close + '</th>' );

			// Body.
			hoursForm.find( 'table' ).append( '<tbody></tbody>' );

			// Inset customized values on the open/close hours (in case of third part listings import).
			for ( var day = 0; day < days.length; day++ ) {
				currentDay           = days[ day ][1];
				selectedOpenHour     = false;
				selectedCloseHour    = false;

				for ( var mtph = 0; mtph < realOpenCloseValues[ day ].length; mtph++ ) {
					currentRealOpenHour  = realOpenCloseValues[ day ][ mtph ][0];
					currentRealCloseHour = realOpenCloseValues[ day ][ mtph ][1];

					if ( '' !== currentRealOpenHour ) {
						var foundOpenHour = false;
						selectedOpenHour = currentRealOpenHour;

						for ( var hourx = 0; hourx < hoursOpen.length; hourx++ ) {
							if ( hoursOpen[ hourx ].indexOf( selectedOpenHour ) >= 0 ) {
								foundOpenHour = true;
							}
						}

						if ( ! foundOpenHour ) {
							hoursOpen.splice( 2, 0, [ selectedOpenHour, selectedOpenHour ] );
						}
					}

					if ( '' !== currentRealCloseHour ) {
						var foundCloseHour = false;
						selectedCloseHour = currentRealCloseHour;

						for ( var hourY = 0; hourY < hoursClose.length; hourY++ ) {
							if ( hoursClose[ hourY ].indexOf( selectedCloseHour ) >= 0 ) {
								foundCloseHour = true;
							}
						}

						if ( ! foundCloseHour ) {
							hoursClose.splice( 2, 0, [ selectedCloseHour, selectedCloseHour ] );
						}
					}
				}
			}

			for ( var dayX = 0; dayX < days.length; dayX++ ) {						
				currentDay           = days[ dayX ][1];
				currentDayLetter     = days[ dayX ][1].substring(0,1).toUpperCase() ;
				currentDayAbbr       = days[ dayX ][0].substring(0,3).toLowerCase() ;
				selectedOpenHour     = false;
				selectedCloseHour    = false;
				selectedOpenAttr     = '';
				selectedCloseAttr    = '';
				hourOpenPlaceholder  = hoursFormatReplace( '09:00 AM' );
				hourClosePlaceholder = hoursFormatReplace( '05:00 PM' );
				hasMultiPleHoursPerDay = realOpenCloseValues[ dayX ].length > 1 ? true : false;

				if ( 1 === parseInt( listarLocalizeAndAjax.disableAMPM, 10 ) && '24' === listarLocalizeAndAjax.operatingHoursFormat ) {
					hourOpenPlaceholder = hourOpenPlaceholder.replace( ' AM', '' );
				}

				if ( 1 === parseInt( listarLocalizeAndAjax.disableAMPM, 10 ) && '24' === listarLocalizeAndAjax.operatingHoursFormat ) {
					hourClosePlaceholder = hourClosePlaceholder.replace( ' PM', '' );
				}

				hoursForm.find( 'tbody' ).append( '<tr class="listar-business-hours-row-' + currentDayAbbr + '"></tr>' );

				if ( hasMultiPleHoursPerDay ) {
					hoursForm.find( '.listar-business-hours-row-' + currentDayAbbr ).addClass( 'listar-has-multiple-hours' );
				}

				// Day name.
				hoursForm.find( '.listar-business-hours-row-' + currentDayAbbr ).append( '<td class="listar-business-day"><span class="listar-business-day-letter">' + currentDayLetter + '</span><span class="listar-business-day-name">' + currentDay + '</span></td>' );

				// Day open hours row.
				hoursForm.find( '.listar-business-hours-row-' + currentDayAbbr ).append( '<td class="listar-business-start-time-field"><div class="listar-multiple-hours-buttons"><a href="#" class="listar-multiple-hours-minus fa fa-minus" data-toggle="tooltip" data-placement="top" title="' + listarLocalizeAndAjax.multipleHoursMinus + '"></a><a href="#" class="listar-multiple-hours-plus fa fa-plus" data-toggle="tooltip" data-placement="top" title="' + listarLocalizeAndAjax.multipleHoursPlus + '"></a></div><a href="#" class="listar-copy-day-button listar-copy-to-all" data-toggle="tooltip" data-placement="top" title="' + listarLocalizeAndAjax.copyForAll + '"></a></td>' );

				// Day close hours row.
				hoursForm.find( '.listar-business-hours-row-' + currentDayAbbr ).append( '<td class="listar-business-end-time-field"></td>' );

				// Start processing multiple hours per day from here - Open Hours.

				for ( var mtph3 = 0; mtph3 < realOpenCloseValues[ dayX ].length; mtph3++ ) {
					var openHourAttr = '';
					var closeHourAttr = '';

					currentRealOpenHour  = realOpenCloseValues[ dayX ][ mtph3 ][0];
					currentRealCloseHour = realOpenCloseValues[ dayX ][ mtph3 ][1];

					if ( '' !== currentRealOpenHour ) {
						selectedOpenHour = currentRealOpenHour;
					}

					if ( '' !== currentRealCloseHour ) {
						selectedCloseHour = currentRealCloseHour;
					}
							
					if ( false !== selectedOpenHour && '' !== selectedOpenHour && undefined !== selectedOpenHour ) {
						openHourAttr = selectedOpenHour;
					}

					if ( false !== selectedCloseHour && '' !== selectedCloseHour && undefined !== selectedCloseHour ) {
						closeHourAttr = selectedCloseHour;
					}

					// Day open hours - The select.
					hoursForm.find( '.listar-business-hours-row-' + currentDayAbbr + ' .listar-business-start-time-field' ).append( '<span class="listar-business-hour"><select name="job_hours[' + currentDayAbbr + '][' + mtph3 + '][open]" data-multiple-order="' + mtph3 + '" value="' + openHourAttr + '" placeholder="' + hourOpenPlaceholder + '"></span>' );

					// Day close hours - The select.
					hoursForm.find( '.listar-business-hours-row-' + currentDayAbbr + ' .listar-business-end-time-field' ).append( '<span class="listar-business-hour"><select name="job_hours[' + currentDayAbbr + '][' + mtph3 + '][close]" data-multiple-order="' + mtph3 + '" value="' + closeHourAttr + '" placeholder="' + hourClosePlaceholder + '"></span>' );

					for ( var hour = 0; hour < hoursOpen.length; hour++ ) {
						currentHour = hoursOpen[ hour ];
						hourFormatFront = hoursFormatReplace( currentHour[1] );

						if ( false === selectedOpenHour ) {
							selectedOpenHour = hoursFormatReplace( '09:00 AM' );
						}

						if ( currentHour[0] === selectedOpenHour || currentHour[1] === selectedOpenHour ) {
							selectedOpenAttr = ' selected="selected"';
						} else {
							selectedOpenAttr = '';
						}

						hourFormatFront = hourFormatFront.replace( '11:59 PM', '00:00 AM' );
						hourFormatFront = hourFormatFront.replace( '11:59', '00:00' );

						if ( 1 === parseInt( listarLocalizeAndAjax.disableAMPM, 10 ) && '24' === listarLocalizeAndAjax.operatingHoursFormat ) {
							hourFormatFront = hourFormatFront.replace( ' AM', '' );
							hourFormatFront = hourFormatFront.replace( ' PM', '' );
						}

						hoursForm.find( '.listar-business-hours-row-' + currentDayAbbr + ' .listar-business-start-time-field select[data-multiple-order="' + mtph3 + '"]' ).append( '<option value="' + currentHour[1] + '" ' + selectedOpenAttr + '>' + hourFormatFront + '</option>' );
					}

					for ( var hour2 = 0; hour2 < hoursClose.length; hour2++ ) {
						currentHour = hoursClose[ hour2 ];
						hourFormatFront = hoursFormatReplace( currentHour[1] );

						if ( false === selectedCloseHour ) {
							selectedCloseHour = hoursFormatReplace( '05:00 PM' );
						}

						if ( currentHour[0] === selectedCloseHour || currentHour[1] === selectedCloseHour ) {
							selectedCloseAttr = ' selected="selected"';
						} else {
							selectedCloseAttr = '';
						}

						hourFormatFront = hourFormatFront.replace( '11:59 PM', '00:00 AM' );
						hourFormatFront = hourFormatFront.replace( '11:59', '00:00' );

						if ( 1 === parseInt( listarLocalizeAndAjax.disableAMPM, 10 ) && '24' === listarLocalizeAndAjax.operatingHoursFormat ) {
							hourFormatFront = hourFormatFront.replace( ' AM', '' );
							hourFormatFront = hourFormatFront.replace( ' PM', '' );
						}

						hoursForm.find( '.listar-business-hours-row-' + currentDayAbbr + ' .listar-business-end-time-field select[data-multiple-order="' + mtph3 + '"]' ).append( '<option value="' + currentHour[1] + '" ' + selectedCloseAttr + '>' + hourFormatFront + '</option>' );
					}
				}

				// Stop processing multiple hours per day from here - Close Hours.
			}

			setTimeout( function () {
				if ( $( '#_job_business_use_hours' ).is( ':checked' ) ) {
					$( '.listar-business-hours-fields' ).removeClass( 'hidden' );
				}
			}, 300 );

			setTimeout( function () {
				$( '.listar-hours-table-wrapper select[name*=job_hours]' ).each( function () {
					var theSelect = $( this );
					checkOpenHourSelected( theSelect );
				} );
			}, 500 );
		} );

		$( '#product-type' ).each( function () {
			if ( 'job_package' === $( this ).val() || 'job_package_subscription' === $( this ).val() ) {
				$( '#listar_meta_box_package_options' ).css( { display : 'block' } );
			} else {
				$( '#listar_meta_box_package_options' ).css( { display : 'none' } );
			}
		} );

		/*
		 * Init Select2
		 */	
		$( '.listar-business-hours-fields select' ).each( function() {
			var theSelect = $( this );
			var initialSelectedValue = theSelect.attr( 'value' );
			var initialSelectedValue2 = theSelect.val();

			if ( theSelect.parents( '.listar-business-start-time-field' ).length ) {
				if ( '' === initialSelectedValue || '' === initialSelectedValue2 || 'undefined' === typeof( initialSelectedValue ) || 'undefined' === typeof( initialSelectedValue2 ) ) {

					initialSelectedValue = false;

					theSelect.find( 'option[selected="selected"]' ).each( function () {
						initialSelectedValue = $( this ).attr( 'value' );
					} );

					if ( false !== initialSelectedValue ) {
						theSelect.val( initialSelectedValue );
						theSelect.attr( 'value', initialSelectedValue );
					} else {
						theSelect.find( 'option' ).each( function () {
							$( this ).removeAttr( 'selected' ).prop( 'selected', false );

							if ( '09:00 AM' === $( this ).attr( 'value' ) ) {
								$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
							}
						} );

						theSelect.val( '09:00 AM' );
						theSelect.attr( 'value', '09:00 AM' );
					}
				} else {
					theSelect.attr( 'value', theSelect.val() );
				}
			}

			if ( theSelect.parents( '.listar-business-end-time-field' ).length ) {
				if ( ( '00:00 AM' === initialSelectedValue || '' === initialSelectedValue || '' === initialSelectedValue2 || 'undefined' === typeof( initialSelectedValue ) || 'undefined' === typeof( initialSelectedValue2 ) ) ) {

					initialSelectedValue = false;

					theSelect.find( 'option[selected="selected"]' ).each( function () {
						initialSelectedValue = $( this ).attr( 'value' );
					} );

					if ( false !== initialSelectedValue ) {
						theSelect.val( initialSelectedValue );
						theSelect.attr( 'value', initialSelectedValue );
					} else {

						theSelect.find( 'option' ).each( function () {
							$( this ).removeAttr( 'selected' ).prop( 'selected', false );

							if ( '06:00 PM' === $( this ).attr( 'value' ) ) {
								$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
							}
						} );

						theSelect.val( '06:00 PM' );
						theSelect.attr( 'value', '06:00 PM' );
					}
				} else {
					theSelect.attr( 'value', theSelect.val() );
				}
			} 
		} );

		var select2Selectors = $( '.listar-hours-table-wrapper select' );
			
		select2Selectors.each( function () {
			forceSelectSelected( $( this ) );
		} );

		if ( $.isFunction( $.fn.select2 ) ) {

			select2Selectors.select2( {
				minimumResultsForSearch: 3
			} );
		}
		
		setTimeout( function () {

			/* Prepare wrapper for social network fields */
			$( '#_company_facebook' ).each( function () {
				
				$( '#_company_use_social_networks' ).parent().before( '<p></p>' );
				
				$( this ).parent().before( '<div class="listar-business-social-network-fields listar-clear-both hidden"><div class="listar-boxed-fields-wrapper"></div></div>' );

				var
					socialNetwork1  = $( this ).parent(),
					socialNetwork2  = socialNetwork1.next(),
					socialNetwork3  = socialNetwork2.next(),
					socialNetwork4  = socialNetwork3.next(),
					socialNetwork5  = socialNetwork4.next(),
					socialNetwork6  = socialNetwork5.next(),
					socialNetwork7  = socialNetwork6.next(),
					socialNetwork8  = socialNetwork7.next(),
					socialNetwork9  = socialNetwork8.next(),
					socialNetwork10 = socialNetwork9.next(),
					socialNetwork11 = socialNetwork10.next();

				var
					socialOutput =
						socialNetwork1.prop( 'outerHTML' ) +
						socialNetwork2.prop( 'outerHTML' ) +
						socialNetwork3.prop( 'outerHTML' ) +
						socialNetwork4.prop( 'outerHTML' ) +
						socialNetwork5.prop( 'outerHTML' ) +
						socialNetwork6.prop( 'outerHTML' ) +
						socialNetwork7.prop( 'outerHTML' ) +
						socialNetwork8.prop( 'outerHTML' ) +
						socialNetwork9.prop( 'outerHTML' ) +
						socialNetwork10.prop( 'outerHTML' ) +
						socialNetwork11.prop( 'outerHTML' );

				socialNetwork1.prop( 'outerHTML', '' );
				socialNetwork2.prop( 'outerHTML', '' );
				socialNetwork3.prop( 'outerHTML', '' );
				socialNetwork4.prop( 'outerHTML', '' );
				socialNetwork5.prop( 'outerHTML', '' );
				socialNetwork6.prop( 'outerHTML', '' );
				socialNetwork7.prop( 'outerHTML', '' );
				socialNetwork8.prop( 'outerHTML', '' );
				socialNetwork9.prop( 'outerHTML', '' );
				socialNetwork10.prop( 'outerHTML', '' );
				socialNetwork11.prop( 'outerHTML', '' );

				$( '.listar-business-social-network-fields .listar-boxed-fields-wrapper' ).prop( 'innerHTML', socialOutput );

				setTimeout( function () {
					if ( $( '#_company_use_social_networks' ).is( ':checked' ) ) {
						$( '.listar-business-social-network-fields' ).removeClass( 'hidden' );
					}
				}, 300 );
			} );

			/* Prepare wrapper for external links fields */
			$( '#_company_external_link_1' ).each( function () {
				
				$( '#_company_use_external_links' ).parent().before( '<p></p>' );
				
				$( '#_featured' ).parent().wrap( '<div class="listar-clear-both listar-force-whole-line"></div>' );
				
				$( this ).parent().before( '<div class="listar-business-external-link-fields listar-clear-both hidden"><div class="listar-boxed-fields-wrapper"></div></div>' );

				var
					externalLink1  = $( this ).parent(),
					externalLink2  = externalLink1.next(),
					externalLink3  = externalLink2.next(),
					externalLink4  = externalLink3.next(),
					externalLink5  = externalLink4.next(),
					externalLink6  = externalLink5.next(),
					externalLink7  = externalLink6.next(),
					externalLink8  = externalLink7.next(),
					externalLink9  = externalLink8.next(),
					externalLink10 = externalLink9.next(),
					externalLink11 = externalLink10.next(),
					externalLink12 = externalLink11.next();

				var
					externalLinksOutput =
						externalLink1.prop( 'outerHTML' ) +
						externalLink2.prop( 'outerHTML' ) +
						externalLink3.prop( 'outerHTML' ) +
						externalLink4.prop( 'outerHTML' ) +
						externalLink5.prop( 'outerHTML' ) +
						externalLink6.prop( 'outerHTML' ) +
						externalLink7.prop( 'outerHTML' ) +
						externalLink8.prop( 'outerHTML' ) +
						externalLink9.prop( 'outerHTML' ) +
						externalLink10.prop( 'outerHTML' ) +
						externalLink11.prop( 'outerHTML' ) +
						externalLink12.prop( 'outerHTML' );

				externalLink1.prop( 'outerHTML', '' );
				externalLink2.prop( 'outerHTML', '' );
				externalLink3.prop( 'outerHTML', '' );
				externalLink4.prop( 'outerHTML', '' );
				externalLink5.prop( 'outerHTML', '' );
				externalLink6.prop( 'outerHTML', '' );
				externalLink7.prop( 'outerHTML', '' );
				externalLink8.prop( 'outerHTML', '' );
				externalLink9.prop( 'outerHTML', '' );
				externalLink10.prop( 'outerHTML', '' );
				externalLink11.prop( 'outerHTML', '' );
				externalLink12.prop( 'outerHTML', '' );

				$( '.listar-business-external-link-fields .listar-boxed-fields-wrapper' ).prop( 'innerHTML', externalLinksOutput );

				setTimeout( function () {
					if ( $( '#_company_use_external_links' ).is( ':checked' ) ) {
						$( '.listar-business-external-link-fields' ).removeClass( 'hidden' );
					}
				}, 300 );
			} );
			

			/* Prepare wrapper for rich media label customizer */
			$( '#_company_business_rich_media_label' ).each( function () {
				var
					labelSelector = $( this ).parents( '.form-field' ),
					customLabelField = $( '#_company_business_rich_media_custom_label' ).parents( '.form-field' ),
					appendGalleryField = $( '#_company_business_rich_media_append_gallery' ).parents( '.form-field' );

				var
					selectorOutput = labelSelector.prop( 'outerHTML' ),
					customLabelFieldContent = customLabelField.prop( 'outerHTML' ),
					appendGalleryContent = appendGalleryField.prop( 'outerHTML' );
					
				labelSelector.before( '<div class="listar-business-rich-media-fields listar-boxed-fields-label-customizer hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner hidden"></div><div class="listar-boxed-fields-inner-2"></div></div></div>' );

				labelSelector.prop( 'outerHTML', '' );
				
				$( '.listar-business-rich-media-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).prepend( selectorOutput );

				customLabelField.prop( 'outerHTML', '' );
				appendGalleryField.prop( 'outerHTML', '' );

				setTimeout( function () {
					labelSelector = $( '#_company_business_rich_media_label' );

					$( '.listar-business-rich-media-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-inner' ).append( customLabelFieldContent );

					if ( 'custom' === labelSelector.val() ) {
						labelSelector.parents( '.form-field' ).siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
					} else {
						labelSelector.parents( '.form-field' ).siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
					}

					// Append listing gallery to the end.

					$( '.listar-business-rich-media-fields .listar-boxed-fields-inner-2' ).append( appendGalleryContent );

					// Create fieldset dynamic fieldset inputs.

					var nFields = 0;
					var forceShowFields = false;

					var fieldsJSON = $( '#_company_business_rich_media_values' ).val();

					if ( 'string' === typeof fieldsJSON ) {
						if ( fieldsJSON.indexOf( '[' ) >= 0 && fieldsJSON.indexOf( ']' ) >= 0 ) {
							var fieldsArray = JSON.parse( fieldsJSON );

							fieldsArray.forEach(function( entry ) {
								if ( 'string' === typeof entry.code && '' !== entry.code ) {
									nFields += 1;
									richMediaFieldsetAppend( decodeURI( entry.code ) );
								}
							} );
						}
					}

					if ( 0 === nFields ) {

						// Try the deprecated Youtube Video field
						$( '#_company_video' ).each( function () {
							var value = $( this ).val();

							if ( 'string' === typeof value ) {
								if ( value.indexOf( 'youtu' ) >= 0 ) {
									nFields = 1;
									forceShowFields = true;
									richMediaFieldsetAppend( value );
									$( this ).val( '' );
								}
							}
						} );
					}

					if ( 0 === nFields ) {
						richMediaFieldsetAppend();
					}

					// Add Media buttom.
					$( '.listar-business-rich-media-fields .listar-boxed-fields-inner-2' ).after( '<div><a href="#" class="listar-rich-media-add-item fa fa-plus">' + listarLocalizeAndAjax.media + '</a></div>' );

					// Show media fields if Rich Media is active.

					if ( $( '#_company_use_rich_media' ).is( ':checked' ) || forceShowFields ) {
						$( '#_company_use_rich_media' ).prop( 'checked', true );
						$( '.listar-business-rich-media-fields' ).removeClass( 'hidden' );
					} else {
						$( '.listar-business-rich-media-fields' ).addClass( 'hidden' );
					}

				}, 100 );
			} );
			
			/* Prepare wrapper for products label customizer */
			$( '#_job_business_products_label' ).each( function () {
				var
					labelSelector = $( this ).parents( '.form-field' ),
					customLabelField = $( '#_job_business_products_custom_label' ).parents( '.form-field' ),
					productListField = $( '#_job_business_products_list' ).parents( '.form-field' );

				var
					selectorOutput = labelSelector.prop( 'outerHTML' ),
					customLabelFieldContent = customLabelField.prop( 'outerHTML' ),
					productListFieldContent = productListField.prop( 'outerHTML' );

				labelSelector.before( '<div class="listar-business-products-fields listar-boxed-fields-label-customizer hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner hidden"></div></div></div>' );

				labelSelector.prop( 'outerHTML', '' );

				$( '.listar-business-products-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).prepend( selectorOutput );

				customLabelField.prop( 'outerHTML', '' );
				productListField.prop( 'outerHTML', '' );

				setTimeout( function () {
					labelSelector = $( '#_job_business_products_label' );

					$( '.listar-business-products-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-inner' ).append( customLabelFieldContent );
					$( '.listar-business-products-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).append( productListFieldContent );

					if ( $( '#_job_business_use_products' ).is( ':checked' ) ) {
						$( '.listar-business-products-fields.listar-boxed-fields-label-customizer' ).removeClass( 'hidden' );
					}

					if ( 'custom' === labelSelector.val() ) {
						labelSelector.parents( '.form-field' ).siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
					} else {
						labelSelector.parents( '.form-field' ).siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
					}
				}, 100 );
			} );
			
			/* Prepare wrapper for menu/catalog label customizer */
			$( '#_job_business_catalog_label' ).each( function () {
				var
					labelSelector = $( this ).parents( '.form-field' ),
					customLabelField = $( '#_job_business_catalog_custom_label' ).parents( '.form-field' );

				var
					selectorOutput = labelSelector.prop( 'outerHTML' ),
					customLabelFieldContent = customLabelField.prop( 'outerHTML' );

				labelSelector.before( '<div class="listar-business-catalog-fields listar-boxed-fields-label-customizer hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner hidden"></div></div></div>' );

				labelSelector.prop( 'outerHTML', '' );

				$( '.listar-business-catalog-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).prepend( selectorOutput );

				customLabelField.prop( 'outerHTML', '' );

				setTimeout( function () {
					labelSelector = $( '#_job_business_catalog_label' );

					$( '.listar-business-catalog-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-inner' ).append( customLabelFieldContent );

					if ( $( '#_job_business_use_catalog' ).is( ':checked' ) ) {
						$( '.listar-business-catalog-fields.listar-boxed-fields-price-list' ).removeClass( 'hidden' );
						$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload' ).removeClass( 'hidden' );
						$( '.listar-business-catalog-fields.listar-boxed-fields-label-customizer' ).removeClass( 'hidden' );
					}

					if ( $( '#_job_business_use_catalog_documents' ).is( ':checked' ) ) {
						$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-boxed-fields-inner' ).removeClass( 'hidden' );
					}

					if ( $( '#_job_business_use_price_list' ).is( ':checked' ) ) {
						$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-inner' ).removeClass( 'hidden' );
					}

					if ( 'custom' === labelSelector.val() ) {
						labelSelector.parents( '.form-field' ).siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
					} else {
						labelSelector.parents( '.form-field' ).siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
					}
				}, 100 );
			} );
			
			/* Prepare wrapper for Appointment label customizer */
			$( '#_job_business_booking_label' ).each( function () {
				var
					labelSelector = $( this ).parents( '.form-field' ),
					customLabelField = $( '#_job_business_booking_custom_label' ).parents( '.form-field' ),
					methodField      = $( '#_job_business_booking_method' ).parents( '.form-field' ),
					embeddingField   = $( '#_job_business_bookings_third_party_service' ).parents( '.form-field' ),
					
					selectedMethod   = $( '#_job_business_booking_method option[selected]' ),
					descriptionMethodHTML = '<div><label for="job_business_bookings_products_description">' + listarLocalizeAndAjax.hasBookingProducts + '</small></label><div class="field ">' + listarLocalizeAndAjax.hasBookingProductsDescr + '</div></div>';

					selectedMethod = selectedMethod.length ? selectedMethod.attr( 'value' ) : '';

				var
					selectorOutput = labelSelector.prop( 'outerHTML' ),
					customLabelFieldContent = customLabelField.prop( 'outerHTML' ),
					methodFieldContent = methodField.prop( 'outerHTML' ),
					embedingFieldContent = embeddingField.prop( 'outerHTML' );

				labelSelector.before( '<div class="listar-business-booking-fields listar-boxed-fields-label-customizer hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner listar-boxed-fields-inner-custom-label hidden"></div></div></div>' );

				labelSelector.prop( 'outerHTML', '' );

				$( '.listar-business-booking-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).prepend( selectorOutput );

				customLabelField.prop( 'outerHTML', '' );
				embeddingField.prop( 'outerHTML', '' );
				methodField.prop( 'outerHTML', '' );

				setTimeout( function () {
					labelSelector = $( '#_job_business_booking_label' );

					$( '.listar-business-booking-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-inner-custom-label' ).append( customLabelFieldContent );
					
					$( '.listar-business-booking-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).append( methodFieldContent );
					
					if ( listarLocalizeAndAjax.wooBookingsActive ) {
						$( '.listar-business-booking-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).append( '<div class="listar-boxed-fields-inner listar-boxed-fields-booking-method">' + descriptionMethodHTML + '</div>' );
					}
					
					$( '.listar-business-booking-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).append( embedingFieldContent );

					if ( $( '#_job_business_use_booking' ).is( ':checked' ) ) {
						$( '.listar-business-booking-fields' ).removeClass( 'hidden' );
					}

					$( '.listar-boxed-fields-booking-method' ).addClass( 'hidden' );
					$( '#_job_business_bookings_third_party_service' ).parents( '.form-field' ).addClass( 'hidden' );
					

					if ( 'external' === selectedMethod ) {
						$( '.listar-boxed-fields-booking-method' ).addClass( 'hidden' );
						$( '#_job_business_bookings_third_party_service' ).parents( '.form-field' ).removeClass( 'hidden' );
					} else if ( 'booking' === selectedMethod ) {
						$( '#_job_business_bookings_third_party_service' ).parents( '.form-field' ).addClass( 'hidden' );
						$( '.listar-boxed-fields-booking-method' ).removeClass( 'hidden' );
					}

					if ( 'custom' === labelSelector.val() ) {
						labelSelector.parents( '.form-field' ).siblings( '.listar-boxed-fields-inner-custom-label' ).removeClass( 'hidden' );
					} else {
						labelSelector.parents( '.form-field' ).siblings( '.listar-boxed-fields-inner-custom-label' ).addClass( 'hidden' );
					}
				}, 100 );
			} );
			

			/* Prepare wrapper for menu/catalog files */
			setTimeout( function () {
				$( '#_job_business_document_1_title' ).each( function () {
					var
						docsSection1 = $( this ).parents( '.form-field' ),
						checkboxDoc = $( '#_job_business_use_catalog_documents' ).parents( '.form-field' ).prop( 'outerHTML' ),
						menuTitle1  = docsSection1,
						menuFile1   = menuTitle1.next(),
						menuTitle2  = menuFile1.next(),
						menuFile2   = menuTitle2.next(),
						menuTitle3  = menuFile2.next(),
						menuFile3   = menuTitle3.next(),
						menuTitle4  = menuFile3.next(),
						menuFile4   = menuTitle4.next(),
						menuTitle5  = menuFile4.next(),
						menuFile5   = menuTitle5.next(),
						menuTitle6  = menuFile5.next(),
						menuFile6   = menuTitle6.next();

					var
						catalogsOutput =
							menuTitle1.prop( 'outerHTML' ) +
							menuFile1.prop( 'outerHTML' ) +
							menuTitle2.prop( 'outerHTML' ) +
							menuFile2.prop( 'outerHTML' ) +
							menuTitle3.prop( 'outerHTML' ) +
							menuFile3.prop( 'outerHTML' ) +
							menuTitle4.prop( 'outerHTML' ) +
							menuFile4.prop( 'outerHTML' ) +
							menuTitle5.prop( 'outerHTML' ) +
							menuFile5.prop( 'outerHTML' ) +
							menuTitle6.prop( 'outerHTML' ) +
							menuFile6.prop( 'outerHTML' );

					docsSection1.before( '<div class="listar-business-catalog-fields listar-boxed-fields-docs-upload hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner hidden"></div></div></div>' );

					menuTitle1.prop( 'outerHTML', '' );
					menuFile1.prop( 'outerHTML', '' );
					menuTitle2.prop( 'outerHTML', '' );
					menuFile2.prop( 'outerHTML', '' );
					menuTitle3.prop( 'outerHTML', '' );
					menuFile3.prop( 'outerHTML', '' );
					menuTitle4.prop( 'outerHTML', '' );
					menuFile4.prop( 'outerHTML', '' );
					menuTitle5.prop( 'outerHTML', '' );
					menuFile5.prop( 'outerHTML', '' );
					menuTitle6.prop( 'outerHTML', '' );
					menuFile6.prop( 'outerHTML', '' );

					$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-boxed-fields-inner' ).prop( 'innerHTML', catalogsOutput );

					$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-boxed-fields-wrapper' ).prepend( '<div class="listar-catalog-files-header"></div>' );

					$( '#_job_business_use_catalog_documents' ).parents( '.form-field' ).prop( 'outerHTML', '' );
					$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-catalog-files-header' ).before( checkboxDoc );

					setTimeout( function () {
						if ( $( '#_job_business_use_catalog' ).is( ':checked' ) ) {
							$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload' ).removeClass( 'hidden' );
						}

						if ( $( '#_job_business_use_catalog_documents' ).is( ':checked' ) ) {
							$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-boxed-fields-inner' ).removeClass( 'hidden' );
						}
					}, 100 );
				} );

			}, 10 );

			/* Prepare wrapper for menu/catalog files - external */
			setTimeout( function () {
				$( '#_job_business_document_1_title_external' ).each( function () {
					var
						docsSection2 = $( this ).parents( '.form-field' ),
						checkboxDoc = $( '#_job_business_use_catalog_external' ).parents( '.form-field' ),
						menuTitle1  = docsSection2,
						menuFile1   = menuTitle1.next(),
						menuTitle2  = menuFile1.next(),
						menuFile2   = menuTitle2.next(),
						menuTitle3  = menuFile2.next(),
						menuFile3   = menuTitle3.next(),
						menuTitle4  = menuFile3.next(),
						menuFile4   = menuTitle4.next(),
						menuTitle5  = menuFile4.next(),
						menuFile5   = menuTitle5.next(),
						menuTitle6  = menuFile5.next(),
						menuFile6   = menuTitle6.next();

					var
						catalogsOutput =
							menuTitle1.prop( 'outerHTML' ) +
							menuFile1.prop( 'outerHTML' ) +
							menuTitle2.prop( 'outerHTML' ) +
							menuFile2.prop( 'outerHTML' ) +
							menuTitle3.prop( 'outerHTML' ) +
							menuFile3.prop( 'outerHTML' ) +
							menuTitle4.prop( 'outerHTML' ) +
							menuFile4.prop( 'outerHTML' ) +
							menuTitle5.prop( 'outerHTML' ) +
							menuFile5.prop( 'outerHTML' ) +
							menuTitle6.prop( 'outerHTML' ) +
							menuFile6.prop( 'outerHTML' );

					docsSection2.before( '<div class="listar-business-catalog-fields listar-boxed-fields-docs-external hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner hidden"></div></div></div>' );

					menuTitle1.prop( 'outerHTML', '' );
					menuFile1.prop( 'outerHTML', '' );
					menuTitle2.prop( 'outerHTML', '' );
					menuFile2.prop( 'outerHTML', '' );
					menuTitle3.prop( 'outerHTML', '' );
					menuFile3.prop( 'outerHTML', '' );
					menuTitle4.prop( 'outerHTML', '' );
					menuFile4.prop( 'outerHTML', '' );
					menuTitle5.prop( 'outerHTML', '' );
					menuFile5.prop( 'outerHTML', '' );
					menuTitle6.prop( 'outerHTML', '' );
					menuFile6.prop( 'outerHTML', '' );

					$( '.listar-business-catalog-fields.listar-boxed-fields-docs-external .listar-boxed-fields-inner' ).prop( 'innerHTML', catalogsOutput );

					$( '.listar-business-catalog-fields.listar-boxed-fields-docs-external .listar-boxed-fields-wrapper' ).prepend( '<div class="listar-catalog-files-header"></div>' );

					$( '.listar-business-catalog-fields.listar-boxed-fields-docs-external .listar-catalog-files-header' ).before( checkboxDoc );

					setTimeout( function () {
						if ( $( '#_job_business_use_catalog' ).is( ':checked' ) ) {
							$( '.listar-business-catalog-fields.listar-boxed-fields-docs-external' ).removeClass( 'hidden' );
						}

						if ( $( '#_job_business_use_catalog_external' ).is( ':checked' ) ) {
							$( '.listar-business-catalog-fields.listar-boxed-fields-docs-external .listar-boxed-fields-inner' ).removeClass( 'hidden' );
						}
					}, 100 );

				} );
			}, 200 );
		}, 1000 );
		
		setTimeout( function () {
			$( '.tips, .help_tip' ).each( function () {
				$( this ).prop( 'outerHTML', $( this ).prop( 'outerHTML' ) );
			} );
			setTimeout( function () {
				restartWPJobManagerTooltips();
			}, 500 );
		}, 1500 );

		/* Organize order of gallery images on listing editor */

		if ( $( '#gallery_images' ).length ) {
			var gallery = $( '#gallery_images' ).attr( 'value' );

			if ( gallery.indexOf( '=' ) >= 0 ) {
				var galleryIDs = gallery.split( '=' );

				galleryIDs = galleryIDs[1];
				galleryIDs = galleryIDs.replace( ']', '' );

				if ( galleryIDs.indexOf( ',' ) >= 0 ) {
					galleryIDs = galleryIDs.split( ',' );
				} else {
					galleryIDs = [ galleryIDs ];
				}

				if ( galleryIDs.length > 1 ) {
					var
						ordered = '',
						img = '',
						galleryCount = galleryIDs.length;

					for ( var i = 0; i < galleryCount; i++ ) {
						if ( '' !== galleryIDs[ i ] ) {
							img = $( '#gallery-img-' + galleryIDs[ i ] ).prop( 'outerHTML' );
							$( '#gallery-img-' + galleryIDs[ i ] ).prop( 'outerHTML', '' );

							if ( undefined !== img ) {
								ordered += ' ' + img + ' ';
							}
						}
					}

					$( '.gallery-list' ).prop( 'innerHTML', ordered );
				}
			}
		}// End if().

		/* Make 'listar_ajax_infinite_loading' checkbox visibility dependent on 'listar_ajax_pagination' activation */

		if ( $( '#listar_ajax_pagination' ).is( ':checked' ) ) {
			$( '.listar_ajax_infinite_loading' ).removeClass( 'hidden' );
		}

		updateMetaVisibleFields();

		/* Customize Iris Color Picker ********************************/

		/* Customizer color picker (theme color) */

		if ( $( '.wp-color-picker' ).length && $.fn.iris ) {
			$( '.wp-color-picker' ).wpColorPicker();
			$( '.wp-color-picker' ).iris( 'option', 'palettes', [ '#F3315A', '#b11b11', '#84132B', '#543647', '#b23365', '#a640e2', '#a093c3', '#999', '#0CA5B0', '#2F906A', '#009bdd', '#00627e' ] );
		}
		
		/* Equalize WordPress gallery item heights */
		
		setTimeout( function () {
			equalizeWordPressGalleryHeights( $( '.wp-block-gallery' ) );
		}, 1500 );

		$( 'body' ).on( 'change DOMSubtreeModified DOMNodeInserted DOMNodeRemoved', '.wp-block-gallery', function () {
			var gallery = false;
			
			$( '.wp-block-gallery' ).removeClass( 'listar-update-this-gallery' );
			
			if ( $( this ).hasClass( '.wp-block-gallery' ) ) {
				$( this ).addClass( 'listar-update-this-gallery' );
				gallery = $( this );
			} else {
				$( this ).parents( '.wp-block-gallery' ).addClass( 'listar-update-this-gallery' );
				gallery = $( this ).parents( '.wp-block-gallery' );
			}

			if ( ! gallery ) {
				gallery = $( '.wp-block-gallery' );
			}

			equalizeWordPressGalleryHeights( gallery );
		} );

		$( '.block-editor-page' ).on( 'click', '.wp-block-gallery', function () {
			$( '.wp-block-gallery' ).removeClass( 'listar-update-this-gallery' );
			$( this ).addClass( 'listar-update-this-gallery' );
			equalizeWordPressGalleryHeights( $( this ) );
		} );

		$( 'body' ).on( 'change input keyup mouseup click', '.components-range-control__number, .components-range-control__slider', function () {
			var checkSelected = $( '.blocks-gallery-item figure.is-selected' );
			
			$( '.wp-block-gallery' ).removeClass( 'listar-update-this-gallery' );

			if ( checkSelected.length ) {
				checkSelected.parents( '.wp-block-gallery' ).addClass( 'listar-update-this-gallery' );
				equalizeWordPressGalleryHeights( checkSelected.parents( '.wp-block-gallery' ) );
			} else {
				equalizeWordPressGalleryHeights( $( '.wp-block-gallery' ) );
			}
		} );

		$( 'body' ).on( 'click', function () {
			setTimeout( function () {
				var galleryBlocks = $( '.wp-block[data-type="core/gallery"]' );

				if ( galleryBlocks.length ) {
					var galleryToUpdate = galleryBlocks.find( '.wp-block-gallery' );

					if ( galleryToUpdate.length ) {
						$( '.wp-block-gallery' ).removeClass( 'listar-update-this-gallery' );
						galleryToUpdate.addClass( 'listar-update-this-gallery' );
						equalizeWordPressGalleryHeights( galleryToUpdate, true );
					}
				}
			}, 15 );
		} );
		
		/* Update the max width for contents on Gutenberg editor */
		
		setTimeout( function () {
			$( '.alignwide' ).each( function () {
				$( this ).parents( '.wp-block' ).each( function () {
					$( this ).attr( 'data-align', 'wide' );
				} );
			} );

			$( '.alignfull' ).each( function () {
				$( this ).parents( '.wp-block' ).each( function () {
					$( this ).attr( 'data-align', 'full' );
				} );
			} );
		}, 2000 );
		
		setTimeout( function () {
			$( '.alignwide' ).each( function () {
				$( this ).parents( '.wp-block' ).each( function () {
					$( this ).attr( 'data-align', 'wide' );
				} );
			} );

			$( '.alignfull' ).each( function () {
				$( this ).parents( '.wp-block' ).each( function () {
					$( this ).attr( 'data-align', 'full' );
				} );
			} );
		}, 2000 );
		
		$( window ).on( 'resize', function () {
			equalizeWordPressGalleryHeights( $( '.wp-block-gallery' ) );
		} );

		/* Export WordPress options as JSON ***************************/

		/* Theme Options */
		
		var data = {};
		var optionsForm;

		data = {};

		$.fn.serializeObject = function () {
			var
				arrayData,
				objectData;

			arrayData = this.serializeArray();
			objectData = {};

			$.each( arrayData, function () {
				var value;

				if ( null !== this.value && undefined !== this.value ) {
					value = this.value;
				} else {
					value = '';
				}

				if ( null !== objectData[ this.name ] && undefined !== objectData[ this.name ] ) {
					if ( ! objectData[ this.name ].push ) {
						objectData[ this.name ] = [ objectData[ this.name ] ];
					}
					objectData[ this.name ].push( value );
				} else {
					objectData[ this.name ] = value;
				}
			} );

			return objectData;
		};

		data = $( '#settings-form' ).serializeObject();

		$( '.import-export' ).text( JSON.stringify( data ) );

		$( '.do-import-export' ).on( 'click', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
			$( '#settings-form' ).submit();
		} );

		/* General WordPress Options */

		optionsForm = $( '#all-options' );

		if ( optionsForm.length ) {
			var
				optionsObj = {},
				tempText = '',
				keysCount = 0;

			data = $( '#all-options' ).serializeObject();
			$( '#all-options' ).prepend( '<textarea class="listar-wp-options"></textarea>' );

			keysCount = Object.keys( data ).length;

			for ( var n = 0; n < keysCount; n++ ) {
				var
					key = Object.keys( data )[ n ],
					value = data[ Object.keys( data )[ n ] ],
					ignoreAndSkip = 0,
					ignoreKeys,
					ignorePositions;

				tempText += ' ' + key;

				/* Don't export these options */

				ignoreKeys = [];
				ignoreKeys.push( 'listar_import_smaller_images' );
				ignoreKeys.push( '_wpnonce' );
				ignoreKeys.push( 'mc4wp_version' );
				ignoreKeys.push( 'WPLANG' );
				ignoreKeys.push( '_wp_http_referer' );
				ignoreKeys.push( 'page_options' );
				ignoreKeys.push( 'admin_email' );
				ignoreKeys.push( 'auth_key' );
				ignoreKeys.push( 'auth_salt' );
				ignoreKeys.push( 'jetpack_next_sync_time_full-sync-enqueue' );
				ignoreKeys.push( 'logged_in_key' );
				ignoreKeys.push( 'logged_in_salt' );
				ignoreKeys.push( 'nonce_key' );
				ignoreKeys.push( 'nonce_salt' );
				ignoreKeys.push( 'wp-job-manager-listing-labels' );
				ignoreKeys.push( 'wp-job-manager-listing-payments' );
				ignoreKeys.push( 'wp-job-manager-products' );
				ignoreKeys.push( 'wp-job-manager-reviews' );
				ignoreKeys.push( 'woocommerce_version' );
				ignoreKeys.push( 'wc_social_login_version' );
				ignoreKeys.push( 'woocommerce_db_version' );
				ignoreKeys.push( 'woocommerce_email_from_name' );
				ignoreKeys.push( 'woocommerce_email_from_address' );
				ignoreKeys.push( 'woocommerce_email_footer_text' );
				ignoreKeys.push( 'woocommerce_stock_email_recipient' );
				ignoreKeys.push( 'woocommerce_default_country' );
				ignoreKeys.push( 'alm_version' );
				ignoreKeys.push( 'bodhi_svgs_plugin_version' );
				ignoreKeys.push( 'cptp_permalink_checked' );
				ignoreKeys.push( 'admin_email_lifespan' );
				ignoreKeys.push( 'ai1wm_secret_key' );
				ignoreKeys.push( 'cptp_version' );
				ignoreKeys.push( 'db_version' );
				ignoreKeys.push( 'duplicate_post_version' );
				ignoreKeys.push( 'initial_db_version' );
				ignoreKeys.push( 'lwa_version' );
				ignoreKeys.push( 'monsterinsights_current_version' );
				ignoreKeys.push( 'monsterinsights_db_version' );
				ignoreKeys.push( 'monsterinsights_settings_version' );
				ignoreKeys.push( 'nav_menu_roles_db_version' );
				ignoreKeys.push( 'ninja_forms_version' );
				ignoreKeys.push( 'responsive_lightbox_version' );
				ignoreKeys.push( 'responsive_lightbox_activation_date' );
				ignoreKeys.push( 'sgi_ltrav_ver' );
				ignoreKeys.push( 'wcpv_commissions_db_version' );
				ignoreKeys.push( 'wcpv_per_product_shipping_db_version' );
				ignoreKeys.push( 'wcpv_version' );
				ignoreKeys.push( 'wp_all_export_db_version' );
				ignoreKeys.push( 'wp_job_manager_version' );
				ignoreKeys.push( 'wpforms_version' );
				ignoreKeys.push( 'wpjmlp_db_version' );
				ignoreKeys.push( 'stylesheet' );
				ignoreKeys.push( 'aj_version' );
				ignoreKeys.push( 'envato_market_state' );
				ignoreKeys.push( 'recovery_mode_email_last_sent' );
				ignoreKeys.push( 'siteurl' );
				ignoreKeys.push( 'wp-smush-version' );
				ignoreKeys.push( 'woocommerce_admin_install_timestamp' );
				ignoreKeys.push( 'woocommerce_admin_version' );

				/* New */
				ignoreKeys.push( 'action' );
				ignoreKeys.push( 'option_page' );
				ignoreKeys.push( 'blog_public' );
				ignoreKeys.push( 'link_manager_enabled' );
				ignoreKeys.push( 'site_url' );
				ignoreKeys.push( 'start_of_week' );
				ignoreKeys.push( 'template' );
				ignoreKeys.push( 'wc_ppec_version' );
				ignoreKeys.push( 'wc_stripe_version' );
				ignoreKeys.push( 'woocommerce_checkout_privacy_policy_text' );
				ignoreKeys.push( '_amn_mi-lite_last_checked' );
				ignoreKeys.push( '_amn_om_last_checked' );
				ignoreKeys.push( '_amn_wpforms-lite_last_checked' );
				ignoreKeys.push( 'allow_major_auto_core_updates' );
				ignoreKeys.push( 'allow_minor_auto_core_updates' );
				ignoreKeys.push( 'auto_update_plugin' );
				ignoreKeys.push( 'auto_update_theme' );
				ignoreKeys.push( 'auto_update_translation' );
				ignoreKeys.push( 'blacklist_keys' );
				ignoreKeys.push( 'blog_charset' );
				ignoreKeys.push( 'can_compress_scripts' );
				ignoreKeys.push( 'close_comments_days_old' );
				ignoreKeys.push( 'comment_max_links' );
				ignoreKeys.push( 'comment_whitelist' );
				ignoreKeys.push( 'comments_notify' );
				ignoreKeys.push( 'comments_per_page' );
				ignoreKeys.push( 'current_theme' );
				ignoreKeys.push( 'default_category' );
				ignoreKeys.push( 'default_email_category' );
				ignoreKeys.push( 'default_post_format' );
				ignoreKeys.push( 'default_product_cat' );
				ignoreKeys.push( 'do_activate' );
				ignoreKeys.push( 'duplicate_post_blacklist' );
				ignoreKeys.push( 'duplicate_post_copyattachments' );
				ignoreKeys.push( 'duplicate_post_copyauthor' );
				ignoreKeys.push( 'duplicate_post_copychildren' );
				ignoreKeys.push( 'duplicate_post_copycomments' );
				ignoreKeys.push( 'duplicate_post_copycontent' );
				ignoreKeys.push( 'duplicate_post_copydate' );
				ignoreKeys.push( 'duplicate_post_copyexcerpt' );
				ignoreKeys.push( 'duplicate_post_copyformat' );
				ignoreKeys.push( 'duplicate_post_copymenuorder' );
				ignoreKeys.push( 'duplicate_post_copypassword' );
				ignoreKeys.push( 'duplicate_post_copyslug' );
				ignoreKeys.push( 'duplicate_post_copystatus' );
				ignoreKeys.push( 'duplicate_post_copytemplate' );
				ignoreKeys.push( 'duplicate_post_copythumbnail' );
				ignoreKeys.push( 'duplicate_post_copytitle' );
				ignoreKeys.push( 'duplicate_post_increase_menu_order_by' );
				ignoreKeys.push( 'duplicate_post_show_adminbar' );
				ignoreKeys.push( 'duplicate_post_show_bulkactions' );
				ignoreKeys.push( 'duplicate_post_show_notice' );
				ignoreKeys.push( 'duplicate_post_show_row' );
				ignoreKeys.push( 'duplicate_post_show_submitbox' );
				ignoreKeys.push( 'duplicate_post_taxonomies_blacklist' );
				ignoreKeys.push( 'duplicate_post_title_prefix' );
				ignoreKeys.push( 'duplicate_post_title_suffix' );
				ignoreKeys.push( 'endurance_cache_level' );
				ignoreKeys.push( 'finished_splitting_shared_terms' );
				ignoreKeys.push( 'fresh_site' );
				ignoreKeys.push( 'gmt_offset' );
				ignoreKeys.push( 'hack_file' );
				ignoreKeys.push( 'home' );
				ignoreKeys.push( 'html_type' );
				ignoreKeys.push( 'image_default_align' );
				ignoreKeys.push( 'image_default_link_type' );
				ignoreKeys.push( 'image_default_size' );
				ignoreKeys.push( 'jmcsg_region_code' );
				ignoreKeys.push( 'job_manager_google_maps_api_key' );
				ignoreKeys.push( 'job_manager_allowed_application_method' );
				ignoreKeys.push( 'job_manager_delete_data_on_uninstall' );
				ignoreKeys.push( 'jpsq_sync_checkout' );
				ignoreKeys.push( 'listar_custom_main_stylesheet' );
				ignoreKeys.push( 'listar_custom_main_stylesheet_rgb' );
				ignoreKeys.push( 'listar_dynamic_main_stylesheet' );
				ignoreKeys.push( 'listar_dynamic_main_stylesheet_rgb' );
				ignoreKeys.push( 'listar_dynamic_stylesheet_file' );
				ignoreKeys.push( 'listar_dynamic_stylesheet_rgb' );
				ignoreKeys.push( 'listar_seo_description' );
				ignoreKeys.push( 'listar_seo_keywords' );
				ignoreKeys.push( 'listar_theme_install_complete' );
				ignoreKeys.push( 'mailserver_login' );
				ignoreKeys.push( 'mailserver_pass' );
				ignoreKeys.push( 'mailserver_port' );
				ignoreKeys.push( 'mailserver_url' );
				ignoreKeys.push( 'mm_coming_soon' );
				ignoreKeys.push( 'mm_install_date' );
				ignoreKeys.push( 'mm_master_aff' );
				ignoreKeys.push( 'moderation_keys' );
				ignoreKeys.push( 'moderation_notify' );
				ignoreKeys.push( 'monsterinsights_shareasale_id' );
				ignoreKeys.push( 'new_admin_email' );
				ignoreKeys.push( 'optinmonster_trial_id' );
				ignoreKeys.push( 'posts_per_rss' );
				ignoreKeys.push( 'rss_use_excerpt' );
				ignoreKeys.push( 'site_icon' );
				ignoreKeys.push( 'tag_base' );
				ignoreKeys.push( 'theme_switched' );
				ignoreKeys.push( 'upload_path' );
				ignoreKeys.push( 'upload_url_path' );
				ignoreKeys.push( 'use_balanceTags' );
				ignoreKeys.push( 'use_smilies' );
				ignoreKeys.push( 'use_trackback' );
				ignoreKeys.push( 'db_upgraded' );
				ignoreKeys.push( 'woocommerce_all_except_countries' );
				ignoreKeys.push( 'woocommerce_allowed_countries' );
				ignoreKeys.push( 'woocommerce_calc_discounts_sequentially' );
				ignoreKeys.push( 'woocommerce_calc_taxes' );
				ignoreKeys.push( 'woocommerce_category_archive_display' );
				ignoreKeys.push( 'woocommerce_checkout_order_received_endpoint' );
				ignoreKeys.push( 'woocommerce_checkout_pay_endpoint' );
				ignoreKeys.push( 'woocommerce_demo_store_notice' );
				ignoreKeys.push( 'woocommerce_downloads_grant_access_after_payment' );
				ignoreKeys.push( 'woocommerce_downloads_require_login' );
				ignoreKeys.push( 'woocommerce_email_background_color' );
				ignoreKeys.push( 'woocommerce_email_base_color' );
				ignoreKeys.push( 'woocommerce_email_body_background_color' );
				ignoreKeys.push( 'woocommerce_email_header_image' );
				ignoreKeys.push( 'woocommerce_email_text_color' );
				ignoreKeys.push( 'woocommerce_enable_review_rating' );
				ignoreKeys.push( 'woocommerce_enable_reviews' );
				ignoreKeys.push( 'woocommerce_enable_shipping_calc' );
				ignoreKeys.push( 'woocommerce_enable_signup_and_login_from_checkout' );
				ignoreKeys.push( 'woocommerce_erasure_request_removes_download_data' );
				ignoreKeys.push( 'woocommerce_erasure_request_removes_order_data' );
				ignoreKeys.push( 'woocommerce_file_download_method' );
				ignoreKeys.push( 'woocommerce_force_ssl_checkout' );
				ignoreKeys.push( 'woocommerce_hide_out_of_stock_items' );
				ignoreKeys.push( 'woocommerce_hold_stock_minutes' );
				ignoreKeys.push( 'woocommerce_logout_endpoint' );
				ignoreKeys.push( 'woocommerce_manage_stock' );
				ignoreKeys.push( 'woocommerce_maybe_regenerate_images_hash' );
				ignoreKeys.push( 'woocommerce_myaccount_add_payment_method_endpoint' );
				ignoreKeys.push( 'woocommerce_myaccount_delete_payment_method_endpoint' );
				ignoreKeys.push( 'woocommerce_myaccount_downloads_endpoint' );
				ignoreKeys.push( 'woocommerce_myaccount_edit_account_endpoint' );
				ignoreKeys.push( 'woocommerce_myaccount_edit_address_endpoint' );
				ignoreKeys.push( 'woocommerce_myaccount_lost_password_endpoint' );
				ignoreKeys.push( 'woocommerce_myaccount_orders_endpoint' );
				ignoreKeys.push( 'woocommerce_myaccount_payment_methods_endpoint' );
				ignoreKeys.push( 'woocommerce_myaccount_set_default_payment_method_endpoint' );
				ignoreKeys.push( 'woocommerce_myaccount_view_order_endpoint' );
				ignoreKeys.push( 'woocommerce_notify_low_stock' );
				ignoreKeys.push( 'woocommerce_notify_low_stock_amount' );
				ignoreKeys.push( 'woocommerce_notify_no_stock' );
				ignoreKeys.push( 'woocommerce_notify_no_stock_amount' );
				ignoreKeys.push( 'woocommerce_prices_include_tax' );
				ignoreKeys.push( 'woocommerce_queue_flush_rewrite_rules' );
				ignoreKeys.push( 'woocommerce_registration_generate_password' );
				ignoreKeys.push( 'woocommerce_registration_generate_username' );
				ignoreKeys.push( 'woocommerce_registration_privacy_policy_text' );
				ignoreKeys.push( 'woocommerce_review_rating_required' );
				ignoreKeys.push( 'woocommerce_review_rating_verification_label' );
				ignoreKeys.push( 'woocommerce_review_rating_verification_required' );
				ignoreKeys.push( 'woocommerce_ship_to_countries' );
				ignoreKeys.push( 'woocommerce_ship_to_destination' );
				ignoreKeys.push( 'woocommerce_shipping_cost_requires_address' );
				ignoreKeys.push( 'woocommerce_shipping_debug_mode' );
				ignoreKeys.push( 'woocommerce_shipping_tax_class' );
				ignoreKeys.push( 'woocommerce_specific_allowed_countries' );
				ignoreKeys.push( 'woocommerce_specific_ship_to_countries' );
				ignoreKeys.push( 'woocommerce_stock_format' );
				ignoreKeys.push( 'woocommerce_store_address_2' );
				ignoreKeys.push( 'woocommerce_tax_based_on' );
				ignoreKeys.push( 'woocommerce_tax_classes' );
				ignoreKeys.push( 'woocommerce_tax_display_cart' );
				ignoreKeys.push( 'woocommerce_tax_display_shop' );
				ignoreKeys.push( 'woocommerce_tax_round_at_subtotal' );
				ignoreKeys.push( 'woocommerce_tax_total_display' );
				ignoreKeys.push( 'woocommerce_trash_cancelled_orders' );
				ignoreKeys.push( 'woocommerce_trash_failed_orders' );
				ignoreKeys.push( 'woocommerce_trash_pending_orders' );
				ignoreKeys.push( 'woocommerce_unforce_ssl_checkout' );
				ignoreKeys.push( 'woocommerce_weight_unit' );
				ignoreKeys.push( 'wp_page_for_privacy_policy' );
				ignoreKeys.push( 'wp-smush-install-type' );

				/* Don't export options if key contain any of these strings/prefix */

				ignorePositions = [];
				ignorePositions.push( 'smtp_' );
				ignorePositions.push( 'aj_' );
				ignorePositions.push( '_version' );
				ignorePositions.push( 'transient' );
				ignorePositions.push( 'plugin_key' );
				ignorePositions.push( 'google_maps_api' );
				ignorePositions.push( 'duplicator_' );
				ignorePositions.push( 'sbi_' );
				ignorePositions.push( 'auto_update' );
				ignorePositions.push( 'api_key' );
				ignorePositions.push( 'action_' );
				ignorePositions.push( 'autoptimize_' );
				ignorePositions.push( 'schema-ActionScheduler' );

				/* Check exact option key names, ignore if found */

				if ( - 1 === $.inArray( key, ignoreKeys ) ) {
					var ignorePositionsCount = ignorePositions.length;

					/* Make sure that the key name don't contain certain strings/prefix */
					for ( var p = 0; p < ignorePositionsCount; p++ ) {
						if ( key.indexOf( ignorePositions[ p ] ) >= 0 ) {
							ignoreAndSkip = 1;
							break;
						}
					}
				} else {
					ignoreAndSkip = 1;
				}

				if ( 1 === ignoreAndSkip ) {
					ignoreAndSkip = 0;
					continue;
				}

				/* If not skiped, the key is OK to export */

				optionsObj[ key ] = value;
			}// End for().

			$( '.listar-wp-options' ).text( JSON.stringify( optionsObj ) );
		}// End if().

		/* General events *********************************************/
		
		$( 'body' ).on( 'click', '.listar-rich-media-add-item', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			richMediaFieldsetAppend();
		} );

		/* Admin Theme Options menu */
		$( '.scoop-navbar a' ).on( 'click', function ( e ) {
			var
				device = $( '#scoop' ).attr( 'scoop-device-type' ),
				menuItem = $( this ).attr( 'data-id' );
			
			if ( 'undefined' !== typeof menuItem ) {
				e.preventDefault();
				e.stopPropagation();

				$( '#scoop' ).find( 'li' ).removeClass( 'active' );
				$( this ).parent().addClass( 'active' );

				window.location.hash = menuItem;

				$( '.listar_theme_options_field' ).css( { display: 'none' } );
				$( '.' + menuItem ).css( { display: '' } );
				
				$( "html" ).animate( {
					scrollTop: $( ".scoop-header" ).offset().top - 30
				}, 400 );

				if ( 'phone' === device ) {
					$( 'body, .scoop-overlay-box' ).trigger( 'click' );
				} else if ( ! $( this ).parent().hasClass( 'scoop-hasmenu' ) ) {
					if ( 'tablet' === device ) {
						$( '.scoop-overlay-box' ).trigger( 'click' );
					} else {
						$( 'body' ).trigger( 'click' );
					}
				}

				if ( $( this ).parent().hasClass( 'scoop-hasmenu' ) ) {
					$( this ).siblings( 'ul' ).find( 'a' ).each( function () {
						menuItem = $( this ).attr( 'data-id' );
						$( '.' + menuItem ).css( { display: '' } );
					} );
				}
				
				$( '#listar_operating_hours_format' ).trigger( 'change' );
			} else {
				var currentlyActive = $( '.scoop-navbar li.active' );
				
				setTimeout( function () {
					$( '.scoop-navbar li' ).removeClass( 'active' );
					currentlyActive.addClass( 'active' );
				}, 20 );
			}
		} );

		/* Font icon selector (tickbox) */

		currentIconField = '';
		
		var saveIconized = '';
		var allFontsProcessed = false;

		$( 'body' ).on( 'click', '.choose-icon', function () {
			var fieldNameSelector = 'input[name^="' + $( this ).attr( 'data-icon-field' ) + '"]';
			currentIconField = $( this ).siblings( fieldNameSelector );
			
			setTimeout( function () {
				if ( $( '#TB_ajaxContent' ).length > 0 ) {
					$( '#TB_window' ).addClass( 'choose-iconized-font listar-loading-icons' );

					setTimeout( function () {
						$( '#TB_ajaxContent' ).append( '<div class="iconized-fonts-wrapper"></div>' );
						$( '#TB_ajaxContent .iconized-fonts-wrapper' ).append( '<div class="iconized-font-names"></div>' );
						$( '#TB_ajaxContent .iconized-fonts-wrapper' ).append( '<div class="iconized-fonts"></div>' );

						/* Wait the thickbox open */

						setTimeout( function () {
							var firstScreen = listarLocalizeAndAjax.firstScreenIconSelector;

							if ( Array.isArray( listarIconSelector ) ) {
								var iconsSelectorCount = listarIconSelector.length;

								for ( var a = 0; a < iconsSelectorCount; a++ ) {
									var
										icons,
										iconsCount = 0;

									/* Font selector name */
									$( '#TB_ajaxContent .iconized-fonts-wrapper .iconized-font-names' ).append( '<div class="iconized-font font-' + listarIconSelector[ a ][0] + '" data-font-name="font-' + listarIconSelector[ a ][0] + '"></div>' );
									$( '#TB_ajaxContent .iconized-fonts-wrapper .iconized-font-names .font-' + listarIconSelector[ a ][0] ).append( '<div>' + listarIconSelector[ a ][0] + '</div>' );

									if ( 'linear' === firstScreen || 'awesome' === firstScreen ) {
										$( '#TB_ajaxContent .iconized-fonts-wrapper .iconized-font-names' ).css( { display : 'none' } );
									}

									/* Font icons wrapper */


									/* The icons */
									if ( ! allFontsProcessed ) {

										saveIconized += '<div class="iconized-font-' + listarIconSelector[ a ][0] + '">';

										icons = listarIconSelector[ a ][1].split( ',' );
										iconsCount = icons.length;

										for ( var ic = 0; ic < iconsCount; ic++ ) {
											saveIconized += '<i class="' + icons[ ic ] + '"></i>';
										}

										saveIconized += '</div>';
									}

									if ( ( a + 1 ) === iconsSelectorCount ) {
										allFontsProcessed = true;
									}

									if ( allFontsProcessed ) {
										$( '#TB_ajaxContent .iconized-fonts' ).append( saveIconized );
									}
								}
							}

							if ( 'linear' === firstScreen ) {
								$( '.iconized-font.font-linear div' ).each( function () {
									$( this )[0].click();
								} );
							} else if ( 'awesome' === firstScreen ) {
								$( '.iconized-font.font-awesome div' ).each( function () {
									$( this )[0].click();
								} );
							}

							$( '#TB_window' ).removeClass( 'listar-loading-icons' );
						}, 20 );
					}, 50 );
				}
			}, 100 );
		} );

		$( 'body' ).on( 'change', '.listar-create-carousel input', function () {

			var columnsEl = $( this ).parents( 'p' ).siblings( '.listar-columns-width' );
			
			if ( $( this ).is( ':checked' ) ) {
				columnsEl.addClass( 'hidden' );
			} else {
				columnsEl.removeClass( 'hidden' );
			}
		} );

		/* Inline approval for claims */

		$( 'body' ).on( 'click', '.listar-approve-claim', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var thisElement = $( this );
			
			thisElement.parent().parent().find( '.editinline' )[0].click();
			thisElement.parent().parent().siblings( '.inline-edit-row.quick-edit-row' ).find( 'select[name="_status"]' ).val( 'publish' );
			thisElement.parent().parent().siblings( '.inline-edit-row.quick-edit-row' ).find( 'button.save' )[0].click();
		} );

		/* Inline decline for claims */

		$( 'body' ).on( 'click', '.listar-decline-claim', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var thisElement = $( this );
			
			thisElement.parent().parent().find( '.editinline' )[0].click();
			thisElement.parent().parent().siblings( '.inline-edit-row.quick-edit-row' ).find( 'select[name="_status"]' ).val( 'draft' );
			thisElement.parent().parent().siblings( '.inline-edit-row.quick-edit-row' ).find( 'button.save' )[0].click();
		} );

		/* Inline decline for claims */

		$( 'body' ).on( 'click', '.listar-menu-icon-low-stroke', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( this ).siblings( '.edit-menu-item-classes' ).each( function () {
				var siblingVal = $( this ).val();
				
				if ( 'string' !== typeof siblingVal ) {
					siblingVal = '';
				}
				
				if ( - 1 === siblingVal.indexOf( 'listar-light-icon' ) ) {
					$( this ).val( 'listar-light-icon ' + siblingVal );
				}
			} );
		} );

		/* Global 'icon as image' (svg/png/jpg/etc) uploader */

		$( 'body' ).on( 'click', '.upload-image-button', function ( e ) {
			var thisElement = $( this );

			thisElement.siblings( 'input[type=text]' ).focus();
			e.preventDefault();
			mediaUploader = 0;

			mediaUploader = wp.media.frames.file_frame = wp.media( {
				title: listarLocalizeAndAjax.selectImage,
				button: {
					text: listarLocalizeAndAjax.choose
				},
				multiple: false
			} );

			mediaUploader.on( 'select', function () {
				var attachment = mediaUploader.state().get( 'selection' ).first().toJSON();

				thisElement.parent().find( 'input[type=text]' )
					.val( attachment.url )
					.attr( 'value', attachment.url )
					.trigger( 'change' );
			} );

			mediaUploader.open();
		} );

		/* Clean hidden fields of term images when a new term is created with WordPress Ajax */

		countTerms = 0;

		$( '#addtag #submit' ).on( 'click', function () {
			var fields = $( this ).parent().parent().find( '#job_listing_region-image-id, #job_listing_category-image-id, #job_listing_amenity-image-id, #category-image-id' );

			if ( fields.length > 0 ) {
				var clean;

				countTerms = $( '#the-list td.name.column-name' ).length;

				clean = setInterval( function () {
					var check = $( '#the-list td.name.column-name' ).length;

					if ( check > countTerms ) {
						clearInterval( clean );
						countTerms = $( '#the-list td.name.column-name' ).length;

						if ( $( '.custom_media_image' ).length > 0 ) {
							$( '.custom_media_image' ).parent().html( '<img class="custom_media_image custom_media_image_display" src="" />' );
						}

						$( '#ct_tax_media_remove' ).addClass( 'hidden' );

						fields.each( function () {
							$( this ).attr( 'value', '' );
						} );
					}
				}, 1000 );
			}
		} );

		$( 'body' ).on( 'mouseleave', '#adminmenu .toplevel_page_smush' , function () {
			setTimeout( function () {
				$( '#adminmenu .toplevel_page_smush div.wp-menu-image.svg' ).attr( 'style', '' );
			}, 100 );
		} );

		$( 'body' ).on( 'click', '.listar-more-loco-paths a', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
			
			$( '.loco-paths .compact' ).addClass( 'listar-unhide' );
			$( this ).parents( 'tr' ).prop( 'outerHTML', '' );
		} );

		$( 'body' ).on( 'click', '#_job_business_use_hours', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-hours-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-hours-fields' ).addClass( 'hidden' );
			}
		} );

		$( 'body' ).on( 'click', '#_job_business_use_custom_excerpt', function () {

			/* Display/hide custom excerpt field */
			toggleCheckboxDependantField( '#_job_business_use_custom_excerpt', '#_job_business_custom_excerpt', true );
		} );

		$( 'body' ).on( 'click', '#listar_recommended_appointment_services_disable', function () {

			/* Display/hide recommended appointment URLs */
			toggleCheckboxDependantField( '#listar_recommended_appointment_services_disable', '.listar_recommended_appointment_services', false, true );
		} );

		$( 'body' ).on( 'change', '#product-type', function () {
			if ( 'job_package' === $( this ).val() || 'job_package_subscription' === $( this ).val() ) {
				$( '#listar_meta_box_package_options button[aria-expanded="true"]' ).each( function () {
					$( this )[0].click();
				} );

				$( '#listar_meta_box_package_options' ).css( { display : 'block' } );
			} else {
				$( '#listar_meta_box_package_options' ).css( { display : 'none' } );
			}
		} );
				
		$( 'body').on( 'click', 'input[name*="custom_package_option_activation"]', function () {
			if ( $( this ).hasClass( 'listar_customization_custom_package_option_activation' ) ) {
				if ( $( this ).is( ':checked' ) ) {
					$( this ).parents( 'tr' ).siblings( 'tr' ).removeClass( 'hidden' );
				} else {
					$( this ).parents( 'tr' ).siblings( 'tr' ).addClass( 'hidden' );
				}
			} else {
				if ( $( this ).is( ':checked' ) ) {
					$( this ).parents( 'td' ).next().removeClass( 'listar-visibility-hidden' );
					$( this ).parents( 'td' ).next().next().removeClass( 'listar-visibility-hidden' );

					var nextInput = $( this ).parents( 'td' ).next().next().find( 'input' );

					if ( nextInput.is( ':checked' ) ) {
						nextInput.parents( 'td' ).next().removeClass( 'listar-visibility-hidden' );
					} else {
						nextInput.parents( 'td' ).next().addClass( 'listar-visibility-hidden' );
					}
				} else {
					$( this ).parents( 'td' ).next().addClass( 'listar-visibility-hidden' );
					$( this ).parents( 'td' ).next().next().addClass( 'listar-visibility-hidden' );

					var nextInput = $( this ).parents( 'td' ).next().next().find( 'input' );

					if ( nextInput.is( ':checked' ) ) {
						nextInput.parents( 'td' ).next().addClass( 'listar-visibility-hidden' );
					} else {
						nextInput.parents( 'td' ).next().addClass( 'listar-visibility-hidden' );
					}
				}
			}
		} );
				
		$( 'body').on( 'click', 'input[name*="custom_package_option_display"]', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( this ).parents( 'td' ).next().removeClass( 'listar-visibility-hidden' );
			} else {
				$( this ).parents( 'td' ).next().addClass( 'listar-visibility-hidden' );
			}
		} );

		$( 'body').on( 'click', '.listar-copy-day-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var dayPrefix = [
				'mon',
				'tue',
				'wed',
				'thu',
				'fri',
				'sat',
				'sun'
			];

			var currentDayOrder  = $( this ).parents( 'tr[class*="listar-business-hours-row"]' ).index();
			var currentClasses  = $( this ).parents( 'tr[class*="listar-business-hours-row"]' ).attr( 'class' );
			var dayStartColumnHTML = $( this ).parents( 'tr[class*="listar-business-hours-row"]' ).find( '.listar-business-start-time-field' ).prop( 'outerHTML' );
			var dayEndColumnHTML = $( this ).parents( 'tr[class*="listar-business-hours-row"]' ).find( '.listar-business-end-time-field' ).prop( 'outerHTML' );


			$( this ).parents( '.listar-hours-table-wrapper' ).find( 'tr[class*="listar-business-hours-row"]' ).each( function () {
				var rowDayOrder = $( this ).index();

				if ( currentDayOrder !== rowDayOrder ) {
					var newDayClasses = currentClasses.replace( 'listar-business-hours-row-' + dayPrefix[ currentDayOrder ], 'listar-business-hours-row-' + dayPrefix[ rowDayOrder ] );
					var newDayStartColumnHTML = dayStartColumnHTML.replace( 'job_hours[' + dayPrefix[ currentDayOrder ] + ']', 'job_hours[' + dayPrefix[ rowDayOrder ] + ']' );
					var newDayEndColumnHTML = dayEndColumnHTML.replace( 'job_hours[' + dayPrefix[ currentDayOrder ] + ']', 'job_hours[' + dayPrefix[ rowDayOrder ] + ']' );

					$( this ).attr( 'class', newDayClasses );
					$( this ).find( '.listar-business-start-time-field' ).prop( 'outerHTML', newDayStartColumnHTML );
					$( this ).find( '.listar-business-end-time-field' ).prop( 'outerHTML', newDayEndColumnHTML );

					$( this ).find( '.select2' ).each( function () {
						$( this ).prop( 'outerHTML', '' );
					} );

					$( this ).find( 'select' ).each( function () {
						$( this ).attr( 'class', '' ).removeAttr( 'data-select2-id' );
						$( this ).find( 'option[data-select2-id]' ).each( function () {
							$( this ).removeAttr( 'data-select2-id' );
						} );

						$( this ).select2( {
							minimumResultsForSearch: 3
						} );
					} );						
				}

				$( this ).find( '.tooltip' ).each( function () {
					$( this ).prop( 'outerHTML', '' );
					setTooltips();
				} );
			} );
		} );

		$( 'body').on( 'click', '.listar-multiple-hours-plus', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( this ).parent().parent().parent().addClass( 'listar-has-multiple-hours' );

			$( this ).parent().parent().parent().find( '.listar-business-start-time-field, .listar-business-end-time-field' ).each( function () {

				$( this ).find( 'select' ).each( function () {
					var selectVal = $( this ).val();

					$( this ).attr( 'value', selectVal );

					$( this ).find( 'option' ).each( function () {
						$( this ).removeAttr( 'selected' ).prop( 'selected', false ).removeAttr( 'data-select2-id' );
					} );

					$( this ).find( 'option' ).each( function () {
						if ( selectVal === $( this ).attr( 'value' ) ) {
							$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
						}
					} );

					$( this ).attr( 'value', selectVal ).select2( 'destroy' ).removeAttr( 'data-select2-id' );
					$( this ).val( selectVal );
					
					forceSelectSelected( $( this ) );
				} );

				$( this ).find( '.listar-business-hour:last-child' ).each( function () {
					var multipleHourOrder = parseInt( $( this ).find( 'select' ).attr( 'data-multiple-order' ), 10 );
					var newMultipleHour = $( this ).prop( 'outerHTML' ).replace( 'data-multiple-order="' + multipleHourOrder + '"', 'data-multiple-order="' + ( multipleHourOrder + 1 ) + '"' );

					$( this ).after( newMultipleHour );
				} );

				var numberPattern = /\d+/g;
				var selectOrder = 0;
				var multipleorder = 0;

				$( this ).find( 'select' ).each( function () {
					var selectName = $( this ).attr( 'name' );

					selectOrder = selectName.match( numberPattern ).join([]);
					multipleorder = $( this ).attr( 'data-multiple-order' );

					$( this ).attr( 'name', selectName.replace( selectOrder, multipleorder ) );
				} );

				var currentThis = $( this );

				setTimeout( function () {

					currentThis.find( 'select, option[data-select2-id]' ).each( function () {
						$( this ).removeAttr( 'data-select2-id' );
					} );

					var lastestHoursEnd = currentThis.parent().find( '.listar-business-end-time-field select[data-multiple-order="' + selectOrder + '"]' ).val();

					var newHoursStart = '11:59 PM' !== lastestHoursEnd ? lastestHoursEnd : '00:00 AM';
					var newStartHourSelect = currentThis.parent().find( '.listar-business-start-time-field' ).find( 'select[data-multiple-order="' + multipleorder + '"]' );
					var newEndHourSelect = currentThis.parent().find( '.listar-business-end-time-field' ).find( 'select[data-multiple-order="' + multipleorder + '"]' );

					if ( newStartHourSelect.length ) {
						newStartHourSelect.val( newHoursStart ).attr( 'value', newHoursStart );
						newStartHourSelect.find( 'option' ).each( function () {
							$( this ).removeAttr( 'selected' ).prop( 'selected', false );

							if ( newHoursStart === $( this ).attr( 'value' ) ) {
								$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
								newStartHourSelect.val( newHoursStart ).attr( 'value', newHoursStart );
							}
						} );
						
						forceSelectSelected( newStartHourSelect );
								
						newStartHourSelect.trigger( 'change' );
					}

					if ( newEndHourSelect.length ) {
						if ( '00:00 AM' === newHoursStart ) {
							lastestHoursEnd = '12:00 PM';
						} else {
							lastestHoursEnd = '11:59 PM';
						}

						newEndHourSelect.val( lastestHoursEnd ).attr( 'value', lastestHoursEnd );
						newEndHourSelect.find( 'option' ).each( function () {
							$( this ).removeAttr( 'selected' ).prop( 'selected', false );

							if ( lastestHoursEnd === $( this ).attr( 'value' ) ) {
								$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
								newEndHourSelect.val( lastestHoursEnd ).attr( 'value', lastestHoursEnd );
							}
						} );
						
						forceSelectSelected( newEndHourSelect );

						newEndHourSelect.trigger( 'change' );
					}

					currentThis.find( 'select' ).each( function () {
						$( this ).select2( {
							minimumResultsForSearch: 3
						} );
						
						$( this ).trigger( 'change' );
					} );
				}, 10 );
			} );
		} );

		$( 'body').on( 'click', '.listar-multiple-hours-minus', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var countMultipleHours = $( this ).parent().parent().parent().find( '.listar-business-hour' ).length;

			if ( 4 === countMultipleHours ) {
				var currentMinus = $( this );

				currentMinus.parent().parent().parent().removeClass( 'listar-has-multiple-hours' );

				setTimeout( function () {
					checkOpenHourSelected( currentMinus.parents( '.listar-business-start-time-field' ).find( 'select' ) );
				}, 20 );
			}

			$( this ).parent().parent().parent().find( '.listar-business-start-time-field, .listar-business-end-time-field' ).each( function () {
				$( this ).find( '.listar-business-hour:last-child' ).each( function () {
					$( this ).prop( 'outerHTML', '' );
				} );
			} );
		} );

		$( 'body' ).on( 'click', '.listar-location-show-advanced', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '.listar-custom-location-fields' ).removeClass( 'hidden' );
			$( this ).prop( 'outerHTML', '' );
		} );
				
		$( 'body' ).on( 'select2:selecting', 'select[name*=job_hours]', function() {
			var theSelect = $( this );

			setTimeout( function () {
				var selectedValue = theSelect.val();

				theSelect.attr( 'value', selectedValue );

				theSelect.find( 'option' ).each( function () {
					$( this ).removeAttr( 'selected' ).prop( 'selected', false );

					if ( selectedValue === $( this ).attr( 'value' ) ) {
						$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
					}
				} );
				
				theSelect.val( selectedValue );

				checkCloseHourSelected( theSelect );
				checkOpenHourSelected( theSelect );
			}, 10 );
		} );

		$( 'body' ).on( 'change', '#_job_locationselector', function () {
			var theSelect = $( this );
					
			setTimeout( function () {
				if ( 'location-custom' === theSelect.val() ) {
					$( '#_job_customlocation' ).parents( '.form-field' ).css( { display : 'block' } );
					theSelect.parents( '.listar-custom-location-fields' ).removeClass( 'listar-remove-last-border' );
				} else {
					$( '#_job_customlocation' ).parents( '.form-field' ).css( { display : 'none' } );
					theSelect.parents( '.listar-custom-location-fields' ).addClass( 'listar-remove-last-border' );
				}
			}, 10 );
		} );
		
		$( 'body' ).on( 'click', '.listar-geolocate-addresses', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
			
			var referenceAdresses = [
				[ '#listar_primary_fallback_listing_reference', $( '#listar_primary_fallback_listing_reference' ).val(), $( 'input[name="listar_primary_fallback_geolocated_lat"]' ).parents( 'tr' ), $( 'input[name="listar_primary_fallback_geolocated_lng"]' ).parents( 'tr' ) ],
				[ '#listar_secondary_fallback_listing_reference', $( '#listar_secondary_fallback_listing_reference' ).val(), $( 'input[name="listar_secondary_fallback_geolocated_lat"]' ).parents( 'tr' ), $( 'input[name="listar_secondary_fallback_geolocated_lng"]' ).parents( 'tr' ) ]
			];

			getGeolocatedData( referenceAdresses );
			
		} );
		
		$( 'body' ).on( 'click', '#wp-admin-bar-autoptimize > .ab-item', function ( e ) {
			e.preventDefault();
		} );
		
		$( 'body' ).on( 'click', '#wp-admin-bar-autoptimize-default li', function ( e ) {
			
			if ( 'undefined' !== typeof listarSiteURL ) {
				if ( 'wp-admin-bar-autoptimize-delete-cache' === $( this ).attr( 'id' ) ) {
					e.preventDefault();
					e.stopPropagation();

					var modal_loading = $( '<div class="autoptimize-loading listar-clean-cache-loading"></div>' );
					var cleanCacheURL = listarSiteURL + '/wp-content/plugins/listar-addons/inc/clear-cache.php';
					var completedCleaning = false;
					var buttonToRepeat = $( this );
					var dumbData = { my_data : '[{"dumb_data":"dumb_data"}]' };

					if ( 0 === $( '.autoptimize-loading.listar-clean-cache-loading' ).length ) {
						modal_loading.appendTo( 'body' ).show();
					}

					$.ajax( {
						url      : cleanCacheURL,
						type     : 'POST',
						cache    : false,
						data     : dumbData,
						timeout  : 30000
					} ).done( function ( response ) {
						if ( 'Done' === response ) {
							modal_loading.remove();
							completedCleaning = true;
						}
					} );

					setTimeout( function () {
						if ( ! completedCleaning ) {
							buttonToRepeat[0].click();
						}
					}, 30000 );
				}
			}
		} );

		/* General image uploader - widgets */

		$( 'body' ).on( 'click', '.upload-adm-button', function ( e ) {
			var thisElement = $( this );

			e.preventDefault();
			mediaUploader = 0;

			mediaUploader = wp.media.frames.file_frame = wp.media( {
				title: listarLocalizeAndAjax.selectImage,
				button: {
					text: listarLocalizeAndAjax.choose
				},
				multiple: false
			} );

			mediaUploader.on( 'select', function () {
				var attachment = mediaUploader.state().get( 'selection' ).first().toJSON();

				if ( attachment.id ) {
					var
						size = attachment.sizes.full,
						admPicPrevWrapper ;

					if ( 'undefined' !== typeof attachment.sizes.medium ) {
						size = attachment.sizes.medium;
					} else if ( 'undefined' !== typeof attachment.sizes.thumbnail ) {
						size = attachment.sizes.thumbnail;
					}

					thisElement.parent().find( '.adm-pic-prev' ).attr( 'src', size.url );

					admPicPrevWrapper = thisElement.parent().find( '.adm-pic-wrapper' );

					if ( admPicPrevWrapper.length > 0 ) {
						if ( admPicPrevWrapper.hasClass( 'hidden' ) ) {
							var
								uploadButtonNewText = thisElement.attr( 'data-value' ),
								uploadButtonOldText = thisElement.attr( 'value' );

							thisElement.attr( 'value', uploadButtonNewText );
							thisElement.attr( 'data-value', uploadButtonOldText );
						}
					}

					thisElement.siblings().removeClass( 'hidden' );
					thisElement.parent().find( '.upload-adm-field' ).val( attachment.id );
					thisElement.parent().find( '.upload-adm-field' ).attr( 'value', attachment.id );
					thisElement.parent().find( '.adm-pic-prev' ).attr( 'src', size.url );

					$( '.upload-adm-field' ).trigger( 'change' );
				}
			} );

			mediaUploader.open();
		} );

		$( 'body' ).on( 'click', '.upload-adm-remove', function ( e ) {
			var
				thisElement = $( this ),
				admPicPrevWrapper = thisElement.parent().find( '.adm-pic-wrapper' );

			e.preventDefault();

			if ( admPicPrevWrapper.length > 0 ) {
				var
					uploadButtonNewText = thisElement.siblings( '.upload-adm-button' ).attr( 'data-value' ),
					uploadButtonOldText = thisElement.siblings( '.upload-adm-button' ).attr( 'value' );

				thisElement.siblings( '.upload-adm-button' ).attr( 'value', uploadButtonNewText );
				thisElement.siblings( '.upload-adm-button' ).attr( 'data-value', uploadButtonOldText );

				admPicPrevWrapper.addClass( 'hidden' );
			}

			thisElement.parent().find( '.adm-pic-prev' ).attr( 'src', '' );
			thisElement.parent().find( '.upload-adm-field' ).val( '' );
			thisElement.addClass( 'hidden' );

			/* If widgets: */
			$( '.upload-adm-field' ).trigger( 'change' );
			thisElement.parent().parent().parent().find( '.widget-control-save' ).trigger( 'click' );
		} );

		/* Return only numbers (0 until 9) */
		$( '#listar_meta_box_max_partner_logo_width_field' ).on( 'change paste keyup', function () {
			$( this ).attr( 'value', $( this ).attr( 'value' ).replace( /[^0-9]/g, '' ) );
		} );

		/* Return only acceptable characters for a phone number */
		$( '.wp_job_manager_meta_data #_company_phone, .wp_job_manager_meta_data #_company_fax, .wp_job_manager_meta_data #_company_mobile, .wp_job_manager_meta_data #_company_whatsapp' ).on( 'change paste keyup', function () {
			validatePhoneCharacters( $( this ) );
		} );

		/* Return only characters for coordinates - 0 until 9 and dot (.) */
		$( 'input[name="_job_customlatitude"], input[name="_job_customlongitude"]' ).on( 'change paste keyup', function () {
			$( this ).attr( 'value', $( this ).attr( 'value' ).replace( /[^0-9\.-]/g, '' ) );
			fixListingCoordinates( $( 'input[name="_job_customlatitude"]' ), $( 'input[name="_job_customlongitude"]' ) );
		} );

		/* Return only characters for princing fields - 0 until 9 and dot (.) */
		$( 'body' ).on( 'change paste keyup', 'input[class*="price-range"], input[name*="priceaverage"]', function () {
			sanitizePricingFields( $( this ) );
		} );

		/* Avoid line breaks */

		$( 'body' ).on( 'change paste keyup', '#_job_location', function () {
			if ( 'undefined' !== typeof $( this ).attr( 'value' ) ) {
				$( this ).attr( 'value', $( this ).attr( 'value' ).replace( /( \r\ n| \n| \r\r\n|\n|\r)/gm, ' ' ) );
			} else if ( 'undefined' !== typeof $( this ).prop( 'innerHTML' ) ) {
				$( this ).prop( 'innerHTML', $( this ).prop( 'innerHTML' ).replace( /( \r\ n| \n| \r\r\n|\n|\r)/gm, ' ' ) );
			}
		} );

		/* Average price */

		$( '.price-range-from, .price-range-to' ).on( 'change paste keyup', function () {
			setTimeout( function () {
				var
					from = $( '.price-range-from' ).val(),
					to = $( '.price-range-to' ).val(),
					average = $( '#_job_priceaverage' ),
					value1 = 0,
					value2 = 0;

				if ( '' !== from ) {
					value1 = parseInt( from, 10 );
				}

				if ( '' !== to ) {
					value2 = parseInt( to, 10 );
				}

				average.val( ( value1 + value2 ) / 2 );
			}, 200 );
		} );

		$( 'body' ).on( 'change', '#page_template, .editor-page-attributes__template select, .components-select-control', function () {
			updateMetaVisibleFields();
		} );

		$( 'body' ).on( 'click', '#publish, .editor-post-publish-button', function ( e ) {
			validatePhoneCharacters( $( '.wp_job_manager_meta_data #_company_phone, .wp_job_manager_meta_data #_company_fax, .wp_job_manager_meta_data #_company_mobile, .wp_job_manager_meta_data #_company_whatsapp' ) );

			var hasIssues = false;

			var
				priceFrom,
				priceTo,
				phoneField  = $( '.wp_job_manager_meta_data #_company_phone' ),
				faxField    = $( '.wp_job_manager_meta_data #_company_fax' ),
				mobileField = $( '.wp_job_manager_meta_data #_company_mobile' ),
				whatsappField = $( '.wp_job_manager_meta_data #_company_whatsapp' );
				
			var
				hasPhoneField = 0 !== phoneField.length,
				hasFaxField = 0 !== faxField.length,
				hasMobileField = 0 !== mobileField.length,
				hasWhatsappField = 0 !== whatsappField.length;

			var 
				phoneFieldValue		     = phoneField.val(),
				faxFieldValue		     = faxField.val(),
				mobileFieldValue	     = mobileField.val(),
				whatsappFieldValue	     = whatsappField.val(),
				phoneFieldCountryCode        = hasPhoneField ? phoneField.parent().find( '.iti__selected-flag div' ).eq( 0 ).attr( 'class' ) : '',
				faxFieldCountryCode          = hasFaxField ? faxField.parent().find( '.iti__selected-flag div' ).eq( 0 ).attr( 'class' ) : '',
				mobileFieldCountryCode       = hasMobileField ? mobileField.parent().find( '.iti__selected-flag div' ).eq( 0 ).attr( 'class' ) : '',
				whatsappFieldCountryCode     = hasWhatsappField ? whatsappField.parent().find( '.iti__selected-flag div' ).eq( 0 ).attr( 'class' ) : '',
				phoneFieldCountryCodeLength  = 0,
				faxFieldCountryCodeLength    = 0,
				mobileFieldCountryCodeLength = 0,
				whatsappFieldCountryCodeLength = 0;

			var 
				phoneFieldValueSubstr    = hasPhoneField && 'string' === typeof phoneFieldValue ? phoneFieldValue.substring(0,4) : '',
				faxFieldValueSubstr      = hasFaxField && 'string' === typeof faxFieldValue ? faxFieldValue.substring(0,4) : '',
				mobileFieldValueSubstr   = hasMobileField && 'string' === typeof mobileFieldValue ? mobileFieldValue.substring(0,4) : '',
				whatsappFieldValueSubstr = hasWhatsappField && 'string' === typeof whatsappFieldValue ? whatsappFieldValue.substring(0,4) : '';

			phoneFieldCountryCode    = phoneFieldCountryCode.replace( /\iti__flag /gi, '' );
			faxFieldCountryCode      = faxFieldCountryCode.replace( /\iti__flag /gi, '' );
			mobileFieldCountryCode   = mobileFieldCountryCode.replace( /\iti__flag /gi, '' );
			whatsappFieldCountryCode = whatsappFieldCountryCode.replace( /\iti__flag /gi, '' );

			phoneFieldCountryCode    = hasPhoneField ? $( '.iti__country-list' ).eq( 0 ).find( '.iti__flag-box .' + phoneFieldCountryCode ).eq( 0 ).parents( '.iti__country' ).attr( 'data-dial-code' ) : '';
			faxFieldCountryCode      = hasFaxField ? $( '.iti__country-list' ).eq( 0 ).find( '.iti__flag-box .' + faxFieldCountryCode ).eq( 0 ).parents( '.iti__country' ).attr( 'data-dial-code' ) : '';
			mobileFieldCountryCode   = hasMobileField ? $( '.iti__country-list' ).eq( 0 ).find( '.iti__flag-box .' + mobileFieldCountryCode ).eq( 0 ).parents( '.iti__country' ).attr( 'data-dial-code' ) : '';
			whatsappFieldCountryCode = hasWhatsappField ? $( '.iti__country-list' ).eq( 0 ).find( '.iti__flag-box .' + whatsappFieldCountryCode ).eq( 0 ).parents( '.iti__country' ).attr( 'data-dial-code' ) : '';
			

			phoneFieldCountryCodeLength    = hasPhoneField ? phoneFieldCountryCode.length : 0;
			faxFieldCountryCodeLength      = hasFaxField ? faxFieldCountryCode.length : 0;
			mobileFieldCountryCodeLength   = hasMobileField ? mobileFieldCountryCode.length : 0;
			whatsappFieldCountryCodeLength = hasWhatsappField ? whatsappFieldCountryCode.length : 0;

			if ( hasPhoneField ) {
				if ( '' !== phoneFieldValueSubstr && phoneFieldValueSubstr.indexOf( '+' + phoneFieldCountryCode ) < 0 && phoneFieldValueSubstr.indexOf( '+ ' + phoneFieldCountryCode ) < 0 && phoneFieldValueSubstr.substring( 0, phoneFieldCountryCodeLength ) !== phoneFieldCountryCode ) {
					phoneFieldValue = phoneFieldValue.replace( /\+/gi, '' );
					phoneField.attr( 'value', '+' + phoneFieldCountryCode + ' ' + phoneFieldValue );
					phoneField.val( '+' + phoneFieldCountryCode + ' ' + phoneFieldValue );
				} else if ( phoneFieldValue.substring( 0, phoneFieldCountryCodeLength ) === phoneFieldCountryCode ) {
					phoneField.attr( 'value', '+' + phoneFieldValue );
					phoneField.val( '+' + phoneFieldValue );
				}
			}

			if ( hasFaxField ) {
				if ( '' !== faxFieldValueSubstr && faxFieldValueSubstr.indexOf( '+' + faxFieldCountryCode ) < 0 && faxFieldValueSubstr.indexOf( '+ ' + faxFieldCountryCode ) < 0 && faxFieldValueSubstr.substring( 0, faxFieldCountryCodeLength ) !== faxFieldCountryCode ) {
					faxFieldValue = faxFieldValue.replace( /\+/gi, '' );
					faxField.attr( 'value', '+' + faxFieldCountryCode + ' ' + faxFieldValue );
					faxField.val( '+' + faxFieldCountryCode + ' ' + faxFieldValue );
				} else if ( faxFieldValue.substring( 0, faxFieldCountryCodeLength ) === faxFieldCountryCode ) {
					faxField.attr( 'value', '+' + faxFieldValue );
					faxField.val( '+' + faxFieldValue );
				}
			}

			if ( hasMobileField ) {
				if ( '' !== mobileFieldValueSubstr && mobileFieldValueSubstr.indexOf( '+' + mobileFieldCountryCode ) < 0 && mobileFieldValueSubstr.indexOf( '+ ' + mobileFieldCountryCode ) < 0 && mobileFieldValueSubstr.substring( 0, mobileFieldCountryCodeLength ) !== mobileFieldCountryCode ) {
					mobileFieldValue = mobileFieldValue.replace( /\+/gi, '' );
					mobileField.attr( 'value', '+' + mobileFieldCountryCode + ' ' + mobileFieldValue );
					mobileField.val( '+' + mobileFieldCountryCode + ' ' + mobileFieldValue );
				} else if ( mobileFieldValue.substring( 0, mobileFieldCountryCodeLength ) === mobileFieldCountryCode ) {
					mobileField.attr( 'value', '+' + mobileFieldValue );
					mobileField.val( '+' + mobileFieldValue );
				}
			}

			if ( hasWhatsappField ) {
				if ( '' !== whatsappFieldValueSubstr && whatsappFieldValueSubstr.indexOf( '+' + whatsappFieldCountryCode ) < 0 && whatsappFieldValueSubstr.indexOf( '+ ' + whatsappFieldCountryCode ) < 0 && whatsappFieldValueSubstr.substring( 0, whatsappFieldCountryCodeLength ) !== whatsappFieldCountryCode ) {
					whatsappFieldValue = whatsappFieldValue.replace( /\+/gi, '' );
					whatsappField.attr( 'value', '+' + whatsappFieldCountryCode + ' ' + whatsappFieldValue );
					whatsappField.val( '+' + whatsappFieldCountryCode + ' ' + whatsappFieldValue );
				} else if ( whatsappFieldValue.substring( 0, whatsappFieldCountryCodeLength ) === whatsappFieldCountryCode ) {
					whatsappField.attr( 'value', '+' + whatsappFieldValue );
					whatsappField.val( '+' + whatsappFieldValue );
				}
			}
			
			// Save raw texts for WordPress search.
			
			$( '#_job_business_raw_contents' ).each( function () {
				var rawTextarea = $( this );
				var rawTextContent = '';
				var rawTextCurrent = '';
				
				$( '[id*="job_business_document_"][id*="_title"], .listar-price-builder-category-val, .listar-price-item-title-val, .listar-price-item-descr-val, #_job_listing_subtitle, #_job_tagline' ).each( function () {
					rawTextCurrent = $( this ).val();
					
					if ( 'string' === typeof rawTextCurrent ) {
						if ( '' !== rawTextCurrent ) {
							rawTextContent += rawTextCurrent + ' ';
						}
					}
				} );

				//alert( rawTextContent );
				
				rawTextarea.val( rawTextContent );
			} );
			
		
			// Treats the rich media fields.
			
			var richMediaJSON = '[';
			
			$( 'textarea[id*="company_business_rich_media_value_"]' ).each( function () {
				
				// Remove all unwanted HTML tags (mainly <script>), except these.
				var tempString = $( this ).val();
				var removeScripts = '';
				
				if ( 'string' !== typeof tempString ) {
					tempString = '';
				}
				
				// /\r?\n|\r/gm Removes all line breaks.
				
				removeScripts = containURLPattern( stripHTMLTags( tempString.replace( /\r?\n|\r/gm, ' ' ), 'iframe', 'embed' ).trim() );
				
				if ( removeScripts.indexOf( '<' ) >= 0 && removeScripts.indexOf( '>' ) >= 0 ) {

					// This seems HTML.
					removeScripts = extractContent( removeScripts );
				}

				$( this ).val( removeScripts );
				
				if ( '' !== removeScripts ) {
					var tempLower = removeScripts.toLowerCase();

					if (
						-1 === tempLower.indexOf( 'yout' ) &&
						-1 === tempLower.indexOf( 'vimeo' ) &&
						-1 === tempLower.indexOf( '.mp4' ) &&
						-1 === tempLower.indexOf( '.avi' ) &&
						-1 === tempLower.indexOf( '.flv' ) &&
						-1 === tempLower.indexOf( '.mov' ) &&
						-1 === tempLower.indexOf( '.wmv' ) &&
						-1 === tempLower.indexOf( '.mkv' ) &&
						-1 === tempLower.indexOf( '.jpg' ) &&
						-1 === tempLower.indexOf( '.jpeg' ) &&
						-1 === tempLower.indexOf( '.png' ) &&
						-1 === tempLower.indexOf( '.gif' ) &&
						-1 === tempLower.indexOf( '.bmp' ) &&
						-1 === tempLower.indexOf( '.webp' ) &&
						-1 === tempLower.indexOf( '<iframe' ) &&
						-1 === tempLower.indexOf( '<embed' ) &&
						-1 === tempLower.indexOf( '#no-iframe' )
						
					) {
						var tempConfirm = confirm( listarLocalizeAndAjax.mediaConfirm + '\n\n' + removeScripts );
						
						if ( tempConfirm ) {
							removeScripts = '<iframe src="' + removeScripts + '"></iframe>';
						} else {
							removeScripts += '#no-iframe';
						}
						
						$( this ).val( removeScripts );
					}
					
					richMediaJSON += '{"code":"' + encodeURI( removeScripts ) + '"},';
				}
			} );

			if ( ',' === richMediaJSON.substr( -1 ) ) {
				richMediaJSON = richMediaJSON.slice( 0, -1 );
			}

			richMediaJSON += ']';
			
			$( '#_company_business_rich_media_values' ).val( richMediaJSON );
			
			
			
			
			
			
			
			
			
				
			/* Return only characters for princing fields - 0 until 9 and dot (.) */
			$( 'input[class*="price-range"]' ).each( function () {
				sanitizePricingFields( $( this ) );
			} );

			/* Return only characters for princing fields - 0 until 9 and dot (.) */
			$( 'input[name*="priceaverage"]' ).each( function () {
				sanitizePricingFields( $( this ) );
			} );

			/* Sets price range, if available */
			if ( $( '.price-range-from' ).length && $( '.price-range-to' ).length ) {
				priceFrom = $( '.price-range-from' ).val();
				priceTo = $( '.price-range-to' ).val();

				priceFrom = 'string' !== typeof priceFrom || undefined === priceFrom || 'undefined' === priceFrom || 'NaN' === priceFrom || '' === priceFrom || 0 === priceFrom || '0' === priceFrom ? 0 : priceFrom;
						priceTo = 'string' !== typeof priceTo || undefined === priceTo || 'undefined' === priceTo || 'NaN' === priceTo || '' === priceTo || 0 === priceTo || '0' === priceTo ? 0 : priceTo;

				if ( parseInt( priceFrom, 10 ) > 0 ) {
					if ( parseInt( priceTo, 10 ) > 0 ) {
						if ( parseInt( priceTo, 10 ) <= parseInt( priceFrom, 10 ) ) {
							$( '.price-range-to' ).val( parseInt( priceFrom, 10 ) * 2 );
							$( '.price-range-from' ).trigger( 'change' );
						}
					} else {
						$( '.price-range-to' ).val( parseInt( priceFrom, 10 ) * 2 );
						$( '.price-range-from' ).trigger( 'change' );
					}
				} else {
					$( '.price-range-from' ).val( '' );
				}

				priceFrom = $( '.price-range-from' ).val();
				priceTo = $( '.price-range-to' ).val();

				priceFrom = 'string' !== typeof priceFrom || undefined === priceFrom || 'undefined' === priceFrom || 'NaN' === priceFrom || '' === priceFrom || 0 === priceFrom || '0' === priceFrom ? 0 : priceFrom;
				priceTo = 'string' !== typeof priceTo || undefined === priceTo || 'undefined' === priceTo || 'NaN' === priceTo || '' === priceTo || 0 === priceTo || '0' === priceTo ? 0 : priceTo;

				$( '#_job_pricerange' ).val( parseInt( priceFrom, 10 ) + '/////' + parseInt( priceTo, 10 ) );
			}
					
			// Prepare operation hours.

			if ( $( '.listar-business-hours-fields tr[class*="listar-business-hours-row"]' ).length ) {
					
				var operationHours = [];

				$( '.listar-business-hours-fields tr[class*="listar-business-hours-row"]' ).each( function () {

					var hoursRow = $( this );
					var keepOnlyOrder = -1;
					var multipleCount = 0;
					var multipleSeparator = '***';
					var theDayHours = '';

					// Firstly detect any Open 24 Hours / Closed 24 Hours and remove all siblings
					hoursRow.find( '.listar-business-start-time-field select' ).each( function () {
						if ( -1 === $( this ).val().indexOf( ' AM' ) && -1 === $( this ).val().indexOf( ' PM' ) ) {
							keepOnlyOrder = parseInt( $( this ).attr( 'data-multiple-order' ), 10 );
							return;
						}
					} );

					if ( -1 !== keepOnlyOrder ) {

						// Remove all sibling hours, keep only the most abrangent (24 hours open/closed)
						hoursRow.find( '.listar-business-start-time-field select, .listar-business-end-time-field select' ).each( function () {
							if ( parseInt( $( this ).attr( 'data-multiple-order' ), 10 ) !== keepOnlyOrder ) {
								$( this ).parent().parent().parent().removeClass( 'listar-has-multiple-hours' );
								$( this ).parent().prop( 'outerHTML', '' );
							}
						} );
					}

					// Now the multiple operating hours can be properly colected
					hoursRow.find( '.listar-business-start-time-field select' ).each( function () {
						var currentMultipleOrder = $( this ).attr( 'data-multiple-order' );
						var currentMultipleHourOpen  = $( this ).val();
						var currentMultipleHourClose = $( this ).parents( '.listar-business-start-time-field' ).siblings( '.listar-business-end-time-field' ).find( 'select[data-multiple-order="' + currentMultipleOrder + '"]' ).val();

						if ( 0 === multipleCount ) {
							theDayHours += currentMultipleHourOpen + ' - ' + currentMultipleHourClose;
						} else {
							theDayHours += multipleSeparator + currentMultipleHourOpen + ' - ' + currentMultipleHourClose;
						}

						multipleCount++;
					} );

					operationHours.push( theDayHours );
				} );

				$( 'input#_job_business_hours_monday' ).val( operationHours[0] );
				$( 'input#_job_business_hours_tuesday' ).val( operationHours[1] );
				$( 'input#_job_business_hours_wednesday' ).val( operationHours[2] );
				$( 'input#_job_business_hours_thursday' ).val( operationHours[3] );
				$( 'input#_job_business_hours_friday' ).val( operationHours[4] );
				$( 'input#_job_business_hours_saturday' ).val( operationHours[5] );
				$( 'input#_job_business_hours_sunday' ).val( operationHours[6] );
			}
					
			$( '#featured_job_category' ).each( function () {
				var featuredCategoryChosen = $( this ).val();
				$( '#_company_featured_listing_category' ).val( featuredCategoryChosen );
			} );
			
			if ( multipleRegionsActive ) {
				$( '#featured_job_region' ).each( function () {
					var featuredRegionChosen = $( this ).val();
					$( '#_company_featured_listing_region' ).val( featuredRegionChosen );
				} );
			}
					
			var fixListingCoords = fixListingCoordinates( $( 'input[name="_job_customlatitude"]' ), $( 'input[name="_job_customlongitude"]' ) );

			if ( ! fixListingCoords ) {
				e.preventDefault();
				e.stopPropagation();
			} else {
				var fixLastChar = fixLastCharacterCoordinates( $( 'input[name="_job_customlatitude"]' ), $( 'input[name="_job_customlongitude"]' ) );
				if ( ! fixLastChar ) {
					e.preventDefault();
					e.stopPropagation();
				}
			}

			/* Get built pricing menu values  */
			$( '#_job_business_use_price_list' ).each( function () {
				if ( $( this ).is( ':checked' ) && $( '#_job_business_use_catalog' ).is( ':checked' ) ) {
					var JSONValues  = '[';
					var priceListCategories = $( '.listar-price-builder-category' );
					var priceCat    = '';
					var priceCatID  = '';
					var priceItemID = '';
					var priceTag    = '';
					var priceTitle  = '';
					var pricePrice  = '';
					var priceDescr  = '';
                                        var priceLink   = '';
                                        var priceImageURL  = '';
                                        var priceImageID  = '';
                                        var priceLabel  = '';

                                        if ( ! priceListCategories.length ) {
                                                $( '.listar-price-item' ).each( function () {
                                                        priceTag    = $( this ).find( '.listar-price-item-tag-val' ).val();
                                                        priceTitle  = $( this ).find( '.listar-price-item-title-val' ).val();
                                                        pricePrice  = $( this ).find( '.listar-price-item-price-val' ).val();
                                                        priceDescr  = $( this ).find( '.listar-price-item-descr-val' ).val();
                                                        priceLink   = $( this ).find( '.listar-price-item-link-val' ).val();
                                                        priceImageURL   = $( this ).find( '.listar-price-item-image-val-url' ).val();
                                                        priceImageID   = $( this ).find( '.listar-price-item-image-val-id' ).val();
                                                        priceLabel  = $( this ).find( '.listar-price-item-label-val' ).val();

                                                        if ( 'string' !== typeof priceTitle || undefined === priceTitle || 'undefined' === priceTitle || 'NaN' === priceTitle || '0' === priceTitle ) {
                                                                priceTitle = '';
                                                        }

                                                        if ( '' !== priceTitle ) {
                                                                if ( 'string' !== typeof priceTag || undefined === priceTag || 'undefined' === priceTag || 'NaN' === priceTag || '0' === priceTag ) {
                                                                        priceTag = '';
                                                                }

                                                                if ( 'string' !== typeof pricePrice || undefined === pricePrice || 'undefined' === pricePrice || 'NaN' === pricePrice || '0' === pricePrice ) {
                                                                        pricePrice = '';
                                                                }

                                                                if ( 'string' !== typeof priceDescr || undefined === priceDescr || 'undefined' === priceDescr || 'NaN' === priceDescr || '0' === priceDescr ) {
                                                                        priceDescr = '';
                                                                }

                                                                if ( 'string' !== typeof priceLink || undefined === priceLink || 'undefined' === priceLink || 'NaN' === priceLink || '0' === priceLink ) {
                                                                        priceLink = '';
                                                                }

                                                                if ( 'string' !== typeof priceImageURL || undefined === priceImageURL || 'undefined' === priceImageURL || 'NaN' === priceImageURL || '0' === priceImageURL ) {
                                                                        priceImageURL = '';
                                                                }

                                                                if ( 'string' !== typeof priceImageID || undefined === priceImageID || 'undefined' === priceImageID || 'NaN' === priceImageID || '0' === priceImageID ) {
                                                                        priceImageID = '';
                                                                }

                                                                if ( 'string' !== typeof priceLabel || undefined === priceLabel || 'undefined' === priceLabel || 'NaN' === priceLabel || '0' === priceLabel ) {
                                                                        priceLabel = '';
                                                                }

                                                                priceTag   = encodeURIComponent( priceTag.trim() );
                                                                priceTitle = encodeURIComponent( priceTitle.trim() );
                                                                pricePrice = encodeURIComponent( pricePrice.trim() );
                                                                priceDescr = encodeURIComponent( priceDescr.trim() );
                                                                priceLink  = encodeURIComponent( priceLink.trim() );
                                                                priceImageURL  = encodeURIComponent( priceImageURL.trim() );
                                                                priceImageID  = encodeURIComponent( priceImageID.trim() );
                                                                priceLabel = encodeURIComponent( priceLabel.trim() );

                                                                if ( '' !== priceTitle ) {
                                                                        JSONValues += '{"category_id":"' + priceCatID + '","category":"' + priceCat + '","item_id":"' + priceItemID + '","tag":"' + priceTag + '","title":"' + priceTitle + '","price":"' + pricePrice + '","description":"' + priceDescr + '","link":"' + priceLink + '","imageURL":"' + priceImageURL + '","imageID":"' + priceImageID + '","label":"' + priceLabel + '"},';
                                                                } else {
                                                                        if ( ! hasIssues ) {
                                                                                hasIssues = true;

                                                                                if ( '' !== priceCatID ) {
                                                                                        $( '.listar-price-builder-category#' + priceCatID + ' input' ).each( function () {
                                                                                                $( this )[0].click();
                                                                                        } );
                                                                                }

                                                                                alert( listarLocalizeAndAjax.missingTitle );
                                                                        }
                                                                }
                                                        } else {
                                                                if ( ! hasIssues ) {
                                                                        hasIssues = true;

                                                                        if ( '' !== priceCatID ) {
                                                                                $( '.listar-price-builder-category#' + priceCatID + ' input' ).each( function () {
                                                                                        $( this )[0].click();
                                                                                } );
                                                                        }

                                                                        alert( listarLocalizeAndAjax.missingTitle );
                                                                }
                                                        }
                                                } );
                                        } else {
                                                priceListCategories.each( function () {
                                                        priceCat = $( this ).find( 'input' ).val();

                                                        if ( 'string' !== typeof priceCat || undefined === priceCat || 'undefined' === priceCat || 'NaN' === priceCat || '0' === priceCat || '' === priceCat ) {
                                                                priceCat = '';
                                                        } else {
                                                                priceCat = encodeURIComponent( priceCat.trim() );

                                                                if ( 'string' !== typeof priceCat || undefined === priceCat || 'undefined' === priceCat || 'NaN' === priceCat || '0' === priceCat || '' === priceCat ) {
                                                                        priceCat = '';
                                                                }
                                                        }

                                                        if ( '' === priceCat ) {
                                                                if ( ! hasIssues ) {
                                                                        hasIssues = true;
                                                                        alert( listarLocalizeAndAjax.emptyPriceCategory );
                                                                }
                                                        } else {
                                                                priceCatID = $( this ).attr( 'id' );

                                                                var priceCategoryItems = $( '.listar-price-item[data-category="' + priceCatID + '"]' );

                                                                if ( ! priceCategoryItems.length ) {
                                                                        if ( ! hasIssues ) {
                                                                                hasIssues = true;

                                                                                alert( listarLocalizeAndAjax.categoryNoItems );
                                                                        }
                                                                } else {
                                                                        priceCategoryItems.each( function () {
                                                                                priceItemID = $( this ).attr( 'id' );
                                                                                priceTag    = $( this ).find( '.listar-price-item-tag-val' ).val();
                                                                                priceTitle  = $( this ).find( '.listar-price-item-title-val' ).val();
                                                                                pricePrice  = $( this ).find( '.listar-price-item-price-val' ).val();
                                                                                priceDescr  = $( this ).find( '.listar-price-item-descr-val' ).val();
                                                                                priceLink   = $( this ).find( '.listar-price-item-link-val' ).val();
                                                                                priceImageURL  = $( this ).find( '.listar-price-item-image-val-url' ).val();
                                                                                priceImageID  = $( this ).find( '.listar-price-item-image-val-id' ).val();
                                                                                priceLabel  = $( this ).find( '.listar-price-item-label-val' ).val();

                                                                                if ( 'string' !== typeof priceTitle || undefined === priceTitle || 'undefined' === priceTitle || 'NaN' === priceTitle || '0' === priceTitle ) {
                                                                                        priceTitle = '';
                                                                                }

                                                                                if ( '' !== priceTitle ) {
                                                                                        if ( 'string' !== typeof priceTag || undefined === priceTag || 'undefined' === priceTag || 'NaN' === priceTag || '0' === priceTag ) {
                                                                                                priceTag = '';
                                                                                        }

                                                                                        if ( 'string' !== typeof pricePrice || undefined === pricePrice || 'undefined' === pricePrice || 'NaN' === pricePrice || '0' === pricePrice ) {
                                                                                                pricePrice = '';
                                                                                        }

                                                                                        if ( 'string' !== typeof priceDescr || undefined === priceDescr || 'undefined' === priceDescr || 'NaN' === priceDescr || '0' === priceDescr ) {
                                                                                                priceDescr = '';
                                                                                        }

                                                                                        if ( 'string' !== typeof priceLink || undefined === priceLink || 'undefined' === priceLink || 'NaN' === priceLink || '0' === priceLink ) {
                                                                                                priceLink = '';
                                                                                        }

                                                                                        if ( 'string' !== typeof priceImageURL || undefined === priceImageURL || 'undefined' === priceImageURL || 'NaN' === priceImageURL || '0' === priceImageURL ) {
                                                                                                priceImageURL = '';
                                                                                        }

                                                                                        if ( 'string' !== typeof priceImageID || undefined === priceImageID || 'undefined' === priceImageID || 'NaN' === priceImageID || '0' === priceImageID ) {
                                                                                                priceImageID = '';
                                                                                        }

                                                                                        if ( 'string' !== typeof priceLabel || undefined === priceLabel || 'undefined' === priceLabel || 'NaN' === priceLabel || '0' === priceLabel ) {
                                                                                                priceLabel = '';
                                                                                        }

                                                                                        priceCatID  = encodeURIComponent( priceCatID );
                                                                                        priceItemID = encodeURIComponent( priceItemID );
                                                                                        priceTag    = encodeURIComponent( priceTag.trim() );
                                                                                        priceTitle  = encodeURIComponent( priceTitle.trim() );
                                                                                        pricePrice  = encodeURIComponent( pricePrice.trim() );
                                                                                        priceDescr  = encodeURIComponent( priceDescr.trim() );
                                                                                        priceLink  = encodeURIComponent( priceLink.trim() );
                                                                                        priceImageURL  = encodeURIComponent( priceImageURL.trim() );
                                                                                        priceImageID  = encodeURIComponent( priceImageID.trim() );
                                                                                        priceLabel  = encodeURIComponent( priceLabel.trim() );

                                                                                        if ( '' !== priceTitle ) {
                                                                                                JSONValues += '{"category_id":"' + priceCatID + '","category":"' + priceCat + '","item_id":"' + priceItemID + '","tag":"' + priceTag + '","title":"' + priceTitle + '","price":"' + pricePrice + '","description":"' + priceDescr + '","link":"' + priceLink + '","imageURL":"' + priceImageURL + '","imageID":"' + priceImageID + '","label":"' + priceLabel + '"},';
                                                                                        } else {
                                                                                                if ( ! hasIssues ) {
                                                                                                        hasIssues = true;

                                                                                                        if ( '' !== priceCatID ) {
                                                                                                                $( '.listar-price-builder-category#' + priceCatID + ' input' ).each( function () {
                                                                                                                        $( this )[0].click();
                                                                                                                } );
                                                                                                        }

                                                                                                        alert( listarLocalizeAndAjax.missingTitle );
                                                                                                }
                                                                                        }
                                                                                } else {
                                                                                        if ( ! hasIssues ) {
                                                                                                hasIssues = true;

                                                                                                if ( '' !== priceCatID ) {
                                                                                                        $( '.listar-price-builder-category#' + priceCatID + ' input' ).each( function () {
                                                                                                                $( this )[0].click();
                                                                                                        } );
                                                                                                }

                                                                                                alert( listarLocalizeAndAjax.missingTitle );
                                                                                        }
                                                                                }
                                                                        } );
                                                                }
                                                        }
                                                } );
                                        }

					if ( ',' === JSONValues.substr( -1 ) ) {
						JSONValues = JSONValues.slice( 0, -1 );
					}

					JSONValues += ']';

					$( '#_job_business_price_list_content' ).val( JSONValues ).attr( 'value', JSONValues ).prop( 'innerHTML', JSONValues );
				}
			} );
					
			/* Convert <script> tags to <iframes> */
			$( '.edit-post-layout__metaboxes' ).find( 'textarea' ).each( function () {
				var textareaContent = $( this ).val();
				var textareaContent2 = textareaContent;

				if ( textareaContent.indexOf( '<script' ) >= 0 ) {

					/* Until 5 scripts */
					textareaContent = textareaContent
						.replace( '<script', '<iframe data-script-form-field="true"' ).replace( '/script>', '/iframe>' ).replace( ' type="text/javascript"', '' ).replace( " type='text/javascript'", '' )
						.replace( '<script', '<iframe data-script-form-field="true"' ).replace( '/script>', '/iframe>' ).replace( ' type="text/javascript"', '' ).replace( " type='text/javascript'", '' )
						.replace( '<script', '<iframe data-script-form-field="true"' ).replace( '/script>', '/iframe>' ).replace( ' type="text/javascript"', '' ).replace( " type='text/javascript'", '' )
						.replace( '<script', '<iframe data-script-form-field="true"' ).replace( '/script>', '/iframe>' ).replace( ' type="text/javascript"', '' ).replace( " type='text/javascript'", '' )
						.replace( '<script', '<iframe data-script-form-field="true"' ).replace( '/script>', '/iframe>' ).replace( ' type="text/javascript"', '' ).replace( " type='text/javascript'", '' );

				}

				if ( textareaContent.indexOf( 'onclick' ) >= 0 ) {

					/* Convert onclick tags to data-onclick */
					textareaContent = textareaContent.replace( 'onclick', 'data-onclick' );
				}

				if ( textareaContent.indexOf( 'opentable.com' ) >= 0 ) {
					textareaContent = textareaContent
						.replace( 'opentable.com/widget/reservation/loader', 'opentable.com/restref/client/' );
				}

				if ( textareaContent !== textareaContent2 ) {
					$( this ).val( textareaContent );
				}
			} ); 
			
			// If it is a Woocommerce listing package, get package options and serialize.
			
			$( '#product-type' ).each( function () {
				if ( 'job_package' === $( this ).val() || 'job_package_subscription' === $( this ).val() ) {
					
					// Avoid empty values.
					$( 'input[name*="_custom_package_option"]' ).each( function () {
						if ( '' === $( this ).val() || undefined === $( this ).val() || ( 'checkbox' === $( this ).attr( 'type' ) && ! $( this ).is( ':checked' ) ) ) {
							$( this ).attr( 'value', '0' );
							
							if ( 'checkbox' === $( this ).attr( 'type' ) ) {
								$( this ).prop( 'checked', true );
								$( this ).attr( 'data-temp-checked', '1' );
							}
						}
					} );
					
					var packageOptionsData = $( '.listar_package_options' ).parents( 'form' ).serializeObject();
					var packageOptionsData2 = Object.assign({}, packageOptionsData ); 
					
					keysCount = Object.keys( packageOptionsData ).length;

					for ( var n = 0; n < keysCount; n++ ) {
						var
							key = Object.keys( packageOptionsData )[ n ];
							
							if ( undefined !== key ) {
								if ( -1 === key.indexOf( 'custom_package_option_' ) ) {
									delete packageOptionsData2[ key ];
								}
							}
					}

					$( '#listar_meta_box_package_options_field' ).val( JSON.stringify( packageOptionsData2 ) );
					
					// Return empty values.
					$( 'input[name*="_custom_package_option"]' ).each( function () {
						if ( '' === $( this ).val() || '0' === $( this ).val() || undefined === $( this ).val() || ( 'checkbox' === $( this ).attr( 'type' ) && ! $( this ).is( ':checked' ) ) ) {
							$( this ).val( '' );
							$( this ).removeAttr( 'value' );
							
							if ( 'checkbox' === $( this ).attr( 'type' ) && $( this )[0].hasAttribute( 'data-temp-checked' ) ) {
								$( this ).prop( 'checked',false );
								$( this ).removeAttr( 'data-temp-checked' );
							}
						}
					} );
				}
			} );
		} );

		/* When a widget is updated */

		$( document ).on( 'widget-updated widget-added', function ( event, widget ) {
			appendIconButtons();
			checkCallToActionWidget();
		} );

		/* Back button to icon list */

		$( 'body' ).on( 'click', '.back-icon-list', function () {
			var iconMenuURL = $( '#TB_iframeContent' ).attr( 'src' );

			if ( iconMenuURL.indexOf( 'icon-gallery-selector.php' ) < 0 ) {
				var
					before,
					after;

				iconMenuURL = iconMenuURL.split( '/icon-selector.php' );

				before = iconMenuURL[0];
				after = iconMenuURL[1];

				before = before.substring( 0, before.lastIndexOf( '/' ) + 1 );
				iconMenuURL = before + 'icon-gallery-selector.php' + after;
			}

			$( '#TB_iframeContent' ).attr( 'src', iconMenuURL );
		} );

		/* Gallery upload to listings on admin editor */

		mediaManager = {
			select: function ( val, shortcode ) {
				var
					defaultPostId,
					attachments,
					selection,
					notDefined;

				shortcode = wp.shortcode.next( shortcode, val );

				defaultPostId = wp.media.gallery.defaults.id;

				if ( ! shortcode ) {
					return;
				}

				shortcode = shortcode.shortcode;

				notDefined = undefined === defaultPostId;

				if ( undefined === shortcode.get( 'id' ) && ! notDefined ) {
					shortcode.set( 'id', defaultPostId );
				}

				if ( ! shortcode.attrs.named.ids ) {
					return;
				}

				if ( 0 === shortcode.attrs.named.ids.length ) {
					return;
				}

				attachments = wp.media.gallery.attachments( shortcode );
				selection = new wp.media.model.Selection( attachments.models, {
					props: attachments.props.toJSON(),
					multiple: true
				} );

				selection.gallery = attachments.gallery;
				selection.more().done( function () {
					selection.props.set( { query: false } );
					selection.unmirror();
					selection.props.unset( 'orderby' );
				} );

				return selection;
			}
		};

		if ( 'function' === typeof wp.media ) {
			wp.media.editGallery = {
				frame: function () {
					var selection = mediaManager.select( $( '#gallery_images' ).val(), 'gallery' );

					this._frame = wp.media( {
						id: 'galleryFrame',
						frame: 'post',
						state: 'gallery-edit',
						editing: true,
						multiple: true,
						selection: selection
					} );

					this._frame.on( 'update', function ( selection ) {
						$( '#gallery_images' ).val( '[gallery ids=' + wp.media.gallery.shortcode( selection ).attrs.named.ids.join( ',' ) + ']' );
						$( '.gallery-list' ).html( '' );

						selection.map( function ( attachment ) {
							attachment = attachment.toJSON();

							if ( attachment.id ) {
								var size = attachment.sizes.full;

								if ( 'undefined' !== typeof attachment.sizes.thumbnail ) {
									size = attachment.sizes.thumbnail;
								}

								$( '.gallery-list' ).append( '<a href="' + size.url + '" class="listing-gallery-preview-thumb temp-bg-class"></a>' );
								$( '.temp-bg-class' ).css( { 'background-image': 'url(' + size.url + ')' } ).removeClass( 'temp-bg-class' );
							}
						} );
					} );

					return this._frame;
				},
				init: function () {
					$( '.listing-gallery-upload-images .edit_gallery' ).on( 'click', function ( e ) {
						e.preventDefault();
						wp.media.editGallery.frame().open();
					} );

					$( '.listing-gallery-upload-images .reset_gallery' ).on( 'click', function ( e ) {
						e.preventDefault();
						$( '#gallery_images' ).val( '[gallery ids=""]' );
						$( '.gallery-list' ).html( '' );
					} );
				}
			};

			$( wp.media.editGallery.init );
		}// End if().

		/* Get the class name of a icon from icon picker */

		$( 'body' ).on( 'click', '.iconized-font div', function () {
			var fontName = $( this ).parent().attr( 'data-font-name' );
			var chosenFontElements = $( '.iconized-' + fontName ).prop( 'outerHTML' );

			$( '.iconized-' + fontName ).prop( 'outerHTML', '' );

			setTimeout( function() {
				$( '.iconized-fonts' ).prepend( chosenFontElements );
				$( '.iconized-font-names' ).css( { display: 'none' } );
				$( '.iconized-fonts' ).css( { display: 'block' } );
				$( '#TB_ajaxWindowTitle' ).html( listarLocalizeAndAjax.chooseIcon );
			}, 30 );
		} );

		/* Get the class name of a icon from icon picker */

		$( 'body' ).on( 'click', '.iconized-fonts i', function () {
			var icon = $( this ).attr( 'class' );
			var paragraph = $( '.wp-block.is-selected .wp-block-paragraph, p.wp-block.is-selected[data-type="core/paragraph"]' );

			currentIconField.attr( 'value', icon );
			currentIconField.val( icon );
			currentIconField.trigger( 'change' );
			currentIconField.trigger( 'focus' );

			if ( paragraph.length ) {
				if ( currentIconField.parents( '.components-base-control__field' ).length ) {
					currentIconField.after( '<div class="listar-icon-input-message">' + listarLocalizeAndAjax.gutenIconMessage + '</div>' );

					$( '.edit-post-visual-editor' ).append( '<div class="listar-gutenberg-editor-temp-mask"></div>' );
				}
			}

			/* This is a valid Tickbox function */
			/* jshint ignore: start */
			tb_remove();
			/* jshint ignore: end */
		} );

		$( 'body' ).on( 'click', '.listar-gutenberg-editor-temp-mask', function () {
			$( this ).prop( 'outerHTML', '' );

			if ( $( '.listar-icon-input-message' ).length ) {
				$( '.listar-icon-input-message' ).prop( 'outerHTML', '' );
			}
		} );

		$( 'body' ).on( 'keypress', function ( e ) {
			if ( $( '.listar-gutenberg-editor-temp-mask' ).length ) {
				if ( 32 === e.which ) {
					$( '.listar-gutenberg-editor-temp-mask, .listar-icon-input-message' ).prop( 'outerHTML', '' );
				}
			}
		} );

		$( 'body' ).on( 'click', '#_company_use_social_networks', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-social-network-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-social-network-fields' ).addClass( 'hidden' );
			}
		} );

		$( 'body' ).on( 'click', '#_company_use_external_links', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-external-link-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-external-link-fields' ).addClass( 'hidden' );
			}
		} );

		$( '#company_use_external_links' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-external-link-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-external-link-fields' ).addClass( 'hidden' );
			}
		} );

		$( '#_company_use_rich_media' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-rich-media-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-rich-media-fields' ).addClass( 'hidden' );
			}
		} );

		$( '#_job_business_use_products' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-products-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-products-fields' ).addClass( 'hidden' );
			}
		} );

		$( '#_job_business_use_catalog' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-catalog-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-catalog-fields' ).addClass( 'hidden' );
			}
		} );

		$( '#_job_business_use_booking' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-booking-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-booking-fields' ).addClass( 'hidden' );
			}
		} );

		$( 'body' ).on( 'click', '#_job_business_use_catalog_documents', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-boxed-fields-inner' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-boxed-fields-inner' ).addClass( 'hidden' );
			}
		} );

		$( 'body' ).on( 'click', '#_job_business_use_price_list', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-inner' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-inner' ).addClass( 'hidden' );
			}
		} );

		$( 'body' ).on( 'click', '#_job_business_use_catalog_external', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-catalog-fields.listar-boxed-fields-docs-external .listar-boxed-fields-inner' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-catalog-fields.listar-boxed-fields-docs-external .listar-boxed-fields-inner' ).addClass( 'hidden' );
			}
		} );
		
		$( 'body' ).on( 'change', '#_company_business_rich_media_label', function () {
			if ( 'custom' === $( this ).val() ) {
				$( this ).parents( '.form-field' ).siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
			} else {
				$( this ).parents( '.form-field' ).siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
			}
		} );
		
		$( 'body' ).on( 'change', '#_job_business_products_label', function () {
			if ( 'custom' === $( this ).val() ) {
				$( this ).parents( '.form-field' ).siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
			} else {
				$( this ).parents( '.form-field' ).siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
			}
		} );
		
		$( 'body' ).on( 'change', '#_job_business_catalog_label', function () {
			if ( 'custom' === $( this ).val() ) {
				$( this ).parents( '.form-field' ).siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
			} else {
				$( this ).parents( '.form-field' ).siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
			}
		} );
		
		$( 'body' ).on( 'change', '#_job_business_booking_label', function () {
			if ( 'custom' === $( this ).val() ) {
				$( this ).parents( '.form-field' ).siblings( '.listar-boxed-fields-inner-custom-label' ).removeClass( 'hidden' );
			} else {
				$( this ).parents( '.form-field' ).siblings( '.listar-boxed-fields-inner-custom-label' ).addClass( 'hidden' );
			}
		} );
		
		$( 'body' ).on( 'change', '#_job_business_booking_method', function () {
			var selectedMethod = $( '#_job_business_booking_method' ).val();

			$( '.listar-boxed-fields-booking-method' ).addClass( 'hidden' );
			$( '#_job_business_bookings_third_party_service' ).parents( '.form-field' ).addClass( 'hidden' );

			if ( 'external' === selectedMethod ) {
				$( '.listar-boxed-fields-booking-method' ).addClass( 'hidden' );
				$( '#_job_business_bookings_third_party_service' ).parents( '.form-field' ).removeClass( 'hidden' );
			} else if ( 'booking' === selectedMethod ) {
				$( '#_job_business_bookings_third_party_service' ).parents( '.form-field' ).addClass( 'hidden' );
				$( '.listar-boxed-fields-booking-method' ).removeClass( 'hidden' );
			}
		} );

		/* Theme color events */

		$( '#reset-theme-color' ).on( 'click', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '#listar_theme_color' ).val( defaultThemeColor ).trigger( 'change' );
			$( this ).css( { display: 'none' } );
		} );

		$( '#listar_theme_color' ).on( 'click', function () {
			if ( $( '#listar_theme_color' ).val() !== defaultThemeColor ) {
				$( '#reset-theme-color' ).css( { display: 'block' } );
			}
		} );

		/* Make 'listar_ajax_infinite_loading' checkbox visibility dependent on 'listar_ajax_pagination' activation */

		$( '#listar_ajax_pagination' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar_ajax_infinite_loading' ).removeClass( 'hidden' );
			} else {
				$( '.listar_ajax_infinite_loading' ).addClass( 'hidden' );
			}
		} );

		/* Append image/icon upload buttons dinamycally after clicking on certain elements */

		$( 'body' ).on( 'click', '.block-editor-block-inspector__advanced .components-panel__body-toggle, .block-editor-block-inspector__advanced input, .editor-block-inspector__advanced .components-panel__body-toggle, .editor-block-inspector__advanced input, .wp-block-paragraph', function ( ) {
			appendIconButtons();
		} );

		/* SMTP Settings */

		$( 'body' ).on( 'submit', '#swpsmtp_settings_form', function ( ) {
			var smtpEmail = $( '#swpsmtp_smtp_username' ).val();
                        $( '#swpsmtp_from_email' ).val( smtpEmail ).attr( 'value', smtpEmail );
                        $( '#swpsmtp_reply_to_email' ).val( smtpEmail ).attr( 'value', smtpEmail );
		} );

		/* Listar Widgets manipulation ********************************/

		/* Create new element block */
		$( 'body' ).on( 'click', '.listar-element-data-add', function ( e ) {
			var
				instance = $( this ).parent().parent().find( '.listar-element-model' ).eq( 0 ).clone(),
				random = Math.floor( ( Math.random() * 99999 ) + 1 );

			e.preventDefault();
			e.stopPropagation();

			if ( instance.find( '.choose-icon' ).length > 0 ) {
				instance.find( '.choose-icon, .choose-image' ).prop( 'outerHTML', '' );
			}

			instance.attr( 'class', 'listar-element-data' );
			instance.prop( 'innerHTML', instance.prop( 'innerHTML' ).replace( /listar-select-model/g, 'listar-element-data-id' ) );

			if ( instance.find( '.listar-element-data-media' ).length > 0 ) {
				instance.find( '.listar-element-data-media' ).attr( 'name', 'listar-element-data-media-' + random );
			}

			$( this ).parent().parent().find( '.listar-elements-wrapper' ).append( instance.prop( 'outerHTML' ) );

			appendIconButtons();

			/* Make it sortable */

			$( '.listar-elements-wrapper' ).sortable( {
				connectWith: '.listar-elements-wrapper'
			} );

		} );

		/* Automatic click to 'Apply' button of widgets being displayed on Customizer, if it be visible anytime */

		function saveWidgetCustomizerPreview() {
			$( '.customize-control-widget_form .widget-control-save' ).each( function () {
				if (
					/* Button must be visible */
					( 'inline-block' === $( this ).css( 'display' ) || 'block' === $( this ).css( 'display' ) ) &&

					/* Not showing the loading spinner */
					'hidden' === $( this ).siblings( '.spinner' ).css( 'visibility' ) &&

					/* Widget changed */
					true === updatingWidget
				) {
					updatingWidget = false;
					$( this ).trigger( 'click' );
				}
			} );
		}

		if ( $( 'body' ).hasClass( 'wp-customizer' ) ) {
			updatingWidgetInterval = setInterval( saveWidgetCustomizerPreview, 1000 );
		}

		/* Update JSON on Listar custom widgets */

		preventCallStack = false;

		function updateJSON( widgetContentElem ) {
			if ( ! preventCallStack ) {
				preventCallStack = true;

				setTimeout( function () {
					var
						newElementsJSONText = '[',
						elementJSON = widgetContentElem.find( '.elements-json' ),
						listarElements = widgetContentElem.find( '.listar-element-data' );

					if ( elementJSON.parent().siblings( '.listar-has-many-terms' ).length ) {
						var regsField = elementJSON.parent().siblings( '.listar-has-many-terms' ).find( 'input' );						
						
						sanitizePricingFields( regsField, false );
						
						var regs = regsField.val();

						/* Update JSON data and activate the save button */
						elementJSON.val( regs );
						clearInterval( updatingWidgetInterval );
						updatingWidget = true;
						updatingWidgetInterval = setInterval( saveWidgetCustomizerPreview, 1000 );
						
					} else {
						var initialJSONText = elementJSON.val();

						if ( listarElements.length ) {
							listarElements.each( function () {
								var
									instance = $( this ),
									valueGroup = '{',
									slug = '',
									id = instance.find( '.listar-element-data-id' ),
									media = instance.find( '.listar-element-data-media' ),
									title = instance.find( '.listar-element-data-title' ),
									link = instance.find( '.listar-element-data-link' ),
									description = instance.find( '.listar-element-data-description' );

								if ( 1 === id.length ) {
									var optionSlug = id.find( 'option[data-slug]:selected' );

									if ( 1 === optionSlug.length ) {
										slug = optionSlug.attr( 'data-slug' );
										valueGroup += '"slug":"' + slug + '",';
									}

									id = id.val();

									if ( '' !== id ) {
										valueGroup += '"id":"' + id + '",';
									}
								}

								/* Media (image or icon class) */
								if ( 1 === media.length ) {
									media = media.val();

									if ( '' !== media ) {
										valueGroup += '"media":"' + media + '",';
									}
								}

								/* Title */
								if ( 1 === title.length ) {
									title = title.val();

									if ( '' !== title ) {
										valueGroup += '"title":"' + title + '",';
									}
								}

								/* Link */
								if ( 1 === link.length ) {
									link = link.val();

									if ( '' !== link ) {
										valueGroup += '"link":"' + link + '",';
									}
								}

								/* Description */
								if ( 1 === description.length ) {
									description = description.val();

									if ( '' !== description ) {
										valueGroup += '"description":"' + description + '",';
									}
								}

								/* Remove last comma */
								valueGroup = valueGroup.replace( /,\s*$/, '' );

								if ( '{' !== valueGroup ) {
									newElementsJSONText += valueGroup + '},';
								}
							} );
						}// End if().

						/* Remove last comma */
						newElementsJSONText = newElementsJSONText.replace( /,\s*$/, '' );
						newElementsJSONText += ']';

						if ( initialJSONText !== newElementsJSONText || newElementsJSONText !== lastJSON ) {

							lastJSON = newElementsJSONText;

							/* Update JSON data and activate the save button */
							elementJSON.val( newElementsJSONText );
							clearInterval( updatingWidgetInterval );
							updatingWidget = true;
							updatingWidgetInterval = setInterval( saveWidgetCustomizerPreview, 1000 );
						}
					}

					preventCallStack = false;

				}, 20 );
			}// End if().
		}

		/* Remove a block */

		$( 'body' ).on( 'click', '.listar-element-data-remove', function ( e ) {
			var widgetContentElem = $( this ).parent().parent().parent();

			e.preventDefault();
			e.stopPropagation();

			$( this ).parent().prop( 'outerHTML', '' );
			widgetContentElem.find( '.elements-json' ).trigger( 'change' );
			updateJSON( widgetContentElem );

		} );

		/* Activate Save button and update JSON when changing certain form fields created dynamically */

		$( 'body' ).on( 'keyup keydown keypress change paste input', '.listar-elements-wrapper input, .listar-elements-wrapper textarea', function () {
			var widgetContentElem = $( this ).parent().parent().parent().parent();
			updateJSON( widgetContentElem );
		} );

		/* Get select values of widgets as JSON - Pages, Listing Categories and Listing Regions */

		$( 'body' ).on( 'change', '.listar-element-data-id', function () {
			updateJSON( $( this ).parent().parent().parent().parent() );
		} );

		/* If changing title/subtitle of Listar widgets on customizer screen, update the hidden JSON input field and refresh the theme preview */

		$( 'body' ).on( 'keyup keydown keypress change paste input', '[id*="customize-control-widget_listar"] input[type="text"][id*="-title"],[id*="customize-control-widget_listar"] input[type="text"][id*="-subtitle"],[id*="customize-control-widget_listar"] select', function () {
			clearInterval( updatingWidgetInterval );
			updatingWidget = true;
			updatingWidgetInterval = setInterval( saveWidgetCustomizerPreview, 1000 );
		} );

		/* Fix for Gutenberg editor (Cross browser) *******************/

		/* Force update to Listar and WP Job Manager custom meta boxes */

		setTimeout( function () {
			$( '.block-editor-page' ).on( 'change DOMSubtreeModified DOMNodeInserted DOMNodeRemoved', '.editor-post-publish-button', function() {
				var button = $( this );
				var metaBoxSelectors = '[id*="listar_meta_box_"], [id*="_job_"], [id*="_company_"]';
				var customMetaBoxes = $( metaBoxSelectors );
				var customMetaFieldsTable = '#g7g_cfg_custom_fields table';
				var customMetaFieldsAddNewSelect = '#g7g_cfg_custom_fields table + p + table';
				var customMetaFieldsAddNewSelectBK = $( customMetaFieldsAddNewSelect ).prop( 'outerHTML' );

				setTimeout( function () {
					if ( ! autosaving && $( '.editor-post-saved-state.is-saving.is-autosaving' ).length ) {
						autosaving = true;
					} else if ( ! button.hasClass( 'is-busy' ) && 'false' === button.attr( 'aria-disabled' ) && ! updatingCustomMetaBoxes ) {
						if ( autosaving ) {
							setTimeout( function() {
								autosaving = false;
							}, 50 );
						} else {
							updatingCustomMetaBoxes = true;

							setTimeout( function() {
								customMetaBoxes.parents( '.edit-post-meta-boxes-area' )
									.addClass( 'is-loading' )
									.prepend( '<span class="components-spinner listar-updating-meta-boxes"></span>' );
							}, 10 );

							$.ajax( {
								url: document.URL,
								success: function( data ) {
									$( data ).find( '#wpbody' ).eq( 0 ).each( function () {
										$( this ).find( metaBoxSelectors ).each( function () {
											var metaBoxID = '#' + $( this ).attr( 'id' );
											var metaBoxVal = $( this ).val();

											$( metaBoxID ).each( function () {
												$( this ).val( metaBoxVal );
												return false;
											} );
										} );
										return false;
									} );


									if ( $( '.listar-updating-meta-boxes' ).length ) {
										$( '.listar-updating-meta-boxes' ).prop( 'outerHTML', '' );
									}

									if ( $( customMetaFieldsTable ).length && $( data ).find( customMetaFieldsTable ).length ) {
										$( customMetaFieldsTable ).prop( 'outerHTML', $( data ).find( customMetaFieldsTable ).prop( 'outerHTML' ) );
									}

									if ( $( customMetaFieldsAddNewSelect ).length && $( data ).find( customMetaFieldsAddNewSelect ).length ) {
										$( customMetaFieldsAddNewSelect ).prop( 'outerHTML', $( data ).find( customMetaFieldsAddNewSelect ).prop( 'outerHTML' ) );
									}

									setTimeout( function () {
										if ( $( customMetaFieldsTable ).length > 1 ) {
											$( customMetaFieldsTable ).eq( 1 ).prop( 'outerHTML', '' );
										}

										if ( $( customMetaFieldsAddNewSelect ).length > 1 ) {
											$( customMetaFieldsAddNewSelect ).eq( 1 ).prop( 'outerHTML', '' );
										}

										if ( 0 === $( customMetaFieldsAddNewSelect ).length ) {
											$( customMetaFieldsTable + ' + p' ).after( customMetaFieldsAddNewSelectBK );
										}

										updateProductOptions();
									}, 200 );

									customMetaBoxes.parents( '.edit-post-meta-boxes-area' ).removeClass( 'is-loading' );

									updatingCustomMetaBoxes = false;
								}
							} );
						}// End if().
					}// End if().

					/* Let's limit the AJAX save/update waiting time */
					setTimeout( function () {
						customMetaBoxes.parents( '.edit-post-meta-boxes-area' ).removeClass( 'is-loading' );

						$( '.listar-updating-meta-boxes' ).each( function () {
							$( this ).prop( 'outerHTML', '' );
						} );

						updatingCustomMetaBoxes = false;
						updateProductOptions();
					}, 15000 );
				}, 50 );
			} );
		}, 1000 );

		/* If set, make background image(s) clickable too */

		$( 'body' ).on( 'click', '.adm-pic-wrapper', function () {

			/* For Theme Options page */
			if ( $( this ).siblings( '.adm-image-upload' ).length ) {
				$( this ).siblings( '.adm-image-upload' ).trigger( 'click' );
			}

			/* For Widgets and Customizer pages */
			if ( $( this ).siblings( '.upload-adm-button' ).length ) {
				$( this ).siblings( '.upload-adm-button' ).trigger( 'click' );
			}
		} );

		/* Start admin custom 'Theme Options' JavaScript **************/

		if ( $( 'body' ).hasClass( 'appearance_page_listar_options' ) ) {

			/* Prepare interface **********************************/

			/* Categories under search field */

			var checkedCategories = $( '#listar_hero_search_categories' ).attr( 'value' );
			var cacheCleaningSelect = $( '#listar_automatic_cache_cleaning' );

			checkFieldsVisibility();

			if ( 'string' === typeof checkedCategories ) {
				if ( checkedCategories.indexOf( 'x' ) >= 0 ) {

					$( '.searchCategoriesAdm input' ).attr( 'disabled', true );
				}

				if ( '' !== checkedCategories ) {
					var checkedCategoriesCount = 0;

					if ( checkedCategories.indexOf( ',' ) >= 0 ) {
						if ( ',' === checkedCategories.substr( checkedCategories.length - 1 ) ) {
							checkedCategories = checkedCategories.slice( 0, - 1 );
						}
					}

					checkedCategories = checkedCategories.split( ',' );
					checkedCategoriesCount = checkedCategories.length;

					for ( var c = 0; c < checkedCategoriesCount; c++ ) {
						checkedCategories[ c ] = checkedCategories[ c ].split( ' ' );

						if ( '1' === checkedCategories[ c ][1] && '' !== checkedCategories[ c ][0] ) {
							$( '.searchCategoriesAdm input[value=' + checkedCategories[ c ][0] + ']' ).prop( 'checked', true );
						}
					}
				}

				checkedCategories = $( '#listar_hero_search_categories' ).attr( 'value' );
				
				if ( 'string' === typeof checkedCategories ) {
					if ( checkedCategories.indexOf( 'x' ) >= 0 ) {
						$( '.searchCategoriesAdm input' ).attr( 'disabled', true );
					}
				}
			}

			/* Regions under search field */

			var checkedRegions = $( '#listar_hero_search_regions' ).attr( 'value' );
			
			if ( ! $( '#listar_manual_featured_regions' ).length ) {				

				if ( 'string' === typeof checkedRegions ) {
					if ( checkedRegions.indexOf( 'x' ) >= 0 ) {

						$( '.searchRegionsAdm input' ).attr( 'disabled', true );
					}

					if ( '' !== checkedRegions ) {
						var checkedRegionsCount = 0;

						if ( checkedRegions.indexOf( ',' ) >= 0 ) {
							if ( ',' === checkedRegions.substr( checkedRegions.length - 1 ) ) {
								checkedRegions = checkedRegions.slice( 0, - 1 );
							}
						}

						checkedRegions = checkedRegions.split( ',' );
						checkedRegionsCount = checkedRegions.length;

						for ( var c = 0; c < checkedRegionsCount; c++ ) {
							checkedRegions[ c ] = checkedRegions[ c ].split( ' ' );

							if ( '1' === checkedRegions[ c ][1] && '' !== checkedRegions[ c ][0] ) {
								$( '.searchRegionsAdm input[value=' + checkedRegions[ c ][0] + ']' ).prop( 'checked', true );
							}
						}
					}

					checkedRegions = $( '#listar_hero_search_regions' ).attr( 'value' );

					if ( 'string' === typeof checkedRegions ) {
						if ( checkedRegions.indexOf( 'x' ) >= 0 ) {
							$( '.searchRegionsAdm input' ).attr( 'disabled', true );
						}
					}
				}
			} else {
				if ( 'string' === typeof checkedRegions ) {
					
					var finalRegs = checkedRegions;
					
					if ( finalRegs.indexOf( ' 0' ) >= 0 ) {
						if ( -1 === finalRegs.indexOf( ',' ) ) {
							finalRegs = finalRegs.replace( ' 0', '' );
						} else {							
							var tempRegs = finalRegs.split( ',' );
							var temp2 = [];

							for ( var te = 0; te < tempRegs.length; te++ ) {
								if ( -1 === tempRegs[ te ].indexOf( ' 0' ) ) {
									temp2[ te ] = tempRegs[ te ];
								}
							}

							finalRegs = temp2.join( ',' );
						}
					}
					
					finalRegs = finalRegs.replace( /x 1,/g, '' ).replace( /x 1/g, '' ).replace( / 1/g, '' );
									
					$( '#listar_manual_featured_regions' ).val( finalRegs );
				
					/* Return only characters for princing fields - 0 until 9 */
					$( '#listar_manual_featured_regions' ).each( function () {
						sanitizePricingFields( $( this ), false );
					} );
				
					/* Return only characters for princing fields - 0 until 9 */
					$( '.listar-manual-default-region' ).each( function () {
						sanitizePricingFields( $( this ), false, false );
					} );
				}				
			}
			
			if ( cacheCleaningSelect.length ) {
				var cacheCleaningSelectValue = cacheCleaningSelect.val();
				
				if ( 'string' === typeof cacheCleaningSelectValue ) {
					cacheCleaningSelectValue = parseInt( cacheCleaningSelectValue, 10 );

					if ( 0 === cacheCleaningSelectValue ) {
						cacheCleaningSelect
							.val( '2592000' )
							.attr( 'value', '2592000' );
					}
				}
				
				cacheCleaningSelect.attr( 'data-last-cache-time', cacheCleaningSelect.val() );
			}
			
			$( '#listar_geocoding_provider' ).each( function () {
				updateGeocodingProvider( $( this ) );
			} );
			
			$( '#listar_map_provider' ).each( function () {
				updateMapProvider( $( this ) );
			} );
			
			$( '#listar_load_listing_card_content_ajax' ).each( function () {
				var outerField = $( this ).parent().prop( 'outerHTML' );
				
				$( this ).parent().prop( 'outerHTML', '' );
				
				$( '.listar-pagespeed-field-postpone' ).append( outerField );
			} );
			
			$( '#listar_activate_pagespeed' ).each( function () {
				var outerField = $( this ).parent().prop( 'outerHTML' );
				
				$( this ).parent().prop( 'outerHTML', '' );
				
				$( '.listar-pagespeed-field' ).append( outerField );
			} );
			
			$( 'tr.listar_base64_favicon_32x32 td' ).each( function () {
				var outerField = $( this ).prop( 'innerHTML' );
				
				$( this ).parent().prop( 'outerHTML', '' );
				
				$( '.listar-show-favicon64-field' ).append( outerField );
			} );

			/* Theme options events *******************************/

			/* General 'image upload' event - Theme Options */

			$( '.adm-image-upload' ).on( 'click', function ( e ) {
				var thisElement = $( this );

				e.preventDefault();

				mediaUploader = 0;
				mediaUploader = wp.media.frames.file_frame = wp.media( {
					title: listarLocalizeAndAjax.selectImage,
					button: {
						text: listarLocalizeAndAjax.chooseImage
					},
					multiple: false
				} );

				mediaUploader.on( 'select', function () {
					var
						attachment = mediaUploader.state().get( 'selection' ).first().toJSON(),
						admPicPrevWrapper = thisElement.parent().find( '.adm-pic-wrapper' );

					if ( attachment.id && admPicPrevWrapper.length > 0 ) {
						var size = attachment.sizes.full;

						if ( 'undefined' !== typeof attachment.sizes.medium ) {
							size = attachment.sizes.medium;
						} else if ( 'undefined' !== typeof attachment.sizes.thumbnail ) {
							size = attachment.sizes.thumbnail;
						}

						if ( admPicPrevWrapper.hasClass( 'hidden' ) ) {
							var
								uploadButtonNewText = thisElement.attr( 'data-value' ),
								uploadButtonOldText = thisElement.attr( 'value' );

							thisElement.attr( 'value', uploadButtonNewText );
							thisElement.attr( 'data-value', uploadButtonOldText );
						}

						thisElement.siblings().removeClass( 'hidden' );
						thisElement.siblings( 'input[type=hidden]' ).val( attachment.id );
						admPicPrevWrapper.find( 'img' ).attr( 'src', size.url );
					}
				} );

				mediaUploader.open();

			} );

			/* General 'remove image' event - Theme Options */

			$( '.adm-remove-image' ).on( 'click', function ( e ) {
				var thisElement = $( this );
				var admPicPrevWrapper = thisElement.parent().find( '.adm-pic-wrapper' );

				e.preventDefault();

				if ( admPicPrevWrapper.length > 0 ) {
					var
						uploadButtonNewText = thisElement.siblings( '.adm-image-upload' ).attr( 'data-value' ),
						uploadButtonOldText = thisElement.siblings( '.adm-image-upload' ).attr( 'value' );

					thisElement.siblings( '.adm-image-upload' ).attr( 'value', uploadButtonNewText );
					thisElement.siblings( '.adm-image-upload' ).attr( 'data-value', uploadButtonOldText );

					admPicPrevWrapper.addClass( 'hidden' );
				}

				thisElement.parent().find( '.adm-pic-prev' ).attr( 'src', '' );
				thisElement.siblings( 'input[type=hidden]' ).val( '' );
				thisElement.addClass( 'hidden' );

			} );

			/* Categories under search field */

			$( '.searchCategoriesAdm input' ).on( 'click', function () {
				var
					allCategories = '',
					checkedCategories,
					catsValue,
					checkedCategoriesCount = 0;

				$( '.searchCategoriesAdm input' ).each( function () {
					allCategories += $( this ).attr( 'value' );
					allCategories += ' ';
					allCategories += $( this )[0].checked ? 1 : 0;
					allCategories += ',';
				} );

				checkedCategories = allCategories;

				if ( 'string' === typeof checkedCategories ) {
					if ( checkedCategories.indexOf( ',' ) >= 0 ) {
						checkedCategoriesCount = checkedCategories.length;

						if ( ',' === checkedCategories.substr( checkedCategoriesCount - 1 ) ) {
							checkedCategories = checkedCategories.slice( 0, - 1 );
						}
					}
				}

				checkedCategories = checkedCategories.split( ',' );
				checkedCategoriesCount = checkedCategories.length;

				for ( var i = 0; i < checkedCategoriesCount; i++ ) {
					checkedCategories[ i ] = checkedCategories[ i ].split( ' ' );

					if ( checkedCategories[ i ][0] === $( this ).attr( 'value' ) ) {
						if ( $( this )[0].checked ) {
							checkedCategories[ i ][1] = 1;
						} else {
							checkedCategories[ i ][1] = 0;
						}
					}
				}

				catsValue = '';
				checkedCategoriesCount = checkedCategories.length;

				for ( var j = 0; j < checkedCategoriesCount; j++ ) {
					catsValue += checkedCategories[ j ][0] + ' ' + checkedCategories[ j ][1] + ',';
				}

				$( '#listar_hero_search_categories' ).attr( 'value', catsValue );
			} );

			$( '#randomCats' ).on( 'click', function () {
				var checkedCategories = $( '#listar_hero_search_categories' ).attr( 'value' );

				if ( this.checked ) {
					$( '.searchCategoriesAdm input' ).attr( 'disabled', true );

					if ( 'string' === typeof checkedCategories ) {
						if ( - 1 === checkedCategories.indexOf( 'x' ) ) {
							$( '#listar_hero_search_categories' ).attr( 'value', 'x 1,' + checkedCategories );
						}
					}
				} else {
					if ( 'string' === typeof checkedCategories ) {
						if ( checkedCategories.indexOf( 'x 1,' ) >= 0 ) {
							$( '#listar_hero_search_categories' ).attr( 'value', checkedCategories.replace( 'x 1,', '' ) );
						}
					}

					checkedCategories = $( '#listar_hero_search_categories' ).attr( 'value' );

					if ( 'string' === typeof checkedCategories ) {
						if ( checkedCategories.indexOf( 'x 1' ) >= 0 ) {
							$( '#listar_hero_search_categories' ).attr( 'value', checkedCategories.replace( 'x 1', '' ) );
						}
					}

					$( '.searchCategoriesAdm input' ).removeAttr( 'disabled' );
				}
			} );

			/* Sortable taxonomies */

			$( '.searchCategoriesAdm' ).sortable( {
				connectWith: '.searchCategoriesAdm'
			} );

			/* Regions under search field */

			$( '.searchRegionsAdm input' ).on( 'click', function () {
				var
					allRegions = '',
					checkedRegions,
					regionsValue,
					checkedRegionsCount = 0;

				$( '.searchRegionsAdm input' ).each( function () {
					allRegions += $( this ).attr( 'value' );
					allRegions += ' ';
					allRegions += $( this )[0].checked ? 1 : 0;
					allRegions += ',';
				} );

				checkedRegions = allRegions;

				if ( 'string' === typeof checkedRegions ) {
					if ( checkedRegions.indexOf( ',' ) >= 0 ) {
						checkedRegionsCount = checkedRegions.length;

						if ( ',' === checkedRegions.substr( checkedRegionsCount - 1 ) ) {
							checkedRegions = checkedRegions.slice( 0, - 1 );
						}
					}
				}

				checkedRegions = checkedRegions.split( ',' );
				checkedRegionsCount = checkedRegions.length;

				for ( var i = 0; i < checkedRegionsCount; i++ ) {
					checkedRegions[ i ] = checkedRegions[ i ].split( ' ' );

					if ( checkedRegions[ i ][0] === $( this ).attr( 'value' ) ) {
						if ( $( this )[0].checked ) {
							checkedRegions[ i ][1] = 1;
						} else {
							checkedRegions[ i ][1] = 0;
						}
					}
				}

				regionsValue = '';
				checkedRegionsCount = checkedRegions.length;

				for ( var j = 0; j < checkedRegionsCount; j++ ) {
					regionsValue += checkedRegions[ j ][0] + ' ' + checkedRegions[ j ][1] + ',';
				}

				$( '#listar_hero_search_regions' ).attr( 'value', regionsValue );
			} );

			$( '#randomRegions' ).on( 'click', function () {
				var checkedRegions = $( '#listar_hero_search_regions' ).attr( 'value' );

				if ( this.checked ) {
					$( '.searchRegionsAdm input' ).attr( 'disabled', true );

					if ( 'string' === typeof checkedRegions ) {
						if ( - 1 === checkedRegions.indexOf( 'x' ) ) {
							$( '#listar_hero_search_regions' ).attr( 'value', 'x 1,' + checkedRegions );
						}
					}
				} else {
					if ( 'string' === typeof checkedRegions ) {
						if ( checkedRegions.indexOf( 'x 1,' ) >= 0 ) {
							$( '#listar_hero_search_regions' ).attr( 'value', checkedRegions.replace( 'x 1,', '' ) );
						}
					}

					checkedRegions = $( '#listar_hero_search_regions' ).attr( 'value' );

					if ( 'string' === typeof checkedRegions ) {
						if ( checkedRegions.indexOf( 'x 1' ) >= 0 ) {
							$( '#listar_hero_search_regions' ).attr( 'value', checkedRegions.replace( 'x 1', '' ) );
						}
					}

					$( '.searchRegionsAdm input' ).removeAttr( 'disabled' );
				}
			} );

			/* Sortable taxonomies */

			$( '.searchRegionsAdm' ).sortable( {
				connectWith: '.searchRegionsAdm'
			} );

			$( '#settings-form' ).on( 'submit', function ( e ) {
				
				/* Save last theme option screen */
				if ( window.location.hash ) {

					/* Prevent duplicated '#' */
					var currectScreen = window.location.hash.replace( /#/g, '' );

					$( '#listar_last_theme_options_screen' ).val( currectScreen );
				}

				/* Setting categories under search in custom order */
				var
					allCategories = '',
					cacheTimeSet = $( '#listar_automatic_cache_cleaning' ).val(),
					lastCacheTimeSet = false,
					currentCheckedHeroCategories,
					usersAllowedPublishListings = '[';

				$( '.searchCategoriesAdm input' ).each( function () {
					allCategories += $( this ).attr( 'value' );
					allCategories += ' ';
					allCategories += $( this )[0].checked ? 1 : 0;
					allCategories += ',';
				} );

				checkedCategories = allCategories;

				if ( 'string' === typeof checkedCategories ) {
					if ( checkedCategories.indexOf( ',' ) >= 0 ) {
						if ( ',' === checkedCategories.substr( checkedCategories.length - 1 ) ) {
							checkedCategories = checkedCategories.slice( 0, - 1 );
						}
					}	
				}

				currentCheckedHeroCategories = $( '#listar_hero_search_categories' ).attr( 'value' );

				if ( 'string' === typeof currentCheckedHeroCategories ) {
					if ( currentCheckedHeroCategories.indexOf( 'x' ) >= 0 ) {
						checkedCategories = 'x 1,' + checkedCategories;
					}

					$( '#listar_hero_search_categories' ).attr( 'value', checkedCategories );
				}
				
				if ( ! $( '#listar_manual_featured_regions' ).length ) {					

					/* Setting regions under search in custom order */
					var
						allRegions = '',
						currentCheckedHeroRegions;

					$( '.searchRegionsAdm input' ).each( function () {
						allRegions += $( this ).attr( 'value' );
						allRegions += ' ';
						allRegions += $( this )[0].checked ? 1 : 0;
						allRegions += ',';
					} );

					checkedRegions = allRegions;

					if ( 'string' === typeof checkedRegions ) {
						if ( checkedRegions.indexOf( ',' ) >= 0 ) {
							if ( ',' === checkedRegions.substr( checkedRegions.length - 1 ) ) {
								checkedRegions = checkedRegions.slice( 0, - 1 );
							}
						}	
					}

					currentCheckedHeroRegions = $( '#listar_hero_search_regions' ).attr( 'value' );

					if ( 'string' === typeof currentCheckedHeroRegions ) {
						if ( currentCheckedHeroRegions.indexOf( 'x' ) >= 0 ) {
							checkedRegions = 'x 1,' + checkedRegions;
						}

						$( '#listar_hero_search_regions' ).attr( 'value', checkedRegions );
					}
				} else {
					var featRegions = $( '#listar_manual_featured_regions' ).val();
					var finalRegions = '';
					
					if ( 'string' === typeof featRegions ) {
						if ( featRegions.indexOf( ',' ) >= 0 ) {
							var featRegionsArray = featRegions.split( ',' );
							
							for ( var re = 0; re < featRegionsArray.length; re ++ ) {
								if ( ! isNaN( featRegionsArray[ re ] ) ) {

									// Is a number!
									if ( '' === finalRegions ) {
										finalRegions += featRegionsArray[ re ] + ' 1';
									} else {
										finalRegions += ',' + featRegionsArray[ re ] + ' 1';
									}									
								}
							}
						}
					}
					
					$( '#listar_hero_search_regions' ).attr( 'value', finalRegions );
				}
				

				//$( '#listar_hero_search_regions' ).attr( 'value', '47 1,45 1' );
				
				//alert( $( '#listar_hero_search_regions' ).attr( 'value' ) );
				
				if ( $( '.listar-users-allowed-publish-listings input[type="checkbox"]' ).length ) {				
					$( '.listar-users-allowed-publish-listings input[type="checkbox"]' ).each( function () {
						var roleIsAllowed = $( this ).is( ':checked' ) ? '1' : '0';

						usersAllowedPublishListings+= '["' + $( this ).val() + '","' + roleIsAllowed + '"],';
					} );

					if ( '[' !== usersAllowedPublishListings ) {
						/* Remove last comma */
						usersAllowedPublishListings = usersAllowedPublishListings.replace( /,\s*$/, '' );
					}

					usersAllowedPublishListings += ']';
					
					$( '#listar_users_allowed_publish_listings' )
						.val( usersAllowedPublishListings )
						.attr( 'value', usersAllowedPublishListings );
				}
				
				if ( $( '#listar_automatic_cache_cleaning' ).length ) {
					cacheTimeSet = $( '#listar_automatic_cache_cleaning' ).val();
					lastCacheTimeSet = $( '#listar_automatic_cache_cleaning' ).attr( 'data-last-cache-time' );
					
					if ( parseInt( cacheTimeSet, 10 ) !== parseInt( lastCacheTimeSet, 10 ) ) {
						$( '#listar_reset_last_cache_cleaning_time' ).prop( 'checked', true );
					} else {
						$( '#listar_reset_last_cache_cleaning_time' ).prop( 'checked', false );
					}
				}

				/* Avoid line breaks */

				$( '#_job_location' ).each( function () {
					if ( 'undefined' !== typeof $( this ).attr( 'value' ) ) {
						$( this ).attr( 'value', $( this ).attr( 'value' ).replace( /( \r\ n| \n| \r\r\n|\n|\r)/gm, ' ' ) );
					} else if ( 'undefined' !== typeof $( this ).prop( 'innerHTML' ) ) {
						$( this ).prop( 'innerHTML', $( this ).prop( 'innerHTML' ).replace( /( \r\ n| \n| \r\r\n|\n|\r)/gm, ' ' ) );
					}
				} );

				/* Recommended appointment services */

				var appointmentServices = '';
				
				$( '#listar_appointments_disable' ).each( function () {
					if ( ! $( this ).is( ':checked' ) ) {

						$( 'input[name*="listar-appointment-service-"]' ).each( function () {
							var service = $( this ).val().replace( /(<([^>]+)>)/gi, '' );

							if ( 'string' == typeof service ) {

								/* Remove all tags / Remove all spaces */
								service = $( this ).val().replace( /(<([^>]+)>)/gi, '' ).replace( /\s/g, '' );;

								if ( '' !== service ) {
									var startTestHTTP  = service.substring( 0, 7 );
									var startTestHTTPS = service.substring( 0, 8 );
									
									if ( 'http://' !== startTestHTTP && 'https://' !== startTestHTTPS ) {
										
										e.preventDefault();
										e.stopPropagation();

										alert( listarLocalizeAndAjax.invalidBookingURLStart );
									} else if ( -1 === service.indexOf( 'http://' ) && -1 === service.indexOf( 'https://' ) ) {
										e.preventDefault();
										e.stopPropagation();

										alert( listarLocalizeAndAjax.invalidBookingURLHTTP );
									} else if ( -1 === service.indexOf( '.' ) ) {
										e.preventDefault();
										e.stopPropagation();

										alert( listarLocalizeAndAjax.invalidBookingURLDot );
									} else {
										if ( service.indexOf( 'http://' ) >= 0 && service.length < 12 ) {
											e.preventDefault();
											e.stopPropagation();

											alert( listarLocalizeAndAjax.invalidBookingURLLength );
										} else if ( service.indexOf( 'https://' ) >= 0 && service.length < 13 ) {
											e.preventDefault();
											e.stopPropagation();

											alert( listarLocalizeAndAjax.invalidBookingURLLength );
										} else {

											/* Validates e.g http://do.do */
											appointmentServices += service + '|||||';
										}
									}
								}
							}
						} );
				
						if ( appointmentServices.indexOf( '|||||' ) >= 0 ) {
							appointmentServices = appointmentServices.substring( 0, appointmentServices.length - 5 );
						}
						
						$( '#listar_recommended_appointment_services' ).val( appointmentServices ).attr( 'value', appointmentServices );
					}
				} );
			} );
			
			$( 'body' ).on( 'click', '.listar-pagespeed-field-cache-cleaner a', function ( e ) {
				e.preventDefault();
				e.stopPropagation();
				
				$( '#wp-admin-bar-autoptimize-delete-cache .ab-item.ab-empty-item' ).each( function () {
					$( this )[0].click();
				} );
			} );
			
			$( 'body' ).on( 'click', '.listar-pagespeed-favicon-field-show a', function ( e ) {
				e.preventDefault();
				e.stopPropagation();
				
				$( this ).parent().prop( 'outerHTML', '' );
				$( '.listar-show-favicon64-field' ).removeClass( 'hidden' );
			} );

			$( 'body' ).on( 'change', '#listar_geocoding_provider', function () {
				var geocodeProvider = $( this );

				setTimeout( function () {
					updateGeocodingProvider( geocodeProvider );
				}, 10 );
			} );

			$( 'body' ).on( 'change', '#listar_map_provider', function () {
				var mapProvider = $( this );

				setTimeout( function () {
					updateMapProvider( mapProvider );
				}, 10 );
			} );

			$( 'body' ).on( 'change', '#listar_operating_hours_format', function () {
				var hoursOutputFormat = $( this );
				
				setTimeout( function () {
					hoursOutputFormat = hoursOutputFormat.val();
					
					if ( '24' === hoursOutputFormat ) {
						$( '.listar_theme_options_field.listar_operating_hours_suffix' ).css( { display : 'table-row' } );
					} else {
						$( '.listar_theme_options_field.listar_operating_hours_suffix' ).css( { display : 'none' } );
					}
			
					if ( window.location.hash ) {
						var h2 = window.location.hash.replace( /#/g, '' );

						if ( -1 === h2.indexOf( 'directory-config' ) ) {
							$( '.listar_theme_options_field.listar_operating_hours_suffix' ).css( { display : 'none' } );
						}
					}
				}, 20 );
			} );
		}// End if().
		/* End admin custom 'Theme Options' JavaScript ****************/
	} );

} )( jQuery );
