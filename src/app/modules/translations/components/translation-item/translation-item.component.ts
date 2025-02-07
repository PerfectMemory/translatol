import { Component, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { IXliffInterpolation } from '@vtabary/xliff2js';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-translation-item',
  templateUrl: './translation-item.component.html',
  styleUrls: ['./translation-item.component.scss'],
})
export class TranslationItemComponent implements OnChanges, OnDestroy {
  @Input()
  public source: string | IXliffInterpolation;

  @Input()
  public target: string | IXliffInterpolation;

  @Input()
  public id: string;

  @Input()
  public group: FormGroup;

  @Input()
  public sourceLanguage: string;

  @Input()
  public targetLanguage: string;

  public control: FormControl;
  public text: string;
  public interpolation: IXliffInterpolation;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnChanges() {
    if (!this.source) {
      return;
    }

    if (typeof this.source === 'string') {
      this.text = this.source;
    } else {
      this.interpolation = this.source;
    }

    if (!this.text) {
      return;
    }

    // Display the target only if the target is a string (could be an object from a previous edition)
    const target = typeof this.target === 'string' ? this.target.trim() : '';
    this.group.addControl(this.id, this.formBuilder.control(target));
  }

  public ngOnDestroy() {
    if (!this.group || !this.group.contains(this.id)) {
      return;
    }

    this.group.removeControl(this.id);
  }
}
