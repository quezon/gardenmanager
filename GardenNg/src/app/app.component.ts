import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NavItem } from './nav-item';
import { NavService } from './nav.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav', {static: false}) appDrawer: ElementRef;
  title = 'GardenNg';
  displayedName;
  options;
  navItems: NavItem[] = [
    {
      displayName: 'Chemical',
      iconName: 'new',
      route: 'Chemical',
    },
    {
      displayName: 'Garden Tool',
      iconName: 'new',
      route: 'GardenTool',
    },
    {
      displayName: 'Plant',
      iconName: 'new',
      route: 'Plant',
    },
    {
      displayName: 'Planting Material',
      iconName: 'new',
      route: 'PlantingMaterial',
    },
    {
      displayName: 'Storage',
      iconName: 'new',
      route: 'Storage',
    },
    {
      displayName: 'Unit of Measure',
      iconName: 'new',
      route: 'UnitOfMeasure',
    },
    {
      displayName: 'Work Performed',
      iconName: 'new',
      route: 'WorkPerformed',
    },
  ]

  constructor(private navService: NavService, 
    private activatedroute:ActivatedRoute,
    private router: Router) {
    this.options = {
      bottom: 0,
      fixed: false,
      top: 10
    };
  }

  ngOnInit() {
    this.router.events.subscribe((res) => { 
      this.navItems.forEach(val => {
        if (val.route == this.router.url.replace("/","")) {
          this.displayedName = val.displayName;
        } 
      })
    });
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
}
