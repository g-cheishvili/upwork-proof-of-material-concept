import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexPage} from './pages/index/index.page';
import {NotFoundPage} from './pages/not-found/not-found.page';

const routes: Routes = [
  {
    path: '',
    component: IndexPage
  },
  {
    path: '**',
    component: NotFoundPage,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutesModule {
}
