export function extractHost(url: string): string {
    const foundHosts: string[] = url.match(/(http:\/\/.*\/)/);
    const lastSlashIndex: number = foundHosts[0].lastIndexOf('/');
    const host: string = foundHosts[0].slice(0, lastSlashIndex);
    return host;
}

// TODO refactor extractPath so it no longer needs host
// use Regex instead
export function extractPath(url: string, host: string): string {
    const path: string = url.replace(`http://${host}`, '');
    return path;
}

export function extractHeadline(body: string): string  {
    const foundHeadlines: string[] = body.match(/(<h1 class="blog-post-title">(.*?)<\/h1>)/);
    console.log('Headline: ', foundHeadlines[2]);
    return foundHeadlines[2];
}

export function extractGifUrl(body: string): string {
  body = body.replace(/\r?\n|\r/g,"");  
  const foundGifUrls: string[] = body.match(/(<div class="blog-post-content">.*(http.*\.gif))/);
    return foundGifUrls[2];
}

export function extractLocation(body: string): string {
  const locations: string[] = body.match(/(<a class="nav-link" (href="(https:\/\/thecodinglove\.com\/.*?)"))/);
  return locations[3];
}
