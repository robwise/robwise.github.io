(function openExternalLinksInNewWindow() {
  $(document).ready(function() {

    var internalLinkRegex = /^(((http:\/\/|https:\/\/)?robwise\.github\.io)|localhost:)(\/.*)?/m;

    $('a').filter(function() {
      var href = $(this).attr('href');
      return !internalLinkRegex.test(href);
    })
    .each(function() {
      $(this).attr('target', '_blank');
    });

  });
}());
