import { Component, Input } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { DefaultTranslation } from '@layouts/default/default.translation';

@Component({
  selector: 'layout-default',
  templateUrl: './default.layout.html',
  styleUrls: ['./default.layout.scss'],
  providers: [DefaultTranslation]
})
export class DefaultLayout {
  @Input() showHeader = true;
  @Input() showHeaderBurger = true;
  @Input() userInfo: UserInfoResponse;

  @Input() showFooter = true;
  @Input() showSideBar = true;
  @Input() withPreview = false;

  isSidebarOpen = false;
}
