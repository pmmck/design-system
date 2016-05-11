/**
 * Global `fabricator` object
 * @namespace
 */
var Fabricator = window.Fabricator = {};

/**
 * Default options
 * @type {Object}
 */
Fabricator.options = {
	toggles: {
		labels: true,
		notes: true,
		code: false
	},
	menu: false,
	mq: '(min-width: 60em)'
};

// open menu by default if large screen
Fabricator.options.menu = window.matchMedia(Fabricator.options.mq).matches;

/**
 * Feature detection
 * @type {Object}
 */
Fabricator.test = {};

// test for sessionStorage
Fabricator.test.sessionStorage = (function () {
	var test = '_f';
	try {
		sessionStorage.setItem(test, test);
		sessionStorage.removeItem(test);
		return true;
	} catch(e) {
		return false;
	}
}());

// create storage object if it doesn't exist; store options
if (Fabricator.test.sessionStorage) {
	sessionStorage.Fabricator = sessionStorage.Fabricator || JSON.stringify(Fabricator.options);
}


/**
 * Cache DOM
 * @type {Object}
 */
Fabricator.dom = {
	root: document.querySelector('html'),
	primaryMenu: document.querySelector('.f-menu'),
	menuItems: document.querySelectorAll('.f-menu li a'),
	menuToggle: document.querySelector('.f-menu-toggle')
};


/**
 * Get current option values from session storage
 * @return {Object}
 */
Fabricator.getOptions = function () {
	return (Fabricator.test.sessionStorage) ? JSON.parse(sessionStorage.Fabricator) : Fabricator.options;
};

