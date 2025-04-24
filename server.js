// const express = require("express");
// const fs = require("fs-extra");
// const path = require("path");
// const { PDFDocument } = require("pdf-lib");
// const cors = require("cors");

// // Create express app
// const app = express();
// const port = 3000;

// // Enable CORS for frontend to access the backend
// app.use(cors());

// // Serve the static frontend files from 'frontend' directory
// app.use(express.static(path.join(__dirname, "frontend")));

// // Serve the generated PDFs for download
// app.use(
//   "/GeneratedPastPaper",
//   express.static(path.join(__dirname, "GeneratedPastPaper"))
// );

// // Output directory for generated PDFs
// const outputDir = path.join(__dirname, "GeneratedPastPaper");

// // Path to the folder where PDFs are stored
// const pdfFolder = path.join(__dirname, "ALLP4");

// // List of PDF filenames (assuming they are in the 'ALLP4' folder)
// const pdfFiles = [
//   "9702_p4_12_motion_in_a_circle_all.pdf",
//   "9702_p4_13_gravitational_fields_all.pdf",
//   "9702_p4_14_temperature_all.pdf",
//   "9702_p4_15_16_ideal_gases_thermodynamics_all.pdf",
//   "9702_p4_17_oscillations_all.pdf",
//   "9702_p4_18_electric_fields_all.pdf",
//   "9702_p4_19_capacitance_all.pdf",
//   "9702_p4_20_magnetic_fields_all.pdf",
//   "9702_p4_21_alternating_currents_all.pdf",
//   "9702_p4_22_quantum_physics_all.pdf",
//   "9702_p4_23_nuclear_physics_all.pdf",
//   "9702_p4_24_medical_physics_all.pdf",
//   "9702_p4_25_astronomy_and_cosmology_all.pdf",
// ];

// let showErrors = true; // Toggle error visibility

// // API to toggle error visibility
// app.get("/toggle-errors", (req, res) => {
//   showErrors = !showErrors;
//   res.json({ showErrors });
// });

// async function extractConsecutivePages(pdfPath, targetDoc) {
//   const pdfBytes = await fs.readFile(pdfPath);
//   const sourceDoc = await PDFDocument.load(pdfBytes);

//   const pageCount = sourceDoc.getPageCount();
//   if (pageCount === 0) return;

//   const startPage = Math.max(0, Math.floor(Math.random() * (pageCount - 1)));

//   const [page1, page2] = await targetDoc.copyPages(sourceDoc, [
//     startPage,
//     Math.min(startPage + 1, pageCount - 1),
//   ]);

//   targetDoc.addPage(page1);
//   if (startPage + 1 < pageCount) {
//     targetDoc.addPage(page2);
//   }
// }

// async function createCombinedPDF() {
//   const scriptDir = __dirname;
//   const outputPDF = await PDFDocument.create();

//   for (const file of pdfFiles) {
//     const fullPath = path.join(pdfFolder, file); // Use pdfFolder here
//     if (await fs.pathExists(fullPath)) {
//       try {
//         await extractConsecutivePages(fullPath, outputPDF);
//         console.log(`Processed: ${file}`);
//       } catch (err) {
//         console.error(`Failed to process ${file}:`, err);
//         if (showErrors) {
//           throw err; // Rethrow error if errors are shown
//         }
//       }
//     } else {
//       console.warn(`Missing file: ${file}`);
//     }
//   }

//   // Generate file name like: 9702_p4_2025_04_24_25_01_30.pdf
//   const now = new Date();
//   const timestamp = now
//     .toISOString()
//     .replace(/T/, "_")
//     .replace(/:/g, "_")
//     .replace(/\..+/, "");
//   const fileName = `9702_p4_${timestamp}_25_01_30.pdf`;

//   await fs.ensureDir(outputDir);
//   const filePath = path.join(outputDir, fileName);
//   await fs.writeFile(filePath, await outputPDF.save());

//   console.log(`✅ PDF created: ${fileName}`);
//   return fileName; // Return the name of the generated file
// }

// // API to generate PDF
// app.get("/generate-pdf", async (req, res) => {
//   try {
//     const generatedFileName = await createCombinedPDF();
//     res.json({ status: "success", fileName: generatedFileName });
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     res
//       .status(500)
//       .json({ status: "error", message: "Failed to generate PDF" });
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Backend is running on http://localhost:${port}`);
// });

const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const cors = require("cors");

// Create express app
const app = express();
const port = 3000;

// Logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Enable CORS for frontend to access the backend
app.use(cors());
console.log("✅ CORS enabled");

// Serve the static frontend files from 'frontend' directory
app.use(express.static(path.join(__dirname, "frontend")));
console.log("✅ Static file serving enabled for frontend directory");

// Serve the generated PDFs for download
app.use(
  "/GeneratedPastPaper",
  express.static(path.join(__dirname, "GeneratedPastPaper"))
);
console.log("✅ PDF serving enabled for GeneratedPastPaper directory");

