import React, { useState, useEffect } from "react";
import { PartyDetails } from "./components/PartyDetails";
import { RsvpForm } from "./components/RsvpForm";
import { Toaster } from "sonner";
import { API_URL } from "./config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import discReader from "./assets/disc-reader.svg";
import disc from "./assets/disc.svg";

export interface Rsvp {
  id: string;
  name: string;
  drinks: string;
  paymentReceiptUrl: string;
}

export default function App() {
  const [rsvps, setRsvps] = useState([] as Rsvp[]);

  // Fetch RSVPs from API on component mount
  useEffect(() => {
    fetch(`${API_URL}/api/rsvp`)
      .then((res) => res.json())
      .then((data) => {
        // Map backend data to Rsvp interface (convert _id to id)
        const mappedRsvps: Rsvp[] = data.map((rsvp: any) => ({
          id: rsvp._id || rsvp.id,
          name: rsvp.name,
          drinks: rsvp.drinks,
          paymentReceiptUrl: rsvp.paymentReceiptUrl,
        }));
        setRsvps(mappedRsvps);
      })
      .catch((err) => console.error("Error fetching RSVPs:", err));
  }, []);

  const handleRsvp = (rsvpData: Rsvp) => {
    // Add new RSVP to state (it's already saved to backend via RsvpForm)
    setRsvps([...rsvps, rsvpData]);
  };

  // Count total attendees (each RSVP represents 1 attendee)
  const totalAttendees = rsvps.length;

  return (
    <>
      <Toaster position="top-center" />
      <div
        className="min-h-screen"
        style={{
          backgroundColor: "#ccb7db",
        }}
      >
        <div className="container mx-auto px-4 pb-6 max-w-2xl">
          <PartyDetails totalAttendees={totalAttendees} />

          <div className="mt-8">
            <Card
              className="rounded-lg"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            >
              <CardHeader>
                <CardTitle
                  className="text-gray-800 text-xl tracking-wide text-center"
                  style={{
                    fontFamily: "Special Gothic Expanded One, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                  }}
                >
                  ADD YR SONG TO PLAYLIST TO BE PLAYED THAT NIGHT
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-6">
                <div className="space-y-4">
                  {/* Disc Player with Rotating Disc */}
                  <div className="flex justify-center items-center">
                    <div className="relative w-64 h-64">
                      {/* Disc Reader */}
                      <img
                        src={discReader}
                        alt="Disc Reader"
                        width={300}
                        height={300}
                        className="w-34 h-34 relative z-10"
                      />
                     
                    </div>
                  </div>
                  
                  {/* Add to Playlist Button */}
                  <a
                    href="https://music.youtube.com/playlist?list=PLr9jCE779CjG9o5tPpKMhABlLdAbRBwTh&jct=vu0yyQZLVYtwY9a8ezIF1Q"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    <span className="text-2xl">🎵</span>
                    <span
                      className="text-lg tracking-wide"
                      style={{
                        fontFamily: "Special Gothic Expanded One, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                      }}
                    >
                      Open Playlist & Add Your Song
                    </span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <RsvpForm onSubmit={handleRsvp} existingRsvps={rsvps} />
          </div>

          <div className="mt-8">
            <Card
              className="rounded-lg"
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
                  FAQs
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="dress-code">
                    <AccordionTrigger
                      className="text-gray-800 text-left justify-center items-center"
                      style={{
                        fontFamily: "Special Gothic Expanded One, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        textAlign: "left",
                      }}
                    >
                      <span className="flex-1 text-left">
                        Must I wear following the dress code?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 mt-4">
                      While we'd love to see everyone in disco drip or retro
                      fit, it's not mandatory! Come as you are comfortable, but
                      we encourage you to embrace the theme if you can! ✨
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="public-transport">
                    <AccordionTrigger
                      className="text-gray-800 text-left  justify-center items-center"
                      style={{
                        fontFamily: "Special Gothic Expanded One, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        textAlign: "left",
                      }}
                    >
                      <span className="flex-1 text-left">
                        How to get there by public transport?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 mt-4">
                      Arte Cheras is accessible by public transport, but it does
                      require a bit of walking — about 15 minutes from MRT Taman
                      Midah (Kajang Line) or from nearby bus stops.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="boozer-policy">
                    <AccordionTrigger
                      className="flex text-gray-800  justify-end items-center"
                      style={{
                        fontFamily: "Special Gothic Expanded One, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        textAlign: "left",
                      }}
                    >
                      <span className="flex-1 text-left">Booze🍹</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 mt-4">
                      Booze will be provided for fellow alcohol lovers, but we
                      suggest bringing your own as well — sharing is caring! 🍻
                      Totally fine if you don’t, though — no worries at all!{" "}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
