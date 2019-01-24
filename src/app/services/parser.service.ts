import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParsedSite } from '../models/parsedSite';
import { Config } from '../shared/config';
@Injectable({
  providedIn: 'root'
})
export class ParserService {

  constructor(private http: HttpClient) { }

  public parsePage(url: string) {
    return this.http.get<ParsedSite>(`${Config.Site}api/parser/html?url=${url}`);
  }
}
