import sys
from pypdf import PdfReader


def get_text_from_pdf():
    reader = PdfReader(sys.argv[2])
    print(sys.argv[2])
    page = reader.pages[0]
    text = page.extract_text()

    with open(sys.argv[3], "w") as outfile:
        outfile.write(text)


if sys.argv[1] == 'get_text_from_pdf':
    get_text_from_pdf()

sys.stdout.flush()
