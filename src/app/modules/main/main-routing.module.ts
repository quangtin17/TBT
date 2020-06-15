import { NgModule, InjectionToken } from '@angular/core';
import {
  Routes,
  RouterModule,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGuard } from '../@core/guards/auth.guard';

import {
  TestComponent,
  HomeComponent,
  BookmarkComponent,
  CountryComponent,
  CountryListComponent,
  CollectionComponent,
  CollectionStoriesTabComponent,
  CollectionExperiencesTabComponent,
  CollectionAllComponent,
  JourneyComponent,
  JourneyInfoComponent,
  JourneyStoryComponent,
  WeekendOfGoodComponent,
  MeetComponent,
  SearchComponent,
  TermsAndConditionsComponent,
  PrivacyPolicyComponent,
  FAQComponent,
  ExperienceComponent,
  BookmarkDetailComponent,
  BookmarkDetailExperienceComponent,
  BookmarkDetailStoryComponent,
  NotFoundComponent,
  ForbiddenErrorComponent,
  TravellerManifestoComponent
} from './views';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'bookmark-list',
        component: BookmarkComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'bookmark-detail/:alias',
        component: BookmarkDetailComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'stories',
            pathMatch: 'full'
          },
          {
            path: 'stories',
            component: BookmarkDetailStoryComponent
          },
          {
            path: 'experiences',
            component: BookmarkDetailExperienceComponent
          }
        ]
      },
      {
        path: 'all-countries',
        component: CountryListComponent
      },
      {
        path: 'all-countries/:alias',
        component: CountryComponent
      },
      {
        path: 'travel-inspiration',
        component: CollectionAllComponent
      },
      {
        path: 'travel-inspiration/:alias',
        component: CollectionComponent,
        children: [
          {
            path: '',
            redirectTo: 'stories',
            pathMatch: 'full'
          },
          {
            path: 'stories',
            component: CollectionStoriesTabComponent
          },
          {
            path: 'experiences',
            component: CollectionExperiencesTabComponent
          }
        ]
      },

      {
        path: 'story/journey/:alias',
        component: JourneyComponent,
        children: [
          {
            path: '',
            redirectTo: 'story',
            pathMatch: 'full'
          },
          {
            path: 'story',
            component: JourneyStoryComponent
          },
          {
            path: 'info',
            component: JourneyInfoComponent
          }
        ]
      },
      {
        path: 'story/weekend-of-good/:alias',
        component: WeekendOfGoodComponent
      },
      {
        path: 'story/meet/:alias',
        component: MeetComponent
      },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'terms',
        component: TermsAndConditionsComponent
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'faqs',
        component: FAQComponent
      },
      {
        path: 'experience/:alias',
        component: ExperienceComponent
      },
      {
        path: 'test',
        component: TestComponent
      },
      {
        path: 'not-found',
        component: NotFoundComponent
      },
      {
        path: 'forbidden',
        component: ForbiddenErrorComponent
      },
      {
        path: 'manifesto',
        component: TravellerManifestoComponent
      }
    ]
  },
  {
    path: 'api/admin/login',
    resolve: {
      url: externalUrlProvider
    },
    // We need a component here because we cannot define the route otherwise
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: externalUrlProvider,
      useValue: (route: ActivatedRouteSnapshot) => {
        // const externalUrl = route.paramMap.get('externalUrl');
        // window.open(externalUrl, '_self');
        window.open('https://leads.ourbetterworld.org/user/login', '_self');
      }
    }
  ]
})
export class MainRoutingModule {}
