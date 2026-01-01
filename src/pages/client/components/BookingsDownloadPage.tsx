"use client"; // If using Next.js; remove if pure CRA

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  ArrowLeft,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";
import { getTurfById } from "@/services/client/clientService";
import type { IBookings } from "@/types/Booking_type";

interface UserBookingsReportData {
  type: "bookings";
  date: string;
  invoiceNumber: string;
  bookings: IBookings[];
}

const InvoiceUserBookingsPage = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<UserBookingsReportData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [enrichedBookings, setEnrichedBookings] = useState<
    Array<IBookings & { turfName: string; turfLocation?: string }>
  >([]);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get("data");
    if (dataParam) {
      try {
        const decodedData = JSON.parse(
          decodeURIComponent(dataParam)
        ) as UserBookingsReportData;
        setReportData(decodedData);
        enrichBookingsWithTurfDetails(decodedData.bookings);
      } catch (err) {
        setError("Failed to parse report data");
        console.error("Failed to parse report data:", err);
      }
    } else {
      setError("No report data found");
    }
    setLoading(false);
  }, []);

  const enrichBookingsWithTurfDetails = async (bookings: IBookings[]) => {
    try {
      const enriched = await Promise.all(
        bookings.map(async (booking) => {
          try {
            const turf = await getTurfById(booking.turfId);
            const locationStr = turf.location
              ? `${turf.location.address}, ${turf.location.city}${
                  turf.location.state ? `, ${turf.location.state}` : ""
                }`
              : "N/A";
            return {
              ...booking,
              turfName: turf.turfName || `Turf ${booking.turfId.slice(-4)}`,
              turfLocation: locationStr,
            };
          } catch (err) {
            console.warn(`Failed to fetch turf ${booking.turfId}:`, err);
            return {
              ...booking,
              turfName: `Turf ${booking.turfId.slice(-4)}`,
              turfLocation: "N/A",
            };
          }
        })
      );
      setEnrichedBookings(enriched);
    } catch (err) {
      setError("Failed to load turf details");
      console.error(err);
    }
  };

  const computeStats = () => {
    if (!enrichedBookings.length) return { totalBookings: 0, totalSpent: 0 };
    const totalSpent = enrichedBookings.reduce(
      (sum, b) => sum + (b.price || 0),
      0
    );
    return {
      totalBookings: enrichedBookings.length,
      totalSpent,
    };
  };

  const { totalBookings, totalSpent } = computeStats();

  const handleGoBack = () => {
    navigate(-1); // Or to /past-bookings
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !reportData) return;

    setGeneratingPDF(true);

    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = invoiceRef.current;
      const clone = element.cloneNode(true) as HTMLElement;

      clone.classList.add("pdf-mode");

      clone.style.position = "fixed";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.width = element.offsetWidth + "px";

      document.body.appendChild(clone);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(clone, {
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scale: 2,
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `User-Bookings-Report-${reportData.invoiceNumber}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert(
        `Failed to generate PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please try the Print option instead.`
      );
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 mt-4 text-lg">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-4">
            {error || "No report data available"}
          </p>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pb-8">
      <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 pb-6 mb-0 flex items-center justify-between print:hidden">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={generatingPDF}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={generatingPDF}
          >
            {generatingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <div
          ref={invoiceRef}
          className="max-w-5xl mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl print:shadow-none"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  BOOKINGS REPORT
                </h1>
                <p className="text-blue-100">
                  Turf Management Platform - User History
                </p>
              </div>
              <div className="text-white md:text-right">
                <p className="text-sm text-blue-100 mb-1">Report Number</p>
                <p className="text-xl font-bold mb-3">
                  {reportData.invoiceNumber}
                </p>
                <p className="text-sm text-blue-100 mb-1">Generated</p>
                <p className="font-medium">{reportData.date}</p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">
                  User Report
                </h3>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Your Booking History
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Summary of all your completed turf bookings
                  <br />
                  For reservations and support
                  <br />
                  support@turfplatform.com
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">
                  Report Type
                </h3>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold">
                  <Calendar className="w-4 h-4" />
                  Past Bookings Report
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Booking Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-600 mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-900">
                  {totalBookings}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-slate-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹ {totalSpent.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Turf
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedBookings.map((booking, index) => (
                    <tr
                      key={booking._id || index}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {booking.turfName} <br />
                        <span className="text-slate-500 text-xs">
                          {booking.turfLocation}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {booking.date || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                        ₹ {(booking.price || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-8 md:p-12 bg-slate-50 border-t border-slate-200">
            <div className="text-center text-slate-600 text-sm">
              <p className="mb-2">
                This is an automatically generated report from the Turf
                Management Platform
              </p>
              <p>For any queries, please contact support@turfplatform.com</p>
              <p className="mt-4 text-xs text-slate-500">
                Generated on {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceUserBookingsPage;
