## Codesnippet that contains infos:

```html
<div class="centre">
    <h3>When I&rsquo;m on Facebook at work and the boss appears behind me</h3>
</div>
<div class="bodytype">
    <p class="e">
        <img src="http://tclhost.com/vRGLoAT.gif" alt="image" />
        <br />
        <i>/* by Ronney */</i>
    </p>
</div>
```
## Regex:
### Headline html-tag:
`/(<h3>(.*?)<\/h3>)/g`
### Remove html-tags:
`/<[^>]*>/g`
### Image html-tag:
`/(<p class="e"><img src="(.*?)\.gif")/`
### Extract Image-Url:
`/(http(.*?)\.gif)/`