# Settings

The Staffbase configuration dialog contains only the “Plan” field. It is maintained in the
Plan Editor, which opens automatically when you open the Settings;
the text field behind it contains the technical raw data and should not be edited
manually. The former fields **Show Today Line** and
**Offer Excel Export** are hidden in the dialog and can be found in the
Plan Editor under **Settings**; their values are stored in the plan. A block that
was never moved in the editor retains what it previously displayed. The
plan’s heading is also not a field in the dialog, but is maintained in the Plan Editor
.

| Attribute | Label | Description |
| --- | --- | --- |
| `plan` | Plan | Header, levels, categories, entries, initial view, and the toggles for Today Line and Export. Managed in the Plan Editor. Default: empty. |
| `show-today` | Show Today Line | Now only a fallback for plans that do not have the toggle. In the editor, under **Settings** as **Show Today Line**: A dark vertical line labeled “Today” on the axis marks the current day, provided it falls within the visible section. Default: on. |
| `allow-export` | Offer Excel Export | Now only available as a fallback option, as above. In the editor, under **Offer Excel Export**: Shows readers the **Export** button, which they can use to download the entries as an Excel spreadsheet. Default: on. |

## The Plan Editor

The Plan Editor fills the entire screen. At the top is the header of the
shared frame; below it, on the left, are the **entries**; in the middle is the
form for the selected entry; and on the right is the **Plan** panel.

### Header

| Control | Description |
| --- | --- |
| Editor · Desktop · Tablet · Mobile | **Editor** displays the form. The device views show the plan at device width instead—the same view as on the page, with zoom, without filters or export; clicking an entry selects it. |
| Status | “3 entries changed · Layers”—which differs from the last saved state. An entry missing a layer prevents the changes from being saved. |
| Undo / Redo | Undo or redo changes step by step (⌘/Ctrl Z, ⇧⌘/Ctrl Z). |
| Help | Explains how to use the editor (F1). |
| Cancel | Closes the editor; if there are unsaved changes, it asks beforehand whether to discard them. |
| Save | Saves the plan to the settings (⌘/Ctrl S); **Save and Close** is also available with ⌘/Ctrl ↵. It is saved along with the page. |

### “Entries” Sidebar

On the left is the list of entries, sorted by date, with the number (“12 of
300”). **New** creates a **milestone**, **time period**, or **due date**;
without a level, only the due date is available. Below that are **Search Entries** and
the type selection (**All Types**, **Milestones**, **Time Periods**,
**Deadlines**, each with a count; when search is active: results).

### Entry Form

Above the form are “Entry 4 of 12,” the type, and the buttons **Duplicate entry**
and **Delete entry**; below that are the tabs **General**
(Type, Title, Description, Draft), **Classification** (Level, Category,
Series), **Date** (Date or Start and End; for time periods, an arrow at the end),
**Dependencies**, and **Content** (linked page or news article,
attachments). “(Error)” after a tab indicates an invalid entry in that tab;
for due dates, the **Dependencies** tab is omitted:

| Field | Applies to | Description |
| --- | --- | --- |
| Type | all | Milestone, time period, or deadline. When switching to a deadline, the level is omitted. Without a level, a deadline remains a deadline. |
| Title | all | Required. Appears on the entry and in the details. |
| Description | all | Optional, multi-line. Appears only in the details and in the Excel export. |
| Tentative | all | The date has not yet been set; the entry appears as an outline or with a dashed border. |
| Level | Milestone, Time Period | The level in which the entry is located. **New Level …** creates one (Name) and assigns it immediately. |
| Category | All | Determines the color and, for milestones, the shape. “No Category” appears gray; milestones appear as diamonds. **New Category…** creates one (name, color, and shape) and assigns it immediately. |
| Series | Milestone, Time Period | Entries on the same level with the same series name appear on the same row. The field expands the series on this level to show the number of entries; a new name typed in is accepted via “Create new series as ‘…’,” and **No Series** removes the entry. |
| Date | Milestone, Reference Date | The date. |
| Start, End | Time Period | First and last day; both are part of the time period. |
| Arrow at the end | Time Period | The bar ends in an arrowhead — “continues.” |
| Depends on | Milestone, Time Period | The entry’s predecessors; displayed on the page as a dashed line with an arrow. |
| Link | All | **None**, **Page**, or **News Post**. A change breaks an existing link. On the page, the entry’s label is then underlined, and clicking it opens the content in a window above the plan. |
| Page | all | The Staffbase page from the list of pages (the 100 most recently edited). **New Page …** creates it in the Staffbase Editor, which overlays the map editor; once created, it is linked. |
| Channel, Post | all | First the news channel (with its type: article, short news item, image post), then the post. Drafts can be selected and are marked with “(Draft)”—readers won’t see them until they’re published. **New Post …** creates one in the selected channel; once saved, it is linked. **Open in a new tab** displays the linked content. |
| Attachments | all | Up to ten files or images from the media library, each with an optional caption (otherwise the file name). **Add file or image …** opens the library; the arrows reorder them, the X removes them. Attachments are retained after logging out. On the page, they appear next to the linked content or in the details; in the Excel export, they appear in the “Attachments” column. |
| Duplicate entry | all | Creates a copy of the entry. |
| Delete entry | all | Prompts for confirmation and then removes the entry and all dependencies that reference it; the confirmation prompt lists the dependent entries. |

