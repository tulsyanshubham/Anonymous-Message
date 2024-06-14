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
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-800 text-white h-[90vh]">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Anonymous Message - Where your identity remains a secret.
          </p>
        </section>
        <Carousel plugins={[Autoplay({ delay: 2000, }),]} className="w-full max-w-lg md:max-w-xl">
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="w-full flex items-center justify-center h-[10vh]">
        <span>© 2023 Anonymous Message. All rights reserved.</span>
      </footer>
    </>
  )
}
