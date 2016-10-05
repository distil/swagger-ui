// Reverted from the 1.x and 2.x lines for backwards compat reasons. This
// project requires additional plugin upgrades/replacements to switch to jquery
// 3 so the patch is manually applied instead
//
// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter(function (s) {
    if (s.crossDomain) {
        s.contents.script = false;
    }
});
