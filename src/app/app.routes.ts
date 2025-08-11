import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { AbmComponent } from './abm/abm.component';
import { DailyChallengeComponent } from './daily-challenge/daily-challenge.component';

export const routes: Routes = [
  {
    "path": "",
    "component":HomeComponent
},
{
  "path": "reset-password/:token",
  "component": ResetPassComponent
},
{
  "path": "abm",
  "component": AbmComponent
},
{
  "path": "daily-challenge",
  "component": DailyChallengeComponent
}
];