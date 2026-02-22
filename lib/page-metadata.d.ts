export type PageMetadata = {
    url: string;
    title: string;
    description: string;
    image: string;
};
export declare function fetchPageMetadata(url: string): Promise<PageMetadata>;
