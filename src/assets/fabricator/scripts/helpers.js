( function( Fabricator ) {

	Fabricator.helpers = function() {

		/**
		 * Helper to add a className to an element
		 */
		function addClass( el, className ) {
			//Check if element is undefined or null first
			if ( 'undefined' === typeof el || null === el ) {
				return;
			}
			// So we don't have duplicates
			removeClass( el, className );
			el.className += ' ' + className;
		}

		/**
		 * Helper to remove a className from an element
		 */
		function removeClass( el, className ) {
			//Check if element is undefined or null first
			if ( 'undefined' === typeof el || null === el ) {
				return;
			}

			//Go to end of index for existing classes and remove desired class
			if ( el.className.indexOf( ' ' + className ) > -1 ) {
				el.className = el.className.replace( ' ' + className , '' );
			} else if ( el.className.indexOf( className ) > -1 ) {
				el.className = el.className.replace( className , '' );
			}
		}

		return {
			addClass    : addClass,
			removeClass : removeClass,
		};
	}();

})( Fabricator );
