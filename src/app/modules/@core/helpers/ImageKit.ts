export class ImageKit {
  static detectFormatImage(): string {
    // Optional Step: Do some stuff with the url if needed.

    // If you lower it in the optional step
    // you don't need to use "toLowerCase"
    // when you pass it down to the next function
    let isChrome = /Chrome/.test(window.navigator.userAgent) && /Google Inc/.test(window.navigator.vendor);
    let isSafari = /Safari/.test(window.navigator.userAgent) && /Apple Computer/.test(window.navigator.vendor);
    let isIE = /MSIE/.test(window.navigator.userAgent) && /Trident.*rv\:11\./.test(window.navigator.vendor);

    // console.log('isChrome:', isChrome);
    // console.log('isSafari:', isSafari);

    if (isSafari || isIE) {
      return 'jpeg'
    }

    return 'webp';
  }
}
