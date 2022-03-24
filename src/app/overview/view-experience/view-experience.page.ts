import { Component, OnInit } from '@angular/core';
import { CEExperience } from 'src/app/models/experience';
import { ExperienceService } from 'src/app/services/experience.service';

@Component({
  selector: 'app-view-experience',
  templateUrl: './view-experience.page.html',
  styleUrls: ['./view-experience.page.scss'],
})
export class ViewExperiencePage implements OnInit {

  /**
   * List of ce.
   */
  public currentCE: CEExperience[] = [];

  constructor(private experienceService: ExperienceService) { }

  /**
   * On init.
   */
  public ngOnInit(): void {
    this.currentCE = this.experienceService.fetchExperiences(2022);
  }

}
