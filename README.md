# Trasovník (Route Maker)

<p>
  <a href="README.md"><img alt="🇬🇧 English" src="https://img.shields.io/badge/%F0%9F%87%AC%F0%9F%87%A7-English-blue"></a>
  <a href="README_CZ.md"><img alt="🇨🇿 Čeština" src="https://img.shields.io/badge/%F0%9F%87%A8%F0%9F%87%BF-%C4%8Ce%C5%A1tina-blue"></a>
</p>

Trasovník is a browser tool for preparing map routes, measuring their length and elevation, and exporting outputs for sharing or print. It was created for the [Cestou Vysočiny](https://www.stoky.cz/cestou-vysociny/a-1388) trail initiative and tourism coordinators in the Vysočina region.

Open the application here: https://trasovnik.mareska.xyz/

![Preview](docs/images/preview.png)

## What You Can Do

- Draw routes on top of Mapy.com map layers.
- Combine routed sections with free straight-line sections in one route.
- Search for places and move around the map.
- Measure route distance, estimated time, ascent, descent, and section-by-section values.
- Export the route as a GPX file.
- Load a previously saved GPX route.
- Export the visible map or a larger map image as PNG.
- Export an elevation profile as PNG and a route-section table as DOC.

## Basic Use

1. Open the app in a modern browser.
2. Use the search field in the top bar to find a town, landmark, address, or other place.
3. Choose how you want to work with the map:
   - **Browse**: pan and zoom the map without adding route points.
   - **Route on roads**: add route points and let the app calculate the route along roads, paths, or trails.
   - **Free route**: add straight-line route sections manually.
4. Click in the map to add route points. The first point starts the route; each next point creates a new section.
5. Drag numbered points to adjust the route.
6. Click a numbered marker to remove that point. You can also right-click a point and choose **Delete point** from its menu.

## Route Modes

The bottom route panel appears after you add at least two points. It shows the route summary and lets you choose the routing profile:

- **Hiking** or **Walk fast** for walking routes.
- **Road bike** or **Mountain bike** for cycling routes.
- **Car fast with traffic**, **Car fast**, or **Car short** for car routes.

Changing the profile recalculates routed sections. Free sections remain straight lines.

## Route Summary

The bottom panel can be collapsed or expanded.

In the compact view, it shows the main totals: distance, estimated time, ascent, and descent. In the expanded view, it also includes:

- an elevation profile,
- a table of sections between route points,
- checkboxes for showing or hiding distance, time, ascent, and descent columns,
- export buttons for **Profile PNG** and **Table DOC**.

Elevation values are calculated from the route geometry. They may take a moment to load after route changes.

## Route Appearance

Open **Route** in the top menu to adjust how the route looks:

- route color,
- route width,
- dashed style,
- route opacity,
- visibility of numbered markers.

The same menu also contains:

- **Load route**: load a GPX file,
- **Save route**: download the current route as GPX,
- **Clear route**: clear the current route.

The GPX export includes the editable route points used by Trasovník and a track line for use in other map tools.

## Map Settings

Open **Map** in the top menu to change the map:

- switch between color and black-and-white map tone,
- choose a base map: basic, tourist, aerial, or winter,
- show or hide tourist trail overlays,
- start image export with **Save image**.

## Exporting a Map Image

Use **Map -> Save image** to save a PNG map image.

You can export:

- **Current view**: exactly the map area currently visible on screen.
- **Large map**: a larger square map centered around the current map position.

For a large map, choose image size, map scale, and optionally nudge the export center with the arrow buttons. The dialog shows a preview and warns if the route is partly or completely outside the exported area.

## Tips

- Switch back to **Browse** when you only want to move around the map.
- Zoom in before placing points on dense paths or road junctions.
- Use **Free route** for field crossings, temporary detours, or sections that should not follow mapped roads.
- Save a GPX copy before making large changes to a route.
- Use the black-and-white map tone when preparing cleaner print outputs.
