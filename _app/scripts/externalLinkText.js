(function showExternalLinkTextOnHover() {
  console.log('showExternalLinkTextOnHover executed');
  $(document).ready(function() {

    var animationType = 'fade',
        animationSpeed = 'fast',
        animationEasing = 'swing', // 'linear' or 'swing'
        timer,
        externalProfileLinks = $('.external-profile-link'),
        showExternalLink = function() {
          var linkText = $(this).next('.external-profile-link-text');
          $(linkText).removeClass('is-hidden').animate(animationType, animationSpeed, animationEasing);
        };

    $(externalProfileLinks).on('mouseenter', function() {
      if ($(window).width() > 1200) {
        var el = this;
        timer = window.setTimeout(showExternalLink.bind(el), 250);
      }
    });

    $(externalProfileLinks).on('mouseleave', function() {
      window.clearTimeout(timer);
      var linkText = $(this).next('.external-profile-link-text');
      $(linkText).addClass('is-hidden').animate(animationType, animationSpeed, animationEasing);
    });

  });
}());
