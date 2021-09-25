/**
 * @param {Blob} file
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()

    reader.onload = async () => {
      const { BrowserQRCodeReader } = await import('@zxing/browser')
      const codeReader = new BrowserQRCodeReader()
      if (reader.result) {
        const result = await codeReader.decodeFromImageUrl(
          /** @type {string}*/ (reader.result)
        )
        resolve(result)
      }
    }

    reader.onerror = reject

    reader.readAsDataURL(file)
  })
}

/**
 * @param {Blob} file
 */
export async function readFileAsBuffer(file) {
  const buf = await file.arrayBuffer()
  const { BrowserQRCodeReader } = await import('@zxing/browser')
  const { DecodeHintType } = await import('@zxing/library')
  const hints = new Map()
  hints.set(DecodeHintType.TRY_HARDER, true)

  const codeReaderEasy = new BrowserQRCodeReader()
  const codeReaderHarder = new BrowserQRCodeReader(hints)
  const canvas = await getPdf(new Uint8Array(buf))
  try {
    return codeReaderEasy.decodeFromCanvas(canvas)
  } catch (err) {
    try {
      return codeReaderHarder.decodeFromCanvas(canvas)
    } catch (err) {
      console.error(err)
      return
    }
  }
}

/**
 * @param {Uint8Array} data
 */
async function getPdf(data) {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = 'worker.js'
  const loadingTask = pdfjs.getDocument({
    data,
  })
  const scale = 1.5
  const pdf = await loadingTask.promise
  const page = await pdf.getPage(1)
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  const canvasCtx = canvas.getContext('2d')
  canvas.height = viewport.height
  canvas.width = viewport.width
  if (canvasCtx) {
    await page.render({
      canvasContext: canvasCtx,
      viewport,
    }).promise
    return canvas
  }
  throw new Error('Failed to get canvas context')
}

/**
 * @param {string} qrCodeData
 */
export async function createSVG(qrCodeData) {
  const { BrowserQRCodeSvgWriter } = await import('@zxing/browser')
  const codeWriter = new BrowserQRCodeSvgWriter()
  const svg = codeWriter.write(qrCodeData, 300, 300)
  var xml = new XMLSerializer().serializeToString(svg)
  return 'data:image/svg+xml;base64,' + btoa(xml)
}
