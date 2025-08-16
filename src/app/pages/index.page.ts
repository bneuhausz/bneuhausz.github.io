import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';

export const routeMeta: RouteMeta = {
  title: 'bneuhausz.dev',
};

@Component({
  standalone: true,
  template: ` <h2>Welcome</h2> `,
})
export default class HomePageComponent { }
