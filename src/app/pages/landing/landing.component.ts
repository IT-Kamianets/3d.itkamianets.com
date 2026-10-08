import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {  } from '@wawjs/ngx-translate';
import { TrPipe } from '../../shared/translate/tr.pipe';
import {
	catalogConstructors,
	catalogPackages,
	GITHUB_ORG_URL,
	repoUrl,
} from '../../feature/catalog/catalog.data';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { RoomScanComponent } from '../../shared/room-scan/room-scan.component';

@Component({
	imports: [RouterLink, IconComponent, CodeBlockComponent, RoomScanComponent, TrPipe],
	templateUrl: './landing.component.html',
})
export class LandingComponent {
	protected readonly packages = catalogPackages;
	protected readonly constructors = catalogConstructors;
	protected readonly orgUrl = GITHUB_ORG_URL;
	protected readonly coreUrl = `${repoUrl('3d-unity-core')}.git`;

	/** An excerpt of a real object from the 3d-scene-schema v1 room-scan example. */
	protected readonly schemaExcerpt = `{
  "id": "anchor_door_entry",
  "type": "DOOR_FRAME",
  "parentId": "anchor_wall_north",
  "transform": {
    "position": { "x": 1.5, "y": 0, "z": -3.0 }
  },
  "boundary": [ … ]
}`;
}
