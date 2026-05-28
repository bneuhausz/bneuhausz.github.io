import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  icon: string;
  iconSvg: string | null;
  iconDescription: string;
  tags: string[];
  date: string;
  shadowColor: string;
}

@Component({
  selector: 'app-blog-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="mx-auto w-full max-w-6xl px-4 pb-8">
      <div
        class="sticky top-0 z-20 -mx-4 mb-8 border-b border-neutral-700 bg-neutral-800/95 px-4 py-4 backdrop-blur"
      >
        <div class="flex flex-wrap items-center justify-center gap-3">
          <label class="input bg-amber-100 text-amber-900">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              class="grow"
              placeholder="Search"
              [(ngModel)]="searchTerm"
              (ngModelChange)="resetPage()"
            />
          </label>

          <select
            class="select bg-amber-100 text-amber-900"
            [(ngModel)]="selectedTag"
            (ngModelChange)="resetPage()"
          >
            <option value="">All tags</option>
            @for (tag of uniqueTags; track tag) {
              <option [value]="tag">{{ tag }}</option>
            }
          </select>

          <select
            class="select bg-amber-100 text-amber-900"
            [(ngModel)]="selectedSort"
            (ngModelChange)="resetPage()"
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>

      @if (paginatedPosts.length === 0) {
        <p class="py-16 text-center opacity-70">No posts match your filters.</p>
      } @else {
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (post of paginatedPosts; track post.slug) {
            <a
              [href]="'/blog/' + post.slug"
              class="flex h-full flex-col rounded-xl border border-neutral-700 bg-neutral p-5 shadow-sm transition-shadow duration-500 hover:border-neutral-500 hover:shadow-{{ post.shadowColor }}"
            >
              <div class="flex items-center gap-4">
                <div
                  class="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-amber-100 p-2"
                >
                  @if (post.iconSvg) {
                    <span class="block size-full [&>svg]:size-full" [innerHTML]="safeSvg(post.iconSvg)"></span>
                  } @else {
                    <img class="size-full object-contain" [src]="post.icon" [alt]="post.iconDescription" />
                  }
                </div>
                <div class="min-w-0 flex-1">
                  <h2 class="line-clamp-2 text-lg font-semibold leading-tight">{{ post.title }}</h2>
                  <p class="mt-1 text-xs uppercase tracking-wide opacity-60">{{ post.date }}</p>
                </div>
              </div>

              <p class="mt-4 line-clamp-3 flex-grow text-sm opacity-80">{{ post.description }}</p>

              <div class="mt-4 flex flex-wrap gap-1.5">
                @for (tag of post.tags; track tag) {
                  <span class="badge badge-sm border-none bg-amber-100 text-amber-900">{{ tag }}</span>
                }
              </div>
            </a>
          }
        </div>

        @if (totalPages > 1) {
          <div class="mt-10 flex items-center justify-center gap-1">
            <button
              class="btn btn-sm bg-amber-100 text-amber-900 disabled:opacity-40"
              [disabled]="currentPage === 1"
              (click)="goToPage(currentPage - 1)"
            >
              Prev
            </button>
            @for (page of pageNumbers; track page) {
              <button
                class="btn btn-sm"
                [class.bg-amber-100]="page === currentPage"
                [class.text-amber-900]="page === currentPage"
                [class.btn-ghost]="page !== currentPage"
                (click)="goToPage(page)"
              >
                {{ page }}
              </button>
            }
            <button
              class="btn btn-sm bg-amber-100 text-amber-900 disabled:opacity-40"
              [disabled]="currentPage === totalPages"
              (click)="goToPage(currentPage + 1)"
            >
              Next
            </button>
          </div>
        }
      }
    </section>
  `,
})
export class BlogFiltersComponent {
  @Input() posts: BlogPostSummary[] = [];

  selectedTag = '';
  selectedSort = 'desc';
  searchTerm = '';
  currentPage = 1;
  readonly pageSize = 9;

  private readonly svgCache = new Map<string, SafeHtml>();
  private readonly sanitizer = inject(DomSanitizer);

  safeSvg(svg: string): SafeHtml {
    let safe = this.svgCache.get(svg);
    if (!safe) {
      safe = this.sanitizer.bypassSecurityTrustHtml(svg);
      this.svgCache.set(svg, safe);
    }
    return safe;
  }

  get uniqueTags(): string[] {
    const allTags = this.posts.flatMap((post) => post.tags);
    return [...new Set(allTags)].sort();
  }

  get filteredPosts(): BlogPostSummary[] {
    const search = this.searchTerm.toLowerCase();
    let posts = [...this.posts].sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return this.selectedSort === 'asc' ? -diff : diff;
    });

    if (this.selectedTag) {
      posts = posts.filter((post) => post.tags.includes(this.selectedTag));
    }

    if (search) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(search) ||
          post.description.toLowerCase().includes(search) ||
          post.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    return posts;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredPosts.length / this.pageSize));
  }

  get paginatedPosts(): BlogPostSummary[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPosts.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  resetPage(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(1, page), this.totalPages);
  }
}
