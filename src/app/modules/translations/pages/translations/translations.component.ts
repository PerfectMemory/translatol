import { Observable, merge, combineLatest } from 'rxjs';
import { map, shareReplay, switchMap, startWith, filter } from 'rxjs/operators';
import { Component, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IXliffTransUnit, IXliff } from '@vtabary/xliff2js';
import { HistoryService, NotificationService } from 'src/app/modules/shared/public-api';
import { FileService } from '../../services/file/file.service';
import { TranslationsService } from '../../services/translations/translations.service';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss'],
})
export class TranslationsComponent {
  public group: FormGroup;
  public toTranslate$: Observable<IXliffTransUnit[]>;
  public translated$: Observable<IXliffTransUnit[]>;
  public translations$: Observable<IXliffTransUnit[]>;
  public translations: IXliff;
  public filePath: string;
  public targetLanguage: string;
  public searched$ = new EventEmitter<string>();

  private refreshed = new EventEmitter();

  constructor(
    translationsService: TranslationsService,
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private historyService: HistoryService,
    private notification: NotificationService
  ) {
    this.translations$ = merge(
      this.activatedRoute.params.pipe(
        filter(params => !!params.properties),
        map(params => (this.filePath = atob(params.properties)))
      ),
      this.refreshed.pipe(map(() => this.filePath))
    ).pipe(
      switchMap(filePath => translationsService.load(filePath)),
      map(locale => {
        this.translations = locale;
        this.targetLanguage = locale.children[0]?.$?.['target-language'];
        this.historyService.add({ path: this.filePath, type: 'file' });
        return translationsService.getAllTranslations(locale);
      }),
      this.filterOperator(this.searched$),
      shareReplay(1)
    );

    this.toTranslate$ = this.translations$.pipe(this.filterByTranslatedOperator(false), shareReplay(1));

    this.translated$ = this.translations$.pipe(this.filterByTranslatedOperator(true), shareReplay(1));
  }

  public onSave() {
    this.fileService
      .saveXLIFF(this.filePath, this.translations)
      .pipe(
        switchMap(() =>
          this.notification.success({
            message: 'Translation file saved',
          })
        )
      )
      .subscribe();
  }

  public refresh() {
    this.refreshed.emit();
  }

  private filterByTranslatedOperator(translated: boolean): (source: Observable<IXliffTransUnit[]>) => Observable<IXliffTransUnit[]> {
    return source$ =>
      new Observable(observer => {
        return source$.subscribe({
          next: translations =>
            observer.next(translations.filter(translation => translation.children.some(child => child.name === 'target') === translated)),
          error: err => observer.error(err),
          complete: () => observer.complete(),
        });
      });
  }

  private filterOperator(filter$: Observable<string>): (source: Observable<IXliffTransUnit[]>) => Observable<IXliffTransUnit[]> {
    return source$ =>
      new Observable(observer => {
        return combineLatest([source$, filter$.pipe(startWith(''))]).subscribe({
          next: data => observer.next(this.filterByText(data[0], data[1])),
          error: err => observer.error(err),
          complete: () => observer.complete(),
        });
      });
  }

  private filterByText(translations: IXliffTransUnit[], filter: string): IXliffTransUnit[] {
    if (filter === '') {
      return translations;
    }

    return translations.filter(translation => {
      return translation.name.indexOf(filter) >= 0 || translation.$.id.indexOf(filter) >= 0;
    });
  }
}
