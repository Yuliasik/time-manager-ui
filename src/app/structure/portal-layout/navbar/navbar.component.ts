import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpService } from "../../../shared/services/http.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService
  ) {
  }

  ngOnInit(): void {}

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getUsername(): string{
    return  sessionStorage.getItem('username')!
  }

  onLogoutClick() {
    this.http.get("/api/logout").subscribe(() => {
      sessionStorage.removeItem('token')
      this.router.navigate(['/greeting'], {relativeTo: this.route.root})
    })
  }
}
