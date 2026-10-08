"use client"

import { QRCodeSVG } from "qrcode.react"

// Logo is 1346x1168; keep its aspect ratio and cover ~24% of the code so
// level "H" error correction (30% recovery) keeps it scannable.
const LOGO_RATIO = 1168 / 1346

interface UpiQrCodeProps {
  value: string
  size: number
  title?: string
}

export function UpiQrCode({ value, size, title }: UpiQrCodeProps) {
  const logoWidth = Math.round(size * 0.24)

  return (
    <QRCodeSVG
      value={value}
      size={size}
      level="H"
      marginSize={0}
      fgColor="#064e3b"
      bgColor="#ffffff"
      title={title}
      imageSettings={{
        src: "/logo/oweee.png",
        width: logoWidth,
        height: Math.round(logoWidth * LOGO_RATIO),
        excavate: true,
      }}
    />
  )
}
