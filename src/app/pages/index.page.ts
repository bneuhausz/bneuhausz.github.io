import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export const routeMeta: RouteMeta = {
  title: 'bneuhausz.dev',
};

@Component({
  standalone: true,
  template: `
    <section class="flex flex-row gap-8 w-4/5 my-16 mx-auto justify-center">
      <div class="card w-96 bg-slate-500 card-xl shadow-sm">
        <div class="card-body items-center">
          <h2 class="card-title">Blog</h2>
          <p>You can read some of my thoughts and notes here</p>
          <div class="card-actions">
            <a class="btn btn-ghost" routerLink="/blog">Read More</a>
          </div>
        </div>
      </div>

      <div class="card w-96 bg-slate-500 card-xl shadow-sm">
        <div class="card-body items-center">
          <h2 class="card-title">About me</h2>
          <p>You can read a bit about me here</p>
          <div class="card-actions">
            <a class="btn btn-ghost" routerLink="/about">Read More</a>
          </div>
        </div>
      </div>
    </section>
  `,
  imports: [RouterLink],
})
export default class HomePageComponent { }
