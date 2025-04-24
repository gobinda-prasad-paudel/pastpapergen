const fs = require("fs-extra");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

// Output directory
const outputDir = path.join(__dirname, "GeneratedPastPaper");

// List of PDF filenames (in same directory as script)
const pdfFiles = [
  "9702_p4_12_motion_in_a_circle_all.pdf",
  "9702_p4_13_gravitational_fields_all.pdf",
  "9702_p4_14_temperature_all.pdf",
  "9702_p4_15_16_ideal_gases_thermodynamics_all.pdf",
  "9702_p4_17_oscillations_all.pdf",
  "9702_p4_18_electric_fields_all.pdf",
  "9702_p4_19_capacitance_all.pdf",
  "9702_p4_20_magnetic_fields_all.pdf",
  "9702_p4_21_alternating_currents_all.pdf",
  "9702_p4_22_quantum_physics_all.pdf",
  "9702_p4_23_nuclear_physics_all.pdf",
  "9702_p4_24_medical_physics_all.pdf",
  "9702_p4_25_astronomy_and_cosmology_all.pdf",
];

async function extractConsecutivePages(pdfPath, targetDoc) {
  const pdfBytes = await fs.readFile(pdfPath);
  const sourceDoc = await PDFDocument.load(pdfBytes);

  const pageCount = sourceDoc.getPageCount();
  if (pageCount === 0) return;

  const startPage = Math.max(0, Math.floor(Math.random() * (pageCount - 1)));

  const [page1, page2] = await targetDoc.copyPages(sourceDoc, [
    startPage,
    Math.min(startPage + 1, pageCount - 1),
  ]);

  targetDoc.addPage(page1);
  if (startPage + 1 < pageCount) {
    targetDoc.addPage(page2);
  }
}

async function createCombinedPDF() {
  const scriptDir = __dirname;
  const outputPDF = await PDFDocument.create();

  for (const file of pdfFiles) {
    const fullPath = path.join(scriptDir, file);
    if (await fs.pathExists(fullPath)) {
      try {
        await extractConsecutivePages(fullPath, outputPDF);
        console.log(`Processed: ${file}`);
      } catch (err) {
        console.error(`Failed to process ${file}:`, err);
      }
    } else {
      console.warn(`Missing file: ${file}`);
    }
  }

  // Generate file name like: 9702_p4_2025_04_24_25_01_30.pdf
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/T/, "_")
    .replace(/:/g, "_")
    .replace(/\..+/, "");
  const fileName = `9702_p4_${timestamp}_25_01_30.pdf`;

  await fs.ensureDir(outputDir);
  await fs.writeFile(path.join(outputDir, fileName), await outputPDF.save());

  console.log(`✅ PDF created: ${fileName}`);
}

createCombinedPDF();
