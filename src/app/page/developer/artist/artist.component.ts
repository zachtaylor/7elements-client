import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'vii-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.less']
})
export class ArtistComponent implements OnInit {

  artists = []

  constructor(
    public glob : GlobalService,
  ) { }

  private addArtist(name: string, art: number[], link: string) {
    this.artists.push({
      name:name,
      art:art,
      link:link
    })
  }

  ngOnInit(): void {
    this.addArtist('Zach Taylor', [1,2,6,7,9,12,13,14,15,16,17,19,20,21,22,27], '')
    this.addArtist('Leah Gayle', [8,10,11,24,25], '')
    this.addArtist('Joshua Rafferty', [3,4,5], '')
    this.addArtist('Devon Smith', [23,28], '')
  }

}
