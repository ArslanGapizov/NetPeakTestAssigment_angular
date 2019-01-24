import { ServerResponse } from './serverResponse';
import { HTMLImage } from 'src/app/models/HTMLImage';
import { HTMLLink } from 'src/app/models/HTMLLink';

export class ParsedSite {
    id: number;
    uri: string;
    title: string;
    description: string;
    serverResponse: ServerResponse;
    responseTime: number;
    headersH1: string[];
    images: HTMLImage[];
    links: HTMLLink[];
}