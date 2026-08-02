'use client';

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Heart, Sparkles, X, Trophy, ShieldCheck } from 'lucide-react';

interface CertificateProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'volunteer' | 'donor';
  recipientName: string;
  amountOrHours: number; // Volunteer hours OR Donation amount in HKD
  issueDate?: string;
  certId?: string;
}

export default function CertificateModal({
  isOpen,
  onClose,
  type,
  recipientName,
  amountOrHours,
  issueDate = new Date().toLocaleDateString('en-HK', { year: 'numeric', month: 'long', day: 'numeric' }),
}: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [certId] = useState(
    () => `${type === 'volunteer' ? 'VOL' : 'DON'}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
  );

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    setIsDownloading(true);

    try {
      // Render HTML element to high-res canvas (2.5x scale for print clarity)
      const canvas = await html2canvas(certRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Initialize Landscape PDF matching canvas dimensions
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const fileName = `Love21_${type === 'volunteer' ? 'Volunteer' : 'Donor'}_Certificate_${(recipientName || 'Champion').replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('Error generating PDF certificate:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[95vh] overflow-y-auto">
        
        {/* Modal Top Bar */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF3669] animate-pulse" />
            <span className="font-['Baloo_2'] text-xl font-bold text-black">
              Official e-Certificate Preview
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-[#F7F7F9] text-black transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ================= CERTIFICATE CONTAINER (CAPTURED BY CANVAS) ================= */}
        <div className="p-2 overflow-x-auto">
          <div
            ref={certRef}
            className="w-[820px] h-[570px] mx-auto bg-[#FFFFFF] p-8 border-[6px] border-[#FF3669] rounded-[36px] relative flex flex-col justify-between shadow-sm select-none font-['Work_Sans'] overflow-hidden"
          >
            {/* Cute Decorative Floating Elements */}
            <div className="absolute top-4 right-6 text-[#1000EB] opacity-15 pointer-events-none">
              <Sparkles className="w-24 h-24" />
            </div>
            <div className="absolute -bottom-8 -left-8 text-[#FF3669] opacity-10 pointer-events-none">
              <Heart className="w-48 h-48 fill-[#FF3669]" />
            </div>

            {/* Top Bar: Brand Header & Category Badge */}
            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-3">
                {/* L21 Logo Badge */}
                <div className="w-14 h-14 bg-[#FF3669] text-white font-['Baloo_2'] font-black text-2xl rounded-2xl flex items-center justify-center shadow-sm">
                  L21
                </div>
                <div>
                  <h3 className="font-['Baloo_2'] font-extrabold text-2xl text-black leading-none">
                    Love 21 Foundation
                  </h3>
                  <p className="font-['Space_Mono'] text-xs font-bold text-[#FF3669] mt-1 uppercase tracking-wider">
                    #somuchability
                  </p>
                </div>
              </div>

              {/* Side Accent Tag & Metadata */}
              <div className="flex flex-col items-end gap-1">
                <span className="bg-[#1000EB] text-white font-['Space_Mono'] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {type === 'volunteer' ? '⭐ Volunteer Hero' : '💖 Community Donor'}
                </span>
                <span className="font-['Space_Mono'] text-[10px] text-black/60 mt-1">
                  ID: {certId}
                </span>
              </div>
            </div>

            {/* Central Award Body */}
            <div className="text-center my-auto py-2 z-10">
              {/* Cute Icon Badge */}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#F7F7F9] border-2 border-[#1000EB] rounded-full text-[#1000EB] mb-3 shadow-sm">
                {type === 'volunteer' ? (
                  <Trophy className="w-6 h-6" />
                ) : (
                  <Heart className="w-6 h-6 fill-[#FF3669] text-[#FF3669]" />
                )}
              </div>

              <h1 className="font-['Baloo_2'] font-extrabold text-4xl text-black tracking-tight leading-none mb-1">
                {type === 'volunteer' ? 'Superstar Volunteer Certificate' : 'Certificate of Big Hearted Giving'}
              </h1>
              
              <p className="font-['Work_Sans'] text-xs text-black/60 font-semibold uppercase tracking-widest mb-4">
                This award is proudly presented to
              </p>

              {/* Recipient Name in Baloo 2 */}
              <div className="inline-block font-['Baloo_2'] text-5xl font-extrabold text-[#FF3669] bg-[#F7F7F9] px-8 py-2 rounded-3xl border-2 border-[#FF3669]/20 shadow-sm mb-4">
                {recipientName || 'Valued Champion'}
              </div>

              {/* Impact Description */}
              <p className="font-['Work_Sans'] text-sm text-black max-w-xl mx-auto leading-relaxed">
                {type === 'volunteer' ? (
                  <>
                    for sharing your energy and completing{' '}
                    <span className="font-['Space_Mono'] font-bold text-lg text-[#1000EB] bg-[#F7F7F9] px-2 py-0.5 rounded-md border border-[#1000EB]/20">
                      {amountOrHours} Hours
                    </span>{' '}
                    of sports, nutrition, and holistic support for our neurodiverse community!
                  </>
                ) : (
                  <>
                    for empowering our 600+ families through a total contribution of{' '}
                    <span className="font-['Space_Mono'] font-bold text-lg text-[#FF3669] bg-[#F7F7F9] px-2 py-0.5 rounded-md border border-[#FF3669]/20">
                      HKD ${amountOrHours.toLocaleString()}
                    </span>{' '}
                    to fuel sports coaching, dietetics, and holistic care!
                  </>
                )}
              </p>
            </div>

            {/* Bottom Footer: Signature & Charity Proof */}
            <div className="flex justify-between items-end border-t-2 border-[#F7F7F9] pt-4 z-10">
              {/* Signature Block */}
              <div className="text-left">
                <div className="font-['Baloo_2'] text-xl font-bold text-black leading-none">
                  Jeff Rotmeyer
                </div>
                <div className="w-28 border-b-2 border-[#FF3669] my-1"></div>
                <p className="font-['Work_Sans'] text-xs font-bold text-black/70">
                  Founder & CEO, Love 21 Foundation
                </p>
                <p className="font-['Space_Mono'] text-[10px] text-black/40">
                  Issued: {issueDate}
                </p>
              </div>

              {/* Programs Pillar Pill */}
              <div className="hidden sm:flex items-center gap-1.5 font-['Baloo_2'] text-xs font-bold text-black/60 bg-[#F7F7F9] px-3 py-1.5 rounded-xl">
                <span>Sport</span> • <span>Nutrition</span> • <span>Family Care</span>
              </div>

              {/* Verified Stamp */}
              <div className="flex items-center gap-1.5 bg-[#F7F7F9] border border-[#1000EB] px-3 py-1.5 rounded-2xl">
                <ShieldCheck className="w-4 h-4 text-[#1000EB]" />
                <span className="font-['Space_Mono'] text-[10px] font-bold text-[#1000EB]">
                  HK Charity Sec 88
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-black font-['Work_Sans'] text-black hover:bg-[#F7F7F9] text-sm font-bold transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-6 py-2.5 bg-[#FF3669] hover:bg-[#FF3669]/90 text-white font-['Baloo_2'] text-lg font-bold rounded-2xl flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Creating PDF...' : 'Download Cute e-Cert'}
          </button>
        </div>

      </div>
    </div>
  );
}