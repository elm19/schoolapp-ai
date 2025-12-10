"use client"
import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CountdownTimer({finishDate}: {finishDate: Date}) {
//   const finishDate = new Date("2025-12-29T00:00:00");

  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalHours: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = finishDate.getTime() - now.getTime();

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalHours: 0,
        };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const totalHours = Math.floor(difference / (1000 * 60 * 60));

      return { days, hours, minutes, seconds, totalHours };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [finishDate]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <Clock className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="relative p-6 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200">
        <Button
          onClick={() => setIsVisible(false)}
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-indigo-100"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-3 pr-6">
          <h3 className="text-lg font-semibold text-indigo-900">
            Time Remaining
          </h3>

          <div className="flex gap-2 items-center">
            {timeLeft.totalHours >= 24 && (
              <div className="flex flex-col items-center bg-white rounded-lg px-3 py-2 shadow-sm min-w-[60px]">
                <span className="text-2xl font-bold text-indigo-600">
                  {timeLeft.days}
                </span>
                <span className="text-xs text-gray-600 uppercase tracking-wide">
                  {timeLeft.days === 1 ? "Day" : "Days"}
                </span>
              </div>
            )}

            <div className="flex flex-col items-center bg-white rounded-lg px-3 py-2 shadow-sm min-w-[60px]">
              <span className="text-2xl font-bold text-indigo-600">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className="text-xs text-gray-600 uppercase tracking-wide">
                Hours
              </span>
            </div>

            <div className="flex flex-col items-center bg-white rounded-lg px-3 py-2 shadow-sm min-w-[60px]">
              <span className="text-2xl font-bold text-indigo-600">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className="text-xs text-gray-600 uppercase tracking-wide">
                Minutes
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
