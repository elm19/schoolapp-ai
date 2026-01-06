import {PDFParse} from 'pdf-parse';

export async function extractPdfText(url: string, pageNumbers?: number[]) {
    const parser = new PDFParse({ url });
    const result = await parser.getText(
        pageNumbers ? { partial: pageNumbers } : undefined
    );
    await parser.destroy();
    return result.text;
}
