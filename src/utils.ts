export function extractHost(url: string): string {
    const foundHosts: string[] = url.match(/(http:\/\/.*\/)/);
    const lastSlashIndex: number = foundHosts[0].lastIndexOf('/');
    const host: string = foundHosts[0].slice(0, lastSlashIndex);
    return host;
}

// TODO refactor extractPath wo it no longer needs host
// use Regex instead
export function extractPath(url: string, host: string): string {
    const path: string = url.replace(`http://${host}`, '');
    return path;
}

export function extractHeadline(body: string): string  {
    const foundHeadlines: string[] = body.match(/(<h3>(.*?)<\/h3>)/g);
    const headline: string = foundHeadlines[0].replace(/<[^>]*>/g, '');
    return headline;
}

export function extractGifUrl(body: string): string {
    console.log(body);
    const foundGifUrls: string[] = body.match(/(<p class=".*"><img src="(.*?)\.gif")/);
    const gifUrl: string[] = foundGifUrls[0].match(/(http(.*?)\.gif)/);
    return gifUrl[0];
}
