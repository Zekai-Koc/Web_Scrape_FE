document.addEventListener("DOMContentLoaded", (event) => {
   const generateButton = document.getElementById("generateButton");
   generateButton.addEventListener("click", handleButtonClick);
});

async function handleButtonClick() {
   const url = document.getElementById("fname").value;
   await scrapeAndGeneratePDF(url);
}

async function scrapeAndGeneratePDF(url) {
   try {
      let html;

      // Fetch the HTML content based on the URL type
      if (url.startsWith("http") || url.startsWith("https")) {
         const response = await fetch(url);
         if (!response.ok) {
            throw new Error(
               "Network response was not ok " + response.statusText
            );
         }
         html = await response.text();
      } else {
         // Ensure that the file path is served by a local server
         const response = await fetch(url);
         if (!response.ok) {
            throw new Error(
               "Network response was not ok " + response.statusText
            );
         }
         html = await response.text();
      }

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
   const fileName = "address-label-" + addressLines[0] + ".pdf";
   doc.save(fileName);
}
