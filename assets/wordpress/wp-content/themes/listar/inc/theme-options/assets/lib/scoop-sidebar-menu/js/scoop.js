/**
 * Scoop Sidebar Menu (Codecanyon)
 *
 * Dropdown Sidebar Menu Responsive Bootstrap Navigation, by logicalstack.
 * JavaScript to the sidebar navigation menu, located on the 'Theme Options' page ( WordPress admin ).
 *
 * @package Scoop
 */

/* Hide following variables from JSHint because they are globally declared
 earlier by other scripts */

/* global jQuery */

/* jshint esversion: 6 */

/* Set '$' to its existing value (if present) */

window.$ = window.$ || {};

( function ( $ ) {

	'use strict';

	$.fn.scoopmenu = function ( settings ) {
		var
			oid = this.attr( 'id' ),
			ScoopMenu;

		/* Scoop Menu default settings: */
		var defaults = {

			/* Common option both for vertical nad horizontal */
			themelayout: 'vertical', /* Value should be horizontal/vertical */
			MenuTrigger: 'click', /* Value should be hover/click */
			SubMenuTrigger: 'click', /* Value should be hover/click */
			activeMenuClass: 'active',
			ThemeBackgroundPattern: 'pattern6', /* Value should be */
			HeaderBackground: 'theme2', /* Value should be theme1/theme2/theme3/theme4/theme5/theme6/theme7/theme8/theme9 */
			LHeaderBackground: 'theme4', /* Value should be theme1/theme2/theme3/theme4/theme5/theme6/theme7/theme8/theme9 */
			NavbarBackground: 'theme4', /* Value should be theme1/theme2/theme3/theme4/theme5/theme6/theme7/theme8/theme9 */
			ActiveItemBackground: 'theme0', /* Value should be theme1/theme2/theme3/theme4/theme5/theme6/theme7/theme8/theme9 */
			SubItemBackground: 'theme2', /* Value should be theme1/theme2/theme3/theme4/theme5/theme6/theme7/theme8/theme9 */
			ActiveItemStyle: 'style0',
			ItemBorder: true,
			ItemBorderStyle: 'solid', /* Value should be solid/dotted/dashed */
			SubItemBorder: true,
			DropDownIconStyle: 'style1', /* Value should be style1,style2,style3 */
			FixedNavbarPosition: false,
			FixedHeaderPosition: false,

			/* Horizontal Navigation option */
			horizontalMenuplacement: 'top', /* Value should be top/bottom */
			horizontalMenulayout: 'widebox', /* Value should be wide/box/widebox */
			horizontalBrandItem: true,
			horizontalLeftNavItem: true,
			horizontalRightItem: false,
			horizontalSearchItem: false,
			horizontalBrandItemAlign: 'left',
			horizontalLeftNavItemAlign: 'right',
			horizontalRightItemAlign: 'right',
			horizontalsearchItemAlign: 'right',
			horizontalstickynavigation: false,
			horizontalNavigationView: 'view1',
			horizontalNavIsCentered: false,
			horizontalNavigationMenuIcon: true,

			/* Vertical Navigation option
			verticalMenuplacement: 'left', /* Value should be left/right */
			verticalMenulayout: 'wide', /* Value should be wide/box/widebox */
			collapseVerticalLeftHeader: true,
			VerticalSubMenuItemIconStyle: 'style6', /* Value should be style1,style2,style3 */
			VerticalNavigationView: 'view1',
			verticalMenueffect: {
				desktop: 'shrink',
				tablet: 'push',
				phone: 'overlay'
			},
			defaultVerticalMenu: {
				desktop: 'expanded', /* Value should be offcanvas/collapsed/expanded/compact/compact-acc/fullpage/ex-popover/sub-expanded */
				tablet: 'collapsed', /* Value should be offcanvas/collapsed/expanded/compact */
				phone: 'offcanvas'  /* Value should be offcanvas/collapsed/expanded/compact */
			},
			onToggleVerticalMenu: {
				desktop: 'collapsed', /* Value should be offcanvas/collapsed/expanded/compact */
				tablet: 'expanded', /* Value should be offcanvas/collapsed/expanded/compact */
				phone: 'expanded' /* Value should be offcanvas/collapsed/expanded/compact */
			}
		};

		settings = $.extend( {}, defaults, settings );

		ScoopMenu = {
			ScoopMenuInit: function () {
				ScoopMenu.Handlethemelayout();
				ScoopMenu.HandleverticalMenuplacement();
				ScoopMenu.HandlehorizontalMenuplacement();
				ScoopMenu.HandleMenulayout();
				ScoopMenu.HandleDeviceType();
				ScoopMenu.Handlecomponetheight();
				ScoopMenu.HandleMenuOnClick();
				ScoopMenu.HandleMenuTrigger();
				ScoopMenu.HandleSubMenuTrigger();
				ScoopMenu.HandleActiveItem();
				ScoopMenu.HandleOffcanvasMenu();
				ScoopMenu.HandleVerticalLeftHeader();
				ScoopMenu.HandleThemeBackground();
				ScoopMenu.HandleActiveItemStyle();
				ScoopMenu.HandleItemBorder();
				ScoopMenu.HandleBorderStyle();
				ScoopMenu.HandleSubItemBorder();
				ScoopMenu.HandleDropDownIconStyle();
				ScoopMenu.HandleOptionSelectorPanel();
				ScoopMenu.HandleNavbarPosition();
				ScoopMenu.HandleVerticalSubMenuItemIconStyle();
				ScoopMenu.HandleVerticalNavigationView();
				ScoopMenu.HandleHorizontalItemIsCentered();
				ScoopMenu.HandleHorizontalItemAlignment();
				ScoopMenu.HandleSubMenuOffset();
				ScoopMenu.HandleHorizontalStickyNavigation();
				ScoopMenu.HandleDocumentClickEvent();
				ScoopMenu.HandleVerticalScrollbar();
				ScoopMenu.HandleHorizontalMobileMenuToggle();
				ScoopMenu.horizontalNavigationMenuIcon();
				ScoopMenu.verticalNavigationSearchBar();
				ScoopMenu.safariBrowsercompatibility();
			},
			safariBrowsercompatibility: function () {
				var
					is_chrome = navigator.userAgent.indexOf( 'Chrome' ) > - 1,
					is_safari = navigator.userAgent.indexOf( 'Safari' ) > - 1,
					is_mac = ( navigator.userAgent.indexOf( 'Mac OS' ) !== - 1 ),
					is_windows = ! is_mac;

				if ( is_chrome && is_safari ) {
					is_safari = false;
				}

				if ( is_safari || is_windows ) {
					$( 'body' ).css( '-webkit-text-stroke', '0.05px' );
					$( 'body' ).css( '-webkit-font-smoothing', 'antialiased' );
				}
			},

			verticalNavigationSearchBar: function () {
				if ( 'vertical' === settings.themelayout ) {
					$( '.searchbar-toggle' ).on( 'click', function () {
						$( this ).parent( '.scoop-search' ).toggleClass( 'open' );
					} );
				}
			},
			horizontalNavigationMenuIcon: function () {
				if ( 'horizontal' === settings.themelayout ) {
					switch ( settings.horizontalNavigationMenuIcon ) {
						case false:
							$( '#' + oid + '.scoop .scoop-navbar .scoop-item > li > a .scoop-micon' ).hide();
							$( '#' + oid + '.scoop .scoop-navbar .scoop-item.scoop-search-item > li > a .scoop-micon' ).show();
							break;
						default:
					}
				}
			},
			HandleHorizontalMobileMenuToggle: function () {
				if ( 'horizontal' === settings.themelayout ) {
					$( '.scoopbrand-xs .menu-toggle a' ).on( 'click', function () {
						$( '.scoop-navbar' ).toggleClass( 'show-menu' );
					} );
				}
			},
			HandleVerticalScrollbar: function () {
				if ( 'vertical' === settings.themelayout ) {
					var satnt = settings.defaultVerticalMenu.desktop;

					if ( 'expanded' === satnt || 'compact' === satnt ) {
						var mt = settings.MenuTrigger;

						if ( 'click' === mt ) {
							$( window ).on( 'load', function () {
								$( '.scoop-navbar' ).mCustomScrollbar( {
									axis: 'y',
									autoHideScrollbar: false,
									scrollInertia: 100,
									theme: 'minimal'
								} );

								$( '.sidebar_toggle a' ).on( 'click', function ( e ) {
									var el = $( '.scoop-navbar' );

									e.preventDefault();

									if ( el.hasClass( 'mCS_destroyed' ) ) {
										el.mCustomScrollbar( {
											axis: 'y',
											autoHideScrollbar: false,
											scrollInertia: 100,
											theme: 'minimal'
										} );
									} else {
										el.mCustomScrollbar( 'destroy' );
									}
								} );
							} );
						}
					}
				}
			},
			HandleDocumentClickEvent: function () {
				function closeSubMenu() {
					$( document ).on( 'click', function ( evt ) {
						var
							target = $( evt.target ),
							sdt = $( '#' + oid ).attr( 'scoop-device-type' ),
							vnt = $( '#' + oid ).attr( 'vertical-nav-type' ),
							el = $( '#' + oid + ' .scoop-item li' );

						if ( ! target.parents( '.scoop-item' ).length ) {
							if ( 'phone' !== sdt ) {
								if ( 'expanded' !== vnt ) {
									el.removeClass( 'scoop-trigger' );
								}
							}
						}
					} );
				}

				function closeLeftbarSearch() {
					$( document ).on( 'click', function ( evt ) {
						var
							target = $( evt.target ),
							el = $( '#' + oid + ' .scoop-search' );

						if ( ! target.parents( '.scoop-search' ).length ) {
							el.removeClass( 'open' );
						}
					} );
				}

				closeSubMenu();
				closeLeftbarSearch();
			},

			HandleHorizontalStickyNavigation: function () {
				switch ( settings.horizontalstickynavigation ) {
					case true :
						$( window ).on( 'scroll', function () {
							var scrolltop = $( this ).scrollTop();

							if ( scrolltop >= 100 ) {
								$( '.scoop-navbar' ).addClass( 'stickybar' );
								$( 'stickybar' ).fadeIn( 3000 );
							} else if ( scrolltop <= 100 ) {
								$( '.scoop-navbar' ).removeClass( 'stickybar' );
								$( '.stickybar' ).fadeOut( 3000 );
							}
						} );

						break;

					case false:
						$( '.scoop-navbar' ).removeClass( 'stickybar' );
						break;
					default:
				}
			},
			HandleSubMenuOffset: function () {
				switch ( settings.themelayout ) {
					case 'horizontal' :
						var trigger = settings.SubMenuTrigger;

						if ( 'hover' === trigger ) {
							$( 'li.scoop-hasmenu' ).on( 'mouseenter mouseleave', function ( e ) {
								if ( $( '.scoop-submenu', this ).length ) {
									var elm = $( '.scoop-submenu :first', this );
									var off = elm.offset();
									var l = off.left;
									var w = elm.width();
									var docW = $( window ).width();
									var isEntirelyVisible = ( l + w <= docW );

									if ( ! isEntirelyVisible ) {
										$( this ).addClass( 'edge' );
									} else {
										$( this ).removeClass( 'edge' );
									}
								}
							} );
						} else {
							$( 'li.scoop-hasmenu' ).on( 'click', function ( e ) {
								e.preventDefault();

								if ( $( '.scoop-submenu', this ).length ) {
									var elm = $( '.scoop-submenu :first', this );
									var off = elm.offset();
									var l = off.left;
									var w = elm.width();
									var docW = $( window ).width();
									var isEntirelyVisible = ( l + w <= docW );

									if ( ! isEntirelyVisible ) {
										$( this ).toggleClass( 'edge' );
									}
								}
							} );
						}
						break;
					default:
				}// End switch().
			},
			HandleHorizontalItemIsCentered: function () {
				if ( 'horizontal' === settings.themelayout ) {
					switch ( settings.horizontalNavIsCentered ) {
						case true :
							$( '#' + oid + ' .scoop-navbar' ).addClass( 'isCentered' );
							break;
						case false:
							$( '#' + oid + ' .scoop-navbar' ).removeClass( 'isCentered' );
							break;
						default:
					}
				}
			},
			HandleHorizontalItemAlignment: function () {
				var layout = settings.themelayout;

				function branditemalignment() {
					var elm = $( '#' + oid + '.scoop .scoop-navbar .scoop-brand' );

					if ( true === settings.horizontalBrandItem ) {
						switch ( settings.horizontalBrandItemAlign ) {
							case 'left' :
								elm.removeClass( 'scoop-right-align' );
								elm.addClass( 'scoop-left-align' );
								break;
							case 'right' :
								elm.removeClass( 'scoop-left-align' );
								elm.addClass( 'scoop-right-align' );
								break;
							default:
						}
					} else {
						elm.hide();
					}
				}

				function leftitemalignment() {
					var elm = $( '#' + oid + '.scoop .scoop-navbar .scoop-item.scoop-left-item' );

					if ( true === settings.horizontalLeftNavItem ) {
						switch ( settings.horizontalLeftNavItemAlign ) {
							case 'left' :
								elm.removeClass( 'scoop-right-align' );
								elm.addClass( 'scoop-left-align' );
								break;
							case 'right' :
								elm.removeClass( 'scoop-left-align' );
								elm.addClass( 'scoop-right-align' );
								break;
							default:
						}
					} else {
						elm.hide();
					}
				}

				function rightitemalignment() {
					var elm = $( '#' + oid + '.scoop .scoop-navbar .scoop-item.scoop-right-item' );

					if ( true === settings.horizontalRightItem ) {
						switch ( settings.horizontalRightItemAlign ) {
							case 'left' :
								elm.removeClass( 'scoop-right-align' );
								elm.addClass( 'scoop-left-align' );
								break;
							case 'right' :
								elm.removeClass( 'scoop-left-align' );
								elm.addClass( 'scoop-right-align' );
								break;
							default:
						}
					} else {
						elm.hide();
					}
				}

				function searchitemalignment() {
					var elm = $( '#' + oid + '.scoop .scoop-navbar .scoop-search-item' );

					if ( true === settings.horizontalSearchItem ) {
						switch ( settings.horizontalsearchItemAlign ) {
							case 'left' :
								elm.removeClass( 'scoop-right-align' );
								elm.addClass( 'scoop-left-align' );
								break;
							case 'right' :
								elm.removeClass( 'scoop-left-align' );
								elm.addClass( 'scoop-right-align' );
								break;
							default:
						}
					} else {
						elm.hide();
					}
				}

				if ( 'horizontal' === layout ) {
					if ( false === settings.horizontalNavIsCentered ) {
						branditemalignment();
						leftitemalignment();
						rightitemalignment();
						searchitemalignment();
					}
				}
			},
			HandleVerticalNavigationView: function () {
				switch ( settings.themelayout ) {
					case 'vertical' :
						var ev = settings.VerticalNavigationView;
						$( '#' + oid + '.scoop' ).attr( 'vnavigation-view', ev );
						break;
					case 'horizontal' :
						var ev2 = settings.horizontalNavigationView;
						$( '#' + oid + '.scoop' ).attr( 'hnavigation-view', ev2 );
						break;
					default:
				}
			},
			HandleVerticalSubMenuItemIconStyle: function () {
				switch ( settings.themelayout ) {
					case 'vertical' :
						var ev = settings.VerticalSubMenuItemIconStyle;
						$( '#' + oid + ' .scoop-navbar .scoop-hasmenu' ).attr( 'subitem-icon', ev );
						break;
					case 'horizontal' :
						$( '#' + oid + ' .scoop-navbar .scoop-hasmenu' ).attr( 'subitem-icon', ev );
						break;
					default:
				}
			},
			HandleNavbarPosition: function () {
				var
					navposition = settings.FixedNavbarPosition,
					headerposition = settings.FixedHeaderPosition;

				switch ( settings.themelayout ) {
					case 'vertical' :
						if ( true === navposition ) {
							$( '#' + oid + ' .scoop-navbar' ).attr( 'scoop-navbar-position', 'fixed' );
							$( '#' + oid + ' .scoop-header .scoop-left-header' ).attr( 'scoop-lheader-position', 'fixed' );
						} else {
							$( '#' + oid + ' .scoop-navbar' ).attr( 'scoop-navbar-position', 'absolute' );
							$( '#' + oid + ' .scoop-header .scoop-left-header' ).attr( 'scoop-lheader-position', 'absolute' );
						}
						if ( true === headerposition ) {
							$( '#' + oid + ' .scoop-header' ).attr( 'scoop-header-position', 'fixed' );
							$( '#' + oid + ' .scoop-main-container' ).css( 'margin-top', $( '.scoop-header' ).outerHeight() );

						} else {
							$( '#' + oid + ' .scoop-header' ).attr( 'scoop-header-position', 'relative' );
							$( '#' + oid + ' .scoop-main-container' ).css( 'margin-top', '0px' );
						}
						break;
					case 'horizontal' :
						if ( true === navposition ) {
							$( '#' + oid + ' .scoop-navbar' ).attr( 'scoop-navbar-position', 'fixed' );
							$( '#' + oid + ' .scoop-header' ).attr( 'scoop-header-position', 'fixed' );
							$( '#' + oid + ' .scoop-navbar' ).css( 'margin-top', $( '.scoop-header' ).outerHeight() );
						} else {
							$( '#' + oid + ' .scoop-navbar' ).attr( 'scoop-navbar-position', ' ' );
							$( '#' + oid + ' .scoop-header' ).attr( 'scoop-header-position', 'relative' );
							$( '#' + oid + ' .scoop-navbar' ).css( 'margin-top', '0px' );
						}
						break;
					default:
				}
			},
			HandleOptionSelectorPanel: function () {
				$( '.selector-toggle > a' ).on( 'click', function () {
					$( '#styleSelector' ).toggleClass( 'open' );
				} );

			},
			HandleDropDownIconStyle: function () {
				var ev = settings.DropDownIconStyle;

				switch ( settings.themelayout ) {
					case 'vertical' :
						$( '#' + oid + ' .scoop-navbar .scoop-hasmenu' ).attr( 'dropdown-icon', ev );
						break;
					case 'horizontal' :
						$( '#' + oid + ' .scoop-navbar .scoop-hasmenu' ).attr( 'dropdown-icon', ev );
						break;
					default:
				}
			},
			HandleSubItemBorder: function () {
				switch ( settings.SubItemBorder ) {
					case true :
						$( '#' + oid + ' .scoop-navbar .scoop-item' ).attr( 'subitem-border', 'true' );
						break;
					case false:
						$( '#' + oid + ' .scoop-navbar .scoop-item' ).attr( 'subitem-border', 'false' );
						break;
					default:
				}
			},
			HandleBorderStyle: function () {
				var ev = settings.ItemBorderStyle;

				switch ( settings.ItemBorder ) {
					case true :
						$( '#' + oid + ' .scoop-navbar .scoop-item' ).attr( 'item-border-style', ev );
						break;
					case false:
						$( '#' + oid + ' .scoop-navbar .scoop-item' ).attr( 'item-border-style', '' );
						break;
					default:
				}
			},
			HandleItemBorder: function () {
				switch ( settings.ItemBorder ) {
					case true :
						$( '#' + oid + ' .scoop-navbar .scoop-item' ).attr( 'item-border', 'true' );
						break;
					case false:
						$( '#' + oid + ' .scoop-navbar .scoop-item' ).attr( 'item-border', 'false' );
						break;
					default:
				}
			},
			HandleActiveItemStyle: function () {
				var ev = settings.ActiveItemStyle;

				if ( undefined !== ev && '' !== ev ) {
					$( '#' + oid + ' .scoop-navbar' ).attr( 'active-item-style', ev );
				} else {
					$( '#' + oid + ' .scoop-navbar' ).attr( 'active-item-style', 'style0' );
				}
			},
			HandleThemeBackground: function () {
				function themebackgroundpattern() {
					var ev = settings.ThemeBackgroundPattern;

					if ( undefined !== ev && '' !== ev ) {
						$( 'body' ).attr( 'themebg-pattern', ev );
					} else {
						$( 'body' ).attr( 'themebg-pattern', 'pattern1' );
					}
				}

				function setheadertheme() {
					var ev = settings.HeaderBackground;

					if ( undefined !== ev && '' !== ev ) {
						$( '#' + oid + ' .scoop-header' ).attr( 'header-theme', ev );
					} else {
						$( '#' + oid + ' .scoop-header' ).attr( 'header-theme', 'theme1' );
					}
				}

				function setlheadertheme() {
					var ev = settings.LHeaderBackground;

					if ( undefined !== ev && '' !== ev ) {
						$( '#' + oid + ' .scoop-header .scoop-left-header' ).attr( 'lheader-theme', ev );
					} else {
						$( '#' + oid + ' .scoop-header .scoop-left-header' ).attr( 'lheader-theme', 'theme1' );
					}
				}

				function setnavbartheme() {
					var ev = settings.NavbarBackground;

					if ( undefined !== ev && '' !== ev ) {
						$( '#' + oid + ' .scoop-navbar' ).attr( 'navbar-theme', ev );
					} else {
						$( '#' + oid + ' .scoop-navbar' ).attr( 'navbar-theme', 'theme1' );
					}
				}

				function setactiveitemtheme() {
					var ev = settings.ActiveItemBackground;

					if ( undefined !== ev && '' !== ev ) {
						$( '#' + oid + ' .scoop-navbar' ).attr( 'active-item-theme', ev );
					} else {
						$( '#' + oid + ' .scoop-navbar' ).attr( 'active-item-theme', 'theme1' );
					}
				}

				function setsubitemtheme() {
					var ev = settings.SubItemBackground;

					if ( undefined !== ev && '' !== ev ) {
						$( '#' + oid + ' .scoop-navbar' ).attr( 'sub-item-theme', ev );
					} else {
						$( '#' + oid + ' .scoop-navbar' ).attr( 'sub-item-theme', 'theme1' );
					}
				}

				themebackgroundpattern();
				setheadertheme();
				setlheadertheme();
				setnavbartheme();
				setactiveitemtheme();
				setsubitemtheme();

			},
			HandleVerticalLeftHeader: function () {
				if ( 'vertical' === settings.themelayout ) {
					switch ( settings.collapseVerticalLeftHeader ) {
						case true :
							$( '#' + oid + ' .scoop-header' ).addClass( 'iscollapsed' );
							$( '#' + oid + ' .scoop-header' ).removeClass( 'nocollapsed' );
							$( '#' + oid + '.scoop' ).addClass( 'iscollapsed' );
							$( '#' + oid + '.scoop' ).removeClass( 'nocollapsed' );
							break;
						case false:
							$( '#' + oid + ' .scoop-header' ).removeClass( 'iscollapsed' );
							$( '#' + oid + ' .scoop-header' ).addClass( 'nocollapsed' );
							$( '#' + oid + '.scoop' ).removeClass( 'iscollapsed' );
							$( '#' + oid + '.scoop' ).addClass( 'nocollapsed' );
							break;
						default:
					}
				} else {
					return false;
				}
			},
			HandleOffcanvasMenu: function () {
				if ( 'vertical' === settings.themelayout ) {
					var vnt = $( '#' + oid ).attr( 'vertical-nav-type' );

					if ( 'offcanvas' === vnt ) {
						$( '#' + oid ).attr( 'vertical-layout', 'wide' );
					}
				}
			},
			HandleActiveItem: function () {
				switch ( settings.activeMenuClass ) {
					case  'active' :
						$( 'li:not("li.scoop-hasmenu")' ).on( 'click', function () {
							var str = $( this ).closest( '.scoop-submenu' ).length;

							if ( 0 === str ) {
								$( this ).closest( '.scoop-inner-navbar' ).find( 'li.active' ).removeClass( 'active' );
								$( this ).addClass( 'active' );
							} else {
								if ( $( this ).hasClass( 'active' ) ) {
									$( this ).removeClass( 'active' );
								} else {
									$( this ).closest( '.scoop-inner-navbar' ).find( 'li.active' ).removeClass( 'active' );
									$( this ).parents( '.scoop-hasmenu' ).addClass( 'active' );
									$( this ).addClass( 'active' );
								}
							}
						} );

						break;

					case false:
						$( '.scoop-header' ).removeClass( settings.navbbgclass );
						break;
					default:
				}
			},
			HandleSubMenuTrigger: function () {
				switch ( settings.SubMenuTrigger ) {
					case 'hover' :

						/* Initialize */
						var
							$window = $( window ),
							$dropdown = $( '.scoop-submenu > li' );

						var
							currentSize = $window.width(),
							currentEvent = '';

						$( '#' + oid + ' .scoop-navbar .scoop-hasmenu' ).addClass( 'is-hover' );

						/* Attach current event on load */
						if ( currentSize >= 767 ) {
							bindTwo( 'hover' );
						} else {
							bindTwo( 'click' );
						}

						/* Atach window resize event */
						$window.resize( function () {

							/* Get windows new size */
							var newSize = $window.width();

							/* Exit if size is same */
							if ( currentSize === newSize ) {
								return;
							}

							/* Check if size changed, if its greater/smaller and which current event is attached so we dont attach multiple events */
							if ( newSize >= 767 && 'hover' !== currentEvent ) {
								bindTwo( 'hover' );
							} else if ( newSize < 767 && 'click' !== currentEvent ) {
								bindTwo( 'click' );
							}

							/* Update new size */
							currentSize = newSize;
						} );

						function bindTwo( eventType ) {
							if ( 'hover' === eventType ) {

								/* Update currentEvent */
								currentEvent = eventType;

								/* Make sure all previous events are removed and attach hover */
								$dropdown.off( 'click' ).off( 'mouseenter mouseleave' ).hover(
									function () {
										$( this ).addClass( 'scoop-trigger' );
									},
									function () {
										$( this ).removeClass( 'scoop-trigger' );
									}
								);

							} else if ( 'click' === eventType ) {

								/* Update currentEvent */
								currentEvent = eventType;

								/* Make sure all previous events are removed and attach hover */
								$dropdown.off( 'mouseenter mouseleave' ).off( 'click' ).on( 'click',
									function ( e ) {
										var str = $( this ).closest( '.scoop-submenu' ).length;

										e.stopPropagation();

										if ( 0 === str ) {
											if ( $( this ).hasClass( 'scoop-trigger' ) ) {
												$( this ).removeClass( 'scoop-trigger' );
											} else {
												$( this ).closest( '.scoop-inner-navbar' ).find( 'li.scoop-trigger' ).removeClass( 'scoop-trigger' );
												$( this ).addClass( 'scoop-trigger' );
											}
										} else {
											if ( $( this ).hasClass( 'scoop-trigger' ) ) {
												$( this ).removeClass( 'scoop-trigger' );
											} else {
												$( this ).closest( '.scoop-submenu' ).find( 'li.scoop-trigger' ).removeClass( 'scoop-trigger' );
												$( this ).addClass( 'scoop-trigger' );
											}
										}
									}
								);
							}// End if().
						}

						break;

					case 'click' :
						$( '#' + oid + ' .scoop-navbar .scoop-hasmenu' ).removeClass( 'is-hover' );

						$( '.scoop-submenu > li' ).on( 'click', function ( e ) {
							var str = $( this ).closest( '.scoop-submenu' ).length;

							e.stopPropagation();

							if ( 0 === str ) {
								if ( $( this ).hasClass( 'scoop-trigger' ) ) {
									$( this ).removeClass( 'scoop-trigger' );
								} else {
									$( this ).closest( '.scoop-inner-navbar' ).find( 'li.scoop-trigger' ).removeClass( 'scoop-trigger' );
									$( this ).addClass( 'scoop-trigger' );
								}
							} else {
								if ( $( this ).hasClass( 'scoop-trigger' ) ) {
									$( this ).removeClass( 'scoop-trigger' );
								} else {
									$( this ).closest( '.scoop-submenu' ).find( 'li.scoop-trigger' ).removeClass( 'scoop-trigger' );
									$( this ).addClass( 'scoop-trigger' );
								}
							}
						} );

						break;
				}// End switch().
			},
			HandleMenuTrigger: function () {
				switch ( settings.MenuTrigger ) {
					case 'hover' :

						/* Initialize */
						var
							$window = $( window ),
							$dropdown = $( '.scoop-item > li' );

						var
							currentSize = $window.width(),
							currentEvent = '';

						$( '#' + oid + ' .scoop-navbar' ).addClass( 'is-hover' );

						/* Attach current event on load */
						if ( currentSize >= 767 ) {
							bindOne( 'hover' );
						} else {
							bindOne( 'click' );
						}

						/* Atach window resize event */
						$window.resize( function () {

							/* Get windows new size */
							var newSize = $window.width();

							/* Exit if size is same */
							if ( currentSize === newSize ) {
								return;
							}

							/* Check if size changed, if its greater/smaller and which current event is attached so we dont attach multiple events */
							if ( newSize >= 767 && 'hover' !== currentEvent ) {
								bindOne( 'hover' );
							} else if ( newSize < 767 && 'click' !== currentEvent ) {
								bindOne( 'click' );
							}

							/* Update new size */
							currentSize = newSize;
						} );
						function bindOne( eventType ) {
							if ( 'hover' === eventType ) {

								/* Update currentEvent */
								currentEvent = eventType;

								/* Make sure all previous events are removed and attach hover */
								$dropdown.off( 'click' ).off( 'mouseenter mouseleave' ).hover(
									function () {
										$( this ).addClass( 'scoop-trigger' );
									},
									function () {
										$( this ).removeClass( 'scoop-trigger' );
									}
								);
							} else if ( 'click' === eventType ) {

								/* Update currentEvent */
								currentEvent = eventType;

								/* Make sure all previous events are removed and attach hover */
								$dropdown.off( 'mouseenter mouseleave' ).off( 'click' ).on( 'click',
									function () {
										if ( $( this ).hasClass( 'scoop-trigger' ) ) {
											$( this ).removeClass( 'scoop-trigger' );
										} else {
											$( this ).closest( '.scoop-inner-navbar' ).find( 'li.scoop-trigger' ).removeClass( 'scoop-trigger' );
											$( this ).addClass( 'scoop-trigger' );
										}
									}
								);
							}
						}

						break;

					case 'click' :
						$( '#' + oid + ' .scoop-navbar' ).removeClass( 'is-hover' );

						$( '.scoop-item > li ' ).on( 'click', function () {
							if ( $( this ).hasClass( 'scoop-trigger' ) ) {
								$( this ).removeClass( 'scoop-trigger' );
							} else {
								$( this ).closest( '.scoop-inner-navbar' ).find( 'li.scoop-trigger' ).removeClass( 'scoop-trigger' );
								$( this ).addClass( 'scoop-trigger' );
							}
						} );

						break;
				}// End switch().
			},
			HandleMenuOnClick: function () {
				var totalwidth = $( window )[0].innerWidth;

				if ( 'vertical' === settings.themelayout ) {
					$( '.sidebar_toggle a, .scoop-overlay-box' ).on( 'click', function () {
						var
							dt = $( '#' + oid ).attr( 'scoop-device-type' ),
							dm,
							dn,
							dmc;

						$( this ).parent().find( '.menu-icon' ).toggleClass( 'is-clicked' );

						if ( 'desktop' === dt ) {
							dmc = settings.onToggleVerticalMenu.desktop;
							dm = settings.defaultVerticalMenu.desktop;
							dn = $( '#' + oid ).attr( 'vertical-nav-type' );

							if ( dn === dm ) {
								$( '#' + oid ).attr( 'vertical-nav-type', dmc );
							} else if ( dn === dmc ) {
								$( '#' + oid ).attr( 'vertical-nav-type', dm );
							} else {
								return false;
							}

						} else if ( 'tablet' === dt ) {
							var
								tmc = settings.onToggleVerticalMenu.tablet,
								tm = settings.defaultVerticalMenu.tablet,
								tn = $( '#' + oid ).attr( 'vertical-nav-type' );

							if ( tn === tm ) {
								$( '#' + oid ).attr( 'vertical-nav-type', tmc );
							} else if ( dn === dmc ) {
								$( '#' + oid ).attr( 'vertical-nav-type', tm );
							}
						} else if ( 'phone' === dt ) {
							var
								pmc = settings.onToggleVerticalMenu.phone,
								pm = settings.defaultVerticalMenu.phone,
								pn = $( '#' + oid ).attr( 'vertical-nav-type' );

							if ( pn === pm ) {
								$( '#' + oid ).attr( 'vertical-nav-type', pmc );
							} else if ( dn === dmc ) {
								$( '#' + oid ).attr( 'vertical-nav-type', pm );
							}
						}// End if().

						$( '.scoop' ).addClass( 'scoop-toggle-animate' );

						setTimeout( function () {
							$( '.scoop' ).removeClass( 'scoop-toggle-animate' );
						}, 250 );
					} );

				} else if ( 'horizontal' === settings.themelayout ) {
					if ( totalwidth >= 768 && totalwidth <= 1024 ) {
						$( '#' + oid ).attr( 'scoop-device-type', 'tablet' );
					} else if ( totalwidth < 768 ) {
						$( '#' + oid ).attr( 'scoop-device-type', 'phone' );
					} else {
						$( '#' + oid ).attr( 'scoop-device-type', 'desktop' );
					}
				}// End if().
			},
			Handlecomponetheight: function () {
				function setHeight() {
					var
						WH = $( window ).height(),
						HH = $( '.scoop-header' ).innerHeight();

					var
						contentHH = WH - HH,
						contentVH = WH - HH,
						lpanelH = WH - HH;

					if ( 'horizontal' === settings.themelayout ) {
						$( '.scoop-main-container' ).css( 'min-height', contentHH );
					} else if ( 'vertical' === settings.themelayout ) {
						if ( contentVH >= lpanelH ) {
							$( '.scoop-main-container' ).css( 'min-height', contentVH );
						} else {
							$( '.scoop-main-container' ).css( 'min-height', lpanelH );
						}
					} else {
						return false;
					}
				}

				setHeight();

				$( window ).resize( function () {
					setHeight();
				} );
			},
			HandleDeviceType: function () {
				function devicesize() {
					var totalwidth = $( window )[0].innerWidth;

					if ( settings.themelayout === 'vertical' ) {
						if ( totalwidth >= 768 && totalwidth <= 1024 ) {
							var
								value = settings.defaultVerticalMenu.tablet,
								ev = settings.verticalMenueffect.tablet;

							$( '#' + oid ).attr( 'scoop-device-type', 'tablet' );

							if ( undefined !== value && '' !== value ) {
								$( '#' + oid ).attr( 'vertical-nav-type', value );
							} else {
								$( '#' + oid ).attr( 'vertical-nav-type', 'collapsed' );
							}

							if ( undefined !== ev && '' !== value ) {
								$( '#' + oid ).attr( 'vertical-effect', ev );
							} else {
								$( '#' + oid ).attr( 'vertical-effect', 'shrink' );
							}

						} else if ( totalwidth < 768 ) {
							var
								value2 = settings.defaultVerticalMenu.phone,
								ev3 = settings.verticalMenueffect.phone;

							$( '#' + oid ).attr( 'scoop-device-type', 'phone' );

							if ( undefined !== value2 && '' !== value2 ) {
								$( '#' + oid ).attr( 'vertical-nav-type', value2 );
							} else {
								$( '#' + oid ).attr( 'vertical-nav-type', 'offcanvas' );
							}

							if ( undefined !== ev3 && '' !== value2 ) {
								$( '#' + oid ).attr( 'vertical-effect', ev3 );
							} else {
								$( '#' + oid ).attr( 'vertical-effect', 'push' );
							}

						} else {
							var
								value3 = settings.defaultVerticalMenu.desktop,
								ev4 = settings.verticalMenueffect.desktop;

							$( '#' + oid ).attr( 'scoop-device-type', 'desktop' );

							if ( undefined !== value3 && '' !== value3 ) {
								$( '#' + oid ).attr( 'vertical-nav-type', value3 );
							} else {
								$( '#' + oid ).attr( 'vertical-nav-type', 'expanded' );
							}

							if ( undefined !== ev4 && '' !== value3 ) {
								$( '#' + oid ).attr( 'vertical-effect', ev4 );
							} else {
								$( '#' + oid ).attr( 'vertical-effect', 'shrink' );
							}
						}// End if().

					} else if ( 'horizontal' === settings.themelayout ) {
						if ( totalwidth >= 768 && totalwidth <= 1024 ) {
							$( '#' + oid ).attr( 'scoop-device-type', 'tablet' );
						} else if ( totalwidth < 768 ) {
							$( '#' + oid ).attr( 'scoop-device-type', 'phone' );
						} else {
							$( '#' + oid ).attr( 'scoop-device-type', 'desktop' );
						}
					}// End if().
				}

				devicesize();

				$( window ).resize( function () {
					var
						tw = $( window )[0].innerWidth,
						dt = $( '#' + oid ).attr( 'scoop-device-type' );

					if ( 'desktop' === dt && tw < 1024 ) {
						devicesize();
					} else if ( 'phone' === dt && tw > 768 ) {
						devicesize();
					} else if ( 'tablet' === dt && tw < 768 ) {
						devicesize();
					} else if ( 'tablet' === dt && tw > 1024 ) {
						devicesize();
					}
				} );
			},
			HandleMenulayout: function () {
				if ( 'vertical' === settings.themelayout ) {
					switch ( settings.verticalMenulayout ) {
						case 'wide' :
							$( '#' + oid ).attr( 'vertical-layout', 'wide' );
							break;
						case 'box' :
							$( '#' + oid ).attr( 'vertical-layout', 'box' );
							break;
						case 'widebox' :
							$( '#' + oid ).attr( 'vertical-layout', 'widebox' );
							break;
						default:
					}
				} else if ( 'horizontal' === settings.themelayout ) {
					switch ( settings.horizontalMenulayout ) {
						case 'wide' :
							$( '#' + oid ).attr( 'horizontal-layout', 'wide' );
							break;
						case 'box' :
							$( '#' + oid ).attr( 'horizontal-layout', 'box' );
							break;
						case 'widebox' :
							$( '#' + oid ).attr( 'horizontal-layout', 'widebox' );
							break;
						default:
					}
				} else {
					return false;
				}

			},
			HandlehorizontalMenuplacement: function () {
				if ( 'horizontal' === settings.themelayout ) {
					switch ( settings.horizontalMenuplacement ) {
						case 'bottom' :
							$( '#' + oid ).attr( 'horizontal-placement', 'bottom' );
							break;
						case 'top' :
							$( '#' + oid ).attr( 'horizontal-placement', 'top' );
							break;
						default:
					}
				} else {
					$( '#' + oid ).removeAttr( 'horizontal-placement' );
				}
			},
			HandleverticalMenuplacement: function () {
				if ( 'vertical' === settings.themelayout ) {
					switch ( settings.verticalMenuplacement ) {
						case 'left' :
							$( '#' + oid ).attr( 'vertical-placement', 'left' );
							break;
						case 'right' :
							$( '#' + oid ).attr( 'vertical-placement', 'right' );
							break;
						default:
					}
				} else {
					$( '#' + oid ).removeAttr( 'vertical-placement' );
				}
			},
			Handlethemelayout: function () {
				switch ( settings.themelayout ) {
					case 'horizontal' :
						$( '#' + oid ).attr( 'theme-layout', 'horizontal' );
						break;
					case 'vertical' :
						$( '#' + oid ).attr( 'theme-layout', 'vertical' );
						break;
					default:
				}
			}
		};

		ScoopMenu.ScoopMenuInit();
	};

	/* Custom Scoop Menu **************************************************/

	$( document ).ready( function () {
		$( '#scoop' ).scoopmenu( {
			themelayout: 'vertical',
			verticalMenuplacement: 'left', /* Value should be left/right */
			verticalMenulayout: 'wide', /* Value should be wide/box/widebox */
			MenuTrigger: 'hover',
			SubMenuTrigger: 'hover',
			activeMenuClass: 'active',
			ThemeBackgroundPattern: 'pattern6',
			HeaderBackground: 'theme2',
			LHeaderBackground: 'theme2',
			NavbarBackground: 'theme2',
			ActiveItemBackground: 'theme0',
			SubItemBackground: 'theme2',
			ActiveItemStyle: 'style0',
			ItemBorder: true,
			ItemBorderStyle: 'solid',
			SubItemBorder: true,
			DropDownIconStyle: 'style1', /* Value should be style1,style2,style3 */
			FixedNavbarPosition: false,
			FixedHeaderPosition: false,
			collapseVerticalLeftHeader: true,
			VerticalSubMenuItemIconStyle: 'style6', /* Value should be style1,style2,style3,style4,style5,style6 */
			VerticalNavigationView: 'view1',
			verticalMenueffect: {
				desktop: 'shrink',
				tablet: 'push',
				phone: 'overlay'
			},
			defaultVerticalMenu: {
				desktop: 'ex-popover', /* Value should be offcanvas/collapsed/expanded/compact/compact-acc/fullpage/ex-popover/sub-expanded */
				tablet: 'collapsed', /* Value should be offcanvas/collapsed/expanded/compact/fullpage/ex-popover/sub-expanded */
				phone: 'offcanvas'		/* Value should be offcanvas/collapsed/expanded/compact/fullpage/ex-popover/sub-expanded */
			},
			onToggleVerticalMenu: {
				desktop: 'collapsed', /* Value should be offcanvas/collapsed/expanded/compact/fullpage/ex-popover/sub-expanded */
				tablet: 'expanded', /* Value should be offcanvas/collapsed/expanded/compact/fullpage/ex-popover/sub-expanded */
				phone: 'expanded' /* Value should be offcanvas/collapsed/expanded/compact/fullpage/ex-popover/sub-expanded */
			}
		} );

		/* Left header Theme Change function Start */
		function handleleftheadertheme() {
			$( '.theme-color > a.leftheader-theme' ).on( 'click', function () {
				var lheadertheme = $( this ).attr( 'lheader-theme' );
				$( '.scoop-header .scoop-left-header' ).attr( 'lheader-theme', lheadertheme );
			} );
		}

		handleleftheadertheme();

		/* Left header Theme Change function Close */
		/* Header Theme Change function Start */
		function handleheadertheme() {
			$( '.theme-color > a.header-theme' ).on( 'click', function () {
				var headertheme = $( this ).attr( 'header-theme' );
				$( '.scoop-header' ).attr( 'header-theme', headertheme );
			} );
		}

		handleheadertheme();

		/* Header Theme Change function Close */
		/* Navbar Theme Change function Start */
		function handlenavbartheme() {
			$( '.theme-color > a.navbar-theme' ).on( 'click', function () {
				var navbartheme = $( this ).attr( 'navbar-theme' );
				$( '.scoop-navbar' ).attr( 'navbar-theme', navbartheme );
			} );
		}

		handlenavbartheme();

		/* Navbar Theme Change function Close */
		/* Active Item Theme Change function Start */
		function handleactiveitemtheme() {
			$( '.theme-color > a.active-item-theme' ).on( 'click', function () {
				var activeitemtheme = $( this ).attr( 'active-item-theme' );
				$( '.scoop-navbar' ).attr( 'active-item-theme', activeitemtheme );
			} );
		}

		handleactiveitemtheme();

		/* Active Item Theme Change function Close */
		/* SubItem Theme Change function Start */
		function handlesubitemtheme() {
			$( '.theme-color > a.sub-item-theme' ).on( 'click', function () {
				var subitemtheme = $( this ).attr( 'sub-item-theme' );
				$( '.scoop-navbar' ).attr( 'sub-item-theme', subitemtheme );
			} );
		}

		handlesubitemtheme();

		/* SubItem Theme Change function Close */
		/* Theme background pattren Change function Start */
		function handlethemebgpattern() {
			$( '.theme-color > a.themebg-pattern' ).on( 'click', function () {
				var themebgpattern = $( this ).attr( 'themebg-pattern' );
				$( 'body' ).attr( 'themebg-pattern', themebgpattern );
			} );
		}

		handlethemebgpattern();

		/* Theme background pattren Change function Close */
		/* Vertical Navigation View Change function start*/
		function handleVerticalNavigationViewChange() {
			$( '#navigation-view' ).val( 'view1' ).on( 'change', function ( get_value ) {
				get_value = $( this ).val();
				$( '.scoop' ).attr( 'vnavigation-view', get_value );
			} );
		}

		handleVerticalNavigationViewChange();

		/* Theme Layout Change function Close*/
		/* Theme Layout Change function start*/
		function handlethemeverticallayout() {
			$( '#theme-layout' ).val( 'wide' ).on( 'change', function ( get_value ) {
				get_value = $( this ).val();
				$( '.scoop' ).attr( 'vertical-layout', get_value );
			} );
		}

		handlethemeverticallayout();

		/* Theme Layout Change function Close*/
		/* Menu effect change function start*/
		function handleverticalMenueffect() {
			$( '#vertical-menu-effect' ).val( 'shrink' ).on( 'change', function ( get_value ) {
				get_value = $( this ).val();
				$( '.scoop' ).attr( 'vertical-effect', get_value );
			} );
		}

		handleverticalMenueffect();

		/* Menu effect change function Close*/
		/* Vertical Menu Placement change function start*/
		function handleverticalMenuplacement() {
			$( '#vertical-navbar-placement' ).val( 'left' ).on( 'change', function ( get_value ) {
				get_value = $( this ).val();
				$( '.scoop' ).attr( 'vertical-placement', get_value );
				$( '.scoop-navbar' ).attr( 'scoop-navbar-position', 'absolute' );
				$( '.scoop-header .scoop-left-header' ).attr( 'scoop-lheader-position', 'relative' );
			} );
		}

		handleverticalMenuplacement();

		/* Vertical Menu Placement change function Close*/
		/* Vertical Active Item Style change function Start*/
		function handleverticalActiveItemStyle() {
			$( '#vertical-activeitem-style' ).val( 'style1' ).on( 'change', function ( get_value ) {
				get_value = $( this ).val();
				$( '.scoop-navbar' ).attr( 'active-item-style', get_value );
			} );
		}

		handleverticalActiveItemStyle();

		/* Vertical Active Item Style change function Close*/
		/* Vertical Item border change function Start*/
		function handleVerticalIItemBorder() {
			$( '#vertical-item-border' ).change( function () {
				if ( $( this ).is( ':checked' ) ) {
					$( '.scoop-navbar .scoop-item' ).attr( 'item-border', 'false' );
				} else {
					$( '.scoop-navbar .scoop-item' ).attr( 'item-border', 'true' );
				}
			} );
		}

		handleVerticalIItemBorder();

		/* Vertical Item border change function Close*/
		/* Vertical SubItem border change function Start*/
		function handleVerticalSubIItemBorder() {
			$( '#vertical-subitem-border' ).change( function () {
				if ( $( this ).is( ':checked' ) ) {
					$( '.scoop-navbar .scoop-item' ).attr( 'subitem-border', 'false' );
				} else {
					$( '.scoop-navbar .scoop-item' ).attr( 'subitem-border', 'true' );
				}
			} );
		}

		handleVerticalSubIItemBorder();

		/* Vertical SubItem border change function Close*/
		/* Vertical Item border Style change function Start*/
		function handleverticalboderstyle() {
			$( '#vertical-border-style' ).val( 'solid' ).on( 'change', function ( get_value ) {
				get_value = $( this ).val();
				$( '.scoop-navbar .scoop-item' ).attr( 'item-border-style', get_value );
			} );
		}

		handleverticalboderstyle();

		/* Vertical Item border Style change function Close*/
		/* Vertical Dropdown Icon change function Start*/
		function handleVerticalDropDownIconStyle() {
			$( '#vertical-dropdown-icon' ).val( 'style1' ).on( 'change', function ( get_value ) {
				get_value = $( this ).val();
				$( '.scoop-navbar .scoop-hasmenu' ).attr( 'dropdown-icon', get_value );
			} );
		}

		handleVerticalDropDownIconStyle();

		/* Vertical Dropdown Icon change function Close*/
		/* Vertical SubItem Icon change function Start*/
		function handleVerticalSubMenuItemIconStyle() {
			$( '#vertical-subitem-icon' ).val( 'style5' ).on( 'change', function ( get_value ) {
				get_value = $( this ).val();
				$( '.scoop-navbar .scoop-hasmenu' ).attr( 'subitem-icon', get_value );
			} );
		}

		handleVerticalSubMenuItemIconStyle();

		/* Vertical SubItem Icon change function Close*/
		/* Vertical Navbar Position change function Start*/
		function handlesidebarposition() {
			$( '#sidebar-position' ).change( function () {
				if ( $( this ).is( ':checked' ) ) {
					$( '.scoop-navbar' ).attr( 'scoop-navbar-position', 'fixed' );
					$( '.scoop-header .scoop-left-header' ).attr( 'scoop-lheader-position', 'fixed' );
				} else {
					$( '.scoop-navbar' ).attr( 'scoop-navbar-position', 'absolute' );
					$( '.scoop-header .scoop-left-header' ).attr( 'scoop-lheader-position', 'relative' );
				}
			} );
		}

		handlesidebarposition();

		/* Vertical Navbar Position change function Close*/
		/* Vertical Header Position change function Start*/
		function handleheaderposition() {
			$( '#header-position' ).change( function () {
				if ( $( this ).is( ':checked' ) ) {
					$( '.scoop-header' ).attr( 'scoop-header-position', 'fixed' );
					$( '.scoop-main-container' ).css( 'margin-top', $( '.scoop-header' ).outerHeight() );
				} else {
					$( '.scoop-header' ).attr( 'scoop-header-position', 'relative' );
					$( '.scoop-main-container' ).css( 'margin-top', '0px' );
				}
			} );
		}

		handleheaderposition();

		/* Vertical Header Position change function Close*/
		/* Collapseable Left Header Change Function Start here*/
		function handlecollapseLeftHeader() {
			$( '#collapse-left-header' ).change( function () {
				if ( $( this ).is( ':checked' ) ) {
					$( '.scoop-header, .scoop ' ).removeClass( 'iscollapsed' );
					$( '.scoop-header, .scoop' ).addClass( 'nocollapsed' );
				} else {
					$( '.scoop-header, .scoop' ).addClass( 'iscollapsed' );
					$( '.scoop-header, .scoop' ).removeClass( 'nocollapsed' );
				}
			} );
		}

		handlecollapseLeftHeader();

		/*  Collapseable Left Header Change Function Close here */

	} );

} )( jQuery );
