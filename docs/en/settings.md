# Settings

The widget's configuration dialog contains three fields. "Plan" is maintained in the
Plan Editor, which opens automatically when you open the settings;
the text field behind it contains the technical draft and should not be edited
manually. The remaining two fields are located directly in the dialog. The
plan’s title is not a field in the dialog but is maintained in the Plan Editor
(see below).

| Attribute | Label in Dialog | Description |
| --- | --- | --- |
| `plan` | Plan | Heading, layers, categories, entries, and the initial view. Edited in the Plan Editor. Default: empty. |
| `show-today` | Show Today Line | A dark vertical line labeled “Today” on the axis marks the current day, provided it falls within the visible section. Default: on. |
| `allow-export` | Offer Excel Export | Shows readers the **Export** button, which they can use to download the entries as an Excel spreadsheet. Default: on. |

## The Plan Editor

The Plan Editor fills the entire screen. At the top is the header bar, followed by
the **Preview** and three tabs. Between the preview and the tabs, as well as between
the entry list and the form, there is a scroll bar that allows you to adjust the height of the
preview and the width of the list (using the mouse or arrow keys;
double-clicking restores the default settings; the browser remembers the sizes).

### Header Bar

| Control | Description |
| --- | --- |
| Title | Appears above the plan and gives the Excel file its name. Optional: Leave blank if the page already has a suitable title; the file will then be named `Project_Plan_YYYY-MM-DD.xlsx`. |
| “42 / 300 entries” | The number of entries in the plan, relative to the upper limit. |
| “Unsaved changes” | Appears as soon as the plan in the editor differs from the saved version. |
| Cancel | Closes the editor; if there are unsaved changes, it will first ask if you want to discard them. |
| Apply | Saves the plan to the settings and closes the editor. It is saved along with the page. |

### Preview

| Control | Description |
| --- | --- |
| Preview | The same timeline as on the page, with zoom, but without filters or export options. Clicking an entry selects it in the “Entries” tab and brings it into view in the list. Clicking **Preview** collapses it; when expanded, it returns to the last zoomed level. |
| Set this section as the default view | Saves the visible section of the preview, down to the month, as the view when the page loads. |
| Remove Start View | Deletes the start view; the widget displays the entire plan again upon loading. |
| Start with Template | Only if the plan is empty: displays the templates to choose from (“Product Roadmap,” “Schedule Change”). Clicking on a card populates the editor with it; **Back** returns without making any changes. |
| Start Empty | Only when the plan is empty: creates a “Level 1” layer. |

### “Entries” Tab

On the left is the list of entries, sorted by date. Above it is
**Search Entries**, and below it is a toggle for the type—
**Milestones**, **Time Periods**, **Deadlines**, each with a count (when
search: hits); the **+** button next to it creates an entry of that type,
and the search applies within that type.
When you hover over a row, a trash can appears on the right to delete it (with
a confirmation prompt).

On the right is the form for the selected entry; above it are its title and
the **Duplicate** and **Delete** buttons, and below them the tabs **General**
(Type, Title, Description), **Classification** (Level, Category, Series),
**Date** (date or start and end; for time periods, an arrow at the end; Tentative)
**Dependencies**, and **Content** (linked page or news article). A
red dot on a tab indicates an invalid entry within it; for deadlines,
the **Dependencies** field is omitted:

