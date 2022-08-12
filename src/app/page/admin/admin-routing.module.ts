import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminGuard } from 'src/app/admin.guard'
import { AccountComponent } from './account/account.component'
import { DashboardComponent } from './dashboard/dashboard.component'

const adminRoutes: Routes = [
  { path: '', canActivateChild: [AdminGuard], children: [
    { path: '', component: DashboardComponent },
    { path: '', component: AccountComponent}
  ]}
]

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
