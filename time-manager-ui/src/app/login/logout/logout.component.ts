import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpService } from "../../services/http.service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService) {
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  onLogoutClick() {
    this.http.get("/api/logout").subscribe(() => {
      sessionStorage.removeItem('token')
      this.router.navigate(['/login'], {relativeTo: this.route.root})
    })
  }
}
