# FAQ

**Question:** The page says “No entries for these filters.”

Answer: The selected filters leave no entries—perhaps because all
categories in the legend are hidden, a layer is deselected, or the
time period filter doesn’t match any entries. Click **Reset
Filters**; then the entire schedule will be visible again. Filters apply only to
your own visit; other readers see the schedule unfiltered.

**Question:** When exporting, the message “The export failed. Please try again
” appears.

Answer: The Excel file could not be generated. The tool for this is
only loaded when you click **Export**; often, the connection
was briefly interrupted at that moment. Click **Download Excel**
again. If it still doesn’t work, refresh the page.

**Question:** At the top of the plan editor, it says “N entries could not be read
and will be lost when saving.”

Answer: The saved plan contains entries that the widget cannot
process—such as those without a title, with an invalid date, or in a layer that
no longer exists. The published page does not display such entries
anyway. If you save the plan, they will be permanently deleted. If you want to
save them, click **Cancel** instead of saving, and contact
the person who last edited the plan—usually, the content
of the **Plan** text field was edited manually.

**Question:** Clicking on a linked entry displays “This post is
not available or has not been published.”

Answer: The window loads the post based on your own permissions. The message
appears if the post is still a draft, has been deleted, or is in a
channel that you’re not authorized to view. Publish the post or
check the channel’s visibility settings. **Open in a new tab** shows what
Staffbase itself says about this.

**Question:** I created a page using **New Page…**, but at the top it
doesn’t say “Linked to: …”.

Answer: The editor recognizes the new page by the fact that Staffbase switches to it after
**creation** (for a post: after saving). As long as
only the creation dialog is open, there is nothing to link yet. If you’ve
clicked through to another, already existing page in the Staffbase editor,
it is intentionally not linked. If you close the dialog with **Cancel**: If the
editor finds exactly one page that you’ve created since opening the dialog, it will offer it
for linking. Otherwise, select the new page under **Page**.

**Question:** An attachment won’t open.

Answer: Attachments come from the Staffbase media library and are loaded with
the permissions of the person viewing them. If the file has been deleted from there or is
not visible to that person, the file will fail to open. Check the
file in the media library and reattach it if necessary.

**Question:** At the top of the Schedule Editor, it says, “N links could not be read
and will be lost upon saving.”

Answer: In the saved plan, an entry contains a link or
an attachment that the widget cannot process—usually because the content
of the **Plan** text field was edited manually. The entry itself remains
intact; only the link is removed when saving. Re-link the
page or post in the **Content** tab.

**Question:** When I scroll the mouse wheel, the message “Hold down Ctrl/⌘ to zoom”
appears.

Answer: The mouse wheel alone scrolls the page, just like anywhere else—otherwise,
you’d get stuck on the plan while scrolling. To zoom, hold down the Ctrl key
(Mac: ⌘) while scrolling the mouse wheel. The prompt appears only
once.

**Question:** In the Map Editor, it says “The preview appears with the first
entry.”

Answer: The plan doesn’t have any entries yet, so there’s nothing to show.
In the **Entries** tab above the list, select a type and use
**+** to create an entry.

**Question:** The Plan Editor covers the entire screen, including the Studio
toolbar.

Answer: This is by design: the preview, list, and form require space. You
can exit the editor in the top-right corner by clicking **Apply** or **Cancel**; after that,
the configuration dialog will be visible again, and **Edit Plan…** will open
the editor once more.

**Question:** The preview is taking up too much space.

Answer: Drag the narrow bar below the preview upward, or
collapse the preview completely by clicking **Preview**. Similarly,
you can drag the entry list on the bar between the list and the form
to make it narrower or wider. Double-clicking a bar restores it to its
original size. The browser remembers the sizes; in a
private window, the default settings will apply again the next time it’s opened.

**Question:** Where can readers find out what the symbols in the plan mean?

**Answer:** Via the **Help** button in the toolbar (on narrow
screens, a **?**). The **Legend** tab shows each symbol as a small
sample with an explanation and the categories in this plan; the **Usage** tab
explains zooming, panning, filters, and all keyboard shortcuts. If the focus is on the
map, pressing the **?** key also opens the help.

**Question:** How do I zoom?

Answer: There are four ways: using the **−** and **+** buttons in the
toolbar; holding down the Ctrl key (Mac: ⌘) and using the mouse wheel, which
zooms the map around the location under the mouse pointer; using two fingers on
the trackpad or touchscreen; or using the keyboard with **+** and **−** once
the plan has focus. **Show All** (key **0**) displays the entire
plan again. You can move the view by dragging with the mouse, using
Shift and the mouse wheel, or via the frame in the overview below the plan.

**Question:** Why don’t I see the “Export” button?

