import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParserService } from 'src/app/services/parser.service';
import { ParsedSite } from 'src/app/models/parsedSite';
import { HistoryService } from 'src/app/services/history.service';
import { UploadEvent, FileSystemFileEntry } from 'ngx-file-drop';
import { MatSnackBar } from '@angular/material';
import { Extensions } from 'src/app/shared/extenstions';
import { NotificationService } from 'src/app/services/notification.service';
import { Config } from 'src/app/shared/config';

import { map, shareReplay, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
@Component({
  selector: 'app-parse',
  templateUrl: './parse.component.html',
  styleUrls: ['./parse.component.scss']
})
export class ParseComponent implements OnInit {
  urlForm: FormGroup;
  parsedSite: ParsedSite;
  isLoading = false;
  exception: string = null;
  sitesHistory: ParsedSite[] = null;
  socket: WebSocket;
  constructor(private formBuilder: FormBuilder,
              private parserService: ParserService,
              private historyService: HistoryService,
              private snackBar: MatSnackBar,
              private notifService: NotificationService) {

  }

  ngOnInit() {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.urlForm = this.formBuilder.group({
      urlInput: ['', [Validators.required, Validators.pattern(reg)]]
    });
    this.getHistory();
    this.setupNotifications();
  }
  setupNotifications() {
    this.notifService.connect()
    this.notifService.messages.subscribe(_=> this.getHistory());
  }
  getHistory() {
    this.historyService.getAll()
    .subscribe(r => {
      this.sitesHistory = r;
    })
  }
  onSubmit() {
    this.exception = null;
    this.isLoading = true;
    this.parserService.parsePage(this.urlForm.value.urlInput)
    .subscribe(r =>  {
      this.parsedSite = r;
      this.isLoading = false;
      console.log(r);
    },
    e => {
      this.parsedSite = null;
      this.exception = e.error.toString();
      this.isLoading = false;
    });
  }

  reloadFromUri(uri: string) {
    this.urlForm.controls.urlInput.setValue(uri);
    this.onSubmit();
  }
  getResultFromHistory(parsedSite: ParsedSite) {
    this.isLoading = true;
    this.urlForm.controls.urlInput.setValue(parsedSite.uri);
    this.historyService.getById(parsedSite.id)
    .subscribe(r => {
      this.parsedSite = r;
      this.isLoading = false;
    }, e => {
      this.isLoading = false;
    })
  }
  deleteFromHistory(id: number) {
    this.historyService.deleteById(id)
    .subscribe(
      _ => this.getHistory(),
      e => e
    )
  }

  public dropped(event: UploadEvent) {
    event.files;
    for (const droppedFile of event.files) {
 
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
 
          // Here you can access the real file
          
          var reader = new FileReader();
          var historyService = this.historyService;
          reader.onload = function(event: any) {
            var json = JSON.parse(event.target.result);
            let result: ParsedSite = Extensions.createInstanceFromJson(ParsedSite, json);
            
            historyService.add(result)
            .subscribe(_=>_);
          }
          reader.readAsText(file);
          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)
 
          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })
 
          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/
 
        });
      } else {
        this.snackBar.open("Cannot import directory","", {
          duration: 2000,
        });
      }
    }
  }
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }
}
