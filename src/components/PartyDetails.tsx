import { Calendar, Clock, MapPin, Users } from "lucide-react";
import React from "react";
import DiscoFeverSvg from "../assets/DiscoFever.svg";
import Props1 from "../assets/props-1.svg";
import Props4 from "../assets/props-4.svg";
import Props3 from "../assets/props-3.svg";
import Props2 from "../assets/props-2.svg";

interface PartyDetailsProps {
  totalAttendees: number;
}

export function PartyDetails({ totalAttendees }: PartyDetailsProps) {
  return (
    <div className="relative">
      {/* Disco ball effect */}

      <div className="text-center pb-4 relative z-10">
        <div className="mb-4 animate-pulse flex justify-center">
          <img src={DiscoFeverSvg} alt="Disco Fever" className="w-120 h-120" />
        </div>

        <p
          className="text-black mt-3 text-2xl tracking-wide"
          style={{ fontFamily: "Pinyon Script, cursive" }}
        >
          Chrislyn's 21st Birthday Bash
        </p>
        <p
          className="mt-2 text-purple-100"
          style={{
            fontFamily: "Special Gothic Expanded One, sans-serif",
            fontWeight: 100,
            fontStyle: "normal",
          }}
        >
          You are invited to the party!✨
        </p>
      </div>
      <div className="relative z-10">
        <div
          className="grid sm:grid-cols-2 gap-4  p-6 rounded-lg "
          style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
        >
          <div className="flex items-start gap-3">
            <img src={Props1} alt="Disco Fever" className="w-10 h-10" />
            <div>
              <p
                className="text-white"
                style={{
                  fontFamily: "Special Gothic Expanded One, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                }}
              >
                Date
              </p>
              <p
                className="text-black"
                style={{
                  fontFamily: "Special Gothic Expanded One, sans-serif",
                  fontWeight: 100,
                  fontStyle: "normal",
                }}
              >
                Friday Night, November 28, 2025
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <img src={Props4} alt="Disco Fever" className="w-10 h-10" />
            <div>
              <p
                className="text-white"
                style={{
                  fontFamily: "Special Gothic Expanded One, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                }}
              >
                Time
              </p>
              <p
                className="text-black"
                style={{
                  fontFamily: "Special Gothic Expanded One, sans-serif",
                  fontWeight: 100,
                  fontStyle: "normal",
                }}
              >
                8:00 PM till late
              </p>
            </div>
          </div>

          <div className="w-full items-center justify-center">
            <div className="flex items-start gap-3">
              <img src={Props3} alt="Disco Fever" className="w-10 h-10" />
              <div>
                <p
                  className="text-white"
                  style={{
                    fontFamily: "Special Gothic Expanded One, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                  }}
                >
                  Location
                </p>
                <p
                  className="text-black"
                  style={{
                    fontFamily: "Special Gothic Expanded One, sans-serif",
                    fontWeight: 100,
                    fontStyle: "normal",
                  }}
                >
                  Arte Cheras
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <img src={Props2} alt="Disco Fever" className="w-10 h-10" />
            <div>
              <p
                className="text-white"
                style={{
                  fontFamily: "Special Gothic Expanded One, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                }}
              >
                Dress Code
              </p>
              <p
                className="text-black"
                style={{
                  fontFamily: "Special Gothic Expanded One, sans-serif",
                  fontWeight: 100,
                  fontStyle: "normal",
                }}
              >
                DRESS CODE: DISCO DRIP OR RETRO FIT{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
