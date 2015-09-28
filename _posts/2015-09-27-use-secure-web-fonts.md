---
title: Use Secure Web Fonts
tags:
  - web-fonts
  - SSL
  - CSS
---

Recently, it seems like a surprising number of websites I visit are using SSL but are trying to load non-SSL versions of required assets (for example, web fonts). Most modern web browsers will block these assets from loading as a security precaution. This is extremely simple to fix, so there is really no excuse for allowing this problem to occur.

## Why is this a Problem?
It would be pretty silly to claim that a website is secured with SSL if it is loading completely unsafe assets from anywhere on the web. What does it matter that the HTML is secure if the browser is also loading, for example, a JavaScript file that takes over the user's session?

On any HTTPS web page, the browser blocks any requests for external content that isn't also retrieved via HTTPS. Since, presumably, someone took the time to write the code to retrieve these assets, it is likely that having the browser block them is not the originally-intended behavior.

While this problem can occur with any type of unsafe external asset, lately every offending case I've come across involved attempting to load unsafe web fonts. That means that all of those pretty fonts are not being loaded by users' browsers. Most web font providers, including [Google Fonts][google-fonts], offer SSL-enabled URLs for their fonts. Make sure to use them!

## How to Spot the Problem
In Chrome, there will be a little shield icon in the address bar. This is Chrome's way of notifying that it is "shielding" its user from non-HTTPS content that was requested by the website.

<figure>
    <picture>
        <source
            media="(min-width: 1025px)"
            srcset="../../images/UseSecureWebFonts-UnsafeContentShield_400.png 1x,
                    ../../images/UseSecureWebFonts-UnsafeContentShield_2400.png 2x">
        <img
            src="../../images/UseSecureWebFonts-UnsafeContentShield_400.png" alt="Chrome's shield icon indicating blocked unsafe content"
            srcset= "../../images/UseSecureWebFonts-UnsafeContentShield_2400.png 2x">
    </picture>
    <figcaption>Chrome's shield icon indicating blocked unsafe content</figcaption>
</figure>

In order to determine which external content is getting blocked, use Chrome's Developer Tools feature to open the JavaScript console. Usually there will be a console error message waiting there. Check to see if the blocked asset's URL is using HTTP instead of HTTPS.

<figure>
    <picture>
        <source
            media="(min-width: 1025px)"
            srcset="../../images/UseSecureWebFonts-JavaScriptConsoleMessage_400.png 1x,
                    ../../images/UseSecureWebFonts-JavaScriptConsoleMessage_2562.png 2x">
        <img
            src="../../images/UseSecureWebFonts-JavaScriptConsoleMessage_400.png" alt="Chrome's Developer Tools JavaScript console error message"
            srcset= "../../images/UseSecureWebFonts-JavaScriptConsoleMessage_2562.png 2x">
    </picture>
    <figcaption>Chrome's Developer Tools JavaScript console error message</figcaption>
</figure>

## Protocol Relative URLs
It used to be that when specifying a web font in CSS, one could simply abstain from specifying the protocol (HTTP or HTTPS) and the browser would figure out for itself whether it needed the SSL version or the normal version.

This technique was known as using *protocol relative URLs*, but [Paul Irish's original article][paul-irish-article] was updated in 2014 to inform readers that **this is now considered to be an anti-pattern**. Instead, Irish recommends developers **always use the SSL version** as there is little reason not to do so (the performance impact is not detectable).

## The Solution
It is necessary that the asset in question be made available via SSL. Typically, the given font will be at the exact same URL for both the HTTP and HTTPS protocols. Find the place in the source code using the URL and add an "s" at the end of the `http` part.

#### Incorrect, Non-SSL URL
```css
@font-face {
  font-family: 'comic-sans';
  src: url('http://...');
}
```

#### Corrected SSL URL
```css
@font-face {
  font-family: 'comic-sans';
  src: url('https://...'); /* Notice the 's' */
}
```

That's it.

[paul-irish-article]: http://www.paulirish.com/2010/the-protocol-relative-url/
[google-fonts]: https://www.google.com/fonts 
