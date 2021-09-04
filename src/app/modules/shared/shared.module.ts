import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { NotificationComponent } from './components/notification/notification.component';
import { BtoaPipe } from './pipes/btoa/btoa.pipe';
import { EndOfStringPipe } from './pipes/end-of-string/end-of-string.pipe';

@NgModule({
  declarations: [
    NotificationComponent,
    BtoaPipe,
    EndOfStringPipe,
  ],
  imports: [
    CommonModule,
    ClarityModule,
  ],
  exports: [
    NotificationComponent,
    BtoaPipe,
    EndOfStringPipe,
  ],
})
export class SharedModule { }
