import { Directive, ElementRef, AfterViewInit, Renderer2, inject } from '@angular/core';
import { isBrowser } from '../utils/browser.utils';

@Directive({
  selector: '[appExternalLinks]',
})
export class ExternalLinksDirective implements AfterViewInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    if (!isBrowser()) return;

    const observer = new MutationObserver(() => {
      const anchorElements = this.el.nativeElement.querySelectorAll('a');
      console.log(anchorElements.length);
      if (anchorElements.length === 0) return;

      anchorElements.forEach((a: HTMLAnchorElement) => {
        this.renderer.setAttribute(a, 'target', '_blank');
        this.renderer.setAttribute(a, 'rel', 'noopener noreferrer');
      });

      observer.disconnect();
    });

    observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true,
    });
  }
}
