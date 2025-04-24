import PyPDF2
import random
import os
from datetime import datetime


def extract_consecutive_pages_from_pdfs(pdf_list, output_dir):
    writer = PyPDF2.PdfWriter()

    for pdf_path in pdf_list:
        if not os.path.isfile(pdf_path):
            print(f"File not found: {pdf_path}")
            continue

        try:
            with open(pdf_path, "rb") as file:
                reader = PyPDF2.PdfReader(file)
                num_pages = len(reader.pages)

                if num_pages == 0:
                    print(f"Skipping empty PDF: {pdf_path}")
                    continue

                # If only one page, just add it
                if num_pages == 1:
                    writer.add_page(reader.pages[0])
                else:
                    # Pick a start page that has a next page
                    start_page = random.randint(0, num_pages - 2)
                    writer.add_page(reader.pages[start_page])
                    writer.add_page(reader.pages[start_page + 1])

        except Exception as e:
            print(f"Error processing {pdf_path}: {e}")

    # Ensure output folder exists
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Generate dynamic filename
    timestamp = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
    filename = f"9702_p4_{timestamp}_25_01_30.pdf"
    output_pdf_path = os.path.join(output_dir, filename)

    # Write output PDF
    with open(output_pdf_path, "wb") as output_file:
        writer.write(output_file)

    print(f"[OK] PDF created: {output_pdf_path}")


# Path where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# PDF filenames
pdf_filenames = [
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
]

# Full paths
pdf_list = [os.path.join(script_dir, fname) for fname in pdf_filenames]

# Output directory
output_dir = (
    r"C:\Users\Gobinda P. Poudel\Desktop\Subjects\Physics\SCS\GeneratedPastPaper"
)

# Generate the combined PDF
extract_consecutive_pages_from_pdfs(pdf_list, output_dir)
