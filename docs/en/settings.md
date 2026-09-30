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

The plan editor consists of the **Heading** field, the **Preview** and
three tabs. At the top right is how many entries the map carries, for the
Example "42 / 300 entries". 

### Heading

| Field | Description |
| --- | --- |
| Heading | At the top of the plan editor. Stands above the plan and gives the Excel file its name. Optional: Leave blank if the page already has a suitable heading; the file will then be called 'Projektplan_JJJJ-MM-TT.xlsx'. |

### Quick view

| Control element | Description |
| --- | --- |
| Preview | The same timeline as on the page, with zoom, without filters and export. Clicking on an entry selects it in the "Entries" tab. Can be collapsed. |
| This section as a start view | Saves the visible section of the preview, down to the month, as a view when the page loads. |
| Remove Start View | Deletes the home view; the widget shows the whole plan again when loading. |
| Start with Sample Plan | Only when the plan is empty: fills the editor with a heading, three levels, seven categories, and example entries. |

### Tab "Entries" 

On the left the list of all entries, sorted by date and via **Entries
browse** searchable; above that, under **Add**, a button for
**Milestone**, **Period** and **Deadline**. On the right, the form of the
selected entry: 

| Field | Applies to | Description |
| --- | --- | --- |
| Type | All | Milestone, Period, or Deadline. If you change to the deadline, the level is omitted. |
| Title | All | Mandatory. Written on the entry and in the details. |
| Description | All | Optional, multi-line. Appears only in the details and in the Excel export. |
| Level | Milestone, Period | The level in which the entry is located. |
| Category | All | Determines the color. "Without category" appears gray. |
| Date | Milestone, deadline | The date. |
| Start, end | Period | First and last day; both belong to the period. |
| Symbol | Milestone | Rhombus (default), triangle, square or circle. |
| Arrow at the end | Period | The bar ends in an arrowhead — "runs on". |
| Series | Milestone, Period | Entries of the same level with the same series name are on a line. The field suggests the series of this level. |
| Provisional | all | The date has not yet been set; the entry appears as an outline or with a dashed border. |
| Depends on | Milestone, Period | The predecessors of the entry; on the page as a dashed line with an arrow. |
| Duplicate | All | Create a copy of the entry. |
| Delete | All | Removes the entry and any dependencies pointing to it. |

### Layers tab 

| Control element | Description |
| --- | --- |
| New Layer | Create a new layer. |
| Name | The name of the layer, to the left of its orbit. Next to it is how many entries it contains. |
| Up / Down Arrows | Order on the page and in Excel export. |
| Delete | Removes the layer. If it contains entries, the editor asks whether they should be moved to another layer (select **Target Layer**) or whether they should be deleted as well. |

### Tab "Categories" 

| Control element | Description |
| --- | --- |
| New Category | Create a new category. |
| Name | The name in the legend and in the details. |
| Color | One of twelve color fields. |
| Hex Value | A custom color in the format '#RRGGBB', for example '#E40045'. |
| Up / Down Arrows | Order of the legend. |
| Delete | Removes the category; its entries become "without category". The query gives its number. |

## Borders

- A plan has a maximum of **300 entries**, **20 levels** and
  **24 categories**. Beyond that, the editor doesn't accept anything anymore. 
- Appointments are **whole days** without time. The start view is
  **Monthly**. 
- Text is never in the color of the category — bright colors like yellow remained
  otherwise unreadable on white. The colour is only carried by the symbol, bar and
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