// Output directory for generated PDFs
const outputDir = path.join(__dirname, "GeneratedPastPaper");
console.log(`📁 Output directory set to: ${outputDir}`);

// Path to the folder where PDFs are stored
const pdfFolder = path.join(__dirname, "ALLP4");
console.log(`📁 PDF source folder set to: ${pdfFolder}`);

// List of PDF filenames
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
console.log(`📚 Loaded ${pdfFiles.length} PDF files for processing`);

let showErrors = true;
console.log("⚙️ Error visibility initially set to:", showErrors);

// API to toggle error visibility
app.get("/toggle-errors", (req, res) => {
  showErrors = !showErrors;
  console.log(`🔄 Error visibility toggled to: ${showErrors}`);
  res.json({ showErrors });
});

async function extractConsecutivePages(pdfPath, targetDoc) {
  console.log(`📄 Processing file: ${path.basename(pdfPath)}`);

  const pdfBytes = await fs.readFile(pdfPath);
  console.log(
    `📥 Read ${(pdfBytes.length / 1024 / 1024).toFixed(2)}MB from file`
  );

  const sourceDoc = await PDFDocument.load(pdfBytes);
  const pageCount = sourceDoc.getPageCount();
  console.log(`📊 Source document has ${pageCount} pages`);

  if (pageCount === 0) {
    console.warn(`⚠️ No pages found in ${path.basename(pdfPath)}`);
    return;
  }

  const startPage = Math.max(0, Math.floor(Math.random() * (pageCount - 1)));
  console.log(`🎲 Selected start page: ${startPage}`);

  const [page1, page2] = await targetDoc.copyPages(sourceDoc, [
    startPage,
    Math.min(startPage + 1, pageCount - 1),
  ]);
  console.log(
    `✅ Copied pages ${startPage} and ${Math.min(startPage + 1, pageCount - 1)}`
  );

  targetDoc.addPage(page1);
  if (startPage + 1 < pageCount) {
    targetDoc.addPage(page2);
  }
  console.log(
    `📎 Added ${startPage + 1 < pageCount ? "2" : "1"} pages to target document`
  );
}

async function createCombinedPDF() {
  console.log("🔄 Starting PDF generation process");
  const outputPDF = await PDFDocument.create();
  console.log("📄 Created new PDF document");

  // Load and add start.pdf first
  const startPdfPath = path.join(__dirname, "start.pdf");
  if (await fs.pathExists(startPdfPath)) {
    try {
      console.log("🔰 Adding start.pdf to beginning of the PDF");
      const startPdfBytes = await fs.readFile(startPdfPath);
      const startDoc = await PDFDocument.load(startPdfBytes);
      const startPages = await outputPDF.copyPages(
        startDoc,
        startDoc.getPageIndices()
      );

      startPages.forEach((page, idx) => {
        outputPDF.addPage(page);
        console.log(`📎 Added page ${idx} from start.pdf`);
      });
    } catch (err) {
      console.error("❌ Failed to add start.pdf:", err);
      if (showErrors) throw err;
    }
  } else {
    console.warn("⚠️ start.pdf not found, skipping...");
  }

  // Add random pages from topic PDFs
  for (const file of pdfFiles) {
    const fullPath = path.join(pdfFolder, file);
    console.log(`\n📎 Processing: ${file}`);

    if (await fs.pathExists(fullPath)) {
      try {
        await extractConsecutivePages(fullPath, outputPDF);
        console.log(`✅ Successfully processed: ${file}`);
      } catch (err) {
        console.error(`❌ Failed to process ${file}:`, err);
        if (showErrors) {
          throw err;
        }
      }
    } else {
      console.warn(`⚠️ Missing file: ${file}`);
    }
  }

  // Final save and return
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/T/, "_")
    .replace(/:/g, "_")
    .replace(/\..+/, "");
  const fileName = `9702_p4_${timestamp}_25_01_30.pdf`;
  console.log(`📝 Generated filename: ${fileName}`);

  await fs.ensureDir(outputDir);
  const filePath = path.join(outputDir, fileName);
  const pdfBytes = await outputPDF.save();
  await fs.writeFile(filePath, pdfBytes);
  console.log(
    `💾 Saved PDF (${(pdfBytes.length / 1024 / 1024).toFixed(
      2
    )}MB) to: ${filePath}`
  );

  return fileName;
}

// API to generate PDF
app.get("/generate-pdf", async (req, res) => {
  console.log("\n🚀 Received PDF generation request");
  try {
    const generatedFileName = await createCombinedPDF();
    console.log("✅ PDF generation completed successfully");
    res.json({ status: "success", fileName: generatedFileName });
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to generate PDF" });
  }
});

// Start server
app.listen(port, () => {
  console.log("\n🚀 Server initialization complete");
  console.log(`📡 Backend is running on http://localhost:${port}`);
  console.log("⚡ Ready to handle requests\n");
});
