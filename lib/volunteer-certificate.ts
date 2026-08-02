export interface VolunteerCertificateDetails {
  name: string;
  hours: number;
  certId: string;
  issueDate: string;
  logoSrc?: string;
}

export function generateVolunteerCertId(): string {
  // use a static prefix and a random suffix to make a predictable but non-sequential id
  return `VOL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function buildVolunteerCertificateHtml({
  name,
  hours,
  certId,
  issueDate,
  logoSrc = "/assets/images/love21_logo.png",
}: VolunteerCertificateDetails): string {
  // build a self-contained html template so it can be downloaded and viewed offline as a single file
  const hoursLabel = `${hours.toLocaleString("en-HK")} ${hours === 1 ? "hour" : "hours"}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Space+Mono:wght@400;700&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 p-8 flex justify-center items-center">

  <div class="w-[820px] h-[570px] bg-[#FFFFFF] p-8 border-[6px] border-[#FF3669] rounded-[36px] relative flex flex-col justify-between shadow-lg select-none font-['Work_Sans'] overflow-hidden">

    <!-- Background Decor -->
    <div class="absolute top-4 right-6 text-[#1000EB] opacity-15 pointer-events-none">
      <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
    </div>
    <div class="absolute -bottom-8 -left-8 text-[#FF3669] opacity-10 pointer-events-none">
      <svg class="w-48 h-48 fill-[#FF3669]" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    </div>

    <!-- Top Bar -->
    <div class="flex justify-between items-start z-10">
      <div class="flex items-center gap-3">
        <img src="${logoSrc}" alt="Love 21" class="h-14 w-auto object-contain">
        <div>
          <h3 class="font-['Baloo_2'] font-extrabold text-2xl text-black leading-none">Love 21 Foundation</h3>
          <p class="font-['Space_Mono'] text-xs font-bold text-[#FF3669] mt-1 uppercase tracking-wider">#somuchability</p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-1">
        <span class="bg-[#1000EB] text-white font-['Space_Mono'] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          ⭐ Volunteer Hero
        </span>
        <span class="font-['Space_Mono'] text-[10px] text-black/60 mt-1">ID: ${certId}</span>
      </div>
    </div>

    <!-- Central Body -->
    <div class="text-center my-auto py-2 z-10">
      <div class="inline-flex items-center justify-center w-12 h-12 bg-[#F7F7F9] border-2 border-[#1000EB] rounded-full text-[#1000EB] mb-3 shadow-sm">
        <svg class="w-6 h-6 fill-[#FF3669]" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/></svg>
      </div>

      <h1 class="font-['Baloo_2'] font-extrabold text-4xl text-black tracking-tight leading-none mb-1">
        Superstar Volunteer Certificate
      </h1>
      <p class="font-['Work_Sans'] text-xs text-black/60 font-semibold uppercase tracking-widest mb-4">
        This award is proudly presented to
      </p>

      <div class="inline-block font-['Baloo_2'] text-5xl font-extrabold text-[#FF3669] bg-[#F7F7F9] px-8 py-2 rounded-3xl border-2 border-[#FF3669]/20 shadow-sm mb-4">
        ${name}
      </div>

      <p class="font-['Work_Sans'] text-sm text-black max-w-xl mx-auto leading-relaxed">
        for sharing your energy and completing
        <span class="font-['Space_Mono'] font-bold text-lg text-[#1000EB] bg-[#F7F7F9] px-2 py-0.5 rounded-md border border-[#1000EB]/20">${hoursLabel}</span>
        of sports, nutrition, and holistic support for our neurodiverse community!
      </p>
    </div>

    <!-- Footer -->
    <div class="flex justify-between items-end border-t-2 border-[#F7F7F9] pt-4 z-10">
      <div class="text-left">
        <div class="font-['Baloo_2'] text-xl font-bold text-black leading-none">Jeff Rotmeyer</div>
        <div class="w-28 border-b-2 border-[#FF3669] my-1"></div>
        <p class="font-['Work_Sans'] text-xs font-bold text-black/70">Founder & CEO, Love 21 Foundation</p>
        <p class="font-['Space_Mono'] text-[10px] text-black/40">Issued: ${issueDate}</p>
      </div>

      <div class="flex items-center gap-1.5 font-['Baloo_2'] text-xs font-bold text-black/60 bg-[#F7F7F9] px-3 py-1.5 rounded-xl">
        <span>Sport</span> • <span>Nutrition</span> • <span>Family</span>
      </div>

      <div class="flex items-center gap-1.5 bg-[#F7F7F9] border border-[#1000EB] px-3 py-1.5 rounded-2xl">
        <svg class="w-4 h-4 text-[#1000EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        <span class="font-['Space_Mono'] text-[10px] font-bold text-[#1000EB]">HK Charity Sec 88</span>
      </div>
    </div>

  </div>

</body>
</html>`;
}
