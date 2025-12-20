"use client";

import { useEffect, useState, useRef } from "react";
import {
  Download,
  Printer,
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  Users,
  UserCog,
  DollarSign,
  TrendingUp,
  Loader2,
} from "lucide-react";

interface InvoiceData {
  type: "dashboard" | "transaction";
  date: string;
  invoiceNumber: string;

  // Dashboard data
  users?: {
    total: number;
    active: number;
    blocked: number;
  };
  turfs?: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  owners?: {
    total: number;
    active: number;
    blocked: number;
    pending: number;
  };
  bookings?: {
    total: number;
    completed: number;
    confirmed: number;
    cancelled: number;
  };
  revenue?: {
    totalBalance: number;
    period: string;
  };

  // Transaction data
  transactions?: Array<{
    id: string;
    turf: string;
    type: string;
    amount: number;
    reason: string;
    status: string;
    date: string;
  }>;
  transactionStats?: {
    totalCredit: number;
    totalDebit: number;
    netAmount: number;
    totalTransactions: number;
  };
}

const AdminInvoiceDownloadPage = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get("data");
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        setInvoiceData(decodedData);
      } catch (error) {
        console.error("Failed to parse invoice data:", error);
      }
    }
    setLoading(false);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !invoiceData) return;

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

      // ✅ Timeout for styles to apply
      await new Promise((resolve) => setTimeout(resolve, 100)); // Bumped to 100ms for safety

      const canvas = await html2canvas(clone, {
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff", // Explicit white bg
        scale: 2, // Higher res for crisp PDF
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/jpeg", 0.98); // Slightly higher quality
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

      const fileName = `Invoice-${invoiceData.invoiceNumber}-${
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
          <p className="text-slate-400 mt-4 text-lg">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-4">
            No invoice data available
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
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={generatingPDF}
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
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
                  INVOICE
                </h1>
                <p className="text-blue-100">Turf Management Platform</p>
              </div>
              <div className="text-white md:text-right">
                <p className="text-sm text-blue-100 mb-1">Invoice Number</p>
                <p className="text-xl font-bold mb-3">
                  {invoiceData.invoiceNumber}
                </p>
                <p className="text-sm text-blue-100 mb-1">Date</p>
                <p className="font-medium">{invoiceData.date}</p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">
                  From
                </h3>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Turf Admin Platform
                </h2>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">
                  Report Type
                </h3>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold">
                  {invoiceData.type === "dashboard" ? (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      Dashboard Analytics Report
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4" />
                      Transaction Report
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {invoiceData.type === "dashboard" && (
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Platform Analytics Summary
              </h2>

              {invoiceData.revenue && (
                <div className="mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Revenue Overview ({invoiceData.revenue.period})
                  </h3>
                  <div className="text-3xl font-bold text-green-600">
                    ₹ {invoiceData.revenue.totalBalance.toLocaleString("en-IN")}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {invoiceData.users && (
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Users
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Total Users:</span>
                        <span className="font-bold text-slate-900">
                          {invoiceData.users.total}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Active:</span>
                        <span className="font-semibold text-green-600">
                          {invoiceData.users.active}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Blocked:</span>
                        <span className="font-semibold text-red-600">
                          {invoiceData.users.blocked}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {invoiceData.turfs && (
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Building2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Turfs
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Total Turfs:</span>
                        <span className="font-bold text-slate-900">
                          {invoiceData.turfs.total}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Approved:</span>
                        <span className="font-semibold text-green-600">
                          {invoiceData.turfs.approved}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Pending:</span>
                        <span className="font-semibold text-yellow-600">
                          {invoiceData.turfs.pending}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Rejected:</span>
                        <span className="font-semibold text-red-600">
                          {invoiceData.turfs.rejected}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {invoiceData.owners && (
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <UserCog className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Owners
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Total Owners:</span>
                        <span className="font-bold text-slate-900">
                          {invoiceData.owners.total}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Active:</span>
                        <span className="font-semibold text-green-600">
                          {invoiceData.owners.active}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Blocked:</span>
                        <span className="font-semibold text-red-600">
                          {invoiceData.owners.blocked}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Pending:</span>
                        <span className="font-semibold text-yellow-600">
                          {invoiceData.owners.pending}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {invoiceData.bookings && (
                  <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-cyan-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-cyan-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Bookings
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Total Bookings:</span>
                        <span className="font-bold text-slate-900">
                          {invoiceData.bookings.total}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Completed:</span>
                        <span className="font-semibold text-green-600">
                          {invoiceData.bookings.completed}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Confirmed:</span>
                        <span className="font-semibold text-blue-600">
                          {invoiceData.bookings.confirmed}
                        </span>
                      </div>
                      {invoiceData.bookings.cancelled !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Cancelled:</span>
                          <span className="font-semibold text-red-600">
                            {invoiceData.bookings.cancelled}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {invoiceData.type === "transaction" && invoiceData.transactions && (
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
                Transaction Summary
              </h2>

              {invoiceData.transactionStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-slate-600 mb-1">
                      Total Transactions
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {invoiceData.transactionStats.totalTransactions}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-slate-600 mb-1">Total Credits</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{" "}
                      {invoiceData.transactionStats.totalCredit.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-slate-600 mb-1">Total Debits</p>
                    <p className="text-2xl font-bold text-red-600">
                      ₹{" "}
                      {invoiceData.transactionStats.totalDebit.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                        Turf
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                        Type
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.transactions.map((tx, index) => (
                      <tr
                        key={tx.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {tx.turf}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`font-semibold ${
                              tx.type === "CREDIT"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">
                          <span
                            className={
                              tx.type === "CREDIT"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {tx.type === "CREDIT" ? "+" : "-"}₹{" "}
                            {tx.amount.toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              tx.status === "SUCCESS"
                                ? "bg-green-100 text-green-700"
                                : tx.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {tx.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="p-8 md:p-12 bg-slate-50 border-t border-slate-200">
            <div className="text-center text-slate-600 text-sm">
              <p className="mb-2">
                This is an automatically generated report from the Turf
                Management Platform
              </p>
              <p>For any queries, please contact thejasthomas001@gmail.com</p>
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

export default AdminInvoiceDownloadPage;
