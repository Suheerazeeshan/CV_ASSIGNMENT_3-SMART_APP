tooth.glb (included)
====================

This folder includes:

  • tooth.glb — default model the app loads from “Use project default”.
  • manual-upload-sample-tooth.glb — same mesh, copied so you can practice “Choose file”:
      Browse to:
        oral-pathology-edu\public\models\manual-upload-sample-tooth.glb
      and select it in Student → 3D models.

Regenerate the mesh anytime:

  npm run generate-tooth-glb

Script: scripts/create-tooth-glb.mjs (Three.js → GLB). Educational placeholder, not a
clinical scan.

Replace with your own mesh:

  • Export from Blender / Meshmixer as .glb and overwrite tooth.glb, or
  • Use Student → 3D models → Upload 3D model (.glb) for a browser-only preview.
