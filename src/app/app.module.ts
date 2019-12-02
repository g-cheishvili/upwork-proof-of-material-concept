import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IndexPage} from './pages/index/index.page';
import {AppRoutesModule} from './app.routes.module';
import {NotFoundPage} from './pages/not-found/not-found.page';
import {MatButtonModule, MatDialogModule, MatInputModule, MatListModule} from '@angular/material';
import {ItemsListComponent} from './components/items-list/items-list.component';
import {UiModule} from './modules/ui/ui.module';
import {ItemFormComponent} from './components/item-form/item-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  entryComponents: [
    ItemsListComponent,
    ItemFormComponent,
  ],
  declarations: [
    AppComponent,
    IndexPage,
    NotFoundPage,
    ItemsListComponent,
    ItemFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutesModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    UiModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
