import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-translation-search',
  templateUrl: './translation-search.component.html',
  styleUrls: ['./translation-search.component.scss'],
})
export class TranslationSearchComponent {
  @Output()
  public changed = new EventEmitter<string>();

  public group: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.group = this.formBuilder.group({
      text: '',
    });
  }

  public submit() {
    this.changed.emit(this.group.controls.text.value);
  }
}
