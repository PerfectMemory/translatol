import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityIcons, helpIcon, languageIcon } from '@cds/core/icon';
import '@cds/core/icon/register.js';
import { ClarityModule } from '@clr/angular';
import { TEMPLATE_FILE_HANDLER, XLIFF_WRITING } from 'translatol-shared-module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './modules/shared/shared.module';
import { TranslationsModule } from './modules/translations/module';
import { FileService } from './modules/translations/services/file/file.service';
import { PathService } from './modules/translations/services/path/path.service';
import { AboutComponent } from './pages/about/about.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { RootComponent } from './pages/root/root.component';
ClarityIcons.addIcons(helpIcon, languageIcon);

@NgModule({
  providers: [
    {
      provide: XLIFF_WRITING,
      useClass: FileService,
    },
    {
      provide: TEMPLATE_FILE_HANDLER,
      useClass: PathService,
    },
  ],
  declarations: [MainLayoutComponent, RootComponent, AboutComponent],
  imports: [CommonModule, AppRoutingModule, ClarityModule, BrowserAnimationsModule, ReactiveFormsModule, SharedModule, TranslationsModule],

  bootstrap: [RootComponent],
})
export class AppModule {}
