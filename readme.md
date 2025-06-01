# jules
## julesのテストを格納する際の注意
- jules/にディレクトリを作り格納する

## Python Phone Number Scraper

### Description
A Python script designed to scrape phone numbers from a given website URL. It identifies `tel:` links in `<a>` tags and also attempts to find phone numbers in the general text content of the page.

The script now incorporates a feature where it compares found phone links against a user-provided list of 'master' phone numbers. This comparison helps identify:
- **Pass**: Links where both the `href` and the visible `textContent` correctly match a master number.
- **Warning**: Links where the `href` matches a master number, but the `textContent` either does not match or is not a recognizable phone number.
- **Critical Mistake**: Links where the `href` (which should be a phone number) does not match any of the provided master numbers.
- **N/A**: Status if no master numbers were provided by the user for comparison.

The results, including these statuses and details of each found link, are exported to an Excel file (`phone_link_analysis.xlsx`) with rows color-coded according to their status for easy review.

### Setup
1. Clone the repository (if not already done).
2. Install the required Python packages using the requirements file:
   ```bash
   pip install -r requirements.txt
   ```
   (Use `pip3` if `pip` is not aliased to Python 3 on your system).

### How to Run
1.  **Enter Master Phone Numbers**:
    *   When you run the script, it will first prompt you to enter the 'master' or correct phone numbers for the website/company you are analyzing.
    *   Enter one phone number per line.
    *   Press Enter on an empty line when you have finished entering all master numbers.
    *   These numbers will be normalized (e.g., hyphens and spaces removed).
2.  **Enter URL to Scrape**:
    *   After the master number entry, the script will prompt you to "Enter the URL to scrape:".
    *   Provide the full URL of the website you wish to analyze.
3.  The script will then process the website, perform comparisons if master numbers were provided, print details to the console for each link, and save the full analysis to an Excel file named `phone_link_analysis.xlsx` in the same directory.
4.  A self-test function will run automatically after the main scraping process.

Example execution:
   ```bash
   python phone_scraper.py
   ```
   (Use `python3` if `python` is not aliased to Python 3 on your system).

### Excel Output Interpretation
The generated Excel file (`phone_link_analysis.xlsx`) will contain the following columns:

-   `outerHTML`: The full HTML of the `<a>` tag.
-   `textContent`: The visible text of the `<a>` tag.
-   `href Value`: The raw `href` attribute value from the link.
-   `Normalized textContent`: The `textContent` after normalization (removal of common separators, "tel:" prefix, and conversion of full-width characters).
-   `Normalized href Value`: The `href Value` after normalization.
-   `Status`: The outcome of the comparison against master numbers:
    -   **"Pass"**: `Normalized href Value` matches a master number, and `Normalized textContent` also matches that same master number. (Row will be Green)
    -   **"Warning"**: `Normalized href Value` matches a master number, but `Normalized textContent` does not match that master number (or is empty/not a number). (Row will be Yellow)
    -   **"Critical Mistake"**: `Normalized href Value` (if it's a valid number) does not match any of the provided master numbers. If `Normalized href Value` is empty or not a number (e.g. "tel:"), it's also typically a critical issue if it was expected to be a number. (Row will be Red)
    -   **"N/A (No master numbers provided)"**: No master numbers were entered by the user, so this detailed comparison was skipped. (Row will have default/no specific background color).
-   `Matched Master Number`: If a match was found, this column shows which user-provided (and normalized) master number the `href Value` matched against. Otherwise, it's blank.

**Row Color-Coding:**
-   **Green Fill**: Indicates a "Pass" status.
-   **Yellow Fill**: Indicates a "Warning" status.
-   **Red Fill**: Indicates a "Critical Mistake" status.
-   **No Specific Fill / Default**: For "N/A" status or other scenarios not explicitly colored.

### Testing
The script includes a self-test function (`test_scraper()`) that runs automatically after the main URL scraping logic (or if no URL is provided). This test function:
-   Uses a predefined test URL (`https://takasugi-test.blhomepage.info/`).
-   Uses a predefined set of test master numbers.
-   Verifies the scraping, normalization, and the new status assignment logic ("Pass", "Warning", "Critical Mistake") for specific known links on the test page.
-   Checks the creation of a test Excel file (`test_output_phone_analysis.xlsx`) with the correct data structure and then cleans it up.
Test results ("All tests passed!" or a list of failures) will be printed to the console.
