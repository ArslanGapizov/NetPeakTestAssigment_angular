export class HTMLLink {
    href: string;
    linkType: LinkType;
}
export enum LinkType
{
    INTERNAL = 0,
    EXTERNAL = 1
}