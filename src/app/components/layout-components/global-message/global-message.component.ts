import { Component, OnInit } from '@angular/core';
import { GlobalMessageService } from '@shared/global-message.service';
import { EnvService } from '@shared/env.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'layout-global-message',
  templateUrl: './global-message.component.html',
  styleUrls: ['./global-message.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ])
  ]
})
export class GlobalMessageComponent implements OnInit {
  successIcon: string;
  errorIcon: string;
  warningIcon: string;

  constructor(
    public globalMessageService: GlobalMessageService,
    private readonly envService: EnvService
  ) {}

  staticStorageLink: string = this.envService.getStaticStorageLink;

  getAlertStyles() {
    if (this.globalMessageService.isError) return 'alert error';
    else if (this.globalMessageService.isWarning) return 'alert warning';
    else return 'alert success';
  }

  ngOnInit() {
    this.successIcon = `${this.staticStorageLink}/icons/check-circle.svg`;
    this.errorIcon = `${this.staticStorageLink}/icons/error.svg`;
    this.warningIcon = `${this.staticStorageLink}/icons/warning.svg`;
  }
}
