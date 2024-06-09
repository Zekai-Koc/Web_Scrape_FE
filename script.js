async function scrapeAndGeneratePDF() {
   try {
      // Load local HTML file content
      const response = await fetch("./data/dummy.html");
      const html = await response.text();

      // Create a new DOMParser instance and parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Extract address lines or any other relevant data using DOM traversal methods
      const scrapedAddressLines = [];
      const addressLines = doc.querySelectorAll(".address-lines .line");
      addressLines.forEach((line) => {
         scrapedAddressLines.push(line.textContent.trim());
      });

      // Generate PDF using the scraped data
      await createPDF(scrapedAddressLines);
   } catch (error) {
      console.error("Error:", error.message);
   }
}

async function createPDF(addressLines) {
   const { jsPDF } = window.jspdf;

   // Create a new PDF document
   const doc = new jsPDF();

   // Set font size
   doc.setFontSize(12);

   // Add the address lines to the PDF
   addressLines.forEach((line, index) => {
      doc.text(line, 10, 10 + index * 10); // Adjust positions as needed
   });

   // Save the PDF and open it in a new tab
   doc.save("address-label.pdf");
}

// let html;
// if (url.startsWith("http") || url.startsWith("https")) {
//    const response = await axios.get(url);
//    html = response.data;
// } else {
//    const filePath = path.resolve(url);
//    html = fs.readFileSync(filePath, "utf-8");
// }

// const $ = cheerio.load(html);
