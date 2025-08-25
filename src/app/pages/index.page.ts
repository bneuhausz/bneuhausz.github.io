import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export const routeMeta: RouteMeta = {
  title: 'bneuhausz.dev',
};

@Component({
  standalone: true,
  template: `
    <section class="flex flex-col sm:flex-row flex-wrap gap-6 w-full sm:w-4/5 my-16 mx-auto justify-center items-center px-8 sm:px-0">
      <div class="card w-full sm:w-96 h-60 bg-neutral text-amber-100 card-xl shadow-sm">
        <div class="card-body items-center">
          <h2 class="card-title">Blog</h2>
          <p>You can read some of my thoughts and notes here</p>
          <div class="card-actions">
            <a class="btn btn-ghost hover:bg-amber-100 hover:text-amber-900" routerLink="/blog">Read More</a>
          </div>
        </div>
      </div>

      <div class="card w-full sm:w-96 h-60 bg-neutral text-amber-100 card-xl shadow-sm">
        <div class="card-body items-center">
          <h2 class="card-title">Newsletter</h2>
          <p>Sign up for my - probably - monthly newsletter to receive updates about new posts and possibly other content</p>
          <div class="card-actions">
            <button class="ml-onclick-form btn btn-ghost hover:bg-amber-100 hover:text-amber-900" onclick="ml('show', 'QIrGIF', true)">Subscribe</button>
          </div>
        </div>
      </div>

      <div class="card w-full sm:w-96 h-60 bg-neutral text-amber-100 card-xl shadow-sm">
        <div class="card-body items-center">
          <h2 class="card-title">About me</h2>
          <p>You can read a bit about me here</p>
          <div class="card-actions">
            <a class="btn btn-ghost hover:bg-amber-100 hover:text-amber-900" routerLink="/about">Read More</a>
          </div>
        </div>
      </div>
    </section>
  `,
  imports: [RouterLink],
})
export default class HomePageComponent { }
