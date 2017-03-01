// This forces Roboto 300 to load as soon as the page loads
// Otherwise, it would wait to download it until some DOM with Roboto font was rendered
// This can cause it to jitter or even not show the text under slow network conditions
export default function fontForceLoad(){
  var roboto = new FontFace('Roboto', 'url(https://fonts.gstatic.com/s/roboto/v15/Hgo13k-tfSpn0qi1SFdUfVtXRa8TVwTICgirnJhmVJw.woff2)', {});
  var icons = new FontFace('Material Icons', 'url(https://fonts.gstatic.com/s/materialicons/v19/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2)', {});

  roboto.load().then(function(){
    document.fonts.add(roboto);
  });

  icons.load().then(function(){
    document.fonts.add(icons);
  });

}
