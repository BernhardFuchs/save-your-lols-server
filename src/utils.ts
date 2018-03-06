export function extractHeadline(body: string): string  {
    const foundHeadlines = body.match(/(<h3>(.*?)<\/h3>)/g);
    console.log('found headlines', foundHeadlines);
    const headline = foundHeadlines[0].replace(/<[^>]*>/g, '');
    console.log('refined headline: ', headline);
    return headline;
}

export function extractGifUrl(body: string): string {
    const foundGifUrls = body.match(/(<p class="e"><img src="(.*?)\.gif")/);
    console.log('rawGifUrls: ', foundGifUrls[0]);
    const gifUrl = foundGifUrls[0].match(/(http(.*?)\.gif)/);
    console.log('found gifurls: ', gifUrl[0]);
    return gifUrl[0];
}
