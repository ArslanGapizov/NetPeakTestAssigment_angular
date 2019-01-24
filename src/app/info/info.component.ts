import { Component, OnInit } from '@angular/core';
import { ParsedSite } from 'src/app/models/parsedSite';
import { Input } from '@angular/core';
import { race } from 'rxjs/internal/observable/race';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  @Input() parsedSite: ParsedSite;
  constructor() { }

  ngOnInit() {
  }

  getStatusColor() {
    if(this.parsedSite.serverResponse.code >= 200 &&
      this.parsedSite.serverResponse.code < 300)
      return 'lightgreen';
    if(this.parsedSite.serverResponse.code >= 100 &&
      this.parsedSite.serverResponse.code < 200 ||
      this.parsedSite.serverResponse.code >= 300 &&
      this.parsedSite.serverResponse.code < 400)
      return 'yellow';
    if(this.parsedSite.serverResponse.code > 400)
      return 'rgb(253, 70, 97)';
  }
}
