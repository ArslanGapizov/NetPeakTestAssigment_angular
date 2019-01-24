import { Component, OnInit } from '@angular/core';
import { ParsedSite } from 'src/app/models/parsedSite';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { HistoryService } from 'src/app/services/history.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeUrl } from '@angular/platform-browser';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @ViewChild('downloadBtn') downloadLink: ElementRef;
  //reload page again
  @Output() reloadByUriEvent = new EventEmitter<string>();
  //get result from the history
  @Output() getResultEvent = new EventEmitter<ParsedSite>();
  //delete element from history
  @Output() deleteEvent = new EventEmitter<number>();
  @Input() sitesHistory: ParsedSite[] = null;
  downloadJsonHref: SafeUrl;
  downloadName: string;
  constructor(private historyService: HistoryService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  reloadByUri(uri: string) {
    this.reloadByUriEvent.emit(uri);
  }
  getResult(parsedSite: ParsedSite) {
    this.getResultEvent.emit(parsedSite);
  }
  delete(id: number) {
    this.deleteEvent.emit(id);
  }
  onDownload(id: number) {
    this.historyService.getById(id)
    .subscribe(
      r => {
        this.download(r);
      }
    )
  }
  download(parsedSite: ParsedSite) {
    var theJSON = JSON.stringify(parsedSite);
        
    var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
    this.downloadName = "export_Id_" + parsedSite.id + ".json";
    this.downloadJsonHref = uri;


    //Fix for bug: doesnt download file first time
    var donwloadLink = this.downloadLink;
    var f = function() {
      let event = new MouseEvent('click', {bubbles: true});
      donwloadLink.nativeElement.dispatchEvent(event);
    };
    setTimeout(f, 50);
  }
}
