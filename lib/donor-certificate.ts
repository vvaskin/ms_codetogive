/**
 * Renders the Love 21 donor e-certificate directly onto a canvas using the
 * 2D drawing API (mirrors the design in app/certificate-demo/donor-cart.html).
 * No DOM capture, so every element is placed at an exact coordinate that
 * jsPDF reproduces 1:1. The canvas is 2.5x scale (2050x1425) for crisp
 * output.
 */

export interface DonorCertificateRenderDetails {
  name: string;
  /** Donated amount in HKD. */
  amount: number;
  certId: string;
  issueDate: string;
  /** Decoded Love 21 logo image (or null to render without it). */
  logo: HTMLImageElement | null;
}

export function generateDonorCertId(): string {
  return `DON-2026-${Math.floor(1000 + Math.random() * 9000)}`;
}

const S = 2.5;

export function renderDonorCertificate(
  details: DonorCertificateRenderDetails,
): HTMLCanvasElement {
  const { name, amount, certId, issueDate, logo } = details;
  const W = Math.round(820 * S);
  const H = Math.round(570 * S);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const px = (v: number) => Math.round(v * S);

  function roundRect(x: number, y: number, w: number, h: number, r: number) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function text(
    t: string,
    font: string,
    color: string,
    x: number,
    y: number,
    align: CanvasTextAlign = "left",
  ) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillText(t, x, y);
  }

  function measure(t: string, font: string): number {
    ctx.font = font;
    return ctx.measureText(t).width;
  }

  function drawHeart(cx: number, cy: number, size: number, color: string) {
    ctx.save();
    ctx.translate(cx, cy - size * 0.46);
    ctx.beginPath();
    ctx.moveTo(0, size * 0.32);
    ctx.bezierCurveTo(0, 0, -size * 0.5, 0, -size * 0.5, size * 0.32);
    ctx.bezierCurveTo(-size * 0.5, size * 0.62, 0, size * 0.78, 0, size * 0.92);
    ctx.bezierCurveTo(0, size * 0.78, size * 0.5, size * 0.62, size * 0.5, size * 0.32);
    ctx.bezierCurveTo(size * 0.5, 0, 0, 0, 0, size * 0.32);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function drawSparkle(cx: number, cy: number, r: number) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(0, 0, -r, 0);
    ctx.quadraticCurveTo(0, 0, 0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.quadraticCurveTo(0, 0, 0, -r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawShield(cx: number, cy: number, size: number, color: string) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, -size / 2);
    ctx.lineTo(size / 2, -size / 2 + size * 0.28);
    ctx.quadraticCurveTo(size / 2, size * 0.18, 0, size / 2);
    ctx.quadraticCurveTo(-size / 2, size * 0.18, -size / 2, -size / 2 + size * 0.28);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  const bg = "#FFFFFF";
  const pink = "#FF3669";
  const blue = "#1000EB";
  const ink = "#000000";
  const muted = "rgba(0,0,0,0.6)";
  const soft = "#F7F7F9";

  // Card background + pink border
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  roundRect(px(2), px(2), W - px(4), H - px(4), px(36));
  ctx.strokeStyle = pink;
  ctx.lineWidth = px(6);
  ctx.stroke();

  // Background decorations
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = blue;
  drawSparkle(W - px(48), px(40), px(56));
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.1;
  drawHeart(px(64), H - px(128), px(192), pink);
  ctx.restore();

  // ---- Top bar ----
  const topX = px(32);
  const topY = px(32);
  const logoH = px(56);
  let logoW = 0;
  if (logo && logo.naturalWidth > 0) {
    const ar = logo.naturalWidth / logo.naturalHeight || 1.63;
    logoW = Math.round(logoH * ar);
    ctx.drawImage(logo, topX, topY, logoW, logoH);
  }
  const titleX = topX + logoW + px(12);
  const titleFont = `800 ${px(24)}px "Baloo 2", sans-serif`;
  const subtitleFont = `700 ${px(12)}px "Space Mono", monospace`;
  text("Love 21 Foundation", titleFont, ink, titleX, topY + px(28), "left");
  text("#somuchability", subtitleFont, pink, titleX, topY + px(50), "left");

  // Community Donor pill (top right)
  const pillText = "Community Donor";
  const pillFont = `700 ${px(11)}px "Space Mono", monospace`;
  const pillH = px(22);
  const pillW = measure(pillText, pillFont) + px(34);
  const pillX = W - topX - pillW;
  roundRect(pillX, topY, pillW, pillH, pillH / 2);
  ctx.fillStyle = blue;
  ctx.fill();
  drawHeart(pillX + px(16), topY + pillH / 2, px(11), bg);
  text(pillText, pillFont, bg, pillX + px(28), topY + pillH / 2, "left");
  const idFont = `400 ${px(10)}px "Space Mono", monospace`;
  text(`ID: ${certId}`, idFont, muted, W - topX, topY + pillH + px(12), "right");

  // ---- Center block (vertically centered between top bar and footer) ----
  const cx = W / 2;
  const iconD = px(48);
  const iconGap = px(12);
  const titleH = px(40);
  const titleGap = px(4);
  const subH = px(20);
  const subGap = px(16);
  const nameFont = `800 ${px(48)}px "Baloo 2", sans-serif`;
  const nameTextW = measure(name, nameFont);
  const nameBoxW = nameTextW + px(64) + px(4);
  const nameBoxH = px(48) + px(16) + px(4);
  const line1Font = `400 ${px(14)}px "Work Sans", sans-serif`;
  const line1H = px(22);
  const amountText = `HKD $${amount.toLocaleString("en-HK")}`;
  const amountFont = `700 ${px(18)}px "Space Mono", monospace`;
  const amountBoxH = px(18) + px(8) + px(4);
  const chipW = measure(amountText, amountFont) + px(20);
  const tailText = "to fuel sports coaching, dietetics, and holistic care!";
  const tailFont = `400 ${px(14)}px "Work Sans", sans-serif`;
  const tailW = measure(tailText, tailFont);
  const line2H = Math.max(amountBoxH, px(20));
  const line2W = chipW + px(10) + tailW;

  const blockH =
    iconD + iconGap + titleH + titleGap + subH + subGap + nameBoxH + line1H + px(6) + line2H;
  const centerTop = px(130);
  const centerBottom = H - px(150);
  let y = centerTop + Math.max(0, (centerBottom - centerTop - blockH) / 2);

  // icon
  const iconCy = y + iconD / 2;
  ctx.beginPath();
  ctx.arc(cx, iconCy, iconD / 2, 0, Math.PI * 2);
  ctx.fillStyle = soft;
  ctx.fill();
  ctx.strokeStyle = blue;
  ctx.lineWidth = px(2);
  ctx.stroke();
  drawHeart(cx, iconCy, px(26), pink);
  y += iconD + iconGap;

  // title
  text(
    "Certificate of Big Hearted Giving",
    `800 ${px(36)}px "Baloo 2", sans-serif`,
    ink,
    cx,
    y + titleH / 2,
    "center",
  );
  y += titleH + titleGap;

  // subtitle
  text(
    "This award is proudly presented to",
    `600 ${px(12)}px "Work Sans", sans-serif`,
    muted,
    cx,
    y + subH / 2,
    "center",
  );
  y += subH + subGap;

  // name box
  roundRect(cx - nameBoxW / 2, y, nameBoxW, nameBoxH, px(24));
  ctx.fillStyle = soft;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,54,105,0.2)";
  ctx.lineWidth = px(2);
  ctx.stroke();
  text(name, nameFont, pink, cx, y + nameBoxH / 2, "center");
  y += nameBoxH;

  // amount line 1
  text(
    "for empowering our 600+ families through a total contribution of",
    line1Font,
    ink,
    cx,
    y + line1H / 2,
    "center",
  );
  y += line1H + px(6);

  // amount line 2: chip + tail centered as one unit (row starts with the HKD sum)
  const line2Start = cx - line2W / 2;
  roundRect(line2Start, y, chipW, amountBoxH, px(6));
  ctx.fillStyle = soft;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,54,105,0.2)";
  ctx.lineWidth = px(2);
  ctx.stroke();
  text(amountText, amountFont, pink, line2Start + chipW / 2, y + amountBoxH / 2, "center");
  text(tailText, tailFont, ink, line2Start + chipW + px(10), y + line2H / 2, "left");

  // ---- Footer ----
  const footerLeft = px(32);
  const footerRight = W - px(32);
  const footerBottom = H - px(32);
  const sigFont = `700 ${px(20)}px "Baloo 2", sans-serif`;
  const roleFont = `700 ${px(12)}px "Work Sans", sans-serif`;
  const issuedFont = `400 ${px(10)}px "Space Mono", monospace`;
  const sigH = px(24);
  const underlineH = px(8);
  const roleH = px(16);
  const issuedH = px(14);
  const leftBlockH = sigH + underlineH + roleH + issuedH;

  const sepY = footerBottom - leftBlockH - px(14);
  ctx.strokeStyle = soft;
  ctx.lineWidth = px(2);
  ctx.beginPath();
  ctx.moveTo(footerLeft, sepY);
  ctx.lineTo(footerRight, sepY);
  ctx.stroke();

  const contentTop = sepY + px(12);
  let ly = contentTop;
  text("Jeff Rotmeyer", sigFont, ink, footerLeft, ly + sigH / 2, "left");
  ctx.strokeStyle = pink;
  ctx.lineWidth = px(2);
  ctx.beginPath();
  ctx.moveTo(footerLeft, ly + sigH + px(2));
  ctx.lineTo(footerLeft + px(112), ly + sigH + px(2));
  ctx.stroke();
  ly += sigH + underlineH;
  text("Founder & CEO, Love 21 Foundation", roleFont, "rgba(0,0,0,0.7)", footerLeft, ly + roleH / 2, "left");
  ly += roleH;
  text(`Issued: ${issueDate}`, issuedFont, "rgba(0,0,0,0.4)", footerLeft, ly + issuedH / 2, "left");

  // middle programs pill
  const pill2Font = `700 ${px(12)}px "Baloo 2", sans-serif`;
  const pill2Text = "Sport \u2022 Nutrition \u2022 Family \u2022 CSR";
  const pill2W = measure(pill2Text, pill2Font) + px(24);
  const pill2H = px(26);
  const pill2Y = contentTop + (leftBlockH - pill2H) / 2;
  roundRect(cx - pill2W / 2, pill2Y, pill2W, pill2H, px(12));
  ctx.fillStyle = soft;
  ctx.fill();
  text(pill2Text, pill2Font, muted, cx, pill2Y + pill2H / 2, "center");

  // HK Charity Sec 88 stamp
  const stampFont = `700 ${px(10)}px "Space Mono", monospace`;
  const stampText = "HK Charity Sec 88";
  const stampW = measure(stampText, stampFont) + px(34);
  const stampH = px(28);
  const stampY = contentTop + (leftBlockH - stampH) / 2;
  roundRect(footerRight - stampW, stampY, stampW, stampH, px(16));
  ctx.fillStyle = soft;
  ctx.fill();
  ctx.strokeStyle = blue;
  ctx.lineWidth = px(1.5);
  ctx.stroke();
  drawShield(footerRight - stampW + px(15), stampY + stampH / 2, px(13), blue);
  text(stampText, stampFont, blue, footerRight - stampW + px(26), stampY + stampH / 2, "left");

  return canvas;
}
