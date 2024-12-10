'use client';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/data/messages.json"
import { Mail } from "lucide-react";

export default function Home() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center w-full bg-gray-800 text-white h-[90vh]">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Anonymous Message - Where your identity remains a secret.
          </p>
        </section>
        <Carousel plugins={[Autoplay({ delay: 2000, }),]} className="w-full max-w-lg md:max-w-xl p-2">
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="">
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p className="text-sm md:text-base">{message.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </main>
    </>
  );
}