### “Plan” Panel: Settings

| Control | Description |
| --- | --- |
| Plan Title | Appears above the plan and gives the Excel file its name. Optional: Leave blank if the page already has a suitable heading; the file will then be named `ProjectPlan_YYYY-MM-DD.xlsx`. |
| Show Today Line | Toggle switch, see above. As long as it has never been toggled in the editor, it indicates that the block retains its previous setting. |
| Offer Excel Export | Toggle switch, see above; same as above. |
| Apply this section | Saves the visible section of the preview (Desktop, Tablet, or Mobile view), down to the month, as the view when the page loads. Disabled if no section is selected. |
| Remove Start View | Deletes the start view; the widget will display the entire plan again upon loading. |
| Start with Template | Only when the plan is empty, in the center: displays the templates to choose from (“Product Roadmap,” “Schedule Change”). Clicking a card fills the editor with it; **Back** returns without making any changes. This option is not available on a plan with entries—the template would replace them. |
| Start from scratch | Only when the plan is empty: creates a layer named “Layer 1.” |

### “Plan” Panel: Layers

| Control | Description |
| --- | --- |
| New Layer | Creates a new layer. |
| Name | The name of the layer, to the left of its track. Must be unique. Below it is the number of entries it contains. |
| Up/Down Arrows | Order on the page and in the Excel export. |
| Delete | Removes the layer. If it contains entries, the editor asks whether these should be moved to another layer (select **Target Layer**) or deleted along with the layer. |

### “Plan” Panel: Categories

| Control | Description |
| --- | --- |
| New Category | Creates a new category. |
| Color Swatch | Before the name; displays the color. Clicking it expands the twelve colors and the **Hex Value** field; pressing Esc or clicking next to it closes it. |
| Hex Value | A custom color in the format `#RRGGBB`, for example `#E40045`. |
| Shape Button | Next to the color field; displays the shape used for the category’s milestones. Clicking it reveals the eight shapes: diamond, triangle, downward-pointing triangle, square, circle, hexagon, star, or cross. Use the arrow keys to switch between shapes. |
| Name | The name displayed in the legend and in the details. Must be unique. Below it, the number of entries assigned to the category is shown. |
| Up/Down Arrows | Order in the legend. |
| Delete | Removes the category; its entries become “uncategorized.” The tooltip displays the number of entries. |

## Limits

- A plan can contain a maximum of **300 entries**, **20 levels**, and
  **24 categories**. The editor will not accept anything beyond these limits.
- Dates are **full days** without a time. The default view is
  **by month**.
- Text is never displayed in the category’s color—light colors like yellow would otherwise
  be unreadable on a white background. Only the shape, bar, and
  legend marker are colored; the text within the bar is black or white, depending on which
  is more readable.
- **Without entries, the widget displays nothing**—neither an empty frame nor
  a message.

## Dependencies Between Settings

- **Show Today Line** only works if today’s date is within the visible
  section. For a schedule that lies entirely in the past or
  future, That is why the line is only visible after it has been moved.
- The **heading** also determines the name of the Excel file; unless
  export is enabled, it functions only as a heading.
- **Plan Title**, **Start View**, **Today Line**, and **Export** are set in the
  Plan Editor, not in the dialog; they are all part of the plan.
