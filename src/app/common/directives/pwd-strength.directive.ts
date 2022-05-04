import { NgControl } from '@angular/forms';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[pwdStrength]',
})
export class PwdStrengthDirective implements AfterViewInit, OnChanges {
  @Input() pwdStrength: any;
  config: any = {
    length: 6,
    minimumSpecialCharacter: 2,
    minimumDIgit: 2,
    minimumUpperCase: 2,
    minimumLowerCase: 2,
  };
  messageDom!: ElementRef;
  constructor(
    private formControl: NgControl,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('input', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    let value = this.formControl.control?.value;
    if (this.config.length > 0) {
      if (value.length >= 8) {
        const length = document.getElementById('length');
        this.renderer.removeClass(length, 'error');
        this.renderer.addClass(length, 'success');
      } else {
        const length = document.getElementById('length');
        this.renderer.removeClass(length, 'success');
        this.renderer.addClass(length, 'error');
      }
    }
    if (this.config.minimumSpecialCharacter > 0) {
      if (
        value.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) &&
        this.checkSpecialCharacterLength(value) >=
          this.config.minimumSpecialCharacter
      ) {
        const minimumSpecialCharacter = document.getElementById(
          'minimumSpecialCharacter'
        );
        this.renderer.removeClass(minimumSpecialCharacter, 'error');
        this.renderer.addClass(minimumSpecialCharacter, 'success');
      } else {
        const minimumSpecialCharacter = document.getElementById(
          'minimumSpecialCharacter'
        );
        this.renderer.removeClass(minimumSpecialCharacter, 'success');
        this.renderer.addClass(minimumSpecialCharacter, 'error');
      }
    }

    if (this.config.minimumDIgit > 0) {
      if (this.checkDIgitLength(value) >= this.config.minimumDIgit) {
        const minimumDIgit = document.getElementById('minimumDIgit');
        this.renderer.removeClass(minimumDIgit, 'error');
        this.renderer.addClass(minimumDIgit, 'success');
      } else {
        const minimumDIgit = document.getElementById('minimumDIgit');
        this.renderer.removeClass(minimumDIgit, 'success');
        this.renderer.addClass(minimumDIgit, 'error');
      }
    }

    if (this.config.minimumUpperCase > 0) {
      if (
        this.checkMinimumUpperOrLowerCase(value, 'upper') >=
        this.config.minimumUpperCase
      ) {
        const minimumUpperCase = document.getElementById('minimumUpperCase');
        this.renderer.removeClass(minimumUpperCase, 'error');
        this.renderer.addClass(minimumUpperCase, 'success');
      } else {
        const minimumUpperCase = document.getElementById('minimumUpperCase');
        this.renderer.removeClass(minimumUpperCase, 'success');
        this.renderer.addClass(minimumUpperCase, 'error');
      }
    }

    if (this.config.minimumLowerCase > 0) {
      if (
        this.checkMinimumUpperOrLowerCase(value, 'lower') >=
        this.config.minimumLowerCase
      ) {
        const minimumLowerCase = document.getElementById('minimumLowerCase');
        this.renderer.removeClass(minimumLowerCase, 'error');
        this.renderer.addClass(minimumLowerCase, 'success');
      } else {
        const minimumLowerCase = document.getElementById('minimumLowerCase');
        this.renderer.removeClass(minimumLowerCase, 'success');
        this.renderer.addClass(minimumLowerCase, 'error');
      }
    }
  }

  checkSpecialCharacterLength(val: string) {
    let specialChars = '<>@!#$%^&*()_+[]{}?:;|\'"\\,./~`-=';
    let count = 0;
    for (let i = 0; i < val.length; i++) {
      if (!specialChars.includes(val[i])) {
        continue;
      }
      count++;
    }
    return count;
  }

  checkDIgitLength(val: string) {
    let digit = /\d/;
    let count = 0;
    for (let i = 0; i < val.length; i++) {
      if (!digit.test(val[i])) {
        continue;
      }
      count++;
    }
    return count;
  }

  checkMinimumUpperOrLowerCase(val: string, upperOrLower: string) {
    let uppercase = upperOrLower === 'upper' ? /^[A-Z]*$/ : /^[a-z]*$/;
    let count = 0;
    for (let i = 0; i < val.length; i++) {
      if (!uppercase.test(val[i])) {
        continue;
      }
      count++;
    }
    return count;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      changes['pwdStrength'] &&
      changes['pwdStrength'].currentValue
    ) {
      this.config = changes['pwdStrength'].currentValue;
    }
  }

  ngAfterViewInit() {
    this.messageDom = this.renderer.createElement('div');
    this.renderer.setProperty(this.messageDom, 'id', 'pwdValidation');
    console.log(this.el.nativeElement.parentNode);
    this.renderer.appendChild(
      this.el.nativeElement.parentNode,
      this.messageDom
    );
    for (const [key, value] of Object.entries(this.config)) {
      if (key === 'length') {
        this.appendText(
          `password length must be ${value} characters in length`,
          key
        );
      } else if (key === 'minimumSpecialCharacter') {
        this.appendText(
          `password must have at-least ${value} special character(s)`,
          key
        );
      } else if (key === 'minimumDIgit') {
        this.appendText(`password must have at-least ${value}  digit(s)`, key);
      } else if (key === 'minimumUpperCase') {
        this.appendText(
          `password must have at-least ${value} uppercase characters`,
          key
        );
      } else if (key === 'minimumLowerCase') {
        this.appendText(
          `password must have at-least ${value} lowercase characters`,
          key
        );
      }
    }
  }

  appendText(textValue: string, idText: string) {
    const small = this.renderer.createElement('small');
    this.renderer.setProperty(small, 'id', idText);
    this.renderer.addClass(small, 'smallPwdCheckMessage');
    const text = this.renderer.createText(textValue);
    this.renderer.appendChild(small, text);
    this.renderer.appendChild(this.messageDom, small);
  }
}
