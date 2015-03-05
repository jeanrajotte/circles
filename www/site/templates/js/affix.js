/*

our own affix logic 
- simple!

*/

$(document).ready(function(){
   // cache the window object
   $window = $(window);
 
   $('[data-affix-top]').each(function(){
      var $this = $(this),
        $container = $this.closest('.affix-spacer');

      $(window).scroll(function() {
        var top = $this.data('affix-top'),
          nativeTop = $this.offset().top;
        // scrolling back up?
        if ($this.hasClass('affixed') && $(document).scrollTop() < ($this.data('native-top') - top)) {
          $this.removeClass('affixed');
          $this.css('top', '');
          $this.data('native-top', '');
        } else if ($(document).scrollTop() > nativeTop - top) {
          // fix to top
          // if requested, for the 1st time only, hold the shape of the container
          // as the element will fly away when fixed
          if ($container.length) {
            if (!$container.data('affixated')) {
              $container
                .css('minHeight', $this.outerHeight() + 'px')
                .data('affixated', true);
            }
          }

          $this.data('native-top', nativeTop);  // remember it for the comeback
          $this.addClass('affixed');
          $this.css('top', top + 'px');
        } 
      }); 
   });
});


