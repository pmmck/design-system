var test = require('tape');
var tapSpec = require('tap-spec');
// Uses node globals since there is no window to attach to.
var ripple = require('../../../src/js/ripple');

test('Duration test for RippleJS', function (t) {
	t.plan(2);

	var r = window.ripple(),
		options = {
			duration : 0.7,
			rate : function() {
				return 1;
			}
		},
		$ripple = function() {
			return {
				width: function() {
					return 1;
				}
			}
		}();

	var result = r.setAnimationRate( $ripple, options );

	t.equal(result, 1.00, 'New Duration is correct');

	// Create a second that tests so the original duration is passed back.

	options.duration = 1;

	result = r.setAnimationRate( $ripple, options );

	t.equal(result, 1.00, 'Original Duration is correct');

});
