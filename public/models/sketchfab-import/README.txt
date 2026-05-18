Bundled zip packs (all imported via npm run import-model-zips)
==============================================================
  free-teeth-base-mesh.zip     → free_teeth_base_mesh.glb (default)
  rigged-teeth-with-gums.zip   → rigged_teeth_with_gums.glb

  (mnr_dental_scan.zip is omitted — too large / slow for the web viewer)

  Re-import all: npm run import-model-zips

Import a Sketchfab model into this app
======================================

Sketchfab does not allow automatic download without your login.
You must download the .glb yourself, then import it here.

Steps:
1. Open your model on https://sketchfab.com
2. Click "Download 3D Model"
3. Choose format: glTF Binary (.glb)
4. Save the file (e.g. to Downloads)

Import into the project (pick one):

A) Drop file here as:
     incoming.glb
   Then in oral-pathology-edu folder run:
     npm run import-sketchfab-glb

B) Or run with full path:
     npm run import-sketchfab-glb -- "C:\Users\PC\Downloads\YourModel.glb" my_slug "My model label"

The model appears in Student → 3D models → 3D gallery.

Good free examples (CC license — check each model page):
  • Human mandible, mixed dentition (Melbourne Dental School)
  • Human Mandible Anatomical Model (LivingLab)

Colorful nerves/vessels (often paid on Sketchfab Store):
  • Orofacial anatomy with blood and nerve supply (Ebers) — may require purchase on Fab

Always keep license/attribution required by the model author.