| Field | Applies to | Description |
| --- | --- | --- |
| Type | all | Milestone, time period, or deadline. When switching to a deadline, the level is omitted. |
| Title | all | Required. Appears on the entry and in the details. |
| Description | all | Optional, multi-line. Appears only in the details and in the Excel export. |
| Level | Milestone, Time Period | The level in which the entry is located. **New Level …** creates one (Name) and assigns it immediately. |
| Category | all | Determines the color and, for milestones, the shape. “No Category” appears gray; milestones appear as diamonds. **New Category …** creates one (name, color, and shape) and assigns it immediately. |
| Date | Milestone, Due Date | The date. |
| Start, End | Time Period | First and last day; both are part of the time period. |
| Arrow at the end | Time Period | The bar ends in an arrowhead — “continues.” |
| Series | Milestone, Time Period | Entries on the same level with the same series name appear on a single line. The field expands the series on this level to show the number of entries; a new name typed in is accepted via “Create as new series using ‘…’”; **No Series** removes the entry. |
| Tentative | All | The date has not yet been set; the entry appears as an outline or with a dashed border. |
| Depends on | Milestone, Time Period | The entry’s predecessors; displayed on the page as a dashed line with an arrow. |
| Link | All | **None**, **Page**, or **News Article**. Changing a link breaks an existing one. On the page, the entry’s label is then underlined, and clicking it opens the content in a window above the plan. |
| Page | all | The Staffbase page from the list of pages (the 100 most recently edited). **New Page…** creates it in the Staffbase Editor, which overlays the plan editor; once created, it is linked. |
| Channel, Post | All | First the news channel (with its type: article, short news item, image post), then the post. Drafts are selectable and marked with “(Draft)”—readers won’t see them until they’re published. **New Post …** creates one in the selected channel; once saved, it is linked. **Open in New Tab** displays the linked content. |
| Attachments | all | Up to ten files or images from the media library, each with an optional caption (otherwise the file name). **Add file or image …** opens the library; **↑**/**↓** reorder, **×** removes. Attachments are retained after logging out. On the page, they appear next to the linked content or in the details; in the Excel export, they appear in the “Attachments” column. |
| Duplicate | all | Creates a copy of the entry. |
| Delete | all | Prompts for confirmation and then removes the entry and all dependencies that point to it; the confirmation prompt lists the dependent entries. |

### “Layers” Tab

| Control | Description |
| --- | --- |
| New Level | Top right of the tab. Creates a new level. |
| Name | The name of the level, to the left of its track. Must be unique. Next to it is the number of entries it contains. |
| Up/Down Arrows | Order on the page and in the Excel export. |
| Delete | Removes the level. If it contains entries, the editor asks whether these should be moved to another level (select **Target Level**) or deleted along with the level. |

### “Categories” Tab

| Control | Description |
| --- | --- |
| New Category | Top right of the tab. Creates a new category. |
| Color Swatch | Before the name; displays the color. Clicking it expands the twelve colors and the **Hex Value** field; pressing Esc or clicking next to it closes it. |
| Hex Value | A custom color in the format `#RRGGBB`, for example `#E40045`. |
| Shape button | Next to the color field; displays the shape used for the category’s milestones. Clicking it reveals the eight shapes: diamond, triangle, downward-pointing triangle, square, circle, hexagon, star, or cross. Use the arrow keys to switch between shapes. |
| Name | The name in the legend and in the details. Must be unique. Next to it is the number of entries assigned to the category. |
| Up/Down Arrows | Order in the legend. |
| Delete | Removes the category; its entries become “uncategorized.” The tooltip displays the number of entries. |

## Limits

- A plan can contain a maximum of **300 entries**, **20 levels**, and
  **24 categories**. The editor will not accept anything beyond these limits.
- Appointments are **full days** without a time. The default view is
  **by month**.
- Text is never displayed in the category’s color—light colors like yellow would otherwise
  be unreadable on a white background. Only the shape, the bar, and
  the legend marker are colored; the text within the bar is black or white, depending on which
  is more readable.
- **Without entries, the widget displays nothing**—neither an empty frame nor
  a message.

## Dependencies Between Settings

- **Show Today Line** only works if today’s date is within the visible
  section. For a plan that lies entirely in the past or
  future, the line will therefore only be visible after moving the view.
- The **Heading** also determines the name of the Excel file; if
  export is not enabled, it functions only as a heading.
- **Heading** and **Initial View** are set in the Plan Editor, not in the
  dialog; both are part of the plan.
