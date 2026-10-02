# Settings

The widget's configuration dialog has three fields. "Plan" is displayed in the
plan editor, which shows itself when opening the settings; 
the text field behind it is the technical rough version and should not be done by hand.
can be edited. The remaining two fields are directly in the dialog. The
Heading of the plan is not a field of the dialog, but is displayed in the plan editor
(see below). 

| Attribute | Label in Dialog | Description |
| --- | --- | --- |
| 'plan' | Plan | Heading, levels, categories, entries and the start view. Maintained in the plan editor. Default: empty. |
| 'show-today' | Show Today Line | A dark vertical line with "Today" in the axis marks today, if it is in the visible section. Default: on. |
| 'allow-export' | Offer Excel export | Shows readers the **Export** button, which they use to download the entries as an Excel spreadsheet. Default: on. |

## The Plan Editor

The plan editor fills the entire screen. At the top is the header bar, below it
the **Preview** and three tabs. Between Preview and tabs, and between
entry list and form each have a pull handle with which the height of the
and change the width of the list (mouse or arrow keys, 
Double-click restores the default; the browser remembers the sizes). 

### Header

| Control element | Description |
| --- | --- |
| Heading | Stands above the plan and gives the Excel file its name. Optional: Leave blank if the page already has a suitable heading; the file is then called 'Projektplan_JJJJ-MM-TT.xlsx'. |
| "42 / 300 entries" | How many entries the plan carries, measured against the upper limit. |
| "Unsaved Changes" | Appears as soon as the plan in the editor differs from the saved one. |
| Cancel | Closes the editor; in the case of unsaved changes, it asks beforehand whether they should be discarded. |
| Apply | Write the plan in the settings and close the editor. It is saved with the page. |

### Quick view

| Control element | Description |
| --- | --- |
| Preview | The same timeline as on the page, with zoom, without filter and export. Clicking on an entry selects it in the "Entries" tab and brings it into view in the list. Clicking on **Preview** collapses it; unfolded it has the last height drawn. |
| This section as a start view | Saves the visible section of the preview, down to the month, as a view when the page loads. |
| Remove Start View | Deletes the home view; the widget shows the whole plan again when loading. |
| Start with Template | Only if the plan is empty: shows the templates to choose from ("Product Roadmap", "Rescheduling"). Clicking on a card fills the editor with it; **Return** returns without change. |
| Start empty | Only if the plan is empty: create a layer "Level 1". |

### Tab "Entries" 

On the left is the list of entries, sorted by date. Above it are
**Browse entries** and below it a toggle for the type — 
**Milestones**, **Periods**, **Deadlines**, each with number (if active
search: hits); the button **+** next to it creates an entry of this kind, 
and the search works within the species. 
When hovering over a line, a recycle bin appears on the right for deletion (with
Query). 

On the right, the form of the selected entry; above it is its title and
the **Duplicate** and **Delete** buttons, below which are the **General** tabs 
(Type, Title, Description), **Classification** (Level, Category, Series), 
**Date** (date or start and end, for the period arrow at the end, provisional)
**Dependencies** and **Content** (linked page or news post). A
red dot on the tab shows an invalid entry in it; for key dates
Eliminated **Dependencies**: 

| Field | Applies to | Description |
| --- | --- | --- |
| Type | All | Milestone, Period, or Deadline. If you change to the deadline, the level is omitted. |
| Title | All | Mandatory. Written on the entry and in the details. |
| Description | All | Optional, multi-line. Appears only in the details and in the Excel export. |
| Level | Milestone, Period | The level in which the entry is located. **New layer ...** creates one (name) and assigns it immediately. |
| Category | all | Determines the color and for milestones the shape. "Without category" appears gray, milestones as a diamond. **New category ...** creates one (name, color and shape) and assigns it immediately. |
| Date | Milestone, deadline | The date. |
| Start, end | Period | First and last day; both belong to the period. |
| Arrow at the end | Period | The bar ends in an arrowhead — "runs on". |
| Series | Milestone, Period | Entries of the same level with the same series name are on one line. The field expands the series of this level with the number of their entries; a typed new name is taken over via ""..." create as a new series", **No series** takes out the entry. |
| Provisional | all | The date has not yet been set; the entry appears as an outline or with a dashed border. |
| Depends on | Milestone, Period | The predecessors of the entry; on the page as a dashed line with an arrow. |
| Link | all | **None**, **Page** or **News article**. A change breaks an existing link. On the page, the inscription of the entry is then underlined, and a click opens the content in a window above the plan. |
| Page | All | The Staffbase page from the list of pages (the 100 most recently edited). **New page ...** creates it in the Staffbase editor, which overlays the plan editor; after creating it, it is linked. |
| Channel, Post | all | First the news channel (with its type: article, short message, image post), then the post. Drafts are selectable and marked with "(draft)" — readers only see them after publishing. **New post ...** creates one in the selected channel; after saving, it is linked. **Open in new tab** shows the linked content. |
| Attachments | All | Up to ten files or images from the media library, each with optional caption (otherwise the file name). **Add file or image ...** opens the library; **↑**/**↓** arrange, **×** removed. Attachments remain behind the login. On the page, they are next to the linked content or in the details, in the Excel export in the "Attachments" column. |
| Duplicate | All | Create a copy of the entry. |
| Delete | all | Asks for and then removes the entry and all dependencies that point to it; the query names the dependent entries. |

### Layers tab 

| Control element | Description |
| --- | --- |
| New Layer | In the upper right corner of the tab. Create a new layer. |
| Name | The name of the layer, to the left of its orbit. Must be unique. Next to it is how many entries it contains. |
| Up / Down Arrows | Order on the page and in Excel export. |
| Delete | Removes the layer. If it contains entries, the editor asks whether they should be moved to another layer (select **Target Layer**) or whether they should be deleted as well. |

### Tab "Categories" 

| Control element | Description |
| --- | --- |
| New Category | Top right of the tab. Create a new category. |
| Color Field | In front of the name; shows the color. One click expands the twelve colors and the **Hex Value** field; Esc or a click next to it closes. |
| Hex Value | A custom color in the format '#RRGGBB', for example '#E40045'. |
| Shape Button | Next to the color field; shows the shape with which the milestones of the category appear. A click opens the eight shapes: rhombus, triangle, triangle with the tip down, square, circle, hexagon, star or cross. Arrow keys change the shape. |
| Name | The name in the legend and in the details. Must be unique. Next to it is how many entries the category is assigned to. |
| Up / Down Arrows | Order of the legend. |
| Delete | Removes the category; its entries become "without category". The query gives its number. |

## Borders

- A plan has a maximum of **300 entries**, **20 levels** and
  **24 categories**. Beyond that, the editor doesn't accept anything anymore. 
- Appointments are **whole days** without time. The start view is
  **Monthly**. 
- Text is never in the color of the category — bright colors like yellow remained
  otherwise illegible on white. The colour is only carried by the shape, bars and
  legend point; the writing in the bar is black or white, depending on what
  is easier to read. 
- **Without entries, the widget doesn't show anything** — neither an empty frame nor
  a message. 

## Dependencies between settings

- **Show today line** only works if today is in the visible
  excerpt. In the case of a plan that is entirely in the past or
  future, the line can therefore only be seen after it has been moved. 
- The **heading** also determines the name of the Excel file; without
  it only works as a headline. 
- **Heading** and **Home view** are set in the plan editor, not in the
  dialogue; both are part of the plan.