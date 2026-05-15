import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  icon: string;
  iconDescription: string;
  tags: string[];
  date: string;
}

@Component({
  selector: 'app-blog-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="w-3/5 mx-auto my-5">
      <div class="flex justify-center mb-4 gap-4 flex-wrap">
        <select
          class="select bg-amber-100 text-amber-900"
          [(ngModel)]="selectedTag"
        >
          <option value="">All Tags</option>
          @for (tag of uniqueTags; track tag) {
            <option [value]="tag">{{ tag }}</option>
          }
        </select>

        <select
          class="select bg-amber-100 text-amber-900"
          [(ngModel)]="selectedSort"
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>

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
          />
        </label>
      </div>

      @for (post of filteredPosts; track post.slug) {
        <ul class="list bg-neutral rounded-box shadow-md">
          <li>
            <a
              class="list-row pb-4 border-b border-amber-100 cursor-pointer hover:bg-neutral-900 transition duration-500"
              [href]="'/blog/' + post.slug"
            >
              <div>
                <img class="size-10 rounded-box bg-amber-100" [src]="post.icon" [alt]="post.iconDescription" />
              </div>
              <div>
                <div>{{ post.title }}</div>
                <div class="text-xs uppercase font-semibold opacity-60 mb-1">{{ post.date }}</div>
                @for (tag of post.tags; track tag) {
                  <div class="badge bg-amber-100 text-amber-900 mx-1 mb-1 md:mb-0">{{ tag }}</div>
                }
              </div>
              <p class="list-col-wrap text-xs">
                {{ post.description }}
              </p>
            </a>
          </li>
        </ul>
      }
    </section>
  `,
})
export class BlogFiltersComponent {
  @Input() posts: BlogPostSummary[] = [];

  selectedTag = '';
  selectedSort = 'desc';
  searchTerm = '';

  get uniqueTags(): string[] {
    const allTags = this.posts.flatMap((post) => post.tags);
    const unique = [...new Set(allTags)];
    return unique.sort();
  }

  get sortedPosts(): BlogPostSummary[] {
    return [...this.posts].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }

  get filteredPosts(): BlogPostSummary[] {
    const tag = this.selectedTag;
    const sort = this.selectedSort;
    const search = this.searchTerm.toLowerCase();
    let posts = sort === 'asc' ? [...this.sortedPosts].reverse() : [...this.sortedPosts];

    if (tag) {
      posts = posts.filter((post) => post.tags.includes(tag));
    }

    if (search) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(search) ||
          post.description.toLowerCase().includes(search) ||
          post.tags.some((postTag) => postTag.toLowerCase().includes(search))
      );
    }

    return posts;
  }
}
