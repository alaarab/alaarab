import type { ComponentType } from "react";
import { AlmanacHome } from "./almanac/Home";
import { AlmanacProject } from "./almanac/Project";
import { EmbroideryHome } from "./embroidery/Home";
import { EmbroideryProject } from "./embroidery/Project";
import { FolioHome } from "./folio/Home";
import { FolioProject } from "./folio/Project";
import { HillsideHome } from "./hillside/Home";
import { HillsideProject } from "./hillside/Project";
import { InkwashHome } from "./inkwash/Home";
import { InkwashProject } from "./inkwash/Project";
import { LedgerHome } from "./ledger/Home";
import { LedgerProject } from "./ledger/Project";
import { LetterHome } from "./letter/Home";
import { LetterProject } from "./letter/Project";
import { MapHome } from "./map/Home";
import { MapProject } from "./map/Project";
import { RackHome } from "./rack/Home";
import { RackProject } from "./rack/Project";
import { SpecimensHome } from "./specimens/Home";
import { SpecimensProject } from "./specimens/Project";
import { TransitHome } from "./transit/Home";
import { TransitProject } from "./transit/Project";
import { WoodcutHome } from "./woodcut/Home";
import { WoodcutProject } from "./woodcut/Project";
import { WorkshopHome } from "./workshop/Home";
import { WorkshopProject } from "./workshop/Project";

/** Home and project-page components for every prototype, keyed by lab path segment. */
export const labPages: Record<string, { Home: ComponentType; Project: ComponentType }> = {
  hillside: { Home: HillsideHome, Project: HillsideProject },
  folio: { Home: FolioHome, Project: FolioProject },
  embroidery: { Home: EmbroideryHome, Project: EmbroideryProject },
  specimens: { Home: SpecimensHome, Project: SpecimensProject },
  letter: { Home: LetterHome, Project: LetterProject },
  map: { Home: MapHome, Project: MapProject },
  inkwash: { Home: InkwashHome, Project: InkwashProject },
  woodcut: { Home: WoodcutHome, Project: WoodcutProject },
  workshop: { Home: WorkshopHome, Project: WorkshopProject },
  almanac: { Home: AlmanacHome, Project: AlmanacProject },
  rack: { Home: RackHome, Project: RackProject },
  ledger: { Home: LedgerHome, Project: LedgerProject },
  transit: { Home: TransitHome, Project: TransitProject },
};
