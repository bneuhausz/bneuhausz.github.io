import { Directive, ElementRef, AfterViewInit, Renderer2, inject } from '@angular/core';
import { isBrowser } from '../utils/browser.utils';

@Directive({
  selector: '[appCodeCopyButton]',
})
export class CodeCopyButtonDirective implements AfterViewInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    if (!isBrowser()) return;

    const observer = new MutationObserver(() => {
      const preElements = this.el.nativeElement.querySelectorAll('pre');
      if (preElements.length === 0) return;

      preElements.forEach((pre: HTMLPreElement) => {
        if (pre.querySelector('button')) return;

        this.renderer.setAttribute(pre, 'class', 'relative pt-8');

        const button = this.renderer.createElement('button');
        this.renderer.setAttribute(
          button,
          'class',
          'btn btn-xs btn-ghost absolute top-1 right-2 z-10'
        );
        this.renderer.setProperty(button, 'textContent', 'Copy');

        this.renderer.appendChild(pre, button);

        this.renderer.listen(button, 'click', () => this.handleCopyButtonClick(pre, button));
      });

      observer.disconnect();
    });

    observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true,
    });
  }

  private handleCopyButtonClick(pre: HTMLPreElement, button: HTMLButtonElement): void {
    const code = pre.querySelector('code')?.textContent ?? '';
    navigator.clipboard.writeText(code);
    button.textContent = 'Copied!';
    this.resetButtonText(button);
  }

  private resetButtonText(button: HTMLButtonElement): void {
    setTimeout(() => {
      button.textContent = 'Copy';
    }, 2000);
  }
}
