/**
 * Global `fabricator` object
 * @namespace
 */
var Fabricator = window.Fabricator = {};

(function( window, document ) {
	'use strict';

	require('./prism');


	( function( Fabricator ) {

		var designsystem = function() {

			function initialize() {
				var self = this;

				/**
				 * Default options
				 * @type {Object}
				 */
				self.options = {
					menu: false,
					mq: '(min-width: 60em)'
				};

				// open menu by default if large screen
				self.options.menu = window.matchMedia(self.options.mq).matches;

				/**
				 * Feature detection
				 * @type {Object}
				 */
				self.test = {};

				// test for sessionStorage
				self.test.sessionStorage = (function () {
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
				if (self.test.sessionStorage) {
					sessionStorage.self = sessionStorage.self || JSON.stringify(self.options);
				}


				/**
				 * Cache DOM
				 * @type {Object}
				 */
				self.dom = {
					root: document.querySelector('html'),
					primaryMenu: document.querySelector('.f-menu'),
					menuItems: document.querySelectorAll('.f-menu li a'),
					menuToggle: document.querySelector('.f-menu-toggle')
				};


				/**
				 * Get current option values from session storage
				 * @return {Object}
				 */
				self.getOptions = function () {
					return (self.test.sessionStorage) ? JSON.parse(sessionStorage.self) : self.options;
				};

			}

			/**
			 * Build color chips
			 */
			function buildColorChips() {

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
					for (var i = fabricator.dom.menuItems.length - 1; i >= 0; i--) {

						var item = fabricator.dom.menuItems[i];
						// get item href without first slash
						href = item.getAttribute('href').replace(/^\//g, '');

						if ( href === current ) {
							fabricator.helpers.addClass( item, 'current');
						} else {
							fabricator.helpers.removeClass( item, 'current');
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

				// shortcut menu DOM
				var toggle = fabricator.dom.menuToggle;

				var options = fabricator.getOptions();

				// toggle classes on certain elements
				var toggleClasses = function () {
					//TODO: Replace ClassList!
					var menuClassList = fabricator.dom.root.className.split(' ');
					options.menu = !fabricator.dom.root.classList.contains('f-menu-active');
					fabricator.dom.root.classList.toggle('f-menu-active');

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
					if (!window.matchMedia(self.options.mq).matches) {
						toggleClasses();
					}
				};

				for (var i = 0; i < fabricator.dom.menuItems.length; i++) {
					fabricator.dom.menuItems[i].addEventListener('click', closeMenu);
				}
			}

			/**
			 * Automatically select code when code block is clicked
			 */
			function bindCodeAutoSelect() {

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

				// root element
				var root = document.querySelector('html');

				var mq = window.matchMedia(self.options.mq);

				// if small screen
				var mediaChangeHandler = function (list) {
					if (!list.matches) {
						fabricator.helpers.removeClass( root, 'f-menu-active');
					} else {
						if (self.getOptions().menu) {
							fabricator.helpers.addClass( root, 'f-menu-active');
						} else {
							fabricator.helpers.removeClass( root, 'f-menu-active');
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
						fabricator.helpers.addClass( dsSidebar, 'fixed' );
					} else {
						fabricator.helpers.removeClass( dsSidebar, 'fixed' );
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

	})( Fabricator );

}).call( Fabricator, this, this.document );