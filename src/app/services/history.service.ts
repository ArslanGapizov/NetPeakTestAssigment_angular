import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParsedSite } from 'src/app/models/parsedSite';
import { Config } from 'src/app/shared/config';
import { Observable } from 'rxjs/internal/Observable';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient) { }
  
  public getAll(): Observable<ParsedSite[]> {
    return this.http.get<ParsedSite[]>(`${Config.Site}api/history`);
  }
  public getById(id: number) {
    return this.http.get<ParsedSite>(`${Config.Site}api/history/${id}`);
  }
  public deleteById(id: number) {
    return this.http.delete(`${Config.Site}api/history/${id}`);
  }
  public add(parsedSite: ParsedSite) {
    
    const _headers = new HttpHeaders(
      {'Content-Type': 'application/json; charset=utf-8'}
    );
    return this.http.post(`${Config.Site}api/history`, JSON.stringify(parsedSite), {headers: _headers});
  }
}
