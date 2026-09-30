# project-timeline-widget

Staffbase-Custom-Widget. Entwickelt, gebaut und released wird es aus dem
Meta-Repo [`ps-mhp/man-staffbase-cms-extensions`](https://github.com/ps-mhp/man-staffbase-cms-extensions);
dieses Repo enthält nur Quellcode und das ausgelieferte Bundle unter `dist/`.

```bash
scripts/sync.sh project-timeline-widget
npm run build -- --env widget=project-timeline-widget
npm test -- src/widgets/project-timeline-widget
scripts/release.sh project-timeline-widget
```