Answer: Either **Offer Excel Export** is turned off in the widget’s settings,
or the screen is narrow (less than 768 pixels
wide): in that case, **Export** appears in the **More** menu on the toolbar.

**Question:** Where do I set the shape of a milestone?

Answer: You set it for the category, not for the milestone itself: in the **Categories** tab
using the shape button next to the color field. You can choose from a diamond, triangle, downward-pointing triangle, square, circle, hexagon, star, or cross. All
milestones in a category share the same shape and color—this makes it easy to
recognize the category on the timeline even without color. Milestones without a category
appear as a gray diamond.

**Question:** What does a dashed border or a shape that appears only as an
outline mean?

Answer: The entry is marked as **tentative**—its date has not yet
been set; the template used “tbd” for this. Milestones then appear only
as outlines, with time periods filled in lighter and having a dashed border. In the details,
“tentative” is also noted.

**Question:** What do the dashed lines mean?

Answer: There are two types. A **diagonal or horizontal dashed
line with an arrow** indicates a dependency: it runs from the predecessor to the
successor. A **vertical dashed line** through all layers, with
a triangle and a title at the bottom, is a deadline that applies to the entire plan
.

**Question:** A dependency has disappeared.

Answer: The line only appears when both ends are visible. If the
predecessor or successor is hidden by a filter or its level
is deselected, the line is missing. If one of the two entries has been deleted, the
dependency is permanently removed.

**Question:** The entries in a series are not on the same row.

Answer: A series applies only within a single level, and the name must match exactly
— “TG Assist MY26” and “TG-Assist MY26” are two different series.
Check the **Series** field and its **Level** in the form for each entry.

**Question:** The Today line is not visible.

Answer: Check whether **Show Today Line** is enabled. The line
also only appears if today’s date is within the visible section;
for a plan that begins entirely in the future, it will only be visible after
moving the timeline or using **Show All**—if today is even within
the plan’s timeframe at all.

**Question:** Can I move entries on the timeline with the mouse?

Answer: No. Dates are created and modified in the Plan Editor form.
This prevents any entry from accidentally losing its date when zooming or
moving the view.

**Question:** The Plan Editor says, “A plan cannot contain more than 300 entries
.” (or the same for 20 levels or 24 categories).

Answer: A plan can contain a maximum of 300 entries, 20 levels, and
24 categories; once this limit is reached, nothing more can be added. The Editor
displays the number of entries the plan already contains in the upper-right corner. For very large
projects, it is recommended to split the plan across multiple widgets, such as
one per building series.

**Question:** The **+** button cannot be clicked for **Milestones** and **Time Periods**
.

Answer: The plan has no more levels, and without a level, a milestone
or time period has no place; the plan editor indicates this below. Create
at least one level in the **Levels** tab using **New Level**. Key dates can be created even without a level.

**Question:** Where is the trash can in the entry list?

Answer: It appears when you hover over a row with the mouse or when a
row has focus via the keyboard; on touch devices, it is always visible.
Deletion occurs only after confirmation. If other entries depend on the deleted
one, the confirmation prompt will indicate their number; their connections will be removed.

**Question:** When creating a level or category, the message “A level ‘X’ already
exists” or “A category ‘X’ already exists” appears.

Answer: Each name may appear only once; otherwise, levels and
categories in drop-down menus, the legend, and the Excel export would be
indistinguishable. Uppercase and lowercase letters and leading spaces do not
matter. Choose a different name or use the existing level.

**Question:** A tab in the form has a red dot next to it.

Answer: A field in this tab contains an invalid entry, such as an
empty date. The plan retains the last valid value there. Open the
tab and correct the field; the dot will then disappear.

**Question:** The form says “Please enter a title,” “Please enter a
name,” “Please enter a date,” “Please enter a valid
date,” “The end date is before the start date,” “The start date is after the
end date,” or “Please enter a color as #RRGGBB, such as #E40045.”

Answer: The entry in the field cannot be used as is. As long as the message
is displayed, the plan retains the last valid value—so nothing
is lost, but the change has not yet been applied. Correct
the entry; as soon as it is valid, the message will disappear. For a
time period, first change the date that restores the order:
If it should start and end later, change the **End** date first, then the **Start** date.

**Question:** What happens to the plan during the automatic translation of the
page?

Answer: The plan’s heading, the titles of the levels and
categories, as well as the title and description of each entry are translated. Dates, colors,
dependencies, and series names remain unchanged—a series name is
a key, and two differently translated versions would break up a series
.

**Question:** After translation, the message “Project Plan: The content could
not be translated. It remains in the source language and must be manually
translated.”

Answer: The translation service could not access the plan. The rest of the
article is translated, but the plan is still in the source language. Translate
the text in the plan editor manually or restart the translation
process. The same applies to the message “Project Plan: The translated content
could not be inserted. It remains in the source language and must
be translated manually.”
