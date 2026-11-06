# Project Plan

This widget displays a project plan as a **timeline**—such as the schedule
for a vehicle launch, including trade shows, series production starts (SOPs), and
project milestones spanning several years. It replaces the PowerPoint slide
that was previously used for such plans and embedded as an image: The plan
is displayed directly on the page, can be edited at any time, and readers
can explore it themselves, filter it, and download it as an Excel spreadsheet.

The entire plan is managed in the **Plan Editor**, which appears automatically when you open the
settings.

## What a plan consists of

- **Heading** — optional; appears above the plan and gives the Excel file
  its name.
- **Levels** — horizontal rows arranged one below the other, such as “Messen,”
  “Launches / SOPs,” and “Project Milestones.” Their titles appear on the left.
- **Categories** — assign colors to the entries and appear as a legend
  above the plan, for example, “MY26 TG Assist” in purple.
- **Entries** come in three types:
  - **Milestone** — a single date, shown as an icon (diamond,
    triangle, square, or circle) with the title below it.
  - **Time Period** — a bar from start to end, optionally with an
    arrowhead at the end to indicate “ongoing.”
  - **Deadline** — a date that applies to all levels, such as a new
    regulation. It appears as a dashed vertical line running through the entire
    plan, with the title below it.
- **Series** — Milestones and time periods at the same level with the same
  series name appear on a shared line. If a time period is part of the series,
  the milestones are placed on its bar; otherwise, a narrow
  line connects the first to the last.
- **Dependencies** — Dotted lines with arrows from the predecessor to the
  successor, for example, from “C4S” to the corresponding SOP.
- **Tentative** — an entry whose date has not yet been set. It
  appears only as an outline or lightly shaded with a dashed border.

## What Readers See

From top to bottom:

1. **Heading** (if set) and **“As of …”** — the date of the last
   change to the plan, in the date format of the page language.
2. **Toolbar** — Search, **Filter**, Zoom (**−**, **+**, **Show All
  **), the **Timeline | List** toggle, **Export**,
   **Full Screen**, and **Help**.
3. **Legend** — the categories and their colors. Clicking hides or
   shows a category.
4. **The Plan** — on the left, the layer titles; on the right, the timeline with the
   entries; below the last layer, the titles of the key dates. The arrow next to the
   title collapses a layer; **Collapse All** above the titles collapses
   all layers at once and then expands them again.
5. **Overview** — a narrow strip spanning the entire time period. A border
   indicates which section is currently visible.

Additionally:

- **Zooming** is continuous: use the **−** and **+** buttons, hold down the
  Ctrl key (Mac: ⌘) and use the mouse wheel, or use two fingers on the trackpad or
  touchscreen. The axis switches from years to quarters and months to
  calendar weeks and individual days.
- **Scrolling** is done by dragging with the mouse, using Shift and the mouse wheel,
  by swiping horizontally, or by dragging the frame in the overview.
- **Clicking an entry** opens its details: type and date,
  category, level, series, description, as well as predecessor and successor.
- **Filters** and **search** apply only to your own session; nothing is saved or
  shared with others.
- **List** displays the same entries as a table, sorted by date—the
  more convenient option for screen readers, narrow screens, and printing.
- **Export** downloads the entries as an Excel file, provided that
  exporting is enabled in the settings.
- A dark line labeled **“Today”** highlights today’s date, provided that
  the feature is enabled and the date is within the visible section.
- You can navigate without a mouse: Press Tab to jump to the schedule, use the
  arrow keys to switch between entries, press Enter to open the details,
  **+** and **−** to zoom, and **0** to show everything.
- On narrow screens (less than 768 pixels wide), the schedule starts in the
  **List** view—as cards instead of a table, because the timeline doesn’t take up any
  width there; the toggle in the **More** menu takes you to the timeline at any time.
  Similarly, filters and details open as a panel from the bottom edge, and
  **List** and **Export** are available in the **More** menu.
- **Full Screen** displays the plan across the entire screen, with the same
  controls; only the plan itself scrolls; the axis and overview remain stationary.
  **Esc** or **Exit Full Screen** returns you to the page. Where the browser does not
  support true full-screen mode (such as Safari on the iPhone), the plan covers
  the entire page.
- **Help** explains to readers directly on the page what the symbols
  mean (the **Legend** tab, with the categories for this map) and how to
  navigate the map using a mouse, trackpad, touchscreen, and keyboard (the **Navigation** tab).
  From within the map, the **?** button also opens the help section. In the map editor,
  this button is not available.
- **Without entries, the widget displays nothing at all**—no empty frame and
  no error message.

## What You See in the CMS Editor

The Plan Editor includes a **Preview** at the top: the same timeline as on
the page, with zoom, but without filters, the list, or export. Clicking on an
entry in the preview selects it for editing. To see how readers experience the plan
with all filters and the export feature, check the page preview.
