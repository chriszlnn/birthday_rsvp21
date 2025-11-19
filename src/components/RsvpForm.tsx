import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Upload, ChevronRight, ChevronLeft, X } from "lucide-react";
import { SuccessModal } from "./SuccessModal";
import { PropsRain } from "./PropsRain";
import type { Rsvp } from "../App";
import { API_URL } from "../config";
import qrImage from "../assets/qr.jpg";

const PAYMENT_EXEMPT_NAMES = [
  "Jon Xavier",
  "Harith Bennet",
  "Innocensia Larry Tokuzip",
  "Jason Wong",
];

interface RsvpFormProps {
  onSubmit: (rsvp: Rsvp) => void;
  existingRsvps?: Rsvp[];
}

export function RsvpForm({ onSubmit, existingRsvps = [] }: RsvpFormProps) {
  const [step, setStep] = useState(1 as 1 | 2);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showPropsRain, setShowPropsRain] = useState(false);
  const [name, setName] = useState("");
  const [drinking, setDrinking] = useState("");
  const [receipt, setReceipt] = useState(null as File | null);
  const [receiptPreview, setReceiptPreview] = useState("" as string);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const hasTriggeredRain = useRef(false);
  const normalizedName = name.trim().toLowerCase();
  const isPaymentExempt =
    normalizedName.length > 0 &&
    PAYMENT_EXEMPT_NAMES.includes(normalizedName);

  useEffect(() => {
    if (step === 2 && isPaymentExempt) {
      toast.success("You're covered — no payment needed! 🥳");
    }
  }, [step, isPaymentExempt]);

  // Trigger props rain only once when form first appears (on mount)
  useEffect(() => {
    if (hasTriggeredRain.current) return;
    
    const timer = setTimeout(() => {
      if (!hasTriggeredRain.current) {
        console.log('Triggering props rain animation on form load!');
        hasTriggeredRain.current = true;
        setShowPropsRain(true);
      }
    }, 500); // Small delay to ensure form is rendered
    
    return () => clearTimeout(timer);
  }, []); // Only run once on mount

  const handleNext = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    const normalizedInput = name.trim().toLowerCase();

    try {
      setIsCheckingName(true);
      const response = await fetch(
        `${API_URL}/api/rsvp/check-name?name=${encodeURIComponent(
          name.trim()
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to verify name");
      }

      const data = await response.json();

      if (data.exists) {
        toast.info("Your attendance has been recorded!");
        setShowDuplicateModal(true);
        return;
      }
    } catch (error) {
      console.error("Error checking RSVP name:", error);
      toast.error("Couldn't verify your RSVP. Please try again.");
      return;
    } finally {
      setIsCheckingName(false);
    }

    // Fallback to already-fetched RSVPs just in case
    const existingName = existingRsvps.find(
      (rsvp) => rsvp.name.trim().toLowerCase() === normalizedInput
    );

    if (existingName) {
      toast.info("Your attendance has been recorded!");
      setShowDuplicateModal(true);
      return;
    }

    setStep(2);
  };

  const compressImage = (
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
    quality: number = 0.7
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: {
    target: { files?: FileList | null };
  }) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        toast.error(
          "File is too large. Please upload an image smaller than 10MB."
        );
        return;
      }

      setReceipt(file);

      try {
        // Compress image if it's an image file
        if (file.type.startsWith("image/")) {
          const compressedDataUrl = await compressImage(file);
          setReceiptPreview(compressedDataUrl);
        } else {
          // For PDFs, just read as data URL
          const reader = new FileReader();
          reader.onloadend = () => {
            setReceiptPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Error processing file. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("handleSubmit called", {
      drinking,
      hasReceipt: !!receipt,
      name,
    });

    if (!drinking) {
      toast.error("Please select a drinking preference");
      return;
    }

    if (!isPaymentExempt && !receipt) {
      toast.error("Please upload your payment receipt");
      return;
    }

    // Convert receipt file to data URL (base64)
    const receiptDataUrl = isPaymentExempt ? "" : receiptPreview; // Already converted in handleFileChange

    try {
      console.log("Submitting RSVP...", {
        name: name.trim(),
        drinks: drinking,
        hasReceipt: !!receiptDataUrl,
      });

      // Send RSVP to backend
      const response = await fetch(`${API_URL}/api/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          drinks: drinking,
          paymentReceiptUrl: receiptDataUrl,
        }),
      });

      console.log("Response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        console.error("Response error:", errorData);
        toast.error(
          `Failed to submit RSVP: ${errorData.message || response.statusText}`
        );
        return;
      }

      const data = await response.json();
      console.log("RSVP submitted successfully:", data);

      // Update local state with the RSVP data from backend
      onSubmit({
        id: data._id || data.id,
        name: data.name,
        drinks: data.drinks,
        paymentReceiptUrl: data.paymentReceiptUrl,
      });

      // Show success modal
      setShowSuccess(true);
    } catch (err) {
      console.error("Error submitting RSVP:", err);
      toast.error(
        `Failed to submit RSVP: ${
          err instanceof Error ? err.message : "Network error"
        }`
      );
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);

    // Reset form
    setStep(1);
    setName("");
    setDrinking("");
    setReceipt(null);
    setReceiptPreview("");
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleDrinkingSelect = (value: string, emoji: string) => {
    setDrinking(value);

    // Trigger emoji spam for 0.2s like iMessage effects
    const duration = 200;
    const end = Date.now() + duration;
    const container = document.body;

    const createEmoji = () => {
      const emojiEl = document.createElement("div");
      emojiEl.textContent = emoji;
      emojiEl.style.position = "fixed";
      emojiEl.style.fontSize = `${Math.random() * 40 + 40}px`;
      emojiEl.style.left = `${Math.random() * 100}%`;
      emojiEl.style.top = `${Math.random() * 100}%`;
      emojiEl.style.pointerEvents = "none";
      emojiEl.style.zIndex = "9999";
      emojiEl.style.animation = "emojiFloat 1s ease-out forwards";

      container.appendChild(emojiEl);

      setTimeout(() => {
        emojiEl.remove();
      }, 1000);
    };

    // Add CSS animation if not already added
    if (!document.getElementById("emoji-animation-style")) {
      const style = document.createElement("style");
      style.id = "emoji-animation-style";
      style.textContent = `
        @keyframes emojiFloat {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          10% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(1.5) rotate(${
              Math.random() > 0.5 ? "" : "-"
            }360deg) translateY(-100px);
          }
        }
      `;
      document.head.appendChild(style);
    }

    const interval = setInterval(() => {
      createEmoji();
      createEmoji();
      createEmoji();

      if (Date.now() >= end) {
        clearInterval(interval);
      }
    }, 20);
  };

  const handleCloseDuplicateModal = () => {
    setShowDuplicateModal(false);
    setName("");
  };

  return (
    <>
      {showPropsRain && (
        <PropsRain
          duration={3000}
          onComplete={() => setShowPropsRain(false)}
        />
      )}
      {showSuccess && <SuccessModal onClose={handleCloseSuccess} />}
      {showDuplicateModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-pointer"
          onClick={(e: any) => {
            if (e.target === e.currentTarget) {
              handleCloseDuplicateModal();
            }
          }}
        >
          <Card 
            className="bg-gradient-to-br from-purple-600 to-purple-800 border-4 border-white shadow-2xl max-w-md w-full relative animate-in zoom-in duration-500 cursor-default"
            onClick={(e: any) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={(e: any) => {
                e.stopPropagation();
                handleCloseDuplicateModal();
              }}
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>

            <CardContent className="pt-12 pb-8 text-center">
              <div className="text-6xl mb-6">✅</div>
              
              <h2 className="text-white text-3xl mb-4 tracking-wide" style={{ fontFamily: 'Special Gothic Expanded One, sans-serif', fontWeight: 400, fontStyle: 'normal' }}>
                Your attendance has been recorded!
              </h2>
              
              <p className="text-purple-100 text-sm mb-6" style={{ fontFamily: 'Special Gothic Expanded One, sans-serif', fontWeight: 100, fontStyle: 'normal' }}>
                You're already on the guest list! 🎉
              </p>

              <Button
                onClick={handleCloseDuplicateModal}
                className="w-full bg-white text-purple-700 hover:bg-purple-50 border-2 border-purple-300 shadow-lg"
              >
                <p style={{ fontFamily: 'Special Gothic Expanded One, sans-serif', fontWeight: 100, fontStyle: 'normal' }}>
                  Close
                </p>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Card
        className="grid gap-4 p-2 rounded-lg "
        style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
      >
        <CardHeader>
          <CardTitle
            className="text-gray-800 text-xl tracking-wide"
            style={{
              fontFamily: "Special Gothic Expanded One, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
            }}
          >
            {step === 1 ? "RSVP - STEP 1 OF 2" : "RSVP - STEP 2 OF 2"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-gray-800 mb-2"
                  style={{
                    fontFamily: "Special Gothic Expanded One, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                  }}
                >
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="border-2 border-gray-300 focus:border-purple-500"
                  style={{
                    fontFamily: "Special Gothic Expanded One, sans-serif",
                    fontWeight: 100,
                    fontStyle: "normal",
                  }}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isCheckingName}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white  shadow-lg tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <p
                  className="mt-2 text-purple-100"
                  style={{
                    fontFamily: "Special Gothic Expanded One, sans-serif",
                    fontWeight: 100,
                    fontStyle: "normal",
                  }}
                >
                  {isCheckingName ? "CHECKING..." : "NEXT"}
                </p>
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                className="mb-2 -mt-2 text-gray-700 hover:bg-white hover:text-black transition-colors duration-300"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                <p
                  style={{
                    fontFamily: "Special Gothic Expanded One, sans-serif",
                    fontWeight: 100,
                    fontStyle: "normal",
                  }}
                >
                  Back
                </p>
              </Button>

              {!isPaymentExempt ? (
                <div className="text-center">
                  <Label
                    className="text-gray-800 mb-3 block text-sm tracking-wide"
                    style={{
                      fontFamily: "Special Gothic Expanded One, sans-serif",
                      fontWeight: 100,
                      fontStyle: "normal",
                    }}
                  >
                    QR CODE
                  </Label>
                  <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-4 rounded-lg inline-block shadow-lg">
                    <ImageWithFallback
                      src={qrImage}
                      alt="Payment QR Code"
                      className="w-48 h-80"
                    />
                  </div>
                  <p
                    className="text-purple-700 mt-3 text-xl tracking-wide"
                    style={{
                      fontFamily: "Special Gothic Expanded One, sans-serif",
                      fontWeight: 100,
                      fontStyle: "normal",
                    }}
                  >
                    RM15
                  </p>
                  <p style={{ fontSize: "10px" }}>
                    Need financial assistance? Contact Chrislyn — she doesn’t
                    want you to miss out hahaha.
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-white/80 to-purple-100/60 border border-purple-200 p-4 rounded-lg text-center shadow-inner">
                  <p
                    className="text-lg text-purple-800 tracking-wide"
                    style={{
                      fontFamily: "Special Gothic Expanded One, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                  >
                    🎉 You’re on the house!
                  </p>
                  <p
                    className="text-gray-700 text-sm mt-2"
                    style={{
                      fontFamily: "Special Gothic Expanded One, sans-serif",
                      fontWeight: 100,
                      fontStyle: "normal",
                    }}
                  >
                    No payment needed for you — just finish the form and you’re
                    in.
                  </p>
                </div>
              )}

              <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-lg  justify-center items-center">
                <Label
                  className="text-gray-800 mb-3 text-md tracking-wide items-center justify-center"
                  style={{
                    fontFamily: "Special Gothic Expanded One, sans-serif",
                    fontWeight: 100,
                    fontStyle: "normal",
                  }}
                >
                  ARE YOU DRINKING? 🍹
                </Label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleDrinkingSelect("absolutely", "🎉")}
                    className={`w-full flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      drinking === "absolutely"
                        ? "bg-purple-600 border-purple-800 text-white"
                        : "bg-white border-gray-300 text-gray-800 hover:border-purple-400"
                    }`}
                  >
                    <span
                      className="text-lg"
                      style={{
                        fontFamily: "Special Gothic Expanded One, sans-serif",
                        fontWeight: 100,
                        fontStyle: "normal",
                      }}
                    >
                      Absolutely! 🎉
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDrinkingSelect("maybe", "🤔")}
                    className={`w-full flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      drinking === "maybe"
                        ? "bg-purple-600 border-purple-800 text-white"
                        : "bg-white border-gray-300 text-gray-800 hover:border-purple-400"
                    }`}
                  >
                    <span
                      className="text-lg"
                      style={{
                        fontFamily: "Special Gothic Expanded One, sans-serif",
                        fontWeight: 100,
                        fontStyle: "normal",
                      }}
                    >
                      Maybe 🤔
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDrinkingSelect("no", "🚫")}
                    className={`w-full flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      drinking === "no"
                        ? "bg-purple-600 border-purple-800 text-white"
                        : "bg-white border-gray-300 text-gray-800 hover:border-purple-400"
                    }`}
                  >
                    <span
                      className="text-lg"
                      style={{
                        fontFamily: "Special Gothic Expanded One, sans-serif",
                        fontWeight: 100,
                        fontStyle: "normal",
                      }}
                    >
                      No 🚫
                    </span>
                  </button>
                </div>
              </div>

              {!isPaymentExempt && (
                <div>
                  <Label
                    htmlFor="receipt"
                    className="text-gray-800"
                    style={{
                      fontFamily: "Special Gothic Expanded One, sans-serif",
                      fontWeight: 100,
                      fontStyle: "normal",
                    }}
                  >
                    Upload Payment Receipt *
                  </Label>
                  <div className="mt-2">
                    <label
                      htmlFor="receipt"
                      className="flex flex-col items-center justify-center w-full h-32 border-4 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gradient-to-br from-gray-50 to-purple-50 hover:border-purple-400 hover:bg-purple-100 transition-colors"
                    >
                      {receiptPreview ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={receiptPreview}
                            alt="Receipt preview"
                            className="h-20 object-contain"
                          />
                          <p className="text-gray-700 mt-1">{receipt?.name}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6 text-purple-600 mb-2" />
                          <p
                            className="text-gray-700"
                            style={{
                              fontFamily:
                                "Special Gothic Expanded One, sans-serif",
                              fontWeight: 100,
                              fontStyle: "normal",
                            }}
                          >
                            Click to upload receipt
                          </p>
                          <p
                            className="text-gray-500"
                            style={{
                              fontFamily:
                                "Special Gothic Expanded One, sans-serif",
                              fontWeight: 100,
                              fontStyle: "normal",
                            }}
                          >
                            PNG, JPG, PDF (MAX. 10MB)
                          </p>
                        </div>
                      )}
                      <input
                        id="receipt"
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        required={!isPaymentExempt}
                      />
                    </label>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                onClick={() => console.log("Submit button clicked!")}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white  shadow-lg tracking-wide"
              >
                <p
                  style={{
                    fontFamily: "Special Gothic Expanded One, sans-serif",
                    fontWeight: 100,
                    fontStyle: "normal",
                  }}
                >
                  SUBMIT RSVP ✨
                </p>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </>
  );
}
