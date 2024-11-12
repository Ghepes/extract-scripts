/**
 Theme Name:         Listar
 Theme URI:          http://listar.directory/
 Author:             Web Design Trade
 Author URI:         https://themeforest.net/user/webdesigntrade
 File Description:   Main JavaScript for the theme (front end)

 @package Listar
 */

/* Hide following variables from JSHint because they are globally declared earlier by other scripts */

/* global AOS, listarMinMapZoomLevel, listarMaxMapZoomLevel, listarInitialArchiveMapZoomLevel, listarInitialSingleMapZoomLevel, listarThemeURL, L, listarLocalizeAndAjax, listarAjaxPostsParams, listarMapMarkers, listarSiteCountryCode, jQuery, vhCheck, ifvisible, wpMyInstagramVars, listarSiteURL, opr, safari, InstallTrigger, MSStream, tinyMCE */

/* jshint esversion: 6 */
/* jshint bitwise: false */
/* jshint -W018 */
/* jshint sub:true */

var linereport = '';
/* Set '$' (from jQuery) to its existing value (if present) */

var usingPagespeed = 'yes' === listarLocalizeAndAjax.listarUsingPagespeed;

window.$ = window.$ || {};

( function ( $ ) {
	
	/* VH Check for CSS */	

	var vhCheckAttempties = 0

	setTimeout( function () {
		vhCheck();
	}, 150 );

	var vhCheckInterval = setInterval( function () {
		vhCheck();
		vhCheckAttempties++

		if ( vhCheckAttempties > 8 ) {
			clearInterval( vhCheckInterval );
		}
	}, 500 );

	/* Global variables for this scope ************************** */

	var
		theDocument,
		theBody,
		theHTML,
		htmlInner,
		htmlAndBody,
		headMenu,
		nothing,
		hasGrid2,
		hasGrid3,
		toggler,
		pageWrapper,
		navigationWrapper,
		menuWidth,
		menuNegativeWidth,
		selected,
		elemToTest,
		elemPosition,
		forceTermClick = false,
		headerPosition,
		diffHeaderPosition,
		priceRange,
		priceRangeValue,
		retryInstagram = false,
		priceAverage,
		hasUpdatedHoursTable = false,
		catScrollQtd,
		catCondition2,
		isStandardPackage = false,
		isClaimingListing = false,
		launchedReviewPopup = false,
		cancelAccordionPropagation = false,
		isNearestMeReload = false,
		nearestHash = '',
		hyphenPos = '',
		sanitizedLat = '',
		sanitizedLng = '',
		geolocationAttempties = 3,
		userGeolocated = false,
		avoidSearchScroll = false,
		myScaleFunction,
		markerCounterAfterLoad,
		dataMinimumClaimTextChars,
		requiredClaimCharsField,
		multipleRegionsActive,
		urlProtocol,
		currentClaimPackageID = 0,
		hasExecutedOnLoadAndVisible = false,
		preventEvenCallStack2  = false,
		preventEvenCallStack3  = false,
		preventEvenCallStack4  = false,
		preventEvenCallStack5  = false,
		preventEvenCallStack6  = false,
		preventEvenCallStack7  = false,
		preventEvenCallStack10 = false,
		preventEvenCallStack11 = false,
		isLoadMoreEqualizer    = false,
		disableRegionSelector  = false,
		disableHeightEqualizerListingCards = true,
		closeUserMenu,
		siblingsOpacityEnabled,
		breakClickLoop,
		tempModify = false,
		tempModify2 = false,
		isBrowsingSearchMenu = false,
		preventReclick = false,
		loadingClick   = false,
		dlTags = [],
		dtTags = [],
		skipEmbedDlOptimization = false,
		skipEmbedDtOptimization = false,
		isLastBlogPage = false,
		hoveringGalleryTimeout = 0,
		hasGalleryMouseleave = false,
		cancelListingCardCircleEvents = true,
		quantifyCounter = 1,
		viewportHeight = 0,
		didInitialAccordionClick = false,
		thisElement,
		customListarStyle = false,
		mobileCompensation,
		scrollToTarget,
		callToActionsBoxedSquared,
		animatingMask = false,
		headerTransparentTopbar,
		hasBackgroundImages = true,
		onMap,
		osmUrl,
		osmAttrib,
		osm,
		lat,
		lng,
		map,
		markers,
		geocoder,
		divMarker,
		listingItem,
		bounds = [],
		popupToggling,
		idArray,
		markersList,
                minimumZoom = 3,
                maximumZoom = 20,
                initialMapZoomArchive = 0,
                initialMapZoomSingle = 0,
                initialMapZoom = 0,
                hasCustomInitialMapZoom = false,
		lastListingID,
		clusteredMarkers,
		mapStarted,
		preventDoubleClick,
		lastDragPosition = 0,
		dragging,
		data,
		lastScrollPosition = 0,
		saveScrollPosition = true,
		gotUpdatedNonce = false,
		listingGallery,
		listingGalleryItems = nothing,
		listingGalleryLinks = nothing,
		listingGalleryInitialBackup = false,
		currentListingGallerySlide = 0,
		maxListingGallerySlides = 0,
		slideWidth = 0,
		centralizeMainSlide = 0,
		currentURL = window.location.href,
		isFrontPage,
		pageBGColor,
		lastViewportWidth = false,
		scrollbarWidth = false,
		searchByInputToFocus = false,
		originalCanvasImage,
		appending,
		singleContent,
		singleheaderBackgroundWrapper,
		readyForHoverTimeout = setTimeout( false, 0 ),
		imageCanvas,
		imageCanvasContext,
		lineCanvas,
		lineCanvasContext,
		pointLifetime,
		listarFeaturifyElements,
		frontPageCallToActionBadge,
		customGutenbergClasses = '',
		animateElementsOnScroll,
		points = [],
		pageBGColor,
		isClaimingListing,
		specialHashes = [
			'mapview',
			'gc',
			'do-login',
			'comment-',
			'comments',
			'more-',
			'login',
			'collapse'
		];

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
		isRestartingMap = false,
		hourFormatFront,
		hourOpenPlaceholder,
		hourClosePlaceholder,
		hasMultiPleHoursPerDay = false;

	/* Functions **************************************************/

	function startMapLeaflet() {

		onMap = 0;

		/* Prepare interface (maps) ***********************************/
		var mapboxToken = '';

		osmUrl = '';
		osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a>';
		lat = 50.5;
		lng = 30.51;
		markers = {};
		listingItem = {};
		bounds = [];
		popupToggling = 0;
		idArray = [];
		markersList = [];
		lastListingID = 0;
		mapStarted = false;
		preventDoubleClick = 0;
		dragging = 0;
		
		if ( 'mapbox' === listarLocalizeAndAjax.listarMapTilesProvider ) {
			mapboxToken = listarLocalizeAndAjax.listarMapboxToken;
			
			if ( '' === listarLocalizeAndAjax.listarMapStyleURL ) {
				listarLocalizeAndAjax.listarMapStyleURL = 'mapbox/streets-v11';
			}
			
			osmUrl = urlProtocol + '://api.mapbox.com/styles/v1/' + listarLocalizeAndAjax.listarMapStyleURL + '/tiles/256/{z}/{x}/{y}?access_token=' + mapboxToken;
			osmAttrib = '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/" target="_blank">' + listarLocalizeAndAjax.improveMap + '</a>';
			//api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}
		} else if ( 'jawg' === listarLocalizeAndAjax.listarMapTilesProvider ) {
			var jawgToken = listarLocalizeAndAjax.listarJawgToken;
			
			if ( '' === listarLocalizeAndAjax.listarMapStyleURL ) {
				listarLocalizeAndAjax.listarMapStyleURL = 'jawg-sunny';
			}
			
			osmUrl = urlProtocol + '://tile.jawg.io/' + listarLocalizeAndAjax.listarMapStyleURL + '/{z}/{x}/{y}{r}.png?access-token=' + jawgToken;
			osmAttrib = '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib" >&copy; JawgMaps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib" >&copy; OSM contributors</a>';

		} else {
			var fallbackMapboxStyle  = 'wtax1/ckr85jdk108ts17orx8mkn7cl';
			var fallbackMapboxTokens = [
				'pk.eyJ1IjoiYmVsaWV2ZWJheHRlciIsImEiOiJjbGVhYjB6MmcweGU5M25taHJ5a2tjbm45In0.As4BS5EB7VTpp9Gfjx2K4g',
				'pk.eyJ1Ijoia29uYXJqb2V5LWphY2siLCJhIjoiY2xlYWE0OHd4MDU3czNvb2RrN2g5bnZtbyJ9.pApHxfQahntRWQ8zVyRJxQ',
				'pk.eyJ1IjoiaGFndW5qYWt1YiIsImEiOiJjbGVhYXNxcTUweGs3M3ZvNjhyNXB3cTdzIn0.LwNw2X7nwrhRqA6u--xSLQ',
				'pk.eyJ1Ijoic2hlcmlmZnJhbm9scGgiLCJhIjoiY2xlYWF5d3NxMHhhbjN4cWd5bXYyYzNrMSJ9.GHq3ZkkgrriOCUoL2XT_cQ',
				'pk.eyJ1IjoiYWJkYWxyb29mcHJlY2lvdXMiLCJhIjoiY2xlYWI1eWVmMDIydTN4b2cxcmd3b3Y4ZiJ9.NQ4VKPHDxdo3MWq3e9EmSw',
				'pk.eyJ1IjoiZGFyeW5hcGlzYWkiLCJhIjoiY2xlYWJiYTd0MGhkbzNwbzkxaDA1Nng0ZSJ9.ZPaN0EO4B1u1YsFkoRoDyQ',
				'pk.eyJ1IjoibWF0ZXVzemJvIiwiYSI6ImNsZWFiZThyMDBlZHgzdWxlOGo3eWdkeHYifQ.LXP4Jlj4OLojkbhsSwzK4A',
				'pk.eyJ1IjoiZ2xlbm5zY290dCIsImEiOiJjbGVhYmdsZTgwaDlqM3ZwYW8wNmhpNHMyIn0.QMUTLzim7ZVeFz99_8uVkw',
				'pk.eyJ1IjoiZmVsaXhyaG9sbWFyayIsImEiOiJjbGVhYmttcXAweGQwM29taHplN3Njd2I2In0.R-7oh1Cf7oV-Wy5AoMjnbQ',
				'pk.eyJ1Ijoib2xsaWV0b2JpYXMiLCJhIjoiY2xlYWJuMHIzMHh0azN2cjFhcHpobHJvOSJ9.3ANyiH50dljF9dNNPa7UOA',
				'pk.eyJ1IjoiaXJlYXlvbWlkZW1pbGVzIiwiYSI6ImNsZWFicGVxcDA2eGwzd251bHBrYTRid2EifQ.vMwEEUgFy6rH9icwXwlWsg',
				'pk.eyJ1IjoiYm9iZHlsYW50b3MiLCJhIjoiY2xlYWJydm9zMHhtcDNxcWcyMm03NDhxZCJ9.7YWJTFK6q5L4PSb7BShegQ',
				'pk.eyJ1IjoibGF1cmlld2lsa2llIiwiYSI6ImNsZWFidm1seDA1a2ozcG9kNmZhZnEwMG8ifQ.WPN0Nt4Pf_ypGWX29aRdUQ',
				'pk.eyJ1Ijoiam9uc29ua2FzaGlmIiwiYSI6ImNsZWFieXphYTBocGgzeG85czExeGw3ZzkifQ._7HfwCsYvt-EnW_NgRvwJQ',
				'pk.eyJ1IjoiZnJhbmtyeWhzIiwiYSI6ImNsZWFjMWhyZzB4ZzYzcnMzd2tnb2xzeGgifQ.xodBFSS6-9TtGtc1dlg1zQ',
				'pk.eyJ1IjoibHVjaWVuYWJkdXIiLCJhIjoiY2xmZmxhMnY4MGEzbjN3b3p6M2VyaGVvbiJ9.VdQH8BZwyEE5eLGbqgwY5g',
				'pk.eyJ1IjoibGluZGVuYXBpc2FpIiwiYSI6ImNsZmZsdWIzMzBueTYzcG04NnBrNngwYWQifQ.YyUpJ19hxN-42YG0hp1C4A',
				'pk.eyJ1Ijoicm9iaW5qb2FxdWluIiwiYSI6ImNsZmZseGo0azBlYzIzenB1NDQwNGVjbjkifQ.UiV5mQ2UKC2aTKCPxi65ag',
				'pk.eyJ1IjoianViaW5kaW5hcmFzIiwiYSI6ImNsZmZsenpuZzExM2kzeG51ZDh6bXRoN2EifQ.2iCy1JXXE09Sxrp-25ghTQ',
				'pk.eyJ1Ijoiemhlbmtlbnp5IiwiYSI6ImNsZmZtMjUyNzBkejYzcGs4ZWt5NHF5NWEifQ.NVUGCogH5EOonipkPfnNkA',
				'pk.eyJ1IjoiYmFsZXltYWRkaXNvbiIsImEiOiJjbGZmbTV2aWQwYTg0M3VvNXF2ZXNjMXRoIn0.rj7noky_oDhQh9uv4XW5VQ',
				'pk.eyJ1Ijoic2hpbG9oc3Rld2FydHkiLCJhIjoiY2xmZm1nOTVqMGU3ejQzcGEybml4NDRpcCJ9.zIOKA6a0kgIf0hLeb2s01w',
				'pk.eyJ1Ijoic3RldmVudW1hciIsImEiOiJjbGZmbWtoaDQwb2FzM3JvaG01MmoyaWs1In0.dwL8cB6xM1bDXNqE8U-BDQ',
				'pk.eyJ1IjoiamFzaW15b3VjZWYiLCJhIjoiY2xmZm1tb3J0MDAzNDN0bzdhdWxnZ2FxNSJ9.QT4ADC6v90tWnG9Mc_ZyAg',
				'pk.eyJ1IjoiYXplZGluZWNlcGhhcyIsImEiOiJjbGZmbXFtMWQxMWFwM3hudXo2NnhxMzRhIn0.YCqlKNPV8P7loFzJV-zaVw',
				'pk.eyJ1Ijoia3ltYXJ2ZWQiLCJhIjoiY2xmZm11c3hkMDl3azNxbXRyZXRpcTI1ZSJ9.MWWpBsY1aw4LqGgrR3y7vQ',
				'pk.eyJ1IjoiYnJ1bm9uc2hhaG1pciIsImEiOiJjbGZmbnMzbHAwMDB1M3NsaTZmY2lkMm8zIn0._JWIx9YoYuNYVLnTY1-Elg',
				'pk.eyJ1IjoiYWxiZXJlc3RlYmFuIiwiYSI6ImNsZmZueDlmNTBvaTgzcG04eTN5bjhnZ2MifQ.iane_nRFMBxB0Oa7VeuZHQ',
				'pk.eyJ1IjoiZG9tYW5pY2JyZW5keW4iLCJhIjoiY2xmZm56c29qMDBnOTN0cW5yMGYwdTZrciJ9.gpvlJor5dLCrlH4XBnHSdQ',
				'pk.eyJ1Ijoiam9ubnlrcmlzIiwiYSI6ImNsZmZvMXhlYzBvaHczd204Y3F6MXcyYngifQ.RnmjN7BmLVlbZeHED5LCcg',
				'pk.eyJ1IjoiZWxqYXlhbmF5IiwiYSI6ImNsZmZvNWZvMjAyeXA0M29kdjVwNWMzZ24ifQ.QnOqmqnK-7uyTddNpHQ3pQ',
				'pk.eyJ1IjoiamFtZXMtcGF1bG9yc29uIiwiYSI6ImNsZmZvOGtubjAwMmMzdHBhZ2RvZTdsMnEifQ.gjodB6hbbbJxfV2Z1i7LPg',
				'pk.eyJ1IjoiamFtZWlsd2luZHNvciIsImEiOiJjbGZmb2JwZmcwYWJ6M3BtdGRteWk3M3M0In0.al9HCpKmG-CiaGtEEVv5Dw',
				'pk.eyJ1IjoiY29zbW9lYm93IiwiYSI6ImNsZmZvZWM1aDBvbGQzd204a2I3eGtvZ3oifQ.AmEdvbLHFSpVEWUH7hqdqw',
				'pk.eyJ1IjoiaHVzc2FudmFsZW4iLCJhIjoiY2xmZm9oYWt5MTUwMzN0bzYydXFlcDVlMCJ9.53KRgbAwNOrc9_b6E18Rng',
				'pk.eyJ1IjoiZ3JhbnRqb2huamF5IiwiYSI6ImNsZmZvbDA1MDAwbGc0NnFuNzh5OHNhemQifQ.OaPFGsoRJnK0XIlbPEdlKg',
				'pk.eyJ1Ijoicm9uaW5sbGlhbSIsImEiOiJjbGZmcHh0djAwMGo2M3RwYXo2dTJoMXJwIn0.DGDmtQ-mPCnzW8v8Dapiug',
				'pk.eyJ1Ijoiam9lZGR5b3Jzb24iLCJhIjoiY2xmZnEwbHVmMDBuMjQ0bGlvNHg3czExciJ9.QwtfL_84f1Yvrd8F5odbCQ',
				'pk.eyJ1IjoiemFjaGFyaWFodGpheSIsImEiOiJjbGZmcTM3ZGsxMjVxM3FycmI3NXY0dW84In0.Gs1GpTGv6fEmlNjurstjag',
				'pk.eyJ1IjoiYXJ5aWFuY2hlIiwiYSI6ImNsZmZxNmNkcjAxMzUzdW83M3J2OGF3YWIifQ.0Zx4Adnpk5dZVUjZx7U-0Q',
				'pk.eyJ1IjoicHJvbWlzZWhvd2llIiwiYSI6ImNsZmZxOHk3NTAwcWwzc250eGNuZGhxZ2IifQ.PrawiSEDFS-AySRFVHu0YQ',
				'pk.eyJ1IjoiaGFyaWNhaGx1bSIsImEiOiJjbGZmcmZlbXAwM3B3NDVtejc3MHo0M2RxIn0.zKob4x6x-xYlL4CxLUREWQ',
				'pk.eyJ1Ijoiam9hcXVpbmFsZXhlaSIsImEiOiJjbGZmcmlnMnMwcGdwM3hvaGk3bjRwazhkIn0.3tQVA0XrWwvnSRNN0G2k_g',
				'pk.eyJ1IjoiYXNodHludmFsbyIsImEiOiJjbGZoY2c2djAwNnVwM3JubWRwa3NyNXZ3In0.49PJsSM5ClVy5yj0uDZgJg',
				'pk.eyJ1Ijoiam9yZHlreXJvIiwiYSI6ImNsZmhjanlvbTAzY2ozdm81ZDdrZWt2MDMifQ.iNfBkd33E4oiodlFfLMNvA',
				'pk.eyJ1IjoiYnJhZGFuY2FpZSIsImEiOiJjbGZoY212Nncwdnl4M3dxbnp5ODAyNmUzIn0.SHMPi8UCkAYpW81kckmL3Q',
				'pk.eyJ1IjoiY2lhcmFucmlsZXkiLCJhIjoiY2xmaGNwanRyMDI0NjNybGk2OWY4c3VlZiJ9.cTQUmP5oRdzK-UoMnv5DmQ',
				'pk.eyJ1IjoiZXZhbmFybmFiIiwiYSI6ImNsZmhjc20xNzA0bnQzc3M1em5scGI4dWoifQ.SBbJd-wM-Pu1xyKC3bPR_w',
				'pk.eyJ1Ijoia29yYmVubGVub24iLCJhIjoiY2xmaGN2YnRsMGEycTN4bnJwM2RibDhmNCJ9.6q_2kcBhJEyk0tC-8sfVyg',
				'pk.eyJ1IjoiZ2lyaXVzcmFqYWItYWxpIiwiYSI6ImNsZmhjeTlicDE1cWkzeHBkd3BtaWx2ZzUifQ.458o704AfjAlvmjyY5cZ-g',
				'pk.eyJ1Ijoicm9iYnlwaWV0cm8iLCJhIjoiY2xmaGQxOG02MWxyMTNxbzZqcHcwdnEwMSJ9.PuZluzYKVG5kuRjUES57xg',
				'pk.eyJ1IjoiemFrYXJpeWFrZWlyZW4iLCJhIjoiY2xmaGQzdTRiMTVlNzNwbTh5N2hsZTh4aiJ9.HV8x5sN123u9tTX2UtI98A',
				'pk.eyJ1Ijoibmlja2hpbGxicmVhbmRhbiIsImEiOiJjbGZoZDYwdGgxNjB4NDBwZGRuYWZyOGZtIn0.yQVOr0YHMkk3ZgFQwG-vEA',
				'pk.eyJ1Ijoiam9yZHlicm9nYW4iLCJhIjoiY2xmaGQ5NmZkMDU0bjQzcWduajBtOWZsYyJ9.hEebZV_7TcMcAYtYhQbjYA',
				'pk.eyJ1IjoiamF5ZGVuLXBhdWxoYXJqZWV2YW4iLCJhIjoiY2xmaGRieTdvMDJhcDNybGk0eWplbDU3byJ9.QfFfbKENEazH1nq1_aJdrQ',
				'pk.eyJ1IjoibHVjYWFsbHkiLCJhIjoiY2xmaGRlbDZlMDR4ajNyczVsbHNxbmJ4bCJ9.UYmt9PZ9m5Yi0JZ0GI9syA',
				'pk.eyJ1IjoiYWxseWhhcmp5b3QiLCJhIjoiY2xmaGRoOTIwMTVmazN4b2h2Z2V6ZHpzdSJ9.RiL0XkM7-Ey19TgzLLT90w',
				'pk.eyJ1IjoiYWlsaW5lbnJpcXVlIiwiYSI6ImNsZmhka2JtMzAzbnIzcHJ4aTNqbTgxaGYifQ.iniEVFMPFXpZJe_msUNn0g',
				'pk.eyJ1Ijoia2FyYW5kZWVwb3dlbiIsImEiOiJjbGZoZHVhY2IxaHJiM3pxc3k1a2d6OTU3In0.WrCsDfnmM9u4evEavlyKWw',
				'pk.eyJ1Ijoia3J1em1hc29uLWpheSIsImEiOiJjbGZoZHlzcXowM3FrM3NwbXMxaWVwM3QyIn0.DSqmI39XWYKVvephXlmpDA',
				'pk.eyJ1IjoiZnJhbmtvbWFrc2ltIiwiYSI6ImNsZmhlMWJ5ZDA2a240Mmxodm9haWJza3EifQ.j77sz1DcyLo7GOvgvS1U3Q',
				'pk.eyJ1IjoibGFzc2VrZWVuYW4iLCJhIjoiY2xmaGU0YmZlMDVzdDNybGpnOWNncWtqZCJ9.zUByNgOFUW4TVP1bZEYcEg',
				'pk.eyJ1Ijoib2doZW5lb2NodWtvbmV2YW4iLCJhIjoiY2xmaGU3M2N3MDJrMjNxbDkzMXoxY3Y5ayJ9.SOmIXmYbVlZr6K_RNjaBWw',
				'pk.eyJ1Ijoia3J1enJvaGluIiwiYSI6ImNsZmhlYWFicTAzc3ozb3J4YWR2MmkzaGsifQ.U4ducy4sR2FJk-ivLii68A',
				'pk.eyJ1IjoiYW1pcm5pa2hpbCIsImEiOiJjbGZpdmc3eWQwcDRlM3hucjd4b3B5dWo2In0.GPQe2zyeGXtg68xhyXYcvg',
				'pk.eyJ1IjoibGVpdGVuY2F5ZGVuLXJvYmVydCIsImEiOiJjbGZpdmx5MjIwaWg2M3FyeGc2ZGttd3BnIn0.8BH8j80fC5FHs8FR3YLyzA',
				'pk.eyJ1Ijoicm9iYmllcHJlc3RvbiIsImEiOiJjbGZpdm9hNzYwMjU4M29vNGFzdzM2cHptIn0.EgwJvMrzfjuTyLQjIyNShg',
				'pk.eyJ1IjoidXJiYW5jYWxlYiIsImEiOiJjbGZpdnF6a3cwaDVyM3JsaTF1bnptZmxyIn0.Bdsgo7rFH9ORnThpMuHirQ',
				'pk.eyJ1IjoiYXVsYXlsYXdzb24iLCJhIjoiY2xmaXZ0M21yMGxiZTN3bGgzN3FqbDI3cyJ9.YHgpq-gKGsUAtViIuIHUuQ',
				'pk.eyJ1IjoiY2hpeWFuZ3hwIiwiYSI6ImNsZml2dzBkbDAybDQzeG8wOG1lajAxaGYifQ.u2pvAdoNzAmDuPa_Y3uZBQ',
				'pk.eyJ1IjoiamVlbWllZGFycnlsIiwiYSI6ImNsZml2eWZuZjAyYzEzcXAwM2E0czEwdmsifQ.7DqAUBM8uzsh3moj_BhDSw',
				'pk.eyJ1Ijoib2xpdmllcnJheWFuZSIsImEiOiJjbGZpdzBsdHIwbTcxNDNubW4xdDQyajQzIn0.-i_zJxT8GX6bKvwHoBdc2g',
				'pk.eyJ1IjoibGVpZ2hqdXJhIiwiYSI6ImNsZml3MnNrejBhaTgzc25xamFlYTk3dHEifQ.FLFNiP24f3U09FqonV9FxQ',
				'pk.eyJ1IjoiYWFycm9ucmh1YXJpZGgiLCJhIjoiY2xmaXc1MGFjMDk1djN3bzY3NXpvMHFkNCJ9.Nj5_jcSqhD6YIV2S1luHjA',
				'pk.eyJ1Ijoia3ltYWRkaXNzb24iLCJhIjoiY2xmaXc3NWp1MDJmNDN5cDA3eW9hbWNkdyJ9.LszKd4W5P4vE8sFEMkMLXA',
				'pk.eyJ1IjoicGF0cnlrc29oYW0iLCJhIjoiY2xmaXc5a3B5MDA1NDN5cGp1ZWNtZHNvayJ9.7_3W5gadmA7xRx0rsGDZOg',
				'pk.eyJ1IjoiYWJpZHNhY2hraXJhdCIsImEiOiJjbGZpd2JvMXEwODJuM3FrcGV1b3ZoNzB5In0.SU8YYi_GgGzs3rc6t3vbXw',
				'pk.eyJ1Ijoib3Nlc2VuYWdoYXRvbXNvbiIsImEiOiJjbGZpd2RreDgwN3ViM3drcGQ3NTk1MThrIn0.MfnMEUi9tRGJ0kS96C73KQ',
				'pk.eyJ1Ijoiam9zaWFoY2hpbXNvbSIsImEiOiJjbGZpd2ZuanMwMDBmM29zMHZybDZvNTc0In0.nYXTZ4pOdBgfs7WIOZqpXQ',
				'pk.eyJ1IjoibWFzb25jaHJpc3RpZSIsImEiOiJjbGZpd2hvaHkwMnF6M3hvMGRiM2tibnJvIn0.2ksq4z6tQmun7pQJlQ31_w',
				'pk.eyJ1Ijoib2x1d2FmZW1pZmF3a2VzIiwiYSI6ImNsZml3am5uMjA4amgzeG11YTBmMzI0NDcifQ.pK47DS-naXjzSAYPleSBfA',
				'pk.eyJ1IjoiYW1vc3Jlbm8iLCJhIjoiY2xmaXdsbDl5MDJodjNxcDBkcjNpZnppaCJ9.tb5V2D7WQIhyE5dpz2l9kw',
				'pk.eyJ1IjoiZHlsYW4tamFja2NhYmhhbiIsImEiOiJjbGZpd25tYnQwMDJxM3ZzMHY2b2VkbWh5In0.du-bOTtQw-1V8q0wVoAOEg',
				'pk.eyJ1Ijoia2Vsc29jb25yYWQiLCJhIjoiY2xmaXdwdnJsMHdzdDN0cXdpc215azF6eiJ9.LuC1okmN7zLUOECqPpiNhA',
				'pk.eyJ1Ijoia2l0am9hcXVpbiIsImEiOiJjbGZuOWRpcnIwaHhmM3JzdzJyajd2MTR3In0.mqFEPfWPwz9BXPKXy-MyVQ',
				'pk.eyJ1Ijoid2FidXlhc29oYWliIiwiYSI6ImNsZm45eWtqajAzMjkzcXQycDViNDU3dTAifQ.LiJCqsRkSNMx47_-dLrrBA',
				'pk.eyJ1IjoiYnJheWRvbnRqIiwiYSI6ImNsZm5hMXAwczAzNGUzeHQyN3VmMW1oZnUifQ.poxrLlpFsXrlVMy3-g4MmA',
				'pk.eyJ1Ijoia2VoaW5kZW11c3RhcGhhIiwiYSI6ImNsZm5hNGY3ajAxNW80NnA5ajR1MzhoaWgifQ.buMRsDPVS-PMShEOME1XDg',
				'pk.eyJ1IjoiaXNpbWVsaXBvcnRlciIsImEiOiJjbGZuYTZtZWwwMWp3NDNtaHd3NGpxZjUwIn0.s5cRdMY3jEDAsg6x9y3NEg',
				'pk.eyJ1IjoiY29yaWVtb3J0b24iLCJhIjoiY2xmbmE4eTd5MDRwMjN0bnJxZWJ6cXRvMyJ9.nj_OEkg5_zhrf4_PRjgabA',
				'pk.eyJ1IjoiaWRyaXN0YWxoYSIsImEiOiJjbGZuYWJkeWswMHBqM29uM2xlNHhsbGl2In0.2RPdmr28ifyfuYRIuXUXhQ',
				'pk.eyJ1IjoicmljaGV5ZXJkZWhhbiIsImEiOiJjbGZuYWU3OGcwMWx2M3FtaHk4ZTByMTl1In0.SIfxYKZwvQbS8UdRCMbHVw',
				'pk.eyJ1IjoiYW1tYWFyaW1hbiIsImEiOiJjbGZuYWg5NmcwOHpmM3JvNXZmNzVoem9lIn0.ItnzViCOdzR-f5pzs1E4AA',
				'pk.eyJ1IjoiZ2VvZmZyZXlzYXVsIiwiYSI6ImNsZm5hamx6YzBhNXo0MnB0dXExdGl0YjIifQ.X-8HaJFL4fDAjE15Uj-HSQ',
				'pk.eyJ1IjoiZXJpem5hdGUiLCJhIjoiY2xmbmFtaXpjMDh5MjNxcW9sc3N5dnFybCJ9.eH1Y_GpDTjmVL5lQB44CFQ',
				'pk.eyJ1IjoiZmlubmVhbmxvbW9uZCIsImEiOiJjbGZuYW93eWYwM3ZwM3NzMGVidXdmN3A1In0.NM7TyqOKx9XBOA-E8_JO4g',
				'pk.eyJ1IjoiaXNtYWVlbHRva2luYWdhIiwiYSI6ImNsZm5hcmFuNDA4cHYzb281emRxb2NhNzIifQ.7CNO6_t5onvmR5_zeoys3Q',
				'pk.eyJ1IjoiamFtZXNjYWlsZWFuIiwiYSI6ImNsZm5hdWp1bTAxOXQzdnA0aHFjb2ZkOWMifQ.XQao5SbkT0U5NumbVWGLuQ',
				'pk.eyJ1IjoicmVnZ2llbG9jaGxhbm4iLCJhIjoiY2xmbmF5b29mMGsxaDQ0bGtyNTNhbzJoZiJ9.xjcvKBLNyePzDHbpAzlifg',
				'pk.eyJ1IjoibG9raWt5cmFuIiwiYSI6ImNsZm5iMjJrMTAxdjYzeG1ocmx2bHpjdzIifQ.wQomotTbL-_LA8oT6kSMeQ',
				'pk.eyJ1Ijoid2FsaWRtYXNvbi1qYXkiLCJhIjoiY2xmbmI0ZnJ2MDhyeDN4bzVtcXlldmk3byJ9.S7LkS2VFsC5mGqvi4O_IIQ',
				'pk.eyJ1Ijoic2hhZG93bGFpcmQiLCJhIjoiY2xmbmI4aTBoMDF1ZzNxbWhwdGZtMDlpMiJ9.VOIHnchBqo1e4JIJCIwL9A',
				'pk.eyJ1IjoiamlheWFuZ3giLCJhIjoiY2xmbmJjeHhjMGs0bTNvbW9qa2hzcjU3YiJ9.MdD2RC6_29YvakmJ__bJOw',
				'pk.eyJ1IjoiZnJhemVydWNoZW5uYSIsImEiOiJjbGZuYmZsOHgwM2U0NDN0MnZhOXdvM2Y5In0.iGNCbeIS3nHFyaq5LYe96Q',
				'pk.eyJ1IjoiZGVjbHlhbnZpbmNlbnQiLCJhIjoiY2xmcTMwbzQ3MDRwaDN3bnNkZWVibnYzeCJ9.EvOzCEHyNeojRws539xKGQ',
				'pk.eyJ1IjoiaG93YXJkbWFudXMiLCJhIjoiY2xmcTM5ZDA2MWMzdzN2cDl3ZDR4N25xcCJ9.UDe12Czzb9lGIe2oBSeWaA',
				'pk.eyJ1Ijoicml0Y2hpZXV6YXlyIiwiYSI6ImNsZnEzYzc1ZzB0ZXczcm1oZWsydGhuMWsifQ.-g1HykZRRpIV8HsTgYuNkQ',
				'pk.eyJ1IjoiYWhtZWQtYXppenplZWsiLCJhIjoiY2xmcTNmZGtpMDR2ejN3cnI0NWZlaXllcCJ9.JsxY_CtOq4YlwWVU8vkYjA',
				'pk.eyJ1IjoiYW5kcmV3aGFuIiwiYSI6ImNsZnEzaHBpbTFibGs0MXA5cjNseXRkcHkifQ.aEjZUCJZPapriYIVCbaxuw',
				'pk.eyJ1IjoiZXN0ZWJhbnBoaW5laGFzIiwiYSI6ImNsZnEza2t6dDFibnUzcHA5ZGxzcXA0NDEifQ.VGrYaHHrgcZkFT1g9nh5fg',
				'pk.eyJ1IjoibWFkaXNvbmpvbmF0aGFuIiwiYSI6ImNsZnEzbmNqYzA0c2Q0MGxjYW1iemd4YzQifQ.DFbCVZ-UKgEZSdymOFO8mg',
				'pk.eyJ1Ijoiam9obm55bW9tb29yZW9sdXdhIiwiYSI6ImNsZnEzcGx5NjEwZzczeG81ZmhscHVqbmcifQ.TCFVY5_7Py91z_-3V5arSw',
				'pk.eyJ1Ijoiam9vam9hbGlzZGFpciIsImEiOiJjbGZxM3J3b2IwdGh0M3FtaHR4bnJkOG10In0.tD8w0czOlncP0Nz1AC3pjA',
				'pk.eyJ1IjoiaGVpbmlhbnRvbmkiLCJhIjoiY2xmcTN0ejFmMHgzYjN0cGp4aHVoMmN4NCJ9.eD0yHIKQh40f73F_bYoEdg',
				'pk.eyJ1IjoibW9ycmlza2llcmFuLXNjb3R0IiwiYSI6ImNsZnEzeDZ3bzFicWE0MXA5NXlmdDJ0dnMifQ.AvezL6tTKktZ0bC_Z8y9Iw',
				'pk.eyJ1IjoibXVoYW1tZWRuaWtpIiwiYSI6ImNsZnEzem5lcjA1NHUzcXJyejByZW41YmkifQ.dDZmj3Ja-l32zALY9MbMbA',
				'pk.eyJ1Ijoia2FybGVyZW4iLCJhIjoiY2xmcTQxbXQ2MDU1YjNxcnJ4enEyd3RwYyJ9.rXO9kQ_vkxdQMPB0_tQUcw',
				'pk.eyJ1IjoicmFkbWlyYXNhbGEiLCJhIjoiY2xmcTRwbGg4MWNybjN5bXZmYnE0NmNsbiJ9.xkAa2E8uem726FP6Vl-Z_g',
				'pk.eyJ1IjoicWFzaW1ub29yeCIsImEiOiJjbGZxNHMzbjQwZnloM3JubDMyZGRkZDdnIn0.RFHIcWA0csdoQV3bMprUEA',
				'pk.eyJ1IjoiZ2FyZXRobm9sYW4iLCJhIjoiY2xmcTR1Y21qMDAxbjQ1cnJnZ3JnZDV1cyJ9.tDN1XHTdBQ4bQN3Wl-eROQ',
				'pk.eyJ1IjoiY2FybGRpc3NhbmF5YWtlIiwiYSI6ImNsZnE0eGx5NzFjOXozc25yNmZ0MTBrZHoifQ.liIMcoCAz7vCsuRclLRUCQ',
				'pk.eyJ1Ijoia2FlbGFuYWJkaXJhaG1hbiIsImEiOiJjbGZxNHp0NmowZmptM3JwZjBiMHI1ajAzIn0.HZNc0Bjjayj1X0DxaYL5gg',
				'pk.eyJ1IjoidGF5eWVzd2V5biIsImEiOiJjbGZxNTJkdWEwMjlvM3JxZmp1N2JvanJyIn0.hS479IuZvYkb7F6EWDXa-w',
				'pk.eyJ1IjoiZ2xhc2NvdHRkYW4iLCJhIjoiY2xmcTVkYmNvMDVibzNxbzN6ODZweWRveSJ9.nV6bvBuCi8mjINAPhKvLHg',
				'pk.eyJ1IjoiZGVub25yZWlkIiwiYSI6ImNsZnE1Zm03cDExMjIzeXFvcGVieWhxZW0ifQ.5y0kZCzV7TokSkhptB7Oew',
				'pk.eyJ1IjoidHVybmVyY2hhcmxleSIsImEiOiJjbGZxNWh3NWIwNWN2M3BzaGM2N3FnZ296In0.hF92crOSYXj0xKfke3S3fw',
				'pk.eyJ1IjoidW1hcnJvYW4iLCJhIjoiY2xmcTVrNDk3MWNqODQxcWQ0ZHFqMHhrcSJ9.J8ow34_lCk_wAhoHfnlVvA',
				'pk.eyJ1IjoiamVhbi1waWVycmV0eSIsImEiOiJjbGZxNW1haG8wdnlhM3lzMHVvend0YWpwIn0.kEuzbtVnvJJ-3exQoK_QlA',
				'pk.eyJ1IjoiZ2h5bGx6ZWNoYXJpYWgiLCJhIjoiY2xmcTVvYzUxMGdyOTNxcG94dmluZGxsYyJ9.sESGczeqKatWpqO--Ls7xQ',
				'pk.eyJ1IjoiZGFueXNkaWxsb24iLCJhIjoiY2xmcTVxZmlsMDVmaTNwc2h6eG5pYzVhdSJ9.QTBTOMeCHIqrmm56rFi3Vg',
				'pk.eyJ1IjoiYWx1bWNvZGV5IiwiYSI6ImNsZnE1c205dzFjYmMzcHFkOGdhY3U3bGEifQ.y_sqOi70G7jLeqnCe0jAaw',
				'pk.eyJ1IjoiY29vcGVyYXJpaGFudCIsImEiOiJjbGZxNXV4aWwwdmt2M3hrYnVxaDI4N2lxIn0.N6xRtlBSFbB2JbvgFmjX7A',
				'pk.eyJ1Ijoib3NrYXJvd2FpbiIsImEiOiJjbGZxNXd6MWUxMnRzM3FwdHF2NHByaXA3In0._EE0vNkFxd_MLICl3lkFKQ',
				'pk.eyJ1Ijoia291c2hpa2xvcm5lIiwiYSI6ImNsZnE1enNobjA1aWQzcnBiZ2ptdjZ1cmsifQ.2KntgZg-BZt_J2OJgfxSmA',
				'pk.eyJ1IjoiZHJld2RvdWdhbCIsImEiOiJjbGZxNjF0eTIwNWlkNDJuczdiNXZwdjFiIn0.hjqs0hMLGZ9vYhU7by4vSg'
			];

			var fallbackMapboxStyles = [
					'mapbox://styles/believebaxter/cleab2j9v003z01phprzvp472',
					'mapbox://styles/konarjoey-jack/cleaaekz3005b01p5544flj5t',
					'mapbox://styles/hagunjakub/cleaauchu003x01phwfn28xdg',
					'mapbox://styles/sheriffranolph/cleaazjez003y01phsh7s4pk3',
					'mapbox://styles/abdalroofprecious/cleab77w5004s01meizsfjuy1',
					'mapbox://styles/darynapisai/cleabchnv00aj01rwuyxwu7zm',
					'mapbox://styles/mateuszbo/cleabeog6005801s0zw375yan',
					'mapbox://styles/glennscott/cleabipsp00ak01rwsmcxik1b',
					'mapbox://styles/felixrholmark/cleablrqo005901s0d9hun3bm',
					'mapbox://styles/ollietobias/cleabnidv005d01p56tgakebu',
					'mapbox://styles/ireayomidemiles/cleabpu4k002m01ljcrnin8mr',
					'mapbox://styles/bobdylantos/cleabsagc005x01ldlnu8ge69',
					'mapbox://styles/lauriewilkie/cleabxevv001601mhqdw98r5n',
					'mapbox://styles/jonsonkashif/cleac090000ay01pblyfp3ww1',
					'mapbox://styles/frankryhs/cleac2kd7001o01qkms9y5oha',
					'mapbox://styles/lucienabdur/clffldr6p000f01nx9cu6toyi',
					'mapbox://styles/lindenapisai/clfflvkp7009c01nzc704pt1v',
					'mapbox://styles/robinjoaquin/clfflyllx005l01t5eqj39197',
					'mapbox://styles/jubindinaras/clffm0hzj000201p7rin5wu12',
					'mapbox://styles/zhenkenzy/clffm3hfu000301l3rsymh5q0',
					'mapbox://styles/baleymaddison/clffm6yus009v01o5sltg3ygy',
					'mapbox://styles/shilohstewarty/clffmhn2z000z01nnixv4kskr',
					'mapbox://styles/stevenumar/clffmldc3001001nn0vitpow1',
					'mapbox://styles/jasimyoucef/clffmp4tl000301p7harqot5e',
					'mapbox://styles/azedinecephas/clffms0td000101r3opuk7aj3',
					'mapbox://styles/kymarved/clffmvjpe000n01pgad0fbmnj',
					'mapbox://styles/brunonshahmir/clffnv0mt009g01nzsojc9773',
					'mapbox://styles/alberesteban/clffnyk3b005v01pdnuyvmxx3',
					'mapbox://styles/domanicbrendyn/clffo09m7000o01tkco9jx7h0',
					'mapbox://styles/jonnykris/clffo3iok000401lnk2didn6u',
					'mapbox://styles/eljayanay/clffo6rq8005601o18my81yt9',
					'mapbox://styles/james-paulorson/clffoa776000001ry712cix9h',
					'mapbox://styles/jameilwindsor/clffoc7st00a001o5exq3bdmc',
					'mapbox://styles/cosmoebow/clffofpbu000a01p6z4t0ja50',
					'mapbox://styles/hussanvalen/clffoidex005n01t5460zobid',
					'mapbox://styles/grantjohnjay/clffom3du000701l3ihrdpfwn',
					'mapbox://styles/roninlliam/clffpz4zr00a301o5b68yxw7y',
					'mapbox://styles/joeddyorson/clffq1nlg000l01nxjerp3agb',
					'mapbox://styles/zachariahtjay/clffq4lfg005r01t5frwsn55i',
					'mapbox://styles/aryianche/clffq7fj5000y01o1ia4ilabu',
					'mapbox://styles/promisehowie/clffqa0o1000901lnnl25gkqc',
					'mapbox://styles/haricahlum/clffrghpv000w01pges4hkinv',
					'mapbox://styles/joaquinalexei/clffrjj1a000n01nxdr3gy6u4',
					'mapbox://styles/ashtynvalo/clfhci29l000001qj51xaty33', 
					'mapbox://styles/jordykyro/clfhcl64p005w01pbr0c85dwn', 
					'mapbox://styles/bradancaie/clfhcnzei000401n30h59d3fd', 
					'mapbox://styles/ciaranriley/clfhcr1ls009a01pdcy89reni', 
					'mapbox://styles/evanarnab/clfhcttrk004d01pgmlk4jeq9', 
					'mapbox://styles/korbenlenon/clfhcwfdk001101pb1eg7as30', 
					'mapbox://styles/giriusrajab-ali/clfhcze2x003v01nx3i599wi5', 
					'mapbox://styles/robbypietro/clfhd2f00000201qjsdqiwvz7', 
					'mapbox://styles/zakariyakeiren/clfhd4c9u000701p366x3jikv', 
					'mapbox://styles/nickhillbreandan/clfhd7gma001301pbdgwekukm', 
					'mapbox://styles/jordybrogan/clfhdad39001p01le0wufpw6y', 
					'mapbox://styles/jayden-paulharjeevan/clfhdd418000901p3e0iml0se', 
					'mapbox://styles/lucaally/clfhdfw4h004e01pgi9ruj8h6', 
					'mapbox://styles/allyharjyot/clfhdikj7003w01nxge8xoe0w', 
					'mapbox://styles/ailinenrique/clfhdpl91000901n3xwznav65', 
					'mapbox://styles/karandeepowen/clfhdvfbv002t01patmcsq4me', 
					'mapbox://styles/kruzmason-jay/clfhdzrwo000d01p3y7vztpnx', 
					'mapbox://styles/frankomaksim/clfhe1vdw009g01pdg3h4r90j', 
					'mapbox://styles/lassekeenan/clfhe5gwk000301ob0kkpi57y', 
					'mapbox://styles/ogheneochukonevan/clfhe8dxs002v01pamc7t2yaq', 
					'mapbox://styles/kruzrohin/clfhebfp0002x01paa9ds49ct', 
					'mapbox://styles/amirnikhil/clfivk6y3000n01pa3lore1p5', 
					'mapbox://styles/leitencayden-robert/clfivmwpc000j01m9u45jtto1', 
					'mapbox://styles/robbiepreston/clfivpb42000k01m9g0ct14m8', 
					'mapbox://styles/urbancaleb/clfivryvc001a01m7moygn8jt', 
					'mapbox://styles/aulaylawson/clfivu7wi001401mllw17i85v', 
					'mapbox://styles/chiyangxp/clfivx57g000p01paq2qxz3cl', 
					'mapbox://styles/jeemiedarryl/clfivzh02000001owhcij4994', 
					'mapbox://styles/olivierrayane/clfiw1jtx000q01pavq4rcunl', 
					'mapbox://styles/leighjura/clfiw3pwn001b01m7uhou3ej2', 
					'mapbox://styles/aarronrhuaridh/clfiw61m5008601nx81ddgwgn', 
					'mapbox://styles/kymaddisson/clfiw858s000201ows2n06n9s', 
					'mapbox://styles/patryksoham/clfiwafoc000301owqkmo8x7b', 
					'mapbox://styles/abidsachkirat/clfiwchrl000001qwsy1hc3bl', 
					'mapbox://styles/osesenaghatomson/clfiweczt000501ntz6tdfjfe', 
					'mapbox://styles/josiahchimsom/clfiwgg0c000201plk67mqj4o', 
					'mapbox://styles/masonchristie/clfiwifft007k01o7bxzk79ok', 
					'mapbox://styles/oluwafemifawkes/clfiwkgaf000101qwzgl0m10q', 
					'mapbox://styles/amosreno/clfiwmj2200aa01pb2ehre7p4', 
					'mapbox://styles/dylan-jackcabhan/clfiwol2l000201qwj5exd51o', 
					'mapbox://styles/kelsoconrad/clfiwqrxm006n01le06prnkns', 
					'mapbox://styles/kitjoaquin/clfn9f5ix00k201nxbb3dw3ck', 
					'mapbox://styles/wabuyasohaib/clfn9zucr001x01mrtc0ew9u4', 
					'mapbox://styles/braydontj/clfna2v97002q01qom7noa9yk', 
					'mapbox://styles/kehindemustapha/clfna5bey000l01ofu96n38ik', 
					'mapbox://styles/isimeliporter/clfna7mfi005j01p99o89akna', 
					'mapbox://styles/coriemorton/clfnaa0un006p01qj2eswml7w', 
					'mapbox://styles/idristalha/clfnacf20000v01l84n1yyflu', 
					'mapbox://styles/richeyerdehan/clfnaftzj002w01pb010rfmqz', 
					'mapbox://styles/ammaariman/clfnaie0f00l701pbimgpwk4z', 
					'mapbox://styles/geoffreysaul/clfnal25q000301qbnbizrnw2', 
					'mapbox://styles/eriznate/clfnanm90000w01l8j733x1v4', 
					'mapbox://styles/finneanlomond/clfnapxyb000y01l8o01h0thf', 
					'mapbox://styles/ismaeeltokinaga/clfnaspc9002p01o7hlclvu1g', 
					'mapbox://styles/jamescailean/clfnavn83001y01mrh288tur0', 
					'mapbox://styles/reggielochlann/clfnazuv0002v01pg168wzftg', 
					'mapbox://styles/lokikyran/clfnb37rd000501mn281pxb4a', 
					'mapbox://styles/walidmason-jay/clfnb5noo003g01ry64saenx2', 
					'mapbox://styles/shadowlaird/clfnb9w3q002t01lrjbztqg8e', 
					'mapbox://styles/jiayangx/clfnbdwzx002w01pg56e7g7dz', 
					'mapbox://styles/frazeruchenna/clfnbg3ie00k801nx4y8spx2y', 
					'mapbox://styles/declyanvincent/clfq37bb9000c01nqoexgezk0', 
					'mapbox://styles/howardmanus/clfq3acki000001t4lacp4sw5', 
					'mapbox://styles/ritchieuzayr/clfq3d5zj006p01pef0k34cct', 
					'mapbox://styles/ahmed-azizzeek/clfq3gg99006z01rysx11hout', 
					'mapbox://styles/andrewhan/clfq3j9k400ap01qj8epnpyew', 
					'mapbox://styles/estebanphinehas/clfq3m2s0000q01pkzbreyhzc', 
					'mapbox://styles/madisonjonathan/clfq3o8ml006901pbbwf3t8mz', 
					'mapbox://styles/johnnymomooreoluwa/clfq3qkda000t01oy4s78bk5w', 
					'mapbox://styles/joojoalisdair/clfq3ss03000g01mxo9g5jumx', 
					'mapbox://styles/heiniantoni/clfq3uyji000e01n3fzuspprz', 
					'mapbox://styles/morriskieran-scott/clfq3yahi00os01pbl5gpevus', 
					'mapbox://styles/muhammedniki/clfq40gmn000h01mxmgvbp0ez', 
					'mapbox://styles/karleren/clfq42jei004801o2dcty7nch', 
					'mapbox://styles/radmirasala/clfq4qjbj006c01pgg8g1ctvb', 
					'mapbox://styles/qasimnoorx/clfq4t0bs006d01lru3jdemhv', 
					'mapbox://styles/garethnolan/clfq4vh9u007301ry8ynzpzis', 
					'mapbox://styles/carldissanayake/clfq4yk0u006c01pb0bqda892', 
					'mapbox://styles/kaelanabdirahman/clfq50zuv000s01pkv0m8ctrp', 
					'mapbox://styles/tayyesweyn/clfq54ctg000001pmo12g2l0s', 
					'mapbox://styles/glascottdan/clfq5eaeh006d01pb7icfjlkk', 
					'mapbox://styles/denonreid/clfq5gmyk000f01nqsqa0bvqm', 
					'mapbox://styles/turnercharley/clfq5itco00aq01qjq398hmfh', 
					'mapbox://styles/umarroan/clfq5l3ym007501ryupars9up', 
					'mapbox://styles/jean-pierrety/clfq5n57q004a01o2hjcrfur2', 
					'mapbox://styles/ghyllzechariah/clfq5p4ks006e01pgkohbkk14', 
					'mapbox://styles/danysdillon/clfq5re1d000001qevlse3u85', 
					'mapbox://styles/alumcodey/clfq5tkyz00nt01nxp2bu7cie', 
					'mapbox://styles/cooperarihant/clfq5vpz5006g01lrz03mrf2j', 
					'mapbox://styles/oskarowain/clfq5ynsx00ov01pbgak6w2lf', 
					'mapbox://styles/koushiklorne/clfq60oba009d01p9q50lfdvp', 
					'mapbox://styles/drewdougal/clfq62pm300ar01qjul20vs35'
			];

			var randToken = Math.floor( Math.random() * fallbackMapboxTokens.length );

			//randToken = 40;

			mapboxToken = fallbackMapboxTokens[ randToken ];
			listarLocalizeAndAjax.listarMapStyleURL = fallbackMapboxStyles[ randToken ].replace( 'mapbox://styles/', '' );
			
			osmUrl = urlProtocol + '://api.mapbox.com/styles/v1/' + listarLocalizeAndAjax.listarMapStyleURL + '/tiles/256/{z}/{x}/{y}?access_token=' + mapboxToken;
			osmAttrib = '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/" target="_blank">' + listarLocalizeAndAjax.improveMap + '</a>';

		}

		setInterval( function () {
			$( '.leaflet-control-attribution' ).each( function () {
				$( this ).prop( 'innerHTML', osmAttrib );
			} );
		}, 2000 );

		/* Initiate the map(s) if its container is visible on viewport after page load */
		$( '.listar-map' ).each( function () {
			if ( isInViewport( $( this ) ) ) {
				leafletMapInit();
			}
		} );
	}
			
	function restartMapPosition( mapPositionID ) {
		if ( ! isRestartingMap && ! $( '.leaflet-pane.leaflet-tile-pane .leaflet-layer .leaflet-tile-container' ).length ) {
			isRestartingMap = true;

			var lastItemTitle = $( '.' + mapPositionID + ' .listar-aside-post-title' ).prop( 'innerHTML' );

			//alert( lastItemTitle );

			//alert( .length );

			$( '#map' ).prop( 'outerHTML', '<div id="map" class="listar-map"><div class="listar-back-listing-button icon-arrow-left">Listing View</div></div>' );
			//$( '.listar-aside-list' ).prop( 'outerHTML', '<div class="listar-aside-list"></div>' );

			$( '.listar-aside-post, .listar-aside-list .listar-more-results' ).each( function () {
				$( this ).prop( 'outerHTML', '' );
			} );

			startMapLeaflet();

			var reclick = setInterval( function () {
				if ( $( '.listar-aside-post-title' ).length ) {
					$( '.listar-aside-post-title' ).each( function () {
						if ( $( this ).prop( 'innerHTML' ) === lastItemTitle ) {
							$( this ).parents( 'a' ).find( '.listar-aside-post-data' ).each( function () {
								var itemClick = $( this );
								var popAttempties = 4;

								var popupDetection = setInterval( function () {
									popAttempties--;

									if ( ! $( '.leaflet-popup-content' ).length ) {
										itemClick.trigger( 'mouseenter' );
									} else {
										clearInterval( popupDetection );
									}

									if ( 0 === popAttempties ) {
										isRestartingMap = false;
									}

								}, 1500 ); 
							} );

							clearInterval( reclick );
						}
					} );
				}				

			}, 200 );

			setTimeout( function () {
				$( '#map' ).removeClass( 'listar-map-hidden' );
			}, 3000 );
		}
	}

	function preloadImages(array, waitForOtherResources, timeout) {
		var loaded = false, list = preloadImages.list, imgs = array.slice(0), t = timeout || 15*1000, timer;
		if (!preloadImages.list) {
		    preloadImages.list = [];
		}
		if (!waitForOtherResources || document.readyState === 'complete') {
		    loadNow();
		} else {
		    window.addEventListener("load", function() {
			clearTimeout(timer);
			loadNow();
		    });
		    // in case window.addEventListener doesn't get called (sometimes some resource gets stuck)
		    // then preload the images anyway after some timeout time
		    
		    timer = setTimeout(loadNow, t);
		}

		function loadNow() {
		    if (!loaded) {
			loaded = true;
			for (var i = 0; i < imgs.length; i++) {
			    var img = new Image();
			    img.onload = img.onerror = img.onabort = function() {
				var index = list.indexOf(this);
				if (index !== -1) {
				    // remove image from the array once it's loaded
				    // for memory consumption reasons
				   // list.splice(index, 1);
				}
			    };
			    //list.push(img);
			    //img.src = imgs[i];
			}
		    }
		}
	    }

	/* Detecting if Desktop or Mobile *************************** */

	/* Reference: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser */

	function mobileAndTabletCheck() {
		let mobileCheck = false;

		( function( a ){
			if( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test( a ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( a.substr(0,4 ) ) ) {
				mobileCheck = true;
			}
		} )( navigator.userAgent || navigator.vendor || window.opera );

		return mobileCheck;
	}

	function detectMobileByUserAgent() {
		const toMatch = [
		    /Mobi/i,
		    /Android/i,
		    /webOS/i,
		    /iPhone/i,
		    /iPad/i,
		    /iPod/i,
		    /BlackBerry/i,
		    /PlayBook/i,
		    /BB10/i,
		    /Nexus/i,
		    /Kindle Fire/i,
		    /PalmSource|Palm/i,
		    /Opera Mini/i,
		    /Windows Phone/i,
		    /WPDesktop/i,
		    /IEMobile/i
		];

		return toMatch.some( detectMobileByUserAgent2 );
	}

	function detectMobileByUserAgent2( toMatchItem ) {
		return navigator.userAgent.match( toMatchItem );
	}

	function detectMobileByTouch() {
		return ( navigator.maxTouchPoints ) || ( ( 'ontouchstart' in document.documentElement ) && ( ( window.innerWidth <= 1024 ) && ( window.innerHeight <= 768 ) ) );
	}

	function detectMobileByWidth() {

		// Any screen shorter than that will represent a mobile device */
		return ( ( window.innerWidth <= 800 ) && ( window.innerHeight <= 600 ) );
	}

	/* Complex Kaimallea mobile detection */
	/* Reference: https://github.com/kaimallea/isMobile/blob/master/src/isMobile.ts */

	var appleIphone = /iPhone/i;
	var appleIpod = /iPod/i;
	var appleTablet = /iPad/i;
	var appleUniversal = /\biOS-universal(?:.+)Mac\b/i;
	var androidPhone = /\bAndroid(?:.+)Mobile\b/i;
	var androidTablet = /Android/i;
	var amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i;
	var amazonTablet = /Silk/i;
	var windowsPhone = /Windows Phone/i;
	var windowsTablet = /\bWindows(?:.+)ARM\b/i;
	var otherBlackBerry = /BlackBerry/i;
	var otherBlackBerry10 = /BB10/i;
	var otherOpera = /Opera Mini/i;
	var otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
	var otherFirefox = /Mobile(?:.+)Firefox\b/i;

	var isAppleTabletOnIos13Kaimallea = function ( navigator ) {
		return ( typeof navigator !== 'undefined' &&
			navigator.platform === 'MacIntel' &&
			typeof navigator.maxTouchPoints === 'number' &&
			navigator.maxTouchPoints > 1 &&
			typeof MSStream === 'undefined' );
	};

	function createMatchKaimallea( userAgent ) {
		return function ( regex ) {
			return regex.test( userAgent );
		};
	}

	function isMobileKaimallea( param ) {
		var nav = {
			userAgent: '',
			platform: '',
			maxTouchPoints: 0
		};

		if ( ! param && typeof navigator !== 'undefined' ) {
			nav = {
				userAgent: navigator.userAgent,
				platform: navigator.platform,
				maxTouchPoints: navigator.maxTouchPoints || 0
			};
		} else if ( typeof param === 'string' ) {
			nav.userAgent = param;
		} else if ( param && param.userAgent ) {
			nav = {
				userAgent: param.userAgent,
				platform: param.platform,
				maxTouchPoints: param.maxTouchPoints || 0
			};
		}

		var userAgent = nav.userAgent;
		var tmp = userAgent.split( '[FBAN' );

		if ( typeof tmp[1] !== 'undefined' ) {
			userAgent = tmp[0];
		}

		tmp = userAgent.split( 'Twitter' );

		if ( typeof tmp[1] !== 'undefined' ) {
			userAgent = tmp[0];
		}

		var match = createMatchKaimallea( userAgent );
		var result = {
			apple: {
				phone: match( appleIphone ) && ! match( windowsPhone ),
				ipod: match( appleIpod ),
				tablet: ! match( appleIphone ) &&
					( match( appleTablet ) || isAppleTabletOnIos13Kaimallea( nav ) ) &&
					! match( windowsPhone ),
				universal: match( appleUniversal ),
				device: ( match( appleIphone ) ||
					match( appleIpod ) ||
					match( appleTablet ) ||
					match( appleUniversal ) ||
					isAppleTabletOnIos13Kaimallea( nav ) ) &&
					! match( windowsPhone )
			},
			amazon: {
				phone: match( amazonPhone ),
				tablet: ! match( amazonPhone ) && match( amazonTablet ),
				device: match( amazonPhone ) || match( amazonTablet )
			},
			android: {
				phone: ( ! match( windowsPhone ) && match( amazonPhone ) ) ||
					( ! match( windowsPhone ) && match( androidPhone ) ),
				tablet: ! match( windowsPhone ) &&
					! match( amazonPhone ) &&
					! match( androidPhone ) &&
					( match( amazonTablet ) || match( androidTablet ) ),
				device: ( ! match( windowsPhone ) &&
					( match( amazonPhone ) ||
						match( amazonTablet ) ||
						match( androidPhone ) ||
						match( androidTablet ) ) ) ||
					match( /\bokhttp\b/i )
			},
			windows: {
				phone: match( windowsPhone ),
				tablet: match( windowsTablet ),
				device: match( windowsPhone ) || match( windowsTablet )
			},
			other: {
				blackberry: match( otherBlackBerry ),
				blackberry10: match( otherBlackBerry10 ),
				opera: match( otherOpera ),
				firefox: match( otherFirefox ),
				chrome: match( otherChrome ),
				device: match( otherBlackBerry ) ||
					match( otherBlackBerry10 ) ||
					match( otherOpera ) ||
					match( otherFirefox ) ||
					match( otherChrome )
			},
			any: false,
			phone: false,
			tablet: false
		};

		result.any =
			result.apple.device ||
			result.android.device ||
			result.windows.device ||
			result.other.device;

		result.phone =
			result.apple.phone || result.android.phone || result.windows.phone;

		result.tablet =
			result.apple.tablet || result.android.tablet || result.windows.tablet;

		return result;
	}

	/* All detections options joined */

	function isMobile() {
		if ( detectMobileByWidth() ) {
			return true;
		} else if ( mobileAndTabletCheck() ) {
			return true;
		} else if ( detectMobileByTouch() ) {
			return true;
		} else if ( detectMobileByUserAgent() ) {
			return true;
		} else {
			var isMobileKaimalleaCheck = isMobileKaimallea();

			if ( isMobileKaimalleaCheck.any ) {
				return true;
			} else {
				return false;
			}
		}
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

		$( '.listar-business-rich-media-fields .listar-boxed-fields-inner-2' ).append( '<fieldset class="fieldset-company_business_rich_media fieldset-type-text listar-rich-media-fieldset"><label for="company_business_rich_media_value_' + rand + '">' + listarLocalizeAndAjax.mediaLinkOrCode + '</label><div class="field "><textarea class="input-text" name="company_business_rich_media_value_' + rand + '" id="company_business_rich_media_value_' + rand + '" >' + mediaValue + '</textarea><small class="description">' + listarLocalizeAndAjax.enterMediaValue + '</small></div></fieldset>' );
	}

	function getElementIndex( htmlMarkup ) {
		return htmlInner.indexOf( htmlMarkup );
	}

	function checkNavbarToggle() {
		if ( viewport().width > 767 && $( '.navbar-toggle' ).is( ':hidden' ) ) {
			$( selected ).removeClass( 'listar-primary-navbar-mobile-visible' );
		}
	}

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
	}
		
	function verifyBookingPopup() {
		return $( '.listar-booking-slide' ).length > 0;
	}

	function launchBookingPopup() {
		stopScrolling( 1 );
		$( '.listar-booking-popup' ).addClass( 'listar-showing-booking' ).css( { left : 0, opacity : 1 } );
	}

	function firstUserEventHappened() {
		if ( ! gotUpdatedNonce ) {
			var countFeatures = 1;
			var owlCarouselsStart = $( '.listar-carousel-loop.listar-use-carousel' );
			var fixDelay = 600;

			setTimeout( function () {
				theDocument.off( 'touchstart touchmove scroll mouseenter mousedown mousemove DOMMouseScroll mousewheel keyup' );
				theBody.removeClass( 'listar-not-loaded' );
			
				/* Optimization Mar 22 2021 */
				
				convertDataBackgroundImage();
			}, fixDelay );

			
			gotUpdatedNonce = true;
			
			/*xxx6584*/
			setInterval( function () {
				
				theBody.find( '[data-background-image]' ).each( function () {
					if ( isInViewport( $( this ) ) ) {
						convertDataBackgroundImage( $( this ) );
					}
				} );				

				$( '.single-job_listing .listar-listing-header-topbar-wrapper.listar-show-all-topbar-buttons:not(.listar-listing-header-menu-fixed)' ).each( function () {
					if ( isInViewport( $( this ) ) ) {
						$( '.listar-bookmark-button-fixed, .listar-operating-hours-quick-button-wrapper, .listar-booking-quick-button-wrapper' ).removeClass( 'listar-allow-visibility' );
					} else {
						$( '.listar-bookmark-button-fixed, .listar-operating-hours-quick-button-wrapper, .listar-booking-quick-button-wrapper' ).addClass( 'listar-allow-visibility' );
					}
				} );

				if ( ! $( '.single-job_listing .listar-listing-header-topbar-wrapper.listar-show-all-topbar-buttons:not(.listar-listing-header-menu-fixed)' ).length ) {
					$( '.listar-bookmark-button-fixed, .listar-operating-hours-quick-button-wrapper, .listar-booking-quick-button-wrapper' ).removeClass( 'listar-allow-visibility' );
				}

				if ( $( '.listar-load-card-content-ajax .listar-location-references-wrapper' ).length ) {
					$( '.listar-load-card-content-ajax' ).addClass( 'listar-cards-has-reference-row' );
				}

				$( '.listar-load-card-content-ajax .listar-listing-card' ).not( '.listar-card-content-ajax-loading, .listar-card-content-ajax-loaded, .listar-grid-filler' ).each( function () {
					if ( isInViewport( $( this ) ) ) {
						$( this ).addClass( 'listar-card-content-ajax-loading' );
						loadListingCardContentAjax( $( this ) );
					}
				} );

				$( '.listar-load-card-content-ajax' ).find( '.listar-grid-filler' ).each( function () {
					$( this ).addClass( 'listar-height-changed' );
				} );

				if ( ! skipEmbedDtOptimization ) {
					dtTags = $( 'dt' );
				}

				if ( ! skipEmbedDlOptimization ) {
					dlTags = $( 'dl' );
				}

				if ( dtTags.length ) {
					dtTags.each( function () {
						if ( ! $( this )[0].hasAttribute( 'data-skip-tag' )  ) {
							if ( isInViewport( $( this ) )  ) {
								var tempOuterHTML = $( this ).prop( 'outerHTML' );
								var dtTagNames = [ 'param', 'source' ];
								var breakThis = false;

								for ( var dt = 0; dt < dtTagNames.length; dt++ ) {
									if ( ! breakThis ) {
										var currentTagName = dtTagNames[ dt ];

										if ( $( this )[0].hasAttribute( 'data-dynamic-embed-' + currentTagName ) ) {
											tempOuterHTML = tempOuterHTML.replace( '<dt', '<' + currentTagName );
											tempOuterHTML = tempOuterHTML.replace( '</dt', '</' + currentTagName );
											tempOuterHTML = tempOuterHTML.replace( 'data-dynamic-embed-' + currentTagName, 'data-skip-tag' );
											tempOuterHTML = tempOuterHTML.replace( /data-temp-/g, '' );
											$( this ).prop( 'outerHTML', tempOuterHTML );
											breakThis = true;
										}
									}
								}
							}
						}
					} );
				} else {
					skipEmbedDtOptimization = true;
				}

				if ( dlTags.length ) {
					dlTags.each( function () {
						if ( ! $( this )[0].hasAttribute( 'data-skip-tag' ) ) {
							if ( isInViewport( $( this ) ) ) {
								var tempOuterHTML = $( this ).prop( 'outerHTML' );
								var dlTagNames = [ 'iframe', 'object', 'audio', 'audio', 'video' ];
								var breakThis = false;

								for ( var dl = 0; dl < dlTagNames.length; dl++ ) {
									if ( ! breakThis ) {
										var currentTagName = dlTagNames[ dl ];

										if ( $( this )[0].hasAttribute( 'data-dynamic-embed-' + currentTagName ) ) {
											tempOuterHTML = tempOuterHTML.replace( '<dl', '<' + currentTagName );
											tempOuterHTML = tempOuterHTML.replace( '</dl', '</' + currentTagName );
											tempOuterHTML = tempOuterHTML.replace( 'data-dynamic-embed-' + currentTagName, 'data-skip-tag' );
											tempOuterHTML = tempOuterHTML.replace( /data-temp-/g, '' );
											$( this ).prop( 'outerHTML', tempOuterHTML );
											breakThis = true;
										}
									}
								}

								setTimeout( function () {
									if ( window.wp && window.wp.mediaelement ) {
										window.wp.mediaelement.initialize();
									}

									equalizeVideoHeights();
								}, 50 );
							}
						}
					} );
				} else {
					skipEmbedDlOptimization = true;
				}
			}, 250 );

			/*xxx 6782 */

			/*xxx 7215 */
			setTimeout( function () {
				$( '#job_business_use_booking' ).each( function () {
					if ( $( this ).is( ':checked' ) ) {
						$( '.fieldset-job_business_bookings_third_party_service' ).css( { display : 'block' } );
					}
				} );
			}, 300 );


			/* Prepare wrapper for menu/catalog files - external */
			setTimeout( function () {
				$( '.fieldset-job_business_document_1_title_external' ).each( function () {
					var
						docsSection2 = $( this ),
						checkboxDoc = $( '.fieldset-job_business_use_catalog_external' ).prop( 'outerHTML' ),
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

					$( '.fieldset-job_business_use_catalog_external' ).prop( 'outerHTML', '' );

					$( '.listar-business-catalog-fields.listar-boxed-fields-docs-external .listar-catalog-files-header' ).before( checkboxDoc );

					setTimeout( function () {
						if ( $( '#job_business_use_catalog' ).is( ':checked' ) ) {
							$( '.listar-business-catalog-fields.listar-boxed-fields-docs-external' ).removeClass( 'hidden' );
						}

						if ( $( '#job_business_use_catalog_external' ).is( ':checked' ) ) {
							$( '.listar-business-catalog-fields.listar-boxed-fields-docs-external .listar-boxed-fields-inner' ).removeClass( 'hidden' );
						}
					}, 100 );

				} );
			}, 20 );

			/*xxx 7913 */
			setTimeout( function () {
				$( '.listar-account-menu-item ul a' ).off( 'click' );
			}, 1200 );

			/*xxx 8189 */
			setTimeout( function () {
				setTooltips();
			}, 1000 );


			/*xxx 8512 */
			setTimeout( function () {
				if ( false === preventEvenCallStack3 ) {
					preventEvenCallStack3 = true;

					setTimeout( function () {
						$( '.select2-selection__rendered, .select2-selection__rendered li' ).each( function () {
							if ( $( this )[0].hasAttribute( 'title' ) ) {
								$( this ).attr( 'title', $.trim( $( this ).attr( 'title' ) ) );
							}
						} );

						$( '.listar-custom-select' ).each( function () {
							var selectedCount = $( this ).find( 'option[selected]' );
							var mainClass = $( this ).attr( 'class' ).split( ' ' );

							mainClass = mainClass[0];

							if ( ! $( this ).hasClass( 'listar-search-sort-listings' ) && selectedCount.length ) {
								$( this ).attr( 'data-selected-count', selectedCount.length );
							}

							$( this ).siblings( '.select2-container' ).find( '.select2-selection__choice__remove' ).each( function () {
								$( this ).addClass( '____' + mainClass );
							} );
						} );
					}, 20 );
				}
			}, 800 );

			/*xxx 9824 */
			/* Replicate fixed header menu for single listing pages */
			setTimeout( function () {
				$( '.listar-listing-header-topbar-wrapper' ).each( function () {
					var listingHeaderMenu = $( this );
					var listingHeaderMenuClone = listingHeaderMenu.clone();

					listingHeaderMenu.after( listingHeaderMenuClone.addClass( 'listar-listing-header-menu-fixed listar-hidden-fixed-button' ) );
				} );
			}, 1200 );

			/*xxx 9833 */
			setTimeout( function () {
				var iconClass = 'icon-paperclip';

				if ( $( 'article .post-password-form' ).length ) {
					iconClass = 'icon-lock';
				}

				if ( theBody.hasClass( 'single-post' ) ) {
					if ( $( '.listar-single-content p.has-background[class*="fa fa-"], .listar-single-content p.has-background[class*="icon-"]' ).length ) {
						iconClass = $( '.listar-single-content p.has-background[class*="fa fa-"], .listar-single-content p.has-background[class*="icon-"]' ).eq( 0 ).attr( 'class' ).replace( / has-/g, ' ' );
					}

					$( '.listar-page-header .listar-page-header-content' )
						.append( '<span class="listar-post-header-icon-1 listar-delay-effect ' + iconClass + '"></span>' )
						.append( '<span class="listar-post-header-icon-2 listar-delay-effect ' + iconClass + '"></span>' )
						.append( '<span class="listar-post-header-icon-3 listar-delay-effect ' + iconClass + '"></span>' )
						.append( '<span class="listar-post-header-icon-4 listar-delay-effect ' + iconClass + '"></span>' )
						.append( '<span class="listar-post-header-icon-5 listar-delay-effect ' + iconClass + '"></span>' );

					$( '.listar-page-header .listar-page-header-content [class*="listar-post-header-icon-"]' )
						.removeClass( 'has-background' )
						.removeClass( 'has-text-color' );

					setTimeout( function () {
						$( '.listar-post-header-icon-1' ).removeClass( 'listar-delay-effect' );
					}, 1600 );

					setTimeout( function () {
						$( '.listar-post-header-icon-2' ).removeClass( 'listar-delay-effect' );
					}, 1900 );

					setTimeout( function () {
						$( '.listar-post-header-icon-3' ).removeClass( 'listar-delay-effect' );
					}, 2200 );

					setTimeout( function () {
						$( '.listar-post-header-icon-4' ).removeClass( 'listar-delay-effect' );
					}, 2500 );

					setTimeout( function () {
						$( '.listar-post-header-icon-5' ).removeClass( 'listar-delay-effect' );
					}, 2800 );
				}

			}, 1 );

			/*xxx 10010 */
			setTimeout( function () {
				$( 'input[type="checkbox"]' ).each( function () {
					$( this ).parent().addClass( 'listar-custom-checkbox' );

					if( $( this ).is( ':checked' ) ) {
						$( this ).parent().addClass( 'listar-custom-checkbox-checked' );
					}
				} );
			}, 1500 );

			/*xxx 10020 */
			setTimeout( function () {
				var hasPhones = false;

				$( '.job-manager-form #company_phone, .job-manager-form #company_fax, .job-manager-form #company_mobile, .job-manager-form #company_whatsapp' ).each( function () {
					if ( ! hasPhones ) {
						hasPhones = true;

						var phoneFields = [];
						var fieldIndex = 0;

						if ( $( '.job-manager-form #company_phone' ).length ) {
							phoneFields.push( '#company_phone' );
						}

						if ( $( '.job-manager-form #company_fax' ).length ) {
							phoneFields.push( '#company_fax' );
						}

						if ( $( '.job-manager-form #company_mobile' ).length ) {
							phoneFields.push( '#company_mobile' );
						}

						if ( $( '.job-manager-form #company_whatsapp' ).length ) {
							phoneFields.push( '#company_whatsapp' );
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
			}, 1000 );
			
			/* End Optimization Mar 22 2021 */
			
			getUpdatedNonce();

			$( '.listar-features-design-2 .listar-feature-item-title ' ).each( function () {
				$( this ).find( 'span' ).prepend( '<span>0' + countFeatures + '</span>' );
				$( this ).addClass( 'listar-feature-counter-added' );
				countFeatures++;
			} );

			$( '.listar-listing-regions-popup, .listar-search-by-popup, .listar-report-popup, .listar-claim-popup, .listar-listing-categories-popup' ).each( function () {
				$( this ).addClass( 'listar-toggle-background-image' );
			} );

			/* Move background image URL from 'data-background-image' attribute to 'background-image' for Call To Action widget if it has the wavy badge mask */

			setTimeout( function () {
				$( '.listar-has-wavy-badge-mask [data-background-image]' ).each( function () {
					convertDataBackgroundImage( $( this ) );
				} );
			}, 10 );

			startHeightEqualizer();
			updateOperatingHoursAndAvailability();
			setSmashBalloonImages();			

			setTimeout( function () {
				initOwlCarousel( owlCarouselsStart, true );
			}, fixDelay );

			startAfterFirstInteraction();
			termNameBigEffect();
		}
	}

	function stopScrolling( action ) {
		if ( ! isMobile() ) {
			if ( ! theBody.hasClass( 'listar-showing-map' ) ) {
				if ( 1 === action ) {
					saveScrollPosition = false;
					theBody.addClass( 'listar-stop-scrolling' );
				} else {
					theBody.removeClass( 'listar-stop-scrolling' );
					htmlAndBody.stop().animate( { scrollTop : lastScrollPosition }, 1 );
					saveScrollPosition = true;
				}
			}
		} else {
			if ( ! theBody.hasClass( 'listar-showing-map' ) ) {
				if ( 1 === action ) {
					saveScrollPosition = false;
					setTimeout( function() {
						theBody.addClass( 'listar-stop-scrolling-mobile' );
					}, 500 );
				} else {
					theBody.removeClass( 'listar-stop-scrolling-mobile' );
					htmlAndBody.stop().animate( { scrollTop : lastScrollPosition }, 1 );
					saveScrollPosition = true;
				}
			}
		}
	}

	function hideListingSearchMenu() {
		if ( ! isBrowsingSearchMenu && loadingClick ) {
			$( '.listar-search-popup .listar-hero-section-title' ).removeClass( 'listar-reduce-hero-title' );
			$( '.listar-listing-search-menu-wrapper' ).addClass( 'hidden' );
			$( '.listar-search-categories.listar-categories-fixed-bottom' ).removeClass( 'hidden' );
		}
	}

	function checkScrolling() {
		if ( viewport().width > 767 ) {
			if ( '0px' === $( '#listar-primary-menu' ).css( 'left' ) ) {
				$( '.navbar-toggle' ).trigger( 'click' );
			}
		}
	}

	function resetAccordionPropagation() {
		setTimeout( function () {
			cancelAccordionPropagation = false;
		}, 10 );
	}

	function validHexColor( color ){
		var $div = $( '<div>' );
		$div.css( 'border', '1px solid ' + color );
		return ( '' !== $div.css( 'border-color' ) );
	}

	function headerTopbarDistance( ignoreHeadmenu ) {
		var
			distance = 0,
			adminBar = $( '#wpadminbar' );

		if ( 'undefined' === typeof ignoreHeadmenu ) {
			distance = headMenu.height();

			if ( distance < 74 ) {
				distance = 74;
			}
		}

		if ( adminBar.length ) {
			distance += adminBar.height();
		}

		return distance;
	}

	function toggleCheckboxDependantField( checkField, dependant, hideParent ) {
		$( checkField ).each( function () {
			dependant = true === hideParent ? $( dependant ).parent() : $( dependant );

			if ( $( this ).is( ':checked' ) ) {
				dependant.removeClass( 'hidden' );
			} else {
				dependant.addClass( 'hidden' );
			}
		} );
	}

	function selectClaimPackage() {
		window.location.replace( '' );
		window.location.replace( currentURL + '&claim_package_id=' + currentClaimPackageID );
		return false;
	}

	// Add/Remove listings from user Bookmarks list
	function handleBookmarks( callerButton, bookmarkListingID, bookmarkUserID, bookmarkAction = 'add'  ) {

		callerButton.addClass( 'listar-bookmark-loading' );

		var theAjaxURL = listarSiteURL + '/wp-content/plugins/listar-addons/inc/bookmark-ajax.php';
		var dataToSend = { send_data : '[{"type":"' + bookmarkAction + '"},{"id":"' + bookmarkListingID + '"},{"user":"' + bookmarkUserID + '"}]' };

		$.ajax( {
			crossDomain: true,
			url: theAjaxURL,
			type: 'POST',
			data: dataToSend,
			cache    : false,
			timeout  : 30000

		} ).done( function ( response ) {
			callerButton.removeClass( 'listar-bookmark-loading' );

			if ( response && 'string' === typeof response ) {
				if ( response.indexOf( 'Done!' ) >= 0 ) {
					var bookmarkCounter = parseInt( callerButton.siblings( '.listar-bookmark-counter' ).attr( 'data-bookmark-counter' ), 10 );

					if ( 'add' === bookmarkAction ) {
						bookmarkCounter++;
						callerButton.parent().addClass( 'listar-bookmarked-item' );
					} else {
						bookmarkCounter--;
						callerButton.parent().removeClass( 'listar-bookmarked-item' );
					}

					callerButton.siblings( '.listar-bookmark-counter' ).attr( 'data-bookmark-counter', bookmarkCounter );
					callerButton.siblings( '.listar-bookmark-counter' ).prop( 'innerHTML', bookmarkCounter );
				}
			}
		} );
	}

	// Get detailed data for geolocated coordinates.
	function saveGeolocationDetails( latitude, longitude, address, number, region, country, geolocationType ) {

		// geolocationType: address-save, address-edit-save.

		if (
			! 'string' === typeof address ||
			! 'string' === typeof region ||
			! 'string' === typeof country ||

			'' === address ||
			'' === region ||
			'' === country
		) {
			return impossibleGeolocation( '', '' );
		}

		var saveNearestMe = isNearestMeReload ? 'save' : '';
		var theAjaxURL = listarSiteURL + '/wp-content/plugins/listar-addons/inc/geolocate-data.php';
		var dataToSend = ',{"data-order-1":"' + address + ' ' + number + ' ' + region + ' ' + country + '"}';
		dataToSend = { send_data : '[{"type":"' + geolocationType + '"},{"latitude":"' + latitude + '"},{"longitude":"' + longitude + '"},{"saveNearestMe":"' + saveNearestMe + '"}' + dataToSend + ']' };

		$.ajax( {
			crossDomain: true,
			url: theAjaxURL,
			type: 'POST',
			data: dataToSend,
			cache    : false,
			timeout  : 30000

		} ).done( function ( response ) {
			if ( response ) {
				var data = $.parseJSON( response );
				var tempConfirm = false;

				if ( 'reset' === geolocationType ) {
				} else {
					$.each( data, function() {
						if (
							'string' !== typeof this.lat && '' !== this.lat &&
							'string' !== typeof this.lng && '' !== this.lng
						) {
							tempConfirm = true;
						}
					} );

					if ( tempConfirm ) {

						var newExploreByClass = 'listar-search-by-button fa fa-scrubber';
						var newExploreByPlaceholder = $( '.listar-general-explore-by-options a[data-explore-by-type="nearest_me"]' ).attr( 'data-explore-by-placeholder' );
						var newExploreByTitle = $( '.listar-general-explore-by-options a[data-explore-by-type="nearest_me"]' ).attr( 'data-explore-by-title' );
						var newExploreBySlug = $( '.listar-general-explore-by-options a[data-explore-by-type="nearest_me"]' ).attr( 'data-explore-by-type' );
						var newExploreByOrder = $( '.listar-general-explore-by-options a[data-explore-by-type="nearest_me"]' ).attr( 'data-explore-by-order' );

						$( '.listar-search-by-button' ).attr( 'class', newExploreByClass ).attr( 'data-explore-by-type', newExploreBySlug );

						$( 'input[name="' + listarLocalizeAndAjax.listingSortTranslation + '"]' ).val( newExploreByOrder );
						$( 'input[name="' + listarLocalizeAndAjax.exploreByTranslation + '"]' ).val( newExploreBySlug );
						$( '.listar-listing-search-input-field' ).attr( 'placeholder', newExploreByPlaceholder );
						$( '.listar-current-search-by' ).prop( 'innerHTML', newExploreByTitle );

						$( '.listar-search-by-popup .listar-back-site' )[0].click();

						if ( isNearestMeReload ) {
							var href = currentURL;

							if ( href.indexOf( 'explore_by' ) ) {
								var urlParams = new URLSearchParams( window.location.search );
								var exploreByParam = urlParams.get( 'explore_by' );
								var listingSortParam = urlParams.get( 'listing_sort' );

								href = href.replace( 'listing_sort=' + listingSortParam, 'listing_sort=nearest_me'  );
								href = href.replace( 'explore_by=' + exploreByParam, 'explore_by=nearest_me'  );
							}

							if ( href.indexOf( '#' ) >=0 ) {
								href = href.split( '#' );
								href = href[0];
							}

							if ( -1 === href.indexOf( '?' ) ) {
								href = href + '?near=';
							}

							nearestHash = "#" + nearestHash;

							window.location.replace( '' );
							window.location.replace( href + nearestHash );
						} else {
							$( '.listar-hero-search-wrapper .search-form' ).submit();
						}

					} else {
						impossibleGeolocation( region, country );
					}
				}
			} else {
				impossibleGeolocation( region, country );
			}
		} ).fail( function( response ) {
			impossibleGeolocation( region, country );
		} );
	}

	function featuredListingCategorySelect( currentSelected ) {

		currentSelected = 'string' === typeof currentSelected ? currentSelected : '';

		setTimeout( function () {
			$( '#job_category' ).each( function () {
				var outerSelectCategories = $( this ).prop( 'outerHTML' );
				var hasFoundSelected = false;
				outerSelectCategories = outerSelectCategories.replace( /job_category/g, 'featured_job_category' ).replace( /&nbsp;/g, '' );

				var selectedCats = $( "#job_category" ).val();

				$( '.listar-featured-job-categories' ).each( function () {
					$( '#featured_job_category[data-select2-id]' ).each( function () {
						var hasSelect2 = true;

						try {
							$( this ).select2( '' );
						} catch( err ) {
							// No Select2 in the element
							hasSelect2 = false;
						}

						if ( hasSelect2 ) {
							$( this ).siblings( '.select2' ).prop( 'outerHTML', '' );
							$( this ).select2( 'destroy' ).removeAttr( 'data-select2-id' );

								$( this ).find( 'option' ).each( function () {
									$( this ).removeAttr( 'data-select2-id' );
								} );
						}

						currentSelected = $( this ).val();

						$( this ).prop( 'outerHTML', '' );
					} );

					$( this ).prop( 'outerHTML', '' );
				} );

				if ( null !== selectedCats ) {
					if ( 'object' === typeof selectedCats ) {
						var countSelectedCats = Object.keys( selectedCats ).length;

						if ( countSelectedCats > 1 ) {

							if ( $( ".fieldset-job_category" ).length ) {
								$( '.fieldset-job_category' ).after( '<fieldset class="fieldset-job_featured_category fieldset-type-term-multiselect listar-featured-job-categories"><label for="job_category_featured">' + listarLocalizeAndAjax.featuredCategory + '</label><div class="field">' + outerSelectCategories + '</div></fieldset>' );
							}

							$( '#featured_job_category' ).removeAttr( 'multiple' ).removeAttr( 'data-multiple_text' ).removeAttr( 'data-select2-id' ).removeAttr( 'data-no_results_text' ).removeClass( 'select2-hidden-accessible job-manager-category-dropdown' );

							var selectedCatsAsArray = [];

							Object.keys( selectedCats ).forEach( function( key ) {
								selectedCatsAsArray.push( selectedCats[key] );
							} );

							$( '#featured_job_category option' ).each( function () {
								var testCategoryID = $( this ).attr( 'value' );

								if ( -1 === selectedCatsAsArray.indexOf( testCategoryID ) ) {
									$( this ).prop( 'outerHTML', '' );
								} else {
									$( this ).removeAttr( 'data-select2-id' ).removeAttr( 'class' );

									if ( currentSelected === $( this ).attr( 'value' ) ) {
										$( '#company_featured_listing_category' ).val( currentSelected );
										$( '#featured_job_category' ).val( currentSelected );
										$( this ).attr( 'selected', 'selected' );

										hasFoundSelected = true;
									} else {
										$( this ).removeAttr( 'selected' );
									}
								}
							} );

							if ( ! $( '#featured_job_category option' ).length ) {
								$( '#featured_job_category' ).prop( 'outerHTML', '' );
							}

							if ( ! hasFoundSelected ) {
								$( '#company_featured_listing_category' ).val( '' );
							}

							$( '#featured_job_category' ).select2( {
								minimumResultsForSearch: -1
							} );
						} else {
                                                        $( '#company_featured_listing_category' ).val( '' );
                                                }
					}
				}
			} );

			setTimeout( function () {
				$( '.job-manager-category-dropdown' ).each( function () {
					$( this ).siblings( '.select2' ).find( 'input[class="select2-search__field"]' ).each( function () {
						$( this ).attr( 'autocomplete', 'new-password' );
					} );
				} );
			}, 50 );
		}, 50 );
	}

	function featuredListingRegionSelect( currentSelected ) {

		if ( multipleRegionsActive ) {
			currentSelected = 'string' === typeof currentSelected ? currentSelected : '';

			setTimeout( function () {
				$( '#job_region' ).each( function () {
					var outerSelectRegions = $( this ).prop( 'outerHTML' );
					var hasFoundSelected = false;
					outerSelectRegions = outerSelectRegions.replace( /job_region/g, 'featured_job_region' ).replace( /&nbsp;/g, '' );

					var selectedRegs = $( "#job_region" ).val();

					$( '.listar-featured-job-regions' ).each( function () {
						$( '#featured_job_region[data-select2-id]' ).each( function () {
							var hasSelect2 = true;

							try {
								$( this ).select2( '' );
							} catch( err ) {
								// No Select2 in the element
								hasSelect2 = false;
							}

							if ( hasSelect2 ) {
								$( this ).siblings( '.select2' ).prop( 'outerHTML', '' );
								$( this ).select2( 'destroy' ).removeAttr( 'data-select2-id' );

								$( this ).find( 'option' ).each( function () {
									$( this ).removeAttr( 'data-select2-id' );
								} );
							}

							currentSelected = $( this ).val();

							$( this ).prop( 'outerHTML', '' );
						} );

						$( this ).prop( 'outerHTML', '' );
					} );

					if ( null !== selectedRegs ) {
						if ( 'object' === typeof selectedRegs ) {
							var countSelectedRegs = Object.keys( selectedRegs ).length;

							if ( countSelectedRegs > 1 ) {

								if ( $( ".fieldset-job_region" ).length ) {
									$( '.fieldset-job_region' ).after( '<fieldset class="fieldset-job_featured_region fieldset-type-term-multiselect listar-featured-job-regions"><label for="job_region_featured">' + listarLocalizeAndAjax.featuredRegion + '</label><div class="field">' + outerSelectRegions + '</div></fieldset>' );
								}

								$( '#featured_job_region' ).removeAttr( 'multiple' ).removeAttr( 'data-multiple_text' ).removeAttr( 'data-select2-id' ).removeAttr( 'data-no_results_text' ).removeClass( 'select2-hidden-accessible job-manager-region-dropdown' );

								var selectedRegsAsArray = [];

								Object.keys( selectedRegs ).forEach( function( key ) {
									selectedRegsAsArray.push( selectedRegs[key] );
								} );

								$( '#featured_job_region option' ).each( function () {
									var testRegionID = $( this ).attr( 'value' );

									if ( -1 === selectedRegsAsArray.indexOf( testRegionID ) ) {
										$( this ).prop( 'outerHTML', '' );
									} else {
										$( this ).removeAttr( 'data-select2-id' ).removeAttr( 'class' );

										if ( currentSelected === $( this ).attr( 'value' ) ) {
											$( '#company_featured_listing_region' ).val( currentSelected );
											$( '#featured_job_region' ).val( currentSelected );
											$( this ).attr( 'selected', 'selected' );

											hasFoundSelected = true;
										} else {
											$( this ).removeAttr( 'selected' );
										}
									}
								} );

								if ( ! $( '#featured_job_region option' ).length ) {
									$( '#featured_job_region' ).prop( 'outerHTML', '' );
								}

								if ( ! hasFoundSelected ) {
									$( '#company_featured_listing_region' ).val( '' );
								}

								$( '#featured_job_region' ).select2( {
									minimumResultsForSearch: -1
								} );
							} else {
                                                                $( '#company_featured_listing_region' ).val( '' );
                                                        }
						}
					}
				} );

				setTimeout( function () {
					$( '.job-manager-category-dropdown' ).each( function () {
						$( this ).siblings( '.select2' ).find( 'input[class="select2-search__field"]' ).each( function () {
							$( this ).attr( 'autocomplete', 'new-password' );
						} );
					} );
				}, 50 );
			}, 50 );
		}
	}

	function ajaxCleanOldSerchResults() {
		$( '.listar-ajax-search li' ).not( '.listar-searching-ajax-results-item' ).each( function () {
			$( this ).prop( 'outerHTML', '' );
		} );
	}

	function ajaxSerchingResults() {
		$( '.listar-ajax-search' ).removeClass( 'hidden' ).addClass( 'listar-showing-ajax-search' );

		$( '.listar-searching-string, .listar-loading-string' ).each( function () {
			$( this ).prop( 'innerHTML', $( this ).attr( 'data-searching' ) );
		} );

		ajaxCleanOldSerchResults();

		$( '.listar-searching-ajax-results .listar-cat-icon' ).each( function () {
			var notFoundClasses = $( this ).attr( 'data-not-found' );
			var searchingClasses = $( this ).attr( 'data-searching' );

			$( this ).removeClass( notFoundClasses ).addClass( searchingClasses );
		} );

		$( '.listar-ajax-search' ).removeClass( 'listar-ajax-search-found-results' );
	}

	function ajaxSerchNoResults() {
		$( '.listar-searching-ajax-results .listar-cat-icon' ).each( function () {
			var notFoundClasses = $( this ).attr( 'data-not-found' );
			var searchingClasses = $( this ).attr( 'data-searching' );

			$( this ).removeClass( searchingClasses ).addClass( notFoundClasses );
		} );

		$( '.listar-searching-string, .listar-loading-string' ).each( function () {
			$( this ).prop( 'innerHTML', $( this ).attr( 'data-not-found' ) );
		} );

		ajaxCleanOldSerchResults();

		$( '.listar-ajax-search' ).removeClass( 'listar-ajax-search-found-results' );
	}

	function unhideSearchMenu() {
		$( '.listar-ajax-search' ).addClass( 'hidden' ).removeClass( 'listar-showing-ajax-search' );
	}

	// Submit claim verification text.
	function sendClaimVerificationText() {

		var claimTextForm = $( '#listar-claim-form' );

		var theAjaxURL = claimTextForm.attr( 'action' );
		var dataToSend = { send_data : '[{"text":"' + encodeURIComponent( claimTextForm.find( 'textarea' ).val() ) + '"},{"nonce":"' + claimTextForm.find( '#listar-claim-security' ).val() + '"}]' };

		$.ajax( {
			crossDomain: true,
			url: theAjaxURL,
			type: 'POST',
			data: dataToSend,
			cache    : false,
			timeout  : 30000

		} ).done( function ( response ) {
			if ( 'string' === typeof response ) {
				if ( -1 !== response.indexOf( 'listar-valid-ajax-process-completed' ) ) {
					selectClaimPackage();

					// Make sure that the form has the 'sent-success' class.
					claimTextForm.parent().removeClass( 'sent-error' );
					claimTextForm.parent().addClass( 'sent-success' );
				} else {

					// Make sure that the form has the 'sent-error' class.
					claimTextForm.parent().removeClass( 'sent-success' );
					claimTextForm.parent().addClass( 'sent-error' );

					$( 'button[data-loading-text]' ).prop( 'innerHTML', $( this ).attr( 'data-button-text' ) );
				}
			} else {

				// Make sure that the form has the 'sent-error' class.
				claimTextForm.parent().removeClass( 'sent-success' );
				claimTextForm.parent().addClass( 'sent-error' );

				$( 'button[data-loading-text]' ).prop( 'innerHTML', $( this ).attr( 'data-button-text' ) );
			}
		} ).fail( function() {

			// Make sure that the form has the 'sent-error' class.
			claimTextForm.parent().removeClass( 'sent-success' );
			claimTextForm.parent().addClass( 'sent-error' );

			$( 'button[data-loading-text]' ).prop( 'innerHTML', $( this ).attr( 'data-button-text' ) );
		} );
	}

	myScaleFunction = debounce( function () {
		scaleHeader();
	}, 2050 );

	function termNameBigEffect() {
		if ( ( ! isMobile() || ( theBody.hasClass( 'listar-force-big-text-category' ) || theBody.hasClass( 'listar-force-big-text-region' ) ) ) && theBody.find( '.listar-term-name-big' ).length > 0 && theBody.attr( 'class' ).indexOf( 'listar-enable-big-text-' ) >= 0 ) {
			myScaleFunction();
			window.addEventListener( 'resize', myScaleFunction );
		}
	}

	function populateTermPopups( $popup ) {
		if ( 'categories' === $popup ) {

			/*
			 * Populate the 'listing categories' popup with listing categories from hero header.
			 * Make it with JavaScript to avoid duplicated WP_Query.
			 */
			$( '.listar-search-categories .listar-listing-categories' ).each( function () {
				var terms = $( this ).find( '.listar-listing-category-link' );

				terms.each( function () {
					var term = $( this );

					var termURL = term.attr( 'href' ),
						termId = term.attr( 'data-term-id' ),
						termColor = term.attr( 'data-term-color' ),
						termGradientOverlay = term.attr( 'data-gradient-background' ),
						termImage = term.attr( 'data-term-image' ),
						termIcon = term.find( '.listar-category-icon-wrapper span' ),
						termIconContent,
						termName = term.attr( 'data-term-name' ),
						termDescription = term.attr( 'data-term-description' ),
						termCount = term.attr( 'data-term-count' ),
						termCountHover = term.attr( 'data-term-count-hover' );

					if ( termIcon.length ) {
						termIconContent = termIcon.prop( 'innerHTML' );
					} else {
						termIcon = '';
					}

					$( '.listar-listing-categories-popup .listar-term-items' ).each( function () {
						var popup = $( this ),
							buildTerm = '';

						popup.append( '<div class="listar-featured-listing-term-item listar-term-bordered col-xs-12 col-sm-6 col-md-4 listar-build-term"><div class="listar-term-wrapper"></div></div>' );

						buildTerm = popup.find( '.listar-build-term .listar-term-wrapper' );

						buildTerm
							.append( '<a class="listar-term-link listar-hoverable-overlay" href="' + termURL + '"></a>' )
							.append( '<div class="listar-term-3d-effect-wrapper"></div>' );

						buildTerm.find( '.listar-term-3d-effect-wrapper' )
							.append( '<div class="listar-term-inner"></div>' )
							.append( '<div class="listar-term-count-hover"></div>' );

						buildTerm.find( '.listar-term-count-hover' )
							.append( termCountHover );

						if ( '' !== termIcon ) {
							buildTerm.find( '.listar-term-inner' ).append( '<div class="listar-cat-icon" style="background-color:rgb(' + termColor + ');"></div>' );

							buildTerm.find( '.listar-cat-icon' ).addClass( termIcon.attr( 'class' ) );
							buildTerm.find( '.listar-cat-icon' ).prop( 'innerHTML', termIconContent );
						}

						buildTerm.find( '.listar-term-inner' )
							.append( '<div class="listar-term-data-wrapper"></div>' )
							.append( '<div class="listar-term-counter" style="background-color:rgb(' + termColor + ');"></div>' );

						buildTerm.find( 'a' )
							.attr( 'data-term-id', termId );

						buildTerm.find( '.listar-term-data-wrapper' )
							.append( '<div class="listar-term-overlay" style="background-color:rgba(' + termColor + ',0.7);"></div>' )
							.append( '<div class="listar-gradient-overlay" style="' + termGradientOverlay + '"></div>' )
							.append( '<div class="listar-listing-term-image listar-term-on-popup" data-background-image="' + termImage + '"></div>' )
							.append( '<div class="listar-term-background-overlay" style="background-color:rgb(' + termColor + ');box-shadow: 5px 5px rgb(' + termColor + ');"></div>' )
							.append( '<div class="listar-lateral-padding listar-term-text-wrapper"><div class="listar-term-text listar-ribbon">' + termName + '</div></div>' );

						buildTerm.find( '.listar-term-text-wrapper' )
							.append( '<div class="listar-term-name-big"><span>' + termName + '</span></div>' );

						if ( '' !== termDescription && viewport().width >= 378 ) {
							buildTerm.find( '.listar-term-text-wrapper' ).append( '<div class="listar-term-description">' + termDescription + '</div>' );
						}

						buildTerm.find( '.listar-term-counter' )
							.append( termCount );

						buildTerm.parent().removeClass( 'listar-build-term' );

						return false;
					} );
				} );

				return false;
			} );

		}

		if ( 'regions' === $popup ) {

			/*
			 * Populate the 'listing regions' popup with listing regions from hero header.
			 * Make it with JavaScript to avoid duplicated WP_Query.
			 */
			$( '.listar-search-regions .listar-regions-list' ).each( function () {
				var terms = $( this ).find( '.listar-listing-region-link' );

				terms.each( function () {
					var term = $( this );

					var termURL = term.attr( 'href' ),
						termId = term.attr( 'data-term-id' ),
						termColor = term.attr( 'data-term-color' ),
						termGradientOverlay = term.attr( 'data-gradient-background' ),
						termImage = term.attr( 'data-term-image' ),
						termName = term.attr( 'data-term-name' ),
						termDescription = term.attr( 'data-term-description' ),
						termCount = term.attr( 'data-term-count' ),
						termCountHover = term.attr( 'data-term-count-hover' );

					$( '.listar-listing-regions-popup .listar-term-items' ).each( function () {
						var popup = $( this ),
							buildTerm = '';

						popup.append( '<div class="listar-featured-listing-term-item listar-term-bordered col-xs-12 col-sm-6 col-md-4 listar-build-term"><div class="listar-term-wrapper"></div></div>' );

						buildTerm = popup.find( '.listar-build-term .listar-term-wrapper' );

						buildTerm
							.append( '<a class="listar-term-link listar-hoverable-overlay" href="' + termURL + '"></a>' )
							.append( '<div class="listar-term-3d-effect-wrapper"></div>' );

						buildTerm.find( '.listar-term-3d-effect-wrapper' )
							.append( '<div class="listar-term-inner"></div>' )
							.append( '<div class="listar-term-count-hover"></div>' );

						buildTerm.find( '.listar-term-count-hover' )
							.append( termCountHover );

						buildTerm.find( '.listar-term-inner' )
							.append( '<div class="listar-term-data-wrapper"></div>' )
							.append( '<div class="listar-term-counter" style="background-color:rgb(' + termColor + ');"></div>' );

						buildTerm.find( 'a' )
							.attr( 'data-term-id', termId )
							.attr( 'data-term-name', termName );

						buildTerm.find( '.listar-term-data-wrapper' )
							.append( '<div class="listar-term-overlay" style="background-color:rgba(' + termColor + ',0.7);"></div>' )
							.append( '<div class="listar-gradient-overlay" style="' + termGradientOverlay + '"></div>' )
							.append( '<div class="listar-listing-term-image listar-term-on-popup" data-background-image="' + termImage + '"></div>' )
							.append( '<div class="listar-term-background-overlay" style="background-color:rgb(' + termColor + ');box-shadow: 5px 5px rgb(' + termColor + ');"></div>' )
							.append( '<div class="listar-lateral-padding listar-term-text-wrapper"><div class="listar-term-text listar-ribbon">' + termName + '</div></div>' );

						buildTerm.find( '.listar-term-text-wrapper' )
							.append( '<div class="listar-term-name-big"><span>' + termName + '</span></div>' );

						if ( '' !== termDescription && viewport().width >= 378 ) {
							buildTerm.find( '.listar-term-text-wrapper' ).append( '<div class="listar-term-description">' + termDescription + '</div>' );
						}

						buildTerm.find( '.listar-term-counter' )
							.append( termCount );

						buildTerm.parent().removeClass( 'listar-build-term' );

						return false;
					} );
				} );

				return false;
			} );

		}

		termNameBigEffect();
	}

	function unpopulateTermPopups( $popup ) {
		if ( 'categories' === $popup ) {
			$( '.listar-listing-categories-popup .listar-term-items' ).each( function () {
				$( this ).prop( 'innerHTML', '' );
			} );
		}

		if ( 'regions' === $popup ) {
			$( '.listar-listing-regions-popup .listar-term-items' ).each( function () {
				$( this ).prop( 'innerHTML', '' );
			} );
		}
	}

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

	function galleryLengthVerification() {
		var galleryImageLimit = 30;

		if ( 'string' === typeof listarLocalizeAndAjax.maxGalleryUploadImages ) {
			if ( '' !== listarLocalizeAndAjax.maxGalleryUploadImages ) {
				galleryImageLimit = listarLocalizeAndAjax.maxGalleryUploadImages;
			}
		}

		if ( $( '.fieldset-gallery_images' ).length ) {
			if ( ! $( '.fieldset-gallery_images' ).hasClass( 'listar-has-added-limit-string' ) ) {
				var innerDescr = $( '.fieldset-gallery_images small.description' ).prop( 'innerHTML' );

				$( '.fieldset-gallery_images small.description' ).prop( 'innerHTML', innerDescr.trim() + ' ' + listarLocalizeAndAjax.maxGalleryImages + ': ' + galleryImageLimit );
				$( '.fieldset-gallery_images' ).addClass( 'listar-has-added-limit-string' );
			}

			if ( $( '.fieldset-gallery_images .job-manager-uploaded-file' ).length >= galleryImageLimit ) {
				$( '.fieldset-gallery_images .wp-job-manager-file-upload' ).addClass( 'hidden' );

				if ( $( '.fieldset-gallery_images .job-manager-uploaded-file' ).length > galleryImageLimit ) {
					$( '.fieldset-gallery_images .job-manager-uploaded-file' ).last().find( '.job-manager-remove-uploaded-file' )[0].click();
				}
			} else {
				$( '.fieldset-gallery_images .wp-job-manager-file-upload' ).removeClass( 'hidden' );
			}
		}
	}

	function mediaLengthVerification() {
		var mediaLimit = 30;
		var mediaFields = $( 'textarea[id*="company_business_rich_media_value_"]' );

		if ( 'string' === typeof listarLocalizeAndAjax.maxMediaFields ) {
			if ( '' !== listarLocalizeAndAjax.maxMediaFields ) {
				mediaLimit = listarLocalizeAndAjax.maxMediaFields;
			}
		}
		
		if ( mediaFields.length >= mediaLimit ) {
			$( '.listar-rich-media-add-item' ).prop( 'outerHTML', '' );
		}
		
		$( '.listar-business-rich-media-fields .listar-boxed-fields-inner-2 fieldset:nth-child(n+' + ( parseInt( mediaLimit, 10 ) + 2 ) + ')' ).each( function () {
			$( this ).prev().addClass( 'listar-remove-fieldset-border-bottom' );
			$( this ).addClass( 'hidden' );
		} );
	}

	function sanitizePricingFields( field ) {
		var priceVal = field.val();

		if ( 'string' === typeof priceVal && 'undefined' !== priceVal ) {
			priceVal = priceVal.replace( /[^0-9\.,]/g, '' ).replace( '..', '.' ).replace( '.,', '.' ).replace( ',.', ',' ).replace( ',,', ',' );
		} else {
			priceVal = '';
		}

		if ( '' === priceVal || undefined === priceVal || 'undefined' === priceVal ) {
			priceVal = '';
		}

		field.val( priceVal );
	}

	function checkLinkAnchor( h, e ) {
		var hasSpecialHash = false;

		if ( '' !== h ) {
			var hashAnchor = $( '#primary' ).find( '#' + h );

			for ( var hashCounter = 0; hashCounter < specialHashes.length; hashCounter++ ) {
				if ( h.indexOf( specialHashes[ hashCounter ] ) >= 0 ) {
					hasSpecialHash = true;
				}
			}

			if ( ! hasSpecialHash && hashAnchor.length > 0 ) {

				/* Exception for Bootstrap Tabs */
				if ( ! hashAnchor.parents( '.tab-content' ).length ) {
					setTimeout( function () {

						/* Fix hash/anchor scroll */
						htmlAndBody.stop().animate( {
							scrollTop : hashAnchor.offset().top - ( 110 + headerTopbarDistance( true ) )
						}, 600 );
					} , 150 );
				}
			}
		}
	}

	function startGeolocationPopup( launchPopup ) {
		var hasUserLatitudeAndLongitude = false;

		if ( $( '.listar-search-by-options-wrapper a[data-explore-by-order="nearest_me"]' ).length ) {
			var userLatitudeField = $( 'input[name="listar_geolocated_data_latitude"]' );
			var userLongitudeField = $( 'input[name="listar_geolocated_data_latitude"]' );

			if ( userLatitudeField.length && userLongitudeField.length ) {
				if ( '' !== userLatitudeField.val() && '' !==  userLongitudeField.val() ) {
					hasUserLatitudeAndLongitude = true;
				}
			}

			if ( ! hasUserLatitudeAndLongitude ) {

				if ( launchPopup ) {
					if ( $( '#menu-primary-menu .listar-header-search-button' ).length ) {
						$( '#menu-primary-menu .listar-header-search-button' ).eq( 0 )[0].click();
					}
				}

				setTimeout( function () {
					$( '.search-form .listar-search-by-button' )[0].click();
				}, 500 );

				setTimeout( function () {
					$( '.listar-search-by-options-wrapper a[data-explore-by-order="nearest_me"]' )[0].click();
				}, 600 );
			}
		}

		return hasUserLatitudeAndLongitude;
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
					hyphenPos = latFieldInitial.indexOf( '-' );
					latFieldInitial = latFieldInitial.substring( 0, hyphenPos ) + latFieldInitial.substring( hyphenPos + 1 );
					latField.val( latFieldInitial );
				}

				// Is the first character a dot?
				if ( '.' === latFieldInitial.charAt( 0 ) ) {
					latFieldInitial = latFieldInitial.substring(1);
					latField.val( latFieldInitial );
				}

				latFieldInitial = latFieldInitial.replace( '.-', '' ).replace( '-.', '-' );
				latField.val( latFieldInitial );

				sanitizedLat = latFieldInitial.replace( /[^0-9\.-]/g, '' );
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
					hyphenPos = lngFieldInitial.indexOf( '-' );
					lngFieldInitial = lngFieldInitial.substring( 0, hyphenPos ) + lngFieldInitial.substring( hyphenPos + 1 );
					lngField.val( lngFieldInitial );
				}

				// Is the first character a dot?
				if ( '.' === lngFieldInitial.charAt( 0 ) ) {
					lngFieldInitial = lngFieldInitial.substring(1);
					lngField.val( lngFieldInitial );
				}

				sanitizedLng = lngFieldInitial.replace( /[^0-9\.-]/g, '' );
				var countDotsLng = '' !== sanitizedLng && sanitizedLng.indexOf( '.' ) >= 0 ? ( sanitizedLng.match( /\./g ) || [] ).length : 0;
				var countHyphensLng = '' !== sanitizedLng && sanitizedLng.indexOf( '-' ) >= 0 ? ( sanitizedLng.match( /\-/g ) || [] ).length : 0;

				if ( ( lngFieldInitial !== sanitizedLng ) ) {
					hasAlert1 = true;
					lngField.val( sanitizedLng );
					returnValue = false;
				}

				var testFloatLng =  sanitizedLng;

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
		sanitizedLat = '';
		sanitizedLng = '';
		var returnValue  = true;

		if ( latField.length && lngField.length ) {
			if ( 'string' === typeof latField.val() ) {
				var latFieldInitial = latField.val().replace( /\s+/g, '' );

				// Does the string contains '.-' or '-.'?
				latFieldInitial = latFieldInitial.replace( '.-', '' ).replace( '-.', '-' );
				latField.val( latFieldInitial );

				// Does the string contains a hyphen out of position?
				if ( latFieldInitial.indexOf( '-' ) > 0 ) {
					hyphenPos = latFieldInitial.indexOf( '-' );
					latFieldInitial = latFieldInitial.substring( 0, hyphenPos ) + latFieldInitial.substring( hyphenPos + 1 );
					latField.val( latFieldInitial );
				}

				if ( '' !== latField.val() ) {
					sanitizedLat = latFieldInitial.replace( /[^0-9\.-]/g, '' );

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
					hyphenPos = lngFieldInitial.indexOf( '-' );
					lngFieldInitial = lngFieldInitial.substring( 0, hyphenPos ) + lngFieldInitial.substring( hyphenPos + 1 );
					lngField.val( lngFieldInitial );
				}

				if ( '' !== lngField.val() ) {
					sanitizedLng = lngFieldInitial.replace( /[^0-9\.-]/g, '' );

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


        function setInitialMapZoom( delay ) {
                if ( hasCustomInitialMapZoom ) {
                        if ( 'undefined' === typeof delay ) {
                                delay = 4000;
                        }

                        /**
                         * Sets the initial map zoom level.
                         * Leaflet has unstable/no time precision here
                         */                                        

                        setTimeout( function () {
                                map.setZoom( initialMapZoom );
                        }, delay );

                        setTimeout( function () {
                                map.setZoom( initialMapZoom );
                        }, delay + 1000 );

                        setTimeout( function () {
                                map.setZoom( initialMapZoom );
                        }, delay + 2000 );
                }
        }

	function setSmashBalloonImages() {

		/* Smash Balloon images - Pagespeed */
		setTimeout( function () {
			$( '.listar-instagram-feed-image' ).each( function () {
				var sbiItem = $( this ).parents( '.listar-sbi_item' );
				var sbiBGImage = $( this ).attr( 'data-temp-background-image' );
				var sbiSRC = $( this ).attr( 'data-src' );
				var sbiALT = $( this ).attr( 'data-alt' );
				var sbiFORCE = $( this ).attr( 'data-force-img' );
				$( this ).prop( 'outerHTML', '<img src="' + sbiSRC + '" alt="' + sbiALT + '" data-background-image="' + sbiBGImage + '" data-force-img="' + sbiFORCE + '" />' );

				sbiItem.removeClass( 'listar-sbi_item' ).addClass( 'sbi_item' );
				convertDataBackgroundImage( sbiItem.find( 'img' ) );
			} );
		}, 100 );
	}

	function fixSmashBalloonImages() {
		setTimeout( function () {
			$( '.sbi_photo_wrap img' ).each( function () {
				if ( $( this )[0].hasAttribute( 'src' ) ) {
					var sbiSRC = $( this ).attr( 'src' );

					if ( 'string' === typeof sbiSRC ) {
						if ( -1 === sbiSRC.indexOf( 'data:image/gif;base64' ) ) {
							$( this ).attr( 'src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==' );
							$( this ).css( { 'background-image' : 'url(' + sbiSRC + ')' } );
						}
					}
				}
			} );
		}, 200 );
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
		}

		if( inputMinutes < 10 ) {
			inputMinutesString = '0' + inputMinutesString;
		}

		totalMinutes = ( parseInt( inputHoursString, 10 ) * 60 ) + parseInt( inputMinutesString, 10 );

		return totalMinutes;
	}

	function enableNearestMeDataEditor() {

		var hasUserLatitudeAndLongitude = false;
		var userLatitudeField = $( 'input[name="listar_geolocated_data_latitude"]' );
		var userLongitudeField = $( 'input[name="listar_geolocated_data_latitude"]' );

		if ( userLatitudeField.length && userLongitudeField.length ) {
			if ( '' !== userLatitudeField.val() && '' !==  userLongitudeField.val() ) {
				hasUserLatitudeAndLongitude = true;
			}
		}

		if ( hasUserLatitudeAndLongitude ) {
			$( '.listar-edit-nearest-me-wrapper' ).removeClass( 'hidden' );
		} else {
			$( '.listar-edit-nearest-me-wrapper' ).addClass( 'hidden' );
		}
	}

	function loadListingCardContentAjax( listingCard ) {
		var listingCardID = listingCard.attr( 'data-listing-id' );
		var contentDataURL = listarSiteURL + '/wp-content/plugins/listar-addons/inc/listing-card-content-ajax.php';
		var dataToSend = { send_data : '[{"type":"listing-content"},{"id":"' + listingCardID + '"}]' };
		var timeOut = 8;


		var ajaxTimeout = setInterval( function () {
			timeOut--;

			/* Ajax Failed? keep calling. */				
			if ( 0 === timeOut ) {
				timeOut = 8;

				loadListingCardContentAjax( listingCard );
			}
		}, 1000 );

		$.ajax( {
			crossDomain: true,
			url: contentDataURL,
			type: 'POST',
			data: dataToSend,
			cache    : false,
			timeout  : 30000

		} ).done( function ( response ) {
			if ( response ) {
				clearInterval( ajaxTimeout );
				listingCard.addClass( 'listar-card-content-ajax-loaded' ).removeClass( 'listar-card-content-ajax-loading' );
				listingCard.find( 'article' ).prop( 'innerHTML', response );
			}
		} );
	}

	function primaryMenuMaxWidth() {
		setTimeout( function () {
			var
				timeOut = viewport().width < 400 ? 0 : 400,
				timeOut2 = viewport().width <= 0 ? 0 : 400,
				nav = $( '.listar-primary-navigation-wrapper .navbar-nav' );

			if ( $( '.listar-more-menu-links-wrapper' ).length ) {
				$( '.listar-more-menu-links-wrapper, .listar-left-menu-limit' ).prop( 'outerHTML', '' );
				nav.removeClass( 'listar-too-high-menu' );
			}

			setTimeout( function () {

				if ( $( '.listar-primary-navigation-wrapper .listar-user-buttons' ).length && nav.length ) {

					if ( viewport().width > 767 ) {
						var menuScrollHeight = 0;
						var userButtonsWidth = $( '.listar-primary-navigation-wrapper .listar-user-buttons' ).width();

						nav.css( { 'max-width' : 'calc(100% - ' + ( userButtonsWidth + 65 ) + 'px)' } );

						setTimeout( function () {
							menuScrollHeight = nav.height();

							if ( menuScrollHeight > 86 ) {
								if ( ! $( '.listar-more-menu-links-wrapper' ).length ) {
									nav.append( '<li class="listar-more-menu-links-wrapper"><div class="listar-more-menu-links"></div></li>' );
									nav.find( '.listar-header-search-button' ).after( '<li class="listar-left-menu-limit"></li>' );
									nav.addClass( 'listar-too-high-menu' );
									$( '.listar-left-menu-limit' ).css( { height : menuScrollHeight } );
								}
							}
						}, 100 );
					} else {
						nav.css( { 'max-width' : '99999px' } );
						nav.removeClass( 'listar-too-high-menu' );

						if ( $( '.listar-more-menu-links-wrapper' ).length ) {
							$( '.listar-more-menu-links-wrapper, .listar-left-menu-limit' ).prop( 'outerHTML', '' );
						}
					}
				}

				setTimeout( function () {
					$( theBody ).addClass( 'listar-loaded-menu' );
				}, timeOut2 );
			}, timeOut );
		}, 100 );
	}

	function startHeightEqualizer() {
		if ( gotUpdatedNonce ) {
			heightEqualizer( '.listar-listing-card' );
			heightEqualizer( '.listar-blog-card' );
			heightEqualizer( '.listar-woo-product-card' );
			heightEqualizer( '.listar-feature-item-wrapper' );
			heightEqualizer( '.listar-partner-wrapper', true, false, true );
			heightEqualizer( '.listar-setting-control > div', false, '.listar-setting-groups-wrapper' );
		}
	}

	function resetElements( isResizing ) {
		resizeHeroVideos();

		if ( ! preventEvenCallStack7 ) {
			var resetDelay = 0;
			preventEvenCallStack7 = true;

			if ( ! lastViewportWidth ) {
				lastViewportWidth = viewport().width;
			}

			if ( ! scrollbarWidth ) {
				scrollbarWidth = getScrollBarWidth();
			}

			if ( 'undefined' !== typeof isResizing ) {
				resetDelay = 2000;
			}

			setTimeout( function () {
				var currentViewportWidth = viewport().width;

				if ( ( 2000 === resetDelay && lastViewportWidth !== currentViewportWidth ) || ( 0 === resetDelay ) ) {
					var owlCarousels = $( '.listar-carousel-loop.listar-use-carousel' );

					lastViewportWidth = currentViewportWidth;
					scrollbarWidth = getScrollBarWidth();

					defineHiddenFooterHeight();
					adjustFeatureBlocks();
					equalizeVideoHeights();
					equalizeWordPressGalleryHeights();

					if ( gotUpdatedNonce ) {
						initOwlCarousel( owlCarousels, true );
					}

					checkNavbarToggle();
					mobileMenuMaxHeight();
					setTooltips();
					setUserFormsPosition();
					checkGrid();
					bodyWrapperOverflow();
					checkScrolling();
					prepareHeaderListings();
					prepareMainMenu();
					prepareCatsUnderSearchField();
					moreCategoriesButtonVisibility();
					resetMap();
					initOnScrollEffects();
					initListingGalleryScroll();
					fixGutenbergImageBlocks();
					resizeCanvases();
					primaryMenuMaxWidth();
					adjustWidgetImageCaptionsWidth();
					captureCurrentViewportHeight();
					checkGridFillerCard();
					createListingGallery();
					equalizeCallToActionColumnsHeights( true );
					fixGutenbergAlignFull();
					fixPopupHeights();
					setFallbackNoReviewContentHeight();
					chechListingTopbarButtonsQty();
					verifyBootstrapAccordions();
				}// End if().

				setTimeout( function () {
					preventEvenCallStack7 = false;
				}, 1500 );

			}, resetDelay );
		}// End if().
	}

	function fixPopupHeights() {
		setTimeout( function () {

			/* Set proper heights to popups based on the device viewport height */
			var currentViewportHeight = viewport().height;

			$( 'body > [class*="-popup"]' ).css( { height : currentViewportHeight, 'line-height' : currentViewportHeight + 'px' } );
		}, 250 );
	}

	function setUserFormsPosition() {
		var
			screenHeight = viewport().height,
			formRecipient,
			formRecipientHeight = 0,
			topbarheight = headerTopbarDistance();

		if ( $( '.site-header' ).length ) {
			topbarheight = $( '.site-header' ).height();
		}

		if ( $( '#password-form' ).length ) {
			formRecipient = $( '#password-form' ).parent().parent().parent().parent();
			formRecipientHeight = formRecipient.height();

			if ( screenHeight - topbarheight - 120 > formRecipientHeight ) {
				formRecipient.css( { display : 'inline-block', top : '50%', marginTop : - ( formRecipientHeight / 2 ) + topbarheight / 2 } );
				formRecipient.parent().css( { height : screenHeight, marginTop : 0, 'overflow-y' : 'hidden' } );
			} else {
				if ( 60 !== topbarheight ) {
					formRecipient.css( { display : 'inline-block', top : 0, marginTop : '55px' } );
				} else {
					formRecipient.css( { display : 'inline-block', top : 0, marginTop : 0 } );
				}
				formRecipient.parent().css( { height : screenHeight - topbarheight, marginTop : topbarheight, 'overflow-y' : 'auto' } );
			}

			formRecipient.parent().parent().css( { width : '100%', position : 'relative', display : 'table', 'text-align' : 'center' } );
		}

		if ( $( '.listar-search-popup' ).length ) {
			formRecipientHeight = $( '.listar-search-popup .listar-listing-categories' ).height() + 130;

			if ( screenHeight - topbarheight - 60 > formRecipientHeight ) {
				$( '.listar-search-popup' ).removeClass( 'listar-search-short-height' );
			} else {
				$( '.listar-search-popup' ).addClass( 'listar-search-short-height' );
			}
		}

		if ( $( '.listar-front-header, .listar-search-popup' ).length ) {
			var thisElement = $( '.listar-front-header, .listar-search-popup' );
			var heroSearch = thisElement.find( '.listar-hero-search' );

			if ( viewport().width <= 480 ) {
				thisElement.stop().css( { height : '' } );
				heroSearch.stop().animate( { marginTop : '40px' }, { duration : 10 } );
			} else {
				thisElement.stop().css( { height : '' } );
				heroSearch.stop().animate( { marginTop : '20px' }, { duration : 10 } );
			}
		}
	}

	function viewport() {
		var
			e = window,
			a = 'inner';

		if ( ! ( 'innerWidth' in window ) ) {
			a = 'client';
			e = document.documentElement || document.body;
		}

		return { width : e[ a + 'Width' ], height : e[ a + 'Height' ] };
	}

	/* Check if a element starts to become visible on viewport */
	function isInViewport( elem, verticalMargin ) {
		var	elementTop;
		
		if ( 'undefined' !== typeof elem ) {
			if ( 'undefined' !== typeof elem.offset() ) {
				if ( 'undefined' !== elem.offset().top ) {
					elementTop = elem.offset().top;
				}
			}
		}
		
		var
			elementBottom = elementTop + elem.outerHeight(),
			viewportTop = $( window ).scrollTop();
		var	viewportBottom = viewportTop + $( window ).height();

		if ( 'undefined' === typeof verticalMargin ) {
			verticalMargin = 0;
		}

		return elementBottom - verticalMargin > viewportTop && elementTop + verticalMargin < viewportBottom;
	}

	/* Move background image URL from 'data-background-image' attribute to 'background-image' style */
	function convertDataBackgroundImage( elem, forceConversion ) {

		if ( 'undefined' === typeof elem ) {
			elem = $( '[data-background-image]' );
		}

		if ( 'undefined' === typeof forceConversion ) {
			forceConversion = false;
		}

		var doElements = [];

		elem.each( function () {
			doElements.push( $( this ) );
		} );

		/* Lazy Load - Set one image every 250ms */


		var setBgInterval = setInterval( function () {
			if ( doElements.length ) {
				var firstDoElem = doElements[0];

				if ( firstDoElem[0].hasAttribute( 'data-background-image' ) ) {
					var bg = firstDoElem.attr( 'data-background-image' );
					var bg2 = firstDoElem.css( 'background-image' );
					var dataImageChanged = false;
					var src = '';

					if ( firstDoElem[0].hasAttribute( 'data-background-image-mobile' ) && viewport().width < 420 ) {
						bg = firstDoElem.attr( 'data-background-image-mobile' );
					}

					if ( firstDoElem.hasClass( 'listar-term-on-popup' ) ) {
						if ( firstDoElem.parents( '.listar-listing-regions-popup, .listar-listing-categories-popup' ).hasClass( 'listar-toggle-background-image' ) ) {
							firstDoElem.removeClass( 'listar-term-on-popup' );
						} else {
							return false;
						}
					}

					if ( 'IMG' === firstDoElem.prop( 'tagName' ) ) {
						src = firstDoElem.attr( 'src' );
					}

					if ( '' !== bg && '0' !== bg && undefined !== bg && -1 === bg2.indexOf( 'Ow==' ) && '==' !== src.substr( src.length - 2 ) ) {

						/* Skip if image URL was sanitized and printed as http://0
						 * or similar (with /0 at end), meaning that no real background image was attributed to the element
						 */
						if ( '/0' !== bg.substr( bg.length - 2 ) && '0/' !== bg.substr( bg.length - 2 ) && '==' !== bg.substr( bg.length - 2 ) ) {
							if ( bg !== 'temp-data' ) {
								preloadImages( [ bg ], true );

								if ( ! firstDoElem[0].hasAttribute( 'data-force-img' ) ) {
									firstDoElem.css( { 'background-image' : 'url(' + bg + ')' } );
								} else {
									firstDoElem.attr( 'src', bg );
									firstDoElem.removeAttr( 'data-force-img' );
								}
							} else {
								if ( firstDoElem.hasClass( 'listar-page-header' ) ) {

									var background = firstDoElem.css( 'background-image' );

									firstDoElem.removeAttr( 'data-background-image' );
									firstDoElem.removeAttr( 'data-force-img' );

									if ( 'IMG' === firstDoElem.prop( 'tagName' ) ) {
										src = firstDoElem.attr( 'src' );
									}

									if (
										'/0' === src.substr( src.length - 2 ) ||
										'0/' === src.substr( src.length - 2 ) ||
										'==' === src.substr( bg.length - 2 ) ||
										'/0")' === background.substr( background.length - 4 ) ||
										'0/")' === background.substr( background.length - 4 ) ||
										'==")' === background.substr( background.length - 4 )
										) {
										return;
									}
								}
							}

							if ( firstDoElem.hasClass( 'author-avatar' ) || firstDoElem.hasClass( 'listar-no-image' ) ) {
								dataImageChanged = true;
							}

							firstDoElem.removeClass( 'listar-no-image' );

							/* Skip icons as image */
							if ( ! firstDoElem.parent().hasClass( 'listar-image-icon' ) && ! dataImageChanged  ) {
								/* Sometimes the 'listar-no-image' class is attributed to parent element (max 4 levels) */
								if ( firstDoElem.parents( '.listar-card-content' ).hasClass( 'listar-no-image' ) ) {
									firstDoElem.parents( '.listar-card-content' ).removeClass( 'listar-no-image' );
								} else if ( firstDoElem.hasClass( 'listar-no-image' ) ) {
									firstDoElem.removeClass( 'listar-no-image' );
								} else if ( firstDoElem.parent().hasClass( 'listar-no-image' ) ) {
									firstDoElem.parent().removeClass( 'listar-no-image' );
								} else if ( firstDoElem.parent().parent().hasClass( 'listar-no-image' ) ) {
									firstDoElem.parent().parent().removeClass( 'listar-no-image' );
								} else if ( firstDoElem.parent().parent().parent().hasClass( 'listar-no-image' ) ) {
									firstDoElem.parent().parent().parent().removeClass( 'listar-no-image' );
								} else if ( firstDoElem.parent().parent().parent().parent().hasClass( 'listar-no-image' ) ) {
									firstDoElem.parent().parent().parent().parent().removeClass( 'listar-no-image' );
								}
							}
						}// End if().
					}// End if().

					firstDoElem.removeAttr( 'data-background-image' );
				}
			} else {
				clearInterval( setBgInterval );
			}

			doElements.shift();
		}, 150 );
	}

	function prepareCatsUnderSearchField() {
		if ( ! $( '.listar-search-categories' ).hasClass( 'listar-showing-more-cats' ) ) {
			if ( $( '.listar-search-categories .listar-listing-categories' ).height() / $( '.listar-search-categories' ).height() > 1.73 ) {
				$( '.listar-search-categories' ).removeClass( 'listar-hidden-category-nav' );
			} else {
				$( '.listar-search-categories' ).addClass( 'listar-hidden-category-nav' );
			}
		}
	}

	function prepareMainMenu() {
		if ( viewport().width > 767 && ! isMobile() ) {
			$( '#listar-primary-menu > .navbar-nav li a.dropdown-toggle' ).each( function () {
				if ( '' !== $( this ).attr( 'href' ) && '#' !== $( this ).attr( 'href' ) ) {
					$( this ).addClass( 'disabled' );
				}
			} );
		} else {
			$( '#listar-primary-menu > .navbar-nav li a.dropdown-toggle' ).each( function () {
				$( this ).removeClass( 'disabled' );
			} );
		}
	}

	function prepareHeaderListings() {
		setTimeout( function () {
			if ( viewport().width > 1300 ) {
				$( '.listar-hero-header .listar-aside-list' ).stop().animate( { right : [ 0, 'easeOutExpo' ] }, { duration : 500 } );
			}
		}, 100 );
	}

	function mobileMenuMaxHeight() {
		if ( viewport().width <= 767 ) {
			$( '.listar-full-dimming-overlay' ).css( { 'height' : viewport().height + 2, 'max-height' : viewport().height + 2 } );
		} else {
			$( '#listar-primary-menu, .listar-full-dimming-overlay' ).css( { 'height' : 'auto' } );
		}
	}

	function checkGrid() {
		if ( viewport().width < 600 ) {
			if ( ! $( '.listar-grid' ).hasClass( 'listar-hold-grid' ) ) {
				if ( $( '.listar-grid' ).hasClass( 'listar-grid2' ) ) {
					hasGrid2 = 1;
					$( '.listar-grid' ).removeClass( 'listar-grid2' );
				}
				if ( $( '.listar-grid' ).hasClass( 'listar-grid3' ) ) {
					hasGrid3 = 1;
					$( '.listar-grid' ).removeClass( 'listar-grid3' );
				}
			}
		} else if ( hasGrid2 ) {
			$( '.listar-grid' ).addClass( 'listar-grid2' );
		} else if ( hasGrid3 ) {
			$( '.listar-grid' ).addClass( 'listar-grid3' );
		}
	}

	function bodyWrapperOverflow() {
		if ( isMobile() ) {
			theBody.addClass( 'listar-is-mobile' );
			theBody.removeClass( 'listar-is-desktop' );
		} else {
			theBody.addClass( 'listar-is-desktop' );
			theBody.removeClass( 'listar-is-mobile' );
		}
	}

	function setTooltips() {
		setTimeout( function () {
			if ( isMobile() ) {
				$( '[data-toggle="tooltip"]' ).tooltip( 'disable' );
			} else {
				$( '[data-toggle="tooltip"]' ).tooltip( 'enable' );
			}
		}, 1000 );
	}

	function moreCategoriesButtonVisibility() {

		/* To front page hero header and search popup */
		if ( $( '.listar-search-categories .listar-listing-categories .listar-listing-categories-inner > div' ).length ) {

			setTimeout( function () {
				if ( $( '.listar-search-categories .listar-listing-categories .listar-listing-categories-inner > div' )[0].scrollHeight > 165 ) {
					$( '.listar-search-categories .listar-more-categories' ).css( { display : 'block' } );
					$( '.listar-search-categories' ).removeClass( 'listar-hidden-category-nav' );
				} else {
					$( '.listar-search-categories .listar-more-categories' ).css( { display : 'none' } );
					$( '.listar-search-categories' ).addClass( 'listar-hidden-category-nav' );
				}

				if ( $( '.listar-search-categories .listar-no-icon' ).length ) {
					if ( $( '.listar-search-categories .listar-no-icon' ).length === $( '.listar-search-categories a' ).length ) {
						if ( $( '.listar-search-categories .listar-listing-categories .listar-listing-categories-inner > div' )[0].scrollHeight < 70 ) {
							$( '.listar-search-categories' ).removeClass( 'listar-no-icons-two-lines' ).addClass( 'listar-no-icons-one-line' );
						} else {
							$( '.listar-search-categories' ).removeClass( 'listar-no-icons-one-line' ).addClass( 'listar-no-icons-two-lines' );
							$( '.listar-search-categories .listar-more-categories' ).css( { top : 90 } );
						}
					}
				}
			}, 1000 );
		}
	}

	function resetOwlCarousel( selector ) {
		if ( selector.length ) {
			selector.each( function () {
				var carousel = $( this );

				if ( carousel.hasClass( 'owl-loaded' ) ) {
					carousel.owlCarousel( 'destroy' );
					carousel.owlCarousel( { touchDrag : false, mouseDrag : false } );
					carousel.find( '.owl-stage-outer' ).children().unwrap();
					carousel.find( '.owl-stage' ).children().unwrap();
					carousel.find( '.owl-item.cloned' ).prop( 'outerHTML', '' );
					carousel.find( '.owl-item' ).children().unwrap();
					carousel.removeData();
					carousel.removeClass( 'owl-loaded' );
					carousel.find( '.owl-nav, .owl-dots' ).each( function () {
						$( this ).prop( 'outerHTML', '' );
					} );
				}

			} );
		}
	}

	function initOwlCarousel( selector, skipPopups ) {
		selector.each( function () {
			var carousel = $( this );

			if ( true === skipPopups ) {
				if ( $( this ).parents( '.listar-hero-header' ).length > 0 ) {
					return;
				}
			}

			var
				carouselItems		= carousel.find( '.listar-featured-listing-term-item, .listar-listing-card, .listar-partner-wrapper' ),
				carouselLateralMargin	= 30,
				carouselSteps		= 1,
				carouselCenter		= true,
				carouselStagePadding	= 10,
				carouselRequiredColumns = 1;

			if ( carousel.find( '.listar-grid-filler' ).length ) {
				carousel.find( '.listar-grid-filler' ).prop( 'outerHTML', '' );
			}

			$( '.listar-listing-categories-popup .listar-featured-listing-term-item,.listar-listing-regions-popup .listar-featured-listing-term-item' ).css( { display : 'none' } );

			carouselItems.css( { opacity : 0 } );
			carousel.find( '.listar-term-text-wrapper' ).removeClass( 'listar-lateral-padding' );

			setTimeout( function () {
				var scrollbarWidth = getScrollBarWidth();

				if ( viewport().width > 3125 ) {
					carouselRequiredColumns	= 99999; // Don't create carousels.
				} else if ( viewport().width > 2720 ) {
					carouselRequiredColumns	= 7;
					carouselStagePadding = ( viewport().width - 2686.8 - scrollbarWidth ) / 2;

					if ( 8 === carouselItems.length ) {
						carouselSteps = 1;
					} else if ( 9 === carouselItems.length ) {
						carouselSteps = 2;
					} else if ( 10 === carouselItems.length ) {
						carouselSteps = 3;
					} else if ( 11 === carouselItems.length ) {
						carouselSteps = 4;
					} else if ( 12 === carouselItems.length ) {
						carouselSteps = 5;
					} else if ( 13 === carouselItems.length ) {
						carouselSteps = 6;
					} else if ( carouselItems.length > 13 ) {
						carouselSteps = 7;
					}
				} else if ( viewport().width > 2332 ) {
					carouselRequiredColumns	= 6;
					carouselCenter = false;
					carouselStagePadding = ( viewport().width - 2300 - scrollbarWidth ) / 2;

					if ( 7 === carouselItems.length ) {
						carouselSteps = 1;
					} else if ( 8 === carouselItems.length ) {
						carouselSteps = 2;
					} else if ( 9 === carouselItems.length ) {
						carouselSteps = 3;
					} else if ( 10 === carouselItems.length ) {
						carouselSteps = 4;
					} else if ( 11 === carouselItems.length ) {
						carouselSteps = 5;
					} else if ( carouselItems.length > 11 ) {
						carouselSteps = 6;
					}
				} else if ( viewport().width > 1938 ) {
					carouselRequiredColumns	= 5;
					carouselStagePadding = ( viewport().width - 1913.3 - scrollbarWidth ) / 2;

					if ( 6 === carouselItems.length ) {
						carouselSteps = 1;
					} else if ( 7 === carouselItems.length ) {
						carouselSteps = 2;
					} else if ( 8 === carouselItems.length ) {
						carouselSteps = 3;
					} else if ( 9 === carouselItems.length ) {
						carouselSteps = 4;
					} else if ( carouselItems.length > 9 ) {
						carouselSteps = 5;
					}
				} else if ( viewport().width > 1547 ) {
					carouselRequiredColumns	= 4;
					carouselCenter = false;
					carouselStagePadding = ( viewport().width - 1536.7 - scrollbarWidth ) / 2;

					if ( 5 === carouselItems.length ) {
						carouselSteps = 1;
					} else if ( 6 === carouselItems.length ) {
						carouselSteps = 2;
					} else if ( 7 === carouselItems.length ) {
						carouselSteps = 3;
					} else if ( carouselItems.length > 7 ) {
						carouselSteps = 4;
					}

				} else if ( viewport().width > 1199 ) {
					carouselRequiredColumns	= 3;
					carouselStagePadding = ( viewport().width - 1140 - scrollbarWidth ) / 2;

					if ( 5 === carouselItems.length ) {
						carouselSteps = 2;
					} else if ( carouselItems.length > 5 ) {
						carouselSteps = 3;
					}

				} else if ( viewport().width > 991 ) {
					carouselRequiredColumns	= 3;
					carouselStagePadding = ( viewport().width - 940 - scrollbarWidth ) / 2;

					if ( 5 === carouselItems.length ) {
						carouselSteps = 2;
					} else if ( carouselItems.length > 5 ) {
						carouselSteps = 3;
					}

				} else if ( viewport().width > 767 ) {
					carouselRequiredColumns	= 2;
					carouselStagePadding = ( viewport().width - 720 - scrollbarWidth ) / 2;
					carouselCenter = false;

					if ( carouselItems.length >= 4 ) {
						carouselSteps = 2;
					}
				}// End if().

				if ( carouselItems.length > carouselRequiredColumns && 0 === carouselItems.parents( '#secondary' ).length && 0 === carouselItems.parents( 'footer' ).length ) {
					if ( carousel.hasClass( 'owl-loaded' ) ) {
						carousel.data( 'owl.carousel' ).options.center = carouselCenter;
						carousel.data( 'owl.carousel' ).options.stagePadding = carouselStagePadding;
						carousel.data( 'owl.carousel' ).options.margin = carouselLateralMargin;
						carousel.data( 'owl.carousel' ).options.items = carouselRequiredColumns;
						carousel.data( 'owl.carousel' ).options.slideBy = carouselSteps;
						carousel.trigger( 'refresh.owl.carousel' );
					} else {
						var owlNavTop = 0;
							carousel.parent().removeClass( 'container container-fluid' );
							carousel.removeClass( 'row' );
							carousel.find( '[class*=col-]' ).removeClass( 'col-xs-12 col-sm-6 col-md-4 col-md-8' );
							carousel.css( { opacity : 0 } );

						carousel.owlCarousel( {
							loop	     : true,
							nav	     : true,
							dots	     : false,
							center	     : carouselCenter,
							stagePadding : carouselStagePadding,
							margin	     : carouselLateralMargin,
							items	     : carouselRequiredColumns,
							slideBy	     : carouselSteps
						} );

						if ( carousel.find( '.listar-listing-card' ).length ) {
							owlNavTop = carousel.find( '.listar-card-content-title-centralizer' ).eq( 0 ).height() / 2 + 38;
							carousel.find( '.owl-nav [class*=owl-]' ).css( { marginTop : 0, top : owlNavTop } );
						}

					}
				} else {
					carousel.removeClass( 'listar-carousel-loop listar-use-carousel owl-carousel owl-theme' );
					carousel.parent().removeClass( 'container-fluid' ).addClass( 'container' );
				}// End if().

			}, 200 );

			setTimeout( function () {
				carousel.find( '.listar-featured-listing-term-item, .listar-listing-card, .listar-partner-wrapper' ).css( { opacity : 1 } );
				carousel.css( { opacity : 0 } ).stop().animate( { opacity : 1 }, { duration : 1500 } );
				carousel.find( '.listar-term-text-wrapper' ).addClass( 'listar-lateral-padding' );

				$( '.listar-listing-categories-popup .listar-featured-listing-term-item,.listar-listing-regions-popup .listar-featured-listing-term-item' ).css( { display : 'block' } );

				carousel.stop().animate( { opacity : 1 }, { duration : 800 } );

				if ( carousel.parents( '.entry-content' ).length ) {
					carousel.stop().css( { opacity : '' } );
					carousel.find( '.listar-featured-listing-term-item, .listar-listing-card' ).stop().css( { opacity : '' } );
				}

				if ( $( '.owl-stage-outer .listar-partner-wrapper' ).length ) {
					heightEqualizer( '.listar-partner-wrapper', true, true, true );
				}

			}, 500 );
		} );

		$( '.listar-carousel-loop.owl-carousel' ).not( '.listar-use-carousel' ).each( function () {
			$( this ).parent().removeClass( 'container-fluid' ).addClass( 'container' );
			$( this ).removeClass( 'listar-carousel-loop listar-use-carousel owl-carousel owl-theme' );
		} );
	}

	function checkFrontPageTopbar() {
		var
			scrollTop = theDocument.scrollTop(),
			b = theBody;

		if ( scrollTop >= 5 ) {
			if ( true === isFrontPage && - 1 !== b.attr( 'class' ).indexOf( 'listar-frontpage-topbar-transparent' ) ) {
				b.removeClass( 'listar-frontpage-topbar-transparent' );
			}
		} else {
			if ( headerTransparentTopbar ) {
				b.addClass( 'listar-frontpage-topbar-transparent' );
			}
		}
	}

	/* Equalize the height of elements - Cross browser solution */

	function heightEqualizer( elem, forceLineHeight, forceParentReference, forceVerticalPadding ) {

		var skipEqualizer = false;

		if ( disableHeightEqualizerListingCards && 'string' === typeof elem ) {
			if ( elem.indexOf( 'listar-listing-card' ) >= 0 ) {
				if ( $( '.listar-load-card-content-ajax' ).length ) {
					return;
				}
			}
		}

		var
			waitToEqualize  = isLoadMoreEqualizer ? 250 : 500,
			waitToEqualize2 = isLoadMoreEqualizer ? 250 : 1000;

		isLoadMoreEqualizer = false;

		clearTimeout( readyForHoverTimeout );

		theBody.removeClass( 'listar-ready-for-hover' );

		if ( 'undefined' === typeof forceLineHeight ) {
			forceLineHeight = false;
		}

		if ( 'undefined' === typeof forceParentReference ) {
			forceParentReference = false;
		}

		if ( 'undefined' === typeof forceVerticalPadding ) {
			forceLineHeight = false;
		}

		if ( viewport().width > 767 ) {
			if ( elem.indexOf( 'listar-feature-item' ) >= 0 ) {
				waitToEqualize  += 500;
				$( '.listar-feature-item.listar-feature-has-link ~ .listar-feature-fix-bottom-padding' ).removeClass( 'listar-fix-feature-arrow-button-height' );
			}

			setTimeout( function () {
				var parent = 0,
					heights = 0,
					minHeight = 0;

				$( elem ).each( function () {
					if ( $( this ).attr( 'class' ).indexOf( 'listar-grid-design-image-block' ) >= 0 ) {
						skipEqualizer = true;
						$( this ).addClass( 'listar-height-changed' );
						return;
					}

					$( this ).height( '' );

					if ( ! $( this )[0].hasAttribute( 'data-line-height' ) ) {
						$( this ).attr( 'data-line-height', $( this ).css( 'line-height' ) );
					}

					if ( forceLineHeight ) {
						$( this ).css( { 'line-height' : '120px' } );
					}
				} );

				if ( ! skipEqualizer ) {

					$( '.listar-feature-content-wrapper' ).each( function () {
						$( this ).css( { paddingTop : 0 } );
					} );

					setTimeout( function () {
						var heightFixApplied = false;

						$( elem ).each( function () {
							if ( 0 === $( this ).parents( '#secondary' ).length && 0 === $( this ).parents( 'footer' ).length ) {
								var parentClass = $( this ).parent().attr( 'class' ),
									realParent = 0;

								/* Detects the original parent after Owl Carousel has beent initiated */
								if ( parentClass.indexOf( 'owl' ) >= 0 ) {
									realParent = $( this ).parent().parent().parent().parent();
								} else {
									realParent = $( this ).parent();
								}

								if ( false !== forceParentReference ) {
									realParent = $( this ).parents( forceParentReference );
								}

								if ( parent !== realParent ) {
									parent  = realParent;

									heights = parent.find( elem ).map( function () {
										return $( this ).height();
									} ).get();

									minHeight = Math.max.apply( null, heights );
								}

								if ( $( this ).find( '.listar-feature-item' ).length && ! heightFixApplied ) {
									heightFixApplied = true;
									minHeight += 25;
								}

								$( this ).height( minHeight );

								if ( forceLineHeight ) {
									$( this ).css( { 'line-height' : ( minHeight - 90 ) + 'px' } );
								}

								if ( $( this ).find( '.listar-feature-item.listar-feature-has-link' ).length ) {
									$( this ).find( '.listar-feature-item.listar-feature-has-link ~ .listar-feature-fix-bottom-padding' ).addClass( 'listar-fix-feature-arrow-button-height' );
								}

								$( this ).addClass( 'listar-height-changed' );
							}
						} );
					}, waitToEqualize2 );
				}
			}, waitToEqualize );
		} else {
			$( elem ).each( function () {
				if ( $( this ).attr( 'class' ).indexOf( 'listar-grid-design-image-block' ) >= 0 ) {
					skipEqualizer = true;
					return;
				}

				$( this ).height( '' );

				if ( ! $( this )[0].hasAttribute( 'data-line-height' ) ) {
					$( this ).attr( 'data-line-height', $( this ).css( 'line-height' ) );
				}

				if ( forceLineHeight ) {
					$( this ).css( { 'line-height' : '150px' } );
				}
			} );
		}// End if().

		readyForHoverTimeout = setTimeout( function () {
			theBody.addClass( 'listar-ready-for-hover' );
		}, waitToEqualize + 1500 );
	}

	/* Compensate different "content" heights between listing feature blocks / centralize contents vertically */

	function adjustFeatureBlocks() {
		var timeOut = viewport().width < 500 ? 0 : 0;

		setTimeout( function () {
			if ( $( '.listar-features-design-2 .listar-feature-without-image .listar-feature-item' ).length ) {
				$( '.listar-features-design-2' ).each( function () {
					if ( $( this ).find( '.listar-feature-item-wrapper' ).length ) {
						if ( $( this ).find( '.listar-feature-item-wrapper' ).eq( 0 ).hasClass( 'listar-feature-without-image' ) ) {
							$( this ).addClass( 'listar-features-without-image' );
						}
					}
				} );
			}
		}, timeOut );
	}

	/* Equalize call to action columns heights */

	function equalizeCallToActionColumnsHeights( isResizing ) {
		if ( 'undefined' === typeof isResizing ) {
			isResizing = false;
		}

		if ( preventEvenCallStack10 ) {
			return;
		}

		preventEvenCallStack10 = true;

		setTimeout( function () {
			callToActionsBoxedSquared.each( function () {
				var thisElem   = $( this );
				var halfBorder = thisElem.find( '.listar-half-call-to-action-border' );

				if ( isResizing ) {
					thisElem.removeClass( 'listar-call-to-action-cols-equalized' );
				}

				if ( ! thisElem.hasClass( 'listar-call-to-action-cols-equalized' ) ) {
					if ( isInViewport( thisElem ) ) {
						if ( viewport().width > 767 ) {
							thisElem.find( '.listar-equalize-container-height' ).each( function () {
								$( this ).css( { height : $( this ).parents( '.listar-call-to-action-inner' ).height() } );
							} );
						} else {
							thisElem.find( '.listar-equalize-container-height' ).each( function () {
								$( this ).css( { height : '' } );
							} );
						}

						$( this ).addClass( 'listar-call-to-action-cols-equalized' );
					}
				}

				if ( halfBorder.length ) {
					halfBorder.css( { width : thisElem.find( '.listar-call-to-action-first-content-wrapper' ).width() } );
				}
			} );
		}, 1500 );

		setTimeout( function () {
			preventEvenCallStack10 = false;
		}, 250 );
	}

	/* Equalize WordPress gallery item heights */

	function equalizeWordPressGalleryHeights() {
		setTimeout( function () {
			$( '.gallery' ).each( function () {
				var gallery = $( this );
				/* Get the highest gallery item height */
				var minHeight = gallery.find( '.gallery-item' ).eq( 0 ).height();

				gallery.find( '.gallery-item img' ).css( { width : '', marginleft : '' } );

				gallery.find( '.gallery-item' ).each( function () {
					var
						diffImageWidth,
						imageWidth = $( this ).find( 'img' ).width(),
						checkHeight = minHeight / $( this ).find( 'img' ).height();

					if ( checkHeight > 1 ) {
						diffImageWidth = ( ( imageWidth * checkHeight ) - imageWidth ) / 2;

						$( this ).find( 'img' ).css( { width : imageWidth * checkHeight + 'px' } );
						$( this ).find( 'img' ).css( { marginLeft : - diffImageWidth + 'px' } );
					}
				} );
			} );

			initOnScrollEffects();
		}, 500 );

		/* For Gutenberg gallery */
		setTimeout( function () {
			$( '.wp-block-gallery, .gallery' ).each( function () {
				var gallery = $( this );

				gallery.removeClass( 'listar-equalize-gallery' );

				setTimeout( function () {
					gallery.find( 'img' ).each( function () {
						var galleryImg = $( this );
						galleryImg.css( { height : 'auto', width : 'auto', 'min-width' : '' } );

						var imgWidth = galleryImg.width();
						var imgHeight = galleryImg.height();
						var proportion = imgWidth / imgHeight;
						var newHeight = galleryImg.parents( '.blocks-gallery-item,.gallery-item' ).height();
						var newWidth1 = galleryImg.parents( '.blocks-gallery-item,.gallery-item' ).width();
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
					} );

					gallery.addClass( 'listar-equalize-gallery' );
				}, 500 );
			} );

		}, 750 );
	}

	/* Make video size proportional */

	function equalizeVideoHeights() {
		setTimeout( function () {
			$( 'iframe[allowfullscreen]' ).each( function () {
				$( this ).css( { height : ( Math.ceil( $( this ).width() * 0.562 ) ) + 'px' } );
			} );

			initOnScrollEffects();
		}, 500 );
	}

	function toggleUserMenu() {
		var menuRight = thisElement.length ? thisElement.css( 'right' ) : 0;
		menuRight = parseInt( menuRight.replace( /[^-\d\.]/g, '' ), 10 );

		if ( menuRight < 0 ) {
			thisElement.stop().animate( { 'right' : [ 0, 'easeOutExpo' ] }, { duration : 500 } );
		} else {
			thisElement.stop().animate( { 'right' : - 500 }, { duration : 500 } );
		}
	}

	function mouseleaveUserMenu() {
		setTimeout( function () {
			if ( closeUserMenu ) {
				if ( $( '.listar-logged-user-menu-wrapper' ).length ) {
					if ( '0px' === $( '.listar-logged-user-menu-wrapper' ).css( 'right' ) ) {
						if ( $( '.listar-user-logged .listar-user-login' ).length ) {
							$( '.listar-logged-user-menu-wrapper' ).eq( 0 ).trigger( 'mouseleave' );
							closeUserMenu = false;
						}
					}
				}
			}
		}, 50 );
	}

	/* AOS (animations on scroll) */

	function initOnScrollEffects( skipTimeout ) {
		var timeOut  = 2000;
		var timeOut2 = 500;

		if ( ! animateElementsOnScroll ) {
			return;
		}

		if ( 'undefined' === typeof skipTimeout ) {
			skipTimeout = false;
		}

		if ( $( '[data-aos]' ).length ) {
			if ( ! isMobile() ) {
				setTimeout( function () {
					if ( skipTimeout ) {
						setTimeout( function() {
							AOS.refresh();
						}, 300 );
					} else {
						appendAOSDelay();

						if ( $( '.aos-init' ).length ) {
							AOS.refreshHard();
						} else {
							AOS.init( {
								disable: 'mobile'
							} );
						}

						preventAOSObserverFail();

						/* Only Owl Carousels must wait a little more */

						if ( $( '[data-temp-aos]' ).length ) {
							setTimeout( function () {
								$( '[data-temp-aos]' ).attr( 'data-aos', 'fade-zoom-in' );
								$( '[data-temp-aos]' ).removeAttr( 'data-temp-aos' );

								AOS.init( {
									disable: 'mobile'
								} );

								preventAOSObserverFail();

							}, timeOut );
						}

						setTimeout( function() {
							AOSRefresh();
						}, 30 );
					}// End if().

				}, timeOut2 );

			} else {
				preventAOSObserverFail();
			}// End if().
		}// End if().
	}

	/* Init effects to elements created with dinamically after Ajax 'load more' */

	function ajaxAOS() {
		if ( ! animateElementsOnScroll ) {
			return;
		}

		if ( $( '[data-aos]' ).length ) {
			if ( ! isMobile() ) {
				appendAOSDelay();
			}

			preventAOSObserverFail();
		}
	}

	/* Prevents fail on AOS observer if not supported by the browser */

	function preventAOSObserverFail() {
		if ( ! animateElementsOnScroll ) {
			return;
		}

		setTimeout( function () {
			if ( $( '[data-aos]' ).not( '.aos-init' ).length ) {

				/* Try to init AOS again */
				AOS.init( {
					disable: 'mobile'
				} );

				/* If no success, cancel disable AOS to avoid hidden elements */
				if ( $( '[data-aos]' ).not( '.aos-init' ).length ) {
					$( '[data-aos]' ).not( '.aos-init' ).removeAttr( 'data-aos' );
					$( '[data-aos-delay]' ).not( '.aos-init' ).removeAttr( 'data-aos-delay' );
				}
			}

			if ( isMobile() ) {
				$( '[data-aos]' ).removeAttr( 'data-aos' );
				$( '[data-aos-delay]' ).removeAttr( 'data-aos-delay' );
			}
		}, 100 );
	}

	/* Append time delay to AOS elements that are side by side on the screen */

	function appendAOSDelay() {
		var group = 0;
		var delay = 450;
		var carouselVisibleDelay = 450;
		var carouselClasses = 0;
		var yPosition = 0;

		if ( ! animateElementsOnScroll ) {
			return;
		}

		$( '[data-aos]' ).each( function () {
			var element = $( this );

			if ( ! element[0].hasAttribute( 'data-aos-offset' ) ) {
				element.attr( 'data-aos-offset', '-450' );
			}

			if ( element[0].hasAttribute( 'data-aos-group' ) ) {
				var currentYPosition = element.offset().top;

				if ( element.parents( '.owl-carousel' ).length ) {
					if ( carouselClasses === element.parents( '.owl-carousel' ).attr( 'class' ) ) {
						if ( element.hasClass( 'active' ) || element.parent().hasClass( 'active' ) || element.parent().parent().hasClass( 'active' ) ) {
							carouselVisibleDelay += 450;
							element.attr( 'data-aos-delay', carouselVisibleDelay );
						} else {
							carouselVisibleDelay = 450;
						}
					} else {
						carouselVisibleDelay = 450;
					}

					carouselClasses = element.parents( '.owl-carousel' ).attr( 'class' );
					element.removeAttr( 'data-aos' ).attr( 'data-temp-aos', '1' );
				}

				if ( group !== element.attr( 'data-aos-group' ) ) {
					group = element.attr( 'data-aos-group' );
					delay = 450;
				}

				if ( yPosition === currentYPosition ) {
					delay += 450;
				} else {
					delay = 450;
					yPosition = currentYPosition;
				}

				if ( delay > 1350 && 'header-categories' !== group ) {
					delay = 450;
				}

				if ( ! element[0].hasAttribute( 'data-aos-delay' ) ) {
					element.attr( 'data-aos-delay', delay );
				}

			} else {
				delay = 450;
			}// End if().
		} );
	}

	/* Scale texts to fulfill the width/height of parent container */

	function scaleHeader() {
		var
			scalable = $( '.listar-term-name-big span' ),
			margin	 = viewport().width < 600 ? 130 : 140;

		scalable.css( {
			'-webkit-transform' : 'scale(1)',
			'-moz-transform'    : 'scale(1)',
			'-ms-transform'     : 'scale(1)',
			'-o-transform'      : 'scale(1)',
			'transform'         : 'scale(1)'
		} );

		scalable.each( function () {
			var thisElem = $( this );
			var scalableContainer = thisElem.parent();
			var parentScaleWidthFactor = scalableContainer.width() / thisElem.width();

			var scalableContainerWidth = scalableContainer.width() - margin;
			var scalableWidth = thisElem.width();

			var scalableContaineHeight = scalableContainer.parent().height() - margin;
			var scalableHeight = 14;

			var scaleWidth = scalableContainerWidth / scalableWidth;
			var scaleHeight = scalableContaineHeight / scalableHeight;
			var scale = Math.min( scaleWidth, scaleHeight );

			if ( parentScaleWidthFactor < 6 ) {
				scaleWidth = ( scalableContainerWidth + margin ) / ( scalableWidth + ( 4 * parentScaleWidthFactor ) );
				scaleHeight = scalableContaineHeight / ( scalableHeight + ( 3 * parentScaleWidthFactor ) );
				scale = Math.min( scaleWidth, scaleHeight );
			}

			if ( scale < 0 ) {
				setTimeout( function () {
					scaleHeader();
				}, 500 );
			} else {
				thisElem.css( {
					'-webkit-transform' : 'scale(' + scale + ')',
					'-moz-transform'    : 'scale(' + scale + ')',
					'-ms-transform'     : 'scale(' + scale + ')',
					'-o-transform'      : 'scale(' + scale + ')',
					'transform'         : 'scale(' + scale + ')'
				} );
			}
		} );
	}

	/* Debounce by David Walsch */
	/* Link: https://davidwalsh.name/javascript-debounce-function */

	function debounce( func, wait, immediate ) {
		var timeout;

		return function () {
			var context = this, args = arguments;
			var later = function () {
				timeout = null;

				if ( ! immediate ) {
					func.apply( context, args );
				}
			};

			var callNow = immediate && ! timeout;

			clearTimeout( timeout );

			timeout = setTimeout( later, wait );

			if ( callNow ) {
				func.apply( context, args );
			}
		};
	}

	function getScrollBarWidth() {
		return viewport().width - $( 'html' ).width();
	}

	/* Fix AOS negative vertical offsets only one time, if available */
	/* Because nested AOS offsets not calculate distances properly */

	function AOSRefresh() {

		if ( ! animateElementsOnScroll ) {
			return;
		}

		$( '.aos-animate[data-aos-offset=-450]' ).each( function() {
			var element = $( this );

			if ( element.parents( '[data-aos]' ).length ) {
				element.attr( 'data-aos-offset', '30' );
			} else {
				element.attr( 'data-aos-offset', '100' );
			}

			AOS.refresh();
		} );
	}

	function initListingGalleryScroll() {
		setTimeout( function() {
			if ( listingGallery.prop( 'scrollWidth' ) > listingGallery.width() + 3 ) {
				if ( $.isFunction( $.fn.dragScroll ) ) {
					listingGallery.dragScroll( {} );
					listingGallery.removeClass( 'listar-no-drag-scroll' );
				}
			} else {
				listingGallery.addClass( 'listar-no-drag-scroll' );
			}
		}, 500 );
	}

	function fitMapBounds( listingMap, boundsArray ) {
		if ( boundsArray.length > 0 ) {
			listingMap.fitBounds( boundsArray );
		}
	}

	/* Get updated nonce for login/register form with Ajax */
	/* Useful mainly if a cache plugin is currently installed */

	function getUpdatedNonce() {
		if ( 'listarAddonsDirectoryURL' in window ) {
			var fileURL = window.listarAddonsDirectoryURL + 'inc/get-updated-nonce.php?rand=' + Math.floor( ( Math.random() * 999999999999 ) + 1 );

			if ( $( '#login-security' ).length || $( '#listar-private-message-security' ).length || $( '#listar-claim-security' ).length ) {
				$.ajax( {
					crossDomain: true,
					timeout  : 30000,
					url: fileURL,
					success: function( data ) {
						if ( $( data ).find( '#login-security' ).length && $( '#login-security' ).length ) {
							$( '#login-security' ).val( $( data ).find( '#login-security' ).val() ).addClass( 'listar-nonce-updated' );
						}

						if ( $( data ).find( '#register-security' ).length && $( '#register-security' ).length ) {
							$( '#register-security' ).val( $( data ).find( '#register-security' ).val() ).addClass( 'listar-nonce-updated' );
						}

						if ( $( data ).find( '#password-security' ).length && $( '#password-security' ).length ) {
							$( '#password-security' ).val( $( data ).find( '#password-security' ).val() ).addClass( 'listar-nonce-updated' );
						}

						if ( $( data ).find( '#listar-private-message-security' ).length && $( '#listar-private-message-security' ).length ) {
							$( '#listar-private-message-security' ).val( $( data ).find( '#listar-private-message-security' ).val() ).addClass( 'listar-nonce-updated' );
						}

						if ( $( data ).find( '#listar-claim-security' ).length && $( '#listar-claim-security' ).length ) {
							$( '#listar-claim-security' ).val( $( data ).find( '#listar-claim-security' ).val() ).addClass( 'listar-nonce-updated' );
						}
					}
				} );
			}
		}
	}

	function startCanvas() {
		document.addEventListener( 'mousemove', onMouseMove );
		window.addEventListener( 'resize', resizeCanvases );
		appending.appendChild( imageCanvas );
		resizeCanvases();
		tickCanvas();
	}

	function onMouseMove( event ) {
		var scroll = 0;

		if ( ! $( '.search-popup' ).length ) {
			scroll = theDocument.scrollTop();

			points.push( {
				time : Date.now(),
				x : event.clientX,
				y : event.clientY + scroll
			} );
		}
	}

	function resizeCanvases() {
		if ( ! ( 'listarDisableRubber' in window ) && ! isMobile() ) {
			theBody.addClass( 'listar-rubber-effect-enabled' );

			setTimeout( function () {
				
				var c = setInterval( function () {
					var heroHeaderElements = $( '.listar-front-header, .listar-search-popup' );

					if ( heroHeaderElements.length && heroHeaderElements.find( '.listar-rubber-container canvas' ).length ) {
						heroHeaderElements.each( function () {
							imageCanvas.width = lineCanvas.width = $( this ).find( '.listar-rubber-container' ).width();
							imageCanvas.height = lineCanvas.height = $( this ).find( '.listar-rubber-container' ).height();
						} );
					}
				}, 1 );

				setTimeout( function () {
					clearInterval( c );
				}, 200 );
			}, 2000 );
		} else {
			theBody.addClass( 'listar-rubber-effect-disabled' );
		}
	}

	function tickCanvas() {
		points = points.filter( function ( point ) {
			var age = Date.now() - point.time;
			return age < pointLifetime;
		});

		drawLineCanvas();
		drawImageCanvas();
		requestAnimationFrame( tickCanvas );
	}

	function drawLineCanvas() {
		var minimumLineWidth = 40;
		var maximumLineWidth = 100;
		var lineWidthRange   = maximumLineWidth - minimumLineWidth;
		var maximumSpeed     = 50;
		var pointsCount	     = points.length;

		lineCanvasContext.clearRect( 0, 0, lineCanvas.width, lineCanvas.height );
		lineCanvasContext.lineCap = 'round';
		lineCanvasContext.shadowBlur = 20;
		lineCanvasContext.shadowColor = '#000';

		for ( var i = 1; i < pointsCount; i++ ) {
			var point		= points[ i ];
			var previousPoint	= points[ i - 1 ];
			var distance		= getDistanceBetween( point, previousPoint );
			var speed		= Math.max( 0, Math.min( maximumSpeed, distance ) );
			var percentageLineWidth = ( maximumSpeed - speed ) / maximumSpeed;
			var age			= Date.now() - point.time;
			var opacity		= ( pointLifetime - age ) / pointLifetime;

			lineCanvasContext.lineWidth   = minimumLineWidth + percentageLineWidth * lineWidthRange;
			lineCanvasContext.strokeStyle = 'rgba(0, 0, 0, ' + opacity + ')';
			lineCanvasContext.beginPath();
			lineCanvasContext.moveTo( previousPoint.x, previousPoint.y );
			lineCanvasContext.lineTo( point.x, point.y );
			lineCanvasContext.stroke();
		}
	}

	function getDistanceBetween( a, b ) {
		return Math.sqrt( Math.pow( a.x - b.x, 2 ) + Math.pow( a.y - b.y, 2 ) );
	}

	function drawImageCanvas() {
		var top    = 0, left = 0;
		var width  = imageCanvas.width;
		var height = imageCanvas.width / originalCanvasImage.naturalWidth * originalCanvasImage.naturalHeight;

		if ( height < imageCanvas.height ) {
			width  = imageCanvas.height / originalCanvasImage.naturalHeight * originalCanvasImage.naturalWidth;
			height = imageCanvas.height;
			left   = -( width - imageCanvas.width ) / 2;
		} else {
			top = -( height - imageCanvas.height ) / 2;
		}

		imageCanvasContext.clearRect( 0, 0, imageCanvas.width, imageCanvas.height );
		imageCanvasContext.globalCompositeOperation = 'source-over';
		imageCanvasContext.drawImage( originalCanvasImage, left, top, width, height );
		imageCanvasContext.globalCompositeOperation = 'destination-in';
		imageCanvasContext.drawImage( lineCanvas, 0, 0 );

	}

	function addCanvasEffect() {
		originalCanvasImage = document.querySelector( '.listar-rubber-clear-image' );
		appending	    = document.querySelector( '.listar-rubber-container' );
		imageCanvas	    = document.createElement( 'canvas' );
		imageCanvasContext  = imageCanvas.getContext( '2d' );
		lineCanvas	    = document.createElement( 'canvas' );
		lineCanvasContext   = lineCanvas.getContext( '2d' );
		pointLifetime	    = 1000;
		points		    = [];

		if ( originalCanvasImage.complete ) {
			startCanvas();
		} else {
			originalCanvasImage.onload = startCanvas;
		}
	}

	function setCanvasEffect() {
		if ( ! ( 'listarDisableRubber' in window ) && ! isMobile() && ! ( $( '.listar-hero-gooey-effect' ).length ) ) {
			var href = window.location.href;
			var dir  = href.substring( 0, href.lastIndexOf( '/' ) ) + '/';
			var bgImage;
			var heroHeaderElements = $( '.listar-front-header, .listar-search-popup' );

			if ( heroHeaderElements.length && heroHeaderElements.find( '.listar-hero-image' ).length ) {

				heroHeaderElements.each( function () {
					var thisHeader = $( this );

					if ( thisHeader.find( '.listar-hero-image' )[0].hasAttribute( 'data-background-image' ) ) {
						bgImage = thisHeader.find( '.listar-hero-image' ).attr( 'data-background-image' );
					} else {
						bgImage = thisHeader.find( '.listar-hero-image' ).css( 'background-image' );
					}

					if ( bgImage !== 'none' && typeof bgImage !== 'undefined' ) {
						bgImage = bgImage.replace( dir, '' );
						bgImage = bgImage.replace( ' ', '' ).replace( ' ', '' ).replace( ' ', '' ).replace( ' ', '' ).replace( ' ', '' );
						bgImage = bgImage.replace( 'url(\"', '' ).replace( "url(\'", '' ).replace( 'url(', '' ).replace( '")', '' );
						bgImage = bgImage.replace( "')", '' ).replace( ')', '' );

						thisHeader.append( '<div class="listar-rubber-container listar-rubber-media"><img class="listar-rubber-clear-image" src="' + bgImage + '"></div>' );
						addCanvasEffect();
					}
				} );
			}
		}
	}

	function executeAfterLoad() {

		var scrollTop = theDocument.scrollTop();

		if ( true === isFrontPage && animateElementsOnScroll ) {
			var searchCategoriesBottom = scrollTop * 0.3 + 100;
			var diff = 0;

			if ( searchCategoriesBottom <= 100 ) {
				searchCategoriesBottom = 0;
				$( '.listar-search-categories' ).addClass( 'listar-categories-fixed-bottom' );
			} else {
				$( '.listar-search-categories' ).removeClass( 'listar-categories-fixed-bottom' );
			}

			if ( $( '.listar-search-categories' ).length || '0px' === $( '.listar-search-categories' ).css( 'bottom' ) ) {
				diff = 150;
			}

			if ( scrollTop < 40 ) {
				diff = 0;
			}

			$( '.listar-front-header .listar-header-centralizer' ).css( { top : '-' + ( scrollTop + diff ) * 0.5 + 'px' } );
			$( '.listar-search-categories' ).css( { bottom : searchCategoriesBottom + 'px' } );

		}

		frontPageCallToActionBadge.each( function () {
			if ( $( this ).parent().hasClass( 'listar-animate-wavy-badge' ) ) {

				if ( isInViewport( $( this ).parent() ) ) {
					$( this ).addClass( 'listar-animate-badge-mask' );
				} else {
					$( this ).removeClass( 'listar-animate-badge-mask' );
				}
			}
		} );

		listarFeaturifyElements.each( function () {
			if ( isInViewport( $( this ) ) ) {
				$( this ).removeClass( 'listar-hidden-featured-left listar-hidden-featured-right' ).addClass( 'listar-show-featurify' );
			}
		} );

		fixListingTermCardsInnerDistances();
		equalizeCallToActionColumnsHeights();
	}

	function defineHiddenFooterHeight() {
		var footerHeight = 0;
		var footerHeight2 = 0;

		setTimeout( function () {
			if ( $( '.listar-footer-navigation-wrapper' ).length ) {
				footerHeight = $( '.listar-footer-navigation-wrapper' ).parents( '.navbar' ).height() + 60;
			}

			if ( $( '.listar-footer-credits .copyright' ).length ) {
				footerHeight += $( '.listar-footer-credits .copyright' ).parents( '.listar-container-wrapper' ).height() + 60;
			}

			if ( $( '.listar-footer-menu' ).length || $( '#colophon .copyright' ).length ) {
				if ( $( '#colophon' ).length ) {
					footerHeight2 += $( '#colophon' ).height() + 60;
				}
			}

			if ( footerHeight + 150 < viewport().height ) {
				theBody.addClass( 'listar-hidden-footer' );
				$( '.listar-hidden-footer .listar-site-footer .listar-site-footer-inner' ).css( { marginBottom : footerHeight2 } );
			} else {
				$( '.listar-hidden-footer .listar-site-footer .listar-site-footer-inner' ).css( { marginBottom : 0  } );
				theBody.removeClass( 'listar-hidden-footer' );
			}
		}, 1000 );
	}

	function adjustWidgetImageCaptionsWidth() {
		setTimeout( function () {
			$( '.wp-caption-text' ).each( function () {
				var images = $( this ).parent().find( 'img' );

				if ( 1 === images.length ) {
					var figure = images.parents( 'figure.gallery-item' );
					var link   = images.parents( 'a' );

					if ( figure.length && link.length ) {
						$( this ).width( link.eq( 0 ).width() - 20 );
					} else {
						$( this ).width( images.eq( 0 ).width() - 20 );
					}
				}
			} );
		}, 1000 );
	}

	function captureCurrentViewportHeight() {
		setTimeout( function () {
			viewportHeight = viewport().height;
		}, 2000 );
	}

	function fixListingTermCardsInnerDistances() {
		setTimeout( function () {
			$( '.listar-term-description' ).each( function () {
				var parentHeight = $( this ).parent().height();
				var thisHeight = $( this ).height();
				var termTitleHeight = $( this ).siblings( '.listar-term-text' ).height();
				var diff = parentHeight - ( thisHeight + termTitleHeight );

				if ( parentHeight - ( thisHeight + termTitleHeight ) < 99 ) {
					diff = -1 * ( 112 - diff );
					$( this ).siblings( '.listar-term-text' ).css( { top : diff } );
				} else {
					$( this ).siblings( '.listar-term-text' ).css( { top : '' } );
				}
			} );
		}, 2000 );
	}

	function checkGridFillerCard() {
		$( '.listar-grid-filler' ).each( function () {
			var
				gridFillerOuter = '',
				gridFiller = $( this ),
				gridFillerParent = $( this ).parent();

			/* Force the card position to the end of the grid */
			gridFillerOuter = gridFiller.prop( 'outerHTML' );
			gridFiller.prop( 'outerHTML', '' );
			gridFillerParent.append( gridFillerOuter );
			gridFiller = gridFillerParent.find( '.listar-grid-filler' );

			gridFiller.attr( 'class', ( gridFiller.prev().attr( 'class' ) ) ).addClass( 'listar-grid-filler' );

			setTimeout( function () {
				var
					cardWidth          = gridFiller.width() - 1,
					containerWidth     = gridFiller.parent().width(),
					cardsCount         = gridFiller.siblings().length,
					descriptionWrapper = gridFiller.find( '.listar-fallback-content-data' );

				var
					cardsPerRow = Math.floor( containerWidth / cardWidth );

				var
					missingGridLength = cardsPerRow - ( cardsCount % cardsPerRow );

				if ( missingGridLength !== cardsPerRow ) {
					var
						colClass1 = gridFiller.parents( '.col-lg-9' ).length ? 'nothing' : 'col-md-8',
						colClass2 = gridFiller.parents( '.col-lg-9' ).length ? 'nothing' : 'col-md-4';

					if ( gridFiller.hasClass( 'col-md-12' ) ) {
						colClass1 = 'nothing';
						colClass2 = 'nothing';
					}

					if ( 1 === missingGridLength ) {
						gridFiller.removeClass( colClass1 ).addClass( colClass2 );
					} else if ( 2 === missingGridLength ) {
						gridFiller.removeClass( colClass2 ).addClass( colClass1 );
					}

					gridFiller.removeClass( 'hidden' );
				} else {
					gridFiller.addClass( 'hidden' );
				}

				if ( descriptionWrapper.length ) {
					if ( descriptionWrapper.prop( 'innerHTML' ).replace( /\s/g, '' ).length < 5 ) {
						descriptionWrapper.prop( 'outerHTML', '' );
					}
				}

			}, 500 );
		} );
	}

	function checkGalleryHoverTimeout( gallery ) {
		if ( gallery.hasClass( 'listar-gallery-dark' ) ) {
			var bodySlideClass = theBody.hasClass( 'listar-listing-has-slideshow-cover' ) ? 'listar-hovering-listing-slideshow-gallery' : 'listar-hovering-listing-gallery-dark';

			clearTimeout( hoveringGalleryTimeout );
			$( theBody ).addClass( bodySlideClass );

			hoveringGalleryTimeout = setTimeout( function () {
				if ( hasGalleryMouseleave ) {
					hasGalleryMouseleave = false;
					$( theBody ).removeClass( bodySlideClass );
				}
			}, 500 );
		}
	}

	var firstCreation = false;

	function createListingGallery() {
		
		if ( ! firstCreation ) {
			firstCreation = true;
			listingGallery = $( '.listar-listing-gallery' );

			listingGallery.each( function () {
				var gallery = $( this );
				var galleryParent = $( this ).parent();

				$( theBody ).removeClass( 'listar-listing-without-slideshow-cover' );

				if ( false !== listingGalleryInitialBackup ) {
					gallery.prop( 'outerHTML', listingGalleryInitialBackup );
						gallery = galleryParent.find( '.listar-listing-gallery' );
						listingGallery = gallery;
						listingGalleryItems = gallery.find( '.gallery-item' );
						listingGalleryLinks = gallery.find( 'a' );
				} else {
					listingGalleryInitialBackup = gallery.prop( 'outerHTML' );
				}

				setTimeout( function () {
					if ( listingGalleryItems.length > 0 && ( gallery.hasClass( 'listar-gallery-slideshow-squared' ) || gallery.hasClass( 'listar-gallery-slideshow-rounded' ) ) ) {
						var galleryNav    = '<div class="listar-gallery-slideshow-thumbs">' + gallery.prop( 'innerHTML' ) + '</div>';
						var gallerySlides = '<div class="listar-gallery-slideshow-slides-wrapper"><div class="listar-gallery-slideshow-slides">' + gallery.prop( 'innerHTML' ) + '</div></div>';
						var firstItemHTML = '';

						$( theBody ).addClass( 'listar-listing-has-slideshow-cover' );
						gallery.parents( 'section' ).find( 'header' ).removeClass( 'hidden' );

						gallery.prop( 'innerHTML', gallerySlides );

						if ( ! $( '.listar-gallery-slideshow-separator' ).length ) {
							gallery.parents( 'section' ).after( '<div class="listar-section listar-section-no-padding-top listar-section-no-padding-bottom listar-gallery-slideshow-separator"></div>' );
						}

						gallery
							.append( galleryNav );

						$( '.listar-gallery-slideshow-slides .gallery-item a, .listar-gallery-slideshow-slides .listar-listing-gallery-more-images' ).prop( 'outerHTML', '' );

						gallerySlides = $( '.listar-gallery-slideshow-slides .gallery-item' );

						if ( gallerySlides.length > 1 ) {
							firstItemHTML = gallerySlides.eq( 0 ).prop( 'outerHTML' );

							gallerySlides.parent()
								.prepend( gallerySlides.eq( gallerySlides.length - 1 ).prop( 'outerHTML' ) )
								.append( firstItemHTML );
						}

						gallerySlides = $( '.listar-gallery-slideshow-slides .gallery-item' );

						var
							navWidth  = 0,
							viewportW = viewport().width;

						if ( viewportW > 991 ) {
							navWidth = 160;
						} else if ( viewportW > 767 ) {
							navWidth = 90;
						} else {
							navWidth = 0;
						}

						slideWidth = theBody.width() - ( navWidth * 2 ) + 0.5;

						if ( viewportW > 1199 && viewportW < 1301 ) {
							slideWidth = 1020;
							navWidth = ( -1 * ( slideWidth - theBody.width() - 0.5 ) ) / 2; /* Reverse */
						} else if ( viewportW > 1300 ) {
							slideWidth = 1140;
							navWidth = ( -1 * ( slideWidth - theBody.width() - 0.5 ) ) / 2; /* Reverse */
						} else if ( viewportW > 991 ) {
							slideWidth = 800;
							navWidth = ( -1 * ( slideWidth - theBody.width() - 0.5 ) ) / 2; /* Reverse */
						} else if ( viewportW < 860 && viewportW > 766 && slideWidth < 620 ) {
							slideWidth = 620;
							navWidth = ( -1 * ( slideWidth - theBody.width() - 0.5 ) ) / 2; /* Reverse */
						}

						centralizeMainSlide = ( -1 * slideWidth ) + navWidth;

						gallery.append( '<div class="listar-listing-gallery-overlay"></div>' );

						if ( gallerySlides.length > 1 ) {
							gallery
								.append( '<div class="listar-listing-gallery-nav-previous"><div class="icon-arrow-left"></div></div>' )
								.append( '<div class="listar-listing-gallery-nav-next"><div class="icon-arrow-right"></div></div>' );

							gallerySlides.css( { width : slideWidth, height : gallery.siblings( 'header' ).outerHeight() } );
							gallerySlides.eq( 0 ).css( { marginLeft : centralizeMainSlide - ( 0 * slideWidth ) } );

							$( '.listar-listing-gallery-nav-previous, .listar-listing-gallery-nav-next' ).css( { width : navWidth } );
						} else {
							gallerySlides.css( { width : viewportW, height : gallery.siblings( 'header' ).outerHeight() } );
						}
					} else {
						$( theBody ).addClass( 'listar-listing-without-slideshow-cover' );
					}

					$( '.listar-listing-gallery' ).addClass( 'listar-listing-gallery-loaded' );
				}, 500 );
			} );

			listingGalleryLinks.each( function () {
				var thisElement = $( this );
				var title = thisElement.attr( 'data-title' );

				if ( undefined !== title && 'undefined' !== title && '' !== title && ' ' !== title ) {
					thisElement.after( '<div class="listar-listing-gallery-item-caption">' + title + '</div>' );
				} else {
					/* Avoid print 'undefined' on 'alt' attribute */
					title = '';
				}

				if ( ! thisElement.parent().find( 'img' ).length ) {
					thisElement.after( '<img alt="' + title + '" src="' + thisElement.attr( 'data-image-placeholder' ) + '" \/>' );
					thisElement.parent().find( 'img' ).css( { 'background-image' : 'url(' + thisElement.attr( 'href' ) + ')' } );
				}
			} );
			
			setTimeout( function () {
				firstCreation = false;
			}, 1000 );
		}
	}

	function setFallbackNoReviewContentHeight() {
		$( '.listar-no-reviews-content.listar-fallback-content' ).each( function () {
			var thisContent = $( this );

			thisContent.parent().css( { height : '' } );

			setTimeout( function () {
				thisContent.parent().css( { height : thisContent.height() + 60 } );

				if ( viewport().width >=992 && $( '.listar-mood-icon.icon-neutral' ).length ) {
					setTimeout( function () {
						if ( $( '.listar-review-second-col' ).height() < $( '.listar-review-first-col' ).height() ) {
							thisContent.parent().css( { height : $( '.listar-review-first-col' ).height() - 30 } );
						}
					}, 800 );
				}
			}, 1000 );
		} );
	}

	function checkFillerButtonBlog() {
		setTimeout( function () {
			$( '.listar-fallback-blog-button' ).each( function () {
				var button = $( this );
				var url = button.parents( '.listar-fallback-content' ).siblings( 'a' ).attr( 'href' );
				var innerText = button.find( '.button' ).prop( 'innerHTML' );
				var hasNext = false;

				if ( ! isLastBlogPage ) {
					$( '.listar-navigation.posts-navigation .next.page-numbers' ).each( function () {
						url = $( this ).attr( 'href' );
						hasNext = true;
						innerText = button.find( '.button' ).attr( 'data-next-posts' );
					} );

					if ( ! hasNext ) {
						$( '.listar-navigation.posts-navigation .prev.page-numbers' ).each( function () {
							url = $( this ).attr( 'href' );
							innerText = button.find( '.button' ).attr( 'data-previous-posts' );
						} );
					}
				} else {
					innerText = button.find( '.button' ).attr( 'data-default-text' );
					url = button.parents( '.listar-fallback-content' ).siblings( 'a' ).attr( 'data-default-url' );
				}

				button.parents( '.listar-fallback-content' ).siblings( 'a' ).attr( 'href', url );
				button.find( '.button' ).prop( 'innerHTML', innerText );
			} );
		}, 1000 );
	}

	function fallbackCopyTextToClipboard( text ) {
		var textArea = document.createElement( 'textarea' );
		textArea.value = text;
		document.body.appendChild( textArea );
		textArea.focus();
		textArea.select();

		document.execCommand( 'copy' );
		document.body.removeChild( textArea );
	}

	function copyTextToClipboard( text ) {

		/* Link: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript */

		if ( ! navigator.clipboard ) {
			fallbackCopyTextToClipboard( text );
			return;
		}

		navigator.clipboard.writeText( text );
	}

	// Get an element's distance from the top of the page
	function getElemDistance( elem ) {
		var
			scrollTop = $( window ).scrollTop(),
			elementOffset = elem.offset().top;

		return elementOffset - scrollTop;
	}

	function chechListingTopbarButtonsQty() {
		setTimeout( function () {
			var buttonsQty = $( '.listar-listing-header-topbar-item' ).length;
			var viewportWidth = viewport().width;

			if ( viewportWidth < 1201 ) {
				if ( buttonsQty < 6 && viewportWidth > 980 ) {
					$( '.listar-listing-header-topbar-wrapper' ).addClass( 'listar-hide-plus-button' );
				} else if ( buttonsQty < 5 && viewportWidth > 767 ) {
					$( '.listar-listing-header-topbar-wrapper' ).addClass( 'listar-hide-plus-button' );
				} else if ( buttonsQty < 4 && viewportWidth > 600 ) {
					$( '.listar-listing-header-topbar-wrapper' ).addClass( 'listar-hide-plus-button' );
				} else {
					$( '.listar-listing-header-topbar-wrapper' ).removeClass( 'listar-hide-plus-button' );
				}
			} else {
				$( '.listar-listing-header-topbar-wrapper' ).removeClass( 'listar-hide-plus-button' );
			}

			if ( buttonsQty <= 3 ) {
				$( '.listar-listing-header-plus-button-wrapper' ).prop( 'outerHTML', '' );
				$( '.listar-listing-header-topbar-item' ).css( { display : 'inline-block' } );
			}
		}, 1800 );
	}

	/* Detects if a colors is too light */

	function tooLightColor( colorCode, minimumLuma, returnLuma ) {
		var
			rgb,
			r = 255,
			g = 255,
			b = 255,
			luma = 0;

		if ( 'undefined' === typeof minimumLuma ) {
			minimumLuma = 150;
		}

		if ( 'string' === typeof colorCode ) {
			rgb = parseInt( colorCode, 16 ); // Convert rrggbb to decimal.
			r = ( rgb >> 16 ) & 0xff; // Extract red.
			g = ( rgb >> 8 ) & 0xff; // Extract green.
			b = ( rgb >> 0 ) & 0xff; // Extract blue.
		} else if ( 'object' === typeof colorCode ) {
			r = colorCode[0];
			g = colorCode[1];
			b = colorCode[2];
		}

		luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // Per ITU-R BT.709.

		if ( true === returnLuma ) {
			return luma;
		}

		if ( luma > minimumLuma ) {
			return true;
		} else {
			return false;
		}
	}

	function verifyBootstrapAccordions(){
		var accordionHasDescription = false;
		var hasAccordion = false;

                if ( 'none' === listarLocalizeAndAjax.listingAccordionPreopen ) {
                        $('.panel-collapse.in').collapse( 'hide' );
                } else {
                        $( '.panel-group .accordion-group' ).each( function () {
                                hasAccordion = true;

                                if ( $( this ).hasClass( 'listar-introduction-accordion' ) ) {
                                        accordionHasDescription = true;
                                }

                                if ( viewport().width >= 992 ) {
                                        $( this ).addClass( 'panel panel-default ' );

                                        if ( $( this ).hasClass( 'listar-introduction-accordion' ) && $( this ).find( '.panel-title a' )[0].hasAttribute( 'aria-expanded' ) ) {
                                                if ( 'false' === $( this ).find( '.panel-title a' ).attr( 'aria-expanded' ) ) {
                                                        $( this ).find( '.panel-title a' )[0].click();
                                                }
                                        }
                                } else {
                                        $( this ).removeClass( 'panel panel-default ' );

                                        if ( $( this ).hasClass( 'listar-business-hours-accordion' ) && $( this ).find( '.panel-title a' )[0].hasAttribute( 'aria-expanded' ) ) {
                                                if ( 'true' === $( this ).find( '.panel-title a' ).attr( 'aria-expanded' ) ) {
                                                        $( this ).find( '.panel-title a' )[0].click();
                                                }
                                        }

                                        if ( $( this ).hasClass( 'listar-introduction-accordion' ) && $( this ).find( '.panel-title a' )[0].hasAttribute( 'aria-expanded' ) ) {
                                                if ( 'false' === $( this ).find( '.panel-title a' ).attr( 'aria-expanded' ) ) {
                                                        $( this ).find( '.panel-title a' )[0].click();
                                                }
                                        }
                                }

                                if ( 1 === $( this ).parent().find( '.accordion-group' ).length ) {
                                        $( this ).parent().addClass( 'listar-accordion-one-group' );
                                }

                                setTimeout( function () {
                                        didInitialAccordionClick = true;
                                }, 400 );
                        } );

                        if ( hasAccordion && ! accordionHasDescription ) {
                                var hasOpenedAccordion = false;

                                setTimeout( function () {
                                        $( '.panel-group .accordion-group' ).eq( 0 ).not( '.listar-business-video-accordion, .listar-business-claim-accordion, .listar-business-booking-accordion' ).find( '.collapsed[aria-expanded="false"]' ).each( function () {
                                                hasOpenedAccordion = true;
                                                $( this )[0].click();

                                        } );

                                        if ( ! hasOpenedAccordion ) {
                                                $( '.panel-group .accordion-group' ).eq( 1 ).not( '.listar-business-video-accordion, .listar-business-claim-accordion, .listar-business-booking-accordion' ).find( '.collapsed[aria-expanded="false"]' ).each( function () {
                                                        hasOpenedAccordion = true;
                                                        $( this )[0].click();
                                                } );
                                        }

                                        if ( ! hasOpenedAccordion ) {
                                                $( '.panel-group .accordion-group' ).eq( 2 ).not( '.listar-business-video-accordion, .listar-business-claim-accordion, .listar-business-booking-accordion' ).find( '.collapsed[aria-expanded="false"]' ).each( function () {
                                                        hasOpenedAccordion = true;
                                                        $( this )[0].click();
                                                } );
                                        }
                                }, 200 );

                        }
                }
	}

	function fixGutenbergImageBlocks() {
		setTimeout( function () {
			/* Fix Gutenberg image block width to match the inner image width*/
			$( '.wp-block-image img' ).each( function () {
				if ( ! $( this ).parents( 'figure' ).hasClass( 'alignfull' ) && ! $( this ).parents( 'figure' ).hasClass( 'alignwide' ) ) {
					$( this ).parents( 'figure' ).css( { width : 'auto' } );
					$( this ).parents( 'figure' ).css( { width : $( this ).width() } );
				}
			} );
		}, 500 );
	}

	function fixGutenbergAlignFull() {
		setTimeout( function () {
			$( '.alignfull:not(.wp-block-embed)' ).each( function () {
				if ( 0 === $( this ).parents( '.col-md-8,.col-md-9,.col-lg-9' ).length ) {
					var translateX = 0;

					if ( ! $( this ).hasClass( 'has-parallax' ) ) {
						translateX = Math.floor( scrollbarWidth / 2 );
					}

					$( this ).css( {
						width : lastViewportWidth - scrollbarWidth,
						'-webkit-transform' : 'translate(' + translateX + 'px,0)',
						'-moz-transform'    : 'translate(' + translateX + 'px,0)',
						'-ms-transform'     : 'translate(' + translateX + 'px,0)',
						'-o-transform'      : 'translate(' + translateX + 'px,0)',
						'transform'         : 'translate(' + translateX + 'px,0)'
					} );
				} else {
					$( this ).css( {
						width : '',
						'-webkit-transform' : 'translate(0,0)',
						'-moz-transform'    : 'translate(0,0)',
						'-ms-transform'     : 'translate(0,0)',
						'-o-transform'      : 'translate(0,0)',
						'transform'         : 'translate(0,0)'
					} );
				}
			} );
		}, 250 );
	}

	function circleEvents() {

		if ( theBody.hasClass( 'listar-spiral-effect' ) ) {
			cancelListingCardCircleEvents = false;
		}

		if ( cancelListingCardCircleEvents ) {
			return false;
		}

		$( '.listar-listing-card' ).off( 'mouseenter mouseleave' );

		theBody.on( 'mouseenter', '.listar-listing-card', function () {
			var thisElement = $( this ).find( '.listar-card-content-image' );

			if ( theBody.hasClass( 'listar-listing-card-design-squared' ) ) {
				thisElement.siblings( '.listar-listing-rating' ).stop().animate( { marginLeft : '10px', opacity : 0 } );
				thisElement.siblings( '.listar-claimed-icon' ).stop().animate( { bottom : '-40px', opacity : 0 } );
				thisElement.siblings( '.listar-category-icon' ).stop().animate( { top : '-40px', left : '-40px', opacity : 0 } );
				thisElement.siblings( '.listar-listing-logo-wrapper' ).stop().animate( { bottom : '-50px', right : '-50px', opacity : 0 } );
			} else if ( thisElement.parent().parent().parent().hasClass( 'listar-grid2' ) || thisElement.parent().parent().parent().hasClass( 'listar-grid3' ) ) {
				thisElement.siblings( '.listar-claimed-icon' ).stop().animate( { bottom : '-40px', opacity : 0 } );
				thisElement.siblings( 'a, .listar-listing-rating' ).not( '.listar-card-content-author' ).stop().animate( { marginLeft : '10px', opacity : 0 } );
				thisElement.siblings( '.listar-card-content-author' ).stop().animate( { top : '110px', opacity : 0 } );
				thisElement.siblings( '.listar-card-content-date' ).stop().animate( { top : '-60px', opacity : 0 } );
			} else if ( thisElement.parent().parent().parent().parent().hasClass( 'listar-grid6' ) && thisElement.parent().parent().parent().parent().hasClass( 'listar-rounded-pic' ) ) {
				thisElement.siblings( 'a' ).not( '.listar-card-content-author' ).stop().animate( { top : '-20px', opacity : 0 } );
				thisElement.find( '.listar-listing-rating' ).stop().animate( { marginLeft : '10px', opacity : 0 } );
				thisElement.siblings( '.listar-card-content-author' ).stop().animate( { top : 0, opacity : 0 } );
				thisElement.siblings( '.listar-card-content-date' ).stop().animate( { top : '-60px', opacity : 0 } );
			} else {
				thisElement.siblings( '.listar-claimed-icon' ).stop().animate( { bottom : '-40px', opacity : 0 } );
				thisElement.siblings( '.listar-listing-rating' ).stop().animate( { marginLeft : '10px', opacity : 0 } );
				thisElement.siblings( '.listar-category-icon' ).stop().animate( { top : '-15px', left : '-15px', opacity : 0 } );
				thisElement.siblings( '.listar-listing-logo-wrapper' ).stop().animate( { bottom : '-30px', right : '-30px', opacity : 0 } );
				thisElement.siblings( '.listar-fav-listing' ).stop().animate( { marginTop : '-60px', opacity : 0 } );
				thisElement.siblings( '.listar-card-content-author' ).stop().animate( { top : 0, opacity : 0 } );
				thisElement.siblings( '.listar-card-content-date' ).stop().animate( { top : '-90px', opacity : 0 } );
			}
		} );

		theBody.on( 'mouseleave', '.listar-listing-card', function () {
			var thisElement = $( this ).find( '.listar-card-content-image' );

			if ( theBody.hasClass( 'listar-listing-card-design-squared' ) ) {
				thisElement.siblings( '.listar-listing-rating' ).stop().animate( { marginLeft : '-28px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-listing-rating' ).css( { marginLeft : '' } );
				} } );

				thisElement.siblings( '.listar-claimed-icon' ).stop().animate( { bottom : '-15px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-claimed-icon' ).css( { bottom : '' } );
				} } );

				thisElement.siblings( '.listar-category-icon' ).stop().animate( { top : '-24px', left : '-18px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-category-icon' ).css( { top : '' } );
				} } );

				thisElement.siblings( '.listar-listing-logo-wrapper' ).stop().animate( { bottom : '-24px', right : '-26px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-listing-logo-wrapper' ).css( { top : '', left: '' } );
				} } );
			} else if ( thisElement.parent().parent().parent().hasClass( 'listar-grid2' ) || thisElement.parent().parent().parent().hasClass( 'listar-grid3' ) ) {
				thisElement.siblings( '.listar-listing-rating' ).stop().animate( { marginLeft : '-26px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-listing-rating' ).css( { marginLeft : '' } );
				} } );

				thisElement.siblings( '.listar-claimed-icon' ).stop().animate( { bottom : '-15px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-claimed-icon' ).css( { bottom : '' } );
				} } );

				thisElement.siblings( '.listar-category-icon' ).stop().animate( { top : '10%', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-category-icon' ).css( { top : '' } );
				} } );

				thisElement.siblings( '.listar-fav-listing' ).stop().animate( { marginTop : '0px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-fav-listing' ).css( { marginTop : '' } );
				} } );

				thisElement.siblings( '.listar-card-content-author' ).stop().animate( { top : '84px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-card-content-author' ).css( { top : '' } );
				} } );

				thisElement.siblings( '.listar-card-content-date' ).stop().animate( { top : '-12px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-card-content-date' ).css( { top : '' } );
				} } );

			} else if ( thisElement.parent().parent().parent().parent().hasClass( 'listar-grid6' ) && thisElement.parent().parent().parent().parent().hasClass( 'listar-rounded-pic' ) ) {
				thisElement.find( '.listar-listing-rating' ).stop().animate( { top : '-8px', opacity : 1 }, { complete : function () {
					thisElement.find( '.listar-listing-rating' ).css( { top : '' } );
				} } );

				thisElement.siblings( 'a' ).not( '.listar-card-content-author' ).stop().animate( { top : '35px', opacity : 1 }, { complete : function () {
					thisElement.siblings( 'a' ).not( '.listar-card-content-author' ).css( { top : '' } );
				} } );

				thisElement.siblings( '.listar-card-content-author' ).stop().animate( { top : '-44px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-card-content-author' ).css( { top : '' } );
				} } );

				thisElement.siblings( '.listar-card-content-date' ).stop().animate( { top : '-12px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-card-content-date' ).css( { top : '' } );
				} } );

			} else if ( thisElement.parent().parent().parent().hasClass( 'listar-squared-shape' ) || ( thisElement.parent().parent().parent().hasClass( 'listar-squared-shape-mobile' ) && viewport().width <= 600 ) ) {
				thisElement.siblings( 'a, .listar-listing-rating' ).not( '.listar-card-content-author' ).stop().animate( { top : '6%', opacity : 1 }, { complete : function () {
					thisElement.siblings( 'a, .listar-listing-rating' ).not( '.listar-card-content-author' ).css( { top : '' } );
				} } );

				thisElement.siblings( '.listar-card-content-author' ).stop().animate( { top : '-44px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-card-content-author' ).css( { top : '' } );
				} } );

				thisElement.siblings( '.listar-card-content-date' ).stop().animate( { top : '-12px', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-card-content-date' ).css( { top : '' } );
				} } );

			} else {
				if ( thisElement.parent().parent().parent().hasClass( 'listar-grid-design-2' ) ) {
					thisElement.siblings( '.listar-listing-rating' ).stop().animate( { marginLeft : '-26px', opacity : 1 }, { complete : function () {
						thisElement.siblings( '.listar-listing-rating' ).css( { marginLeft : '' } );
					} } );

					thisElement.siblings( '.listar-claimed-icon' ).stop().animate( { bottom : '-15px', opacity : 1 }, { complete : function () {
						thisElement.siblings( '.listar-claimed-icon' ).css( { bottom : '' } );
					} } );
				} else {

					thisElement.siblings( '.listar-fav-listing' ).stop().animate( { marginTop : '0px', opacity : 1 }, { complete : function () {
						thisElement.siblings( '.listar-fav-listing' ).css( { marginTop : '' } );
					} } );

					thisElement.siblings( '.listar-card-content-author' ).stop().animate( { top : '-44px', opacity : 1 }, { complete : function () {
						thisElement.siblings( '.listar-card-content-author' ).css( { top : '' } );
					} } );

					thisElement.siblings( '.listar-card-content-date' ).stop().animate( { top : '-12px', opacity : 1 }, { complete : function () {
						thisElement.siblings( '.listar-card-content-date' ).css( { top : '' } );
					} } );
				}

				thisElement.siblings( '.listar-category-icon' ).stop().animate( { top : '5%', left : '5%', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-category-icon' ).css( { top : '', left: '' } );
				} } );

				thisElement.siblings( '.listar-listing-logo-wrapper' ).stop().animate( { bottom : '1%', right : '1%', opacity : 1 }, { complete : function () {
					thisElement.siblings( '.listar-listing-logo-wrapper' ).css( { top : '', left: '' } );
				} } );
			}// End if().
		} );
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

	function verifySelect2SubtreePlaceholder() {
		$( '.select2-selection__choice' ).each( function () {
			var innerCode = $( this ).prop( 'innerHTML' );
			var noPrefixSpaces = innerCode.replace( /&nbsp;/g, '' );

			$( this ).prop( 'innerHTML', noPrefixSpaces );
		} );

		setTimeout( function () {

			$( '.select2-selection__rendered' ).each( function () {

				var select2Wrapper = $( this ).parents( '.select2' );
				var theSelect = select2Wrapper.prev();

				if ( 'SELECT' === theSelect.prop( 'tagName' ) ) {
					if ( '' !== theSelect.val() ) {
						theSelect.parent().removeClass( 'listar-showing-placeholder' ).addClass( 'listar-hidding-placeholder' );
					} else {
						theSelect.parent().addClass( 'listar-showing-placeholder' ).removeClass( 'listar-hidding-placeholder' );
					}
				}
			} );
		}, 10 );
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
		forceSelectSelected( theSelect );

		if ( theSelect.parents( '.listar-business-end-time-field' ).length ) {
			var endTimeWrapper = theSelect.parents( '.listar-business-end-time-field' );
			var dayRow = theSelect.parent().parent().parent();

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

	function prepareSelect2Hierarchy( thisSelect2Expanded ) {
		var realSelect = thisSelect2Expanded.parents( '.select2' ).prev();
		var childArray = [];

		forceSelectSelected( realSelect );

		realSelect.find( 'option' ).each( function () {
			var selectOption = $( this );

			if ( selectOption[0].hasAttribute( 'data-icon' ) ) {
				for ( var childCount = 0; childCount < 12; childCount++ ) {

					var childLevel = 'child' + childCount;

					if ( selectOption.attr( 'data-icon' ).indexOf( childLevel ) >= 0 ) {
						var termName = selectOption.prop( 'innerHTML' ).trim();
						var tempTerm = [ termName, childLevel, selectOption.index() ];
						childArray.push( tempTerm );
					}
				}
			}
		} );

		if ( childArray.length ) {
			setTimeout( function () {
				var select2DropDown = $( '.select2-results__options' );

				if ( select2DropDown.length ) {
					for ( var childCount2 = 0; childCount2 < childArray.length; childCount2++ ) {
						if ( select2DropDown.find( 'li' ).length ) {
							select2DropDown.find( 'li' ).eq( childArray[ childCount2 ][2] ).addClass( childArray[ childCount2 ][1] );
						}
					}
				}
			}, 20 );
		}

		if ( thisSelect2Expanded.hasClass( 'select2-selection--single' ) ) {
			setTimeout( function () {
				$( '.select2-container--open .select2-search__field' ).focus();
			}, 5 );
		} else {
			setTimeout( function () {
				thisSelect2Expanded.find( '.select2-search__field' ).focus();
			}, 5 );
		}
	}

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

	function updateOperatingHoursAndAvailability() {

		if ( ! hasUpdatedHoursTable ) {
			hasUpdatedHoursTable = true;

			markerCounterAfterLoad = false;
			var markerCounterAfterLoadJSON = '[';
			var updateOperatingHoursURL = listarSiteURL + '/wp-content/plugins/listar-addons/inc/update-public-operating-hours.php';
			var relatedListings  = $( '.listar-related-listings article' );
			var widgetListings   = $( '.widget_listar_listings article' );
			var currentArticleID = false;

			if ( 'undefined' !== typeof listarMapMarkers ) {
				markerCounterAfterLoad = listarMapMarkers.length;
			}

			if ( markerCounterAfterLoad ) {
				var tempMarkerArray = [];

				for ( var n = 0; n < markerCounterAfterLoad; n++ ) {
					var tempMarker = listarMapMarkers[ n ];

					if ( 'string' === typeof tempMarker.lat && 'string' === typeof tempMarker.lng ) {
						tempMarker.lat = tempMarker.lat.replace( /[^0-9\.-]/g, '' );
						tempMarker.lng = tempMarker.lng.replace( /[^0-9\.-]/g, '' );							
					}

					tempMarkerArray.push( tempMarker );
				}

				window.listarMapMarkers = tempMarkerArray;
				markerCounterAfterLoad = listarMapMarkers.length;
			}

			if ( markerCounterAfterLoad && theBody.hasClass( 'listar-addons-active' ) ) {

				if ( theBody.hasClass( 'single-job_listing' ) ) {
					var currentArticle = theBody.find( 'main > article' );
					currentArticleID = false;

					if ( currentArticle ) {
						if ( currentArticle[0].hasAttribute( 'id' ) ) {
							currentArticleID = currentArticle.attr( 'id' );
							currentArticleID = currentArticleID.replace( 'post-', '' );
						}

						markerCounterAfterLoadJSON += '{"single-listing-page":"' + currentArticleID +'"},';
					}
				}

				for ( var mc = 0; mc < markerCounterAfterLoad; mc++ ) {
					markerCounterAfterLoadJSON += '{"listing-id-' + mc + '":"' + listarMapMarkers[ mc ].listingID +'"},';
				}

				relatedListings.each( function () {
					var currentRelatedArticle = $( this );
					var currentRelatedArticleID = false;

					if ( currentRelatedArticle ) {
						if ( currentRelatedArticle[0].hasAttribute( 'id' ) ) {
							currentRelatedArticleID = currentRelatedArticle.attr( 'id' );
							currentRelatedArticleID = currentRelatedArticleID.replace( 'post-', '' );
						}

						if ( false !== currentRelatedArticleID ) {
							markerCounterAfterLoadJSON += '{"listing-id-' + currentRelatedArticleID + '":"' + currentRelatedArticleID +'"},';
						}
					}
				} );

				widgetListings.each( function () {
					var currentWidgetArticle = $( this );
					var currentWidgetArticleID = false;

					if ( currentWidgetArticle ) {
						if ( currentWidgetArticle[0].hasAttribute( 'id' ) ) {
							currentWidgetArticleID = currentWidgetArticle.attr( 'id' );
							currentWidgetArticleID = currentWidgetArticleID.replace( 'post-', '' );
						}

						if ( false !== currentWidgetArticleID ) {
							markerCounterAfterLoadJSON += '{"listing-id-' + currentWidgetArticleID + '":"' + currentWidgetArticleID +'"},';
						}
					}
				} );

				/* Remove last comma */
				markerCounterAfterLoadJSON = markerCounterAfterLoadJSON.replace( /,\s*$/, '' );

				markerCounterAfterLoadJSON += ']';

				markerCounterAfterLoadJSON = { my_data : markerCounterAfterLoadJSON };

				$( '.listar-open-or-closed' ).each( function () {
					if ( ! $( this ).parent().hasClass( 'listar-booking-quick-button-inner' ) ) {
						$( this ).addClass( 'listar-updating-hours' );
					}
				} );

				$.ajax( {
					crossDomain: true,
					url: updateOperatingHoursURL,
					type: 'POST',
					data: markerCounterAfterLoadJSON
				} ).done( function ( response ) {
					if ( response ) {
						var data = $.parseJSON( response );

						$.each( data, function() {
							if ( 'undefined' !== typeof this.id && 'undefined' !== typeof this.statushtml ) {
								var theListingID = this.id;
								var theListingStatusName = this.status;
								var theListingStatus = this.statushtml;
								var theListingIconClass = this.iconclass;
								var theListingHoursTable = '';
								var theListingArticle = $( 'article.post-' + theListingID );

								if ( theListingArticle.length ) {
									var cardAvailabilityDiv = theListingArticle.find( '.listar-open-or-closed' );

									if ( cardAvailabilityDiv.length ) {
										cardAvailabilityDiv.prop( 'outerHTML', theListingStatus );
									}
								}

								if ( false !== currentArticleID && theListingID === currentArticleID ) {
									$( '.listar-operating-hours-quick-button-inner' ).each( function () {
										$( this ).prop( 'innerHTML', theListingStatus );
									} );

									$( '.listar-business-hours-accordion .listar-open-or-closed' ).each( function () {
										$( this ).parent().removeClass( 'icon-alarm-check icon-alarm-error' ).addClass( theListingIconClass );
										$( this ).prop( 'outerHTML', theListingStatus );

									} );

									theListingHoursTable = this.hourstablehtml;

									if ( 'undefined' !== typeof this.id && 'undefined' !== typeof theListingHoursTable ) {
										if ( '' !== theListingHoursTable ) {
											$( '.listar-hours-table-wrapper' ).each( function () {
												if ( 'open' === theListingStatusName ) {
													$( this ).parents( '.listar-business-status-open, .listar-business-status-closed' )
														.removeClass( 'listar-business-status-closed' )
														.addClass( 'listar-business-status-open' );
												} else {
													$( this ).parents( '.listar-business-status-open, .listar-business-status-closed' )
														.removeClass( 'listar-business-status-open' )
														.addClass( 'listar-business-status-closed' );
												}
												$( this ).prop( 'outerHTML', theListingHoursTable );
											} );
										}
									}
								}
							}
						} );
					}
				} );
			}
		}
	}

	/* Ajax login / register inside popup *************************/

	function listarOpenLoginDialog( href ) {
		var modalDialog;

		$( '#listar-user-modal .modal-dialog' ).removeClass( 'listar-registration-complete' );
		modalDialog = $( '#listar-user-modal .modal-dialog' );
		modalDialog.attr( 'data-active-tab', '' );

		switch ( href ) {
			case '#listar-register' :
				modalDialog.attr( 'data-active-tab', '#listar-register' );
				break;
			case '#listar-login' :
				modalDialog.attr( 'data-active-tab', '#listar-login' );
				break;
			default :
				modalDialog.attr( 'data-active-tab', '#listar-login' );
				break;
		}

		$( '#listar-user-modal' ).modal( 'show' );
	}

	// No geolocation possible
	function impossibleGeolocation( regionFallback, countryFallback ) {

		/* Set initial values again, to be used in case of new geolocation requests */
		geolocationAttempties = 3;
		userGeolocated = false;

		$( '.listar-nearest-me-main' ).addClass( 'hidden' );
		$( '.listar-nearest-me-secondary' ).removeClass( 'hidden' );
		$( '.listar-not-geolocated-user' ).removeClass( 'hidden' );

		$( '.listar-submit-geolocation-data' ).prop( 'innerHTML', $( '.listar-submit-geolocation-data' ).attr( 'data-button-text' ) );

		return false;
	}

	// Geolocated data found
	function geolocatedDataFound( address, number, region, country, lat, lng ) {

		/* Set initial values again, to be used in case of new geolocation requests */
		geolocationAttempties = 3;
		userGeolocated = false;

		$( '.listar-nearest-me-main' ).addClass( 'hidden' );
		$( '.listar-nearest-me-secondary' ).removeClass( 'hidden' );
		$( '.listar-not-geolocated-user' ).addClass( 'hidden' );

		$( '#listar_geolocated_data_address' ).val( address );
		$( '#listar_geolocated_data_number' ).val( number );
		$( '#listar_geolocated_data_region' ).val( region );
		$( '#listar_geolocated_data_country' ).val( country );
		$( '#listar_geolocated_data_latitude' ).val( lat );
		$( '#listar_geolocated_data_longitude' ).val( lng );
	}

	// Get detailed data for geolocated coordinates.
	function getGeolocationDetails( latitude, longitude, regionFallback, countryFallback ) {
		if ( ! 'string' === typeof latitude || ! 'string' === typeof longitude || '' === latitude || '' === longitude ) {
			return impossibleGeolocation( regionFallback, countryFallback );
		}

		var geolocationType = 'coordinates';
		var theAjaxURL = listarSiteURL + '/wp-content/plugins/listar-addons/inc/reverse-geocode.php';
		var dataToSend = { send_data : '[{"type":"' + geolocationType + '"},{"latitude":"' + latitude + '"},{"longitude":"' + longitude + '"}]' };

		$.ajax( {
			crossDomain: true,
			url: theAjaxURL,
			type: 'POST',
			data: dataToSend,
			cache    : false,
			timeout  : 30000

		} ).done( function ( response ) {

			if ( response ) {

				var data = $.parseJSON( response );

				if ( '1' === data.geolocated ) {
					var address = 'string' === typeof data.geolocation_street ? data.geolocation_street : '' ;
					var houseNumber = 'string' === typeof data.geolocation_street_number ? data.geolocation_street_number : '' ;
					var city = 'string' === typeof data.geolocation_city ? data.geolocation_city : '' ;
					var country = 'string' === typeof data.geolocation_country_long ? data.geolocation_country_long : '' ;
					var lat = 'string' !== typeof data.geolocation_lat && 'undefined' !== typeof data.geolocation_lat ? data.geolocation_lat : '' ;
					var lng = 'string' !== typeof data.geolocation_long && 'undefined' !== typeof data.geolocation_long ? data.geolocation_long : '' ;
					var formatted_address = 'string' === typeof data.geolocation_formatted_address ? data.geolocation_formatted_address : '' ;

					if ( '' === address ) {
							address = formatted_address;
					}

					// Finish Process here.
					geolocatedDataFound( address, houseNumber, city, country, lat, lng );
				} else {
					impossibleGeolocation( regionFallback, countryFallback );
				}
			} else {
				impossibleGeolocation( regionFallback, countryFallback );
			}
		} ).fail( function( response ) {
			impossibleGeolocation( regionFallback, countryFallback );
		} );
	}

	// Quaternary - Low precision
	function userGeolocationMethod4() {

		$.ajax( {
			/* Ajax handler */
			crossDomain: true,
			url: 'https://get.geojs.io/v1/ip/geo.json',
			type: 'GET',
			async: true,
			cache: false,
			timeout  : 5000,
			dataType: 'json'
		} ).done( function( data ) {
			if ( data ) {
				if ( data.city && data.country && data.latitude && data.longitude ) {
					getGeolocationDetails( data.latitude, data.longitude, data.city, data.country );
				} else {
					return impossibleGeolocation( '', '' );
				}
			} else {
				return impossibleGeolocation( '', '' );
			}
		} )
		.fail( function( data ) {
			return impossibleGeolocation( '', '' );
		} );
	}


	// Tertiary - Low precision

	function userGeolocationMethod3() {
		$.ajax( {
			/* Ajax handler */
			crossDomain: true,
			url: 'https://ipinfo.io',
			type: 'GET',
			async: true,
			cache: false,
			timeout  : 5000,
			dataType: 'json'
		} ).done( function( data ) {
			if ( data ) {
				var geo1 = 'string' === typeof data.loc ? data.loc : '';
				var geo2 = geo1.indexOf( ',' ) > 0 ? geo1.split( ',' ) : [ '', '' ];
				var geoLat = geo2[0];
				var geoLng = geo2[1];

				if ( '' !== geoLat && '' !== geoLng && data.city && data.region ) {
					getGeolocationDetails( geoLat, geoLng, data.city, data.region );
				} else {
					return userGeolocationMethod4();
				}
			} else {
				return userGeolocationMethod4();
			}
		} )
		.fail( function( data ) {
			return userGeolocationMethod4();
		} );
	}

	// Secondary - Medium/Low precision
	function userGeolocationMethod2() {

		var dataToSend = { send_data : '[{"type":"curl"}]' };

		$.ajax( {
			/* Ajax handler */
			crossDomain: true,
			url: listarSiteURL + '/wp-content/plugins/listar-addons/inc/geolocate-data-curl.php',
			type: 'POST',
			async: true,
			cache: false,
			data: dataToSend,
			timeout  : 5000,
			dataType: 'json'
		} ).done( function( data ) {
			if ( data ) {
				data = $.parseJSON( data );
				var region = '';

				if ( data.geoplugin_city && data.geoplugin_region && '' !== data.geoplugin_city && '' !== data.geoplugin_region ) {
					region = data.geoplugin_city + ' ' + data.geoplugin_region;
				} else if ( data.geoplugin_city  && '' !== data.geoplugin_city ) {
					region = data.geoplugin_city;
				} else if ( data.geoplugin_region && '' !== data.geoplugin_region ) {
					region = data.geoplugin_region;
				}

				if ( '' !== region && data.geoplugin_countryName && data.geoplugin_latitude && data.geoplugin_longitude ) {
					getGeolocationDetails( data.geoplugin_latitude, data.geoplugin_longitude, region, data.geoplugin_countryName );
				} else {
					return userGeolocationMethod3();
				}
			} else {
				return userGeolocationMethod3();
			}
		} )
		.fail( function( data ) {
			return userGeolocationMethod3();
		} );
	}


	// Priority - (via Browser permission) High precision

	function browserGeolocationSuccess( position ) {
		userGeolocated = true;
		geolocationAttempties = -1;
		getGeolocationDetails( position.coords.latitude, position.coords.longitude, '', '' );
	}

	function browserGeolocationFail(error) {
		userGeolocationMethod1();
	}

	function tryGeolocation() {
		if ( navigator.geolocation ) {
			navigator.geolocation.getCurrentPosition(
				browserGeolocationSuccess,
				browserGeolocationFail,
				{ maximumAge: 24000, timeout: 8000, enableHighAccuracy: true }
			);
		}
	}

	function userGeolocationMethod1() {
		geolocationAttempties--;

		if ( ! userGeolocated && geolocationAttempties > -1 ) {
			tryGeolocation();
		} else {
			geolocationAttempties = -1;
			return userGeolocationMethod2();
		}
	}

	/* Fix for WP Instant Feeds (Instagram) plugin */

	function fixInstagramFeed() {
		var hasWrongImages = false;

		$( '.wp-my-instagram.wpmi' ).each( function () {
			var widgetInsta = $( this );

			var
				args = { };

			if ( widgetInsta.find( '.wpmi-list' ).length ) {
				var firstImg = widgetInsta.find( 'img' );
				var firstUrl = '';

				if ( firstImg.length ) {
					firstImg = firstImg.eq( 0 );

					if ( firstImg[0].hasAttribute( 'src' ) ) {
						firstUrl = firstImg.attr( 'src' );
					}
				}

				if ( firstUrl.indexOf( 'instagram.' ) < 0 ) {
					widgetInsta.attr( 'data-cached', 'false' );
					widgetInsta.find( '.wpmi-list' ).attr( 'data-cached', 'false' );
					hasWrongImages = true;

					if ( false === retryInstagram ) {
						
						retryInstagram = setInterval( function () {
							fixInstagramFeed();
						}, 3000 );
					}

					widgetInsta.each( function () {
						var $el = $( this ),
							id = $el.attr( 'id' );

						args[id] = $el.data( 'args' );
					} );

					if ( args ) {

						$.ajax( {
							crossDomain: true,
							url: wpMyInstagramVars.ajaxurl,
							type: 'GET',
							async: true,
							cache: false,
							// dataType: 'json',
							data: {
								action: 'wpmi-init-cache',
								security: wpMyInstagramVars.nonce,
								args: args
							}
						} ).done( function ( response ) {
							if ( response && response.data ) {
								for ( var key in response.data ) {
									if ( key ) {
										var newWmmi = $( '#' + key + '.wp-my-instagram.wpmi' );
										$( '.wpmi-list', newWmmi ).html( response.data[key] );
										$( '.wpmi-list', newWmmi ).attr( 'data-cached', 'true' );
									}
								}
							}

						} );
					}
				}

			}
		} );

		if ( ! hasWrongImages && false !== retryInstagram ) {
			clearInterval( retryInstagram );
		}
	}

	function startAfterFirstInteraction() {

		$( '[data-toggle="tooltip"]' ).tooltip( 'hide' );

		setInterval( function () {
			var scrollTop = theDocument.scrollTop();

			if ( saveScrollPosition ) {
				lastScrollPosition = scrollTop;
			}

			executeAfterLoad();

			if ( scrollTop > 5 ) {
				theBody.addClass( 'listar-page-has-scrolled' );
			} else {
				theBody.removeClass( 'listar-page-has-scrolled' );
			}

			if ( scrollTop > viewportHeight || scrollTop > 1200 ) {
				$( '.listar-back-to-top, .listar-toggle-fixed-quick-menu-wrapper' ).removeClass( 'listar-hidden-fixed-button' );
			} else {
				$( '.listar-back-to-top, .listar-toggle-fixed-quick-menu-wrapper, .listar-listing-header-menu-fixed' ).addClass( 'listar-hidden-fixed-button' );
			}

			if ( theBody.hasClass( 'listar-ajax-pagination' ) && theBody.hasClass( 'listar-ajax-infinite-scroll' ) ) {
				var loadMore = $( '.listar-main-block .listar-more-results, .site-main .listar-more-results' );

				if ( loadMore.length ) {
					if ( isInViewport( loadMore ) ) {
						loadMore.eq( 0 ).trigger( 'click' );
					}
				}
			}

			if ( isInViewport( $( '.listar-site-footer' ) ) && scrollTop > 130 ) {
				headMenu.addClass( 'listar-hide-main-menu' );
				theBody.addClass( 'listar-footer-is-visible' );
				$( '.listar-toggle-fixed-quick-menu-wrapper, .listar-listing-header-menu-fixed' ).addClass( 'listar-hidden-fixed-button' );
			} else {
				headMenu.removeClass( 'listar-hide-main-menu' );
				theBody.removeClass( 'listar-footer-is-visible' );
			}

			AOSRefresh();

			/* Initialize map (if not initiated yet) */
			leafletMapInit();
			checkFrontPageTopbar();
			fixSmashBalloonImages();
		}, 400 );
	}

	/* Map Functions **********************************************/

	function showMap() {
		if ( $( '#map' ).length ) {
			onMap = 1;

			if ( 0 === $( '.listar-widgetized-map-container' ).length ) {
				$( 'html, body, .listar-posts-column-list' ).stop().animate( { scrollTop : '0' }, 500 );
				theBody.addClass( 'listar-showing-map listar-hide-main-menu' );

				if ( ! theBody.hasClass( 'listar-map-and-page' ) ) {
					if ( ! isMobile() ) {
						theBody.addClass( 'listar-stop-scrolling' );
					}

					$( '.listar-grid' ).siblings( '.listar-more-results' ).css( { display : 'none' } );
				}

				$( '#page' ).css( { height: '100%' } );
				$( '.listar-map-button' ).stop().animate( { opacity : 0 } );
				$( '#map' ).removeClass( 'listar-map-hidden' );
				$( '.listar-map-listing' ).stop().animate( { height: $( window ).height() - headerTopbarDistance( true ) }, { duration : 1000 } );
				$( '.listar-current-page-info, .listar-header-search' ).addClass( 'listar-hide-page-info' );
			}

			if ( viewport().width > 767 ) {
				$( '.listar-map ~ .listar-aside-list' ).stop().animate( { right: 0 }, { duration : 400 } );
				listingMapResize( 1 );
			} else {
				$( '.listar-map ~ .listar-aside-list .listar-close-aside-listings' ).addClass( 'icon-location' ).removeClass( 'icon-cross2' );
				$( '.listar-map ~ .listar-aside-list' ).stop().animate( { right: '-290px' }, { duration : 400 } );
				listingMapResize();
			}

			setTimeout( function () {
				map.invalidateSize();
				fitMapBounds( map, bounds );
				mapFitBoundsFix();
			}, 800 );

			setTimeout( function () {
				$( '.listar-map-listing' ).removeClass( 'listar-map-hidden' );
				$( '.listar-page-header-with-map' ).css( { display : 'none' } );

				if ( $( '#secondary .listar-map ~ .listar-aside-list' ).length > 0 ) {
					$( '.listar-map ~ .listar-aside-list .listar-close-aside-listings' ).trigger( 'click' );
				}

			}, 1000 );

			setMapDefaultVisibility();
                        setInitialMapZoom( 1000 );
		}// End if().
	}

	function addMapMarkers() {
		var hasLatLng = false;
		var mapSidebarWasCreated = $( '.listar-aside-post-pic' ).length;

		if ( 'undefined' !== typeof listarMapMarkers ) {
			var markersCount = listarMapMarkers.length;

			for ( var m = 0; m < markersCount; m++ ) {
				var
					tempListingItem,
					categoryColor = '',
					categoryColorStyle = '',
					latLng,
					icon;

				listarMapMarkers[ m ].id = '_' + Math.random().toString( 36 ).substr( 2, 9 );
				listingItem[ listarMapMarkers[ m ].id ] = listarMapMarkers[ m ];

				tempListingItem = listingItem[ listarMapMarkers[ m ].id ];

				if ( 'undefined' !== typeof tempListingItem.categoryColor ) {
					categoryColor = 'rgb(' + tempListingItem.categoryColor + ')';
					categoryColorStyle = ' style="background-color:' + categoryColor + ';"';
				}

				if ( 'undefined' === typeof tempListingItem.icon || undefined === typeof tempListingItem.icon ) {
					icon = 'icon-map-marker';
				} else if ( 'undefined' === tempListingItem.icon || undefined === tempListingItem.icon || '' === tempListingItem.icon || ' ' === tempListingItem.icon ) {
					icon = 'icon-map-marker';
				} else {
					icon = tempListingItem.icon;
				}

				if ( undefined !== tempListingItem.lat && undefined !== tempListingItem.lng ) {

					hasLatLng = true;

					latLng = new L.LatLng( tempListingItem.lat, tempListingItem.lng );

					if ( - 1 !== icon.indexOf( '<svg' ) ) {
						divMarker = L.divIcon( {
							iconSize: new L.Point( 50, 50 ),
							html: '<div class="leaflet-marker-pin-border"></div><div class="leaflet-marker-pin"' + categoryColorStyle + '></div><i class=" ref_' + tempListingItem.id + '">' + icon + '</i>'
						} );
					} else {
						divMarker = L.divIcon( {
							iconSize: new L.Point( 50, 50 ),
							html: '<div class="leaflet-marker-pin-border"></div><div class="leaflet-marker-pin"' + categoryColorStyle + '></div><i class="' + icon + ' ref_' + tempListingItem.id + '"></i>'
						} );
					}

					markers[ tempListingItem.id ] = new L.marker( latLng, { icon: divMarker } );
					markersList.push( markers[ tempListingItem.id ] );
					clusteredMarkers.addLayer( markers[ tempListingItem.id ] );
					bounds[ m ] = [ tempListingItem.lat, tempListingItem.lng ];

					idArray.push( [
						tempListingItem.id,
						tempListingItem.lat,
						tempListingItem.lng,
						markers[ tempListingItem.id ]
					] );
				}// End if().

				if ( mapSidebarWasCreated && 0 ===1 ) {
					if ( $( '.listar-map ~ .listar-aside-list' ).length ) {
						//alert(85);
					}
				} else {
					if ( $( '.listar-map ~ .listar-aside-list' ).length ) {

						setTimeout( function () {
							$( '.listar-aside-list .listar-posts-column' ).addClass( 'listar-enable-mouse-events' );
						}, 6000 );

						$( '.listar-aside-post.listar-temp-div' ).each( function () {
							$( this ).prop( 'outerHTML' );
						} )

						/* Creat map sidebar with listings */
						$( '.listar-map ~ .listar-aside-list .listar-posts-column-list' ).append( '<div class="listar-aside-post listar-temp-div"></div>' );
						$( '.listar-aside-post.listar-temp-div' ).addClass( tempListingItem.id );

						if ( 'undefined' !== typeof tempListingItem.listingID ) {
							$( '.listar-aside-post.listar-temp-div' ).attr( 'id', 'listar-listing-map-' + tempListingItem.listingID );
							lastListingID = tempListingItem.listingID;
						}

						if ( 'undefined' !== typeof tempListingItem.link ) {
							$( '.listar-aside-post.listar-temp-div' ).append( '<a href="' + tempListingItem.link + '"></a>' );
						} else {
							$( '.listar-aside-post.listar-temp-div' ).append( '<a href="#"></a>' );
						}

						if ( - 1 !== icon.indexOf( '<svg' ) ) {
							$( '.listar-aside-post.listar-temp-div a' ).append( '<div class="listar-aside-post-icon">' + icon + '</div>' );
						} else {
							$( '.listar-aside-post.listar-temp-div a' ).append( '<div class="listar-aside-post-icon ' + icon + '"></div>' );
						}

						if ( 'undefined' !== typeof tempListingItem.categoryColor ) {
							$( '.listar-aside-post.listar-temp-div .listar-aside-post-icon' ).css( 'background-color', categoryColor );
						}

						if ( isMobile() ) {
							$( '.listar-aside-post.listar-temp-div a' ).append( '<div class="listar-show-map-popup"></div>' );
						}

						$( '.listar-aside-post.listar-temp-div a' ).append( '<div class="listar-single-listing-link"></div>' );

						if ( 'undefined' !== typeof tempListingItem.featText ) {
							$( '.listar-aside-post.listar-temp-div a' ).append( '<div class="listar-ribbon">' + tempListingItem.featText + '</div>' );
						}

						if ( 'undefined' !== typeof tempListingItem.rating ) {
							$( '.listar-aside-post.listar-temp-div a' ).append( '<div class="listar-listing-rating">' + tempListingItem.rating + '</div>' );
						}

						if ( 'undefined' !== typeof tempListingItem.trending ) {
							$( '.listar-aside-post.listar-temp-div' ).attr( 'data-has', 'trending' );
							$( '.listar-aside-post.listar-temp-div a' ).append( '<div class="listar-trending-icon fal fa-bolt"></div>' );
						}

						if ( 'undefined' !== typeof tempListingItem.claimed ) {
							$( '.listar-aside-post.listar-temp-div' ).attr( 'data-has', 'claim' );
							$( '.listar-aside-post.listar-temp-div a' ).append( '<div class="listar-claimed-icon"></div>' );
						}

						if ( 'undefined' === typeof tempListingItem.lat || 'undefined' === typeof tempListingItem.lng ) {
							$( '.listar-aside-post.listar-temp-div' ).attr( 'data-no-coordinates', 'no-coordinates' );
							$( '.listar-aside-post.listar-temp-div a' ).append( '<div class="listar-no-map-nav icon-map-marker-crossed"></div>' );

							if ( $( '.listar-aside-post.listar-temp-div .icon-map-marker' ).length ) {
								$( '.listar-aside-post.listar-temp-div .icon-map-marker' ).prop( 'outerHTML', '' );
							}
						}

						$( '.listar-aside-post.listar-temp-div a' )
							.append( '<div class="listar-aside-post-pic"></div>' )
							.append( '<div class="listar-aside-post-data"></div>' );

						if ( 'undefined' !== typeof tempListingItem.img ) {
							if ( -1 === tempListingItem.img.indexOf( '5BAEAAAAALAAAAAABAAEAAAICRAEAOw' ) ) {
								var listingImage = '<div id="listar-listing-image-' + tempListingItem.id + '"></div>';
								$( '.listar-aside-post.listar-temp-div .listar-aside-post-pic' ).append( listingImage );
								$( '#listar-listing-image-' + tempListingItem.id ).css( { 'background-image' : 'url(' + tempListingItem.img + ')' } );

								if ( 'undefined' !== typeof tempListingItem.logo ) {
									//alert( tempListingItem.img );
									//alert( tempListingItem.logo );
									if ( -1 === tempListingItem.logo.indexOf( '5BAEAAAAALAAAAAABAAEAAAICRAEAOw' ) ) {
										var listingLogo = '<div class="listar-listing-logo-wrapper"><div class="listar-listing-logo" id="listar-listing-logo-' + tempListingItem.id + '"></div></div>';
										$( '.listar-aside-post.listar-temp-div a' ).append( listingLogo );
										$( '#listar-listing-logo-' + tempListingItem.id ).css( { 'background-image' : 'url(' + tempListingItem.logo + ')' } );
									}
								}
							} else {
								$( '.listar-aside-post.listar-temp-div' ).attr( 'data-no-image', 'listar-no-image' );
							}
						} else {
							$( '.listar-aside-post.listar-temp-div' ).attr( 'data-no-image', 'listar-no-image' );
						}

						$( '.listar-aside-post.listar-temp-div .listar-aside-post-data' ).append( '<div class="listar-aside-post-title"></div>' );

						if ( 'undefined' !== typeof tempListingItem.title ) {
							$( '.listar-aside-post.listar-temp-div .listar-aside-post-title' ).append( tempListingItem.title );
						}

						if ( 'undefined' !== typeof tempListingItem.category ) {
							$( '.listar-aside-post.listar-temp-div .listar-aside-post-data' ).append( '<div class="listar-aside-post-category"></div>' );
							$( '.listar-aside-post.listar-temp-div .listar-aside-post-category' ).append( tempListingItem.category );
						}

						if ( 'undefined' !== typeof tempListingItem.region ) {
							$( '.listar-aside-post.listar-temp-div .listar-aside-post-data' ).append( '<div class="listar-aside-post-region"></div>' );
							$( '.listar-aside-post.listar-temp-div .listar-aside-post-region' ).append( tempListingItem.region );
						}

						$( '.listar-aside-post.listar-temp-div' ).removeClass( 'listar-temp-div' );

					}// End if().
				}

			}// End for().

		}// End if().

		if ( ! hasLatLng ) {
			if ( '' === listarLocalizeAndAjax.fallbackMapLocation ) {
				listarLocalizeAndAjax.fallbackMapLocation = 'Las Vegas';
			}

			setTimeout( function () {
				geocoder = L.esri.Geocoding.geocodeService();

				geocoder.geocode().text( listarLocalizeAndAjax.fallbackMapLocation ).run( function ( leafletGeocoderError, response ) {
					if ( leafletGeocoderError ) {
						return;
					}

					map.fitBounds( response.results[0].bounds );
				} );
			}, 1800 );
		}
	}

	function addAjaxMapMarkers() {
		addMapMarkers();
		listingMapResize( 0, '100%' );
		fitMapBounds( map, bounds );

		setTimeout( function () {
			map.invalidateSize();
		}, 1000 );

		map.addLayer( clusteredMarkers );

	}

	function setMapDefaultVisibility() {
		if ( $( '.listar-main-block.listar-listings' ).length > 0 ) {
			if ( theBody.hasClass( 'listar-map-and-page' ) ) {
				$( '.listar-main-block' ).css( { opacity : 1 } );
				$( '.listar-main-block, footer' ).css( { display : 'block' } );
			} else {
				$( '.listar-main-block' ).stop().animate( { opacity : 0 }, { duration : 500, complete : function () {
					$( '.listar-main-block, footer' ).css( { display : 'none' } );
				} } );
			}
		}
	}

	function listingMapResize( init, w ) {
		if ( $( '.listar-map ~ .listar-aside-list' ).length ) {
			var
				listRight = parseInt( $( '.listar-map ~ .listar-aside-list' ).css( 'right' ).replace( /[^-\d\.]/g, '' ), 10 ),
				ww = $( window ).width(),
				dif = 288; /* Map sidebar width */

			if ( 'undefined' !== typeof init ) {
				if ( 1 === init ) {
					w = ww - dif;
				} else {
					if ( 'undefined' === typeof w ) {
						if ( listRight < - 285 ) {
							w = ww;
						} else {
							w = ww - dif;
						}
					}
				}
			} else {
				if ( listRight < - 285 ) {
					w = ww;
				} else {
					w = ww - dif;
				}

			}

			if ( 'undefined' !== typeof listarMapMarkers && $( '#map' ).length ) {
				$( '#map' ).height( $( window ).height() - headerTopbarDistance( true ) ).width( w );
				$( '.listar-map ~ .listar-aside-list' ).css( { display : 'block' } );
			} else {
				$( '#map' ).height( $( window ).height() - headerTopbarDistance( true ) ).width( $( window ).width() );
			}

			$( '.listar-map ~ .listar-aside-list' ).height( '100%' ).width( 285 );

		}// End if().

	}

	function singleListingMapResize() {
		var mapHeight = 332;

		$( '.listar-listing-map #map' ).height( mapHeight ).width( $( '.listar-listing-map #map' ).parent().width() );
	}

	function centerLeafletMapOnMarker( map, marker ) {
		var latLngs = [ marker.getLatLng() ];
		var markerBounds = L.latLngBounds( latLngs );

		map.fitBounds( markerBounds );
	}

	function resetMap() {
		if ( 'undefined' !== typeof listarMapMarkers && $( '#map' ).length && true === mapStarted ) {
			if ( ! $( '.listar-map-listing.listar-map-hidden' ).length ) {
				$( '.listar-map-listing' ).stop().animate( { height: $( window ).height() - headerTopbarDistance( true ) }, { duration : 300 } );
			}

			setTimeout( function () {
				listingMapResize();
				singleListingMapResize();
			}, 300 );

			setTimeout( function () {
				fitMapBounds( map, bounds );
				mapFitBoundsFix();
			}, 500 );

			setTimeout( function () {
				if ( 0 === $( '#map' ).parents( '#secondary' ).length && 0 === $( '#map' ).parents( '.listar-footer-column' ).length > 0 ) {
					map.invalidateSize();
				}
			}, 1100 );
		}
	}

	function mapFitBoundsFix() {
		/*
		 * Leaflet tries to keep all markers and clusters visible
		 * on map, but sometimes they are positioned too next of laterals.
		 * Call zoomOut() (after fitBounds were defined) to fix it.
		 */
		setTimeout( function () {
			map.zoomOut();
		}, 600 );
	}

	function leafletMapInit() {
		if ( false === mapStarted ) {
			mapStarted = true;
			resetMap();
			listingMapResize( 1 );
			singleListingMapResize();

			if ( $( '.listar-map ~ .listar-aside-list' ).length ) {

				$( '.listar-map ~ .listar-aside-list' )
					.append( '<div class="listar-close-aside-listings icon-cross2"></div>' )
					.append( '<div class="listar-posts-column"></div>' );

				if ( ! $( '.listar-map ~ .listar-aside-list .listar-posts-column .listar-posts-column-list-wrapper' ).length ) {
					$( '.listar-map ~ .listar-aside-list .listar-posts-column' ).append( '<div class="listar-posts-column-list-wrapper"></div>' );
				}

				if ( ! $( '.listar-map ~ .listar-aside-list .listar-posts-column .listar-posts-column-list-wrapper .listar-posts-column-list' ).length ) {
					$( '.listar-map ~ .listar-aside-list .listar-posts-column-list-wrapper' ).append( '<div class="listar-posts-column-list"></div>' );
				}



				
				

				setTimeout( function () {
					

					if ( ! $( '.listar-map ~ .listar-aside-list .listar-posts-column .listar-posts-column-list-wrapper .listar-results-count' ).length ) {
						$( '.listar-map ~ .listar-aside-list .listar-posts-column-list' ).prepend( $( '.listar-results-container .listar-results-count' ).prop( 'outerHTML' ) );
					}
				}, 500 );

			}

			if ( 'undefined' !== typeof listarMapMarkers && $( '#map' ).length ) {
				var
					latlng  = new L.LatLng( lat, lng ),
					dragMap = true,
					tapMap  = true;

				$( '.listar-map-button-text' ).css( { display : 'inline-block' } ).stop().animate( { opacity : 1 }, { duration : 1000 } );

				clusteredMarkers = new L.MarkerClusterGroup( {
					showCoverageOnHover: false,
					maxClusterRadius : 30,
					iconCreateFunction: function ( cluster ) {

						/* Get the number of items in the cluster */
						var count = cluster.getChildCount();

						/* Figure out how many digits long the number is */
						var digits = ( count + '' ).length;

						/* Return a new L.DivIcon with our classes so we can style them with CSS. */
						return new L.divIcon( {
							html: '<div class="leaflet-cluster-content"><div class="leaflet-cluster-border"></div><div class="leaflet-cluster-counter">' + count + '</div></div>',
							className: 'leaflet-cluster digits-' + digits,
							iconSize: null
						} );
					}
				} );

				/* Always draw cluster's coverage ?

				var coverages = new L.LayerGroup();

				clusteredMarkers.on("animationend", function() {
					// Here getting clusters randomly, but you can decide which one you want to show coverage of.


					coverages.clearLayers();

					clusteredMarkers._featureGroup.eachLayer(function(layer) {
					  	if (layer instanceof L.MarkerCluster && layer.getChildCount() > 2) {
							//clusteredMarkers._showCoverage({ layer: layer });
							coverages.addLayer(L.polygon(layer.getConvexHull()));
						}

						coverages.addTo(map);
					});
				});

				*/

				if ( 'undefined' !== typeof ( listarMinMapZoomLevel ) ) {
					minimumZoom = listarMinMapZoomLevel;
				}

				if ( 'undefined' !== typeof ( listarMaxMapZoomLevel ) ) {
					maximumZoom = listarMaxMapZoomLevel;
				}

                                if ( 'undefined' !== typeof ( listarInitialArchiveMapZoomLevel ) ) {
                                        var tempZoom = parseInt( listarInitialArchiveMapZoomLevel, 10 );

                                        if ( 0 !== tempZoom ) {
                                                initialMapZoomArchive = tempZoom;
                                        }
                                }

                                if ( 'undefined' !== typeof ( listarInitialSingleMapZoomLevel ) ) {
                                        var tempZoom = parseInt( listarInitialSingleMapZoomLevel, 10 );

                                        if ( 0 !== tempZoom ) {
                                                initialMapZoomSingle = tempZoom;
                                        }
                                }

                                if ( theBody.hasClass( 'single-job_listing' ) ) {
                                        initialMapZoom = initialMapZoomSingle;
                                } else {
                                        initialMapZoom = initialMapZoomArchive;
                                }

                                if ( 0 !== initialMapZoom ) {
                                        hasCustomInitialMapZoom = true;
                                } else {
                                        initialMapZoom = 14;
                                }

				if ( viewport().width < 500 ) {
					minimumZoom = 1;
				}

				if ( isMobile() && 0 === $( 'header.listar-map-listing' ).length ) {
					dragMap = false;
					tapMap  = false;
				}

				osm = L.tileLayer( osmUrl, { minZoom: minimumZoom, maxZoom: maximumZoom, attribution: osmAttrib } );
				map = new L.Map( 'map', { center: latlng, zoom: initialMapZoom, dragging: dragMap, tap: tapMap, layers: [ osm ] } );

				map.setMaxZoom( maximumZoom );

				if ( isMobile() || $( '.single-job_listing .leaflet-map-pane, .widget_listar_listing_map .leaflet-map-pane' ).length > 0 ) {

					/* Do maps on mobiles, single listing pages and widgets need get focus to enable zoom in/out with mousewheel */
					map.scrollWheelZoom.disable();

					if ( true === dragMap ) {

						map.on( 'focus click', function () {
							map.scrollWheelZoom.enable();
						} );

						map.on( 'blur mouseout', function () {
							map.scrollWheelZoom.disable();
						} );
					}
				}

				addMapMarkers();

				if ( $( '.listar-map ~ .listar-aside-list' ).length ) {
					var
						mapSidebar,
						moreListingsButton,
						pagination;

					$( '#map' ).addClass( 'listar-map-hidden' );
					$( '.listar-widgetized-map-container #map' ).removeClass( 'listar-map-hidden' );

					$( '.leaflet-control-zoom' ).append( '<a class="leaflet-control-zoom-reset fa fa-redo" href="#" title="Reset Map" role="button" aria-label="Reset Map"></a>' );

					/* Append 'More Results' button to map sidebar, if Ajax Pagination is enabled */
					mapSidebar = $( '.listar-map ~ .listar-aside-list .listar-posts-column-list' );
					moreListingsButton = $( '.listar-ajax-pagination .listar-more-results.listar-load-listings, .widget_listar_listing_map .listar-more-results.listar-load-listings' );

					if ( mapSidebar.length && moreListingsButton.length ) {
						moreListingsButton = moreListingsButton.parent().prop( 'outerHTML' );
						mapSidebar.append( moreListingsButton );

						moreListingsButton = mapSidebar.find( '.listar-more-results' );

						moreListingsButton.addClass( 'listar-more-results-map' ).removeClass( 'hidden' );

						if ( moreListingsButton.parent().prop( 'outerHTML' ).indexOf( 'col-sm-12' ) ) {
							moreListingsButton.parent().removeClass( 'col-sm-12' ).addClass( 'listar-load-more-wrapper' );
						}

						moreListingsButton.parent().removeClass( 'hidden aos-init' ).removeAttr( 'data-aos' );
					}

					/* Append default pagination links to map sidebar, if Ajax Pagination is disabled */
					pagination = $( '.listar-no-ajax-pagination .listar-results-container' ).parents( '#primary' ).find( 'section .posts-navigation' );

					if ( mapSidebar.length && pagination.length ) {
						pagination = pagination.prop( 'outerHTML' );
						mapSidebar.append( pagination );

						mapSidebar.find( '.posts-navigation a' ).each( function () {
							var hash = $( this ).attr( 'href' ) + '#mapview';
							$( this ).attr( 'href', hash );
						} );
					}

					/* Append 'More Results' button to map sidebar, if map widget on front page */
					moreListingsButton = $( '.page-template-front-page .listar-more-results.listar-load-listings' );

					if ( mapSidebar.length && moreListingsButton.length && 0 === mapSidebar.find( '.listar-more-results' ).length ) {
						moreListingsButton = moreListingsButton.prop( 'outerHTML' );
						mapSidebar.append( moreListingsButton );
						mapSidebar.find( '.listar-more-results' ).addClass( 'listar-more-results-map' ).removeClass( 'hidden' );
					}

					listingMapResize( 0, '100%' );
				}// End if().

				fitMapBounds( map, bounds );

				setTimeout( function () {
					var map_zoom_menu_items = $( '.leaflet-touch .leaflet-bar a' );

					map.invalidateSize();

					map_zoom_menu_items.each( function () {
						var span = $( this ).find( 'span' );

						if ( ! span.length ) {
							$( this ).prop( 'innerHTML', '<span>' + $( this ).prop( 'innerHTML' ) + '</span>' );
						}
					} );

					/* Remove Leaflet attributtion, keep attribution only for Openstreet Map */
					if ( $( '.leaflet-control-attribution' ).length ) {
						$( '.leaflet-control-attribution' ).prop( 'innerHTML', $( '.leaflet-control-attribution a:last-child' ).prop( 'outerHTML' ) );
					}
				}, 1000 );

                                setInitialMapZoom();                                

				map.addLayer( clusteredMarkers );

				if ( theBody.hasClass( 'listar-map-view' ) || $( '.listar-widgetized-map-container' ).length > 0 ) {
					showMap();
				}

				hasBackgroundImages = true;

				$( '.listar-posts-column-list' ).scroll( function () {

					/* Move background image URL from 'data-background-image' attribute to 'background-image' style */
					if ( hasBackgroundImages ) {
						hasBackgroundImages = false;
						convertDataBackgroundImage();
					}
				} );

				$( '.listar-front-widget-wrapper .widget_listar_listing_map' ).each( function () {
					$( this ).parents( '.listar-front-widget-wrapper' ).addClass( 'listar-map-ready-to-launch' );

					if ( $( this ).find( '.listar-map-waves' ).length ) {
						$( this ).parents( '.listar-front-widget-wrapper' )
							.addClass( '.listar-map-with-waves' )
							.append( '<div class="listar-wave-top"></div>' )
							.append( '<div class="listar-wave-bottom"></div>' );
					}
				} );

			} else {

				$( '.widget_listar_listing_map' ).addClass( 'leaflet-show-map-fail' );

				if ( ! $( '.page-content.listar-not-found' ).length ) {
					$( '.listar-map-button' ).css( { display : 'none' } );
					$( '.listar-current-page-info' ).animate( { width: '100%' } );
				}
			}// End if().

			/* Map events *********************************/

			theBody.on( 'click', '.leaflet-control-zoom-reset', function ( e ) {
				e.preventDefault();
				e.stopPropagation();
				resetMap();
			} );

			$( '.listar-map-button' ).not( '.disabled' ).on( {
				'mouseenter' : function () {
					if ( ! onMap ) {
						leafletMapInit();
						$( '.listar-current-page-info, .listar-header-search' ).addClass( 'listar-hide-page-info' );
					}
				},
				'mouseleave' : function () {
					if ( ! onMap ) {
						$( '.listar-current-page-info, .listar-header-search' ).removeClass( 'listar-hide-page-info' );
					}
				},
				'click' : function () {
					leafletMapInit();
					showMap();

					$( '.listar-page-header' ).removeClass( 'listar-display-all-filters' );
				}
			} );

			theBody.on( 'click', '.listar-back-listing-button', function () {
				onMap = 0;

				isLoadMoreEqualizer = true;

				theBody.removeClass( 'listar-stop-scrolling' );
				theBody.removeClass( 'listar-showing-map listar-hide-main-menu' );
				$( '#page' ).css( { height: '' } );

				initOnScrollEffects( true );

				setTimeout( function () {
					$( '.listar-current-page-info, .listar-header-search' ).stop().removeClass( 'listar-hide-page-info' );
					checkGridFillerCard();
				}, 500 );

				$( '.listar-more-results' ).css( { display : 'inline-block' } );
				$( '.listar-page-header-with-map' ).css( { display : 'table' } );
				$( '.listar-page-header-with-map, .listar-map-button' ).stop().animate( { opacity : 1 } );
				$( '.listar-map-listing' ).stop().animate( { height: 164 }, { duration : 1000 } );

				listingMapResize( 0, '100%' );

				setTimeout( function () {
					map.invalidateSize();
				}, 800 );

				setTimeout( function () {
					$( '.listar-map-listing' ).addClass( 'listar-map-hidden' );
				}, 1000 );

				setTimeout( function () {
					heightEqualizer( '.listar-listing-card' );
				}, 500 );

				$( '#map' ).addClass( 'listar-map-hidden' );
				$( '.listar-map ~ .listar-aside-list' ).stop().animate( { right: - 350 }, { duration : 800 } );
				$( '.listar-main-block, footer' ).css( { display : 'block' } );
				$( '.listar-main-block' ).stop().animate( { opacity : 1 }, { duration : 2000 } );
				$( '.listar-map ~ .listar-aside-list .listar-close-aside-listings' ).addClass( 'icon-cross2' ).removeClass( 'icon-location' );

			} );

			theBody.on( 'click', '.listar-map ~ .listar-aside-list .listar-close-aside-listings', function () {
				var list = $( this ).parent();
				var listRight = list.css( 'right' );

				if ( '0px' === listRight ) {
					$( this ).removeClass( 'icon-cross2' ).addClass( 'icon-location' );
					listingMapResize( 0, '100%' );

					setTimeout( function () {
						map.invalidateSize();
					}, 1000 );

					list.stop().animate( { right: - 290 }, { duration : 800 } );

				} else {
					$( this ).addClass( 'icon-cross2' ).removeClass( 'icon-location' );
					list.stop().animate( { right: 0 }, { duration : 800 } );

					setTimeout( function () {
						listingMapResize( 1 );
					}, 1000 );

					setTimeout( function () {
						map.invalidateSize();
					}, 1500 );
				}

				if ( '0px' === listRight && viewport().width < 400 ) {
					$( '.leaflet-control-container' ).css( { display : 'block' } );
				} else if ( viewport().width < 400 ) {
					$( '.leaflet-control-container' ).css( { display : 'none' } );
				} else {
					$( '.leaflet-control-container' ).css( { display : 'block' } );
				}
			} );

			theBody.on( 'click', '#map', function ( e ) {
				if ( $( e.target ).hasClass( 'leaflet-pane' ) || $( e.target ).hasClass( 'leaflet-container' ) && 0 === dragging ) {
					$( '.leaflet-div-icon' ).removeClass( 'selected leaflet-popup-recently-closed' );
					$( '.leaflet-popup' ).stop().animate( { marginBottom: '0px' }, { duration : 300 } );
				}
			} );

			preventDoubleClick = 0;

			theBody.on( 'mouseenter click', '.listar-map ~ .listar-aside-list .listar-aside-post a .listar-show-map-popup', function ( e ) {
				e.preventDefault();
				e.stopPropagation();

				if ( ! preventDoubleClick ) {
					var
						sidebarListingElem = $( this ).parent().parent(),
						elementToClick,
						id;

					preventDoubleClick = 1;

					if ( sidebarListingElem.hasClass( 'listar-aside-post' ) ) {
						id = sidebarListingElem.attr( 'class' ).replace( 'listar-aside-post ', '' );

						if ( ! $( '#' + id ).hasClass( 'selected' ) ) {
							var idsCount = idArray.length;

							for ( var i = 0; i < idsCount; i++ ) {
								if ( idArray[ i ][0] === id ) {
									centerLeafletMapOnMarker( map, idArray[ i ][3] );
									$( '#map' ).find( '.ref_' + id ).parent().attr( 'id', id );
									break;
								}
							}

							$( 'i.ref_' + id ).each( function () {
								elementToClick = $( this );

								if ( viewport().width < 600 ) {
									$( '.listar-close-aside-listings.icon-cross2' ).trigger( 'click' );
								}
							} );

							setTimeout( function () {
								elementToClick.trigger( 'click' );
							}, 1050 );

						}

						setTimeout( function () {
							$( '.leaflet-div-icon' ).removeClass( 'selected' );
							$( '#' + id ).addClass( 'selected' );
							preventDoubleClick = 0;
						}, 1250 );
					}
				}// End if().
			} );

			var hoverTest;

			theBody.on( 'mouseenter', '.listar-map ~ .listar-aside-list .listar-aside-post a .listar-aside-post-pic, .listar-map ~ .listar-aside-list .listar-aside-post a .listar-listing-rating, .listar-map ~ .listar-aside-list .listar-aside-post a .listar-aside-post-data', function ( e ) {
				var
					elemmen = $( this ),
					parentElement = $( e.target ).parent(),
					id;

				e.preventDefault();
				e.stopPropagation();

				// Cancel/Repeats mouseenter to display the listing popup on map.

				setTimeout( function () {
					elemmen.parents( '.listar-aside-post' ).each( function () {
						//alert( $( '.leaflet-marker-icon[id="' + id + '"]' ).length );
						if ( $( '.leaflet-marker-icon[id="' + id + '"]' ).length ) {

							clearInterval( hoverTest );

							hoverTest = setInterval( function () {

								//alert( ! $( '.leaflet-popup-content' ).length );
								if ( ! $( '.leaflet-marker-icon.selected' ).length || ! $( '.leaflet-popup-content' ).length ) {

									$( '.leaflet-marker-icon[id="' + id + '"]' ).each( function () {
										$( '.leaflet-marker-icon[id="' + id + '"]' ).removeClass( 'selected' );
										$( '.leaflet-marker-icon[id="' + id + '"]' )[0].click();
										//$( this ).find( '*' ).trigger( 'mouseleave' );
										//$( this ).find( '.listar-aside-post-data' ).trigger( 'mouseenter' );

									} );
								} else {

									if ( ! $( '.leaflet-pane.leaflet-tile-pane .leaflet-layer .leaflet-tile-container' ).length ) {
										isRestartingMap = false;
										restartMapPosition( id );

									} else {
										clearInterval( hoverTest );
									}
								}

							}, 1000 );
						}
					} );

				}, 1500 );

				if ( ! parentElement.parent()[0].hasAttribute( 'data-no-coordinates' ) && ! parentElement.parent().parent()[0].hasAttribute( 'data-no-coordinates' ) && ! parentElement.parent().parent().parent()[0].hasAttribute( 'data-no-coordinates' ) ) {
					id = $( this ).parents( '.listar-aside-post' ).attr( 'class' ).replace( 'listar-aside-post ', '' );

					if ( parentElement.hasClass( 'listar-aside-post' ) ) {
						id = parentElement.attr( 'class' ).replace( 'listar-aside-post ', '' );

						if ( ! $( '#' + id ).hasClass( 'selected' ) ) {
							var idsCount = idArray.length;

							for ( var i = 0; i < idsCount; i++ ) {
								if ( idArray[ i ][0] === id ) {
									centerLeafletMapOnMarker( map, idArray[ i ][3] );
									$( '#map' ).find( '.ref_' + id ).parent().attr( 'id', id );
									break;
								}
							}

							$( '#' + id + ' .leaflet-marker-pin-border' ).trigger( 'click' );
						}

						setTimeout( function () {
							$( '.leaflet-div-icon' ).removeClass( 'selected' );
							$( '#' + id ).addClass( 'selected' );
						}, 15 );
					} else if ( parentElement.parent().hasClass( 'listar-aside-post' ) ) {
						id = parentElement.parent().attr( 'class' ).replace( 'listar-aside-post ', '' );

						if ( ! $( '#' + id ).hasClass( 'selected' ) ) {
							var idsCount2 = idArray.length;

							for ( var n = 0; n < idsCount2; n++ ) {
								if ( idArray[ n ][0] === id ) {
									centerLeafletMapOnMarker( map, idArray[ n ][3] );
									$( '#map' ).find( '.ref_' + id ).parent().attr( 'id', id );
									break;
								}
							}

							$( '#' + id + ' .leaflet-marker-pin-border' ).trigger( 'click' );
						}

						setTimeout( function () {
							$( '.leaflet-div-icon' ).removeClass( 'selected' );
							$( '#' + id ).addClass( 'selected' );
						}, 15 );

					} else if ( parentElement.parent().parent().hasClass( 'listar-aside-post' ) ) {
						id = parentElement.parent().parent().attr( 'class' ).replace( 'listar-aside-post ', '' );

						if ( ! $( '#' + id ).hasClass( 'selected' ) ) {
							var idsCount3 = idArray.length;
							var currentMapZoom = 0;

							for ( var c = 0; c < idsCount3; c++ ) {
								if ( undefined !== idArray[ c ] && 'undefined' !== idArray[ c ] ) {
									if ( idArray[ c ][0] === id ) {
										centerLeafletMapOnMarker( map, idArray[ c ][3] );
										$( '#map' ).find( '.ref_' + id ).parent().attr( 'id', id );
										break;
									}
								}
							}

							currentMapZoom = map.getZoom();

							if ( 'undefined' !== typeof idArray[ c ] ) {
								if ( undefined !== idArray[ c ] && 'undefined' !== idArray[ c ] ) {
									if ( ! map.hasLayer( idArray[ c ][3] ) ) {
										map.setMaxZoom( currentMapZoom + 1 );

										setTimeout( function () {
											$( '#map' ).find( '.ref_' + id ).parent().attr( 'id', id );
											currentMapZoom = map.getZoom();
											map.setZoom( currentMapZoom + 1 );

											if ( 'undefined' !== typeof idArray[ c ] ) {
												if ( ! map.hasLayer( idArray[ c ][3] ) ) {
													map.setMaxZoom( currentMapZoom + 1 );
													map.setZoom( currentMapZoom + 1 );

													setTimeout( function () {
														$( '#map' ).find( '.ref_' + id ).parent().attr( 'id', id );
														$( '#' + id + ' .leaflet-marker-pin-border' ).trigger( 'click' );
													}, 200 );
												} else {
													if ( $( '#' + id + ' .leaflet-marker-pin-border' ).length ) {
														$( '#' + id + ' .leaflet-marker-pin-border' ).trigger( 'click' );
													}
												}
											} else {
												if ( $( '#' + id + ' .leaflet-marker-pin-border' ).length ) {
													$( '#' + id + ' .leaflet-marker-pin-border' ).trigger( 'click' );
												}
											}
										}, 200 );
									} else {
										$( '#' + id + ' .leaflet-marker-pin-border' ).trigger( 'click' );
									}
								}
							}
						}

						setTimeout( function () {
							$( '.leaflet-div-icon' ).removeClass( 'selected' );
							$( '#' + id ).addClass( 'selected' );
						}, 15 );
					}// End if().

					if ( 'undefined' !== typeof id ) {
						setTimeout( function () {
							restartMapPosition( id );
						}, 2000 );
					}


				}// End if().
			} );

			theBody.on( 'click', '.listar-map ~ .listar-aside-list .listar-aside-post .listar-map-icon', function ( e ) {
				var
					mapIconParent = $( e.target ).parent().parent(),
					id;

				if ( mapIconParent.hasClass( 'listar-aside-post' ) ) {
					id = mapIconParent.attr( 'class' ).replace( 'listar-aside-post ', '' );

					if ( ! $( '#' + id ).hasClass( 'selected' ) ) {
						$( '#' + id + ' .leaflet-marker-pin-border' ).trigger( 'click' );
					}
				} else if ( mapIconParent.parent().hasClass( 'listar-aside-post' ) ) {
					id = mapIconParent.parent().attr( 'class' ).replace( 'listar-aside-post ', '' );

					if ( ! $( '#' + id ).hasClass( 'selected' ) ) {
						$( '#' + id + ' .leaflet-marker-pin-border' ).trigger( 'click' );
					}
				} else if ( mapIconParent.parent().parent().hasClass( 'listar-aside-post' ) ) {
					id = mapIconParent.parent().parent().attr( 'class' ).replace( 'listar-aside-post ', '' );

					if ( ! $( '#' + id ).hasClass( 'selected' ) ) {
						$( '#' + id + ' .leaflet-marker-pin-border' ).trigger( 'click' );
					}
				}
			} );

			theBody.on( 'mouseenter', '.listar-map ~ .listar-aside-list .listar-aside-post[data-no-coordinates]', function ( e ) {
				var closeMarkerPopup = $( '.leaflet-div-icon.selected' );

				if ( closeMarkerPopup.length ) {
					closeMarkerPopup.trigger( 'click' );
				}
			} );

			theBody.on( 'click', '.leaflet-popup-listing-link', function ( e ) {
				if ( '#' === $( this ).attr( 'data-link' ) ) {
					e.preventDefault();
					e.stopPropagation();
				} else {
					window.location.href = $( this ).attr( 'data-link' );
				}
			} );

			theBody.off( 'click', '.leaflet-div-icon' );

			theBody.on( 'click', '.leaflet-div-icon', function () {
				var
					id,
					innerContent,
					thisMarker = this,
					markerPinWrapper,
					categoryColor,
					isSingleListingMap = theBody.hasClass( 'single-job_listing' ),
					html;

				if ( ! isSingleListingMap ) {

					innerContent = $( thisMarker ).find( '.leaflet-marker-pin-border' );
					id = $( thisMarker ).find( 'i' ).attr( 'class' ).replace( 'ref_', '' );
					categoryColor = $( thisMarker ).find( '.leaflet-marker-pin' ).css( 'background-color' );

					if ( id.indexOf( ' ' ) >= 0 ) {
						id = id.split( ' ' );
						id = id[ id.length - 1 ];
					}

					markerPinWrapper = innerContent.parent();
					markerPinWrapper.attr( 'id', id );

					if ( 'undefined' !== typeof listingItem[ id ].link ) {
						if ( 'undefined' !== listingItem[ id ].link && undefined !== listingItem[ id ].link && '#' !== listingItem[ id ].link && '' !== listingItem[ id ].link && ' ' !== listingItem[ id ].link ) {
							html = '<div class="leaflet-popup-listing-link ' + id + '" data-link="' + listingItem[ id ].link + '">';
						} else {
							html = '<div class="leaflet-popup-listing-link leaflet-popup-no-hover ' + id + '" data-link="#">';
						}
					} else {
						html = '<div class="leaflet-popup-listing-link leaflet-popup-no-hover ' + id + '" data-link="#">';
					}

					popupToggling = 1;

					setTimeout( function () {
						if ( ! markerPinWrapper.hasClass( 'selected' ) && ! markerPinWrapper.hasClass( 'leaflet-popup-recently-closed' ) ) {
							$( '.leaflet-div-icon' ).removeClass( 'leaflet-popup-recently-closed' );
							$( '.leaflet-div-icon' ).not( thisMarker ).removeClass( 'selected' );
							$( '.leaflet-div-icon' ).removeClass( 'leaflet-high-z-index' ).css( { zIndex : 11999 } );
							markerPinWrapper.addClass( 'selected' ).css( { backgroundColor : categoryColor } ).removeClass( 'leaflet-high-z-index' ).css( { zIndex : 211999 } );

							popupToggling = 0;

							if ( 'undefined' !== typeof listingItem[ id ] ) {
								if ( 'undefined' !== typeof listingItem[ id ] ) {
									if ( 'undefined' !== typeof listingItem[ id ].rating ) {
										html += '<div class="listar-popup-rating">' + listingItem[ id ].rating + '</div>';
									}
								}

								if ( 'undefined' !== typeof listingItem[ id ].img && 'undefined' !== typeof listingItem[ id ].logo ) {
									if ( -1 === listingItem[ id ].logo.indexOf( '5BAEAAAAALAAAAAABAAEAAAICRAEAOw' ) ) {
										html += '<div class="listar-listing-logo-wrapper"><div class="listar-listing-logo" data-background-image="' + listingItem[ id ].logo + '"></div></div>';
									}
								}

								if ( 'string' !== typeof listingItem[ id ].img ) {
									if ( -1 === listingItem[ id ].img.indexOf( '5BAEAAAAALAAAAAABAAEAAAICRAEAOw' ) ) {
										html += '<div class="leaflet-popup-image" data-background-image="' + listingItem[ id ].img + '">';
									} else {
										html += '<div class="leaflet-popup-image">';
									}
								} else {
									html += '<div class="leaflet-popup-image">';
								}

								/* If listing has image, display category name on the footer of thumbnail */
								if ( 'undefined' !== typeof listingItem[ id ].category && 'undefined' !== typeof listingItem[ id ].img ) {
									if ( -1 === listingItem[ id ].img.indexOf( '5BAEAAAAALAAAAAABAAEAAAICRAEAOw' ) ) {
										html += '<div class="leaflet-pop-category">' + listingItem[ id ].category + '</div>';
									}
								}

								if ( 'undefined' !== typeof listingItem[ id ].featText ) {
									html += '<div class="listar-ribbon">' + listingItem[ id ].featText + '</div>';
								}

								html += '</div>';

								if ( 'undefined' !== typeof listingItem[ id ].title ) {
									html += '<div class="leaflet-pop-title">' + listingItem[ id ].title + '</div>';
								}

								var listingCategoryWithAddress = '';

								/* If listing hasn't image, display category name inside 'leaflet-pop-address' div */
								if ( 'undefined' !== typeof listingItem[ id ].category && 'string' === typeof listingItem[ id ].img ) {
									if ( listingItem[ id ].img.indexOf( '5BAEAAAAALAAAAAABAAEAAAICRAEAOw' ) >= 0 ) {
										listingCategoryWithAddress += '<span>' + listingItem[ id ].category + '</span>';
									}
								}

								if ( 'undefined' !== typeof listingItem[ id ].address ) {
									html += '<div class="leaflet-pop-address">' + listingCategoryWithAddress + '<span>' + listingItem[ id ].address + '</span></div>';
								}

								html += '</div>';
								markers[ id ].bindPopup( html );
								markers[ id ].openPopup();

								if ( 'string' === typeof listingItem[ id ].img ) {
									if ( -1 === listingItem[ id ].img.indexOf( '5BAEAAAAALAAAAAABAAEAAAICRAEAOw' ) ) {
										$( '.leaflet-popup-image' ).css( 'background-image', 'url(' + listingItem[ id ].img + ')' );
										$( '.leaflet-popup-image' ).parent().removeClass( 'leaflet-no-popup-image' );
									} else {
										$( '.leaflet-popup-image' ).parent().addClass( 'leaflet-no-popup-image' );
									}
								} else {
									$( '.leaflet-popup-image' ).parent().addClass( 'leaflet-no-popup-image' );
								}
							}
						} else {
							popupToggling = 0;

							$( '.leaflet-div-icon' ).removeClass( 'selected leaflet-popup-recently-closed' );
							$( '.leaflet-popup' ).stop().animate( { marginBottom: '0px' }, { duration : 300 } );

							if ( 'undefined' !== typeof markers[ id ] ) {
								markers[ id ].closePopup();
							}
							
						}// End if().
					}, 3 );

					/* Force selected map markers to open the leaflet marker popup, if not opened yet */
					setTimeout( function () {
						var
							currentMapMarkerSelectedID = id,
							currentMapMarkerSelected = $( '#' + currentMapMarkerSelectedID + '.selected' ),
							leafletPopup = $( '.leaflet-popup' );

						if ( currentMapMarkerSelected.length && 0 === leafletPopup.length ) {
							currentMapMarkerSelected.removeClass( 'selected' );
							currentMapMarkerSelected.trigger( 'click' );
						}

						if ( leafletPopup.length && 0 === currentMapMarkerSelected.length ) {
							$( '#' + currentMapMarkerSelectedID ).addClass( 'selected' );
						}

						if ( leafletPopup.length ) {
							leafletPopup.css( { marginBottom : '32px' } );
						}

					}, 350 );
				}// End if().
			} );

			theBody.on( 'click', '.leaflet-div-icon', function ( e ) {
				if ( ! e.isTrigger ) {

					/* Not a programmatic click */
					var thisElement = $( this );

					if ( $( '.leaflet-popup' ).length ) {
						if ( '1' === $( '.leaflet-popup' ).css( 'opacity' ) ) {
							thisElement.addClass( 'leaflet-popup-recently-closed' );
						}
					}
				}
			} );

			dragging = 0;

			if ( 'undefined' !== typeof listarMapMarkers && $( '#map' ).length ) {
				map.on( 'movestart', function () {
					dragging = 1;
				} );

				map.on( 'moveend', function () {
					setTimeout( function () {
						dragging = 0;
					}, 10 );
				} );

				map.on( 'popupopen', function ( e ) {

					/* Find the pixel location on the map where the popup anchor is */
					var px = map.project( e.popup._latlng );

					/* Find the height of the popup container, divide by 2, subtract from the Y axis of marker location */
					px.y -= e.popup._container.clientHeight / 2;

					/* Pan to new center */
					map.panTo( map.unproject( px ), { animate: true } );

					$( '.leaflet-popup' ).css( { marginBottom: '0px' } ).stop().animate( { marginBottom: '32px' }, { duration : 100 } );
				} );

				map.on( 'popupclose', function () {
					if ( ! popupToggling ) {
						$( '.leaflet-div-icon' ).each( function () {
							if ( $( this ).hasClass( 'selected' ) ) {
								$( this ).removeClass( 'selected' ).addClass( 'leaflet-popup-recently-closed' );
							}
						} );

						$( '.leaflet-popup' ).stop().animate( { marginBottom: '0px' }, { duration : 300 } );
					}

					setTimeout( function () {
						$( '.leaflet-div-icon' ).removeClass( 'leaflet-popup-recently-closed' );
					}, 16 );
				} );
			}// End if().
		}// End if().
	}

	function executeCurrentHash() {

		setTimeout( function () {

			/**
			 * Do programmatic navigation based on URL hashs
			 * Detects if the user just posted a review and scroll programatically to show it
			 * Sets initial listing view
			 * Also, detect the 'read more' tag
			 */
			if ( window.location.hash ) {
				var h = window.location.hash.replace( '#', '' );

				var hasLinkAnchor = false;

				if ( '' !== h ) {
					for ( var hashCounter = 0; hashCounter < specialHashes.length; hashCounter++ ) {
						if ( h.indexOf( specialHashes[ hashCounter ] ) >= 0 ) {
							hasLinkAnchor = true;
						}
					}

					if ( ! hasLinkAnchor ) {
						setTimeout( function () {
							var hashAnchor = $( '#primary' ).find( '#' + h );

							/* Fix hash/anchor scroll */
							if ( hashAnchor.length > 0 ) {
								htmlAndBody.stop().animate( {
									scrollTop : hashAnchor.offset().top - ( 110 + headerTopbarDistance( true ) )
								}, 600 );
							}
						}, 10 );
					}

					if ( h.indexOf( 'do-login' ) >= 0 ) {
						convertDataBackgroundImage();

						setTimeout( function () {
							$( '.listar-user-not-logged .listar-user-login' ).eq( 0 ).trigger( 'click' );
						}, 2500 );
					}

					if ( h.indexOf( 'comment-' ) >= 0 || h.indexOf( 'comments' ) >= 0 ) {
						setTimeout( function () {
							var secondColClasses = 'col-xs-12 col-md-8 listar-review-second-col listar-single-listing-has-reviews';

							$( '.listar-review-second-col.listar-single-listing-without-reviews' ).each( function () {
								$( this ).addClass( 'hidden' );
							} );

							$( '.listar-review-second-col.listar-single-listing-without-reviews + div.hidden' ).each( function () {
								$( this ).attr( 'class', secondColClasses );
							} );

							/* Scroll to blog comments, if available */
							if ( $( '.listar-comments-container' ).length > 0 ) {
								htmlAndBody.stop().animate( {
									scrollTop : $( '.listar-comments-container' ).offset().top - 30
								}, 600 );
							}

							/* Scroll to listing reviews, if available */
							if ( $( '#listar-listing-review' ).length > 0 ) {
								htmlAndBody.stop().animate( {
									scrollTop : $( '#listar-listing-review' ).offset().top - 30
								}, 600 );
							}
						}, 10 );
					}

					/* Read More tag */
					if ( h.indexOf( 'more-' ) >= 0 ) {
						setTimeout( function () {

							/* Scroll to 'more' tag, if available */
							var moreTag = $( 'span[id^=more-' );

							if ( moreTag.length > 0 ) {
								htmlAndBody.stop().animate( {
									scrollTop : moreTag.offset().top - 80
								}, 600 );
							}
						}, 10 );
					}

					/* Set map view? */
					if ( h.indexOf( 'mapview' ) >= 0 ) {
						setTimeout( function () {
							$( '.listar-map-button' ).trigger( 'click' );
						}, 2500 );
					}

					/* Read More tag */
					if ( h.indexOf( 'post' ) >= 0 ) {
						var tempNewURL = currentURL.split( '?near' ) ;
						window.location.hash = '';
						history.pushState({}, null, tempNewURL[0] );
					}
				}
			}// End if().

			/*
			 * If current URL has '?write-review':
			 * User was logged out and clicked on 'Write a Review' button,
			 * automatically open the review popup right after login.
			 */

			if ( ! launchedReviewPopup ) {
				launchedReviewPopup = true;

				if ( currentURL.indexOf( '?write-review' ) >= 0 && $( '.listar-write-review a' ).length > 0 ) {
					convertDataBackgroundImage();

					setTimeout( function () {
						$( '.listar-write-review a' ).eq( 0 ).trigger( 'click' );
					}, 3000 );
				}
			}
		}, 500 );
	}

        function resizeHeroVideosExecute() {
                if ( viewport().width >= parseInt( listarLocalizeAndAjax.minimumScreeWidthHeroVideo, 10 ) ) {                        
                        var heroWidth = $( '.listar-hero-video' ).width();
                        var heroHeight = $( '.listar-hero-video' ).height();
                        var videoHeight = heroHeight;
                        var videoWidth = videoHeight * 16 / 9;

                        if ( heroWidth > heroHeight && videoWidth < heroWidth ) {
                                videoWidth = heroWidth;
                                videoHeight = videoWidth * 9 / 16;
                        }

                        $( '.listar-hero-video video, .listar-hero-video iframe, .listar-hero-video .mejs__inner, .listar-hero-video .mejs-inner, .listar-hero-video .mejs__container, .listar-hero-video .mejs-container' ).css( { width : videoWidth, height : videoHeight, maxWidth : '99999px' } );
                        $( '.listar-hero-video video, .listar-hero-video iframe, .listar-hero-video .mejs__inner, .listar-hero-video .mejs-inner, .listar-hero-video .mejs__container, .listar-hero-video .mejs-container' ).css( { height : videoHeight + 20 } );

                        preventEvenCallStack11 = false;
                }
        }

	function resizeHeroVideos( delay = 0 ) {
                if ( viewport().width >= parseInt( listarLocalizeAndAjax.minimumScreeWidthHeroVideo, 10 ) ) {
                        if ( ! preventEvenCallStack11 ) {
                                preventEvenCallStack11 = true;
                                
                                setTimeout( function () {
                                        resizeHeroVideosExecute();
                                        
                                        setInterval( function () {
                                                resizeHeroVideosExecute()
                                        }, 500 );
                                }, delay );
                        }
                }
	}

	/* Execute only when current browser tab/window be active *****/

	function executeOnLoadAndVisible() {
		if ( hasExecutedOnLoadAndVisible ) {
			return false;
		}

		hasExecutedOnLoadAndVisible = true;

		verifySelect2SubtreePlaceholder();

		executeCurrentHash();
	}
	
	$( function () {
		
		// Define global variables before proceed.

		theDocument = $( document );
		theBody = $( document.body );
		theHTML = theDocument.find( 'html' ).eq( 0 );
		htmlInner = theHTML.prop( 'innerHTML' );
		htmlAndBody = theHTML.add( theBody );
		headMenu = theBody.find( '#masthead' ).eq( 0 );
		nothing = theBody.find( '.listar-nothing' ).eq( 0 );
		dataMinimumClaimTextChars = theBody.find( '#listar_claim_sender_message' ).eq( 0 ).length ? parseInt( theBody.find( '#listar_claim_sender_message' ).eq( 0 ).attr( 'data-minimun-chars' ), 10 ) : 0;
		requiredClaimCharsField = theBody.find( '.listar-claim-required-chars' ).eq( 0 );
		multipleRegionsActive = theBody.hasClass( 'listar-multiple-regions-enabled' );
		urlProtocol = location.protocol.indexOf( 'https' ) >= 0 ? 'https' : 'http';
		siblingsOpacityEnabled = theBody.hasClass( 'listar-disable-sibling-hover-opacity' ) ? false : true;
		callToActionsBoxedSquared = theBody.find( '.entry-content .listar-2-cols-boxed-squared-design' );
		headerTransparentTopbar = theDocument.find( 'body.page-template-front-page.listar-frontpage-topbar-transparent' ).eq( 0 ).length > 0 ? true : false;
		listingGallery = theBody.find( '.listar-listing-gallery' ).eq( 0 );
		currentURL = window.location.href;
		isFrontPage = theDocument.find( 'body.page-template-front-page' ).eq( 0 ).length ? true : false;
		pageBGColor = theBody.find( '#content' ).eq( 0 );
		singleContent = theBody.find( '.listar-single-content > *' );
		singleheaderBackgroundWrapper = theBody.find( '.listar-post-content-header-background-wrapper' ).eq( 0 );
		listarFeaturifyElements = theBody.find( 'main article .listar-featurify' );
		frontPageCallToActionBadge = theBody.find( '.entry-content .listar-badge-mask' );
		animateElementsOnScroll = theBody.hasClass( 'listar_animate_elements_on_scroll' );
		pageBGColor = pageBGColor.length ? pageBGColor.css( 'background-color' ).replace( /\s/g, '' ) : 'rgb(255,255,255)';
		isClaimingListing = currentURL.indexOf( 'claim_listing=1' ) >= 0 && currentURL.indexOf( 'claim_listing_id' ) >= 0;

		if ( isClaimingListing && currentURL.indexOf( 'claim_package_id' ) >= 0 ) {
			theBody.find( '#primary' ).eq( 0 ).css( { opacity : 0, left : '-10000px' } );
		}
	} );
	
	function listarExecute() {
		
		/* Set Google Fonts Media - Pagespeed */
		$( 'link[id="listar-google-fonts-into-footer-css"]' ).each( function () {
			//$( this ).attr( 'media', 'all' );
		} );
		
		/* Execute Main JavaScript ************************************/

		hasGrid2 = 0;
		hasGrid3 = 0;

		/* Prepare interface ******************************************/

                if ( viewport().width >= parseInt( listarLocalizeAndAjax.minimumScreeWidthHeroVideo, 10 ) ) {
                        var mediaElements = document.querySelectorAll('.listar-hero-video video'), total = mediaElements.length;

                        for (var i = 0; i < total; i++) {
                                new MediaElementPlayer(mediaElements[i], {
                                        shimScriptAccess: 'always',
                                        autoplay: true,
                                        hideVideoControlsOnLoad: true,
                                        hideVideoControlsOnPause : true,
                                        controlsTimeoutDefault: 1,
                                        controlsTimeoutMouseEnter: 1,
                                        controlsTimeoutMouseLeave: 1,
                                        features : ['playpause'],
                                        muted: true,
                                        success: function(mediaElement, domObject) {
                                                var target = document.body.querySelectorAll('.listar-hero-video .player'), targetTotal = target.length;
                                                var startTime = $( mediaElements[i] ).attr( 'data-start-time' );
                                                var endTime = parseInt( $( mediaElements[i] ).attr( 'data-end-time' ), 10 );
                                                var endTimeCaptureAttempties = 0;
                                                var source = $( mediaElements[i] ).find( 'source' ).attr( 'src' );

                                                var notFile = -1 !== source.indexOf( 'youtube.' ) || -1 !== source.indexOf( 'vimeo.' );
                                                var displayDelay = notFile ? 50 : 50;


                                                for (var j = 0; j < targetTotal; j++) {
                                                        target[j].style.visibility = 'visible';
                                                }

                                                mediaElement.setCurrentTime( startTime );

                                                mediaElement.play();

                                                mediaElement.addEventListener('loadedmetadata', function (e) {
                                                        if ( 0 === endTime ) {
                                                                endTime = parseInt( mediaElement.duration, 10 );
                                                        }
                                                }, true);

                                                mediaElement.addEventListener('timeupdate', function (e) {
                                                        if ( 0 === endTime || 6000000 === endTime ) {
                                                                endTime = parseInt( mediaElement.duration, 10 );

                                                                if ( isNaN( endTime ) ) {
                                                                        endTime = 0;
                                                                }

                                                                if ( ( '' === endTime || 0 === endTime || 'undefined' === typeof endTime || startTime >= endTime ) ) {
                                                                        endTime = 6000000;
                                                                }
                                                        }

                                                        if ( mediaElement.currentTime >= endTime - 1 ) {
                                                                mediaElement.setCurrentTime( startTime );
                                                                mediaElement.play();
                                                        }
                                                }, true);

                                                mediaElement.addEventListener('ended', function (e) {
                                                        mediaElement.setCurrentTime( startTime );
                                                }, true);

                                                mediaElement.addEventListener('playing', function (e) {
                                                        setTimeout( function () {
                                                                resizeHeroVideos();

                                                                setTimeout( function () {
                                                                        $( '.listar-hero-video' ).addClass( 'listar-video-rendered' );
                                                                }, 50 );
                                                        }, displayDelay );
                                                }, true);


                                        }
                                });
                        }
                }

		$( '.wp-editor-wrap' ).each( function () {

			/* Reference: https://wordpress.stackexchange.com/a/120835 */
			setInterval( function () {
				if ( 'undefined' !== typeof tinyMCE && null !== tinyMCE ) {
					if ( 'undefined' !== typeof tinyMCE.activeEditor && null !== tinyMCE.activeEditor ) {
						if ( 'undefined' !== typeof tinyMCE.activeEditor.dom && null !== tinyMCE.activeEditor.dom ) {
							var tinyMCETemp = tinyMCE.activeEditor.dom;

							if ( 'undefined' !== typeof tinyMCETemp ) {
								tinyMCETemp.addStyle('iframe {width:100%;}');
							}
						}
					}
				}
			}, 2000 );
		} );

		/* User has the most recent version of Listar Addons, meaning it is compatible with current theme version? */
		if ( '' !== listarLocalizeAndAjax.listarAddonsVersion ) {
			if ( listarLocalizeAndAjax.listarThemeVersion !== listarLocalizeAndAjax.listarAddonsVersion ) {
				alert( listarLocalizeAndAjax.updateListarAddons );
			}
		}

		/* Detect UC Browser and Safari */

		if ( 'undefined' !== typeof navigator ) {
			if ( 'undefined' !== typeof navigator.userAgent && 'undefined' !== typeof navigator.platform ) {

				/* See: https://stackoverflow.com/a/31732310/7765298 */
				var isSafari = navigator.vendor && navigator.vendor.indexOf( 'Apple' ) > -1 &&
					navigator.userAgent &&
					-1 === navigator.userAgent.indexOf( 'CriOS' ) &&
					-1 === navigator.userAgent.indexOf( 'FxiOS' );

				if ( isSafari ) {
					theBody.addClass( 'listar-is-safari' );
				} else if ( navigator.userAgent.indexOf( 'UBrowser' ) >= 0 || navigator.userAgent.indexOf( 'UCBrowser' ) >= 0 ) {
					theBody.addClass( 'listar-is-uc-browser' );
				}
			}
		}

		/* Transfer WordPress <li> menu classes for the menu <a> tag */
		$( 'li[class*="menu-item-type-"] a' ).each( function () {
			var menuItem = $( this ).parent();

			if ( menuItem.attr( 'class' ).indexOf( 'fa fa-' ) >= 0 || menuItem.attr( 'class' ).indexOf( 'fal fa-' ) >= 0 || menuItem.attr( 'class' ).indexOf( 'icon-' ) >= 0 ) {
				$( this ).attr( 'class', menuItem.attr( 'class' ) );
				menuItem.attr( 'class', menuItem.attr( 'class' ).replace( /icon-/g, '' ).replace( /fa fa-/g, '' ).replace( /fal fa-/g, '' ) );
			}
		} );

		/* Return only characters for princing fields - 0 until 9 and dot (.) */
		$( 'input[class*="price-range"]' ).each( function () {
			sanitizePricingFields( $( this ) );
		} );

		/* Return only characters for princing fields - 0 until 9 and dot (.) */
		$( 'input[class*="price-range"]' ).each( function () {
			sanitizePricingFields( $( this ) );
		} );

		/* Display/hide custom excerpt field */
		toggleCheckboxDependantField( '#job_business_use_custom_excerpt', '.fieldset-job_business_custom_excerpt' );
		
		// Create "More Itens" button for listing products.
		var onlineStoreButton = $( '.listar-listing-header-online-store' );
		
		if ( onlineStoreButton.length ) {
			$( '.listar-listing-products-more' ).each( function () {
				$( this ).removeClass( 'hidden' );
				
				$( this ).find( 'a' ).each( function () {
					$( this ).attr( 'href', onlineStoreButton.attr( 'href' ) );
				} );
			} );
		}

		$( '.listar-user-packages .listar-listing-package' ).each( function () {
			$( this ).parents( '.listar-user-packages' ).removeClass( 'hidden' );
			$( this ).parents( '.listar-user-packages' ).prev( 'h2' ).removeClass( 'hidden' );
		} );
		
		// Expose duplicated packages, if yet available.
		$( '.listar-user-packages .listar-listing-package' ).each( function () {
			$( this ).parents( '.listar-user-packages' ).removeClass( 'hidden' );
			$( this ).parents( '.listar-user-packages' ).prev( 'h2' ).removeClass( 'hidden' );
		} );

		/*
		 * If a listing package (plan) be selected via widget, skip the package selection on pricings page;
		 */

		if ( window.location.hash ) {
			var packageHash = window.location.hash.replace( '#', '' );

			if ( packageHash.indexOf( 'skip-package-selection' ) >= 0 ) {
				window.location.hash = '';
				packageHash = packageHash.replace( 'skip-package-selection-', '' );

				if ( $( 'a[data-user-package="' + packageHash + '"]' ).length || $( 'a[data-package="' + packageHash + '"]' ).length ) {
					$( '.page-content' ).each( function () {
						$( this ).animate( { opacity : 0 } );
					} );

					setTimeout( function () {
						if ( $( 'a[data-user-package="' + packageHash + '"]' ).length ) {
							$( 'a[data-user-package="' + packageHash + '"]' ).eq( 0 ).each( function () {
								$( this )[0].click();
							} );
						} else {
							$( 'a[data-package="' + packageHash + '"]' ).eq( 0 ).each( function () {
								$( this )[0].click();
							} );
						}
					}, 10 );
				}
			}
		}

		/* Append ribbon design for product price on product page */
		$( '.single-product .summary.entry-summary .price, .listar-booking-popup .summary.entry-summary .price' ).each( function () {
			if ( 0 === $( this ).find( '*' ).length ) {
				$( this ).prop( 'innerHTML', '<span class="woocommerce-Price-amount amount listar-uppercase">' + $( this ).prop( 'innerHTML' ) + '</span>' );
			}			
			
			$( this ).find( '.woocommerce-Price-amount.amount' ).each( function () {
				if ( ! $( this ).parents( 'del' ).length ) {
					$( this ).addClass( 'listar-ribbon' );
				}

				if ( 0 === $( this ).find( '*' ).length ) {
					$( this ).parents( '.price' ).prop( 'outerHTML', '' );
				}
			} );
		} );
		
		$( '.listar-booking-slide' ).eq( 0 ).removeClass( 'hidden' ).addClass( 'current' );

		/*
		 * Move background image URL from 'data-background-image' attribute to 'background-image' style
		 * Only for currently visible elements
		 */

		checkFrontPageTopbar();

		/*xxxx*/
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

		
		/*xxxx*/
		
		
		
		
		
		
		
		
		
		

		

		termNameBigEffect();

		
		/*xxx*/
		
		
		
		
		
		
		
		
		
		

		$( '.listar-hero-section-title' ).each( function () {
			if ( $( this ).parents( '.listar-hero-header' ).find( '.listar-category-icon-wrapper' ).length > 0 ) {
				$( this ).parents( '.listar-hero-header' ).addClass( 'listar-has-hero-title' );
			}
		} );

		$( '.wc-item-meta li' ).each( function () {
			if ( $( this ).prop( 'innerHTML' ).indexOf( 'listar_' ) >= 0 ) {
				$( this ).css( { display : 'none' } );
			}
		} );

		$( '.listar-temp-chosen-region' ).each( function () {
			$( '.listar-chosen-region' ).val( $( this ).val() ).attr( 'value', $( this ).val() );
		} );



		if ( $( '.listar-search-filter-categories' ).length ) {
			var searchCategories = String( $( '.listar-search-filter-categories' ).val() );
			var searchCategoriesInput = String( $( '.listar-chosen-category' ).val() );

			if ( 'null' !== searchCategories && 'null' === searchCategoriesInput || '' === searchCategoriesInput ) {
				$( '.listar-chosen-category' ).val( searchCategories );
			}
		}

		$( '.listar-clean-search-input-button' ).each( function () {
			var clearSearchInputButton   = $( this );
			var clearSearchFiltersButton = clearSearchInputButton.parents( 'form' ).find( '.listar-clean-search-by-filters-button' );
			var searchInputField         = clearSearchInputButton.parents( 'form' ).find( '.listar-listing-search-input-field' );
			var searchByButton           = clearSearchInputButton.parents( 'form' ).find( '.listar-search-by-button' );
			var searchByOrder            = '';
			var exploreByType            = '';

			setInterval( function () {
				searchByOrder = searchByButton.parents( 'form' ).find( '[name="' + listarLocalizeAndAjax.listingSortTranslation + '"]' ).attr( 'value' );
				exploreByType = searchByButton.parents( 'form' ).find( '[name="' + listarLocalizeAndAjax.exploreByTranslation + '"]' ).attr( 'value' );

				if ( '' !== searchInputField.val() ) {
					clearSearchInputButton.css( { display : 'block' } );
				} else {
					clearSearchInputButton.css( { display : 'none' } );
				}

				if ( exploreByType !== listarLocalizeAndAjax.listarInitialExploreByOption || searchByOrder !== listarLocalizeAndAjax.listarInitialForcedSearchOrder ) {
					clearSearchFiltersButton.css( { display : 'block' } );
				} else {
					clearSearchFiltersButton.css( { display : 'none' } );
				}
			}, 500 );
		} );

		if ( listarLocalizeAndAjax.listarIsClaimingListing ) {
			if ( ! $( '.listar-listing-package' ).length && $( '#submit-job-form' ).length ) {
				$( '.listar-no-claim-packages' ).removeClass( 'hidden' );
				$( '.page-content' ).prop( 'innerHTML', '' );
			}
		}


		$( '.listar-search-by-button' ).each( function () {
			var newExploreBySlug = $( this ).attr( 'data-explore-by-type' );

			if ( 'shop_products' === newExploreBySlug ) {
				$( 'input[name="' + listarLocalizeAndAjax.searchTypeTranslation + '"]' ).val( newExploreBySlug );
				$( '.listar-all-regions-button' ).css( { display : 'none' } );
			} else if ( 'blog' === newExploreBySlug ) {
				$( 'input[name="' + listarLocalizeAndAjax.searchTypeTranslation + '"]' ).val( newExploreBySlug );
				$( '.listar-all-regions-button' ).css( { display : 'none' } );
			} else {
				$( 'input[name="' + listarLocalizeAndAjax.searchTypeTranslation + '"]' ).val( 'listing' );
				$( '.listar-all-regions-button' ).css( { display : '' } );
			}

			$( '.listar-search-by-options-wrapper a[data-explore-by-type="' + newExploreBySlug + '"]' ).each( function () {
				var placeholder = $( this ).attr( 'data-explore-by-placeholder' );
				$( '.listar-listing-search-input-field' ).attr( 'placeholder', placeholder );
			} );
		} );

		// Limit the number of images for gallery upload.
		if ( $( '.fieldset-gallery_images .wp-job-manager-file-upload' ).length ) {
			setInterval( function () {
				galleryLengthVerification();
			}, 500 );
		}


		/*xxx */
		
		
		
		
		
		
		
		
		
		

		/* Organize custom location fields fields */
		if ( 'string' === typeof listarLocalizeAndAjax.addressAdvanced ) {
			$( '.fieldset-job_location label' ).each( function () {
				$( this ).append( '<br><a href="#" class="listar-location-show-advanced">' + listarLocalizeAndAjax.addressAdvanced + '</a>' );
				$( this ).parent().after( '<div class="listar-custom-location-fields listar-boxed-fields-label-customizer hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner"></div></div></div>' );

				var
					customLocationField1 = $( '.fieldset-job_customlatitude' );

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
		}

		/* Append Business Hours fields */
		$( '.fieldset-job_business_hours_monday' ).each( function () {
			var hoursForm  = '';
			var realOpenCloseValues = [];
			var realValuesFields = $( 'input[id*="job_business_hours_"]' );

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
			$( this ).before( '<div class="listar-business-hours-fields hidden"></div>' );

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
				if ( $( '#job_business_use_hours' ).is( ':checked' ) ) {
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

		/*xxx */ 
		
		
		
		
		
		

		/* Prepare wrapper for social network fields */
		$( '.fieldset-company_facebook' ).each( function () {
			var socialNetwork1 = $( this );

			setTimeout( function () {
				socialNetwork1.before( '<div class="listar-business-social-network-fields hidden"><div class="listar-boxed-fields-wrapper"></div></div>' );

				var
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
					if ( $( '#company_use_social_networks' ).is( ':checked' ) ) {
						$( '.listar-business-social-network-fields' ).removeClass( 'hidden' );
					}
				}, 300 );
			}, 20 );
		} );

		/* Prepare wrapper for external links fields */
		$( '.fieldset-company_external_link_1' ).each( function () {
			var externalLink1  = $( this );

			setTimeout( function () {
				externalLink1.before( '<div class="listar-business-external-link-fields hidden"><div class="listar-boxed-fields-wrapper"></div></div>' );

				var
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
					if ( $( '#company_use_external_links' ).is( ':checked' ) ) {
						$( '.listar-business-external-link-fields' ).removeClass( 'hidden' );
					}
				}, 300 );
			}, 20 );
		} );
		
		
		
		
		
		
		

		/* Prepare wrapper for rich media label customizer */
		$( '.fieldset-company_business_rich_media_label' ).each( function () {
			var labelSelector = $( this );

			setTimeout( function () {
				var customLabelField = $( '.fieldset-company_business_rich_media_custom_label' );
				var appendGalleryField = $( '.fieldset-company_business_rich_media_append_gallery' );

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
					labelSelector = $( '.fieldset-company_business_rich_media_label' );

					$( '.listar-business-rich-media-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-inner' ).append( customLabelFieldContent );

					if ( 'custom' === labelSelector.find( 'select' ).val() ) {
						labelSelector.siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
					} else {
						labelSelector.siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
					}
					
					// Append listing gallery to the end.

					$( '.listar-business-rich-media-fields .listar-boxed-fields-inner-2' ).append( appendGalleryContent );
					
					// Create fieldset dynamic fieldset inputs.
					
					var nFields = 0;
					var forceShowFields = false;
					
					var fieldsJSON = $( '#company_business_rich_media_values' ).val();
					
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
						$( '#company_video' ).each( function () {
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
					
					if ( $( '#company_use_rich_media' ).is( ':checked' ) || forceShowFields ) {
						$( '#company_use_rich_media' ).prop( 'checked', true );
						$( '.listar-business-rich-media-fields' ).removeClass( 'hidden' );
					} else {
						$( '.listar-business-rich-media-fields' ).addClass( 'hidden' );
					}
					
					mediaLengthVerification();
					
				}, 100 );
			}, 20 );
		} );

		/* Prepare wrapper for Products label customizer */
		$( '.fieldset-job_business_products_label' ).each( function () {
			var labelSelector = $( this );

			setTimeout( function () {
				var customLabelField = $( '.fieldset-job_business_products_custom_label' );
				var productListField = $( '.fieldset-job_business_products_list' );

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
					labelSelector = $( '.fieldset-job_business_products_label' );

					$( '.listar-business-products-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-inner' ).append( customLabelFieldContent );
					$( '.listar-business-products-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).append( productListFieldContent );
					
					if ( $( '#job_business_use_products' ).is( ':checked' ) ) {
						$( '.listar-business-products-fields.listar-boxed-fields-label-customizer' ).removeClass( 'hidden' );
					}

					if ( 'custom' === labelSelector.find( 'select' ).val() ) {
						labelSelector.siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
					} else {
						labelSelector.siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
					}
				}, 100 );
			}, 20 );
		} );

		/* Prepare wrapper for menu/catalog label customizer */
		$( '.fieldset-job_business_catalog_label' ).each( function () {
			var labelSelector = $( this );

			setTimeout( function () {
				var customLabelField = $( '.fieldset-job_business_catalog_custom_label' );

				var
					selectorOutput = labelSelector.prop( 'outerHTML' ),
					customLabelFieldContent = customLabelField.prop( 'outerHTML' );

				labelSelector.before( '<div class="listar-business-catalog-fields listar-boxed-fields-label-customizer hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner hidden"></div></div></div>' );

				labelSelector.prop( 'outerHTML', '' );

				$( '.listar-business-catalog-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).prepend( selectorOutput );

				customLabelField.prop( 'outerHTML', '' );

				setTimeout( function () {
					labelSelector = $( '.fieldset-job_business_catalog_label' );

					$( '.listar-business-catalog-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-inner' ).append( customLabelFieldContent );

					if ( $( '#job_business_use_catalog' ).is( ':checked' ) ) {
						$( '.listar-business-catalog-fields.listar-boxed-fields-price-list' ).removeClass( 'hidden' );
						$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload' ).removeClass( 'hidden' );
						$( '.listar-business-catalog-fields.listar-boxed-fields-label-customizer' ).removeClass( 'hidden' );
					}

					if ( $( '#job_business_use_catalog_documents' ).is( ':checked' ) ) {
						$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-boxed-fields-inner' ).removeClass( 'hidden' );
					}

					if ( $( '#job_business_use_price_list' ).is( ':checked' ) ) {
						$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-inner' ).removeClass( 'hidden' );
					}

					if ( 'custom' === labelSelector.find( 'select' ).val() ) {
						labelSelector.siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
					} else {
						labelSelector.siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
					}
				}, 100 );
			}, 20 );
		} );

		/* Prepare wrapper for Appointments label customizer */
		$( '.fieldset-job_business_booking_label' ).each( function () {
			var labelSelector = $( this );

			setTimeout( function () {
				var customLabelField = $( '.fieldset-job_business_booking_custom_label' );
				var methodField      = $( '.fieldset-job_business_booking_method' );
				var embeddingField   = $( '.fieldset-job_business_bookings_third_party_service' );
				var selectedMethod   = $( '.fieldset-job_business_booking_method option[selected]' );
				var descriptionMethodHTML = '<fieldset class="fieldset-job_business_bookings_products_description fieldset-type-textarea"><label for="job_business_bookings_products_description">' + listarLocalizeAndAjax.hasBookingProducts + '</small></label><div class="field ">' + listarLocalizeAndAjax.hasBookingProductsDescr + '</div></fieldset>';

				selectedMethod = selectedMethod.length ? selectedMethod.attr( 'value' ) : '';

				var
					selectorOutput = labelSelector.prop( 'outerHTML' ),
					customLabelFieldContent = customLabelField.prop( 'outerHTML' ),
					methodFieldContent = methodField.prop( 'outerHTML' ),
					embedingFieldContent = embeddingField.prop( 'outerHTML' );

				labelSelector.before( '<div class="listar-business-booking-fields listar-boxed-fields-label-customizer hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner hidden"></div></div></div>' );

				labelSelector.prop( 'outerHTML', '' );

				$( '.listar-business-booking-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).prepend( selectorOutput );

				customLabelField.prop( 'outerHTML', '' );
				embeddingField.prop( 'outerHTML', '' );
				methodField.prop( 'outerHTML', '' );

				setTimeout( function () {
					labelSelector = $( '.fieldset-job_business_booking_label' );

					$( '.listar-business-booking-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-inner' ).append( customLabelFieldContent );

					$( '.listar-business-booking-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).append( methodFieldContent );
					
					if ( listarLocalizeAndAjax.wooBookingsActive ) {
						$( '.listar-business-booking-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).append( descriptionMethodHTML );
					}					
					
					$( '.listar-business-booking-fields.listar-boxed-fields-label-customizer .listar-boxed-fields-wrapper' ).append( embedingFieldContent );

					if ( $( '#job_business_use_booking' ).is( ':checked' ) ) {
						$( '.listar-business-booking-fields' ).removeClass( 'hidden' );
					}

					$( '.fieldset-job_business_bookings_third_party_service, .fieldset-job_business_bookings_products_description' ).addClass( 'hidden' );

					if ( 'external' === selectedMethod ) {
						$( '.fieldset-job_business_bookings_third_party_service' ).removeClass( 'hidden' );
					} else if ( 'booking' === selectedMethod ) {
						$( '.fieldset-job_business_bookings_products_description' ).removeClass( 'hidden' );
					}

					if ( 'custom' === labelSelector.find( 'select' ).val() ) {
						labelSelector.siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
					} else {
						labelSelector.siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
					}
				}, 100 );
			}, 20 );
		} );

		$( theBody ).on( 'click', '.listar-price-list-add-category', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			createPriceListCategory();
		} );

		$( theBody ).on( 'click', '.listar-price-list-add-item', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var selectedCategory;

			$( '.listar-price-builder-category[id*="price-category-"][data-selected="selected"]' ).each( function () {
				selectedCategory = $( this ).attr( 'id' );
			} );

			createPriceListItem( undefined, selectedCategory );
		} );

		$( theBody ).on( 'click', '.listar-price-builder-category-val', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var categoryID = $( this ).parent().attr( 'id' );

			highlightPriceListCategory( categoryID );

			priceListCategoryItemsVisibility( categoryID );
		} );

                $( theBody ).on( 'change', '.listar-price-item-label-val', function ( e ) {
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

                $( theBody ).on( 'click', '.listar-price-list-item-control-top', function ( e ) {
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

		$( theBody ).on( 'click', '.listar-price-list-item-control-bottom', function ( e ) {
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

		$( theBody ).on( 'click', '.listar-price-list-item-control-delete', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var confirmExclusion = confirm( listarLocalizeAndAjax.excludeItem );

			if ( confirmExclusion ) {
				$( this ).parents( '.listar-price-item' ).prop( 'outerHTML', '' );
			}
		} );

		$( theBody ).on( 'change paste keyup', '.listar-price-item-price-val', function ( e ) {
			sanitizePricingFields( $( this ) );
		} );

		$( theBody ).on( 'click', '.listar-price-list-category-delete', function ( e ) {
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
		$( '.fieldset-job_business_use_price_list' ).each( function () {
			var
				priceListEnablerFieldset = $( this ),
				priceListFieldset = $( '.fieldset-job_business_price_list_content' );

			var
				priceListOutput = priceListEnablerFieldset.prop( 'outerHTML' ),
				priceListFieldsetContent = priceListFieldset.prop( 'outerHTML' );

			priceListEnablerFieldset.before( '<div class="listar-business-catalog-fields listar-boxed-fields-price-list hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner hidden"></div></div></div>' );

			priceListEnablerFieldset.prop( 'outerHTML', '' );

			$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-wrapper' ).prepend( priceListOutput );

			$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-inner' ).before( '<div class="listar-catalog-files-header"></div>' );
				$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-catalog-files-header' ).append( $( '#job_business_price_list_content' ).siblings( 'small' ).prop( 'outerHTML' ) );

			priceListFieldset.prop( 'outerHTML', '' );

			// Construct the price list builder.

			setTimeout( function () {
				$( '.fieldset-job_business_price_list_content' ).each( function () {
					$( this ).before( '<div class="listar-price-list-builder"></div>' );

					var priceBuilder = $( '.listar-price-list-builder' );

					priceBuilder.append( '<div class="listar-price-builder-categories"><div class="listar-price-builder-categories-wrapper"><a href="#" class="listar-price-list-add-category fa fa-plus">' + listarLocalizeAndAjax.category + '</a></div></div>' );
					priceBuilder.append( '<div class="listar-price-builder-items"><div class="listar-price-builder-items-wrapper"></div><a href="#" class="listar-price-list-add-item fa fa-plus">' + listarLocalizeAndAjax.item + '</a></div>' );

					// Read the data saved.
					var savedJSON = $( '#job_business_price_list_content' ).val();
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
				priceListEnablerFieldset = $( '.fieldset-job_business_use_price_list' );

				$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-inner' ).append( priceListFieldsetContent );

				if ( $( '#job_business_use_price_list' ).is( ':checked' ) ) {
					$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-inner' ).removeClass( 'hidden' );
				}
			}, 100 );
		} );

		/* Prepare wrapper for menu/catalog image gallery */
		$( '.fieldset-job_business_use_catalog_images' ).each( function () {
			var
				galleryEnablerFieldset = $( this ),
				galleryFieldset = $( '.fieldset-gallery_images_menu' );

			var
				galleryOutput = galleryEnablerFieldset.prop( 'outerHTML' ),
				galleryFieldsetContent = galleryFieldset.prop( 'outerHTML' );

			galleryEnablerFieldset.before( '<div class="listar-business-catalog-fields listar-boxed-fields-catalog-gallery hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner hidden"></div></div></div>' );

			galleryEnablerFieldset.prop( 'outerHTML', '' );

			$( '.listar-business-catalog-fields.listar-boxed-fields-catalog-gallery .listar-boxed-fields-wrapper' ).prepend( galleryOutput );

			galleryFieldset.prop( 'outerHTML', '' );

			setTimeout( function () {
				galleryEnablerFieldset = $( '.fieldset-job_business_use_catalog_images' );

				$( '.listar-business-catalog-fields.listar-boxed-fields-catalog-gallery .listar-boxed-fields-inner' ).append( galleryFieldsetContent );

				if ( $( '#job_business_use_catalog_images' ).is( ':checked' ) ) {
					$( '.listar-business-catalog-fields.listar-boxed-fields-catalog-gallery .listar-boxed-fields-inner' ).removeClass( 'hidden' );
				}
			}, 100 );
		} );

		/*xxx */












































































































































		/* Prepare wrapper for menu/catalog creator */
		$( '.fieldset-job_business_use_catalog_create' ).each( function () {
			var
				creatorFieldset = $( this ),
				jsonFieldset = $( '.fieldset-job_business_use_catalog_create_json' );

			var
				creatorOutput = creatorFieldset.prop( 'outerHTML' ),
				jsonFieldsetContent = jsonFieldset.prop( 'outerHTML' );

			creatorFieldset.before( '<div class="listar-business-catalog-fields listar-boxed-fields-catalog-creator hidden"><div class="listar-boxed-fields-wrapper"><div class="listar-boxed-fields-inner hidden"></div></div></div>' );

			creatorFieldset.prop( 'outerHTML', '' );

			$( '.listar-business-catalog-fields.listar-boxed-fields-catalog-creator .listar-boxed-fields-wrapper' ).prepend( creatorOutput );

			jsonFieldset.prop( 'outerHTML', '' );

			setTimeout( function () {
				creatorFieldset = $( '.fieldset-job_business_catalog_label' );

				$( '.listar-business-catalog-fields.listar-boxed-fields-catalog-creator .listar-boxed-fields-inner' ).append( jsonFieldsetContent );

				if ( $( '#job_business_use_catalog_create' ).is( ':checked' ) ) {
					$( '.listar-business-catalog-fields.listar-boxed-fields-catalog-creator .listar-boxed-fields-inner' ).removeClass( 'hidden' );
				}
			}, 100 );
		} );

		/* Create review popup, if on single listing page */
		if ( theBody.hasClass( 'single-job_listing' ) ) {
			var reviewPopupBgImage;

			theBody.append( '<div class="listar-review-popup listar-hero-header listar-transparent-design"></div>' );

			$( '.listar-review-popup' )
				.append( '<div class="listar-hero-image"></div>' )
				.append( '<div class="listar-valign-form-holder"></div>' );

			$( '.listar-review-popup .listar-valign-form-holder' ).append( '<div class="text-center listar-valign-form-content"></div>' );
			$( '.listar-review-popup .listar-valign-form-content' ).append( '<div class="listar-panel-form-wrapper"><div class="panel listar-panel-form"><div class="panel-body"></div></div></div>' );

			reviewPopupBgImage = $( '.listar-review-popup .listar-hero-image' ).css( 'background-image' );

			/* Does review popup has a valid background image?
			 * If not, background color should be black with opacity
			 */
			if (
				'' === reviewPopupBgImage ||
				'0' === reviewPopupBgImage ||
				'none' === reviewPopupBgImage ||
				reviewPopupBgImage.indexOf( '/0' ) >= 0
			) {
				$( '.listar-review-popup' ).addClass( 'listar-no-background-image' );
			}
		}

		/* Check if front page has hero image */

		$( '.listar-front-header' ).each( function () {
			var frontpageHeroHeader = $( this );
			var backgroundImage = frontpageHeroHeader.find( '.listar-hero-image' ).css( 'background-image' );

			if ( 'none' === backgroundImage || '' === backgroundImage ) {
				frontpageHeroHeader.addClass( 'listar-no-frontpage-hero-image' );
			}
		} );

		/* Create the 'hamburguer' main menu (mobile menu) only if primary menu has links */
		if ( $( '#listar-primary-menu > .navbar-nav' ).length ) {
			$( '.navbar-inverse .listar-primary-navigation-wrapper' ).prepend( '<div class="navbar-header"></div>' );
			$( '.navbar-inverse .navbar-header' ).append( '<a class="navbar-toggle"></a>' );

			if ( ! $( '.listar-user-logged' ).length ) {
				$( '.navbar-inverse .navbar-header .navbar-toggle' )
					.append( '<span class="sr-only"></span>' )
					.append( '<span class="icon-bar"></span>' )
					.append( '<span class="icon-bar"></span>' )
					.append( '<span class="icon-bar"></span>' );
			} else {

				/*
				 * User is logged in:
				 */

				 /* Replicate the name/username of current user inside the 'hamburguer' menu */

				$( '.navbar-inverse .navbar-header' )
					.append( '<div class="listar-logged-user-name"></div>' );

				$( '.navbar-inverse .navbar-header .listar-logged-user-name' )
					.append( '<span>' + $( '#listar-logged-user-menu-list .listar-logged-user-name' ).prop( 'innerHTML' ) + '</span>' );

				/* Replicate the user avatar inside 'hamburguer' menu */

				$( '.navbar-inverse .navbar-header .navbar-toggle' )
					.append( $( '<div class="listar-user-buttons"></div>' ) )
					.append( '<span class="sr-only"></span>' )
					.append( '<span class="icon-bar"></span>' )
					.append( '<span class="icon-bar"></span>' )
					.append( '<span class="icon-bar"></span>' );

				$( '.navbar-inverse .navbar-header .navbar-toggle > .listar-user-buttons' )
					.append( $( '<div href="#" class="listar-user-login"></div>' ) );

				/* Replicate the menu to logged users inside the 'hamburguer' menu */

				$( '.listar-account-menu-item ul' )
					.append( $( '.listar-user-logged .listar-logged-user-menu-wrapper #listar-logged-user-menu-list' ).prop( 'innerHTML' ) );

				/* Remove unwanted/duplicated links */

				$( '.listar-account-menu-item .listar-logged-user-name' ).prop( 'outerHTML', '' );

				/* But if the menu has less than 2 li elements on root level, move all inner elements to root and remove 'listar-account-menu-item' */

				if ( $( '.listar-account-menu-item ' ).siblings( 'li' ).length < 2 ) {
					$( '.listar-account-menu-item ' ).prop( 'outerHTML', $( '.listar-account-menu-item ul' ).prop( 'innerHTML' ) );
				}

				/* Disable unwanted click event for these links */

				/*xxx */
				
				
			}// End if().

			/* If primary menu is empty or the menu isn't set */

			if (
				$( '#listar-primary-menu' ).hasClass( 'listar-primary-menu-mobile' ) ||
				0 === $( '#masthead > .navbar-inverse li[id]' ).length
			) {
				if ( 1 === $( '#listar-primary-menu .listar-header-search-button' ).length ) {
					$( '#listar-primary-menu .listar-header-search-button' ).prop( 'outerHTML','' );
				}

				headMenu.addClass( 'listar-no-primary-menu' );

				if ( $( '.listar-search-button-mobile' ).length ) {
					$( '.listar-primary-navigation-wrapper' ).append( '<div class="listar-header-search-button listar-search-button-desktop"></div>' );
				}
			}

		} else {
			headMenu.addClass( 'listar-no-primary-menu' );
		}// End if().

		$( '.listar-hero-header' ).prepend( '<div class="listar-hero-header-overlay"></div>' );
		$( '.listar-front-header.listar-hero-header' ).find( '.listar-hero-header-overlay' ).css( { opacity: 0, display : 'block' } );
		$( '.listar-front-header.listar-hero-header' ).find( '.listar-hero-header-overlay' ).stop().animate( { opacity: 1 }, { duration : 1000 } );

		$( '.listar-search-categories' ).append( '<span class="listar-more-categories"></span>' );

		moreCategoriesButtonVisibility();
		enableNearestMeDataEditor();

		$( '#site-navigation.navbar-inverse' ).after( $( '<div class="listar-navbar-height-col-inverse" id="listar-navbar-height-col"></div>' ) );
		$( '#site-navigation.navbar-default' ).after( $( '<div id="listar-navbar-height-col"></div>' ) );
		$( '#listar-primary-menu' ).prepend( '<div class="listar-mobile-menu-header-background"></div>' );
		$( '.listar-search-popup, .listar-review-popup, .listar-social-share-popup, .listar-login-popup, .listar-booking-popup, .listar-listing-categories-popup, .listar-listing-regions-popup, .listar-search-by-popup, .listar-report-popup, .listar-claim-popup, .listar-settings-popup' ).prepend( '<div class="listar-back-site icon-cross2"></div>' );

		/* Automatic Lightbox for Woocommerce image gallery */
		if ( $( '.woocommerce-product-gallery' ).length ) {
			var o = 1;

			$( '.woocommerce-product-gallery' ).each( function () {
				$( this ).find( 'a' ).each( function () {
					if (
						$( this ).attr( 'href' ).indexOf( 'jpg' ) >= 0 ||
						$( this ).attr( 'href' ).indexOf( 'jpeg' ) >= 0 ||
						$( this ).attr( 'href' ).indexOf( 'gif' ) >= 0 ||
						$( this ).attr( 'href' ).indexOf( 'png' ) >= 0 ||
						$( this ).attr( 'href' ).indexOf( 'bmp' ) >= 0 ||
						$( this ).attr( 'href' ).indexOf( 'jpg' ) >= 0
					) {
						$( this ).attr( 'data-lightbox', 'gallery-' + o );
						$( '.lightbox' ).css( { marginLeft : 0 } );
					}
				} );

				o++;
			} );
		}

		/* Set image caption to the image wrapping hyperlink */
		$( '.wp-caption-text, figcaption' ).each( function () {
			var
				caption = $( this ).prop( 'innerHTML' ),
				prev = $( this ).prev();

			if ( prev.length > 0 ) {
				if ( 'lightbox' === prev.attr( 'rel' ) ) {
					prev.attr( 'title', caption );
				}
			}
		} );

		/* Change placeholder text for Regions selector on Add Listing page */
		$( '#submit-job-form select#job_region' ).each( function () {
			$( this ).attr( 'data-placeholder', listarLocalizeAndAjax.regionSelectPlaceholder );
		} );

		/*
		 * Move aligncenter class from img elements to its parent hiperlink, if it exists
		 * Because we don't want the blank laterals of the image as hyperlink (clickable) area
		 */
		$( 'img.aligncenter' ).each( function () {
			var thisElement = $( this );

			if ( 'A' === thisElement.parent().prop( 'tagName' ) ) {
				thisElement.removeClass( 'aligncenter' );
				thisElement.parent().addClass( 'aligncenter' );
			}
		} );

		/* Add alignmobile class to parent hyperlinks of <img> tags on posts/pages */
		$( 'img.alignleft, img.alignright, img.aligncenter, img.alignnone' ).each( function () {
			var thisElement = $( this );

			if ( 'A' === thisElement.parent().prop( 'tagName' ) && ! thisElement.hasClass( 'size-thumbnail' ) ) {
				thisElement.parent().addClass( 'alignmobile' );
			}
		} );

		/* Add 'alignmedium' class to parent hyperlinks of <img> tags with 'size-medium' class ( if found sequence of two images with this class ) */
		$( 'img.size-medium' ).each( function () {
			var thisElement = $( this );

			/* Sequence of 'a img.size-medium' + 'a img.size-medium' */
			if ( 'A' === thisElement.parent().prop( 'tagName' ) ) {
				if ( thisElement.parent().next().length > 0 ) {
					if ( 'A' === thisElement.parent().next().prop( 'tagName' ) && thisElement.parent().next().find( 'img.size-medium' ).length > 0 ) {
						thisElement.parent().addClass( 'alignmedium' );
						thisElement.parent().next().addClass( 'alignmedium' );
					}
				}
			}

			/* Sequence of 'img.size-medium' + 'a img.size-medium' */
			if ( thisElement.next().length > 0 ) {
				if ( 'A' === thisElement.next().prop( 'tagName' ) && thisElement.next().find( 'img.size-medium' ).length > 0 ) {
					thisElement.addClass( 'alignmedium' );
					thisElement.next().addClass( 'alignmedium' );
				}
			}

			/* Sequence of 'a img.size-medium' + 'img.size-medium' */
			if ( thisElement.parent().next().length > 0 ) {
				if ( 'IMG' === thisElement.parent().next().prop( 'tagName' ) && thisElement.parent().next().hasClass( 'size-medium' ) ) {
					thisElement.parent().addClass( 'alignmedium' );
					thisElement.parent().next().addClass( 'alignmedium' );
				}
			}

			/* Sequence of 'img.size-medium' + 'img.size-medium' (no hyperlinks) */
			if ( thisElement.next().length > 0 ) {
				if ( 'IMG' === thisElement.next().prop( 'tagName' ) && thisElement.next().hasClass( 'size-medium' ) ) {
					thisElement.addClass( 'alignmedium' );
					thisElement.next().addClass( 'alignmedium' );
				}
			}
		} );

		/* Because we don't want the blank laterals of the image as hyperlink (clickable) area */
		$( 'img.aligncenter' ).each( function () {
			var thisElement = $( this );

			if ( 'A' === thisElement.parent().prop( 'tagName' ) ) {
				thisElement.removeClass( 'aligncenter' );
				thisElement.parent().addClass( 'aligncenter' );
			}
		} );

		/* Fix repeated empty <p> elements on post/page contents */
		$( '.entry-content p' ).each( function () {
			var thisElement = $( this );

			if ( '&nbsp;' === thisElement.prop( 'innerHTML' ) ) {
				thisElement.addClass( 'listar-empty-line' );
			}
		} );

		/*
		 * If 'Recent Posts' widget is exposing the date of posts, move
		 * the date's <span> tags into the respective 'listar-post-title-wrapper' divs
		 * for better design. Doing this with JavaScript avoids extend/rewrite
		 * the whole widget for such simple change
		 */
		$( '.widget_recent_entries' ).each( function () {
			$( this ).find( '.post-date' ).each( function () {
				var date = $( this ).prop( 'outerHTML' );
				$( this ).siblings( 'a' ).find( '.listar-post-title-wrapper' ).append( date );
				$( this ).prop( 'outerHTML', '' );
			} );
		} );

		$( '.listar-hero-header' ).not( '.listar-color-design' ).find( '.listar-hero-image' ).animate( { opacity : 1 }, { duration : 250 } );
		$( '.listar-user-logged .listar-user-buttons.listar-user-buttons-responsive > .listar-user-buttons' ).css( { 'background-image' : $( '.listar-user-logged .site-header .listar-user-buttons .listar-user-login' ).eq( 0 ).css( 'background-image' ) } );

		if ( 0 === $( '.listar-regions-list a' ).length >= 1 && $( '.listar-regions-list a.current' ).length ) {
			$( '.listar-regions-list a:eq( 0 )' ).addClass( 'current' );
		}

		if ( 1 === $( '.listar-regions-list a' ).length ) {
			$( '.listar-regions-list a' ).addClass( 'listar-region-no-hover' );
		}

		$( '.fieldset-company_instagram' ).append( '<div class="listar-clear-both"></div><div class="listar-show-more-social"></div>' );

		$( '.fieldset-company_external_link_3' ).append( '<div class="listar-clear-both"></div><div class="listar-show-more-social"></div>' );

		$( '.account-sign-in a' ).each( function () {
			var thisElement = $( this );

			/* If 'Listar Addons' plugin is active, remove the default WordPress login URL */
			if ( - 1 === thisElement.attr( 'href' ).indexOf( 'logout' ) && ! theBody.hasClass( 'listar-no-addons' ) ) {
				thisElement.attr( 'href', '#' );
			}
		} );

		$( '#submit-job-form fieldset' ).each( function () {
			if ( '' === $( '#submit-job-form #job_title' ).attr( 'value' ) && $( this ).index() > 5 ) {
				$( this ).find( 'input' ).attr( 'value', '' );
				$( '.job-manager-remove-uploaded-file' ).eq( 0 ).trigger( 'click' );
				$( '.job-manager-remove-uploaded-file' ).eq( 1 ).trigger( 'click' );
				$( '.job-manager-uploaded-files' ).prop( 'innerHTML', '' );
				$( '#job_useuseremail' ).prop( 'checked', true );
			}
		} );

		if ( $( '#job_useuseremail' ).is( ':checked' ) ) {
			$( '.fieldset-job_custom_email' ).css( { display : 'none' } );
		}

		$( '.comment-content' ).each( function () {
			var thisElement = $( this ).find( '.wpjmr-list-reviews, .listar-list-reviews' ).eq( 0 );

			if ( thisElement.length ) {
				if ( thisElement.prop( 'innerHTML' ).length < 20 ) {
					thisElement.css( { display : 'none' } );
				}
			}
		} );

		$( '.listar-fav-listing .listar-card-content-image' ).prop( 'outerHTML', '' );

		toggler = '.navbar-toggle';
		pageWrapper = '#page-content';
		navigationWrapper = '.navbar-header';
		menuWidth = '300px';
		menuNegativeWidth = '-300px';
		selected = '#listar-primary-menu, body, .navbar, .navbar-header';

		/* Prepare main menu structure if has submenus */
		$( '#listar-primary-menu > .navbar-nav li a' ).each( function () {
			if ( $( this ).next().hasClass( 'dropdown-menu' ) ) {
				$( this ).append( '<b class="caret"></b>' ).addClass( 'dropdown-toggle' ).attr( 'data-toggle', 'dropdown' );
			}
		} );

		prepareMainMenu();

		if ( ! $( '.site-header' ).length ) {
			theBody.append( '<div class="listar-full-dimming-overlay"></div>' );
		} else {
			$( '.site-header' ).append( '<div class="listar-full-dimming-overlay"></div>' );
		}

		setCanvasEffect();

		/*xxx */
		
		

		/* Initialize Tooltips */
		if ( $.isFunction( $.fn.tooltip ) ) {
			$( '.listar-social-networks a[data-toggle="tooltip"], .listar-page-user[data-toggle="tooltip"], .listar-more-results[data-toggle="tooltip"], .listar-more-map-listing[data-toggle="tooltip"], .listar-template-colors [data-toggle="tooltip"], .listar-read-more-link[data-toggle="tooltip"], .listar-settings-button[data-toggle="tooltip"], .listar-copy-day-button[data-toggle="tooltip"], .listar-multiple-hours-buttons a[data-toggle="tooltip"], .listar-toggle-listing-sidebar-position[data-toggle="tooltip"], .listar-clean-search-by-filters-button[data-toggle="tooltip"], .listar-clean-search-input-button[data-toggle="tooltip"], .listar-get-geolocated[data-toggle="tooltip"], .listar-trending-icon[data-toggle="tooltip"]' ).tooltip();
			$( '[data-toggle="tooltip"]' ).not( '[data-original-title]' ).tooltip( {
				container : 'body'
			} );
		}

		/* Price range */
		var requiredPriceRange = '';
		priceRange = $( '#job_pricerange' );
		priceRangeValue = priceRange.val();

		priceRange.each( function () {
			requiredPriceRange = priceRange[0].hasAttribute( 'required' ) ? 'required' : '';
		} );

		if ( priceRange.length ) {
			priceRange.after( '<div class="listar-price-range-fields"></div>' );

			$( '.listar-price-range-fields' )
				.append( '<span class="listar-price-range-symbol">' + listarLocalizeAndAjax.wooCurrencySymbol + '&nbsp;</span>' )
				.append( '<input class="listar-price-range-from" type="text" placeholder="15" ' + requiredPriceRange + '>' )
				.append( '<span class="listar-price-range-separator">~</span>' )
				.append( '<span class="listar-price-range-symbol">' + listarLocalizeAndAjax.wooCurrencySymbol + '&nbsp;</span>' )
				.append( '<input class="listar-price-range-to" type="text" placeholder="45" ' + requiredPriceRange + '>' );

			/* Check/get saved price range */
			if ( - 1 !== priceRangeValue.indexOf( '/////' ) ) {
				var priceValues = priceRangeValue.split( '/////' );

				if ( 'string' === typeof priceValues[0] && undefined !== priceValues[0] && 'undefined' !== priceValues[0] && 'NaN' !== priceValues[0]  ) {
					$( '.listar-price-range-from' ).val( parseFloat( priceValues[0] ) );
				}

				if ( 'string' === typeof priceValues[1] && undefined !== priceValues[1] && 'undefined' !== priceValues[1] && 'NaN' !== priceValues[1]  ) {
					$( '.listar-price-range-to' ).val( parseFloat( priceValues[1] ) );
				}
			}
		}

		priceAverage = $( '#job_priceaverage' );

		if ( priceAverage.length ) {
			priceAverage.before( '<span class="listar-price-average-symbol">' + listarLocalizeAndAjax.wooCurrencySymbol + '&nbsp;</span>' );
		}

		$( '#commentform' ).each( function () {
			$( this )[0].encoding = 'multipart/form-data';
		} );

		$( 'article iframe' ).each( function () {
			if ( 'P' === $( this ).parent().prop( 'tagName' ) && 'BR' === $( this ).prev().prop( 'tagName' ) ) {
				$( this ).prev().prop( 'outerHTML', '' );
			}
		} );

		$( '.single-job_listing .job_description p:first-child > *:first-child, .entry-content p:first-child > *:first-child' ).each( function () {
			if ( 'BR' === $( this ).prop( 'tagName' ) ) {
				$( this ).prop( 'outerHTML', '' );
			}
		} );

		/* Hide sections on single listing pages */
		if ( theBody.hasClass( 'single-job_listing' ) ) {
			var
				descriptionWrapper = $( '.listar-single-listing-description-wrapper' ),
				listinSocialNetworks = $( '.single-job_listing .listar-listing-description .listar-social-networks' ),
				listingContactDataWrapper = $( '.single-job_listing .listar-listing-contact-data' ),
				listingDescriptionFirstCol = $( '.listar-listing-description-first-col' ),
				listingDescriptionSecondCol = $( '.listar-listing-description-second-col' ),
				listingDescriptionFirstColContainers,
				priceRanges = $( '.listar-listing-price-range-wrapper' ),
				listingDescriptionText = $( '.listar-listing-description-text' ),
				hasPrivateMessageForm  = $( '.listar-private-message-accordion' ).length > 0,
				listingDescriptionTextTemp = $( '<div></div>' );

			if ( 0 === listingDescriptionText.length ) {
				listingDescriptionText = '';
			} else {
				listingDescriptionTextTemp = $( $( '.listar-listing-description-text' ).prop( 'outerHTML' ) );
				listingDescriptionTextTemp.find( '.listar-listing-description-title' ).prop( 'outerHTML', '' );

				/* Clean all HTML comments */
				listingDescriptionTextTemp.prop( 'innerHTML', listingDescriptionTextTemp.prop( 'innerHTML' ).replace( /<\!--.*?-->/g, '' ) );

				/* Remove all empty tags */
				listingDescriptionTextTemp.prop( 'innerHTML', listingDescriptionTextTemp.prop( 'innerHTML' ).replace( /<[\S]+><\/[\S]+>/gim, '' ) );
			}

			/* Is all description block empty? */
			if ( descriptionWrapper.length ) {
				if ( descriptionWrapper.prop( 'innerHTML' ).replace( /\s/g, '' ).length < 918 ) {
					descriptionWrapper.prop( 'outerHTML', '' );
				}
			}

			/*
			 * Hide contact data container on single listings if empty
			 * If gallery is empty, hide it too
			 */
			if ( ! listingContactDataWrapper.find( 'li' ).length ) {
				listingContactDataWrapper.prop( 'outerHTML', '' );
			}

			/* Does the listing has social networks? */
			if ( ! listinSocialNetworks.find( 'a' ).length ) {
				listinSocialNetworks.parent().prop( 'outerHTML', '' );
				descriptionWrapper.addClass( 'listar-no-social-networks' );
			}

			/* Does the listing has a description text? */
			if ( listingDescriptionText.length ) {
				if ( 0 === listingDescriptionTextTemp.prop( 'innerHTML' ).replace( /\s/g, '' ).length ) {
					/* Does the listing has the private message form, at least? */
					if ( ! hasPrivateMessageForm ) {
						listingDescriptionText.prop( 'outerHTML', '' );
					}
				}
			}

			/* Are the description cols not tall enough? */
			if ( listingDescriptionFirstCol.length ) {
				if ( listingDescriptionFirstCol.height() < 100 ) {
					if ( listingDescriptionSecondCol.length ) {
						listingDescriptionSecondCol.removeClass( 'col-md-8' ).addClass( 'col-md-12' );
					}

					if ( $( '.listar-toggle-listing-sidebar-position' ).length ) {
						$( '.listar-toggle-listing-sidebar-position' ).prop( 'outerHTML', '' );
					}
				}
			}

			/* Is there just the logo wrapper on first column? */
			setTimeout( function () {
				listingDescriptionFirstColContainers = $( '.listar-listing-description-first-col > div' );

				if ( 1 === listingDescriptionFirstColContainers.length ) {
					if ( listingDescriptionFirstColContainers.hasClass( 'listar-listing-logo-data' ) ) {
						listingDescriptionFirstCol.removeClass( 'col-md-4' ).addClass( 'col-md-12' );

						if ( listingDescriptionSecondCol.length ) {
							listingDescriptionSecondCol.removeClass( 'col-md-8' ).addClass( 'col-md-12' );
						}

						if ( $( '.listar-toggle-listing-sidebar-position' ).length ) {
							$( '.listar-toggle-listing-sidebar-position' ).prop( 'outerHTML', '' );
						}
					}
				}
			}, 100 );

			if ( listingDescriptionSecondCol.length ) {
				if ( listingDescriptionSecondCol.height() < 100 ) {
					listingDescriptionSecondCol.removeClass( 'col-md-8' ).addClass( 'col-md-12' );

					if ( listingDescriptionFirstCol.length ) {
						listingDescriptionFirstCol.removeClass( 'col-md-4' ).addClass( 'col-md-12' );
					}

					if ( $( '.listar-toggle-listing-sidebar-position' ).length ) {
						$( '.listar-toggle-listing-sidebar-position' ).prop( 'outerHTML', '' );
					}
				}
			}

			/* Fix if there is only one price range block */
			if ( 1 === priceRanges.length ) {
				priceRanges.removeClass( 'col-sm-6' ).addClass( 'col-sm-12' );
			}

			/* Is the description finished with a empty paragraph? */

			if ( listingDescriptionText.length ) {
				if ( listingDescriptionText.find( 'p' ).length ) {
					var lastP = listingDescriptionText.find( 'p:last-child' );

					if ( lastP.prop( 'innerHTML' ).indexOf( 'wp:paragraph' ) >= 0 ) {
						lastP.prop( 'outerHTML', '' );
					}
				}
			}

			setTimeout( function () {

				var
					contactDataCol1 = $( '.listar-listing-description-first-col' ),
					descriptionCol1 = $( '.listar-listing-description-second-col' ),
					listingHasRightSidebar = theBody.hasClass( 'listar-listing-sidebar-position-right' );

				if ( contactDataCol1.length && descriptionCol1.length && listingHasRightSidebar ) {

					var cloneA = contactDataCol1.clone();
					var cloneB = descriptionCol1.clone();

					contactDataCol1.replaceWith( cloneB );
					descriptionCol1.replaceWith( cloneA );

					theBody.addClass( 'listar-listing-sidebar-on-right' );

					setTimeout( function () {
						/* Removes the tooltip */
						$( '.listar-listing-description-first-col' ).find( '.tooltip' ).prop( 'outerHTML', '' );
						setTooltips();
					}, 10 );
				}

				/* Is the accordion section not tall enough? */
				if ( $( '.listar-listing-description-text #accordion' ).length > 0 ) {
					if ( 0 === $( '.listar-listing-description-text #accordion' ).height() ) {
						$( '.listar-listing-description-text' ).prop( 'outerHTML', '' );
					}
				}
			}, 15 );

		}// End if().

		if ( $( '.listar-search-results-count-wrapper.listar-not-found' ).length > 0 && $( '#map' ).length > 0 ) {
			$( '#map' ).addClass( 'listar-map-disabled' );
		}

		/*
		 * Pages shouldn't contain more than one listing map block.
		 * If it is the case, remove and keep the first found.
		 * It can happen, for example, if a map widget is included on
		 * footer and single listing pages/archive are accessed.
		 * Also, if two listing map widgets are in use on any page.
		 */
		if ( $( '.listar-map ~ .listar-aside-list' ).length > 1 ) {
			$( '.listar-map ~ .listar-aside-list' ).not( ':first' ).parent().prop( 'outerHTML', '' );
		}

		resetElements();

		/*
		 * Init Select2
		 */
		$( '.listar-business-hours-fields select' ).each( function() {
			var theSelect = $( this );
			var initialSelectedValue = theSelect.attr( 'value' );
			var initialSelectedValue2 = theSelect.val();

			if ( theSelect.parents( '.listar-business-start-time-field' ).length ) {
				if ( '' === initialSelectedValue || '' === initialSelectedValue2 || 'undefined' === typeof( initialSelectedValue ) || 'undefined' === typeof( initialSelectedValue2 ) ) {
					theSelect.find( 'option' ).each( function () {
						$( this ).removeAttr( 'selected' ).prop( 'selected', false );

						if ( '09:00 AM' === $( this ).attr( 'value' ) ) {
							$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
						}
					} );

					theSelect.val( '09:00 AM' );
					theSelect.attr( 'value', '09:00 AM' );
				} else {
					theSelect.attr( 'value', theSelect.val() );
				}
			}

			if ( theSelect.parents( '.listar-business-end-time-field' ).length ) {
				if ( ( '00:00 AM' === initialSelectedValue || '' === initialSelectedValue ) ) {
					theSelect.find( 'option' ).each( function () {
						$( this ).removeAttr( 'selected' ).prop( 'selected', false );

						if ( '06:00 PM' === $( this ).attr( 'value' ) ) {
							$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
						}
					} );

					theSelect.val( '06:00 PM' );
					theSelect.attr( 'value', '06:00 PM' );
				} else {
					theSelect.attr( 'value', theSelect.val() );
				}
			}
		} );

		featuredListingCategorySelect( $( '#company_featured_listing_category' ).val() );
		featuredListingRegionSelect( $( '#company_featured_listing_region' ).val() );

		var select2Selectors = $( '#product_type, .woocommerce-input-wrapper select, #vendor_commission_mode, form[class*="woo"] select, form[id*="woo"] select, form[name*="woo"] select, .job-manager-form select, .listar_theme_shapes_session, .listar-search-by-custom-location-data-countries-select select, select[id*="wc_bookings_field"], select[name*="wc_bookings_field"]' );

		select2Selectors.each( function () {
			forceSelectSelected( $( this ) );
		} );

		if ( $.isFunction( $.fn.select2 ) ) {				
			select2Selectors.select2( {
				minimumResultsForSearch: 3
			} );

			$( '.listar-select-single, .variations_form select, .woocommerce .woocommerce-ordering select' ).select2( {
				minimumResultsForSearch: -1
			} );

			setTimeout( function () {
				$( 'select[name="job_business_products_label"], #company_business_rich_media_label, #job_business_catalog_label, #job_business_booking_label' ).each( function () {
					if ( $( this ).siblings( '.select2' ).length ) {
						$( this ).siblings( '.select2' ).prop( 'outerHTML', '' );
						$( this ).select2( 'destroy' );
						$( this ).select2();
					}
				} );
			}, 100 );

                        setTimeout( function () {                
                                $( '#job_business_products_list, #job_business_booking_method' ).each( function () {
                                        var select2Elem = $( this );

                                        if ( select2Elem.siblings( '.select2' ).length ) {
                                                select2Elem.select2( 'destroy' );
                                                select2Elem.siblings( '.select2' ).prop( 'outerHTML', '' );
                                                select2Elem.removeAttr( 'aria-hidden' );
                                                select2Elem.removeAttr( 'tabindex' );
                                                select2Elem.removeAttr( 'data-select2-id' );
                                                select2Elem.removeClass( 'select2-hidden-accessible' );
                                                select2Elem.css( { height : 'auto' } );

                                                if ( ! isMobile() ) {
                                                        select2Elem.select2();
                                                }
                                        }
                                } );
                        }, 3000 );
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

		/*xxx */
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

		/*xxx */ 
		
		
		
		

		/* Append AOS (animation) to front page widgets */

		if ( animateElementsOnScroll ) {
			$( '.entry-content .widget' ).each( function () {

				$( this ).attr( 'data-aos', 'fade-up' );

				if ( $( this ).find( '.widget-title' ).length ) {
					$( this ).find( '.widget-title' ).attr( 'data-aos', 'fade-up' );
				}

				if ( $( this ).find( '.widget-title ~ *' ).length ) {
					$( this ).find( '.widget-title ~ *' ).attr( 'data-aos', 'fade-zoom-in' );
				}

				if ( $( this ).find( '.listar-widget-content-wrapper' ).length ) {
					$( this ).find( '.listar-widget-content-wrapper' ).attr( 'data-aos', 'fade-zoom-in' );
				}
			} );
		}

		if ( $( '.job-manager-form' ).length ) {
			if ( 0 === $( '#job_amenities option' ).length ) {
				$( '.fieldset-job_amenities' ).css( { display : 'none' } );
			}
		}

		if ( $( '.job-manager-form' ).length ) {
			if ( 0 === $( '#job_amenities option' ).length ) {
				$( '.fieldset-job_amenities' ).css( { display : 'none' } );
			}

			/* Move WP Job Manager checkbox field to new position */

			if ( $( '.fieldset-job_fullwidth' ).length ) {
				var fieldsetHTML = $( '.fieldset-job_fullwidth' ).prop( 'outerHTML' );

				$( '.fieldset-job_fullwidth' ).prop( 'outerHTML', '' );
				$( '.fieldset-job_description' ).before( fieldsetHTML );
			}
		}

		$( '.listar-add-wave-top' ).not( 'img, video' ).append( '<div class="listar-wave-top"></div>' ).removeClass( 'listar-add-wave-top' );
		$( '.listar-add-wave-bottom' ).not( 'img, video' ).append( '<div class="listar-wave-bottom"></div>' ).removeClass( 'listar-add-wave-bottom' );

		/* For users who downgraded for WordPress < 5.0 or disabled Gutenberg: try to fix public Gutenberg blocks, if available */

		if ( theBody.hasClass( 'listar-no-gutenberg' ) ) {
			$( '.wp-block-gallery' ).each( function() {
				var classes = $( this ).attr( 'class' );
				classes = classes.replace( /columns-/g, 'gallery gallery-columns-' );

				$( this ).find( '.blocks-gallery-item' ).addClass( 'gallery-item' );
				$( this ).find( 'figure' ).addClass( 'gallery-icon' );
				$( this ).attr( 'class', classes );
			} );
		}
		
		/*xxx */
		
		

		$( '.entry-content .listar-wavy-badge-design .listar-wave-top, .entry-content .listar-wavy-badge-design .listar-wave-bottom' ).each( function () {
			$( this ).prop( 'outerHTML', '' );
		} );

		$( '.widget_recent_entries' ).each( function () {
			$( this ).removeClass( 'widget' ).addClass( 'listar-recent-entries-wrapper' );
			$( this ).prop( 'innerHTML', '<div class="widget">' + $( this ).prop( 'innerHTML' ) + '</div>' );
		} );

		/* Custom Gutenberg classes */

		customGutenbergClasses = '[class*="listar-iconify"],[class*="listar-cloudify"],[class*="listar-borderify"],[class*="listar-embossify"],[class*="listar-wavify"],[class*="listar-max-embossify"],[class*="listar-skewfy"],[class*="listar-gradientify"],[class*="listar-roundify"],[class*="listar-max-roundify"],[class*="listar-iconify"],[class*="listar-quantify"],[class*="listar-mixify"]';

		$( 'main article .listar-featurify, main article .listar-featurify-squared, main article .listar-featurify-uncloudify' ).each( function () {
			$( this ).addClass( 'listar-center-aside listar-borderify-inner listar-embossify listar-max-roundify' );

			if ( $( this ).hasClass( 'listar-featurify-squared' ) ) {
				$( this ).removeClass( 'listar-max-roundify-top' );
			}

			if ( $( this ).hasClass( 'listar-featurify-uncloudify' ) ) {
				$( this ).removeClass( 'listar-cloudify' );
			}
		} );

		$( 'main article .listar-featurify, main article .listar-featurify-squared' ).each( function () {
			if ( $( this ).hasClass( 'listar-featurify-squared' ) ) {
				$( this ).removeClass( 'listar-max-roundify-top' );
			}
		} );

		$( 'main article' ).each( function () {
			$( customGutenbergClasses ).each( function () {
				if ( ! $( this ).hasClass( 'listar-play-button' ) ) {
					if ( $( this ).find( 'figure a' ).length ) {
						$( this ).find( 'figure a' ).append( '<div class="listar-custom-gutenberg-classes-inner"></div>' );
					} else {
						$( this ).find( 'figure' ).each( function () {
							$( this ).append( '<div class="listar-custom-gutenberg-classes-inner"></div>' );
						} );

					}
				}
			} );
		} );

		$( 'main article .listar-borderify-inner' ).each( function () {
			$( this ).find( '.listar-custom-gutenberg-classes-inner' ).each( function () {
				$( this ).append( '<div class="listar-do-borderify-inner"></div>' );
			} );
		} );

		$( 'main article .listar-gradientify-bottom' ).each( function () {
			$( this ).find( '.listar-custom-gutenberg-classes-inner' ).each( function () {
				$( this ).append( '<div class="listar-do-gradientify-bottom"></div>' );
			} );
		} );

		$( 'main article .listar-quantify-left' ).each( function () {
			$( this ).find( '.listar-custom-gutenberg-classes-inner' ).each( function () {
				$( this ).append( '<div class="listar-do-quantify listar-do-quantify-left"></div>' );
			} );
		} );

		$( 'main article .listar-quantify-right' ).each( function () {
			$( this ).find( '.listar-custom-gutenberg-classes-inner' ).each( function () {
				$( this ).append( '<div class="listar-do-quantify listar-do-quantify-right"></div>' );
			} );
		} );

		$( 'main article .listar-do-quantify' ).each( function () {
			$( this ).append( '0' + quantifyCounter );
			quantifyCounter += 1;
		} );

		$( 'main article .listar-roundify-top.listar-borderify-inner .listar-do-quantify-left' ).each( function () {
			var imageWidth = $( this ).parent().width();
			var radius = imageWidth / 2;
			var counterTop    = ( radius ) - Math.sqrt( ( ( Math.pow( ( radius ), 2 ) ) / 2 ) ) - 4;
			var counterLeft = counterTop + 20 - 25;
			counterTop = counterTop + 40 - 25;

			$( this ).css( { top : counterTop, left : counterLeft } );
		} );

		$( 'main article .listar-roundify-top.listar-borderify-inner .listar-do-quantify-right' ).each( function () {
			var imageWidth = $( this ).parent().width();
			var radius = imageWidth / 2;
			var counterTop    = ( radius ) - Math.sqrt( ( ( Math.pow( ( radius ), 2 ) ) / 2 ) ) - 4;
			var counterRight = counterTop + 20 - 25;
			counterTop = counterTop + 40 - 25;

			$( this ).css( { top : counterTop, right : counterRight } );
		} );

		$( 'main article .listar-max-roundify-top.listar-borderify-inner .listar-do-quantify-left' ).each( function () {
			var imageWidth = $( this ).parent().width();
			var radius = imageWidth / 2;
			var counterTop    = ( radius ) - Math.sqrt( ( ( Math.pow( ( radius ), 2 ) ) / 2 ) ) + 7;
			var counterLeft = counterTop + 20 - 25;
			counterTop = counterTop + 40 - 25;

			$( this ).css( { top : counterTop, left : counterLeft } );
		} );

		$( 'main article .listar-max-roundify-top.listar-borderify-inner .listar-do-quantify-right' ).each( function () {
			var imageWidth = $( this ).parent().width();
			var radius = imageWidth / 2;
			var counterTop    = ( radius ) - Math.sqrt( ( ( Math.pow( ( radius ), 2 ) ) / 2 ) ) + 7;
			var counterRight = counterTop + 20 - 25;
			counterTop = counterTop + 40 - 25;

			$( this ).css( { top : counterTop, right : counterRight } );
		} );

		$( 'main article [class*="listar-iconify-icon-"], main article [class*="listar-iconify-fa-"]' ).each( function () {
			var classes = $( this ).attr( 'class' );
			classes = classes.split( ' ' );

			var classesCount = classes.length;
			var iconClass = '';
			var ind;

			for ( ind = 0; ind < classesCount; ind++ ) {
				if ( classes[ ind ].indexOf( 'listar-iconify-icon-' ) >= 0 ) {
					iconClass = classes[ ind ].replace( 'listar-iconify-', '' );
					break;
				} else if ( classes[ ind ].indexOf( 'listar-iconify-fa-' ) >= 0 ) {
					iconClass = classes[ ind ].replace( '-icon-fa-', '-fa-' );
					iconClass = iconClass.replace( 'listar-iconify-fa-fa-', 'fa fa-' );
					iconClass = iconClass.replace( 'listar-iconify-fa-', 'fa fa-' );
					break;
				}
			}

			if ( '' !== iconClass ) {
				$( this ).find( '.listar-custom-gutenberg-classes-inner' ).each( function () {
					if ( ! $( this ).find( '.listar-do-iconify' ).length ) {
						$( this ).append( '<div class="listar-do-iconify"></div>' );
					}
					$( this ).find( '.listar-do-iconify' ).attr( 'class', 'listar-do-iconify ' + iconClass );
				} );
			}
		} );

		$( 'main article [class*="listar-iconify-size"]' ).each( function () {
			var classes = $( this ).attr( 'class' );
			classes = classes.split( ' ' );

			var classesCount = classes.length;
			var fontSize = '';
			var ind;

			for ( ind = 0; ind < classesCount; ind++ ) {
				if ( classes[ ind ].indexOf( 'listar-iconify-size-' ) >= 0 ) {
					fontSize = classes[ ind ].replace( 'listar-iconify-size-', '' );
					fontSize = fontSize.replace( 'px', '' ).replace( '*', '' ).replace( 'em', '' ).replace( 'rem', '' ).replace( 'pt', '' );
					break;
				}
			}

			if ( '' !== fontSize ) {
				$( this ).find( '.listar-do-iconify' ).each( function () {
					$( this ).css( { 'font-size' : fontSize + 'px' } );
				} );
			}
		} );

		$( 'main article [class*="listar-iconify-space-left"]' ).each( function () {
			var classes = $( this ).attr( 'class' );
			classes = classes.split( ' ' );

			var classesCount = classes.length;
			var space = '';
			var ind;

			for ( ind = 0; ind < classesCount; ind++ ) {
				if ( classes[ ind ].indexOf( 'listar-iconify-space-left-' ) >= 0 ) {
					space = classes[ ind ].replace( 'listar-iconify-space-left-', '' );
					space = space.replace( 'px', '' ).replace( '*', '' ).replace( 'em', '' ).replace( 'rem', '' ).replace( 'pt', '' );
					space = parseInt( space, 10 );
					break;
				}
			}

			if ( '' !== space ) {
				$( this ).find( '.listar-do-iconify' ).each( function () {
					if ( space > 0 ) {
						$( this ).css( { 'padding-left' : space + 'px' } );
					} else {
						$( this ).css( { 'padding-right' : -1 * space + 'px' } );
					}
				} );
			}
		} );

		$( 'main article [class*="listar-iconify-space-top"]' ).each( function () {
			var classes = $( this ).attr( 'class' );
			classes = classes.split( ' ' );

			var classesCount = classes.length;
			var space = '';
			var ind;

			for ( ind = 0; ind < classesCount; ind++ ) {
				if ( classes[ ind ].indexOf( 'listar-iconify-space-top-' ) >= 0 ) {
					space = classes[ ind ].replace( 'listar-iconify-space-top-', '' );
					space = space.replace( 'px', '' ).replace( '*', '' ).replace( 'em', '' ).replace( 'rem', '' ).replace( 'pt', '' );
					space = parseInt( space, 10 );
					break;
				}
			}

			if ( '' !== space ) {
				$( this ).find( '.listar-do-iconify' ).each( function () {
					$( this ).css( { 'line-height' : 47 + space + 'px' } );
				} );
			}
		} );

		$( 'main article [class*="listar-iconify-color"]' ).each( function () {
			var classes = $( this ).attr( 'class' );
			classes = classes.split( ' ' );

			var classesCount = classes.length;
			var color = '';
			var ind;

			for ( ind = 0; ind < classesCount; ind++ ) {
				if ( classes[ ind ].indexOf( 'listar-iconify-color-' ) >= 0 ) {
					color = classes[ ind ].replace( 'listar-iconify-color-', '' ).replace( '#', '' );
					break;
				}
			}

			if ( '' !== color ) {
				color = '#' + color;

				if ( validHexColor( color ) ) {

					$( this ).find( '.listar-do-iconify' ).each( function () {
						$( this ).css( { 'background-color' : color } );
					} );
				}
			}
		} );

		$( 'main article [class*="listar-iconify-force-square"]' ).each( function () {
			$( this ).find( '.listar-do-iconify' ).each( function () {
				$( this ).addClass( 'listar-do-iconify-squared' );
			} );
		} );

		$( 'main article .listar-skewfy' ).each( function () {
			var skewElement = $( this );

			setTimeout( function ( ) {
				skewElement.addClass( 'listar-do-skewfy' );
			}, 1500 );
		} );

		if ( $( 'main article .listar-cloudify' ).length ) {
			setTimeout( function () {
				$( 'main article .listar-cloudify' ).each( function () {
					$( this ).find( '.listar-custom-gutenberg-classes-inner' ).each( function () {
						var
							imageWidth  = $( this ).width(),
							imageHeight = $( this ).height();

						var maxShadowsAmount = parseInt( ( imageHeight / 70 ) * 2.1 );

						var shadowColors = [
							'rgba(100,100,100,0)',
							'rgba(100,100,100,0)',
							'rgba(100,100,100,0.08)',
							'rgba(255,200,0,0.6)',
							'rgba(255,15,255,0.45)',
							'rgba(255,108,0,0.4)',
							'rgba(50,0,200,0.4)',
							'rgba(200,200,200,0.3)',
							'rgba(10,200,255,0.65)',
							'rgba(200,200,200,0.45)',
							'rgba(200,200,150,0.45)',
							'rgba(200,200,200,0.30)',
							'rgba(53,248,1,0.45)',
							'rgba(255,255,0,0.45)',
							'rgba(255,108,217,0.15)',
							'rgba(180,180,180,0.65)',
							'rgba(255,0,180,0.35)',
							'rgba(180,255,25,0.55)',
							'rgba(150,220,200,0.35)',
							'rgba(40,180,180,0.6)',
							'rgba(180,10,180,0.1)',
							'rgba(18,180,18,0.15)',
							'rgba(50,0,255,0.4)',
							'rgba(255,180,180,0.25)',
							'rgba(200,200,0,0.45)',
							'rgba(180,180,180,0.35)',
							'rgba(255,0,180,0.35)',
							'rgba(180,255,255,0.55)',
							'rgba(200,0,100,0.25)',
							'rgba(230,108,0,0.4)',
							'rgba(180,10,180,0.4)',
							'rgba(10,180,180,0.25)',
							'rgba(18,180,18,0.35)'
						];

						var colorsAmount = shadowColors.length;

						var shadowPositions = [
							/* Pattern 1 */
							[
								[
									// Grey top.
									imageWidth - 250, // X.
									20000 - 80		           // Y.
								],
								[
									// Grey Bottom.
									imageWidth - 250,
									20000 + imageHeight - 20
								],

								[
									-100,
									20000 - 20
								],
								[
									imageWidth - 170,
									20000 + 65
								],

								[
									imageWidth - 110,
									20000 + 240
								],

								[
									-50,
									20000 + 120
								],

								[
									-100,
									20000 + 110
								],
								[
									imageWidth - 80,
									20000 + 280
								],

								[
									-200,
									20000 + 250
								],
								[
									imageWidth - 80,
									20000 + 270
								],

								[
									-50,
									20000 + 280
								],
								[
									imageWidth - 10,
									20000 + 290
								],

								[
									-90,
									20000 + 380
								],
								[
									imageWidth + 60,
									20000 + 360
								],

								[
									-290,
									20000 + 430
								],
								[
									imageWidth - 130,
									20000 + 400
								],

								[
									-10,
									20000 + 440
								],
								[
									imageWidth - 90,
									20000 + 470
								],

								/* Extended height */

								[
									-100,
									20000 + 520
								],
								[
									imageWidth - 170,
									20000 + 565
								],

								[
									imageWidth - 110,
									20000 + 740
								],

								[
									-100,
									20000 + 610
								],
								[
									imageWidth - 80,
									780
								],

								[
									-200,
									20000 + 750
								],
								[
									imageWidth - 80,
									20000 + 770
								],

								[
									-50,
									20000 + 780
								],
								[
									imageWidth - 10,
									20000 + 790
								],

								[
									-90,
									20000 + 880
								],
								[
									imageWidth + 60,
									20000 + 860
								],

								[
									-290,
									20000 + 930
								],
								[
									imageWidth - 130,
									20000 + 900
								],

								[
									-10,
									20000 + 940
								],
								[
									imageWidth - 90,
									20000 + 970
								]
							]
						];

						var patternsAmount = shadowPositions.length;

						var lastShadow = -1;

						$( this ).before( '<div class="listar-do-cloudify"></div>' );

						$( this ).parent().find( '.listar-do-cloudify' ).each( function () {
							var
								boxShadow = '',
								currentShadow = 0,
								shadowsAmount = 0,
								currentColor = -1,
								currentPatern;

							lastShadow++;

							if ( lastShadow >= patternsAmount ) {
								lastShadow = 0;
							}

							currentPatern = shadowPositions[ lastShadow ];
							shadowsAmount = currentPatern.length;

							for ( currentShadow = 0; currentShadow < shadowsAmount; currentShadow++ ) {
								if ( currentShadow < maxShadowsAmount ) {
									var colorRGBA = '';

									currentColor++;

									if ( currentColor >= colorsAmount ) {
										currentColor = 0;
									}

									colorRGBA = shadowColors[ currentColor ];

									boxShadow += currentPatern[ currentShadow ][0] + 'px ' + currentPatern[ currentShadow ][1] + 'px 1px ' + colorRGBA + ',';
								}
							}

							boxShadow = boxShadow.substring( 0, boxShadow.length - 1 ); /* Remove last comma */

							$( this ).css( { 'box-shadow' : boxShadow } );
						} );
					} );
				} );
			}, 2000 );
		}

		listarFeaturifyElements.each( function () {
			if ( $( this ).find( 'figure' ).length ) {
				var figure = $( this ).find( 'figure' ).eq( 0 );

				if ( figure.offset().left + ( figure.width() / 2 ) < viewport().width / 2 ) {
					$( this ).addClass( 'listar-hidden-featured-left' );
				} else {
					$( this ).addClass( 'listar-hidden-featured-right' );
				}
			}
		} );

		$( '.listar-play-button' ).each( function () {
			$( this ).find( 'a' ).each( function () {
				$( this ).attr( 'data-lity', 'data-lity' );
			} );

			$( this ).find( '.aligncenter,.alignleft,.alignright,.alignwide,.alignfull,.alignnone' ).each( function () {
				$( this ).removeClass( 'aligncenter alignleft alignright alignwide alignfull alignnone' );
			} );

			if ( 'DIV' === $( this ).prop( 'tagName' ) ) {
				$( this ).find( 'figure' ).attr( 'class', $( this ).attr( 'class' ) );
				$( this ).prop( 'outerHTML', $( this ).prop( 'innerHTML' ) );
			}
		} );

		$( '.listar-play-button' ).each( function () {
			var caption = '';

			$( this ).find( 'img' ).each( function () {
				var img = $( this ).attr( 'src' );
				$( this ).css( { 'background-image' : 'url(' + img + ')' } );
				$( this ).parent().prepend( '<div class="listar-play-button-overlay"></div>' );

				/* This is an empty png 1x1px */
				$( this ).attr( 'src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' );
				$( this ).attr( 'srcset', '' );
			} );

			$( this ).find( 'figcaption' ).each( function () {
				caption = $( this ).prop( 'innerHTML' );
				$( this ).prop( 'outerHTML', '' );
				$( this ).attr( 'title', 'Settings' ).attr( 'data-toggle', 'tooltip' ).attr( 'data-placement', 'top' );
			} );

			$( this ).find( 'a' ).each( function () {
				if ( '' !== caption ) {
					$( this ).attr( 'title', caption ).attr( 'data-toggle', 'tooltip' ).attr( 'data-placement', 'top' );
				}
			} );

			$( this ).animate( { opacity: 1 }, { duration: 1000 } );
		} );

		$( '.listar-package-description p' ).each( function () {
			var classes = $( this ).attr( 'class' );

			if ( 'undefined' !== typeof classes ) {
				classes = classes
					.replace( 'icon-', 'listar-has-icon icon-' )
					.replace( 'fa fa', 'listar-has-icon fa fa' );

				$( this ).attr( 'class', classes );
			}
		} );

		if ( 0 === $( '.listar-site-footer .widget' ).length ) {
			$( '.listar-site-footer' ).addClass( 'listar-no-footer-widgets' );
		}

		theBody.addClass( 'listar-loaded' );

		/*xxx */ setTimeout( function () {
			//
		}, 2000 );

		$( '.listar-testimonial-avatar' ).each( function () {
			var html = $( this ).prop( 'outerHTML' );
			$( this ).parents( '.listar-review-items' ).find( '.listar-testimonial-avatars' ).append( html );
			$( this ).prop( 'outerHTML', '' );
		} );

		$( '.listar-testimonial-avatars' ).each( function () {
			if ( $( this ).find( '.listar-testimonial-avatar' ).length ) {
				$( this ).find( '.listar-testimonial-avatar' ).eq( 0 ).addClass( 'current' );
			}
		} );

		$( '.listar-testimonial-items' ).each( function () {
			if ( $( this ).find( '.listar-testimonial-item' ).length ) {
				$( this ).find( '.listar-testimonial-item' ).eq( 0 ).addClass( 'current' ).css( { opacity : 1 } );
			}
		} );

		$( '.listar-front-page-widgetized-section' ).each( function () {
			if ( $( this ).find( '.listar-front-widget-wrapper' ).length ) {
				var lastWidget = $( this ).find( '.listar-front-widget-wrapper' ).last();
				var bgColor = lastWidget.css( 'background-color' );

				if ( 'rgb(255, 255, 255)' === bgColor || '#ffffff' === bgColor ) {
					lastWidget.addClass( 'listar-last-widget-gradient-bg' );
				}
			}
		} );

		$( '.entry-content .listar-badge-masked-container' ).each( function () {
			if ( 'rgb(255, 255, 255)' !== $( this ).parents( '.listar-front-widget-wrapper' ).css( 'background-color' ) && '#ffffff' !== $( this ).parents( '.listar-front-widget-wrapper' ).css( 'background-color' ) ) {
				$( this ).parents( '.listar-section' ).addClass( 'listar-badge-inner-box-shadow' );
			}
		} );

		$( '.listar-back-to-top' ).each( function () {
			var footerDetailLines = $( 'footer .copyright' ).length;

			if ( 1 === footerDetailLines ) {
				$( this ).addClass( 'listar-footer-details-one-line' );
			}
		} );

		$( '.listar-grid-design-2 .listar-card-content' ).each( function () {
			if ( ! $( this ).find( '.listar-listing-address' ).length ) {
				$( this ).addClass( 'listar-no-listing-address' );
			}
		} );

		$( '.listar-footer-navigation-wrapper' ).each( function () {
			if ( ! $( this ).find( 'li' ).length ) {
				$( this ).parents( '.listar-footer-menu-wrapper' ).prop( 'outerHTML', '' );
			}
		} );

		$( '.listar-search-results-count-wrapper.listar-not-found' ).each( function () {
			$( this ).siblings( '.listar-page-header' ).addClass( 'listar-no-results-header' );
		} );

		/*xxxxx */
		
		
		
		
		
		
		
		
		
		
		
		
		

		$( '.entry-content .listar-section-title' ).each( function () {
			if ( $( this ).siblings( '.listar-widget-subtitle' ).length ) {
				var titleContent = '';

				$( this ).removeClass( 'listar-section-title' );
				titleContent = $( this ).parent().prop( 'innerHTML' );

				$( this ).parent().prop( 'innerHTML', '<div class="listar-section-title">' + titleContent + '</div>' );
			}
		} );

		$( '.listar-map-no-title' ).each( function () {
			$( this ).removeClass( 'listar-map-no-title' );
			$( this ).parents( '.widget' ).addClass( 'listar-map-no-title' );
		} );

		$( '.widget_listar_call_to_action' ).each( function () {
			if ( $( this ).find( '.listar-wavy-badge-design' ).length ) {
				$( this ).addClass( 'listar-has-wavy-badge-mask' );
			} else {
				$( this ).addClass( 'listar-no-wavy-badge-mask' );
			}
		} );

		$( '.listar-data-review-popup-background-image' ).each( function () {
			var bgImage = $( this ).attr( 'data-review-popup-background-image' );

			$( '.listar-review-popup .listar-hero-image' ).each( function () {
				$( this ).css( 'background-image', 'url(' + bgImage + ')' );
			} );
		} );

		$( '.listar-user-thumbnail-background-image' ).each( function () {
			var bgImage = $( this ).attr( 'data-user-thumbnail-image' );

			$( '.listar-user-logged .listar-user-login' ).each( function () {
				$( this ).css( 'background-image', 'url(' + bgImage + ')' );
			} );
		} );

		/* Fix for Monster Widget - Remove menu links without a title */

		$( '.widget .dropdown-menu li a' ).each( function () {
			if ( '' === $( this ).prop( 'innerHTML' ) ) {
				$( this ).parent().prop( 'outerHTML', '' );
			}
		} );

		$( '#secondary .listar-term-wrapper .listar-term-description, footer .listar-term-wrapper .listar-term-description' ).each( function () {
			$( this ).prop( 'outerHTML', '' );
		} );

		if ( listingGallery.length ) {
			var countGalleryItems = listingGalleryItems.length;

			if ( 1 === countGalleryItems ) {
				listingGalleryItems.addClass( 'listar-gallery-item-full' );
				listingGallery.addClass( 'listar-single-gallery-item' );
			}
		}

		listingGallery.each( function () {
			var gallery = $( this );
			var galleryLinks = gallery.find( 'a' );

			if ( ! gallery.hasClass( 'listar-gallery-dark' ) ) {
				theBody.addClass( 'listar-listing-gallery-has-light-design' );
			}

			if ( galleryLinks.length > 0 && gallery.hasClass( 'listar-gallery-dark' ) ) {
				$( '#primary' ).addClass( 'listar-current-gallery-is-dark' );
			}

			if ( galleryLinks.length > 0 && gallery.hasClass( 'listar-gallery-dark' ) && ! ( gallery.hasClass( 'listar-gallery-slideshow-squared' ) || gallery.hasClass( 'listar-gallery-slideshow-rounded' ) ) ) {
				var
					headerRating       = $( '.listar-listing-header-topbar-wrapper' ),
					headerRatingHeight = 0,
					headerTitleHeight  = 0,
					galleryHeight      = 0,
					galleryBGHeight    = 0;

				setTimeout( function() {
					if ( headerRating.length ) {
						headerRating
							.addClass( 'listar-header-rating-dark' );

						headerRatingHeight = headerRating.height();
					}

					headerTitleHeight = $( '.listar-listing-title' ).height();
					galleryHeight = gallery.height();

					galleryBGHeight = headerRatingHeight + headerTitleHeight + galleryHeight;

					gallery.parents( '#content' )
						.append( '<div class="listar-listing-gallery-backgrounds"></div>' );

					$( '.listar-listing-gallery-backgrounds' )
						.css( { 'background-image' : 'url(' + galleryLinks.eq( 0 ).attr( 'href' ) + ')', height : galleryBGHeight + 280 } );
				}, 1000 );
			} else {
				gallery
					.addClass( 'listar-section-no-padding-bottom listar-no-gallery-background' );
			}
		} );

		$( '.listar-gallery-tiny-rounded, .listar-gallery-tiny-squared' ).each( function () {
			var gallery = $( this );
			var galleryImages = gallery.find( 'img' );
			var countImages = galleryImages.length;

			if ( countImages > 1 ) {
				galleryImages.eq( 0 ).parents( '.gallery-item' )
					.append( '<div class="listar-listing-gallery-more-images"><div>+' + ( countImages ) + '</div></div>' );
			}

			if ( countImages > 2 ) {
				galleryImages.eq( 1 ).parents( '.gallery-item' )
					.append( '<div class="listar-listing-gallery-more-images"><div>+' + ( countImages - 1 ) + '</div></div>' );
			}

			if ( countImages > 3 ) {
				galleryImages.eq( 2 ).parents( '.gallery-item' )
					.append( '<div class="listar-listing-gallery-more-images"><div>+' + ( countImages - 2 ) + '</div></div>' );
			}

			if ( countImages > 4 ) {
				galleryImages.eq( 3 ).parents( '.gallery-item' )
					.append( '<div class="listar-listing-gallery-more-images"><div>+' + ( countImages - 3 ) + '</div></div>' );
			}

			if ( countImages > 5 ) {
				galleryImages.eq( 4 ).parents( '.gallery-item' )
					.append( '<div class="listar-listing-gallery-more-images"><div>+' + ( countImages - 4 ) + '</div></div>' );
			}
		} );

		$( '.listar-gallery-rounded-boxed, .listar-gallery-squared-boxed' ).each( function () {
			var gallery = $( this );
			var galleryImages = gallery.find( 'img' );
			var countImages = galleryImages.length;

			if ( countImages > 1 ) {
				galleryImages.eq( 0 ).parents( '.gallery-item' )
					.append( '<div class="listar-listing-gallery-more-images"><div>+' + ( countImages ) + '</div></div>' );
			}

			if ( countImages > 2 ) {
				galleryImages.eq( 1 ).parents( '.gallery-item' )
					.append( '<div class="listar-listing-gallery-more-images"><div>+' + ( countImages - 1 ) + '</div></div>' );
			}

			if ( countImages > 3 ) {
				galleryImages.eq( 2 ).parents( '.gallery-item' )
					.append( '<div class="listar-listing-gallery-more-images"><div>+' + ( countImages - 2 ) + '</div></div>' );
			}

			if ( countImages > 4 ) {
				galleryImages.eq( 3 ).parents( '.gallery-item' )
					.append( '<div class="listar-listing-gallery-more-images"><div>+' + ( countImages - 3 ) + '</div></div>' );
			}
		} );

		$( '.listar-gallery-dark' ).each( function () {
			var gallery = $( this );
			var galleryImages = gallery.find( 'a' );
			var countImages = galleryImages.length;

			if ( countImages > 0 ) {
				gallery
					.addClass( 'listar-gallery-has-images' );
			} else {
				gallery
					.addClass( 'listar-gallery-without-images' );
			}
		} );

		/* Fix for bad WordPress paragraph output (text and image in the same paragraph) */

		$( '.entry-content p img, .comment-content p img, article p img' ).each( function () {
			var
				checkInitialText = '',
				initialTextIndex = 0,
				img = $( this ),
				innerHTML = $( this ).parents( 'p' ).prop( 'innerHTML' );

			if ( 'A' === img.parent().prop( 'tagName' ) ) {
				checkInitialText = '<a ';
			} else if ( 'P' === img.parent().prop( 'tagName' ) ) {
				checkInitialText = '<img ';
			}

			initialTextIndex = innerHTML.indexOf( checkInitialText );

			if ( initialTextIndex > 10 ) {

				/* This paragraph has text badly inserted before the image! The image needs margin on top. */
				img.addClass( 'listar-fix-bad-image-insertion-margin' );
			}
		} );

		/* Remove empty paragraphs and fix for bad WordPress paragraph output (wp:paragraph) comming from Gutenberg */

		$( '.entry-content p, article p' ).each( function () {
			var innerHTML = $( this ).prop( 'innerHTML' );
			var innerHTMLWithoutSpaces = innerHTML.replace( /\s+/g, '' );
			var countTags = 0;
			var countGutenbergComments = 0;

			if ( innerHTMLWithoutSpaces.indexOf( '<' ) >= 0 ) {
				countTags = innerHTMLWithoutSpaces.split( '<' ).length - 1;
			}

			if ( innerHTMLWithoutSpaces.indexOf( 'wp:paragraph' ) >= 0 ) {
				countGutenbergComments = innerHTMLWithoutSpaces.split( 'wp:paragraph' ).length - 1;
			}

			if ( ( countGutenbergComments > 0 && ( countTags === countGutenbergComments ) ) || 0 === innerHTMLWithoutSpaces.length ) {
				$( this ).prop( 'outerHTML', '' );
			} else if ( innerHTMLWithoutSpaces.indexOf( 'wp:paragraph' ) >= 0 && 0 === $( this ).index() ) {
				$( this ).addClass( 'listar-fix-first-wp-paragraph' );
			}
		} );

		/* Remove the margin-bottom from last element on articles */

		$( 'article > *:last-child' ).each( function () {
			var elem = $( this );

			if ( elem.hasClass( 'listar-clear-both' ) ) {
				if ( elem.prev().length ) {
					if ( elem.prev().hasClass( 'listar-clear-both' ) ) {
						if ( elem.prev().prev().length ) {
							if ( ! elem.prev().prev().hasClass( 'listar-section' ) ) {
								elem.prev().prev().addClass( 'listar-remove-last-margin-bottom' );
							}
						} else {
							if ( ! elem.prev().hasClass( 'listar-section' ) ) {
								elem.prev().addClass( 'listar-remove-last-margin-bottom' );
							}
						}
					} else {
						if ( ! elem.prev().hasClass( 'listar-section' ) ) {
							elem.prev().addClass( 'listar-remove-last-margin-bottom' );
						}
					}
				}
			} else {
				if ( ! elem.hasClass( 'listar-section' ) ) {
					elem.addClass( 'listar-remove-last-margin-bottom' );
				}
			}
		} );

		$( '.listar-listing-description-content .listar-open-or-closed.listar-listing-open' ).each( function () {
			$( this ).prop( 'innerHTML', $( this ).attr( 'data-short-open' ) );
		} );

		$( '.listar-listing-description-content .listar-open-or-closed.listar-listing-closed' ).each( function () {
			$( this ).prop( 'innerHTML', $( this ).attr( 'data-short-closed' ) );
		} );

		$( '.listar-listing-header-website-button' ).each( function () {
			var theButton = $( this );

			if ( $( '.listar-listing-website a' ).length ) {
				theButton.attr( 'href', $( '.listar-listing-website a' ).attr( 'href' ) );
			} else {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			}
		} );

		$( '.listar-listing-share-button' ).each( function () {
			var theButton = $( this );

			if ( ! $( '.listar-social-share-popup' ).length ) {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			}
		} );

		$( '.listar-listing-header-gallery-button' ).each( function () {
			var theButton = $( this );
			var elementsCount = $( '.listar-listing-gallery .gallery-item' ).length;

			if ( elementsCount < 1 ) {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			} else {
				theButton.find( '.listar-rating-count' ).prop( 'innerHTML', '(' + elementsCount + ')' );
			}
		} );

		/*xxx */ 
		
		
		
		
		
		
		

		$( '.listar-listing-header-call-button' ).each( function () {
			var theButton = $( this );
			var phoneNumber = '';
			var numberPattern = /\d+/g;
			var phoneNumberTest;

			var phoneContainer  = $( '.listar-listing-phone' );
			var mobileContainer = $( '.listar-listing-mobile.listar-listing-only-mobile' );

			if ( phoneContainer.length && ! theBody.hasClass( 'listar-phone-online-call-disable' ) ) {
				phoneNumber = phoneContainer.prop( 'innerHTML' ).replace( /\s+/g, '' ).replace( /(<([^>]+)>)/gi, '' );
			} else if ( mobileContainer.length && ! theBody.hasClass( 'listar-mobile-online-call-disable' ) ) {
				phoneNumber = mobileContainer.prop( 'innerHTML' ).replace( /\s+/g, '' ).replace( /(<([^>]+)>)/gi, '' );
			} else if ( $( '.listar-listing-mobile.listar-listing-whatsapp' ).length && ! theBody.hasClass( 'listar-whatsapp-online-call-disable' ) ) {
				var tempPhone = $( '.listar-listing-mobile.listar-listing-whatsapp' ).clone();

				if ( tempPhone.find( 'span' ).length ) {
					tempPhone.find( 'span' ).prop( 'outerHTML', '' );
				}

				phoneNumber = tempPhone.prop( 'innerHTML' ).replace( /\s+/g, '' ).replace( /(<([^>]+)>)/gi, '' );
			} else {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			}

			phoneNumber = validatePhoneCharactersString( phoneNumber );

			if( '' !== phoneNumber ) {
				phoneNumberTest = phoneNumber.match( numberPattern ).join([]);

				if( '' !== phoneNumberTest ) {
					theButton.attr( 'href', 'tel:' + phoneNumber );
				} else {
					theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
				}
			}

			if ( phoneContainer.length && ! theBody.hasClass( 'listar-phone-online-call-disable' ) ) {
				phoneNumber = phoneContainer.prop( 'innerHTML' ).replace( /\s+/g, '' ).replace( /(<([^>]+)>)/gi, '' );
				phoneNumberTest = phoneNumber.match( numberPattern ).join([]);

				if( '' !== phoneNumberTest ) {
					phoneContainer.prop( 'innerHTML', '<a class="listar-callable-phone-number-active" href="tel:' +  phoneNumber + '">' + phoneContainer.prop( 'innerHTML' ).replace( /(<([^>]+)>)/gi, '' ) + '</a>' );
				}
			}

			if ( mobileContainer.length && ! theBody.hasClass( 'listar-mobile-online-call-disable' ) ) {
				phoneNumber = mobileContainer.prop( 'innerHTML' ).replace( /(<([^>]+)>)/gi, '' ).replace( /\s+/g, '' ).replace( /(<([^>]+)>)/gi, '' );
				phoneNumberTest = phoneNumber.match( numberPattern ).join([]);

				if( '' !== phoneNumberTest ) {
					mobileContainer.prop( 'innerHTML', '<a class="listar-callable-phone-number-active" href="tel:' +  phoneNumber + '">' + mobileContainer.prop( 'innerHTML' ).replace( /(<([^>]+)>)/gi, '' ) + '</a>' );
				}
			}
		} );

		if ( ! theBody.hasClass( 'listar-whatsapp-online-call-disable' ) ) {
			$( '.listar-listing-mobile.listar-listing-whatsapp' ).each( function () {
				var theButton = $( this );
				var phoneNumber = '';
				var numberPattern = /\d+/g;

				var tempPhone = $( this ).clone();

				if ( tempPhone.find( 'span' ).length ) {
					tempPhone.find( 'span' ).prop( 'outerHTML', '' );
				}

				phoneNumber = tempPhone.prop( 'innerHTML' ).replace( /(<([^>]+)>)/gi, '' );

				phoneNumber = validatePhoneCharactersString( phoneNumber ).replace( /[^\w]/gi, '' );

				if( '' !== phoneNumber ) {
					var phoneNumberTest = phoneNumber.match( numberPattern ).join([]);

					if( '' !== phoneNumberTest ) {
						var dataSiteName = $( this ).attr( 'data-site-name' );
						var dataURL = $( this ).attr( 'data-company-url' );
						var dataTitle = $( this ).attr( 'data-company-title' );
						var whatsAppLink = 'https://wa.me/' + phoneNumber + '?text=' + dataSiteName + '+-+' + dataTitle + '+-+' + dataURL.replace( 'http://', '' ).replace( 'https://', '' );
						theButton.prop( 'innerHTML', '<a class="listar-whatsapp-number-active" target="blank" href="' + whatsAppLink + '">' + theButton.prop( 'innerHTML' ).replace( /(<([^>]+)>)/gi, '' ).replace( '(WhatsApp)', '' ) + '<span class="listar-phone-has-icon"><span>(WhatsApp)</span></span></a>'  );

						$( '.listar-listing-header-whatsapp-button' ).each( function () {
							theButton = $( this );

							theButton.attr( 'href', whatsAppLink );
							theButton.attr( 'target', '_blank' );
						} );
					}
				}
			} );
		}

		if ( theBody.hasClass( 'listar-whatsapp-online-call-disable' ) || 0 === $( '.listar-listing-mobile.listar-listing-whatsapp' ).length ) {
			$( '.listar-listing-header-whatsapp-button' ).each( function () {
				var theButton = $( this );
				theButton.prop( 'outerHTML', '' );
			} );
		}

		$( '.listar-listing-header-message-button' ).each( function () {
			var theButton = $( this );

			if ( 0 === $( '.listar-private-message-accordion' ).length ) {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			}
		} );

		$( '.listar-listing-header-references-button' ).each( function () {
			var theButton = $( this );

			if ( 0 === $( '.listar-listing-more-info-accordion' ).length ) {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			}
		} );

		$( '.listar-listing-header-catalog-button' ).each( function () {
			var theButton = $( this );

			if ( 0 === $( '.listar-listing-menu-accordion' ).length ) {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			} else {
				var menuLabel = $( '.listar-listing-menu-accordion' ).find( '.panel-heading a' ).prop( 'innerHTML' );

				$( this ).find( '.listar-listing-header-topbar-item-label' ).prop( 'innerHTML', menuLabel );
			}
		} );

		$( '.listar-listing-header-hours-button' ).each( function () {
			var theButton = $( this );

			if ( 0 === $( '.listar-business-hours-accordion' ).length ) {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			}
		} );

		$( '.listar-listing-header-video-button' ).each( function () {
			var theButton = $( this );

			if ( 0 === $( '.listar-business-video-accordion' ).length ) {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			} else {
				var menuLabel = $( '.listar-business-video-accordion' ).find( '.panel-heading a .listar-accordion-title-inner' ).prop( 'innerHTML' );

				$( this ).find( '.listar-listing-header-topbar-item-label' ).prop( 'innerHTML', menuLabel );
			}
		} );

		$( '.listar-listing-header-booking-button' ).each( function () {
			var theButton = $( this );

			if ( 0 === $( '.listar-business-booking-accordion' ).length ) {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			}
		} );

		$( '.listar-listing-header-directions-button' ).each( function () {
			var theButton  = $( this );
			var theButton2 = $( '.listar-map-button-directions' );
			var theButton3 = $( '.listar-listing-header-coordinates-button' );

			if ( 1 === listarMapMarkers.length ) {
				var mapMarker = listarMapMarkers[0];

				if ( 'undefined' !== typeof mapMarker.lat && 'undefined' !== typeof mapMarker.lng ) {
					theButton.attr( 'href', 'http://maps.google.com/maps?daddr=' + mapMarker.lat + '%2C' + mapMarker.lng );

					if ( theButton2.length ) {
						theButton2.attr( 'href', 'http://maps.google.com/maps?daddr=' + mapMarker.lat + '%2C' + mapMarker.lng );
					}

					if ( 0 === $( '.listar-listing-map' ).length || 0 === $( '.listar-map-button-coordinates-link' ).length ) {
						theButton3.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
					}
				} else {
					theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
                                        theButton2.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
					theButton3.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
				}
			} else {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
                                theButton2.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
				theButton3.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			}
		} );

		$( '.listar-listing-header-coordinates-button' ).each( function () {
			var theButton = $( this );

			if ( 0 === $( '.listar-listing-map' ).length || 0 === $( '.listar-map-button-coordinates-link' ).length ) {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			}
		} );

		$( '.listar-listing-header-similar-button' ).each( function () {
			var theButton  = $( this );
			var theButton2 = $( '.listar-map-button-find-similar-link' );

			if ( theButton2.length ) {
				theButton.attr( 'href', theButton2.eq( 0 ).attr( 'href' ) );
			} else {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			}
		} );

		$( '.nav .menu-item a' ).each( function () {
			$( this ).attr( 'data-menu-item-title', $( this ).text().toLowerCase() );
		} );

		if ( ! $( '.listar-post-comments-wrapper' ).length ) {
			if ( $( '.listar-comments-section' ).length ) {
				$( '.listar-comments-section' ).prop( 'outerHTML', '' );
			}
		}

		/* Add asterisk for required fields on listing submission form */

		/* xxxxx */ 
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

		

		/* xxx */ 
		
		
		
		
		
		
		

		/*xxx */
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

		/* Always keep custom CSS from listar after everything, even under Autoptimize criterea */

		$( 'style' ).each( function () {
			var styleInnerHTML = false;

			if ( 'string' === typeof $( this ).prop( 'innerHTML' ) ) {
				styleInnerHTML = $( this ).prop( 'innerHTML' );

				if (
					styleInnerHTML.indexOf( '.page-template-front-page .listar-widget-subtitle' ) >= 0 &&
					styleInnerHTML.indexOf( '.listar-card-content-title,.entry-content .listar-card-content-title,' ) >= 0 &&
					styleInnerHTML.indexOf( '#page .listar-hero-section-title h1 span span' ) >= 0
				) {
					customListarStyle = $( this );
				}
			}
		} );

		if ( false !== customListarStyle ) {
			var lastStyle = $( 'style' ).last();
			var lastLink  = $( 'link' ).last();

			var lastStyleIndex = getElementIndex( lastStyle.prop( 'outerHTML' ) );
			var lastLinkIndex = getElementIndex( lastLink .prop( 'outerHTML' ) );

			var lastStyleTagIndex = Math.max( lastStyleIndex, lastLinkIndex );

			if ( getElementIndex( customListarStyle.prop( 'outerHTML' ) ) < lastStyleTagIndex ) {
				var customListarStyleInnerHTML = customListarStyle.prop( 'outerHTML' );

				lastStyle.after( customListarStyleInnerHTML );
				customListarStyle.prop( 'outerHTML', '' );
			}
		}

		/* Reorder WP Job Manager fields */

		var fieldsetDOM = '';
		var fieldsetContent = '';

		$( '.fieldset-job_business_use_hours' ).each( function () {
			if ( $( '.fieldset-job_description' ).length ) {
				fieldsetDOM = $( this );
				fieldsetContent = fieldsetDOM.prop( 'outerHTML' );
				fieldsetDOM.prop( 'outerHTML', '' );
				$( '.fieldset-job_description' ).after( fieldsetContent );
			}
		} );

		$( '.fieldset-job_business_use_custom_excerpt' ).each( function () {
			if ( $( '.fieldset-job_description' ).length ) {
				fieldsetDOM = $( this );
				fieldsetContent = fieldsetDOM.prop( 'outerHTML' );
				fieldsetDOM.prop( 'outerHTML', '' );
				$( '.fieldset-job_description' ).after( fieldsetContent );
			}
		} );

		$( '.fieldset-job_business_custom_excerpt' ).each( function () {
			if ( $( '.fieldset-job_business_use_custom_excerpt' ).length ) {
				fieldsetDOM = $( this );
				fieldsetContent = fieldsetDOM.prop( 'outerHTML' );
				fieldsetDOM.prop( 'outerHTML', '' );
				$( '.fieldset-job_business_use_custom_excerpt' ).after( fieldsetContent );
			}
		} );

		$( '.fieldset-job_business_use_products' ).each( function () {
			if ( $( '.fieldset-job_business_products_label' ).length ) {
				fieldsetDOM = $( this );
				fieldsetContent = fieldsetDOM.prop( 'outerHTML' );
				fieldsetDOM.prop( 'outerHTML', '' );
				$( '.fieldset-job_business_products_label' ).before( fieldsetContent );
			}
		} );

		$( '.fieldset-job_business_use_catalog' ).each( function () {
			if ( $( '.fieldset-job_business_catalog_label' ).length ) {
				fieldsetDOM = $( this );
				fieldsetContent = fieldsetDOM.prop( 'outerHTML' );
				fieldsetDOM.prop( 'outerHTML', '' );
				$( '.fieldset-job_business_catalog_label' ).before( fieldsetContent );
			}
		} );

		$( '.fieldset-job_business_use_booking' ).each( function () {
			if ( $( '.fieldset-job_business_booking_label' ).length ) {
				fieldsetDOM = $( this );
				fieldsetContent = fieldsetDOM.prop( 'outerHTML' );
				fieldsetDOM.prop( 'outerHTML', '' );
				$( '.fieldset-job_business_booking_label' ).before( fieldsetContent );
			}
		} );

		$( '.fieldset-job_business_use_catalog_documents' ).each( function () {
			if ( $( '.fieldset-job_business_document_1_title' ).length ) {
				fieldsetDOM = $( this );
				fieldsetContent = fieldsetDOM.prop( 'outerHTML' );
				fieldsetDOM.prop( 'outerHTML', '' );
				$( '.fieldset-job_business_document_1_title' ).before( fieldsetContent );
			}
		} );

		$( '.fieldset-job_business_use_catalog_external' ).each( function () {
			if ( $( '.fieldset-job_business_document_1_title_external' ).length ) {
				fieldsetDOM = $( this );
				fieldsetContent = fieldsetDOM.prop( 'outerHTML' );
				fieldsetDOM.prop( 'outerHTML', '' );
				$( '.fieldset-job_business_document_1_title_external' ).before( fieldsetContent );
			}
		} );

		$( '.fieldset-job_business_use_social_networks' ).each( function () {
			if ( $( '.fieldset-company_facebook' ).length ) {
				fieldsetDOM = $( this );
				fieldsetContent = fieldsetDOM.prop( 'outerHTML' );
				fieldsetDOM.prop( 'outerHTML', '' );
				$( '.fieldset-company_facebook' ).before( fieldsetContent );
			}
		} );

		$( '.fieldset-job_business_use_external_links' ).each( function () {
			if ( $( '.fieldset-company_external_link_1' ).length ) {
				fieldsetDOM = $( this );
				fieldsetContent = fieldsetDOM.prop( 'outerHTML' );
				fieldsetDOM.prop( 'outerHTML', '' );
				$( '.fieldset-company_external_link_1' ).before( fieldsetContent );
			}
		} );

		

		/* xxx */
		
		
		
		
		
		

		/* xxx*/
		
		
		
		
		
		
		
		

		/* xxxx */ 
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

		if ( theBody.hasClass( 'single-job_listing' ) ) {
			updateOperatingHoursAndAvailability();
		}

		if ( viewport().width < 378 ) {
			$( '.listar-term-description' ).each( function () {
				$( this ).prop( 'outerHTML', '' );
			} );
		}

		if ( singleContent.length <= 1 ) {
			theBody.addClass( 'listar-post-without-content' );
		}

		if ( 2 === singleContent.length && viewport().width > 480 ) {
			if ( singleContent.eq( 0 ).height() < 45 ) {
				if ( 0 === $( '.listar-single-tags' ).length ) {
					theBody.addClass( 'listar-fix-single-post-section' );
				}
			}
		}

		/* xxxx */
		if ( singleContent.length > 1 && singleheaderBackgroundWrapper.length ) {
			elemToTest = $( '.listar-single-content > *' ).eq( 0 );

			if ( elemToTest.hasClass( 'alignwide' ) || elemToTest.hasClass( 'alignfull' ) ) {
				theBody.addClass( 'listar-shrink-single-header-background' );
			}
		}

		if ( singleContent.length > 2 && singleheaderBackgroundWrapper.length ) {
			elemToTest = $( '.listar-single-content > *' ).eq( 1 );

			if ( elemToTest.hasClass( 'alignwide' ) || elemToTest.hasClass( 'alignfull' ) ) {
				elemPosition   = getElemDistance( elemToTest );
				headerPosition = getElemDistance( $( '.listar-post-content-header-background-wrapper' ).eq( 0 ) );
				diffHeaderPosition = elemPosition - headerPosition;

				if ( diffHeaderPosition < 200 && diffHeaderPosition !== 0 ) {
					theBody.addClass( 'listar-shrink-single-header-background' );
				}
			}
		}

		if ( singleContent.length > 3 && singleheaderBackgroundWrapper.length ) {
			elemToTest = $( '.listar-single-content > *' ).eq( 2 );

			if ( elemToTest.hasClass( 'alignwide' ) || elemToTest.hasClass( 'alignfull' ) ) {
				elemPosition   = getElemDistance( elemToTest );
				headerPosition = getElemDistance( $( '.listar-post-content-header-background-wrapper' ).eq( 0 ) );
				diffHeaderPosition = elemPosition - headerPosition;

				if ( diffHeaderPosition < 200 && diffHeaderPosition !== 0 ) {
					theBody.addClass( 'listar-shrink-single-header-background' );
				}
			}
		}

		if ( singleContent.length > 4 && singleheaderBackgroundWrapper.length ) {
			elemToTest = $( '.listar-single-content > *' ).eq( 3 );

			if ( elemToTest.hasClass( 'alignwide' ) || elemToTest.hasClass( 'alignfull' ) ) {
				elemPosition   = getElemDistance( elemToTest );
				headerPosition = getElemDistance( $( '.listar-post-content-header-background-wrapper' ).eq( 0 ) );
				diffHeaderPosition = elemPosition - headerPosition;

				if ( diffHeaderPosition < 200 && diffHeaderPosition !== 0 ) {
					theBody.addClass( 'listar-shrink-single-header-background' );
				}
			}
		}

		if ( singleContent.length > 5 && singleheaderBackgroundWrapper.length ) {
			elemToTest = $( '.listar-single-content > *' ).eq( 4 );

			if ( elemToTest.hasClass( 'alignwide' ) || elemToTest.hasClass( 'alignfull' ) ) {
				elemPosition   = getElemDistance( elemToTest );
				headerPosition = getElemDistance( $( '.listar-post-content-header-background-wrapper' ).eq( 0 ) );
				diffHeaderPosition = elemPosition - headerPosition;

				if ( diffHeaderPosition < 200 && diffHeaderPosition !== 0 ) {
					theBody.addClass( 'listar-shrink-single-header-background' );
				}
			}
		}

		if ( singleContent.length > 6 && singleheaderBackgroundWrapper.length ) {
			elemToTest = $( '.listar-single-content > *' ).eq( 5 );

			if ( elemToTest.hasClass( 'alignwide' ) || elemToTest.hasClass( 'alignfull' ) ) {
				elemPosition   = getElemDistance( elemToTest );
				headerPosition = getElemDistance( $( '.listar-post-content-header-background-wrapper' ).eq( 0 ) );
				diffHeaderPosition = elemPosition - headerPosition;

				if ( diffHeaderPosition < 200 && diffHeaderPosition !== 0 ) {
					theBody.addClass( 'listar-shrink-single-header-background' );
				}
			}
		}

		$( '.single-job_listing .job_listing > section:last-child' ).removeClass( 'listar-section-no-padding-bottom' );

		checkFillerButtonBlog();

		$( '#sbi_mod_error' ).each( function () {
			$( this ).append( '<br/><p class="listar-error-sbi-caps"><b>' + listarLocalizeAndAjax.clickHere + '</b></p>' );
			$( this ).append( '<a class="listar-error-sbi-admin-link" href="' + listarSiteURL + '/wp-admin/admin.php?page=sb-instagram-feed' + '" target="_blank"></a>' );
		} );

		pageBGColor = pageBGColor.replace( 'rgb(', '' ).replace( ')', '' );
		pageBGColor = pageBGColor.split( ',' );

		if ( tooLightColor( pageBGColor, 250 ) ) {
			theBody.addClass( 'listar-empty-background-color' );
		}

		/* Fix for WP Instant Feeds (Instagram) plugin */

		if ( 'undefined' !== typeof wpMyInstagramVars ) {
			setTimeout( function () {
				fixInstagramFeed();
			}, 3000 );
		}

		captureCurrentViewportHeight();

		executeAfterLoad();

		fixPopupHeights();

		/* General events *********************************************/                

                /* Disables iphone viewport zoom when showing virtual keyboard */

                theBody.on( 'click touch mousedown touchmove touchstart mouseenter change', 'input, textarea, .select2-search__field, .select2-search, .select2-search--inline, .select2-selection--multiple', function (){
                        var inputElem = $( this );

                        if ( isMobile() ) {
                                inputElem.addClass( 'listar-forced-font-size' );

                                inputElem.find( 'input, textarea' ).each( function () {
                                        $( this ).addClass( 'listar-forced-font-size' );
                                } );

                                setTimeout( function () {
                                        inputElem.removeClass( 'listar-forced-font-size' );

                                        inputElem.find( 'input, textarea' ).each( function () {
                                                $( this ).removeClass( 'listar-forced-font-size' );
                                        } );
                                }, 500 );
                        }
                } );
				
		$( theBody ).on( 'click', '.listar-booking-nav-next', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '.listar-booking-slide.current' ).each( function () {
				$( this ).removeClass( 'current' ).addClass( 'hidden' );

				if ( $( this ).next().length ) {
					$( this ).next().addClass( 'current' ).removeClass( 'hidden' );
				} else {
					$( this ).parent().find( '.listar-booking-slide' ).eq( 0 ).addClass( 'current' ).removeClass( 'hidden' );
				}
			} );
		} );
				
		$( theBody ).on( 'click', '.listar-booking-nav-prev', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '.listar-booking-slide.current' ).each( function () {
				$( this ).removeClass( 'current' ).addClass( 'hidden' );

				if ( $( this ).prev().length ) {
					$( this ).prev().addClass( 'current' ).removeClass( 'hidden' );
				} else {
					$( this ).parent().find( '.listar-booking-slide:last-child' ).addClass( 'current' ).removeClass( 'hidden' );
				}
			} );
		} );
		
		$( theBody ).on( 'click', '.listar-rich-media-add-item', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			richMediaFieldsetAppend();
			mediaLengthVerification();
		} );
		
		$( theBody ).on( 'click', '.listar-more-regions-button-widget', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
			
			forceTermClick = true;
			
			populateTermPopups( 'regions' );
			resetOwlCarousel( $( '.listar-listing-regions-popup .listar-carousel-loop.listar-use-carousel' ) );
			initOwlCarousel( $( '.listar-listing-regions-popup .listar-carousel-loop.listar-use-carousel' ) );
			stopScrolling( 1 );

			$( '.listar-listing-regions-popup' ).addClass( 'listar-showing-regions' ).css( { left : 0, opacity : 1 } );
		} );
		
		$( theBody ).on( 'click', '.listar-more-categories-button-widget', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
			
			forceTermClick = false;

			populateTermPopups( 'categories' );
			resetOwlCarousel( $( '.listar-listing-categories-popup .listar-carousel-loop.listar-use-carousel' ) );
			initOwlCarousel( $( '.listar-listing-categories-popup .listar-carousel-loop.listar-use-carousel' ) );
			stopScrolling( 1 );

			$( '.listar-listing-categories-popup' ).addClass( 'listar-showing-categories' ).css( { left : 0, opacity : 1 } );
		} );

		$( theBody ).on( 'click', 'a', function ( e ) {
			if ( $( this )[0].hasAttribute( 'href' ) ) {
				var linkHref = $( this ).attr( 'href' );

				if ( linkHref.indexOf( '#' ) >=0 ) {
					var linkAnchor = linkHref.split( '#' );
					linkAnchor = linkAnchor[1];
					checkLinkAnchor( linkAnchor, e );
				}
			}
		} );

		$( theBody ).on( 'click', '.listar-get-geolocated', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var geoBt = $( this );

			isNearestMeReload = true;

			geoBt.removeClass( 'fa-scrubber' ).addClass( 'fa-circle-notch fa-spin' );

			setTimeout( function () {
				setTimeout( function () {
					geoBt.removeClass( 'fa-circle-notch fa-spin' ).addClass( 'fa-scrubber' );
				}, 6000 );

				var tempTest = tryNearestMePopup( true );

				nearestHash = geoBt.parents( 'article' ).attr( 'id' );

				if ( true === tempTest[0] ) {
					$( '.listar-submit-geolocation-data' ).each( function () {
						$( this )[0].click();
					} );
				}
			}, 1000 );
		} );

		theBody.on( 'click', '.listar-submit-geolocation-data', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '#listar-geolocation-form input.required' ).each( function () {
				if ( '' === $( this ).val() || undefined === $( this ).val() ) {
					$( this ).addClass( 'listar-empty-required-field' );
				} else {
					$( this ).removeClass( 'listar-empty-required-field' );
				}
			} );

			if ( 0 === $( '#listar-geolocation-form input.listar-empty-required-field' ).length ) {

				$( this ).prop( 'innerHTML', $( this ).attr( 'data-loading-text' ) );

				/* Start the conclusive AJAX request to save user geolocated data in PHP session */

				var geoAddress = $( '#listar_geolocated_data_address' ).val();
				var geoNumber = $( '#listar_geolocated_data_number' ).val();
				var geoRegion = $( '#listar_geolocated_data_region' ).val();
				var geoCountry = $( '#listar_geolocated_data_country' ).val();
				var geoLat = $( '#listar_geolocated_data_latitude' ).val();
				var geoLng = $( '#listar_geolocated_data_longitude' ).val();

				geoAddress = 'string' === typeof geoAddress ? geoAddress : '';
				geoNumber = 'string' === typeof geoNumber ? geoNumber : '';
				geoRegion = 'string' === typeof geoRegion ? geoRegion : '';
				geoCountry = 'string' === typeof geoCountry ? geoCountry : '';
				geoLat = 'string' === typeof geoLat ? geoLat : '';
				geoLng = 'string' === typeof geoLng ? geoLng : '';
				
				saveGeolocationDetails( geoLat, geoLng, geoAddress, geoNumber, geoRegion, geoCountry, 'address-save' );
			}
		} );

		theBody.on( 'click', '.listar-listing-phone a, .listar-listing-mobile a', function ( e ) {
			var outerPhoneData = $( this ).prop( 'outerHTML' );

			if ( outerPhoneData.indexOf( '1231234567' ) >= 0 ) {
				if ( outerPhoneData.indexOf( 'wa.me' ) >= 0 ) {
					setTimeout( function () {
						alert( listarLocalizeAndAjax.testingDemoPhone );
					}, 100 );
				} else {
					alert( listarLocalizeAndAjax.testingDemoPhone );
				}
			}
		} );

		theBody.on( 'focus click', '.listar-listing-search-input-field', function () {
			isBrowsingSearchMenu = true;

			var searchMenu = $( this ).parents( '.listar-hero-search-wrapper' ).find( '.listar-is-search-menu' );

			searchMenu.each( function () {
				$( this ).removeClass( 'hidden' );
				$( '.listar-search-categories.listar-categories-fixed-bottom' ).addClass( 'hidden' );

				var compensateScroll = 110;
				var compensateScrollDevice = viewport().width < 500 ? -40 : 0;
				var compensationLogged = 150;

				if ( theBody.hasClass( 'listar-user-not-logged' ) ) {
					compensationLogged = 120;
				}

				$( '.listar-search-popup .listar-hero-section-title' ).addClass( 'listar-reduce-hero-title' );

				if ( ! avoidSearchScroll ) {
					htmlAndBody.stop().animate( { scrollTop : ( $( this ).offset().top - compensateScroll + compensateScrollDevice - compensationLogged ) }, 200);
				}
			} );

			setTimeout( function () {
				isBrowsingSearchMenu = false;
			}, 350 );
		} );

		theBody.on( 'click', '.listar-listing-card .listar-floating-card-icons-h, .listar-listing-card .listar-floating-card-icons-h *, .listar-listing-card .listar-trending-icon', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( this ).parents( '.listar-card-content' ).find( '.listar-card-link' ).each( function () {
				$( this )[0].click();
			} );
		} );

		theBody.on( 'click', '.listar-trending-flag-single.listar-trending-icon', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
		} );

		theBody.on( 'click', '.listar-search-highlight-tip-inner', function () {
			$( this ).parents( '.listar-hero-search-wrapper' ).find( '.listar-listing-search-input-field' ).each( function () {
				$( this )[0].click();
				$( this )[0].focus();
			} );
		} );


		/*xxx */
		loadingClick = true;
		

		theBody.on( 'click', '.listar-listing-search-menu-wrapper, .listar-listing-search-menu-wrapper *', function () {
			if ( ! preventReclick ) {
				isBrowsingSearchMenu = true;
				preventReclick = true;

				setTimeout( function () {
					preventReclick = false;
					isBrowsingSearchMenu = false;
				}, 350 );
			}
		} );

		$( theBody ).on( 'click', function () {
			setTimeout( function () {
				if ( ! isBrowsingSearchMenu ) {
					ajaxSerchNoResults();
					unhideSearchMenu();
					hideListingSearchMenu();

				}
			}, 30 );
		} );

		theBody.on( 'click', '.listar-submit-claim', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '#listar-claim-form textarea.required' ).each( function () {
				if ( dataMinimumClaimTextChars > 0 && requiredClaimCharsField.length ) {
					var missingClaimTextChars = parseInt( $( '.listar-claim-missing-chars' ).prop( 'innerHTML' ), 10 );

					if ( 0 !== missingClaimTextChars ) {
						$( this ).addClass( 'listar-empty-required-field' );
					} else {
						$( this ).removeClass( 'listar-empty-required-field' );
					}
				} else {
					$( this ).removeClass( 'listar-empty-required-field' );
				}
			} );

			if ( 0 === $( '#listar-claim-form textarea.listar-empty-required-field' ).length ) {

				$( this ).prop( 'innerHTML', $( this ).attr( 'data-loading-text' ) );

				/* Start the conclusive AJAX request to save data in PHP session */

				sendClaimVerificationText();
			}
		} );

		theBody.on( 'click', '.listar-listing-regions-popup .listar-featured-listing-term-item', function ( e ) {
			if ( $( this ).parents( '.owl-stage' ).length ) {
				if ( $( this ).parents( '.owl-item' ).length ) {

					if ( ! $( this ).parents( '.owl-item' ).hasClass( 'active' ) ) {
						disableRegionSelector = true;

						setTimeout( function () {
							disableRegionSelector = false;
						}, 10 );
					}
				}
			}
		} );

		/* Ajax search */

		$( theBody ).on( 'click', '.listar-searching-ajax-results', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var elemen = $( this );

			avoidSearchScroll = true;

			$( '.listar-listing-search-input-field' ).val( '' );

			elemen.parents( '.listar-hero-search-wrapper' ).find( '.listar-listing-search-input-field' ).each( function () {
				$( this )[0].click();
				$( this )[0].focus();
			} );

			setTimeout( function () {
				avoidSearchScroll = false;
			}, 100 );
		} );

		var doingAjaxSearch = false;

		$( theBody ).on( 'keyup', '.listar-listing-search-input-field', function () {
			var ajaxSearchField = $( this );
			var theForm = $( this ).parents( 'form' );

			var searchMenu = $( this ).parents( '.listar-hero-search-wrapper' ).find( '.listar-is-search-menu' );
			var ajaxMenu = $( this ).parents( '.listar-hero-search-wrapper' ).find( '.listar-ajax-search' );

			if ( ! searchMenu.length ) {
				if ( ajaxMenu.length && '' !== ajaxSearchField.val() ) {
					$( '.listar-search-categories.listar-categories-fixed-bottom' ).addClass( 'hidden' );

					setTimeout( function () {
						$( '.listar-search-categories.listar-categories-fixed-bottom' ).addClass( 'hidden' );
					}, 400 );
				} else {
					setTimeout( function () {
						$( '.listar-search-categories.listar-categories-fixed-bottom' ).removeClass( 'hidden' );
					}, 400 );
				}
			}

			if ( ! doingAjaxSearch ) {
				doingAjaxSearch = true;

				setTimeout( function () {
					var
						ajaxS = ajaxSearchField,
						ajaxPostType = theForm.find( 'input[name="post_type"]' ),
						ajaxSearchType = theForm.find( 'input[name="search_type"]' ),
						ajaxListingSort = theForm.find( 'input[name="listing_sort"]' ),
						ajaxExploreBy = theForm.find( 'input[name="explore_by"]' ),
						ajaxSelectedCountry = theForm.find( 'input[name="selected_country"]' ),
						ajaxSavedAddress = theForm.find( 'input[name="saved_address"]' ),
						ajaxSavedPostcode = theForm.find( 'input[name="saved_postcode"]' ),
						ajaxListingRegions = theForm.find( 'input[name="listing_regions"]' ),
						ajaxListingCategories = theForm.find( 'input[name="listing_categories"]' ),
						ajaxlistingAmenities = theForm.find( 'input[name="listing_amenities"]' );

					/* Get values from fields */

					if ( ajaxS.length ) {
						ajaxS.each( function () {
							ajaxS = $( this ).val();
						} );

						if ( 'string' !== typeof ajaxS || undefined === ajaxS || 'undefined' === ajaxS || 'NaN' === ajaxS ) {
							ajaxS = '';
						}
					} else {
						ajaxS = '';
					}

					if ( ajaxPostType.length ) {
						ajaxPostType.each( function () {
							ajaxPostType = $( this ).val();
						} );

						if ( 'string' !== typeof ajaxPostType || undefined === ajaxPostType || 'undefined' === ajaxPostType || 'NaN' === ajaxPostType ) {
							ajaxPostType = '';
						}
					} else {
						ajaxPostType = '';
					}

					if ( ajaxSearchType.length ) {
						ajaxSearchType.each( function () {
							ajaxSearchType = $( this ).val();
						} );

						if ( 'string' !== typeof ajaxSearchType || undefined === ajaxSearchType || 'undefined' === ajaxSearchType || 'NaN' === ajaxSearchType ) {
							ajaxSearchType = '';
						}
					} else {
						ajaxSearchType = '';
					}

					if ( ajaxListingSort.length ) {
						ajaxListingSort.each( function () {
							ajaxListingSort = $( this ).val();
						} );

						if ( 'string' !== typeof ajaxListingSort || undefined === ajaxListingSort || 'undefined' === ajaxListingSort || 'NaN' === ajaxListingSort ) {
							ajaxListingSort = '';
						}
					} else {
						ajaxListingSort = '';
					}

					if ( ajaxExploreBy.length ) {
						ajaxExploreBy.each( function () {
							ajaxExploreBy = $( this ).val();
						} );

						if ( 'string' !== typeof ajaxExploreBy || undefined === ajaxExploreBy || 'undefined' === ajaxExploreBy || 'NaN' === ajaxExploreBy ) {
							ajaxExploreBy = '';
						}
					} else {
						ajaxExploreBy = '';
					}

					if ( ajaxSelectedCountry.length ) {
						ajaxSelectedCountry.each( function () {
							ajaxSelectedCountry = $( this ).val();
						} );

						if ( 'string' !== typeof ajaxSelectedCountry || undefined === ajaxSelectedCountry || 'undefined' === ajaxSelectedCountry || 'NaN' === ajaxSelectedCountry ) {
							ajaxSelectedCountry = '';
						}
					} else {
						ajaxSelectedCountry = '';
					}

					if ( ajaxSavedAddress.length ) {
						ajaxSavedAddress.each( function () {
							ajaxSavedAddress = $( this ).val();
						} );

						if ( 'string' !== typeof ajaxSavedAddress || undefined === ajaxSavedAddress || 'undefined' === ajaxSavedAddress || 'NaN' === ajaxSavedAddress ) {
							ajaxSavedAddress = '';
						}
					} else {
						ajaxSavedAddress = '';
					}

					if ( ajaxSavedPostcode.length ) {
						ajaxSavedPostcode.each( function () {
							ajaxSavedPostcode = $( this ).val();
						} );

						if ( 'string' !== typeof ajaxSavedPostcode || undefined === ajaxSavedPostcode || 'undefined' === ajaxSavedPostcode || 'NaN' === ajaxSavedPostcode ) {
							ajaxSavedPostcode = '';
						}
					} else {
						ajaxSavedPostcode = '';
					}

					if ( ajaxListingRegions.length ) {
						ajaxListingRegions.each( function () {
							ajaxListingRegions = $( this ).val();
						} );

						if ( 'string' !== typeof ajaxListingRegions || undefined === ajaxListingRegions || 'undefined' === ajaxListingRegions || 'NaN' === ajaxListingRegions ) {
							ajaxListingRegions = '';
						}
					} else {
						ajaxListingRegions = '';
					}

					if ( ajaxListingCategories.length ) {
						ajaxListingCategories.each( function () {
							ajaxListingCategories = $( this ).val();
						} );

						if ( 'string' !== typeof ajaxListingCategories || undefined === ajaxListingCategories || 'undefined' === ajaxListingCategories || 'NaN' === ajaxListingCategories ) {
							ajaxListingCategories = '';
						}
					} else {
						ajaxListingCategories = '';
					}

					if ( ajaxlistingAmenities.length ) {
						ajaxlistingAmenities.each( function () {
							ajaxlistingAmenities = $( this ).val();
						} );

						if ( 'string' !== typeof ajaxlistingAmenities || undefined === ajaxlistingAmenities || 'undefined' === ajaxlistingAmenities || 'NaN' === ajaxlistingAmenities ) {
							ajaxlistingAmenities = '';
						}
					} else {
						ajaxlistingAmenities = '';
					}

					var testString = ajaxS.replace( /\s/g, '' );

					if ( '' !== testString ) {

						ajaxSerchingResults();

						var contentDataURL = listarSiteURL + '/wp-content/plugins/listar-addons/inc/ajax-search/listar-search-ajax.php';
						var dataToSend = { send_data : '[{"type":"ajax-search"},{"s":"' + ajaxS + '"},{"post_type":"' + ajaxPostType + '"},{"search_type":"' + ajaxSearchType + '"},{"listing_sort":"' + ajaxListingSort + '"},{"explore_by":"' + ajaxExploreBy + '"},{"selected_country":"' + ajaxSelectedCountry + '"},{"saved_address":"' + ajaxSavedAddress + '"},{"saved_postcode":"' + ajaxSavedPostcode + '"},{"listing_regions":"' + ajaxListingRegions + '"},{"listing_categories":"' + ajaxListingCategories + '"},{"listing_amenities":"' + ajaxlistingAmenities + '"}]' };

						$.ajax( {
							crossDomain: true,
							url: contentDataURL,
							type: 'POST',
							data: dataToSend,
							cache    : false,
							timeout  : 30000

						} ).done( function ( response ) {
							if ( 'string' === typeof response ) {
								if ( response.indexOf( 'listar-has-ajax-posts' ) >= 0 ) {
									ajaxCleanOldSerchResults();

									$( '.listar-ajax-search' ).addClass( 'listar-ajax-search-found-results' );
									$( '.listar-ajax-search ul' ).append( response.replace( '<span class="hidden listar-has-ajax-posts"></span>', '' ) );
								} else {
									ajaxSerchNoResults();
								}
							} else {
								ajaxSerchNoResults();
							}
						} ).fail( function( xhr, textStatus, errorThrown ) {
							//alert(xhr);
							//alert(textStatus);
							//alert(errorThrown);
							if ( $( '.listar-user-logged' ).length ) {
								//alert(32);
								//alert(xhr);
								//alert(textStatus);
								//alert(errorThrown);
							}
							ajaxSerchNoResults();
						} );
					} else {
						unhideSearchMenu();
					}

					doingAjaxSearch = false;
				}, 300 );
			}
		} );

		$( window ).on( 'resize', function () {
			resetElements( true );
			fixPopupHeights();
		} );		

		/* Execute right after the first user interaction */
		/* Get updated nonce for login/register form with Ajax on the first user interaction */

		theDocument.on( 'touchstart touchmove scroll mouseenter mousedown mousemove DOMMouseScroll mousewheel keyup', function () {
			if ( ! gotUpdatedNonce ) {
				firstUserEventHappened();
			}
		} );

		/* Or, in case the page has been scrolled */

		if( $( window ).scrollTop() ) {
			firstUserEventHappened();
		}

		theBody.on( 'click', '.star', function() {
			$( this ).nextAll( '.star' ).removeClass( 'active' );
			$( this ).prevAll( '.star' ).removeClass( 'active' );
			$( this ).toggleClass( 'active' );
			$( this ).parent().find( 'input' ).attr( 'value', $( this ).attr( 'data-star-rating' ) );
		} );

		theBody.on( 'click', '.listar-current-search-by', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var exploreByButton = $( this ).parents( 'form' ).find( '.listar-search-by-button' );

			if ( exploreByButton.length ) {
				exploreByButton[0].click();
			}

		} );

		theBody.on( 'click', '.listar-clean-search-input-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var clickedButton = $( this );

			$( '.listar-listing-search-input-field' ).val( '' );

			setTimeout( function () {
				ajaxSerchNoResults();
				unhideSearchMenu();
				hideListingSearchMenu();

				clickedButton.parents( 'form' ).find( '.listar-listing-search-input-field' )[0].focus();
			}, 50 );

		} );

		theBody.on( 'click', '.listar-clean-search-by-filters-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var clickedButton = $( this );

			$( 'a[data-explore-by-type="' + listarLocalizeAndAjax.listarInitialExploreByOption + '"]' ).each( function () {
				$( this )[0].click();
			} );

			$( '.listar-listing-regions-popup .listar-back-site' ).each( function () {
				$( this )[0].click();
			} );

			setTimeout( function () {
				clickedButton.parents( 'form' ).find( '.listar-listing-search-input-field' )[0].focus();
			}, 50 );
		} );
		
		function forceNearestMePopup() {
			var newExploreByClass = 'listar-search-by-button ' + $( this ).attr( 'class' );
			var newExploreByPlaceholder = $( this ).attr( 'data-explore-by-placeholder' );
			var newExploreByTitle = $( this ).attr( 'data-explore-by-title' );
			var newExploreBySlug = $( this ).attr( 'data-explore-by-type' );
			var newExploreByOrder = $( this ).attr( 'data-explore-by-order' );
			var setFormFields = true;
			var hasUserLatitudeAndLongitude = false;
			var userLatitudeField = $( 'input[name="listar_geolocated_data_latitude"]' );
			var userLongitudeField = $( 'input[name="listar_geolocated_data_latitude"]' );

			if ( userLatitudeField.length && userLongitudeField.length ) {
				if ( '' !== userLatitudeField.val() && '' !==  userLongitudeField.val() ) {
					hasUserLatitudeAndLongitude = true;
				}
			}

			if ( ! hasUserLatitudeAndLongitude ) {
				setFormFields = false;

				stopScrolling( 1 );

				enableNearestMeDataEditor();

				searchByInputToFocus = $( this ).parents( 'form' ).find( '.listar-listing-search-input-field' );

				setTimeout( function () {
					$( '.listar-search-by-popup' ).addClass( 'listar-showing-search-by' ).css( { left : 0, opacity : 1 } );
				}, 510 );

				$( '.listar-general-explore-by-options' ).addClass( 'hidden' );
				$( '.listar-nearest-me-loading' ).removeClass( 'hidden' );
				$( '.listar-nearest-me-loading-icon' ).addClass( 'listar-is-geolocating' );

				userGeolocationMethod1();
			} else {
				$( '.listar-search-by-popup .listar-back-site' )[0].click();
			}

			if ( setFormFields ) {
				if ( 'shop_products' === newExploreBySlug ) {
					$( 'input[name="' + listarLocalizeAndAjax.searchTypeTranslation + '"]' ).val( newExploreBySlug );
					$( '.listar-all-regions-button' ).css( { display : 'none' } );
				} else if ( 'blog' === newExploreBySlug ) {
					$( 'input[name="' + listarLocalizeAndAjax.searchTypeTranslation + '"]' ).val( newExploreBySlug );
					$( '.listar-all-regions-button' ).css( { display : 'none' } );
				} else {
					$( 'input[name="' + listarLocalizeAndAjax.searchTypeTranslation + '"]' ).val( 'listing' );
					$( '.listar-all-regions-button' ).css( { display : '' } );
				}

				$( '.listar-search-by-button' ).attr( 'class', newExploreByClass ).attr( 'data-explore-by-type', newExploreBySlug );

				$( 'input[name="' + listarLocalizeAndAjax.listingSortTranslation + '"]' ).val( newExploreByOrder );
				$( 'input[name="' + listarLocalizeAndAjax.exploreByTranslation + '"]' ).val( newExploreBySlug );
				$( '.listar-listing-search-input-field' ).attr( 'placeholder', newExploreByPlaceholder );
				$( '.listar-current-search-by' ).prop( 'innerHTML', newExploreByTitle );
			}
		}

		theBody.on( 'click', '.listar-search-by-options-wrapper > a', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var newExploreByClass = 'listar-search-by-button ' + $( this ).attr( 'class' );
			var newExploreByPlaceholder = $( this ).attr( 'data-explore-by-placeholder' );
			var newExploreByTitle = $( this ).attr( 'data-explore-by-title' );
			var newExploreBySlug = $( this ).attr( 'data-explore-by-type' );
			var newExploreByOrder = $( this ).attr( 'data-explore-by-order' );
			var setFormFields = true;

			if ( 'nearest_me' !== newExploreBySlug ) {
				$( '.listar-search-by-popup .listar-back-site' )[0].click();

				setTimeout( function () {
					if ( false !== searchByInputToFocus ) {
						searchByInputToFocus[0].focus();

						var inputVal = searchByInputToFocus.val();

						if ( 'string' === typeof inputVal && '' !== inputVal ) {
							searchByInputToFocus.keyup();
						}
					}
				}, 50 );
			} else {
				forceNearestMePopup();
			}

			if ( setFormFields ) {
				if ( 'shop_products' === newExploreBySlug ) {
					$( 'input[name="' + listarLocalizeAndAjax.searchTypeTranslation + '"]' ).val( newExploreBySlug );
					$( '.listar-all-regions-button' ).css( { display : 'none' } );
				} else if ( 'blog' === newExploreBySlug ) {
					$( 'input[name="' + listarLocalizeAndAjax.searchTypeTranslation + '"]' ).val( newExploreBySlug );
					$( '.listar-all-regions-button' ).css( { display : 'none' } );
				} else {
					$( 'input[name="' + listarLocalizeAndAjax.searchTypeTranslation + '"]' ).val( 'listing' );
					$( '.listar-all-regions-button' ).css( { display : '' } );
				}

				$( '.listar-search-by-button' ).attr( 'class', newExploreByClass ).attr( 'data-explore-by-type', newExploreBySlug );

				$( 'input[name="' + listarLocalizeAndAjax.listingSortTranslation + '"]' ).val( newExploreByOrder );
				$( 'input[name="' + listarLocalizeAndAjax.exploreByTranslation + '"]' ).val( newExploreBySlug );
				$( '.listar-listing-search-input-field' ).attr( 'placeholder', newExploreByPlaceholder );
				$( '.listar-current-search-by' ).prop( 'innerHTML', newExploreByTitle );
			}
		} );

		theBody.on( 'click', '.listar-edit-nearest-me-data', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var exploreByButton = $( this ).parents( '.listar-search-by-options-wrapper' ).find( 'a[data-explore-by-order="nearest_me"]' );

			var newExploreByClass = 'listar-search-by-button ' + exploreByButton.attr( 'class' );
			var newExploreByPlaceholder = exploreByButton.attr( 'data-explore-by-placeholder' );
			var newExploreByTitle = exploreByButton.attr( 'data-explore-by-title' );
			var newExploreBySlug = 'nearest_me';
			var newExploreByOrder = 'nearest_me';

			$( 'input[name="' + listarLocalizeAndAjax.searchTypeTranslation + '"]' ).val( 'listing' );
			$( '.listar-all-regions-button' ).css( { display : '' } );

			$( '.listar-search-by-button' ).attr( 'class', newExploreByClass ).attr( 'data-explore-by-type', newExploreBySlug );

			$( 'input[name="' + listarLocalizeAndAjax.listingSortTranslation + '"]' ).val( newExploreByOrder );
			$( 'input[name="' + listarLocalizeAndAjax.exploreByTranslation + '"]' ).val( newExploreBySlug );
			$( '.listar-listing-search-input-field' ).attr( 'placeholder', newExploreByPlaceholder );
			$( '.listar-current-search-by' ).prop( 'innerHTML', newExploreByTitle );

			$( '.listar-nearest-me-main' ).addClass( 'hidden' );
			$( '.listar-nearest-me-secondary' ).removeClass( 'hidden' );
		} );

		theBody.on( 'click', '.listar-reset-nearest-me-data', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var defaultExploreByButton = $( this ).parents( '.listar-search-by-options-wrapper' ).find( 'a[data-explore-by-type="' + listarLocalizeAndAjax.listarInitialExploreByOption + '"]' );

			$( '#listar_geolocated_data_address' ).val( '' );
			$( '#listar_geolocated_data_number' ).val( '' );
			$( '#listar_geolocated_data_region' ).val( '' );
			$( '#listar_geolocated_data_country' ).val( '' );
			$( '#listar_geolocated_data_latitude' ).val( '' );
			$( '#listar_geolocated_data_longitude' ).val( '' );

			var newExploreByClass = 'listar-search-by-button ' + defaultExploreByButton.attr( 'class' );
			var newExploreByPlaceholder = defaultExploreByButton.attr( 'data-explore-by-placeholder' );
			var newExploreByTitle = defaultExploreByButton.attr( 'data-explore-by-title' );
			var newExploreBySlug = defaultExploreByButton.attr( 'data-explore-by-type' );
			var newExploreByOrder = defaultExploreByButton.attr( 'data-explore-by-order' );

			$( '.listar-search-by-button' ).attr( 'class', newExploreByClass ).attr( 'data-explore-by-type', newExploreBySlug );

			$( 'input[name="' + listarLocalizeAndAjax.listingSortTranslation + '"]' ).val( newExploreByOrder );
			$( 'input[name="' + listarLocalizeAndAjax.exploreByTranslation + '"]' ).val( newExploreBySlug );
			$( '.listar-listing-search-input-field' ).attr( 'placeholder', newExploreByPlaceholder );
			$( '.listar-current-search-by' ).prop( 'innerHTML', newExploreByTitle );

			enableNearestMeDataEditor();

			/* Do Ajax reset */
			saveGeolocationDetails( '-', '-', '-', '-', '-', '-', 'reset' );
		} );

		$( theBody ).on( 'click', '.listar-report-listing, .listar-listing-header-report-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			if ( $( this ).hasClass( 'listar-logged-users-can-complaint' ) && theBody.hasClass( 'listar-user-not-logged' ) ) {
				$( '.listar-user-buttons-responsive .listar-user-login' ).trigger( 'click' );
			} else {
				stopScrolling( 1 );
				$( '.listar-report-popup' ).addClass( 'listar-showing-report' ).css( { left : 0, opacity : 1 } );
			}
		} );

		theBody.on( 'click', '#listar-primary-menu li a', function ( e ) {
			if ( $( this ).find( 'b' ).length ) {
				if ( isMobile() || viewport().width < 768 ) {
					var thisElem = this;

					e.preventDefault();
					e.stopPropagation();

					$( '#listar-primary-menu li a.dropdown-toggle' ).each( function () {
						if ( ! $( this ).parent().find( thisElem ).length ) {
							$( this ).attr( 'aria-expanded', 'false' );
							$( this ).parent().removeClass( 'open' );
						}
					} );

					if ( 'true' === $( this ).attr( 'aria-expanded' ) ) {
						$( this ).attr( 'aria-expanded', 'false' );
						$( this ).parent().removeClass( 'open' );
					} else {
						$( this ).attr( 'aria-expanded', 'true' );
						$( this ).parent().addClass( 'open' );
					}
				}
			} else {
				e.stopPropagation();
			}
		} );

		$( '.dropdown li' ).on( 'mouseenter mouseleave', function () {
			if ( $( 'ul', this ).length ) {
				var	elm = $( 'ul:first', this );
				var
					dropW = elm.width(),
					viewportWidth = viewport().width,
					dropL = elm.offset(),
					isEntirelyVisible;

				dropL = dropL.left;
				isEntirelyVisible = ( dropL + dropW <= viewportWidth );

				if ( ! isEntirelyVisible ) {
					$( this ).addClass( 'listar-screen-edge' );
				}
			}
		} );



		theBody.on( 'click', '.listar-show-recommended-appointment-tools a', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( this ).prop( 'outerHTML', '' );
			$( '.listar-appointment-recommended-services' ).removeClass( 'hidden' );
		} );

		theBody.on( 'click', '.listar-references-navigation', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var countDistances = $( this ).parent().find( '.listar-location-references-wrapper div' ).length;
			var currentCarouselOrder = 1;
			var translate = 0;

			if ( ! $( this ).parent()[0].hasAttribute( 'data-current-carousel-order' ) ) {
				$( this ).parent().attr( 'data-current-carousel-order', currentCarouselOrder );
			} else {
				currentCarouselOrder = parseInt( $( this ).parent().attr( 'data-current-carousel-order' ), 10 );
			}

			if ( currentCarouselOrder < countDistances ) {
				currentCarouselOrder++;
				translate = -100 * ( currentCarouselOrder - 1 );

			} else {
				currentCarouselOrder = 1;
				translate = 0;
			}

			$( this ).parent().attr( 'data-current-carousel-order', currentCarouselOrder );

			$( this ).parent().find( '.listar-location-references-wrapper' ).css( {
				'-webkit-transform' : 'translate(' + translate + '%,0)',
				'-moz-transform'    : 'translate(' + translate + '%,0)',
				'-ms-transform'     : 'translate(' + translate + '%,0)',
				'-o-transform'      : 'translate(' + translate + '%,0)',
				'transform'         : 'translate(' + translate + '%,0)'
			} );

		} );

		/* Show invisible items for dropdown menus inside main menu */
		$( theBody ).on( 'click', '.listar-menu-has-invisible-items .listar-plus-drop-down-menu', function () {
			if( $( this ).parent().find( '>li:nth-last-child(2)' ).hasClass( 'listar-last-item-being-displayed' ) ) {

				/* End of the list is being displayed, revert to initial */

				$( this ).parent().find( '>li' ).removeClass( 'listar-hidde-menu-item' ).removeClass( 'listar-show-menu-item' );
				$( this ).parent().find( '>li:nth-last-child(2)' ).removeClass( 'listar-last-item-being-displayed' );

				if ( parseInt( $( this ).parent().innerHeight(), 10 ) > parseInt ( $( this ).parent().attr( 'data-last-height' ), 10 ) ) {
					$( this ).parent().css( { 'min-height' : $( this ).parent().innerHeight() } );
					$( this ).parent().attr( 'data-last-height',  $( this ).parent().innerHeight() );
				}
			} else if( ! $( this ).parent().find( '.listar-hidde-menu-item' ).length ) {

				$( this ).parent().css( { 'min-height' : $( this ).parent().innerHeight() } );
				$( this ).parent().attr( 'data-last-height', $( this ).parent().innerHeight() );

				/* This is the initial display of menu items, show the second list of items */

				$( this ).parent().find( '>li:nth-child(-n+13)' ).removeClass( 'listar-show-menu-item' ).addClass( 'listar-hidde-menu-item' );
				$( this ).parent().find( '>li:nth-child(n+14)' ).removeClass( 'listar-hide-menu-item' ).addClass( 'listar-show-menu-item' );
				$( this ).parent().find( '>li:nth-child(n+27)' ).removeClass( 'listar-show-menu-item' ).addClass( 'listar-hide-menu-item' );

				$( this ).parent().find( '>li:last-child' ).removeClass( 'listar-show-menu-item' ).removeClass( 'listar-hide-menu-item' );
				$( this ).parent().find( '>li.listar-show-menu-item' ).last().addClass( 'listar-last-item-being-displayed' );

				if ( parseInt( $( this ).parent().innerHeight(), 10 ) > parseInt ( $( this ).parent().attr( 'data-last-height' ), 10 ) ) {
					$( this ).parent().css( { 'min-height' : $( this ).parent().innerHeight() } );
					$( this ).parent().attr( 'data-last-height',  $( this ).parent().innerHeight() );
				}
			} else {

				/* List display was changed at least once proceed here until all items be displayed */

				var lastIndexBeingDisplayed = $( this ).parent().find( '.listar-last-item-being-displayed' ).index();

				$( this ).parent().find( '>li:nth-child(-n+' + ( lastIndexBeingDisplayed + 1 ) + ')' ).removeClass( 'listar-show-menu-item' ).addClass( 'listar-hidde-menu-item' );
				$( this ).parent().find( '>li:nth-child(n+' + ( lastIndexBeingDisplayed + 2 ) + ')' ).removeClass( 'listar-hide-menu-item' ).addClass( 'listar-show-menu-item' );
				$( this ).parent().find( '>li:nth-child(n+' + ( lastIndexBeingDisplayed + 2 + 13 ) + ')' ).removeClass( 'listar-show-menu-item' ).addClass( 'listar-hide-menu-item' );

				$( this ).parent().find( '>li:last-child' ).removeClass( 'listar-show-menu-item' ).removeClass( 'listar-hide-menu-item' );
				$( this ).parent().find( '>li.listar-last-item-being-displayed' ).removeClass( 'listar-last-item-being-displayed' );
				$( this ).parent().find( '>li.listar-show-menu-item' ).last().addClass( 'listar-last-item-being-displayed' );

				if ( parseInt( $( this ).parent().innerHeight(), 10 ) > parseInt ( $( this ).parent().attr( 'data-last-height' ), 10 ) ) {
					$( this ).parent().css( { 'min-height' : $( this ).parent().innerHeight() } );
					$( this ).parent().attr( 'data-last-height',  $( this ).parent().innerHeight() );
				}
			}
		} );

		theBody.on( 'mousedown', '.listar-listing-gallery', function () {
			lastDragPosition = listingGallery.scrollLeft();
		} );

		theBody.on( 'click', '.listar-listing-gallery a', function () {
			if ( 0 !== lastDragPosition - listingGallery.scrollLeft() ) {
				$( '#lightbox, #lightboxOverlay' ).stop().hide();
			}
		} );

		theBody.on( 'click', 'a[rel="lightbox"], a[data-lightbox]', function () {
			$( '.lb-closeContainer' ).css( { opacity : 0 } );

			setTimeout( function () {
				$( '.lb-closeContainer' ).animate( { opacity : 1 } );
			}, 3000 );
		} );

		$( '.listar-hero-header .listar-search-submit' ).on( {
			'mouseenter' : function () {
				$( '.listar-hero-search-icon' ).addClass( 'hover' );
			},
			'mouseleave' : function () {
				$( '.listar-hero-search-icon' ).removeClass( 'hover' );
			}
		} );

		$( '.listar-hero-search .search-form' ).on( 'submit', function ( e ) {
			$( this ).find( 'input[data-name="s"]' ).attr( 'name', 's' );

			var searchTypeButton = $( this ).find( '.listar-search-by-button' );
			var hasUserLatitudeLongitude = true;

			if ( searchTypeButton.length ) {
				if ( searchTypeButton.attr( 'class' ).indexOf( 'fa-scrubber' ) >= 0 ) {
					hasUserLatitudeLongitude = startGeolocationPopup( false );
				}
			}

			if ( ! hasUserLatitudeLongitude ) {
				e.preventDefault();
				e.stopPropagation();
			}
		} );

		$( '.listar-posts-column .listar-column-toggle-visibility' ).on( 'click', function () {
			if ( $( '.listar-posts-column' ).width() > 30 ) {
				$( '.listar-hero-search, .listar-posts-column' ).addClass( 'listar-hide-featured' );
				$( '.listar-hero-search' ).siblings( '.listar-search-categories' ).addClass( 'listar-hide-featured' );
			} else {
				$( '.listar-hero-search, .listar-posts-column' ).removeClass( 'listar-hide-featured' );
				$( '.listar-hero-search' ).siblings( '.listar-search-categories' ).removeClass( 'listar-hide-featured' );
			}
		} );

		catScrollQtd = 0;
		catCondition2 = true;

		if ( $( '.listar-search-categories .listar-listing-categories' ).length ) {
			catScrollQtd = $( '.listar-search-categories .listar-listing-categories' )[0].scrollHeight;
		}

		/* Clicking out of .listar-search-categories */
		theBody.on( 'click', '*', function () {
			var catCondition1 = $( '.listar-search-categories' ).hasClass( 'listar-showing-more-cats' );

			if ( $( this ).hasClass( 'listar-search-categories' ) ) {
				catCondition2 = false;
			}

			if ( catCondition1 && catCondition2 ) {
				$( '.listar-less-categories' ).trigger( 'click' );
			}

			setTimeout( function () {
				catCondition2 = true;
			}, 200 );
		} );

		/*
		 * Clear cache - customized.
		 */
		theBody.on( 'click', '#wp-admin-bar-autoptimize-default li', function ( e ) {

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
						crossDomain: true,
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

		$( '.listar-mobile-circle-bg-links' ).on( {
			'mouseenter' : function () {
				$( '.listar-mobile-circle-bg-img img' ).addClass( 'hover' );
			},
			'mouseleave' : function () {
				$( '.listar-mobile-circle-bg-img img' ).removeClass( 'hover' );
			}
		} );

		theBody.on( 'click', '.listar-full-dimming-overlay', function () {
			if ( '0' === $( '#listar-primary-menu' ).css( 'left' ).replace( /[^-\d\.]/g, '' ) ) {
				$( toggler ).trigger( 'click' );
			}
		} );

		theBody.on( 'click', '.listar-map-button-coordinates-link', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '.listar-map-button-coordinates' ).removeClass( 'hidden' );
			$( this ).prop( 'outerHTML', '' );
		} );

		$( '#site-navigation' ).on( 'click', toggler, function () {
			var selected = $( this ).hasClass( 'listar-primary-navbar-mobile-visible' );

			if ( viewport().width < 768 ) {
				if ( $( '.listar-login-popup.listar-showing-login' ).length ) {
					$( '.listar-user-buttons-responsive .listar-user-login' ).trigger( 'click' );
				}

				if ( theBody.hasClass( 'admin-bar' ) ) {
					htmlAndBody.stop().animate( { scrollTop : '0' }, 500 );
				}

				if ( ! selected ) {
					stopScrolling( 1 );
					$( '.listar-full-dimming-overlay' ).css( { display : 'block' } ).stop().animate( { opacity : 0.88 }, { duration : 1000 } );

					if ( theBody.hasClass( 'listar-user-not-logged' ) ) {
						$( navigationWrapper ).css( {
							left : 'auto',
							right : 0
						} );
					} else {
						$( navigationWrapper ).css( {
							right : 'auto',
							left : 0
						} );
					}
				} else {
					if ( '0px' !== $( '.listar-search-popup' ).css( 'left' ) && '0px' !== $( '.listar-login-popup' ).css( 'left' ) && '0px' !== $( '.listar-booking-popup' ).css( 'left' ) && '0px' !== $( '.listar-social-share-popup' ).css( 'left' ) && '0px' !== $( '.listar-review-popup' ).css( 'left' ) && '0px' !== $( '.listar-listing-categories-popup' ).css( 'left' ) && '0px' !== $( '.listar-listing-regions-popup' ).css( 'left' ) && '0px' !== $( '.listar-search-by-popup' ).css( 'left' ) && '0px' !== $( '.listar-report-popup' ).css( 'left' )  && '0px' !== $( '.listar-claim-popup' ).css( 'left' ) && '0px' !== $( '.listar-settings-popup' ).css( 'left' ) ) {
						stopScrolling( 0 );
					}

					$( '.listar-full-dimming-overlay' ).stop().animate( { opacity : 0 }, { duration : 1000, complete : function () {
						$( '.listar-full-dimming-overlay' ).css( { display : 'none' } );
					} } );

					$( navigationWrapper ).css( {
						right : 'auto',
						left : '0'
					} );
				}// End if().

				if ( $( '#listar-primary-menu' ).length ) {
					$( '#listar-primary-menu' ).stop().animate( {
						left : selected ? menuNegativeWidth : '0px'
					} );
				}

				if ( $( '.listar-mobile-menu-header-background' ).length ) {
					$( '.listar-mobile-menu-header-background' ).stop().animate( {
						left : selected ? menuNegativeWidth : '0px'
					} );
				}

				if ( $( '#listar-navbar-height-col' ).length ) {
					$( '#listar-navbar-height-col' ).stop().animate( {
						left : selected ? menuNegativeWidth : '-2px'
					} );
				}

				if ( $( pageWrapper ).length ) {
					$( pageWrapper ).stop().animate( {
						left : selected ? '0px' : menuWidth
					} );
				}

				$( this ).toggleClass( 'listar-primary-navbar-mobile-visible', ! selected );
				$( '#listar-primary-menu' ).toggleClass( 'listar-primary-navbar-mobile-visible' );
				$( '.navbar, body, .navbar-header' ).toggleClass( 'listar-primary-navbar-mobile-visible' );
			}// End if().
		} );

		circleEvents();

		theBody.on( 'click', '.listar-header-search-button, .listar-search-pop-button, .listar-search-query span', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			if ( ! $( '.listar-search-popup' ).hasClass( 'listar-showing-search' ) ) {
				stopScrolling( 1 );

				if ( $( '.navbar.navbar-inverse.listar-primary-navbar-mobile-visible, body.listar-primary-navbar-mobile-visible' ).length ) {
					$( '.navbar-toggle' ).eq( 0 ).trigger( 'click' );
				}

				$( '.listar-search-popup' ).addClass( 'listar-showing-search' ).css( { left : 0, opacity : 1 } );
				$( '.listar-review-popup' ).css( { left : '-105%', opacity : 0.99 } );
				$( '.listar-social-share-popup' ).css( { left : '-105%', opacity : 0.99 } );
				$( '.listar-listing-categories-popup' ).css( { left : '-105%', opacity : 0.99 } );
				$( '.listar-listing-regions-popup' ).css( { left : '-105%', opacity : 0.99 } );
				$( '.listar-search-by-popup' ).css( { left : '-105%', opacity : 0.99 } );
				$( '.listar-report-popup' ).css( { left : '-105%', opacity : 0.99 } );
				$( '.listar-claim-popup' ).css( { left : '-105%', opacity : 0.99 } );
				$( '.listar-settings-popup' ).css( { left : '-105%', opacity : 0.99 } );
				$( '.listar-login-popup' ).css( { zIndex : 998 } ).css( { left : '-105%', opacity : 0.99 } );
				$( '.listar-booking-popup' ).css( { zIndex : 998 } ).css( { left : '-105%', opacity : 0.99 } );

				setTimeout( function () {
					$( '.listar-review-popup' ).removeClass( 'listar-showing-review' );
					$( '.listar-social-share-popup' ).removeClass( 'listar-showing-review' );
					$( '.listar-login-popup' ).removeClass( 'listar-showing-login' );
					$( '.listar-booking-popup' ).removeClass( 'listar-showing-booking' );
					$( '.listar-listing-categories-popup' ).removeClass( 'listar-showing-categories' );
					$( '.listar-listing-regions-popup' ).removeClass( 'listar-showing-regions' );
					$( '.listar-search-by-popup' ).removeClass( 'listar-showing-search-by' );
					$( '.listar-report-popup' ).removeClass( 'listar-showing-report' );
					$( '.listar-claim-popup' ).removeClass( 'listar-showing-claim' );
					$( '.listar-settings-popup' ).removeClass( 'listar-showing-settings' );
				}, 500 );

				if ( ! $( '.listar-is-search-menu' ).length && ( ! isMobile() || ( 0 === $( '.listar-listing-categories a' ).length && 0 === $( '.listar-regions-list.listar-has-more-regions' ).length ) ) ) {
					$( '.listar-search-popup input[data-name="s"]' ).focus();
				}

			} else {
				stopScrolling( 0 );
				$( '.listar-search-popup' ).css( { left : '-105%', opacity : 0.99 } );

				setTimeout( function () {
					$( '.listar-search-popup' ).removeClass( 'listar-showing-search' );
				}, 500 );
			}
		} );

		/* Switch forms login/register */

		$( 'a.listar-reset-pass-button' ).on( 'click', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '.listar-login-popup' ).removeClass( 'listar-showing-register-form' ).addClass( 'listar-showing-recover-pass-form' );
			$( '.listar-login, .listar-register' ).fadeOut( 0 );
			$( '.listar-reset-password' ).fadeIn( 0 );
			$( '.listar-login-form-link, .listar-register-form-link' ).removeClass( 'active' );
		} );

		$( '.listar-login-form-link' ).on( 'click', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '.listar-login-popup' ).removeClass( 'listar-showing-register-form listar-showing-recover-pass-form' );
			$( '.listar-register, .listar-reset-password' ).fadeOut( 0 );
			$( '.listar-login' ).fadeIn( 0 );
			$( '.listar-register-form-link' ).removeClass( 'active' );
			$( '.listar-login-form-link' ).addClass( 'active' );
		} );

		$( '.listar-register-form-link' ).on( 'click', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '.listar-login-popup' ).removeClass( 'listar-showing-recover-pass-form' ).addClass( 'listar-showing-register-form' );
			$( '.listar-login, .listar-reset-password' ).fadeOut( 0 );
			$( '.listar-register' ).fadeIn( 0 );
			$( '.listar-login-form-link' ).removeClass( 'active' );
			$( '.listar-register-form-link' ).addClass( 'active' );
		} );

		$( theBody ).on( 'mouseenter', '[data-toggle="tooltip"]', function () {
			var thisElement = $( this );

			if ( $.isFunction( $.fn.tooltip ) ) {
				if ( ! $( this )[0].hasAttribute( 'data-original-title' ) ) {
					$( this ).tooltip();
				}

				$( '[data-toggle="tooltip"]' ).not( this ).tooltip( 'hide' );
				thisElement.tooltip( 'show' );
			}
		} );

		$( theBody ).on( 'mouseleave', '[data-toggle="tooltip"]', function () {
			var thisElement = $( this );

			if ( $.isFunction( $.fn.tooltip ) ) {
				thisElement.tooltip( 'hide' );
			}
		} );

		$( theBody ).on( 'click', '.listar-listing-rating-anchor, .listar-listing-header-stars-button', function ( e ) {
			mobileCompensation = isMobile() ? 60 : 0;
			scrollToTarget = $( '.listar-listing-review' );

			if ( scrollToTarget.length > 0 ) {
				e.preventDefault();

				htmlAndBody.stop().animate( {
					scrollTop : scrollToTarget.offset().top - 340 + mobileCompensation
				}, 600 );
			}

			$( this ).parents( '.listar-listing-header-menu-fixed' ).each( function () {
				$( this ).addClass( 'listar-hidden-fixed-button' );
			} );
		} );

		theBody.on( 'click', '#accordion a[role="button"]', function ( e ) {
			if ( $( this ).parents( '.accordion-group' ).hasClass( 'listar-business-claim-accordion' ) ) {

				if ( $( this ).hasClass( 'listar-claim-is-not-claimed' ) ) {
					if ( theBody.hasClass( 'listar-user-not-logged' ) ) {
						$( '.listar-user-login' ).eq( 0 ).each( function () {
							$( this )[0].click();
						} );
					} else {
						window.location.href = $( this ).attr( 'data-claim-url' );
					}
				}

				e.preventDefault();
				e.stopPropagation();
			}

			if ( $( this ).parents( '.accordion-group' ).hasClass( 'listar-business-booking-accordion' ) ) {
				var hasBookingPopupEnabled = verifyBookingPopup();
				var foundButton = false;
			
				if ( hasBookingPopupEnabled ) {
					e.preventDefault();
					e.stopPropagation();
					
					launchBookingPopup();
				} else {
					var thisElement = $( this );
					var wrapperBooking = $( this ).parents( '.accordion-group' ).find( '.panel-body' );
					var innerBooking = wrapperBooking.prop( 'innerHTML' );

					/* Remove Acuity unwanted code */
					if ( innerBooking.indexOf( 'acuityscheduling.com/embed/button' ) >= 0 || innerBooking.indexOf( 'acuityscheduling.com/js/embed' ) >= 0 ) {
						wrapperBooking.find( 'iframe, script' ).each( function () {
							if ( $( this ).prop( 'outerHTML' ).indexOf( 'acuityscheduling.com/embed/button' ) >= 0 || $( this ).prop( 'outerHTML' ).indexOf( 'acuityscheduling.com/js/embed' ) >= 0 ) {
								$( this ).prop( 'outerHTML', '' );
								wrapperBooking = thisElement.parents( '.accordion-group' ).find( '.panel-body' );
								innerBooking = wrapperBooking.prop( 'innerHTML' );
							}
						} );
					}

					/* For Booksy widget */
					if ( innerBooking.indexOf( 'booksy-widget-button' ) >= 0 ) {
						e.preventDefault();
						e.stopPropagation();

						foundButton = true;

						$( '.booksy-widget-button' )[0].click();
	
						var bookInterval = setInterval( function () {
							htmlAndBody.stop().animate( { scrollTop : 0 }, 0 );
						}, 5 );

						setTimeout( function () {
							clearInterval( bookInterval );
						}, 1000 );
					}

					/* For Resy widget */
					else if ( innerBooking.indexOf( 'data-resy-buttom' ) >= 0 || innerBooking.indexOf( 'resy.com/embed.js' ) >= 0 ) {
						$( 'span[data-resy-buttom]' ).each( function () {
							e.preventDefault();
							e.stopPropagation();

							foundButton = true;
							$( this )[0].click();
						} );
					}

					/* The ZOMATO API Calendar Button */
					else if ( innerBooking.indexOf( 'listar-zomato-button' ) >= 0 ) {
						e.preventDefault();
						e.stopPropagation();

						foundButton = true;
						$( '.listar-zomato-button' )[0].click();
					}

					/* The Bookafy Button */
					else if ( $( '.listar-bookafy-button' ).length ) {
						e.preventDefault();
						e.stopPropagation();

						var bookafyButton = $( '.listar-bookafy-button' );

						if ( '#' === bookafyButton.attr( 'href' ) ) {
							bookafyButton.removeAttr( 'href' );
						}

						cancelAccordionPropagation = true;
						resetAccordionPropagation();

						foundButton = true;
						$( '.listar-bookafy-button' )[0].click();

						var bookIntervalB = setInterval( function () {
							htmlAndBody.stop();
						}, 5 );

						setTimeout( function () {
							clearInterval( bookIntervalB );
						}, 1000 );
					}

					/* The SimplyBook Button */
					else if ( $( '.simplybook-widget-button' ).length ) {
						e.preventDefault();
						e.stopPropagation();

						var simplyButton = $( '.simplybook-widget-button' );

						cancelAccordionPropagation = true;
						resetAccordionPropagation();

						foundButton = true;
						simplyButton[0].click();
					}

					/* The 'bookingjs-calendar' class comes from Timekit API */
					else if ( -1 === innerBooking.indexOf( '<iframe' ) && -1 === innerBooking.indexOf( 'bookingjs-calendar' ) ) {
						wrapperBooking.find( 'a' ).eq( 0 ).each( function () {
							e.preventDefault();
							e.stopPropagation();

							foundButton = true;

							$( this ).attr( 'target', '_blank' );
							$( this )[0].click();
						} );

						if ( ! foundButton && -1 === innerBooking.indexOf( 'http' ) && innerBooking.indexOf( '.booksy.com' ) >= 0 ) {
							var booksyLink = '';
							var splitContent = innerBooking.replace( '<p class="listar-accordion-wrapper-paragraph">', '' ).replace( '</p>', '' ).trim().split( ' ' );

							for ( var i = 0; i < splitContent.length; i++ ) {
								if ( splitContent[ i ].indexOf( '.booksy.com' ) ) {
									booksyLink = 'https://' + splitContent[ i ];
									break;
								}
							}

							if ( '' !== booksyLink ) {
								wrapperBooking.prop( 'innerHTML', booksyLink );
								innerBooking = wrapperBooking.prop( 'innerHTML' );
							}

						}

						if ( ! foundButton && -1 !== innerBooking.indexOf( 'http' ) ) {
							e.preventDefault();
							e.stopPropagation();

							foundButton = true;

							/* This seems a URL (string) */
							/* Reference: https://stackoverflow.com/a/5002161/7765298 */
							var cleanText = innerBooking.replace( /<\/?[^>]+(>|$)/g, '' );

							/* Remove all white spaces */
							/* Reference: https://stackoverflow.com/a/6623263/7765298 */
							cleanText = cleanText.replace( /\s/g, '' );

							wrapperBooking.prop( 'innerHTML', '<a class="listar-dynamic-booking-url" target="_blank" href="' + cleanText + '"></a>' );

							$( '.listar-dynamic-booking-url' )[0].click();
						}
					}

					if ( ! foundButton ) {
						wrapperBooking.parents( '.listar-bookings-wrapper' ).removeClass( 'hidden' );
					}

					$( '.listar-business-booking-accordion iframe[src*="acuityscheduling.com/"]' ).each( function () {
						$( this ).parents( '.listar-business-booking-accordion' ).addClass( 'listar-is-acuity' );
					} );
				}
			}
		} );

		theBody.on( 'click', '.listar-listing-not-claimed', function ( e ) {
			if ( theBody.hasClass( 'listar-user-not-logged' ) ) {
				$( '.listar-user-login' ).eq( 0 ).each( function () {
					$( this )[0].click();
				} );
			} else {
				e.preventDefault();
				e.stopPropagation();

				window.location.href = $( this ).attr( 'data-claim-url' );
			}
		} );

		theBody.on( 'click', '#accordion .collapsed', function () {

			if ( ! cancelAccordionPropagation ) {

				if ( didInitialAccordionClick ) {
					var previousAccordion = $( this ).parents( '.accordion-group' ).prevAll();
					var compensateScroll = 0;
					var compensateScrollDevice = 0;
					var compensateNotOpenedBefore = 32;
					var compensationLogged = 150;

					if ( theBody.hasClass( 'listar-user-not-logged' ) ) {
						compensationLogged = 120;
					}

					previousAccordion.each( function () {
						if ( $( this ).find( '.panel-heading a' )[0].hasAttribute( 'aria-expanded' ) ) {
							if ( 'true' === $( this ).find( '.panel-heading a' ).attr( 'aria-expanded' ) ) {
								compensateScroll = $( this ).find( '.panel-body' ).height();
								compensateNotOpenedBefore = 0;
							}
						}
					} );

					if ( $( this )[0].hasAttribute( 'aria-expanded' ) ) {
						if ( 'false' === $( this ).attr( 'aria-expanded' ) ) {
							htmlAndBody.stop().animate( { scrollTop : ( $( this ).offset().top - compensateScroll + compensateScrollDevice - compensationLogged + compensateNotOpenedBefore ) }, 200);
						}
					}
				}
			} else {
				resetAccordionPropagation();
			}
		} );

		theBody.on( 'click', '.listar-listing-header-message-button', function ( e ) {
			mobileCompensation = isMobile() ? -70 : 0;
			scrollToTarget = $( '.listar-private-message-accordion a' );

			if ( scrollToTarget.length > 0 ) {
				e.preventDefault();

				if ( scrollToTarget.hasClass( 'collapsed' ) ) {
					scrollToTarget[0].click();
				}

				setTimeout( function () {
					htmlAndBody.stop().animate( {
						scrollTop : scrollToTarget.offset().top - 120 + mobileCompensation
					}, 600 );
				}, 200 );
			}

			$( this ).parents( '.listar-listing-header-menu-fixed' ).each( function () {
				$( this ).addClass( 'listar-hidden-fixed-button' );
			} );
		} );

		theBody.on( 'click', '.listar-listing-header-coordinates-button', function ( e ) {
			mobileCompensation = isMobile() ? -70 : 0;
			scrollToTarget = $( '.listar-map-button-coordinates-wrapper' );

			if ( scrollToTarget.length > 0 ) {
				e.preventDefault();

				var coorsButton = scrollToTarget.find( 'a' );

				if ( coorsButton.length ) {
					coorsButton[0].click();
				}

				setTimeout( function () {
					htmlAndBody.stop().animate( {
						scrollTop : scrollToTarget.offset().top - 145 + mobileCompensation
					}, 600 );
				}, 200 );
			}

			$( this ).parents( '.listar-listing-header-menu-fixed' ).each( function () {
				$( this ).addClass( 'listar-hidden-fixed-button' );
			} );
		} );

		theBody.on( 'click', '.listar-listing-header-references-button', function ( e ) {
			mobileCompensation = isMobile() ? -70 : 0;
			scrollToTarget = $( '.listar-listing-more-info-accordion a' );

			if ( scrollToTarget.length > 0 ) {
				e.preventDefault();

				if ( scrollToTarget.hasClass( 'collapsed' ) ) {
					scrollToTarget[0].click();
				}

				setTimeout( function () {
					htmlAndBody.stop().animate( {
						scrollTop : scrollToTarget.offset().top - 120 + mobileCompensation
					}, 600 );
				}, 200 );
			}

			$( this ).parents( '.listar-listing-header-menu-fixed' ).each( function () {
				$( this ).addClass( 'listar-hidden-fixed-button' );
			} );
		} );

		theBody.on( 'click', '.listar-listing-header-catalog-button', function ( e ) {
			mobileCompensation = isMobile() ? -70 : 0;
			scrollToTarget = $( '.listar-listing-menu-accordion a' );

			if ( scrollToTarget.length > 0 ) {
				e.preventDefault();

				if ( scrollToTarget.hasClass( 'collapsed' ) ) {
					scrollToTarget[0].click();
				}

				setTimeout( function () {
					htmlAndBody.stop().animate( {
						scrollTop : scrollToTarget.offset().top - 120 + mobileCompensation
					}, 600 );
				}, 200 );
			}

			$( this ).parents( '.listar-listing-header-menu-fixed' ).each( function () {
				$( this ).addClass( 'listar-hidden-fixed-button' );
			} );
		} );

		theBody.on( 'click', '.listar-listing-header-hours-button, .listar-operating-hours-quick-button', function ( e ) {
			mobileCompensation = isMobile() ? -70 : 0;
			scrollToTarget = $( '.listar-business-hours-accordion a' );

			if ( scrollToTarget.length > 0 ) {
				e.preventDefault();

				if ( scrollToTarget.hasClass( 'collapsed' ) ) {
					scrollToTarget[0].click();
				}

				setTimeout( function () {
					htmlAndBody.stop().animate( {
						scrollTop : scrollToTarget.offset().top - 120 + mobileCompensation
					}, 600 );
				}, 200 );
			}

			$( '.listar-listing-header-menu-fixed' ).each( function () {
				$( this ).addClass( 'listar-hidden-fixed-button' );
			} );
		} );

		theBody.on( 'click', '.listar-listing-header-booking-button, .listar-booking-quick-button', function ( e ) {			
			var hasBookingPopupEnabled = verifyBookingPopup();
			
			if ( hasBookingPopupEnabled ) {
				launchBookingPopup();
			} else {

				mobileCompensation = isMobile() ? -70 : 0;
				scrollToTarget = $( '.listar-business-booking-accordion a' );

				if ( scrollToTarget.length > 0 ) {
					e.preventDefault();

					if ( scrollToTarget.hasClass( 'collapsed' ) ) {
						scrollToTarget[0].click();
					}

					setTimeout( function () {
						htmlAndBody.stop().animate( {
							scrollTop : scrollToTarget.offset().top - 120 + mobileCompensation
						}, 600 );
					}, 200 );
				}

				$( '.listar-listing-header-menu-fixed' ).each( function () {
					$( this ).addClass( 'listar-hidden-fixed-button' );
				} );
			}
		} );

		theBody.on( 'click', '.listar-write-review a', function ( e ) {

			// Cancel comment reply form, if currently visible between comments.
			$( '.listar-review-second-col #respond[style="display: block;"] > h3 > small > #cancel-comment-reply-link' ).each( function () {
				if ( 0 === $( this ).parents( '.listar-comments-form-wrapper' ).length ) {
					$( this )[0].click();
				}
			} );

			if ( ! ( theBody.hasClass( 'listar-no-addons' ) && theBody.hasClass( 'listar-user-not-logged' ) ) ) {
				e.preventDefault();
				e.stopPropagation();

				if ( theBody.hasClass( 'listar-user-not-logged' ) && theBody.hasClass( 'listar-guests-cannot-review' ) ) {
					$( '.listar-user-buttons-responsive .listar-user-login' ).trigger( 'click' );
					theBody.addClass( 'listar-login-before-review' );
				} else {
					stopScrolling( 1 );
					$( '.listar-review-popup .panel-body' ).prop( 'innerHTML', $( '#respond' ).prop( 'outerHTML' ) );
					$( '.listar-review-popup #respond #comment_parent' ).attr( 'value', 0 );
					$( '.listar-review-popup' ).addClass( 'listar-showing-review' ).css( { left : 0, opacity : 1 } );
				}
			}
		} );

		theBody.on( 'click', '.listar-bookmark-it', function ( e ) {

			if ( ! ( theBody.hasClass( 'listar-no-addons' ) && theBody.hasClass( 'listar-user-not-logged' ) ) ) {
				e.preventDefault();
				e.stopPropagation();

				var listingID = parseInt( $( this ).attr( 'data-listing-id' ), 10 );
				var userID = parseInt( $( this ).attr( 'data-user-id' ), 10 );

				if ( theBody.hasClass( 'listar-user-not-logged' ) || 0 === userID ) {
					$( '.listar-user-buttons-responsive .listar-user-login' ).trigger( 'click' );
				} else {

					if ( $( this ).parent().hasClass( 'listar-bookmarked-item' ) ) {
						handleBookmarks( $( this ), listingID, userID, 'remove'  );
					} else {
						handleBookmarks( $( this ), listingID, userID, 'add'  );
					}
				}
			}
		} );

		theBody.on( 'click', '.listar-review-popup .listar-back-site', function () {
			stopScrolling( 0 );

			theBody.removeClass( 'listar-login-before-review' );
			$( '.listar-review-popup' ).css( { left : '-105%', opacity : 0.99 } );

			setTimeout( function () {
				$( '.listar-review-popup' ).removeClass( 'listar-showing-review' );
			}, 500 );
		} );

		theBody.on( 'click', '.listar-listing-share-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
			stopScrolling( 1 );

			$( '.listar-social-share-popup' ).addClass( 'listar-showing-share' ).css( { left : 0, opacity : 1 } );
		} );

		theBody.on( 'click', '.listar-social-share-popup .listar-back-site', function () {
			stopScrolling( 0 );

			$( '.listar-social-share-popup' ).css( { left : '-105%', opacity : 0.99 } );

			setTimeout( function () {
				$( '.listar-social-share-popup' ).removeClass( 'listar-showing-share' );
			}, 500 );
		} );

		$( 'html' ).on( 'click', '.listar-user-not-logged .listar-user-login, .sign-in, .listar-user-not-logged .account-sign-in a, .listar-user-login-mobile, .listar-user-login-mobile a', function ( e ) {
			if ( ! theBody.hasClass( 'listar-no-addons' ) ) {
				e.preventDefault();
				e.stopPropagation();

				if ( ! preventEvenCallStack2 ) {

					preventEvenCallStack2 = true;

					if ( $( '.navbar.navbar-inverse.listar-primary-navbar-mobile-visible, body.listar-primary-navbar-mobile-visible' ).length ) {
						$( '.navbar-toggle' ).eq( 0 ).trigger( 'click' );
					}

					if ( ! $( '.listar-login-popup' ).hasClass( 'listar-showing-login' ) ) {
						stopScrolling( 1 );

						$( '.listar-login-popup' ).addClass( 'listar-showing-login' ).css( { left : 0, opacity : 1 } );
						$( '.listar-booking-popup' ).css( { left : '-105%', opacity : 0.99 } );
						$( '.listar-review-popup' ).css( { left : '-105%', opacity : 0.99 } );
						$( '.listar-social-share-popup' ).css( { left : '-105%', opacity : 0.99 } );
						$( '.listar-listing-categories-popup' ).css( { left : '-105%', opacity : 0.99 } );
						$( '.listar-listing-regions-popup' ).css( { left : '-105%', opacity : 0.99 } );
						$( '.listar-search-by-popup' ).css( { left : '-105%', opacity : 0.99 } );
						$( '.listar-report-popup' ).css( { left : '-105%', opacity : 0.99 } );
						$( '.listar-claim-popup' ).css( { left : '-105%', opacity : 0.99 } );
						$( '.listar-settings-popup' ).css( { left : '-105%', opacity : 0.99 } );
						$( '.listar-search-popup' ).css( { zIndex : 998 } ).css( { left : '-105%', opacity : 0.99 } );

						setTimeout( function () {
							$( '.listar-search-popup' ).removeClass( 'listar-showing-search' );
							$( '.listar-review-popup' ).removeClass( 'listar-showing-review' );
							$( '.listar-social-share-popup' ).removeClass( 'listar-showing-review' );
							$( '.listar-listing-categories-popup' ).removeClass( 'listar-showing-categories' );
							$( '.listar-listing-regions-popup' ).removeClass( 'listar-showing-regions' );
							$( '.listar-search-by-popup' ).removeClass( 'listar-showing-regions' );
							$( '.listar-report-popup' ).removeClass( 'listar-showing-report' );
							$( '.listar-claim-popup' ).removeClass( 'listar-showing-claim' );
							$( '.listar-settings-popup' ).removeClass( 'listar-showing-settings' );
						}, 500 );
					} else {
						stopScrolling( 0 );

						$( '.listar-login-popup' ).css( { left : '-105%', opacity : 0.99 } );

						setTimeout( function () {
							$( '.listar-login-popup' ).removeClass( 'listar-showing-login' );
						}, 500 );
					}

					setTimeout( function () {
						preventEvenCallStack2 = false;
					}, 100 );
				}// End if().
			}// End if().
		} );

		theBody.on( 'click', '.listar-login-popup .listar-back-site', function () {
			stopScrolling( 0 );

			$( '.listar-login-popup' ).css( { left : '-105%', opacity : 0.99 } );

			setTimeout( function () {
				$( '.listar-login-popup' ).removeClass( 'listar-showing-login' );
			}, 500 );
		} );

		theBody.on( 'click', '.listar-booking-popup .listar-back-site', function () {
			stopScrolling( 0 );

			$( '.listar-booking-popup' ).css( { left : '-105%', opacity : 0.99 } );

			setTimeout( function () {
				$( '.listar-booking-popup' ).removeClass( 'listar-showing-login' );
			}, 500 );
		} );

		theBody.on( 'click', '.listar-search-by-popup .listar-back-site', function () {

			$( '.listar-search-by-popup' ).css( { left : '-105%', opacity : 0.99 } );

			if ( ! $( '.listar-search-popup.listar-showing-search' ).length ) {
				stopScrolling( 0 );
			}

			setTimeout( function () {
				$( '.listar-nearest-me-main' ).removeClass( 'hidden' );
				$( '.listar-nearest-me-secondary' ).addClass( 'hidden' );
				$( '.listar-general-explore-by-options' ).removeClass( 'hidden' );
				$( '.listar-nearest-me-loading' ).addClass( 'hidden' );
				$( '.listar-nearest-me-loading-icon' ).removeClass( 'listar-is-geolocating' );
				$( '.listar-search-by-popup' ).removeClass( 'listar-showing-search-by' );
			}, 500 );
		} );

		theBody.on( 'click', '.listar-report-popup .listar-back-site', function () {

			$( '.listar-report-popup' ).css( { left : '-105%', opacity : 0.99 } );

			stopScrolling( 0 );

			setTimeout( function () {
				$( '.listar-report-popup' ).removeClass( 'listar-showing-report' );
			}, 500 );
		} );

		theBody.on( 'click', '.listar-claim-popup .listar-back-site', function () {

			$( '.listar-claim-popup' ).css( { left : '-105%', opacity : 0.99 } );

			stopScrolling( 0 );

			setTimeout( function () {
				$( '.listar-claim-popup' ).removeClass( 'listar-showing-claim' );
			}, 500 );
		} );

		theBody.on( 'click', '.listar-more-categories', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			populateTermPopups( 'categories' );
			resetOwlCarousel( $( '.listar-listing-categories-popup .listar-carousel-loop.listar-use-carousel' ) );
			initOwlCarousel( $( '.listar-listing-categories-popup .listar-carousel-loop.listar-use-carousel' ) );
			stopScrolling( 1 );

			$( '.listar-listing-categories-popup' ).addClass( 'listar-showing-categories' ).css( { left : 0, opacity : 1 } );
		} );

		theBody.on( 'click', '.listar-search-by-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			stopScrolling( 1 );

			enableNearestMeDataEditor();

			searchByInputToFocus = $( this ).parents( 'form' ).find( '.listar-listing-search-input-field' );

			$( '.listar-search-by-popup' ).addClass( 'listar-showing-search-by' ).css( { left : 0, opacity : 1 } );
		} );

		theBody.on( 'click', '.listar-listing-categories-popup .listar-back-site', function ( e ) {
			e.preventDefault();
			e.stopPropagation();			
			
			forceTermClick = false;

			$( '.listar-listing-categories-popup' ).css( { left : '-105%', opacity : 0.99 } );

			resetOwlCarousel( $( '.listar-listing-categories-popup .listar-carousel-loop.listar-use-carousel' ) );

			setTimeout( function () {
				unpopulateTermPopups( 'categories' );
			}, 200 );

			$( '.listar-listing-categories-popup' ).removeClass( 'listar-showing-settings' );

			if ( $( '.listar-front-header' ).length ) {
				stopScrolling( 0 );
			}
		} );

		theBody.on( 'click', '.listar-settings-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
			stopScrolling( 1 );

			$( '.listar-settings-popup' ).addClass( 'listar-showing-settings' ).css( { left : 0, opacity : 1 } );
		} );

		theBody.on( 'click', '.listar-settings-popup .listar-back-site', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '.listar-settings-popup' ).css( { left : '-105%', opacity : 0.99 } );

			setTimeout( function () {
				$( '.listar-settings-popup' ).removeClass( 'listar-showing-settings' );
			}, 500 );

			stopScrolling( 0 );
		} );

		theBody.on( 'click', '.listar-regions-list a', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			if ( ! $( this ).hasClass( 'listar-region-no-hover' ) ) {
				populateTermPopups( 'regions' );
				resetOwlCarousel( $( '.listar-listing-regions-popup .listar-carousel-loop.listar-use-carousel' ) );
				initOwlCarousel( $( '.listar-listing-regions-popup .listar-carousel-loop.listar-use-carousel' ) );
				stopScrolling( 1 );

				$( '.listar-listing-regions-popup' ).addClass( 'listar-showing-regions' ).css( { left : 0, opacity : 1 } );
			}
		} );

		theBody.on( 'click', '.listar-listing-regions-popup .listar-back-site', function ( e ) {
			var regionFilterPlaceholder = '';

			e.preventDefault();
			e.stopPropagation();
			forceTermClick = false;

			if ( $( '.listar-front-header' ).length ) {
				stopScrolling( 0 );
			}

			$( '.listar-regions-list a' ).removeClass( 'current' );
			$( '.listar-more-regions-button' ).addClass( 'current' );

			regionFilterPlaceholder = $( '.listar-all-regions-button.current' ).attr( 'data-placeholder' );

			$( '.listar-all-regions-button' ).removeClass( 'listar-has-selected-region' );

			$( '.listar-all-regions-button.current span strong' ).prop( 'innerHTML', regionFilterPlaceholder );
			$( '.listar-chosen-region' ).val( '' );

			$( '.listar-listing-regions-popup' ).css( { left : '-105%', opacity : 0.99 } );
			
			setTimeout( function () {
				unpopulateTermPopups( 'regions' );
			}, 200 );

			resetOwlCarousel( $( '.listar-listing-categories-popup .listar-carousel-loop.listar-use-carousel' ) );

			$( '.listar-listing-regions-popup' ).removeClass( 'listar-showing-regions' );
		} );

		theBody.on( 'click', '.listar-search-popup .listar-back-site', function () {
			if ( ! onMap || $( '.listar-search-popup' ).hasClass( 'listar-showing-search' ) ) {
				stopScrolling( 0 );
			}

			$( '.listar-search-popup' ).css( { left : '-105%', opacity : 0.99 } );

			setTimeout( function () {
				$( '.listar-search-popup' ).removeClass( 'listar-showing-search' );
			}, 500 );
		} );

		$( '.reply-the-comment' ).on( 'click', function ( e ) {

			if ( theBody.hasClass( 'listar-user-not-logged' ) && theBody.hasClass( 'listar-guests-cannot-review' ) ) {
				e.preventDefault();
				e.stopPropagation();

				$( '.listar-user-buttons-responsive .listar-user-login' ).trigger( 'click' );
				theBody.addClass( 'listar-login-before-review' );
			} else {
				var replyID = $( this ).attr( 'id' );
				replyID = replyID.replace( 'reply-the-comment-', '' );

				$( '#div-comment-' + replyID + ' .comment-reply-link' )[0].click();

				if ( 0 === $( '#div-comment-' + replyID ).find( '.listar-clear-float-comment' ).length ) {
					$( '#div-comment-' + replyID ).after( '<div class="listar-clear-both listar-clear-float-comment"></div>' );
				}

				$( '.listar-comments-container .comment-respond' ).css( { display : 'none' } );
				$( this ).parents( '#comment-' + replyID ).find( '#respond' ).css( { display : 'block' } );

				setTimeout( function () {
					htmlAndBody.stop().animate( {
						scrollTop : $( '#respond' ).offset().top - 120
					}, { duration : 500 } );
				}, 100 );
			}
		} );

		theBody.on( 'click', '#cancel-comment-reply-link', function () {
			var thisElement = $( '.listar-comments-container li #respond' );

			if ( thisElement.length > 0 ) {
				thisElement.prop( 'outerHTML', '' );
			}

			$( '.listar-comments-container .comment-respond' ).css( { display : 'none' } );
		} );

		$( '.listar-search-submit' ).on( 'click', function () {
			var searchForm = $( this ).parent().parent().find( 'form' );
			var currentExploreByOption = searchForm.find( 'input[name="' + listarLocalizeAndAjax.exploreByTranslation + '"]' ).val();
			var searchText = searchForm.find( 'input[data-name="s"]' ).val();
			var addressSaved = searchForm.find( 'input[name="' + listarLocalizeAndAjax.savedAddressTranslation + '"]' );
			var postcodeSaved = searchForm.find( 'input[name="' + listarLocalizeAndAjax.savedPostcodeTranslation + '"]' );
			var searchType = searchForm.find( 'input[name="search_type"]' ).val();			

			if ( 'shop_products' === currentExploreByOption ) {
				$( '.listar-post-type-form-field' ).val( 'product' );
			} else if ( 'listing' === searchType ) {
				$( '.listar-post-type-form-field' ).val( 'job_listing' );
			} else {
				$( '.listar-post-type-form-field' ).val( '' );
			}

			if ( '' === searchText && 'near_address' === currentExploreByOption ) {
				addressSaved.val( '' );
			}

			if ( '' === searchText && 'near_postcode' === currentExploreByOption ) {
				postcodeSaved.val( '' );
			}

			if ( $( '.listar-search-filter-categories' ).length ) {
				var searchCategories = String( $( '.listar-search-filter-categories' ).val() );

				if ( 'null' !== searchCategories ) {
					$( '.listar-chosen-category' ).val( searchCategories );
				}
			}

			if ( $( '.listar-search-filter-regions' ).length ) {
				var searchRegions = String( $( '.listar-search-filter-regions' ).val() );

				if ( 'null' !== searchRegions && ( '' === $( '.listar-chosen-region' ).attr( 'value' ) || '0' === $( '.listar-chosen-region' ).attr( 'value' ) ) ) {
					$( '.listar-chosen-region' ).val( searchRegions );
				}
			}

			if ( $( '.listar-search-filter-amenities' ).length ) {
				var searchAmenities = String( $( '.listar-search-filter-amenities' ).val() );

				if ( 'null' !== searchAmenities ) {
					$( '.listar-chosen-amenity' ).val( searchAmenities );
				}
			}

			$( this ).parent().parent().find( 'form' ).submit();
		} );

		$( '.listar-listing-category-link, .listar-card-category-name a[data-term-id]' ).on( 'click', function ( e ) {

			if ( $( '.listar-chosen-region' ).length ) {
				var chosenRegion = String( $( '.listar-chosen-region' ).val() );

				if ( 'null' !== chosenRegion && '' !== chosenRegion && '0' !== chosenRegion ) {
					if ( $( this )[0].hasAttribute( 'data-term-id' ) ) {
						var searchCategories = String( $( this ).attr( 'data-term-id' ) );

						if ( 'null' !== searchCategories ) {
							$( '.listar-chosen-category' ).val( searchCategories );
							$( '.listar-chosen-region' ).parents( 'form' ).submit();

							e.preventDefault();
							e.stopPropagation();
						}
					}
				}
			}
		} );

		$( '.search-form input' ).keyup( function ( e ) {
			if ( 13 === e.keyCode ) {
				$( this ).trigger( 'enterKey' );
			}
		} );

		/* Avoid line breaks */

		$( theBody ).on( 'change paste keyup', '#job_location', function () {
			if ( 'undefined' !== typeof $( this ).attr( 'value' ) ) {
				$( this ).attr( 'value', $( this ).attr( 'value' ).replace( /( \r\ n| \n| \r\r\n|\n|\r)/gm, ' ' ) );
			} else if ( 'undefined' !== typeof $( this ).prop( 'innerHTML' ) ) {
				$( this ).prop( 'innerHTML', $( this ).prop( 'innerHTML' ).replace( /( \r\ n| \n| \r\r\n|\n|\r)/gm, ' ' ) );
			}
		} );

		$( 'input[name=submit_job]' ).on( 'click', function ( e ) {

			validatePhoneCharacters( $( '#submit-job-form #company_phone, #submit-job-form #company_fax, #submit-job-form #company_mobile, #submit-job-form #company_whatsapp' ) );

			var
				str = $( 'iframe' ).eq( 0 ).contents().find( '.job_description' ).prop( 'innerHTML' ),
				wpJbManagerCheckeboxesFix = '',
				count = 0,
				priceFrom,
				priceTo,
				phoneField  = $( '#submit-job-form #company_phone' ),
				faxField    = $( '#submit-job-form #company_fax' ),
				mobileField = $( '#submit-job-form #company_mobile' ),
				whatsappField = $( '#submit-job-form #company_whatsapp' );

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

			var
				operationHours = [];

			if ( 'string' === typeof str ) {
				str = str.replace( /<\s*br\/*>/gi, '\n' );
				str = str.replace( /<\s*p\/*>/gi, '\n' );
				str = str.replace( /<\s*b\/*>/gi, '\n' );
				str = str.replace( /<\s*i\/*>/gi, '\n' );
				str = str.replace( /<\s*a.*href="(.*?)".*>(.*?)<\/a>/gi, ' $2 (Link->$1) ' );
				str = str.replace( /<\s*\/*.+?>/ig, '\n' );
				str = str.replace( / {2,}/gi, ' ' );
				str = str.replace( /\n+\s*/gi, '\n\n' );

				while ( str.indexOf( '(Link' ) >= 0 ) {
					count++;
					str = str.replace( /\(.*?\)/gi, '' );

					if ( 10 === count ) {
						break;
					}
				}

				str = str.replace( /\n/gi, '' );
				str = str.replace( /\}/gi, '' );
				str = str.replace( /\{/gi, '' );
				str = str.replace( /\[/gi, '' );
				str = str.replace( /\]/gi, '' );
				str = str.replace( /\(/gi, '' );
				str = str.replace( /\)/gi, '' );
				str = str.replace( /\'/gi, '' );
				str = str.replace( /\"/gi, '' );
				str = str.replace( /  /gi, '' );

				$( '#company_excerpt' ).attr( 'value', str );
			}

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
			
			$( '#job_business_raw_contents' ).each( function () {
				var rawTextarea = $( this );
				var rawTextContent = '';
				var rawTextCurrent = '';
				
				$( '[id*="job_business_document_"][id*="_title"], .listar-price-builder-category-val, .listar-price-item-title-val, .listar-price-item-descr-val, .listar-price-item-link-val, .listar-price-item-label-val, #job_listing_subtitle, #job_tagline' ).each( function () {
					rawTextCurrent = $( this ).val();
					
					if ( 'string' === typeof rawTextCurrent ) {
						if ( '' !== rawTextCurrent ) {
							rawTextContent += rawTextCurrent + ' ';
						}
					}
				} );
				
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
			
			$( '#company_business_rich_media_values' ).val( richMediaJSON );

			/* Return only characters for princing fields - 0 until 9 and dot (.) */
			$( 'input[class*="price-range"]' ).each( function () {
				sanitizePricingFields( $( this ) );
			} );

			/* Return only characters for princing fields - 0 until 9 and dot (.) */
			$( 'input[name*="priceaverage"]' ).each( function () {
				sanitizePricingFields( $( this ) );
			} );

			/* Sets price range, if available */
			if ( $( '.listar-price-range-from' ).length && $( '.listar-price-range-to' ).length ) {
				var requiredPriceRange = $( '#job_pricerange' )[0].hasAttribute( 'required' );

				priceFrom = $( '.listar-price-range-from' ).val();
				priceTo = $( '.listar-price-range-to' ).val();

				priceFrom = 'string' !== typeof priceFrom || undefined === priceFrom || 'undefined' === priceFrom || 'NaN' === priceFrom || '' === priceFrom || 0 === priceFrom || '0' === priceFrom ? 0 : priceFrom;
				priceTo = 'string' !== typeof priceTo || undefined === priceTo || 'undefined' === priceTo || 'NaN' === priceTo || '' === priceTo || 0 === priceTo || '0' === priceTo ? 0 : priceTo;

				if ( parseInt( priceFrom, 10 ) > 0 ) {
					if ( parseInt( priceTo, 10 ) > 0 ) {
						if ( parseInt( priceTo, 10 ) <= parseInt( priceFrom, 10 ) ) {
							if ( requiredPriceRange ) {
								$( '.listar-price-range-to' ).val( '' );
							} else {
								$( '.listar-price-range-to' ).val( parseInt( priceFrom, 10 ) * 2 );
								$( '.listar-price-range-from' ).trigger( 'change' );
							}
						}
					} else {
						if ( requiredPriceRange ) {
							$( '.listar-price-range-to' ).val( '' );
						} else {
							$( '.listar-price-range-to' ).val( parseInt( priceFrom, 10 ) * 2 );
							$( '.listar-price-range-from' ).trigger( 'change' );
						}
					}
				} else {
					$( '.listar-price-range-from' ).val( '' );
				}

				priceFrom = $( '.listar-price-range-from' ).val();
				priceTo = $( '.listar-price-range-to' ).val();

				priceFrom = 'string' !== typeof priceFrom || undefined === priceFrom || 'undefined' === priceFrom || 'NaN' === priceFrom || '' === priceFrom || 0 === priceFrom || '0' === priceFrom ? 0 : priceFrom;
				priceTo = 'string' !== typeof priceTo || undefined === priceTo || 'undefined' === priceTo || 'NaN' === priceTo || '' === priceTo || 0 === priceTo || '0' === priceTo ? 0 : priceTo;

				$( '#job_pricerange' ).val( parseInt( priceFrom, 10 ) + '/////' + parseInt( priceTo, 10 ) );
			}

			/* Social networks are required? */
			$( '#company_use_social_networks' ).each( function () {
				var isRequired = $( this )[0].hasAttribute( 'required' );
				var hasSomeValue = false;

				if ( isRequired ) {
					$( '.listar-business-social-network-fields input' ).each( function () {
						var fieldValue = $( this ).val();

						if ( '' !== fieldValue && undefined !== fieldValue && 'undefined' !== fieldValue && 0 !== fieldValue ) {
							hasSomeValue = true;
						}
					} );

					if ( ! hasSomeValue && $( this ).is( ':checked' ) ) {
						$( this )[0].click();
					}
				}
			} );

			/* External references are required? */
			$( '#company_use_external_links' ).each( function () {
				var isRequired = $( this )[0].hasAttribute( 'required' );
				var hasSomeValue = false;

				if ( isRequired ) {
					$( '.listar-business-external-link-fields input' ).each( function () {
						var fieldValue = $( this ).val();

						if ( '' !== fieldValue && undefined !== fieldValue && 'undefined' !== fieldValue && 0 !== fieldValue ) {
							hasSomeValue = true;
						}
					} );

					if ( ! hasSomeValue && $( this ).is( ':checked' ) ) {
						$( this )[0].click();
					}
				}
			} );

			// Prepare operation hours.

			if ( $( '.listar-business-hours-fields tr[class*="listar-business-hours-row"]' ).length ) {

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

				$( 'input#job_business_hours_monday' ).val( operationHours[0] );
				$( 'input#job_business_hours_tuesday' ).val( operationHours[1] );
				$( 'input#job_business_hours_wednesday' ).val( operationHours[2] );
				$( 'input#job_business_hours_thursday' ).val( operationHours[3] );
				$( 'input#job_business_hours_friday' ).val( operationHours[4] );
				$( 'input#job_business_hours_saturday' ).val( operationHours[5] );
				$( 'input#job_business_hours_sunday' ).val( operationHours[6] );
			}

			/* Avoid line breaks */
			$( '#job_location' ).each( function () {
				if ( 'undefined' !== typeof $( this ).attr( 'value' ) ) {
					$( this ).attr( 'value', $( this ).attr( 'value' ).replace( /( \r\ n| \n| \r\r\n|\n|\r)/gm, ' ' ) );
				} else if ( 'undefined' !== typeof $( this ).prop( 'innerHTML' ) ) {
					$( this ).prop( 'innerHTML', $( this ).prop( 'innerHTML' ).replace( /( \r\ n| \n| \r\r\n|\n|\r)/gm, ' ' ) );
				}
			} );

			/* Fix for WP Job Manager checkboxes - Needed only for front end */
			$( '#submit-job-form input[type="checkbox"]' ).each( function () {
				var checkboxChecked = $( this ).is( ':checked' ) ? '1' : '0';
				wpJbManagerCheckeboxesFix += 'checkboxischecked_' + checkboxChecked + '_' + $( this ).attr( 'name' ) + '-----';
			} );

			$( '#job_fix_for_checkboxes' )
				.val( wpJbManagerCheckeboxesFix )
				.attr( 'value', wpJbManagerCheckeboxesFix );

			$( '#featured_job_category' ).each( function () {
				var featuredCategoryChosen = $( this ).val();
				$( '#company_featured_listing_category' ).val( featuredCategoryChosen );
			} );

			if ( multipleRegionsActive ) {
				$( '#featured_job_region' ).each( function () {
					var featuredRegionChosen = $( this ).val();
					$( '#company_featured_listing_region' ).val( featuredRegionChosen );
				} );
			}

			var hasIssues = false;

			/* Get built pricing menu values  */
			$( '#submit-job-form input[name="job_business_use_price_list"]' ).each( function () {
				if ( $( this ).is( ':checked' ) && $( '#job_business_use_catalog' ).is( ':checked' ) ) {
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

                                                                                JSONValues  = '[';
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                return false;
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

                                                                        JSONValues  = '[';
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        return false;
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

                                                                        JSONValues  = '[';
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        return false;
                                                                }
                                                        } else {
                                                                priceCatID = $( this ).attr( 'id' );

                                                                var priceCategoryItems = $( '.listar-price-item[data-category="' + priceCatID + '"]' );

                                                                if ( ! priceCategoryItems.length ) {
                                                                        if ( ! hasIssues ) {
                                                                                hasIssues = true;

                                                                                alert( listarLocalizeAndAjax.categoryNoItems );

                                                                                JSONValues  = '[';
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                return false;
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

                                                                                                        JSONValues  = '[';
                                                                                                        e.preventDefault();
                                                                                                        e.stopPropagation();
                                                                                                        return false;
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

                                                                                                JSONValues  = '[';
                                                                                                e.preventDefault();
                                                                                                e.stopPropagation();
                                                                                                return false;
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

					$( '#job_business_price_list_content' ).val( JSONValues ).attr( 'value', JSONValues ).prop( 'innerHTML', JSONValues );
				}

				setTimeout( function () {
					hasIssues = false;
				}, 20 );
			} );

			if ( ! hasIssues ) {

				/* Menu is required? */
				$( '#job_business_use_catalog' ).each( function () {
					var isRequired = $( this )[0].hasAttribute( 'required' );
					var hasSomeValue = false;

					if ( isRequired ) {
						if ( $( '#job_business_use_price_list' ).is( ':checked' ) ) {
							$( '.listar-boxed-fields-price-list .listar-price-item .listar-price-item-title-val' ).each( function () {
								var fieldValue = $( this ).val();

								if ( 'string' === typeof fieldValue && 'undefined' !== fieldValue && 'NaN' !== fieldValue && '0' !== fieldValue && '' !== fieldValue ) {
									fieldValue = fieldValue.trim();

									if ( '' !== fieldValue ) {
										hasSomeValue = true;
									}
								}
							} );
						}

						if ( $( '#job_business_use_catalog_documents' ).is( ':checked' ) ) {
							$( '.listar-boxed-fields-docs-upload input[type="file"], .listar-boxed-fields-docs-upload input[name*="current_job_business_document_"][type="hidden"]' ).each( function () {
								var fieldValue = $( this ).val();

								if ( '' !== fieldValue && undefined !== fieldValue && 'undefined' !== fieldValue && 0 !== fieldValue ) {
									hasSomeValue = true;
								}
							} );
						}

						if ( $( '#job_business_use_catalog_external' ).is( ':checked' ) ) {
							$( '.listar-boxed-fields-docs-external input[name*="_file_external"]' ).each( function () {
								var fieldValue = $( this ).val();

								if ( '' !== fieldValue && undefined !== fieldValue && 'undefined' !== fieldValue && 0 !== fieldValue ) {
									hasSomeValue = true;
								}
							} );
						}

						if ( ! hasSomeValue && $( this ).is( ':checked' ) ) {
							$( this )[0].click();
						}
					}
				} );

				/* Convert <script> tags to <iframes> */
				$( '#submit-job-form' ).find( 'textarea' ).each( function () {
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

				var fixListingCoords = fixListingCoordinates( $( 'input[name="job_customlatitude"]' ), $( 'input[name="job_customlongitude"]' ) );

				if ( ! fixListingCoords ) {
					e.preventDefault();
					e.stopPropagation();
				} else {
					var fixLastChar = fixLastCharacterCoordinates( $( 'input[name="job_customlatitude"]' ), $( 'input[name="job_customlongitude"]' ) );
					if ( ! fixLastChar ) {
						e.preventDefault();
						e.stopPropagation();
					}
				}
			}
		} );

		thisElement = $( '.listar-logged-user-menu-wrapper' );

		theBody.on( 'click', function ( e ) {
			var thisElement = $( e.target );

			if ( thisElement.length && ! preventEvenCallStack2 && ! breakClickLoop ) {

				if ( (
					'listar-logged-user-menu-wrapper' === thisElement.attr( 'class' ) ||
					'listar-logged-user-menu-wrapper' === thisElement.parent().attr( 'class' ) ||
					'listar-logged-user-menu-wrapper' === thisElement.parent().parent().attr( 'class' ) ||
					'listar-logged-user-menu-wrapper' === thisElement.parent().parent().parent().attr( 'class' ) ||
					'listar-logged-user-menu-wrapper' === thisElement.parent().parent().parent().parent().attr( 'class' ) ||
					'listar-logged-user-menu-wrapper' === thisElement.parent().parent().parent().parent().parent().attr( 'class' ) ||
					thisElement.hasClass( 'listar-user-login' )
				) ) {
					closeUserMenu  = false;
					breakClickLoop = true;

					setTimeout( function () {
						breakClickLoop = false;
					}, 40 );
				} else {
					closeUserMenu = true;
					mouseleaveUserMenu();
				}
			}
		} );

		$( '.listar-user-logged header .listar-user-buttons .listar-user-login' ).on( 'click', function ( e ) {
			var menuRight = thisElement.length ? thisElement.css( 'right' ) : 0;
			menuRight = parseInt( menuRight.replace( /[^-\d\.]/g, '' ), 10 );

			e.preventDefault();
			e.stopPropagation();

			if ( menuRight < 0 && viewport().width > 767 ) {
				toggleUserMenu();
			} else {
				$( toggler ).trigger( 'click' );
			}
		} );

		$( '.listar-logged-user-menu-wrapper' ).on( 'mouseleave', function () {
			var thisElement = $( '.listar-logged-user-menu-wrapper' );

			if ( '-500px' === thisElement.css( 'right' ) ) {
				thisElement.stop().animate( { 'right' : [ 0, 'easeOutExpo' ] }, { duration : 500 } );
			} else {
				thisElement.stop().animate( { 'right' : - 500 }, { duration : 500 } );
			}
		} );

		/* Also, close .listar-logged-user-menu-wrapper if hovering on main menu links on */
		$( '#listar-primary-menu li, .listar-header-search-button' ).on( 'mouseenter click', function () {
			$( '.listar-logged-user-menu-wrapper' ).stop().animate( { 'right' : - 500 }, { duration : 500 } );
		} );

		theBody.on( 'click', '.listar-review-popup .choose-rating span', function ( e ) {
			var i = $( e.target ).index();
			var rating = 5 - i;

			$( e.target ).parent().find( 'span' ).removeClass( 'active' );

			for ( var j = 0; j < rating; j++ ) {
				$( e.target ).parent().find( 'span' ).eq( 4 - j ).addClass( 'active' );
			}

			$( e.target ).parent().find( 'input' ).attr( 'value', rating );

		} );

		$( '#job_useuseremail' ).on( 'click', function () {
			if ( $( '#job_useuseremail' ).is( ':checked' ) ) {
				$( '.fieldset-job_custom_email' ).css( { display : 'none' } );
			} else {
				$( '.fieldset-job_custom_email' ).css( { display : 'block' } );
			}
		} );

		$( '#job_business_use_hours' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-hours-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-hours-fields' ).addClass( 'hidden' );
			}
		} );

		$( '#job_business_use_custom_excerpt' ).on( 'click', function () {

			/* Display/hide custom excerpt field */
			toggleCheckboxDependantField( '#job_business_use_custom_excerpt', '.fieldset-job_business_custom_excerpt' );
		} );

		$( '#job_business_use_booking' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.fieldset-job_business_bookings_third_party_service' ).css( { display : 'block' } );
			} else {
				$( '.fieldset-job_business_bookings_third_party_service' ).css( { display : 'none' } );
			}
		} );

		$( '#company_use_social_networks' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-social-network-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-social-network-fields' ).addClass( 'hidden' );
			}
		} );

		$( '#company_use_external_links' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-external-link-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-external-link-fields' ).addClass( 'hidden' );
			}
		} );

		$( '#company_use_rich_media' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-rich-media-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-rich-media-fields' ).addClass( 'hidden' );
			}
		} );

		$( '#job_business_use_products' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-products-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-products-fields' ).addClass( 'hidden' );
			}
		} );

		$( '#job_business_use_catalog' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-catalog-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-catalog-fields' ).addClass( 'hidden' );
			}
		} );

		$( '#job_business_use_booking' ).on( 'click', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-booking-fields' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-booking-fields' ).addClass( 'hidden' );
			}
		} );

		$( theBody ).on( 'click', '#job_business_use_catalog_images', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-catalog-fields.listar-boxed-fields-catalog-gallery .listar-boxed-fields-inner' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-catalog-fields.listar-boxed-fields-catalog-gallery .listar-boxed-fields-inner' ).addClass( 'hidden' );
			}
		} );

		$( theBody ).on( 'click', '#job_business_use_catalog_documents', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-boxed-fields-inner' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-boxed-fields-inner' ).addClass( 'hidden' );
			}
		} );

		$( theBody ).on( 'click', '#job_business_use_price_list', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-inner' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-catalog-fields.listar-boxed-fields-price-list .listar-boxed-fields-inner' ).addClass( 'hidden' );
			}
		} );

		$( theBody ).on( 'click', '#job_business_use_catalog_external', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-catalog-fields.listar-boxed-fields-docs-external .listar-boxed-fields-inner' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-catalog-fields.listar-boxed-fields-docs-external .listar-boxed-fields-inner' ).addClass( 'hidden' );
			}
		} );

		$( theBody ).on( 'click', '#job_business_use_catalog_create', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( '.listar-business-catalog-fields.listar-boxed-fields-catalog-creator .listar-boxed-fields-inner' ).removeClass( 'hidden' );
			} else {
				$( '.listar-business-catalog-fields.listar-boxed-fields-catalog-creator .listar-boxed-fields-inner' ).addClass( 'hidden' );
			}
		} );

		executeOnLoadAndVisible();
		
		

		/* xxx */

		theBody.on( 'click', '.listar-show-more-social', function () {
			$( this ).css( 'display', 'none' );
			$( this ).parents( '.listar-boxed-fields-wrapper' ).find( 'fieldset' ).css( 'display', 'block' );
		} );

		/* Return only acceptable characters for a phone number */
		$( '#submit-job-form #company_phone, #submit-job-form #company_fax, #submit-job-form #company_mobile, #submit-job-form #company_whatsapp' ).on( 'change paste keyup', function () {
			validatePhoneCharacters( $( this ) );
		} );

		/* Return only characters for coordinates - 0 until 9 and dot (.) */
		$( 'input[name="job_customlatitude"], input[name="job_customlongitude"]' ).on( 'change paste keyup', function () {
			$( this ).attr( 'value', $( this ).attr( 'value' ).replace( /[^0-9\.-]/g, '' ) );
			fixListingCoordinates( $( 'input[name="job_customlatitude"]' ), $( 'input[name="job_customlongitude"]' ) );
		} );

		/* Return only characters for princing fields - 0 until 9 and dot (.) */
		$( theBody ).on( 'change paste keyup', 'input[class*="price-range"], input[name*="priceaverage"]', function () {
			sanitizePricingFields( $( this ) );
		} );

		$( '#listar_claim_sender_message' ).each( function () {
			var claimChars = $( this ).val();

			if ( dataMinimumClaimTextChars > 0 && requiredClaimCharsField.length ) {

				var missingChars = dataMinimumClaimTextChars - claimChars.length;
				missingChars = missingChars >= 0 ? missingChars : 0;

				$( '.listar-claim-missing-chars' ).prop( 'innerHTML', missingChars );

				$( this ).on( 'change paste keyup keydown', function () {
					var currentTextarea = $( this );

					setTimeout( function () {
						claimChars = currentTextarea.val();
						missingChars = dataMinimumClaimTextChars - claimChars.length;

						if ( missingChars > -1 ) {
							$( '.listar-claim-missing-chars' ).prop( 'innerHTML', missingChars );
						} else {
							$( '.listar-claim-missing-chars' ).prop( 'innerHTML', 0 );
						}
					}, 10 );
				} );
			}
		} );

		/* Average price */
		$( theBody ).on( 'change paste keyup', '.listar-price-range-from, .listar-price-range-to', function () {
			setTimeout( function () {
				var
					from = $( '.listar-price-range-from' ).val(),
					to = $( '.listar-price-range-to' ).val(),
					average = $( '#job_priceaverage' ),
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

		theBody.on( 'click', '.listar-disable-click', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		} );

		theBody.on( 'click', '.listar-more-results, .listar-more-map-listing', function ( e ) {
			var
				renewCircleEvents,
				button = $( this );

			if ( button.hasClass( 'listar-disable-click' ) ) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			button.addClass( 'listar-loading-results' );

			if ( ! button.hasClass( 'listar-go-to-listing-page' ) ) {

				renewCircleEvents = setInterval( function () {

					if ( ! theBody.hasClass( 'listar-loading-posts' ) ) {
						clearInterval( renewCircleEvents );
						circleEvents();

						if ( $( '.listar-ajax-map-markers' ).length ) {

							/* Geting the JSON from textarea element as string and convert it to a valid JSON object  */

							/* listarMapMarkers is declared globally out of this file and it's value can be overwritten here */
							/* jshint ignore: start */
							listarMapMarkers = JSON.parse( '[' + $( '.listar-ajax-map-markers' ).prop( 'innerText' ) + ']' );
							/* jshint ignore: end */

							markerCounterAfterLoad = listarMapMarkers.length;

							if ( markerCounterAfterLoad ) {
								var tempMarkerArray = [];

								for ( var n = 0; n < markerCounterAfterLoad; n++ ) {
									var tempMarker = listarMapMarkers[ n ];

									if ( 'string' === typeof tempMarker.lat && 'string' === typeof tempMarker.lng ) {
										tempMarker.lat = tempMarker.lat.replace( /[^0-9\.-]/g, '' );
										tempMarker.lng = tempMarker.lng.replace( /[^0-9\.-]/g, '' );
									}

									tempMarkerArray.push( tempMarker );
								}

								window.listarMapMarkers = tempMarkerArray;
								markerCounterAfterLoad = listarMapMarkers.length;
							}

							$( '.listar-ajax-map-markers' ).prop( 'outerHTML', '' );
							addAjaxMapMarkers();
							resetMap();
						}
					}
				}, 100 );
			}
		} );

		theBody.on( 'click', '.listar-hero-header .listar-close-aside-listings', function () {
			var list = $( this ).parent();
			var listRight = list.css( 'right' );

			if ( '0px' === listRight ) {
				$( this ).removeClass( 'icon-cross2' ).addClass( 'icon-location' );
				list.stop().animate( { right: - 290 }, { duration : 800 } );
			} else {
				$( this ).addClass( 'icon-cross2' ).removeClass( 'icon-location' );
				list.stop().animate( { right: 0 }, { duration : 800 } );
			}
		} );

		theBody.on( 'mouseenter', '#listar-primary-menu .dropdown-toggle', function () {
			var heroPosts = $( '.listar-hero-header .listar-aside-list ' );

			if ( heroPosts.length ) {
				heroPosts.stop().animate( { opacity : 0 }, { duration : 400 } );
			}
		} );

		theBody.on( 'mouseleave', '#masthead', function () {
			var heroPosts = $( '.listar-hero-header .listar-aside-list ' );

			if ( heroPosts.length ) {
				heroPosts.stop().animate( { opacity : 1 }, { duration : 400 } );
			}
		} );

		var hasAlerted = false;

		theBody.on( 'DOMSubtreeModified', '.select2-selection__rendered', function () {
			if ( ! hasAlerted ) {
				hasAlerted = true;
			}

			if ( false === preventEvenCallStack6 ) {
				preventEvenCallStack6 = true;

				verifySelect2SubtreePlaceholder();

				setTimeout( function () {
					preventEvenCallStack6 = false;
				}, 50 );
			}
		} );

		$( theBody ).on( 'select2:selecting', 'select[name*=job_hours]', function() {
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

		$( theBody ).on( 'select2:selecting', 'select[name*=company_business_rich_media_label]', function() {
			var theSelect = $( this );

			setTimeout( function () {
				if ( 'custom' === theSelect.val() ) {
					theSelect.parents( '.fieldset-company_business_rich_media_label' ).siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
				} else {
					theSelect.parents( '.fieldset-company_business_rich_media_label' ).siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
				}
			}, 10 );
		} );

		$( theBody ).on( 'select2:selecting', 'select[name*=job_business_products_label]', function() {
			var theSelect = $( this );

			setTimeout( function () {
				if ( 'custom' === theSelect.val() ) {
					theSelect.parents( '.fieldset-job_business_products_label' ).siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
				} else {
					theSelect.parents( '.fieldset-job_business_products_label' ).siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
				}
			}, 10 );
		} );

		$( theBody ).on( 'select2:selecting', 'select[name*=job_business_catalog_label]', function() {
			var theSelect = $( this );

			setTimeout( function () {
				if ( 'custom' === theSelect.val() ) {
					theSelect.parents( '.fieldset-job_business_catalog_label' ).siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
				} else {
					theSelect.parents( '.fieldset-job_business_catalog_label' ).siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
				}
			}, 10 );
		} );

		$( theBody ).on( 'select2:selecting', 'select[name*=job_business_booking_label]', function() {
			var theSelect = $( this );

			setTimeout( function () {
				if ( 'custom' === theSelect.val() ) {
					theSelect.parents( '.fieldset-job_business_booking_label' ).siblings( '.listar-boxed-fields-inner' ).removeClass( 'hidden' );
				} else {
					theSelect.parents( '.fieldset-job_business_booking_label' ).siblings( '.listar-boxed-fields-inner' ).addClass( 'hidden' );
				}
			}, 10 );
		} );

		$( theBody ).on( 'select2:selecting', 'select[name*=job_business_booking_method]', function() {
			var theSelect = $( this );

			$( '.fieldset-job_business_bookings_third_party_service, .fieldset-job_business_bookings_products_description' ).addClass( 'hidden' );

			setTimeout( function () {
				if ( 'external' === theSelect.val() ) {
					$( '.fieldset-job_business_bookings_third_party_service' ).removeClass( 'hidden' );
				} else if ( 'booking' === theSelect.val() ) {
					$( '.fieldset-job_business_bookings_products_description' ).removeClass( 'hidden' );
				}
			}, 10 );
		} );

		$( theBody ).on( 'select2:selecting', 'select[name*=job_locationselector]', function() {
			var theSelect = $( this );

			setTimeout( function () {
				if ( 'location-custom' === theSelect.val() ) {
					$( '.fieldset-job_customlocation' ).addClass( 'listar-unhide' );
					theSelect.parents( '.listar-custom-location-fields' ).removeClass( 'listar-remove-last-border' );
				} else {
					$( '.fieldset-job_customlocation' ).removeClass( 'listar-unhide' );
					theSelect.parents( '.listar-custom-location-fields' ).addClass( 'listar-remove-last-border' );
				}
			}, 10 );
		} );
		
		

		/* xxx */ 
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		


		/*xxx */ 
		
		

		var isChangingSelect2Country = false;

		$( theBody ).on( 'select2:selecting', '.listar-search-by-near-postcode-countries', function() {
			var theSelect = $( this );

			if ( ! isChangingSelect2Country ) {
				isChangingSelect2Country = true;

				setTimeout( function () {
					$( '.listar-search-by-near-address-countries' ).each( function () {
						var newSelect2Value = theSelect.val();

						$( this ).find( 'option' ).each( function () {
							$( this ).removeAttr( 'selected' ).prop( 'selected', false );

							if ( newSelect2Value === $( this ).attr( 'value' ) ) {
								$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
							}
						} );

						theSelect.find( 'option' ).each( function () {
							$( this ).removeAttr( 'selected' ).prop( 'selected', false );

							if ( newSelect2Value === $( this ).attr( 'value' ) ) {
								$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
							}
						} );

						$( this ).attr( 'value', theSelect.val() ).val( theSelect.val() ).select2().trigger( 'change' );
						theSelect.attr( 'value', theSelect.val() ).val( theSelect.val() ).select2().trigger( 'change' );

					} );

					$( '.search-form input[name="' + listarLocalizeAndAjax.selectedCountryTranslation + '"]' ).each( function () {
						$( this ).val( theSelect.val() ).attr( 'value', theSelect.val() );
					} );

					isChangingSelect2Country = false;
				}, 10 );
			}
		} );

		$( theBody ).on( 'select2:selecting', '.listar-search-by-near-address-countries', function() {
			var theSelect = $( this );

			if ( ! isChangingSelect2Country ) {
				isChangingSelect2Country = true;

				setTimeout( function () {
					$( '.listar-search-by-near-postcode-countries' ).each( function () {
						var newSelect2Value = theSelect.val();

						$( this ).find( 'option' ).each( function () {
							$( this ).removeAttr( 'selected' ).prop( 'selected', false );

							if ( newSelect2Value === $( this ).attr( 'value' ) ) {
								$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
							}
						} );

						theSelect.find( 'option' ).each( function () {
							$( this ).removeAttr( 'selected' ).prop( 'selected', false );

							if ( newSelect2Value === $( this ).attr( 'value' ) ) {
								$( this ).attr( 'selected', 'selected' ).prop( 'selected', true );
							}
						} );

						$( this ).attr( 'value', theSelect.val() ).val( theSelect.val() ).select2().trigger( 'change' );
						theSelect.attr( 'value', theSelect.val() ).val( theSelect.val() ).select2().trigger( 'change' );
					} );

					$( '.search-form input[name="' + listarLocalizeAndAjax.selectedCountryTranslation + '"]' ).each( function () {
						$( this ).val( theSelect.val() ).attr( 'value', theSelect.val() );
					} );

					isChangingSelect2Country = false;
				}, 10 );
			}
		} );

		function tryNearestMePopup( forceNearest ) {
			var canSubmitAutomatically = true;
			var exploreBy = 'default';

			if ( $( '.listar-search-by-options-wrapper a[data-explore-by-order="nearest_me"]' ).length || true === forceNearest ) {
				exploreBy = 'nearest_me';

				var hasUserLatitudeAndLongitude = false;
				var userLatitudeField = $( 'input[name="listar_geolocated_data_latitude"]' );
				var userLongitudeField = $( 'input[name="listar_geolocated_data_latitude"]' );

				if ( userLatitudeField.length && userLongitudeField.length ) {
					if ( '' !== userLatitudeField.val() && '' !==  userLongitudeField.val() ) {
						hasUserLatitudeAndLongitude = true;
					}
				}

				if ( ! hasUserLatitudeAndLongitude) {

					canSubmitAutomatically = false;

					if ( $( '#menu-primary-menu .listar-header-search-button' ).length ) {
						$( '#menu-primary-menu .listar-header-search-button' ).eq( 0 )[0].click();
						
						if ( $( '.listar-search-by-options-wrapper a[data-explore-by-order="nearest_me"]' ).length && $( '.search-form .listar-search-by-button' ).length ) {
							setTimeout( function () {
								$( '.search-form .listar-search-by-button' )[0].click();
							}, 500 );

							setTimeout( function () {
								$( '.listar-search-by-options-wrapper a[data-explore-by-order="nearest_me"]' )[0].click();
							}, 600 );
						} else {
							forceNearestMePopup();
						}
					} else if ( $( '.search-form .listar-search-by-button' ).length ) {
						
						if ( $( '.listar-search-by-options-wrapper a[data-explore-by-order="nearest_me"]' ).length && $( '.search-form .listar-search-by-button' ).length ) {
							$( '.search-form .listar-search-by-button' )[0].click();

							setTimeout( function () {
								$( '.listar-search-by-options-wrapper a[data-explore-by-order="nearest_me"]' )[0].click();
							}, 100 );
						} else {
							forceNearestMePopup();
						}
					} else if ( true ===forceNearest ) {
						forceNearestMePopup();
					} else {
						canSubmitAutomatically = true;
					}
				} else {
					canSubmitAutomatically = true;
				}
			} else {
				exploreBy = 'default';
			}

			return [ canSubmitAutomatically, exploreBy ];
		}
		
		/*
		 * Force Select2 deselect for dynamic select2 <option>s,
		 * like Ajax search filter <options> that are created dynamically.
		 **/
		
		theBody.on("select2:unselect", 'select[data-select2-id]', function(e){
			if ( 'undefined' !== typeof e.params.data.id ) {
				var wanted_id = e.params.data.id;
				var wanted_option = $( this ).find( 'option[value="'+ wanted_id +'"]' );

				wanted_option.prop('selected', false);
				$( this ).trigger('change.select2');
			}
		} );

		theBody.on( 'change', '.listar-filter-form-wrapper select', function () {
			var currentSelect = $( this );

			
			setTimeout( function () {

				var standardSearchForm = $( '.search-form' );
				var canSubmitAutomatically = true;

				if ( $( 'input[name="' + listarLocalizeAndAjax.listingSortTranslation + '"]' ).length && $( '.listar-search-sort-listings' ).length ) {
					var sortOrder = $( '.listar-search-sort-listings' ).val();
					var exploreBy = 'default';

					if (
						'newest' === sortOrder ||
						'oldest' === sortOrder ||
						'asc' === sortOrder ||
						'desc' === sortOrder
					) {
						exploreBy = 'default';
					} else if ( 'random' === sortOrder ) {
						if ( $( '.listar-search-by-options-wrapper a[data-explore-by-order="random"]' ).length ) {
							exploreBy = 'surprise';
						} else {
							exploreBy = 'default';
						}
					} else if ( 'best_rated' === sortOrder ) {
						if ( $( '.listar-search-by-options-wrapper a[data-explore-by-order="best_rated"]' ).length ) {
							exploreBy = 'best_rated';
						} else {
							exploreBy = 'default';
						}
					} else if ( 'most_viewed' === sortOrder ) {
						if ( $( '.listar-search-by-options-wrapper a[data-explore-by-order="most_viewed"]' ).length ) {
							exploreBy = 'most_viewed';
						} else {
							exploreBy = 'default';
						}
					} else if ( 'most_bookmarked' === sortOrder ) {
						if ( $( '.listar-search-by-options-wrapper a[data-explore-by-order="most_bookmarked"]' ).length ) {
							exploreBy = 'most_bookmarked';
						} else {
							exploreBy = 'default';
						}
					} else if ( 'nearest_me' === sortOrder ) {
						var tempVar = tryNearestMePopup();

						canSubmitAutomatically = tempVar[0];
						exploreBy = tempVar[1];
					} else if ( 'near_address' === sortOrder ) {
						if ( $( '.listar-search-by-options-wrapper a[data-explore-by-order="near_address"]' ).length ) {
							exploreBy = 'near_address';
							canSubmitAutomatically = false;

							standardSearchForm.each( function () {
								var addressSaved = $( this ).find( 'input[name="' + listarLocalizeAndAjax.savedAddressTranslation + '"]' ).val();
								$( this ).find( 'input[data-name="s"]' ).val( addressSaved );
							} );

							if ( $( '#menu-primary-menu .listar-header-search-button' ).length && listarLocalizeAndAjax.listingSortTranslation === currentSelect.attr( 'name' ) ) {
								$( '#menu-primary-menu .listar-header-search-button' ).eq( 0 )[0].click();

								setTimeout( function () {
									$( '.search-form .listar-search-by-button' )[0].click();
								}, 500 );

								setTimeout( function () {
									$( '.listar-search-by-options-wrapper a[data-explore-by-order="near_address"]' )[0].click();
								}, 510 );
							} else {
								canSubmitAutomatically = true;
							}
						} else {
							exploreBy = 'default';
							canSubmitAutomatically = true;
						}
					} else if ( 'near_postcode' === sortOrder ) {
						if ( $( '.listar-search-by-options-wrapper a[data-explore-by-order="near_postcode"]' ).length ) {
							exploreBy = 'near_postcode';
							canSubmitAutomatically = false;

							standardSearchForm.each( function () {
								var postcodeSaved = $( this ).find( 'input[name="' + listarLocalizeAndAjax.savedPostcodeTranslation + '"]' ).val();
								$( this ).find( 'input[data-name="s"]' ).val( postcodeSaved );
							} );

							if ( $( '#menu-primary-menu .listar-header-search-button' ).length && listarLocalizeAndAjax.listingSortTranslation === currentSelect.attr( 'name' ) ) {
								$( '#menu-primary-menu .listar-header-search-button' ).eq( 0 )[0].click();

								setTimeout( function () {
									$( '.search-form .listar-search-by-button' )[0].click();
								}, 500 );

								setTimeout( function () {
									$( '.listar-search-by-options-wrapper a[data-explore-by-order="near_postcode"]' )[0].click();
								}, 510 );
							} else {
								canSubmitAutomatically = true;
							}
						} else {
							exploreBy = 'default';
							canSubmitAutomatically = true;
						}
					}

					$( 'input[name="' + listarLocalizeAndAjax.listingSortTranslation + '"]' ).val( sortOrder );
					$( 'input[name="' + listarLocalizeAndAjax.exploreByTranslation + '"]' ).val( exploreBy );
				}

				if ( $( 'input[name="' + listarLocalizeAndAjax.listingRegionsTranslation + '"]' ).length && $( '.listar-search-filter-regions' ).length ) {
					$( 'input[name="' + listarLocalizeAndAjax.listingRegionsTranslation + '"]' ).val( $( '.listar-search-filter-regions' ).val() );
				}

				if ( $( 'input[name="' + listarLocalizeAndAjax.listingCategoriesTranslation + '"]' ).length && $( '.listar-search-filter-categories' ).length ) {
					$( 'input[name="' + listarLocalizeAndAjax.listingCategoriesTranslation + '"]' ).val( $( '.listar-search-filter-categories' ).val() );
				}

				if ( $( 'input[name="' + listarLocalizeAndAjax.listingAmenitiesTranslation + '"]' ).length && $( '.listar-search-filter-amenities' ).length ) {
					$( 'input[name="' + listarLocalizeAndAjax.listingAmenitiesTranslation + '"]' ).val( $( '.listar-search-filter-amenities' ).val() );
				}

				if ( canSubmitAutomatically ) {
					if ( standardSearchForm.length ) {
						$( '.listar-search-by-options-wrapper a[data-explore-by-order="' + exploreBy + '"]' ).each( function () {
							$( this )[0].click();
						} );

						standardSearchForm.submit();
					} else {
						$( '.listar-filter-form-wrapper form' ).submit();
					}
				}
			}, 10 );
		} );

		theBody.on( 'click', function ( e ) {
			if ( $( e.target ).hasClass( 'select2-selection__choice__remove' ) ) {
				var select,
					options,
					visibleSelected,
					selectClass = $( e.target ).attr( 'class' ).split( '____' );

				selectClass = selectClass[1];
				select  = $( '.' + selectClass );
				options = select.find( 'option' );
				visibleSelected = select.siblings( '.select2-container' ).find( '.select2-selection__choice' );

				if ( select.length ) {
					if ( select[0].hasAttribute( 'data-selected-count' ) ) {
						if ( '1' === select.attr( 'data-selected-count' ) ) {
							select.attr( 'data-selected-count', '' );
							select.val( '' );
							options.removeAttr( 'selected' ).prop( 'selected', false );

							$( 'body.search, body.archive' ).addClass( 'listar-hide-select2-dropdown' );

							setTimeout( function () {
								select  = $( '.' + selectClass );
								visibleSelected = select.siblings( '.select2-container' ).find( '.select2-selection__choice' );

								if ( visibleSelected.length ) {
									visibleSelected.prop( 'outerHTML', '' );
									$( '.listar-filter-form-wrapper select' ).eq( 0 ).trigger( 'change' );
								}
							}, 15 );
						}
					}
				}
			}
		} );

		theBody.on( 'click', '.listar-newsletter-submit', function () {
			$( this ).closest( 'form' ).submit();
		} );

		$( '.select2-search__field' ).keyup( function () {
			var thisSelect2Expanded = $( this ).parents( '.select2-selection[aria-expanded=true]' );

			if ( thisSelect2Expanded && '' === $( this ).val() ) {
				prepareSelect2Hierarchy( thisSelect2Expanded );
			}
		} );

		theBody.on( 'click', '.select2-selection[aria-expanded=true]', function () {
			var thisSelect2Expanded = $( this );
			prepareSelect2Hierarchy( thisSelect2Expanded );
		} );

		theBody.on( 'click', '.listar-package-clickable-area', function ( e ) {
			var button = $( this ).parents( '.listar-package-standard-form' );

			if ( isClaimingListing ) {
				e.preventDefault();
				e.stopPropagation();

				// Claiming listing.
				currentClaimPackageID = button.find( 'a[data-package]' ).attr( 'data-package' );

				stopScrolling( 1 );
				$( '.listar-claim-popup' ).addClass( 'listar-showing-claim' ).css( { left : 0, opacity : 1 } );

			} else if ( button.length > 0 ) {
				button = button.find( 'input[type="radio"]' );

				if ( button.length > 0 ) {

					button.prop( 'checked', true );
					button.parents( 'form' ).submit();

					e.preventDefault();
					e.stopPropagation();

					isStandardPackage = true;

					return false;
				}
			}
		} );

		theBody.on( 'click', '.listar-package-content', function ( e ) {
			if ( ! isStandardPackage ) {
				var button = $( this ).find( '.button' );

				if ( button.length && ! preventEvenCallStack4 ) {
					preventEvenCallStack4 = true;

					if ( '#' !== button.attr( 'href' ) ) {
						$( location ).attr( 'href', button.attr( 'href' ) );
					}
				}
			} else {
				e.preventDefault();
				e.stopPropagation();
			}
		} );

		theBody.on( 'click', '.listar-featured-listing-term-item, .listar-listing-card', function ( e ) {
			var thisElem = $( this ).parent();

			if ( thisElem.hasClass( 'owl-item' ) ) {
				if ( ! thisElem.hasClass( 'active' ) ) {
					e.preventDefault();
					e.stopPropagation();

					preventEvenCallStack5 = true;

					if ( e.clientX > viewport().width / 2 ) {
						thisElem.parent().parent().parent().find( '.owl-next' ).trigger( 'click' );
					} else {
						thisElem.parent().parent().parent().find( '.owl-prev' ).trigger( 'click' );
					}

					if ( $( this ).find( ".listar-card-content-image" ).length ) {
						$( this ).find( ".listar-card-content-image" ).trigger( 'mouseleave' );
					}

					setTimeout( function () {
						preventEvenCallStack5 = false;
					}, 50 );
				}
			}
		} );

		theBody.on( 'click', '.listar-listing-regions-popup .listar-featured-listing-term-item', function ( e ) {
			var termID = 0,
				termName = 0,
				thisElem = $( this ).find( 'a' );

			if ( ! forceTermClick ) {
				e.preventDefault();
				e.stopPropagation();
			}

			if ( ! disableRegionSelector ) {
				if ( ! preventEvenCallStack5 ) {
					termID = thisElem.attr( 'data-term-id' );
					termName = thisElem.attr( 'data-term-name' );

					$( '.listar-listing-regions-popup .listar-back-site' ).trigger( 'click' );

					setTimeout( function () {
						$( '.listar-all-regions-button.current span strong' ).prop( 'innerHTML', termName );
						$( '.listar-chosen-region' ).val( termID );
						$( '.listar-all-regions-button' ).addClass( 'listar-has-selected-region' );

						if ( theBody.hasClass( 'listar-after-region-selected-search-immediately' ) ) {
							$( '.listar-search-submit' )[0].click();
						}
					}, 50 );
				}

				if ( $( '.listar-front-header' ).length ) {
					stopScrolling( 0 );
				}
			}
		} );

		theBody.on( 'click', '.listar-partners a[href="#"]', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		} );

		theBody.on( 'click', '.wp-caption-text', function () {
			if ( $( this ).siblings( '.gallery-icon' ).find( 'a' ).length ) {
				$( this ).siblings( '.gallery-icon' ).find( 'a' ).trigger( 'click' );
			}
		} );

		theBody.on( 'click', '.listar-map-launch-wrapper button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( this ).parent().parent().removeClass( 'listar-hidden-map' );
			$( this ).parent().css( { display : 'none' } );
			$( this ).parents( '.listar-front-widget-wrapper' ).addClass( 'listar-map-launched' );
		} );

		theBody.on( 'mouseenter', '.listar-feature-item a', function () {
			if ( siblingsOpacityEnabled ) {
				$( this ).parents( '.listar-feature-items' ).addClass( 'listar-hovering-features' );
			} else {
				$( this ).parents( '.listar-feature-items' ).addClass( 'listar-hovering-features-grey' );
			}
		} );

		theBody.on( 'mouseleave', '.listar-feature-item a', function () {
			if ( siblingsOpacityEnabled ) {
				$( this ).parents( '.listar-feature-items' ).removeClass( 'listar-hovering-features' );
			} else {
				$( this ).parents( '.listar-feature-items' ).removeClass( 'listar-hovering-features-grey' );
			}
		} );

		theBody.on( 'mouseenter', '.listar-listing-gallery.listar-gallery-dark .gallery-item a,.listar-listing-gallery-nav-previous,.listar-listing-gallery-nav-next', function () {
			var gallery = listingGallery;

			if ( ! theBody.hasClass( 'listar-listing-has-slideshow-cover' ) ) {
				$( this ).parent().addClass( 'listar-dark-overlay' );
				$( this ).parent().find( '.listar-listing-gallery-item-caption' ).stop().animate( { opacity : 0 }, { duration : 1000 } );

				gallery.addClass( 'listar-hovering-gallery' );
			}

			checkGalleryHoverTimeout( gallery );
			hasGalleryMouseleave = false;
		} );

		theBody.on( 'mouseleave', '.listar-listing-gallery.listar-gallery-dark .gallery-item a,.listar-listing-gallery-nav-previous,.listar-listing-gallery-nav-next', function () {
			var gallery = listingGallery;

			if ( ! theBody.hasClass( 'listar-listing-has-slideshow-cover' ) ) {
				listingGalleryLinks.parent().removeClass( 'listar-dark-overlay' );
				$( this ).parent().find( '.listar-listing-gallery-item-caption' ).stop().animate( { opacity : 1 }, { duration : 1000 } );

				gallery.removeClass( 'listar-hovering-gallery' );
			}

			hasGalleryMouseleave = true;
			checkGalleryHoverTimeout( gallery);
		} );

		theBody.on( 'mouseenter', '.listar-regions a, .listar-term-items a', function () {
			if ( $( this ).parents( '.owl-item' ).length ) {
				if ( 0 === $( this ).parents( '.owl-item.active' ).length ) {
					return;
				}
			}

			if ( siblingsOpacityEnabled ) {
				$( this ).parents( '.listar-featured-listing-regions, .listar-term-items' ).addClass( 'listar-hovering-terms' );
			}
		} );

		theBody.on( 'mouseleave', '.listar-regions a, .listar-term-items a', function () {
			if ( $( this ).parents( '.owl-item' ).length ) {
				if ( 0 === $( this ).parents( '.owl-item.active' ).length ) {
					return;
				}
			}

			if ( siblingsOpacityEnabled ) {
				$( this ).parents( '.listar-featured-listing-regions, .listar-term-items' ).removeClass( 'listar-hovering-terms' );
			}
		} );

		theBody.on( 'mouseenter', '.listar-partners .listar-partner-has-url', function () {
			if ( siblingsOpacityEnabled ) {
				$( this ).parents( '.listar-partners' ).addClass( 'listar-hovering-partners' );
			}
		} );

		theBody.on( 'mouseleave', '.listar-partners .listar-partner-has-url', function () {
			if ( siblingsOpacityEnabled ) {
				$( this ).parents( '.listar-partners' ).removeClass( 'listar-hovering-partners' );
			}
		} );

		theBody.on( 'mouseenter', '.listar-package-content', function () {
			if ( siblingsOpacityEnabled ) {
				$( this ).parents( '.listar-pricing-table' ).addClass( 'listar-hovering-prices' );
			}
		} );

		theBody.on( 'mouseleave', '.listar-package-content', function () {
			if ( siblingsOpacityEnabled ) {
				$( this ).parents( '.listar-pricing-table' ).removeClass( 'listar-hovering-prices' );
			}
		} );

		$( '.entry-content .listar-wavy-badge-design' ).on( 'mousemove', function ( e ) {
			if ( ! isMobile() && viewport().width > 768 && viewport().width > viewport().height && ! animatingMask && $( this ).find( '.listar-animate-wavy-badge' ).length ) {

				var moveX = ( ( $( window ).width() / 2 ) - e.pageX ) * 0.1;
				var currentMaskYPosition = $( this ).offset().top;
				var moveY = ( ( $( window ).height() / 2 ) + currentMaskYPosition - e.pageY ) * 0.1;

				moveY = moveY > 50 ? 50 : moveY;
				moveY = moveY < ( -50 ) ? -50 : moveY;

				animatingMask = true;

				$( this ).find( '.listar-badge-masked-container .listar-masked-image' ).css( { marginLeft : moveX + 'px', marginTop : moveY + 'px' } );

				setTimeout( function () {
					animatingMask = false;
				}, 500 );

			}
		} );

		$( '.listar-cloudify-parallax' ).on( 'mousemove', function ( e ) {
			if ( ! isMobile() && viewport().width > 768 && viewport().width > viewport().height && ! animatingMask ) {

				var moveX = ( ( $( window ).width() / 2 ) - e.pageX ) * 0.1;
				var currentMaskYPosition = $( this ).offset().top;
				var moveY = ( ( $( window ).height() / 2 ) + currentMaskYPosition - e.pageY ) * 0.1;

				animatingMask = true;

				$( this ).find( '.listar-do-cloudify' ).each( function () {
					$( this ).css( { marginLeft : moveX * 0.6 + 'px', marginTop : moveY + 'px' } );
				} );

				setTimeout( function () {
					animatingMask = false;
				}, 500 );

			}
		} );

		theBody.on( 'mouseenter', '.widget_listar_listing_amenities .listar-term-link', function () {
			var thisAmenity = $( this );
			var amenityColor = thisAmenity.siblings( '.listar-term-inner' ).find( '.listar-term-background-overlay' ).css( 'background-color' );
			thisAmenity.parents( '.listar-featured-listing-term-item' ).removeClass( 'listar-not-hovering' );
			thisAmenity.parents( '.listar-featured-listing-term-item' ).siblings().addClass( 'listar-not-hovering' );
			thisAmenity.parents( '.listar-term-items' ).find( '.listar-term-text' ).css( { 'background-color' : "#fff", color : '#444' } );
			thisAmenity.siblings( '.listar-term-inner' ).find( '.listar-term-text' ).css( { 'background-color' : amenityColor, color : '#ffffff' } );
		} );

		theBody.on( 'mouseleave', '.widget_listar_listing_amenities .listar-term-link', function () {
			$( this ).parents( '.listar-term-items' ).find( '.listar-term-text' ).css( { 'background-color' : "#fff", color : '#444' } );
			$( this ).parents( '.listar-term-items' ).find( '.listar-featured-listing-term-item' ).removeClass( 'listar-not-hovering' );
		} );

		$( theBody ).on( 'mouseenter', '.listar-primary-navigation-wrapper .navbar-nav.listar-too-high-menu', function () {
			var highMenu = $( this );

			setTimeout( function () {
				if ( viewport().width > 767 ) {
					var menuScrollHeight = highMenu[0].scrollHeight;

					if ( $( '.page-template-front-page.listar-frontpage-topbar-transparent .site-header.listar-light-design .listar-header-background-animation-wrapper' ).length ) {
						$( '.listar-header-background-animation-wrapper' ).css( { top : menuScrollHeight - 50, opacity : 1 } );
					} else {
						$( '.listar-header-background-animation-wrapper' ).css( { top : menuScrollHeight - 50 } );
					}
				}
			}, 10 );
		} );

		$( theBody ).on( 'mouseleave', '.listar-primary-navigation-wrapper .navbar-nav.listar-too-high-menu', function () {
			setTimeout( function () {
				if ( viewport().width > 767 ) {
					if ( $( '.page-template-front-page.listar-frontpage-topbar-transparent .site-header.listar-light-design .listar-header-background-animation-wrapper' ).length ) {
						$( '.listar-header-background-animation-wrapper' ).css( { top : '', opacity : '' } );
					} else {
						$( '.listar-header-background-animation-wrapper' ).css( { top : '' } );
					}
				}
			}, 10 );
		} );

		$( theBody ).on( 'click', '.listar-testimonial-avatar', function () {
			var index = $( this ).index();
			$( this ).addClass( 'current' );
			$( this ).siblings().removeClass( 'current' );

			$( this ).parents( '.listar-review-items' ).find( '.listar-testimonial-item' ).eq( index ).siblings().stop().animate( { opacity : 0 }, {  duration : 500, complete : function () {
				$( this )
					.css( { display : 'none' } )
					.removeClass( 'current' );

				$( this ).parents( '.listar-review-items' ).find( '.listar-testimonial-item' ).eq( index )
					.css( { display : 'block' } )
					.addClass( 'current' )
					.stop().animate( { opacity : 1 }, {  duration : 500 } );
			} } );
		} );

		$( theBody ).on( 'click', '.listar-back-to-top', function () {
			$( 'html, body' ).animate( { scrollTop: 0 }, 1000 );
		} );

		$( theBody ).on( 'mouseenter', '.listar-listing-gallery a', function () {
			var gallery   = listingGallery;
			var galleryBG = $( '.listar-listing-gallery-backgrounds' );


			if ( gallery.hasClass( 'listar-gallery-dark' ) ) {
				galleryBG.css( { 'background-image' : 'url(' + $( this ).attr( 'href' ) + ')' } );
			}
		} );

		$( theBody ).on( 'click', '.listar-listing-gallery-nav-next', function () {
			currentListingGallerySlide++;

			if ( currentListingGallerySlide < maxListingGallerySlides ) {
				listingGallery.find( '.listar-gallery-slideshow-slides-wrapper' ).css( { marginLeft : -1 * ( currentListingGallerySlide * slideWidth ) } );
			} else {
				currentListingGallerySlide = 0;
				listingGallery.find( '.listar-gallery-slideshow-slides-wrapper' ).css( { marginLeft : 0 } );
			}
		} );

		$( theBody ).on( 'click', '.listar-listing-gallery-nav-previous', function () {
			currentListingGallerySlide--;

			if ( currentListingGallerySlide < 0 ) {
				var countSlides = listingGallery.find( '.listar-gallery-slideshow-slides .gallery-item' ).length - 3;
				currentListingGallerySlide = countSlides;

				listingGallery.find( '.listar-gallery-slideshow-slides-wrapper' ).css( { marginLeft : -1 * ( countSlides * slideWidth ) } );
			} else {
				listingGallery.find( '.listar-gallery-slideshow-slides-wrapper' ).css( { marginLeft : -1 * ( currentListingGallerySlide * slideWidth ) } );
			}
		} );

		$( theBody ).on( 'mouseenter', '.listar-gallery-slideshow-thumbs .gallery-item', function () {
			currentListingGallerySlide = $( this ).index();

			listingGallery.find( '.listar-gallery-slideshow-slides-wrapper' ).css( { marginLeft : -1 * ( currentListingGallerySlide * slideWidth ) } );
		} );

		$( '.listar-ajax-pagination' ).on( 'click', '.listar-blog-card.listar-grid-filler .listar-card-content a', function ( e ) {
			var loadMore = $( '.listar-load-more-section .listar-more-results' );
			var isFallbackBlogButton = $( this ).parent().find( '.listar-fallback-blog-button' );
			var hasCustomLink = $( this ).hasClass( 'listar-has-custom-card-link' ) ? true : false;

			if ( loadMore.length && ( isFallbackBlogButton.length || ! hasCustomLink ) ) {
				e.preventDefault();
				e.stopPropagation();

				loadMore.trigger( 'click' );
			}
		} );

		$( '.listar-social-share-options a, .listar-social-share-networks-wrapper .listar-social-networks a' ).on( 'click', function ( e ) {
			if ( ! $( this ).hasClass( 'listar-social-share-button-mail' ) && ! $( this ).hasClass( 'listar-social-share-button-copy' ) ) {
				e.preventDefault();
				e.stopPropagation();

				if ( $( this ).hasClass( 'listar-social-share-other' ) ) {
					stopScrolling( 1 );
					$( '.listar-social-share-popup' ).addClass( 'listar-showing-share' ).css( { left : 0, opacity : 1 } );
				} else {
					var
						hasScrollBar = $( this ).find( '.fa-pinterest' ).length ? 'no' : 'yes',
						popupTop     = screen.height / 2 - 200,
						popupLeft    = screen.width / 2 - 300;

					window.open( this.href, 'targetWindow', [ 'toolbar=no', 'location=no', 'status=no', 'menubar=no', 'scrollbars=' + hasScrollBar, 'resizable=yes', 'width=600', 'height=400', 'top=' + popupTop, 'left=' + popupLeft ].join( ',' ) );
				}
			}
		} );

		$( theBody ).on( 'click', '.listar-listing-header-plus-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var theButton = $( this );

			if ( theButton.find( '.icon-plus' ).length ) {
				theButton.parents( '.listar-listing-header-topbar-wrapper' ).addClass( 'listar-show-all-topbar-buttons' );
				theBody.addClass( 'listar-showing-all-topbar-buttons' );
				theButton.find( '.icon-plus' )
					.removeClass( 'icon-plus' )
					.addClass( 'icon-minus' );
			} else {
				theButton.parents( '.listar-listing-header-topbar-wrapper' ).removeClass( 'listar-show-all-topbar-buttons' );
				theBody.removeClass( 'listar-showing-all-topbar-buttons' );
				theButton.find( '.icon-minus' )
					.addClass( 'icon-plus' )
					.removeClass( 'icon-minus' );
			}
		} );

		$( theBody ).on( 'click', '.listar-custom-checkbox', function () {
			var checkbox = $( this ).find( 'input[type="checkbox"]' );

			if( checkbox.is( ':checked' ) ) {
				checkbox.parent().addClass( 'listar-custom-checkbox-checked' );
			} else {
				checkbox.parent().removeClass( 'listar-custom-checkbox-checked' );
			}
		} );

		$( theBody ).on( 'click', '.listar-listing-header-video-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var listingVideo = $( '.listar-business-video-accordion a' );

			if ( listingVideo.length ) {
				listingVideo[0].click();
			}
		} );

		$( theBody ).on( 'click', '.listar-listing-header-gallery-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var galleryThumbURLs = $( '.listar-listing-gallery .gallery-item a' );

			if ( galleryThumbURLs.length ) {
				galleryThumbURLs.eq( 0 ).trigger( 'click' );
			}
		} );

		$( theBody ).on( 'click', '.listar-listing-header-copy-button, .listar-social-share-button-copy', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			copyTextToClipboard( currentURL );

			var labelElement = $( this ).find( '.listar-listing-header-topbar-item-label' );
			var label = labelElement.attr( 'data-copy-text' );
			var copiedLabel = labelElement.attr( 'data-copied-text' );

			labelElement.prop( 'innerHTML', copiedLabel );

			setTimeout( function () {
				labelElement.prop( 'innerHTML', label );
			}, 2000 );
		} );

		$( theBody ).on( 'click', '.listar-more-sharing-networks-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			if ( $( this ).hasClass( 'icon-plus' ) ) {
				$( this ).removeClass( 'icon-plus' );
				$( this ).addClass( 'icon-minus' );
				$( this ).parents( '.listar-social-share-popup' ).addClass( 'listar-show-all-sharing-networks' );
			} else {
				$( this ).addClass( 'icon-plus' );
				$( this ).removeClass( 'icon-minus' );
				$( this ).parents( '.listar-social-share-popup' ).removeClass( 'listar-show-all-sharing-networks' );
			}
		} );

		$( theBody ).on( 'click', '.listar-business-video-accordion .icon-play-circle', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( this ).parents( '.panel-heading' ).siblings( '.listar-video-url-wrapper' ).find( 'a' )[0].click();
		} );

		$( theBody ).on( 'click', '.listar-copy-day-button', function ( e ) {
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

		$( theBody ).on( 'click', '.listar-multiple-hours-plus', function ( e ) {
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
						newStartHourSelect.attr( 'value', newHoursStart ).val( newHoursStart );
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

						newEndHourSelect.attr( 'value', lastestHoursEnd ).val( lastestHoursEnd );
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

			$( this ).find( '.tooltip' ).each( function () {
				$( this ).prop( 'outerHTML', '' );
				setTooltips();
			} );
		} );

		$( theBody ).on( 'click', '.listar-multiple-hours-minus', function ( e ) {
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

			$( this ).find( '.tooltip' ).each( function () {
				$( this ).prop( 'outerHTML', '' );
				setTooltips();
			} );
		} );

		$( theBody ).on( 'click', '.listar-toggle-fixed-quick-menu-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '.single-job_listing .listar-listing-header-topbar-wrapper.listar-show-all-topbar-buttons:not(.listar-listing-header-menu-fixed)' ).each( function () {
				$( this ).find( '.listar-listing-header-plus-button' )[0].click();
			} );

			$( '.listar-listing-header-menu-fixed' ).each( function () {
				if ( $( this ).hasClass( 'listar-hidden-fixed-button' ) ) {
					$( this ).removeClass( 'listar-hidden-fixed-button' );
				} else {
					$( this ).addClass( 'listar-hidden-fixed-button' );
					$( '.listar-listing-header-topbar-wrapper' ).removeClass( 'listar-show-all-topbar-buttons' );
					theBody.removeClass( 'listar-showing-all-topbar-buttons' );

					setTimeout( function () {
						$( '.listar-listing-header-plus-button' ).find( '.icon-minus' ).each( function () {
							$( this ).addClass( 'icon-plus' );
							$( this ).removeClass( 'icon-minus' );
						} );
					}, 800 );
				}
			} );
		} );

		$( theBody ).on( 'click', '.listar-toggle-listing-sidebar-position', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var
				contactDataCol = $( '.listar-listing-description-first-col' ),
				descriptionCol = $( '.listar-listing-description-second-col' );

			if ( contactDataCol.length && descriptionCol.length ) {

				var clone1 = contactDataCol.clone();
				var clone2 = descriptionCol.clone();

				contactDataCol.replaceWith( clone2 );
				descriptionCol.replaceWith( clone1 );

				/* Removes the tooltip */
				$( '.listar-listing-description-first-col' ).find( '.tooltip' ).prop( 'outerHTML', '' );
				setTooltips();

				if ( theBody.hasClass( 'listar-listing-sidebar-on-right' ) ) {
					theBody.removeClass( 'listar-listing-sidebar-on-right' );
				} else {
					theBody.addClass( 'listar-listing-sidebar-on-right' );
				}
			}
		} );

		/* Private message */

		// Get the form.
		var privateMessageForm = $( '.listar-private-message-form' ).eq(0);

		// Set up an event listener for the contact form.
		$( privateMessageForm ).submit( function ( e ) {

			// Stop the browser from submitting the form.
			e.preventDefault();

			// Copy possible 'disabled' sender info to hidden fields
			$( 'input[name=listar_sender_name]' ).attr( 'value', $( 'input[name=listar-private-message-user-name]' ).val() );
			$( 'input[name=listar_sender_email]' ).attr( 'value', $( 'input[name=listar-private-message-user-email]' ).val() );

			// Gets the updated form
			privateMessageForm = $( '.listar-private-message-form' ).eq(0);

			if ( $( '#listar-private-message-captcha' ).val() !== '5' ) {
				privateMessageForm.addClass( 'errorCaptcha' );
				$( '#listar-private-message-captcha' ).val( '' );
				return false;
			} else {
				privateMessageForm.removeClass( 'errorCaptcha' );
			}

			// Serialize the form data.
			var formData = $( privateMessageForm ).serialize();

			// Submit the form using AJAX.
			$.ajax( {
				crossDomain: true,
				type: 'POST',
				url: $( privateMessageForm ).attr( 'action' ),
				data: formData
			} )
				.done( function( response ) {
					// Make sure that the form has the 'sent-success' class.
					privateMessageForm.parent().removeClass( 'sent-error' );
					privateMessageForm.parent().addClass( 'sent-success' );
					// Clear the form.
					$( '#listar_sender_message' ).val( '' );
					privateMessageForm.css( { display : 'none' } );
				} )
				.fail( function( data ) {
					// Make sure that the form has the 'sent-error' class.
					privateMessageForm.parent().removeClass( 'sent-success' );
					privateMessageForm.parent().addClass( 'sent-error' );
			
					$( '#listar-private-message-form button' ).removeAttr( 'disabled' );
					$( '#listar-private-message-form button ~ .spinner' ).removeClass( 'active' );
				} );
		} );

		/* Complaint Report */

		theBody.on( 'click', '.listar-submit-report', function ( e ) {

			var submitFormButton = $( this );

			$( '#listar-report-form input.required, #listar-report-form textarea.required' ).each( function () {
				if ( '' === $( this ).val() || undefined === $( this ).val() ) {
					e.preventDefault();
					e.stopPropagation();

					$( this ).addClass( 'listar-empty-required-field' );
				} else {
					$( this ).removeClass( 'listar-empty-required-field' );
				}
			} );

			if ( 0 === $( '#listar-report-form input.listar-empty-required-field, #listar-report-form textarea.listar-empty-required-field' ).length ) {

				submitFormButton.prop( 'innerHTML', submitFormButton.attr( 'data-loading-text' ) );

				/* Start the conclusive AJAX request to save user geolocated data in PHP session */

			} else {
				e.preventDefault();
				e.stopPropagation();
			}
		} );

		// Get the form.
		var complaintReportForm = $( '#listar-report-form' ).eq(0);

		// Set up an event listener for the contact form.
		$( complaintReportForm ).submit( function ( e ) {

			// Stop the browser from submitting the form.
			e.preventDefault();

			// Copy possible 'disabled' sender info to hidden fields
			$( 'input[name=listar_complaint_sender_name]' ).attr( 'value', $( 'input[name=listar-complaint-report-user-name]' ).attr( 'value' ) );
			$( 'input[name=listar_complaint_sender_email]' ).attr( 'value', $( 'input[name=listar-complaint-report-user-email]' ).attr( 'value' ) );

			// Gets the updated form
			complaintReportForm = $( '#listar-report-form' ).eq(0);

			// Serialize the form data.
			var formData = $( complaintReportForm ).serialize();

			// Submit the form using AJAX.
			$.ajax( {
				crossDomain: true,
				type: 'POST',
				url: $( complaintReportForm ).attr( 'action' ),
				data: formData
			} )
				.done( function( response ) {
					// Make sure that the form has the 'sent-success' class.
					complaintReportForm.parent().removeClass( 'sent-error' );
					complaintReportForm.parent().addClass( 'sent-success' );
					// Clear the form.
					$( '#listar_complaint_sender_message' ).val( '' );
					complaintReportForm.css( { display : 'none' } );
				} )
				.fail( function( data ) {
					// Make sure that the form has the 'sent-error' class.
					complaintReportForm.parent().removeClass( 'sent-success' );
					complaintReportForm.parent().addClass( 'sent-error' );

					$( '.listar-submit-report' ).prop( 'innerHTML', $( '.listar-submit-report' ).attr( 'data-button-text' ) );
				} );
		} );

		/* Open login/register modal */
		$( '[href="#listar-login"], [href="#listar-register"]' ).on( 'click', function ( e ) {
			e.preventDefault();
			listarOpenLoginDialog( $( this ).attr( 'href' ) );
		} );

		/* Login form */
		$( '#listar-login-form' ).on( 'submit', function ( e ) {
			var button = $( this ).find( 'button' );
			var termsCheckbox = $( '#listar_terms_checkbox' );

			if ( termsCheckbox.length ) {
					if ( ! termsCheckbox.is( ':checked' ) ) {
							e.preventDefault();
							e.stopPropagation();
							return false;
					}
			}

			e.preventDefault();
			button.button( 'loading' );

			$.post( listarLocalizeAndAjax.ajaxurl, $( '#listar-login-form' ).serialize(), function ( data ) {
				var obj = $.parseJSON( data );

				/* Reverse HTML entities */
				var message = $( '.listar-login .listar-errors' ).html( obj.message ).text();

				$( '.listar-login .listar-errors' ).html( message ).css( { display : 'block' } );

				if ( false === obj.error ) {
					$( '#listar-user-modal .modal-dialog' ).addClass( 'loading' );

					var href = currentURL.replace( '#do-login', '' );

					if ( theBody.hasClass( 'listar-login-before-review' ) || href.indexOf( '?write#review' ) > 0 ) {
						href = href.substring( 0, href.indexOf( '?write-review' ) ) + '?write-review';
					}

                                        if ( href.indexOf( '#' ) >= 0 ) {
                                                href = href.split( '#' )[0];
                                        }

					theBody.append( '<a id="listar-login-link-1" class="hidden" href="' + href + '"></a>' );
					theBody.append( '<a id="listar-login-link-2" class="hidden" target="_parent" href="' + href + '"></a>' );

                                        $( '#listar-login-link-1' )[0].click();
                                        $( '#listar-login-link-2' )[0].click();

					/* Alternative method, not tested for "mobile" cross browser yet */
                                        // window.location.href = href;

					button.hide();
				}

				button.button( 'reset' );
			} );
		} );




		/* Registration form */
		$( '#listar-registration-form' ).on( 'submit', function ( e ) {
			var button = $( this ).find( 'button' );

			e.preventDefault();
			button.button( 'loading' );

			$.post( listarLocalizeAndAjax.ajaxurl, $( '#listar-registration-form' ).serialize(), function ( data ) {
				var obj = $.parseJSON( data );

				/* Reverse HTML entities */
				var message = $( '.listar-register .listar-errors' ).html( obj.message ).text();

				$( '.listar-register .listar-errors' ).html( message ).css( { display : 'block' } );

				if ( false === obj.error ) {
					$( '#listar-user-modal .modal-dialog' ).addClass( 'listar-registration-complete' );
					button.hide();
				}

				button.button( 'reset' );
			} );
		} );

		/* Reset Password */
		$( '#listar-reset-password-form' ).on( 'submit', function ( e ) {
			var button = $( this ).find( 'button' );

			e.preventDefault();
			button.button( 'loading' );

			$.post( listarLocalizeAndAjax.ajaxurl, $( '#listar-reset-password-form' ).serialize(), function ( data ) {
				var obj = $.parseJSON( data );

				/* Reverse HTML entities */
				var message = $( '.listar-reset-password .listar-errors' ).html( obj.message ).text();

				$( '.listar-reset-password .listar-errors' ).html( message ).css( { display : 'block' } );

				if ( false === obj.error ) {
					/* Nothing to do here currently, success message was already appended */
				}

				button.button( 'reset' );
			} );
		} );

		if ( '#login' === window.location.hash ) {
			listarOpenLoginDialog( '#listar-login' );
		}

		theBody.on( 'click', '.listar-location-show-advanced', function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( '.listar-custom-location-fields' ).removeClass( 'hidden' );
			$( this ).prop( 'outerHTML', '' );
		} );

		/* Ajax Load More */

		theBody.on( 'click', '.listar-more-results', function ( e ) {
			var
				button,
				parent;

			if ( ! $( this ).hasClass( 'listar-go-to-listing-page' ) ) {

				if ( $( this ).hasClass( 'listar-disable-click' ) ) {
					e.preventDefault();
					e.stopPropagation();
					return false;
				}

				$( this ).addClass( 'listar-loading-results' ).addClass( 'listar-disable-click' );
				theBody.addClass( 'listar-loading-posts' );

				button = $( this );
				data = {
					'action' : 'loadmore',
					'query' : listarAjaxPostsParams.posts,
					'page' : listarAjaxPostsParams.current_page
				};
				parent = button.parent().parent();

				$.ajax( {
					/* Ajax handler */
					crossDomain: true,
					url: listarAjaxPostsParams.ajaxurl,
					data: data,
					type: 'POST',
					success: function ( data ) {
						if ( data ) {

							isLoadMoreEqualizer = true;

							/* Insert new posts/listings */
							$( '.listar-results-container' ).append( data );
							theBody.removeClass( 'listar-loading-posts' );

							listarAjaxPostsParams.current_page++;

							if ( parseInt( listarAjaxPostsParams.current_page, 10 ) === parseInt( listarAjaxPostsParams.max_page, 10 ) ) {

								/* If last page, remove the button */
								if ( $( '.listar-more-results' ).not( '.listar-go-to-listing-page' ).parents( '.listar-load-more-section' ).length ) {
									$( '.listar-more-results' ).not( '.listar-go-to-listing-page' ).parents( '.listar-load-more-section' ).prop( 'outerHTML', '' );
									isLastBlogPage = true;
								}

								if ( $( '.listar-more-results' ).not( '.listar-go-to-listing-page' ).parent().length ) {
									$( '.listar-more-results' ).not( '.listar-go-to-listing-page' ).parent().prop( 'outerHTML', '' );
								}

							} else {
								var moreListingMapButton = $( '.listar-map ~ .listar-aside-list .listar-posts-column-list .listar-more-results-map' );

								if ( moreListingMapButton.length ) {
									var outer = moreListingMapButton.parent().prop( 'outerHTML' );

									moreListingMapButton.parent().prop( 'outerHTML', '' );

									setTimeout( function () {
										$( '.listar-map ~ .listar-aside-list .listar-posts-column-list' ).append( outer );
										$( '.listar-map ~ .listar-aside-list .listar-more-results' ).removeClass( 'hidden' );
									}, 400 );
								}
							}

							setTimeout( function () {

								convertDataBackgroundImage();
								checkGridFillerCard();

								button = parent.find( '.listar-more-results' );
								button.removeClass( 'listar-loading-results' ).removeClass( 'listar-disable-click' );

								/* Removes the tooltip */
								parent.find( '.tooltip' ).prop( 'outerHTML', '' );
								setTooltips();

								/* Equalize the height of elements, except if clicked on 'load more' button on map sidebar */

								if ( ! parent.hasClass( 'listar-posts-column-list' ) ) {
									heightEqualizer( '.listar-listing-card' );
								}

								isLoadMoreEqualizer = true;

								heightEqualizer( '.listar-blog-card' );

								checkFillerButtonBlog();

								/* Init AOS for new elements */
								ajaxAOS();
							}, 500 );

						} else {
							/* Removes the tooltip */
							parent.find( '.tooltip' ).prop( 'outerHTML', '' );
							setTimeout( function () {

								/* If no data, remove the button as well */
								button.parent().remove();

								/* If last page, remove the button */
								if ( button.parents( '.listar-load-more-section' ).length ) {
									button.parents( '.listar-load-more-section' ).prop( 'outerHTML', '' );
								}

								if ( button.parent().length ) {
									button.parent().prop( 'outerHTML', '' );
								}

								checkFillerButtonBlog();

								theBody.removeClass( 'listar-loading-posts' );
							}, 500 );
						}// End if().
					}
				} );
			}// End if().
		} );

		/********** ALL JAVASCRIPT BELOW IS EXCLUSIVE TO MAPS *********/

		startMapLeaflet();
	}
		
	// The only JavaScript that must execute on Dom Ready, with Listar Pagespeed active or not.
	$( function () {

		$( 'input[type="checkbox"]' ).each( function () {
			$( this ).parent().addClass( 'listar-custom-checkbox' );

			if( $( this ).is( ':checked' ) ) {
				$( this ).parent().addClass( 'listar-custom-checkbox-checked' );
			}
		} );
		
		if ( listingGallery.length ) {
			listingGalleryItems = listingGallery.find( '.gallery-item' );
			listingGalleryLinks = listingGallery.find( 'a' );
			maxListingGallerySlides = listingGalleryItems.length;
		} else {
			listingGalleryLinks = $();
		}
			
		$.fancybox.defaults.loop = true;

		if ( listingGalleryLinks.length ) {
			
			/* Append listing gallery after rich media? */
			$( '.listar-business-video-accordion.listar-append-listing-gallery-end .listar-video-url-wrapper .listar-accordion-wrapper-paragraph' ).each( function () {
				var innerRichMedia = $( this );
				
				listingGalleryLinks.each( function () {
					var itemHref = $( this ).attr( 'href' );
					innerRichMedia.append( '<a data-fancybox="mixed" href="' + itemHref + '"></a>' );
				} );
			} );
			
			
			var galleryReadyInterval = setInterval( function () {
				var galleryLoading = false;

				listingGalleryLinks.each( function () {
					if ( $( this ).width() < 50 ) {
						galleryLoading = true;
					}
				} );

				if ( ! galleryLoading ) {
					clearInterval( galleryReadyInterval );
					initListingGalleryScroll();
				}
			}, 500 );
		}
		
		createListingGallery();		
		
		if ( listingGallery.length || $( 'a[data-lightbox="gallery"]' ).length || $( 'a[rel="lightbox"]' ).length || $( 'a[data-rel="lightbox-gallery-1"]' ).length ) {
			$( '.lightbox' ).css( { marginLeft : 0 } );
		}

		/* Automatic Lightbox for WordPress gallery */
		if ( $( '.gallery, .wp-block-gallery' ).length ) {
			var i = 1;

			$( '.gallery, .wp-block-gallery' ).each( function () {
				$( this ).find( 'a' ).each( function () {
					if (
						$( this ).attr( 'href' ).indexOf( 'jpg' ) >= 0 ||
						$( this ).attr( 'href' ).indexOf( 'jpeg' ) >= 0 ||
						$( this ).attr( 'href' ).indexOf( 'gif' ) >= 0 ||
						$( this ).attr( 'href' ).indexOf( 'png' ) >= 0 ||
						$( this ).attr( 'href' ).indexOf( 'bmp' ) >= 0 ||
						$( this ).attr( 'href' ).indexOf( 'jpg' ) >= 0
					) {
						$( this ).attr( 'data-lightbox', 'gallery-' + i );
						$( '.lightbox' ).css( { marginLeft : 0 } );
					}
				} );

				i++;
			} );
		}
		
		// Handle purchased packages VS purchasable packages, avoiding duplication.
		$( '.listar-user-packages .listar-listing-package' ).each( function () {
			var userPackage = $( this );
			var packageID = userPackage.find( 'a[data-user-package]' ).attr( 'data-user-package' );
			var userPackageOuter = userPackage.prop( 'outerHTML' );

			$( '.listar-available-packages .listar-listing-package' ).each( function () {
				var availablePackageID = $( this ).find( 'a[data-package]' ).attr( 'data-package' );

				if ( packageID === availablePackageID ) {
					$( this ).prop( 'outerHTML', userPackageOuter );
					userPackage.prop( 'outerHTML', '' );
				}
			} );
		} );

		// Handles the fixed Reservation button visibility.
		$( '.listar-business-booking-accordion' ).each( function () {
			$( '.listar-booking-quick-button-wrapper' ).removeClass( 'hidden' );
		} );

		/* Handle DT tags linking to external domains - Iframes VS Listar Pagespeed */
		$( 'dl[data-temp-data-script-form-field]' ).each( function () {
			var iframeSRC = $( this ).attr( 'data-temp-src' );
			var iframeID  = $( this ).attr( 'data-temp-id' );

			if ( undefined !== iframeID && 'undefined' !== iframeID ) {
				iframeID = ' id="' + iframeID + '"';
			} else {
				iframeID = '';
			}

			$( this ).prop( 'outerHTML', '<iframe src="' + iframeSRC + '"' + iframeID + '></iframe>' );
		} );

		/* Recognizes Timekit API Widget */

		$( '.panel-body #bookingjs' ).each( function () {
			var timekitJqueryScript = '';
			var timekitBookingScript = '';
			var timekitBookingConf = '';

			$( 'iframe[src*="libs/jquery/"]' ).each( function () {
				timekitJqueryScript = $( this ).attr( 'src' );
			} );

			$( 'iframe[src*="timekit.io"]' ).each( function () {
				timekitBookingScript = $( this ).attr( 'src' );
			} );

			$( 'iframe' ).each( function () {
				var iframeInner = $( this ).prop( 'innerHTML' );

				if ( iframeInner.indexOf( 'app_key' ) >= 0 && iframeInner.indexOf( 'project_id' ) >= 0 ) {
					timekitBookingConf = iframeInner;
				}
			} );

			if ( '' !== timekitJqueryScript && '' !== timekitBookingScript && '' !== timekitBookingConf ) {
				var requiredJquery = document.createElement( 'script' );
				var timekitScript = document.createElement( 'script' );

				timekitBookingConf = timekitBookingConf.replace( 'window.timekitBookingConfig', '' ).replace( '=', '' ).replace( 'app_key', "'app_key'" ).replace( 'project_id', "'project_id'" ).replace( /\s+/g, '' );
				timekitBookingConf = timekitBookingConf.replace( /'/g, '"' );

				$( this ).parents( '.panel-body' ).prop( 'innerHTML', '' );

				$( '.listar-business-booking-accordion' ).find( '.panel-body' ).append( '<div id="bookingjs"></div>' );

				window.timekitBookingConfig = $.parseJSON( timekitBookingConf );

				requiredJquery.setAttribute( 'src', timekitJqueryScript );
				requiredJquery.setAttribute( 'defer', 'defer' );
				requiredJquery.setAttribute( 'type', 'text/javascript' );

				timekitScript.setAttribute( 'src', timekitBookingScript );
				timekitScript.setAttribute( 'type', 'text/javascript' );
				timekitScript.setAttribute( 'defer', 'defer' );

				$( '.listar-business-booking-accordion' ).find( '.panel-body' )[0].appendChild( requiredJquery );
				$( '.listar-business-booking-accordion' ).find( '.panel-body' )[0].appendChild( timekitScript );
			}
		} );

		/* Recognizes Booksy API Widget */

		$( 'iframe[src*="booksy.com/widget/code.js"]' ).each( function () {
			var booksyBookingScript = $( this ).attr( 'src' );

			if ( '' !== booksyBookingScript ) {
				var booksyScript = document.createElement( 'script' );

				$( this ).prop( 'outerHTML', '' );

				booksyScript.setAttribute( 'src', booksyBookingScript );
				booksyScript.setAttribute( 'defer', 'defer' );
				booksyScript.setAttribute( 'type', 'text/javascript' );

				$( '.listar-business-booking-accordion' ).find( '.panel-body' )[0].appendChild( booksyScript );
			}
		} );

		/* Recognizes Resy API Widget */

		$( '.panel-body iframe[src*="widgets.resy.com"]' ).each( function () {
			var resyButton = '';
			var resyBookingScript = '';
			var resyBookingConf = '';

			resyBookingScript = $( this ).attr( 'src' );

			$( 'iframe' ).each( function () {
				var iframeInner = $( this ).prop( 'innerHTML' );

				if ( iframeInner.indexOf( 'resyWidget.addButton' ) >= 0 ) {
					resyBookingConf = iframeInner;
				}
			} );

			$( 'a[id*="resyButton"]' ).each( function () {
				resyButton = $( this ).prop( 'outerHTML' );
			} );

			if ( '' !== resyButton && '' !== resyBookingScript && '' !== resyBookingConf ) {
				var resyScript = document.createElement( 'script' );
				var resyConfScript = window.document.createElement( 'script' );

				$( '.listar-business-booking-accordion' ).find( '.panel-body' ).prop( 'innerHTML', '' );
				$( '.listar-business-booking-accordion' ).find( '.panel-body' ).append( resyButton );

				resyScript.setAttribute( 'src', resyBookingScript );
				resyScript.setAttribute( 'defer', 'defer' );
				resyScript.setAttribute( 'type', 'text/javascript' );

				resyConfScript.setAttribute( 'type', 'text/javascript' );

				$( '.listar-business-booking-accordion' ).find( '.panel-body' )[0].appendChild( resyScript );

				resyBookingConf = "var resyStart = setInterval( function () {if ( 'undefined' !== typeof resyWidget ) { clearInterval( resyStart ); " + resyBookingConf + " setTimeout( function () { document.querySelector( 'iframe[src*=" + '"widgets.resy.com/images"' + "]' ).parentElement.setAttribute( 'data-resy-buttom', 'resy' ); }, 1000 );} }, 2000);";

				resyConfScript.innerHTML = resyBookingConf;
				$( '.listar-business-booking-accordion' ).find( '.panel-body' )[0].appendChild( resyConfScript );
			}
		} );

		/* Recognizes ZOMATO API Calendar Button */

		$( 'iframe[src*="zomatobook.com/scripts"][src*="reswidget.min.js"]' ).each( function () {
			var zomatoButton = '';
			var zomatoBookingScript = '';

			zomatoBookingScript = $( this ).attr( 'src' );

			$( this ).siblings( 'img' ).prop( 'outerHTML' );

			$( this ).siblings( 'img[data-onclick*=".widget."]' ).each( function () {
				$( this ).attr( 'onclick', $( this ).attr( 'data-onclick' ) );
				zomatoButton = $( this );
			} );

			if ( '' !== zomatoButton && '' !== zomatoBookingScript ) {
				var zomatoScript = document.createElement( 'script' );
				var zomatoButtonHTML = '';

				zomatoButton.addClass( 'listar-zomato-button' );
				zomatoButtonHTML = zomatoButton.prop( 'outerHTML' );

				$( '.listar-business-booking-accordion' ).find( '.panel-body' ).prop( 'innerHTML', '' );
				$( '.listar-business-booking-accordion' ).find( '.panel-body' ).append( zomatoButtonHTML );

				zomatoScript.setAttribute( 'src', zomatoBookingScript );
				zomatoScript.setAttribute( 'defer', 'defer' );
				zomatoScript.setAttribute( 'type', 'text/javascript' );

				$( '.listar-business-booking-accordion' ).find( '.panel-body' )[0].appendChild( zomatoScript );
			}
		} );

		/* Recognizes Agoda API Widget */

		$( '.panel-body iframe[src*="agoda.net/"][src*=".min.js"]' ).each( function () {
			var agodaButton = '';
			var agodaBookingScript = '';
			var agodaBookingConf = '';

			agodaBookingScript = $( this ).attr( 'src' );

			$( 'iframe' ).each( function () {
				var iframeInner = $( this ).prop( 'innerHTML' );

				if ( iframeInner.indexOf( 'AgdSherpa' ) >= 0 ) {
					agodaBookingConf = iframeInner;
				}
			} );

			$( 'div[id*="adgshp"]' ).each( function () {
				agodaButton = $( this ).prop( 'outerHTML' );
			} );

			if ( '' !== agodaButton && '' !== agodaBookingScript && '' !== agodaBookingConf ) {
				var agodaScript = document.createElement( 'script' );
				var agodaConfScript = window.document.createElement( 'script' );

				$( '.listar-business-booking-accordion' ).find( '.panel-body' ).prop( 'innerHTML', '' );
				$( '.listar-business-booking-accordion' ).find( '.panel-body' ).append( agodaButton );

				agodaScript.setAttribute( 'src', agodaBookingScript );
				agodaScript.setAttribute( 'defer', 'defer' );
				agodaScript.setAttribute( 'type', 'text/javascript' );

				agodaConfScript.setAttribute( 'type', 'text/javascript' );

				$( '.listar-business-booking-accordion' ).find( '.panel-body' )[0].appendChild( agodaScript );

				agodaBookingConf = "var agodaStart = setInterval( function () {if ( 'undefined' !== typeof AgdSherpa ) { clearInterval( agodaStart ); " + agodaBookingConf + " } }, 2000);";

				agodaConfScript.innerHTML = agodaBookingConf;

				setInterval( function () {
					$( 'div[id*="adgshp"]' ).each( function () {
						$( this ).css( { height : '' } );
						$( this ).css( { height : $( this ).height() + 15 } );
					} );
				}, 1000 );

				setTimeout( function () {
					$( '.listar-business-booking-accordion' ).find( '.panel-body' )[0].appendChild( agodaConfScript );
				}, 200 );

			}
		} );

		/* Recognizes Bookafy API Calendar Button */

		$( 'iframe[id*="bookafy_script"]' ).each( function () {
			var bookafyButton = '';
			var bookafyBookingScript = '';

			bookafyBookingScript = $( this ).attr( 'src' );

			$( this ).parent().parent().find( '#bookafy-scheduling,#app-scheduling' ).each( function () {
				$( this ).attr( 'id', 'app-scheduling' );
				bookafyButton = $( this );
			} );

			if ( '' !== bookafyButton && '' !== bookafyBookingScript ) {
				var bookafyScript = document.createElement( 'script' );
				var bookafyButtonHTML = '';

				bookafyButton.addClass( 'listar-bookafy-button hidden' );
				bookafyButtonHTML = bookafyButton.prop( 'outerHTML' );

				$( '.listar-business-booking-accordion' ).find( '.panel-body' ).prop( 'innerHTML', '' );
				theBody.append( bookafyButtonHTML );

				bookafyScript.setAttribute( 'src', bookafyBookingScript );
				bookafyScript.setAttribute( 'defer', 'defer' );
				bookafyScript.setAttribute( 'type', 'text/javascript' );

				$( '.listar-business-booking-accordion' ).find( '.panel-body' )[0].appendChild( bookafyScript );
			}
		} );

		/* Recognizes SimplyBook.ME Widget */

		$( 'iframe[src*="widget.simplybook"][src*="widget.js"]' ).each( function () {
			var simplyIframeURL = '';
			var simplyBookingScript = '';
			var simplyBookingConf = '';
			var simplyBookingConfBK = '';

			simplyBookingScript = $( this ).attr( 'src' );

			$( 'iframe' ).each( function () {
				simplyBookingConf = $( this ).prop( 'innerHTML' );

				if ( simplyBookingConf.indexOf( 'SimplybookWidget' ) >= 0 && simplyBookingConf.indexOf( '"url":"https:\/\/' ) >= 0 ) {

					simplyBookingConfBK = simplyBookingConf;

					simplyBookingConf = simplyBookingConf.replace( 'SimplybookWidget(', '' ).replace( '= new', '' ).replace( '=new', "'app_key'" ).replace( 'var widget ', '' ).replace( ');', '' ).replace( /\s+/g, '' );

					$( this ).parents( '.panel-body' ).prop( 'innerHTML', '' );

					window.simplyBookingConfig = $.parseJSON( simplyBookingConf );

					var
					js_widget_type = window.simplyBookingConfig.widget_type,
					js_url = window.simplyBookingConfig.url,
					js_theme = window.simplyBookingConfig.theme,
					js_timeline = window.simplyBookingConfig.timeline,
					js_datepicker = window.simplyBookingConfig.datepicker,
					js_is_rtl = window.simplyBookingConfig.is_rtl;

					js_widget_type = undefined === js_widget_type ? '' : js_widget_type;
					js_url = undefined === js_url ? '' : js_url;
					js_theme = undefined === js_theme ? '' : js_theme;
					js_timeline = undefined === js_timeline ? '' : js_timeline;
					js_datepicker = undefined === js_datepicker ? '' : js_datepicker;
					js_is_rtl = undefined === js_is_rtl ? '' : js_is_rtl;

					js_is_rtl = false === js_is_rtl || '' === js_is_rtl ? 'false' : js_is_rtl;
					js_is_rtl = 'false' !== js_is_rtl ? '&is_rtl=' + js_is_rtl : '';

					if ( 'iframe' === js_widget_type ) {
						if ( js_url.indexOf( '.simplybook.me' ) >= 0 ) {
							js_url = js_url
								.replace( 'https:\/\/', 'https://' )
								.replace( '\/', '/' )
								.replace( '\/', '/' )
								.replace( '\/', '/' );

							simplyIframeURL = js_url + '/v2/?widget-type=' + js_widget_type + '&theme=' + js_theme + '&timeline=' + js_timeline + '&datepicker=' + js_datepicker + js_is_rtl;

							/* Force button + popup outupt */

							simplyIframeURL = '';

							simplyBookingConfBK = simplyBookingConfBK.replace( 'widget_type":"iframe"', 'widget_type":"button"' );

							$( theBody ).addClass( 'listar-hide-simply-button' );
						}
					}
				}
			} );

			if ( '' !== simplyIframeURL ) {

				var simplyIframe = '<iframe src="' + simplyIframeURL + '"></iframe>';

				$( this ).parents( '.panel-body' ).prop( 'innerHTML', '' );

				$( '.listar-business-booking-accordion' ).find( '.panel-body' ).append( simplyIframe );
			} else {

				if ( '' !== simplyBookingScript && '' !== simplyBookingConfBK ) {
					var simplyScript = document.createElement( 'script' );
					var simplyConfScript = window.document.createElement( 'script' );

					$( '.listar-business-booking-accordion' ).find( '.panel-body' ).prop( 'innerHTML', '' );

					simplyScript.setAttribute( 'src', simplyBookingScript );
					simplyScript.setAttribute( 'defer', 'defer' );
					simplyScript.setAttribute( 'type', 'text/javascript' );

					simplyConfScript.setAttribute( 'type', 'text/javascript' );

					$( '.listar-business-booking-accordion' ).find( '.panel-body' )[0].appendChild( simplyScript );

					simplyBookingConfBK = "var simplyStart = setInterval( function () {if ( 'undefined' !== typeof SimplybookWidget ) { clearInterval( simplyStart ); " + simplyBookingConfBK + "} }, 2000);";

					simplyConfScript.innerHTML = simplyBookingConfBK;
					$( '.listar-business-booking-accordion' ).find( '.panel-body' )[0].appendChild( simplyConfScript );
				}
			}
		} );

		/* Recognizes TheFork API Calendar Button */

		$( 'iframe[src*="module.lafourchette.com"]' ).each( function () {
			var theForkBookingScript = '';

			theForkBookingScript = $( this ).attr( 'src' );

			if ( '' !== theForkBookingScript ) {
				if ( -1 === theForkBookingScript.indexOf( '/module/' ) ) {

					var forkMarkupt = '';

					theForkBookingScript = theForkBookingScript.replace( '/js/', '/cta/' );

					if ( theForkBookingScript.indexOf( '/button/' ) >= 0 ) {
						theForkBookingScript = theForkBookingScript.replace( '/button/', '/iframe/' );
						forkMarkupt = '<a href="' + theForkBookingScript + '" target="_blank"></a>';
					} else {
						forkMarkupt = '<iframe src="' + theForkBookingScript + '"></iframe>';
					}

					$( '.listar-business-booking-accordion' ).find( '.panel-body' ).prop( 'innerHTML', forkMarkupt );
				}
			}
		} );

		convertDataBackgroundImage( $( 'header.listar-front-header .listar-hero-image[data-background-image]' ) );
		
		$( '[data-background-image]' ).each( function () {
			if ( isInViewport( $( this ) ) ) {
				convertDataBackgroundImage( $( this ) );
			}
		} );

		/*xxx 10002*/
		/* Remove empty paragraphs and fix for bad WordPress paragraph output (wp:paragraph) comming from Gutenberg */
		setTimeout( function () {
			$( 'table.has-fixed-layout tr, table.has-fixed-layout td, table.has-fixed-layout th, table.has-fixed-layout thead, table.has-fixed-layout tbody' ).each( function () {
				if ( $( this ).parents( '.col-md-8,.col-md-9,.col-lg-9' ).length >= 1 ) {
					$( this ).css( { width : '' } );
				}
			} );
		}, 40 );
		
		/*xxx 9262 */
		setTimeout( function () {
			$( 'ul, ol' ).each( function () {
				var styleType = $( this ).css( 'list-style-type' );
				var listItems = $( this ).find( 'li' );

				if ( listItems.length ) {
					var firstItemDisplay = listItems.eq( 0 ).css( 'display' );

					if ( ( 'disc' === styleType || 'decimal' === styleType ) && 'list-item' === firstItemDisplay ) {
						$( this ).addClass( 'listar-displace-list-left' );
					}
				}
			} );
		}, 250 );
		
		
		/* 6872 */

		// Force placeholders for all Select2 objects.
		setInterval( function () {
			$( '.select2-search__field' ).each( function () {
				var select2ElemSearch = $( this );

				$( this ).parents( '.select2' ).each( function () {
					if ( $( this ).prev()[0].hasAttribute( 'data-placeholder' ) ) {
						select2ElemSearch.attr( 'placeholder', $( this ).prev().attr( 'data-placeholder' ) );
					}
				} );
			} );
		}, 2000 );
		
		
		/*xxx 7651 e 7722*/
		/* Prepare wrapper for menu/catalog files */
		setTimeout( function () {
			$( '.fieldset-job_business_document_1_title' ).each( function () {
				var
					docsSection1 = $( this ),
					checkboxDoc = $( '.fieldset-job_business_use_catalog_documents' ).prop( 'outerHTML' ),
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
				$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-catalog-files-header' ).append( $( '.fieldset-job_business_document_1_file .description' ).prop( 'outerHTML' ) + '<br>' );
				$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-catalog-files-header' ).append( $( '.fieldset-job_business_document_2_file .description' ).prop( 'outerHTML' ) );

				$( '.fieldset-job_business_use_catalog_documents' ).prop( 'outerHTML', '' );
				$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-catalog-files-header' ).before( checkboxDoc );

				setTimeout( function () {
					if ( $( '#job_business_use_catalog' ).is( ':checked' ) ) {
						$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload' ).removeClass( 'hidden' );
					}

					if ( $( '#job_business_use_catalog_documents' ).is( ':checked' ) ) {
						$( '.listar-business-catalog-fields.listar-boxed-fields-docs-upload .listar-boxed-fields-inner' ).removeClass( 'hidden' );
					}
				}, 100 );
			} );

		}, 10 );
		
		/*xxx 8428 a 8489 */

		/*
		 * Init Select2
		 */
	       
	       function startLimitedTermsSelect2( elem, tax ) {
			forceSelectSelected( elem );
			
			//alert( tax );

			if ( $.isFunction( $.fn.select2 ) ) {
				elem.select2( {
					minimumResultsForSearch: 3,
					ajax: {
						url: listarSiteURL + '/wp-content/plugins/listar-addons/inc/ajax-search/listar-select2-terms-search.php',
						dataType: 'json',
						delay: 250,
						data: function ( data ) {
							return {
								searchTerm: data.term, // search term
								taxonomy: tax // search term
							};
						},
						processResults: function ( response ) {
							//alert( response );
							return {
								results: response
							};
						},
						cache: true
					}
				} );
			}
	       }

		var select2SelectorsTaxonomies = $( '.listar-custom-select[data-tax]' );

		select2SelectorsTaxonomies.each( function () {
			var tax = $( this ).attr( 'data-tax' );
			startLimitedTermsSelect2( $( this ), tax );			
		} );

		setTimeout( function () {
			$( 'select[id="job_region"]' ).each( function () {
				if ( $( this ).siblings( '.select2' ).length ) {
					$( this ).siblings( '.select2' ).prop( 'outerHTML', '' );
					$( this ).select2( 'destroy' );
					startLimitedTermsSelect2( $( this ), 'job_listing_region' );
				}
			} );
		}, 1000 );

		setTimeout( function () {
			$( 'select[id="job_category"]' ).each( function () {
				if ( $( this ).siblings( '.select2' ).length ) {
					$( this ).siblings( '.select2' ).prop( 'outerHTML', '' );
					$( this ).select2( 'destroy' );
					startLimitedTermsSelect2( $( this ), 'job_listing_category' );
				}
			} );
		}, 1000 );


		if ( $( '#submit-job-form' ).length && $( '#job_region' ).length ) {
			if ( '' !== $( '#job_region' ).val() ) {
				$( '#job_region' ).parent().removeClass( 'listar-showing-placeholder' ).addClass( 'listar-hidding-placeholder' );
			} else {
				$( '#job_region' ).parent().addClass( 'listar-showing-placeholder' ).removeClass( 'listar-hidding-placeholder' );
			}
		}

		if ( $( '#submit-job-form .account-sign-in a' ).length ) {
			$( '#submit-job-form .account-sign-in a' ).wrap( '<div class="listar-elem-wrapper"></div>' );
		}

		/*xxx 9585 */
		setTimeout( function () {
			var theButton = $( '.listar-listing-rating-anchor' );
			var elementsCount = $( '.listar-listing-review-wrapper' ).length;

			if ( elementsCount < 1 ) {
				theButton.parents( '.listar-listing-header-topbar-item' ).prop( 'outerHTML', '' );
			}
		}, 1000 );

		/*xxx 9805 */
		setInterval( function () {
			$( '#submit-job-form fieldset' ).not( '.listar-required-listing-field' ).each( function () {
				$( this ).find( '.required-field' ).each( function () {
					var requiredFieldLabel = $( this ).parents( 'fieldset' ).find( 'label' );
					var asteriskTooltip = '<span class="listar-required-listing-field-asterisk fa fa-asterisk" data-toggle="tooltip" data-placement="top" title="' + listarLocalizeAndAjax.requiredField + '"></span>';
					var innerFieldHTML = requiredFieldLabel.prop( 'innerHTML' );

					if ( innerFieldHTML.indexOf( '<br>' ) >= 0 ) {
						innerFieldHTML = innerFieldHTML.replace( '<br>', asteriskTooltip + '<br>' );
					} else {
						innerFieldHTML += asteriskTooltip;
					}

					$( this ).parents( 'fieldset' ).addClass( 'listar-required-listing-field' );
					requiredFieldLabel.prop( 'innerHTML', innerFieldHTML );
				} );
			} );
		}, 40 );
		
		executeCurrentHash();

		/*xxx 12954*/
		setTimeout( function () {

			// And do it again, because of elements that can populate the page dinamically, like lasy loaded images */
			executeCurrentHash();
		}, 1000 );

		/*xxx 13206*/
		setTimeout( function () {
			$( theBody ).on( 'change DOMSubtreeModified DOMNodeInserted DOMNodeRemoved', '#job_category, #job_category ~ .select2-selection__rendered', function() {

				if ( ! tempModify ) {
					tempModify = true;

					setTimeout( function () {
						featuredListingCategorySelect();
					}, 20 );

					setTimeout( function () {
						tempModify = false;
					}, 150 );
				}
			} );

			$( theBody ).on( 'change DOMSubtreeModified DOMNodeInserted DOMNodeRemoved', '#job_region, #job_region ~ .select2-selection__rendered', function() {
				if ( ! tempModify2 ) {
					tempModify2 = true;

					setTimeout( function () {
						featuredListingRegionSelect();
					}, 20 );

					setTimeout( function () {
						tempModify2 = false;
					}, 150 );
				}
			} );
		}, 3000 );

		/* Adds a "plus" button do drop down main menus in case of high amount of itens on the list */

		setTimeout( function () {
			if ( viewport().width > 767 ) {

				$( '#listar-primary-menu .dropdown-menu' ).each( function () {
					if ( $( this ).find( '>li' ).length > 13 ) {
						$( this ).append( '<li class="listar-plus-drop-down-menu fa fa-plus"></li>' );
						$( this ).addClass( 'listar-menu-has-invisible-items' );
					}
				} );
			}
		}, 3000 );

		/*xxx 8542 */
		setTimeout( function () {
			$( '.listar-search-regions .listar-regions-list a.current' ).stop().animate( { opacity : 1 }, { duration : 250, complete : function () {
				$( '.listar-search-regions .listar-regions-list a.current' ).css( { opacity : '' } );
			} } );
		}, 250 );
	} );
	
	if ( usingPagespeed && 'no' === listarLocalizeAndAjax.listarUserLogged ) {

		// All thing is optimized, so preferably run JavaScript when all assets are completelly (and instantaneously) loaded */
		window.addEventListener( 'load', function () {

			/* 1.5 Seconds after all content painted - Pagespeed */
			setTimeout( function () {
				listarExecute();
			}, 1500 );
		} );
	} else {
		
		// Use jQuery "Ready" if Listar Pagespeed is disabled.
		$( function () {
			listarExecute();
		} );
	}
	
	//setTimeout( function () {
		//alert(99);
		//$( 'body' ).append( '<div>' + linereport + '</div>' );
	//}, 30000 );

} )( jQuery );

