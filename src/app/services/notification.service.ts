import { Injectable } from '@angular/core';
import { Subject, Observer, Observable} from 'rxjs';
import { Config } from 'src/app/shared/config';

export interface Message {
  event: string,
  id: number
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private subject: Subject<MessageEvent>;
  
	public messages: Subject<string>;
  constructor() { }

  public connect(): Subject<MessageEvent> {
    if (!this.subject) {
      this.messages = new Subject<string>();
      this.create((Config.Sheme == "https://" ? "wss://" : "ws://")+Config.Domain);
    } 
    return this.subject;
  }
  private create(url) {
    let ws = new WebSocket(url);
    var messages = this.messages;
    ws.addEventListener('message', function (event) {
      messages.next("update history");
    })
  }
}