(function( window, document ) {
	'use strict';

	require('./prism');


	( function( Fabricator ) {

		var designsystem = function() {

			function initialize() {
				var self = this;

				console.log('initialize');

			}

			/**
			 * Build color chips
			 */
			function buildColorChips() {
				console.log('buildColorChips');

				var chips = document.querySelectorAll('.f-color-chip'),
					color;

				for (var i = chips.length - 1; i >= 0; i--) {
					color = chips[i].querySelector('.f-color-chip__color').innerHTML;
					chips[i].style.borderTopColor = color;
					chips[i].style.borderBottomColor = color;
				}
			}


			/**
			 * Add `f-active` class to active menu item
			 */
			function setActiveItem() {
				console.log('setActiveItem');

				/**
				 * Match the window location with the menu item, set menu item as active
				 */
				var setActive = function () {

					// get current file and hash without first slash
					var current = (window.location.pathname + window.location.hash).replace(/(^\/)([^#]+)?(#[\w\-\.]+)?$/ig, function (match, slash, file, hash) {
							hash = hash || '';
							file = file.replace( 'dist/', '' ).replace( 'design-system/', '' ) || '';
							// Currently, without a scrolling listener, there's no way to
							// change as we visit new 'hashes'. Better to leave at top
							// level link
							return './' + file; // + hash.split('.')[0];
						}) || 'index.html',
						href;

					// find the current section in the items array
					for (var i = Fabricator.dom.menuItems.length - 1; i >= 0; i--) {

						var item = Fabricator.dom.menuItems[i];
						// get item href without first slash
						href = item.getAttribute('href').replace(/^\//g, '');

						if ( href === current ) {
							Fabricator.helpers.addClass( item, 'current');
						} else {
							Fabricator.helpers.removeClass( item, 'current');
						}
					}
				};

				window.addEventListener('hashchange', setActive);

				setActive();
			}


			/**
			 * Click handler to primary menu toggle
			 * @return {Object} fabricator
			 */
			function menuToggle() {
				console.log('menuToggle');

				// shortcut menu DOM
				var toggle = Fabricator.dom.menuToggle;

				var options = Fabricator.getOptions();

				// toggle classes on certain elements
				var toggleClasses = function () {
					//TODO: Replace ClassList!
					var menuClassList = Fabricator.dom.root.className.split(' ');
					options.menu = !Fabricator.dom.root.classList.contains('f-menu-active');
					Fabricator.dom.root.classList.toggle('f-menu-active');

					if (self.test.sessionStorage) {
						sessionStorage.setItem('fabricator', JSON.stringify(options));
					}
				};

				// toggle classes on ctrl + m press
				document.onkeydown = function (e) {
					e = e || event
					if (e.ctrlKey && e.keyCode == 'M'.charCodeAt(0)) {
						toggleClasses();
					}
				}

				// toggle classes on click
				toggle.addEventListener('click', function () {
					toggleClasses();
				});

				// close menu when clicking on item (for collapsed menu view)
				var closeMenu = function () {
					if (!window.matchMedia(Fabricator.options.mq).matches) {
						toggleClasses();
					}
				};

				for (var i = 0; i < Fabricator.dom.menuItems.length; i++) {
					Fabricator.dom.menuItems[i].addEventListener('click', closeMenu);
				}
			}

			/**
			 * Automatically select code when code block is clicked
			 */
			function bindCodeAutoSelect() {
				console.log('bindCodeAutoSelect');

				var codeBlocks = document.querySelectorAll('.f-item-code');

				var select = function (block) {
					var selection = window.getSelection();
					var range = document.createRange();
					range.selectNodeContents(block.querySelector('code'));
					selection.removeAllRanges();
					selection.addRange(range);
				};

				for (var i = codeBlocks.length - 1; i >= 0; i--) {
					codeBlocks[i].addEventListener('click', select.bind(this, codeBlocks[i]));
				}
			}


			/**
			 * Open/Close menu based on session var.
			 * Also attach a media query listener to close the menu when resizing to smaller screen.
			 */
			function setInitialMenuState() {
				console.log('setInitialMenuState');

				// root element
				var root = document.querySelector('html');

				var mq = window.matchMedia(Fabricator.options.mq);

				// if small screen
				var mediaChangeHandler = function (list) {
					if (!list.matches) {
						Fabricator.helpers.removeClass( root, 'f-menu-active');
					} else {
						if (self.getOptions().menu) {
							Fabricator.helpers.addClass( root, 'f-menu-active');
						} else {
							Fabricator.helpers.removeClass( root, 'f-menu-active');
						}
					}
				};

				mq.addListener(mediaChangeHandler);
				mediaChangeHandler(mq);
			}

			/**
			 * Add fixed class to sidebar on scroll
			 */
			function fixSidebar() {
				console.log('fixSidebar');

				var dsHeaderTop  = document.querySelector( '.f-header-top' ),
					dsHeader  = document.querySelector( '.f-header' ),
					dsSidebar = document.querySelector( '.f-menu' ),
					headerTopHeight = dsHeaderTop.offsetHeight,
					headerHeight = dsHeader.offsetHeight,
					totalHeaderHeight = headerTopHeight + headerHeight;


				if ( 'undefined' === typeof dsHeaderTop || null === dsHeaderTop ) {
					return;
				}

				if ( 'undefined' === typeof dsHeader || null === dsHeader ) {
					return;
				}

				if ( 'undefined' === typeof dsSidebar || null === dsSidebar ) {
					return;
				}

				window.onscroll = function() {
					var topOffset = window.pageYOffset;

					if ( window.pageYOffset > totalHeaderHeight ) {
						Fabricator.helpers.addClass( dsSidebar, 'fixed' );
					} else {
						Fabricator.helpers.removeClass( dsSidebar, 'fixed' );
					}
				};
			}

			return {
				initialize : initialize,
				setInitialMenuState : setInitialMenuState,
				menuToggle : menuToggle,
				buildColorChips : buildColorChips,
				setActiveItem : setActiveItem,
				bindCodeAutoSelect : bindCodeAutoSelect,
				fixSidebar : fixSidebar,
			};
		}();

		designsystem.initialize();
		designsystem.setInitialMenuState();
		designsystem.menuToggle();
		designsystem.buildColorChips();
		designsystem.setActiveItem();
		designsystem.bindCodeAutoSelect();
		designsystem.fixSidebar();

	})( Fabricator );

}).call( Fabricator, this );