import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Thread } from '../thread/thread.model';

@Component({
  selector: 'chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.css']
})
export class ChatThreadComponent implements OnInit {
  @Input() thread: Thread;
  @Input() selected: boolean;
  @Output() onThreadSelected: EventEmitter<Thread>;
  @Output() onThreadDelete: EventEmitter<string>;

  constructor() {
    this.onThreadSelected = new EventEmitter<Thread>();
    this.onThreadDelete = new EventEmitter<string>();
  }

  ngOnInit() { }

  clicked(event: any): void {
    this.onThreadSelected.emit(this.thread);
    event.preventDefault();
  }

  onDelete(event: any): void {
    this.onThreadDelete.emit(this.thread.id);
    event.preventDefault();
  }
}
